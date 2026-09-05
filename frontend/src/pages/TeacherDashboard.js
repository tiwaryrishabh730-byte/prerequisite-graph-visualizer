import React from 'react';
import Heatmap from '../components/Heatmap';
import NavBar from '../components/NavBar';

function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-7xl p-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">PreqViz - Teacher Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Class Heatmap</h2>
          <Heatmap />
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;