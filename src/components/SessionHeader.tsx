import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionHeaderProps {
  sessionCode: string;
  userEmail: string;
}

export function SessionHeader({ sessionCode, userEmail }: SessionHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Session Code: {sessionCode}</span>
          <span className="text-sm text-muted-foreground">{userEmail}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to your collaborative coding session!</p>
      </CardContent>
    </Card>
  );
}