import React, { useEffect, useState } from 'react';
import Graph from '../components/Graph';
import Quiz from '../components/Quiz';
import graphData from '../data/graph.json';
import Sidebar from '../components/NavBar';
import api from '../services/api';

function StudentDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('rohit');
  const [selectedTopic, setSelectedTopic] = useState('algebra');
  const [graphNodes, setGraphNodes] = useState([]);
  const [rootCause, setRootCause] = useState(null);
  const selectedTopicLabel = graphData.nodes.find(
    (node) => node.id === selectedTopic
  )?.label;
  const assessedTopics = graphNodes.filter((node) => node.mastery !== null);
  const averageMastery = assessedTopics.length
    ? `${(assessedTopics.reduce((total, node) => total + node.mastery, 0) / assessedTopics.length * 100).toFixed(0)}%`
    : '—';
  const weakestTopic = assessedTopics.length
    ? assessedTopics.reduce((weakest, node) => (
      node.mastery < weakest.mastery ? node : weakest
    )).label
    : '—';

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

  useEffect(() => {
    async function fetchRootCause() {
      setRootCause(null);
      try {
        const response = await api.get(`/student/${selectedStudent}/root-cause`);
        setRootCause(response.data.root_cause ? response.data : null);
      } catch (error) {
        console.error('Error fetching root cause:', error);
      }
    }
    fetchRootCause();
  }, [selectedStudent, refreshKey]);

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Topics assessed</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {assessedTopics.length} / 4
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Average mastery</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{averageMastery}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Weakest topic</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{weakestTopic}</div>
          </div>
        </div>
        {rootCause && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="font-semibold text-amber-900">
              Start here: {rootCause.root_cause.label}
            </div>
            {rootCause.blocked_topics.length > 0 ? (
              <p className="text-sm text-amber-800">
                This is the earliest gap in your prerequisite chain. Strengthening it will unlock{' '}
                {rootCause.blocked_topics.map((topic) => topic.label).join(', ')}.
              </p>
            ) : (
              <p className="text-sm text-amber-800">
                This is the earliest gap in your prerequisite chain.
              </p>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Map</h2>
          <p className="text-sm text-gray-500 mb-4">Click a topic to take its diagnostic</p>
          <Graph
            refreshKey={refreshKey}
            studentId={selectedStudent}
            onGraphData={setGraphNodes}
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
    </div>
  );
}

export default StudentDashboard;