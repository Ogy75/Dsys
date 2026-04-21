import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { IconButton } from '../components/IconButton'
import { Icon } from '../components/Icon'

function StarIcon() { return <Icon name="star" size={16} /> }
function PlusIcon() { return <Icon name="add" size={16} /> }
function TrashIcon() { return <Icon name="delete" size={16} /> }
function GearIcon() { return <Icon name="settings" size={16} /> }

const variantsCode = `import { IconButton } from '@/components/IconButton'

<IconButton variant="primary"   size="md" icon={<StarIcon />} aria-label="Favourite" />
<IconButton variant="secondary" size="md" icon={<StarIcon />} aria-label="Favourite" />
<IconButton variant="danger"    size="md" icon={<StarIcon />} aria-label="Favourite" />
<IconButton variant="ghost"     size="md" icon={<StarIcon />} aria-label="Favourite" />
<IconButton variant="outline"   size="md" icon={<StarIcon />} aria-label="Favourite" />`

const sizesCode = `<IconButton variant="primary" size="sm" icon={<StarIcon />} aria-label="Small" />
<IconButton variant="primary" size="md" icon={<StarIcon />} aria-label="Medium" />
<IconButton variant="primary" size="lg" icon={<StarIcon />} aria-label="Large" />`

const iconButtonProps = [
  { name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'", default: "'primary'", description: 'Visual style of the button.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls both width and height (sm: 28px, md: 32px, lg: 40px).' },
  { name: 'icon', type: 'ReactNode', default: '—', description: 'SVG icon element rendered inside the button.' },
  { name: 'onClick', type: '(e) => void', default: '—', description: 'Click handler.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction and applies disabled styles.' },
  { name: 'aria-label', type: 'string', default: '—', description: 'Accessible label (required — button has no visible text).' },
]

export default function IconButtonPage() {
  return (
    <div>
      <PageHeader
        title="Icon Button"
        description="A square button with equal width and height containing a single icon. Shares all variants and sizes with Button. Always provide an aria-label since there is no visible text."
      />

      <Section title="Variants" description="All five variants at md size.">
        <DemoCanvas style={{ gap: 12 }}>
          <IconButton variant="primary"   size="md" icon={<StarIcon />} aria-label="Favourite" />
          <IconButton variant="secondary" size="md" icon={<StarIcon />} aria-label="Favourite" />
          <IconButton variant="danger"    size="md" icon={<TrashIcon />} aria-label="Delete" />
          <IconButton variant="ghost"     size="md" icon={<GearIcon />} aria-label="Settings" />
          <IconButton variant="outline"   size="md" icon={<PlusIcon />} aria-label="Add" />
        </DemoCanvas>
        <CodeBlock code={variantsCode} language="jsx" />
      </Section>

      <Section title="Sizes" description="sm (28px), md (32px), lg (40px) — width always equals height.">
        <DemoCanvas style={{ gap: 12, alignItems: 'center' }}>
          <IconButton variant="primary" size="sm" icon={<StarIcon />} aria-label="Small" />
          <IconButton variant="primary" size="md" icon={<StarIcon />} aria-label="Medium" />
          <IconButton variant="primary" size="lg" icon={<StarIcon />} aria-label="Large" />
        </DemoCanvas>
        <CodeBlock code={sizesCode} language="jsx" />
      </Section>

      <Section title="Sizes — all variants">
        <DemoCanvas style={{ flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          {['primary', 'secondary', 'danger', 'ghost', 'outline'].map(v => (
            <div key={v} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <IconButton variant={v} size="sm" icon={<StarIcon />} aria-label={v} />
              <IconButton variant={v} size="md" icon={<StarIcon />} aria-label={v} />
              <IconButton variant={v} size="lg" icon={<StarIcon />} aria-label={v} />
            </div>
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Disabled" description="All variants in disabled state.">
        <DemoCanvas style={{ gap: 12 }}>
          <IconButton variant="primary"   size="md" icon={<StarIcon />} aria-label="Favourite" disabled />
          <IconButton variant="secondary" size="md" icon={<StarIcon />} aria-label="Favourite" disabled />
          <IconButton variant="danger"    size="md" icon={<TrashIcon />} aria-label="Delete" disabled />
          <IconButton variant="ghost"     size="md" icon={<GearIcon />} aria-label="Settings" disabled />
          <IconButton variant="outline"   size="md" icon={<PlusIcon />} aria-label="Add" disabled />
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={variantsCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={iconButtonProps} />
      </UsageSection>
    </div>
  )
}
