import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { StepProgress } from "@/components/StepProgress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { questions, practiceQuestions } from "@/data/questions";
import axios from "axios";

const steps = [
  {
    title: "Understand the Example",
    description: "Review the example and make sure you understand the problem",
    completed: false,
    current: true,
  },
  {
    title: "Write Approach",
    description: "Explain your solution approach in plain words",
    completed: false,
    current: false,
  },
  {
    title: "Add Test Cases",
    description: "Write additional test cases to validate your solution",
    completed: false,
    current: false,
  },
  {
    title: "Implement Solution",
    description: "Write your code solution",
    completed: false,
    current: false,
  },
  {
    title: "Submit",
    description: "Submit your solution for evaluation",
    completed: false,
    current: false,
  },
];

export default function SolvePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState("");
  const [approach, setApproach] = useState("");
  const [testCases, setTestCases] = useState({
    basic: "",
    edge: "",
    performance: "",
    negative: "",
    boundary: "",
  });
  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  // Get the current path to determine which practice mode we're in
  const path = window.location.pathname.split("/")[1];

  // Get the appropriate question based on whether we're accessing via ID or practice mode
  const question = id
    ? questions[Number(id) as keyof typeof questions]
    : practiceQuestions[path as keyof typeof practiceQuestions];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((current) => current + 1);
      toast({
        title: "Step completed!",
        description: "Moving to the next step...",
      });
    }
  };

  const handleAddExample = () => {
    setExamples([...examples, { input: "", output: "" }]);
  };

  const handleTestCaseChange = (e, type) => {
    setTestCases((prevState) => ({
      ...prevState,
      [type]: e.target.value,
    }));
  };

  const handleContinue = () => {
    setCurrentStep(1); // Move to the next step (Step 1)
    toast({
      title: "Step completed!",
      description: "Moving to the next step...",
    });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleRunCode = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/evaluate-answer", {
        code,
        language: selectedLanguage,
      });
      setExecutionResult(response.data.result); // Assuming the backend returns the result in `data.result`
    } catch (error) {
      setExecutionResult("Error running code.");
      toast({
        title: "Execution Error",
        description: "There was an issue running the code.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitSolution = async () => {
    const submissionData = {
      approach,
      testCases,
      code,
      selectedLanguage,
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/evaluate-answer", submissionData);
      toast({
        title: "Solution submitted!",
        description: response.data.message, // Assuming backend returns a success message
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Something went wrong while submitting the solution.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    // Update the theme on page load based on the user's preference (if using system preference)
    const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(userPrefersDark);
  }, []);

  if (!question) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Question not found</h2>
            <p>The requested question could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Update steps based on current step
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    completed: index < currentStep,
    current: index === currentStep,
  }));

  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar />
      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{question.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert">
                  <p>{question.description}</p>
                  <h3>Example:</h3>
                  {examples.map((example, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <textarea
                          className="w-full p-2 border rounded bg-transparent text-gray-900 dark:text-white dark:bg-gray-800"
                          placeholder="Input"
                          value={example.input}
                          onChange={(e) => {
                            const newExamples = [...examples];
                            newExamples[index].input = e.target.value;
                            setExamples(newExamples);
                          }}
                        />
                      </div>
                      <div>
                        <textarea
                          className="w-full p-2 border rounded bg-transparent text-gray-900 dark:text-white dark:bg-gray-800"
                          placeholder="Output"
                          value={example.output}
                          onChange={(e) => {
                            const newExamples = [...examples];
                            newExamples[index].output = e.target.value;
                            setExamples(newExamples);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleAddExample} className="mt-2">
                    <span>+</span> Add Another Example
                  </Button>

                  <div className="mt-4">
                    <Button onClick={handleContinue}>Continue</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Solution</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Explain your approach to solving this problem..."
                      value={approach}
                      onChange={(e) => setApproach(e.target.value)}
                    />
                    <Button onClick={handleNext}>Next</Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-bold">Test Cases</h3>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Basic Test Cases"
                        value={testCases.basic}
                        onChange={(e) => handleTestCaseChange(e, "basic")}
                      />
                      <Textarea
                        placeholder="Edge Case Test Cases"
                        value={testCases.edge}
                        onChange={(e) => handleTestCaseChange(e, "edge")}
                      />
                      <Textarea
                        placeholder="Performance Test Cases"
                        value={testCases.performance}
                        onChange={(e) => handleTestCaseChange(e, "performance")}
                      />
                      <Textarea
                        placeholder="Negative Test Cases"
                        value={testCases.negative}
                        onChange={(e) => handleTestCaseChange(e, "negative")}
                      />
                      <Textarea
                        placeholder="Boundary Test Cases"
                        value={testCases.boundary}
                        onChange={(e) => handleTestCaseChange(e, "boundary")}
                      />
                    </div>
                    <Button onClick={handleNext}>Next</Button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <select
                        className="p-2 border rounded"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                      </select>
                    </div>
                    <CodeEditor
                      value={code}
                      onChange={(value) => setCode(value || "")}
                    />
                    <Button onClick={handleRunCode}>Run Code</Button>
                    {executionResult && (
                      <div className="mt-4">
                        <h4 className="font-bold">Execution Result:</h4>
                        <pre className="bg-gray-800 p-4 rounded-md text-white">
                          {executionResult}
                        </pre>
                      </div>
                    )}
                    <Button onClick={handleNext}>Next</Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <p>Review your solution before submitting:</p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Your Approach:</h4>
                      <p className="text-sm">{approach}</p>
                      <h4 className="font-medium">Your Test Cases:</h4>
                      <p className="text-sm">{JSON.stringify(testCases)}</p>
                      <h4 className="font-medium">Your Code:</h4>
                      <pre className="text-sm bg-muted p-4 rounded-md">{code}</pre>
                    </div>
                    <Button onClick={handleSubmitSolution}>Submit Solution</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StepProgress steps={updatedSteps} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-full"
      >
        Toggle Theme
      </button>
    </div>
  );
}
