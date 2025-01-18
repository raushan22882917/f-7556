import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackDisplayProps {
  feedback: {
    correctness: number;
    efficiency: number;
    codeStyle: number;
    overallScore: number;
    comments: string;
  };
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <p className="font-medium">Correctness Score: {feedback.correctness}/100</p>
            <div className="h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-full bg-success rounded-full" 
                style={{ width: `${feedback.correctness}%` }}
              />
            </div>
          </div>
          <div>
            <p className="font-medium">Efficiency Score: {feedback.efficiency}/100</p>
            <div className="h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-full bg-info rounded-full" 
                style={{ width: `${feedback.efficiency}%` }}
              />
            </div>
          </div>
          <div>
            <p className="font-medium">Code Style Score: {feedback.codeStyle}/100</p>
            <div className="h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${feedback.codeStyle}%` }}
              />
            </div>
          </div>
          <div>
            <p className="font-medium">Overall Score: {feedback.overallScore}/100</p>
            <div className="h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-full bg-accent rounded-full" 
                style={{ width: `${feedback.overallScore}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Feedback Comments:</h4>
          <p className="text-muted-foreground whitespace-pre-line">{feedback.comments}</p>
        </div>
      </CardContent>
    </Card>
  );
}