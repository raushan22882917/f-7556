import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Navbar } from "@/components/Navbar";
import { LeaderboardTable } from "@/components/hackathons/LeaderboardTable";
import { HackathonList } from "@/components/hackathons/HackathonList";
import { PastHackathonsTable } from "@/components/hackathons/PastHackathonsTable";

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
          profiles:profiles!hackathon_participants_user_id_fkey(name)
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
            <HackathonList hackathons={hackathons} status="upcoming" />
          </TabsContent>
          <TabsContent value="ongoing">
            <HackathonList hackathons={hackathons} status="ongoing" />
          </TabsContent>
          <TabsContent value="past">
            <PastHackathonsTable hackathons={hackathons} />
          </TabsContent>
          <TabsContent value="leaderboard">
            <LeaderboardTable leaderboardData={leaderboardData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}