import os
import json
import tempfile
import unittest
from unittest.mock import MagicMock, patch

from src.ai_sync import AssistantManager

class TestAssistantManager(unittest.TestCase):
    def setUp(self):
        # Create a temporary file for the state
        self.temp_state_file = tempfile.NamedTemporaryFile(suffix=".json", delete=False)
        self.temp_state_file.close()
        
        # Mock genai.Client
        self.mock_client_patch = patch('src.ai_sync.genai.Client')
        self.mock_client_cls = self.mock_client_patch.start()
        self.mock_client = MagicMock()
        self.mock_client_cls.return_value = self.mock_client
        
        # Instantiate Manager with mock client and temp state file
        self.manager = AssistantManager(api_key="fake-key", state_file=self.temp_state_file.name)

    def tearDown(self):
        self.mock_client_patch.stop()
        if os.path.exists(self.temp_state_file.name):
            os.remove(self.temp_state_file.name)

    def test_load_and_save_state(self):
        # Set some states
        self.manager.state["vector_store_id"] = "vs_123"
        self.manager.save_state()
        
        # Create new manager pointing to same file
        new_manager = AssistantManager(api_key="fake-key", state_file=self.temp_state_file.name)
        self.assertEqual(new_manager.state["vector_store_id"], "vs_123")

    def test_sync_article_added(self):
        # Mock the file upload return value
        self.manager.upload_file_to_vector_store = MagicMock(return_value="doc_abc")
        
        # Sync a brand new article
        result = self.manager.sync_article(
            slug="how-to-add",
            filepath="data/articles/how-to-add.md",
            content_hash="hash_111",
            vector_store_id="vs_123",
            metadata={"title": "How to Add"}
        )
        
        self.assertEqual(result, "added")
        self.manager.upload_file_to_vector_store.assert_called_once_with(
            "data/articles/how-to-add.md", "vs_123", {"slug": "how-to-add", "title": "How to Add"}
        )
        
        # Verify it got saved to state
        self.assertIn("how-to-add", self.manager.state["articles"])
        self.assertEqual(self.manager.state["articles"]["how-to-add"]["hash"], "hash_111")
        self.assertEqual(self.manager.state["articles"]["how-to-add"]["document_name"], "doc_abc")

    def test_sync_article_skipped(self):
        # Pre-populate state
        self.manager.state["articles"]["how-to-add"] = {
            "hash": "hash_111",
            "document_name": "doc_abc",
            "filepath": "data/articles/how-to-add.md"
        }
        self.manager.save_state()
        
        self.manager.upload_file_to_vector_store = MagicMock()
        
        # Sync same article with same hash
        result = self.manager.sync_article(
            slug="how-to-add",
            filepath="data/articles/how-to-add.md",
            content_hash="hash_111",
            vector_store_id="vs_123"
        )
        
        self.assertEqual(result, "skipped")
        # Should not upload again
        self.manager.upload_file_to_vector_store.assert_not_called()

    def test_sync_article_updated(self):
        # Pre-populate state
        self.manager.state["articles"]["how-to-add"] = {
            "hash": "hash_111",
            "document_name": "doc_abc",
            "filepath": "data/articles/how-to-add.md"
        }
        self.manager.save_state()
        
        self.manager.delete_file_from_assistant = MagicMock()
        self.manager.upload_file_to_vector_store = MagicMock(return_value="doc_xyz")
        
        # Sync same article with DIFFERENT hash
        result = self.manager.sync_article(
            slug="how-to-add",
            filepath="data/articles/how-to-add.md",
            content_hash="hash_222",
            vector_store_id="vs_123"
        )
        
        self.assertEqual(result, "updated")
        
        # Should delete the old document
        self.manager.delete_file_from_assistant.assert_called_once_with("doc_abc")
        # Should upload the new document
        self.manager.upload_file_to_vector_store.assert_called_once()
        
        # State should be updated
        self.assertEqual(self.manager.state["articles"]["how-to-add"]["hash"], "hash_222")
        self.assertEqual(self.manager.state["articles"]["how-to-add"]["document_name"], "doc_xyz")

    def test_clean_removed_articles(self):
        # Pre-populate state with two articles
        self.manager.state["articles"] = {
            "keep-me": {"hash": "h1", "document_name": "doc_keep", "filepath": "f1"},
            "delete-me": {"hash": "h2", "document_name": "doc_del", "filepath": "f2"}
        }
        self.manager.save_state()
        
        self.manager.delete_file_from_assistant = MagicMock()
        
        # Clean with a current list that only has "keep-me"
        removed = self.manager.clean_removed_articles(["keep-me"])
        
        self.assertEqual(removed, 1)
        # Should delete from Gemini
        self.manager.delete_file_from_assistant.assert_called_once_with("doc_del")
        # Should prune from state
        self.assertIn("keep-me", self.manager.state["articles"])
        self.assertNotIn("delete-me", self.manager.state["articles"])

if __name__ == "__main__":
    unittest.main()
