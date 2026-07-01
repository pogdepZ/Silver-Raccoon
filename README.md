# Silver Raccoon: KB Sync Engine & Support Bot (Gemini Edition)

A lightweight, production-ready Knowledge Base (KB) synchronization engine and AI support assistant built for the OptiSigns.com RAG Take-Home Test. It features a parallelized scraping pipeline, delta-upload tracking, and a modern React + FastAPI Web Dashboard.

---

## Technical Architecture

```
[support.optisigns.com]
         │ (Zendesk Help Center API)
         ▼
 ┌───────────────┐        ┌─────────────────────┐
 │   scraper.py  │───────►│  gemini_state.json  │
 └───────────────┘        └─────────────────────┘
         │ (Clean Markdown)          ▲
         ▼                           │ (Tracks Doc Names & SHA-256 Hashes)
 ┌───────────────┐                   │
 │   ai_sync.py  │───────────────────┘
 └───────────────┘
         │ (Gemini File Search Stores API - Parallelized)
         ▼
[Google Gemini Model] ◄──────────────────────────────┐
         ▲                                           │
         │ (Grounding queries)                       │ (API /chat)
         ▼                                           │
 ┌───────────────────────────────────────────────────┴┐
 │   web_app.py (FastAPI Backend + React Frontend)    │
 └────────────────────────────────────────────────────┘
```

### 1. Ingestion & Markdown Normalization
The scraper queries the public Zendesk Help Center API to retrieve active support articles.
* **Cleaning**: Parses HTML bodies using `BeautifulSoup` to strip headers/footers/nav bars. It converts relative links (starting with `/hc/`) into fully qualified absolute links (`https://support.optisigns.com/hc/...`).
* **Conversion**: Converts cleaned HTML to readable Markdown with `markdownify` and saves them locally as `<slug>.md`.
* **Citations**: Automatically appends `Article URL: <url>` to the bottom of each file to give the Gemini model structural cues for citation.

### 2. Chunking Strategy
We upload clean Markdown files directly. Instead of using arbitrary character-count splitting (which breaks sentences or mid-code contexts), we leverage **Gemini's Managed File Search Parser**. 
* This native parser uses semantic analysis of the Markdown document hierarchy (headings `###`, bullet list groupings, and block structures) to split files into coherent contextual passages.
* This preserves the relationship between steps, troubleshooting tips, and code blocks, preventing fragmented answers.

### 3. Delta Synchronization
To avoid rate limits and minimize Google Cloud API costs, we implement strict delta logic:
* Document status is tracked in `gemini_state.json` (maps article slug to its remote document ID, last updated timestamp, and SHA-256 hash).
* **Added**: If an article does not exist in state, it is uploaded and indexed.
* **Updated**: If the SHA-256 hash of an article changes, the old file is deleted from Gemini, the new version is uploaded, and the state is refreshed.
* **Skipped**: If the hash matches, no API call is made.
* **Pruned**: If a support article is deleted from the Zendesk source, it is automatically purged from the Gemini File Search Store and local state.

### 4. High-Performance Parallelization
Ingestion and indexing are fully parallelized using a python `ThreadPoolExecutor` (defaulting to 8 workers) wrapped with thread-safe `threading.Lock` file locks. This reduces the cold-start Vector Store sync time for 30 files from **7.5 minutes down to under 50 seconds**.

---

## Getting Started

### Prerequisites
* Python 3.11+
* Node.js 18+ (for building frontend)
* Google Gemini API Key (AI Studio)

### Local Installation
1. Clone the repository.
2. Initialize and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the sample environment file and enter your API Key:
   ```bash
   cp .env.sample .env
   # Open .env and set GEMINI_API_KEY="your-key-here"
   ```
5. Compile the React Frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

---

## Running the Application

### 1. Run Synchronization (Delta Scraper -> Gemini)
To execute the scraper-uploader job once:
```bash
python main.py
```
This runs the sync, outputs log statistics to the console, and writes a detailed summary to `logs/last_run.json`.

### 2. Run the Web Console Server
To start the React + FastAPI web console:
```bash
python main.py --serve
```
Open **`http://localhost:8000`** in your browser:
* **Chat Panel**: Interact with OptiBot. It uses the `gemini-3.1-flash-lite` model for fast, cost-effective RAG search, outputting answers strictly grounded in the ingested files with clean citations.
* **Knowledge Base Panel**: An admin panel where you can ingest new files, scrape URLs, or write text manually, viewing a live visual RAG ingestion pipeline.

### 3. Programmatic CLI Query
Test the RAG assistant directly from your terminal:
```bash
python ask_gemini.py "How do I add a YouTube video?"
```

---

## Docker Deployment

### Build the Image
```bash
docker build -t silver-raccoon-sync .
```

### Run Sync Job in Docker
Runs the scraper job once and exits `0`:
```bash
docker run -e API_KEY="your-gemini-api-key" silver-raccoon-sync
```

### Run Web Console in Docker
```bash
docker run -p 8000:8000 -e API_KEY="your-gemini-api-key" silver-raccoon-sync python main.py --serve
```

---

## Daily Sync Job Scheduling

### Option A: GitHub Actions (Recommended)
We provide a ready-to-use GitHub Actions workflow. Since runners are stateless, it uses `actions/cache` to persist the RAG state:
* **Workflow File**: `.github/workflows/daily_sync.yml` (triggered daily at midnight UTC or manually).
* **Logs & Runs**: Check your GitHub repo’s **Actions** tab.
* **Artifact**: The execution summary is uploaded as `last-run-log` containing `logs/last_run.json`.

### Option B: VPS Cron Job
If you deployed on your Azure VPS, open crontab:
```bash
crontab -e
```
Add the following line to run the daily sync at midnight:
```bash
0 0 * * * cd /home/azureuser/Silver-Raccoon && /home/azureuser/Silver-Raccoon/.venv/bin/python main.py >> /home/azureuser/Silver-Raccoon/logs/daily_sync.log 2>&1
```

---

## Deliverables & Screenshots Guide

Before submitting your project review, make sure you take and add the following files to your submission package:

1. **RAG Sanity Check Screenshot**:
   * Open the Web Console (`http://localhost:8000` or your VPS link `http://40.82.145.30`).
   * Ask the bot: `"How do I add a YouTube video?"`
   * Take a screenshot showing the correct response outlining the steps (including the YouTube Shorts formatting tip) and the citations/sources at the bottom.
   * Save this screenshot as `screenshot.png` in the root of this project.
2. **GitHub Repository Link**:
   * Ensure your repository has a cryptic name (e.g. `SilverRaccoon`) and does NOT contain the word "optisigns".
   * Commit and push your local `code-ui` branch to GitHub.
3. **Daily Job Logs**:
   * Link your GitHub Actions run URL in your final submission email.
