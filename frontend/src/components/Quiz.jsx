import React, { useState } from 'react';
import api from '../services/api';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [mastery, setMastery] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions/quadratics');
      setQuestions(response.data);
      setAnswers(new Array(response.data.length).fill(null));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    try {
      const formattedAnswers = questions.map((q, i) => ({
        question_id: q.id,
        selected_answer: answers[i],
        is_correct: answers[i] === q.correct,
      }));

      const response = await api.post('/submit-quiz', {
        answers: formattedAnswers,
      });

      setMastery(response.data.mastery);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <div>
      <h2>Diagnostic Quiz</h2>
      <button onClick={fetchQuestions}>Start Quiz</button>

      {questions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: '20px' }}>
          <p>{q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j} style={{ display: 'block' }}>
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
        <button onClick={submitQuiz}>Submit</button>
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