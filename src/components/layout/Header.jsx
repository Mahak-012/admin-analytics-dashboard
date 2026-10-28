import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { isOffline, setOfflineMode } from '../../api/client'
import { CURRENT_USER } from '../../utils/constants'
import Avatar from '../ui/Avatar'

const TITLES = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/customers': 'Customers',
}

export default function Header({ onMenu }) {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const [offline, setOffline] = useState(isOffline())

  const toggleApi = () => {
    const next = !offline
    setOfflineMode(next)
    setOffline(next)
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation menu">
        <Menu size={19} />
      </button>

      <div className="topbar-title">
        <h1>{TITLES[pathname] || 'Dashboard'}</h1>
        <p>{today}</p>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className={`api-chip${offline ? ' off' : ''}`}
          onClick={toggleApi}
          title="Flip the mock API offline to preview error handling"
        >
          <span className="api-dot" aria-hidden="true" />
          API {offline ? 'Offline' : 'Online'}
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="topbar-user">
          <Avatar name={CURRENT_USER.name} email="mehak@novaadmin.app" />
          <div>
            <p>{CURRENT_USER.name}</p>
            <span>{CURRENT_USER.role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
