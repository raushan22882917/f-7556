import { PracticeModeCard } from "@/components/PracticeModeCard";
import { User, Users, Building } from "lucide-react";

export default function Coding() {
  const codingModes = [
    {
      title: "Solo Coding",
      description: "Enhance your coding skills independently with comprehensive feedback.",
      icon: User,
      route: "/self-practice",
      image: "https://www.yarddiant.com/images/how-to-practice-coding-every-day.jpg",
    },
    {
      title: "Collaborative Coding",
      description: "Work alongside peers to solve problems and learn collectively.",
      icon: Users,
      route: "/peer-practice",
      image: "https://www.codio.com/hubfs/Blog_EN_PICS/August%202021%20Blog%20-%20Collaborative%20Coding%20in%20Codio.png#keepProtocol",
    },
    {
      title: "Team Coding",
      description: "Join your organization's coding sessions to practice and collaborate.",
      icon: Building,
      route: "/team-coding",
      image: "https://savvytokyo.scdn3.secure.raxcdn.com/app/uploads/2023/10/LINE_ALBUM_1-Monday_231016_4.jpg",
    },
    {
      title: "Company Wise Questions",
      description: "Browse and practice coding questions by your company's previous year questions.",
      icon: Building,
      route: "/company-questions",
      image: "https://savvytokyo.scdn3.secure.raxcdn.com/app/uploads/2023/10/LINE_ALBUM_1-Monday_231016_4.jpg",
    },
    
  ];

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Coding Practice</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {codingModes.map((mode) => (
          <PracticeModeCard key={mode.title} {...mode} />
        ))}
      </div>
    </div>
  );
}