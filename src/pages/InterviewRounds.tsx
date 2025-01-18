import { PracticeModeCard } from "@/components/PracticeModeCard";
import { UserCog, Code } from "lucide-react";

export default function InterviewRounds() {
  const rounds = [
    {
      title: "HR Round Simulation",
      description: "Prepare for HR interviews by practicing common questions and scenarios.",
      icon: UserCog,
      route: "/hr-interview",
      image: "https://media.gettyimages.com/id/1365436662/photo/successful-partnership.jpg?s=612x612&w=0&k=20&c=B1xspe9Q5WMsLc7Hc9clR8MWUL4bsK1MfUdDNVNR2Xg=",
    },
    {
      title: "Technical Round Simulation",
      description: "Sharpen your technical skills with simulated problem-solving sessions.",
      icon: Code,
      route: "/technical-round",
      image: "",
    },
  ];

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Interview Rounds</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rounds.map((round) => (
          <PracticeModeCard key={round.title} {...round} />
        ))}
      </div>
    </div>
  );
}