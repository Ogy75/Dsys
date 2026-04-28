import styles from './Kbd.module.css'

export function Kbd({ children, inverse = false, className }) {
  return (
    <kbd className={[styles.kbd, inverse ? styles.inverse : '', className].filter(Boolean).join(' ')}>
      {children}
    </kbd>
  )
}
