import http.client
import json

def test_admin_analytics():
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
    print(f"Body: {resp.read().decode()}")
    
    conn.close()

if __name__ == "__main__":
    test_admin_analytics()
