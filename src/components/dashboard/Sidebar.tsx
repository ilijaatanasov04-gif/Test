import type { ChangeEvent } from 'react'
import type { Currency, Theme } from '../../types'
import { Icon } from './Icons'
import { userInitial } from './helpers'

export type NavId = 'overview' | 'expenses' | 'recurring' | 'categories' | 'budgets' | 'stats'

type NavItem = {
  id: NavId
  label: string
  icon: React.ReactNode
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Icon.home },
  { id: 'expenses', label: 'Expenses', icon: Icon.list },
  { id: 'recurring', label: 'Recurring', icon: Icon.repeat },
  { id: 'categories', label: 'Categories', icon: Icon.folders },
  { id: 'budgets', label: 'Budgets', icon: Icon.target },
  { id: 'stats', label: 'Statistics', icon: Icon.chart },
]

type SidebarProps = {
  activeTab: NavId
  onTabChange: (id: NavId) => void
  isOpen: boolean
  onClose: () => void
  baseCurrency: Currency
  currencies: Currency[]
  onBaseCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void
  theme: Theme
  onToggleTheme: () => void
  email: string
  onLogout: () => void
}

export function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  baseCurrency,
  currencies,
  onBaseCurrencyChange,
  theme,
  onToggleTheme,
  email,
  onLogout,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-orb">{Icon.wallet}</span>
        <span>Spendly</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeTab === item.id ? 'is-active' : ''}`}
            onClick={() => {
              onTabChange(item.id)
              onClose()
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{userInitial(email)}</div>
          <span>{email}</span>
        </div>
        <div className="sidebar-controls">
          <select className="ghost-select" value={baseCurrency} onChange={onBaseCurrencyChange} aria-label="Base currency">
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? Icon.sun : Icon.moon}
          </button>
          <button type="button" className="icon-btn" onClick={onLogout} aria-label="Logout" title="Logout">
            {Icon.logout}
          </button>
        </div>
      </div>
    </aside>
  )
}
