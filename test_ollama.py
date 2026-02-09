import requests
import json

def test_ollama():
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3.2",
        "prompt": "Say 'Hello' in French.",
        "stream": False
    }
    
    print(f"Testing Ollama connection to {url} with model 'llama3.2'...")
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("✅ Success! Response:")
            print(response.json().get('response'))
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        print("\nPossible solutions:")
        print("1. Ensure Ollama is running ('ollama serve')")
        print("2. Check if OLLAMA_ORIGINS='*' is set if calling from browser")

if __name__ == "__main__":
    test_ollama()
