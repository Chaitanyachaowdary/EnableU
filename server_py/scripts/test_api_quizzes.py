import http.client
import json

def test_quizzes_api():
    host = "localhost:5001"
    conn = http.client.HTTPConnection(host)
    
    try:
        conn.request("GET", "/api/quizzes")
        response = conn.getresponse()
        print(f"Status: {response.status}")
        data = response.read().decode('utf-8')
        try:
            quizzes = json.loads(data)
            print(f"Total quizzes returned: {len(quizzes)}")
            if len(quizzes) > 0:
                print(f"First quiz title: {quizzes[0].get('title')}")
                print(f"First quiz questions count: {len(quizzes[0].get('questions', []))}")
        except Exception as je:
            print(f"JSON Parse Error: {je}")
            print("Raw response (start):")
            print(data[:500])
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    test_quizzes_api()
