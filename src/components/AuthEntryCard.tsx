type AuthEntryCardProps = {
  onLogin: () => void
  onSignup: () => void
}

export function AuthEntryCard({ onLogin, onSignup }: AuthEntryCardProps) {
  return (
    <main className="landing-shell">
      <section className="landing-wrap">
        <div className="landing-copy">
          <p className="landing-eyebrow">Spendly · Expense Tracker</p>
          <h1>Know exactly where every dollar goes.</h1>
          <p className="landing-intro">
            Track daily spending, automate recurring payments, and see weekly, monthly, and yearly trends — all in one fast,
            private dashboard.
          </p>

          <div className="landing-grid">
            <article>
              <h3>Smart tracking</h3>
              <p>Capture every expense with categories and multi-currency support.</p>
            </article>
            <article>
              <h3>Recurring rules</h3>
              <p>Automate weekly, monthly, and yearly entries — no duplicates.</p>
            </article>
            <article>
              <h3>Visual analytics</h3>
              <p>See trends and category breakdowns converted to your base currency.</p>
            </article>
            <article>
              <h3>Fast workflow</h3>
              <p>Search, filter, and edit your entire history in seconds.</p>
            </article>
          </div>
        </div>

        <aside className="landing-cta">
          <h2>Get started</h2>
          <p>Create an account to keep your data private and start tracking in under a minute.</p>
          <div className="landing-actions">
            <button type="button" onClick={onSignup}>
              Sign up
            </button>
            <button type="button" className="ghost-btn" onClick={onLogin}>
              I already have an account
            </button>
          </div>
          <p className="landing-note">Private by default — your data is only visible to your account.</p>
        </aside>
      </section>
    </main>
  )
}
