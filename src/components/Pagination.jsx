import styles from './Pagination.module.css'
import { Icon } from './Icon'

function getPageItems(current, total) {
  const pages = new Set()
  pages.add(1)
  pages.add(total)

  if (current <= 3) {
    for (let i = 1; i <= Math.min(5, total); i++) pages.add(i)
  } else if (current >= total - 2) {
    for (let i = Math.max(1, total - 4); i <= total; i++) pages.add(i)
  } else {
    pages.add(current - 1)
    pages.add(current)
    pages.add(current + 1)
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const items = []
  for (let i = 0; i < sorted.length; i++) {
    const gap = i > 0 ? sorted[i] - sorted[i - 1] : 0
    if (gap === 2) {
      items.push({ type: 'page', value: sorted[i] - 1 })
    } else if (gap > 2) {
      items.push({ type: 'ellipsis', key: `ellipsis-${i}` })
    }
    items.push({ type: 'page', value: sorted[i] })
  }
  return items
}

export function Pagination({
  page = 1,
  total = 1,
  onChange,
  size = 'lg',
}) {
  if (total <= 1) return null

  const items = getPageItems(page, total)
  const isMd = size === 'md'

  function navigate(n) {
    const clamped = Math.max(1, Math.min(total, n))
    if (clamped !== page) onChange?.(clamped)
  }

  return (
    <nav aria-label="Pagination">
        <ul className={[styles.list, isMd ? styles.listMd : ''].filter(Boolean).join(' ')} role="list">
          <li>
            <button
              type="button"
              className={[styles.btn, isMd ? styles.btnMd : '', styles.arrow].filter(Boolean).join(' ')}
              onClick={() => navigate(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <Icon name="chevron_left" size={isMd ? 16 : 20} />
            </button>
          </li>

          {items.map(item =>
            item.type === 'ellipsis' ? (
              <li key={item.key} className={[styles.ellipsis, isMd ? styles.ellipsisMd : ''].filter(Boolean).join(' ')} aria-hidden="true">…</li>
            ) : (
              <li key={item.value}>
                <button
                  type="button"
                  className={[styles.btn, isMd ? styles.btnMd : '', item.value === page ? styles.active : ''].filter(Boolean).join(' ')}
                  onClick={() => navigate(item.value)}
                  aria-label={`Page ${item.value}`}
                  aria-current={item.value === page ? 'page' : undefined}
                >
                  {item.value}
                </button>
              </li>
            )
          )}

          <li>
            <button
              type="button"
              className={[styles.btn, isMd ? styles.btnMd : '', styles.arrow].filter(Boolean).join(' ')}
              onClick={() => navigate(page + 1)}
              disabled={page >= total}
              aria-label="Next page"
            >
              <Icon name="chevron_right" size={isMd ? 16 : 20} />
            </button>
          </li>
        </ul>
    </nav>
  )
}
