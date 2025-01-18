import { Progress } from "@/components/ui/progress";

interface TopicProgressProps {
  completed: number;
  total: number;
}

export function TopicProgress({ completed, total }: TopicProgressProps) {
  const percentage = (completed / total) * 100;

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-2" />
      <p className="text-sm text-muted-foreground text-right">
        {percentage.toFixed(0)}% Complete
      </p>
    </div>
  );
}