import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Currency, ExpenseUpdatePayload, FilterSummary, VisibleExpense } from '../../types'
import { CategoryPill } from './CategoryPill'
import { ConfirmDialog } from './Modal'
import { Icon } from './Icons'
import { formatAmount } from './helpers'
import { useToast } from './Toast'
import { downloadExpensesCsv, parseExpensesCsv } from '../../lib/csv'
import type { CsvImportError } from '../../lib/csv'

type ExpensesSectionProps = {
  categories: string[]
  currencies: Currency[]
  baseCurrency: Currency
  selectedCategory: string
  dateFrom: string
  dateTo: string
  searchQuery: string
  onCategoryFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onDateFromChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDateToChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSearchQueryChange: (event: ChangeEvent<HTMLInputElement>) => void
  onResetFilters: () => void
  fetchingExpenses: boolean
  filteredExpenses: VisibleExpense[]
  filterSummary: FilterSummary
  onUpdateExpense: (id: string, payload: ExpenseUpdatePayload) => Promise<boolean>
  onDeleteExpense: (id: string) => Promise<boolean>
  onImportExpenses: (rows: ExpenseUpdatePayload[]) => Promise<number>
  onAdd: () => void
}

export function ExpensesSection({
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
  onImportExpenses,
  onAdd,
}: ExpensesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState<string>(categories[0])
  const [editAmount, setEditAmount] = useState('')
  const [editCurrency, setEditCurrency] = useState<Currency>(currencies[0])
  const [editDescription, setEditDescription] = useState('')
  const [rowBusyId, setRowBusyId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const toast = useToast()

  const editingItem = useMemo(
    () => filteredExpenses.find((item) => item.id === editingId) || null,
    [filteredExpenses, editingId]
  )

  function startEdit(item: VisibleExpense) {
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
    if (!editDate || Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.push('error', 'Enter a valid date and amount before saving.')
      return
    }

    setRowBusyId(editingItem.id)
    const ok = await onUpdateExpense(editingItem.id, {
      expense_date: editDate,
      category: editCategory,
      amount: numericAmount,
      currency: editCurrency,
      description: editDescription,
    })
    setRowBusyId(null)

    if (ok) {
      toast.push('success', 'Expense updated.')
      cancelEdit()
    } else {
      toast.push('error', 'Could not save your changes. Please try again.')
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return

    setRowBusyId(pendingDeleteId)
    const ok = await onDeleteExpense(pendingDeleteId)
    setRowBusyId(null)
    const wasEditing = editingId === pendingDeleteId
    setPendingDeleteId(null)

    if (ok) {
      toast.push('success', 'Expense deleted.')
      if (wasEditing) cancelEdit()
    } else {
      toast.push('error', 'Delete failed. Please try again.')
    }
  }

  function handleExport() {
    if (!filteredExpenses.length) {
      toast.push('info', 'Nothing to export with the current filters.')
      return
    }
    downloadExpensesCsv(filteredExpenses)
    toast.push('success', `Exported ${filteredExpenses.length} expenses to CSV.`)
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const { rows, errors } = parseExpensesCsv(text, { validCategories: categories, validCurrencies: currencies })

      if (!rows.length) {
        toast.push('error', formatImportError(errors))
        return
      }

      const inserted = await onImportExpenses(rows)
      if (inserted === 0) {
        toast.push('error', 'Import failed. No rows were saved.')
        return
      }

      if (errors.length) {
        toast.push(
          'info',
          `Imported ${inserted} of ${rows.length} rows. ${errors.length} row${errors.length === 1 ? '' : 's'} were skipped.`
        )
      } else {
        toast.push('success', `Imported ${inserted} expenses.`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed.'
      toast.push('error', message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>All Expenses</h2>
        <div className="panel-head-actions">
          <span className="head-meta">{filteredExpenses.length} {filteredExpenses.length === 1 ? 'entry' : 'entries'}</span>
          <button type="button" className="ghost-btn" onClick={handleExport}>
            {Icon.download} Export
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {Icon.upload} {importing ? 'Importing…' : 'Import'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
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
                          <select className="table-input" value={editCurrency} onChange={(event) => setEditCurrency(event.target.value as Currency)}>
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

function formatImportError(errors: CsvImportError[]): string {
  if (!errors.length) return 'Could not read the CSV file. Make sure it has date, category, amount columns.'
  const first = errors[0]
  return `Could not import: row ${first.row} ${first.reason}`
}
