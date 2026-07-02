export type Category = string
export type Currency = 'MKD' | 'EUR' | 'USD'
export type Frequency = 'weekly' | 'monthly' | 'yearly'
export type Theme = 'light' | 'dark'

export type CategoryRow = {
  id: string
  name: string
  created_at?: string
}

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

export type BudgetRow = {
  id: string
  category: Category
  amount: number | string
  currency: string
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

export type BudgetProgress = {
  id: string
  category: Category
  amount: number
  currency: Currency
  baseAmount: number
  spentThisMonth: number
  percent: number
}

export type Summary = {
  total: number
  currentMonthTotal: number
}

export type FilterSummary = {
  hasActiveFilters: boolean
  rangeStart: string
  rangeEnd: string
  selectedCategory: string
  searchQuery: string
  total: number
  count: number
  average: number
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

export type ExpenseInsertPayload = {
  expense_date: string
  category: Category
  amount: number | string
  currency: string
  description?: string
  recurring_expense_id?: string
}

export type ExpenseUpdatePayload = {
  expense_date: string
  category: Category
  amount: number | string
  currency: string
  description: string
}

export type RecurringInsertPayload = {
  name: string
  category: Category
  amount: number | string
  currency: string
  frequency: string
  next_due_date: string
}

export type RecurringUpdatePayload = {
  name?: string
  category?: Category
  amount?: number | string
  currency?: string
  frequency?: string
  next_due_date?: string
}

export type BudgetInsertPayload = {
  category: Category
  amount: number
  currency: Currency
}

export type BudgetUpdatePayload = {
  amount: number
  currency: Currency
}

export type CategoryInsertPayload = {
  name: string
}

export type CategoryUpdatePayload = {
  name: string
}

export type CustomCategorySummary = {
  id: string
  name: string
  expenseCount: number
  recurringCount: number
  totalCount: number
}
