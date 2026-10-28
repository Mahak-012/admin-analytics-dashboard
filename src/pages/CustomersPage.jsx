import { useEffect, useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'
import useCustomers from '../hooks/useCustomers'
import useDebouncedValue from '../hooks/useDebouncedValue'
import PageHeader from '../components/ui/PageHeader'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import SortTh from '../components/ui/SortTh'
import Pagination from '../components/ui/Pagination'
import { moneyCompact, shortDate } from '../utils/format'

const PAGE_SIZE = 10
const ACTIVE_WINDOW = 30 * 86400000

export default function CustomersPage() {
  const { customers, status, error, reload } = useCustomers()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ field: 'spent', dir: 'desc' })
  const [page, setPage] = useState(1)

  const search = useDebouncedValue(query)
  const loading = status === 'loading'

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return customers.filter(c => !q || `${c.name} ${c.email}`.toLowerCase().includes(q))
  }, [customers, search])

  const sorted = useMemo(() => {
    const list = [...filtered]
    const { field, dir } = sort
    const sign = dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      const va = a[field]
      const vb = b[field]
      if (va < vb) return -sign
      if (va > vb) return sign
      return 0
    })
    return list
  }, [filtered, sort])

  useEffect(() => {
    setPage(1)
  }, [search])

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pages)
  const start = (safePage - 1) * PAGE_SIZE
  const rows = sorted.slice(start, start + PAGE_SIZE)

  const onSort = field =>
    setSort(s => (s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' }))

  const isActive = c => c.lastOrder && Date.now() - new Date(c.lastOrder).getTime() <= ACTIVE_WINDOW

  return (
    <div className="page">
      <PageHeader title="Customers" subtitle="Everyone who shopped with you, ranked by lifetime spend." />

      {status === 'error' ? (
        <div className="card">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : (
        <div className="card">
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                className="input"
                type="search"
                placeholder="Search customers by name or email…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search customers"
              />
            </div>
          </div>

          <p className="result-count">{loading ? 'Loading customers…' : `${sorted.length} customers`}</p>

          {!loading && sorted.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No customers found"
              message="Try a different name or email, or reset the search."
            />
          ) : (
            <>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <SortTh field="orders" sort={sort} onSort={onSort}>
                        Orders
                      </SortTh>
                      <SortTh field="spent" sort={sort} onSort={onSort} className="th-amount">
                        Total spent
                      </SortTh>
                      <SortTh field="lastOrder" sort={sort} onSort={onSort}>
                        Last order
                      </SortTh>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 8 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 5 }).map((__, j) => (
                              <td key={j}>
                                <span className="skeleton" style={{ width: `${50 + ((i * 13 + j * 31) % 40)}%` }} />
                              </td>
                            ))}
                          </tr>
                        ))
                      : rows.map(c => (
                          <tr key={c.email}>
                            <td>
                              <div className="row-customer">
                                <Avatar name={c.name} email={c.email} size="avatar-sm" />
                                <div>
                                  <div className="rc-name">{c.name}</div>
                                  <div className="rc-email">{c.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{c.orders}</td>
                            <td className="td-amount">{moneyCompact(c.spent)}</td>
                            <td className="cell-date">{c.lastOrder ? shortDate(c.lastOrder) : '—'}</td>
                            <td>
                              <Badge status={isActive(c) ? 'active' : 'inactive'} />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              {!loading && (
                <Pagination
                  page={safePage}
                  pages={pages}
                  from={sorted.length ? start + 1 : 0}
                  to={Math.min(start + PAGE_SIZE, sorted.length)}
                  total={sorted.length}
                  onPage={setPage}
                  label="customers"
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
