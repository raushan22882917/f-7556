import { useState } from "react";
import { PracticeModeCard } from "@/components/PracticeModeCard";
import { Code, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";

export default function Resources() {
  const [activeTab, setActiveTab] = useState("Reading Material");
  const [searchTerm, setSearchTerm] = useState("");

  const resources = {
    "Reading Material": [
      {
        title: "AI-Assisted DevOps",
        description: "Learn about DevOps concepts with AI support.",
        icon: Code,
        route: "/devops-practice",
        image: "https://www.amplework.com/wp-content/uploads/2022/07/DevOps-with-AI.png",
      },
      {
        title: "Machine Learning",
        description: "Guide you for interviews to increase hiring chances.",
        icon: Code,
        route: "/ml-practice",
        image: "https://www.amplework.com/wp-content/uploads/2022/07/DevOps-with-AI.png",
      },
    ],
    "Interview Material": [
      {
        title: "Top 50 DevOps Questions",
        description: "Prepare for DevOps interviews with these top questions.",
        icon: Code,
        route: "/interview/devops-questions",
        image: "https://via.placeholder.com/300x200.png?text=DevOps+Interview+Questions",
      },
      {
        title: "Machine Learning Interview Tips",
        description: "Ace your ML interviews with expert tips and tricks.",
        icon: Code,
        route: "/interview/ml-tips",
        image: "https://via.placeholder.com/300x200.png?text=ML+Interview+Tips",
      },
    ],
    Article: [
      {
        id: "future-devops",
        title: "The Future of DevOps",
        description: "Explore how DevOps is evolving in the AI-driven world.",
        icon: Code,
        route: "/articles/future-devops",
        image: "https://via.placeholder.com/300x200.png?text=Future+of+DevOps",
      },
      {
        id: "neural-networks",
        title: "Understanding Neural Networks",
        description: "Dive deep into the basics of neural networks and their applications.",
        icon: Code,
        route: "/articles/neural-networks",
        image: "https://via.placeholder.com/300x200.png?text=Neural+Networks",
      }
    ]
  };

  const filteredResources = resources[activeTab]?.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {Object.keys(resources).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources?.map((resource, index) => (
            <Link key={index} to={resource.route}>
              <PracticeModeCard {...resource} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}