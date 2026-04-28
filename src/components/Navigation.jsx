import { useState, useRef, useEffect, forwardRef } from 'react'
import { Icon } from './Icon'
import styles from './Navigation.module.css'

const SubMenu = forwardRef(function SubMenu(
  { children, value, onSelect, onL2Click, size = 'lg', onClose, focusFirstSignal },
  panelRef
) {
  const sizeItemCls = size === 'md' ? styles.subItemMd : size === 'sm' ? styles.subItemSm : ''
  const sizePanelCls = size === 'md' ? styles.submenuMd : size === 'sm' ? styles.submenuSm : ''
  const subItemCls = [styles.subItem, sizeItemCls].filter(Boolean).join(' ')
  const panelCls = [styles.submenu, sizePanelCls].filter(Boolean).join(' ')
  const hasL3 = children.some(c => c.children?.length > 0)

  const defaultL2 = children.find(c => c.id === value || c.children?.some(l3 => l3.id === value)) ?? children[0]
  const [selectedL2, setSelectedL2] = useState(defaultL2?.id ?? null)
  const internalPanelRef = useRef(null)
  const setPanelRef = (el) => {
    internalPanelRef.current = el
    if (typeof panelRef === 'function') panelRef(el)
    else if (panelRef) panelRef.current = el
  }

  const l2Refs = useRef({})
  const l3Refs = useRef({})

  useEffect(() => {
    if (!internalPanelRef.current) return
    const rect = internalPanelRef.current.getBoundingClientRect()
    if (rect.right > window.innerWidth - 8) {
      internalPanelRef.current.style.left = 'auto'
      internalPanelRef.current.style.right = '0'
    }
  }, [])

  // Move focus to first L2 when the panel opens
  useEffect(() => {
    if (focusFirstSignal == null) return
    const firstId = children[0]?.id
    if (firstId) l2Refs.current[firstId]?.focus()
  }, [focusFirstSignal, children])

  function focusL2By(offset) {
    const ids = children.map(c => c.id)
    const cur = ids.indexOf(document.activeElement?.dataset?.navId)
    const next = cur === -1 ? 0 : (cur + offset + ids.length) % ids.length
    l2Refs.current[ids[next]]?.focus()
  }

  function focusL3By(l2Id, offset) {
    const list = (children.find(c => c.id === l2Id)?.children ?? [])
    if (list.length === 0) return
    const ids = list.map(c => c.id)
    const cur = ids.indexOf(document.activeElement?.dataset?.navId)
    const next = cur === -1 ? 0 : (cur + offset + ids.length) % ids.length
    l3Refs.current[ids[next]]?.focus()
  }

  function onL2KeyDown(e, l2) {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusL2By(1); break
      case 'ArrowUp':   e.preventDefault(); focusL2By(-1); break
      case 'Home':      e.preventDefault(); l2Refs.current[children[0]?.id]?.focus(); break
      case 'End':       e.preventDefault(); l2Refs.current[children[children.length - 1]?.id]?.focus(); break
      case 'ArrowRight':
        if (l2.children?.length) {
          e.preventDefault()
          setSelectedL2(l2.id)
          requestAnimationFrame(() => l3Refs.current[l2.children[0].id]?.focus())
        }
        break
      case 'Escape': e.preventDefault(); onClose?.(); break
      default:
    }
  }

  function onL3KeyDown(e, l2Id) {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusL3By(l2Id, 1); break
      case 'ArrowUp':   e.preventDefault(); focusL3By(l2Id, -1); break
      case 'ArrowLeft': e.preventDefault(); l2Refs.current[l2Id]?.focus(); break
      case 'Home': {
        e.preventDefault()
        const list = children.find(c => c.id === l2Id)?.children ?? []
        l3Refs.current[list[0]?.id]?.focus()
        break
      }
      case 'End': {
        e.preventDefault()
        const list = children.find(c => c.id === l2Id)?.children ?? []
        l3Refs.current[list[list.length - 1]?.id]?.focus()
        break
      }
      case 'Escape': e.preventDefault(); onClose?.(); break
      default:
    }
  }

  if (!hasL3) {
    return (
      <div ref={setPanelRef} className={panelCls}>
        <ul className={styles.submenuList}>
          {children.map(child => (
            <li key={child.id}>
              <button
                ref={el => { l2Refs.current[child.id] = el }}
                data-nav-id={child.id}
                type="button"
                className={[subItemCls, value === child.id ? styles.subItemActive : ''].filter(Boolean).join(' ')}
                onClick={() => onSelect(child.id)}
                onKeyDown={e => onL2KeyDown(e, child)}
              >
                {child.icon != null && (
                  <span className={[styles.itemIcon, value === child.id ? styles.itemIconActive : ''].filter(Boolean).join(' ')}>
                    {child.icon}
                  </span>
                )}
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div ref={setPanelRef} className={panelCls}>
      {/* L2 column */}
      <ul className={styles.submenuList}>
        {children.map(l2 => (
          <li key={l2.id}>
            <button
              ref={el => { l2Refs.current[l2.id] = el }}
              data-nav-id={l2.id}
              type="button"
              className={[
                subItemCls,
                selectedL2 === l2.id ? styles.subItemHover : '',
                value === l2.id ? styles.subItemActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => {
                if (l2.children?.length) {
                  setSelectedL2(l2.id)
                  onL2Click(l2.id)
                } else {
                  onSelect(l2.id)
                }
              }}
              onKeyDown={e => onL2KeyDown(e, l2)}
              onFocus={() => { if (l2.children?.length) setSelectedL2(l2.id) }}
              aria-haspopup={l2.children?.length ? 'true' : undefined}
              aria-expanded={l2.children?.length ? selectedL2 === l2.id : undefined}
            >
              {l2.icon != null && (
                <span className={[styles.itemIcon, value === l2.id ? styles.itemIconActive : ''].filter(Boolean).join(' ')}>
                  {l2.icon}
                </span>
              )}
              {l2.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <span className={styles.divider} aria-hidden="true" />

      {/* L3 column */}
      <div className={styles.l3Stack}>
        {children.map(l2 =>
          l2.children?.length > 0 ? (
            <ul
              key={l2.id}
              className={[
                styles.submenuList,
                styles.l3List,
                selectedL2 === l2.id ? styles.l3ListVisible : '',
              ].filter(Boolean).join(' ')}
              aria-hidden={selectedL2 !== l2.id}
            >
              {l2.children.map(l3 => (
                <li key={l3.id}>
                  <button
                    ref={el => { l3Refs.current[l3.id] = el }}
                    data-nav-id={l3.id}
                    type="button"
                    className={[subItemCls, value === l3.id ? styles.subItemActive : ''].filter(Boolean).join(' ')}
                    onClick={() => onSelect(l3.id)}
                    onKeyDown={e => onL3KeyDown(e, l2.id)}
                  >
                    {l3.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null
        )}
      </div>
    </div>
  )
})

export function Navigation({ items = [], value, onChange, size = 'lg' }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [focusSignal, setFocusSignal] = useState(0)
  const navRef = useRef(null)
  const triggerRefs = useRef({})

  useEffect(() => {
    function onMouseDown(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleItemClick(item) {
    if (item.children?.length) {
      setOpenMenu(openMenu === item.id ? null : item.id)
    } else {
      onChange?.(item.id)
      setOpenMenu(null)
    }
  }

  function handleSubSelect(id) {
    onChange?.(id)
    closeMenu()
  }

  function handleL2Click(_id) {}

  function closeMenu() {
    const id = openMenu
    setOpenMenu(null)
    if (id) requestAnimationFrame(() => triggerRefs.current[id]?.focus())
  }

  function focusTriggerBy(offset) {
    const ids = items.map(i => i.id)
    const cur = ids.indexOf(document.activeElement?.dataset?.navId)
    const next = cur === -1 ? 0 : (cur + offset + ids.length) % ids.length
    triggerRefs.current[ids[next]]?.focus()
  }

  function onTriggerKeyDown(e, item) {
    const hasMenu = item.children?.length > 0
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); focusTriggerBy(1); break
      case 'ArrowLeft':  e.preventDefault(); focusTriggerBy(-1); break
      case 'Home':       e.preventDefault(); triggerRefs.current[items[0]?.id]?.focus(); break
      case 'End':        e.preventDefault(); triggerRefs.current[items[items.length - 1]?.id]?.focus(); break
      case 'ArrowDown':
        if (hasMenu) {
          e.preventDefault()
          setOpenMenu(item.id)
          setFocusSignal(s => s + 1)
        }
        break
      case 'Enter':
      case ' ':
        if (hasMenu) {
          e.preventDefault()
          setOpenMenu(openMenu === item.id ? null : item.id)
          if (openMenu !== item.id) setFocusSignal(s => s + 1)
        }
        break
      case 'Escape':
        if (openMenu) { e.preventDefault(); closeMenu() }
        break
      default:
    }
  }

  return (
    <nav ref={navRef} className={styles.nav}>
      <ul className={styles.list}>
        {items.map(item => {
          const hasMenu = item.children?.length > 0
          const isOpen = openMenu === item.id
          const allDescendants = hasMenu
            ? item.children.flatMap(c => [c, ...(c.children ?? [])])
            : []
          const hasGrandchildren = hasMenu && item.children.some(c => c.children?.length > 0)
          const isActive = hasGrandchildren
            ? item.children.flatMap(c => c.children ?? []).some(l3 => l3.id === value)
            : value === item.id || allDescendants.some(c => c.id === value)

          return (
            <li key={item.id} className={styles.item}>
              <button
                ref={el => { triggerRefs.current[item.id] = el }}
                data-nav-id={item.id}
                type="button"
                className={[
                  styles.trigger,
                  size === 'md' ? styles.md : size === 'sm' ? styles.sm : styles.lg,
                  isActive ? styles.active : '',
                  isOpen ? styles.triggerOpen : '',
                  hasMenu ? styles.hasMenu : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleItemClick(item)}
                onKeyDown={e => onTriggerKeyDown(e, item)}
                aria-expanded={hasMenu ? isOpen : undefined}
                aria-haspopup={hasMenu ? 'true' : undefined}
              >
                <span className={styles.label}>{item.label}</span>
                {hasMenu && (
                  <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
                    <Icon name="keyboard_arrow_down" size={20} />
                  </span>
                )}
              </button>

              {hasMenu && isOpen && (
                <SubMenu
                  children={item.children}
                  value={value}
                  onSelect={handleSubSelect}
                  onL2Click={handleL2Click}
                  onClose={closeMenu}
                  focusFirstSignal={focusSignal}
                  size={size}
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
