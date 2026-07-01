# Silver Raccoon - OptiBot Mini-Clone

Mini customer-support RAG bot for the OptiSigns Help Center. The sync job scrapes Zendesk articles, converts them to clean Markdown, uploads them to Gemini File Search via API, and records delta-sync counts for daily runs.

## Setup

Requirements: Python 3.11+, Node.js 18+, and a Gemini API key.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.sample .env
```

Set `GEMINI_API_KEY` in `.env`, then optionally build the React console:

```bash
cd frontend
npm install
npm run build
cd ..
```

## Run Locally

Run the scraper/uploader once:

```bash
python main.py
```

Start the web console:

```bash
python main.py --serve
```

Open `http://localhost:8000`.

## Docker

The container runs the daily sync once and exits with status `0` when successful:

```bash
docker build -t optibot-sync .
docker run --rm -e API_KEY=your_gemini_key optibot-sync
```

## Daily Job and Logs

Daily sync is configured in `.github/workflows/daily_sync.yml` and runs once per day at `00:00 UTC`. The job restores cached sync state, runs `python main.py`, saves updated state, and uploads `logs/last_run.json` as the `last-run-log` artifact.

GitHub Actions logs: `https://github.com/pogdepZ/Silver-Raccoon/actions/workflows/daily_sync.yml`

Latest local run summary:

```json
{
  "total_scraped": 30,
  "added": 23,
  "updated": 0,
  "skipped": 7,
  "removed": 0,
  "vector_store_file_counts": {
    "completed": 31,
    "in_progress": 0,
    "failed": 0,
    "total": 31
  }
}
```

## Ingestion and Chunking

`src/scraper.py` pulls active Zendesk articles, removes page chrome, preserves headings/code blocks/links, and writes Markdown files to `data/articles/<slug>.md`. Each file includes an `Article URL:` line for citation grounding.

`src/ai_sync.py` uploads Markdown files to Gemini File Search through the API. Delta sync is tracked in `gemini_state.json` with SHA-256 hashes, so unchanged articles are skipped and removed articles are pruned. Chunking uses Gemini File Search managed parsing; this API path exposes indexed file counts but not per-chunk counts, so `logs/last_run.json` records file indexing status instead.

## Screenshot

Sanity check question: `How do I add a YouTube video?`

The required screenshot should be saved as `screenshot.png` in the repository root and show the assistant answer with cited `Article URL:` lines.

## Tests

```bash
./.venv/bin/python3 -m unittest discover -s tests
```
