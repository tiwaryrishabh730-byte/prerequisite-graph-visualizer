import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../services/api';

function Graph({ refreshKey, onNodeClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const response = await api.get('/graph');
        const graphData = response.data;

        // Convert to React Flow nodes with color based on mastery
        const flowNodes = graphData.nodes.map((node) => {
          let bgColor;
          if (node.mastery >= 0.8) bgColor = '#10B981'; // Green
          else if (node.mastery >= 0.6) bgColor = '#F59E0B'; // Yellow
          else bgColor = '#EF4444'; // Red

          return {
            id: node.id,
            data: { label: `${node.label} (${(node.mastery * 100).toFixed(0)}%)` },
            position: node.position,
            style: {
              background: bgColor,
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 'bold',
            },
          };
        });

        const flowEdges = graphData.edges.map((edge, i) => ({
          id: `e${i}`,
          source: edge.source,
          target: edge.target,
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    }
    fetchGraph();
  }, [refreshKey, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => onNodeClick(node.id)}
        nodesDraggable={false}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Graph;