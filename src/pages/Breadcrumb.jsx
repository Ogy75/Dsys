import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Breadcrumb } from '../components/Breadcrumb'

const basicItems = [
  { label: 'Home', href: '/' },
  { label: 'Current page' },
]

const deepItems = [
  { label: 'Home', href: '/' },
  { label: 'Level 1', href: '/level-1' },
  { label: 'Level 2', href: '/level-1/level-2' },
  { label: 'Level 3' },
]

const basicCode = `import { Breadcrumb } from '@/components/Breadcrumb'

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Current page' },
  ]}
/>`

const deepCode = `<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Level 1', href: '/level-1' },
    { label: 'Level 2', href: '/level-1/level-2' },
    { label: 'Level 3' },
  ]}
/>`

const onClickCode = `<Breadcrumb
  items={[
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Products', onClick: () => navigate('/products') },
    { label: 'Keyboard' },
  ]}
/>`

const itemProps = [
  { name: 'label', type: 'string', default: '—', description: 'Text displayed for the breadcrumb item.' },
  { name: 'href', type: 'string', default: '—', description: 'URL for the anchor tag. Omit on the last (current) item.' },
  { name: 'onClick', type: '() => void', default: '—', description: 'Click handler — useful for SPA navigation instead of href.' },
]

const breadcrumbProps = [
  { name: 'items', type: 'BreadcrumbItem[]', default: '[]',    description: 'Ordered list of crumbs. The last item is treated as the current page.' },
  { name: 'size',  type: '"md" | "lg"',      default: '"lg"',  description: 'lg uses body font size; md uses 14px.' },
]

export default function BreadcrumbPage() {
  return (
    <div>
      <PageHeader
        title="Breadcrumb"
        description="A navigation aid that shows the user's current location within a hierarchy. The last item represents the current page and is rendered as bold text; all preceding items are rendered as underlined links."
      />

      <Section title="Sizes" description="lg uses the body font size (default); md uses 14px for denser layouts.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-grey-400)' }}>LG</span>
            <Breadcrumb items={deepItems} size="lg" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-grey-400)' }}>MD</span>
            <Breadcrumb items={deepItems} size="md" />
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Basic">
        <DemoCanvas>
          <Breadcrumb items={basicItems} />
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      <Section title="Multi-level">
        <DemoCanvas>
          <Breadcrumb items={deepItems} />
        </DemoCanvas>
        <CodeBlock code={deepCode} language="jsx" />
      </Section>

      <Section title="With onClick" description="Use onClick instead of href for client-side navigation in SPAs.">
        <DemoCanvas>
          <Breadcrumb
            items={[
              { label: 'Home', onClick: () => {} },
              { label: 'Products', onClick: () => {} },
              { label: 'Keyboard' },
            ]}
          />
        </DemoCanvas>
        <CodeBlock code={onClickCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Breadcrumb props</h3>
        <PropsTable props={breadcrumbProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 12px' }}>Item shape</h3>
        <PropsTable props={itemProps} />
      </UsageSection>
    </div>
  )
}
