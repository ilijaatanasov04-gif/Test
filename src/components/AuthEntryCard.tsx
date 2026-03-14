type AuthEntryCardProps = {
  onLogin: () => void
  onSignup: () => void
}

export function AuthEntryCard({ onLogin, onSignup }: AuthEntryCardProps) {
  return (
    <main className="app-shell landing-shell">
      <section className="landing-wrap">
        <div className="landing-copy">
          <p className="landing-eyebrow">Expense Tracker Platform</p>
          <h1>Control Spending With Clear, Reliable Insights</h1>
          <p className="landing-intro">
            Track daily expenses, automate recurring payments, and view weekly, monthly, or yearly statistics in one place.
          </p>

          <div className="landing-grid">
            <article>
              <h3>Smart Tracking</h3>
              <p>Capture expense data with category and currency context.</p>
            </article>
            <article>
              <h3>Recurring Rules</h3>
              <p>Automate weekly, monthly, and yearly entries without duplicates.</p>
            </article>
            <article>
              <h3>Analytics</h3>
              <p>View trends and totals converted to your selected base currency.</p>
            </article>
            <article>
              <h3>Fast Workflow</h3>
              <p>Search, filter, and edit records with a focused dashboard experience.</p>
            </article>
          </div>
        </div>

        <aside className="landing-cta">
          <h2>Get Started</h2>
          <p>Create an account to secure your data and start managing expenses in minutes.</p>
          <div className="landing-actions">
            <button type="button" onClick={onSignup}>
              Sign Up
            </button>
            <button type="button" className="ghost-btn" onClick={onLogin}>
              Login
            </button>
          </div>
          <p className="landing-note">Private by default. Your data is visible only to your account.</p>
        </aside>
      </section>
    </main>
  )
}
