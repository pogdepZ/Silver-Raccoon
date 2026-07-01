# Silver Raccoon: KB Sync Engine & Support Bot (Gemini Edition)

A lightweight, robust, self-cleaning synchronization engine that pulls support articles from Zendesk, converts them to clean Markdown, and manages a Google Gemini File Search Store.

---

## Architecture Overview

```
[support.optisigns.com]
         │  (Zendesk Help Center API)
         ▼
 ┌───────────────┐        ┌─────────────────────┐
 │   scraper.py  │───────►│  gemini_state.json  │
 └───────────────┘        └─────────────────────┘
         │ (Clean Markdown)          ▲
         ▼                           │ (Tracks Doc Names & Hashes)
 ┌───────────────┐                   │
 │   ai_sync.py  │───────────────────┘
 └───────────────┘
         │ (Gemini File Search Stores API)
         ▼
[Google Gemini Model] (gemini-2.5-flash with grounding tool)
```

### 1. Ingestion & Markdown Conversion
Instead of culling raw HTML with sidebars, headers, and footer scripts, the scraper queries the public Zendesk Help Center API directly.
- **Cleaning**: Preprocesses HTML with `BeautifulSoup` to find relative links (starting with `/hc/`) and updates them into fully clickable absolute URLs (`https://support.optisigns.com/hc/...`).
- **Conversion**: Converts cleaned HTML to standardized Markdown using `markdownify`.
- **Citations**: Appends `Article URL: <url>` to the bottom of each file to allow Gemini to meet the citation requirements specified in the system prompt.

### 2. Chunking Strategy
We upload Markdown files directly. We rely on Gemini's **managed File Search Store parser**, which splits documents intelligently based on headings and paragraph structures rather than rigid character counts. This preserves context and semantic relations between sections.

### 3. Delta Synchronization
To avoid unnecessary uploads, rate limits, and API cost:
- We track files using a local `gemini_state.json` containing the document resource name, SHA-256 content hash, and update timestamps.
- **New Articles**: Uploaded to the Gemini File Search Store and added to state.
- **Updated Articles**: The old document is deleted from the Gemini store to free up quota, the new one is uploaded, and the state is updated.
- **Deleted Articles**: Removed from Gemini and pruned from `gemini_state.json`.

---

## Getting Started

### Prerequisites
- Python 3.11+
- A Google Gemini API Key

### Local Setup
1. Clone this repository.
2. Initialize and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.sample` to `.env` and fill in your Gemini API key:
   ```bash
   cp .env.sample .env
   ```

### Running Locally
To run the synchronizer once:
```bash
python main.py
```
This pulls support articles, saves them locally to `data/articles/`, and synchronizes them with your Gemini File Search Store. A detailed execution summary is logged to `logs/last_run.json`.

---

## Running with Docker

### Build the Image
```bash
docker build -t silver-raccoon-sync .
```

### Run the Container
Run the sync job once:
```bash
docker run -e GEMINI_API_KEY="your-gemini-api-key" silver-raccoon-sync
```

To persist state across container runs, mount the `gemini_state.json` file:
```bash
docker run -e GEMINI_API_KEY="your-gemini-api-key" -v "$(pwd)/gemini_state.json:/app/gemini_state.json" silver-raccoon-sync
```

---

## Production Deployment (Daily Job)

We deploy this scheduled worker using **GitHub Actions**.

### State Persistence
Because GitHub Actions runners are stateless, we use `actions/cache` to preserve `gemini_state.json` and the scraped markdown directory across runs, allowing true delta logic to function.
- **GitHub Workflow**: Located at `.github/workflows/daily_sync.yml`.
- **Logs / Runs URL**: `https://github.com/<owner>/<repo>/actions`
- **Execution Log Artifact**: On completion, the runner uploads `logs/last_run.json` as a build artifact.
