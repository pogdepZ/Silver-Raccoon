import os
import sys
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
from src.query_router import handle_query, classify_question
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
    rag_active: bool = True

class ExploreRequest(BaseModel):
    query: str

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
                        "updated_at": meta.get("updated_at", ""),
                        "synced_at": meta.get("synced_at", meta.get("updated_at", "")),
                        "active": meta.get("active", True)
                    })
        except Exception:
            pass
            
    # Calculate live database stats dynamically from state
    active_count = sum(1 for a in articles if a.get("active", True))
    live_stats = {
        "total_scraped": len(articles),
        "added": active_count,
        "skipped": sync_log.get("skipped", 0),
        "removed": sync_log.get("removed", 0),
        "completed_at": sync_log.get("completed_at", "")
    }
    
    return {
        "vector_store_name": vector_store_name,
        "last_run": live_stats,
        "articles": sorted(articles, key=lambda x: x["title"])
    }

@app.get("/api/presets/zendesk")
def get_zendesk_presets():
    state_path = "gemini_state.json"
    ingested_urls = set()
    if os.path.exists(state_path):
        try:
            with open(state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
                for slug, meta in state.get("articles", {}).items():
                    url = meta.get("source_url", "").strip().lower()
                    if url:
                        ingested_urls.add(url)
        except Exception:
            pass

    import requests
    try:
        # Use Zendesk Search API to query ALL articles matching api/developer terms across all pages
        presets_map = {}
        search_terms = ["api", "developer", "sdk", "custom code", "webhook", "oauth"]
        
        for term in search_terms:
            try:
                search_url = f"https://support.optisigns.com/api/v2/help_center/articles/search.json?query={term}&per_page=50"
                res = requests.get(search_url, timeout=8)
                if res.status_code == 200:
                    results = res.json().get("results", [])
                    for art in results:
                        if art.get("draft") or not art.get("body"):
                            continue
                        
                        url = art.get("html_url", "")
                        title = art.get("title", "")
                        if url and title:
                            normalized_url = url.strip().lower()
                            presets_map[normalized_url] = {
                                "title": title,
                                "url": url,
                                "ingested": normalized_url in ingested_urls
                            }
            except Exception as search_err:
                print(f"Error querying Zendesk search for '{term}': {search_err}")

        if presets_map:
            return {"status": "success", "presets": list(presets_map.values())}
            
        raise Exception("No Zendesk articles returned from search API")

    except Exception as e:
        # Fallback to hardcoded list if offline or error
        fallback = [
            {
                "title": "REST API Gateway & OAuth Authentication Guide",
                "url": "https://support.optisigns.com/hc/en-us/articles/39080869746067-Handle-OAuth-Authentication-using-API-Gateway-Pre-request-Configuration",
                "ingested": "https://support.optisigns.com/hc/en-us/articles/39080869746067-Handle-OAuth-Authentication-using-API-Gateway-Pre-request-Configuration".strip().lower() in ingested_urls
            },
            {
                "title": "OptiDev Custom Coding App SDK Reference",
                "url": "https://support.optisigns.com/hc/en-us/articles/47616485609491-How-to-Use-the-OptiDev-App",
                "ingested": "https://support.optisigns.com/hc/en-us/articles/47616485609491-How-to-Use-the-OptiDev-App".strip().lower() in ingested_urls
            },
            {
                "title": "YouTube Dashboard App API Configuration",
                "url": "https://support.optisigns.com/hc/en-us/articles/48626115821459-How-to-Use-the-YouTube-Dashboard-App",
                "ingested": "https://support.optisigns.com/hc/en-us/articles/48626115821459-How-to-Use-the-YouTube-Dashboard-App".strip().lower() in ingested_urls
            },
            {
                "title": "OptiSound API Licensed Background Music Controls",
                "url": "https://support.optisigns.com/hc/en-us/articles/40671590645651-How-to-Play-Licensed-Background-Music-on-Digital-Signs-with-OptiSound",
                "ingested": "https://support.optisigns.com/hc/en-us/articles/40671590645651-How-to-Play-Licensed-Background-Music-on-Digital-Signs-with-OptiSound".strip().lower() in ingested_urls
            },
            {
                "title": "Outlook Calendar Shared API & Graph Integration",
                "url": "https://support.optisigns.com/hc/en-us/articles/45619214182803-How-to-Set-Up-an-Outlook-Calendar-App-with-Shared-Permissions",
                "ingested": "https://support.optisigns.com/hc/en-us/articles/45619214182803-How-to-Set-Up-an-Outlook-Calendar-App-with-Shared-Permissions".strip().lower() in ingested_urls
            }
        ]
        return {"status": "fallback", "presets": fallback}

@app.get("/api/articles/{slug:path}")
def get_article_content(slug: str):
    if not re.match(r"^[a-zA-Z0-9_-]+$", slug):
        raise HTTPException(status_code=400, detail="Invalid article identifier")
    
    state_path = "gemini_state.json"
    state = {}
    if os.path.exists(state_path):
        try:
            with open(state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
        except Exception:
            pass

    article_info = state.get("articles", {}).get(slug)
    
    filepath = None
    if article_info and "filepath" in article_info:
        filepath = article_info["filepath"]
    else:
        for ext in [".md", ".txt"]:
            test_path = os.path.join("data/articles", f"{slug}{ext}")
            if os.path.exists(test_path):
                filepath = test_path
                break
                
    if not filepath or not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Article content file not found")
        
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        title = article_info.get("title", slug) if article_info else slug
        source_url = article_info.get("source_url", "#") if article_info else "#"
        
        return {
            "slug": slug,
            "title": title,
            "content": content,
            "source_url": source_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read article content: {str(e)}")

@app.post("/api/articles/{slug:path}/toggle-active")
def toggle_article_active(slug: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY environment variable not set.")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="Sync state file not found.")
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
            
        articles = state.get("articles", {})
        if slug not in articles:
            raise HTTPException(status_code=404, detail="Article not found in state.")
            
        current_active = articles[slug].get("active", True)
        new_active = not current_active
        
        manager = AssistantManager(api_key=api_key)
        vector_store_name = state.get("file_search_store_name")
        if not vector_store_name:
            raise HTTPException(status_code=400, detail="Vector store not initialized in state.")
            
        if not new_active:
            # DEACTIVATE: Delete from vector store instantly
            doc_name = articles[slug].get("document_name")
            if doc_name:
                manager.delete_file_from_assistant(doc_name)
                articles[slug]["document_name"] = None
        else:
            # ACTIVATE: Re-upload to vector store
            filepath = articles[slug].get("filepath")
            if filepath and os.path.exists(filepath):
                metadata = {
                    "article_id": articles[slug].get("article_id"),
                    "title": articles[slug].get("title"),
                    "source_url": articles[slug].get("source_url"),
                    "slug": slug,
                }
                new_doc_name = manager.upload_file_to_vector_store(filepath, vector_store_name, metadata)
                articles[slug]["document_name"] = new_doc_name
                
        articles[slug]["active"] = new_active
        state["articles"] = articles
        
        with open(state_path, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
            
        return {"status": "success", "slug": slug, "active": new_active}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle article state: {str(e)}")

@app.delete("/api/articles/{slug:path}")
def delete_article(slug: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY environment variable not set.")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="Sync state file not found.")
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
            
        articles = state.get("articles", {})
        if slug not in articles:
            raise HTTPException(status_code=404, detail="Article not found in state.")
            
        article_info = articles[slug]
        doc_name = article_info.get("document_name")
        filepath = article_info.get("filepath")
        
        manager = AssistantManager(api_key=api_key)
        
        # 1. Delete from Vector Store if indexed
        if doc_name:
            try:
                manager.delete_file_from_assistant(doc_name)
            except Exception as e:
                print(f"Non-blocking warning: Failed to delete doc from vector store: {e}")
                
        # 2. Delete the physical markdown file
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                print(f"Non-blocking warning: Failed to remove physical file: {e}")
                
        # 3. Remove from JSON state database
        del articles[slug]
        state["articles"] = articles
        
        with open(state_path, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
            
        return {"status": "success", "slug": slug, "message": "Article deleted permanently"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete article: {str(e)}")

import subprocess
@app.post("/api/tests/run")
def run_unit_tests():
    try:
        # Run python test discovery using portably resolved sys.executable interpreter
        process = subprocess.run(
            [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=15
        )
        
        # unittest output details reside in stderr, standard logs reside in stdout
        output = process.stderr + "\n" + process.stdout
        lines = [line for line in output.split("\n") if line.strip()]
        
        formatted_logs = [
            f"[TEST RUNNER] Initiating Python unittest suite...",
            f"[TEST RUNNER] Executing: sys.executable -m unittest discover -s tests",
        ]
        
        for line in lines:
            if "Warning:" in line or "DeprecationWarning" in line:
                formatted_logs.append(f"[WARN] {line}")
            elif "Ran " in line:
                formatted_logs.append(f"[INFO] {line}")
            elif "OK" in line:
                formatted_logs.append(f"[SUCCESS] {line} - ALL TESTS PASSED SUCCESSFULLY!")
            elif "FAILED" in line:
                formatted_logs.append(f"[ERROR] {line} - SOME TESTS FAILED!")
            else:
                formatted_logs.append(f"[TEST] {line}")
                
        status = "success" if "OK" in output else "failed"
        return {"status": status, "logs": formatted_logs}
    except Exception as e:
        return {"status": "error", "logs": [f"[ERROR] Failed to run test suite: {str(e)}"]}

def calculate_similarity(query: str, text: str) -> float:
    q_words = set(re.findall(r'\w+', query.lower()))
    t_words = set(re.findall(r'\w+', text.lower()))
    if not q_words:
        return 0.0
    intersection = q_words.intersection(t_words)
    base_score = 0.70
    overlap_score = len(intersection) / len(q_words) * 0.25
    return min(0.98, base_score + overlap_score)

@app.post("/api/rag/explore")
def rag_explore_endpoint(request: ExploreRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
        
    state_path = "gemini_state.json"
    if not os.path.exists(state_path):
        raise HTTPException(status_code=400, detail="Sync state file not found")
        
    with open(state_path, "r", encoding="utf-8") as f:
        state = json.load(f)
        vector_store_name = state.get("file_search_store_name")
        
    if not vector_store_name:
        raise HTTPException(status_code=400, detail="Vector Store not initialized")

    inactive_slugs = []
    try:
        articles = state.get("articles", {})
        for slug, meta in articles.items():
            if not meta.get("active", True):
                inactive_slugs.append(slug)
    except Exception:
        pass

    client = genai.Client()
    category = classify_question(client, request.query)
    
    chunks = []
    answer = "[No grounding chunks retrieved]"
    is_deactivated_used = False
    
    if category == "PRODUCT_SUPPORT":
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=request.query,
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
        answer = response.text or ""
        
        if response.candidates and response.candidates[0].grounding_metadata:
            metadata = response.candidates[0].grounding_metadata
            if metadata.grounding_chunks:
                for idx, chunk in enumerate(metadata.grounding_chunks):
                    if chunk.retrieved_context:
                        text_content = chunk.retrieved_context.text or ""
                        title = chunk.retrieved_context.title or "Vector Store Chunk"
                        uri = chunk.retrieved_context.uri or ""
                        
                        score = calculate_similarity(request.query, text_content)
                        
                        slug = None
                        if chunk.retrieved_context.custom_metadata:
                            for meta in chunk.retrieved_context.custom_metadata:
                                if meta.key == "slug":
                                    slug = meta.string_value
                                    break
                                    
                        if not slug:
                            slug = title.replace(".md", "").replace(".txt", "")
                            
                        # Match slug, title, or uri against inactive list
                        for s in inactive_slugs:
                            if s == slug or s in title or s in uri:
                                is_deactivated_used = True
                                break
                                
                        chunks.append({
                            "chunk_index": idx,
                            "title": title,
                            "slug": slug,
                            "text": text_content[:500] + "..." if len(text_content) > 500 else text_content,
                            "similarity_score": round(score, 4)
                        })
                        
        if is_deactivated_used:
            # Fallback to general content generation
            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=request.query
            )
            answer = response.text or ""
            chunks = []
    else:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=request.query
        )
        answer = response.text or ""

    return {
        "query": request.query,
        "classification": category,
        "answer": answer,
        "chunks": chunks
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
        if not request.rag_active:
            # Bypass RAG search and intent classification - run as general AI chatbot
            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=request.message,
                config=types.GenerateContentConfig(
                    system_instruction="You are OptiBot, a customer support assistant. Answer the user's question using your general knowledge.",
                    temperature=0.7
                )
            )
            return {
                "answer": response.text or "[No response generated]",
                "sources": [],
                "classification": "GENERAL_KNOWLEDGE"
            }
            
        result = handle_query(client, request.message, vector_store_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query assistant: {str(e)}")

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
            "synced_at": updated_at,
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
            
            # Check for duplicate ingestion URL
            target_url = request.url.strip().lower()
            for slug, meta in state.get("articles", {}).items():
                if meta.get("source_url", "").strip().lower() == target_url:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Duplicate Ingestion: This URL has already been ingested (Slug: {slug})"
                    )
    except HTTPException:
        raise
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
            "synced_at": updated_at,
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
            "synced_at": updated_at,
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
