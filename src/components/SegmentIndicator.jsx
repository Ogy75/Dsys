import styles from './SegmentIndicator.module.css'

const COLOR_MAP = [
  null,
  styles.colorRed,
  styles.colorRed,
  styles.colorAmber,
  styles.colorGreen,
  styles.colorGreen,
]

export function SegmentIndicator({ value = 0, total = 5 }) {
  const clamped = Math.max(0, Math.min(total, value))
  const colorClass = COLOR_MAP[clamped] ?? styles.colorGreen

  return (
    <span className={styles.root} aria-label={`${clamped} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={[styles.segment, i < clamped ? colorClass : styles.inactive].join(' ')}
        />
      ))}
    </span>
  )
}
