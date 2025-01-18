import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

interface QuestionSelectorProps {
  questions: Question[];
  selectedQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
}

export function QuestionSelector({ 
  questions, 
  selectedQuestionIndex, 
  onSelectQuestion 
}: QuestionSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {questions.map((_, index) => (
        <Button
          key={index}
          variant={selectedQuestionIndex === index ? "default" : "outline"}
          onClick={() => onSelectQuestion(index)}
        >
          Question {index + 1}
        </Button>
      ))}
    </div>
  );
}