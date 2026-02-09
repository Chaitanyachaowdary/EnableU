from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Quiz, AuditLog
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

# Helper function to log admin activities
def log_admin_activity(action, details, user_id=None):
    """Log admin activity to audit trail"""
    try:
        if user_id is None:
            user_id = get_jwt_identity()
        
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent', '')[:256]
        
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as e:
        print(f"Failed to log admin activity: {e}")
        # Don't fail the main operation if logging fails
        db.session.rollback()

# Custom Decorator for Admin Access
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            log_admin_activity('UNAUTHORIZED_ACCESS_ATTEMPT', 
                             f'User {user_id} attempted to access admin endpoint', 
                             user_id)
            return jsonify({'message': 'Admins only!'}), 403
        
        # Check if password change is required
        if user.requires_password_change:
            return jsonify({
                'message': 'Password change required',
                'error': 'Please change your password before accessing admin features',
                'requires_password_change': True
            }), 403
        
        return fn(*args, **kwargs)
    return wrapper

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    log_admin_activity('VIEW_USERS', f'Viewed {len(users)} users')
    
    return jsonify([{
        'id': str(u.id),
        'email': u.email,
        'role': u.role,
        'name': u.name,
        'gamification': u.gamification,
        'created_at': u.created_at.isoformat() if u.created_at else None
    } for u in users])

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'student')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400

    if role not in ['student', 'teacher', 'admin']:
        return jsonify({'message': 'Invalid role'}), 400

    from werkzeug.security import generate_password_hash
    hashed_password = generate_password_hash(password)
    
    new_user = User(
        email=email, 
        name=name, 
        password_hash=hashed_password,
        role=role
    )
    
    db.session.add(new_user)
    db.session.commit()

    log_admin_activity('CREATE_USER', f'Created new {role}: {email}')
    
    return jsonify({
        'message': 'User created successfully',
        'user': {
            'id': str(new_user.id),
            'email': new_user.email,
            'name': new_user.name,
            'role': new_user.role
        }
    }), 201

@admin_bp.route('/users/<user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    data = request.get_json()
    new_role = data.get('role')
    old_role = user.role
    
    if new_role not in ['student', 'admin', 'teacher']:
        return jsonify({'message': 'Invalid role'}), 400
        
    user.role = new_role
    db.session.commit()
    
    log_admin_activity('UPDATE_USER_ROLE', 
                      f'Changed user {user.email} role from {old_role} to {new_role}')
    
    return jsonify({'message': 'User role updated', 'role': user.role})

@admin_bp.route('/quizzes', methods=['POST'])
@admin_required
def create_quiz():
    data = request.get_json()
    
    # Generate unique ID if not provided
    import uuid
    quiz_id = data.get('id') or str(uuid.uuid4())
    
    # Basic validation
    if not data.get('title') or not data.get('questions'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    if Quiz.query.get(quiz_id):
        return jsonify({'message': 'Quiz ID already exists'}), 400

    new_quiz = Quiz(
        id=quiz_id,
        title=data['title'],
        description=data.get('description', ''),
        time_limit=data.get('time_limit', 600),
        points_reward=data.get('points_reward', 50),
        questions=data['questions']
    )
    
    db.session.add(new_quiz)
    db.session.commit()
    
    log_admin_activity('CREATE_QUIZ', 
                      f'Created quiz "{new_quiz.title}" with {len(data["questions"])} questions')
    
    return jsonify({'message': 'Quiz created successfully', 'id': new_quiz.id}), 201

@admin_bp.route('/quizzes/<quiz_id>', methods=['DELETE'])
@admin_required
def delete_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'message': 'Quiz not found'}), 404
    
    quiz_title = quiz.title
    db.session.delete(quiz)
    db.session.commit()
    
    log_admin_activity('DELETE_QUIZ', f'Deleted quiz "{quiz_title}" (ID: {quiz_id})')
    
    return jsonify({'message': 'Quiz deleted'})

@admin_bp.route('/audit-log', methods=['POST'])
@admin_required
def create_audit_log():
    """Endpoint for frontend to log admin activities"""
    data = request.get_json()
    action = data.get('action')
    details = data.get('details')
    
    if not action:
        return jsonify({'message': 'Action is required'}), 400
    
    log_admin_activity(action, details)
    return jsonify({'message': 'Activity logged'}), 201

@admin_bp.route('/audit-log', methods=['GET'])
@admin_required
def get_audit_logs():
    """Get audit logs with optional filtering"""
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    
    # Filters
    action_filter = request.args.get('action')
    user_id_filter = request.args.get('user_id')
    
    query = AuditLog.query
    
    if action_filter:
        query = query.filter(AuditLog.action.like(f'%{action_filter}%'))
    if user_id_filter:
        query = query.filter(AuditLog.user_id == user_id_filter)
    
    # Order by most recent first
    query = query.order_by(AuditLog.timestamp.desc())
    
    # Paginate
    logs = query.paginate(page=page, per_page=per_page, error_out=False)
    
    log_admin_activity('VIEW_AUDIT_LOGS', f'Viewed audit logs (page {page})')
    
    return jsonify({
        'logs': [log.to_dict() for log in logs.items],
        'total': logs.total,
        'page': page,
        'per_page': per_page,
        'pages': logs.pages
    })

@admin_bp.route('/analytics', methods=['GET'])
@admin_required
def get_analytics():
    """Get platform analytics"""
    from sqlalchemy import func
    
    total_users = User.query.count()
    total_quizzes = Quiz.query.count()
    
    # Count active users (users with points > 0)
    active_users = User.query.filter(
        User.gamification['points'].astext.cast(db.Integer) > 0
    ).count()
    
    # Get role distribution
    role_distribution = db.session.query(
        User.role,
        func.count(User.id)
    ).group_by(User.role).all()
    
    # Recent activity count
    from datetime import timedelta
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    
    recent_admin_actions = AuditLog.query.filter(
        AuditLog.timestamp >= week_ago
    ).count()
    
    log_admin_activity('VIEW_ANALYTICS', 'Viewed platform analytics')
    
    return jsonify({
        'total_users': total_users,
        'total_quizzes': total_quizzes,
        'active_users': active_users,
        'role_distribution': {role: count for role, count in role_distribution},
        'recent_admin_actions': recent_admin_actions
    })
