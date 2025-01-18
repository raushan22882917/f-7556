import { Navbar } from "@/components/Navbar";
import { ResourceSharing } from "@/components/community/ResourceSharing";
import { Mentorship } from "@/components/community/Mentorship";
import { TrendingTopics } from "@/components/community/TrendingTopics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BookOpen, UserCheck, BarChart, TrendingUp } from "lucide-react";

export function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Sakshatkar Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect, learn, and grow with fellow developers
          </p>
        </div>
        <Tabs defaultValue="discussions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2 lg:mx-auto">
            <TabsTrigger value="discussions" className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded">
              <MessageSquare className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded">
              <TrendingUp className="h-4 w-4" />
              Trending Topics
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded">
              <BookOpen className="h-4 w-4" />
              Upload Resources
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded">
              <UserCheck className="h-4 w-4" />
              Mentorship
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussions">
            {/* Add your component for Discussions */}
          </TabsContent>
          <TabsContent value="trending">
            <TrendingTopics />
          </TabsContent>
          <TabsContent value="resources">
            <ResourceSharing />
          </TabsContent>
          <TabsContent value="mentorship">
            <Mentorship />
          </TabsContent>
          <TabsContent value="industry">
            {/* Add relevant component for Industry Analysis */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Community;
