import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface JoinSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinSessionDialog({ open, onOpenChange }: JoinSessionDialogProps) {
  const [sessionCode, setSessionCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('organization_registrations')
        .select('*')
        .eq('unique_code', sessionCode)
        .single();

      if (error) throw error;

      if (data) {
        navigate(`/practice/${sessionCode}`);
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Invalid session code",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Practice Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionCode">Session Code</Label>
            <Input
              id="sessionCode"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              pattern="[0-9]{6}"
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full">Join Session</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}