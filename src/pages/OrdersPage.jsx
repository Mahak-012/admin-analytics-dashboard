import { useEffect, useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import useOrders from '../hooks/useOrders'
import useDebouncedValue from '../hooks/useDebouncedValue'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import { useToast } from '../components/ui/Toasts'
import OrdersToolbar from '../components/orders/OrdersToolbar'
import OrdersTable from '../components/orders/OrdersTable'
import OrderFormModal from '../components/orders/OrderFormModal'
import OrderDetailsModal from '../components/orders/OrderDetailsModal'
import { downloadCsv } from '../utils/csv'
import { todayStr } from '../utils/format'

const PAGE_SIZE = 8

export default function OrdersPage() {
  const { orders, status, error, reload, create, update, remove } = useOrders()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [details, setDetails] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const search = useDebouncedValue(query)
  const loading = status === 'loading'

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (category !== 'all' && o.category !== category) return false
      if (from && o.date < from) return false
      if (to && o.date > to) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = `${o.id} ${o.customer.name} ${o.customer.email} ${o.category}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [orders, statusFilter, category, from, to, search])

  const sorted = useMemo(() => {
    const list = [...filtered]
    const { field, dir } = sort
    const sign = dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      let va = a[field]
      let vb = b[field]
      if (field === 'customer') {
        va = a.customer.name.toLowerCase()
        vb = b.customer.name.toLowerCase()
      }
      if (va < vb) return -sign
      if (va > vb) return sign
      return 0
    })
    return list
  }, [filtered, sort])

  // back to page 1 whenever the filter inputs change
  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, category, from, to])

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pages)
  const start = (safePage - 1) * PAGE_SIZE
  const rows = sorted.slice(start, start + PAGE_SIZE)
  const hasFilters = query || statusFilter !== 'all' || category !== 'all' || from || to

  const onSort = field => {
    setSort(s =>
      s.field === field
        ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: field === 'date' || field === 'amount' ? 'desc' : 'asc' },
    )
  }

  const resetFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setCategory('all')
    setFrom('')
    setTo('')
  }

  const handleSave = async values => {
    try {
      if (editing) {
        await update(editing.id, values)
        toast('Order updated successfully')
      } else {
        await create(values)
        toast('Order created successfully')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await remove(deleteTarget.id)
      toast(`Order ${deleteTarget.id} deleted`)
      setDeleteTarget(null)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const exportCsv = () => {
    const ok = downloadCsv(
      `orders-${todayStr()}.csv`,
      sorted.map(o => ({
        id: o.id,
        customer: o.customer.name,
        email: o.customer.email,
        date: o.date,
        category: o.category,
        items: o.items,
        amount: o.amount,
        status: o.status,
        payment: o.payment,
      })),
    )
    toast(ok ? `Exported ${sorted.length} orders to CSV` : 'Nothing to export', ok ? 'success' : 'info')
  }

  return (
    <div className="page">
      <PageHeader
        title="Orders"
        subtitle="Search, filter and manage customer orders."
        actions={
          <>
            <Button variant="outline" icon={Download} onClick={exportCsv} disabled={loading}>
              Export CSV
            </Button>
            <Button
              icon={Plus}
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
              disabled={loading}
            >
              Add order
            </Button>
          </>
        }
      />

      {status === 'error' ? (
        <div className="card">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : (
        <div className="card">
          <OrdersToolbar
            query={query}
            onQuery={setQuery}
            status={statusFilter}
            onStatus={setStatusFilter}
            category={category}
            onCategory={setCategory}
            from={from}
            onFrom={setFrom}
            to={to}
            onTo={setTo}
            onReset={resetFilters}
          />

          <p className="result-count">
            {loading ? 'Loading orders…' : `${sorted.length} of ${orders.length} orders`}
          </p>

          {!loading && sorted.length === 0 ? (
            <EmptyState
              title={hasFilters ? 'No orders match your filters' : 'No orders yet'}
              message={
                hasFilters
                  ? 'Try a different search term or clear the filters to see everything.'
                  : 'Once orders come in, they will show up here.'
              }
              actionLabel={hasFilters ? 'Clear all filters' : undefined}
              onAction={hasFilters ? resetFilters : undefined}
            />
          ) : (
            <>
              <OrdersTable
                rows={rows}
                sort={sort}
                onSort={onSort}
                loading={loading}
                onView={setDetails}
                onEdit={o => {
                  setEditing(o)
                  setFormOpen(true)
                }}
                onDelete={setDeleteTarget}
              />
              {!loading && (
                <Pagination
                  page={safePage}
                  pages={pages}
                  from={sorted.length ? start + 1 : 0}
                  to={Math.min(start + PAGE_SIZE, sorted.length)}
                  total={sorted.length}
                  onPage={setPage}
                />
              )}
            </>
          )}
        </div>
      )}

      <OrderFormModal
        open={formOpen}
        order={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      <OrderDetailsModal
        open={Boolean(details)}
        order={details}
        onClose={() => setDetails(null)}
        onEdit={o => {
          setDetails(null)
          setEditing(o)
          setFormOpen(true)
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete order"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        message={
          deleteTarget && (
            <>
              You are about to permanently delete <strong>{deleteTarget.id}</strong> from{' '}
              <strong>{deleteTarget.customer.name}</strong>. This action cannot be undone.
            </>
          )
        }
      />
    </div>
  )
}
