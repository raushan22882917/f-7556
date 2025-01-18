import { Node } from '@xyflow/react';

export interface FlowNode extends Node {
  data: {
    label: string;
    subTopics?: string[];
    completedSubTopics?: string[];
  };
}