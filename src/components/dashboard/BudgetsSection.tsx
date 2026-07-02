import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { BudgetInsertPayload, BudgetProgress, BudgetUpdatePayload, Currency } from '../../types'
import { CategoryPill } from './CategoryPill'
import { ConfirmDialog } from './Modal'
import { Icon } from './Icons'
import { formatAmount } from './helpers'
import { useToast } from './Toast'

type BudgetsSectionProps = {
  categories: string[]
  currencies: Currency[]
  baseCurrency: Currency
  budgets: BudgetProgress[]
  fetchingBudgets: boolean
  onAddBudget: (payload: BudgetInsertPayload) => Promise<boolean>
  onUpdateBudget: (id: string, payload: BudgetUpdatePayload) => Promise<boolean>
  onDeleteBudget: (id: string) => Promise<boolean>
}

export function BudgetsSection({
  categories,
  currencies,
  baseCurrency,
  budgets,
  fetchingBudgets,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}: BudgetsSectionProps) {
  const usedCategories = useMemo(() => new Set(budgets.map((item) => item.category)), [budgets])
  const availableCategories = useMemo(
    () => categories.filter((item) => !usedCategories.has(item)),
    [categories, usedCategories]
  )

  const [newCategory, setNewCategory] = useState<string>(availableCategories[0] || categories[0] || '')
  const [newAmount, setNewAmount] = useState('')
  const [newCurrency, setNewCurrency] = useState<Currency>(baseCurrency)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editCurrency, setEditCurrency] = useState<Currency>(baseCurrency)
  const [pendingDelete, setPendingDelete] = useState<BudgetProgress | null>(null)
  const toast = useToast()

  async function submitNewBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newCategory) {
      toast.push('error', 'Pick a category first.')
      return
    }
    const numericAmount = Number(newAmount)
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.push('error', 'Enter a valid budget amount.')
      return
    }

    setBusyId('new')
    const ok = await onAddBudget({ category: newCategory, amount: numericAmount, currency: newCurrency })
    setBusyId(null)

    if (ok) {
      setNewAmount('')
      toast.push('success', 'Budget added.')
    } else {
      toast.push('error', 'Could not add that budget.')
    }
  }

  function startEdit(item: BudgetProgress) {
    setEditingId(item.id)
    setEditAmount(String(item.amount))
    setEditCurrency(item.currency)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditAmount('')
    setEditCurrency(baseCurrency)
  }

  async function saveEdit() {
    if (!editingId) return
    const numericAmount = Number(editAmount)
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.push('error', 'Enter a valid amount before saving.')
      return
    }

    setBusyId(editingId)
    const ok = await onUpdateBudget(editingId, { amount: numericAmount, currency: editCurrency })
    setBusyId(null)

    if (ok) {
      toast.push('success', 'Budget updated.')
      cancelEdit()
    } else {
      toast.push('error', 'Could not save budget.')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusyId(pendingDelete.id)
    const ok = await onDeleteBudget(pendingDelete.id)
    setBusyId(null)
    const wasEditing = editingId === pendingDelete.id
    setPendingDelete(null)

    if (ok) {
      if (wasEditing) cancelEdit()
      toast.push('success', 'Budget deleted.')
    } else {
      toast.push('error', 'Delete failed. Please try again.')
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Monthly Budgets</h2>
        <span className="head-meta">Set a monthly cap per category. Progress resets each month.</span>
      </div>

      <form className="budget-form" onSubmit={submitNewBudget}>
        <div>
          <label>Category</label>
          <select
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            disabled={!availableCategories.length || busyId === 'new'}
          >
            {availableCategories.length ? (
              availableCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            ) : (
              <option value="">All categories have budgets</option>
            )}
          </select>
        </div>
        <div>
          <label>Monthly cap</label>
          <div className="split-field">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={newAmount}
              onChange={(event) => setNewAmount(event.target.value)}
              disabled={busyId === 'new'}
              required
            />
            <select
              value={newCurrency}
              onChange={(event) => setNewCurrency(event.target.value as Currency)}
              disabled={busyId === 'new'}
            >
              {currencies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={busyId === 'new' || !availableCategories.length}>
          {Icon.plus} Add
        </button>
      </form>

      {fetchingBudgets ? <p className="empty">Loading budgets…</p> : null}

      {budgets.length ? (
        <div className="budget-grid">
          {budgets.map((item) => {
            const isEditing = item.id === editingId
            const isBusy = item.id === busyId
            const percent = Math.min(item.percent, 100)
            const status = item.percent >= 100 ? 'over' : item.percent >= 80 ? 'near' : 'ok'
            const remaining = item.baseAmount - item.spentThisMonth

            return (
              <article key={item.id} className={`budget-card ${status}`}>
                <div className="budget-head">
                  <CategoryPill name={item.category} />
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
                        <button
                          type="button"
                          className="icon-action"
                          disabled={Boolean(editingId) || isBusy}
                          onClick={() => startEdit(item)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          {Icon.edit}
                        </button>
                        <button
                          type="button"
                          className="icon-action danger"
                          disabled={Boolean(editingId) || isBusy}
                          onClick={() => setPendingDelete(item)}
                          aria-label="Delete"
                          title="Delete"
                        >
                          {Icon.trash}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="split-field" style={{ marginTop: 12 }}>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={editAmount}
                      onChange={(event) => setEditAmount(event.target.value)}
                    />
                    <select value={editCurrency} onChange={(event) => setEditCurrency(event.target.value as Currency)}>
                      {currencies.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="budget-numbers">
                      <strong>{formatAmount(item.spentThisMonth)}</strong>
                      <span> / {formatAmount(item.baseAmount)} {baseCurrency}</span>
                    </div>
                    <div className="budget-bar" role="progressbar" aria-valuenow={item.percent} aria-valuemin={0} aria-valuemax={100}>
                      <div className="budget-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="budget-footer">
                      {status === 'over'
                        ? `Over by ${formatAmount(-remaining)} ${baseCurrency}`
                        : `${formatAmount(remaining)} ${baseCurrency} left`}
                      {item.currency !== baseCurrency
                        ? ` · cap ${formatAmount(item.amount)} ${item.currency}`
                        : ''}
                    </p>
                  </>
                )}
              </article>
            )
          })}
        </div>
      ) : !fetchingBudgets ? (
        <div className="empty-state">
          <div className="empty-icon">{Icon.target}</div>
          <h3>No budgets yet</h3>
          <p>Set a monthly cap for a category to see progress bars and get an at-a-glance sense of your limits.</p>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this budget?"
        message="You can add it back at any time."
        confirmLabel="Delete budget"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}
