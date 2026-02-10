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
        
        tables = ['users', 'quizzes', 'results', 'user_progress', 'audit_logs']
        print("--- Database Health Report ---")
        for table in tables:
            try:
                cur.execute(f"SELECT COUNT(*) FROM {table};")
                count = cur.fetchone()[0]
                print(f"Table: {table.ljust(15)} | Count: {count}")
            except Exception as te:
                print(f"Table: {table.ljust(15)} | Error: {te}")
                conn.rollback() # Reset for next check
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Major Database error: {e}")
