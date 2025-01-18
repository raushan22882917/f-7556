import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Users, UserCheck, Building } from "lucide-react";

const services = [
  {
    title: "Self Practice",
    description: "Practice coding problems at your own pace with detailed feedback.",
    icon: User,
    route: "/self-practice",
    price: "Free",
  },
  {
    title: "Peer Practice",
    description: "Practice with up to 5 peers and learn together.",
    icon: Users,
    route: "/peer-practice",
    price: "$10/month",
  },
  {
    title: "Mentor Practice",
    description: "Get guidance from experienced mentors while solving problems.",
    icon: UserCheck,
    route: "/mentor-practice",
    price: "$29/month",
  },
  {
    title: "Organization Practice",
    description: "Join your organization's coding practice sessions.",
    icon: Building,
    route: "/org-practice",
    price: "Custom",
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect practice mode for your needs
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
            {services.map((service) => (
              <Card key={service.title} className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-white/20 dark:bg-gray-800/80">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 pointer-events-none" />
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                      {service.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-lg">
                    {service.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    onClick={() => navigate(service.route)}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}