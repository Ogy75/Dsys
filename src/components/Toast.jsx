import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import styles from './Toast.module.css'
import { Icon } from './Icon'

// ─── Icons ────────────────────────────────────────────────────────────────────

const STATUS_ICONS = {
  info:    { name: 'info',         color: '#06b6d4' },
  warning: { name: 'warning',      color: '#f59e0b' },
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

function ToastItem({ id, variant, title, message, dismissible, action, position, onClose }) {
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const duration = readingDuration(title, message)

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

  const Icon = ICONS[variant]

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
            <Icon />
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
        <button
          type="button"
          className={styles.close}
          onClick={dismiss}
          aria-label="Dismiss notification"
        >
          <Icon name="close" size={16} />
        </button>
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

  const toast = useCallback(({ variant = 'info', title, message, dismissible = false, action }) => {
    const id = nextId.current++
    setToasts(prev => [...prev, { id, variant, title, message, dismissible, action }])
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
