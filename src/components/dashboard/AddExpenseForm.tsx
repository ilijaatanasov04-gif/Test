import type { ChangeEvent, FormEvent } from 'react'
import type { Currency } from '../../types'

type AddExpenseFormProps = {
  expenseDate: string
  category: string
  amount: string
  description: string
  expenseCurrency: Currency
  categories: string[]
  currencies: Currency[]
  onExpenseDateChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCategoryChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (event: ChangeEvent<HTMLInputElement>) => void
  onExpenseCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function AddExpenseForm({
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
}: AddExpenseFormProps) {
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
