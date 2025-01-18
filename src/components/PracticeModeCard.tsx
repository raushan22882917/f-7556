import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PracticeModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
}

export function PracticeModeCard({ title, description, icon: Icon, route }: PracticeModeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (title === "AI-Assisted DevOps") {
      navigate("/devops-flow");
    } else {
      navigate(route);
    }
    if (title === "Machine Learning") {
      navigate("/ML-flow");
    } else {
      navigate(route);
    }
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-white/20 dark:bg-gray-800/80">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 pointer-events-none" />
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          onClick={handleClick}
        >
          Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
}