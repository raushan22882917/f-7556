import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus, ThumbsUp, MessageCircle, Tag, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: string;
  title: string;
  content: string;
  likes: number;
  created_at: string;
  user_id: string;
  category: string;
  tags: string[];
  is_solved: boolean;
  responses: Array<{
    id: string;
    content: string;
    likes: number;
    created_at: string;
    user_id: string;
  }>;
}

export function AskQuestion() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: questions, refetch } = useQuery({
    queryKey: ["community-questions"],
    queryFn: async () => {
      console.log("Fetching questions...");
      const { data: questions, error } = await supabase
        .from("community_questions")
        .select(`
          *,
          responses:question_responses(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }
      console.log("Fetched questions:", questions);
      return questions as Question[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a question.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("community_questions").insert({
        title,
        content,
        category,
        tags,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Question posted successfully!",
        description: "Your question has been shared with the community.",
      });

      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      refetch();
    } catch (error) {
      console.error("Error posting question:", error);
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredQuestions = questions?.filter(question => 
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleSolved = async (questionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("community_questions")
        .update({ is_solved: !currentStatus })
        .eq("id", questionId);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error("Error updating question status:", error);
      toast({
        title: "Error",
        description: "Failed to update question status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              Start a Discussion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Discussion title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Behavioral">Behavioral</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
              <Input
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1"
              />
            </div>
            <Textarea
              placeholder="What would you like to discuss?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[100px]"
            />
            <Button type="submit" className="w-full">
              Post Discussion
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {filteredQuestions?.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onToggleSolved={handleToggleSolved}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onToggleSolved,
  refetch,
}: {
  question: Question;
  onToggleSolved: (id: string, currentStatus: boolean) => Promise<void>;
  refetch: () => void;
}) {
  const [response, setResponse] = useState("");
  const [showResponseInput, setShowResponseInput] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a response.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("question_responses").insert({
        question_id: question.id,
        content: response,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Response added successfully!",
        description: "Your response has been posted.",
      });

      setResponse("");
      setShowResponseInput(false);
      refetch();
    } catch (error) {
      console.error("Error posting response:", error);
      toast({
        title: "Error",
        description: "Failed to post your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>{question.title}</span>
          {question.is_solved && (
            <span className="text-success text-sm font-normal">
              ✓ Solved
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Posted on {new Date(question.created_at).toLocaleDateString()}</span>
          <span>•</span>
          <span className="bg-primary/10 px-2 py-1 rounded-full text-xs">
            {question.category}
          </span>
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{question.content}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            {question.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowResponseInput(!showResponseInput)}
          >
            <MessageCircle className="h-4 w-4" />
            {question.responses?.length || 0} Responses
          </Button>
          {user && user.id === question.user_id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleSolved(question.id, question.is_solved)}
            >
              {question.is_solved ? "Mark as Unsolved" : "Mark as Solved"}
            </Button>
          )}
        </div>

        {showResponseInput && (
          <form onSubmit={handleSubmitResponse} className="space-y-2">
            <Textarea
              placeholder="Write your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
            <Button type="submit" size="sm">
              Submit Response
            </Button>
          </form>
        )}

        {question.responses && question.responses.length > 0 && (
          <div className="space-y-4 mt-4 border-t pt-4">
            <h3 className="font-semibold">Responses</h3>
            {question.responses.map((response) => (
              <div
                key={response.id}
                className="bg-muted p-4 rounded-lg space-y-2"
              >
                <p>{response.content}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {response.likes}
                  </Button>
                  <span>·</span>
                  <span>
                    {new Date(response.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}