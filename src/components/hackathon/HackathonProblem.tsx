import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

interface HackathonProblemProps {
  problem: {
    id: string;
    title: string;
    description: string;
    test_cases: TestCase[];
  };
  hackathonId: string;
}

export function HackathonProblem({ problem, hackathonId }: HackathonProblemProps) {
  const [code, setCode] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit solutions",
          variant: "destructive",
        });
        return;
      }

      // Create a session for this hackathon attempt
      const { data: sessionData, error: sessionError } = await supabase
        .from("interview_sessions")
        .insert([
          { user_id: user.id }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      const { error } = await supabase.from("submissions").insert([
        {
          user_id: user.id,
          question_id: problem.id,
          session_id: sessionData.id,
          code,
          language: "javascript", // You might want to make this dynamic
          approach: "Direct solution", // Default approach description
          test_cases: "[]", // Default empty test cases
          time_complexity: "O(n)", // Default time complexity
          space_complexity: "O(n)", // Default space complexity
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Solution submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast({
        title: "Error",
        description: "Failed to submit solution. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="h-[calc(100vh-2rem)] overflow-auto">
        <CardHeader>
          <CardTitle>{problem.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose dark:prose-invert">
            <p>{problem.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sample Test Cases</h3>
            {problem.test_cases
              .filter((tc) => !tc.is_hidden)
              .map((tc, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Input:</strong> {tc.input}
                  </p>
                  <p>
                    <strong>Expected Output:</strong> {tc.expected_output}
                  </p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <CodeEditor value={code} onChange={(value) => setCode(value || "")} />
        <Button onClick={handleSubmit} className="w-full">
          Submit Solution
        </Button>
      </div>
    </div>
  );
}