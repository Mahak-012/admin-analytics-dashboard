import { ChevronLeft, ChevronRight } from 'lucide-react'

function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)

  const out = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pages - 1, page + 1)
  if (start > 2) out.push('…')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < pages - 1) out.push('…')
  out.push(pages)
  return out
}

export default function Pagination({ page, pages, from, to, total, onPage, label = 'orders' }) {
  if (pages <= 1) return null

  return (
    <div className="pagination">
      <p className="pg-info">
        Showing {from}–{to} of {total} {label}
      </p>
      <div className="pg-btns">
        <button
          type="button"
          className="page-btn"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        {pageList(page, pages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="pg-ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="page-btn"
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
