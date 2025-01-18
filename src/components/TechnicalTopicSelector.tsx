import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TechnicalTopic {
  id: string;
  title: string;
  description: string | null;
}

interface TechnicalTopicSelectorProps {
  topics: TechnicalTopic[];
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
}

export function TechnicalTopicSelector({ 
  topics, 
  selectedTopicId, 
  onSelectTopic 
}: TechnicalTopicSelectorProps) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {topics.map((topic) => (
          <Button
            key={topic.id}
            variant={selectedTopicId === topic.id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onSelectTopic(topic.id)}
          >
            {topic.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}