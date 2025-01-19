import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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

interface HackathonListProps {
  hackathons: Hackathon[];
  status: "upcoming" | "ongoing";
}

export const HackathonList = ({ hackathons, status }: HackathonListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {hackathons
        .filter((h) => h.status === status)
        .map((hackathon) => (
          <Card key={hackathon.id} className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-opacity-20 bg-black">
            {hackathon.banner_image_url && (
              <div className="relative w-full h-32">
                <img
                  src={hackathon.banner_image_url}
                  alt={hackathon.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-4">
                {hackathon.organization_image_url && (
                  <img
                    src={hackathon.organization_image_url}
                    alt="Organization"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <CardTitle className="text-white">{hackathon.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-white">
              <p className="text-sm text-gray-300 mb-4">
                {hackathon.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Start:</strong> {format(new Date(hackathon.start_date), "PPP")}
                </p>
                <p className="text-sm">
                  <strong>End:</strong> {format(new Date(hackathon.end_date), "PPP")}
                </p>
                {hackathon.prize_money && (
                  <p className="text-sm font-semibold">
                    <strong>Prize Pool:</strong> ${hackathon.prize_money}
                  </p>
                )}
              </div>
              <Button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate(`/hackathons/${hackathon.id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};