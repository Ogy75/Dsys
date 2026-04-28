import { useId } from 'react'
import styles from './Radio.module.css'

/* ── Radio (single item) ────────────────────── */
export function Radio({
  label,
  helperText,
  checked = false,
  onChange,
  disabled = false,
  error = false,
  name,
  value,
}) {
  const id = useId()
  const helperId = useId()

  return (
    <label
      className={[
        styles.wrapper,
        disabled ? styles.wrapperDisabled : '',
      ].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <span className={styles.controlWrap}>
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          className={styles.input}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
        />
        <span
          className={[
            styles.circle,
            checked ? styles.circleChecked : '',
            error && !checked ? styles.circleError : '',
            disabled ? styles.circleDisabled : '',
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          {checked && <span className={styles.dot} />}
        </span>
      </span>

      {label && (
        <span className={styles.labelWrap}>
          <span
            className={[
              styles.label,
              disabled ? styles.labelDisabled : '',
            ].filter(Boolean).join(' ')}
          >
            {label}
          </span>
          {helperText && (
            <span
              id={helperId}
              className={[
                styles.helperText,
                disabled ? styles.helperTextDisabled : '',
                error ? styles.helperTextError : '',
              ].filter(Boolean).join(' ')}
            >
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  )
}

/* ── RadioGroup ─────────────────────────────── */
export function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  direction = 'vertical',
  name,
}) {
  const groupName = useId()
  const resolvedName = name ?? groupName

  return (
    <fieldset className={styles.fieldset}>
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={[styles.group, styles[direction]].join(' ')}>
        {options.map(opt => (
          <Radio
            key={opt.value}
            name={resolvedName}
            value={opt.value}
            label={opt.label}
            helperText={opt.helperText}
            checked={value === opt.value}
            onChange={onChange}
            disabled={disabled || opt.disabled}
            error={!!error}
          />
        ))}
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
    </fieldset>
  )
}
