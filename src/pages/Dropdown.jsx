import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Dropdown } from '../components/Dropdown'
import { Button } from './Button'
import { Badge } from '../components/Badge'
import { Icon } from '../components/Icon'

/* ── Icon set (24×24) ──────────────────────────── */
const ICON_NAMES = ['person', 'favorite', 'star', 'home', 'mail', 'bookmark', 'settings', 'group', 'account_circle', 'grid_view']

const ICONS_24 = ICON_NAMES.map(name => <Icon key={name} name={name} size={24} />)

function icon24(i) { return ICONS_24[i % ICONS_24.length] }

/* ── Sample data ──────────────────────────────────── */
const BADGE_VARIANTS = ['purple', 'red', 'green', 'yellow', 'blue', 'cyan', 'lime']

const LABELS = [
  'Design', 'Engineering', 'Product', 'Marketing', 'Operations',
  'Finance', 'Legal', 'People', 'Sales', 'Customer Success',
  'Data Science', 'Infrastructure', 'Security', 'Analytics', 'Research',
  'Enterprise Resource Planning and Supply Chain Optimisation',
]

const plainItems = LABELS.map((label, i) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
  ...(i === LABELS.length - 2 ? { disabled: true } : {}),
}))

const iconItems = LABELS.map((label, i) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
  icon: icon24(i),
  ...(i === LABELS.length - 2 ? { disabled: true } : {}),
}))

const badgeItems = LABELS.map((label, i) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
  badge: <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]} size="sm">Badge</Badge>,
  ...(i === LABELS.length - 2 ? { disabled: true } : {}),
}))

const iconBadgeItems = LABELS.map((label, i) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
  icon: icon24(i),
  badge: <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]} size="sm">Badge</Badge>,
  ...(i === LABELS.length - 2 ? { disabled: true } : {}),
}))

const sectionItems = [
  { type: 'section', label: 'Creative' },
  ...['Design', 'Brand', 'Content', 'UX Research', 'Motion'].map((label, i) => ({
    value: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    icon: icon24(i),
    badge: <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]} size="sm">Badge</Badge>,
  })),
  { type: 'section', label: 'Technical' },
  ...['Engineering', 'Infrastructure', 'Security', 'Data Science', 'Analytics'].map((label, i) => ({
    value: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    icon: icon24(i + 5),
    badge: <Badge variant={BADGE_VARIANTS[(i + 2) % BADGE_VARIANTS.length]} size="sm">Badge</Badge>,
  })),
  { type: 'section', label: 'Business' },
  ...['Finance', 'Legal', 'People', 'Sales'].map((label, i) => ({
    value: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    icon: icon24(i + 6),
  })),
  { type: 'divider' },
  { value: 'customer-success', label: 'Customer Success', icon: icon24(3), disabled: true },
  { value: 'erp-supply-chain', label: 'Enterprise Resource Planning and Supply Chain Optimisation', icon: icon24(9) },
]

/* ── Code snippets ────────────────────────────────── */
const singleCode = `import { Dropdown } from '@/components/Dropdown'
import { Button } from '@/components/Button'

const [value, setValue] = useState('')

<Dropdown
  trigger={<Button variant="secondary">Open menu</Button>}
  items={[
    { value: 'design', label: 'Design', icon: <Icon />, badge: <Badge variant="purple" size="sm">Badge</Badge> },
    { value: 'engineering', label: 'Engineering' },
    { value: 'ops', label: 'Operations', disabled: true },
  ]}
  value={value}
  onChange={setValue}
/>`

const multiCode = `<Dropdown
  trigger={<Button variant="secondary">Open menu</Button>}
  items={items}
  value={values}
  onChange={setValues}
  multiselect
/>`

const sectionsCode = `<Dropdown
  trigger={<Button variant="secondary">Open menu</Button>}
  items={[
    { type: 'section', label: 'Section title' },
    { value: 'a', label: 'Item A', icon: <Icon /> },
    { value: 'b', label: 'Item B' },
    { type: 'section', label: 'Another section' },
    { value: 'c', label: 'Item C' },
  ]}
  value={value}
  onChange={setValue}
/>`

const scrollCode = `<Dropdown
  trigger={<Button variant="secondary">Open menu</Button>}
  items={longItems}
  value={value}
  onChange={setValue}
  maxHeight={200}
/>`

const wrapCode = `<Dropdown
  trigger={<Button variant="secondary">Open menu</Button>}
  items={items}
  value={value}
  onChange={setValue}
  wrap
/>`

const dropdownProps = [
  { name: 'trigger', type: 'ReactElement', default: '—', description: 'Any element (Button, Tag, Chip…) that opens the dropdown on click. onClick, aria-expanded, and aria-haspopup are injected automatically.' },
  { name: 'items', type: 'DropdownItem[]', default: '[]', description: 'Array of items, section headers ({ type: "section", label }), or dividers ({ type: "divider" }).' },
  { name: 'value', type: 'string | string[]', default: '—', description: 'Controlled selection. Single value for default; string[] for multiselect.' },
  { name: 'onChange', type: '(value) => void', default: '—', description: 'Called with new value on selection (string for single, string[] for multi).' },
  { name: 'multiselect', type: 'boolean', default: 'false', description: 'Enables multi-selection. Shows Select all / Clear ghost button. Items stay open after selection.' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a find input at the top. Grey bg default, white bg when active/typing.' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allows item labels to wrap to multiple lines instead of truncating. Line-height is set to 1 for a tight appearance.' },
  { name: 'maxHeight', type: 'number', default: '280', description: 'Max height in px of the scrollable list. Panel chrome (search, header) stays fixed.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents the panel from opening.' },
  { name: 'open', type: 'boolean', default: '—', description: 'Controlled open state. Pair with onOpenChange for fully controlled usage.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', description: 'Called when open state changes (controlled mode).' },
]

const itemProps = [
  { name: 'value', type: 'string', default: '—', description: 'Unique identifier for the item.' },
  { name: 'label', type: 'string', default: '—', description: 'Display text. 16px Medium, color #4d4d4d.' },
  { name: 'icon', type: 'ReactNode', default: '—', description: 'Optional 24×24 icon rendered left of the label. Inherits colour (grey default, near-white when active).' },
  { name: 'badge', type: 'ReactNode', default: '—', description: 'Optional badge rendered at the trailing edge. Pass any <Badge> variant.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents selection. Shown at 40% opacity.' },
  { name: 'type', type: '"section" | "divider"', default: '—', description: 'Set type="section" with a label for a section title, or type="divider" for a horizontal rule.' },
]

function DemoLabel({ children }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
      {children}
    </p>
  )
}

export default function DropdownPage() {
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [s3, setS3] = useState('')
  const [s4, setS4] = useState('')
  const [m1, setM1] = useState([])
  const [m2, setM2] = useState([])
  const [m3, setM3] = useState([])
  const [m4, setM4] = useState([])
  const [sec, setSec] = useState('')
  const [wrap1, setWrap1] = useState('')
  const [wrap2, setWrap2] = useState('')
  const [scroll1, setScroll1] = useState('')
  const [scroll2, setScroll2] = useState([])
  const [srch1, setSrch1] = useState('')
  const [srch2, setSrch2] = useState([])

  return (
    <div>
      <PageHeader
        title="Dropdown"
        description="A composable dropdown panel attached to any trigger element — Button, Tag, Chip, or custom. Supports single and multi-selection, optional search, section titles, dividers, per-item icons and badge slots."
      />

      <Section title="Single select">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div>
            <DemoLabel>No icon, no badge</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={plainItems} value={s1} onChange={setS1} />
          </div>
          <div>
            <DemoLabel>With icon</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconItems} value={s2} onChange={setS2} />
          </div>
          <div>
            <DemoLabel>With badge</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={badgeItems} value={s3} onChange={setS3} />
          </div>
          <div>
            <DemoLabel>Icon + badge</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconBadgeItems} value={s4} onChange={setS4} />
          </div>
        </DemoCanvas>
        <CodeBlock code={singleCode} language="jsx" />
      </Section>

      <Section title="Multi select — Select all / Clear">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div>
            <DemoLabel>No icon, no badge</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={plainItems} value={m1} onChange={setM1} multiselect />
          </div>
          <div>
            <DemoLabel>With icon</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconItems} value={m2} onChange={setM2} multiselect />
          </div>
          <div>
            <DemoLabel>With badge</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={badgeItems} value={m3} onChange={setM3} multiselect />
          </div>
          <div>
            <DemoLabel>Icon + badge</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconBadgeItems} value={m4} onChange={setM4} multiselect />
          </div>
        </DemoCanvas>
        <CodeBlock code={multiCode} language="jsx" />
      </Section>

      <Section title="Section titles and dividers">
        <DemoCanvas>
          <div>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={sectionItems} value={sec} onChange={setSec} />
          </div>
        </DemoCanvas>
        <CodeBlock code={sectionsCode} language="jsx" />
      </Section>

      <Section title="Searchable">
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div>
            <DemoLabel>Single</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconBadgeItems} value={srch1} onChange={setSrch1} searchable />
          </div>
          <div>
            <DemoLabel>Multi</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconBadgeItems} value={srch2} onChange={setSrch2} searchable multiselect />
          </div>
        </DemoCanvas>
      </Section>

      <Section
        title="Wrap"
        description="Pass wrap to allow item labels to break across multiple lines. Line-height is 1 for a tight appearance. Useful when option text is long and truncation would lose important context."
      >
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div>
            <DemoLabel>No icon</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={plainItems} value={wrap1} onChange={setWrap1} wrap />
          </div>
          <div>
            <DemoLabel>With icon</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconItems} value={wrap2} onChange={setWrap2} wrap />
          </div>
        </DemoCanvas>
        <CodeBlock code={wrapCode} language="jsx" />
      </Section>

      <Section
        title="Scroll"
        description="Max height is capped at 30% of the viewport. Only the list scrolls — search bar and multiselect header stay fixed."
      >
        <DemoCanvas style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          <div>
            <DemoLabel>Single (maxHeight=200)</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconBadgeItems} value={scroll1} onChange={setScroll1} />
          </div>
          <div>
            <DemoLabel>Multi</DemoLabel>
            <Dropdown trigger={<Button variant="secondary">Open menu</Button>} items={iconBadgeItems} value={scroll2} onChange={setScroll2} multiselect />
          </div>
        </DemoCanvas>
        <CodeBlock code={scrollCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Dropdown props</h3>
        <PropsTable props={dropdownProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 12px' }}>Item shape</h3>
        <PropsTable props={itemProps} />
      </UsageSection>
    </div>
  )
}
