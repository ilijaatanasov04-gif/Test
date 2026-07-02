import type { Currency } from '../../types'
import { formatAmount } from './helpers'

type HeroCardProps = {
  total: number
  baseCurrency: Currency
  monthTotal: number
  recurringCount: number
  categoryCount: number
}

export function HeroCard({ total, baseCurrency, monthTotal, recurringCount, categoryCount }: HeroCardProps) {
  return (
    <section className="hero-card">
      <p className="hero-label">Total Spent</p>
      <h2 className="hero-value">
        {formatAmount(total)}
        <small>{baseCurrency}</small>
      </h2>
      <div className="hero-meta">
        <div className="hero-meta-item">
          <label>This month</label>
          <div>
            {formatAmount(monthTotal)} <span style={{ opacity: 0.7, fontWeight: 600, fontSize: '0.7em' }}>{baseCurrency}</span>
          </div>
        </div>
        <div className="hero-meta-item">
          <label>Active recurring</label>
          <div>{recurringCount}</div>
        </div>
        <div className="hero-meta-item">
          <label>Categories</label>
          <div>{categoryCount}</div>
        </div>
      </div>
    </section>
  )
}
