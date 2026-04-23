import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Skeleton, TableSkeleton } from '../components/Skeleton'

const primitiveCode = `import { Skeleton } from '@/components/Skeleton'

// Line of text
<Skeleton width={160} height={12} />

// Circle (avatar)
<Skeleton width={40} height={40} circle />

// Block (thumbnail / card)
<Skeleton width={200} height={120} radius={8} block />`

const tableCode = `import { TableSkeleton } from '@/components/Skeleton'

{loading
  ? <TableSkeleton rows={8} columns={5} checkbox avatarFirstCol />
  : <Table data={data} columns={cols} />
}`

const tableCustomCode = `// Columns as explicit flex widths
<TableSkeleton
  rows={6}
  columns={['30%', '20%', '20%', '15%', '15%']}
  checkbox
/>`

const skeletonProps = [
  { name: 'width', type: 'number | string', default: "'100%'", description: 'CSS width. Number = px.' },
  { name: 'height', type: 'number | string', default: '12', description: 'CSS height. Number = px.' },
  { name: 'radius', type: 'number | string', default: 'var(--radius-sm)', description: 'Border radius. Ignored when circle is true.' },
  { name: 'circle', type: 'boolean', default: 'false', description: 'Renders as a full circle (border-radius 50%).' },
  { name: 'block', type: 'boolean', default: 'false', description: 'Renders as display: block instead of inline.' },
]

const tableSkeletonProps = [
  { name: 'rows', type: 'number', default: '5', description: 'Number of placeholder rows.' },
  { name: 'columns', type: 'number | string[]', default: '4', description: 'Column count, or an array of explicit flex widths (e.g. ["30%", "20%", "50%"]).' },
  { name: 'checkbox', type: 'boolean', default: 'false', description: 'Include a leading selection checkbox column.' },
  { name: 'showHeader', type: 'boolean', default: 'true', description: 'Render the header row strip.' },
  { name: 'avatarFirstCol', type: 'boolean', default: 'false', description: 'Render a circular avatar placeholder before text in the first column.' },
]

export default function SkeletonPage() {
  return (
    <div>
      <PageHeader
        title="Skeleton"
        description="Animated placeholders shown while content is loading. Use them to preserve layout and signal that data is on the way."
      />

      <Section title="Primitive" description="The Skeleton primitive renders a shimmering block. Combine multiple primitives to mimic the final UI.">
        <DemoCanvas style={{ gap: 'var(--space-6)', alignItems: 'center' }}>
          <Skeleton width={160} height={12} />
          <Skeleton width={40} height={40} circle />
          <Skeleton width={200} height={120} radius={8} block />
        </DemoCanvas>
        <CodeBlock code={primitiveCode} language="jsx" />
      </Section>

      <Section title="Text block" description="Stack lines of varying widths to mimic a paragraph.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--space-2)' }}>
          <Skeleton width="90%" height={12} />
          <Skeleton width="95%" height={12} />
          <Skeleton width="80%" height={12} />
          <Skeleton width="60%" height={12} />
        </DemoCanvas>
      </Section>

      <Section title="Table" description="A ready-made skeleton that matches the Table component's row height, padding, and borders. Swap it in while data is loading.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TableSkeleton rows={6} columns={5} checkbox avatarFirstCol />
        </DemoCanvas>
        <CodeBlock code={tableCode} language="jsx" />
      </Section>

      <Section title="Table — custom column widths" description="Pass an array of flex-basis values to match specific column proportions in the real Table.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TableSkeleton rows={4} columns={['30%', '20%', '20%', '15%', '15%']} checkbox />
        </DemoCanvas>
        <CodeBlock code={tableCustomCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Skeleton props</h3>
        <PropsTable props={skeletonProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 12px' }}>TableSkeleton props</h3>
        <PropsTable props={tableSkeletonProps} />
      </UsageSection>
    </div>
  )
}
