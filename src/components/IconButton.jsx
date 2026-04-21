import { useState, useRef } from 'react'
import styles from './IconButton.module.css'
import btnStyles from '../pages/Button.module.css'

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

export function IconButton({
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}) {
  const { ripples, addRipple } = useRipple()

  return (
    <button
      type="button"
      className={[btnStyles.btn, btnStyles[variant], btnStyles[size], styles.iconBtn, styles[size]].join(' ')}
      onClick={e => { addRipple(e); onClick?.(e) }}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {ripples.map(r => (
        <span key={r.id} className={btnStyles.ripple} style={{ left: r.x, top: r.y }} />
      ))}
      <span className={styles.iconWrap} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
