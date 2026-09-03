import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGraph = () => api.get('/graph');
export const getQuestions = (topic) => api.get(`/questions/${topic}`);
export const submitQuiz = (answers) => api.post('/submit-quiz', { answers });
export const getStudentMastery = (studentId) => api.get(`/student/${studentId}/mastery`);
export const getClassHeatmap = (classId) => api.get(`/teacher/class/${classId}/heatmap`);

export default api;