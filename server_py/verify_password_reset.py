import urllib.request
import json
import time
import re

BASE_URL = "http://localhost:5000/api/auth"

def request(endpoint, data=None, method='POST', token=None):
    url = f"{BASE_URL}/{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
        
    if data:
        data_bytes = json.dumps(data).encode('utf-8')
    else:
        data_bytes = None
        
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.getcode(), json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def get_reset_token_from_log():
    print("Scanning server.log for reset token...")
    # Retry a few times as the log might take a moment to flush
    for _ in range(10):
        try:
            with open('server.log', 'r') as f:
                content = f.read()
                match = re.search(r"Password reset token for test@example.com: ([a-f0-9\-]+)", content)
                if match:
                    return match.group(1)
        except FileNotFoundError:
            pass
        time.sleep(1)
    return None

def main():
    email = "test@example.com"
    password = "password123"
    
    print(f"1. Registering user {email}...")
    status, res = request('register', {'email': email, 'password': password})
    if status == 201:
        print("   User registered.")
    elif status == 400 and res.get('message') == 'Email already exists':
        print("   User already exists.")
    else:
        print(f"   Failed to register: {status} {res}")
        return

    print("2. Requesting Password Reset...")
    status, res = request('forgot-password', {'email': email})
    print(f"   Status: {status}, Response: {res}")
    
    token = get_reset_token_from_log()
    if not token:
        print("   FAILED: Could not find reset token in server.log")
        return
    print(f"   Found Token: {token}")
    
    new_password = "newpassword456"
    print("3. Resetting Password...")
    status, res = request('reset-password', {'token': token, 'newPassword': new_password})
    print(f"   Status: {status}, Response: {res}")
    
    print("4. Verifying Login with NEW password...")
    status, res = request('login', {'email': email, 'password': new_password})
    if status == 200:
        print("   LOGIN SUCCESSFUL!")
    else:
        print(f"   LOGIN FAILED: {status} {res}")

if __name__ == "__main__":
    main()
