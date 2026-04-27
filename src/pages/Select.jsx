import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import styles from './Select.module.css'
import { Button } from './Button'
import { Dropdown } from '../components/Dropdown'
import { Icon } from '../components/Icon'

/* ── Icon set (20×20) ──────────────────────────── */
const ICON_NAMES = ['person', 'favorite', 'star', 'home', 'mail', 'bookmark', 'settings', 'grid_view']

const ICONS_20 = ICON_NAMES.map(name => <Icon key={name} name={name} size={20} />)

function icon20(i) { return ICONS_20[i % ICONS_20.length] }

function ChevronIcon({ open }) {
  return <Icon name="keyboard_arrow_down" size={16} className={[styles.chevron, open ? styles.chevronOpen : ''].filter(Boolean).join(' ')} />
}

function ChevronIconDisabled() {
  return <Icon name="keyboard_arrow_down" size={16} style={{ color: '#cccccc' }} className={styles.chevron} />
}

/* ── Single Select ────────────────────────────── */
export function Select({ label, required, placeholder = 'Select…', options = [], disabled = false, size = 'lg', error, value, onChange, searchable = false, wrap = false }) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div className={styles.field}>
      {label && (
        <div className={styles.labelRow}>
          <span className={[styles.label, disabled ? styles.labelDisabled : ''].join(' ')}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <div className={styles.controlStack}>
        <Dropdown
          className={styles.controlWrap}
          open={open}
          onOpenChange={setOpen}
          items={options}
          value={value}
          onChange={onChange}
          disabled={disabled}
          searchable={searchable}
          wrap={wrap}
          trigger={
            <button
              type="button"
              className={[styles.trigger, styles[size], open ? styles.triggerOpen : '', disabled ? styles.triggerDisabled : '', error ? styles.triggerError : ''].filter(Boolean).join(' ')}
              disabled={disabled}
              aria-invalid={!!error}
            >
              <span className={[styles.triggerText, !selected ? styles.placeholder : '', disabled ? styles.triggerTextDisabled : ''].filter(Boolean).join(' ')}>
                {selected ? selected.label : placeholder}
              </span>
              {disabled ? <ChevronIconDisabled /> : <ChevronIcon open={open} />}
            </button>
          }
        />
        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
    </div>
  )
}

/* ── Multi Select ─────────────────────────────── */
export function MultiSelect({ label, required, placeholder = 'Select…', options = [], disabled = false, size = 'lg', error, value = [], onChange, searchable = false, wrap = false, portal = false, className }) {
  const [open, setOpen] = useState(false)

  const triggerLabel = value.length === 0
    ? placeholder
    : value.length === 1
      ? options.find(o => o.value === value[0])?.label
      : `${value.length} items selected`

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && (
        <div className={styles.labelRow}>
          <span className={[styles.label, disabled ? styles.labelDisabled : ''].join(' ')}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <div className={styles.controlStack}>
        <Dropdown
          className={styles.controlWrap}
          open={open}
          onOpenChange={setOpen}
          items={options}
          value={value}
          onChange={onChange}
          disabled={disabled}
          searchable={searchable}
          wrap={wrap}
          multiselect
          portal={portal}
          trigger={
            <button
              type="button"
              className={[styles.trigger, styles[size], open ? styles.triggerOpen : '', disabled ? styles.triggerDisabled : '', error ? styles.triggerError : ''].filter(Boolean).join(' ')}
              disabled={disabled}
              aria-invalid={!!error}
              aria-multiselectable="true"
            >
              <span className={[styles.triggerText, value.length === 0 ? styles.placeholder : '', disabled ? styles.triggerTextDisabled : ''].filter(Boolean).join(' ')}>
                {triggerLabel}
              </span>
              {disabled ? <ChevronIconDisabled /> : <ChevronIcon open={open} />}
            </button>
          }
        />
        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────── */
const sampleOptions = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ops', label: 'Operations', disabled: true },
  { value: 'erp-supply-chain', label: 'Enterprise Resource Planning and Supply Chain Optimisation' },
]

const iconOptions = [
  { value: 'design', label: 'Design', icon: icon20(0) },
  { value: 'engineering', label: 'Engineering', icon: icon20(1) },
  { value: 'product', label: 'Product', icon: icon20(2) },
  { value: 'marketing', label: 'Marketing', icon: icon20(3) },
  { value: 'ops', label: 'Operations', icon: icon20(4), disabled: true },
  { value: 'erp-supply-chain', label: 'Enterprise Resource Planning and Supply Chain Optimisation', icon: icon20(5) },
]

const multiOptions = Array.from({ length: 30 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}))

const singleCode = `import { Select } from '@/components/Select'

const [value, setValue] = useState('')

<Select
  label="Department"
  required
  placeholder="Select department…"
  options={[
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'ops', label: 'Operations', disabled: true },
  ]}
  value={value}
  onChange={setValue}
/>`

const multiCode = `import { MultiSelect } from '@/components/Select'

const [values, setValues] = useState([])

<MultiSelect
  label="Teams"
  required
  placeholder="Select teams…"
  options={options}
  value={values}
  onChange={setValues}
/>`

const searchableCode = `<Select
  label="Department"
  searchable
  placeholder="Select department…"
  options={options}
  value={value}
  onChange={setValue}
/>

<MultiSelect
  label="Teams"
  searchable
  placeholder="Select teams…"
  options={options}
  value={values}
  onChange={setValues}
/>`

const selectProps = [
  { name: 'size', type: "'lg' | 'md'", default: "'lg'", description: 'LG: 40px trigger height. MD: 32px trigger height.' },
  { name: 'label', type: 'string', default: '—', description: 'Label above the trigger. Manrope SemiBold 14px.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Shows a red asterisk next to the label.' },
  { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Shown when no value is selected.' },
  { name: 'options', type: '{ value, label, icon?, disabled? }[]', default: '[]', description: 'List of options. icon is an optional 20×20 ReactNode shown left of the label.' },
  { name: 'value', type: 'string', default: '—', description: 'Controlled selected value (Select) or array of values (MultiSelect).' },
  { name: 'onChange', type: '(value) => void', default: '—', description: 'Called with the new value on selection.' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a find input at the top of the dropdown. Filters options by label. Search clears on close.' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allows option labels to wrap to multiple lines instead of truncating. Useful for long option text.' },
  { name: 'error', type: 'string', default: '—', description: 'Error message. Shows red border and red right-aligned message below.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire select.' },
]

function ErrorToggle({ on, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
      <span style={{ fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)' }}>Error state:</span>
      <Button size="sm" variant={on ? 'primary' : 'secondary'} onClick={onToggle}>
        {on ? 'On' : 'Off'}
      </Button>
    </div>
  )
}

export default function SelectPage() {
  const [single, setSingle] = useState('')
  const [singleDisabled] = useState('design')
  const [singleIcon, setSingleIcon] = useState('')
  const [singleSearch, setSingleSearch] = useState('')
  const [singleSearchIcon, setSingleSearchIcon] = useState('')
  const [multi, setMulti] = useState([])
  const [multiIcon, setMultiIcon] = useState([])
  const [multiSearch, setMultiSearch] = useState([])
  const [multiSearchIcon, setMultiSearchIcon] = useState([])
  const [errorLg, setErrorLg] = useState(true)
  const [errorMd, setErrorMd] = useState(true)
  const [wrapSingle, setWrapSingle] = useState('')
  const [wrapMulti, setWrapMulti] = useState([])

  return (
    <div>
      <PageHeader
        title="Select"
        description="Custom select with single and multi-select modes. Supports required labels, disabled state, per-item disabled options, icons, and searchable filtering."
      />

      <Section title="Single Select — LG (40px)">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Default</p>
            <Select label="Label" required size="lg" placeholder="Select…" options={sampleOptions} value={single} onChange={setSingle} />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Disabled</p>
            <Select label="Label" required size="lg" options={sampleOptions} value={singleDisabled} disabled />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Error</p>
            <Select label="Label" required size="lg" placeholder="Select…" options={sampleOptions} value="" error={errorLg ? 'Please select an option' : undefined} onChange={() => {}} />
            <ErrorToggle on={errorLg} onToggle={() => setErrorLg(e => !e)} />
          </div>
        </DemoCanvas>
        <CodeBlock code={singleCode} language="jsx" />
      </Section>

      <Section title="Single Select — MD (32px)">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Default</p>
            <Select label="Label" required size="md" placeholder="Select…" options={sampleOptions} value={single} onChange={setSingle} />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Disabled</p>
            <Select label="Label" required size="md" options={sampleOptions} value={singleDisabled} disabled />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Error</p>
            <Select label="Label" required size="md" placeholder="Select…" options={sampleOptions} value="" error={errorMd ? 'Please select an option' : undefined} onChange={() => {}} />
            <ErrorToggle on={errorMd} onToggle={() => setErrorMd(e => !e)} />
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Multi Select">
        <DemoCanvas style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 300 }}>
            <MultiSelect label="Label" required placeholder="Select items…" options={multiOptions} value={multi} onChange={setMulti} />
          </div>
        </DemoCanvas>
        <CodeBlock code={multiCode} language="jsx" />
      </Section>

      <Section title="Single Select — with icons">
        <DemoCanvas style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 300 }}>
            <Select label="Label" required placeholder="Select…" options={iconOptions} value={singleIcon} onChange={setSingleIcon} />
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Multi Select — with icons">
        <DemoCanvas style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 300 }}>
            <MultiSelect label="Label" required placeholder="Select items…" options={iconOptions} value={multiIcon} onChange={setMultiIcon} />
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Searchable — Single Select">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>No icons</p>
            <Select label="Label" required searchable placeholder="Select…" options={sampleOptions} value={singleSearch} onChange={setSingleSearch} />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>With icons</p>
            <Select label="Label" required searchable placeholder="Select…" options={iconOptions} value={singleSearchIcon} onChange={setSingleSearchIcon} />
          </div>
        </DemoCanvas>
        <CodeBlock code={searchableCode} language="jsx" />
      </Section>

      <Section title="Searchable — Multi Select">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>No icons</p>
            <MultiSelect label="Label" required searchable placeholder="Select items…" options={multiOptions} value={multiSearch} onChange={setMultiSearch} />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>With icons</p>
            <MultiSelect label="Label" required searchable placeholder="Select items…" options={iconOptions} value={multiSearchIcon} onChange={setMultiSearchIcon} />
          </div>
        </DemoCanvas>
      </Section>

      <Section
        title="Wrap"
        description="Pass wrap to allow option labels to break across multiple lines instead of truncating. Useful when option text is long and truncation would lose important context."
      >
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Single</p>
            <Select label="Label" placeholder="Select…" options={sampleOptions} value={wrapSingle} onChange={setWrapSingle} wrap />
          </div>
          <div style={{ width: 300 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Multi</p>
            <MultiSelect label="Label" placeholder="Select items…" options={iconOptions} value={wrapMulti} onChange={setWrapMulti} wrap />
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Dropdown item states">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0, padding: 0, overflow: 'hidden', maxWidth: 300 }}>
          <div className={styles.itemPreview}>
            <span>Default</span><span className={styles.itemPreviewHint}>#ffffff bg, Grey 600 text (#4d4d4d)</span>
          </div>
          <div className={[styles.itemPreview, styles.itemPreviewHover].join(' ')}>
            <span>Hover</span><span className={styles.itemPreviewHint}>Grey 100 bg (#f2f2f2)</span>
          </div>
          <div className={[styles.itemPreview, styles.itemPreviewActive].join(' ')}>
            <span>Active / Selected</span><span className={styles.itemPreviewHint}>Grey 700 bg (#333333), white text</span>
          </div>
          <div className={[styles.itemPreview, styles.itemPreviewDisabled].join(' ')}>
            <span>Disabled</span><span className={styles.itemPreviewHint}>40% opacity, cursor not-allowed</span>
          </div>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Props (Select & MultiSelect)</h3>
        <PropsTable props={selectProps} />
      </UsageSection>
    </div>
  )
}
