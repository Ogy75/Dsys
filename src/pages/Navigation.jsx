import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Navigation } from '../components/Navigation'

const simpleItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'components', label: 'Components' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'resources', label: 'Resources' },
]

const submenuItems = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'button', label: 'Button' },
      { id: 'input', label: 'Input' },
      { id: 'modal', label: 'Modal' },
      { id: 'dropdown', label: 'Dropdown' },
      { id: 'badge', label: 'Badge' },
    ],
  },
  { id: 'foundations', label: 'Foundations' },
  { id: 'patterns', label: 'Patterns' },
]

// L2 children each carry their own L3 children — hovering L2 reveals L3 on the right
const megaMenuItems = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'solutions',
    label: 'Solutions',
    children: [
      {
        id: 'access',
        label: 'Access Management',
        children: [
          { id: 'sso', label: 'Single Sign-On' },
          { id: 'mfa', label: 'Multi-Factor Auth' },
          { id: 'rbac', label: 'Role-Based Access' },
        ],
      },
      {
        id: 'navigation',
        label: 'Navigation Patterns',
        children: [
          { id: 'gesture', label: 'Gesture controls' },
          { id: 'intuitive', label: 'Intuitive menus' },
          { id: 'filters', label: 'Dynamic filters' },
          { id: 'dashboard', label: 'Personalized dashboards' },
          { id: 'search', label: 'Predictive search' },
        ],
      },
      {
        id: 'content',
        label: 'Content Discovery',
        children: [
          { id: 'breadcrumb', label: 'Breadcrumb trails' },
          { id: 'sitemap', label: 'Sitemap structure' },
          { id: 'tagging', label: 'Content tagging' },
        ],
      },
    ],
  },
  { id: 'resources', label: 'Resources' },
  { id: 'about', label: 'About' },
]

const basicCode = `import { Navigation } from '@/components/Navigation'

const [active, setActive] = useState('overview')

<Navigation
  items={[
    { id: 'overview', label: 'Overview' },
    { id: 'components', label: 'Components' },
    { id: 'foundations', label: 'Foundations' },
  ]}
  value={active}
  onChange={setActive}
/>`

const submenuCode = `<Navigation
  items={[
    { id: 'overview', label: 'Overview' },
    {
      id: 'components',
      label: 'Components',
      children: [
        { id: 'button', label: 'Button' },
        { id: 'input', label: 'Input' },
        { id: 'modal', label: 'Modal' },
      ],
    },
    { id: 'patterns', label: 'Patterns' },
  ]}
  value={active}
  onChange={setActive}
/>`

const megaCode = `// L2 items carry their own children (L3).
// Hovering an L2 item reveals its L3 items in the right column.
<Navigation
  items={[
    {
      id: 'solutions',
      label: 'Solutions',
      children: [
        {
          id: 'access',
          label: 'Access Management',   // L2
          children: [
            { id: 'sso',  label: 'Single Sign-On' },  // L3
            { id: 'mfa',  label: 'Multi-Factor Auth' },
            { id: 'rbac', label: 'Role-Based Access' },
          ],
        },
        {
          id: 'navigation',
          label: 'Navigation Patterns', // L2
          children: [
            { id: 'gesture',    label: 'Gesture controls' },
            { id: 'intuitive',  label: 'Intuitive menus' },
          ],
        },
      ],
    },
  ]}
  value={active}
  onChange={setActive}
/>`

const navProps = [
  { name: 'items', type: 'NavItem[]', default: '[]', description: 'Array of top-level navigation items.' },
  { name: 'value', type: 'string', default: '—', description: 'Currently active item ID (L1, L2, or L3).' },
  { name: 'onChange', type: '(id: string) => void', default: '—', description: 'Called with the selected item ID on click.' },
]

const itemProps = [
  { name: 'id', type: 'string', default: '—', description: 'Unique identifier.' },
  { name: 'label', type: 'string', default: '—', description: 'Display text.' },
  { name: 'children', type: 'NavItem[]', default: '—', description: 'L1 → submenu items (L2). If L2 items carry their own children, the panel renders a two-column L2/L3 layout: hovering L2 reveals its L3 items in the right column.' },
  { name: 'icon', type: 'ReactNode', default: '—', description: 'Optional icon rendered before the label in L2 dropdown items.' },
]

export default function NavigationPage() {
  const [v1, setV1] = useState('overview')
  const [v2, setV2] = useState('overview')
  const [v3, setV3] = useState('overview')

  return (
    <div>
      <PageHeader
        title="Navigation"
        description="A horizontal pill-based navigation bar. Supports active and hover states, single-level submenus, and two-column L2/L3 mega-menu dropdowns."
      />

      <Section title="Basic">
        <DemoCanvas>
          <Navigation items={simpleItems} value={v1} onChange={setV1} />
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      <Section title="With submenu" description="Items with children render a chevron and open a single-column dropdown on click.">
        <DemoCanvas style={{ paddingBottom: 220 }}>
          <Navigation items={submenuItems} value={v2} onChange={setV2} />
        </DemoCanvas>
        <CodeBlock code={submenuCode} language="jsx" />
      </Section>

      <Section title="Two-level submenu (L2 → L3)" description="When L2 items carry their own children, the panel splits into two columns. Hovering an L2 item reveals its L3 items on the right. The left column defines the right.">
        <DemoCanvas style={{ paddingBottom: 280 }}>
          <Navigation items={megaMenuItems} value={v3} onChange={setV3} />
        </DemoCanvas>
        <CodeBlock code={megaCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Navigation props</h3>
        <PropsTable props={navProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 12px' }}>Item shape</h3>
        <PropsTable props={itemProps} />
      </UsageSection>
    </div>
  )
}
