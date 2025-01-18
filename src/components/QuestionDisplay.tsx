import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface QuestionDisplayProps {
  title: string;
  description: string;
  examples: Example[];
}

export function QuestionDisplay({ title, description, examples }: QuestionDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert">
          <p>{description}</p>
          <h3>Examples:</h3>
          {examples.map((example, index) => (
            <div key={index} className="bg-muted p-4 rounded-md mb-4">
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Output:</strong> {example.output}</p>
              {example.explanation && (
                <p><strong>Explanation:</strong> {example.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}