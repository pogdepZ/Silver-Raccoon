import os
import sys
import json
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load env variables from a local .env file if it exists
load_dotenv()

from src.scraper import fetch_articles, save_article_to_markdown
from src.ai_sync import AssistantManager

def write_last_run_log(payload, log_path="logs/last_run.json"):
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

def main():
    print("=========================================")
    print("OptiBot Knowledge Base Synchronizer Starting")
    print("=========================================")
    
    # Accept GEMINI_API_KEY or API_KEY for convenience.
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
    if not api_key:
        print("ERROR: No API key provided. Please set GEMINI_API_KEY or API_KEY environment variable.")
        sys.exit(1)
        
    # 1. Initialize AssistantManager
    try:
        manager = AssistantManager(api_key=api_key)
    except Exception as e:
        print(f"ERROR: Failed to initialize Gemini client: {e}")
        sys.exit(1)
        
    # 2. Get or create Gemini File Search Store and runtime model
    try:
        vs_id = manager.get_or_create_vector_store()
        assistant_id = manager.get_or_create_assistant(vs_id)
        print(f"Gemini Model: {assistant_id}")
        print(f"File Search Store: {vs_id}")
    except Exception as e:
        print(f"ERROR: Failed to setup Gemini File Search Store: {e}")
        sys.exit(1)
        
    # 3. Fetch articles from Zendesk
    limit = int(os.getenv("LIMIT_ARTICLES", "50"))
    print(f"Fetching articles from Zendesk (limit: {limit})...")
    try:
        articles = fetch_articles(limit=limit)
        print(f"Successfully fetched {len(articles)} active articles.")
    except Exception as e:
        print(f"ERROR: Failed to fetch articles from Zendesk: {e}")
        sys.exit(1)
        
    # 4. Sync articles (delta logic in parallel)
    added_count = 0
    updated_count = 0
    skipped_count = 0
    
    current_slugs = []
    
    # Save all markdown files first, collect metadata for batch parallel execution
    tasks = []
    for idx, article in enumerate(articles):
        try:
            filepath, slug, content, content_hash = save_article_to_markdown(article)
            current_slugs.append(slug)
            metadata = {
                "article_id": article.get("id"),
                "title": article.get("title") or article.get("name"),
                "source_url": article.get("html_url"),
                "updated_at": article.get("updated_at"),
                "synced_at": datetime.now(timezone.utc).isoformat(),
            }
            tasks.append((idx, slug, filepath, content_hash, metadata))
        except Exception as e:
            print(f"ERROR: Failed to prepare article {article.get('id')}: {e}")

    # Use ThreadPoolExecutor to upload and index concurrently
    max_workers = 8
    print(f"Starting parallel sync of articles using {max_workers} threads...")
    
    from concurrent.futures import ThreadPoolExecutor, as_completed
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        futures = {
            executor.submit(
                manager.sync_article, slug, filepath, content_hash, vs_id, metadata
            ): (idx, slug)
            for idx, slug, filepath, content_hash, metadata in tasks
        }
        
        for future in as_completed(futures):
            idx, slug = futures[future]
            try:
                result = future.result()
                if result == "added":
                    print(f"[{idx+1}/{len(articles)}] ADDED: {slug}")
                    added_count += 1
                elif result == "updated":
                    print(f"[{idx+1}/{len(articles)}] UPDATED: {slug}")
                    updated_count += 1
                else:
                    # skipped
                    skipped_count += 1
            except Exception as e:
                print(f"[{idx+1}/{len(articles)}] ERROR syncing article {slug}: {e}")
            
    # 5. Flush all in-memory state changes to disk in one write
    manager.save_state_if_dirty()
    print(f"State saved: {added_count} added, {updated_count} updated, {skipped_count} skipped.")

    # Clean up removed articles (parallel delete) then save again if needed
    print("Checking for deleted articles...")
    removed_count = manager.clean_removed_articles(current_slugs)
    manager.save_state_if_dirty()
    print("Waiting for Gemini File Search indexing to finish...")
    vector_store_file_counts = manager.wait_for_vector_store_files(vs_id)
    summary = {
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "total_scraped": len(articles),
        "added": added_count,
        "updated": updated_count,
        "skipped": skipped_count,
        "removed": removed_count,
        "vector_store_file_counts": vector_store_file_counts,
        "chunking": "Gemini File Search managed chunking; per-chunk counts are not exposed by this API path.",
        "provider": "gemini",
        "model": assistant_id,
        "file_search_store_name": vs_id,
    }
    write_last_run_log(summary)
    
    # 6. Print Summary
    print("=========================================")
    print("Synchronization Complete Summary:")
    print(f"  - Total Scraped: {len(articles)}")
    print(f"  - Added:         {added_count}")
    print(f"  - Updated:       {updated_count}")
    print(f"  - Skipped:       {skipped_count}")
    print(f"  - Cleaned/Del:   {removed_count}")
    print(f"  - File Counts:   {vector_store_file_counts}")
    print("  - Log:           logs/last_run.json")
    print("=========================================")
    
    print("Process finished successfully.")
    sys.exit(0)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] in ["--serve", "serve"]:
        import uvicorn
        # Read port from environment variable, default to 8000
        port = int(os.getenv("PORT", "8000"))
        print(f"Starting OptiBot Web Console server on http://localhost:{port}")
        # Run uvicorn server pointing to src.web_app:app
        uvicorn.run("src.web_app:app", host="0.0.0.0", port=port, reload=True)
    else:
        main()
