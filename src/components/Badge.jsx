import styles from './Badge.module.css'

export function Badge({
  variant = 'gray',
  size = 'md',
  iconLeft,
  iconRight,
  children,
}) {
  const icon = iconLeft ?? iconRight
  const isLeft = Boolean(iconLeft)

  return (
    <span className={[styles.badge, styles[variant], styles[size]].join(' ')}>
      {icon && isLeft && <span className={styles.iconLeft} aria-hidden="true">{icon}</span>}
      {children}
      {icon && !isLeft && <span className={styles.iconRight} aria-hidden="true">{icon}</span>}
    </span>
  )
}
