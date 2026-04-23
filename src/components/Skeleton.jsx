import styles from './Skeleton.module.css'

export function Skeleton({
  width,
  height = 12,
  radius,
  circle = false,
  block = false,
  style,
  className = '',
  ...rest
}) {
  const cls = [
    styles.skeleton,
    circle ? styles.circle : '',
    block ? styles.block : '',
    className,
  ].filter(Boolean).join(' ')

  const resolvedStyle = {
    width: width ?? '100%',
    height,
    ...(radius != null && !circle ? { borderRadius: radius } : {}),
    ...style,
  }

  return <span className={cls} style={resolvedStyle} aria-hidden="true" {...rest} />
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  checkbox = false,
  showHeader = true,
  avatarFirstCol = false,
}) {
  const colWidths = Array.isArray(columns)
    ? columns
    : Array.from({ length: columns }, (_, i) => (i === 0 ? '40%' : `${Math.floor(60 / (columns - 1))}%`))

  return (
    <div className={styles.tableContainer} role="status" aria-label="Loading table data">
      {showHeader && (
        <div className={styles.tableHeader}>
          {checkbox && (
            <div className={styles.tableCheckboxCol}>
              <Skeleton width={16} height={16} radius={4} />
            </div>
          )}
          {colWidths.map((w, i) => (
            <div key={i} className={styles.tableHeaderCell} style={{ flex: `1 1 ${w}` }}>
              <Skeleton width="60%" height={12} />
            </div>
          ))}
        </div>
      )}

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className={styles.tableRow}>
          {checkbox && (
            <div className={styles.tableCheckboxCol}>
              <Skeleton width={16} height={16} radius={4} />
            </div>
          )}
          {colWidths.map((w, colIdx) => (
            <div key={colIdx} className={styles.tableCell} style={{ flex: `1 1 ${w}` }}>
              {colIdx === 0 && avatarFirstCol && <Skeleton width={32} height={32} circle />}
              <Skeleton
                width={colIdx === 0 ? '70%' : `${50 + ((rowIdx * 7 + colIdx * 13) % 35)}%`}
                height={12}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
