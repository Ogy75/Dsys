import React from 'react'
import styles from './List.module.css'
import { IconButton } from './IconButton'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

const leadingIconSize = { sm: 20, md: 24, lg: 32 }
const leadingAvatarSize = { sm: 'sm', md: 'md', lg: 'lg' }

export function List({
  items = [],
  size = 'md',
  divider = false,
  className,
  children,
}) {
  return (
    <ul
      className={[
        styles.list,
        divider ? styles.withDivider : '',
        className,
      ].filter(Boolean).join(' ')}
      role="list"
    >
      {children
        ? React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, { size: child.props.size ?? size })
              : child
          )
        : items.map((item, i) => (
            <ListItem key={item.id ?? i} size={size} {...item} />
          ))
      }
    </ul>
  )
}

export function ListItem({
  label,
  description,
  leading,
  trailing,
  controls,
  actions,
  onClick,
  selected = false,
  disabled = false,
  size = 'md',
}) {
  const hasActions = actions && actions.length > 0

  const resolvedLeading = React.isValidElement(leading)
    ? leading.type === Icon
      ? React.cloneElement(leading, { size: leadingIconSize[size] })
      : leading.type === Avatar
        ? React.cloneElement(leading, { size: leadingAvatarSize[size] })
        : leading
    : leading

  function handleKeyDown(e) {
    if (!onClick || disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <li
      className={[
        styles.item,
        styles[size],
        selected ? styles.selected : '',
        disabled ? styles.disabled : '',
        onClick ? styles.interactive : '',
      ].filter(Boolean).join(' ')}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={onClick ? !!selected : undefined}
    >
      <div className={styles.inner}>
        {resolvedLeading && (
          <span className={styles.leading} aria-hidden="true">
            {resolvedLeading}
          </span>
        )}

        <span className={styles.content}>
          <span className={styles.label}>{label}</span>
          {description && (
            <span className={styles.description}>{description}</span>
          )}
        </span>

        {trailing && (
          <span className={styles.trailing}>{trailing}</span>
        )}

        {hasActions && (
          <span
            className={styles.actions}
            onClick={e => e.stopPropagation()}
          >
            {actions.slice(0, 3).map((action, i) => (
              <IconButton
                key={i}
                variant="ghost"
                size="sm"
                icon={action.icon}
                aria-label={action.label}
                onClick={!disabled ? action.onClick : undefined}
                disabled={disabled}
              />
            ))}
          </span>
        )}

        {controls && (
          <span
            className={styles.controls}
            onClick={e => e.stopPropagation()}
          >
            {controls}
          </span>
        )}
      </div>
    </li>
  )
}
