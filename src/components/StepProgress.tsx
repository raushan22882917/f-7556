import { Check, CircleDot } from "lucide-react";

interface Step {
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface StepProgressProps {
  steps: Step[];
}

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
            {step.completed ? (
              <Check className="h-4 w-4 text-success" />
            ) : step.current ? (
              <CircleDot className="h-4 w-4 text-info" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-muted" />
            )}
          </div>
          <div className="space-y-1.5">
            <h3 className="font-medium leading-none">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}