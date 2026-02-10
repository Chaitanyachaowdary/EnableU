import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv('DATABASE_URL')
output_path = "db_audit_report.txt"

if not db_url:
    with open(output_path, "w") as f:
        f.write("DATABASE_URL not found in .env\n")
else:
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        with open(output_path, "w") as f:
            f.write("=== DATABASE AUDIT REPORT ===\n\n")
            
            # 1. Users Audit
            cur.execute("SELECT id, email, role, gamification, accessibility_settings FROM users;")
            users = cur.fetchall()
            f.write(f"USERS ({len(users)}):\n")
            for u in users:
                f.write(f"  - ID: {u[0]} | Email: {u[1]} | Role: {u[2]}\n")
                f.write(f"    Gamification: {u[3]}\n")
                f.write(f"    Settings: {u[4]}\n")
                if u[3] is None or u[4] is None:
                    f.write("    WARNING: NULL detected!\n")
            
            # 2. Quizzes Audit
            cur.execute("SELECT id, title FROM quizzes;")
            quizzes = cur.fetchall()
            f.write(f"\nQUIZZES ({len(quizzes)}):\n")
            for q in quizzes:
                f.write(f"  - ID: {q[0]} | Title: {q[1]}\n")
            
            # 3. Results Audit
            cur.execute("SELECT COUNT(*) FROM results;")
            res_count = cur.fetchone()[0]
            f.write(f"\nRESULTS COUNT: {res_count}\n")
            
            # 4. Progress Audit
            cur.execute("SELECT COUNT(*) FROM user_progress;")
            prog_count = cur.fetchone()[0]
            f.write(f"USER PROGRESS COUNT: {prog_count}\n")

        cur.close()
        conn.close()
        print(f"Audit report written to {output_path}")
    except Exception as e:
        with open(output_path, "w") as f:
            f.write(f"Database error: {e}\n")
