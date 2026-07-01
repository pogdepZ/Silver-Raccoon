import os
import json
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types

client = genai.Client()

state_path = "gemini_state.json"
if not os.path.exists(state_path):
    print("State file not found.")
    sys.exit(1)
    
with open(state_path, "r") as f:
    state = json.load(f)
    vector_store_name = state["file_search_store_name"]

print("Vector Store Name:", vector_store_name)

response = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents="How do I add a YouTube video?",
    config=types.GenerateContentConfig(
        tools=[
            types.Tool(
                file_search=types.FileSearch(
                    file_search_store_names=[vector_store_name]
                )
            )
        ],
        temperature=0.0,
    )
)

print("\nResponse text:", response.text)
if response.candidates and response.candidates[0].grounding_metadata:
    metadata = response.candidates[0].grounding_metadata
    print("\nGrounding Metadata:")
    print("Chunks count:", len(metadata.grounding_chunks or []))
    for idx, chunk in enumerate(metadata.grounding_chunks or []):
        print(f"\nChunk {idx}:")
        print("  - web:", chunk.web)
        print("  - retrieved_context:", chunk.retrieved_context)
        # Check other attributes dynamically using vars or dir
        print("  - dir(chunk):", [a for a in dir(chunk) if not a.startswith('_')])
        if chunk.retrieved_context:
            rc = chunk.retrieved_context
            print("    - dir(retrieved_context):", [a for a in dir(rc) if not a.startswith('_')])
            print("    - uri:", rc.uri)
            print("    - title:", rc.title)
