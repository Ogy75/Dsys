import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Drawer.module.css'

const TRANSITION_MS = 100

export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  children,
  footer,
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setShowBackdrop(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setShowBackdrop(false)       // backdrop gone instantly
      setVisible(false)            // drawer slides out (100ms)
      const t = setTimeout(() => setMounted(false), TRANSITION_MS)
      return () => clearTimeout(t)
    }
  }, [open])

  // Lock background scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className={styles.root}
      onClick={onClose}
      aria-modal="true"
      role="presentation"
    >
      {showBackdrop && <div className={styles.backdrop} aria-hidden="true" />}
      <div
        className={[
          styles.drawer,
          styles[side],
          visible ? styles.drawerVisible : '',
        ].join(' ')}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {title && (
          <div className={styles.titleRow}>
            <h2 className={styles.title} id="drawer-title">{title}</h2>
          </div>
        )}

        <div className={styles.body}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
