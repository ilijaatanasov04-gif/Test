import type { Currency, Frequency } from '../types'

export const CATEGORIES = ['Food', 'Transport', 'Other'] as const
export const CURRENCIES = ['MKD', 'EUR', 'USD'] as const
export const FREQUENCIES = ['weekly', 'monthly', 'yearly'] as const

const RATE_TO_USD: Record<Currency, number> = {
  MKD: 0.0176,
  EUR: 1.08,
  USD: 1,
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function normalizeCurrency(value: string): Currency {
  return CURRENCIES.includes(value as Currency) ? (value as Currency) : 'MKD'
}

export function normalizeFrequency(value: string): Frequency {
  return FREQUENCIES.includes(value as Frequency) ? (value as Frequency) : 'monthly'
}

function toYmd(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

function toMonthLabel(yyyyMmDd: string): string {
  const monthStart = new Date(`${yyyyMmDd.slice(0, 7)}-01T00:00:00Z`)
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(monthStart)
}

function addDays(yyyyMmDd: string, days: number): string {
  const date = new Date(`${yyyyMmDd}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return toYmd(date)
}

function addOneMonth(yyyyMmDd: string): string {
  const [yearRaw, monthRaw, dayRaw] = yyyyMmDd.split('-').map(Number)
  let year = yearRaw
  let month = monthRaw + 1

  if (month > 12) {
    month = 1
    year += 1
  }

  const monthMaxDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const day = Math.min(dayRaw, monthMaxDay)

  return `${year}-${pad(month)}-${pad(day)}`
}

function addOneYear(yyyyMmDd: string): string {
  const [yearRaw, monthRaw, dayRaw] = yyyyMmDd.split('-').map(Number)
  const year = yearRaw + 1
  const monthMaxDay = new Date(Date.UTC(year, monthRaw, 0)).getUTCDate()
  const day = Math.min(dayRaw, monthMaxDay)
  return `${year}-${pad(monthRaw)}-${pad(day)}`
}

export function addRecurringInterval(yyyyMmDd: string, frequency: Frequency): string {
  if (frequency === 'weekly') return addDays(yyyyMmDd, 7)
  if (frequency === 'yearly') return addOneYear(yyyyMmDd)
  return addOneMonth(yyyyMmDd)
}

function getIsoWeekKey(yyyyMmDd: string): string {
  const date = new Date(`${yyyyMmDd}T00:00:00Z`)
  const day = date.getUTCDay() || 7
  const weekStart = new Date(date)
  weekStart.setUTCDate(date.getUTCDate() - day + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)
  const startShort = `${pad(weekStart.getUTCDate())}.${pad(weekStart.getUTCMonth() + 1)}`
  const endShort = `${pad(weekEnd.getUTCDate())}.${pad(weekEnd.getUTCMonth() + 1)}`

  if (weekStart.getUTCFullYear() === weekEnd.getUTCFullYear()) {
    return `${startShort}-${endShort}`
  }

  return `${toYmd(weekStart)}-${toYmd(weekEnd)}`
}

export function getStatsKey(yyyyMmDd: string, granularity: Frequency): string {
  if (granularity === 'weekly') return getIsoWeekKey(yyyyMmDd)
  if (granularity === 'yearly') return yyyyMmDd.slice(0, 4)
  return toMonthLabel(yyyyMmDd)
}

export function getStatsBucket(yyyyMmDd: string, granularity: Frequency): { label: string; sortKey: string } {
  if (granularity === 'weekly') {
    const date = new Date(`${yyyyMmDd}T00:00:00Z`)
    const day = date.getUTCDay() || 7
    const weekStart = new Date(date)
    weekStart.setUTCDate(date.getUTCDate() - day + 1)
    const sortKey = toYmd(weekStart)
    return { label: getIsoWeekKey(yyyyMmDd), sortKey }
  }

  if (granularity === 'yearly') {
    const year = yyyyMmDd.slice(0, 4)
    return { label: year, sortKey: `${year}-01-01` }
  }

  const month = yyyyMmDd.slice(0, 7)
  return { label: toMonthLabel(yyyyMmDd), sortKey: `${month}-01` }
}

export function shiftDateByGranularity(yyyyMmDd: string, granularity: Frequency, direction: 'previous' | 'next'): string {
  const step = direction === 'previous' ? -1 : 1
  if (granularity === 'weekly') return addDays(yyyyMmDd, 7 * step)
  if (granularity === 'yearly') {
    if (step < 0) {
      const [yearRaw, monthRaw, dayRaw] = yyyyMmDd.split('-').map(Number)
      const year = yearRaw - 1
      const monthMaxDay = new Date(Date.UTC(year, monthRaw, 0)).getUTCDate()
      const day = Math.min(dayRaw, monthMaxDay)
      return `${year}-${pad(monthRaw)}-${pad(day)}`
    }
    return addOneYear(yyyyMmDd)
  }

  if (step < 0) {
    const [yearRaw, monthRaw, dayRaw] = yyyyMmDd.split('-').map(Number)
    let year = yearRaw
    let month = monthRaw - 1

    if (month < 1) {
      month = 12
      year -= 1
    }

    const monthMaxDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const day = Math.min(dayRaw, monthMaxDay)
    return `${year}-${pad(month)}-${pad(day)}`
  }

  return addOneMonth(yyyyMmDd)
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const from = normalizeCurrency(fromCurrency)
  const to = normalizeCurrency(toCurrency)
  const fromRate = RATE_TO_USD[from]
  const toRate = RATE_TO_USD[to]

  if (!fromRate || !toRate) return amount
  if (from === to) return amount

  return (amount * fromRate) / toRate
}
