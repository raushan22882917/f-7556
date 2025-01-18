import { QuestionTimer } from '@/components/QuestionTimer';
import { Clock } from 'lucide-react';

interface InterviewHeaderProps {
  onTimeUpdate: (time: number) => void;
}

export const InterviewHeader = ({ onTimeUpdate }: InterviewHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <Clock className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">HR Interview Session</h1>
      </div>
      <QuestionTimer onTimeUpdate={onTimeUpdate} />
    </div>
  );
};