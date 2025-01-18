import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SessionListProps {
  sessions: any[];
  onQuestionClick: (session: any, index: number) => void;
  selectedSession: any;
  selectedQuestionIndex: number;
}

export function SessionList({
  sessions,
  onQuestionClick,
  selectedSession,
  selectedQuestionIndex,
}: SessionListProps) {
  const { toast } = useToast();

  const sendSessionEmails = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-session-email', {
        body: { sessionId }
      });

      if (error) throw error;

      toast({
        title: "Emails Sent",
        description: "Session details have been sent to all group members.",
      });
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: "Failed to send session emails. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions?.map((session) => (
          <TableRow key={session.id}>
            <TableCell>{session.peer_groups?.name}</TableCell>
            <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
            <TableCell>{`${session.start_time} - ${session.end_time}`}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {session.peer_questions?.map((_: any, index: number) => (
                  <Button
                    key={index}
                    variant={selectedSession?.id === session.id && selectedQuestionIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => onQuestionClick(session, index)}
                  >
                    Q{index + 1}
                  </Button>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                {session.memberEmails.map((email: string, index: number) => (
                  <span key={index} className="text-sm">{email}</span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendSessionEmails(session.id)}
              >
                Send Emails
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
