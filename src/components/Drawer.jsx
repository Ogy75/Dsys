import { useEffect, useState, useRef, useId } from 'react'
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
  const drawerRef = useRef(null)
  const previouslyFocused = useRef(null)
  const hintId = useId()

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

  // Close on Escape + focus trap
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') { onClose?.(); return }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const focusables = drawerRef.current.querySelectorAll(
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

  // Focus management
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement
      requestAnimationFrame(() => {
        const el = drawerRef.current
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
      className={styles.root}
      onClick={onClose}
      role="presentation"
    >
      {showBackdrop && <div className={styles.backdrop} aria-hidden="true" />}
      <div
        ref={drawerRef}
        className={[
          styles.drawer,
          styles[side],
          visible ? styles.drawerVisible : '',
        ].join(' ')}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        aria-describedby={hintId}
        tabIndex={-1}
      >
        <span id={hintId} className={styles.srOnly}>Press Escape to close.</span>
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
