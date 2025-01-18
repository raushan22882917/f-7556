import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface QuestionCardProps {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
}

export function QuestionCard({ id, title, difficulty, tags }: QuestionCardProps) {
  const navigate = useNavigate();

  const difficultyColor = {
    Easy: "bg-success/10 text-success hover:bg-success/20",
    Medium: "bg-info/10 text-info hover:bg-info/20",
    Hard: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  }[difficulty];

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => navigate(`/solve/${id}`)}
        >
          Solve Challenge
        </Button>
      </CardFooter>
    </Card>
  );
}