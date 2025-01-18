import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import Calendar from "react-calendar";
import { Trophy, Award, Users } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import { Navbar } from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface LeaderboardEntry {
  rank: number;
  user_name: string;
  score: number;
  solved_problems: number;
  time_spent: string;
}

export default function Hackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [showHackathonTabs, setShowHackathonTabs] = useState(false);
  const [nearestHackathon, setNearestHackathon] = useState<Hackathon | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons();
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const { data: participantsData, error } = await supabase
        .from('hackathon_participants')
        .select(`
          id,
          score,
          time_spent,
          user_id,
          profiles!inner (
            name
          )
        `)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (participantsData) {
        const formattedData: LeaderboardEntry[] = participantsData.map((entry, index) => ({
          rank: index + 1,
          user_name: entry.profiles?.name || 'Anonymous',
          score: entry.score || 0,
          solved_problems: Math.floor(Math.random() * 5) + 1,
          time_spent: `${Math.floor((entry.time_spent || 0) / 60)}h ${(entry.time_spent || 0) % 60}m`
        }));
        setLeaderboardData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

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
      const nextHackathon = categorizedHackathons.find((h) => h.status === "upcoming");
      setNearestHackathon(nextHackathon || null);
    }
  };

  const renderTileContent = ({ date }: { date: Date }) => {
    const hackathonOnDate = hackathons.find(hackathon => {
      const startDate = new Date(hackathon.start_date);
      const endDate = new Date(hackathon.end_date);
      return date >= startDate && date <= endDate;
    });

    if (hackathonOnDate) {
      return (
        <div className="text-xs text-blue-500">
          {hackathonOnDate.title}
        </div>
      );
    }
    return null;
  };

  const LeaderboardTable = () => (
    <div className="rounded-md border backdrop-blur-sm bg-opacity-20 bg-black p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Today's Leaderboard
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Rank</TableHead>
            <TableHead className="text-white">Participant</TableHead>
            <TableHead className="text-white">Score</TableHead>
            <TableHead className="text-white">Problems Solved</TableHead>
            <TableHead className="text-white">Time Spent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.rank} className={entry.rank <= 3 ? "bg-opacity-20 bg-yellow-500" : ""}>
              <TableCell className="text-white font-medium">
                {entry.rank <= 3 ? (
                  <div className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${
                      entry.rank === 1 ? "text-yellow-400" :
                      entry.rank === 2 ? "text-gray-400" :
                      "text-amber-800"
                    }`} />
                    #{entry.rank}
                  </div>
                ) : (
                  `#${entry.rank}`
                )}
              </TableCell>
              <TableCell className="text-white">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {entry.user_name}
                </div>
              </TableCell>
              <TableCell className="text-white">{entry.score}</TableCell>
              <TableCell className="text-white">{entry.solved_problems}</TableCell>
              <TableCell className="text-white">{entry.time_spent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const HackathonList = ({ status }: { status: "upcoming" | "ongoing" }) => (
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

  const PastHackathonsTable = () => (
    <div className="rounded-md border backdrop-blur-sm bg-opacity-20 bg-black">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Start Date</TableHead>
            <TableHead className="text-white">End Date</TableHead>
            <TableHead className="text-white">Prize Pool</TableHead>
            <TableHead className="text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hackathons
            .filter((h) => h.status === "past")
            .map((hackathon) => (
              <TableRow key={hackathon.id}>
                <TableCell className="text-white font-medium">{hackathon.title}</TableCell>
                <TableCell className="text-white">{format(new Date(hackathon.start_date), "PPP")}</TableCell>
                <TableCell className="text-white">{format(new Date(hackathon.end_date), "PPP")}</TableCell>
                <TableCell className="text-white">${hackathon.prize_money || 0}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                    className="text-white hover:text-black"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="containers bg-transparent">
      <Navbar />

      {!showHackathonTabs && (
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Hackathons</h1>
          <p className="text-lg text-gray-200">
            Time Remaining for Next Hackathon:{" "}
            <span className="font-bold text-blue-600">{timeRemaining || "N/A"}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row-reverse items-center mb-8">
        <Calendar
          className="my-6 bg-transparent text-white rounded-lg backdrop-blur-sm bg-opacity-20 bg-black"
          tileContent={renderTileContent}
        />
        <div className="md:ml-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Get Ready to Hack!</h2>
          <ul className="list-disc ml-6 text-gray-200">
            <li>View upcoming, ongoing, and past hackathons</li>
            <li>Register to participate and win prizes</li>
            <li>Track your progress on the leaderboard</li>
          </ul>
        </div>
      </div>

      {!showHackathonTabs && (
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowHackathonTabs(true)}
        >
          Participate
        </Button>
      )}

      {showHackathonTabs && (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="upcoming" className="text-white">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing" className="text-white">Ongoing</TabsTrigger>
            <TabsTrigger value="past" className="text-white">Past</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-white">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <HackathonList status="upcoming" />
          </TabsContent>
          <TabsContent value="ongoing">
            <HackathonList status="ongoing" />
          </TabsContent>
          <TabsContent value="past">
            <PastHackathonsTable />
          </TabsContent>
          <TabsContent value="leaderboard">
            <LeaderboardTable />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
