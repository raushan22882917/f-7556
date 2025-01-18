import { useEffect, useState } from 'react';

interface QuestionTimerProps {
  onTimeUpdate: (seconds: number) => void;
}

export function QuestionTimer({ onTimeUpdate }: QuestionTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-lg font-semibold">
      Time: {formatTime(seconds)}
    </div>
  );
}