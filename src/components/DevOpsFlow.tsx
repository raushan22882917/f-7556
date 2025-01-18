import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './DevOpsFlow.css'; // Import your custom CSS
import FlowNode from './flow/FlowNode';
import SubTopicPanel from './flow/SubTopicPanel';
import { FlowNode as FlowNodeType } from '@/types/flow';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'DevOps Learning Path',
      subTopics: ['Introduction', 'Overview', 'Career Path'],
      completedSubTopics: []
    },
    position: { x: 500, y: 50 },
    className: 'flow-node'
  },
  {
    id: '2',
    data: {
      label: 'Programming Languages',
      subTopics: ['Python', 'JavaScript', 'Go', 'Ruby', 'Shell Scripting'],
      completedSubTopics: []
    },
    position: { x: 300, y: 200 },
    className: 'flow-node'
  },
  {
    id: '3',
    data: {
      label: 'Operating Systems',
      subTopics: ['Linux', 'Unix', 'Windows Server', 'Process Management', 'File Systems'],
      completedSubTopics: []
    },
    position: { x: 700, y: 200 },
    className: 'flow-node'
  },
  {
    id: '4',
    data: {
      label: 'Networking Basics',
      subTopics: ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'SSL/TLS', 'Load Balancing'],
      completedSubTopics: []
    },
    position: { x: 200, y: 400 },
    className: 'flow-node'
  },
  {
    id: '5',
    data: {
      label: 'Version Control',
      subTopics: ['Git Basics', 'Branching', 'Merging', 'Git Flow', 'GitHub'],
      completedSubTopics: []
    },
    position: { x: 800, y: 400 },
    className: 'flow-node'
  },
  {
    id: '6',
    data: {
      label: 'CI/CD',
      subTopics: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Travis CI', 'CircleCI'],
      completedSubTopics: []
    },
    position: { x: 500, y: 400 },
    className: 'flow-node'
  },
  {
    id: '7',
    data: {
      label: 'Monitoring & Logging',
      subTopics: ['Prometheus', 'Grafana', 'ELK Stack', 'Application Monitoring'],
      completedSubTopics: []
    },
    position: { x: 500, y: 600 },
    className: 'flow-node'
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e2-6', source: '2', target: '6', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e6-7', source: '6', target: '7', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } }
];

const nodeTypes = {
  default: FlowNode,
  input: FlowNode,
  output: FlowNode
};

const DevOpsFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = React.useState<FlowNodeType | null>(null);

  const onConnect = React.useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_event: React.MouseEvent, node: FlowNodeType) => {
    setSelectedNode(node);
  };

  const handleSubTopicComplete = (nodeId: string, subTopic: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const completedSubTopics = node.data.completedSubTopics || [];
          const newCompletedSubTopics = completedSubTopics.includes(subTopic)
            ? completedSubTopics.filter((t) => t !== subTopic)
            : [...completedSubTopics, subTopic];

          return {
            ...node,
            data: {
              ...node.data,
              completedSubTopics: newCompletedSubTopics
            },
            className: `flow-node ${newCompletedSubTopics.length === (node.data.subTopics?.length || 0) ? 'completed' : ''}`
          };
        }
        return node;
      })
    );
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className="relative" style={{ width: '100%', height: '800px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {selectedNode && (
        <SubTopicPanel
          node={selectedNode}
          onComplete={handleSubTopicComplete}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};

export default DevOpsFlow;
