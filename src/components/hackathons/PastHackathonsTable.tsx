import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Hackathon {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  prize_money?: number;
  status: "upcoming" | "ongoing" | "past";
}

interface PastHackathonsTableProps {
  hackathons: Hackathon[];
}

export const PastHackathonsTable = ({ hackathons }: PastHackathonsTableProps) => {
  const navigate = useNavigate();

  return (
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
};