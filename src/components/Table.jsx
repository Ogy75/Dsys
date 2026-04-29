import { useState, useRef, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from './Modal'
import { Textarea } from './Textarea'
import { Button } from '../pages/Button'
import { IconButton } from './IconButton'
import { Pagination } from './Pagination'
import { Icon } from './Icon'
import { Tooltip } from './Tooltip'
import { Skeleton } from './Skeleton'
import { MultiSelect } from '../pages/Select'
import { Dropdown } from './Dropdown'
import { Kbd } from './Kbd'
import { useToast } from './Toast'
import styles from './Table.module.css'

function BufferedFilterMultiSelect({ value, onCommit, options, size }) {
  const [draft, setDraft] = useState(value)
  const draftRef = useRef(draft)
  draftRef.current = draft
  function handleOpenChange(open) {
    if (open) {
      setDraft(value)
      draftRef.current = value
    } else {
      onCommit(draftRef.current)
    }
  }
  return (
    <MultiSelect
      size={size}
      placeholder="All"
      options={options}
      value={draft}
      onChange={setDraft}
      onOpenChange={handleOpenChange}
      portal
      borderless
    />
  )
}

function SortAscIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
    </svg>
  )
}

function SortDescIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
    </svg>
  )
}

function SortNeutralIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
    </svg>
  )
}


function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  )
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  )
}

function MoreVertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  )
}

function FullscreenExitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
    </svg>
  )
}

function DensitySmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
      <path d="M120-80v-80h720v80H120Zm0-240v-80h720v80H120Zm0-240v-80h720v80H120Zm0-240v-80h720v80H120Z"/>
    </svg>
  )
}

function DensityMediumIcon() {
  return (
    <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
      <path d="M120-120v-80h720v80H120Zm0-320v-80h720v80H120Zm0-320v-80h720v80H120Z"/>
    </svg>
  )
}

function DensityLargeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
      <path d="M120-120v-80h720v80H120Zm0-640v-80h720v80H120Z"/>
    </svg>
  )
}

function FullscreenEnterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  )
}

const VIEW_MENU_ITEMS = [
  { value: 'compact',     label: 'Compact view',     Icon: DensitySmallIcon },
  { value: 'default',     label: 'Default view',     Icon: DensityMediumIcon },
  { value: 'comfortable', label: 'Comfortable view', Icon: DensityLargeIcon },
  { value: 'fullscreen',  label: 'Full Screen',      Icon: FullscreenEnterIcon },
]

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const SHORTCUT_LABEL = {
  compact:     IS_MAC ? '⌘⌥1' : 'Ctrl+Alt+1',
  default:     IS_MAC ? '⌘⌥2' : 'Ctrl+Alt+2',
  comfortable: IS_MAC ? '⌘⌥3' : 'Ctrl+Alt+3',
  fullscreen:  IS_MAC ? '⌘⌥F' : 'Ctrl+Alt+F',
}

function ShortcutHint({ value }) {
  return <Kbd>{SHORTCUT_LABEL[value]}</Kbd>
}

function TableCheckbox({ checked, indeterminate, onChange, ariaLabel }) {
  return (
    <span className={styles.checkboxWrap}>
      <input
        type="checkbox"
        className={styles.checkboxInput}
        checked={checked}
        ref={el => { if (el) el.indeterminate = !!indeterminate }}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className={[
        styles.checkboxBox,
        checked || indeterminate ? styles.checkboxBoxChecked : '',
      ].filter(Boolean).join(' ')} aria-hidden="true">
        {indeterminate
          ? <svg width="10" height="2" viewBox="0 0 10 2" fill="none"><path d="M0 1h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          : checked
          ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : null}
      </span>
    </span>
  )
}

function evalArith(expr) {
  const str = expr.trim()
  const tokens = []
  let i = 0
  while (i < str.length) {
    if (/\s/.test(str[i])) { i++; continue }
    if (/[0-9.]/.test(str[i])) {
      let num = ''
      while (i < str.length && /[0-9.]/.test(str[i])) num += str[i++]
      tokens.push({ type: 'num', val: parseFloat(num) })
    } else if (['+', '-', '*', '/'].includes(str[i])) {
      tokens.push({ type: 'op', val: str[i++] })
    } else if (str[i] === '(') {
      tokens.push({ type: 'lparen' }); i++
    } else if (str[i] === ')') {
      tokens.push({ type: 'rparen' }); i++
    } else {
      return null
    }
  }
  let pos = 0
  function parseExpr() { return parseAddSub() }
  function parseAddSub() {
    let left = parseMulDiv()
    if (left === null) return null
    while (pos < tokens.length && tokens[pos].type === 'op' && ['+', '-'].includes(tokens[pos].val)) {
      const op = tokens[pos++].val
      const right = parseMulDiv()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }
  function parseMulDiv() {
    let left = parsePrimary()
    if (left === null) return null
    while (pos < tokens.length && tokens[pos].type === 'op' && ['*', '/'].includes(tokens[pos].val)) {
      const op = tokens[pos++].val
      const right = parsePrimary()
      if (right === null || (op === '/' && right === 0)) return null
      left = op === '*' ? left * right : left / right
    }
    return left
  }
  function parsePrimary() {
    if (pos >= tokens.length) return null
    const t = tokens[pos]
    if (t.type === 'num') { pos++; return t.val }
    if (t.type === 'lparen') {
      pos++
      const val = parseExpr()
      if (pos < tokens.length && tokens[pos].type === 'rparen') pos++
      return val
    }
    if (t.type === 'op' && t.val === '-') {
      pos++
      const val = parsePrimary()
      return val === null ? null : -val
    }
    return null
  }
  const result = parseExpr()
  return (result !== null && pos === tokens.length) ? result : null
}

function splitAtComparison(s) {
  const ops = ['>=', '<=', '!=', '>', '<', '=']
  let depth = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(') depth++
    else if (c === ')') depth--
    else if (depth === 0) {
      for (const op of ops) {
        if (s.substr(i, op.length) === op) {
          return { lhs: s.slice(0, i), op, rhs: s.slice(i + op.length) }
        }
      }
    }
  }
  return null
}

function applyFormula(rawValue, formula, row, columns) {
  const f = formula.trim()
  if (!f) return true

  // Substitute column key references with their numeric row values
  let resolved = f
  if (row && columns) {
    const sorted = [...columns].sort((a, b) => b.key.length - a.key.length)
    for (const col of sorted) {
      const num = parseFloat(row[col.key])
      if (!isNaN(num)) {
        resolved = resolved.replace(new RegExp(`\\b${col.key}\\b`, 'gi'), String(num))
      }
    }
  }

  const strVal = String(rawValue ?? '').toLowerCase()
  const numVal = parseFloat(rawValue)
  let m

  // Arithmetic comparison: <expr> OP <expr> (both sides may be arithmetic with column refs)
  {
    const split = splitAtComparison(resolved)
    if (split && split.lhs.trim() && split.rhs.trim()) {
      const lhs = evalArith(split.lhs)
      const rhs = evalArith(split.rhs)
      if (lhs !== null && rhs !== null) {
        if (split.op === '>=') return lhs >= rhs
        if (split.op === '<=') return lhs <= rhs
        if (split.op === '!=') return lhs !== rhs
        if (split.op === '>')  return lhs > rhs
        if (split.op === '<')  return lhs < rhs
        if (split.op === '=')  return lhs === rhs
      }
    }
  }

  // Arithmetic between: <expr> between <n> and <n>
  m = resolved.match(/^(.+?)\s+between\s+(-?[0-9.]+)\s+and\s+(-?[0-9.]+)$/i)
  if (m) {
    const lhs = evalArith(m[1])
    if (lhs !== null) return lhs >= parseFloat(m[2]) && lhs <= parseFloat(m[3])
  }

  // Simple numeric patterns (no column refs, rawValue is the operand)
  m = resolved.match(/^>=\s*([0-9.-]+)$/)
  if (m) return !isNaN(numVal) && numVal >= parseFloat(m[1])
  m = resolved.match(/^<=\s*([0-9.-]+)$/)
  if (m) return !isNaN(numVal) && numVal <= parseFloat(m[1])
  m = resolved.match(/^>\s*([0-9.-]+)$/)
  if (m) return !isNaN(numVal) && numVal > parseFloat(m[1])
  m = resolved.match(/^<\s*([0-9.-]+)$/)
  if (m) return !isNaN(numVal) && numVal < parseFloat(m[1])
  m = resolved.match(/^between\s+([0-9.-]+)\s+and\s+([0-9.-]+)$/i)
  if (m) return !isNaN(numVal) && numVal >= parseFloat(m[1]) && numVal <= parseFloat(m[2])
  m = resolved.match(/^!=\s*"([^"]*)"$/i) || resolved.match(/^!=\s*'([^']*)'$/i)
  if (m) return strVal !== m[1].toLowerCase()
  m = resolved.match(/^!=\s*(.+)$/)
  if (m) return strVal !== m[1].trim().toLowerCase()
  m = resolved.match(/^=\s*"([^"]*)"$/i) || resolved.match(/^=\s*'([^']*)'$/i)
  if (m) return strVal === m[1].toLowerCase()
  m = resolved.match(/^=\s*(.+)$/)
  if (m) return strVal === m[1].trim().toLowerCase()
  m = resolved.match(/^contains\s+"([^"]*)"$/i) || resolved.match(/^contains\s+'([^']*)'$/i)
  if (m) return strVal.includes(m[1].toLowerCase())
  m = resolved.match(/^contains\s+(.+)$/i)
  if (m) return strVal.includes(m[1].trim().toLowerCase())
  m = resolved.match(/^starts\s+"([^"]*)"$/i) || resolved.match(/^starts\s+'([^']*)'$/i)
  if (m) return strVal.startsWith(m[1].toLowerCase())
  m = resolved.match(/^starts\s+(.+)$/i)
  if (m) return strVal.startsWith(m[1].trim().toLowerCase())
  m = resolved.match(/^ends\s+"([^"]*)"$/i) || resolved.match(/^ends\s+'([^']*)'$/i)
  if (m) return strVal.endsWith(m[1].toLowerCase())
  m = resolved.match(/^ends\s+(.+)$/i)
  if (m) return strVal.endsWith(m[1].trim().toLowerCase())
  if (resolved.toLowerCase() === 'empty') return rawValue == null || rawValue === ''
  if (resolved.toLowerCase() === '!empty') return rawValue != null && rawValue !== ''
  return strVal.includes(resolved.toLowerCase())
}

const MODE_OPTIONS = [
  { value: 'find',      label: 'Find...',   icon: 'search' },
  { value: 'calculate', label: 'Calculate', icon: 'functions' },
]

function FilterModeDropdown({ open, pos, mode, onSelect, onClose, activeIdx }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (panelRef.current?.contains(e.target)) return
      onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={panelRef}
      className={styles.filterDropdownPanel}
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      {MODE_OPTIONS.map((item, i) => (
        <button
          key={item.value}
          type="button"
          className={[
            styles.filterDropdownItem,
            mode === item.value ? styles.filterDropdownItemActive : '',
            i === activeIdx && mode !== item.value ? styles.filterDropdownItemHovered : '',
          ].filter(Boolean).join(' ')}
          onMouseDown={e => { e.preventDefault(); onSelect(item.value); onClose() }}
        >
          <Icon name={item.icon} size={16} />
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  )
}


function FormulaAutocomplete({ suggestions, pos, onSelect, onClose, activeIdx }) {
  const panelRef = useRef(null)
  useEffect(() => {
    if (!suggestions.length) return
    function handle(e) {
      if (panelRef.current?.contains(e.target)) return
      onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [suggestions.length, onClose])
  if (!suggestions.length) return null
  return createPortal(
    <div ref={panelRef} className={styles.filterDropdownPanel}
      style={{ top: pos.top, left: pos.left, minWidth: pos.width }}>
      {suggestions.map((col, i) => (
        <button key={col.key} type="button"
          className={[styles.filterDropdownItem, i === activeIdx ? styles.filterDropdownItemActive : ''].filter(Boolean).join(' ')}
          onMouseDown={e => { e.preventDefault(); onSelect(col.key) }}>
          {col.label}
        </button>
      ))}
    </div>,
    document.body
  )
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function resolveAlign(col) {
  if (col.align) return col.align
  return 'left'
}

export function Table({
  columns,
  data: dataProp,
  onRowChange,
  onSelectionChange,
  maxHeight,
  fill = false,
  selectable = false,
  density: densityProp = 'default',
  onDensityChange,
  zebra = false,
  pageSize = 30,
  resizable = true,
  reorderable = true,
  stretch = false,
  rowNumbers = false,
  caption,
}) {
  const [sortAnnouncement, setSortAnnouncement] = useState('')
  const [rows, setRows] = useState(() => dataProp)
  useEffect(() => { setRows(dataProp) }, [dataProp])

  const [density, setDensity] = useState(densityProp)
  useEffect(() => { setDensity(densityProp) }, [densityProp])
  function updateDensity(next) {
    setDensity(next)
    onDensityChange?.(next)
  }
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  useEffect(() => {
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.shiftKey && (e.key === '0' || e.code === 'Digit0')) {
        e.preventDefault()
        setSearches({})
        setMultiFilters({})
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // View shortcuts: ⌘⇧A/S/D switch density, ⌘⇧F toggles fullscreen.
  // Active when focus is inside this table or this table is fullscreen.
  useEffect(() => {
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod || !e.altKey) return
      // Active when focus is inside this table, on body (no specific focus), or table is fullscreen
      const ae = document.activeElement
      const inside =
        isFullscreen ||
        ae === document.body ||
        ae === null ||
        containerRef.current?.contains(ae)
      if (!inside) return
      // Alt on Mac alters the produced character (e.g. ⌥A → "å"), so prefer e.code
      const code = e.code
      if (code === 'Digit1' || code === 'Numpad1')      { e.preventDefault(); e.stopPropagation(); updateDensity('compact') }
      else if (code === 'Digit2' || code === 'Numpad2') { e.preventDefault(); e.stopPropagation(); updateDensity('default') }
      else if (code === 'Digit3' || code === 'Numpad3') { e.preventDefault(); e.stopPropagation(); updateDensity('comfortable') }
      else if (code === 'KeyF')                         { e.preventDefault(); e.stopPropagation(); setIsFullscreen(v => !v) }
    }
    // Capture phase so we run before any browser/app keybinding (Cmd+Alt+S is mapped by some browsers)
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [isFullscreen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isFullscreen) return
    function onKey(e) {
      if (e.key !== 'Escape') return
      // If a modal/drawer is open above the fullscreen table, let it handle Escape.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      setIsFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isFullscreen])

  const [columnOrder, setColumnOrder] = useState(() => columns.map(c => c.key))
  useEffect(() => {
    setColumnOrder(prev => {
      const existing = new Set(prev)
      const added = columns.map(c => c.key).filter(k => !existing.has(k))
      return added.length ? [...prev, ...added] : prev
    })
    setColWidths(prev => {
      const next = { ...prev }
      let changed = false
      columns.forEach(c => {
        if (!(c.key in next)) {
          const overhead = 54 + 16 + (c.sortable ? 22 : 0)
          const labelMin = Math.ceil(c.label.length * 10 + overhead)
          next[c.key] = Math.max(c.width ?? labelMin, labelMin, c.minWidth ?? 80)
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [columns])
  const [colWidths, setColWidths] = useState(() => ({
    __rowNum__: 40,
    ...Object.fromEntries(columns.map(c => {
      // overhead: padding (16+22) + drag handle (16) + sort icon+gap (22 if sortable)
      const overhead = 54 + 16 + (c.sortable ? 22 : 0)
      const labelMin = Math.ceil(c.label.length * 10 + overhead)
      return [c.key, Math.max(c.width ?? labelMin, labelMin, c.minWidth ?? 80)]
    })),
  }))
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [searches, setSearches] = useState({})
  const [multiFilters, setMultiFilters] = useState({})
  const [filterModes, setFilterModes] = useState(() =>
    Object.fromEntries(
      columns
        .filter(c => c.filterFormula && c.defaultFilterMode)
        .map(c => [c.key, c.defaultFilterMode])
    )
  )
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null)
  const [filterDropdownPos, setFilterDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [activeModeDropdownIdx, setActiveModeDropdownIdx] = useState(0)
  const filterAnchorRefs = useRef({})
  const filterInputRefs = useRef({})
  const [formulaSuggestions, setFormulaSuggestions] = useState([])
  const [formulaSuggestionPos, setFormulaSuggestionPos] = useState({ top: 0, left: 0, width: 0 })
  const [formulaSuggestionMeta, setFormulaSuggestionMeta] = useState(null)
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0)
  const [focused, setFocused] = useState({ row: 0, col: 0 })
  const { toast } = useToast()
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)
  const [isPaging, setIsPaging] = useState(false)
  const firstPageRenderRef = useRef(true)
  const [editModal, setEditModal] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [dragOverCol, setDragOverCol] = useState(null)
  const cellRefs = useRef({})
  const editInputRef = useRef(null)
  const resizingRef = useRef(null)
  const dragColRef = useRef(null)
  const tableWrapperRef = useRef(null)
  const headerScrollRef = useRef(null)
  const editReturnFocusRef = useRef(null)

  function handleBodyScroll() {
    if (headerScrollRef.current && tableWrapperRef.current) {
      headerScrollRef.current.scrollLeft = tableWrapperRef.current.scrollLeft
    }
  }

  const checkboxColWidth = 44
  const rowNumColWidth = colWidths['__rowNum__'] ?? 40

  const orderedColumns = useMemo(
    () => columnOrder.map(key => columns.find(c => c.key === key)).filter(Boolean),
    [columnOrder, columns]
  )

  const hasSearch = orderedColumns.some(c => c.searchable || c.filterFormula || c.filterSelect)

  const columnFilterTypes = useMemo(() => {
    const types = {}
    const distincts = {}
    const customOptions = {}
    orderedColumns.forEach(col => {
      if (col.filterFormula) { types[col.key] = 'formula'; return }
      if (col.filterSelect) {
        if (col.filterOptions) {
          types[col.key] = 'bucket'
          customOptions[col.key] = col.filterOptions
        } else {
          const vals = [...new Set(rows.map(r => String(r[col.key] ?? '')).filter(v => v !== ''))].sort()
          types[col.key] = 'multiselect'
          distincts[col.key] = vals
        }
        return
      }
      if (col.searchable) { types[col.key] = 'find'; return }
      types[col.key] = null
    })
    return { types, distincts, customOptions }
  }, [orderedColumns, rows])

  const totalTableWidth = useMemo(() =>
    (rowNumbers ? rowNumColWidth : 0) +
    (selectable ? checkboxColWidth : 0) +
    orderedColumns.reduce((sum, col) => sum + (colWidths[col.key] ?? 0), 0),
    [rowNumbers, selectable, orderedColumns, colWidths]
  )

  const stickyMeta = useMemo(() => {
    const map = {}
    let left = (rowNumbers ? rowNumColWidth : 0) + (selectable ? checkboxColWidth : 0)
    let lastKey = null
    orderedColumns.forEach(col => {
      if (col.sticky) {
        map[col.key] = left
        left += colWidths[col.key]
        lastKey = col.key
      }
    })
    const checkboxIsLastSticky = selectable && lastKey === null
    const rowNumIsLastSticky = rowNumbers && !selectable && lastKey === null
    return { map, lastKey, checkboxIsLastSticky, rowNumIsLastSticky, totalFrozenWidth: left }
  }, [orderedColumns, colWidths, selectable, rowNumbers])

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows
    return [...rows].sort((a, b) => {
      const av = a[sort.key] ?? ''
      const bv = b[sort.key] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, sort])

  const filteredRows = useMemo(() => {
    let result = sortedRows
    const active = Object.entries(searches).filter(([, v]) => v)
    if (active.length) {
      result = result.filter(row =>
        active.every(([k, q]) => {
          if ((filterModes[k] ?? 'find') === 'calculate') return applyFormula(row[k], q, row, columns)
          return String(row[k] ?? '').toLowerCase().includes(q.toLowerCase())
        })
      )
    }
    const activeMulti = Object.entries(multiFilters).filter(([, arr]) => arr && arr.length > 0)
    if (activeMulti.length) {
      result = result.filter(row =>
        activeMulti.every(([k, arr]) => {
          const bucketOpts = columnFilterTypes.customOptions[k]
          if (bucketOpts) {
            const selected = bucketOpts.filter(o => arr.includes(o.value))
            return selected.some(o => o.match(row[k], row))
          }
          return arr.includes(String(row[k] ?? ''))
        })
      )
    }
    return result
  }, [sortedRows, searches, filterModes, columns, multiFilters, columnFilterTypes])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page, pageSize])

  useEffect(() => {
    setPage(1)
    setFocused({ row: 0, col: 0 })
  }, [searches, sort.key, sort.dir, multiFilters])

  useEffect(() => {
    if (!openFilterDropdown) return
    function update() {
      const anchor = filterAnchorRefs.current[openFilterDropdown]
      if (!anchor) return
      const r = anchor.getBoundingClientRect()
      setFilterDropdownPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    window.addEventListener('scroll', update, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', update, { capture: true })
  }, [openFilterDropdown])

  useEffect(() => {
    if (!formulaSuggestions.length || !formulaSuggestionMeta) return
    function update() {
      const anchor = filterAnchorRefs.current[formulaSuggestionMeta.colKey]
      if (!anchor) return
      const r = anchor.getBoundingClientRect()
      setFormulaSuggestionPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    window.addEventListener('scroll', update, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', update, { capture: true })
  }, [formulaSuggestions.length, formulaSuggestionMeta])


  useEffect(() => {
    if (firstPageRenderRef.current) {
      firstPageRenderRef.current = false
      return
    }
    setIsPaging(true)
    let rafId = null
    const wrapper = tableWrapperRef.current
    if (wrapper && wrapper.scrollTop > 0) {
      const startTop = wrapper.scrollTop
      const duration = 300
      const startTime = performance.now()
      const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3)
      const step = (now) => {
        const k = Math.min(1, (now - startTime) / duration)
        wrapper.scrollTop = startTop * (1 - easeOutCubic(k))
        if (k < 1) rafId = requestAnimationFrame(step)
      }
      rafId = requestAnimationFrame(step)
    }
    const t = setTimeout(() => setIsPaging(false), 700)
    return () => {
      clearTimeout(t)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [page])

  function applyFormulaSuggestion(colKey) {
    if (!formulaSuggestionMeta) return
    const { colKey: inputKey, wordStart, wordEnd } = formulaSuggestionMeta
    const current = searches[inputKey] ?? ''
    const newVal = current.slice(0, wordStart) + colKey + current.slice(wordEnd)
    setSearches(prev => ({ ...prev, [inputKey]: newVal }))
    setFormulaSuggestions([])
    setFormulaSuggestionMeta(null)
    setActiveSuggestionIdx(0)
    const inputEl = filterInputRefs.current[inputKey]
    if (inputEl) {
      inputEl.focus()
      const newCursor = wordStart + colKey.length
      requestAnimationFrame(() => inputEl.setSelectionRange(newCursor, newCursor))
    }
  }

  function handleOperatorKeyDown(e, colKey) {
    const ch = e.key
    const SINGLE_OPS = new Set(['+', '-', '*', '/'])
    const COMPOUND_STARTS = new Set(['>', '<', '!'])
    const isOp = SINGLE_OPS.has(ch) || COMPOUND_STARTS.has(ch) || ch === '='
    if (!isOp || e.ctrlKey || e.metaKey || e.altKey) return
    const input = filterInputRefs.current[colKey]
    if (!input) return
    const val = searches[colKey] ?? ''
    const start = input.selectionStart ?? val.length
    const end = input.selectionEnd ?? start
    // Compound operator completion: type '=' after '>', '<', '!'
    if (ch === '=') {
      const before = val.slice(0, start)
      const trimmed = before.trimEnd()
      const lastCh = trimmed.slice(-1)
      if (COMPOUND_STARTS.has(lastCh)) {
        e.preventDefault()
        const newBefore = trimmed.slice(0, -1)
        const compound = lastCh + '='
        const needsBefore = newBefore.length > 0 && newBefore[newBefore.length - 1] !== ' '
        const after = val.slice(end)
        const needsAfter = after.length > 0 && after[0] !== ' '
        const newVal = newBefore + (needsBefore ? ' ' : '') + compound + (needsAfter ? ' ' : '') + after
        const newCursor = newBefore.length + (needsBefore ? 1 : 0) + compound.length + (needsAfter ? 1 : 0)
        setSearches(prev => ({ ...prev, [colKey]: newVal }))
        requestAnimationFrame(() => input.setSelectionRange(newCursor, newCursor))
        return
      }
    }
    const before = val.slice(0, start)
    const after = val.slice(end)
    const needsBefore = before.length > 0 && before[before.length - 1] !== ' '
    const needsAfter = after.length > 0 && after[0] !== ' '
    if (!needsBefore && !needsAfter) return
    e.preventDefault()
    const prefix = before + (needsBefore ? ' ' : '')
    const suffix = (needsAfter ? ' ' : '') + after
    const newVal = prefix + ch + suffix
    const newCursor = prefix.length + 1 + (needsAfter ? 1 : 0)
    setSearches(prev => ({ ...prev, [colKey]: newVal }))
    requestAnimationFrame(() => input.setSelectionRange(newCursor, newCursor))
  }

  // ── Resize ─────────────────────────────────────────────────
  function startResize(e, colKey) {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startWidth = colWidths[colKey]
    resizingRef.current = { colKey, startX, startWidth }

    function onMove(mv) {
      if (!resizingRef.current) return
      const { colKey: k, startX: sx, startWidth: sw } = resizingRef.current
      const minW = k === '__rowNum__' ? 32 : (columns.find(c => c.key === k)?.minWidth ?? 80)
      setColWidths(prev => ({ ...prev, [k]: Math.max(minW, sw + (mv.clientX - sx)) }))
    }
    function onUp() {
      resizingRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // ── Sort ───────────────────────────────────────────────────
  function handleSort(colKey) {
    setSort(prev => {
      const colLabel = columns.find(c => c.key === colKey)?.label ?? colKey
      let next
      if (prev.key !== colKey) next = { key: colKey, dir: 'asc' }
      else if (prev.dir === 'asc') next = { key: colKey, dir: 'desc' }
      else next = { key: null, dir: 'asc' }
      if (next.key == null) setSortAnnouncement(`Sorting cleared`)
      else setSortAnnouncement(`Sorted by ${colLabel}, ${next.dir === 'asc' ? 'ascending' : 'descending'}`)
      return next
    })
  }

  // ── Column drag-and-drop reorder ───────────────────────────
  function handleDragStart(e, colKey) {
    dragColRef.current = colKey
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', colKey)
  }

  function handleDragOver(e, colKey) {
    const targetCol = orderedColumns.find(c => c.key === colKey)
    if (!dragColRef.current || dragColRef.current === colKey || targetCol?.sticky) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCol(colKey)
  }

  function handleDrop(e, targetKey) {
    e.preventDefault()
    const srcKey = dragColRef.current
    setDragOverCol(null)
    dragColRef.current = null
    const targetCol = orderedColumns.find(c => c.key === targetKey)
    if (!srcKey || srcKey === targetKey || targetCol?.sticky) return
    setColumnOrder(prev => {
      const next = [...prev]
      const si = next.indexOf(srcKey)
      const ti = next.indexOf(targetKey)
      next.splice(si, 1)
      next.splice(ti, 0, srcKey)
      return next
    })
  }

  function handleDragEnd() {
    dragColRef.current = null
    setDragOverCol(null)
  }

  // ── Selection ──────────────────────────────────────────────
  const allFilteredSelected =
    pagedRows.length > 0 &&
    pagedRows.every(r => selected.has(rows.indexOf(r)))

  const someFilteredSelected =
    !allFilteredSelected &&
    pagedRows.some(r => selected.has(rows.indexOf(r)))

  function toggleSelectAll(e) {
    const next = new Set(selected)
    if (e.target.checked) {
      pagedRows.forEach(r => next.add(rows.indexOf(r)))
    } else {
      pagedRows.forEach(r => next.delete(rows.indexOf(r)))
    }
    setSelected(next)
    onSelectionChange?.(rows.filter((_, i) => next.has(i)))
  }

  function toggleSelectRow(origIdx) {
    const next = new Set(selected)
    if (next.has(origIdx)) next.delete(origIdx)
    else next.add(origIdx)
    setSelected(next)
    onSelectionChange?.(rows.filter((_, i) => next.has(i)))
  }


  // ── Copy-to-clipboard notice ──────────────────────────────
  function getFocusedCellText() {
    const colOffset = selectable ? 1 : 0
    if (focused.col < colOffset) return ''
    const el = cellRefs.current[`${focused.row}-${focused.col}`]
    const domText = el?.innerText?.replace(/\s+/g, ' ').trim()
    if (domText) return domText
    const col = orderedColumns[focused.col - colOffset]
    const row = pagedRows[focused.row]
    if (!col || !row) return ''
    const raw = row[col.key]
    return raw == null ? '' : String(raw)
  }

  function handleTableCopy(e) {
    const sel = typeof window !== 'undefined' ? window.getSelection?.()?.toString() ?? '' : ''
    if (!sel) {
      const text = getFocusedCellText()
      if (!text) return
      e.preventDefault()
      e.clipboardData?.setData('text/plain', text)
    }
    toast({ variant: 'info', title: 'Info', message: 'Cell data copied to clipboard', duration: 1500 })
  }

  // ── Keyboard nav ───────────────────────────────────────────
  function handleCellKeyDown(e, ri, ci) {
    const numRows = filteredRows.length
    const colOffset = selectable ? 1 : 0
    const numCols = orderedColumns.length + colOffset
    let next = null

    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); if (ri > 0) next = { row: ri - 1, col: ci }; break
      case 'ArrowDown':  e.preventDefault(); if (ri < numRows - 1) next = { row: ri + 1, col: ci }; break
      case 'ArrowLeft':  e.preventDefault(); if (ci > 0) next = { row: ri, col: ci - 1 }; break
      case 'ArrowRight': e.preventDefault(); if (ci < numCols - 1) next = { row: ri, col: ci + 1 }; break
      case 'Home':       e.preventDefault(); next = { row: ri, col: 0 }; break
      case 'End':        e.preventDefault(); next = { row: ri, col: numCols - 1 }; break
      case 'Enter':
      case ' ':
        if (selectable && ci === 0) {
          e.preventDefault()
          toggleSelectRow(rows.indexOf(pagedRows[ri]))
        } else {
          const colIdx = ci - colOffset
          if (orderedColumns[colIdx]?.editable) { e.preventDefault(); openEdit(ri, colIdx) }
        }
        break
      default: return
    }

    if (next) {
      setFocused(next)
      const el = cellRefs.current[`${next.row}-${next.col}`]
      if (el) {
        el.focus({ preventScroll: true })
        const wrapper = tableWrapperRef.current
        if (wrapper) {
          const wr = wrapper.getBoundingClientRect()
          const cr = el.getBoundingClientRect()
          const frozenLeft = stickyMeta.totalFrozenWidth
          if (cr.left < wr.left + frozenLeft) {
            wrapper.scrollLeft -= (wr.left + frozenLeft - cr.left)
          } else if (cr.right > wr.right) {
            wrapper.scrollLeft += (cr.right - wr.right)
          }
          if (cr.top < wr.top) {
            wrapper.scrollTop -= (wr.top - cr.top)
          } else if (cr.bottom > wr.bottom) {
            wrapper.scrollTop += (cr.bottom - wr.bottom)
          }
        }
      }
    }
  }

  // ── Edit ───────────────────────────────────────────────────
  function openEdit(ri, ci) {
    const col = orderedColumns[ci]
    if (!col.editable) return
    const row = filteredRows[ri]
    editReturnFocusRef.current = `${ri}-${ci}`
    setEditDraft(String(row[col.key] ?? ''))
    setEditModal({ ri, key: col.key, label: col.label, origRow: row })
  }

  function closeEdit() {
    setEditModal(null)
    const key = editReturnFocusRef.current
    if (key) {
      requestAnimationFrame(() => {
        cellRefs.current[key]?.focus()
      })
    }
  }

  function saveEdit() {
    if (!editModal) return
    const { key, origRow } = editModal
    const origIdx = rows.findIndex(r => r === origRow)
    if (origIdx !== -1) {
      setRows(prev => prev.map((r, i) => i === origIdx ? { ...r, [key]: editDraft } : r))
      onRowChange?.(origIdx, key, editDraft)
    }
    closeEdit()
  }

  useEffect(() => {
    if (editModal) {
      const t = setTimeout(() => editInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [editModal])

  const colgroup = (
    <colgroup>
      {rowNumbers && <col style={{ width: rowNumColWidth }} />}
      {selectable && <col style={{ width: checkboxColWidth }} />}
      {orderedColumns.map(col => (
        <col
          key={col.key}
          style={stretch ? { width: `${100 / orderedColumns.length}%` } : { width: colWidths[col.key] }}
        />
      ))}
      {!stretch && <col />}
    </colgroup>
  )

  return (
    <div ref={containerRef} className={[styles.container, fill ? styles.fill : '', isFullscreen ? styles.fullscreen : ''].filter(Boolean).join(' ')}>
      <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{sortAnnouncement}</span>
      <div
        className={[styles.tableWrapper, fill || isFullscreen ? styles.fillWrapper : ''].filter(Boolean).join(' ')}
        style={!isFullscreen && maxHeight ? { height: maxHeight } : undefined}
      >
        <div className={styles.headerScroll} ref={headerScrollRef}>
          <table
            className={styles.table}
            data-density={density}
            role="presentation"
            style={stretch ? { width: '100%' } : { minWidth: totalTableWidth }}
          >
            {colgroup}
            <thead>
            {/* ── Label row ── */}
            <tr>
              {rowNumbers && (
                <th
                  className={[
                    styles.th,
                    styles.rowNumTh,
                    styles.stickyCell,
                    stickyMeta.rowNumIsLastSticky ? styles.stickyLast : '',
                  ].filter(Boolean).join(' ')}
                  style={{ position: 'sticky', left: 0, zIndex: 3 }}
                >
                  <Dropdown
                    align="left"
                    portal
                    minWidth={0}
                    size={density === 'comfortable' ? 'lg' : 'md'}
                    value={density}
                    onChange={val => {
                      if (val === 'fullscreen') setIsFullscreen(v => !v)
                      else updateDensity(val)
                    }}
                    items={VIEW_MENU_ITEMS.map(item => {
                      const isFs = item.value === 'fullscreen'
                      const FsIcon = isFullscreen ? FullscreenExitIcon : FullscreenEnterIcon
                      const entry = {
                        value: item.value,
                        label: isFs && isFullscreen ? 'Exit Full Screen' : item.label,
                        icon: isFs ? <FsIcon /> : <item.Icon />,
                        badge: isFs && isFullscreen ? <Kbd>Esc</Kbd> : <ShortcutHint value={item.value} />,
                      }
                      return isFs ? [{ type: 'divider' }, entry] : [entry]
                    }).flat()}
                    trigger={
                      <span style={{ display: 'inline-flex' }}>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          icon={<MoreVertIcon />}
                          aria-label="View options"
                          aria-haspopup="menu"
                        />
                      </span>
                    }
                  />
                  {resizable && (
                    <div
                      className={styles.resizeHandle}
                      draggable={false}
                      onMouseDown={e => startResize(e, '__rowNum__')}
                    />
                  )}
                </th>
              )}
              {selectable && (
                <th
                  className={[
                    styles.th,
                    styles.checkboxTh,
                    styles.stickyCell,
                    stickyMeta.checkboxIsLastSticky ? styles.stickyLast : '',
                  ].filter(Boolean).join(' ')}
                  style={{ position: 'sticky', left: rowNumbers ? rowNumColWidth : 0, zIndex: 3 }}
                >
                  {!hasSearch && (
                    <TableCheckbox
                      checked={allFilteredSelected}
                      indeterminate={someFilteredSelected}
                      onChange={toggleSelectAll}
                      ariaLabel="Select all rows"
                    />
                  )}
                </th>
              )}

              {orderedColumns.map((col) => {
                const isSorted = sort.key === col.key
                const align = resolveAlign(col)
                const isSticky = col.sticky && stickyMeta.map[col.key] !== undefined
                const isLastSticky = col.key === stickyMeta.lastKey
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={[
                      styles.th,
                      col.sortable ? styles.sortable : '',
                      isSorted ? styles.sorted : '',
                      align === 'right' ? styles.alignRight : align === 'center' ? styles.alignCenter : '',
                      dragOverCol === col.key ? styles.dropTarget : '',
                      isSticky ? styles.stickyCell : '',
                      isLastSticky ? styles.stickyLast : '',
                    ].filter(Boolean).join(' ')}
                    aria-sort={isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    style={{ width: colWidths[col.key], ...(isSticky ? { position: 'sticky', left: stickyMeta.map[col.key], zIndex: 3 } : {}) }}
                    draggable={reorderable && !isSticky}
                    onDragStart={reorderable && !isSticky ? e => handleDragStart(e, col.key) : undefined}
                    onDragOver={e => handleDragOver(e, col.key)}
                    onDrop={e => handleDrop(e, col.key)}
                    onDragEnd={isSticky ? undefined : handleDragEnd}
                    onDragLeave={() => setDragOverCol(null)}
                  >
                    <div
                      className={styles.thInner}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    >
                      {col.sortable && (
                        <span className={styles.sortIcon}>
                          {isSorted
                            ? sort.dir === 'asc' ? <SortAscIcon /> : <SortDescIcon />
                            : <SortNeutralIcon />}
                        </span>
                      )}
                      <span className={styles.thLabelWrap}>
                        <span className={styles.thLabel}>{col.label}</span>
                        {col.editable && (
                          <span className={styles.editableIcon} aria-hidden="true">
                            <PencilIcon />
                          </span>
                        )}
                      </span>
                      {reorderable && !isSticky && (
                        <span
                          className={styles.dragHandle}
                          onMouseDown={e => e.stopPropagation()}
                        >
                          <GripIcon />
                        </span>
                      )}
                    </div>

                    {resizable && (
                      <div
                        className={styles.resizeHandle}
                        draggable={false}
                        onMouseDown={e => startResize(e, col.key)}
                      />
                    )}
                  </th>
                )
              })}
              {!stretch && <th className={styles.spacerTh} />}
            </tr>

            {/* ── Filter row ── */}
            {hasSearch && (
              <tr>
                {rowNumbers && (
                  <th
                    className={[
                      styles.filterTh,
                      styles.rowNumTh,
                      styles.stickyCell,
                      stickyMeta.rowNumIsLastSticky ? styles.stickyLast : '',
                    ].filter(Boolean).join(' ')}
                    style={{ position: 'sticky', left: 0, zIndex: 3 }}
                  >
                    {(() => {
                      const hasActiveFilters =
                        Object.values(searches).some(v => v) ||
                        Object.values(multiFilters).some(arr => arr && arr.length > 0)
                      const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
                      const shortcutLabel = isMac ? '⌘⇧0' : 'Ctrl+Shift+0'
                      return (
                        <Tooltip
                          content={
                            <span className={styles.tooltipShortcutRow}>
                              <span>Clear filters</span>
                              <Kbd inverse>{shortcutLabel}</Kbd>
                            </span>
                          }
                          side="top"
                          align="start"
                        >
                          <button
                            type="button"
                            className={styles.clearFiltersBtn}
                            disabled={!hasActiveFilters}
                            aria-label="Clear filters"
                            aria-keyshortcuts={isMac ? 'Meta+Shift+0' : 'Control+Shift+0'}
                            onClick={() => { setSearches({}); setMultiFilters({}) }}
                          >
                            <svg width="18" height="18" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
                              <path d="M791-55 55-791l57-57 736 736-57 57ZM633-440l-80-80h167v80h-87ZM433-640l-80-80h487v80H433Zm-33 400v-80h160v80H400ZM240-440v-80h166v80H240ZM120-640v-80h86v80h-86Z"/>
                            </svg>
                          </button>
                        </Tooltip>
                      )
                    })()}
                  </th>
                )}
                {selectable && (
                  <th
                    className={[
                      styles.filterTh,
                      styles.checkboxTh,
                      styles.stickyCell,
                      stickyMeta.checkboxIsLastSticky ? styles.stickyLast : '',
                    ].filter(Boolean).join(' ')}
                    style={{ position: 'sticky', left: rowNumbers ? rowNumColWidth : 0, zIndex: 3 }}
                  >
                    <TableCheckbox
                      checked={allFilteredSelected}
                      indeterminate={someFilteredSelected}
                      onChange={toggleSelectAll}
                      ariaLabel="Select all rows"
                    />
                  </th>
                )}
                {orderedColumns.map(col => {
                  const isSticky = col.sticky && stickyMeta.map[col.key] !== undefined
                  const isLastSticky = col.key === stickyMeta.lastKey
                  return (
                    <th
                      key={col.key}
                      className={[
                        styles.filterTh,
                        col.sortable ? styles.sortable : '',
                        isSticky ? styles.stickyCell : '',
                        isLastSticky ? styles.stickyLast : '',
                      ].filter(Boolean).join(' ')}
                      style={isSticky ? { position: 'sticky', left: stickyMeta.map[col.key], zIndex: 3 } : undefined}
                    >
                      {(() => {
                        const ftype = columnFilterTypes.types[col.key]
                        if (!ftype) return null

                        if (ftype === 'multiselect' || ftype === 'bucket') {
                          const selArr = multiFilters[col.key] ?? []
                          const options = ftype === 'bucket'
                            ? columnFilterTypes.customOptions[col.key].map(o => ({ value: o.value, label: o.label }))
                            : (columnFilterTypes.distincts[col.key] ?? []).map(v => ({ value: v, label: v }))
                          return (
                            <div className={styles.filterMultiSelectWrap}>
                              <BufferedFilterMultiSelect
                                size={density === 'comfortable' ? 'lg' : 'md'}
                                options={options}
                                value={selArr}
                                onCommit={arr => setMultiFilters(prev => ({ ...prev, [col.key]: arr }))}
                              />
                            </div>
                          )
                        }

                        const isCalc = col.filterFormula && (filterModes[col.key] ?? 'find') === 'calculate'
                        const row = (
                          <div
                            className={styles.searchRow}
                            ref={el => { filterAnchorRefs.current[col.key] = el }}
                          >
                            <span className={styles.searchIconWrap}>
                              <Icon name={isCalc ? 'functions' : 'search'} size={16} />
                            </span>
                            <input
                              ref={el => { filterInputRefs.current[col.key] = el }}
                              type="text"
                              className={styles.searchInput}
                              placeholder={(filterModes[col.key] ?? 'find') === 'calculate' ? 'Add formula' : 'Filter…'}
                              value={searches[col.key] ?? ''}
                              onClick={col.filterFormula ? () => {
                                const anchor = filterAnchorRefs.current[col.key]
                                if (anchor) {
                                  const r = anchor.getBoundingClientRect()
                                  setFilterDropdownPos({ top: r.bottom + 4, left: r.left, width: r.width })
                                }
                                const currentMode = filterModes[col.key] ?? 'find'
                                setActiveModeDropdownIdx(MODE_OPTIONS.findIndex(o => o.value === currentMode))
                                setOpenFilterDropdown(col.key)
                              } : undefined}
                              onChange={e => {
                                const val = e.target.value
                                setSearches(prev => ({ ...prev, [col.key]: val }))
                                if (col.filterFormula && val.length >= 2) setOpenFilterDropdown(null)
                                if (col.filterFormula && (filterModes[col.key] ?? 'find') === 'calculate') {
                                  const cursor = e.target.selectionStart ?? val.length
                                  const before = val.slice(0, cursor)
                                  const wordMatch = before.match(/[a-zA-Z_][a-zA-Z0-9_]*$/)
                                  const currentWord = wordMatch ? wordMatch[0] : ''
                                  if (currentWord.length >= 2) {
                                    const matches = columns.filter(c =>
                                      c.type === 'number' &&
                                      c.key.toLowerCase().startsWith(currentWord.toLowerCase()) &&
                                      c.key.toLowerCase() !== currentWord.toLowerCase()
                                    )
                                    if (matches.length) {
                                      const anchor = filterAnchorRefs.current[col.key]
                                      if (anchor) {
                                        const r = anchor.getBoundingClientRect()
                                        setFormulaSuggestionPos({ top: r.bottom + 4, left: r.left, width: r.width })
                                      }
                                      setFormulaSuggestions(matches)
                                      setFormulaSuggestionMeta({ colKey: col.key, wordStart: cursor - currentWord.length, wordEnd: cursor })
                                      setActiveSuggestionIdx(0)
                                      return
                                    }
                                  }
                                  setFormulaSuggestions([])
                                  setFormulaSuggestionMeta(null)
                                  setActiveSuggestionIdx(0)
                                }
                              }}
                              onKeyDown={col.filterFormula ? e => {
                                if (openFilterDropdown === col.key) {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    setActiveModeDropdownIdx(i => Math.min(i + 1, MODE_OPTIONS.length - 1))
                                    return
                                  }
                                  if (e.key === 'ArrowUp') {
                                    e.preventDefault()
                                    setActiveModeDropdownIdx(i => Math.max(i - 1, 0))
                                    return
                                  }
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const selected = MODE_OPTIONS[activeModeDropdownIdx]
                                    if (selected) {
                                      setFilterModes(prev => ({ ...prev, [col.key]: selected.value }))
                                      setSearches(prev => ({ ...prev, [col.key]: '' }))
                                    }
                                    setOpenFilterDropdown(null)
                                    return
                                  }
                                  if (e.key === 'Escape') {
                                    setOpenFilterDropdown(null)
                                    return
                                  }
                                }
                                if ((filterModes[col.key] ?? 'find') !== 'calculate') return
                                const hasSuggestions = formulaSuggestions.length > 0 && formulaSuggestionMeta?.colKey === col.key
                                if (hasSuggestions) {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    setActiveSuggestionIdx(i => Math.min(i + 1, formulaSuggestions.length - 1))
                                    return
                                  }
                                  if (e.key === 'ArrowUp') {
                                    e.preventDefault()
                                    setActiveSuggestionIdx(i => Math.max(i - 1, 0))
                                    return
                                  }
                                  if (e.key === 'Enter' || e.key === 'Tab') {
                                    e.preventDefault()
                                    applyFormulaSuggestion(formulaSuggestions[activeSuggestionIdx]?.key ?? formulaSuggestions[0].key)
                                    return
                                  }
                                  if (e.key === 'Escape') {
                                    setFormulaSuggestions([])
                                    setFormulaSuggestionMeta(null)
                                    setActiveSuggestionIdx(0)
                                    return
                                  }
                                }
                                handleOperatorKeyDown(e, col.key)
                              } : undefined}
                              aria-label={`Filter ${col.label}`}
                            />
                            {searches[col.key] && (
                              <button
                                className={styles.clearBtn}
                                onClick={() => setSearches(prev => ({ ...prev, [col.key]: '' }))}
                                aria-label="Clear filter"
                              >
                                <Icon name="close" size={16} />
                              </button>
                            )}
                            {col.filterFormula && (
                              <FilterModeDropdown
                                open={openFilterDropdown === col.key}
                                pos={filterDropdownPos}
                                mode={filterModes[col.key] ?? 'find'}
                                activeIdx={activeModeDropdownIdx}
                                onSelect={mode => {
                                  setFilterModes(prev => ({ ...prev, [col.key]: mode }))
                                  setSearches(prev => ({ ...prev, [col.key]: '' }))
                                }}
                                onClose={() => setOpenFilterDropdown(null)}
                              />
                            )}
                            <FormulaAutocomplete
                              suggestions={formulaSuggestionMeta?.colKey === col.key ? formulaSuggestions : []}
                              pos={formulaSuggestionPos}
                              onSelect={applyFormulaSuggestion}
                              onClose={() => { setFormulaSuggestions([]); setFormulaSuggestionMeta(null); setActiveSuggestionIdx(0) }}
                              activeIdx={activeSuggestionIdx}
                            />
                          </div>
                        )
                        return isCalc ? (
                          <Tooltip
                            block
                            title="Formula filter"
                            content="Write an expression to narrow down rows — use comparison and math operators (>, <, =, +, −). You can reference other numeric columns by name, and matching names will autocomplete as you type."
                            side="top"
                            align="start"
                          >
                            {row}
                          </Tooltip>
                        ) : row
                      })()}
                    </th>
                  )
                })}
                {!stretch && <th className={`${styles.spacerTh} ${styles.spacerThFilter}`} />}
              </tr>
            )}
            </thead>
          </table>
        </div>
        <div
          className={[styles.bodyScroll, filteredRows.length === 0 ? styles.bodyScrollEmpty : ''].filter(Boolean).join(' ')}
          ref={tableWrapperRef}
          onScroll={handleBodyScroll}
          onCopy={handleTableCopy}
        >
          {filteredRows.length === 0 && (
            <div className={styles.emptyOverlay}>
              <Icon name="search_off" size={40} style={{ color: 'var(--color-grey-400)' }} />
              <p className={styles.emptyTitle}>No results found</p>
              <p className={styles.emptySubtitle}>Try adjusting or clearing your filters.</p>
              <button
                className={styles.emptyResetBtn}
                style={{ pointerEvents: 'auto' }}
                onClick={() => { setSearches({}); setMultiFilters({}) }}
              >
                Clear filters
              </button>
            </div>
          )}
          {filteredRows.length > 0 && <table
            className={styles.table}
            data-density={density}
            data-zebra={zebra || undefined}
            role="grid"
            aria-label={caption}
            aria-rowcount={filteredRows.length + 1}
            aria-colcount={orderedColumns.length}
            style={stretch ? { width: '100%' } : { minWidth: totalTableWidth }}
          >
            {colgroup}
            <tbody>
              {filteredRows.length > 0 && isPaging && (
                <>
                {Array.from({ length: pagedRows.length || pageSize }).map((_, ri) => (
                  <tr key={`sk-${ri}`} className={styles.tr} aria-hidden="true">
                    {rowNumbers && (
                      <td
                        className={[styles.td, styles.rowNumTd, styles.stickyCell, stickyMeta.rowNumIsLastSticky ? styles.stickyLast : ''].filter(Boolean).join(' ')}
                        style={{ position: 'sticky', left: 0, zIndex: 1 }}
                      >
                        <Skeleton width={20} height={12} />
                      </td>
                    )}
                    {selectable && (
                      <td
                        className={[styles.td, styles.checkboxTd, styles.stickyCell, stickyMeta.checkboxIsLastSticky ? styles.stickyLast : ''].filter(Boolean).join(' ')}
                        style={{ position: 'sticky', left: rowNumbers ? rowNumColWidth : 0, zIndex: 1 }}
                      >
                        <Skeleton width={16} height={16} radius={4} />
                      </td>
                    )}
                    {orderedColumns.map((col, ci) => {
                      const isSticky = col.sticky && stickyMeta.map[col.key] !== undefined
                      const isLastSticky = col.key === stickyMeta.lastKey
                      const widths = ['70%', '55%', '80%', '45%', '65%', '50%']
                      const w = widths[(ri + ci) % widths.length]
                      const hasAvatar = !!(col.avatar || col.avatarSrc)
                      const avatarSize = density === 'compact' ? 20 : density === 'comfortable' ? 36 : 28
                      return (
                        <td
                          key={col.key}
                          className={[
                            styles.td,
                            col.wrap ? styles.cellWrap : styles.cellEllipsis,
                            isSticky ? styles.stickyCell : '',
                            isSticky && isLastSticky ? styles.stickyLast : '',
                          ].filter(Boolean).join(' ')}
                          style={isSticky ? { position: 'sticky', left: stickyMeta.map[col.key], zIndex: 1 } : undefined}
                        >
                          {hasAvatar ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%' }}>
                              <Skeleton width={avatarSize} height={avatarSize} circle />
                              <Skeleton width={w} height={12} />
                            </span>
                          ) : (
                            <Skeleton width={w} height={12} />
                          )}
                        </td>
                      )
                    })}
                    {!stretch && <td className={styles.spacerTd} />}
                  </tr>
                ))}
                </>
              )}
              {filteredRows.length > 0 && !isPaging && (
                <>
                {pagedRows.map((row, ri) => {
                  const origIdx = rows.indexOf(row)
                  const isSelected = selected.has(origIdx)
                  return (
                    <tr
                      key={ri}
                      className={[styles.tr, isSelected ? styles.trSelected : ''].filter(Boolean).join(' ')}
                      aria-selected={selectable ? isSelected : undefined}
                    >
                      {rowNumbers && (
                        <td
                          className={[
                            styles.td,
                            styles.rowNumTd,
                            styles.stickyCell,
                            stickyMeta.rowNumIsLastSticky ? styles.stickyLast : '',
                          ].filter(Boolean).join(' ')}
                          style={{ position: 'sticky', left: 0, zIndex: 1 }}
                        >
                          {(page - 1) * pageSize + ri + 1}
                        </td>
                      )}
                      {selectable && (
                        <td
                          className={[
                            styles.td,
                            styles.checkboxTd,
                            styles.stickyCell,
                            stickyMeta.checkboxIsLastSticky ? styles.stickyLast : '',
                          ].filter(Boolean).join(' ')}
                          style={{ position: 'sticky', left: rowNumbers ? rowNumColWidth : 0, zIndex: 1 }}
                          ref={el => { cellRefs.current[`${ri}-0`] = el }}
                          tabIndex={focused.row === ri && focused.col === 0 ? 0 : -1}
                          role="gridcell"
                          aria-rowindex={ri + 2}
                          aria-colindex={1}
                          onFocus={() => setFocused({ row: ri, col: 0 })}
                          onKeyDown={e => handleCellKeyDown(e, ri, 0)}
                        >
                          <TableCheckbox
                            checked={isSelected}
                            onChange={() => toggleSelectRow(origIdx)}
                            ariaLabel={`Select row ${ri + 1}`}
                          />
                        </td>
                      )}

                      {orderedColumns.map((col, ci) => {
                        const focusCI = ci + (selectable ? 1 : 0)
                        const isFocused = focused.row === ri && focused.col === focusCI
                        const raw = row[col.key]
                        const displayed = col.render ? col.render(raw, row, density) : (raw ?? '—')
                        const secondaryRaw = col.secondary ? row[col.secondary] : null
                        const align = resolveAlign(col)
                        const isSticky = col.sticky && stickyMeta.map[col.key] !== undefined
                        const isLastSticky = col.key === stickyMeta.lastKey

                        return (
                          <td
                            key={col.key}
                            ref={el => { cellRefs.current[`${ri}-${focusCI}`] = el }}
                            className={[
                              styles.td,
                              col.wrap ? styles.cellWrap : styles.cellEllipsis,
                              col.editable ? styles.editable : '',
                              col.type === 'number' ? styles.typeNumber : '',
                              col.sortable ? styles.sortableCol : '',
                              col.avatar ? styles.avatarCol : '',
                              align === 'center' ? styles.alignCenter : '',
                              isSticky ? styles.stickyCell : '',
                              isLastSticky ? styles.stickyLast : '',
                            ].filter(Boolean).join(' ')}
                            tabIndex={isFocused ? 0 : -1}
                            role="gridcell"
                            aria-rowindex={ri + 2}
                            aria-colindex={ci + 1}
                            aria-readonly={!col.editable || undefined}
                            onFocus={() => setFocused({ row: ri, col: focusCI })}
                            onKeyDown={e => handleCellKeyDown(e, ri, focusCI)}
                            onClick={col.editable ? () => openEdit(ri, ci) : undefined}
                            title={!col.wrap && !col.render && raw != null ? String(raw) : undefined}
                            style={isSticky ? { position: 'sticky', left: stickyMeta.map[col.key], zIndex: 1 } : undefined}
                          >
                            {(col.icon || col.avatar) ? (
                              <span className={styles.cellWithIcon}>
                                {col.avatar && (() => {
                                  const name = row[col.avatar] ?? ''
                                  const src = col.avatarSrc ? row[col.avatarSrc] : null
                                  const showImage = !!src
                                  const sizeClass = density === 'comfortable'
                                    ? styles.cellAvatarLg
                                    : styles.cellAvatarMd
                                  return (
                                    <span className={[styles.cellAvatar, sizeClass].join(' ')} aria-hidden="true">
                                      {showImage
                                        ? <img src={src} alt="" className={styles.cellAvatarImg} />
                                        : initials(name)
                                      }
                                    </span>
                                  )
                                })()}
                                {col.icon && !col.avatar && (
                                  <span className={[styles.cellIcon, density === 'comfortable' ? styles.cellIconLg : ''].filter(Boolean).join(' ')} aria-hidden="true">
                                    {col.icon(raw, row)}
                                  </span>
                                )}
                                <span className={styles.cellTextStack}>
                                  <span className={styles.cellPrimary}>{displayed}</span>
                                  {secondaryRaw && (
                                    <span className={styles.cellSecondary}>{secondaryRaw}</span>
                                  )}
                                </span>
                              </span>
                            ) : (
                              <>
                                <span className={styles.cellPrimary}>{displayed}</span>
                                {secondaryRaw && (
                                  <span className={styles.cellSecondary}>{secondaryRaw}</span>
                                )}
                              </>
                            )}
                          </td>
                        )
                      })}
                      {!stretch && <td className={styles.spacerTd} />}
                    </tr>
                  )
                })}
                </>
              )}
            </tbody>
          </table>}
        </div>

      </div>

      <div className={styles.footer}>
        <span className={styles.footerCount}>
          {(() => {
            const hasActiveFilters =
              Object.values(searches).some(v => v) ||
              Object.values(multiFilters).some(arr => arr && arr.length > 0)
            if (selected.size > 0) {
              return `${selected.size} of ${filteredRows.length} selected`
            }
            if (hasActiveFilters) {
              return `${filteredRows.length} item${filteredRows.length !== 1 ? 's' : ''} shown`
            }
            return `${rows.length} total item${rows.length !== 1 ? 's' : ''}`
          })()}
        </span>
        <Pagination page={page} total={totalPages} onChange={setPage} size="md" />
      </div>

      <Modal
        open={editModal !== null}
        onClose={closeEdit}
        title={editModal ? `Edit ${editModal.label}` : ''}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeEdit}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save changes</Button>
          </>
        }
      >
        {editModal && (
          <Textarea
            hideLabel
            label={editModal.label}
            inputRef={editInputRef}
            value={editDraft}
            rows={4}
            resize="vertical"
            onChange={e => setEditDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                saveEdit()
              }
            }}
          />
        )}
      </Modal>
    </div>
  )
}
