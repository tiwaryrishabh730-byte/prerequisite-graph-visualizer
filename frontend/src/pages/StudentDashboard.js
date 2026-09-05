import React, { useEffect, useState } from 'react';
import Graph from '../components/Graph';
import Quiz from '../components/Quiz';
import graphData from '../data/graph.json';
import NavBar from '../components/NavBar';
import api from '../services/api';

function StudentDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('rohit');
  const [selectedTopic, setSelectedTopic] = useState('algebra');
  const selectedTopicLabel = graphData.nodes.find(
    (node) => node.id === selectedTopic
  )?.label;

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }
    fetchStudents();
  }, []);

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-7xl p-5">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">PreqViz - Student Dashboard</h1>
          <label htmlFor="student-select" className="text-sm font-medium text-gray-700">
            Viewing as:
          </label>
          <select
            id="student-select"
            className="border rounded px-3 py-2 text-sm"
            value={selectedStudent}
            onChange={handleStudentChange}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Map</h2>
          <p className="text-sm text-gray-500 mb-4">Click a topic to take its diagnostic</p>
          <Graph
            refreshKey={refreshKey}
            studentId={selectedStudent}
            onNodeClick={(topic) => setSelectedTopic(topic)}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Diagnostic Assessment — {selectedTopicLabel}
          </h2>
          <Quiz
            topic={selectedTopic}
            studentId={selectedStudent}
            onSubmitted={() => setRefreshKey((key) => key + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;