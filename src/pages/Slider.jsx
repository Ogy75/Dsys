import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Slider, RangeSlider } from '../components/Slider'

const singleCode = `import { Slider } from '@/components/Slider'

const [value, setValue] = useState(40)

<Slider
  min={0}
  max={100}
  value={value}
  onChange={setValue}
  step={1}
/>`

const rangeCode = `import { RangeSlider } from '@/components/Slider'

const [range, setRange] = useState([15000, 80000])

<RangeSlider
  min={0}
  max={99999}
  value={range}
  onChange={setRange}
  step={1}
/>`

const sliderProps = [
  { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
  { name: 'value', type: 'number', default: '0', description: 'Controlled value (Slider) or [low, high] tuple (RangeSlider).' },
  { name: 'onChange', type: '(value) => void', default: '—', description: 'Called with the new value on change.' },
  { name: 'step', type: 'number', default: '1', description: 'Snap increment.' },
  { name: 'showInput', type: 'boolean', default: 'true', description: 'Show or hide the numeric input box(es) flanking the track.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all interaction. Thumb and fill use grey-400 (#999).' },
]

export default function SliderPage() {
  const [single, setSingle] = useState(40)
  const [range, setRange] = useState([15000, 80000])

  return (
    <div>
      <PageHeader
        title="Slider"
        description="Draggable range control with a tooltip above each thumb. Single-thumb and two-thumb range variants. Track: 4px grey-300. Fill and thumb: grey-600. Input box: grey-300 border, grey-700 on focus. Disabled: grey-400."
      />

      <Section title="Single" description="One thumb fills the track from the left edge.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400 }}>
          <Slider min={0} max={100} value={single} onChange={setSingle} />
        </DemoCanvas>
        <CodeBlock code={singleCode} language="jsx" />
      </Section>

      <Section title="Single — no input" description="Pass showInput={false} to hide the numeric input box.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400 }}>
          <Slider min={0} max={100} value={single} onChange={setSingle} showInput={false} />
        </DemoCanvas>
        <CodeBlock code={`<Slider min={0} max={100} value={value} onChange={setValue} showInput={false} />`} language="jsx" />
      </Section>

      <Section title="Single — Disabled">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400 }}>
          <Slider min={0} max={100} value={40} disabled />
        </DemoCanvas>
      </Section>

      <Section title="Range" description="Two thumbs define a low and high bound. Dragging the track snaps to the nearest thumb.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400 }}>
          <RangeSlider min={0} max={99999} value={range} onChange={setRange} />
        </DemoCanvas>
        <CodeBlock code={rangeCode} language="jsx" />
      </Section>

      <Section title="Range — no input" description="Pass showInput={false} to hide both numeric inputs.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400 }}>
          <RangeSlider min={0} max={99999} value={range} onChange={setRange} showInput={false} />
        </DemoCanvas>
        <CodeBlock code={`<RangeSlider min={0} max={99999} value={range} onChange={setRange} showInput={false} />`} language="jsx" />
      </Section>

      <Section title="Range — Disabled">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400 }}>
          <RangeSlider min={0} max={99999} value={[15000, 80000]} disabled />
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={singleCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props (Slider & RangeSlider)</h3>
        <PropsTable props={sliderProps} />
      </UsageSection>
    </div>
  )
}
