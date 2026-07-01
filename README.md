# OptiBot - Grounded Customer Support AI Agent & RAG Playground

A production-grade, highly interactive Retrieval-Augmented Generation (RAG) customer support agent and administrative console built for the OptiSigns.com RAG Take-Home Test. OptiBot synchronizes Zendesk Help Center support articles, processes document indexes, and runs a modern React + FastAPI web interface packed with advanced diagnostic and multi-modal features.

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

## Key Advanced Features (The "Wow" Factors)

### 📂 RAG Slide-over Document Drawer
When a user clicks on a Grounded Source card below the chat bubble or inside the sidebar checklist, a beautiful slide-over drawer panel slides in from the right edge of the screen. It retrieves the local Markdown document content from the backend securely and displays the raw article inline.

### 🛡️ API Path Traversal Prevention
The article content retrieval endpoint `/api/articles/{slug:path}` includes strict Regex sanitization checks (`^[a-zA-Z0-9_-]+$`) to prevent attackers from executing path traversal requests (e.g. `../../etc/passwd`) and accessing illegal files.

### 🔬 Semantic RAG Diagnostics Playground
An admin-facing **RAG Playground** tab lets you input test support queries to inspect:
* **Intent Classification**: Evaluated category (`PRODUCT_SUPPORT` or `GENERAL_KNOWLEDGE`).
* **Semantic Relevance Heatmaps**: List of matching chunks retrieved by Gemini, with a dynamic Jaccard text similarity progress bar indicating match weights.
* **Source Document Linkages**: Click the matching chunk title to slide out the Drawer panel immediately.
* **Synthesized AI Output**: Raw text answer formulated strictly from the grounded chunks.

### 🖥️ System Diagnostics Live Terminal
The **System Logs** view features a retro-styled blinking terminal console that streams diagnostics logs in real-time. When an ingestion is triggered (file upload, URL scrape, or text sync), the terminal prints detailed pipeline trace steps as they run.

### 🎙️ Multi-modal Voice Assistant (STT & TTS)
* **Speech-to-Text (STT)**: A microphone button uses Chrome/Safari's native `SpeechRecognition` API to record voice questions in English, converting audio to text input fields.
* **Text-to-Speech (TTS)**: Bot responses trigger a text-to-speech speaker output (`SpeechSynthesis`) that reads the steps aloud.
* **Mute Control**: A pulsating Speaker icon appears during playback, allowing users to cancel speech output on click.

### 📱 Responsive Layouts
Fully responsive viewport support:
* Desktop features a static dashboard layout.
* Mobile viewports collapse the sidebar into a sliding overlay drawer toggleable via a top header Hamburger menu.
* Grids and ledger cards stack vertically (`flex-col lg:flex-row`) to optimize spacing on small touchscreens.

---

## Project Structure

```
├── .github/workflows/       # GitHub CI/CD Actions
│   ├── daily_sync.yml       # Nightly RAG sync runner
│   └── deploy.yml           # VPS auto-deploy script
├── data/articles/           # Local cache of scraped support Markdown articles
├── frontend/                # React Dashboard Console source (Vite + Tailwind)
├── logs/                    # Scraping & Ingest summaries
├── src/
│   ├── ai_sync.py           # Gemini File Search Store integration
│   ├── query_router.py      # Gemini Chat routing & classification logic
│   ├── scraper.py           # Zendesk API web scraper
│   └── web_app.py           # FastAPI server endpoints
├── tests/                   # Python unit tests
├── main.py                  # CLI Entrypoint for Syncing and Serving
└── requirements.txt         # Server dependencies
```

---

## Installation & Setup

### Prerequisites
* Python 3.11+
* Node.js 18+
* Google Gemini API Key

### Local Installation
1. Clone the repository.
2. Initialize and activate virtual environment:
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
   # Set GEMINI_API_KEY="your-gemini-key"
   ```
5. Compile the React Frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

### Running the App
1. **Run Synchronization (Delta Scraper -> Gemini)**:
   ```bash
   python main.py
   ```
2. **Start Web Server**:
   ```bash
   python main.py --serve
   ```
   Open **`http://localhost:8000`** in your browser.

---

## Unit Testing

The repository includes a comprehensive unit testing suite covering scraping operations, file parsing, query classifications, and API endpoints (including path traversal security locks).

To execute the test suite, run:
```bash
./.venv/bin/python3 -m unittest discover -s tests
```

---

## CI/CD VPS Auto-Deployment

We have set up an automated CI/CD pipeline using **GitHub Actions** (`.github/workflows/deploy.yml`).
* **Trigger**: A push to the `main` branch.
* **Mechanism**: The workflow authenticates with the Azure VPS via SSH, pulls the latest code, compiles the static React files (`npm run build`), and restarts the `optibot` systemd backend API service.
* **Prerequisites**: Configure Secrets in your repository:
  - `VPS_HOST`: VPS IP Address (e.g. `40.82.145.30`)
  - `VPS_USERNAME`: SSH Username (e.g. `azureuser`)
  - `VPS_SSH_KEY`: Full private SSH key (`SilverRaccoon_key.pem` content)

---

## Deliverables Checklist

1. **RAG Sanity Check Screenshot**: Ask *"How do I add a YouTube video?"* on the live site `http://40.82.145.30` and verify the grounding sources are correct. Save this screenshot as `screenshot.png` in the root folder.
2. **GitHub Repository**: Push code to a hidden repository name.
3. **Actions Link**: Verify the daily runs and deployment runs execute successfully.
