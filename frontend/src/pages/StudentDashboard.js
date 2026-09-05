import React, { useState } from 'react';
import Graph from '../components/Graph';
import Quiz from '../components/Quiz';
import graphData from '../data/graph.json';

function StudentDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('algebra');
  const selectedTopicLabel = graphData.nodes.find(
    (node) => node.id === selectedTopic
  )?.label;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">PreqViz - Student Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Map</h2>
          <p className="text-sm text-gray-500 mb-4">Click a topic to take its diagnostic</p>
          <Graph
            refreshKey={refreshKey}
            onNodeClick={(topic) => setSelectedTopic(topic)}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Diagnostic Assessment — {selectedTopicLabel}
          </h2>
          <Quiz
            topic={selectedTopic}
            onSubmitted={() => setRefreshKey((key) => key + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;