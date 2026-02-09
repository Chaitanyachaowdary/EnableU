from app import create_app, db
from sqlalchemy import text

def update_user_name():
    app = create_app()
    with app.app_context():
        print("Adding name column to users table...")
        with db.engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100)"))
                print("Added name column")
            except Exception as e:
                print(f"Error adding name column: {e}")
                
            conn.commit()
        print("Update complete.")

if __name__ == "__main__":
    update_user_name()
