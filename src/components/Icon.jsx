import styles from './Icon.module.css'

export function Icon({ name, size = 24, style, className, ...props }) {
  return (
    <span
      className={[styles.icon, className].filter(Boolean).join(' ')}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size, ...style }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  )
}
