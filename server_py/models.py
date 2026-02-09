from extensions import db
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID, JSONB

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='student')
    is_verified = db.Column(db.Boolean, default=False)
    
    # JSONB for flexible settings and gamification stats
    accessibility_settings = db.Column(JSONB, default=lambda: {'highContrast': False, 'reduceMotion': False})
    gamification = db.Column(JSONB, default=lambda: {'points': 0, 'badges': [], 'streak': 0})
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Password Reset
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)

class Quiz(db.Model):
    __tablename__ = 'quizzes'

    id = db.Column(db.String(50), primary_key=True) # using string IDs to match frontend hardcoding for now
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    time_limit = db.Column(db.Integer) # in seconds
    points_reward = db.Column(db.Integer, default=50)
    
    # Storing questions as JSON to avoid complex relational overhead for this MVP
    questions = db.Column(JSONB, nullable=False) 

class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.String(50), db.ForeignKey('quizzes.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    correct_count = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('results', lazy=True))
    quiz = db.relationship('Quiz', backref=db.backref('results', lazy=True))

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='todo') # todo, in-progress, done
    priority = db.Column(db.String(20), default='medium')
    type = db.Column(db.String(20), default='development')
    
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True) # Optional for now as tasks were global in legacy
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)  # LOGIN, LOGOUT, CREATE_QUIZ, DELETE_QUIZ, UPDATE_USER_ROLE, etc.
    details = db.Column(db.Text)  # Additional context about the action
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(256))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    user = db.relationship('User', backref=db.backref('audit_logs', lazy=True))

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'user_email': self.user.email if self.user else None,
            'action': self.action,
            'details': self.details,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
