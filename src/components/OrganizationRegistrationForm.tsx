import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function OrganizationRegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: "",
    orgEmail: "",
    orgAddress: "",
    csvFile: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      if (!formData.csvFile) {
        toast({
          title: "Error",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }

      // Upload CSV file
      const fileExt = formData.csvFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("org_csv_files")
        .upload(fileName, formData.csvFile);

      if (uploadError) throw uploadError;

      // Get file URL
      const { data: { publicUrl } } = supabase.storage
        .from("org_csv_files")
        .getPublicUrl(fileName);

      // Generate unique 6-digit code
      const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Save organization details with created_by field
      const { error: insertError } = await supabase
        .from("organization_registrations")
        .insert({
          org_name: formData.orgName,
          org_email: formData.orgEmail,
          org_address: formData.orgAddress,
          csv_file_url: publicUrl,
          unique_code: uniqueCode,
          created_by: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Organization registered successfully",
      });

      // Reset form and refresh data
      setFormData({
        orgName: "",
        orgEmail: "",
        orgAddress: "",
        csvFile: null,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={formData.orgName}
              onChange={(e) =>
                setFormData({ ...formData, orgName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="orgEmail">Organization Email</Label>
            <Input
              id="orgEmail"
              type="email"
              value={formData.orgEmail}
              onChange={(e) =>
                setFormData({ ...formData, orgEmail: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="orgAddress">Organization Address</Label>
            <Input
              id="orgAddress"
              value={formData.orgAddress}
              onChange={(e) =>
                setFormData({ ...formData, orgAddress: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="csvFile">Upload CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  csvFile: e.target.files ? e.target.files[0] : null,
                })
              }
              required
            />
            <p className="text-sm text-muted-foreground mt-2">
              CSV must include columns: name, email, date, time
            </p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register Organization
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}