import requests

def fetch_recommendation():
    url = 'http://localhost:3001/get-recommendation-from-tensor'
    data = {"question_id": "281a4f3b", "prev_questions": {"1234": {"a": "b", "c": "d"}}}
    response = requests.post(url, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

if __name__ == "__main__":
    try:
        recommendation = fetch_recommendation()
        print("Recommendation:", recommendation)
    except Exception as e:
        print("Error fetching recommendation:", e)