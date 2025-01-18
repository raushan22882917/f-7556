import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Download, Eye } from "lucide-react";
import { OrganizationRegistrationForm } from "@/components/OrganizationRegistrationForm";
import { JoinSessionDialog } from "@/components/JoinSessionDialog";

interface Organization {
  id: string;
  org_name: string;
  org_email: string;
  org_address: string;
  csv_file_url: string;
  unique_code: string;
  created_at: string;
}

export default function TeamCoding() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to continue",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("organization_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
      return;
    }

    setOrganizations(data);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-end mb-6">
        <Button onClick={() => setJoinDialogOpen(true)}>
          Join Session
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <OrganizationRegistrationForm onSuccess={fetchOrganizations} />

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Prepare a CSV file with the following columns:
                <ul className="list-disc list-inside ml-4">
                  <li>name</li>
                  <li>email</li>
                  <li>date</li>
                  <li>time</li>
                </ul>
              </li>
              <li>Fill in your organization details in the form</li>
              <li>Upload the CSV file with team member information</li>
              <li>After registration, each team member will receive a unique 6-digit code</li>
              <li>Team members can use their code to access the practice session</li>
            </ul>
          </CardContent>
        </Card>

        {/* Organizations List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Registered Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{org.org_name}</h3>
                    <p className="text-sm text-muted-foreground">{org.org_email}</p>
                    <p className="text-sm text-muted-foreground">{org.org_address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(org.csv_file_url, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = org.csv_file_url;
                        link.download = "team_members.csv";
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <JoinSessionDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
      />
    </div>
  );
}