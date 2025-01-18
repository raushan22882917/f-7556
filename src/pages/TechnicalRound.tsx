import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechnicalQuestionCard } from "@/components/TechnicalQuestionCard";
import { TechnicalTopicSelector } from "@/components/TechnicalTopicSelector";
import { useToast } from "@/hooks/use-toast";

export default function TechnicalRound() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ['technical-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_topics')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['technical-questions', selectedTopicId],
    queryFn: async () => {
      if (!selectedTopicId) return [];
      
      const { data, error } = await supabase
        .from('technical_questions')
        .select('*')
        .eq('topic_id', selectedTopicId)
        .order('difficulty');
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTopicId
  });

  if (isLoadingTopics) {
    return <div>Loading topics...</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Technical Interview Practice</h1>
      
      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <TechnicalTopicSelector 
              topics={topics || []}
              selectedTopicId={selectedTopicId}
              onSelectTopic={setSelectedTopicId}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoadingQuestions ? (
            <div>Loading questions...</div>
          ) : questions?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p>Select a topic to view questions</p>
              </CardContent>
            </Card>
          ) : (
            questions?.map((question) => (
              <TechnicalQuestionCard 
                key={question.id}
                question={question}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}