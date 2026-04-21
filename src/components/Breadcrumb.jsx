import styles from './Breadcrumb.module.css'

function ChevronIcon() {
  return (
    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" aria-hidden="true">
      <path d="M1 1L5.5 5.5L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1
          return [
            i > 0 && (
              <li key={`sep-${i}`} className={styles.separator} aria-hidden="true">
                <ChevronIcon />
              </li>
            ),
            <li key={item.label} className={styles.item}>
              {isCurrent ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href ?? '#'}
                  className={styles.link}
                  onClick={e => { e.preventDefault(); item.onClick?.() }}
                >
                  {item.label}
                </a>
              )}
            </li>,
          ]
        })}
      </ol>
    </nav>
  )
}
