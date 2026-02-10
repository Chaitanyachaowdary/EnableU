import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv('DATABASE_URL')

if not db_url:
    print("DATABASE_URL not found in .env")
else:
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("SELECT id, email, role, gamification, accessibility_settings, created_at FROM users;")
        users = cur.fetchall()
        print(f"Total users found: {len(users)}")
        for u in users:
            print(f"ID: {u[0]} | Email: {u[1]} | Role: {u[2]}")
            print(f"  Gamification: {u[3]}")
            print(f"  Settings: {u[4]}")
            print(f"  Created At: {u[5]}")
            if u[3] is None or u[4] is None:
                print("  WARNING: NULL JSONB detected!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")
