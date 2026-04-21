import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import styles from './SplitButton.module.css'
import btnStyles from '../pages/Button.module.css'
import { Icon } from './Icon'

/* ── Chevron icon ───────────────────────────────── */
function ChevronDown({ size }) {
  return <Icon name="keyboard_arrow_down" size={size} />
}

/* ── Placement hook — detects vertical + horizontal viewport edges ── */
function usePanelPlacement(open, rootRef) {
  const [above, setAbove] = useState(false)
  const [alignLeft, setAlignLeft] = useState(false)

  const update = useCallback(() => {
    if (!open || !rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    // Vertical
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const spaceAbove = rect.top - 8
    setAbove(spaceBelow < 180 && spaceAbove > spaceBelow)
    // Horizontal: panel is right-aligned by default (right: 0).
    // Switch to left-aligned when the panel would overflow the left edge.
    setAlignLeft(rect.right - 180 < 8)
  }, [open, rootRef])

  useLayoutEffect(() => {
    if (!open) { setAbove(false); setAlignLeft(false); return }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, update])

  return { above, alignLeft }
}

/* ── Ripple helper ──────────────────────────────── */
function useRipple() {
  const [ripples, setRipples] = useState([])
  const nextId = useRef(0)

  function addRipple(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextId.current++
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)
  }

  return { ripples, addRipple }
}

/* ── SplitButton ────────────────────────────────── */
export function SplitButton({
  variant = 'primary',
  size = 'md',
  label = 'Button',
  onClick,
  items = [],
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const { above, alignLeft } = usePanelPlacement(open, rootRef)
  const leftRipple = useRipple()
  const rightRipple = useRipple()

  const chevronSize = size === 'lg' ? 18 : 16
  const sepHeight = { lg: 26, md: 20, sm: 18 }[size] ?? 20

  useEffect(() => {
    function onDown(e) {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function handleItemClick(item) {
    if (item.disabled) return
    onChange?.(item.value)
    item.onClick?.()
    setOpen(false)
  }

  return (
    <div className={styles.root} ref={rootRef}>
      {/* Left — action side */}
      <button
        type="button"
        className={[btnStyles.btn, btnStyles[variant], btnStyles[size], styles.left].join(' ')}
        onClick={e => { leftRipple.addRipple(e); onClick?.(e) }}
      >
        {leftRipple.ripples.map(r => (
          <span key={r.id} className={btnStyles.ripple} style={{ left: r.x, top: r.y }} />
        ))}
        {label}
      </button>

      {/* Separator */}
      <span className={[styles.separatorWrap, styles[`sepWrap_${variant}`]].join(' ')} aria-hidden="true">
        <span className={[styles.separatorLine, styles[`sep_${variant}`]].join(' ')} style={{ height: sepHeight }} />
      </span>

      {/* Right — chevron / dropdown trigger */}
      <button
        type="button"
        className={[btnStyles.btn, btnStyles[variant], btnStyles[size], styles.right, open ? styles[`open_${variant}`] : ''].join(' ')}
        onClick={e => { rightRipple.addRipple(e); setOpen(o => !o) }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="More options"
      >
        {rightRipple.ripples.map(r => (
          <span key={r.id} className={btnStyles.ripple} style={{ left: r.x, top: r.y }} />
        ))}
        <span className={[styles.chevron, open ? styles.chevronOpen : ''].join(' ')}>
          <ChevronDown size={chevronSize} />
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className={[styles.panel, above ? styles.panelAbove : '', alignLeft ? styles.panelLeft : ''].filter(Boolean).join(' ')}
          role="listbox"
        >
          <ul className={styles.list}>
            {items.map((item, i) => (
              <li
                key={item.value ?? i}
                role="option"
                aria-selected={item.value === value}
                aria-disabled={item.disabled}
                className={[
                  styles.item,
                  item.value === value ? styles.itemActive : '',
                  item.disabled ? styles.itemDisabled : '',
                ].join(' ')}
                onClick={() => handleItemClick(item)}
              >
                {item.icon != null && (
                  <span className={[styles.itemIcon, item.value === value ? styles.itemIconActive : ''].filter(Boolean).join(' ')}>
                    {item.icon}
                  </span>
                )}
                <span className={[styles.itemLabel, item.value === value ? styles.itemLabelActive : ''].join(' ')}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
