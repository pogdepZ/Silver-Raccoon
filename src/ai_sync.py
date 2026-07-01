import json
import os
import time
import threading

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

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


class AssistantManager:
    def __init__(self, api_key=None, state_file="gemini_state.json"):
        self.client = genai.Client(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.state_file = state_file
        self.state = self._load_state()
        self.lock = threading.Lock()

    def _load_state(self):
        if os.path.exists(self.state_file):
            try:
                with open(self.state_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: Failed to load state file: {e}. Starting fresh.")
        return {
            "provider": "gemini",
            "file_search_store_name": None,
            "model": "gemini-3.1-flash-lite",
            "articles": {},
        }

    def save_state(self):
        with open(self.state_file, "w", encoding="utf-8") as f:
            json.dump(self.state, f, indent=2)

    def get_or_create_vector_store(self, display_name="OptiSigns Help Center KB"):
        store_name = self.state.get("file_search_store_name")
        if store_name:
            try:
                store = self.client.file_search_stores.get(name=store_name)
                print(f"Reusing existing Gemini File Search Store: {store.name}")
                return store.name
            except Exception:
                print("Saved Gemini File Search Store not found. Creating a new one...")
                # Clear local article cache since we are starting with a brand new empty store
                self.state["articles"] = {}

        store = self.client.file_search_stores.create(
            config=types.CreateFileSearchStoreConfig(display_name=display_name)
        )
        print(f"Created Gemini File Search Store: {store.name}")
        self.state["file_search_store_name"] = store.name
        self.save_state()
        return store.name

    def get_or_create_assistant(self, vector_store_id):
        """
        Gemini does not have a persistent Assistant resource for this flow.
        The model, system prompt, and File Search Store are supplied at request time.
        """
        self.state["model"] = self.state.get("model") or "gemini-3.1-flash-lite"
        self.state["file_search_store_name"] = vector_store_id
        self.save_state()
        return self.state["model"]

    def _wait_for_operation(self, operation, timeout_seconds=300, poll_seconds=5):
        deadline = time.time() + timeout_seconds
        while not getattr(operation, "done", False):
            if time.time() >= deadline:
                raise TimeoutError(f"Gemini upload operation timed out: {operation.name}")
            print(f"Waiting for Gemini upload operation: {operation.name}")
            time.sleep(poll_seconds)
            operation = self.client.operations.get(operation)

        if getattr(operation, "error", None):
            raise RuntimeError(f"Gemini upload operation failed: {operation.error}")
        return operation

    def upload_file_to_vector_store(self, filepath, vector_store_id, metadata=None):
        metadata = metadata or {}
        custom_metadata = [
            types.CustomMetadata(key="slug", string_value=str(metadata.get("slug", ""))),
            types.CustomMetadata(key="source_url", string_value=str(metadata.get("source_url", ""))),
            types.CustomMetadata(key="article_id", string_value=str(metadata.get("article_id", ""))),
        ]
        print(f"Uploading file to Gemini File Search Store: {filepath}")
        operation = self.client.file_search_stores.upload_to_file_search_store(
            file_search_store_name=vector_store_id,
            file=filepath,
            config=types.UploadToFileSearchStoreConfig(
                display_name=os.path.basename(filepath),
                mime_type="text/markdown",
                custom_metadata=custom_metadata,
            ),
        )
        operation = self._wait_for_operation(operation)
        return operation.response.document_name

    def delete_file_from_assistant(self, document_name):
        try:
            print(f"Deleting Gemini File Search document: {document_name}")
            self.client.file_search_stores.documents.delete(name=document_name)
            return True
        except Exception as e:
            print(f"Error deleting Gemini document {document_name}: {e}")
            return False

    def get_vector_store_file_counts(self, vector_store_id):
        try:
            store = self.client.file_search_stores.get(name=vector_store_id)
            return {
                "completed": int(store.active_documents_count or 0),
                "in_progress": int(store.pending_documents_count or 0),
                "failed": int(store.failed_documents_count or 0),
                "total": int(
                    (store.active_documents_count or 0)
                    + (store.pending_documents_count or 0)
                    + (store.failed_documents_count or 0)
                ),
            }
        except Exception as e:
            print(f"Warning: Failed to retrieve Gemini File Search Store counts: {e}")
        return {}

    def wait_for_vector_store_files(self, vector_store_id, timeout_seconds=180, poll_seconds=5):
        deadline = time.time() + timeout_seconds
        last_counts = {}

        while time.time() < deadline:
            last_counts = self.get_vector_store_file_counts(vector_store_id)
            in_progress = int(last_counts.get("in_progress", 0) or 0)
            total = int(last_counts.get("total", 0) or 0)
            completed = int(last_counts.get("completed", 0) or 0)
            failed = int(last_counts.get("failed", 0) or 0)

            print(
                "Gemini File Search indexing: "
                f"{completed}/{total} completed, {in_progress} in progress, {failed} failed"
            )

            if in_progress == 0:
                return last_counts

            time.sleep(poll_seconds)

        print("Warning: Gemini File Search indexing did not finish before timeout.")
        return last_counts

    def sync_article(self, slug, filepath, content_hash, vector_store_id, metadata=None):
        with self.lock:
            article_state = self.state["articles"].get(slug)
        metadata = metadata or {}
        metadata["slug"] = slug

        if not article_state:
            document_name = self.upload_file_to_vector_store(filepath, vector_store_id, metadata)
            with self.lock:
                self.state["articles"][slug] = {
                    "hash": content_hash,
                    "document_name": document_name,
                    "filepath": filepath,
                    **metadata,
                }
                self.save_state()
            return "added"

        if article_state.get("hash") != content_hash:
            old_document_name = article_state.get("document_name")
            if old_document_name:
                self.delete_file_from_assistant(old_document_name)

            document_name = self.upload_file_to_vector_store(filepath, vector_store_id, metadata)
            with self.lock:
                self.state["articles"][slug] = {
                    "hash": content_hash,
                    "document_name": document_name,
                    "filepath": filepath,
                    **metadata,
                }
                self.save_state()
            return "updated"

        return "skipped"

    def clean_removed_articles(self, current_slugs):
        removed_count = 0
        for slug in list(self.state["articles"].keys()):
            if slug not in current_slugs:
                print(f"Article {slug} removed from source. Cleaning up from Gemini.")
                document_name = self.state["articles"][slug].get("document_name")
                if document_name:
                    self.delete_file_from_assistant(document_name)
                del self.state["articles"][slug]
                removed_count += 1

        if removed_count > 0:
            self.save_state()
        return removed_count
