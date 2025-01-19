import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award, Users } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  user_name: string;
  score: number;
  solved_problems: number;
  time_spent: string;
}

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
}

export const LeaderboardTable = ({ leaderboardData }: LeaderboardTableProps) => {
  return (
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
};