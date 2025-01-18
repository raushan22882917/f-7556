import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, InterviewDetails, EvaluationStep } from '@/types/hr-interview';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export function useHRInterview(interviewId: string) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        if (!interviewId) {
          throw new Error('Interview ID is required');
        }

        const { data: interview, error: interviewError } = await supabase
          .from('hr_interviews')
          .select('*')
          .eq('id', interviewId)
          .single();

        if (interviewError) throw interviewError;
        
        const typedInterview: InterviewDetails = {
          ...interview,
          status: interview.status as 'in_progress' | 'completed'
        };
        setInterviewDetails(typedInterview);

        const { data: existingQuestions, error: questionsError } = await supabase
          .from('hr_interview_questions')
          .select('*')
          .eq('interview_id', interviewId);

        if (questionsError) throw questionsError;
        
        const typedQuestions: Question[] = (existingQuestions || []).map(q => ({
          ...q,
          evaluation_steps: Array.isArray(q.evaluation_steps) 
            ? (q.evaluation_steps as unknown as EvaluationStep[])
            : null
        }));
        
        setQuestions(typedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching interview details:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load interview details",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId, toast]);

  const evaluateResponse = async (question: string, response: string) => {
    try {
      const prompt = `
        Evaluate this HR interview response:
        Question: ${question}
        Response: ${response}
        
        Please evaluate in these 5 steps (2 points each, total 10 points):
        1. Relevance to question
        2. Clarity and articulation
        3. Professional demeanor
        4. Specific examples provided
        5. Overall impression
        
        Provide a score for each step and detailed feedback.
      `;

      const groqResponse = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: "llama3-8b-8192",
        }),
      });

      const evaluation = await groqResponse.json();
      const evaluationSteps: EvaluationStep[] = [
        { name: 'Relevance', score: 0 },
        { name: 'Clarity', score: 0 },
        { name: 'Professionalism', score: 0 },
        { name: 'Examples', score: 0 },
        { name: 'Overall', score: 0 }
      ];

      return {
        feedback: evaluation.choices[0].message.content,
        steps: evaluationSteps
      };
    } catch (error) {
      console.error('Error evaluating response:', error);
      throw error;
    }
  };

  const handleResponseSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;

    try {
      const evaluation = await evaluateResponse(
        currentQuestion.question,
        responses[currentQuestion.id]
      );

      const { error } = await supabase
        .from('hr_interview_questions')
        .update({ 
          audio_response_url: null,
          feedback: evaluation.feedback,
          evaluation_steps: evaluation.steps as unknown as Json[]
        })
        .eq('id', currentQuestion.id);

      if (error) throw error;

      toast({
        title: "Response Saved",
        description: "Your answer has been recorded and evaluated.",
      });

      return currentQuestionIndex === questions.length - 1;
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    currentQuestionIndex,
    questions,
    responses,
    setResponses,
    isLoading,
    interviewDetails,
    handleResponseSubmit,
    currentQuestion: questions[currentQuestionIndex],
  };
}