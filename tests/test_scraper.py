import os
import tempfile
import unittest

from src.scraper import clean_html_to_markdown, get_article_slug, save_article_to_markdown


class ScraperTests(unittest.TestCase):
    def test_markdown_conversion_preserves_core_content(self):
        html = """
        <h2>Install YouTube App</h2>
        <p>Open <a href="/hc/en-us/articles/123">this guide</a>.</p>
        <pre><code>console.log("ok")</code></pre>
        """

        markdown = clean_html_to_markdown(
            html,
            "https://support.optisigns.com/hc/en-us/articles/123-youtube",
        )

        self.assertIn("## Install YouTube App", markdown)
        self.assertIn("https://support.optisigns.com/hc/en-us/articles/123", markdown)
        self.assertIn('console.log("ok")', markdown)
        self.assertIn(
            "Article URL: https://support.optisigns.com/hc/en-us/articles/123-youtube",
            markdown,
        )

    def test_slug_comes_from_article_url(self):
        slug = get_article_slug(
            "https://support.optisigns.com/hc/en-us/articles/12345-Add-YouTube"
        )

        self.assertEqual(slug, "12345-Add-YouTube")

    def test_saved_article_hash_changes_when_content_changes(self):
        article = {
            "id": 1,
            "title": "YouTube",
            "html_url": "https://support.optisigns.com/hc/en-us/articles/1-youtube",
            "updated_at": "2026-07-01T00:00:00Z",
            "body": "<h1>A</h1>",
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            _, _, _, first_hash = save_article_to_markdown(article, output_dir=temp_dir)
            article["body"] = "<h1>B</h1>"
            filepath, _, content, second_hash = save_article_to_markdown(
                article, output_dir=temp_dir
            )

            self.assertTrue(os.path.exists(filepath))
            self.assertIn("# B", content)
            self.assertNotEqual(first_hash, second_hash)


if __name__ == "__main__":
    unittest.main()
