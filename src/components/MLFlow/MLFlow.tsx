import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './MLFlow.css'; // Custom styles
import FlowNode from '../flow/FlowNode';
import SubTopicPanel from '../flow/SubTopicPanel';
import { FlowNode as FlowNodeType } from '@/types/flow';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Machine Learning Learning Path' }, position: { x: 500, y: 50 }, className: 'flow-node' },
  { id: '2', data: { label: 'Mathematical Foundations' }, position: { x: 300, y: 200 }, className: 'flow-node' },
  { id: '3', data: { label: 'Data Preprocessing' }, position: { x: 700, y: 200 }, className: 'flow-node' },
  { id: '4', data: { label: 'ML Algorithms' }, position: { x: 200, y: 400 }, className: 'flow-node' },
  { id: '5', data: { label: 'Model Evaluation' }, position: { x: 500, y: 400 }, className: 'flow-node' },
  { id: '6', data: { label: 'Deep Learning' }, position: { x: 800, y: 400 }, className: 'flow-node' }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } },
  { id: 'e5-6', source: '5', target: '6', animated: true, type: 'smoothstep', style: { stroke: 'gray', strokeDasharray: '5,5' } }
];

const nodeTypes = { default: FlowNode, input: FlowNode, output: FlowNode };

const MLFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = React.useState<FlowNodeType | null>(null);

  const onConnect = React.useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative" style={{ width: '100%', height: '800px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default MLFlow;
