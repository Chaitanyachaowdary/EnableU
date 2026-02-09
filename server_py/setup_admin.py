"""
Setup Primary Admin Account
Creates the initial admin user for EnableU platform
Credentials are loaded from environment variables for security.
"""

import os
import sys
from dotenv import load_dotenv
from app import create_app
from extensions import db
from models import User
from werkzeug.security import generate_password_hash
from datetime import datetime

# Load environment variables
load_dotenv()

def validate_env_vars():
    """Validate that required environment variables are set"""
    required_vars = ['ADMIN_EMAIL', 'ADMIN_PASSWORD']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"\n❌ ERROR: Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print(f"\n📝 Please create a .env file in the server_py directory with:")
        print(f"   ADMIN_EMAIL=your-admin@email.com")
        print(f"   ADMIN_PASSWORD=YourSecurePassword123!")
        print(f"\n💡 You can copy .env.example to .env and update the values.\n")
        sys.exit(1)

def setup_admin():
    # Validate environment variables first
    validate_env_vars()
    
    app = create_app()
    
    with app.app_context():
        admin_email = os.getenv('ADMIN_EMAIL')
        admin_password = os.getenv('ADMIN_PASSWORD')
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if existing_admin:
            print(f"✅ Admin account already exists: {admin_email}")
            print(f"   Updating role to 'admin' and resetting password...")
            existing_admin.role = 'admin'
            existing_admin.password_hash = generate_password_hash(admin_password)
            existing_admin.requires_password_change = True  # Force password change
            existing_admin.last_password_change = None
            db.session.commit()
            print(f"✅ Admin account updated successfully!")
            print(f"⚠️  Password change will be required on next login.")
        else:
            print(f"Creating new admin account...")
            admin_user = User(
                email=admin_email,
                password_hash=generate_password_hash(admin_password),
                role='admin',
                is_verified=True,
                requires_password_change=True,  # Force password change on first login
                last_password_change=None
            )
            
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Admin account created successfully!")
            print(f"⚠️  Password change will be required on first login.")
        
        print(f"\n{'='*60}")
        print(f"Primary Admin Account Details:")
        print(f"{'='*60}")
        print(f"Email:    {admin_email}")
        print(f"Password: {admin_password}")
        print(f"Role:     admin")
        print(f"{'='*60}")
        print(f"\n⚠️  IMPORTANT:")
        print(f"   - Only this account has admin privileges initially")
        print(f"   - You will be forced to change password on first login")
        print(f"   - Use this account to add other admins via Admin Panel")
        print(f"   - Keep these credentials secure!")
        print(f"\n🔐 Login at: http://localhost:5173/login")

if __name__ == '__main__':
    setup_admin()

