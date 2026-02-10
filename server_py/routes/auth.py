from flask import Blueprint, request, jsonify
from extensions import db
from models import User, AuditLog
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from utils.security import validate_password_strength
import datetime
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400

    # Validate password strength
    validation = validate_password_strength(password)
    if not validation['valid']:
        return jsonify({
            'message': 'Password does not meet security requirements',
            'errors': validation['errors']
        }), 400

    hashed_password = generate_password_hash(password)
    name = data.get('name')
    new_user = User(email=email, name=name, password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(days=1))
    
    # Log admin login
    if user.role == 'admin':
        try:
            log_entry = AuditLog(
                user_id=user.id,
                action='LOGIN',
                details=f'Admin {user.email} logged in',
                ip_address=request.remote_addr,
                user_agent=request.headers.get('User-Agent', '')[:256]
            )
            db.session.add(log_entry)
            db.session.commit()
        except Exception as e:
            print(f"Failed to log admin login: {e}")
            db.session.rollback()
    
    # Return user data along with token to match frontend expectation
    return jsonify({
        'token': access_token,
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'gamification': user.gamification,
            'settings': user.accessibility_settings,
            'requires_password_change': user.requires_password_change or False
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({
        'id': str(user.id),
        'email': user.email,
        'name': user.name,
        'role': user.role,
        'gamification': user.gamification,
        'settings': user.accessibility_settings,
        'requires_password_change': user.requires_password_change or False
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        reset_token = str(uuid.uuid4())
        # Set expiration to 1 hour from now
        expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        
        user.reset_token = reset_token
        user.reset_token_expires = expires
        db.session.commit()
        
        # Simulating email sending
        print(f"[SIMULATION] Password reset token for {email}: {reset_token}")
        
    return jsonify({'message': 'If that email exists, a reset link has been sent.'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('newPassword')
    
    if not token or not new_password:
        return jsonify({'message': 'Token and new password are required'}), 400
        
    user = User.query.filter_by(reset_token=token).first()
    
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.datetime.utcnow():
        return jsonify({'message': 'Invalid or expired token'}), 400
        
    # Validate password strength
    validation = validate_password_strength(new_password)
    if not validation['valid']:
        return jsonify({
            'message': 'Password does not meet security requirements',
            'errors': validation['errors']
        }), 400
        
    user.password_hash = generate_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.session.commit()
    
    return jsonify({'message': 'Password has been reset successfully.'}), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password with strength validation"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    if not current_password or not new_password:
        return jsonify({'message': 'Current password and new password are required'}), 400
    
    # Verify current password
    if not check_password_hash(user.password_hash, current_password):
        return jsonify({'message': 'Current password is incorrect'}), 401
    
    # Validate new password strength
    validation = validate_password_strength(new_password)
    if not validation['valid']:
        return jsonify({
            'message': 'Password does not meet security requirements',
            'errors': validation['errors']
        }), 400
    
    # Check if new password is same as current
    if check_password_hash(user.password_hash, new_password):
        return jsonify({'message': 'New password must be different from current password'}), 400
    
    # Update password
    user.password_hash = generate_password_hash(new_password)
    user.requires_password_change = False
    user.last_password_change = datetime.datetime.utcnow()
    db.session.commit()
    
    # Log password change
    if user.role == 'admin':
        try:
            log_entry = AuditLog(
                user_id=user.id,
                action='PASSWORD_CHANGE',
                details=f'Admin {user.email} changed their password',
                ip_address=request.remote_addr,
                user_agent=request.headers.get('User-Agent', '')[:256]
            )
            db.session.add(log_entry)
            db.session.commit()
        except Exception as e:
            print(f"Failed to log password change: {e}")
            db.session.rollback()
    
    return jsonify({
        'message': 'Password changed successfully',
        'requires_password_change': False
    }), 200
