import http.client
import json

def test_full_cycle():
    host = "localhost:5001"
    conn = http.client.HTTPConnection(host)
    
    # 1. Login
    print("Testing Login...")
    login_payload = {
        "email": "admin@enable.com",
        "password": "Admin@EnableU2026!"
    }
    headers = {'Content-Type': 'application/json'}
    conn.request("POST", "/api/auth/login", json.dumps(login_payload), headers)
    resp = conn.getresponse()
    if resp.status != 200:
        print(f"Login failed: {resp.status}")
        return
    
    token = json.loads(resp.read().decode()).get('token')
    auth_headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    print("Login success.")
    
    # 2. Start Progress
    print("\nStarting Progress for quiz-1...")
    start_payload = {"quizId": "quiz-1", "currentQuestionIndex": 1}
    conn.request("POST", "/api/progress/start", json.dumps(start_payload), auth_headers)
    resp = conn.getresponse()
    print(f"Start Progress Response: {resp.status} {resp.read().decode()}")
    
    # 3. Get Progress
    print("\nFetching Progress...")
    conn.request("GET", "/api/progress", None, auth_headers)
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    in_progress = data.get('inProgress', [])
    print(f"In Progress items count: {len(in_progress)}")
    
    # 4. Submit Quiz
    print("\nSubmitting Quiz quiz-1...")
    submission = {
        "answers": {
            "q1": "a",
            "q2": "c",
            "q3": "b"
        }
    }
    conn.request("POST", "/api/quizzes/quiz-1/submit", json.dumps(submission), auth_headers)
    resp = conn.getresponse()
    print(f"Submission Response: {resp.status} {resp.read().decode()}")
    
    # 5. Check Leaderboard
    print("\nChecking Leaderboard...")
    conn.request("GET", "/api/leaderboard", None, auth_headers)
    resp = conn.getresponse()
    print(f"Leaderboard: {resp.read().decode()}")
    
    conn.close()

if __name__ == "__main__":
    test_full_cycle()
