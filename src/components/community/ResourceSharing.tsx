import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Link as LinkIcon, Download, Star, MessageSquare, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadResourceDialog } from "./UploadResourceDialog";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  downloads: number;
  category: string;
  tags: string[];
  author: string;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface Rating {
  rating: number;
  user_id: string;
}

export function ResourceSharing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [ratings, setRatings] = useState<Record<string, Rating[]>>({});
  const [newComment, setNewComment] = useState("");
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*');
      
      if (error) throw error;
      setResources(data || []);

      // Fetch comments and ratings for each resource
      data?.forEach(resource => {
        fetchComments(resource.id);
        fetchRatings(resource.id);
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    }
  };

  const fetchComments = async (resourceId: string) => {
    try {
      const { data, error } = await supabase
        .from('resource_comments')
        .select('*')
        .eq('resource_id', resourceId);
      
      if (error) throw error;
      setComments(prev => ({ ...prev, [resourceId]: data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchRatings = async (resourceId: string) => {
    try {
      const { data, error } = await supabase
        .from('resource_ratings')
        .select('*')
        .eq('resource_id', resourceId);
      
      if (error) throw error;
      setRatings(prev => ({ ...prev, [resourceId]: data || [] }));
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleDownload = async (resource: Resource) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to download resources",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: downloadError } = await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resource.id,
          user_id: user.id
        });

      if (downloadError) throw downloadError;

      const { error: updateError } = await supabase
        .from('resources')
        .update({ downloads: (resource.downloads || 0) + 1 })
        .eq('id', resource.id);

      if (updateError) throw updateError;

      window.open(resource.url, '_blank');
      
      toast({
        title: "Success",
        description: "Resource download started",
      });
      
      fetchResources();
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast({
        title: "Error",
        description: "Failed to download resource",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (resourceId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('resource_comments')
        .insert({
          resource_id: resourceId,
          user_id: user.id,
          content: newComment
        });

      if (error) throw error;

      setNewComment("");
      fetchComments(resourceId);
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleRating = async (resourceId: string, rating: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to rate resources",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('resource_ratings')
        .upsert({
          resource_id: resourceId,
          user_id: user.id,
          rating
        }, {
          onConflict: 'resource_id,user_id'
        });

      if (error) throw error;

      fetchRatings(resourceId);
      
      toast({
        title: "Success",
        description: "Rating updated successfully",
      });
    } catch (error) {
      console.error('Error rating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update rating",
        variant: "destructive",
      });
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAverageRating = (resourceId: string) => {
    const resourceRatings = ratings[resourceId] || [];
    if (resourceRatings.length === 0) return 0;
    const sum = resourceRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((sum / resourceRatings.length) * 10) / 10;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Resources</h2>
        <UploadResourceDialog />
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <select
          className="rounded-md border border-input bg-background px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Programming">Programming</option>
          <option value="Interview">Interview</option>
          <option value="Career">Career</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resource.type === "Link" ? (
                  <LinkIcon className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
                {resource.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {resource.tags?.map(tag => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">{resource.downloads || 0} downloads</span>
                  
                  <MessageSquare className="h-4 w-4 ml-2" />
                  <span className="text-sm">{comments[resource.id]?.length || 0} comments</span>
                  
                  <Star className="h-4 w-4 ml-2" />
                  <span className="text-sm">{getAverageRating(resource.id)}</span>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRating(resource.id, star)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          (ratings[resource.id]?.find(r => r.user_id === user?.id)?.rating || 0) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </Button>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload(resource)}
                >
                  Access Resource
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setSelectedResource(selectedResource === resource.id ? null : resource.id)}
                >
                  {selectedResource === resource.id ? "Hide Comments" : "Show Comments"}
                </Button>

                {selectedResource === resource.id && (
                  <div className="space-y-2 mt-2">
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {comments[resource.id]?.map((comment) => (
                        <div key={comment.id} className="bg-secondary p-2 rounded text-sm">
                          {comment.content}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      <Button onClick={() => handleAddComment(resource.id)}>
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}