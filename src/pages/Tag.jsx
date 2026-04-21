import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Tag } from '../components/Tag'
import { Icon } from '../components/Icon'

function InfoIcon() {
  return <Icon name="info" size={16} />
}

const usageCode = `import { Tag } from '@/components/Tag'

<Tag>Label</Tag>
<Tag size="lg" icon={<InfoIcon />}>Label</Tag>
<Tag dismissible onDismiss={() => {}}>Label</Tag>
<Tag disabled dismissible>Label</Tag>`

const tagProps = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'SM: 14px label, 2px v-padding, 8px h-padding. MD: 4px v-padding, 12px h-padding. LG: 6px v-padding, 12px h-padding.' },
  { name: 'icon', type: 'ReactNode', default: '—', description: 'Optional 16×16 icon rendered on the left.' },
  { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a close (×) button on the right. Reduces right padding by 4px.' },
  { name: 'onDismiss', type: '() => void', default: '—', description: 'Called when the dismiss button is clicked.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Mutes text and icon color to #cccccc and disables the dismiss button.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Tag label.' },
]

export default function TagPage() {
  const [dismissed, setDismissed] = useState([])
  const dismiss = id => setDismissed(d => [...d, id])
  const reset = () => setDismissed([])

  const sizes = ['sm', 'md', 'lg']

  return (
    <div>
      <PageHeader
        title="Tag"
        description="Pill-shaped label for categorisation and filtering. Supports an optional left icon, a dismiss button, and a disabled state. Single grey background (#e6e6e6), border-radius 100px."
      />

      <Section title="Sizes">
        <DemoCanvas style={{ gap: 8 }}>
          {sizes.map(s => (
            <Tag key={s} size={s}>Tag label</Tag>
          ))}
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="With icon">
        <DemoCanvas style={{ gap: 8 }}>
          {sizes.map(s => (
            <Tag key={s} size={s} icon={<InfoIcon />}>Tag label</Tag>
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Dismissible" description="Click × to remove a tag.">
        <DemoCanvas style={{ gap: 8, flexWrap: 'wrap', minHeight: 32 }}>
          {sizes.filter(s => !dismissed.includes(s)).map(s => (
            <Tag key={s} size={s} icon={<InfoIcon />} dismissible onDismiss={() => dismiss(s)}>
              Tag label
            </Tag>
          ))}
        </DemoCanvas>
        {dismissed.length > 0 && (
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 8, fontSize: 13, cursor: 'pointer', background: 'none', border: '1px solid #d4d4d4', borderRadius: 6, padding: '4px 10px' }}
          >
            Reset
          </button>
        )}
      </Section>

      <Section title="Disabled">
        <DemoCanvas style={{ gap: 8 }}>
          {sizes.map(s => (
            <Tag key={s} size={s} icon={<InfoIcon />} dismissible disabled>
              Tag label
            </Tag>
          ))}
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={tagProps} />
      </UsageSection>
    </div>
  )
}
