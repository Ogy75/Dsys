import { useState, useCallback } from 'react'
import { Icon } from './Icon'
import styles from './Accordion.module.css'

export function Accordion({
  items = [],
  size = 'lg',
  chevronPosition = 'right',
  defaultValue,
  value,
  onChange,
  allowMultiple = true,
  showToggleAll = false,
}) {
  const computedDefault = defaultValue ?? items.filter(i => i.defaultOpen).map(i => i.id)
  const [openIds, setOpenIds] = useState(computedDefault)

  const controlled = value !== undefined
  const currentOpen = controlled ? value : openIds

  const toggle = useCallback((id) => {
    const next = currentOpen.includes(id)
      ? currentOpen.filter(x => x !== id)
      : allowMultiple
        ? [...currentOpen, id]
        : [id]
    if (!controlled) setOpenIds(next)
    onChange?.(next)
  }, [currentOpen, allowMultiple, controlled, onChange])

  const selectableItems = items.filter(i => !i.type)

  const expandAll = () => {
    const all = selectableItems.map(i => i.id)
    if (!controlled) setOpenIds(all)
    onChange?.(all)
  }

  const collapseAll = () => {
    if (!controlled) setOpenIds([])
    onChange?.([])
  }

  return (
    <div className={styles.accordion}>
      {showToggleAll && (
        <div className={styles.toggleAll}>
          <button type="button" className={styles.toggleBtn} onClick={expandAll}>Expand all</button>
          <button type="button" className={styles.toggleBtn} onClick={collapseAll}>Collapse all</button>
        </div>
      )}
      {items.map((item) => {
        const isOpen = currentOpen.includes(item.id)
        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              className={[styles.header, styles[size], isOpen ? styles.headerOpen : ''].filter(Boolean).join(' ')}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              {chevronPosition === 'left' && (
                <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
                  <Icon name="keyboard_arrow_down" size={25} />
                </span>
              )}
              <span className={styles.title}>{item.title}</span>
              {chevronPosition === 'right' && (
                <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
                  <Icon name="keyboard_arrow_down" size={25} />
                </span>
              )}
            </button>
            <div
              className={[styles.body, isOpen ? styles.bodyOpen : ''].filter(Boolean).join(' ')}
              aria-hidden={!isOpen}
            >
              <div className={styles.bodyInner}>
                <div className={styles.bodyContent}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
