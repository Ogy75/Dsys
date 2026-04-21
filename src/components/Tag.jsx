import { useState } from 'react'
import styles from './Tag.module.css'
import { Icon } from './Icon'

export function Tag({
  size = 'md',
  icon,
  dismissible = false,
  onDismiss,
  disabled = false,
  children,
}) {
  const [dismissing, setDismissing] = useState(false)

  function handleDismiss() {
    setDismissing(true)
    setTimeout(() => onDismiss?.(), 60)
  }

  const cls = [
    styles.tag,
    styles[size],
    dismissible ? styles.hasDismiss : '',
    disabled ? styles.disabled : '',
    dismissing ? styles.dismissing : '',
  ].filter(Boolean).join(' ')

  return (
    <span className={cls}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {dismissible && (
        <button
          type="button"
          className={styles.dismissBtn}
          onClick={handleDismiss}
          disabled={disabled}
          aria-label="Remove"
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </span>
  )
}
