import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'algebra',
    data: { label: 'Basic Algebra' },
    position: { x: 100, y: 100 },
    style: { background: '#10B981', color: 'white', padding: '10px', borderRadius: '8px' },
  },
  {
    id: 'factorization',
    data: { label: 'Factorization' },
    position: { x: 300, y: 100 },
    style: { background: '#EF4444', color: 'white', padding: '10px', borderRadius: '8px' },
  },
  {
    id: 'quadratics',
    data: { label: 'Quadratic Equations' },
    position: { x: 500, y: 100 },
    style: { background: '#F59E0B', color: 'white', padding: '10px', borderRadius: '8px' },
  },
  {
    id: 'applications',
    data: { label: 'Applications' },
    position: { x: 700, y: 100 },
    style: { background: '#6B7280', color: 'white', padding: '10px', borderRadius: '8px' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'algebra', target: 'factorization' },
  { id: 'e2-3', source: 'factorization', target: 'quadratics' },
  { id: 'e3-4', source: 'quadratics', target: 'applications' },
];

function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Graph;