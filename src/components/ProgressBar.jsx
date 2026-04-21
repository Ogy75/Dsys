import styles from './ProgressBar.module.css'

export function ProgressBar({
  variant = 'determined',
  value = 0,
  showLabel = true,
  labelPosition = 'right',
  labelAlign = 'center',
  inverted = false,
  status = 'default',
  errorMessage,
  segments = [],
}) {
  const clamped = Math.min(100, Math.max(0, value))
  const isDetermined = variant === 'determined'
  const isSegmented = variant === 'segmented'
  const isError = status === 'error'
  const below = isDetermined && showLabel && labelPosition === 'below'

  const alignClass = below ? styles[`labelAlign${labelAlign.charAt(0).toUpperCase() + labelAlign.slice(1)}`] : ''

  const label = isDetermined && showLabel ? (
    <span className={[
      styles.label,
      below ? styles.labelBelow : '',
      alignClass,
      inverted ? styles.labelInverted : '',
    ].filter(Boolean).join(' ')}>
      {Math.round(clamped)}%
    </span>
  ) : null

  let trackContent
  if (isSegmented) {
    let offset = 0
    trackContent = segments.map((seg, i) => {
      const left = offset
      offset += seg.value
      return (
        <div
          key={i}
          className={styles.segment}
          style={{ left: `${left}%`, width: `${seg.value}%`, backgroundColor: seg.color }}
        />
      )
    })
  } else if (isDetermined) {
    trackContent = (
      <div
        className={[
          styles.fill,
          isError ? styles.fillError : '',
          inverted ? styles.fillInverted : '',
        ].filter(Boolean).join(' ')}
        style={{ width: `${clamped}%` }}
      />
    )
  } else {
    const bar1Class = inverted ? styles.bar1Inverted : isError ? styles.bar1Error : styles.bar1
    const bar2Class = inverted ? styles.bar2Inverted : isError ? styles.bar2Error : styles.bar2
    trackContent = (
      <>
        <div className={[styles.bar, bar1Class].join(' ')} />
        <div className={[styles.bar, bar2Class].join(' ')} />
      </>
    )
  }

  const track = (
    <div className={[
      styles.track,
      below ? styles.trackBelow : '',
      inverted ? styles.trackInverted : '',
      isError ? styles.trackError : '',
    ].filter(Boolean).join(' ')}>
      {trackContent}
    </div>
  )

  const progressBar = (
    <div
      className={[styles.wrapper, below ? styles.wrapperBelow : ''].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={isDetermined ? clamped : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {labelPosition === 'left' && label}
      {track}
      {(labelPosition === 'right' || labelPosition === 'below') && label}
    </div>
  )

  if (isError && errorMessage) {
    return (
      <div className={styles.root}>
        {progressBar}
        <span className={styles.errorMessage}>{errorMessage}</span>
      </div>
    )
  }

  return progressBar
}
