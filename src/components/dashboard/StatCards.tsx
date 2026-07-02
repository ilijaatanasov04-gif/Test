import type { CategoryChartPoint, Currency, Frequency, PeriodComparison } from '../../types'
import { Icon } from './Icons'
import { formatAmount, periodLabel, trendKind } from './helpers'

type StatCardsProps = {
  baseCurrency: Currency
  periodComparison: PeriodComparison
  statsGranularity: Frequency
  topCategory: CategoryChartPoint | null
  topCategoryShare: number
  expenseCount: number
  totalRecurringMonthly: number
}

export function StatCards({
  baseCurrency,
  periodComparison,
  statsGranularity,
  topCategory,
  topCategoryShare,
  expenseCount,
  totalRecurringMonthly,
}: StatCardsProps) {
  const change = periodComparison.change
  const changePercent = periodComparison.changePercent
  const tk = trendKind(change)

  return (
    <div className="stat-grid">
      <article className="stat-card">
        <div className="stat-icon">{Icon.calendar}</div>
        <div>
          <p className="stat-label">This {periodLabel(statsGranularity)}</p>
          <p className="stat-value">
            {formatAmount(periodComparison.currentTotal)} <small>{baseCurrency}</small>
          </p>
        </div>
        <span className={`stat-trend ${tk}`}>
          {tk === 'up' ? Icon.arrowUp : tk === 'down' ? Icon.arrowDown : Icon.minus}
          {changePercent === null
            ? 'No prior data'
            : `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}% vs last`}
        </span>
      </article>

      <article className="stat-card">
        <div className="stat-icon">{Icon.repeat}</div>
        <div>
          <p className="stat-label">Recurring / month</p>
          <p className="stat-value">
            {formatAmount(totalRecurringMonthly)} <small>{baseCurrency}</small>
          </p>
        </div>
        <span className="stat-trend flat">Estimated based on rules</span>
      </article>

      <article className="stat-card">
        <div className="stat-icon">{Icon.pieChart}</div>
        <div>
          <p className="stat-label">Top category</p>
          <p className="stat-value">{topCategory ? topCategory.name : '—'}</p>
        </div>
        <span className="stat-trend flat">
          {topCategory ? `${formatAmount(topCategory.total)} ${baseCurrency} · ${topCategoryShare.toFixed(0)}%` : 'No expenses yet'}
        </span>
      </article>

      <article className="stat-card">
        <div className="stat-icon">{Icon.list}</div>
        <div>
          <p className="stat-label">Expenses logged</p>
          <p className="stat-value">{expenseCount}</p>
        </div>
        <span className="stat-trend flat">{expenseCount === 1 ? 'entry' : 'entries'} total</span>
      </article>
    </div>
  )
}
