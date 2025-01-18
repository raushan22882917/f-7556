import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Trophy, Gift } from "lucide-react";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  banner_image_url?: string;
  organization_image_url?: string;
  prize_money?: number;
  offerings?: string[];
  rules?: string;
}

export default function HackathonDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathonDetails();
  }, [id]);

  const fetchHackathonDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setHackathon(data);
    } catch (error: any) {
      console.error("Error fetching hackathon details:", error);
      toast({
        title: "Error",
        description: "Failed to load hackathon details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!hackathon) return <div>Hackathon not found</div>;

  return (
    <div className="container py-8">
      {hackathon.banner_image_url && (
        <div className="relative w-full h-64 mb-8">
          <img
            src={hackathon.banner_image_url}
            alt={hackathon.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center gap-6 mb-8">
        {hackathon.organization_image_url && (
          <img
            src={hackathon.organization_image_url}
            alt="Organization"
            className="w-16 h-16 rounded-full"
          />
        )}
        <h1 className="text-4xl font-bold">{hackathon.title}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About the Hackathon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{hackathon.description}</p>
            
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(hackathon.start_date).toLocaleDateString()} - 
                  {new Date(hackathon.end_date).toLocaleDateString()}
                </span>
              </div>
              
              {hackathon.prize_money && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>Prize Pool: ${hackathon.prize_money}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What You Get</CardTitle>
          </CardHeader>
          <CardContent>
            {hackathon.offerings && hackathon.offerings.length > 0 ? (
              <ul className="space-y-2">
                {hackathon.offerings.map((offering, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    <span>{offering}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No offerings specified</p>
            )}
          </CardContent>
        </Card>

        {hackathon.rules && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{hackathon.rules}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}