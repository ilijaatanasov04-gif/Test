import type { ChangeEvent } from 'react'
import type { Currency, Frequency, PeriodComparison, PeriodStats } from '../../types'
import { Icon } from './Icons'
import { formatAmount, periodLabel, trendKind } from './helpers'

type StatsSectionProps = {
  baseCurrency: Currency
  statsGranularity: Frequency
  onStatsGranularityChange: (event: ChangeEvent<HTMLSelectElement>) => void
  periodStats: PeriodStats
  periodComparison: PeriodComparison
}

export function StatsSection({
  baseCurrency,
  statsGranularity,
  onStatsGranularityChange,
  periodStats,
  periodComparison,
}: StatsSectionProps) {
  const change = periodComparison.change
  const changePercent = periodComparison.changePercent
  const tk = trendKind(change)
  const trendLabel = changePercent === null
    ? 'n/a'
    : `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Statistics</h2>
        <select value={statsGranularity} onChange={onStatsGranularityChange}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {periodStats.rows.length ? (
        <>
          <div className="compare-grid">
            <article className="compare-card">
              <h3>Current {periodLabel(statsGranularity)}</h3>
              <p>{periodComparison.currentKey}</p>
              <strong>
                {formatAmount(periodComparison.currentTotal)} {baseCurrency}
              </strong>
            </article>
            <article className="compare-card">
              <h3>Previous {periodLabel(statsGranularity)}</h3>
              <p>{periodComparison.previousKey}</p>
              <strong>
                {formatAmount(periodComparison.previousTotal)} {baseCurrency}
              </strong>
            </article>
            <article className="compare-card">
              <h3>Difference</h3>
              <p>
                {change > 0 ? '+' : ''}
                {formatAmount(change)} {baseCurrency}
              </p>
              <strong>
                <span className={`diff-pill ${tk}`}>
                  {tk === 'up' ? Icon.arrowUp : tk === 'down' ? Icon.arrowDown : Icon.minus}
                  {trendLabel}
                </span>
              </strong>
            </article>
          </div>

          <div className="monthly-top">
            <p>
              Average per {periodLabel(statsGranularity).toLowerCase()}: <strong>{formatAmount(periodStats.average)} {baseCurrency}</strong>
            </p>
            {periodStats.best ? (
              <p>
                Highest {periodLabel(statsGranularity).toLowerCase()}: <strong>{periodStats.best.month}</strong> ({formatAmount(periodStats.best.total)} {baseCurrency})
              </p>
            ) : null}
          </div>

          <div className="table-wrap monthly-wrap">
            <table>
              <thead>
                <tr>
                  <th>{periodLabel(statsGranularity)}</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {periodStats.rows.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td className="amount-pos">{formatAmount(row.total)} {baseCurrency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{Icon.chart}</div>
          <h3>No statistics yet</h3>
          <p>Once you log a few expenses, you'll see breakdowns by week, month, and year here.</p>
        </div>
      )}
    </section>
  )
}
