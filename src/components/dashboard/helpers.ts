import type { Frequency } from '../../types'

export const CATEGORY_PALETTE = [
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
] as const

export function getCategoryColor(name: string): string {
  if (!name) return CATEGORY_PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length]
}

export function formatAmount(value: number | string): string {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function periodLabel(granularity: Frequency): string {
  if (granularity === 'weekly') return 'Week'
  if (granularity === 'yearly') return 'Year'
  return 'Month'
}

export function userInitial(email: string | null | undefined): string {
  if (!email) return '?'
  return email.trim().charAt(0).toUpperCase()
}

export type TrendKind = 'up' | 'down' | 'flat'

export function trendKind(change: number): TrendKind {
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return 'flat'
}
