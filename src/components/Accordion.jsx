import { useState, useCallback, useRef, useId } from 'react'
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
  const idPrefix = useId()
  const headerRefs = useRef([])

  function focusHeader(idx) {
    const el = headerRefs.current[idx]
    if (el) el.focus()
  }

  function onHeaderKeyDown(e, idx) {
    const last = items.length - 1
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusHeader(idx === last ? 0 : idx + 1); break
      case 'ArrowUp': e.preventDefault(); focusHeader(idx === 0 ? last : idx - 1); break
      case 'Home': e.preventDefault(); focusHeader(0); break
      case 'End': e.preventDefault(); focusHeader(last); break
      default:
    }
  }

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
      {items.map((item, idx) => {
        const isOpen = currentOpen.includes(item.id)
        const panelId = `${idPrefix}-panel-${idx}`
        const headerId = `${idPrefix}-header-${idx}`
        return (
          <div key={item.id} className={styles.item}>
            <button
              ref={el => headerRefs.current[idx] = el}
              id={headerId}
              type="button"
              className={[styles.header, styles[size], isOpen ? styles.headerOpen : ''].filter(Boolean).join(' ')}
              onClick={() => toggle(item.id)}
              onKeyDown={e => onHeaderKeyDown(e, idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
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
              id={panelId}
              role="region"
              aria-labelledby={headerId}
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
