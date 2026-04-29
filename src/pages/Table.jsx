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
  const stroke = up ? 'var(--color-green-ap-600)' : 'var(--color-red-600)'
  const fill = up
    ? 'color-mix(in srgb, var(--color-green-ap-600) 10%, transparent)'
    : 'color-mix(in srgb, var(--color-red-600) 10%, transparent)'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: 'block' }}>
      <polygon points={area} style={{ fill }} />
      <polyline points={polyline} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke }} />
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
    filterSelect: true,
    width: 180,
    minWidth: 100,
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    filterSelect: true,
    width: 140,
    minWidth: 100,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterSelect: true,
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
    key: 'salary',
    label: 'Salary',
    sortable: true,
    searchable: true,
    filterFormula: true,
    defaultFilterMode: 'calculate',
    type: 'number',
    width: 130,
    minWidth: 100,
    render: (value) => value != null
      ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—',
  },
  {
    key: 'tax',
    label: 'Tax',
    sortable: true,
    type: 'number',
    width: 110,
    minWidth: 80,
    render: (value) => value != null
      ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—',
  },
  {
    key: 'bonus',
    label: 'Bonus',
    sortable: true,
    type: 'number',
    width: 110,
    minWidth: 80,
    render: (value) => value != null
      ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—',
  },
  {
    key: 'tasks',
    label: 'Tasks',
    sortable: true,
    type: 'number',
    width: 80,
    minWidth: 60,
  },
  {
    key: 'performance',
    label: 'Performance',
    sortable: true,
    filterSelect: true,
    width: 130,
    minWidth: 100,
    filterOptions: [
      { value: 'low',    label: 'Low',    match: v => v <= 2 },
      { value: 'medium', label: 'Medium', match: v => v === 3 },
      { value: 'high',   label: 'High',   match: v => v >= 4 },
    ],
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

const SEED_ROWS = [
  { name: 'Alice Johnson',  email: 'alice@company.com',    avatarUrl: null,    role: 'Product Manager',     department: 'Product',     status: 'Active',   location: 'New York',  salary: 95420.50,  tax: 21234.50,  bonus: 9500.00,  tasks: 12, performance: 5, trend: [4,6,5,8,7,9,8,11,10,13,12,14], notes: 'Leading Q2 roadmap planning. Focused on user research and feature prioritisation across mobile and web.' },
  { name: 'Ben Carter',     email: 'ben@company.com',      avatarUrl: null,      role: 'Senior Engineer',     department: 'Engineering', status: 'Active',   location: 'London',    salary: 120750.00, tax: 28980.00,  bonus: 15000.00, tasks: 8,  performance: 4, trend: [10,9,11,8,10,7,9,8,10,9,8,7],  notes: 'Working on the new authentication service.' },
  { name: 'Clara Mendes',   email: 'clara@company.com',    avatarUrl: null,    role: 'UX Designer',         department: 'Design',      status: 'On Leave', location: 'São Paulo', salary: 84320.75,  tax: 18450.25,  bonus: 7500.00,  tasks: 3,  performance: 3, trend: [8,7,9,6,8,5,7,4,6,3,5,2],     notes: 'On parental leave until end of Q3.' },
  { name: 'Daniel Park',    email: 'daniel@company.com',   avatarUrl: null,   role: 'Data Analyst',        department: 'Analytics',   status: 'Active',   location: 'Seoul',     salary: 76500.00,  tax: 16320.00,  bonus: 5000.00,  tasks: 6,  performance: 3, trend: [5,6,4,7,5,8,6,9,7,10,8,11],    notes: '' },
  { name: 'Eva Schmidt',    email: 'eva@company.com',      avatarUrl: null,      role: 'Engineering Manager', department: 'Engineering', status: 'Active',   location: 'Berlin',    salary: 148200.25, tax: 37050.25,  bonus: 25000.00, tasks: 19, performance: 5, trend: [6,8,7,10,9,12,11,14,13,16,15,18], notes: 'Hiring two senior engineers. Interview process underway.' },
  { name: 'Frank Liu',      email: 'frank@company.com',    avatarUrl: null,    role: 'Backend Engineer',    department: 'Engineering', status: 'Pending',  location: 'Singapore', salary: 112000.00, tax: 26880.00,  bonus: 12000.00, tasks: 2,  performance: 1, trend: [12,10,13,9,11,7,9,5,7,4,6,3],  notes: 'Onboarding in progress. Start date confirmed.' },
  { name: 'Grace Kim',      email: 'grace@company.com',    avatarUrl: null,    role: 'Marketing Lead',      department: 'Marketing',   status: 'Active',   location: 'Tokyo',     salary: 91350.80,  tax: 20090.80,  bonus: 8500.00,  tasks: 9,  performance: 4, trend: [3,5,4,7,6,8,7,10,9,11,10,13],  notes: 'Running the Q3 product launch campaign.' },
  { name: 'Hugo Silva',     email: 'hugo@company.com',     avatarUrl: null,     role: 'DevOps Engineer',     department: 'Engineering', status: 'Inactive', location: 'Lisbon',    salary: 106750.00, tax: 24352.50,  bonus: 10000.00, tasks: 0,  performance: 2, trend: [9,8,10,7,9,6,8,5,7,4,6,3],     notes: 'Contract ended. Potential rehire in Q4.' },
  { name: 'Isabelle Roy',   email: 'isabelle@company.com', avatarUrl: null, role: 'Customer Success',    department: 'Support',     status: 'Active',   location: 'Paris',     salary: 71200.40,  tax: 14952.40,  bonus: 4500.00,  tasks: 14, performance: 4, trend: [5,4,6,5,8,7,9,8,11,10,12,14],  notes: '' },
  { name: 'James Wang',     email: 'james@company.com',    avatarUrl: null,    role: 'Frontend Engineer',   department: 'Engineering', status: 'Active',   location: 'Toronto',   salary: 118500.00, tax: 28440.00,  bonus: 14000.00, tasks: 11, performance: 5, trend: [7,9,8,11,10,13,12,14,13,15,14,16], notes: 'Building the new component library.' },
  { name: 'Kira Novak',     email: 'kira@company.com',     avatarUrl: null,     role: 'Product Designer',    department: 'Design',      status: 'Active',   location: 'Prague',    salary: 87650.20,  tax: 19083.20,  bonus: 8000.00,  tasks: 7,  performance: 3, trend: [6,8,7,6,8,7,9,8,7,9,8,7],      notes: 'Redesigning the onboarding flow. Collaborating with Alice on research synthesis.' },
  { name: 'Luca Ferretti',  email: 'luca@company.com',     avatarUrl: null,     role: 'Sales Engineer',      department: 'Sales',       status: 'Pending',  location: 'Milan',     salary: 98566.00,  tax: 22167.00,  bonus: 9800.00,  tasks: 4,  performance: 2, trend: [11,9,12,8,10,6,9,5,8,4,7,3],    notes: 'Pending background check completion.' },
]

const FIRST_NAMES = ['Mia','Noah','Olivia','Liam','Ava','Ethan','Sophia','Mason','Amelia','Logan','Charlotte','Lucas','Harper','Jack','Evelyn','Henry','Lily','Owen','Zoe','Leo','Nora','Finn','Ruby','Felix','Ivy','Milo','Iris','Hazel','Theo','Aria','Jasper','Chloe','Eli','Maya','Axel','Luna','Reid','Sadie','Kian','Freya','June','Rex','Nina','Jude','Vera','Enzo','Tess','Cass','Otis','Rose','Ronan','Willa','Bram','Piper','Dante','Elle','Cyrus','Remy','Wren','Kai','Odin','Eden','Soren','Clio','Arlo','Nova','Caleb','Anya','Quinn','Wade','Cora','Rhys','Stella','Emil','Pia','Magnus','Ines','Tobias','Livia','Dario','Saskia','Leon','Maja','Niko','Enya','Rafa','Esme','Bjorn','Lena','Cyril']
const LAST_NAMES = ['Adler','Bauer','Chen','Dubois','Ellis','Farkas','Garcia','Huang','Ibrahim','Jensen','Kowalski','Lindqvist','Martinez','Nakamura','Okafor','Petrov','Quinn','Rossi','Santos','Takeda','Uchida','Volkov','Weber','Xu','Yamada','Zahir','Andersen','Bianchi','Clarke','Dvorak','Ericsson','Fischer','Goncalves','Hofmann','Iglesias','Jansen','Khan','Larsen','Moretti','Novak']
const GEN_ROLES = ['Product Manager','Senior Engineer','UX Designer','Data Analyst','Engineering Manager','Backend Engineer','Marketing Lead','DevOps Engineer','Customer Success','Frontend Engineer','Product Designer','Sales Engineer']
const ROLE_TO_DEPT = {
  'Product Manager':'Product','Senior Engineer':'Engineering','UX Designer':'Design','Data Analyst':'Analytics',
  'Engineering Manager':'Engineering','Backend Engineer':'Engineering','Marketing Lead':'Marketing',
  'DevOps Engineer':'Engineering','Customer Success':'Support','Frontend Engineer':'Engineering',
  'Product Designer':'Design','Sales Engineer':'Sales',
}
const STATUSES = ['Active','Active','Active','Active','Pending','On Leave','Inactive']
const GEN_LOCATIONS = Object.keys(LOCATION_ICONS)
const NOTE_POOL = [
  '', '', 'Shipping Q3 deliverables.', 'Mentoring a new hire.',
  'Running customer interviews this week.', 'Cleaning up technical debt in the auth module.',
  'Leading a cross-team initiative.', 'Finalising the quarterly roadmap.',
  'Preparing the launch retrospective.', 'Rotating through on-call duty.',
]

function generatedRow(i) {
  const fn = FIRST_NAMES[i % FIRST_NAMES.length]
  const ln = LAST_NAMES[(i * 7 + 3) % LAST_NAMES.length]
  const name = `${fn} ${ln}`
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@company.com`
  const role = GEN_ROLES[i % GEN_ROLES.length]
  const department = ROLE_TO_DEPT[role]
  const status = STATUSES[i % STATUSES.length]
  const location = GEN_LOCATIONS[i % GEN_LOCATIONS.length]
  const salary = Math.round((62000 + ((i * 2777) % 95000)) * 100) / 100
  const tax = Math.round(salary * (0.18 + (i % 7) * 0.01) * 100) / 100
  // bonuses scale linearly from 0 up to above the highest salary (~170k)
  const bonus = Math.round((i / 137) * 170000 * 100) / 100
  const tasks = (i * 3) % 22
  const performance = ((i * 2) % 5) + 1
  const trend = Array.from({ length: 12 }, (_, t) => ((i + t * 3) % 14) + 2)
  const notes = NOTE_POOL[i % NOTE_POOL.length]
  return { name, email, avatarUrl: null, role, department, status, location, salary, tax, bonus, tasks, performance, trend, notes }
}

const INITIAL_DATA = [...SEED_ROWS, ...Array.from({ length: 150 - 12 }, (_, i) => generatedRow(i))]

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
  { name: 'pageSize',          type: 'number',                      default: '30',        description: 'Rows per page. Footer always shows item count and pagination.' },
  { name: 'zebra',            type: 'boolean',                     default: 'false',     description: 'Alternates odd row backgrounds with grey-50 for easier row scanning.' },
  { name: 'resizable',        type: 'boolean',                     default: 'true',      description: 'Enables the column resize handle. Set false for a locked layout.' },
  { name: 'reorderable',      type: 'boolean',                     default: 'true',      description: 'Enables drag-to-reorder of columns. Set false to lock column order.' },
  { name: 'stretch',          type: 'boolean',                     default: 'false',     description: 'Distributes columns evenly across the full table width instead of using fixed pixel widths.' },
  { name: 'rowNumbers',       type: 'boolean',                     default: 'false',     description: 'Prepends a sticky "Col No" column showing the row position (1-based, across pages).' },
]

const COLDEF_PROPS = [
  { name: 'key',       type: 'string',                    default: '—',         description: 'Maps to the property name in your data objects.' },
  { name: 'label',     type: 'string',                    default: '—',         description: 'Column header text.' },
  { name: 'sortable',  type: 'boolean',                   default: 'false',     description: 'Enables click-to-sort. Icon appears on header hover; persists when active.' },
  { name: 'searchable',     type: 'boolean', default: 'false', description: 'Shows a real-time find (substring match) input beneath the header label.' },
  { name: 'filterFormula',  type: 'boolean', default: 'false', description: 'Shows a Find / Calculate filter. Calculate mode accepts expressions: > 100, <= 5, = "active", != "x", between 1 and 10, contains text, starts text, ends text, empty, !empty.' },
  { name: 'defaultFilterMode', type: "'find'|'calculate'", default: "'find'", description: 'Initial mode for filterFormula columns.' },
  { name: 'filterSelect',   type: 'boolean', default: 'false', description: 'Shows a multiselect dropdown filter. Options are the column\'s distinct values, or use filterOptions to define custom buckets.' },
  { name: 'filterOptions',  type: '{value,label,match}[]', default: 'undefined', description: 'Custom filter buckets for filterSelect. match(rawValue, row) => boolean decides which rows pass each selected option.' },
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

const SIMPLE_COLUMNS = [
  { key: 'name',       label: 'Name' },
  { key: 'role',       label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'location',   label: 'Location' },
]

function SimpleTableDemo() {
  const [density, setDensity] = useState('default')
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        {['compact', 'default', 'comfortable'].map(d => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: density === d ? 'var(--color-grey-700)' : 'var(--color-border)',
              background: density === d ? 'var(--color-grey-700)' : 'transparent',
              color: density === d ? 'var(--color-white)' : 'var(--color-text-secondary)',
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
          columns={SIMPLE_COLUMNS}
          data={INITIAL_DATA.slice(0, 6)}
          density={density}
          resizable={false}
          reorderable={false}
          stretch
        />
      </DemoCanvas>
    </>
  )
}

export default function TablePage() {
  const [selection, setSelection] = useState([])
  const [lastChange, setLastChange] = useState(null)

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
        <DemoCanvas style={{ padding: 'var(--space-4)', display: 'block', background: 'var(--color-bg-page)' }}>
          <Table
            columns={COLUMNS}
            data={INITIAL_DATA}
            selectable
            rowNumbers
            maxHeight={440}
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

      <Section
        title="Simple table"
        description="The most basic table — no sorting, filtering, column resizing, drag-to-reorder, or selection. Only the row density (size) is configurable."
      >
        <SimpleTableDemo />
        <CodeBlock
          code={`const columns = [
  { key: 'name',       label: 'Name' },
  { key: 'role',       label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'location',   label: 'Location' },
]

<Table
  columns={columns}
  data={data}
  density="default"       // 'compact' | 'default' | 'comfortable'
  resizable={false}
  reorderable={false}
  stretch
/>`}
          language="jsx"
        />
      </Section>

      <Section title="Zebra stripes" description="Alternates odd row backgrounds with grey-50 to improve row scanning in dense tables.">
        <DemoCanvas style={{ padding: 'var(--space-4)', display: 'block', background: 'var(--color-bg-page)' }}>
          <Table
            columns={COLUMNS.slice(0, 5)}
            data={INITIAL_DATA}
            rowNumbers
            zebra
            maxHeight={440}
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
