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

GENERAL_SYSTEM_PROMPT = (
    "You are OptiBot, a customer support assistant for OptiSigns.\n"
    "Answer the user's question directly using your general knowledge. "
    "Do not attempt to search or use retrieved documents for this request."
)

UNRELATED_SYSTEM_PROMPT = (
    "You are OptiBot, a customer support assistant for OptiSigns.\n"
    "Since the user's message is a greeting or unrelated chat, respond in a friendly and helpful manner. "
    "Politely guide them back to OptiSigns or offer general assistance."
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
                model="gemini-2.5-flash",
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


def handle_query(client, message: str, vector_store_name: str, model_name: str = "gemini-2.5-flash"):
    category = classify_question(client, message)
    
    if category == "PRODUCT_SUPPORT":
        # Call with file search store and product support system prompt
        response = client.models.generate_content(
            model=model_name,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=PRODUCT_SUPPORT_SYSTEM_PROMPT,
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
        if response.candidates and response.candidates[0].grounding_metadata:
            metadata = response.candidates[0].grounding_metadata
            if metadata.grounding_chunks:
                for chunk in metadata.grounding_chunks:
                    title = "Vector Store Chunk"
                    if chunk.retrieved_context:
                        title = chunk.retrieved_context.uri or "Vector Store Chunk"
                    elif chunk.web:
                        title = chunk.web.title or chunk.web.uri
                    if title not in sources:
                        sources.append(title)
        return {
            "answer": response.text or "[No response text generated]",
            "sources": sources,
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
