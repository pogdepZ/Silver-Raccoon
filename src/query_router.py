import os
import json
import time
from google.genai import types
from google.genai.errors import APIError

CLASSIFICATION_SYSTEM_PROMPT = (
    "Classify the input question into one of three categories:\n"
    "- PRODUCT_SUPPORT (if the question is about OptiSigns, screens, playlists, players, setup, pricing, billing, or features related to OptiSigns)\n"
    "- GENERAL_KNOWLEDGE (if the question is about general facts, math, logic, history, science, general programming, etc.)\n"
    "- UNRELATED (if the question is a greeting, casual chat, gibberish, or something unrelated to both OptiSigns and general factual knowledge)"
)

PRODUCT_SUPPORT_SYSTEM_PROMPT = (
    "You are OptiBot, the customer-support bot for OptiSigns.com.\n\n"
    "========================\n"
    "CORE MISSION\n"
    "========================\n"
    "Answer questions about OptiSigns features, setup, and players. Prioritize retrieved knowledge base documents.\n\n"
    "========================\n"
    "RETRIEVAL USAGE RULE\n"
    "========================\n"
    "1. When answering about OptiSigns, base your steps on the retrieved context.\n"
    "2. Be accurate, clear, and list up to 3 support article URLs from the retrieved context if available.\n\n"
    "========================\n"
    "FAIL SAFE / GENERAL KNOWLEDGE\n"
    "========================\n"
    "If no exact-match document is found in the retrieved context, or if the user asks a general question, math problem, greetings, or casual talk (e.g. 'who are you', 'calculate 15 * 8'):\n"
    "- Do NOT output a generic 'I could not find relevant documentation' error message.\n"
    "- Instead, answer the question directly and comprehensively using your general knowledge as a powerful AI model.\n"
    "- Maintain your character as OptiBot, a helpful customer support bot."
)

GENERAL_SYSTEM_PROMPT = (
    "You are OptiBot, a customer support assistant for OptiSigns. "
    "Answer the user's general question directly and comprehensively using your knowledge (including math, science, history, calculations, logic, coding, etc.)."
)

UNRELATED_SYSTEM_PROMPT = (
    "You are OptiBot, the customer-support bot for OptiSigns.com. "
    "Respond to greetings, casual chats, and personal questions (like 'who are you?') in a warm, friendly, and helpful manner."
)


def classify_question(client, message: str) -> str:
    response_schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "category": types.Schema(
                type=types.Type.STRING,
                enum=["PRODUCT_SUPPORT", "GENERAL_KNOWLEDGE", "UNRELATED"],
            )
        },
        required=["category"],
    )
    
    # Try with exponential backoff for 429
    max_retries = 3
    delay = 2
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=CLASSIFICATION_SYSTEM_PROMPT,
                    temperature=0.0,
                    response_mime_type="application/json",
                    response_schema=response_schema
                )
            )
            data = json.loads(response.text)
            category = data.get("category", "UNRELATED").upper()
            if category in ["PRODUCT_SUPPORT", "GENERAL_KNOWLEDGE", "UNRELATED"]:
                return category
            return "UNRELATED"
        except APIError as e:
            if getattr(e, "code", None) == 429 and attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
                continue
            raise
        except Exception:
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
                continue
            return "UNRELATED"
    return "UNRELATED"


def handle_query(client, message: str, vector_store_name: str, model_name: str = "gemini-3.1-flash-lite"):
    category = classify_question(client, message)
    
    if category == "PRODUCT_SUPPORT":
        inactive_titles = []
        inactive_slugs = []
        try:
            state_path = "gemini_state.json"
            if os.path.exists(state_path):
                with open(state_path, "r", encoding="utf-8") as f:
                    state = json.load(f)
                    for slug, meta in state.get("articles", {}).items():
                        if not meta.get("active", True):
                            inactive_titles.append(meta.get("title", slug))
                            inactive_slugs.append(slug)
        except Exception:
            pass

        custom_prompt = PRODUCT_SUPPORT_SYSTEM_PROMPT
        if inactive_titles:
            exclusions = []
            for t, s in zip(inactive_titles, inactive_slugs):
                exclusions.append(f'- Title: "{t}" (Slug: "{s}", Filename: "{s}.md")')
            
            custom_prompt += (
                f"\n\nCRITICAL RULE: The following support articles are currently DEACTIVATED: \n"
                f"{chr(10).join(exclusions)}\n"
                f"You MUST NOT use any information from these documents to answer queries. "
                f"If the query is related to them, reply that the document is currently deactivated."
            )

        response = client.models.generate_content(
            model=model_name,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=custom_prompt,
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
        sources = []
        has_grounding = False
        is_deactivated_used = False
        
        if response.candidates and response.candidates[0].grounding_metadata:
            metadata = response.candidates[0].grounding_metadata
            if metadata.grounding_chunks:
                has_grounding = True
                for chunk in metadata.grounding_chunks:
                    title = "Vector Store Chunk"
                    uri = ""
                    if chunk.retrieved_context:
                        title = chunk.retrieved_context.title or chunk.retrieved_context.uri or "Vector Store Chunk"
                        uri = chunk.retrieved_context.uri or ""
                    elif chunk.web:
                        title = chunk.web.title or chunk.web.uri
                        uri = chunk.web.uri or ""
                    
                    # Match title or URI against inactive slugs
                    for slug in inactive_slugs:
                        if slug in title or slug in uri:
                            is_deactivated_used = True
                            break
                    
                    if title not in sources:
                        sources.append(title)
        
        # Veto if RAG query used deactivated resources
        if is_deactivated_used:
            return {
                "answer": "The requested support document is currently deactivated in the knowledge base.",
                "sources": [],
                "classification": category
            }
            
        # If RAG found grounded documents, return the response
        if has_grounding:
            return {
                "answer": response.text or "[No response text generated]",
                "sources": sources,
                "classification": category
            }
            
        # If RAG found no documents, call Gemini with general knowledge
        general_response = client.models.generate_content(
            model=model_name,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=GENERAL_SYSTEM_PROMPT,
                temperature=0.0,
            )
        )
        return {
            "answer": general_response.text or "[No response text generated]",
            "sources": [],
            "classification": category
        }
    
    elif category == "GENERAL_KNOWLEDGE":
        # Call without vector store, using general instruction
        response = client.models.generate_content(
            model=model_name,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=GENERAL_SYSTEM_PROMPT,
                temperature=0.0,
            )
        )
        return {
            "answer": response.text or "[No response text generated]",
            "sources": [],
            "classification": category
        }
        
    else: # UNRELATED
        # Call without vector store, using unrelated instruction
        response = client.models.generate_content(
            model=model_name,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=UNRELATED_SYSTEM_PROMPT,
                temperature=0.0,
            )
        )
        return {
            "answer": response.text or "[No response text generated]",
            "sources": [],
            "classification": category
        }
