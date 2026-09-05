import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../services/api';

function Graph({ refreshKey, studentId, onNodeClick, onGraphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGraph() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get('/graph', {
          params: { student_id: studentId },
        });
        const graphData = response.data;
        onGraphData(graphData.nodes);

        // Convert to React Flow nodes with color based on mastery
        const flowNodes = graphData.nodes.map((node) => {
          let bgColor;
          let label;
          if (node.mastery === null) {
            bgColor = '#9CA3AF';
            label = `${node.label} (Not assessed)`;
          } else {
            if (node.mastery >= 0.8) bgColor = '#10B981'; // Green
            else if (node.mastery >= 0.6) bgColor = '#F59E0B'; // Yellow
            else bgColor = '#EF4444'; // Red
            label = `${node.label} (${(node.mastery * 100).toFixed(0)}%)`;
          }

          return {
            id: node.id,
            data: { label },
            position: node.position,
            sourcePosition: 'right',
            targetPosition: 'left',
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
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (error) {
        console.error('Error fetching graph:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [refreshKey, studentId, setNodes, setEdges]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading your learning map...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm">
        Couldn't load the learning map. Check the backend is running.
      </p>
    );
  }

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