import { useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:8080'

// Categories and difficulty levels
const CATEGORIES = ['Java', 'Spring Boot', 'SQL', 'Data Structures', 'General']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function App() {
  // Screen state
  const [screen, setScreen] = useState('home') // 'home', 'quiz', 'results'
  
  // Home screen state
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // Quiz screen state
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Results state
  const [result, setResult] = useState(null)
  const [showReview, setShowReview] = useState(false)

  const currentQuestion = questions[currentIndex]
  const currentSelectedAnswer = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : null

  // Start Quiz - fetch questions with category and difficulty
  const handleStartQuiz = async () => {
    if (!selectedCategory || !selectedDifficulty) {
      setError('Please select both category and difficulty.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/quiz?category=${selectedCategory}&difficulty=${selectedDifficulty}`
      )

      if (!response.ok) {
        throw new Error('Failed to load questions from the backend.')
      }

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        setError(
          'No questions available for the selected category and difficulty.'
        )
        setLoading(false)
        return
      }

      setQuestions(data)
      setCurrentIndex(0)
      setSelectedAnswers({})
      setScreen('quiz')
      setError('')
    } catch (err) {
      setError(
        err.message || 'The backend is not running or the API is unavailable.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Select an answer
  const handleSelectAnswer = (option) => {
    if (!currentQuestion) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }))
  }

  // Submit the quiz and get results
  const submitQuiz = async () => {
    const answers = questions.map((question) => ({
      questionId: question.id,
      answer: selectedAnswers[question.id] || '',
    }))

    // Validate that all questions are answered
    if (answers.some((answer) => !answer.answer)) {
      setError('Please answer all questions before submitting.')
      return
    }

    setLoading(true)
    setError('')

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
      setShowReview(false)
      setScreen('results')
    } catch (err) {
      setError(err.message || 'Could not submit quiz results.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Next button
  const handleNext = () => {
    if (!currentQuestion) return

    // If it's the last question, submit the quiz
    if (currentIndex === questions.length - 1) {
      submitQuiz()
      return
    }

    // Move to next question
    setCurrentIndex((prev) => prev + 1)
  }

  // Go back to home screen and reset all state
  const handleBackToHome = () => {
    setScreen('home')
    setSelectedCategory('')
    setSelectedDifficulty('')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswers({})
    setResult(null)
    setShowReview(false)
    setError('')
  }

  // Try quiz again with same category/difficulty
  const handleTryAgain = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setResult(null)
    setShowReview(false)
    setError('')
    setScreen('quiz')
  }

  // Get performance message based on score
  const getPerformanceMessage = () => {
    if (!result) return ''
    const percentage = (result.correctAnswers / result.totalQuestions) * 100

    if (percentage === 100) return 'Perfect! Outstanding performance! 🎉'
    if (percentage >= 80) return 'Excellent! Great job! 🌟'
    if (percentage >= 60) return 'Great job! Keep practicing! 💪'
    if (percentage >= 40) return 'Good effort! Keep learning! 📚'
    return 'Keep practicing! You will improve! 💡'
  }

  // RENDER: HOME SCREEN
  if (screen === 'home') {
    return (
      <div className="quiz-shell">
        <div className="quiz-card">
          <div className="home-header">
            <h1 className="app-title">QuizMaster</h1>
            <p className="app-tagline">Test your knowledge and challenge yourself</p>
          </div>

          <div className="selection-section">
            <div className="form-group">
              <label className="form-label">Select Category</label>
              <div className="category-grid">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`category-button ${
                      selectedCategory === category ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Difficulty</label>
              <div className="difficulty-grid">
                {DIFFICULTIES.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    className={`difficulty-button ${
                      selectedDifficulty === difficulty ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="actions">
            <button
              type="button"
              className="primary-button start-button"
              onClick={handleStartQuiz}
              disabled={loading || !selectedCategory || !selectedDifficulty}
            >
              {loading ? 'Loading...' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // RENDER: QUIZ SCREEN
  if (screen === 'quiz') {
    if (loading) {
      return (
        <div className="quiz-shell">
          <div className="quiz-card">
            <h1>QuizMaster</h1>
            <p className="status-text">Loading questions...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="quiz-shell">
        <div className="quiz-card">
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-info">
              <span className="question-counter">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="progress-percentage">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {currentQuestion && (
            <>
              {/* Question Metadata */}
              <div className="question-header">
                <span className="meta-badge category-badge">
                  {currentQuestion.category}
                </span>
                <span className="meta-badge difficulty-badge">
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="question-text">{currentQuestion.question}</h2>

              {/* Answer Options */}
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
                      <span className="option-text">{option}</span>
                    </button>
                  )
                })}
              </div>

              {/* Error Message */}
              {error && <p className="error-text">{error}</p>}

              {/* Action Buttons */}
              <div className="actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleBackToHome}
                >
                  Home
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleNext}
                  disabled={!currentSelectedAnswer || loading}
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

  // RENDER: RESULTS SCREEN
  if (screen === 'results' && result) {
    const percentage = Math.round(
      (result.correctAnswers / result.totalQuestions) * 100
    )
    const performanceMessage = getPerformanceMessage()

    return (
      <div className="quiz-shell">
        <div className="quiz-card result-card">
          <div className="result-header">
            <h1>Quiz Completed!</h1>
            <p className="performance-message">{performanceMessage}</p>
          </div>

          {/* Score Display */}
          <div className="score-display">
            <div className="score-circle">
              <div className="score-percentage">{percentage}%</div>
              <div className="score-label">Accuracy</div>
            </div>
          </div>

          {/* Result Metrics */}
          <div className="result-grid">
            <div className="result-item">
              <div className="result-number">{result.totalQuestions}</div>
              <div className="result-label">Total Questions</div>
            </div>
            <div className="result-item">
              <div className="result-number correct">{result.correctAnswers}</div>
              <div className="result-label">Correct</div>
            </div>
            <div className="result-item">
              <div className="result-number wrong">{result.wrongAnswers}</div>
              <div className="result-label">Wrong</div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="score-bar">
            <div
              className="score-bar-fill correct"
              style={{
                width: `${(result.correctAnswers / result.totalQuestions) * 100}%`,
              }}
            ></div>
            <div
              className="score-bar-fill wrong"
              style={{
                width: `${(result.wrongAnswers / result.totalQuestions) * 100}%`,
              }}
            ></div>
          </div>

          {/* Answer Review */}
          {Array.isArray(result.review) && result.review.length > 0 && (
            <>
              <button
                type="button"
                className="secondary-button review-toggle-button"
                onClick={() => setShowReview((visible) => !visible)}
              >
                {showReview ? 'Hide Answers' : 'Review Answers'}
              </button>

              {showReview && (
                <section className="review-section">
                  <h2 className="review-title">Answer Review</h2>
                  <div className="review-list">
                    {result.review.map((item, index) => (
                      <article
                        className={`review-item ${item.correct ? 'correct' : 'wrong'}`}
                        key={item.questionId || index}
                      >
                        <div className="review-question">
                          <span>Question {index + 1}</span>
                          <strong>{item.correct ? 'Correct' : 'Incorrect'}</strong>
                        </div>
                        <p>{item.question}</p>
                        <div className="review-answer">
                          <span>Your answer</span>
                          <strong>{item.yourAnswer || 'No answer'}</strong>
                        </div>
                        {!item.correct && (
                          <div className="review-answer correct-answer">
                            <span>Correct answer</span>
                            <strong>{item.correctAnswer}</strong>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="actions results-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleBackToHome}
            >
              Back to Home
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleTryAgain}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
