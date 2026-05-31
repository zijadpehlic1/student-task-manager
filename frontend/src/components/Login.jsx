import { useState } from 'react'

function Login({ onBack, onLogin }) {
  const [email, setEmail] = useState('student@example.com')
  const [password, setPassword] = useState('prezentacija')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin()
  }

  return (
    <section className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Mock prijava</p>
        <h1>Dobrodošli nazad</h1>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@example.com"
            required
          />
        </label>
        <label>
          Lozinka
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="prezentacija"
            required
          />
        </label>
        <button className="primary-button" type="submit">
          Prijava
        </button>
        <button className="link-button" type="button" onClick={onBack}>
          Nazad na početnu
        </button>
      </form>
    </section>
  )
}

export default Login
