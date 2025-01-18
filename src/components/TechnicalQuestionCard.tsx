import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface TechnicalQuestion {
  id: string;
  question: string;
  expected_answer: string | null;
  difficulty: string;
}

interface TechnicalQuestionCardProps {
  question: TechnicalQuestion;
}

export function TechnicalQuestionCard({ question }: TechnicalQuestionCardProps) {
  const [response, setResponse] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitResponse = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('technical_responses')
        .insert([
          {
            user_id: user?.id,
            question_id: question.id,
            response: response,
          }
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Response submitted",
        description: "Your answer has been recorded successfully.",
      });
      setResponse("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const difficultyColor = {
    Easy: "bg-green-500",
    Medium: "bg-yellow-500",
    Hard: "bg-red-500",
  }[question.difficulty] || "bg-gray-500";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          <Badge className={difficultyColor}>{question.difficulty}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{question.question}</p>
        
        <Textarea
          placeholder="Type your answer here..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="min-h-[100px]"
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
          
          <Button
            onClick={() => submitResponse.mutate()}
            disabled={!response.trim() || submitResponse.isPending}
          >
            {submitResponse.isPending ? "Submitting..." : "Submit Answer"}
          </Button>
        </div>

        {showAnswer && question.expected_answer && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Expected Answer:</h4>
            <p>{question.expected_answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}