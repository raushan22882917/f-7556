import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              About Sakshatkar
            </h1>
            <p className="text-xl text-muted-foreground">
              Your Journey to Coding Excellence
            </p>
          </div>

          <Card className=" backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Our Mission
                </h2>
                <p className="text-muted-foreground">
                  At Sakshatkar, we're dedicated to helping developers of all skill levels improve their coding abilities through practical, hands-on exercises and real-world problem-solving.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  What We Offer
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Self-paced learning environment</li>
                  <li>Peer programming opportunities</li>
                  <li>Expert mentorship</li>
                  <li>Organization-specific practice sessions</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Our Values
                </h2>
                <p className="text-muted-foreground">
                  We believe in continuous learning, collaboration, and the power of practice. Our platform is built on the principles of accessibility, community support, and practical skill development.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}