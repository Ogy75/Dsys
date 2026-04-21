import { useState, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import styles from './Tabs.module.css'

/* ── TabGroup component ───────────────────────── */
export function Tabs({ tabs = [], defaultValue, value: controlledValue, onChange, children }) {
  const count = tabs.length
  if (count < 2 || count > 12) {
    console.warn(`Tabs: requires between 2 and 12 tabs, got ${count}`)
  }

  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs.find(t => !t.disabled)?.value)
  const active = controlledValue !== undefined ? controlledValue : internalValue

  function handleSelect(val) {
    if (controlledValue === undefined) setInternalValue(val)
    onChange?.(val)
  }

  const activeTab = tabs.find(t => t.value === active)

  return (
    <div className={styles.root}>
      <TabBar tabs={tabs} active={active} onSelect={handleSelect} />
      {activeTab?.content && (
        <div className={styles.panel} role="tabpanel">
          {activeTab.content}
        </div>
      )}
      {children}
    </div>
  )
}

export function TabBar({ tabs = [], active, onSelect }) {
  return (
    <div className={styles.bar} role="tablist">
      {tabs.map(tab => (
        <TabButton
          key={tab.value}
          label={tab.label}
          isActive={tab.value === active}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onSelect?.(tab.value)}
        />
      ))}
    </div>
  )
}

function TabButton({ label, isActive, disabled, onClick }) {
  const [ripples, setRipples] = useState([])
  const nextId = useRef(0)

  function handleClick(e) {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const id = nextId.current++
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)
    onClick?.()
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      className={[
        styles.tab,
        isActive ? styles.tabActive : '',
        disabled ? styles.tabDisabled : '',
      ].join(' ')}
      onClick={handleClick}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className={[styles.ripple, isActive ? styles.rippleActive : ''].join(' ')}
          style={{ left: r.x, top: r.y }}
        />
      ))}
      {label}
    </button>
  )
}

/* ── Page ─────────────────────────────────────── */
const basicTabs = [
  { value: 'overview', label: 'Overview', content: <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Overview content goes here. This is the first tab panel.</p> },
  { value: 'details', label: 'Details', content: <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Details content. Switch between tabs to see panel changes.</p> },
  { value: 'history', label: 'History', content: <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>History of changes and activity logs.</p> },
  { value: 'settings', label: 'Settings', content: <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Settings and configuration options.</p> },
]

const withDisabledTabs = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived', disabled: true },
  { value: 'deleted', label: 'Deleted', disabled: true },
]

const manyTabs = [
  { value: '1', label: 'Design' },
  { value: '2', label: 'Prototype' },
  { value: '3', label: 'Inspect' },
  { value: '4', label: 'Assets' },
  { value: '5', label: 'Plugins' },
  { value: '6', label: 'Settings' },
]

const twoTabs = [
  { value: 'on', label: 'Enabled' },
  { value: 'off', label: 'Disabled' },
]

const usageCode = `import { Tabs } from '@/components/Tabs'

const tabs = [
  {
    value: 'overview',
    label: 'Overview',
    content: <p>Overview content</p>,
  },
  {
    value: 'details',
    label: 'Details',
    content: <p>Details content</p>,
  },
  {
    value: 'archived',
    label: 'Archived',
    disabled: true,
  },
]

// Uncontrolled
<Tabs tabs={tabs} defaultValue="overview" />

// Controlled
<Tabs tabs={tabs} value={active} onChange={setActive} />`

const tabProps = [
  { name: 'tabs', type: 'Tab[]', default: '[]', description: 'Array of tab definitions. Min 2, max 12.' },
  { name: 'defaultValue', type: 'string', default: 'first enabled tab', description: 'Initially selected tab (uncontrolled).' },
  { name: 'value', type: 'string', default: '—', description: 'Controlled active tab value.' },
  { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called when the active tab changes.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content rendered below the tab bar.' },
]

const tabShape = [
  { name: 'value', type: 'string', default: '—', description: 'Unique identifier.' },
  { name: 'label', type: 'string', default: '—', description: 'Tab button text.' },
  { name: 'content', type: 'ReactNode', default: '—', description: 'Panel content shown when this tab is active.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents selection.' },
]

export default function TabsPage() {
  const [controlled, setControlled] = useState('2')

  return (
    <div>
      <PageHeader
        title="Tabs"
        description="Pill-shaped tab bar for switching between views. Min 2, max 12 tabs. Supports disabled tabs and controlled or uncontrolled selection."
      />

      <Section title="Default (4 tabs with content)">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
          <Tabs tabs={basicTabs} defaultValue="overview" />
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="With disabled tabs">
        <DemoCanvas>
          <Tabs tabs={withDisabledTabs} defaultValue="active" />
        </DemoCanvas>
      </Section>

      <Section title="Minimum — 2 tabs">
        <DemoCanvas>
          <Tabs tabs={twoTabs} defaultValue="on" />
        </DemoCanvas>
      </Section>

      <Section title="6 tabs">
        <DemoCanvas>
          <Tabs tabs={manyTabs} defaultValue="1" />
        </DemoCanvas>
      </Section>

      <Section title="Controlled">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Tabs tabs={manyTabs} value={controlled} onChange={setControlled} />
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Active: <code style={{ fontSize: 12, background: 'var(--color-gray-100)', padding: '1px 6px', borderRadius: 4 }}>{controlled}</code>
          </p>
        </DemoCanvas>
      </Section>

      <Section title="Tab button states">
        <DemoCanvas>
          <TabBar
            tabs={[
              { value: 'a', label: 'Default' },
              { value: 'b', label: 'Active' },
              { value: 'c', label: 'Disabled', disabled: true },
            ]}
            active="b"
            onSelect={() => {}}
          />
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Tabs props</h3>
        <PropsTable props={tabProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Tab object shape</h3>
        <PropsTable props={tabShape} />
      </UsageSection>
    </div>
  )
}
