import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff } from 'lucide-react';

interface InterviewQuestionCardProps {
  questions: any[];
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  transcription: string;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSubmit: () => Promise<boolean>;
  onNextQuestion: () => void;
}

export function InterviewQuestionCard({
  questions,
  currentQuestion,
  questionNumber,
  totalQuestions,
  transcription,
  isRecording,
  onStartRecording,
  onStopRecording,
  onSubmit,
  onNextQuestion,
}: InterviewQuestionCardProps) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Question {questionNumber} of {totalQuestions}
          </h3>
          <Progress value={progress} className="w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6">{currentQuestion}</p>
        {transcription && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-medium mb-2">Your Response:</p>
            <p>{transcription}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? onStopRecording : onStartRecording}
          className="flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Recording
            </>
          )}
        </Button>
        <Button
          onClick={onNextQuestion}
          disabled={!transcription}
          variant="outline"
        >
          Next Question
        </Button>
      </CardFooter>
    </Card>
  );
}