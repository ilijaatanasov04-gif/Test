import { Suspense, lazy, useEffect, useMemo, useState } from 'react'

const SpendingCharts = lazy(() => import('./SpendingCharts'))

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */

const Icon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  repeat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2.5 21 6.5l-4 4" />
      <path d="M3 12.5V11a4 4 0 0 1 4-4h14" />
      <path d="m7 21.5-4-4 4-4" />
      <path d="M21 11.5V13a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  folders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15v-4M12 15V9M16 15v-7" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3.5a2.1 2.1 0 0 1 3 3L7.5 18 3 19.5l1.5-4.5L16 3.5Z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="m6 7 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7" />
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 14 6-6 6 6" />
    </svg>
  ),
  arrowDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 10 6 6 6-6" />
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 14.2A8.6 8.6 0 1 1 9.8 3.4a7.2 7.2 0 1 0 10.8 10.8Z" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h15a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h11" />
      <circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  ),
  pieChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12A9 9 0 1 1 12 3v9h9Z" />
    </svg>
  ),
  empty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="14" rx="2.5" />
      <path d="M8 12h8M8 16h5" />
    </svg>
  ),
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORY_PALETTE = [
  '#6366f1',
  '#8b5cf6',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#06b6d4',
  '#14b8a6',
  '#ec4899',
  '#84cc16',
  '#a78bfa',
  '#f97316',
]

function getCategoryColor(name) {
  if (!name) return CATEGORY_PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length]
}

function CategoryPill({ name }) {
  const color = getCategoryColor(name)
  return (
    <span className="cat-pill" title={name}>
      <span className="cat-dot" style={{ background: color }} />
      {name}
    </span>
  )
}

function formatAmount(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function periodLabel(granularity) {
  if (granularity === 'weekly') return 'Week'
  if (granularity === 'yearly') return 'Year'
  return 'Month'
}

function userInitial(email) {
  if (!email) return '?'
  return email.trim().charAt(0).toUpperCase()
}

/* ------------------------------------------------------------------ */
/* Modal                                                              */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, title, subtitle = null, className = '', children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className={`modal ${className || ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            {Icon.close}
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

function ConfirmDialog({ open, title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} className="confirm-modal">
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5 }}>{message}</p>
      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="danger-btn" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Icon.home },
  { id: 'expenses', label: 'Expenses', icon: Icon.list },
  { id: 'recurring', label: 'Recurring', icon: Icon.repeat },
  { id: 'categories', label: 'Categories', icon: Icon.folders },
  { id: 'stats', label: 'Statistics', icon: Icon.chart },
]

function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  baseCurrency,
  currencies,
  onBaseCurrencyChange,
  theme,
  onToggleTheme,
  email,
  onLogout,
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-orb">{Icon.wallet}</span>
        <span>Spendly</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeTab === item.id ? 'is-active' : ''}`}
            onClick={() => {
              onTabChange(item.id)
              onClose()
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{userInitial(email)}</div>
          <span>{email}</span>
        </div>
        <div className="sidebar-controls">
          <select className="ghost-select" value={baseCurrency} onChange={onBaseCurrencyChange} aria-label="Base currency">
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? Icon.sun : Icon.moon}
          </button>
          <button type="button" className="icon-btn" onClick={onLogout} aria-label="Logout" title="Logout">
            {Icon.logout}
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* Hero / Stat cards                                                  */
/* ------------------------------------------------------------------ */

function HeroCard({ total, baseCurrency, monthTotal, recurringCount, categoryCount }) {
  return (
    <section className="hero-card">
      <p className="hero-label">Total Spent</p>
      <h2 className="hero-value">
        {formatAmount(total)}
        <small>{baseCurrency}</small>
      </h2>
      <div className="hero-meta">
        <div className="hero-meta-item">
          <label>This month</label>
          <div>
            {formatAmount(monthTotal)} <span style={{ opacity: 0.7, fontWeight: 600, fontSize: '0.7em' }}>{baseCurrency}</span>
          </div>
        </div>
        <div className="hero-meta-item">
          <label>Active recurring</label>
          <div>{recurringCount}</div>
        </div>
        <div className="hero-meta-item">
          <label>Categories</label>
          <div>{categoryCount}</div>
        </div>
      </div>
    </section>
  )
}

function trendKind(change) {
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return 'flat'
}

function StatCards({ baseCurrency, periodComparison, statsGranularity, topCategory, topCategoryShare, expenseCount, totalRecurringMonthly }) {
  const change = periodComparison.change
  const changePercent = periodComparison.changePercent
  const tk = trendKind(change)

  return (
    <div className="stat-grid">
      <article className="stat-card">
        <div className="stat-icon">{Icon.calendar}</div>
        <div>
          <p className="stat-label">This {periodLabel(statsGranularity)}</p>
          <p className="stat-value">
            {formatAmount(periodComparison.currentTotal)} <small>{baseCurrency}</small>
          </p>
        </div>
        <span className={`stat-trend ${tk}`}>
          {tk === 'up' ? Icon.arrowUp : tk === 'down' ? Icon.arrowDown : Icon.minus}
          {changePercent === null
            ? 'No prior data'
            : `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}% vs last`}
        </span>
      </article>

      <article className="stat-card">
        <div className="stat-icon">{Icon.repeat}</div>
        <div>
          <p className="stat-label">Recurring / month</p>
          <p className="stat-value">
            {formatAmount(totalRecurringMonthly)} <small>{baseCurrency}</small>
          </p>
        </div>
        <span className="stat-trend flat">Estimated based on rules</span>
      </article>

      <article className="stat-card">
        <div className="stat-icon">{Icon.pieChart}</div>
        <div>
          <p className="stat-label">Top category</p>
          <p className="stat-value">{topCategory ? topCategory.name : '—'}</p>
        </div>
        <span className="stat-trend flat">
          {topCategory ? `${formatAmount(topCategory.total)} ${baseCurrency} · ${topCategoryShare.toFixed(0)}%` : 'No expenses yet'}
        </span>
      </article>

      <article className="stat-card">
        <div className="stat-icon">{Icon.list}</div>
        <div>
          <p className="stat-label">Expenses logged</p>
          <p className="stat-value">{expenseCount}</p>
        </div>
        <span className="stat-trend flat">{expenseCount === 1 ? 'entry' : 'entries'} total</span>
      </article>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Add expense / recurring forms (used inside modals)                 */
/* ------------------------------------------------------------------ */

function AddExpenseForm({
  expenseDate,
  category,
  amount,
  description,
  expenseCurrency,
  categories,
  currencies,
  onExpenseDateChange,
  onCategoryChange,
  onAmountChange,
  onDescriptionChange,
  onExpenseCurrencyChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="form-row">
        <div>
          <label>Date</label>
          <input type="date" value={expenseDate} onChange={onExpenseDateChange} required />
        </div>
        <div>
          <label>Category</label>
          <select value={category} onChange={onCategoryChange}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label>Amount</label>
        <div className="split-field">
          <input type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={onAmountChange} required />
          <select value={expenseCurrency} onChange={onExpenseCurrencyChange}>
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label>Description (optional)</label>
        <input type="text" maxLength={200} placeholder="Coffee, lunch, taxi..." value={description} onChange={onDescriptionChange} />
      </div>

      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save Expense</button>
      </div>
    </form>
  )
}

function AddRecurringForm({
  recurringName,
  recurringCategory,
  recurringAmount,
  recurringCurrency,
  recurringFrequency,
  recurringNextDate,
  categories,
  currencies,
  onRecurringNameChange,
  onRecurringCategoryChange,
  onRecurringAmountChange,
  onRecurringCurrencyChange,
  onRecurringFrequencyChange,
  onRecurringNextDateChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div>
        <label>Name</label>
        <input type="text" maxLength={80} placeholder="e.g. Rent, Netflix" value={recurringName} onChange={onRecurringNameChange} required />
      </div>

      <div className="form-row">
        <div>
          <label>Category</label>
          <select value={recurringCategory} onChange={onRecurringCategoryChange}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Frequency</label>
          <select value={recurringFrequency} onChange={onRecurringFrequencyChange}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Amount</label>
          <div className="split-field">
            <input type="number" min="0.01" step="0.01" placeholder="0.00" value={recurringAmount} onChange={onRecurringAmountChange} required />
            <select value={recurringCurrency} onChange={onRecurringCurrencyChange}>
              {currencies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label>Next charge</label>
          <input type="date" value={recurringNextDate} onChange={onRecurringNextDateChange} required />
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save Recurring</button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/* Expenses list section                                              */
/* ------------------------------------------------------------------ */

function ExpensesSection({
  categories,
  currencies,
  baseCurrency,
  selectedCategory,
  dateFrom,
  dateTo,
  searchQuery,
  onCategoryFilterChange,
  onDateFromChange,
  onDateToChange,
  onSearchQueryChange,
  onResetFilters,
  fetchingExpenses,
  filteredExpenses,
  filterSummary,
  onUpdateExpense,
  onDeleteExpense,
  onAdd,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState(categories[0])
  const [editAmount, setEditAmount] = useState('')
  const [editCurrency, setEditCurrency] = useState(currencies[0])
  const [editDescription, setEditDescription] = useState('')
  const [rowBusyId, setRowBusyId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const editingItem = useMemo(
    () => filteredExpenses.find((item) => item.id === editingId) || null,
    [filteredExpenses, editingId]
  )

  function startEdit(item) {
    setEditingId(item.id)
    setEditDate(item.expense_date)
    setEditCategory(item.category)
    setEditAmount(String(Number(item.originalAmount)))
    setEditCurrency(item.currency)
    setEditDescription(item.description || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDate('')
    setEditCategory(categories[0])
    setEditAmount('')
    setEditCurrency(currencies[0])
    setEditDescription('')
  }

  async function saveEdit() {
    if (!editingItem) return

    const numericAmount = Number(editAmount)
    if (!editDate || Number.isNaN(numericAmount) || numericAmount <= 0) return

    setRowBusyId(editingItem.id)
    const ok = await onUpdateExpense(editingItem.id, {
      expense_date: editDate,
      category: editCategory,
      amount: numericAmount,
      currency: editCurrency,
      description: editDescription,
    })
    setRowBusyId(null)

    if (ok) cancelEdit()
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return

    setRowBusyId(pendingDeleteId)
    await onDeleteExpense(pendingDeleteId)
    setRowBusyId(null)
    setPendingDeleteId(null)

    if (editingId === pendingDeleteId) cancelEdit()
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>All Expenses</h2>
        <span className="head-meta">{filteredExpenses.length} {filteredExpenses.length === 1 ? 'entry' : 'entries'}</span>
      </div>

      <div className="filter-bar">
        <div>
          <label>Search</label>
          <input type="text" placeholder="Search description, category, date..." value={searchQuery} onChange={onSearchQueryChange} />
        </div>
        <div>
          <label>Category</label>
          <select value={selectedCategory} onChange={onCategoryFilterChange}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>From</label>
          <input type="date" value={dateFrom} onChange={onDateFromChange} />
        </div>
        <div>
          <label>To</label>
          <input type="date" value={dateTo} onChange={onDateToChange} />
        </div>
        <div className="filter-actions">
          <button type="button" className="ghost-btn" onClick={onResetFilters}>
            Reset
          </button>
        </div>
      </div>

      {filterSummary.hasActiveFilters ? (
        <div className="filter-summary">
          <strong>
            Filtered total: {formatAmount(filterSummary.total)} {baseCurrency}
          </strong>
          <span>
            {filterSummary.selectedCategory ? `${filterSummary.selectedCategory} · ` : ''}
            {filterSummary.rangeStart || filterSummary.rangeEnd
              ? `${filterSummary.rangeStart || 'any start'} → ${filterSummary.rangeEnd || 'any end'} · `
              : ''}
            {filterSummary.searchQuery ? `"${filterSummary.searchQuery}" · ` : ''}
            {filterSummary.count} {filterSummary.count === 1 ? 'expense' : 'expenses'}
          </span>
        </div>
      ) : null}

      {fetchingExpenses ? <p className="empty">Loading expenses…</p> : null}

      {filteredExpenses.length ? (
        <div className="table-wrap expenses-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredExpenses].reverse().map((item) => {
                const isEditing = item.id === editingId
                const isBusy = item.id === rowBusyId

                return (
                  <tr key={item.id}>
                    <td>
                      {isEditing ? (
                        <input className="table-input" type="date" value={editDate} onChange={(event) => setEditDate(event.target.value)} />
                      ) : (
                        <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{item.expense_date}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select className="table-input" value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <CategoryPill name={item.category} />
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="split-field">
                          <input className="table-input" type="number" min="0.01" step="0.01" value={editAmount} onChange={(event) => setEditAmount(event.target.value)} />
                          <select className="table-input" value={editCurrency} onChange={(event) => setEditCurrency(event.target.value)}>
                            {currencies.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="amount-pos">
                            {formatAmount(item.originalAmount)} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{item.currency}</span>
                          </div>
                          {item.currency !== baseCurrency ? (
                            <div className="sub-amount">≈ {formatAmount(item.baseAmount)} {baseCurrency}</div>
                          ) : null}
                        </>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input className="table-input" type="text" maxLength={200} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} />
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>{item.description || '—'}</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        {isEditing ? (
                          <>
                            <button type="button" disabled={isBusy} onClick={saveEdit}>
                              Save
                            </button>
                            <button type="button" className="ghost-btn" disabled={isBusy} onClick={cancelEdit}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="icon-action" disabled={isBusy || Boolean(editingId)} onClick={() => startEdit(item)} aria-label="Edit" title="Edit">
                              {Icon.edit}
                            </button>
                            <button type="button" className="icon-action danger" disabled={isBusy || Boolean(editingId)} onClick={() => setPendingDeleteId(item.id)} aria-label="Delete" title="Delete">
                              {Icon.trash}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : !fetchingExpenses ? (
        <div className="empty-state">
          <div className="empty-icon">{Icon.empty}</div>
          <h3>{filterSummary.hasActiveFilters ? 'No matches' : 'No expenses yet'}</h3>
          <p>
            {filterSummary.hasActiveFilters
              ? 'Try clearing your filters or change the date range.'
              : 'Track your first expense and your dashboard fills up instantly.'}
          </p>
          {filterSummary.hasActiveFilters ? (
            <button type="button" className="ghost-btn" onClick={onResetFilters}>
              Clear filters
            </button>
          ) : (
            <button type="button" onClick={onAdd}>
              {Icon.plus} Add expense
            </button>
          )}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete this expense?"
        message="This action will permanently remove the expense from your records."
        confirmLabel="Delete expense"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Recurring section                                                  */
/* ------------------------------------------------------------------ */

function RecurringSection({
  categories,
  currencies,
  baseCurrency,
  recurringItems,
  fetchingRecurring,
  onDeleteRecurringExpense,
  onUpdateRecurringExpense,
  onAdd,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState(categories[0])
  const [editAmount, setEditAmount] = useState('')
  const [editCurrency, setEditCurrency] = useState(currencies[0])
  const [editNextDate, setEditNextDate] = useState('')
  const [rowBusyId, setRowBusyId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  function startEdit(item) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditCategory(item.category)
    setEditAmount(String(Number(item.amount)))
    setEditCurrency(item.currency)
    setEditNextDate(item.next_due_date)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditCategory(categories[0])
    setEditAmount('')
    setEditCurrency(currencies[0])
    setEditNextDate('')
  }

  async function saveEdit() {
    if (!editingId) return
    setRowBusyId(editingId)
    const ok = await onUpdateRecurringExpense(editingId, {
      name: editName,
      category: editCategory,
      amount: editAmount,
      currency: editCurrency,
      frequency: recurringItems.find((item) => item.id === editingId)?.frequency || 'monthly',
      next_due_date: editNextDate,
    })
    setRowBusyId(null)
    if (ok) cancelEdit()
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    setRowBusyId(pendingDeleteId)
    await onDeleteRecurringExpense(pendingDeleteId)
    setRowBusyId(null)
    setPendingDeleteId(null)
    if (editingId === pendingDeleteId) cancelEdit()
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Recurring Expenses</h2>
        <span className="head-meta">Auto-generates weekly, monthly, or yearly entries.</span>
      </div>

      {fetchingRecurring ? <p className="empty">Loading recurring rules…</p> : null}

      {recurringItems.length ? (
        <div className="table-wrap recurring-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Next charge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringItems.map((item) => {
                const isEditing = item.id === editingId
                const isBusy = item.id === rowBusyId

                return (
                  <tr key={item.id}>
                    <td>
                      {isEditing ? (
                        <input className="table-input" type="text" maxLength={80} value={editName} onChange={(event) => setEditName(event.target.value)} />
                      ) : (
                        <strong style={{ fontWeight: 600 }}>{item.name}</strong>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select className="table-input" value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <CategoryPill name={item.category} />
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="split-field">
                          <input className="table-input" type="number" min="0.01" step="0.01" value={editAmount} onChange={(event) => setEditAmount(event.target.value)} />
                          <select className="table-input" value={editCurrency} onChange={(event) => setEditCurrency(event.target.value)}>
                            {currencies.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="amount-pos">
                            {formatAmount(item.amount)} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{item.currency}</span>
                          </div>
                          <div className="sub-amount">
                            {item.currency !== baseCurrency ? `≈ ${formatAmount(item.baseAmount)} ${baseCurrency} · ` : ''}{item.frequency}
                          </div>
                        </>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input className="table-input" type="date" value={editNextDate} onChange={(event) => setEditNextDate(event.target.value)} />
                      ) : (
                        <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{item.next_due_date}</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        {isEditing ? (
                          <>
                            <button type="button" disabled={isBusy} onClick={saveEdit}>
                              Save
                            </button>
                            <button type="button" className="ghost-btn" disabled={isBusy} onClick={cancelEdit}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="icon-action" disabled={isBusy || Boolean(editingId)} onClick={() => startEdit(item)} aria-label="Edit" title="Edit">
                              {Icon.edit}
                            </button>
                            <button type="button" className="icon-action danger" disabled={isBusy || Boolean(editingId)} onClick={() => setPendingDeleteId(item.id)} aria-label="Delete" title="Delete">
                              {Icon.trash}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : !fetchingRecurring ? (
        <div className="empty-state">
          <div className="empty-icon">{Icon.repeat}</div>
          <h3>No recurring rules</h3>
          <p>Add a rule for rent, subscriptions or any expense that repeats — we'll insert it automatically.</p>
          <button type="button" onClick={onAdd}>
            {Icon.plus} Add recurring
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete this recurring rule?"
        message="This removes the rule and all expenses generated from it."
        confirmLabel="Delete rule"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Categories section                                                 */
/* ------------------------------------------------------------------ */

function CategoriesSection({
  defaultCategories,
  customCategorySummaries,
  fetchingCategories,
  categoriesFeatureEnabled,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
}) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const editingItem = useMemo(
    () => customCategorySummaries.find((item) => item.id === editingId) || null,
    [customCategorySummaries, editingId]
  )

  async function submitNewCategory(event) {
    event.preventDefault()
    if (!newCategoryName.trim()) return

    setBusyId('new')
    const ok = await onAddCategory(newCategoryName)
    setBusyId(null)

    if (ok) setNewCategoryName('')
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditName(item.name)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
  }

  async function saveEdit() {
    if (!editingItem) return

    setBusyId(editingItem.id)
    const ok = await onRenameCategory(editingItem.id, editingItem.name, editName)
    setBusyId(null)

    if (ok) cancelEdit()
  }

  async function confirmDelete() {
    if (!pendingDelete) return

    setBusyId(pendingDelete.id)
    const ok = await onDeleteCategory(pendingDelete.id, pendingDelete.name)
    setBusyId(null)

    if (ok) {
      setPendingDelete(null)
      if (editingId === pendingDelete.id) cancelEdit()
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Manage Categories</h2>
        {fetchingCategories ? <span className="head-meta">Loading…</span> : null}
      </div>

      <p className="small-note">Default categories stay available. Add custom ones for your own expense groups.</p>

      <div className="category-block">
        <label>Default Categories</label>
        <div className="category-chip-row">
          {defaultCategories.map((item) => (
            <span key={item} className="category-chip">
              <span className="cat-dot cat-dot-lg" style={{ background: getCategoryColor(item) }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <form className="category-form" onSubmit={submitNewCategory}>
        <div>
          <label>New custom category</label>
          <input
            type="text"
            maxLength={40}
            placeholder="e.g. Health, Travel..."
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            disabled={!categoriesFeatureEnabled || busyId === 'new'}
          />
        </div>
        <button type="submit" disabled={!categoriesFeatureEnabled || busyId === 'new' || !newCategoryName.trim()}>
          {Icon.plus} Add
        </button>
      </form>

      {!categoriesFeatureEnabled ? (
        <div className="empty-state">
          <div className="empty-icon">{Icon.folders}</div>
          <h3>Custom categories disabled</h3>
          <p>Run the latest Supabase schema to enable custom categories.</p>
        </div>
      ) : customCategorySummaries.length ? (
        <div className="table-wrap category-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Usage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customCategorySummaries.map((item) => {
                const isEditing = item.id === editingId
                const isBusy = item.id === busyId
                const usageLabel = `${item.expenseCount} expense${item.expenseCount === 1 ? '' : 's'} · ${item.recurringCount} recurring`

                return (
                  <tr key={item.id}>
                    <td>
                      {isEditing ? (
                        <input className="table-input" type="text" maxLength={40} value={editName} onChange={(event) => setEditName(event.target.value)} />
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span className="cat-dot cat-dot-lg" style={{ background: getCategoryColor(item.name) }} />
                          <strong style={{ fontWeight: 600 }}>{item.name}</strong>
                        </span>
                      )}
                    </td>
                    <td><span style={{ color: 'var(--muted)' }}>{usageLabel}</span></td>
                    <td>
                      <div className="row-actions">
                        {isEditing ? (
                          <>
                            <button type="button" disabled={isBusy || !editName.trim()} onClick={saveEdit}>
                              Save
                            </button>
                            <button type="button" className="ghost-btn" disabled={isBusy} onClick={cancelEdit}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="icon-action" disabled={Boolean(editingId) || isBusy} onClick={() => startEdit(item)} aria-label="Rename" title="Rename">
                              {Icon.edit}
                            </button>
                            <button
                              type="button"
                              className="icon-action danger"
                              disabled={Boolean(editingId) || isBusy || item.totalCount > 0}
                              onClick={() => setPendingDelete(item)}
                              aria-label="Delete"
                              title={item.totalCount > 0 ? 'Cannot delete a category that is in use' : 'Delete'}
                            >
                              {Icon.trash}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{Icon.folders}</div>
          <h3>No custom categories yet</h3>
          <p>Create your own labels to group expenses the way you think about them.</p>
        </div>
      )}

      {categoriesFeatureEnabled ? (
        <p className="small-note">A custom category can be deleted only when it is not used by any expense or recurring rule.</p>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        message="This removes the custom category from your category list."
        confirmLabel="Delete category"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Stats section                                                      */
/* ------------------------------------------------------------------ */

function StatsSection({ baseCurrency, statsGranularity, onStatsGranularityChange, periodStats, periodComparison }) {
  const change = periodComparison.change
  const changePercent = periodComparison.changePercent
  const tk = trendKind(change)
  const trendLabel = changePercent === null
    ? 'n/a'
    : `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Statistics</h2>
        <select value={statsGranularity} onChange={onStatsGranularityChange}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {periodStats.rows.length ? (
        <>
          <div className="compare-grid">
            <article className="compare-card">
              <h3>Current {periodLabel(statsGranularity)}</h3>
              <p>{periodComparison.currentKey}</p>
              <strong>
                {formatAmount(periodComparison.currentTotal)} {baseCurrency}
              </strong>
            </article>
            <article className="compare-card">
              <h3>Previous {periodLabel(statsGranularity)}</h3>
              <p>{periodComparison.previousKey}</p>
              <strong>
                {formatAmount(periodComparison.previousTotal)} {baseCurrency}
              </strong>
            </article>
            <article className="compare-card">
              <h3>Difference</h3>
              <p>
                {change > 0 ? '+' : ''}
                {formatAmount(change)} {baseCurrency}
              </p>
              <strong>
                <span className={`diff-pill ${tk}`}>
                  {tk === 'up' ? Icon.arrowUp : tk === 'down' ? Icon.arrowDown : Icon.minus}
                  {trendLabel}
                </span>
              </strong>
            </article>
          </div>

          <div className="monthly-top">
            <p>
              Average per {periodLabel(statsGranularity).toLowerCase()}: <strong>{formatAmount(periodStats.average)} {baseCurrency}</strong>
            </p>
            {periodStats.best ? (
              <p>
                Highest {periodLabel(statsGranularity).toLowerCase()}: <strong>{periodStats.best.month}</strong> ({formatAmount(periodStats.best.total)} {baseCurrency})
              </p>
            ) : null}
          </div>

          <div className="table-wrap monthly-wrap">
            <table>
              <thead>
                <tr>
                  <th>{periodLabel(statsGranularity)}</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {periodStats.rows.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td className="amount-pos">{formatAmount(row.total)} {baseCurrency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{Icon.chart}</div>
          <h3>No statistics yet</h3>
          <p>Once you log a few expenses, you'll see breakdowns by week, month, and year here.</p>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Dashboard root                                                     */
/* ------------------------------------------------------------------ */

export function Dashboard({
  theme,
  onToggleTheme,
  session,
  summary,
  filterSummary,
  baseCurrency,
  currencies,
  onBaseCurrencyChange,
  expenseDate,
  category,
  amount,
  description,
  expenseCurrency,
  categories,
  defaultCategories,
  customCategorySummaries,
  fetchingCategories,
  categoriesFeatureEnabled,
  recurringItems,
  fetchingRecurring,
  recurringName,
  recurringCategory,
  recurringAmount,
  recurringCurrency,
  recurringFrequency,
  recurringNextDate,
  searchQuery,
  statsGranularity,
  onExpenseDateChange,
  onCategoryChange,
  onAmountChange,
  onDescriptionChange,
  onExpenseCurrencyChange,
  onAddExpense,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onRecurringNameChange,
  onRecurringCategoryChange,
  onRecurringAmountChange,
  onRecurringCurrencyChange,
  onRecurringFrequencyChange,
  onRecurringNextDateChange,
  onAddRecurringExpense,
  onDeleteRecurringExpense,
  onUpdateRecurringExpense,
  selectedCategory,
  dateFrom,
  dateTo,
  onCategoryFilterChange,
  onDateFromChange,
  onDateToChange,
  onSearchQueryChange,
  onStatsGranularityChange,
  onResetFilters,
  fetchingExpenses,
  filteredExpenses,
  categoryChart,
  dateChart,
  periodStats,
  periodComparison,
  onLogout,
  onUpdateExpense,
  onDeleteExpense,
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [addRecurringOpen, setAddRecurringOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  const topCategoryEntry = useMemo(() => {
    if (!categoryChart.length) return null
    return categoryChart.reduce((best, current) => (current.total > best.total ? current : best), categoryChart[0])
  }, [categoryChart])

  const totalForShare = useMemo(() => categoryChart.reduce((acc, item) => acc + item.total, 0), [categoryChart])
  const topCategoryShare = topCategoryEntry && totalForShare > 0 ? (topCategoryEntry.total / totalForShare) * 100 : 0

  const totalRecurringMonthly = useMemo(() => {
    return recurringItems.reduce((acc, item) => {
      const base = item.baseAmount ?? Number(item.amount)
      if (item.frequency === 'weekly') return acc + base * 4.33
      if (item.frequency === 'yearly') return acc + base / 12
      return acc + base
    }, 0)
  }, [recurringItems])

  async function handleSubmitExpense(event) {
    const ok = await onAddExpense(event)
    if (ok) setAddExpenseOpen(false)
  }

  async function handleSubmitRecurring(event) {
    const ok = await onAddRecurringExpense(event)
    if (ok) setAddRecurringOpen(false)
  }

  function pageHeader() {
    if (activeTab === 'overview') {
      return {
        title: 'Overview',
        subtitle: `Welcome back, ${session.user.email.split('@')[0]} — here's where your money went.`,
        showAdd: true,
      }
    }
    if (activeTab === 'expenses') {
      return {
        title: 'Expenses',
        subtitle: 'Browse, search and edit every expense you have logged.',
        showAdd: true,
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
      }
    }
    return {
      title: 'Statistics',
      subtitle: 'Compare spending between weeks, months, or years.',
      showAdd: false,
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
        baseCurrency={baseCurrency}
        currencies={currencies}
        onBaseCurrencyChange={onBaseCurrencyChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
        email={session.user.email}
        onLogout={onLogout}
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
              total={summary.total}
              baseCurrency={baseCurrency}
              monthTotal={summary.currentMonthTotal}
              recurringCount={recurringItems.length}
              categoryCount={categories.length}
            />

            <StatCards
              baseCurrency={baseCurrency}
              periodComparison={periodComparison}
              statsGranularity={statsGranularity}
              topCategory={topCategoryEntry}
              topCategoryShare={topCategoryShare}
              expenseCount={filteredExpenses.length}
              totalRecurringMonthly={totalRecurringMonthly}
            />

            <section className="panel">
              <div className="panel-head">
                <h2>Spending Insights</h2>
                <span className="head-meta">Reflects current filters</span>
              </div>
              {filteredExpenses.length ? (
                <Suspense fallback={<p className="empty">Loading charts…</p>}>
                  <SpendingCharts categoryChart={categoryChart} dateChart={dateChart} />
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
            categories={categories}
            currencies={currencies}
            baseCurrency={baseCurrency}
            selectedCategory={selectedCategory}
            dateFrom={dateFrom}
            dateTo={dateTo}
            searchQuery={searchQuery}
            onCategoryFilterChange={onCategoryFilterChange}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            onSearchQueryChange={onSearchQueryChange}
            onResetFilters={onResetFilters}
            fetchingExpenses={fetchingExpenses}
            filteredExpenses={filteredExpenses}
            filterSummary={filterSummary}
            onUpdateExpense={onUpdateExpense}
            onDeleteExpense={onDeleteExpense}
            onAdd={() => setAddExpenseOpen(true)}
          />
        ) : null}

        {activeTab === 'recurring' ? (
          <RecurringSection
            categories={categories}
            currencies={currencies}
            baseCurrency={baseCurrency}
            recurringItems={recurringItems}
            fetchingRecurring={fetchingRecurring}
            onDeleteRecurringExpense={onDeleteRecurringExpense}
            onUpdateRecurringExpense={onUpdateRecurringExpense}
            onAdd={() => setAddRecurringOpen(true)}
          />
        ) : null}

        {activeTab === 'categories' ? (
          <CategoriesSection
            defaultCategories={defaultCategories}
            customCategorySummaries={customCategorySummaries}
            fetchingCategories={fetchingCategories}
            categoriesFeatureEnabled={categoriesFeatureEnabled}
            onAddCategory={onAddCategory}
            onRenameCategory={onRenameCategory}
            onDeleteCategory={onDeleteCategory}
          />
        ) : null}

        {activeTab === 'stats' ? (
          <StatsSection
            baseCurrency={baseCurrency}
            statsGranularity={statsGranularity}
            onStatsGranularityChange={onStatsGranularityChange}
            periodStats={periodStats}
            periodComparison={periodComparison}
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
          expenseDate={expenseDate}
          category={category}
          amount={amount}
          description={description}
          expenseCurrency={expenseCurrency}
          categories={categories}
          currencies={currencies}
          onExpenseDateChange={onExpenseDateChange}
          onCategoryChange={onCategoryChange}
          onAmountChange={onAmountChange}
          onDescriptionChange={onDescriptionChange}
          onExpenseCurrencyChange={onExpenseCurrencyChange}
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
          recurringName={recurringName}
          recurringCategory={recurringCategory}
          recurringAmount={recurringAmount}
          recurringCurrency={recurringCurrency}
          recurringFrequency={recurringFrequency}
          recurringNextDate={recurringNextDate}
          categories={categories}
          currencies={currencies}
          onRecurringNameChange={onRecurringNameChange}
          onRecurringCategoryChange={onRecurringCategoryChange}
          onRecurringAmountChange={onRecurringAmountChange}
          onRecurringCurrencyChange={onRecurringCurrencyChange}
          onRecurringFrequencyChange={onRecurringFrequencyChange}
          onRecurringNextDateChange={onRecurringNextDateChange}
          onSubmit={handleSubmitRecurring}
          onCancel={() => setAddRecurringOpen(false)}
        />
      </Modal>
    </div>
  )
}
