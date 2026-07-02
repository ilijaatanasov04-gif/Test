import type { ChangeEvent, FormEvent } from 'react'
import type { Currency, Frequency } from '../../types'

type AddRecurringFormProps = {
  recurringName: string
  recurringCategory: string
  recurringAmount: string
  recurringCurrency: Currency
  recurringFrequency: Frequency
  recurringNextDate: string
  categories: string[]
  currencies: Currency[]
  onRecurringNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRecurringCategoryChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onRecurringAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRecurringCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onRecurringFrequencyChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onRecurringNextDateChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function AddRecurringForm({
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
}: AddRecurringFormProps) {
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
