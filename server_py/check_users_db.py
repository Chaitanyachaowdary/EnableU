from app import create_app
from models import User

def check_users():
    app = create_app()
    with app.app_context():
        users = User.query.all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f"- {u.email} ({u.role})")

if __name__ == '__main__':
    check_users()
