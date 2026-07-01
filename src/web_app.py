import os
import json
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import shutil
import hashlib
import random
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv
from src.query_router import handle_query
from src.ai_sync import AssistantManager

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

class ManualIngestRequest(BaseModel):
    title: str
    content: str

@app.post("/api/ingest/manual")
def ingest_manual(request: ManualIngestRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY environment variable not set.")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="gemini_state.json not found. Please sync first.")
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
            vector_store_name = state.get("file_search_store_name")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read sync state: {e}")
        
    if not vector_store_name:
        raise HTTPException(status_code=400, detail="Gemini Vector Store not initialized in state.json.")
    
    slug_title = re.sub(r'[^a-zA-Z0-9\s-]', '', request.title).strip().replace(' ', '-')
    slug_title = re.sub(r'-+', '-', slug_title).lower()
    
    article_id = random.randint(100000, 999999)
    slug = f"manual-{article_id}-{slug_title}"[:80]
    
    output_dir = "data/articles"
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{slug}.md")
    
    from datetime import datetime, timezone
    updated_at = datetime.now(timezone.utc).isoformat()
    
    header = f"---\ntitle: \"{request.title}\"\nid: {article_id}\nupdated_at: \"{updated_at}\"\n---\n\n"
    citation_block = f"\n\n---\nArticle URL: #\n"
    full_content = header + request.content + citation_block
    
    content_hash = hashlib.sha256(full_content.encode("utf-8")).hexdigest()
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_content)
        
    try:
        manager = AssistantManager(api_key=api_key)
        metadata = {
            "article_id": article_id,
            "title": request.title,
            "source_url": "#",
            "updated_at": updated_at,
        }
        result = manager.sync_article(slug, filepath, content_hash, vector_store_name, metadata)
        return {
            "status": "success",
            "slug": slug,
            "result": result,
            "article_id": article_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync manual article to Gemini: {str(e)}")

class UrlIngestRequest(BaseModel):
    url: str

@app.post("/api/ingest/url")
def ingest_url(request: UrlIngestRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY environment variable not set.")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="gemini_state.json not found. Please sync first.")
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
            vector_store_name = state.get("file_search_store_name")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read sync state: {e}")
        
    if not vector_store_name:
        raise HTTPException(status_code=400, detail="Gemini Vector Store not initialized in state.json.")
        
    import requests
    from bs4 import BeautifulSoup
    from markdownify import markdownify as md
    
    try:
        res = requests.get(request.url, timeout=15)
        res.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")
        
    soup = BeautifulSoup(res.text, "html.parser")
    title = soup.title.string.strip() if soup.title else "Scraped Article"
    
    body_content = ""
    body_tag = soup.body
    if body_tag:
        for tag in body_tag(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        body_content = md(str(body_tag), heading_style="ATX").strip()
    else:
        body_content = md(res.text, heading_style="ATX").strip()
        
    article_id = random.randint(100000, 999999)
    slug_title = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().replace(' ', '-')
    slug_title = re.sub(r'-+', '-', slug_title).lower()
    slug = f"url-{article_id}-{slug_title}"[:80]
    
    output_dir = "data/articles"
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{slug}.md")
    
    from datetime import datetime, timezone
    updated_at = datetime.now(timezone.utc).isoformat()
    
    header = f"---\ntitle: \"{title}\"\nid: {article_id}\nupdated_at: \"{updated_at}\"\n---\n\n"
    citation_block = f"\n\n---\nArticle URL: {request.url}\n"
    full_content = header + body_content + citation_block
    
    content_hash = hashlib.sha256(full_content.encode("utf-8")).hexdigest()
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_content)
        
    try:
        manager = AssistantManager(api_key=api_key)
        metadata = {
            "article_id": article_id,
            "title": title,
            "source_url": request.url,
            "updated_at": updated_at,
        }
        result = manager.sync_article(slug, filepath, content_hash, vector_store_name, metadata)
        return {
            "status": "success",
            "slug": slug,
            "result": result,
            "article_id": article_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync scraped URL article to Gemini: {str(e)}")

@app.post("/api/ingest/file")
def ingest_file(file: UploadFile = File(...)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY environment variable not set.")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="gemini_state.json not found. Please sync first.")
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
            vector_store_name = state.get("file_search_store_name")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read sync state: {e}")
        
    if not vector_store_name:
        raise HTTPException(status_code=400, detail="Gemini Vector Store not initialized in state.json.")
        
    output_dir = "data/articles"
    os.makedirs(output_dir, exist_ok=True)
    
    article_id = random.randint(100000, 999999)
    
    filename = file.filename or "uploaded-file.txt"
    name_part, ext = os.path.splitext(filename)
    if ext.lower() not in [".txt", ".md", ".pdf"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Only PDF, MD, TXT are supported.")
        
    slug_name = re.sub(r'[^a-zA-Z0-9\s-]', '', name_part).strip().replace(' ', '-')
    slug_name = re.sub(r'-+', '-', slug_name).lower()
    slug = f"file-{article_id}-{slug_name}"[:80]
    
    saved_filename = f"{slug}{ext}"
    filepath = os.path.join(output_dir, saved_filename)
    
    contents = file.file.read()
    content_hash = hashlib.sha256(contents).hexdigest()
    
    file.file.seek(0)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        manager = AssistantManager(api_key=api_key)
        from datetime import datetime, timezone
        updated_at = datetime.now(timezone.utc).isoformat()
        metadata = {
            "article_id": article_id,
            "title": name_part,
            "source_url": "#",
            "updated_at": updated_at,
        }
        result = manager.sync_article(slug, filepath, content_hash, vector_store_name, metadata)
        return {
            "status": "success",
            "slug": slug,
            "result": result,
            "article_id": article_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync uploaded file to Gemini: {str(e)}")

# Mount static files (HTML, JS, CSS) from the compiled React Vite build
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
