import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar"; // Import Navbar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type for the article data
interface Article {
  Tag: string;
  Date: string;
  Title: string;
  data_Article: string;
  Excerpt: string;
  "Read More Link": string;
  "Image URL": string;
}

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articlesPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get-articles/");
        const data = await response.json();

        if (response.ok) {
          setArticles(data.data);
        } else {
          setError("Failed to fetch articles.");
        }
      } catch (err) {
        setError("An error occurred while fetching articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.Excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Navbar sits at the top without additional margins */}

      <div className="flex-1 max-w-7xl mx-auto p-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500 transition dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => (
                <Card
                  key={article.Title}
                  className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition transform hover:scale-105 rounded-lg"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                      {article.Title} {/* Fixed to use Title */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={article["Image URL"]}
                      alt={article.Title}
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {article.Excerpt}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full dark:border-gray-600 dark:text-gray-300"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                Next
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Popup Modal for "Read More" */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-4xl w-full h-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedArticle.Title}
            </h2>

            <div
              className="overflow-y-auto max-h-[80vh] p-4"
              style={{ maxWidth: "21cm", maxHeight: "29.7cm" }} // A4 size
            >
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                {selectedArticle.Excerpt}
              </p>

              <p className="text-base text-gray-800 dark:text-gray-300 mb-4">
                {selectedArticle.data_Article}
              </p>
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
