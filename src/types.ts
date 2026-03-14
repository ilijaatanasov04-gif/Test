export type Category = 'Food' | 'Transport' | 'Other'
export type Currency = 'MKD' | 'EUR' | 'USD'
export type Frequency = 'weekly' | 'monthly' | 'yearly'
export type Theme = 'light' | 'dark'

export type ExpenseRow = {
  id: string
  expense_date: string
  category: Category
  amount: number | string
  currency: string
  description: string | null
  recurring_expense_id: string | null
  created_at?: string
}

export type RecurringExpenseRow = {
  id: string
  name: string
  category: Category
  amount: number | string
  currency: string
  frequency: string
  next_due_date: string
  created_at?: string
}

export type VisibleExpense = ExpenseRow & {
  currency: Currency
  originalAmount: number
  baseAmount: number
}

export type VisibleRecurringExpense = RecurringExpenseRow & {
  currency: Currency
  frequency: Frequency
  baseAmount: number
}

export type Summary = {
  total: number
  currentMonthTotal: number
}

export type PeriodStatRow = {
  month: string
  total: number
}

export type PeriodStats = {
  rows: PeriodStatRow[]
  best: PeriodStatRow | null
  average: number
}

export type PeriodComparison = {
  currentKey: string
  previousKey: string
  currentTotal: number
  previousTotal: number
  change: number
  changePercent: number | null
}

export type CategoryChartPoint = {
  name: string
  total: number
}

export type DateChartPoint = {
  date: string
  total: number
}

export type ExpenseUpdatePayload = {
  expense_date: string
  category: Category
  amount: number | string
  currency: string
  description: string
}

export type RecurringUpdatePayload = {
  name: string
  category: Category
  amount: number | string
  currency: string
  frequency: string
  next_due_date: string
}
