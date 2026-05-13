import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryChartPoint, DateChartPoint } from '../types'

type SpendingChartsProps = {
  categoryChart: CategoryChartPoint[]
  dateChart: DateChartPoint[]
}

const PALETTE = [
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
]

function colorFor(name: string): string {
  if (!name) return PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

export function SpendingCharts({ categoryChart, dateChart }: SpendingChartsProps) {
  const sortedCategories = [...categoryChart].sort((a, b) => b.total - a.total)

  return (
    <div className="charts-grid">
      <figure>
        <figcaption>By category</figcaption>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sortedCategories} margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
            <Bar dataKey="total" radius={[8, 8, 2, 2]}>
              {sortedCategories.map((entry) => (
                <Cell key={entry.name} fill={colorFor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </figure>

      <figure>
        <figcaption>Over time</figcaption>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dateChart} margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="dateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <Tooltip cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#dateGradient)"
              activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </figure>
    </div>
  )
}

export default SpendingCharts
