import styles from './Spinner.module.css'

const SIZES = {
  sm: { s: 16, r: 5.5,  sw: 1.5 },
  md: { s: 24, r: 9,    sw: 2   },
  lg: { s: 32, r: 12.5, sw: 2.5 },
  xl: { s: 48, r: 19,   sw: 3   },
}

export function Spinner({ size = 'md', color = 'dark', backdrop, text, label = 'Loading…' }) {
  const { s, r, sw } = SIZES[size]
  const c = s / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75

  const svg = (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={[styles.spinner, styles[color]].join(' ')}
      aria-label={label}
      role="status"
      fill="none"
    >
      <circle cx={c} cy={c} r={r} strokeWidth={sw} className={styles.track} />
      <circle
        cx={c}
        cy={c}
        r={r}
        strokeWidth={sw}
        strokeLinecap="round"
        className={styles.arc}
        style={{
          '--dash-min':    circ * 0.01,
          '--dash-max':    circ * 0.75,
          '--offset-mid':  -(circ * 0.28),
          '--offset-end':  -(circ * 0.98),
          '--gap':         circ * 2,
        }}
      />
    </svg>
  )

  const textColor = backdrop === 'black' ? '#ffffff' : '#1a1a1a'

  const inner = text ? (
    <div className={styles.group}>
      {svg}
      <span className={styles.text} style={{ color: textColor }}>{text}</span>
    </div>
  ) : svg

  if (!backdrop) return inner

  return (
    <div className={[styles.backdrop, styles[`backdrop-${backdrop}`]].join(' ')}>
      {inner}
    </div>
  )
}
