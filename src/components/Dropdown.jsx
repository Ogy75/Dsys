import { useState, useRef, useEffect, useLayoutEffect, useCallback, cloneElement } from 'react'
import styles from './Dropdown.module.css'
import { Icon } from './Icon'

/* ── Icons ──────────────────────────────────────── */
function SearchIcon() {
  return <Icon name="search" style={{ color: 'rgb(115,115,115)' }} />
}

function CloseIcon() {
  return <Icon name="close" size={16} />
}

/* ── Placement hook ─────────────────────────────── */
const VIEWPORT_MARGIN = 8
const DROPDOWN_GAP = 4
const MIN_WIDTH = 320
const MAX_WIDTH = 460
// From Figma: item 52px, gap 4px between items, list padding 4px top+bottom
const ITEM_HEIGHT = 52
const ITEM_GAP = 4
const LIST_PADDING = 8
const MIN_VISIBLE_ITEMS = 2
const MIN_LIST_HEIGHT = LIST_PADDING + MIN_VISIBLE_ITEMS * ITEM_HEIGHT + (MIN_VISIBLE_ITEMS - 1) * ITEM_GAP // 116px
// Fixed chrome section heights
const SEARCH_BAR_HEIGHT = 48
const MULTISELECT_HEADER_HEIGHT = 36

function usePlacement(open, wrapRef, panelRef, align, searchable, multiselect) {
  const [above, setAbove] = useState(false)
  const [maxH, setMaxH] = useState(0)
  const [panelStyle, setPanelStyle] = useState({})

  const update = useCallback(() => {
    if (!open || !wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    // ── Vertical ────────────────────────────────────
    // Subtract the 4px gap between trigger and panel from available space
    const belowSpace = vh - rect.bottom - VIEWPORT_MARGIN - DROPDOWN_GAP
    const aboveSpace = rect.top - VIEWPORT_MARGIN - DROPDOWN_GAP
    const viewportCap = Math.floor(vh * 0.3)

    // Chrome height above the scrollable list
    const chromeH = (searchable ? SEARCH_BAR_HEIGHT : 0) + (multiselect ? MULTISELECT_HEADER_HEIGHT : 0)
    // Min panel height = chrome + enough list to show 2 items
    const minPanelH = chromeH + MIN_LIST_HEIGHT
    const fitsBelow = belowSpace >= minPanelH
    const fitsAbove = aboveSpace >= minPanelH

    // Pick the side that can fully display the panel; when both can (or neither can),
    // choose whichever has more room so the dropdown is always fully visible.
    let useAbove
    if (fitsBelow && fitsAbove) useAbove = aboveSpace > belowSpace
    else if (fitsBelow) useAbove = false
    else if (fitsAbove) useAbove = true
    else useAbove = aboveSpace > belowSpace
    setAbove(useAbove)

    // List maxH = chosen side's available space minus chrome, capped at viewportCap
    const chosenSpace = useAbove ? aboveSpace : belowSpace
    const listCap = Math.min(chosenSpace, viewportCap) - chromeH
    setMaxH(Math.max(listCap, MIN_LIST_HEIGHT))

    // ── Horizontal ───────────────────────────────────
    // Available horizontal space on each side (from trigger edges)
    const spaceRight = vw - rect.left - VIEWPORT_MARGIN   // space if left-aligned
    const spaceLeft  = rect.right - VIEWPORT_MARGIN        // space if right-aligned

    // Desired width: 320–460, capped to available space on the chosen side
    // Viewport-aware min: never wider than the viewport minus margins
    const viewportW = vw - VIEWPORT_MARGIN * 2

    // Decide alignment: prefer requested align, flip if it overflows
    let useAlign = align
    if (align === 'left'  && spaceRight < MIN_WIDTH) useAlign = 'right'
    if (align === 'right' && spaceLeft  < MIN_WIDTH) useAlign = 'left'

    const availableW = useAlign === 'right' ? spaceLeft : spaceRight
    const isMobile = vw < 380
    const triggerW = rect.width
    // Min width = trigger width, but at least MIN_WIDTH on desktop; never wider than viewport
    const desiredMin = Math.max(triggerW, isMobile ? 0 : MIN_WIDTH)
    const clampedMin = Math.min(desiredMin, viewportW)
    const clampedMax = Math.max(Math.min(Math.max(MAX_WIDTH, triggerW), availableW), clampedMin)

    const style = {
      minWidth: clampedMin,
      maxWidth: Math.max(clampedMax, clampedMin),
    }
    if (useAlign === 'right') {
      style.left = 'auto'
      style.right = 0
    } else {
      style.left = 0
      style.right = 'auto'
    }

    setPanelStyle(style)
  }, [open, wrapRef, panelRef, align, searchable, multiselect])

  useLayoutEffect(() => {
    if (!open) { setAbove(false); setMaxH(0); setPanelStyle({}); return }
    update()
    const raf = requestAnimationFrame(update)
    const t = setTimeout(update, 50)
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, update])

  return { above, maxH, panelStyle }
}

/* ── Dropdown Panel (internal) ──────────────────── */
function DropdownPanel({
  open,
  above,
  panelRef,
  panelStyle,
  items,
  value,
  onChange,
  multiselect,
  searchable,
  maxH,
  onClose,
  wrap,
}) {
  const [query, setQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const [lockedWidth, setLockedWidth] = useState(null)
  const [lockedHeight, setLockedHeight] = useState(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const itemRefs = useRef([])

  // Normalise value to array for uniform logic
  const selected = multiselect ? (value ?? []) : (value != null ? [value] : [])
  const isSelected = v => selected.includes(v)

  const filteredItems = searchable && query
    ? items.filter(i => i.type || i.label?.toLowerCase().includes(query.toLowerCase()))
    : items

  // Selectable (non-divider, non-section, non-disabled) items with their index in filteredItems
  const navigableIndices = filteredItems.reduce((acc, item, idx) => {
    if (!item.type && !item.disabled) acc.push(idx)
    return acc
  }, [])

  useEffect(() => {
    if (!open) { setQuery(''); setSearchActive(false); setFocusedIdx(-1); setLockedWidth(null); setLockedHeight(null) }
    else if (searchable) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open, searchable])

  // Lock panel width + height to their initial measured values so filtering doesn't resize them.
  // Wait until placement has applied min/max width so we capture the correct values.
  useLayoutEffect(() => {
    if (!open || (lockedWidth != null && lockedHeight != null)) return
    if (!panelStyle || panelStyle.minWidth == null) return
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      if (lockedWidth == null && rect.width > 0) setLockedWidth(rect.width)
      if (lockedHeight == null && rect.height > 0) setLockedHeight(rect.height)
    }
  }, [open, lockedWidth, lockedHeight, panelRef, panelStyle])

  // Reset focus when filtered list changes
  useEffect(() => { setFocusedIdx(-1) }, [query])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIdx >= 0 && itemRefs.current[focusedIdx]) {
      itemRefs.current[focusedIdx].scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIdx])

  function handleItemClick(item) {
    if (item.disabled) return
    if (multiselect) {
      const next = isSelected(item.value)
        ? selected.filter(v => v !== item.value)
        : [...selected, item.value]
      onChange?.(next)
    } else {
      onChange?.(item.value)
      onClose()
    }
  }

  const selectableItems = items.filter(i => !i.type && !i.disabled)

  function handleSelectAll() { onChange?.(selectableItems.map(i => i.value)) }
  function handleClear() { onChange?.([]) }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (navigableIndices.length === 0) return
      const currentPos = navigableIndices.indexOf(focusedIdx)
      if (e.key === 'ArrowDown') {
        const next = currentPos < navigableIndices.length - 1 ? navigableIndices[currentPos + 1] : navigableIndices[0]
        setFocusedIdx(next)
      } else {
        const prev = currentPos > 0 ? navigableIndices[currentPos - 1] : navigableIndices[navigableIndices.length - 1]
        setFocusedIdx(prev)
      }
      return
    }

    const focusedItem = focusedIdx >= 0 ? filteredItems[focusedIdx] : null
    if (!focusedItem || focusedItem.type || focusedItem.disabled) return

    if (multiselect) {
      if (e.key === ' ') {
        e.preventDefault()
        const next = isSelected(focusedItem.value)
          ? selected.filter(v => v !== focusedItem.value)
          : [...selected, focusedItem.value]
        onChange?.(next)
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        onClose()
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault()
        onChange?.(focusedItem.value)
        onClose()
      }
    }
  }

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className={[styles.panel, above ? styles.panelAbove : ''].filter(Boolean).join(' ')}
      style={{
        ...panelStyle,
        ...(lockedWidth != null ? { width: lockedWidth, minWidth: lockedWidth, maxWidth: lockedWidth } : {}),
        ...(lockedHeight != null ? { height: lockedHeight } : {}),
      }}
      role="dialog"
      onKeyDown={handleKeyDown}
    >
      {/* Search bar */}
      {searchable && (
        <div className={[styles.searchBar, searchActive || query ? styles.searchBarActive : ''].join(' ')}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Find"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            onMouseDown={e => e.stopPropagation()}
          />
          {query ? (
            <button
              type="button"
              className={styles.searchAction}
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setQuery('') }}
              aria-label="Clear search"
            >
              <CloseIcon />
            </button>
          ) : (
            <span className={styles.searchAction}><SearchIcon /></span>
          )}
        </div>
      )}

      {/* Multiselect header */}
      {multiselect && filteredItems.length > 0 && (
        <div className={styles.multiHeader}>
          {selected.length === 0 ? (
            <button type="button" className={styles.ghostBtn} onClick={handleSelectAll}>
              Select all
            </button>
          ) : (
            <button type="button" className={styles.ghostBtn} onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      )}

      {/* List */}
      {filteredItems.length === 0 ? (
        <div className={styles.noResults}>
          <Icon name="search_off" size={40} style={{ color: 'var(--color-grey-400)' }} />
          <p className={styles.noResultsTitle}>No results found</p>
          <p className={styles.noResultsSubtitle}>Try adjusting or clearing your filters.</p>
          {query && (
            <button
              type="button"
              className={styles.noResultsClearBtn}
              onClick={() => setQuery('')}
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className={styles.listWrap}>
          <ul
            ref={listRef}
            role="listbox"
            aria-multiselectable={multiselect}
            className={styles.list}
            style={{ maxHeight: maxH }}
            tabIndex={-1}
          >
            {filteredItems.map((item, idx) => {
              if (item.type === 'divider') {
                return <li key={idx} className={styles.divider} role="presentation"><span /></li>
              }
              if (item.type === 'section') {
                return (
                  <li key={idx} className={styles.sectionTitle} role="presentation">
                    {item.label}
                  </li>
                )
              }
              const active = isSelected(item.value)
              const focused = focusedIdx === idx
              return (
                <li
                  key={item.value}
                  ref={el => itemRefs.current[idx] = el}
                  role="option"
                  aria-selected={active}
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : 0}
                  className={[
                    styles.item,
                    wrap ? styles.itemWrap : '',
                    active ? styles.itemActive : '',
                    item.disabled ? styles.itemDisabled : '',
                    focused ? styles.itemFocused : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleItemClick(item)}
                  onFocus={() => setFocusedIdx(idx)}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                      handleKeyDown(e)
                    }
                  }}
                >
                  {item.icon != null && (
                    <span className={[styles.itemIcon, active ? styles.itemIconActive : ''].filter(Boolean).join(' ')}>
                      {item.icon}
                    </span>
                  )}
                  <span className={[styles.itemLabel, wrap ? styles.itemLabelWrap : '', active ? styles.itemLabelActive : ''].filter(Boolean).join(' ')}>{item.label}</span>
                  {item.badge != null && (
                    <span className={styles.itemBadge}>{item.badge}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ── Dropdown (public) ──────────────────────────── */
export function Dropdown({
  trigger,
  items = [],
  value,
  onChange,
  multiselect = false,
  searchable = false,
  wrap = false,
  maxHeight = 280,
  disabled = false,
  align = 'left',
  open: controlledOpen,
  onOpenChange,
  className,
}) {
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen

  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const { above, maxH, panelStyle } = usePlacement(open, rootRef, panelRef, align, searchable, multiselect)

  function toggle() {
    if (disabled) return
    const next = !open
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function close() {
    if (!isControlled) setInternalOpen(false)
    onOpenChange?.(false)
  }

  useEffect(() => {
    function onDown(e) {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Open with ArrowDown on trigger, close with Escape
  function handleTriggerKeyDown(e) {
    if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !open) {
      e.preventDefault()
      if (!isControlled) setInternalOpen(true)
      onOpenChange?.(true)
    }
    if (e.key === 'Escape' && open) {
      e.preventDefault()
      close()
    }
  }

  const triggerEl = cloneElement(trigger, {
    ...trigger.props,
    onClick: (e) => {
      trigger.props.onClick?.(e)
      toggle()
    },
    onKeyDown: (e) => {
      trigger.props.onKeyDown?.(e)
      handleTriggerKeyDown(e)
    },
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
  })

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} ref={rootRef}>
      {triggerEl}
      <DropdownPanel
        open={open}
        above={above}
        panelRef={panelRef}
        panelStyle={panelStyle}
        items={items}
        value={value}
        onChange={onChange}
        multiselect={multiselect}
        searchable={searchable}
        wrap={wrap}
        maxH={maxH}
        onClose={close}
      />
    </div>
  )
}
