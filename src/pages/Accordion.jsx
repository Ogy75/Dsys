import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Accordion } from '../components/Accordion'

const basicItems = [
  {
    id: 'spacing',
    title: 'What is a spacing scale?',
    content: 'A spacing scale is a set of predefined values used to maintain consistent margins, paddings, and gaps throughout a design system. Using a scale prevents arbitrary values and creates visual rhythm across components.',
  },
  {
    id: 'tokens',
    title: 'How do design tokens work?',
    content: 'Design tokens are named values that store design decisions — colours, typography, spacing, and more. They decouple the visual spec from implementation, so a single change propagates everywhere the token is referenced.',
  },
  {
    id: 'components',
    title: 'When should I build a new component?',
    content: 'Build a new component when the same pattern appears in three or more places and cannot be adequately covered by combining existing primitives. Premature abstraction adds maintenance overhead without delivering reuse benefits.',
  },
  {
    id: 'accessibility',
    title: 'What accessibility standards should components meet?',
    content: 'Components should conform to WCAG 2.1 AA at minimum. Key requirements include a 4.5:1 contrast ratio for normal text, visible focus indicators, keyboard operability, and appropriate ARIA roles and attributes.',
  },
  {
    id: 'versioning',
    title: 'How is the design system versioned?',
    content: 'The design system follows semantic versioning. Breaking changes increment the major version, new backwards-compatible additions increment the minor version, and bug fixes increment the patch version.',
  },
]

const preOpenItems = basicItems.map((item, i) => ({
  ...item,
  defaultOpen: i === 0,
}))

const richItems = [
  {
    id: 'colours',
    title: 'Colour palette overview',
    content: (
      <div>
        <p style={{ marginBottom: 12, color: 'var(--color-text-primary)' }}>
          The palette is split into two layers: primitive tokens (raw hex values) and semantic tokens (purpose-driven aliases).
        </p>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text-primary)' }}>
          <li><strong>Primitive</strong> — greyscale, brand green, blue, red, yellow, purple</li>
          <li><strong>Semantic</strong> — text-primary, text-secondary, bg-surface, border, etc.</li>
          <li>Always reference semantic tokens in components to support future theming</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'typography',
    title: 'Typography guidelines',
    content: (
      <div>
        <p style={{ marginBottom: 12, color: 'var(--color-text-primary)' }}>
          All text uses the Manrope typeface. The scale covers five heading levels and three body styles.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { label: 'H1', size: '48px / 600' },
            { label: 'H2', size: '40px / 600' },
            { label: 'H3', size: '32px / 600' },
            { label: 'Body', size: '16px / 500' },
            { label: 'Small', size: '14px / 500' },
          ].map(({ label, size }) => (
            <div key={label} style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>
              <span style={{ minWidth: 40, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</span>
              <span>{size}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'icons',
    title: 'Icon usage',
    content: (
      <p style={{ color: 'var(--color-text-primary)' }}>
        Icons use the Material Symbols Outlined variable font with fill=1, weight=400, grade=0, and optical size=24.
        Always set <code style={{ background: 'var(--color-grey-100)', padding: '1px 5px', borderRadius: 4, fontSize: 13 }}>aria-hidden="true"</code> on decorative icons.
        Interactive icons must have an accessible label on their parent button.
      </p>
    ),
  },
]

/* ── Code snippets ────────────────────────────────────────── */
const basicCode = `import { Accordion } from '@/components/Accordion'

<Accordion
  items={[
    { id: 'a', title: 'Question one', content: 'Answer one.' },
    { id: 'b', title: 'Question two', content: 'Answer two.' },
  ]}
/>`

const singleCode = `<Accordion
  items={items}
  allowMultiple={false}
/>`

const toggleAllCode = `<Accordion
  items={items}
  showToggleAll
/>`

const preOpenCode = `<Accordion
  items={[
    { id: 'a', title: 'Pre-opened', content: '...', defaultOpen: true },
    { id: 'b', title: 'Closed', content: '...' },
  ]}
/>`

const accordionProps = [
  { name: 'items', type: 'AccordionItem[]', default: '[]', description: 'Array of accordion items to render.' },
  { name: 'size', type: '"lg" | "md"', default: '"lg"', description: 'Header height. lg = 40px, md = 32px.' },
  { name: 'chevronPosition', type: '"right" | "left"', default: '"right"', description: 'Position of the chevron icon relative to the title.' },
  { name: 'allowMultiple', type: 'boolean', default: 'true', description: 'When false, opening one item closes all others.' },
  { name: 'showToggleAll', type: 'boolean', default: 'false', description: 'Shows Expand all / Collapse all buttons above the list.' },
  { name: 'defaultValue', type: 'string[]', default: '—', description: 'Uncontrolled initial open item IDs. Falls back to items with defaultOpen: true.' },
  { name: 'value', type: 'string[]', default: '—', description: 'Controlled open item IDs. Pair with onChange.' },
  { name: 'onChange', type: '(ids: string[]) => void', default: '—', description: 'Called with the new array of open IDs on every toggle.' },
]

const itemProps = [
  { name: 'id', type: 'string', default: '—', description: 'Unique identifier for the item.' },
  { name: 'title', type: 'ReactNode', default: '—', description: 'Header label displayed in the trigger row.' },
  { name: 'content', type: 'ReactNode', default: '—', description: 'Body content revealed when the item is open.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Pre-opens this item in uncontrolled mode.' },
]

export default function AccordionPage() {
  const [controlled, setControlled] = useState(['spacing'])

  return (
    <div>
      <PageHeader
        title="Accordion"
        description="A vertically stacked set of interactive headings that reveal or hide associated content. Supports multiple open panels, single-select mode, pre-opened items, and an optional Expand all / Collapse all toolbar."
      />

      <Section title="Large (default)">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={basicItems} />
          </div>
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      <Section title="Medium" description="Compact 32px header — suitable for denser layouts or secondary content areas.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={basicItems} size="md" />
          </div>
        </DemoCanvas>
        <CodeBlock code={`<Accordion items={items} size="md" />`} language="jsx" />
      </Section>

      <Section title="Chevron left" description="Pass chevronPosition=&quot;left&quot; to place the icon before the title.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={basicItems} chevronPosition="left" />
          </div>
        </DemoCanvas>
        <CodeBlock code={`<Accordion items={items} chevronPosition="left" />`} language="jsx" />
      </Section>

      <Section title="Single select" description="Only one panel can be open at a time. Opening a new item automatically closes the previous one.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={basicItems} allowMultiple={false} />
          </div>
        </DemoCanvas>
        <CodeBlock code={singleCode} language="jsx" />
      </Section>

      <Section title="Pre-opened">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={preOpenItems} />
          </div>
        </DemoCanvas>
        <CodeBlock code={preOpenCode} language="jsx" />
      </Section>

      <Section title="Expand all / Collapse all" description="An optional toolbar above the list for bulk control.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={basicItems} showToggleAll />
          </div>
        </DemoCanvas>
        <CodeBlock code={toggleAllCode} language="jsx" />
      </Section>

      <Section title="Rich content" description="Item content accepts any ReactNode — paragraphs, lists, code, or nested components.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion items={richItems} />
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Controlled">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <Accordion
              items={basicItems}
              value={controlled}
              onChange={setControlled}
            />
          </div>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Accordion props</h3>
        <PropsTable props={accordionProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 12px' }}>Item shape</h3>
        <PropsTable props={itemProps} />
      </UsageSection>
    </div>
  )
}
