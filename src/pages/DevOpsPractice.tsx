import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FaBook } from "react-icons/fa"; // Icon for articles
import ReactMarkdown from "react-markdown"; // Import react-markdown

const topics = [
  { id: "ci_cd_pipelines", name: "CI/CD Pipelines", icon: <FaBook /> },
  { id: "containerization", name: "Containerization and Orchestration", icon: <FaBook /> },
  { id: "iac", name: "Infrastructure as Code (IaC)", icon: <FaBook /> },
  { id: "cloud_computing", name: "Cloud Computing and DevOps", icon: <FaBook /> },
  // Add other topics with unique IDs
];

interface TopicContent {
  title: string;
  content: string;
}

interface AIExplanationResponse {
  explanation: string | { section: string, text: string }[]; // Explanation can be string or array of objects with section and text
}

export default function DevOpsPractice() {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [selectedWord, setSelectedWord] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch topic content dynamically
  useEffect(() => {
    const fetchTopicContent = async () => {
      const response = await fetch(`/data/topics/${selectedTopicId}.json`);
      const data = await response.json();
      setTopicContent(data);
    };

    fetchTopicContent();
  }, [selectedTopicId]);

  const { data: aiExplanation, isLoading } = useQuery({
    queryKey: ["aiExplanation", selectedWord],
    queryFn: async (): Promise<AIExplanationResponse> => {
      if (!selectedWord) return { explanation: "" };

      const { data, error } = await supabase.functions.invoke("explain-devops-term", {
        body: { term: selectedWord },
      });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedWord,
  });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      setSelectedWord(selectedText);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Topics Sidebar */}
      <div className="w-64 border-r bg-gray-100 dark:bg-gray-800">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedTopicId === topic.id
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <span className="mr-2">{topic.icon}</span>
                {topic.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {topicContent ? (
          <div
            className="prose dark:prose-invert max-w-none"
            onMouseUp={handleTextSelection}
          >
            <article className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                {topicContent.title}
              </h1>
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {topicContent.content}
              </div>
            </article>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        )}
      </div>

      {/* AI Explanation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-xl p-8 border-4 border-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105">
    
    {/* Dialog Header */}
    <DialogHeader className="flex flex-col items-center space-y-6">
      {/* Title Section */}
      <div className="flex flex-col space-y-2 items-center">
        
        {/* AI Logo and Selected Word */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 flex items-center space-x-2">
          {/* AI Logo */}
          <img
            src="ai.gif" // Replace with your AI logo path
            alt="AI Logo"
            className="w-16 h-16 object-cover rounded-full"
          />
          
          {/* Selected Word */}
          <span className="text-white text-lg font-normal">{selectedWord}</span>

        </div>

        {/* Title Text */}
        <DialogTitle className="text-3xl font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:text-purple-500">
          {/* Optional Title or Text */}
        </DialogTitle>
      </div>

      {/* Horizontal Line Below Header */}
      <div className="w-full border-t-2 border-gray-300 dark:border-gray-700 my-4"></div>
    </DialogHeader>

    {/* Loading State */}
    {isLoading ? (
      <div className="flex items-center justify-center p-8 space-x-2">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
        <span className="text-xl text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    ) : (
      <div className="space-y-6 mt-8">
        {/* Explanation Section */}
        {aiExplanation && (
          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
              Explanation
            </h3>
            <div
              className="bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 text-white p-8 rounded-xl shadow-xl overflow-auto transition-all duration-500 ease-in-out"
              style={{ height: "350px" }}
            >
              {/* Check if the explanation is an array of objects */}
              {Array.isArray(aiExplanation.explanation) ? (
                aiExplanation.explanation.map((item, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="font-semibold text-xl">{item.section}</h4>
                    <p className="text-md">{item.text}</p>
                  </div>
                ))
              ) : (
                <ReactMarkdown className="text-md leading-relaxed">
                  {aiExplanation.explanation}
                </ReactMarkdown>
              )}
            </div>
          </div>
        )}
      </div>
    )}
  </DialogContent>
</Dialog>


    </div>
  );
}
