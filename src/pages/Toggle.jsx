import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Toggle } from '../components/Toggle'

const usageCode = `import { Toggle } from '@/components/Toggle'

const [on, setOn] = useState(false)

<Toggle checked={on} onChange={setOn} label="Enable notifications" />
<Toggle checked={on} onChange={setOn} variant="square" labelPosition="left" label="Dark mode" />`

const toggleProps = [
  { name: 'checked', type: 'boolean', default: 'false', description: 'Controlled on/off state.' },
  { name: 'onChange', type: '(checked: boolean) => void', default: '—', description: 'Called with the new value when clicked.' },
  { name: 'variant', type: "'rounded' | 'square'", default: "'rounded'", description: 'Rounded uses pill track + circular thumb. Square uses 4px radius track + 2px radius thumb.' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text. When omitted the toggle renders standalone with no wrapper element.' },
  { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Which side the label appears on. Only applies when label is set.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Track stays grey, thumb becomes grey-200.' },
]

function Row({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>{children}</div>
}

export default function TogglePage() {
  const [roundedOn, setRoundedOn] = useState(true)
  const [roundedOff, setRoundedOff] = useState(false)
  const [squareOn, setSquareOn] = useState(true)
  const [squareOff, setSquareOff] = useState(false)

  return (
    <div>
      <PageHeader
        title="Toggle"
        description="A switch control with two variants: rounded (pill + circle thumb) and square (4px radius track + 2px radius thumb). Track is 46×28px with 2px padding. On: green #5CB335. Off/disabled: grey #CCC. Disabled thumb: grey-200."
      />

      <Section title="No label" description="label prop omitted — toggle renders standalone.">
        <DemoCanvas style={{ gap: 16 }}>
          <Toggle checked={roundedOn} onChange={setRoundedOn} />
          <Toggle checked={roundedOff} onChange={setRoundedOff} />
          <Toggle variant="square" checked={squareOn} onChange={setSquareOn} />
          <Toggle variant="square" checked={squareOff} onChange={setSquareOff} />
        </DemoCanvas>
      </Section>

      <Section title="Rounded — label right">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <Row>
            <Toggle checked={roundedOn} onChange={setRoundedOn} label="Label" />
            <Toggle checked={roundedOff} onChange={setRoundedOff} label="Label" />
          </Row>
          <Row>
            <Toggle checked={true} disabled label="Label" />
            <Toggle checked={false} disabled label="Label" />
          </Row>
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="Rounded — label left">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <Row>
            <Toggle checked={roundedOn} onChange={setRoundedOn} label="Label" labelPosition="left" />
            <Toggle checked={roundedOff} onChange={setRoundedOff} label="Label" labelPosition="left" />
          </Row>
          <Row>
            <Toggle checked={true} disabled label="Label" labelPosition="left" />
            <Toggle checked={false} disabled label="Label" labelPosition="left" />
          </Row>
        </DemoCanvas>
      </Section>

      <Section title="Square — label right">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <Row>
            <Toggle variant="square" checked={squareOn} onChange={setSquareOn} label="Label" />
            <Toggle variant="square" checked={squareOff} onChange={setSquareOff} label="Label" />
          </Row>
          <Row>
            <Toggle variant="square" checked={true} disabled label="Label" />
            <Toggle variant="square" checked={false} disabled label="Label" />
          </Row>
        </DemoCanvas>
      </Section>

      <Section title="Square — label left">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <Row>
            <Toggle variant="square" checked={squareOn} onChange={setSquareOn} label="Label" labelPosition="left" />
            <Toggle variant="square" checked={squareOff} onChange={setSquareOff} label="Label" labelPosition="left" />
          </Row>
          <Row>
            <Toggle variant="square" checked={true} disabled label="Label" labelPosition="left" />
            <Toggle variant="square" checked={false} disabled label="Label" labelPosition="left" />
          </Row>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={toggleProps} />
      </UsageSection>
    </div>
  )
}
