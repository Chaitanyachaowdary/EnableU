from app import create_app, db
from models import User

app = create_app()

with app.app_context():
    # Get all users and display their info
    users = User.query.all()
    
    print("\n=== Current Users ===")
    for user in users:
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"ID: {user.id}")
        print("-" * 40)
    
    # Update the first user to admin if they exist
    if users:
        first_user = users[0]
        first_user.role = 'admin'
        db.session.commit()
        print(f"\n✅ Updated {first_user.email} to admin role!")
    else:
        print("\n❌ No users found in database!")
