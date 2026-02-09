"""
Setup Primary Admin Account
Creates the initial admin user for EnableU platform
Email: admin@Enable.com
Password: 12345678
"""

from app import create_app
from extensions import db
from models import User
from werkzeug.security import generate_password_hash

def setup_admin():
    app = create_app()
    
    with app.app_context():
        admin_email = 'admin@Enable.com'
        admin_password = '12345678'
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if existing_admin:
            print(f"✅ Admin account already exists: {admin_email}")
            print(f"   Updating role to 'admin'...")
            existing_admin.role = 'admin'
            existing_admin.password_hash = generate_password_hash(admin_password)
            db.session.commit()
            print(f"✅ Admin account updated successfully!")
        else:
            print(f"Creating new admin account...")
            admin_user = User(
                email=admin_email,
                password_hash=generate_password_hash(admin_password),
                role='admin',
                is_verified=True
            )
            
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Admin account created successfully!")
        
        print(f"\n{'='*50}")
        print(f"Primary Admin Account Details:")
        print(f"{'='*50}")
        print(f"Email:    {admin_email}")
        print(f"Password: {admin_password}")
        print(f"Role:     admin")
        print(f"{'='*50}")
        print(f"\n⚠️  IMPORTANT:")
        print(f"   - Only this account has admin privileges initially")
        print(f"   - Use this account to add other admins via Admin Panel")
        print(f"   - Keep these credentials secure!")
        print(f"\n🔐 Login at: http://localhost:5173/login")

if __name__ == '__main__':
    setup_admin()
