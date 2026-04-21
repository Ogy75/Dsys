import { useId } from 'react'
import styles from './Textarea.module.css'

export function Textarea({
  fieldLabel,
  label,
  hideLabel = false,
  required = false,
  placeholder,
  error,
  disabled = false,
  resize = 'none',
  rows = 6,
  value,
  onChange,
  onKeyDown,
  autoFocus,
  inputRef,
}) {
  const id = useId()
  const labelText = fieldLabel ?? label ?? 'Label'
  const showRequired = required && !disabled

  const textareaClass = [
    styles.textarea,
    styles[`resize${resize.charAt(0).toUpperCase() + resize.slice(1)}`],
    error ? styles.textareaError : '',
    disabled ? styles.textareaDisabled : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.field}>
      {!hideLabel && (
        <div className={styles.labelRow}>
          <label
            htmlFor={id}
            className={[styles.inputLabel, disabled ? styles.inputLabelDisabled : ''].filter(Boolean).join(' ')}
          >
            {labelText}
          </label>
          {showRequired && <span className={styles.required} aria-hidden="true">*</span>}
        </div>
      )}
      <div className={styles.controlStack}>
        <div className={styles.textareaWrapper}>
          <textarea
            id={id}
            ref={inputRef}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={textareaClass}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            aria-label={hideLabel ? labelText : undefined}
            aria-invalid={!!error}
            aria-required={required}
          />
        </div>
        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
    </div>
  )
}
