from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Quiz, Result
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc
from sqlalchemy.orm.attributes import flag_modified
from datetime import datetime

gamification_bp = Blueprint('gamification', __name__)

@gamification_bp.route('/quizzes', methods=['GET'])
@jwt_required()
def get_quizzes():
    quizzes = Quiz.query.all()
    # Serialize and hide correct answers
    result = []
    for q in quizzes:
        questions = q.questions
        # If questions is a list of dicts, map over it. 
        # Note: SQLAlchemy JSONB returns python list/dict.
        sanitized_questions = []
        for question in questions:
            sanitized_questions.append({
                'id': question['id'],
                'text': question['text'],
                'options': question['options']
            })
            
        result.append({
            'id': q.id,
            'title': q.title,
            'description': q.description,
            'timeLimit': q.time_limit,
            'points_reward': q.points_reward,
            'questions': sanitized_questions
        })
    return jsonify(result)

@gamification_bp.route('/quizzes/<quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    # Hide correct answers
    sanitized_questions = []
    for question in quiz.questions:
        sanitized_questions.append({
            'id': question['id'],
            'text': question['text'],
            'options': question['options']
        })
    
    return jsonify({
        'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'timeLimit': quiz.time_limit,
        'points_reward': quiz.points_reward,
        'questions': sanitized_questions
    })

@gamification_bp.route('/quizzes/<quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    quiz = Quiz.query.get(quiz_id)
    
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    data = request.get_json()
    answers = data.get('answers', {})  # { questionId: selectedOptionId }
    
    # Calculate score
    correct_count = 0
    for question in quiz.questions:
        q_id = question['id']
        correct_opt = question['correctOptionId']
        user_opt = answers.get(q_id)
        if user_opt == correct_opt:
            correct_count += 1
    
    # Award points
    total_questions = len(quiz.questions)
    if correct_count == total_questions:
        points_awarded = quiz.points_reward
    else:
        points_awarded = int((correct_count / total_questions) * quiz.points_reward)
    
    # Update user gamification data
    user.gamification['points'] = user.gamification.get('points', 0) + points_awarded
    
    # Award badge if 100% correct
    if correct_count == total_questions and quiz_id not in user.gamification.get('badges', []):
        user.gamification.setdefault('badges', []).append(quiz_id)
        
    # CRITICAL: Mark field as modified so SQLAlchemy persists the change
    flag_modified(user, 'gamification')
    
    # Update or Create Progress Record
    from models import UserProgress
    progress = UserProgress.query.filter_by(user_id=current_user_id, quiz_id=quiz_id).first()
    if not progress:
        progress = UserProgress(user_id=current_user_id, quiz_id=quiz_id)
        db.session.add(progress)
    
    progress.status = 'completed'
    db.session.commit()
    
    # Save result
    result = Result(
        user_id=current_user_id,
        quiz_id=quiz_id,
        score=points_awarded,
        correct_count=correct_count,
        total_questions=total_questions
    )
    db.session.add(result)
    db.session.commit()
    
    # Prepare detailed feedback
    feedback = []
    for question in quiz.questions:
        q_id = question['id']
        correct_opt = question['correctOptionId']
        user_opt = answers.get(q_id)
        is_correct = (user_opt == correct_opt)
        
        # Find option texts
        user_opt_text = next((o['text'] for o in question['options'] if o['id'] == user_opt), "No Answer")
        correct_opt_text = next((o['text'] for o in question['options'] if o['id'] == correct_opt), "Unknown")

        feedback.append({
            'questionId': q_id,
            'questionText': question['text'],
            'userOptionId': user_opt,
            'userOptionText': user_opt_text,
            'correctOptionId': correct_opt,
            'correctOptionText': correct_opt_text,
            'isCorrect': is_correct,
            'explanation': question.get('explanation', 'No explanation provided.')
        })

    return jsonify({
        'message': 'Quiz submitted',
        'score': points_awarded,
        'correctCount': correct_count,
        'totalQuestions': len(quiz.questions),
        'badges': user.gamification['badges'],
        'feedback': feedback
    })

@gamification_bp.route('/progress/start', methods=['POST'])
@jwt_required()
def start_quiz_progress():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    quiz_id = data.get('quizId')
    current_index = data.get('currentQuestionIndex', 0)
    
    if not quiz_id:
        return jsonify({'error': 'Quiz ID required'}), 400
        
    from models import UserProgress
    progress = UserProgress.query.filter_by(user_id=current_user_id, quiz_id=quiz_id).first()
    
    if not progress:
        progress = UserProgress(
            user_id=current_user_id, 
            quiz_id=quiz_id, 
            status='started',
            current_question_index=current_index
        )
        db.session.add(progress)
        db.session.commit()
    elif progress.status == 'completed':
        progress.last_activity = datetime.utcnow()
        progress.current_question_index = current_index
        db.session.commit()
    else:
        progress.status = 'in-progress'
        progress.current_question_index = current_index
        progress.last_activity = datetime.utcnow()
        db.session.commit()
        
    return jsonify({'message': 'Progress updated', 'status': progress.status, 'currentIndex': progress.current_question_index})

@gamification_bp.route('/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    users = User.query.all()
    leaderboard = []
    for user in users:
        from uuid import UUID
        gamification = user.gamification or {}
        points = gamification.get('points', 0)
        
        # Robustness: If points are 0, check results table just in case
        if points == 0:
            from sqlalchemy import func
            res_sum = db.session.query(func.sum(Result.score)).filter(Result.user_id == user.id).scalar() or 0
            points = int(res_sum)
            
        leaderboard.append({
            'email': user.email,
            'name': user.name,
            'points': points if points > 0 else gamification.get('points', 0),
            'badges': len(gamification.get('badges', []))
        })
    
    # Sort by points descending
    leaderboard.sort(key=lambda x: x['points'], reverse=True)
    
    # Return top 10
    return jsonify(leaderboard[:10])

@gamification_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_user_progress():
    """Get detailed progress data for the current user"""
    from uuid import UUID
    identity = get_jwt_identity()
    try:
        current_user_id = UUID(str(identity)) if not isinstance(identity, UUID) else identity
    except:
        current_user_id = identity

    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get all quizzes
    all_quizzes = Quiz.query.all()
    total_quizzes = len(all_quizzes)
    
    # Get user's results
    user_results = Result.query.filter_by(user_id=current_user_id).all()
    completed_quiz_ids = set(result.quiz_id for result in user_results)
    
    # Sync: If user has badges in JSON but no result record, consider it completed for percentage
    gamification = user.gamification or {}
    badge_ids = gamification.get('badges', [])
    for bid in badge_ids:
        completed_quiz_ids.add(bid)
        
    completed_count = len(completed_quiz_ids)
    
    # Get "In Progress" quizzes
    from models import UserProgress
    progress_records = UserProgress.query.filter_by(user_id=current_user_id).all()
    in_progress_list = []
    
    for record in progress_records:
        if record.status in ['started', 'in-progress']:
            # Verify quiz exists
            quiz = Quiz.query.get(record.quiz_id)
            if quiz:
                in_progress_list.append({
                    'quizId': quiz.id,
                    'quizTitle': quiz.title,
                    'status': record.status,
                    'currentIndex': record.current_question_index,
                    'totalQuestions': len(quiz.questions),
                    'lastActivity': record.last_activity.isoformat() if record.last_activity else None
                })
    
    # Sort by last activity to show most recent first
    in_progress_list.sort(key=lambda x: x['lastActivity'] or '', reverse=True)
    
    # Limit to 4 most recent items for UI balance
    in_progress_list = in_progress_list[:4]
    
    # Calculate average score
    if user_results:
        total_score = sum(result.score for result in user_results)
        avg_score = total_score / len(user_results)
    else:
        avg_score = 0
    
    # Calculate total time spent (estimate based on quiz completion)
    total_time_spent = len(user_results) * 180  # Rough estimate
    
    # Get recent activity (last 5 quizzes)
    recent_results = Result.query.filter_by(user_id=current_user_id)\
        .order_by(desc(Result.completed_at))\
        .limit(5).all()
    
    recent_activity = []
    for result in recent_results:
        quiz = Quiz.query.get(result.quiz_id)
        if quiz:
            recent_activity.append({
                'quizTitle': quiz.title,
                'score': result.score,
                'completedAt': result.completed_at.isoformat() if result.completed_at else None,
                'timeSpent': 180  # Placeholder
            })
    
    # Resolve Badges
    gamification = user.gamification or {}
    badge_ids = gamification.get('badges', [])
    earned_badges = []
    for bid in badge_ids:
        # Assuming badge ID corresponds to Quiz ID for now
        quiz = Quiz.query.get(bid)
        if quiz:
            earned_badges.append({
                'id': bid,
                'title': f"{quiz.title} Master", # Creative name
                'icon': 'award'
            })
        else:
             earned_badges.append({
                'id': bid,
                'title': f"Badge {bid}",
                'icon': 'star'
            })


    # Calculate total points (Robustly: Sum of all results)
    from sqlalchemy import func
    total_points_sum = db.session.query(func.sum(Result.score)).filter(Result.user_id == current_user_id).scalar() or 0
    total_points = int(total_points_sum)
    
    # Completion percentage
    completion_percentage = (completed_count / total_quizzes * 100) if total_quizzes > 0 else 0
    
    return jsonify({
        'totalQuizzes': total_quizzes,
        'completedQuizzes': completed_count,
        'completionPercentage': round(completion_percentage, 1),
        'averageScore': round(avg_score, 1),
        'totalTimeSpent': total_time_spent,
        'totalPoints': total_points if total_points > 0 else gamification.get('points', 0),
        'totalBadges': len(badge_ids),
        'earnedBadges': earned_badges, 
        'level': gamification.get('level', 1),
        'recentActivity': recent_activity,
        'inProgress': in_progress_list
    })

