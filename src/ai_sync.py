import json
import os
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import APIError

load_dotenv()

# Max retries and initial delay for upload/delete API calls
_UPLOAD_MAX_RETRIES = 3
_UPLOAD_RETRY_DELAY = 2  # seconds, doubled each retry


class AssistantManager:
    def __init__(self, api_key=None, state_file="gemini_state.json"):
        self.client = genai.Client(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.state_file = state_file
        self.state = self._load_state()
        self.lock = threading.Lock()
        self._dirty = False  # True when in-memory state has unsaved changes

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
        """Persist in-memory state to disk. Call this explicitly after batch operations."""
        with open(self.state_file, "w", encoding="utf-8") as f:
            json.dump(self.state, f, indent=2)
        self._dirty = False

    def save_state_if_dirty(self):
        """Only write to disk if state has changed since last save."""
        if self._dirty:
            self.save_state()

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

    def _wait_for_operation(self, operation, timeout_seconds=300, poll_seconds=5, max_poll_seconds=15):
        """
        Poll until the operation is done.
        Uses progressive backoff: poll interval increases gradually up to max_poll_seconds.
        Prints a single summary line with elapsed time instead of spamming per-poll.
        """
        start = time.time()
        deadline = start + timeout_seconds
        interval = poll_seconds

        while not getattr(operation, "done", False):
            elapsed = time.time() - start
            if time.time() >= deadline:
                raise TimeoutError(
                    f"Gemini upload operation timed out after {elapsed:.0f}s: {operation.name}"
                )
            print(f"  ⏳ Indexing... {elapsed:.0f}s elapsed ({operation.name.split('/')[-1]})")
            time.sleep(interval)
            # Progressive backoff: grow interval up to max_poll_seconds
            interval = min(interval + 2, max_poll_seconds)
            operation = self.client.operations.get(operation)

        elapsed = time.time() - start
        if getattr(operation, "error", None):
            raise RuntimeError(f"Gemini upload operation failed: {operation.error}")

        print(f"  ✅ Indexed in {elapsed:.0f}s")
        return operation

    def upload_file_to_vector_store(self, filepath, vector_store_id, metadata=None):
        """
        Upload a file to the Gemini File Search Store with retry + exponential backoff.
        Retries on transient API errors (429, 5xx). Raises on permanent failure.
        """
        metadata = metadata or {}
        custom_metadata = [
            types.CustomMetadata(key="slug", string_value=str(metadata.get("slug", ""))),
            types.CustomMetadata(key="source_url", string_value=str(metadata.get("source_url", ""))),
            types.CustomMetadata(key="article_id", string_value=str(metadata.get("article_id", ""))),
        ]

        delay = _UPLOAD_RETRY_DELAY
        last_exc = None

        for attempt in range(_UPLOAD_MAX_RETRIES):
            try:
                print(f"Uploading file to Gemini File Search Store: {filepath}"
                      + (f" (attempt {attempt + 1})" if attempt > 0 else ""))
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

            except APIError as e:
                last_exc = e
                # Retry on rate-limit (429) or server errors (5xx)
                code = getattr(e, "code", None)
                if code in (429, 500, 502, 503, 504) and attempt < _UPLOAD_MAX_RETRIES - 1:
                    print(f"Upload API error {code} for {filepath}, retrying in {delay}s...")
                    time.sleep(delay)
                    delay *= 2
                    continue
                raise

            except Exception as e:
                last_exc = e
                if attempt < _UPLOAD_MAX_RETRIES - 1:
                    print(f"Upload error for {filepath}: {e}, retrying in {delay}s...")
                    time.sleep(delay)
                    delay *= 2
                    continue
                raise

        raise RuntimeError(f"Upload failed after {_UPLOAD_MAX_RETRIES} attempts: {last_exc}")

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
        """
        Sync a single article to the vector store.
        Updates in-memory state immediately (thread-safe) but does NOT write to disk.
        Call save_state() once after all sync tasks complete for best performance.
        """
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
                self._dirty = True
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
                self._dirty = True
            return "updated"

        return "skipped"

    def clean_removed_articles(self, current_slugs, max_workers=8):
        """
        Delete articles that no longer exist in the source.
        Uses a thread pool for parallel deletion.
        Updates in-memory state but does NOT write to disk — call save_state() after.
        """
        slugs_to_remove = [
            slug for slug in list(self.state["articles"].keys())
            if slug not in current_slugs
        ]

        if not slugs_to_remove:
            return 0

        def _delete_one(slug):
            print(f"Article {slug} removed from source. Cleaning up from Gemini.")
            document_name = self.state["articles"][slug].get("document_name")
            if document_name:
                self.delete_file_from_assistant(document_name)
            with self.lock:
                self.state["articles"].pop(slug, None)
                self._dirty = True

        with ThreadPoolExecutor(max_workers=min(max_workers, len(slugs_to_remove))) as executor:
            futures = [executor.submit(_delete_one, slug) for slug in slugs_to_remove]
            for future in as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    print(f"Warning: Error during article cleanup: {e}")

        return len(slugs_to_remove)
