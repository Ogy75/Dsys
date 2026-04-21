import styles from './Avatar.module.css'

const SIZES = ['xsm', 'sm', 'md', 'xl', 'xxl']

const BADGE_SIZE_CLASS = {
  xsm: styles.badgeXsm,
  sm:  styles.badgeSm,
  md:  styles.badgeMd,
  xl:  styles.badgeXl,
  xxl: styles.badgeXxl,
}

export function Avatar({
  size = 'md',
  src,
  alt = 'Avatar',
  initials = 'JD',
  icon,
  variant = 'default',
  status,
}) {
  const resolvedSize = SIZES.includes(size) ? size : 'md'
  const sizeClass = styles[resolvedSize]
  const showImage = Boolean(src)
  const showIcon = !showImage && Boolean(icon)
  const colorClass = showImage ? styles.photo : variant === 'inverse' ? styles.inverse : styles.default

  return (
    <div className={[styles.wrapper, sizeClass].join(' ')}>
      <div className={[styles.avatar, colorClass].join(' ')} aria-label={alt} role="img">
        {showImage ? (
          <img className={styles.image} src={src} alt={alt} />
        ) : showIcon ? (
          <span className={styles.iconWrapper}>{icon}</span>
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={[styles.badge, BADGE_SIZE_CLASS[resolvedSize], styles[status]].join(' ')}
          aria-label={status}
        />
      )}
    </div>
  )
}
