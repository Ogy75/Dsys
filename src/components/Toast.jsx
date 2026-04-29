import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import styles from './Toast.module.css'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

// ─── Icons ────────────────────────────────────────────────────────────────────

const STATUS_ICONS = {
  info:    { name: 'info',         color: 'var(--color-status-info)' },
  warning: { name: 'warning',      color: 'var(--color-status-warning)' },
  success: { name: 'check_circle', color: 'var(--color-status-success)' },
  danger:  { name: 'cancel',       color: 'var(--color-status-danger)' },
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

// ─── Positions ────────────────────────────────────────────────────────────────

export const POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'center-center',
  'bottom-left', 'bottom-center', 'bottom-right',
]

// Convert 'bottom-right' → 'bottomRight' for CSS module lookup
function posClass(position) {
  return position.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

// Determine slide direction from position string
function animClass(position) {
  if (position.startsWith('top')) return styles.animTop
  if (position.startsWith('bottom')) return styles.animBottom
  return styles.animCenter
}

// ─── Reading-time helper ──────────────────────────────────────────────────────

function readingDuration(title = '', message = '') {
  const text = [title, message].join(' ').trim()
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(6000, Math.ceil(words * (60000 / 200)) + 4000)
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null)

// ─── Individual toast item ────────────────────────────────────────────────────

function ToastItem({ id, variant, title, message, dismissible, action, duration: durationProp, position, onClose }) {
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const duration = durationProp ?? readingDuration(title, message)

  const dismiss = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    setTimeout(() => onClose(id), 120)
  }, [id, onClose])

  useEffect(() => {
    if (dismissible) return
    const timer = setTimeout(dismiss, duration)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const StatusIconForVariant = ICONS[variant]

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        styles.toast,
        animClass(position),
        closing ? styles.closing : '',
      ].join(' ')}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <StatusIconForVariant />
            {title && <span className={styles.title}>{title}</span>}
          </div>
        </div>

        {message && (
          <div className={styles.body}>
            <p className={styles.message}>{message}</p>
          </div>
        )}
      </div>

      {dismissible && (
        <div className={styles.closeWrap}>
          <IconButton
            variant="ghost"
            size="sm"
            icon={<Icon name="close" size={20} />}
            onClick={dismiss}
            aria-label="Dismiss notification"
          />
        </div>
      )}

      {dismissible && action && (
        <div className={styles.actionArea}>
          <button type="button" className={styles.actionBtn} onClick={action.onClick}>
            {action.label}
          </button>
        </div>
      )}

      {/* Loader bar — drains over reading time (non-dismissible) or stays full (dismissible) */}
      <div className={styles.loaderTrack}>
        <div
          className={[
            styles.loaderBar,
            styles[variant],
            !dismissible ? styles.draining : '',
          ].join(' ')}
          style={!dismissible ? { animationDuration: `${duration}ms` } : undefined}
        />
      </div>
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children, position = 'top-right' }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback(({ variant = 'info', title, message, dismissible = false, action, duration }) => {
    const id = nextId.current++
    setToasts(prev => [...prev, { id, variant, title, message, dismissible, action, duration }])
  }, [])

  // Bottom positions stack newest at bottom (reverse column), top/center stack newest at top
  const isBottom = position.startsWith('bottom')

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className={[styles.container, styles[posClass(position)]].join(' ')}
        aria-label="Notifications"
        style={{ flexDirection: isBottom ? 'column-reverse' : 'column' }}
      >
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} position={position} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
