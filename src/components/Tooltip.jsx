import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Tooltip.module.css'

/* ── Constants ──────────────────────────────────── */
const ARROW_MAJOR = 12  // width along the tooltip edge
const ARROW_MINOR = 6   // how far it sticks out from the panel
const GAP = 4           // gap between trigger edge and arrow tip
const VM = 8            // minimum distance from viewport edge

/* ── Arrow SVG ──────────────────────────────────── */
function ArrowSVG({ direction, variant }) {
  const fill = variant === 'dark' ? 'var(--color-grey-800)' : 'var(--color-grey-50)'
  const horiz = direction === 'up' || direction === 'down'
  const w = horiz ? ARROW_MAJOR : ARROW_MINOR
  const h = horiz ? ARROW_MINOR : ARROW_MAJOR
  let path
  if (direction === 'up')    path = `M0,${h} L${w / 2},0 L${w},${h} Z`
  if (direction === 'down')  path = `M0,0 L${w / 2},${h} L${w},0 Z`
  if (direction === 'left')  path = `M${w},0 L0,${h / 2} L${w},${h} Z`
  if (direction === 'right') path = `M0,0 L${w},${h / 2} L0,${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: 'block' }}>
      <path d={path} fill={fill} />
    </svg>
  )
}

/* ── Position computation (pure) ────────────────── */
function computeCoords(tr, pr, vw, vh, side, align) {
  const pW = pr.width
  const pH = pr.height

  // Resolve side — flip if preferred side overflows viewport
  let s = side
  if (s === 'top'    && tr.top    - pH - ARROW_MINOR - GAP < VM  && tr.bottom + pH + ARROW_MINOR + GAP <= vh - VM) s = 'bottom'
  if (s === 'bottom' && tr.bottom + pH + ARROW_MINOR + GAP > vh - VM && tr.top - pH - ARROW_MINOR - GAP >= VM)    s = 'top'
  if (s === 'left'   && tr.left   - pW - ARROW_MINOR - GAP < VM  && tr.right  + pW + ARROW_MINOR + GAP <= vw - VM) s = 'right'
  if (s === 'right'  && tr.right  + pW + ARROW_MINOR + GAP > vw - VM && tr.left  - pW - ARROW_MINOR - GAP >= VM)  s = 'left'

  const isVert = s === 'top' || s === 'bottom'
  const arrowDir = { top: 'down', bottom: 'up', left: 'right', right: 'left' }[s]

  let panelTop, panelLeft, arrowLeft, arrowTop

  if (isVert) {
    const trCX = tr.left + tr.width / 2
    if (align === 'center')     panelLeft = trCX - pW / 2
    else if (align === 'start') panelLeft = tr.left
    else                        panelLeft = tr.right - pW
    panelLeft = Math.max(VM, Math.min(panelLeft, vw - pW - VM))
    arrowLeft = Math.max(panelLeft + 8, Math.min(trCX - ARROW_MAJOR / 2, panelLeft + pW - 8 - ARROW_MAJOR))
    if (s === 'top') {
      panelTop = tr.top - pH - ARROW_MINOR - GAP
      arrowTop  = tr.top - ARROW_MINOR - GAP
    } else {
      panelTop = tr.bottom + ARROW_MINOR + GAP
      arrowTop  = tr.bottom + GAP
    }
  } else {
    const trCY = tr.top + tr.height / 2
    if (align === 'center')     panelTop = trCY - pH / 2
    else if (align === 'start') panelTop = tr.top
    else                        panelTop = tr.bottom - pH
    panelTop = Math.max(VM, Math.min(panelTop, vh - pH - VM))
    arrowTop = Math.max(panelTop + 8, Math.min(trCY - ARROW_MAJOR / 2, panelTop + pH - 8 - ARROW_MAJOR))
    if (s === 'left') {
      panelLeft = tr.left - pW - ARROW_MINOR - GAP
      arrowLeft  = tr.left - ARROW_MINOR - GAP
    } else {
      panelLeft = tr.right + ARROW_MINOR + GAP
      arrowLeft  = tr.right + GAP
    }
  }

  return { panelTop, panelLeft, arrowTop, arrowLeft, arrowDir }
}

/* ── Tooltip (public) ───────────────────────────── */
export function Tooltip({
  children,
  content,
  title,
  badge,
  side = 'top',
  align = 'center',
  variant = 'dark',
  block = false,
}) {
  const [coords, setCoords] = useState(null)
  const [visible, setVisible] = useState(false)

  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const raf1 = useRef(null)
  const raf2 = useRef(null)
  const hideTimer = useRef(null)

  function handleMouseEnter() {
    clearTimeout(hideTimer.current)
    cancelAnimationFrame(raf1.current)
    cancelAnimationFrame(raf2.current)

    const tr = triggerRef.current?.getBoundingClientRect()
    const pr = panelRef.current?.getBoundingClientRect()
    if (!tr || !pr) return

    // Synchronously compute position — triggers a render with panel at correct coords (opacity 0)
    setCoords(computeCoords(tr, pr, window.innerWidth, window.innerHeight, side, align))

    // Double rAF: ensures the positioned-but-invisible frame is painted before fade-in starts
    raf1.current = requestAnimationFrame(() => {
      raf2.current = requestAnimationFrame(() => {
        setVisible(true)
      })
    })
  }

  function handleMouseLeave() {
    cancelAnimationFrame(raf1.current)
    cancelAnimationFrame(raf2.current)
    setVisible(false)
    // Keep panel at position during 50ms fade-out, then remove
    hideTimer.current = setTimeout(() => setCoords(null), 60)
  }

  const panelStyle = coords
    ? { top: coords.panelTop, left: coords.panelLeft }
    : { top: -9999, left: -9999 }

  const arrowStyle = coords
    ? { top: coords.arrowTop, left: coords.arrowLeft }
    : { top: -9999, left: -9999 }

  const tooltip = (
    <>
      <div
        ref={panelRef}
        style={panelStyle}
        className={[styles.panel, styles[variant], visible ? styles.panelVisible : ''].filter(Boolean).join(' ')}
        role="tooltip"
        aria-hidden={!visible}
      >
        {title && <p className={styles.title}>{title}</p>}
        {badge && <div className={styles.badgeRow}>{badge}</div>}
        {content && <p className={styles.body}>{content}</p>}
      </div>

      <div
        style={arrowStyle}
        aria-hidden="true"
        className={[styles.arrow, visible ? styles.arrowVisible : ''].filter(Boolean).join(' ')}
      >
        {coords && <ArrowSVG direction={coords.arrowDir} variant={variant} />}
      </div>
    </>
  )

  return (
    <>
      <span
        ref={triggerRef}
        className={[styles.triggerWrap, block ? styles.triggerBlock : ''].filter(Boolean).join(' ')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {createPortal(tooltip, document.body)}
    </>
  )
}
