import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Modal } from '../components/Modal'
import { Table } from '../components/Table'
import { SegmentIndicator } from '../components/SegmentIndicator'
import { Button } from './Button'

const SHORT_BODY = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'

const LONG_BODY = Array(24).fill(SHORT_BODY).join('\n\n')

const usageCode = `import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  size="md"
  title="Modal Title"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
    </>
  }
>
  Modal body content goes here.
</Modal>`

const modalProps = [
  { name: 'open', type: 'boolean', default: '—', description: 'Controls visibility. When true, the modal is rendered into a portal on document.body.' },
  { name: 'onClose', type: '() => void', default: '—', description: 'Called when the backdrop, close button, or Escape key is triggered.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Max width: sm 576px, md 768px, lg 1024px, xl 1200px. Shrinks to viewport width minus 48px on small screens.' },
  { name: 'align', type: "'center' | 'top'", default: "'center'", description: 'Vertical position of the panel. center = vertically centered; top = pinned to the top with 40px offset.' },
  { name: 'title', type: 'string', default: '—', description: 'Modal heading. SemiBold 24px. Truncates on wide viewports; wraps at line-height 1.1 below 576px.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Body content. Scrolls vertically when content exceeds the available height.' },
  { name: 'footer', type: 'ReactNode', default: '—', description: 'Action buttons rendered at the bottom right.' },
  { name: 'showClose', type: 'boolean', default: 'true', description: 'Shows the X button. When false, top padding is set to 32px to match the footer bottom padding.' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Whether clicking the backdrop calls onClose.' },
  { name: 'bodyStyle', type: 'CSSProperties', default: '—', description: 'Inline styles applied directly to the scrollable body element. Use for fixed heights or custom overflow.' },
  { name: 'stretch', type: 'boolean', default: 'false', description: 'Makes the modal panel fill the full available viewport height.' },
]

function StatusBadge({ value }) {
  const map = {
    Active:     { bg: 'var(--color-green-100)',  color: 'var(--color-green-700)' },
    Inactive:   { bg: 'var(--color-gray-100)',   color: 'var(--color-gray-600)'  },
    Pending:    { bg: 'var(--color-yellow-100)', color: 'var(--color-yellow-700)' },
    'On Leave': { bg: 'var(--color-blue-100)',   color: 'var(--color-blue-700)'  },
  }
  const { bg, color } = map[value] ?? map.Inactive
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 100,
      fontSize: 12, fontWeight: 600,
      background: bg, color,
    }}>
      {value}
    </span>
  )
}

const TABLE_COLUMNS = [
  { key: 'name',        label: 'Name',        sortable: true, searchable: true, sticky: true, width: 200, minWidth: 140 },
  { key: 'role',        label: 'Role',        sortable: true, searchable: true, width: 180, minWidth: 100 },
  { key: 'department',  label: 'Department',  sortable: true, width: 140, minWidth: 100 },
  { key: 'status',      label: 'Status',      sortable: true, width: 120, minWidth: 90, render: (v) => <StatusBadge value={v} /> },
  { key: 'location',    label: 'Location',    sortable: true, width: 130, minWidth: 100 },
  { key: 'tasks',       label: 'Tasks',       sortable: true, type: 'number', width: 80, minWidth: 60 },
  { key: 'performance', label: 'Performance', sortable: true, width: 130, minWidth: 100, render: (v) => <SegmentIndicator value={v} total={5} /> },
]

const TABLE_DATA = [
  { name: 'Alice Johnson',    role: 'Product Manager',      department: 'Product',     status: 'Active',   location: 'New York',    tasks: 12, performance: 5 },
  { name: 'Ben Carter',       role: 'Senior Engineer',      department: 'Engineering', status: 'Active',   location: 'London',      tasks: 8,  performance: 4 },
  { name: 'Clara Mendes',     role: 'UX Designer',          department: 'Design',      status: 'On Leave', location: 'São Paulo',   tasks: 3,  performance: 3 },
  { name: 'Daniel Park',      role: 'Data Analyst',         department: 'Analytics',   status: 'Active',   location: 'Seoul',       tasks: 6,  performance: 3 },
  { name: 'Eva Schmidt',      role: 'Engineering Manager',  department: 'Engineering', status: 'Active',   location: 'Berlin',      tasks: 19, performance: 5 },
  { name: 'Frank Liu',        role: 'Backend Engineer',     department: 'Engineering', status: 'Pending',  location: 'Singapore',   tasks: 2,  performance: 1 },
  { name: 'Grace Kim',        role: 'Marketing Lead',       department: 'Marketing',   status: 'Active',   location: 'Tokyo',       tasks: 9,  performance: 4 },
  { name: 'Hugo Silva',       role: 'DevOps Engineer',      department: 'Engineering', status: 'Inactive', location: 'Lisbon',      tasks: 0,  performance: 2 },
  { name: 'Isabelle Roy',     role: 'Customer Success',     department: 'Support',     status: 'Active',   location: 'Paris',       tasks: 14, performance: 4 },
  { name: 'James Wang',       role: 'Frontend Engineer',    department: 'Engineering', status: 'Active',   location: 'Toronto',     tasks: 11, performance: 5 },
  { name: 'Kira Novak',       role: 'Product Designer',     department: 'Design',      status: 'Active',   location: 'Prague',      tasks: 7,  performance: 3 },
  { name: 'Luca Ferretti',    role: 'Sales Engineer',       department: 'Sales',       status: 'Pending',  location: 'Milan',       tasks: 4,  performance: 2 },
  { name: 'Maya Patel',       role: 'QA Engineer',          department: 'Engineering', status: 'Active',   location: 'Mumbai',      tasks: 10, performance: 4 },
  { name: 'Noah Svensson',    role: 'Scrum Master',         department: 'Product',     status: 'Active',   location: 'Stockholm',   tasks: 5,  performance: 3 },
  { name: 'Olivia Chen',      role: 'Data Engineer',        department: 'Analytics',   status: 'Active',   location: 'San Francisco', tasks: 13, performance: 5 },
  { name: 'Pedro Alves',      role: 'Security Engineer',    department: 'Engineering', status: 'Active',   location: 'Lisbon',      tasks: 7,  performance: 4 },
  { name: 'Quinn Roberts',    role: 'Brand Designer',       department: 'Design',      status: 'Active',   location: 'Chicago',     tasks: 6,  performance: 3 },
  { name: 'Rachel Green',     role: 'Account Manager',      department: 'Sales',       status: 'Active',   location: 'New York',    tasks: 17, performance: 5 },
  { name: 'Samuel Torres',    role: 'ML Engineer',          department: 'Engineering', status: 'Pending',  location: 'Barcelona',   tasks: 3,  performance: 2 },
  { name: 'Tina Müller',      role: 'HR Manager',           department: 'HR',          status: 'Active',   location: 'Berlin',      tasks: 8,  performance: 4 },
  { name: 'Umar Hassan',      role: 'Cloud Architect',      department: 'Engineering', status: 'Active',   location: 'Dubai',       tasks: 15, performance: 5 },
  { name: 'Vera Kozlov',      role: 'Content Strategist',   department: 'Marketing',   status: 'Active',   location: 'Moscow',      tasks: 9,  performance: 3 },
  { name: 'Will Thompson',    role: 'iOS Engineer',         department: 'Engineering', status: 'Active',   location: 'Austin',      tasks: 11, performance: 4 },
  { name: 'Xia Wei',          role: 'Growth Manager',       department: 'Marketing',   status: 'Active',   location: 'Shanghai',    tasks: 14, performance: 5 },
  { name: 'Yuki Tanaka',      role: 'Android Engineer',     department: 'Engineering', status: 'On Leave', location: 'Tokyo',       tasks: 2,  performance: 3 },
  { name: 'Zara Ahmed',       role: 'Finance Analyst',      department: 'Finance',     status: 'Active',   location: 'Dubai',       tasks: 10, performance: 4 },
  { name: 'Aaron Brooks',     role: 'Platform Engineer',    department: 'Engineering', status: 'Active',   location: 'Seattle',     tasks: 12, performance: 4 },
  { name: 'Bianca Moretti',   role: 'UI Designer',          department: 'Design',      status: 'Active',   location: 'Rome',        tasks: 8,  performance: 4 },
  { name: 'Carlos Reyes',     role: 'Solutions Architect',  department: 'Engineering', status: 'Active',   location: 'Mexico City', tasks: 16, performance: 5 },
  { name: 'Diana Popescu',    role: 'Data Scientist',       department: 'Analytics',   status: 'Active',   location: 'Bucharest',   tasks: 9,  performance: 4 },
  { name: 'Ethan Clarke',     role: 'Site Reliability Eng', department: 'Engineering', status: 'Inactive', location: 'London',      tasks: 0,  performance: 2 },
  { name: 'Fatima Al-Rashid', role: 'Product Analyst',      department: 'Product',     status: 'Active',   location: 'Riyadh',      tasks: 11, performance: 4 },
  { name: 'George Papadopoulos', role: 'Backend Engineer',  department: 'Engineering', status: 'Active',   location: 'Athens',      tasks: 7,  performance: 3 },
  { name: 'Hannah Lee',       role: 'Customer Success',     department: 'Support',     status: 'Active',   location: 'Seoul',       tasks: 13, performance: 5 },
  { name: 'Ian Murphy',       role: 'Sales Manager',        department: 'Sales',       status: 'Active',   location: 'Dublin',      tasks: 18, performance: 5 },
  { name: 'Julia Santos',     role: 'Legal Counsel',        department: 'Legal',       status: 'Active',   location: 'São Paulo',   tasks: 5,  performance: 3 },
  { name: 'Kevin Okafor',     role: 'Full Stack Engineer',  department: 'Engineering', status: 'Active',   location: 'Lagos',       tasks: 10, performance: 4 },
  { name: 'Lily Zhang',       role: 'VP of Product',        department: 'Product',     status: 'Active',   location: 'San Francisco', tasks: 20, performance: 5 },
  { name: 'Marco Esposito',   role: 'Infrastructure Eng',   department: 'Engineering', status: 'Active',   location: 'Milan',       tasks: 8,  performance: 3 },
  { name: 'Nina Johansson',   role: 'UX Researcher',        department: 'Design',      status: 'Pending',  location: 'Gothenburg',  tasks: 4,  performance: 3 },
  { name: 'Oscar Lindqvist',  role: 'Analytics Engineer',   department: 'Analytics',   status: 'Active',   location: 'Stockholm',   tasks: 9,  performance: 4 },
  { name: 'Priya Sharma',     role: 'Product Designer',     department: 'Design',      status: 'Active',   location: 'Bangalore',   tasks: 7,  performance: 4 },
  { name: 'Quentin Blanc',    role: 'CTO',                  department: 'Engineering', status: 'Active',   location: 'Paris',       tasks: 22, performance: 5 },
  { name: 'Rosa Martinez',    role: 'Marketing Analyst',    department: 'Marketing',   status: 'Active',   location: 'Madrid',      tasks: 8,  performance: 3 },
  { name: 'Stefan Koch',      role: 'Backend Engineer',     department: 'Engineering', status: 'Active',   location: 'Munich',      tasks: 11, performance: 4 },
  { name: 'Tara O\'Brien',    role: 'Recruiter',            department: 'HR',          status: 'Active',   location: 'Dublin',      tasks: 6,  performance: 3 },
  { name: 'Ugo Diallo',       role: 'Data Engineer',        department: 'Analytics',   status: 'Active',   location: 'Dakar',       tasks: 9,  performance: 4 },
  { name: 'Valentina Cruz',   role: 'Brand Manager',        department: 'Marketing',   status: 'On Leave', location: 'Bogotá',      tasks: 2,  performance: 3 },
  { name: 'Walter Brandt',    role: 'QA Lead',              department: 'Engineering', status: 'Active',   location: 'Hamburg',     tasks: 10, performance: 4 },
  { name: 'Xiomara Flores',   role: 'Customer Success',     department: 'Support',     status: 'Active',   location: 'Lima',        tasks: 12, performance: 4 },
  { name: 'Yasmine Hadid',    role: 'Finance Manager',      department: 'Finance',     status: 'Active',   location: 'Casablanca',  tasks: 14, performance: 5 },
  { name: 'Zack Wilson',      role: 'DevOps Engineer',      department: 'Engineering', status: 'Pending',  location: 'Denver',      tasks: 3,  performance: 2 },
  { name: 'Amira Nkosi',      role: 'Product Manager',      department: 'Product',     status: 'Active',   location: 'Nairobi',     tasks: 13, performance: 4 },
  { name: 'Boris Petrov',     role: 'Senior Engineer',      department: 'Engineering', status: 'Active',   location: 'Sofia',       tasks: 9,  performance: 4 },
  { name: 'Celine Dupont',    role: 'UX Designer',          department: 'Design',      status: 'Active',   location: 'Lyon',        tasks: 7,  performance: 3 },
  { name: 'Dario Conti',      role: 'Sales Engineer',       department: 'Sales',       status: 'Active',   location: 'Turin',       tasks: 11, performance: 4 },
  { name: 'Elena Volkov',     role: 'Data Analyst',         department: 'Analytics',   status: 'Active',   location: 'St. Petersburg', tasks: 8, performance: 3 },
  { name: 'Felipe Rocha',     role: 'Mobile Engineer',      department: 'Engineering', status: 'Active',   location: 'Curitiba',    tasks: 10, performance: 4 },
  { name: 'Gina Rossi',       role: 'Marketing Manager',    department: 'Marketing',   status: 'Inactive', location: 'Florence',    tasks: 0,  performance: 2 },
  { name: 'Harry Nguyen',     role: 'Full Stack Engineer',  department: 'Engineering', status: 'Active',   location: 'Ho Chi Minh', tasks: 12, performance: 4 },
  { name: 'Ingrid Berg',      role: 'Scrum Master',         department: 'Product',     status: 'Active',   location: 'Oslo',        tasks: 6,  performance: 3 },
  { name: 'Jonas Weber',       role: 'Platform Engineer',    department: 'Engineering', status: 'Active',   location: 'Frankfurt',   tasks: 14, performance: 5 },
  { name: 'Karen Mills',       role: 'Legal Analyst',        department: 'Legal',       status: 'Active',   location: 'Boston',      tasks: 7,  performance: 3 },
  { name: 'Lars Eriksson',     role: 'Backend Engineer',     department: 'Engineering', status: 'Active',   location: 'Malmö',       tasks: 10, performance: 4 },
  { name: 'Marta Wójcik',      role: 'HR Specialist',        department: 'HR',          status: 'Active',   location: 'Warsaw',      tasks: 6,  performance: 3 },
  { name: 'Ngo Thi Lan',       role: 'QA Engineer',          department: 'Engineering', status: 'Pending',  location: 'Hanoi',       tasks: 4,  performance: 2 },
  { name: 'Oliver Hayes',      role: 'Product Manager',      department: 'Product',     status: 'Active',   location: 'Manchester',  tasks: 15, performance: 5 },
  { name: 'Paloma Ruiz',       role: 'Content Writer',       department: 'Marketing',   status: 'Active',   location: 'Seville',     tasks: 8,  performance: 3 },
  { name: 'Roberto Gomez',     role: 'Android Engineer',     department: 'Engineering', status: 'Active',   location: 'Guadalajara', tasks: 11, performance: 4 },
  { name: 'Sophia Ritter',     role: 'Finance Controller',   department: 'Finance',     status: 'Active',   location: 'Zurich',      tasks: 9,  performance: 4 },
  { name: 'Tariq Al-Farsi',    role: 'Cloud Engineer',       department: 'Engineering', status: 'Active',   location: 'Abu Dhabi',   tasks: 12, performance: 4 },
  { name: 'Uma Krishnan',       role: 'UX Designer',          department: 'Design',      status: 'Active',   location: 'Chennai',     tasks: 7,  performance: 4 },
  { name: 'Victor Leblanc',    role: 'Data Scientist',       department: 'Analytics',   status: 'Active',   location: 'Montreal',    tasks: 10, performance: 4 },
  { name: 'Winona Black',      role: 'Customer Success',     department: 'Support',     status: 'On Leave', location: 'Portland',    tasks: 2,  performance: 3 },
  { name: 'Xenia Petrova',     role: 'Product Designer',     department: 'Design',      status: 'Active',   location: 'Tbilisi',     tasks: 8,  performance: 4 },
  { name: 'Yusuf Demirci',     role: 'Full Stack Engineer',  department: 'Engineering', status: 'Active',   location: 'Istanbul',    tasks: 13, performance: 4 },
  { name: 'Zosia Kaminska',    role: 'Marketing Analyst',    department: 'Marketing',   status: 'Active',   location: 'Kraków',      tasks: 7,  performance: 3 },
  { name: 'Adam Fletcher',     role: 'Senior Engineer',      department: 'Engineering', status: 'Active',   location: 'Edinburgh',   tasks: 11, performance: 4 },
  { name: 'Beatriz Lopes',     role: 'Account Executive',    department: 'Sales',       status: 'Active',   location: 'Porto',       tasks: 16, performance: 5 },
  { name: 'Chen Wei',          role: 'Data Engineer',        department: 'Analytics',   status: 'Active',   location: 'Beijing',     tasks: 9,  performance: 4 },
  { name: 'Demi Papadaki',     role: 'UX Researcher',        department: 'Design',      status: 'Active',   location: 'Thessaloniki', tasks: 5, performance: 3 },
  { name: 'Emil Andersen',     role: 'DevOps Engineer',      department: 'Engineering', status: 'Active',   location: 'Aarhus',      tasks: 8,  performance: 3 },
  { name: 'Federica Marino',   role: 'Brand Designer',       department: 'Design',      status: 'Inactive', location: 'Naples',      tasks: 0,  performance: 2 },
  { name: 'Günter Braun',      role: 'Infrastructure Eng',   department: 'Engineering', status: 'Active',   location: 'Stuttgart',   tasks: 10, performance: 4 },
  { name: 'Hana Kovář',        role: 'Recruiter',            department: 'HR',          status: 'Active',   location: 'Brno',        tasks: 6,  performance: 3 },
  { name: 'Ivan Stoyanov',     role: 'Backend Engineer',     department: 'Engineering', status: 'Active',   location: 'Plovdiv',     tasks: 9,  performance: 3 },
  { name: 'Jasmine Osei',      role: 'Product Manager',      department: 'Product',     status: 'Active',   location: 'Accra',       tasks: 14, performance: 5 },
  { name: 'Kenji Watanabe',    role: 'iOS Engineer',         department: 'Engineering', status: 'Active',   location: 'Osaka',       tasks: 11, performance: 4 },
  { name: 'Layla Mansour',     role: 'Finance Analyst',      department: 'Finance',     status: 'Active',   location: 'Cairo',       tasks: 8,  performance: 3 },
  { name: 'Maksim Orlov',      role: 'ML Engineer',          department: 'Engineering', status: 'Pending',  location: 'Minsk',       tasks: 4,  performance: 2 },
  { name: 'Nadia Fournier',    role: 'Content Strategist',   department: 'Marketing',   status: 'Active',   location: 'Bordeaux',    tasks: 7,  performance: 3 },
  { name: 'Orlando Ferreira',  role: 'Solutions Architect',  department: 'Engineering', status: 'Active',   location: 'Lisbon',      tasks: 17, performance: 5 },
  { name: 'Pia Hoffmann',      role: 'HR Manager',           department: 'HR',          status: 'Active',   location: 'Cologne',     tasks: 9,  performance: 4 },
  { name: 'Rami Khalil',       role: 'Security Engineer',    department: 'Engineering', status: 'Active',   location: 'Beirut',      tasks: 12, performance: 4 },
  { name: 'Sara Lindberg',     role: 'Product Designer',     department: 'Design',      status: 'Active',   location: 'Uppsala',     tasks: 7,  performance: 4 },
  { name: 'Tobias Klein',      role: 'Analytics Engineer',   department: 'Analytics',   status: 'Active',   location: 'Leipzig',     tasks: 10, performance: 4 },
  { name: 'Ursula Nowak',      role: 'Legal Counsel',        department: 'Legal',       status: 'Active',   location: 'Wrocław',     tasks: 5,  performance: 3 },
  { name: 'Vijay Iyer',        role: 'Data Scientist',       department: 'Analytics',   status: 'Active',   location: 'Hyderabad',   tasks: 11, performance: 4 },
  { name: 'Wendy Oduya',       role: 'Customer Success',     department: 'Support',     status: 'Active',   location: 'Abuja',       tasks: 13, performance: 4 },
  { name: 'Xander Botha',      role: 'Full Stack Engineer',  department: 'Engineering', status: 'Active',   location: 'Cape Town',   tasks: 10, performance: 4 },
  { name: 'Yolanda Pérez',     role: 'Marketing Manager',    department: 'Marketing',   status: 'Active',   location: 'Valencia',    tasks: 12, performance: 4 },
  { name: 'Zachary Hunt',      role: 'Site Reliability Eng', department: 'Engineering', status: 'Active',   location: 'Phoenix',     tasks: 9,  performance: 3 },
  { name: 'Anya Sidorov',      role: 'UX Designer',          department: 'Design',      status: 'Active',   location: 'Kiev',        tasks: 8,  performance: 4 },
  { name: 'Bruno Carvalho',    role: 'Backend Engineer',     department: 'Engineering', status: 'Active',   location: 'Recife',      tasks: 10, performance: 3 },
  { name: 'Camille Fontaine',  role: 'Product Analyst',      department: 'Product',     status: 'Active',   location: 'Marseille',   tasks: 11, performance: 4 },
  { name: 'Diego Herrera',     role: 'Mobile Engineer',      department: 'Engineering', status: 'Active',   location: 'Santiago',    tasks: 9,  performance: 4 },
  { name: 'Elif Yıldız',       role: 'Data Analyst',         department: 'Analytics',   status: 'Pending',  location: 'Ankara',      tasks: 3,  performance: 2 },
  { name: 'Florian Huber',     role: 'Platform Engineer',    department: 'Engineering', status: 'Active',   location: 'Vienna',      tasks: 13, performance: 4 },
  { name: 'Greta Olsen',       role: 'Growth Manager',       department: 'Marketing',   status: 'Active',   location: 'Bergen',      tasks: 10, performance: 4 },
  { name: 'Hamid Rahimi',      role: 'Cloud Architect',      department: 'Engineering', status: 'Active',   location: 'Tehran',      tasks: 15, performance: 5 },
  { name: 'Irene Castillo',    role: 'Sales Engineer',       department: 'Sales',       status: 'Active',   location: 'Bilbao',      tasks: 12, performance: 4 },
  { name: 'Jean-Luc Moreau',   role: 'Engineering Manager',  department: 'Engineering', status: 'Active',   location: 'Strasbourg',  tasks: 18, performance: 5 },
  { name: 'Katya Bogdanova',   role: 'QA Engineer',          department: 'Engineering', status: 'Active',   location: 'Kharkiv',     tasks: 8,  performance: 3 },
  { name: 'Leon Fischer',      role: 'Frontend Engineer',    department: 'Engineering', status: 'Active',   location: 'Düsseldorf',  tasks: 11, performance: 4 },
  { name: 'Miriam Stein',      role: 'Finance Manager',      department: 'Finance',     status: 'Active',   location: 'Tel Aviv',    tasks: 14, performance: 5 },
  { name: 'Nour Saleh',        role: 'Customer Success',     department: 'Support',     status: 'Active',   location: 'Amman',       tasks: 9,  performance: 3 },
  { name: 'Pablo Mendez',      role: 'DevOps Engineer',      department: 'Engineering', status: 'Active',   location: 'Buenos Aires', tasks: 10, performance: 4 },
  { name: 'Qian Liu',          role: 'Data Engineer',        department: 'Analytics',   status: 'Active',   location: 'Guangzhou',   tasks: 11, performance: 4 },
  { name: 'Rebeka Varga',      role: 'UI Designer',          department: 'Design',      status: 'Active',   location: 'Budapest',    tasks: 7,  performance: 3 },
  { name: 'Simon Haas',        role: 'Senior Engineer',      department: 'Engineering', status: 'Active',   location: 'Bern',        tasks: 12, performance: 4 },
  { name: 'Tess Fitzgerald',   role: 'Product Manager',      department: 'Product',     status: 'Active',   location: 'Cork',        tasks: 16, performance: 5 },
  { name: 'Ulrik Dahl',        role: 'Analytics Engineer',   department: 'Analytics',   status: 'Active',   location: 'Trondheim',   tasks: 8,  performance: 3 },
  { name: 'Veronika Šimková',  role: 'HR Specialist',        department: 'HR',          status: 'Active',   location: 'Bratislava',  tasks: 5,  performance: 3 },
  { name: 'Waleed Nasser',     role: 'Backend Engineer',     department: 'Engineering', status: 'Active',   location: 'Jeddah',      tasks: 10, performance: 4 },
  { name: 'Xiu Ying',          role: 'Product Designer',     department: 'Design',      status: 'Active',   location: 'Chengdu',     tasks: 9,  performance: 4 },
  { name: 'Yannick Perrot',    role: 'Solutions Architect',  department: 'Engineering', status: 'Active',   location: 'Nantes',      tasks: 14, performance: 5 },
  { name: 'Zuzanna Wiśniewska', role: 'Content Strategist',  department: 'Marketing',   status: 'Active',   location: 'Poznań',      tasks: 7,  performance: 3 },
  { name: 'Aleksei Morozov',   role: 'ML Engineer',          department: 'Engineering', status: 'Pending',  location: 'Novosibirsk', tasks: 4,  performance: 2 },
  { name: 'Britta Hansen',     role: 'Account Manager',      department: 'Sales',       status: 'Active',   location: 'Odense',      tasks: 15, performance: 5 },
  { name: 'Cedric Dubois',     role: 'Cloud Engineer',       department: 'Engineering', status: 'Active',   location: 'Brussels',    tasks: 11, performance: 4 },
  { name: 'Daniela Ionescu',   role: 'Finance Analyst',      department: 'Finance',     status: 'Active',   location: 'Cluj-Napoca', tasks: 8,  performance: 3 },
  { name: 'Erik Halvorsen',    role: 'Mobile Engineer',      department: 'Engineering', status: 'Active',   location: 'Stavanger',   tasks: 10, performance: 4 },
  { name: 'Fiona Walsh',       role: 'Legal Counsel',        department: 'Legal',       status: 'Active',   location: 'Galway',      tasks: 6,  performance: 3 },
  { name: 'Gabriel Sousa',     role: 'Full Stack Engineer',  department: 'Engineering', status: 'Active',   location: 'Braga',       tasks: 12, performance: 4 },
  { name: 'Hira Baig',         role: 'UX Researcher',        department: 'Design',      status: 'Active',   location: 'Lahore',      tasks: 7,  performance: 4 },
  { name: 'Igor Pavlov',       role: 'Infrastructure Eng',   department: 'Engineering', status: 'Active',   location: 'Kazan',       tasks: 9,  performance: 3 },
  { name: 'Jana Procházková',  role: 'Marketing Lead',       department: 'Marketing',   status: 'Active',   location: 'Ostrava',     tasks: 11, performance: 4 },
  { name: 'Koen van Dijk',     role: 'Frontend Engineer',    department: 'Engineering', status: 'Active',   location: 'Rotterdam',   tasks: 13, performance: 4 },
  { name: 'Lucia Gómez',       role: 'Brand Manager',        department: 'Marketing',   status: 'Active',   location: 'Málaga',      tasks: 10, performance: 4 },
  { name: 'Mohamed El Amin',   role: 'Data Scientist',       department: 'Analytics',   status: 'Active',   location: 'Tunis',       tasks: 12, performance: 4 },
  { name: 'Natalia Szymańska', role: 'Scrum Master',         department: 'Product',     status: 'Active',   location: 'Łódź',        tasks: 6,  performance: 3 },
  { name: 'Otto Nieminen',     role: 'Backend Engineer',     department: 'Engineering', status: 'Active',   location: 'Tampere',     tasks: 9,  performance: 3 },
  { name: 'Penelope Scott',    role: 'Growth Manager',       department: 'Marketing',   status: 'Active',   location: 'Brisbane',    tasks: 11, performance: 4 },
  { name: 'Raúl Delgado',      role: 'Senior Engineer',      department: 'Engineering', status: 'Active',   location: 'Zaragoza',    tasks: 10, performance: 4 },
  { name: 'Svetlana Ivanova',  role: 'Product Manager',      department: 'Product',     status: 'Active',   location: 'Samara',      tasks: 13, performance: 5 },
  { name: 'Tobenna Obi',       role: 'DevOps Engineer',      department: 'Engineering', status: 'Active',   location: 'Enugu',       tasks: 8,  performance: 3 },
  { name: 'Ulla Mäkinen',      role: 'UI Designer',          department: 'Design',      status: 'Active',   location: 'Espoo',       tasks: 7,  performance: 4 },
  { name: 'Vasco Ribeiro',     role: 'Sales Manager',        department: 'Sales',       status: 'Active',   location: 'Coimbra',     tasks: 17, performance: 5 },
  { name: 'Wioletta Krawczyk', role: 'HR Manager',           department: 'HR',          status: 'Active',   location: 'Gdańsk',      tasks: 8,  performance: 3 },
  { name: 'Xu Jing',           role: 'Data Engineer',        department: 'Analytics',   status: 'Active',   location: 'Wuhan',       tasks: 10, performance: 4 },
  { name: 'Yesenia Mora',      role: 'Customer Success',     department: 'Support',     status: 'Active',   location: 'Medellín',    tasks: 12, performance: 4 },
  { name: 'Zbigniew Wróbel',   role: 'Platform Engineer',    department: 'Engineering', status: 'Active',   location: 'Katowice',    tasks: 9,  performance: 3 },
]

function ModalFooter({ onClose }) {
  return (
    <>
      <Button variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
      <Button variant="primary" size="lg" onClick={onClose}>OK</Button>
    </>
  )
}

export default function ModalPage() {
  const [open, setOpen] = useState({ sm: false, md: false, lg: false, xl: false, scroll: false, noClose: false, noBackdrop: false, alignCenter: false, alignTop: false })
  const toggle = (key, val) => setOpen(o => ({ ...o, [key]: val }))

  return (
    <div>
      <PageHeader
        title="Modal"
        description="A dialog rendered in a portal over a darkened backdrop. Four width sizes: 576px, 768px, 1024px, 1200px. Collapses to viewport width with 24px horizontal padding on small screens. Tall content scrolls inside the body; header and footer remain fixed. Background scroll is locked while open."
      />

      <Section title="Sizes" description="Click each button to open the modal at that width.">
        <DemoCanvas style={{ gap: 12 }}>
          <Button size="lg" onClick={() => toggle('sm', true)}>SM — 576px</Button>
          <Button size="lg" onClick={() => toggle('md', true)}>MD — 768px</Button>
          <Button size="lg" onClick={() => toggle('lg', true)}>LG — 1024px</Button>
          <Button size="lg" onClick={() => toggle('xl', true)}>XL — 1200px</Button>
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="Scrollable body" description="When body content exceeds the available height the body scrolls; header and footer stay fixed.">
        <DemoCanvas>
          <Button size="lg" onClick={() => toggle('scroll', true)}>Open with long content</Button>
        </DemoCanvas>
      </Section>

      <Section title="No close button" description="showClose={false} hides the X. Top padding is set to 32px to match the footer bottom.">
        <DemoCanvas>
          <Button size="lg" onClick={() => toggle('noClose', true)}>Open without close button</Button>
        </DemoCanvas>
      </Section>

      <Section title="Backdrop click disabled" description="closeOnBackdrop={false} — clicking outside does nothing. Only the footer buttons close the modal.">
        <DemoCanvas>
          <Button size="lg" onClick={() => toggle('noBackdrop', true)}>Open (backdrop locked)</Button>
        </DemoCanvas>
      </Section>

      <Section title="Alignment" description="align='center' vertically centers the panel (default). align='top' pins it near the top of the viewport.">
        <DemoCanvas style={{ gap: 12 }}>
          <Button size="lg" onClick={() => toggle('alignCenter', true)}>Center (default)</Button>
          <Button size="lg" onClick={() => toggle('alignTop', true)}>Top</Button>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={modalProps} />
      </UsageSection>

      {/* SM */}
      <Modal
        open={open.sm}
        onClose={() => toggle('sm', false)}
        size="sm"
        title="Modal Title which can be very loooong"
        footer={<ModalFooter onClose={() => toggle('sm', false)} />}
      >
        {SHORT_BODY}
      </Modal>

      {/* MD */}
      <Modal
        open={open.md}
        onClose={() => toggle('md', false)}
        size="md"
        title="Modal Title which can be very loooong"
        footer={<ModalFooter onClose={() => toggle('md', false)} />}
      >
        {SHORT_BODY}
      </Modal>

      {/* LG */}
      <Modal
        open={open.lg}
        onClose={() => toggle('lg', false)}
        size="lg"
        title="Modal Title which can be very loooong"
        footer={<ModalFooter onClose={() => toggle('lg', false)} />}
      >
        {SHORT_BODY}
      </Modal>

      {/* XL */}
      <Modal
        open={open.xl}
        onClose={() => toggle('xl', false)}
        size="xl"
        title="Team Members"
        footer={<ModalFooter onClose={() => toggle('xl', false)} />}
        bodyStyle={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        stretch
      >
        <Table columns={TABLE_COLUMNS} data={TABLE_DATA} selectable fill pageSize={50} />
      </Modal>

      {/* No close button */}
      <Modal
        open={open.noClose}
        onClose={() => toggle('noClose', false)}
        size="sm"
        title="No close button"
        showClose={false}
        footer={<ModalFooter onClose={() => toggle('noClose', false)} />}
      >
        {SHORT_BODY}
      </Modal>

      {/* Backdrop locked */}
      <Modal
        open={open.noBackdrop}
        onClose={() => toggle('noBackdrop', false)}
        size="sm"
        title="Backdrop click disabled"
        closeOnBackdrop={false}
        footer={<ModalFooter onClose={() => toggle('noBackdrop', false)} />}
      >
        Clicking outside this modal does nothing. Use the buttons below to close it.
      </Modal>

      {/* Align center */}
      <Modal
        open={open.alignCenter}
        onClose={() => toggle('alignCenter', false)}
        size="sm"
        align="center"
        title="Align: center"
        footer={<ModalFooter onClose={() => toggle('alignCenter', false)} />}
      >
        {SHORT_BODY}
      </Modal>

      {/* Align top */}
      <Modal
        open={open.alignTop}
        onClose={() => toggle('alignTop', false)}
        size="sm"
        align="top"
        title="Align: top"
        footer={<ModalFooter onClose={() => toggle('alignTop', false)} />}
      >
        {SHORT_BODY}
      </Modal>

      {/* Scrollable */}
      <Modal
        open={open.scroll}
        onClose={() => toggle('scroll', false)}
        size="md"
        title="Modal with long content"
        footer={<ModalFooter onClose={() => toggle('scroll', false)} />}
      >
        {LONG_BODY.split('\n\n').map((p, i) => (
          <p key={i} style={{ marginBottom: i < 5 ? 16 : 0 }}>{p}</p>
        ))}
      </Modal>
    </div>
  )
}
