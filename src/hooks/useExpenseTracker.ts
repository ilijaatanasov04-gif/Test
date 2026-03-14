import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  createExpense,
  editExpense,
  getExpenses,
  removeExpense,
  removeExpensesByRecurringId,
} from '../services/expenses'
import {
  createRecurringExpense,
  getRecurringExpenses,
  removeRecurringExpense,
  updateRecurringExpense,
} from '../services/recurringExpenses'
import { supabase } from '../supabase'
import {
  CATEGORIES,
  CURRENCIES,
  addRecurringInterval,
  convertCurrency,
  getStatsBucket,
  getStatsKey,
  normalizeCurrency,
  normalizeFrequency,
  shiftDateByGranularity,
  todayDate,
} from '../lib/expenseUtils'
import type {
  CategoryChartPoint,
  Currency,
  DateChartPoint,
  ExpenseRow,
  ExpenseUpdatePayload,
  Frequency,
  PeriodComparison,
  PeriodStats,
  RecurringExpenseRow,
  RecurringUpdatePayload,
  Summary,
  Theme,
  VisibleExpense,
  VisibleRecurringExpense,
} from '../types'

export function useExpenseTracker() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const storedTheme = window.localStorage.getItem('theme')
    return storedTheme === 'dark' ? 'dark' : 'light'
  })

  const [baseCurrency, setBaseCurrency] = useState<Currency>(() => {
    if (typeof window === 'undefined') return 'MKD'
    return normalizeCurrency(window.localStorage.getItem('baseCurrency') || 'MKD')
  })

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [showAuthEntry, setShowAuthEntry] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [fetchingExpenses, setFetchingExpenses] = useState(false)

  const [recurringItems, setRecurringItems] = useState<RecurringExpenseRow[]>([])
  const [fetchingRecurring, setFetchingRecurring] = useState(false)

  const [expenseDate, setExpenseDate] = useState(todayDate())
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [expenseCurrency, setExpenseCurrency] = useState<Currency>(baseCurrency)

  const [recurringName, setRecurringName] = useState('')
  const [recurringCategory, setRecurringCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0])
  const [recurringAmount, setRecurringAmount] = useState('')
  const [recurringCurrency, setRecurringCurrency] = useState<Currency>(baseCurrency)
  const [recurringFrequency, setRecurringFrequency] = useState<Frequency>('monthly')
  const [recurringNextDate, setRecurringNextDate] = useState(todayDate())

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statsGranularity, setStatsGranularity] = useState<Frequency>('monthly')

  const fetchRecurring = useCallback(async (): Promise<boolean> => {
    setFetchingRecurring(true)
    const { data, error } = await getRecurringExpenses()

    if (error) {
      setFetchingRecurring(false)
      return false
    }

    setRecurringItems((data || []) as RecurringExpenseRow[])
    setFetchingRecurring(false)
    return true
  }, [])

  const fetchExpenses = useCallback(async (): Promise<boolean> => {
    setFetchingExpenses(true)
    const { data, error } = await getExpenses()

    if (error) {
      setFetchingExpenses(false)
      return false
    }

    setExpenses((data || []) as ExpenseRow[])
    setFetchingExpenses(false)
    return true
  }, [])

  const applyDueRecurringExpenses = useCallback(async (): Promise<boolean> => {
    const { data, error } = await getRecurringExpenses()

    if (error) {
      return false
    }

    const rules = (data || []) as RecurringExpenseRow[]
    const today = todayDate()

    for (const rule of rules) {
      let nextDate = rule.next_due_date
      const recurringFrequencyValue = normalizeFrequency(rule.frequency)
      const recurringCurrencyValue = normalizeCurrency(rule.currency)

      while (nextDate <= today) {
        const payload = {
          expense_date: nextDate,
          category: rule.category,
          amount: Number(rule.amount),
          currency: recurringCurrencyValue,
          description: `Recurring: ${rule.name}`,
          recurring_expense_id: rule.id,
        }

        const { error: createError } = await createExpense(payload)
        if (createError && createError.code !== '23505') {
          return false
        }

        nextDate = addRecurringInterval(nextDate, recurringFrequencyValue)
      }

      if (nextDate !== rule.next_due_date) {
        const { error: updateError } = await updateRecurringExpense(rule.id, { next_due_date: nextDate })
        if (updateError) {
          return false
        }
      }
    }

    return true
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('baseCurrency', baseCurrency)
  }, [baseCurrency])

  useEffect(() => {
    let alive = true

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (alive) {
        setSession(data?.session ?? null)
        setLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession) {
        setShowAuthEntry(false)
      }
    })

    return () => {
      alive = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session) {
      setExpenses([])
      setRecurringItems([])
      return
    }

    const syncData = async () => {
      await applyDueRecurringExpenses()
      await Promise.all([fetchExpenses(), fetchRecurring()])
    }

    syncData()
  }, [session, fetchExpenses, fetchRecurring, applyDueRecurringExpenses])

  const filteredExpenses = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase()
    const rangeStart = dateFrom && dateTo && dateFrom > dateTo ? dateTo : dateFrom
    const rangeEnd = dateFrom && dateTo && dateFrom > dateTo ? dateFrom : dateTo

    return expenses.filter((item) => {
      const normalizedCurrency = normalizeCurrency(item.currency)
      const textBlock = `${item.category} ${item.description || ''} ${item.expense_date} ${normalizedCurrency}`.toLowerCase()

      if (selectedCategory && item.category !== selectedCategory) return false
      if (rangeStart && item.expense_date < rangeStart) return false
      if (rangeEnd && item.expense_date > rangeEnd) return false
      if (loweredQuery && !textBlock.includes(loweredQuery)) return false

      return true
    })
  }, [expenses, selectedCategory, searchQuery, dateFrom, dateTo])

  const visibleExpenses = useMemo<VisibleExpense[]>(() => {
    return filteredExpenses.map((item) => {
      const currency = normalizeCurrency(item.currency)
      const originalAmount = Number(item.amount)
      const baseAmount = convertCurrency(originalAmount, currency, baseCurrency)

      return {
        ...item,
        currency,
        originalAmount,
        baseAmount,
      }
    })
  }, [filteredExpenses, baseCurrency])

  const allVisibleExpenses = useMemo<VisibleExpense[]>(() => {
    return expenses.map((item) => {
      const currency = normalizeCurrency(item.currency)
      const originalAmount = Number(item.amount)
      const baseAmount = convertCurrency(originalAmount, currency, baseCurrency)

      return {
        ...item,
        currency,
        originalAmount,
        baseAmount,
      }
    })
  }, [expenses, baseCurrency])

  const visibleRecurringItems = useMemo<VisibleRecurringExpense[]>(() => {
    return recurringItems.map((item) => ({
      ...item,
      currency: normalizeCurrency(item.currency),
      frequency: normalizeFrequency(item.frequency),
      baseAmount: convertCurrency(Number(item.amount), normalizeCurrency(item.currency), baseCurrency),
    }))
  }, [recurringItems, baseCurrency])

  const summary = useMemo<Summary>(() => {
    const total = allVisibleExpenses.reduce((acc, item) => acc + item.baseAmount, 0)
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentMonthTotal = allVisibleExpenses
      .filter((item) => item.expense_date.startsWith(currentMonth))
      .reduce((acc, item) => acc + item.baseAmount, 0)

    return {
      total,
      currentMonthTotal,
    }
  }, [allVisibleExpenses])

  const periodStats = useMemo<PeriodStats>(() => {
    const totals = new Map<string, number>()
    const sortKeys = new Map<string, string>()

    visibleExpenses.forEach((item) => {
      const bucket = getStatsBucket(item.expense_date, statsGranularity)
      totals.set(bucket.label, (totals.get(bucket.label) || 0) + item.baseAmount)
      sortKeys.set(bucket.label, bucket.sortKey)
    })

    const rows = Array.from(totals.keys())
      .sort((a, b) => (sortKeys.get(a)! < sortKeys.get(b)! ? 1 : -1))
      .map((month) => ({
        month,
        total: totals.get(month) || 0,
      }))

    const best = rows.length
      ? rows.reduce((prev, current) => (current.total > prev.total ? current : prev), rows[0])
      : null

    const average = rows.length ? rows.reduce((acc, row) => acc + row.total, 0) / rows.length : 0

    return { rows, best, average }
  }, [visibleExpenses, statsGranularity])

  const periodComparison = useMemo<PeriodComparison>(() => {
    const totals = new Map<string, number>()
    visibleExpenses.forEach((item) => {
      const key = getStatsKey(item.expense_date, statsGranularity)
      totals.set(key, (totals.get(key) || 0) + item.baseAmount)
    })

    const today = todayDate()
    const currentKey = getStatsKey(today, statsGranularity)
    const previousKey = getStatsKey(shiftDateByGranularity(today, statsGranularity, 'previous'), statsGranularity)

    const currentTotal = totals.get(currentKey) || 0
    const previousTotal = totals.get(previousKey) || 0
    const change = currentTotal - previousTotal
    const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : null

    return {
      currentKey,
      previousKey,
      currentTotal,
      previousTotal,
      change,
      changePercent,
    }
  }, [visibleExpenses, statsGranularity])

  const categoryChart = useMemo<CategoryChartPoint[]>(() => {
    const totals = new Map<string, number>()
    visibleExpenses.forEach((item) => {
      totals.set(item.category, (totals.get(item.category) || 0) + item.baseAmount)
    })

    return Array.from(totals.entries()).map(([name, total]) => ({ name, total }))
  }, [visibleExpenses])

  const dateChart = useMemo<DateChartPoint[]>(() => {
    const totals = new Map<string, number>()
    visibleExpenses.forEach((item) => {
      totals.set(item.expense_date, (totals.get(item.expense_date) || 0) + item.baseAmount)
    })

    return Array.from(totals.keys())
      .sort()
      .map((date) => ({ date, total: totals.get(date) || 0 }))
  }, [visibleExpenses])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email || !password) {
      return
    }

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        return
      }

      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        return
      }

      setAuthMode('login')
      setPassword('')
      setConfirmPassword('')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return
    }

    setPassword('')
    setConfirmPassword('')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setShowAuthEntry(true)
    setAuthMode('login')
    setPassword('')
    setConfirmPassword('')
  }

  async function handleAddExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const numericAmount = Number(amount)
    if (!expenseDate || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return
    }

    const payload = {
      expense_date: expenseDate,
      category,
      amount: numericAmount,
      currency: normalizeCurrency(expenseCurrency),
      description,
    }

    const { error } = await createExpense(payload)
    if (error) {
      return
    }

    setAmount('')
    setDescription('')
    await fetchExpenses()
  }

  async function handleAddRecurringExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const numericAmount = Number(recurringAmount)
    if (!recurringName.trim() || !recurringNextDate || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return
    }

    const payload = {
      name: recurringName.trim(),
      category: recurringCategory,
      amount: numericAmount,
      currency: normalizeCurrency(recurringCurrency),
      frequency: normalizeFrequency(recurringFrequency),
      next_due_date: recurringNextDate,
    }

    const { error } = await createRecurringExpense(payload)
    if (error) {
      return
    }

    setRecurringName('')
    setRecurringAmount('')
    setRecurringCurrency(baseCurrency)
    setRecurringFrequency('monthly')
    setRecurringNextDate(todayDate())

    await applyDueRecurringExpenses()
    await Promise.all([fetchRecurring(), fetchExpenses()])
  }

  async function handleDeleteRecurringExpense(id: string): Promise<boolean> {
    const { error: expensesError } = await removeExpensesByRecurringId(id)
    if (expensesError) {
      return false
    }

    const { error } = await removeRecurringExpense(id)
    if (error) {
      return false
    }

    await Promise.all([fetchRecurring(), fetchExpenses()])
    return true
  }

  async function handleUpdateRecurringExpense(id: string, payload: RecurringUpdatePayload): Promise<boolean> {
    const numericAmount = Number(payload.amount)
    if (!payload.name?.trim() || !payload.next_due_date || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return false
    }

    const { error } = await updateRecurringExpense(id, {
      name: payload.name.trim(),
      category: payload.category,
      amount: numericAmount,
      currency: normalizeCurrency(payload.currency),
      frequency: normalizeFrequency(payload.frequency),
      next_due_date: payload.next_due_date,
    })
    if (error) {
      return false
    }

    await Promise.all([fetchRecurring(), fetchExpenses()])
    return true
  }

  async function handleUpdateExpense(id: string, payload: ExpenseUpdatePayload): Promise<boolean> {
    const numericAmount = Number(payload.amount)
    if (!payload.expense_date || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return false
    }

    const { error } = await editExpense(id, {
      expense_date: payload.expense_date,
      category: payload.category,
      amount: numericAmount,
      currency: normalizeCurrency(payload.currency),
      description: payload.description,
    })
    if (error) {
      return false
    }

    await fetchExpenses()
    return true
  }

  async function handleDeleteExpense(id: string): Promise<boolean> {
    const { error } = await removeExpense(id)
    if (error) {
      return false
    }

    await fetchExpenses()
    return true
  }

  return {
    theme,
    setTheme,
    baseCurrency,
    setBaseCurrency,
    session,
    loading,
    authMode,
    setAuthMode,
    showAuthEntry,
    setShowAuthEntry,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    expenseDate,
    setExpenseDate,
    category,
    setCategory,
    amount,
    setAmount,
    description,
    setDescription,
    expenseCurrency,
    setExpenseCurrency,
    recurringItems,
    fetchingRecurring,
    recurringName,
    setRecurringName,
    recurringCategory,
    setRecurringCategory,
    recurringAmount,
    setRecurringAmount,
    recurringCurrency,
    setRecurringCurrency,
    recurringFrequency,
    setRecurringFrequency,
    recurringNextDate,
    setRecurringNextDate,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    statsGranularity,
    setStatsGranularity,
    fetchingExpenses,
    visibleExpenses,
    visibleRecurringItems,
    summary,
    categoryChart,
    dateChart,
    periodStats,
    periodComparison,
    handleAuthSubmit,
    handleLogout,
    handleAddExpense,
    handleAddRecurringExpense,
    handleDeleteRecurringExpense,
    handleUpdateRecurringExpense,
    handleUpdateExpense,
    handleDeleteExpense,
  }
}

export const APP_OPTIONS = {
  categories: CATEGORIES,
  currencies: CURRENCIES,
  normalizeCurrency,
  normalizeFrequency,
}
