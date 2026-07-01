import os
import json
import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from src.web_app import app

class TestIngestionEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        
        # Write a mock gemini_state.json if it doesn't exist so endpoints don't fail
        self.state_file = "gemini_state.json"
        self.had_state = os.path.exists(self.state_file)
        self.old_state_content = None
        if self.had_state:
            with open(self.state_file, "r") as f:
                self.old_state_content = f.read()
                
        # Write dummy state for testing
        with open(self.state_file, "w") as f:
            json.dump({
                "file_search_store_name": "fileSearchStores/test-store-123",
                "model": "gemini-3.1-flash-lite",
                "articles": {}
            }, f)
            
        # Ensure we set API key in env
        self.old_api_key = os.environ.get("GEMINI_API_KEY")
        os.environ["GEMINI_API_KEY"] = "fake-api-key-123"

        self.created_files = []

    def tearDown(self):
        # Restore state file
        if self.had_state:
            with open(self.state_file, "w") as f:
                f.write(self.old_state_content)
        elif os.path.exists(self.state_file):
            os.remove(self.state_file)
            
        # Restore API Key
        if self.old_api_key is not None:
            os.environ["GEMINI_API_KEY"] = self.old_api_key
        elif "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
            
        # Clean up created files
        for filepath in self.created_files:
            if os.path.exists(filepath):
                os.remove(filepath)

    @patch("src.web_app.AssistantManager")
    def test_ingest_manual(self, mock_manager_class):
        # Setup mock
        mock_manager = MagicMock()
        mock_manager.sync_article.return_value = "added"
        mock_manager_class.return_value = mock_manager
        
        payload = {
            "title": "How to configure a test screen",
            "content": "This is manual ingestion content detailing how to configure a test screen in OptiSigns."
        }
        
        response = self.client.post("/api/ingest/manual", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["result"], "added")
        self.assertTrue("manual-" in data["slug"])
        
        # Verify file was created
        filepath = os.path.join("data/articles", f"{data['slug']}.md")
        self.created_files.append(filepath)
        self.assertTrue(os.path.exists(filepath))
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("How to configure a test screen", content)
            self.assertIn("This is manual ingestion content", content)

    @patch("src.web_app.AssistantManager")
    @patch("requests.get")
    def test_ingest_url(self, mock_get, mock_manager_class):
        # Setup mock manager
        mock_manager = MagicMock()
        mock_manager.sync_article.return_value = "added"
        mock_manager_class.return_value = mock_manager
        
        # Setup mock HTTP response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = "<html><head><title>Test URL Article</title></head><body><h1>Guide</h1><p>Steps to configure</p></body></html>"
        mock_get.return_value = mock_response
        
        payload = {
            "url": "https://support.optisigns.com/hc/en-us/articles/999-Test-URL-Article"
        }
        
        response = self.client.post("/api/ingest/url", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["result"], "added")
        self.assertTrue("url-" in data["slug"])
        
        # Verify file was created
        filepath = os.path.join("data/articles", f"{data['slug']}.md")
        self.created_files.append(filepath)
        self.assertTrue(os.path.exists(filepath))
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("Test URL Article", content)
            self.assertIn("Steps to configure", content)

    @patch("src.web_app.AssistantManager")
    def test_ingest_file(self, mock_manager_class):
        # Setup mock manager
        mock_manager = MagicMock()
        mock_manager.sync_article.return_value = "added"
        mock_manager_class.return_value = mock_manager
        
        file_content = b"This is content from an uploaded text file."
        file_data = {"file": ("uploaded-guide.txt", file_content, "text/plain")}
        
        response = self.client.post("/api/ingest/file", files=file_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["result"], "added")
        self.assertTrue("file-" in data["slug"])
        
        # Verify file was created
        filepath = os.path.join("data/articles", f"{data['slug']}.txt")
        self.created_files.append(filepath)
        self.assertTrue(os.path.exists(filepath))
        
        with open(filepath, "rb") as f:
            content = f.read()
            self.assertEqual(content, file_content)

    def test_ingest_file_unsupported_format(self):
        file_content = b"Some binary content."
        file_data = {"file": ("unsupported.exe", file_content, "application/octet-stream")}
        
        response = self.client.post("/api/ingest/file", files=file_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Unsupported file format", response.json()["detail"])

    def test_get_article_content_success(self):
        slug = "test-article-slug-123"
        filepath = os.path.join("data/articles", f"{slug}.md")
        self.created_files.append(filepath)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("This is the article body content.")
            
        with open(self.state_file, "w") as f:
            json.dump({
                "articles": {
                    slug: {
                        "title": "Test Article Title",
                        "source_url": "https://example.com/test-article",
                        "filepath": filepath
                    }
                }
            }, f)
            
        response = self.client.get(f"/api/articles/{slug}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["slug"], slug)
        self.assertEqual(data["title"], "Test Article Title")
        self.assertEqual(data["content"], "This is the article body content.")
        self.assertEqual(data["source_url"], "https://example.com/test-article")

    def test_get_article_content_not_found(self):
        response = self.client.get("/api/articles/non-existent-article-slug")
        self.assertEqual(response.status_code, 404)
        self.assertIn("content file not found", response.json()["detail"])

    def test_get_article_content_invalid_slug(self):
        response = self.client.get("/api/articles/invalid..slug/path")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid article identifier", response.json()["detail"])

    @patch("src.web_app.classify_question")
    @patch("src.web_app.genai.Client")
    def test_rag_explore_product_support(self, mock_client_class, mock_classify):
        mock_classify.return_value = "PRODUCT_SUPPORT"
        
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "This is a grounded answer."
        
        mock_chunk = MagicMock()
        mock_chunk.retrieved_context.text = "This is matched support text content."
        mock_chunk.retrieved_context.title = "zoom-guide.md"
        mock_chunk.retrieved_context.custom_metadata = [
            MagicMock(key="slug", string_value="zoom-guide")
        ]
        
        mock_response.candidates = [
            MagicMock(grounding_metadata=MagicMock(grounding_chunks=[mock_chunk]))
        ]
        mock_client.models.generate_content.return_value = mock_response
        mock_client_class.return_value = mock_client
        
        payload = {"query": "How do I configure Zoom?"}
        response = self.client.post("/api/rag/explore", json=payload)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["classification"], "PRODUCT_SUPPORT")
        self.assertEqual(data["answer"], "This is a grounded answer.")
        self.assertEqual(len(data["chunks"]), 1)
        self.assertEqual(data["chunks"][0]["title"], "zoom-guide.md")
        self.assertEqual(data["chunks"][0]["slug"], "zoom-guide")
        self.assertTrue(data["chunks"][0]["similarity_score"] > 0.5)

    @patch("src.web_app.classify_question")
    @patch("src.web_app.genai.Client")
    def test_rag_explore_general(self, mock_client_class, mock_classify):
        mock_classify.return_value = "GENERAL_KNOWLEDGE"
        
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "General reply."
        mock_client.models.generate_content.return_value = mock_response
        mock_client_class.return_value = mock_client
        
        payload = {"query": "Who are you?"}
        response = self.client.post("/api/rag/explore", json=payload)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["classification"], "GENERAL_KNOWLEDGE")
        self.assertEqual(data["answer"], "General reply.")
        self.assertEqual(len(data["chunks"]), 0)
