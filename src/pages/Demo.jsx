import { useState } from 'react'
import styles from './Demo.module.css'
import { Navigation } from '../components/Navigation'
import { IconButton } from '../components/IconButton'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { Dropdown } from '../components/Dropdown'

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'projects',  label: 'Projects' },
  { id: 'employees', label: 'Employees' },
  { id: 'settings',  label: 'Settings' },
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { id: 'reports-summary',   label: 'Summary' },
      { id: 'reports-financial', label: 'Financial' },
      { id: 'reports-traffic',   label: 'Traffic' },
      { id: 'reports-exports',   label: 'Exports' },
    ],
  },
]

const STATUS_VARIANT = {
  Active:     'green',
  Pending:    'yellow',
  'On Leave': 'blue',
  Inactive:   'gray',
}

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, searchable: true, secondary: 'email', avatarSrc: 'avatarUrl', avatar: 'name', sticky: true, width: 220, minWidth: 160 },
  { key: 'role', label: 'Role', sortable: true, filterSelect: true, width: 180, minWidth: 120 },
  { key: 'department', label: 'Department', sortable: true, filterSelect: true, width: 160, minWidth: 120 },
  {
    key: 'status', label: 'Status', sortable: true, filterSelect: true, width: 130, minWidth: 100,
    render: (value, _row, density) => {
      const size = density === 'comfortable' ? 'lg' : density === 'compact' ? 'sm' : 'md'
      return <Badge variant={STATUS_VARIANT[value] ?? 'gray'} size={size}>{value}</Badge>
    },
  },
  { key: 'location', label: 'Location', sortable: true, searchable: true, width: 160, minWidth: 120 },
  {
    key: 'salary', label: 'Salary', sortable: true, type: 'number', width: 140, minWidth: 100,
    render: v => v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—',
  },
  { key: 'tasks', label: 'Tasks', sortable: true, type: 'number', width: 90, minWidth: 70 },
  { key: 'notes', label: 'Notes', wrap: true, editable: true, width: 280, minWidth: 160 },
]

const FIRST = ['Mia','Noah','Olivia','Liam','Ava','Ethan','Sophia','Mason','Amelia','Logan','Charlotte','Lucas','Harper','Jack','Evelyn','Henry','Lily','Owen','Zoe','Leo','Nora','Finn','Ruby','Felix','Ivy','Milo','Iris','Hazel','Theo','Aria','Jasper','Chloe','Eli','Maya','Axel','Luna','Reid','Sadie','Kian','Freya']
const LAST  = ['Adler','Bauer','Chen','Dubois','Ellis','Farkas','Garcia','Huang','Ibrahim','Jensen','Kowalski','Lindqvist','Martinez','Nakamura','Okafor','Petrov','Quinn','Rossi','Santos','Takeda','Uchida','Volkov','Weber','Xu','Yamada','Zahir','Andersen','Bianchi','Clarke','Dvorak']
const ROLES = ['Product Manager','Senior Engineer','UX Designer','Data Analyst','Engineering Manager','Backend Engineer','Marketing Lead','DevOps Engineer','Customer Success','Frontend Engineer','Product Designer','Sales Engineer']
const ROLE_DEPT = {
  'Product Manager':'Product','Senior Engineer':'Engineering','UX Designer':'Design','Data Analyst':'Analytics',
  'Engineering Manager':'Engineering','Backend Engineer':'Engineering','Marketing Lead':'Marketing',
  'DevOps Engineer':'Engineering','Customer Success':'Support','Frontend Engineer':'Engineering',
  'Product Designer':'Design','Sales Engineer':'Sales',
}
const STATUSES = ['Active','Active','Active','Active','Pending','On Leave','Inactive']
const LOCATIONS = ['New York','London','São Paulo','Seoul','Berlin','Singapore','Tokyo','Lisbon','Paris','Toronto','Prague','Milan']
const NOTES = [
  '', '', 'Shipping Q3 deliverables.', 'Mentoring a new hire.',
  'Running customer interviews this week.', 'Cleaning up technical debt in the auth module.',
  'Leading a cross-team initiative.', 'Finalising the quarterly roadmap.',
  'Preparing the launch retrospective.', 'Rotating through on-call duty.',
]

function row(i) {
  const fn = FIRST[i % FIRST.length]
  const ln = LAST[(i * 7 + 3) % LAST.length]
  const name = `${fn} ${ln}`
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@company.com`
  const role = ROLES[i % ROLES.length]
  return {
    name,
    email,
    avatarUrl: null,
    role,
    department: ROLE_DEPT[role],
    status: STATUSES[i % STATUSES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    salary: Math.round((62000 + ((i * 2777) % 95000)) * 100) / 100,
    tasks: (i * 3) % 22,
    notes: NOTES[i % NOTES.length],
  }
}

// 15 pages × 30 rows/page = 450 rows
const DATA = Array.from({ length: 450 }, (_, i) => row(i))

const USER_MENU = [
  { value: 'preferences', label: 'Preferences', icon: <Icon name="settings" size={18} /> },
  { value: 'logout',      label: 'Logout',      icon: <Icon name="logout"   size={18} /> },
]

const ACTIVE_LABEL = {
  overview:           'Overview',
  projects:           'Projects',
  employees:          'Employees',
  settings:           'Settings',
  reports:            'Reports',
  'reports-summary':  'Summary',
  'reports-financial':'Financial',
  'reports-traffic':  'Traffic',
  'reports-exports':  'Exports',
}

export default function DemoPage() {
  const [active, setActive] = useState('employees')

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
       <div className={styles.topbarInner}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>Name</span>
          <div className={styles.navHide}>
            <Navigation items={NAV_ITEMS} value={active} onChange={setActive} size="md" />
          </div>
        </div>
        <div className={styles.topbarRight}>
          <IconButton
            variant="ghost"
            size="lg"
            aria-label="Notifications"
            icon={<Icon name="notifications" size={22} />}
          />
          <Dropdown
            align="right"
            minWidth={0}
            items={USER_MENU}
            onChange={() => {}}
            trigger={
              <button type="button" className={styles.avatarTrigger} aria-label="Account menu">
                <Avatar size="xl" initials="JD" />
              </button>
            }
          />
        </div>
       </div>
      </header>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{ACTIVE_LABEL[active] ?? ''}</h1>
          {active === 'employees' && (
            <IconButton
              variant="ghost"
              size="lg"
              aria-label="Search"
              icon={<Icon name="search" size={22} />}
            />
          )}
        </div>

        {active === 'employees' && (
          <div className={styles.tableWrap}>
            <Table
              columns={COLUMNS}
              data={DATA}
              selectable
              rowNumbers
              fill
            />
          </div>
        )}
      </div>
    </div>
  )
}
