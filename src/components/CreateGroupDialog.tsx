import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleAddEmail = () => {
    if (emails.length < 5) {
      setEmails([...emails, ""]);
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const validEmails = emails.filter(email => email.trim() !== "");
      
      const { data, error } = await supabase
        .from('peer_groups')
        .insert([
          {
            name: groupName,
            members: validEmails,
            created_by: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Group created successfully",
        description: "All members will receive an email invitation.",
      });

      queryClient.invalidateQueries({ queryKey: ['peer-groups'] });
      onOpenChange(false);
      setGroupName("");
      setEmails([""]);
    } catch (error) {
      toast({
        title: "Error creating group",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Practice Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Member Emails (max 5)</Label>
            {emails.map((email, index) => (
              <Input
                key={index}
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder={`Member ${index + 1} email`}
              />
            ))}
            {emails.length < 5 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEmail}
                className="w-full"
              >
                Add Member
              </Button>
            )}
          </div>
          <Button type="submit" className="w-full">Create Group</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}