import { AuthCard } from './components/AuthCard'
import { AuthEntryCard } from './components/AuthEntryCard'
import { Dashboard } from './components/Dashboard'
import { APP_OPTIONS, useExpenseTracker } from './hooks/useExpenseTracker'

export default function App() {
  const tracker = useExpenseTracker()

  if (tracker.loading) {
    return <div className="center">Loading...</div>
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

  return (
    <Dashboard
      theme={tracker.theme}
      onToggleTheme={() => tracker.setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      session={tracker.session}
      summary={tracker.summary}
      baseCurrency={tracker.baseCurrency}
      currencies={[...APP_OPTIONS.currencies]}
      onBaseCurrencyChange={(event) => tracker.setBaseCurrency(APP_OPTIONS.normalizeCurrency(event.target.value))}
      expenseDate={tracker.expenseDate}
      category={tracker.category}
      amount={tracker.amount}
      description={tracker.description}
      expenseCurrency={tracker.expenseCurrency}
      categories={[...APP_OPTIONS.categories]}
      recurringItems={tracker.visibleRecurringItems}
      fetchingRecurring={tracker.fetchingRecurring}
      recurringName={tracker.recurringName}
      recurringCategory={tracker.recurringCategory}
      recurringAmount={tracker.recurringAmount}
      recurringCurrency={tracker.recurringCurrency}
      recurringFrequency={tracker.recurringFrequency}
      recurringNextDate={tracker.recurringNextDate}
      searchQuery={tracker.searchQuery}
      onExpenseDateChange={(event) => tracker.setExpenseDate(event.target.value)}
      onCategoryChange={(event) => tracker.setCategory(event.target.value as (typeof APP_OPTIONS.categories)[number])}
      onAmountChange={(event) => tracker.setAmount(event.target.value)}
      onDescriptionChange={(event) => tracker.setDescription(event.target.value)}
      onExpenseCurrencyChange={(event) => tracker.setExpenseCurrency(APP_OPTIONS.normalizeCurrency(event.target.value))}
      onAddExpense={tracker.handleAddExpense}
      onRecurringNameChange={(event) => tracker.setRecurringName(event.target.value)}
      onRecurringCategoryChange={(event) => tracker.setRecurringCategory(event.target.value as (typeof APP_OPTIONS.categories)[number])}
      onRecurringAmountChange={(event) => tracker.setRecurringAmount(event.target.value)}
      onRecurringCurrencyChange={(event) => tracker.setRecurringCurrency(APP_OPTIONS.normalizeCurrency(event.target.value))}
      onRecurringFrequencyChange={(event) => tracker.setRecurringFrequency(APP_OPTIONS.normalizeFrequency(event.target.value))}
      onRecurringNextDateChange={(event) => tracker.setRecurringNextDate(event.target.value)}
      onAddRecurringExpense={tracker.handleAddRecurringExpense}
      onDeleteRecurringExpense={tracker.handleDeleteRecurringExpense}
      onUpdateRecurringExpense={tracker.handleUpdateRecurringExpense}
      selectedCategory={tracker.selectedCategory}
      dateFrom={tracker.dateFrom}
      dateTo={tracker.dateTo}
      statsGranularity={tracker.statsGranularity}
      onCategoryFilterChange={(event) => tracker.setSelectedCategory(event.target.value)}
      onDateFromChange={(event) => tracker.setDateFrom(event.target.value)}
      onDateToChange={(event) => tracker.setDateTo(event.target.value)}
      onSearchQueryChange={(event) => tracker.setSearchQuery(event.target.value)}
      onStatsGranularityChange={(event) => tracker.setStatsGranularity(APP_OPTIONS.normalizeFrequency(event.target.value))}
      onResetFilters={() => {
        tracker.setSelectedCategory('')
        tracker.setDateFrom('')
        tracker.setDateTo('')
        tracker.setSearchQuery('')
      }}
      fetchingExpenses={tracker.fetchingExpenses}
      filteredExpenses={tracker.visibleExpenses}
      categoryChart={tracker.categoryChart}
      dateChart={tracker.dateChart}
      periodStats={tracker.periodStats}
      periodComparison={tracker.periodComparison}
      onLogout={tracker.handleLogout}
      onUpdateExpense={tracker.handleUpdateExpense}
      onDeleteExpense={tracker.handleDeleteExpense}
    />
  )
}
