import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icon'
import styles from './Navigation.module.css'

function SubMenu({ children, value, onSelect, onL2Click }) {
  const hasL3 = children.some(c => c.children?.length > 0)

  const defaultL2 = children.find(c => c.id === value || c.children?.some(l3 => l3.id === value)) ?? children[0]
  const [selectedL2, setSelectedL2] = useState(defaultL2?.id ?? null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    if (rect.right > window.innerWidth - 8) {
      panelRef.current.style.left = 'auto'
      panelRef.current.style.right = '0'
    }
  }, [])

  if (!hasL3) {
    return (
      <div ref={panelRef} className={styles.submenu}>
        <ul className={styles.submenuList}>
          {children.map(child => (
            <li key={child.id}>
              <button
                type="button"
                className={[styles.subItem, value === child.id ? styles.subItemActive : ''].filter(Boolean).join(' ')}
                onClick={() => onSelect(child.id)}
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
    <div ref={panelRef} className={styles.submenu}>
      {/* L2 column */}
      <ul className={styles.submenuList}>
        {children.map(l2 => (
          <li key={l2.id}>
            <button
              type="button"
              className={[
                styles.subItem,
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

      {/* L3 column — all lists rendered in the same grid cell so panel
          is always sized to the largest list; only the selected one is visible */}
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
                    type="button"
                    className={[styles.subItem, value === l3.id ? styles.subItemActive : ''].filter(Boolean).join(' ')}
                    onClick={() => onSelect(l3.id)}
                    tabIndex={selectedL2 !== l2.id ? -1 : 0}
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
}

export function Navigation({ items = [], value, onChange }) {
  const [openMenu, setOpenMenu] = useState(null)
  const navRef = useRef(null)

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
    setOpenMenu(null)
  }

  function handleL2Click(_id) {
    // L2 just reveals the L3 panel — it does not select anything
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
                type="button"
                className={[
                  styles.trigger,
                  isActive ? styles.active : '',
                  isOpen ? styles.triggerOpen : '',
                  hasMenu ? styles.hasMenu : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleItemClick(item)}
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
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
