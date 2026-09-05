import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Heatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHeatmap() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get('/teacher/class/10A/heatmap');
        setHeatmapData(response.data);
      } catch (error) {
        console.error('Error fetching heatmap:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHeatmap();
  }, []);

  const getCellColor = (score) => {
    if (score === null) return '#9CA3AF';
    if (score >= 0.8) return '#10B981'; // Green
    if (score >= 0.6) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">10th Grade A</p>
      {loading && <p className="text-gray-500 text-sm">Loading heatmap...</p>}
      {error && (
        <p className="text-red-600 text-sm">
          Couldn't load the heatmap. Check the backend is running.
        </p>
      )}
      {!loading && !error && (
        <>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Student</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Algebra</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Factorization</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Quadratics</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Applications</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, i) => (
                <tr key={i}>
                  <td className="font-medium text-gray-900" style={{ borderRight: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>
                    {row.student}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      background: getCellColor(row.algebra),
                      color: 'white',
                    }}
                  >
                    {row.algebra === null ? '—' : `${(row.algebra * 100).toFixed(0)}%`}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      background: getCellColor(row.factorization),
                      color: 'white',
                    }}
                  >
                    {row.factorization === null ? '—' : `${(row.factorization * 100).toFixed(0)}%`}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      background: getCellColor(row.quadratics),
                      color: 'white',
                    }}
                  >
                    {row.quadratics === null ? '—' : `${(row.quadratics * 100).toFixed(0)}%`}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      background: getCellColor(row.applications),
                      color: 'white',
                    }}
                  >
                    {row.applications === null ? '—' : `${(row.applications * 100).toFixed(0)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span style={{ width: '12px', height: '12px', background: '#9CA3AF' }} />
              Not assessed
            </div>
            <div className="flex items-center gap-1">
              <span style={{ width: '12px', height: '12px', background: '#EF4444' }} />
              Below 50%
            </div>
            <div className="flex items-center gap-1">
              <span style={{ width: '12px', height: '12px', background: '#F59E0B' }} />
              50-79%
            </div>
            <div className="flex items-center gap-1">
              <span style={{ width: '12px', height: '12px', background: '#10B981' }} />
              80%+
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Heatmap;