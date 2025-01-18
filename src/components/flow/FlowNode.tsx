import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Check, Book, Code, Terminal, Network, Server, Container, Cloud, GitBranch, Activity } from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Start Your DevOps Journey': Book,
  'Learn Programming Language': Code,
  'Operating System': Terminal,
  'Managing Servers': Server,
  'Networking & Security': Network,
  'Web Servers': Server,
  'Containers': Container,
  'Container Orchestration': Cloud,
  'Infrastructure as Code': GitBranch,
  'CI/CD & Monitoring': Activity,
};

interface FlowNodeProps {
  data: {
    label: string;
    subTopics?: string[];
    completedSubTopics?: string[];
  };
  isConnectable: boolean;
}

const FlowNode: React.FC<FlowNodeProps> = ({ data }) => {
  const Icon = iconMap[data.label] || Book;
  const completedCount = data.completedSubTopics?.length || 0;
  const totalCount = data.subTopics?.length || 0;
  
  return (
    <div className="flow-node">
      <Icon className="w-6 h-6 mb-2" />
      <div className="text-sm font-medium">{data.label}</div>
      {completedCount === totalCount && totalCount > 0 && (
        <Check className="w-4 h-4 text-green-500" />
      )}
      <div className="text-xs text-gray-500">
        {completedCount}/{totalCount} completed
      </div>
    </div>
  );
};

export default FlowNode;