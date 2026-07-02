import { AuthCard } from './components/AuthCard'
import { AuthEntryCard } from './components/AuthEntryCard'
import { Dashboard } from './components/Dashboard'
import { ToastProvider } from './components/dashboard/Toast'
import { useExpenseTracker } from './hooks/useExpenseTracker'

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}

function AppInner() {
  const tracker = useExpenseTracker()

  if (tracker.loading) {
    return <div className="center">Loading…</div>
  }

  if (!tracker.session) {
    if (tracker.showAuthEntry) {
      return (
        <AuthEntryCard
          onLogin={() => {
            tracker.setAuthMode('login')
            tracker.setShowAuthEntry(false)
          }}
          onSignup={() => {
            tracker.setAuthMode('signup')
            tracker.setShowAuthEntry(false)
          }}
        />
      )
    }

    return (
      <AuthCard
        authMode={tracker.authMode}
        email={tracker.email}
        password={tracker.password}
        confirmPassword={tracker.confirmPassword}
        onEmailChange={(event) => tracker.setEmail(event.target.value)}
        onPasswordChange={(event) => tracker.setPassword(event.target.value)}
        onConfirmPasswordChange={(event) => tracker.setConfirmPassword(event.target.value)}
        onSubmit={tracker.handleAuthSubmit}
        onModeToggle={() => tracker.setAuthMode(tracker.authMode === 'login' ? 'signup' : 'login')}
      />
    )
  }

  return <Dashboard tracker={tracker} />
}
