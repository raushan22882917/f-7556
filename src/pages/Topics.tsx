import { Shield, Check, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { TopicProgress } from "@/components/TopicProgress";
import { Navbar } from "@/components/Navbar"; // Import Navbar
import { useEffect, useState } from "react";

const initialTopics = [
  { id: 1, title: "Arrays", description: "Learn about arrays and basic operations", totalQuestions: 5, completedQuestions: 0, unlocked: true, achievement: "Array Master" },
  { id: 2, title: "Linked Lists", description: "Understanding linked lists and their operations", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "List Navigator" },
  { id: 3, title: "Stacks", description: "Master stack operations and applications", totalQuestions: 6, completedQuestions: 0, unlocked: false, achievement: "Stack Specialist" },
  { id: 4, title: "Queues", description: "Learn about queues and their variants", totalQuestions: 4, completedQuestions: 0, unlocked: false, achievement: "Queue Commander" },
  { id: 5, title: "Trees", description: "Dive into trees, traversals, and binary trees", totalQuestions: 8, completedQuestions: 0, unlocked: false, achievement: "Tree Climber" },
  { id: 6, title: "Graphs", description: "Understand graph theory and algorithms", totalQuestions: 10, completedQuestions: 0, unlocked: false, achievement: "Graph Explorer" },
  { id: 7, title: "Hashing", description: "Learn hashing techniques and applications", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Hash Hero" },
  { id: 8, title: "Dynamic Programming", description: "Solve problems with dynamic programming", totalQuestions: 12, completedQuestions: 0, unlocked: false, achievement: "DP Expert" },
  { id: 9, title: "Sorting Algorithms", description: "Master sorting algorithms like quicksort and mergesort", totalQuestions: 7, completedQuestions: 0, unlocked: false, achievement: "Sorting Prodigy" },
  { id: 10, title: "Greedy Algorithms", description: "Learn and apply greedy techniques", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Greedy Genius" },
  { id: 11, title: "Recursion", description: "Deep dive into recursion concepts and problems", totalQuestions: 6, completedQuestions: 0, unlocked: false, achievement: "Recursion Wizard" },
  { id: 12, title: "Bit Manipulation", description: "Understand bitwise operations and applications", totalQuestions: 4, completedQuestions: 0, unlocked: false, achievement: "Bit Master" },
  { id: 13, title: "Backtracking", description: "Solve complex problems using backtracking", totalQuestions: 6, completedQuestions: 0, unlocked: false, achievement: "Backtracking Champion" },
  { id: 14, title: "Divide and Conquer", description: "Learn the divide and conquer approach", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Divide & Conquer Specialist" },
  { id: 15, title: "String Algorithms", description: "Work on string manipulation and pattern matching", totalQuestions: 8, completedQuestions: 0, unlocked: false, achievement: "String Maestro" },
];


export default function Topics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topics, setTopics] = useState(initialTopics);

  // Unlock the next topic if the current topic is completed
  useEffect(() => {
    const updatedTopics = [...topics];
    for (let i = 0; i < updatedTopics.length - 1; i++) {
      if (
        updatedTopics[i].completedQuestions === updatedTopics[i].totalQuestions &&
        !updatedTopics[i + 1].unlocked
      ) {
        updatedTopics[i + 1].unlocked = true;
      }
    }
    setTopics(updatedTopics);
  }, [topics]);

  const handleTopicClick = (topic) => {
    if (!topic.unlocked) {
      toast({
        title: "Topic Locked",
        description: "Complete the previous topic to unlock this one!",
        variant: "destructive",
      });
      return;
    }
    navigate(`/topic/${topic.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      <div className="container py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Data Structures Learning Path</h1>
          <p className="text-muted-foreground">
            Master data structures step by step. Complete each topic to unlock the next one.
          </p>
        </div>

        {/* Circular Progress Bar */}
        <div className="flex justify-center items-center py-6">
          <div className="relative">
            {/* Outer SVG Circle */}
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-gray-300 dark:text-gray-600"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="282.6"
                strokeDashoffset={`${
                  282.6 - (282.6 * topics.reduce((sum, topic) => sum + topic.completedQuestions, 0)) / 
                          topics.reduce((sum, topic) => sum + topic.totalQuestions, 0)
                }`}
                className="text-primary transition-all duration-300"
              />
            </svg>
            {/* Percentage and Completion Count in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {Math.round(
                  (topics.reduce((sum, topic) => sum + topic.completedQuestions, 0) /
                    topics.reduce((sum, topic) => sum + topic.totalQuestions, 0)) *
                    100
                )}
                %
              </span>
              <span className="text-sm text-muted-foreground">
                {topics.reduce((sum, topic) => sum + topic.completedQuestions, 0)}/
                {topics.reduce((sum, topic) => sum + topic.totalQuestions, 0)} Questions
              </span>
            </div>
          </div>
        </div>

        {/* Table Format */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Topic</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">Progress</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr
                  key={topic.id}
                  className={`cursor-pointer transition-all ${
                    topic.unlocked ? "hover:bg-gray-200 dark:hover:bg-gray-700" : "opacity-60"
                  }`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{topic.title}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{topic.description}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                    {topic.completedQuestions}/{topic.totalQuestions}
                    <TopicProgress
                      completed={topic.completedQuestions}
                      total={topic.totalQuestions}
                    />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                    {topic.unlocked ? (
                      topic.completedQuestions === topic.totalQuestions ? (
                        <Badge className="bg-success/10 text-success">Completed</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary">In Progress</Badge>
                      )
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
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
