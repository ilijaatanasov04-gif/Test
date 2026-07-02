import { useState } from 'react'
import type { Currency, Frequency, RecurringUpdatePayload, VisibleRecurringExpense } from '../../types'
import { CategoryPill } from './CategoryPill'
import { ConfirmDialog } from './Modal'
import { Icon } from './Icons'
import { formatAmount } from './helpers'
import { useToast } from './Toast'

type RecurringSectionProps = {
  categories: string[]
  currencies: Currency[]
  baseCurrency: Currency
  recurringItems: VisibleRecurringExpense[]
  fetchingRecurring: boolean
  onDeleteRecurringExpense: (id: string) => Promise<boolean>
  onUpdateRecurringExpense: (id: string, payload: RecurringUpdatePayload) => Promise<boolean>
  onAdd: () => void
}

export function RecurringSection({
  categories,
  currencies,
  baseCurrency,
  recurringItems,
  fetchingRecurring,
  onDeleteRecurringExpense,
  onUpdateRecurringExpense,
  onAdd,
}: RecurringSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState<string>(categories[0])
  const [editAmount, setEditAmount] = useState('')
  const [editCurrency, setEditCurrency] = useState<Currency>(currencies[0])
  const [editFrequency, setEditFrequency] = useState<Frequency>('monthly')
  const [editNextDate, setEditNextDate] = useState('')
  const [rowBusyId, setRowBusyId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const toast = useToast()

  function startEdit(item: VisibleRecurringExpense) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditCategory(item.category)
    setEditAmount(String(Number(item.amount)))
    setEditCurrency(item.currency)
    setEditFrequency(item.frequency)
    setEditNextDate(item.next_due_date)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditCategory(categories[0])
    setEditAmount('')
    setEditCurrency(currencies[0])
    setEditFrequency('monthly')
    setEditNextDate('')
  }

  async function saveEdit() {
    if (!editingId) return

    const numericAmount = Number(editAmount)
    if (!editName.trim() || !editNextDate || Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.push('error', 'Enter a name, valid amount and next-charge date.')
      return
    }

    setRowBusyId(editingId)
    const ok = await onUpdateRecurringExpense(editingId, {
      name: editName,
      category: editCategory,
      amount: numericAmount,
      currency: editCurrency,
      frequency: editFrequency,
      next_due_date: editNextDate,
    })
    setRowBusyId(null)

    if (ok) {
      toast.push('success', 'Recurring rule updated.')
      cancelEdit()
    } else {
      toast.push('error', 'Could not update the recurring rule.')
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    setRowBusyId(pendingDeleteId)
    const ok = await onDeleteRecurringExpense(pendingDeleteId)
    setRowBusyId(null)
    const wasEditing = editingId === pendingDeleteId
    setPendingDeleteId(null)

    if (ok) {
      toast.push('success', 'Recurring rule deleted.')
      if (wasEditing) cancelEdit()
    } else {
      toast.push('error', 'Delete failed. Please try again.')
    }
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
                <th>Frequency</th>
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
                    <td data-label="Name">
                      {isEditing ? (
                        <input className="table-input" type="text" maxLength={80} value={editName} onChange={(event) => setEditName(event.target.value)} />
                      ) : (
                        <strong style={{ fontWeight: 600 }}>{item.name}</strong>
                      )}
                    </td>
                    <td data-label="Category">
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
                    <td data-label="Amount">
                      {isEditing ? (
                        <div className="split-field">
                          <input className="table-input" type="number" min="0.01" step="0.01" value={editAmount} onChange={(event) => setEditAmount(event.target.value)} />
                          <select className="table-input" value={editCurrency} onChange={(event) => setEditCurrency(event.target.value as Currency)}>
                            {currencies.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="amount-cell">
                          <div className="amount-pos">
                            {formatAmount(item.amount)} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{item.currency}</span>
                          </div>
                          {item.currency !== baseCurrency ? (
                            <div className="sub-amount">≈ {formatAmount(item.baseAmount)} {baseCurrency}</div>
                          ) : null}
                        </div>
                      )}
                    </td>
                    <td data-label="Frequency">
                      {isEditing ? (
                        <select className="table-input" value={editFrequency} onChange={(event) => setEditFrequency(event.target.value as Frequency)}>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>{item.frequency}</span>
                      )}
                    </td>
                    <td data-label="Next charge">
                      {isEditing ? (
                        <input className="table-input" type="date" value={editNextDate} onChange={(event) => setEditNextDate(event.target.value)} />
                      ) : (
                        <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{item.next_due_date}</span>
                      )}
                    </td>
                    <td className="actions-cell">
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
