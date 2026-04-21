import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Spinner } from '../components/Spinner'

const SIZES = ['sm', 'md', 'lg', 'xl']
const COLORS = ['blue', 'green', 'red', 'yellow', 'purple']

const usageCode = `import { Spinner } from '@/components/Spinner'

<Spinner />
<Spinner size="sm" />
<Spinner size="lg" color="blue" />`

const backdropCode = `{/* Place inside a position:relative container */}
<div style={{ position: 'relative' }}>
  <YourContent />
  <Spinner backdrop="white" />
  <Spinner backdrop="black" color="white" />
  <Spinner backdrop="white" text="Loading…" />
  <Spinner backdrop="black" color="white" text="Loading…" />
</div>`

const textCode = `{/* Standalone with label */}
<Spinner text="Loading…" />

{/* Inside backdrop overlay */}
<Spinner backdrop="white" text="Saving changes…" />
<Spinner backdrop="black" color="white" text="Please wait…" />`

const colorCode = `{/* Neutral */}
<Spinner color="dark" />
<Spinner color="gray" />

{/* Semantic — arc uses the 700 token, track uses the 100 token */}
<Spinner color="blue" />
<Spinner color="green" />
<Spinner color="red" />
<Spinner color="yellow" />
<Spinner color="purple" />

{/* White — for dark backgrounds */}
<Spinner color="white" />`

const spinnerProps = [
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter of the spinner. SM: 16px, MD: 24px, LG: 32px, XL: 48px.' },
  { name: 'color', type: "'dark' | 'gray' | 'white' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'", default: "'dark'", description: 'Arc color. Semantic variants use the -700 token for the arc and the -100 token for the track.' },
  { name: 'backdrop', type: "'white' | 'black'", default: '—', description: 'Renders a 40%-opacity overlay that fills the nearest position:relative ancestor, with the spinner centered inside it.' },
  { name: 'text', type: 'string', default: '—', description: 'Label rendered below the spinner with 16px gap. Color is black (#1a1a1a) by default, white when backdrop="black".' },
  { name: 'label', type: 'string', default: "'Loading…'", description: 'Accessible aria-label for screen readers.' },
]

export default function SpinnerPage() {
  return (
    <div>
      <PageHeader
        title="Spinner"
        description="Circular indeterminate progress indicator. Renders as an SVG with a light track and a rotating arc. Eight color variants, four sizes."
      />

      <Section title="Sizes" description="SM 16px · MD 24px · LG 32px · XL 48px.">
        <DemoCanvas style={{ gap: 32, alignItems: 'center' }}>
          {SIZES.map(s => (
            <Spinner key={s} size={s} />
          ))}
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="Colors" description="Neutral variants plus five semantic colors using the -700 arc on a -100 track. White variant for dark backgrounds.">
        <DemoCanvas style={{ gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <Spinner color="dark" />
          <Spinner color="gray" />
          {COLORS.map(c => (
            <Spinner key={c} color={c} />
          ))}
          <div style={{ background: 'var(--color-grey-800)', padding: '12px 16px', borderRadius: 8, display: 'flex' }}>
            <Spinner color="white" />
          </div>
        </DemoCanvas>
        <CodeBlock code={colorCode} language="jsx" />
      </Section>

      <Section title="With text" description="Pass text to show a label below the spinner. Color is black on light backgrounds, white on black backdrops.">
        <DemoCanvas style={{ gap: 48, alignItems: 'center' }}>
          <Spinner text="Loading…" />
          <div style={{ position: 'relative', width: 160, height: 120, background: 'var(--color-grey-100)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--color-grey-400)', fontFamily: 'var(--font-sans)' }}>
            Content
            <Spinner backdrop="white" text="Saving changes…" />
          </div>
          <div style={{ position: 'relative', width: 160, height: 120, background: 'var(--color-grey-800)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--color-grey-500)', fontFamily: 'var(--font-sans)' }}>
            Content
            <Spinner backdrop="black" color="white" text="Please wait…" />
          </div>
        </DemoCanvas>
        <CodeBlock code={textCode} language="jsx" />
      </Section>

      <Section title="Backdrop" description="Fills the nearest position:relative ancestor. Use white on light surfaces, black on dark or image backgrounds.">
        <DemoCanvas style={{ gap: 24, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 120, height: 80, background: 'var(--color-grey-100)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--color-grey-400)', fontFamily: 'var(--font-sans)' }}>
            Content
            <Spinner backdrop="white" />
          </div>
          <div style={{ position: 'relative', width: 120, height: 80, background: 'var(--color-grey-800)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--color-grey-500)', fontFamily: 'var(--font-sans)' }}>
            Content
            <Spinner backdrop="black" color="white" />
          </div>
        </DemoCanvas>
        <CodeBlock code={backdropCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={spinnerProps} />
      </UsageSection>
    </div>
  )
}
