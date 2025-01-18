import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { CodeEditor } from "../components/CodeEditor";
import { useToast } from "../hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { QuestionTimer } from "./QuestionTimer";

interface SolutionFormProps {
  currentStep: number;
  onNext: () => void;
  approach: string;
  setApproach: (value: string) => void;
  testCases: string;
  setTestCases: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
}

export function SolutionForm({
  currentStep,
  onNext,
  approach,
  setApproach,
  testCases,
  setTestCases,
  code,
  setCode,
}: SolutionFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    checkSubmissionCount();
  }, []);

  const checkSubmissionCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const today = new Date().toISOString().split('T')[0];
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('id')
      .eq('user_id', session.user.id)
      .gte('created_at', today);

    if (error) {
      console.error('Error checking submission count:', error);
      return;
    }

    setSubmissionCount(submissions?.length || 0);
  };

  const handleSubmit = async () => {
    if (submissionCount >= 10) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached the maximum limit of 10 submissions per day.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Authentication error. Please try logging in again.");
      }

      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit your solution.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Check grammar using Groq
      const { data: grammarCheck, error: grammarError } = await supabase.functions.invoke('evaluate-submission', {
        body: {
          approach,
          testCases,
          code,
          timeComplexity: "O(n)", // You might want to make these dynamic
          spaceComplexity: "O(1)",
          questionId: "1", // This should come from props
          sessionId: "1", // This should come from props
          userId: session.user.id,
          timeSpentSeconds: timeSpent,
          checkGrammar: true
        },
      });

      if (grammarError) {
        console.error("Grammar check error:", grammarError);
        throw new Error(grammarError.message || "Failed to check grammar");
      }

      toast({
        title: "Success!",
        description: "Your solution has been submitted for evaluation.",
      });

      // Update submission count
      setSubmissionCount(prev => prev + 1);
    } catch (error) {
      console.error("Submission error:", error);
      
      if (error instanceof Error && error.message.includes("refresh_token")) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Something went wrong",
        description: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred while submitting your solution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <QuestionTimer onTimeUpdate={setTimeSpent} />
      
      {submissionCount >= 10 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          You've reached the daily limit of 10 submissions. Please try again tomorrow.
        </div>
      )}

      {currentStep === 0 && (
        <div className="space-y-4">
          <p>Review the example above and make sure you understand the problem.</p>
          <Button onClick={onNext}>I understand</Button>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-4">
          <Textarea
            placeholder="Explain your approach to solving this problem..."
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
          />
          <Button onClick={onNext}>Next</Button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <Textarea
            placeholder="Add your test cases here..."
            value={testCases}
            onChange={(e) => setTestCases(e.target.value)}
          />
          <Button onClick={onNext}>Next</Button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || "")}
          />
          <Button onClick={onNext}>Next</Button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <p>Review your solution before submitting:</p>
          <div className="space-y-2">
            <h4 className="font-medium">Your Approach:</h4>
            <p className="text-sm">{approach}</p>
            <h4 className="font-medium">Your Test Cases:</h4>
            <p className="text-sm">{testCases}</p>
            <h4 className="font-medium">Your Code:</h4>
            <pre className="text-sm bg-muted p-4 rounded-md">{code}</pre>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || submissionCount >= 10}
          >
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        </div>
      )}
    </div>
  );
}