import { useState } from 'react'

const API_BASE_URL = 'http://localhost:8080'

function Register({ onRegister, onShowLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Registration failed.')
      }

      const user = await response.json()
      onRegister(user)
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">QuizMaster</span>
          <h1>Create Account</h1>
          <p>Start testing your knowledge today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="register-name">Name</label>
          <input
            className="auth-input"
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label className="auth-label" htmlFor="register-email">Email address</label>
          <input
            className="auth-input"
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="auth-label" htmlFor="register-password">Password</label>
          <input
            className="auth-input"
            id="register-password"
            type="password"
            minLength="6"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="auth-label" htmlFor="register-confirm-password">Confirm password</label>
          <input
            className="auth-input"
            id="register-confirm-password"
            type="password"
            minLength="6"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button className="primary-button auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <button className="auth-link" type="button" onClick={onShowLogin}>
          Already have an account? Login
        </button>
      </section>
    </main>
  )
}

export default Register
