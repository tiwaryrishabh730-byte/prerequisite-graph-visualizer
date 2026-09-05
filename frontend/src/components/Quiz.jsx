import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Quiz({ topic, studentId, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [mastery, setMastery] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/questions/${topic}`);
      setQuestions(response.data);
      setAnswers(new Array(response.data.length).fill(null));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    setQuestions([]);
    setAnswers([]);
    setMastery(null);
    fetchQuestions();
  }, [topic, studentId]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitQuiz = async () => {
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

      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <p className="font-medium text-gray-900 mb-3">{q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
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
        >
          Submit
        </button>
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