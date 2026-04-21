import { useId, useState } from 'react'
import styles from './Input.module.css'
import { Tooltip } from './Tooltip'
import { Icon } from './Icon'

function ErrorIcon({ size = 24 }) {
  return <Icon name="error" size={size} style={{ color: '#DC2626' }} />
}

function EyeIcon() {
  return <Icon name="visibility" size={20} />
}

function EyeOffIcon() {
  return <Icon name="visibility_off" size={20} />
}

/**
 * Visible label: Figma default text is "Label" + optional * (required).
 * Pass `fieldLabel` / `label` to override. Use `hideLabel` to omit the label row (e.g. search).
 * If only `ariaLabel` is set (no fieldLabel/label), no visible label (accessible name on input).
 */
export function Input({
  fieldLabel,
  label,
  hideLabel = false,
  required = false,
  ariaLabel,
  placeholder,
  helperText,
  error,
  disabled = false,
  type = 'text',
  size = 'lg',
  value,
  onChange,
  autoComplete = 'off',
  passwordToggle = true,
}) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const effectiveType = isPassword && showPassword ? 'text' : type
  const showToggle = isPassword && passwordToggle && !error

  let labelText = null
  if (!hideLabel) {
    const explicit = fieldLabel ?? label
    if (explicit !== undefined && explicit !== null) {
      labelText = explicit === '' ? null : explicit
    } else if (ariaLabel) {
      labelText = null
    } else {
      labelText = 'Label'
    }
  }

  const inputClass = [
    styles.input,
    styles[size],
    error ? styles.inputError : '',
    showToggle ? styles.inputPassword : '',
    disabled ? styles.inputDisabled : '',
  ].filter(Boolean).join(' ')

  const showRequired = required && !disabled

  return (
    <div className={styles.field}>
      {labelText != null && labelText !== '' ? (
        <div className={styles.labelRow}>
          <label
            htmlFor={id}
            className={[styles.inputLabel, disabled ? styles.inputLabelDisabled : ''].filter(Boolean).join(' ')}
          >
            {labelText}
          </label>
          {showRequired && <span className={styles.required} aria-hidden="true">*</span>}
        </div>
      ) : null}
      <div className={styles.controlStack}>
        <div className={styles.inputWrapper}>
          <input
            id={id}
            type={effectiveType}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClass}
            value={value}
            onChange={onChange}
            aria-invalid={!!error}
            aria-required={required}
            aria-label={!labelText ? ariaLabel : undefined}
            autoComplete={autoComplete}
          />
          {error && (
            <span className={styles.iconRight}>
              <Tooltip content={error} side="top" variant="dark">
                <ErrorIcon size={size === 'lg' ? 24 : 20} />
              </Tooltip>
            </span>
          )}
          {showToggle && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
        {error && <p className={styles.errorMsg}>{error}</p>}
        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    </div>
  )
}
