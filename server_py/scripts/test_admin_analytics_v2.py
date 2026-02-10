import http.client
import json

def test_admin_analytics_v2():
    host = "localhost:5001"
    conn = http.client.HTTPConnection(host)
    
    # 1. Login
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
    
    # 2. Get Analytics
    print("Fetching Admin Analytics...")
    conn.request("GET", "/api/admin/analytics", None, auth_headers)
    resp = conn.getresponse()
    print(f"Status: {resp.status}")
    
    data = json.loads(resp.read().decode())
    
    # Verify Keys
    required_keys = ['total_users', 'active_users', 'total_quizzes', 'total_points', 'growth_trends', 'badge_distribution']
    missing_keys = [k for k in required_keys if k not in data]
    
    if missing_keys:
        print(f"FAILED: Missing keys: {missing_keys}")
    else:
        print("SUCCESS: All required keys present.")
        print(f"Total Points: {data['total_points']}")
        print(f"Growth Trends Count: {len(data['growth_trends'])}")
        print(f"Badge Distribution: {data['badge_distribution']}")
    
    conn.close()

if __name__ == "__main__":
    test_admin_analytics_v2()
