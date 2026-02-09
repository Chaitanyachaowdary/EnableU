from app import create_app, db
from sqlalchemy import text

def update_schema():
    app = create_app()
    with app.app_context():
        print("Updating database schema...")
        with db.engine.connect() as conn:
            # Add requires_password_change column
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT FALSE"))
                print("Added requires_password_change column")
            except Exception as e:
                print(f"Error adding requires_password_change: {e}")

            # Add last_password_change column
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP"))
                print("Added last_password_change column")
            except Exception as e:
                print(f"Error adding last_password_change: {e}")
                
            conn.commit()
        print("Database schema update complete.")

if __name__ == "__main__":
    update_schema()
