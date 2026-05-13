import type { ChangeEvent, FormEvent } from 'react'

type AuthCardProps = {
  authMode: 'login' | 'signup'
  email: string
  password: string
  confirmPassword: string
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onConfirmPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onModeToggle: () => void
}

export function AuthCard({
  authMode,
  email,
  password,
  confirmPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onModeToggle,
}: AuthCardProps) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark">
          <span className="brand-orb">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h15a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
              <path d="M3 7V5a2 2 0 0 1 2-2h11" />
              <circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span>Spendly</span>
        </div>

        <h1>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p>
          {authMode === 'login'
            ? 'Sign in to keep tracking your expenses.'
            : 'Start tracking expenses and stay in control of your money.'}
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={onEmailChange} placeholder="you@example.com" required />
          </div>

          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={onPasswordChange} minLength={6} placeholder="At least 6 characters" required />
          </div>

          {authMode === 'signup' ? (
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                minLength={6}
                placeholder="Repeat your password"
                required
              />
            </div>
          ) : null}

          <button type="submit" style={{ marginTop: 6 }}>
            {authMode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="text-link" onClick={onModeToggle}>
            {authMode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  )
}
