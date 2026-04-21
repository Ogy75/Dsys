import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { ProgressBar } from '../components/ProgressBar'

const DURATION = 10000 // 10s demo

function useCyclingProgress() {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let startTime = null

    function tick(now) {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setValue(pct)

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = setTimeout(() => {
          startTime = null
          setValue(0)
          rafRef.current = requestAnimationFrame(tick)
        }, 1000)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(rafRef.current)
    }
  }, [])

  return value
}

function DeterminedDemo({ inverted }) {
  const value = useCyclingProgress()
  return <ProgressBar variant="determined" value={value} inverted={inverted} />
}

const indeterminateCode = `<ProgressBar variant="indeterminate" />`

const determinedCode = `<ProgressBar variant="determined" value={75} />
<ProgressBar variant="determined" value={40} showLabel={false} />`

const labelPositionCode = `{/* Right (default) */}
<ProgressBar variant="determined" value={60} labelPosition="right" />

{/* Left */}
<ProgressBar variant="determined" value={60} labelPosition="left" />

{/* Below — label alignment: left | center (default) | right */}
<ProgressBar variant="determined" value={60} labelPosition="below" labelAlign="left" />
<ProgressBar variant="determined" value={60} labelPosition="below" labelAlign="center" />
<ProgressBar variant="determined" value={60} labelPosition="below" labelAlign="right" />`

const errorCode = `{/* Determined */}
<ProgressBar
  variant="determined"
  value={40}
  status="error"
  errorMessage="Upload failed. Please try again."
/>

{/* Indeterminate */}
<ProgressBar
  variant="indeterminate"
  status="error"
  errorMessage="Connection lost. Retrying…"
/>`

const segmentedCode = `<ProgressBar
  variant="segmented"
  segments={[
    { value: 40, color: 'var(--color-blue-600)' },
    { value: 25, color: 'var(--color-green-600)' },
    { value: 20, color: 'var(--color-yellow-500)' },
  ]}
/>`

const invertedCode = `{/* Place on a dark surface */}
<ProgressBar variant="indeterminate" inverted />
<ProgressBar variant="determined" value={60} inverted />
<ProgressBar variant="determined" value={60} inverted showLabel={false} />`

const usageCode = `import { ProgressBar } from '@/components/ProgressBar'

<ProgressBar variant="indeterminate" />
<ProgressBar variant="determined" value={60} />
<ProgressBar variant="determined" value={40} status="error" errorMessage="Upload failed." />
<ProgressBar variant="segmented" segments={[
  { value: 40, color: 'var(--color-blue-600)' },
  { value: 25, color: 'var(--color-green-600)' },
]} />
<ProgressBar variant="indeterminate" inverted />
<ProgressBar variant="determined" value={60} inverted />`

const propsData = [
  { name: 'variant', type: "'determined' | 'indeterminate' | 'segmented'", default: "'determined'", description: "Determined: fill + label. Indeterminate: sweeping animation. Segmented: multiple colored fills." },
  { name: 'value', type: 'number', default: '0', description: 'Progress percentage (0–100). Only used when variant="determined".' },
  { name: 'showLabel', type: 'boolean', default: 'true', description: 'Show the percentage label. Only applies when variant="determined".' },
  { name: 'labelPosition', type: "'right' | 'left' | 'below'", default: "'right'", description: 'Position of the percentage label relative to the track. Only applies when variant="determined" and showLabel is true.' },
  { name: 'labelAlign', type: "'left' | 'center' | 'right'", default: "'center'", description: 'Horizontal alignment of the label when labelPosition="below".' },
  { name: 'status', type: "'default' | 'error'", default: "'default'", description: 'Error status turns the fill red. Pair with errorMessage to show a description below.' },
  { name: 'errorMessage', type: 'string', default: '—', description: 'Error description rendered below the track in red. Only shown when status="error".' },
  { name: 'segments', type: 'Array<{ value: number, color: string }>', default: '[]', description: 'Array of segments for variant="segmented". Each segment has a value (%) and a CSS color string.' },
  { name: 'inverted', type: 'boolean', default: 'false', description: 'Inverts colors for use on dark backgrounds.' },
]

export default function ProgressPage() {
  return (
    <div>
      <PageHeader
        title="Progress Bar"
        description="Linear progress indicator. Supports determined, indeterminate, segmented, and error states."
      />

      <Section
        title="Indeterminate"
        description="Use when operation duration is unknown. Two bars sweep across the track continuously."
      >
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="indeterminate" />
          </div>
        </DemoCanvas>
        <CodeBlock code={indeterminateCode} language="jsx" />
      </Section>

      <Section
        title="Determined"
        description="Use when progress percentage is known. Demo animates 0 → 100% over 10 s then loops."
      >
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <DeterminedDemo />
          </div>
        </DemoCanvas>
        <CodeBlock code={determinedCode} language="jsx" />
      </Section>

      <Section
        title="Error"
        description="Pass status=&quot;error&quot; to turn the fill red and pair with errorMessage to explain what went wrong."
      >
        <DemoCanvas style={{ flexDirection: 'column', gap: 24, alignItems: 'stretch' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar
              variant="determined"
              value={40}
              status="error"
              errorMessage="Upload failed. Please try again."
            />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar
              variant="indeterminate"
              status="error"
              errorMessage="Connection lost. Retrying…"
            />
          </div>
        </DemoCanvas>
        <CodeBlock code={errorCode} language="jsx" />
      </Section>

      <Section
        title="Segmented"
        description="Multiple colored fills in one track. Each segment receives a value (%) and a CSS color. Segments are stacked left to right."
      >
        <DemoCanvas style={{ flexDirection: 'column', gap: 20, alignItems: 'stretch' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar
              variant="segmented"
              segments={[
                { value: 40, color: 'var(--color-blue-600)' },
                { value: 25, color: 'var(--color-green-600)' },
                { value: 20, color: 'var(--color-yellow-500)' },
              ]}
            />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar
              variant="segmented"
              segments={[
                { value: 60, color: 'var(--color-brand)' },
                { value: 20, color: 'var(--color-grey-400)' },
              ]}
            />
          </div>
        </DemoCanvas>
        <CodeBlock code={segmentedCode} language="jsx" />
      </Section>

      <Section
        title="Without label"
        description="Pass showLabel={false} to hide the percentage."
      >
        <DemoCanvas style={{ flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={30} showLabel={false} />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={70} showLabel={false} />
          </div>
        </DemoCanvas>
        <CodeBlock code={`<ProgressBar variant="determined" value={30} showLabel={false} />`} language="jsx" />
      </Section>

      <Section
        title="Label position"
        description="The percentage label can sit to the right (default), left, or below the track."
      >
        <DemoCanvas style={{ flexDirection: 'column', gap: 20, alignItems: 'stretch' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={60} labelPosition="right" />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={60} labelPosition="left" />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={60} labelPosition="below" labelAlign="left" />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={60} labelPosition="below" labelAlign="center" />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={60} labelPosition="below" labelAlign="right" />
          </div>
        </DemoCanvas>
        <CodeBlock code={labelPositionCode} language="jsx" />
      </Section>

      <Section
        title="Inverted"
        description="Pass inverted for use on dark surfaces. Works with both determined and indeterminate variants."
      >
        <DemoCanvas style={{ background: 'var(--color-grey-800)', borderRadius: 8, flexDirection: 'column', gap: 20, alignItems: 'stretch' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="indeterminate" inverted />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <DeterminedDemo inverted />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ProgressBar variant="determined" value={55} inverted showLabel={false} />
          </div>
        </DemoCanvas>
        <CodeBlock code={invertedCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={propsData} />
      </UsageSection>
    </div>
  )
}
