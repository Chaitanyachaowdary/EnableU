import requests
import json

BASE_URL = "http://localhost:5001/api"
LOGIN_URL = f"{BASE_URL}/auth/login"
QUIZZES_URL = f"{BASE_URL}/quizzes"

def reproduce():
    # 1. Login
    print("Logging in...")
    try:
        resp = requests.post(LOGIN_URL, json={
            "email": "admin@enable.com",
            # Assuming this password from previous context
            "password": "Admin@EnableU2026!" 
        })
        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code} {resp.text}")
            return
        
        token = resp.json().get('token')
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful. Token obtained.")
        
        # 2. Fetch Quizzes
        print(f"Fetching quizzes from {QUIZZES_URL}...")
        q_resp = requests.get(QUIZZES_URL, headers=headers)
        
        print(f"Status Code: {q_resp.status_code}")
        if q_resp.status_code != 200:
            print(f"Error Response: {q_resp.text}")
        else:
            print("Success! Response JSON:")
            try:
                data = q_resp.json()
                print(json.dumps(data, indent=2)[:500] + "...") # Print first 500 chars
            except:
                print("Could not parse JSON")
                print(q_resp.text[:500])

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    reproduce()
