import React, { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const response = await api.get('/graph');
        setGraphData(response.data);
        console.log('Graph data:', response.data);
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    }
    fetchGraph();
  }, []);

  return (
    <div>
      <h1>PreqViz</h1>
      {graphData ? (
        <pre>{JSON.stringify(graphData, null, 2)}</pre>
      ) : (
        <p>Loading graph...</p>
      )}
    </div>
  );
}

export default App;