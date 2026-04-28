import { useId } from 'react'
import styles from './Checkbox.module.css'
import { Icon } from './Icon'

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IndeterminateIcon() {
  return (
    <svg width="10" height="2" viewBox="0 0 10 2" fill="none" aria-hidden="true">
      <path d="M0 1h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Checkbox (single item) ─────────────────── */
export function Checkbox({
  label,
  helperText,
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  error = false,
  name,
  value,
}) {
  const id = useId()
  const helperId = useId()
  const isChecked = indeterminate ? false : checked

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
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
          className={styles.input}
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
        />
        <span
          className={[
            styles.box,
            checked || indeterminate ? styles.boxChecked : '',
            error && !checked && !indeterminate ? styles.boxError : '',
            disabled ? styles.boxDisabled : '',
            disabled && (checked || indeterminate) ? styles.boxDisabledChecked : '',
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          {indeterminate
            ? <IndeterminateIcon />
            : checked
              ? <CheckIcon />
              : null}
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

/* ── CheckboxGroup ──────────────────────────── */
export function CheckboxGroup({
  label,
  options = [],
  value = [],
  onChange,
  disabled = false,
  error,
  direction = 'vertical',
}) {
  function toggle(optValue) {
    if (value.includes(optValue)) {
      onChange?.(value.filter(v => v !== optValue))
    } else {
      onChange?.([...value, optValue])
    }
  }

  return (
    <fieldset className={styles.fieldset}>
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={[styles.group, styles[direction]].join(' ')}>
        {options.map(opt => (
          <Checkbox
            key={opt.value}
            value={opt.value}
            label={opt.label}
            helperText={opt.helperText}
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            disabled={disabled || opt.disabled}
            error={!!error}
          />
        ))}
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
    </fieldset>
  )
}
