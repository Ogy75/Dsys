import { useEffect, useState, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

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
  'aria-label': ariaLabel,
}) {
  // mounted: keeps DOM alive during close transition
  // visible: drives the CSS transition classes
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const panelRef = useRef(null)
  const previouslyFocused = useRef(null)
  const hintId = useId()

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

  // Close on Escape + focus trap
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') { onClose?.(); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus management: capture previous focus on open, restore on close
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement
      requestAnimationFrame(() => {
        const el = panelRef.current
        if (!el) return
        const focusable = el.querySelector(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        ;(focusable ?? el).focus?.()
      })
    } else if (previouslyFocused.current?.isConnected && typeof previouslyFocused.current.focus === 'function') {
      previouslyFocused.current.focus()
      previouslyFocused.current = null
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <div
      className={[styles.backdrop, visible ? styles.backdropVisible : '', align === 'top' ? styles.backdropTop : ''].filter(Boolean).join(' ')}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={[styles.panel, styles[size], visible ? styles.panelVisible : '', stretch ? styles.panelStretch : ''].filter(Boolean).join(' ')}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-label={!title ? (ariaLabel || 'Dialog') : undefined}
        aria-describedby={hintId}
        tabIndex={-1}
      >
        <span id={hintId} className={styles.srOnly}>Press Escape to close.</span>
        <div className={showClose ? styles.header : styles.headerNoClose}>
          {showClose && (
            <div className={styles.closeRow}>
              <IconButton
                variant="ghost"
                size="sm"
                icon={<Icon name="close" size={20} />}
                onClick={onClose}
                aria-label="Close modal"
              />
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
