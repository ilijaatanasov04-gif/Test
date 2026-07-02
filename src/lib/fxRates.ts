import type { Currency } from '../types'

const CACHE_KEY = 'fxRates'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export const FALLBACK_RATE_TO_USD: Record<Currency, number> = {
  MKD: 0.0176,
  EUR: 1.08,
  USD: 1,
}

type CacheShape = {
  fetchedAt: number
  rates: Record<Currency, number>
}

let inMemory: CacheShape | null = null
let inflight: Promise<Record<Currency, number>> | null = null

export function loadCachedRates(): Record<Currency, number> {
  if (inMemory) return inMemory.rates
  if (typeof window === 'undefined') return { ...FALLBACK_RATE_TO_USD }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return { ...FALLBACK_RATE_TO_USD }
    const parsed = JSON.parse(raw) as CacheShape
    if (!parsed?.rates || typeof parsed.fetchedAt !== 'number') return { ...FALLBACK_RATE_TO_USD }
    inMemory = parsed
    return parsed.rates
  } catch {
    return { ...FALLBACK_RATE_TO_USD }
  }
}

export function shouldRefreshRates(): boolean {
  if (!inMemory) {
    if (typeof window === 'undefined') return false
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return true
    try {
      inMemory = JSON.parse(raw) as CacheShape
    } catch {
      return true
    }
  }
  return Date.now() - inMemory.fetchedAt > CACHE_TTL_MS
}

export async function refreshRates(): Promise<Record<Currency, number>> {
  if (inflight) return inflight

  inflight = fetchRates()
    .then((rates) => {
      const payload: CacheShape = { fetchedAt: Date.now(), rates }
      inMemory = payload
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
        }
      } catch {
        /* ignore quota errors */
      }
      return rates
    })
    .catch(() => loadCachedRates())
    .finally(() => {
      inflight = null
    })

  return inflight
}

async function fetchRates(): Promise<Record<Currency, number>> {
  const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=MKD,EUR,USD')
  if (!response.ok) throw new Error(`FX API responded ${response.status}`)

  const data = (await response.json()) as { rates?: Record<string, number> }
  const usdPerBase = data.rates

  if (!usdPerBase || !usdPerBase.MKD || !usdPerBase.EUR) {
    throw new Error('FX API missing expected rates')
  }

  return {
    USD: 1,
    MKD: 1 / usdPerBase.MKD,
    EUR: 1 / usdPerBase.EUR,
  }
}
