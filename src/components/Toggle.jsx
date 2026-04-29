import styles from './Toggle.module.css'

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
  variant = 'rounded',
  'aria-label': ariaLabel,
}) {
  const trackClass = [
    styles.track,
    styles[variant],
    checked ? styles.trackOn : styles.trackOff,
    disabled ? styles.trackDisabled : '',
  ].filter(Boolean).join(' ')

  const thumbClass = [
    styles.thumb,
    styles[variant + 'Thumb'],
    checked ? styles.thumbOn : '',
    disabled ? styles.thumbDisabled : '',
  ].filter(Boolean).join(' ')

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={!label ? (ariaLabel || 'Toggle') : undefined}
      disabled={disabled}
      className={trackClass}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      <span className={thumbClass} />
    </button>
  )

  if (!label) return toggle

  return (
    <label className={[styles.wrapper, disabled ? styles.wrapperDisabled : ''].filter(Boolean).join(' ')}>
      {labelPosition === 'left' && <span className={styles.label}>{label}</span>}
      {toggle}
      {labelPosition === 'right' && <span className={styles.label}>{label}</span>}
    </label>
  )
}
