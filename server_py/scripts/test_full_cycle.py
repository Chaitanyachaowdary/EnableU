import requests
import json
import time

def test_full_cycle():
    base_url = "http://localhost:5001/api"
    login_data = {
        "email": "admin@enable.com",
        "password": "Admin@EnableU2026!"
    }
    
    print("Testing Login...")
    resp = requests.post(f"{base_url}/auth/login", json=login_data)
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code} {resp.text}")
        return
    
    token = resp.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Login success.")
    
    # 1. Start Progress
    print("\nStarting Progress for quiz-1...")
    start_resp = requests.post(f"{base_url}/progress/start", 
                               json={"quizId": "quiz-1", "currentQuestionIndex": 1}, 
                               headers=headers)
    print(f"Start Progress Response: {start_resp.status_code} {start_resp.text}")
    
    # 2. Get Progress
    print("\nFetching Progress...")
    prog_resp = requests.get(f"{base_url}/progress", headers=headers)
    print(f"Get Progress Response: {prog_resp.status_code}")
    in_progress = prog_resp.json().get('inProgress', [])
    print(f"In Progress items count: {len(in_progress)}")
    
    # 3. Submit Quiz
    print("\nSubmitting Quiz quiz-1...")
    submission = {
        "answers": {
            "q1": "a",
            "q2": "c",
            "q3": "b"
        }
    }
    sub_resp = requests.post(f"{base_url}/quizzes/quiz-1/submit", json=submission, headers=headers)
    print(f"Submission Response: {sub_resp.status_code} {sub_resp.text}")
    
    # 4. Check Leaderboard
    print("\nChecking Leaderboard...")
    lb_resp = requests.get(f"{base_url}/leaderboard", headers=headers)
    print(f"Leaderboard: {lb_resp.text}")

if __name__ == "__main__":
    test_full_cycle()
