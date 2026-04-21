import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Radio, RadioGroup } from '../components/Radio'

/* ── Code snippets ──────────────────────────── */
const singleCode = `import { Radio } from '@/components/Radio'

const [value, setValue] = useState('')

<Radio
  label="Option label"
  value="a"
  checked={value === 'a'}
  onChange={setValue}
/>`

const groupCode = `import { RadioGroup } from '@/components/Radio'

const [value, setValue] = useState('')

<RadioGroup
  label="Label"
  value={value}
  onChange={setValue}
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ]}
/>`

/* ── Props ──────────────────────────────────── */
const radioProps = [
  { name: 'label', type: 'string', default: '—', description: 'Visible label rendered to the right of the circle.' },
  { name: 'helperText', type: 'string', default: '—', description: 'Secondary text rendered below the label.' },
  { name: 'checked', type: 'boolean', default: 'false', description: 'Whether this radio is selected.' },
  { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called with the radio value when selected.' },
  { name: 'value', type: 'string', default: '—', description: 'Value emitted by onChange.' },
  { name: 'name', type: 'string', default: '—', description: 'HTML name attribute for grouping radios in a form.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction and applies muted styles.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Applies red border to the circle.' },
]

const groupProps = [
  { name: 'options', type: "{ value, label, helperText?, disabled? }[]", default: '[]', description: 'List of radio options.' },
  { name: 'value', type: 'string', default: '—', description: 'Currently selected value.' },
  { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called when a new option is selected.' },
  { name: 'label', type: 'string', default: '—', description: 'Group label rendered as a <legend>.' },
  { name: 'error', type: 'string', default: '—', description: 'Error message shown below the group; also applies error styling to all circles.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all options in the group.' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction of the options.' },
  { name: 'name', type: 'string', default: 'auto', description: 'HTML name shared across all radios. Auto-generated if omitted.' },
]

const OPTIONS = [
  { value: 'apple',  label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const OPTIONS_HELPER = [
  { value: 'free',    label: 'Free',       helperText: 'Up to 3 projects, 1 GB storage.' },
  { value: 'pro',     label: 'Pro',        helperText: 'Unlimited projects, 50 GB storage.' },
  { value: 'team',    label: 'Team',       helperText: 'Everything in Pro plus team management.' },
]

const OPTIONS_MIXED = [
  { value: 'a', label: 'Available option' },
  { value: 'b', label: 'Disabled option', disabled: true },
  { value: 'c', label: 'Another option' },
]

export default function RadioPage() {
  const [single, setSingle] = useState('')
  const [vertical, setVertical] = useState('')
  const [horizontal, setHorizontal] = useState('')
  const [withHelper, setWithHelper] = useState('')
  const [mixed, setMixed] = useState('')
  const [errGroup, setErrGroup] = useState('')

  return (
    <div>
      <PageHeader
        title="Radio"
        description="Single-selection control. Use Radio for individual items or RadioGroup to manage a set of mutually exclusive options. Supports helper text, disabled options, error states, and vertical or horizontal layout."
      />

      <Section title="States">
        <DemoCanvas style={{ gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Radio label="Default unchecked" value="u" checked={false} />
          <Radio label="Default checked" value="c" checked={true} />
          <Radio label="Disabled unchecked" value="du" checked={false} disabled />
          <Radio label="Disabled checked" value="dc" checked={true} disabled />
          <Radio label="Error" value="e" checked={false} error />
        </DemoCanvas>
      </Section>

      <Section title="Single — interactive">
        <DemoCanvas>
          <Radio
            label="Click to select"
            value="x"
            checked={single === 'x'}
            onChange={setSingle}
          />
        </DemoCanvas>
        <CodeBlock code={singleCode} language="jsx" />
      </Section>

      <Section title="Group — vertical (default)">
        <DemoCanvas>
          <RadioGroup
            label="Label"
            options={OPTIONS}
            value={vertical}
            onChange={setVertical}
          />
        </DemoCanvas>
        <CodeBlock code={groupCode} language="jsx" />
      </Section>

      <Section title="Group — horizontal">
        <DemoCanvas>
          <RadioGroup
            label="Label"
            options={OPTIONS}
            value={horizontal}
            onChange={setHorizontal}
            direction="horizontal"
          />
        </DemoCanvas>
      </Section>

      <Section title="With helper text">
        <DemoCanvas>
          <RadioGroup
            label="Plan"
            options={OPTIONS_HELPER}
            value={withHelper}
            onChange={setWithHelper}
          />
        </DemoCanvas>
      </Section>

      <Section title="Mixed disabled options">
        <DemoCanvas>
          <RadioGroup
            label="Label"
            options={OPTIONS_MIXED}
            value={mixed}
            onChange={setMixed}
          />
        </DemoCanvas>
      </Section>

      <Section title="Group disabled">
        <DemoCanvas>
          <RadioGroup
            label="Label"
            options={OPTIONS}
            value="banana"
            disabled
          />
        </DemoCanvas>
      </Section>

      <Section title="Error state">
        <DemoCanvas>
          <RadioGroup
            label="Label"
            options={OPTIONS}
            value={errGroup}
            onChange={setErrGroup}
            error={!errGroup ? 'Please select an option.' : undefined}
          />
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Radio props</h3>
        <PropsTable props={radioProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>RadioGroup props</h3>
        <PropsTable props={groupProps} />
      </UsageSection>
    </div>
  )
}
