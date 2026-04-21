import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'
import { Icon } from './Icon'

const TRANSITION_MS = 300

export function Modal({
  open,
  onClose,
  size = 'md',
  align = 'center',
  title,
  children,
  footer,
  showClose = true,
  closeOnBackdrop = true,
  bodyStyle,
  stretch = false,
}) {
  // mounted: keeps DOM alive during close transition
  // visible: drives the CSS transition classes
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Double rAF ensures the initial hidden state is painted before transitioning in
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
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
      className={[styles.backdrop, visible ? styles.backdropVisible : '', align === 'top' ? styles.backdropTop : ''].filter(Boolean).join(' ')}
      onClick={closeOnBackdrop ? onClose : undefined}
      aria-modal="true"
      role="presentation"
    >
      <div
        className={[styles.panel, styles[size], visible ? styles.panelVisible : '', stretch ? styles.panelStretch : ''].filter(Boolean).join(' ')}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div className={showClose ? styles.header : styles.headerNoClose}>
          {showClose && (
            <div className={styles.closeRow}>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                <Icon name="close" size={20} />
              </button>
            </div>
          )}
          {title && (
            <div className={styles.titleRow}>
              <h2 className={styles.title} id="modal-title">{title}</h2>
            </div>
          )}
        </div>

        <div className={styles.body} style={bodyStyle}>
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
