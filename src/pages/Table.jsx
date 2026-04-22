import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { SegmentIndicator } from '../components/SegmentIndicator'

/* ── Sparkline ──────────────────────────────────────────────── */

function Sparkline({ data }) {
  const w = 88, h = 30, pad = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  })
  const polyline = pts.join(' ')
  const area = `${pad},${h - pad} ${polyline} ${w - pad},${h - pad}`
  const up = data[data.length - 1] >= data[0]
  const stroke = up ? '#16a34a' : '#dc2626'
  const fill = up ? 'rgba(22,163,74,0.10)' : 'rgba(220,38,38,0.10)'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: 'block' }}>
      <polygon points={area} fill={fill} />
      <polyline points={polyline} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Status badge ───────────────────────────────────────────── */

const STATUS_VARIANT = {
  Active:     'green',
  Inactive:   'gray',
  Pending:    'yellow',
  'On Leave': 'blue',
}

/* ── Column definitions ─────────────────────────────────────── */

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}

function IconApartment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zm-6 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm4 4h-2v-2h2v2zm0-4h-2V9h2v2z"/>
    </svg>
  )
}

function IconPublic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )
}

const LOCATION_ICONS = {
  'New York':   <IconApartment />,
  'London':     <IconApartment />,
  'São Paulo':  <IconPublic />,
  'Seoul':      <IconPublic />,
  'Berlin':     <IconApartment />,
  'Singapore':  <IconPublic />,
  'Tokyo':      <IconPublic />,
  'Lisbon':     <IconPin />,
  'Paris':      <IconApartment />,
  'Toronto':    <IconApartment />,
  'Prague':     <IconHome />,
  'Milan':      <IconPin />,
}

const COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    searchable: true,
    secondary: 'email',
    avatar: 'name',        // name field → initials fallback
    avatarSrc: 'avatarUrl', // image URL field (shown in default + comfortable)
    sticky: true,
    width: 220,
    minWidth: 140,
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    searchable: true,
    editable: true,
    width: 180,
    minWidth: 100,
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    searchable: true,
    width: 140,
    minWidth: 100,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 120,
    minWidth: 90,
    render: (value, _row, density) => {
      const size = density === 'comfortable' ? 'lg' : density === 'compact' ? 'sm' : 'md'
      return <Badge variant={STATUS_VARIANT[value] ?? 'gray'} size={size}>{value}</Badge>
    },
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    searchable: true,
    editable: true,
    icon: (_value, row) => LOCATION_ICONS[row.location] ?? <IconPin />,
    width: 140,
    minWidth: 100,
  },
  {
    key: 'tasks',
    label: 'Tasks',
    sortable: true,
    type: 'number',       // auto right-aligned + tabular numerals
    width: 80,
    minWidth: 60,
  },
  {
    key: 'performance',
    label: 'Performance',
    sortable: true,
    width: 130,
    minWidth: 100,
    render: (value) => <SegmentIndicator value={value} total={5} />,
  },
  {
    key: 'trend',
    label: 'Trend',
    width: 130,
    minWidth: 100,
    render: (value) => <Sparkline data={value} />,
  },
  {
    key: 'notes',
    label: 'Notes',
    wrap: true,
    editable: true,
    width: 300,
    minWidth: 140,
  },
]

const INITIAL_DATA = [
  { name: 'Alice Johnson',  email: 'alice@company.com',    avatarUrl: 'https://i.pravatar.cc/80?u=alice@company.com',    role: 'Product Manager',     department: 'Product',     status: 'Active',   location: 'New York',  tasks: 12, performance: 5, trend: [4,6,5,8,7,9,8,11,10,13,12,14], notes: 'Leading Q2 roadmap planning. Focused on user research and feature prioritisation across mobile and web.' },
  { name: 'Ben Carter',     email: 'ben@company.com',      avatarUrl: 'https://i.pravatar.cc/80?u=ben@company.com',      role: 'Senior Engineer',     department: 'Engineering', status: 'Active',   location: 'London',    tasks: 8,  performance: 4, trend: [10,9,11,8,10,7,9,8,10,9,8,7],  notes: 'Working on the new authentication service.' },
  { name: 'Clara Mendes',   email: 'clara@company.com',    avatarUrl: 'https://i.pravatar.cc/80?u=clara@company.com',    role: 'UX Designer',         department: 'Design',      status: 'On Leave', location: 'São Paulo', tasks: 3,  performance: 3, trend: [8,7,9,6,8,5,7,4,6,3,5,2],     notes: 'On parental leave until end of Q3.' },
  { name: 'Daniel Park',    email: 'daniel@company.com',   avatarUrl: 'https://i.pravatar.cc/80?u=daniel@company.com',   role: 'Data Analyst',        department: 'Analytics',   status: 'Active',   location: 'Seoul',     tasks: 6,  performance: 3, trend: [5,6,4,7,5,8,6,9,7,10,8,11],    notes: '' },
  { name: 'Eva Schmidt',    email: 'eva@company.com',      avatarUrl: 'https://i.pravatar.cc/80?u=eva@company.com',      role: 'Engineering Manager', department: 'Engineering', status: 'Active',   location: 'Berlin',    tasks: 19, performance: 5, trend: [6,8,7,10,9,12,11,14,13,16,15,18], notes: 'Hiring two senior engineers. Interview process underway.' },
  { name: 'Frank Liu',      email: 'frank@company.com',    avatarUrl: 'https://i.pravatar.cc/80?u=frank@company.com',    role: 'Backend Engineer',    department: 'Engineering', status: 'Pending',  location: 'Singapore', tasks: 2,  performance: 1, trend: [12,10,13,9,11,7,9,5,7,4,6,3],  notes: 'Onboarding in progress. Start date confirmed.' },
  { name: 'Grace Kim',      email: 'grace@company.com',    avatarUrl: 'https://i.pravatar.cc/80?u=grace@company.com',    role: 'Marketing Lead',      department: 'Marketing',   status: 'Active',   location: 'Tokyo',     tasks: 9,  performance: 4, trend: [3,5,4,7,6,8,7,10,9,11,10,13],  notes: 'Running the Q3 product launch campaign.' },
  { name: 'Hugo Silva',     email: 'hugo@company.com',     avatarUrl: 'https://i.pravatar.cc/80?u=hugo@company.com',     role: 'DevOps Engineer',     department: 'Engineering', status: 'Inactive', location: 'Lisbon',    tasks: 0,  performance: 2, trend: [9,8,10,7,9,6,8,5,7,4,6,3],     notes: 'Contract ended. Potential rehire in Q4.' },
  { name: 'Isabelle Roy',   email: 'isabelle@company.com', avatarUrl: 'https://i.pravatar.cc/80?u=isabelle@company.com', role: 'Customer Success',    department: 'Support',     status: 'Active',   location: 'Paris',     tasks: 14, performance: 4, trend: [5,4,6,5,8,7,9,8,11,10,12,14],  notes: '' },
  { name: 'James Wang',     email: 'james@company.com',    avatarUrl: 'https://i.pravatar.cc/80?u=james@company.com',    role: 'Frontend Engineer',   department: 'Engineering', status: 'Active',   location: 'Toronto',   tasks: 11, performance: 5, trend: [7,9,8,11,10,13,12,14,13,15,14,16], notes: 'Building the new component library.' },
  { name: 'Kira Novak',     email: 'kira@company.com',     avatarUrl: 'https://i.pravatar.cc/80?u=kira@company.com',     role: 'Product Designer',    department: 'Design',      status: 'Active',   location: 'Prague',    tasks: 7,  performance: 3, trend: [6,8,7,6,8,7,9,8,7,9,8,7],      notes: 'Redesigning the onboarding flow. Collaborating with Alice on research synthesis.' },
  { name: 'Luca Ferretti',  email: 'luca@company.com',     avatarUrl: 'https://i.pravatar.cc/80?u=luca@company.com',     role: 'Sales Engineer',      department: 'Sales',       status: 'Pending',  location: 'Milan',     tasks: 4,  performance: 2, trend: [11,9,12,8,10,6,9,5,8,4,7,3],    notes: 'Pending background check completion.' },
]

/* ── Demo page ──────────────────────────────────────────────── */

const USAGE_CODE = `import { Table } from './components/Table'

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    searchable: true,
    secondary: 'email',   // shows email as secondary text below name
  },
  {
    key: 'tasks',
    label: 'Tasks',
    type: 'number',       // right-aligned, tabular numerals
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value, _row, density) => {
      const size = density === 'comfortable' ? 'lg' : density === 'compact' ? 'sm' : 'md'
      return <Badge variant={STATUS_VARIANT[value] ?? 'gray'} size={size}>{value}</Badge>
    },
  },
  {
    key: 'notes',
    label: 'Notes',
    wrap: true,
    editable: true,
  },
]

<Table
  columns={columns}
  data={data}
  selectable
  density="default"          // 'compact' | 'default' | 'comfortable'
  maxHeight={440}
  stickyHeader
  onSelectionChange={(rows) => console.log(rows)}
  onRowChange={(index, key, value) => console.log(index, key, value)}
/>`

const TABLE_PROPS = [
  { name: 'columns',           type: 'ColDef[]',               default: '—',           description: 'Column configuration array.' },
  { name: 'data',              type: 'object[]',               default: '—',           description: 'Row data.' },
  { name: 'selectable',        type: 'boolean',                default: 'false',       description: 'Adds a checkbox column for multi-row selection.' },
  { name: 'density',           type: "'compact'|'default'|'comfortable'", default: "'default'", description: 'Controls row height and cell padding.' },
  { name: 'maxHeight',         type: 'number',                 default: 'undefined',   description: 'Max height (px) of the body scroll area. Header always stays visible above.' },
  { name: 'onSelectionChange', type: '(rows: object[]) => void', default: 'undefined', description: 'Called with the current selected rows array.' },
  { name: 'onRowChange',       type: '(index, key, value) => void', default: 'undefined', description: 'Called when an editable cell is saved.' },
  { name: 'pageSize',          type: 'number',                      default: '10',        description: 'Rows per page. Footer always shows item count and pagination.' },
  { name: 'zebra',            type: 'boolean',                     default: 'false',     description: 'Alternates odd row backgrounds with grey-50 for easier row scanning.' },
]

const COLDEF_PROPS = [
  { name: 'key',       type: 'string',                    default: '—',         description: 'Maps to the property name in your data objects.' },
  { name: 'label',     type: 'string',                    default: '—',         description: 'Column header text.' },
  { name: 'sortable',  type: 'boolean',                   default: 'false',     description: 'Enables click-to-sort. Icon appears on header hover; persists when active.' },
  { name: 'searchable',type: 'boolean',                   default: 'false',     description: 'Shows a real-time filter input beneath the header label.' },
  { name: 'editable',  type: 'boolean',                   default: 'false',     description: 'Click or Enter to edit the cell value in a modal.' },
  { name: 'wrap',      type: 'boolean',                   default: 'false',     description: 'false = single line with ellipsis. true = multiline.' },
  { name: 'type',      type: "'text'|'number'",           default: "'text'",    description: "number auto right-aligns and uses tabular numerals." },
  { name: 'align',     type: "'left'|'right'|'center'",  default: "'left'",    description: 'Override column alignment. type: number implies right.' },
  { name: 'secondary', type: 'string',                    default: 'undefined', description: 'A second data key rendered as smaller secondary text below the primary value.' },
  { name: 'width',     type: 'number',                    default: '160',       description: 'Initial column width in pixels.' },
  { name: 'minWidth',  type: 'number',                    default: '80',        description: 'Minimum column width when resizing.' },
  { name: 'render',    type: '(value, row, density) => ReactNode', default: 'undefined', description: "Custom cell renderer. density is 'compact' | 'default' | 'comfortable' — use it to scale embedded components." },
  { name: 'avatar',    type: 'string',                    default: 'undefined', description: 'Data key used to derive initials for the avatar fallback (always shown in compact; used as fallback in default/comfortable).' },
  { name: 'avatarSrc', type: 'string',                    default: 'undefined', description: 'Data key containing an image URL. Shown at all densities when present; falls back to initials if absent.' },
  { name: 'icon',      type: '(value, row) => ReactNode', default: 'undefined', description: 'Returns a 20×20 icon rendered before the cell text. Cannot be combined with avatar.' },
  { name: 'sticky',   type: 'boolean',                   default: 'false',     description: 'Freezes the column to the left edge while the table scrolls horizontally.' },
]

export default function TablePage() {
  const [selection, setSelection] = useState([])
  const [lastChange, setLastChange] = useState(null)
  const [density, setDensity] = useState('default')

  return (
    <div>
      <PageHeader
        title="Table"
        description="Data table implementing UX best practices: horizontal-only borders, uppercase headers, primary + secondary cell content, number alignment, row density, and multi-row selection."
      />

      {/* Main demo */}
      <Section
        title="Full-featured table"
        description="Headers use uppercase labels for visual hierarchy. Sort icon appears on hover, persists when active. Editable columns (Role, Location, Notes) show a pencil on hover. Name column shows email as secondary text."
      >
        {/* Density toggle */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          {['compact', 'default', 'comfortable'].map(d => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: density === d ? 'var(--color-brand)' : 'var(--color-border)',
                background: density === d ? 'var(--color-brand)' : 'transparent',
                color: density === d ? '#fff' : 'var(--color-text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                textTransform: 'capitalize',
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <DemoCanvas style={{ padding: 'var(--space-4)', display: 'block', background: 'var(--color-bg-page)' }}>
          <Table
            columns={COLUMNS}
            data={INITIAL_DATA}
            selectable
            density={density}
            maxHeight={440}
            pageSize={8}
            onSelectionChange={setSelection}
            onRowChange={(row, key, value) => setLastChange({ row, key, value })}
          />
        </DemoCanvas>

        {/* Status strip */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {selection.length > 0 && (
            <span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{selection.length}</strong> rows selected
            </span>
          )}
          {lastChange && (
            <span>
              Last edit — row {lastChange.row + 1},{' '}
              <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--color-gray-100)', padding: '1px 4px', borderRadius: 3 }}>
                {lastChange.key}
              </code>{' '}
              → "{lastChange.value}"
            </span>
          )}
        </div>
      </Section>

      <Section title="Zebra stripes" description="Alternates odd row backgrounds with grey-50 to improve row scanning in dense tables.">
        <DemoCanvas style={{ padding: 'var(--space-4)', display: 'block', background: 'var(--color-bg-page)' }}>
          <Table
            columns={COLUMNS.slice(0, 5)}
            data={INITIAL_DATA}
            selectable
            zebra
            maxHeight={440}
            pageSize={8}
          />
        </DemoCanvas>
        <CodeBlock code={`<Table columns={columns} data={data} selectable zebra />`} language="jsx" />
      </Section>

      <UsageSection>
        <CodeBlock code={USAGE_CODE} language="jsx" />
      </UsageSection>

      <Section title="Table props">
        <PropsTable props={TABLE_PROPS} />
      </Section>

      <Section title="ColDef props">
        <PropsTable props={COLDEF_PROPS} />
      </Section>
    </div>
  )
}
