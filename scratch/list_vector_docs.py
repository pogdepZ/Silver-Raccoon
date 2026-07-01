import os
import json
from google import genai

def list_vector_docs():
    env_path = ".env"
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    if key.strip() == "GEMINI_API_KEY":
                        os.environ["GEMINI_API_KEY"] = val.strip().strip('                                          "').strip("'")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not configured")
        return
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        print("Error: state file not found")
        return
        
    with open(state_path, "r", encoding="utf-8") as f:
        state = json.load(f)
        
    store_name = state.get("file_search_store_name")
    if not store_name:
        print("Error: file_search_store_name not in state")
        return
        
    print(f"Querying store: {store_name}")
    client = genai.Client(api_key=api_key)
    try:
        response = client.file_search_stores.documents.list(parent=store_name)
        docs = list(response)
        print(f"Total documents found: {len(docs)}")
        for doc in docs:
            print(f" - Name: {doc.name}")
            print(f"   Display Name: {doc.display_name}")
    except Exception as e:
        print(f"Error querying Gemini API: {e}")

if __name__ == "__main__":
    list_vector_docs()
