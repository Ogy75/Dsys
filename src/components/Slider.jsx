import { useRef, useCallback, useState, useEffect } from 'react'
import styles from './Slider.module.css'

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

function valueToPct(value, min, max) {
  return ((value - min) / (max - min)) * 100
}

function pctToValue(pct, min, max, step) {
  const raw = min + (pct / 100) * (max - min)
  const stepped = Math.round((raw - min) / step) * step + min
  return clamp(stepped, min, max)
}

function getTrackPct(e, trackEl) {
  const rect = trackEl.getBoundingClientRect()
  return clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
}

function Thumb({ value, pct, disabled }) {
  return (
    <div
      className={[styles.thumb, disabled ? styles.thumbDisabled : ''].filter(Boolean).join(' ')}
      style={{ left: `${pct}%` }}
    >
      <div className={[styles.tooltip, disabled ? styles.tooltipDisabled : ''].filter(Boolean).join(' ')}>
        {value}
      </div>
      <div className={[styles.circle, disabled ? styles.circleDisabled : ''].filter(Boolean).join(' ')} />
    </div>
  )
}

function SliderInput({ value, min, max, disabled, onChange }) {
  const [text, setText] = useState(String(value))

  useEffect(() => { setText(String(value)) }, [value])

  function commit() {
    const num = Number(text)
    if (!isNaN(num) && text.trim() !== '') {
      onChange(clamp(num, min, max))
    } else {
      setText(String(value))
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      className={[styles.inputBox, disabled ? styles.inputBoxDisabled : ''].filter(Boolean).join(' ')}
      value={text}
      disabled={disabled}
      onChange={e => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') { commit(); e.target.blur() } }}
    />
  )
}

/* ── Single Slider ──────────────────────────────── */
export function Slider({
  min = 0,
  max = 100,
  value = 0,
  onChange,
  step = 1,
  disabled = false,
  showInput = true,
}) {
  const trackRef = useRef(null)

  const startDrag = useCallback((e) => {
    if (disabled) return
    e.preventDefault()

    function update(e) {
      const pct = getTrackPct(e, trackRef.current)
      onChange?.(pctToValue(pct, min, max, step))
    }

    update(e)

    function onMove(e) { update(e) }
    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [disabled, min, max, step, onChange])

  const pct = valueToPct(value, min, max)

  return (
    <div className={styles.wrapper}>
      {showInput && <SliderInput value={value} min={min} max={max} disabled={disabled} onChange={v => onChange?.(v)} />}
      <div className={styles.root}>
        <div
          ref={trackRef}
          className={[styles.track, disabled ? styles.trackDisabled : ''].filter(Boolean).join(' ')}
          onPointerDown={startDrag}
        >
          <div
            className={[styles.fill, disabled ? styles.fillDisabled : ''].filter(Boolean).join(' ')}
            style={{ left: 0, width: `${pct}%` }}
          />
          <Thumb value={value} pct={pct} disabled={disabled} />
          <div
            className={[styles.dragZone, disabled ? styles.dragZoneDisabled : ''].filter(Boolean).join(' ')}
            style={{ left: `${pct}%` }}
            onPointerDown={(e) => { e.stopPropagation(); startDrag(e) }}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Range Slider ───────────────────────────────── */
export function RangeSlider({
  min = 0,
  max = 100,
  value = [20, 80],
  onChange,
  step = 1,
  disabled = false,
  showInput = true,
}) {
  const trackRef = useRef(null)
  const [low, high] = value

  const startDrag = useCallback((which, e) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()

    function update(e) {
      const pct = getTrackPct(e, trackRef.current)
      const next = pctToValue(pct, min, max, step)
      if (which === 'low') {
        onChange?.([clamp(next, min, high), high])
      } else {
        onChange?.([low, clamp(next, low, max)])
      }
    }

    update(e)

    function onMove(e) { update(e) }
    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [disabled, min, max, step, low, high, onChange])

  const handleTrackClick = useCallback((e) => {
    if (disabled) return
    e.preventDefault()
    const pct = getTrackPct(e, trackRef.current)
    const next = pctToValue(pct, min, max, step)
    const distLow = Math.abs(next - low)
    const distHigh = Math.abs(next - high)
    if (distLow <= distHigh) {
      onChange?.([clamp(next, min, high), high])
    } else {
      onChange?.([low, clamp(next, low, max)])
    }
  }, [disabled, min, max, step, low, high, onChange])

  const lowPct = valueToPct(low, min, max)
  const highPct = valueToPct(high, min, max)

  return (
    <div className={styles.wrapper}>
      {showInput && <SliderInput value={low} min={min} max={high} disabled={disabled} onChange={v => onChange?.([v, high])} />}
      <div className={styles.root}>
        <div
          ref={trackRef}
          className={[styles.track, disabled ? styles.trackDisabled : ''].filter(Boolean).join(' ')}
          onPointerDown={handleTrackClick}
        >
          <div
            className={[styles.fill, disabled ? styles.fillDisabled : ''].filter(Boolean).join(' ')}
            style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
          />
          <Thumb value={low} pct={lowPct} disabled={disabled} />
          <Thumb value={high} pct={highPct} disabled={disabled} />
          <div
            className={[styles.dragZone, disabled ? styles.dragZoneDisabled : ''].filter(Boolean).join(' ')}
            style={{ left: `${lowPct}%` }}
            onPointerDown={(e) => startDrag('low', e)}
          />
          <div
            className={[styles.dragZone, disabled ? styles.dragZoneDisabled : ''].filter(Boolean).join(' ')}
            style={{ left: `${highPct}%` }}
            onPointerDown={(e) => startDrag('high', e)}
          />
        </div>
      </div>
      {showInput && <SliderInput value={high} min={low} max={max} disabled={disabled} onChange={v => onChange?.([low, v])} />}
    </div>
  )
}
