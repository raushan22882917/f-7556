import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "upcoming" | "ongoing" | "past";
  banner_image_url?: string;
  organization_image_url?: string;
  prize_money?: number;
  offerings?: string[];
}

export default function AdminHackathon() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching hackathons:", error);
      return;
    }

    if (data) {
      const categorizedHackathons = data.map((hackathon) => {
        const startDate = new Date(hackathon.start_date);
        const endDate = new Date(hackathon.end_date);
        const now = new Date();

        let status: "upcoming" | "ongoing" | "past";
        if (now < startDate) {
          status = "upcoming";
        } else if (now > endDate) {
          status = "past";
        } else {
          status = "ongoing";
        }

        return { ...hackathon, status };
      });

      setHackathons(categorizedHackathons);
    }
  };

  const HackathonList = ({ status }: { status: "upcoming" | "ongoing" | "past" }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {hackathons
        .filter((h) => h.status === status)
        .map((hackathon) => (
          <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{hackathon.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {hackathon.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  Start: {new Date(hackathon.start_date).toLocaleString()}
                </p>
                <p className="text-sm">
                  End: {new Date(hackathon.end_date).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/hackathons/${hackathon.id}/edit`)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hackathon Management</h1>
        <Button onClick={() => navigate("/admin/hackathons/create")}>
          Create New Hackathon
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <HackathonList status="upcoming" />
        </TabsContent>

        <TabsContent value="ongoing">
          <HackathonList status="ongoing" />
        </TabsContent>

        <TabsContent value="past">
          <HackathonList status="past" />
        </TabsContent>
      </Tabs>
    </div>
  );
}