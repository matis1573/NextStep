import requests
import json

def test_openai_compat():
    url = "http://localhost:11434/v1/chat/completions"
    payload = {
        "model": "llama3.2",
        "messages": [{"role": "user", "content": "Hello!"}],
        "stream": False
    }
    
    print(f"Testing OpenAI Compatibility Endpoint: {url}")
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("✅ Success! Response keys:", response.json().keys())
            print("Content:", response.json()['choices'][0]['message']['content'])
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    test_openai_compat()
