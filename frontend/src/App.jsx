import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:8080'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/quiz`)

      if (!response.ok) {
        throw new Error('Failed to load questions from the backend.')
      }

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        setQuestions([])
        setError('No questions available right now.')
        return
      }

      setQuestions(data)
    } catch (err) {
      setError(
        err.message || 'The backend is not running or the API is unavailable.'
      )
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = questions[currentIndex]
  const currentSelectedAnswer = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : null

  const handleSelectAnswer = (option) => {
    if (!currentQuestion) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }))
  }

  const submitQuiz = async () => {
    const answers = questions.map((question) => ({
      questionId: question.id,
      answer: selectedAnswers[question.id] || '',
    }))

    if (answers.some((answer) => !answer.answer)) {
      setError('Please answer all questions before submitting.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      })

      if (!response.ok) {
        throw new Error('Unable to submit the quiz.')
      }

      const data = await response.json()
      setResult(data)
      setError('')
    } catch (err) {
      setError(err.message || 'Could not submit quiz results.')
    }
  }

  const handleNext = () => {
    if (!currentQuestion) return

    if (currentIndex === questions.length - 1) {
      submitQuiz()
      return
    }

    setCurrentIndex((prev) => prev + 1)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setResult(null)
    setError('')
    fetchQuestions()
  }

  if (loading) {
    return (
      <div className="quiz-shell">
        <div className="quiz-card">
          <h1>Quiz App</h1>
          <p className="status-text">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0 && !result) {
    return (
      <div className="quiz-shell">
        <div className="quiz-card error-card">
          <h1>Quiz App</h1>
          <p className="error-text">{error}</p>
          <button className="primary-button" onClick={fetchQuestions}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="quiz-shell">
        <div className="quiz-card result-card">
          <h1>Quiz Completed</h1>
          <p className="final-score">Your score: {result.score} / {result.totalQuestions}</p>
          <div className="result-metrics">
            <span>Correct: {result.correctAnswers}</span>
            <span>Wrong: {result.wrongAnswers}</span>
          </div>
          <button className="primary-button" onClick={handleRestart}>
            Restart Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-shell">
      <div className="quiz-card">
        <p className="quiz-label">Quiz Title</p>
        <h1>General Knowledge Quiz</h1>

        {currentQuestion && (
          <>
            <p className="question-meta">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <h2 className="question-text">{currentQuestion.question}</h2>

            <div className="options">
              {['option1', 'option2', 'option3', 'option4'].map((key) => {
                const option = currentQuestion[key]
                if (!option) return null

                const isSelected = currentSelectedAnswer === option

                return (
                  <button
                    key={key}
                    type="button"
                    className={`option-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(option)}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={!currentSelectedAnswer}
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
