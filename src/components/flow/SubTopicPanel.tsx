import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Check, Circle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FlowNode } from '@/types/flow';

interface SubTopicPanelProps {
  node: FlowNode;
  onComplete: (nodeId: string, subTopic: string) => void;
  onClose: () => void;
}

const SubTopicPanel: React.FC<SubTopicPanelProps> = ({ node, onComplete, onClose }) => {
  const navigate = useNavigate();
  const completedCount = node.data.completedSubTopics?.length || 0;
  const totalCount = node.data.subTopics?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleSubTopicClick = (subTopic: string) => {
    onComplete(node.id, subTopic);
    if (node.id === '1' && subTopic === 'Introduction') {
      navigate('/devops-practice');
    }
  };

  const panelStyle = {
    position: 'absolute' as const,
    left: `${node.position.x}px`,
    top: `${node.position.y + 120}px`,
    zIndex: 1000,
    minWidth: '250px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  };

  return (
    <div className="subtopic-panel" style={panelStyle}>
      <div className="flex justify-between items-center mb-4 p-4">
        <h3 className="font-semibold text-lg">{node.data.label}</h3>
        <button 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
      <Progress value={progress} className="mb-4 mx-4" />
      <div className="space-y-2 p-4">
        {node.data.subTopics?.map((subTopic) => {
          const isCompleted = node.data.completedSubTopics?.includes(subTopic);
          return (
            <button
              key={subTopic}
              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => handleSubTopicClick(subTopic)}
            >
              {isCompleted ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <span className={`${isCompleted ? 'text-green-500' : 'text-gray-700'}`}>
                {subTopic}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubTopicPanel;