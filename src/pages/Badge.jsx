import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Badge } from '../components/Badge'
import { Icon } from '../components/Icon'

const VARIANTS = ['gray', 'green', 'red', 'yellow', 'purple', 'blue', 'cyan', 'lime']

function IconStar() {
  return <Icon name="star" size={16} />
}

function IconCheck() {
  return <Icon name="check" size={16} />
}

function IconDot() {
  return <Icon name="circle" size={16} />
}

const usageCode = `import { Badge } from '@/components/Badge'

<Badge variant="green">Active</Badge>
<Badge variant="red" size="lg">Rejected</Badge>
<Badge variant="blue">Tag</Badge>`

const iconCode = `{/* Icon before label */}
<Badge variant="green" iconLeft={<IconCheck />}>Verified</Badge>
<Badge variant="yellow" iconLeft={<IconDot />}>Pending</Badge>

{/* Icon after label */}
<Badge variant="purple" iconRight={<IconStar />}>Featured</Badge>`

const badgeProps = [
  { name: 'variant', type: "'gray' | 'green' | 'red' | 'yellow' | 'purple' | 'blue' | 'cyan' | 'lime'", default: "'gray'", description: 'Color variant of the badge.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'SM: 24px height, 8px h-padding. MD: 28px height, 12px h-padding. LG: 32px height, 12px h-padding.' },
  { name: 'iconLeft', type: 'ReactNode', default: '—', description: 'Icon rendered before the label. Use 16×16 SVGs. Mutually exclusive with iconRight — if both are provided, iconLeft wins.' },
  { name: 'iconRight', type: 'ReactNode', default: '—', description: 'Icon rendered after the label. Use 16×16 SVGs. Ignored when iconLeft is also set.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Badge label.' },
]

export default function BadgePage() {
  return (
    <div>
      <PageHeader
        title="Badge"
        description="Pill-shaped label with 8 color variants and three sizes. All variants share the same dark green text (#254715) with pastel backgrounds. Border-radius 100px."
      />

      <Section title="Variants — SM">
        <DemoCanvas style={{ flexWrap: 'wrap', gap: 8 }}>
          {VARIANTS.map(v => (
            <Badge key={v} variant={v} size="sm">Badge label</Badge>
          ))}
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="Variants — MD">
        <DemoCanvas style={{ flexWrap: 'wrap', gap: 8 }}>
          {VARIANTS.map(v => (
            <Badge key={v} variant={v}>Badge label</Badge>
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Variants — LG">
        <DemoCanvas style={{ flexWrap: 'wrap', gap: 8 }}>
          {VARIANTS.map(v => (
            <Badge key={v} variant={v} size="lg">Badge label</Badge>
          ))}
        </DemoCanvas>
      </Section>

      <Section title="With icons" description="Pass a 16×16 SVG to iconLeft or iconRight — mutually exclusive, never both. Shown at all sizes.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-grey-500)', minWidth: 28 }}>SM</span>
            <Badge variant="green"  size="sm" iconLeft={<IconCheck />}>Verified</Badge>
            <Badge variant="yellow" size="sm" iconLeft={<IconDot />}>Pending</Badge>
            <Badge variant="red"    size="sm" iconLeft={<IconDot />}>Blocked</Badge>
            <Badge variant="purple" size="sm" iconRight={<IconStar />}>Featured</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-grey-500)', minWidth: 28 }}>MD</span>
            <Badge variant="green"  size="md" iconLeft={<IconCheck />}>Verified</Badge>
            <Badge variant="yellow" size="md" iconLeft={<IconDot />}>Pending</Badge>
            <Badge variant="red"    size="md" iconLeft={<IconDot />}>Blocked</Badge>
            <Badge variant="purple" size="md" iconRight={<IconStar />}>Featured</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-grey-500)', minWidth: 28 }}>LG</span>
            <Badge variant="green"  size="lg" iconLeft={<IconCheck />}>Verified</Badge>
            <Badge variant="yellow" size="lg" iconLeft={<IconDot />}>Pending</Badge>
            <Badge variant="red"    size="lg" iconLeft={<IconDot />}>Blocked</Badge>
            <Badge variant="purple" size="lg" iconRight={<IconStar />}>Featured</Badge>
          </div>
        </DemoCanvas>
        <CodeBlock code={iconCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={badgeProps} />
      </UsageSection>
    </div>
  )
}
