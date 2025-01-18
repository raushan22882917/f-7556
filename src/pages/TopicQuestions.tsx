import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Tag } from "lucide-react"; // Importing icons from Lucide
import { useState, useEffect } from "react";

export default function TopicQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<{ topicName: string; questions: any[] }>({ topicName: '', questions: [] });

  // Fetching questions data from the public folder
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questionsData.json");  // Relative URL pointing to the public folder
        const data = await response.json();
        setTopic(data[Number(id)] || { topicName: "Unknown Topic", questions: [] });
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };

    fetchQuestions();
  }, [id]);

  // Navigate to solve the challenge
  const handleSolveChallenge = (questionId: number) => {
    navigate(`/solve/${questionId}`);
  };

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Practice Questions</h1>
      
      <div className="space-y-4">
        {/* Displaying the Topic Name in Bold */}
        <h2 className="text-xl font-bold">{topic.topicName}</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <tbody>
              {topic.questions.map((question) => (
                <tr key={question.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      {question.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">{question.difficulty}</td>
                  <td className="px-6 py-4">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold rounded-full px-2 py-1 mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                      onClick={() => handleSolveChallenge(question.id)}
                    >
                      Solve Challenge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
