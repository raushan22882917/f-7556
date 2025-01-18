import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar"; // Import Navbar

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log("Fetching article with ID:", id);
        const response = await fetch("/articles.json");
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data: Article[] = await response.json();
        const selectedArticle = data.find((item) => item.id === id);

        if (!selectedArticle) {
          setError("Article not found");
        } else {
          setArticle(selectedArticle);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Error loading article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-12">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Article not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar /> {/* Add Navbar */}
      {/* Add margin-top to avoid content overlap */}
      <div className="mt-16 containers py-12 max-w-4xl mx-auto">
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
          {/* Top Bar with Author Info and Organized by Sakshatkar */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
            {/* Left Section: Organized By */}
            <div className="text-sm font-medium text-gray-600">
              Organized by <span className="font-semibold text-blue-600">Sakshatkar</span>
            </div>
            {/* Right Section: Author and Publish Date */}
            <div className="text-sm font-medium text-gray-600 text-right">
              <div>Author: <span className="font-semibold text-blue-600">{article.author}</span></div>
              <div>Published on: <span className="font-semibold">{article.publishDate}</span></div>
            </div>
          </div>
          {/* Description Section with Background */}
          <div
            className="rounded-lg p-6 mb-8 text-white"
            style={{
              backgroundImage: `url('data:image/jpeg;base64,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')`,
            }}
          >
            <h2>{article.description}</h2>
          </div>
          {/* Main Content */}
          <div className="content">{article.content}</div>
        </article>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container text-center">
          <p>&copy; 2025 Sakshaktar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePage;
