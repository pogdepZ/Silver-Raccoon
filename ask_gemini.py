import os
import sys
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Same system prompt defined in ai_sync.py
SYSTEM_PROMPT = (
    "You are OptiBot, a retrieval-based customer support assistant for OptiSigns.\n\n"
    "You operate ONLY on retrieved knowledge base documents.\n\n"
    "========================\n"
    "CORE RULE (MOST IMPORTANT)\n"
    "========================\n"
    "You MUST treat OptiSigns features as STRICTLY SEPARATE PRODUCTS.\n\n"
    "Do NOT mix or confuse different features even if keywords are similar.\n\n"
    "Examples of DISTINCT features:\n"
    "- YouTube Video (play/embed video content)\n"
    "- YouTube Dashboard (analytics/reporting via Looker Studio)\n"
    "- Screens management\n"
    "- Playlists\n"
    "- Scheduling\n\n"
    "Each feature must be treated independently.\n\n"
    "========================\n"
    "RETRIEVAL USAGE RULE\n"
    "========================\n"
    "1. Only use retrieved context.\n"
    "2. If retrieved context does not EXACTLY match the user intent, ignore it.\n"
    "3. Do NOT partially match similar topics.\n\n"
    "Example:\n"
    "User: \"How do I add a YouTube video?\"\n"
    "❌ DO NOT use:\n"
    "- YouTube Dashboard\n"
    "- Analytics / Looker Studio\n"
    "- Reporting tools\n\n"
    "✔ ONLY use:\n"
    "- YouTube video playback / embed / app setup docs\n\n"
    "========================\n"
    "ANSWER RULES\n"
    "========================\n"
    "- Max 5 bullet points\n"
    "- Step-by-step instructions only\n"
    "- No speculation\n"
    "- No combining multiple features in one answer\n"
    "- Always include up to 3 Article URLs if available\n\n"
    "========================\n"
    "FAIL SAFE\n"
    "========================\n"
    "If no exact-match document exists:\n"
    "Respond:\n"
    "\"I could not find relevant documentation for this request in the OptiSigns help center.\""
)

def main():
    # 1. Load API Key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not found. Please set it in your .env file.")
        sys.exit(1)

    # 2. Load State to find Vector Store Name
    state_file = "gemini_state.json"
    if not os.path.exists(state_file):
        print(f"ERROR: State file '{state_file}' not found. Run main.py first to sync the documents.")
        sys.exit(1)

    with open(state_file, "r", encoding="utf-8") as f:
        state = json.load(f)

    vector_store_name = state.get("file_search_store_name")
    if not vector_store_name:
        print("ERROR: file_search_store_name not found in gemini_state.json.")
        sys.exit(1)

    # 3. Read question from command line arguments, default to the YouTube question
    question = "How do I add a YouTube video?"
    if len(sys.argv) > 1:
        question = " ".join(sys.argv[1:])

    print("=========================================")
    print("OptiBot Gemini Query Tool")
    print(f"Vector Store: {vector_store_name}")
    print(f"Question:     {question}")
    print("=========================================")

    # 4. Initialize client
    client = genai.Client(api_key=api_key)

    # 5. Query Gemini with File Search Grounding
    print("Querying Gemini (grounded search)...")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=question,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
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
    except Exception as e:
        print(f"ERROR: Failed to generate content: {e}")
        sys.exit(1)

    # 6. Output Response
    print("\nOptiBot Response:")
    print("-----------------------------------------")
    if response.text:
        print(response.text)
    else:
        print("[No text returned in response]")
    print("-----------------------------------------")

    # 7. Print Grounding Metadata (Citations / Sources)
    if response.candidates and response.candidates[0].grounding_metadata:
        metadata = response.candidates[0].grounding_metadata
        if metadata.grounding_chunks:
            print("\nGrounding sources used:")
            for idx, chunk in enumerate(metadata.grounding_chunks):
                title = chunk.web.title if chunk.web else ""
                uri = chunk.web.uri if chunk.web else ""
                if chunk.retrieved_context:
                    # In case of custom store chunks
                    title = chunk.retrieved_context.uri or "Vector Store Chunk"
                print(f"  [{idx + 1}] Source: {title}")
    
    sys.exit(0)

if __name__ == "__main__":
    main()
