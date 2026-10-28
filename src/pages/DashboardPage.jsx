import { Link } from 'react-router-dom'
import { Receipt, ShoppingBag, Users, Wallet } from 'lucide-react'
import useOrders from '../hooks/useOrders'
import PageHeader from '../components/ui/PageHeader'
import ErrorState from '../components/ui/ErrorState'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import KpiCard from '../components/kpi/KpiCard'
import RevenueAreaChart from '../components/charts/RevenueAreaChart'
import CategoryBarChart from '../components/charts/CategoryBarChart'
import StatusDonutChart from '../components/charts/StatusDonutChart'
import {
  kpiSummary,
  monthlySeries,
  categoryBreakdown,
  statusBreakdown,
  recentOrders,
} from '../utils/stats'
import { money, moneyCompact, shortDate } from '../utils/format'
import { CATEGORY_COLORS, CATEGORY_SHORT, CURRENT_USER } from '../utils/constants'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { orders, status, error, reload } = useOrders()

  if (status === 'error') {
    return (
      <div className="page">
        <ErrorState fullPage title="Dashboard failed to load" message={error} onRetry={reload} />
      </div>
    )
  }

  const loading = status === 'loading'
  const series = monthlySeries(orders)
  const kpi = kpiSummary(orders)
  const recent = recentOrders(orders, 6)
  const categories = categoryBreakdown(orders)

  return (
    <div className="page">
      <PageHeader
        title={`${greeting()}, ${CURRENT_USER.name}`}
        subtitle="Here's what's happening with your store today."
        actions={
          <Link className="btn btn-primary" to="/orders">
            <ShoppingBag size={16} />
            Manage orders
          </Link>
        }
      />

      <section className="kpi-grid" aria-label="Key metrics">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card kpi" style={{ height: 152 }} aria-hidden="true" />
            ))
          : (
            <>
              <KpiCard
                label="Revenue (30d)"
                value={moneyCompact(kpi.revenue.value)}
                delta={kpi.revenue.delta}
                icon={Wallet}
                tint="indigo"
                spark={series.map(s => s.revenue)}
              />
              <KpiCard
                label="Orders (30d)"
                value={kpi.orders.value}
                delta={kpi.orders.delta}
                icon={ShoppingBag}
                tint="amber"
                spark={series.map(s => s.orders)}
              />
              <KpiCard
                label="Active customers"
                value={kpi.customers.value}
                delta={kpi.customers.delta}
                icon={Users}
                tint="green"
                spark={series.map(s => s.actives)}
              />
              <KpiCard
                label="Avg order value"
                value={moneyCompact(kpi.aov.value)}
                delta={kpi.aov.delta}
                icon={Receipt}
                tint="sky"
                spark={series.map(s => s.aov)}
              />
            </>
          )}
      </section>

      <section className="dash-grid" aria-label="Analytics">
        <article className="card">
          <div className="card-head">
            <div>
              <h3>Revenue overview</h3>
              <p className="card-sub">Monthly revenue for the last 8 months</p>
            </div>
          </div>
          {loading ? (
            <div className="skeleton skeleton-block" style={{ height: 250 }} />
          ) : (
            <div className="chart-body">
              <RevenueAreaChart data={series} />
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-head">
            <div>
              <h3>Order status</h3>
              <p className="card-sub">Distribution across all orders</p>
            </div>
          </div>
          {loading ? (
            <div className="skeleton skeleton-block" style={{ height: 250 }} />
          ) : (
            <div style={{ padding: '16px 8px 0' }}>
              <StatusDonutChart data={statusBreakdown(orders)} />
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-head">
            <div>
              <h3>Sales by category</h3>
              <p className="card-sub">Order volume per category</p>
            </div>
            {!loading && (
              <div className="legend-chips">
                {categories.map(c => (
                  <span key={c.name} className="chip">
                    <span className="chip-dot" style={{ background: CATEGORY_COLORS[c.name] }} />
                    {CATEGORY_SHORT[c.name] || c.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          {loading ? (
            <div className="skeleton skeleton-block" style={{ height: 250 }} />
          ) : (
            <div className="chart-body">
              <CategoryBarChart data={categories} />
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-head">
            <div>
              <h3>Recent orders</h3>
              <p className="card-sub">Latest activity</p>
            </div>
            <Link className="link-arrow" to="/orders">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="mini-list">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mini-row">
                  <span className="skeleton" style={{ width: '72%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mini-list">
              {recent.map(o => (
                <div key={o.id} className="mini-row">
                  <Avatar name={o.customer.name} email={o.customer.email} size="avatar-sm" />
                  <div className="mini-main">
                    <p>{o.customer.name}</p>
                    <span className="mini-id">
                      {o.id} · {shortDate(o.date)}
                    </span>
                  </div>
                  <div className="mini-right">
                    <span className="mini-amount">{money(o.amount)}</span>
                    <Badge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
