import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageSquare, Hash, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function TrendingTopics() {
  const [trendingDiscussions, setTrendingDiscussions] = useState<any[]>([]);
  const [trendingResources, setTrendingResources] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrendingContent();
  }, []);

  const fetchTrendingContent = async () => {
    try {
      console.log("Fetching trending content...");
      
      // Fetch trending discussions (questions with most likes/responses)
      const { data: discussions, error: discussionsError } = await supabase
        .from("community_questions")
        .select(`
          *,
          responses:question_responses(count)
        `)
        .order("likes", { ascending: false })
        .limit(5);

      if (discussionsError) throw discussionsError;
      console.log("Fetched trending discussions:", discussions);
      setTrendingDiscussions(discussions || []);

      // Fetch trending resources (most downloaded/viewed)
      const { data: resources, error: resourcesError } = await supabase
        .from("resources")
        .select("*")
        .order("downloads", { ascending: false })
        .limit(5);

      if (resourcesError) throw resourcesError;
      console.log("Fetched trending resources:", resources);
      setTrendingResources(resources || []);

    } catch (error) {
      console.error("Error fetching trending content:", error);
      toast({
        title: "Error",
        description: "Failed to load trending content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Trending Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingDiscussions.map((discussion) => (
              <div key={discussion.id} className="border-b pb-2 last:border-0">
                <h3 className="font-medium">{discussion.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>{discussion.likes} likes</span>
                  <div className="flex flex-wrap gap-1">
                    {discussion.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Trending Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingResources.map((resource) => (
              <div key={resource.id} className="border-b pb-2 last:border-0">
                <h3 className="font-medium">{resource.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>{resource.downloads} downloads</span>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrendingTopics;