import { useState } from 'react'
import styles from './Alert.module.css'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

const STATUS_ICONS = {
  info:    { name: 'info',         color: '#0e7490' },
  warning: { name: 'warning',      color: '#b45309' },
  success: { name: 'check_circle', color: '#5CB335' },
  danger:  { name: 'cancel',       color: '#DC2626' },
}

function StatusIcon({ variant }) {
  const { name, color } = STATUS_ICONS[variant]
  return <Icon name={name} style={{ color }} />
}

const ICONS = {
  info:    () => <StatusIcon variant="info" />,
  warning: () => <StatusIcon variant="warning" />,
  success: () => <StatusIcon variant="success" />,
  danger:  () => <StatusIcon variant="danger" />,
}

export function Alert({
  variant = 'info',
  title,
  children,
  link,
  dismissable = false,
  onDismiss,
}) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  const VariantIcon = ICONS[variant]

  return (
    <div className={[styles.alert, styles[variant]].join(' ')} role="alert">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <VariantIcon />
          {title && <span className={styles.title}>{title}</span>}
        </div>
        {dismissable && (
          <IconButton
            variant="ghost"
            size="sm"
            icon={<Icon name="close" size={20} />}
            onClick={handleDismiss}
            aria-label="Dismiss alert"
          />
        )}
      </div>
      {(children || link) && (
        <div className={styles.body}>
          {children && <p className={styles.message}>{children}</p>}
          {link && (
            <a href={link.href ?? '#'} className={styles.link}>{link.label}</a>
          )}
        </div>
      )}
    </div>
  )
}
