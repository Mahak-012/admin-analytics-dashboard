import { NavLink } from 'react-router-dom'
import { BarChart3, LayoutDashboard, ShoppingBag, Users } from 'lucide-react'
import { APP_NAME, CURRENT_USER } from '../../utils/constants'
import Avatar from '../ui/Avatar'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/customers', label: 'Customers', icon: Users },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay${open ? ' show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">
            <BarChart3 size={20} />
          </span>
          <div>
            <p className="brand-name">{APP_NAME}</p>
            <p className="brand-sub">Analytics suite</p>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <p className="nav-title">Menu</p>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="side-user">
            <Avatar name={CURRENT_USER.name} email="mehak@novaadmin.app" />
            <div>
              <p>{CURRENT_USER.name}</p>
              <span>{CURRENT_USER.role}</span>
            </div>
          </div>
          <p className="version">{APP_NAME} v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
