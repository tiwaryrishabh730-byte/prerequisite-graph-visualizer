import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Heatmap() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    async function fetchHeatmap() {
      try {
        const response = await api.get('/teacher/class/10A/heatmap');
        setHeatmapData(response.data);
      } catch (error) {
        console.error('Error fetching heatmap:', error);
      }
    }
    fetchHeatmap();
  }, []);

  const getCellColor = (score) => {
    if (score >= 0.8) return '#10B981'; // Green
    if (score >= 0.6) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div>
      <h2>Class Heatmap - 10th Grade A</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Student</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Algebra</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Factorization</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quadratics</th>
          </tr>
        </thead>
        <tbody>
          {heatmapData.map((row, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.student}</td>
              <td
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  background: getCellColor(row.algebra),
                  color: 'white',
                }}
              >
                {(row.algebra * 100).toFixed(0)}%
              </td>
              <td
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  background: getCellColor(row.factorization),
                  color: 'white',
                }}
              >
                {(row.factorization * 100).toFixed(0)}%
              </td>
              <td
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  background: getCellColor(row.quadratics),
                  color: 'white',
                }}
              >
                {(row.quadratics * 100).toFixed(0)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Heatmap;