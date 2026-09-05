import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Quiz({ topic, studentId, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [mastery, setMastery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get(`/questions/${topic}`);
      setQuestions(response.data);
      setAnswers(new Array(response.data.length).fill(null));
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuestions([]);
    setAnswers([]);
    setMastery(null);
    setSubmitError(false);
    fetchQuestions();
  }, [topic, studentId]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      const formattedAnswers = questions.map((q, i) => ({
        question_id: q.id,
        topic: q.topic,
        selected_answer: answers[i],
        is_correct: answers[i] === q.correct,
      }));

      const response = await api.post('/submit-quiz', {
        answers: formattedAnswers,
        student_id: studentId,
      });

      setMastery(response.data.mastery);
      onSubmitted();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium mb-6"
        onClick={fetchQuestions}
      >
        Start Quiz
      </button>

      {loading && <p className="text-gray-500 text-sm">Loading questions...</p>}
      {error && (
        <p className="text-red-600 text-sm">
          Couldn't load the questions. Check the backend is running.
        </p>
      )}
      {!loading && !error && questions.map((q, i) => (
        <div key={q.id} className="mb-8">
          <p className="text-base font-medium text-gray-900 mb-3">{q.question}</p>
          {q.options.map((opt, j) => (
            <label
              key={j}
              className={`flex w-full items-center gap-2 border rounded-lg px-4 py-3 mb-2 cursor-pointer hover:border-blue-400 transition-colors ${
                answers[i] === j ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input
                className="h-4 w-4 shrink-0"
                type="radio"
                name={`question-${i}`}
                onChange={() => handleAnswerChange(i, j)}
                checked={answers[i] === j}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {answers.length > 0 && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
          onClick={submitQuiz}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      )}

      {submitError && (
        <p className="text-red-600 text-sm">Couldn't submit your answers. Try again.</p>
      )}

      {mastery && (
        <div>
          <h3>Your Mastery:</h3>
          <pre>{JSON.stringify(mastery, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Quiz;