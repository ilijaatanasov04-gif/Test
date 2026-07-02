import { Suspense, lazy, useMemo, useState } from 'react'
import type { useExpenseTracker } from '../hooks/useExpenseTracker'
import type { Currency } from '../types'
import { APP_OPTIONS } from '../hooks/useExpenseTracker'
import { AddExpenseForm } from './dashboard/AddExpenseForm'
import { AddRecurringForm } from './dashboard/AddRecurringForm'
import { BudgetsSection } from './dashboard/BudgetsSection'
import { CategoriesSection } from './dashboard/CategoriesSection'
import { ExpensesSection } from './dashboard/ExpensesSection'
import { HeroCard } from './dashboard/HeroCard'
import { Icon } from './dashboard/Icons'
import { Modal, useBodyScrollLock } from './dashboard/Modal'
import { RecurringSection } from './dashboard/RecurringSection'
import { Sidebar } from './dashboard/Sidebar'
import type { NavId } from './dashboard/Sidebar'
import { StatCards } from './dashboard/StatCards'
import { StatsSection } from './dashboard/StatsSection'

const SpendingCharts = lazy(() => import('./SpendingCharts'))

type Tracker = ReturnType<typeof useExpenseTracker>

type DashboardProps = {
  tracker: Tracker
}

export function Dashboard({ tracker }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<NavId>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [addRecurringOpen, setAddRecurringOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)
  useBodyScrollLock(sidebarOpen)
  const currencies: Currency[] = [...APP_OPTIONS.currencies]
  const defaultCategories = [...APP_OPTIONS.categories]

  const topCategoryEntry = useMemo(() => {
    if (!tracker.categoryChart.length) return null
    return tracker.categoryChart.reduce(
      (best, current) => (current.total > best.total ? current : best),
      tracker.categoryChart[0]
    )
  }, [tracker.categoryChart])

  const totalForShare = useMemo(
    () => tracker.categoryChart.reduce((acc, item) => acc + item.total, 0),
    [tracker.categoryChart]
  )
  const topCategoryShare = topCategoryEntry && totalForShare > 0 ? (topCategoryEntry.total / totalForShare) * 100 : 0

  const totalRecurringMonthly = useMemo(() => {
    return tracker.visibleRecurringItems.reduce((acc, item) => {
      const base = item.baseAmount ?? Number(item.amount)
      if (item.frequency === 'weekly') return acc + base * 4.33
      if (item.frequency === 'yearly') return acc + base / 12
      return acc + base
    }, 0)
  }, [tracker.visibleRecurringItems])

  async function handleSubmitExpense(event: React.FormEvent<HTMLFormElement>) {
    const ok = await tracker.handleAddExpense(event)
    if (ok) setAddExpenseOpen(false)
  }

  async function handleSubmitRecurring(event: React.FormEvent<HTMLFormElement>) {
    const ok = await tracker.handleAddRecurringExpense(event)
    if (ok) setAddRecurringOpen(false)
  }

  const session = tracker.session!

  function pageHeader() {
    if (activeTab === 'overview') {
      return {
        title: 'Overview',
        subtitle: `Welcome back, ${session.user.email?.split('@')[0] || 'there'} — here's where your money went.`,
        showAdd: true,
        showAddRecurring: false,
      }
    }
    if (activeTab === 'expenses') {
      return {
        title: 'Expenses',
        subtitle: 'Browse, search and edit every expense you have logged.',
        showAdd: true,
        showAddRecurring: false,
      }
    }
    if (activeTab === 'recurring') {
      return {
        title: 'Recurring Expenses',
        subtitle: 'Auto-generated entries for things that repeat on a schedule.',
        showAdd: false,
        showAddRecurring: true,
      }
    }
    if (activeTab === 'categories') {
      return {
        title: 'Categories',
        subtitle: 'Manage default and custom categories used to organize expenses.',
        showAdd: false,
        showAddRecurring: false,
      }
    }
    if (activeTab === 'budgets') {
      return {
        title: 'Budgets',
        subtitle: 'Set monthly limits per category and track progress in real time.',
        showAdd: false,
        showAddRecurring: false,
      }
    }
    return {
      title: 'Statistics',
      subtitle: 'Compare spending between weeks, months, or years.',
      showAdd: false,
      showAddRecurring: false,
    }
  }

  const header = pageHeader()

  return (
    <div className="app">
      {sidebarOpen ? <div className="sidebar-scrim is-open" onClick={closeSidebar} /> : null}

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        baseCurrency={tracker.baseCurrency}
        currencies={currencies}
        onBaseCurrencyChange={(event) => tracker.setBaseCurrency(APP_OPTIONS.normalizeCurrency(event.target.value))}
        theme={tracker.theme}
        onToggleTheme={() => tracker.setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
        email={session.user.email || ''}
        onLogout={tracker.handleLogout}
      />

      <main className="main">
        <header className="page-header">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <button
              type="button"
              className="icon-btn sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              {Icon.menu}
            </button>
            <div>
              <h1>{header.title}</h1>
              <p className="page-subtitle">{header.subtitle}</p>
            </div>
          </div>

          <div className="page-actions">
            {header.showAdd ? (
              <button type="button" className="primary-btn" onClick={() => setAddExpenseOpen(true)}>
                {Icon.plus} Add expense
              </button>
            ) : null}
            {header.showAddRecurring ? (
              <button type="button" className="primary-btn" onClick={() => setAddRecurringOpen(true)}>
                {Icon.plus} Add recurring
              </button>
            ) : null}
          </div>
        </header>

        {activeTab === 'overview' ? (
          <>
            <HeroCard
              total={tracker.summary.total}
              baseCurrency={tracker.baseCurrency}
              monthTotal={tracker.summary.currentMonthTotal}
              recurringCount={tracker.visibleRecurringItems.length}
              categoryCount={tracker.categories.length}
            />

            <StatCards
              baseCurrency={tracker.baseCurrency}
              periodComparison={tracker.periodComparison}
              statsGranularity={tracker.statsGranularity}
              topCategory={topCategoryEntry}
              topCategoryShare={topCategoryShare}
              expenseCount={tracker.visibleExpenses.length}
              totalRecurringMonthly={totalRecurringMonthly}
            />

            <section className="panel">
              <div className="panel-head">
                <h2>Spending Insights</h2>
                <span className="head-meta">Reflects current filters</span>
              </div>
              {tracker.visibleExpenses.length ? (
                <Suspense fallback={<p className="empty">Loading charts…</p>}>
                  <SpendingCharts categoryChart={tracker.categoryChart} dateChart={tracker.dateChart} />
                </Suspense>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">{Icon.trend}</div>
                  <h3>Charts appear after your first expense</h3>
                  <p>Track at least one expense and your category breakdown and timeline will show up here.</p>
                  <button type="button" onClick={() => setAddExpenseOpen(true)}>
                    {Icon.plus} Add expense
                  </button>
                </div>
              )}
            </section>
          </>
        ) : null}

        {activeTab === 'expenses' ? (
          <ExpensesSection
            categories={tracker.categories}
            currencies={currencies}
            baseCurrency={tracker.baseCurrency}
            selectedCategory={tracker.selectedCategory}
            dateFrom={tracker.dateFrom}
            dateTo={tracker.dateTo}
            searchQuery={tracker.searchQuery}
            onCategoryFilterChange={(event) => tracker.setSelectedCategory(event.target.value)}
            onDateFromChange={(event) => tracker.setDateFrom(event.target.value)}
            onDateToChange={(event) => tracker.setDateTo(event.target.value)}
            onSearchQueryChange={(event) => tracker.setSearchQuery(event.target.value)}
            onResetFilters={() => {
              tracker.setSelectedCategory('')
              tracker.setDateFrom('')
              tracker.setDateTo('')
              tracker.setSearchQuery('')
            }}
            fetchingExpenses={tracker.fetchingExpenses}
            filteredExpenses={tracker.visibleExpenses}
            filterSummary={tracker.filterSummary}
            onUpdateExpense={tracker.handleUpdateExpense}
            onDeleteExpense={tracker.handleDeleteExpense}
            onImportExpenses={tracker.handleImportExpenses}
            onAdd={() => setAddExpenseOpen(true)}
          />
        ) : null}

        {activeTab === 'recurring' ? (
          <RecurringSection
            categories={tracker.categories}
            currencies={currencies}
            baseCurrency={tracker.baseCurrency}
            recurringItems={tracker.visibleRecurringItems}
            fetchingRecurring={tracker.fetchingRecurring}
            onDeleteRecurringExpense={tracker.handleDeleteRecurringExpense}
            onUpdateRecurringExpense={tracker.handleUpdateRecurringExpense}
            onAdd={() => setAddRecurringOpen(true)}
          />
        ) : null}

        {activeTab === 'categories' ? (
          <CategoriesSection
            defaultCategories={defaultCategories}
            customCategorySummaries={tracker.customCategorySummaries}
            fetchingCategories={tracker.fetchingCategories}
            categoriesFeatureEnabled={tracker.categoriesFeatureEnabled}
            onAddCategory={tracker.handleAddCategory}
            onRenameCategory={tracker.handleRenameCategory}
            onDeleteCategory={tracker.handleDeleteCategory}
          />
        ) : null}

        {activeTab === 'budgets' ? (
          <BudgetsSection
            categories={tracker.categories}
            currencies={currencies}
            baseCurrency={tracker.baseCurrency}
            budgets={tracker.budgets}
            fetchingBudgets={tracker.fetchingBudgets}
            onAddBudget={tracker.handleAddBudget}
            onUpdateBudget={tracker.handleUpdateBudget}
            onDeleteBudget={tracker.handleDeleteBudget}
          />
        ) : null}

        {activeTab === 'stats' ? (
          <StatsSection
            baseCurrency={tracker.baseCurrency}
            statsGranularity={tracker.statsGranularity}
            onStatsGranularityChange={(event) => tracker.setStatsGranularity(APP_OPTIONS.normalizeFrequency(event.target.value))}
            periodStats={tracker.periodStats}
            periodComparison={tracker.periodComparison}
          />
        ) : null}
      </main>

      <Modal
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        title="New expense"
        subtitle="Log how much you spent and keep your dashboard up to date."
      >
        <AddExpenseForm
          expenseDate={tracker.expenseDate}
          category={tracker.category}
          amount={tracker.amount}
          description={tracker.description}
          expenseCurrency={tracker.expenseCurrency}
          categories={tracker.categories}
          currencies={currencies}
          onExpenseDateChange={(event) => tracker.setExpenseDate(event.target.value)}
          onCategoryChange={(event) => tracker.setCategory(event.target.value)}
          onAmountChange={(event) => tracker.setAmount(event.target.value)}
          onDescriptionChange={(event) => tracker.setDescription(event.target.value)}
          onExpenseCurrencyChange={(event) => tracker.setExpenseCurrency(APP_OPTIONS.normalizeCurrency(event.target.value))}
          onSubmit={handleSubmitExpense}
          onCancel={() => setAddExpenseOpen(false)}
        />
      </Modal>

      <Modal
        open={addRecurringOpen}
        onClose={() => setAddRecurringOpen(false)}
        title="New recurring rule"
        subtitle="We'll add an expense automatically each time it comes due."
      >
        <AddRecurringForm
          recurringName={tracker.recurringName}
          recurringCategory={tracker.recurringCategory}
          recurringAmount={tracker.recurringAmount}
          recurringCurrency={tracker.recurringCurrency}
          recurringFrequency={tracker.recurringFrequency}
          recurringNextDate={tracker.recurringNextDate}
          categories={tracker.categories}
          currencies={currencies}
          onRecurringNameChange={(event) => tracker.setRecurringName(event.target.value)}
          onRecurringCategoryChange={(event) => tracker.setRecurringCategory(event.target.value)}
          onRecurringAmountChange={(event) => tracker.setRecurringAmount(event.target.value)}
          onRecurringCurrencyChange={(event) => tracker.setRecurringCurrency(APP_OPTIONS.normalizeCurrency(event.target.value))}
          onRecurringFrequencyChange={(event) => tracker.setRecurringFrequency(APP_OPTIONS.normalizeFrequency(event.target.value))}
          onRecurringNextDateChange={(event) => tracker.setRecurringNextDate(event.target.value)}
          onSubmit={handleSubmitRecurring}
          onCancel={() => setAddRecurringOpen(false)}
        />
      </Modal>
    </div>
  )
}
