import os
import sys
import json
from dotenv import load_dotenv
load_dotenv()
from src.ai_sync import AssistantManager

# Ensure API Key is available
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY is not set.")
    sys.exit(1)

# Fetch active store name from gemini_state.json
state_path = "gemini_state.json"
if not os.path.exists(state_path):
    print("ERROR: gemini_state.json not found. Run sync first.")
    sys.exit(1)

with open(state_path, "r") as f:
    state = json.load(f)
    vector_store_name = state.get("file_search_store_name")

if not vector_store_name:
    print("ERROR: No Vector Store found in state.json")
    sys.exit(1)

# Target URL to ingest
url = "https://support.optisigns.com/hc/en-us/articles/360052309113-How-to-use-the-Google-Slides-App-with-OptiSigns"

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import hashlib
import re
import random
from datetime import datetime, timezone

print(f"1. Fetching URL: {url}")
res = requests.get(url, timeout=15)
res.raise_for_status()

print("2. Parsing HTML and converting to Markdown...")
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
updated_at = datetime.now(timezone.utc).isoformat()

header = f"---\ntitle: \"{title}\"\nid: {article_id}\nupdated_at: \"{updated_at}\"\n---\n\n"
citation_block = f"\n\n---\nArticle URL: {url}\n"
full_content = header + body_content + citation_block
content_hash = hashlib.sha256(full_content.encode("utf-8")).hexdigest()

with open(filepath, "w", encoding="utf-8") as f:
    f.write(full_content)
print(f"   Saved local file: {filepath}")

print(f"3. Uploading and indexing in Gemini Vector Store: {vector_store_name}...")
manager = AssistantManager(api_key=api_key)
result = manager.sync_article(slug, filepath, content_hash, vector_store_name, {
    "article_id": article_id,
    "title": title,
    "source_url": url,
    "updated_at": updated_at
})

print(f"SUCCESS: Ingestion complete! Result status: {result}")
print(f"You can now query the assistant about: '{title}'!")
