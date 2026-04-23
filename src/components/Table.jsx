import { useState, useRef, useMemo, useEffect } from 'react'
import { Modal } from './Modal'
import { Textarea } from './Textarea'
import { Button } from '../pages/Button'
import { Pagination } from './Pagination'
import { Icon } from './Icon'
import { Skeleton } from './Skeleton'
import styles from './Table.module.css'

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
  density = 'default',
  zebra = false,
  pageSize = 10,
}) {
  const [rows, setRows] = useState(() => dataProp)
  useEffect(() => { setRows(dataProp) }, [dataProp])

  const [columnOrder, setColumnOrder] = useState(() => columns.map(c => c.key))
  const [colWidths, setColWidths] = useState(() =>
    Object.fromEntries(columns.map(c => {
      // overhead: padding (16+22) + drag handle (16) + sort icon+gap (22 if sortable)
      const overhead = 54 + 16 + (c.sortable ? 22 : 0)
      const labelMin = Math.ceil(c.label.length * 10 + overhead)
      return [c.key, Math.max(c.width ?? labelMin, labelMin, c.minWidth ?? 80)]
    }))
  )
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [searches, setSearches] = useState({})
  const [focused, setFocused] = useState({ row: 0, col: 0 })
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

  const orderedColumns = useMemo(
    () => columnOrder.map(key => columns.find(c => c.key === key)).filter(Boolean),
    [columnOrder, columns]
  )

  const hasSearch = orderedColumns.some(c => c.searchable)

  const totalTableWidth = useMemo(() =>
    (selectable ? checkboxColWidth : 0) +
    orderedColumns.reduce((sum, col) => sum + (colWidths[col.key] ?? 0), 0),
    [selectable, orderedColumns, colWidths]
  )

  const stickyMeta = useMemo(() => {
    const map = {}
    let left = selectable ? checkboxColWidth : 0
    let lastKey = null
    orderedColumns.forEach(col => {
      if (col.sticky) {
        map[col.key] = left
        left += colWidths[col.key]
        lastKey = col.key
      }
    })
    const checkboxIsLastSticky = selectable && lastKey === null
    return { map, lastKey, checkboxIsLastSticky, totalFrozenWidth: left }
  }, [orderedColumns, colWidths, selectable])

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
    const active = Object.entries(searches).filter(([, v]) => v)
    if (!active.length) return sortedRows
    return sortedRows.filter(row =>
      active.every(([k, q]) =>
        String(row[k] ?? '').toLowerCase().includes(q.toLowerCase())
      )
    )
  }, [sortedRows, searches])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page, pageSize])

  useEffect(() => {
    setPage(1)
    setFocused({ row: 0, col: 0 })
  }, [searches, sort.key, sort.dir])

  useEffect(() => {
    if (firstPageRenderRef.current) {
      firstPageRenderRef.current = false
      return
    }
    setIsPaging(true)
    const t = setTimeout(() => setIsPaging(false), 700)
    return () => clearTimeout(t)
  }, [page])

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
      const minW = columns.find(c => c.key === k)?.minWidth ?? 80
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
      if (prev.key !== colKey) return { key: colKey, dir: 'asc' }
      if (prev.dir === 'asc') return { key: colKey, dir: 'desc' }
      return { key: null, dir: 'asc' }
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
    filteredRows.length > 0 &&
    filteredRows.every(r => selected.has(rows.indexOf(r)))

  const someFilteredSelected =
    !allFilteredSelected &&
    filteredRows.some(r => selected.has(rows.indexOf(r)))

  function toggleSelectAll(e) {
    const next = new Set(selected)
    if (e.target.checked) {
      filteredRows.forEach(r => next.add(rows.indexOf(r)))
    } else {
      filteredRows.forEach(r => next.delete(rows.indexOf(r)))
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
      {selectable && <col style={{ width: checkboxColWidth }} />}
      {orderedColumns.map(col => (
        <col key={col.key} style={{ width: colWidths[col.key] }} />
      ))}
      <col />
    </colgroup>
  )

  return (
    <div className={[styles.container, fill ? styles.fill : ''].filter(Boolean).join(' ')}>
      <div className={[styles.tableWrapper, fill ? styles.fillWrapper : ''].filter(Boolean).join(' ')} style={maxHeight ? { height: maxHeight } : undefined}>
        <div className={styles.headerScroll} ref={headerScrollRef}>
          <table
            className={styles.table}
            data-density={density}
            role="presentation"
            style={{ minWidth: totalTableWidth }}
          >
            {colgroup}
            <thead>
            {/* ── Label row ── */}
            <tr>
              {selectable && (
                <th
                  className={[
                    styles.th,
                    styles.checkboxTh,
                    styles.stickyCell,
                    stickyMeta.checkboxIsLastSticky ? styles.stickyLast : '',
                  ].filter(Boolean).join(' ')}
                  style={{ position: 'sticky', left: 0, zIndex: 3 }}
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
                    draggable={!isSticky}
                    onDragStart={isSticky ? undefined : e => handleDragStart(e, col.key)}
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
                      {!isSticky && (
                        <span
                          className={styles.dragHandle}
                          onMouseDown={e => e.stopPropagation()}
                        >
                          <GripIcon />
                        </span>
                      )}
                    </div>

                    <div
                      className={styles.resizeHandle}
                      draggable={false}
                      onMouseDown={e => startResize(e, col.key)}
                    />
                  </th>
                )
              })}
              <th className={styles.spacerTh} />
            </tr>

            {/* ── Filter row ── */}
            {hasSearch && (
              <tr>
                {selectable && (
                  <th
                    className={[
                      styles.filterTh,
                      styles.checkboxTh,
                      styles.stickyCell,
                      stickyMeta.checkboxIsLastSticky ? styles.stickyLast : '',
                    ].filter(Boolean).join(' ')}
                    style={{ position: 'sticky', left: 0, zIndex: 3 }}
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
                      {col.searchable ? (
                        <div className={styles.searchRow}>
                          <span className={styles.searchIconWrap}><Icon name="search" size={16} /></span>
                          <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Filter…"
                            value={searches[col.key] ?? ''}
                            onChange={e => setSearches(prev => ({ ...prev, [col.key]: e.target.value }))}
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
                        </div>
                      ) : null}
                    </th>
                  )
                })}
                <th className={styles.spacerTh} />
              </tr>
            )}
            </thead>
          </table>
        </div>
        <div
          className={[styles.bodyScroll, filteredRows.length === 0 ? styles.bodyScrollEmpty : ''].filter(Boolean).join(' ')}
          ref={tableWrapperRef}
          onScroll={handleBodyScroll}
        >
          {filteredRows.length === 0 && (
            <div className={styles.emptyOverlay}>
              <Icon name="search_off" size={40} style={{ color: 'var(--color-grey-400)' }} />
              <p className={styles.emptyTitle}>No results found</p>
              <p className={styles.emptySubtitle}>Try adjusting or clearing your filters.</p>
              <button
                className={styles.emptyResetBtn}
                style={{ pointerEvents: 'auto' }}
                onClick={() => setSearches({})}
              >
                Clear filters
              </button>
            </div>
          )}
          <table
            className={styles.table}
            data-density={density}
            data-zebra={zebra || undefined}
            role="grid"
            aria-rowcount={filteredRows.length + 1}
            aria-colcount={orderedColumns.length}
            style={{ minWidth: totalTableWidth }}
          >
            {colgroup}
            <tbody>
              {filteredRows.length > 0 && isPaging && (
                <>
                {Array.from({ length: pagedRows.length || pageSize }).map((_, ri) => (
                  <tr key={`sk-${ri}`} className={styles.tr} aria-hidden="true">
                    {selectable && (
                      <td
                        className={[styles.td, styles.checkboxTd, styles.stickyCell, stickyMeta.checkboxIsLastSticky ? styles.stickyLast : ''].filter(Boolean).join(' ')}
                        style={{ position: 'sticky', left: 0, zIndex: 1 }}
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
                    <td className={styles.spacerTd} />
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
                      {selectable && (
                        <td
                          className={[
                            styles.td,
                            styles.checkboxTd,
                            styles.stickyCell,
                            stickyMeta.checkboxIsLastSticky ? styles.stickyLast : '',
                          ].filter(Boolean).join(' ')}
                          style={{ position: 'sticky', left: 0, zIndex: 1 }}
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
                      <td className={styles.spacerTd} />
                    </tr>
                  )
                })}
                </>
              )}
            </tbody>
          </table>
        </div>

      </div>

      <div className={styles.footer}>
        <span className={styles.footerCount}>
          {selected.size > 0
            ? `${selected.size} of ${filteredRows.length} selected`
            : `${filteredRows.length} item${filteredRows.length !== 1 ? 's' : ''}`
          }
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
