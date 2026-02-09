import unittest
import os
import sys
import json
from datetime import datetime, timedelta

# Add parent directory to path to import app and extentions
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from extensions import db
from models import User
from werkzeug.security import generate_password_hash

class TestAuthSecurity(unittest.TestCase):
    
    def setUp(self):
        # Set test environment
        os.environ['FLASK_ENV'] = 'testing'
        os.environ['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        os.environ['JWT_SECRET_KEY'] = 'test-secret-key'
        
        self.app = create_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        db.create_all()
        
        # Create test admin user that needs password change
        self.admin_password = 'InitialPassword123!'
        self.admin = User(
            email='admin@test.com',
            password_hash=generate_password_hash(self.admin_password),
            role='admin',
            requires_password_change=True
        )
        db.session.add(self.admin)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def get_auth_headers(self, email=None, password=None):
        if not email:
            email = 'admin@test.com'
        if not password:
            password = self.admin_password
            
        response = self.client.post('/api/auth/login', json={
            'email': email,
            'password': password
        })
        token = response.json['token']
        return {'Authorization': f'Bearer {token}'}

    def test_login_returns_password_change_flag(self):
        """Test that login response includes requires_password_change flag"""
        response = self.client.post('/api/auth/login', json={
            'email': 'admin@test.com',
            'password': self.admin_password
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['user']['requires_password_change'])

    def test_admin_access_blocked_when_password_change_required(self):
        """Test that admin endpoints are blocked until password is changed"""
        headers = self.get_auth_headers()
        
        # Try to access admin users list
        response = self.client.get('/api/admin/users', headers=headers)
        
        self.assertEqual(response.status_code, 403)
        self.assertIn('Password change required', response.json['message'])

    def test_password_change_flow(self):
        """Test successful password change and subsequent access"""
        headers = self.get_auth_headers()
        
        new_password = 'NewStrongPassword123!'
        
        # Change password
        response = self.client.post('/api/auth/change-password', 
            headers=headers,
            json={
                'currentPassword': self.admin_password,
                'newPassword': new_password
            }
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Password changed successfully')
        
        # Verify user state in DB
        admin = User.query.filter_by(email='admin@test.com').first()
        self.assertFalse(admin.requires_password_change)
        self.assertIsNotNone(admin.last_password_change)
        
        # Login with new password
        login_response = self.client.post('/api/auth/login', json={
            'email': 'admin@test.com',
            'password': new_password
        })
        self.assertEqual(login_response.status_code, 200)
        new_token = login_response.json['token']
        new_headers = {'Authorization': f'Bearer {new_token}'}
        
        # Verify admin access is now allowed
        access_response = self.client.get('/api/admin/users', headers=new_headers)
        self.assertEqual(access_response.status_code, 200)

    def test_weak_password_change_rejected(self):
        """Test that weak passwords are rejected during change"""
        headers = self.get_auth_headers()
        
        # Try weak password
        response = self.client.post('/api/auth/change-password', 
            headers=headers,
            json={
                'currentPassword': self.admin_password,
                'newPassword': 'weak'
            }
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('Password does not meet security requirements', response.json['message'])

if __name__ == '__main__':
    unittest.main()
