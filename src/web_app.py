import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
from src.query_router import handle_query

load_dotenv()

app = FastAPI(title="OptiBot Web Console")

# System prompt required by the user instructions
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

class ChatRequest(BaseModel):
    message: str

@app.get("/api/status")
def get_status():
    # 1. Load sync log
    sync_log = {}
    log_path = "logs/last_run.json"
    if os.path.exists(log_path):
        try:
            with open(log_path, "r", encoding="utf-8") as f:
                sync_log = json.load(f)
        except Exception:
            pass
            
    # 2. Load articles list
    articles = []
    state_path = "gemini_state.json"
    vector_store_name = "Not Initialized"
    if os.path.exists(state_path):
        try:
            with open(state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
                vector_store_name = state.get("file_search_store_name", "Not Initialized")
                for slug, meta in state.get("articles", {}).items():
                    articles.append({
                        "slug": slug,
                        "title": meta.get("title", slug),
                        "article_id": meta.get("article_id"),
                        "source_url": meta.get("source_url", ""),
                        "updated_at": meta.get("updated_at", "")
                    })
        except Exception:
            pass
            
    return {
        "vector_store_name": vector_store_name,
        "last_run": sync_log,
        "articles": sorted(articles, key=lambda x: x["title"])
    }

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable not configured.")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="Sync state file gemini_state.json not found. Please run sync first.")
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
            vector_store_name = state.get("file_search_store_name")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read sync state: {e}")
        
    if not vector_store_name:
        raise HTTPException(status_code=400, detail="Gemini Vector Store not initialized in state.json.")
        
    try:
        client = genai.Client(api_key=api_key)
        result = handle_query(client, request.message, vector_store_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

# Mount static files (HTML, JS, CSS) from the compiled React Vite build
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
