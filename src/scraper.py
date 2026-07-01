import os
import re
import requests
import hashlib
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def get_article_slug(html_url):
    """
    Extract slug from the HTML URL.
    Example: https://support.optisigns.com/hc/en-us/articles/52523606879251-OptiSigns-Digital-Signage-App-for-Zoom-Adding-Using-and-Removing-the-App
    Slug: 52523606879251-OptiSigns-Digital-Signage-App-for-Zoom-Adding-Using-and-Removing-the-App
    """
    if not html_url:
        return "unknown"
    parts = html_url.rstrip("/").split("/")
    return parts[-1]

def make_links_absolute(html_content, base_url="https://support.optisigns.com"):
    """
    Finds all links starting with /hc/ and makes them absolute base_url + link.
    """
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("/hc/"):
            a["href"] = f"{base_url.rstrip('/')}{href}"
    return str(soup)

def clean_html_to_markdown(html_content, html_url):
    """
    Converts HTML body from Zendesk to clean Markdown.
    Includes an explicit "Article URL" line at the bottom for LLM retrieval.
    """
    if not html_content:
        return ""
    
    # 1. Standardize relative links in HTML first
    html_cleaned = make_links_absolute(html_content)
    
    # 2. Convert to markdown
    markdown_content = md(html_cleaned, heading_style="ATX").strip()
    
    # 3. Format markdown: replace multiple newlines with at most 2, clean up extra spaces
    markdown_content = re.sub(r'\n{3,}', '\n\n', markdown_content)
    
    # 4. Append the citation block at the end
    citation_block = f"\n\n---\nArticle URL: {html_url}\n"
    markdown_content += citation_block
    
    return markdown_content

def fetch_articles(limit=50):
    """
    Fetch articles from Zendesk API.
    Only fetch public (not draft) and non-empty articles.
    Always includes the critical YouTube Video article (ID: 360051014713).
    """
    fetched_articles = []
    seen_ids = set()

    # 1. Direct fetch of critical YouTube Video article (ID: 360051014713)
    try:
        print("Pre-fetching critical YouTube Video article (ID: 360051014713)...")
        res = requests.get("https://support.optisigns.com/api/v2/help_center/en-us/articles/360051014713.json", timeout=15)
        if res.status_code == 200:
            art = res.json().get("article")
            if art and not art.get("draft") and art.get("body"):
                fetched_articles.append(art)
                seen_ids.add(art["id"])
                print("Successfully pre-fetched YouTube Video article.")
    except Exception as e:
        print(f"Warning: Failed to pre-fetch critical YouTube article: {e}")

    # 2. Paginated fetch of remaining articles
    url = "https://support.optisigns.com/api/v2/help_center/en-us/articles.json"
    params = {
        "per_page": 100,
        "page": 1
    }
    
    while len(fetched_articles) < limit:
        print(f"Fetching page {params['page']} of articles...")
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        articles = data.get("articles", [])
        if not articles:
            break
            
        for art in articles:
            # Skip draft, empty body, or already seen articles
            if art.get("draft") is True or not art.get("body") or art.get("id") in seen_ids:
                continue
            fetched_articles.append(art)
            seen_ids.add(art["id"])
            if len(fetched_articles) >= limit:
                break
                
        # Check for next page
        if not data.get("next_page") or len(articles) < params["per_page"]:
            break
            
        params["page"] += 1
        
    return fetched_articles

def save_article_to_markdown(article, output_dir="data/articles"):
    """
    Saves a single Zendesk article dict as a Markdown file.
    Returns (filepath, slug, md_content, content_hash)
    """
    os.makedirs(output_dir, exist_ok=True)
    
    title = article.get("title", article.get("name", "Untitled"))
    html_url = article.get("html_url", "")
    body = article.get("body", "")
    updated_at = article.get("updated_at", "")
    article_id = article.get("id")
    
    slug = get_article_slug(html_url)
    filename = f"{slug}.md"
    filepath = os.path.join(output_dir, filename)
    
    md_content = clean_html_to_markdown(body, html_url)
    
    # Generate metadata header (YAML Frontmatter style)
    header = f"---\ntitle: \"{title}\"\nid: {article_id}\nupdated_at: \"{updated_at}\"\n---\n\n"
    full_content = header + md_content
    
    # Calculate SHA256 hash of the content to detect changes
    content_hash = hashlib.sha256(full_content.encode("utf-8")).hexdigest()
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_content)
        
    return filepath, slug, full_content, content_hash

if __name__ == "__main__":
    # Quick debug run
    print("Testing scraper module...")
    articles = fetch_articles(limit=5)
    print(f"Fetched {len(articles)} test articles.")
    for idx, a in enumerate(articles):
        path, slug, content, content_hash = save_article_to_markdown(a)
        print(f"[{idx+1}] Saved {slug} to {path} (hash: {content_hash[:8]})")
