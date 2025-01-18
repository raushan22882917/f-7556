import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { ScheduleSessionDialog } from "@/components/ScheduleSessionDialog";
import { JoinSessionDialog } from "@/components/JoinSessionDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AiOutlineInfoCircle, AiOutlineDelete, AiOutlineMail, AiOutlineEdit } from "react-icons/ai";

export default function PeerPractice() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['peer-groups', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('peer_groups')
        .select('*')
        .eq('created_by', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['peer-sessions', user?.id],
    queryFn: async () => {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('peer_sessions')
        .select(`
          *,
          peer_groups (
            name,
            members
          )
        `);
      
      if (sessionsError) throw sessionsError;

      const memberEmails = sessionsData?.flatMap(session => session.peer_groups?.members || []) || [];
      const uniqueEmails = [...new Set(memberEmails)];

      if (uniqueEmails.length === 0) {
        return sessionsData?.map(session => ({
          ...session,
          memberEmails: []
        }));
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .in('email', uniqueEmails);
      
      if (profilesError) throw profilesError;

      const emailMap = new Map(profilesData?.map(profile => [profile.email, profile.email]));
      
      return sessionsData?.map(session => ({
        ...session,
        memberEmails: (session.peer_groups?.members || []).map(email => emailMap.get(email) || email)
      }));
    },
    enabled: !!user,
  });

  const handleQuestionClick = (session: any, index: number) => {
    setSelectedSession(session);
    setSelectedQuestionIndex(index);
  };

  const deleteGroup = (groupId: string) => {
    toast({
      title: "Group deleted",
      description: `Group ${groupId} has been deleted.`,
      variant: "default",
    });
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Peer Practice</h1>
        <div className="space-x-4">
          <Button onClick={() => setCreateGroupOpen(true)}>Create Group</Button>
          <Button onClick={() => setJoinOpen(true)}>Join Session</Button>
        </div>
      </div>

      {isLoadingGroups ? (
        <div>Loading groups...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <div key={group.id} className="p-6 rounded-lg border bg-card">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setScheduleOpen(true);
                    }}
                  >
                    Schedule
                  </Button>
                  <AiOutlineDelete
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteGroup(group.id)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Members: {group.members.length}
              </p>
            </div>
          ))}
        </div>
      )}

      {isLoadingSessions ? (
        <div>Loading sessions...</div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Practice Sessions</h2>
          <Table className="bg-gray-50">
            <TableHeader className="bg-blue-500 text-white">
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions?.map((session) => (
                <TableRow
                  key={session.id}
                  className="hover:bg-gray-100"
                >
                  <TableCell>{session.peer_groups?.name}</TableCell>
                  <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                  <TableCell>{`${session.start_time} - ${session.end_time}`}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AiOutlineMail className="text-gray-500" />
                      <span className="text-sm">
                        {session.memberEmails.join(", ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <AiOutlineInfoCircle
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleQuestionClick(session, 0)} // or any other action
                      />
                      <AiOutlineEdit
                        className="text-yellow-500 cursor-pointer"
                        onClick={() => toast({
                          title: "Edit action",
                          description: "You can implement editing here.",
                          variant: "default",
                        })}
                      />
                      <AiOutlineDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteGroup(session.id)} // Assuming delete session action
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedSession && (
            <div className="mt-6 p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Question {selectedQuestionIndex + 1}
              </h3>
              <p>{selectedSession.questions[selectedQuestionIndex]}</p>
            </div>
          )}
        </div>
      )}

      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
      />
      
      <ScheduleSessionDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        groupId={selectedGroupId}
      />

      <JoinSessionDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
      />
    </div>
  );
}

