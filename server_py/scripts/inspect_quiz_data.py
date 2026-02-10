import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv('DATABASE_URL')

if not db_url:
    print("DATABASE_URL not found in .env")
else:
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("SELECT id, title, questions FROM quizzes LIMIT 1;")
        row = cur.fetchone()
        if row:
            print(f"Quiz ID: {row[0]}")
            print(f"Title: {row[1]}")
            questions = row[2]
            print(f"Number of questions (raw): {len(questions) if questions else 0}")
            # print(json.dumps(questions, indent=2)[:500])
        else:
            print("No quizzes found in table.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")
