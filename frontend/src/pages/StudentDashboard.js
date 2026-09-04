import React, { useState } from 'react';
import Graph from '../components/Graph';
import Quiz from '../components/Quiz';

function StudentDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('algebra');

  return (
    <div style={{ padding: '20px' }}>
      <h1>PreqViz - Student Dashboard</h1>
      <h2>Your Learning Map</h2>
      <Graph
        refreshKey={refreshKey}
        onNodeClick={(topic) => setSelectedTopic(topic)}
      />
      <h2>Diagnostic Assessment</h2>
      <Quiz
        topic={selectedTopic}
        onSubmitted={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
}

export default StudentDashboard;