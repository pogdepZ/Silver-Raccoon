import unittest
from unittest.mock import MagicMock
from src.query_router import classify_question, handle_query

class TestQueryRouter(unittest.TestCase):
    def setUp(self):
        self.mock_client = MagicMock()

    def test_classify_product_support(self):
        mock_response = MagicMock()
        mock_response.text = '{"category": "PRODUCT_SUPPORT"}'
        self.mock_client.models.generate_content.return_value = mock_response

        category = classify_question(self.mock_client, "How do I add a YouTube video?")
        self.assertEqual(category, "PRODUCT_SUPPORT")

    def test_classify_general_knowledge(self):
        mock_response = MagicMock()
        mock_response.text = '{"category": "GENERAL_KNOWLEDGE"}'
        self.mock_client.models.generate_content.return_value = mock_response

        category = classify_question(self.mock_client, "1 + 1 = ?")
        self.assertEqual(category, "GENERAL_KNOWLEDGE")

    def test_classify_unrelated(self):
        mock_response = MagicMock()
        mock_response.text = '{"category": "UNRELATED"}'
        self.mock_client.models.generate_content.return_value = mock_response

        category = classify_question(self.mock_client, "hi")
        self.assertEqual(category, "UNRELATED")

    from unittest.mock import patch
    @patch("src.query_router.os.path.exists")
    def test_handle_query_product_support(self, mock_exists):
        mock_exists.return_value = False
        mock_classify_response = MagicMock()
        mock_classify_response.text = '{"category": "PRODUCT_SUPPORT"}'

        mock_answer_response = MagicMock()
        mock_answer_response.text = "Here is the YouTube guide..."
        
        mock_chunk = MagicMock()
        mock_chunk.retrieved_context.uri = "https://support.optisigns.com/hc/articles/123"
        mock_chunk.retrieved_context.title = None
        mock_chunk.web = None
        mock_answer_response.candidates = [
            MagicMock(grounding_metadata=MagicMock(grounding_chunks=[mock_chunk]))
        ]

        self.mock_client.models.generate_content.side_effect = [
            mock_classify_response,
            mock_answer_response
        ]

        result = handle_query(self.mock_client, "How do I add a YouTube video?", "vs_123")
        self.assertEqual(result["classification"], "PRODUCT_SUPPORT")
        self.assertEqual(result["answer"], "Here is the YouTube guide...")
        self.assertEqual(result["sources"], ["https://support.optisigns.com/hc/articles/123"])

        # Verify that tools were passed in the second call
        _, kwargs = self.mock_client.models.generate_content.call_args_list[1]
        self.assertIsNotNone(kwargs["config"].tools)

    def test_handle_query_general_knowledge(self):
        mock_classify_response = MagicMock()
        mock_classify_response.text = '{"category": "GENERAL_KNOWLEDGE"}'

        mock_answer_response = MagicMock()
        mock_answer_response.text = "The capital of France is Paris."
        mock_answer_response.candidates = []

        self.mock_client.models.generate_content.side_effect = [
            mock_classify_response,
            mock_answer_response
        ]

        result = handle_query(self.mock_client, "What is the capital of France?", "vs_123")
        self.assertEqual(result["classification"], "GENERAL_KNOWLEDGE")
        self.assertEqual(result["answer"], "The capital of France is Paris.")
        self.assertEqual(result["sources"], [])

        # Verify that tools were NOT passed in the second call
        _, kwargs = self.mock_client.models.generate_content.call_args_list[1]
        self.assertIsNone(kwargs["config"].tools)
