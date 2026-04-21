import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Checkbox, CheckboxGroup } from '../components/Checkbox'

/* ── Code snippets ──────────────────────────── */
const singleCode = `import { Checkbox } from '@/components/Checkbox'

const [checked, setChecked] = useState(false)

<Checkbox
  label="Accept terms and conditions"
  checked={checked}
  onChange={setChecked}
/>`

const groupCode = `import { CheckboxGroup } from '@/components/Checkbox'

const [value, setValue] = useState([])

<CheckboxGroup
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
const checkboxProps = [
  { name: 'label', type: 'string', default: '—', description: 'Visible label rendered to the right of the box.' },
  { name: 'helperText', type: 'string', default: '—', description: 'Secondary text rendered below the label.' },
  { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is checked.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows a dash indicator. Overrides checked visually; aria-checked is set to "mixed".' },
  { name: 'onChange', type: '(checked: boolean) => void', default: '—', description: 'Called with the new checked state.' },
  { name: 'value', type: 'string', default: '—', description: 'HTML value attribute used in forms.' },
  { name: 'name', type: 'string', default: '—', description: 'HTML name attribute.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction and applies muted styles.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Applies red border to the box.' },
]

const groupProps = [
  { name: 'options', type: "{ value, label, helperText?, disabled? }[]", default: '[]', description: 'List of checkbox options.' },
  { name: 'value', type: 'string[]', default: '[]', description: 'Array of currently selected values.' },
  { name: 'onChange', type: '(value: string[]) => void', default: '—', description: 'Called with the updated selection array.' },
  { name: 'label', type: 'string', default: '—', description: 'Group label rendered as a <legend>.' },
  { name: 'error', type: 'string', default: '—', description: 'Error message shown below the group; also applies error styling to all boxes.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all options in the group.' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction of the options.' },
]

const OPTIONS = [
  { value: 'apple',  label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const OPTIONS_HELPER = [
  { value: 'email',    label: 'Email notifications',   helperText: 'Receive updates via email.' },
  { value: 'sms',      label: 'SMS notifications',     helperText: 'Receive updates via text message.' },
  { value: 'push',     label: 'Push notifications',    helperText: 'Receive in-app push alerts.' },
]

const OPTIONS_MIXED = [
  { value: 'a', label: 'Available option' },
  { value: 'b', label: 'Disabled option', disabled: true },
  { value: 'c', label: 'Another option' },
]

export default function CheckboxPage() {
  const [single, setSingle] = useState(false)
  const [vertical, setVertical] = useState([])
  const [horizontal, setHorizontal] = useState([])
  const [withHelper, setWithHelper] = useState([])
  const [mixed, setMixed] = useState([])
  const [errGroup, setErrGroup] = useState([])

  // Indeterminate demo: "select all" pattern
  const allFruits = OPTIONS.map(o => o.value)
  const [fruits, setFruits] = useState([])
  const allChecked = fruits.length === allFruits.length
  const someChecked = fruits.length > 0 && !allChecked
  function toggleAll() {
    setFruits(allChecked ? [] : allFruits)
  }

  return (
    <div>
      <PageHeader
        title="Checkbox"
        description="Multi-selection control. Use Checkbox for individual items or CheckboxGroup to manage a set of independent options. Supports indeterminate state, helper text, disabled options, error states, and vertical or horizontal layout."
      />

      <Section title="States">
        <DemoCanvas style={{ gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Checkbox label="Default unchecked" checked={false} />
          <Checkbox label="Default checked" checked={true} />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled unchecked" checked={false} disabled />
          <Checkbox label="Disabled checked" checked={true} disabled />
          <Checkbox label="Disabled indeterminate" indeterminate disabled />
          <Checkbox label="Error" checked={false} error />
        </DemoCanvas>
      </Section>

      <Section title="Single — interactive">
        <DemoCanvas>
          <Checkbox
            label="Accept terms and conditions"
            checked={single}
            onChange={setSingle}
          />
        </DemoCanvas>
        <CodeBlock code={singleCode} language="jsx" />
      </Section>

      <Section title="Indeterminate — select all pattern">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <Checkbox
            label="Select all"
            checked={allChecked}
            indeterminate={someChecked}
            onChange={toggleAll}
          />
          <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {OPTIONS.map(opt => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={fruits.includes(opt.value)}
                onChange={checked =>
                  setFruits(checked
                    ? [...fruits, opt.value]
                    : fruits.filter(v => v !== opt.value))
                }
              />
            ))}
          </div>
        </DemoCanvas>
      </Section>

      <Section title="Group — vertical (default)">
        <DemoCanvas>
          <CheckboxGroup
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
          <CheckboxGroup
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
          <CheckboxGroup
            label="Notifications"
            options={OPTIONS_HELPER}
            value={withHelper}
            onChange={setWithHelper}
          />
        </DemoCanvas>
      </Section>

      <Section title="Mixed disabled options">
        <DemoCanvas>
          <CheckboxGroup
            label="Label"
            options={OPTIONS_MIXED}
            value={mixed}
            onChange={setMixed}
          />
        </DemoCanvas>
      </Section>

      <Section title="Group disabled">
        <DemoCanvas>
          <CheckboxGroup
            label="Label"
            options={OPTIONS}
            value={['apple', 'cherry']}
            disabled
          />
        </DemoCanvas>
      </Section>

      <Section title="Error state">
        <DemoCanvas>
          <CheckboxGroup
            label="Label"
            options={OPTIONS}
            value={errGroup}
            onChange={setErrGroup}
            error={errGroup.length === 0 ? 'Please select at least one option.' : undefined}
          />
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Checkbox props</h3>
        <PropsTable props={checkboxProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>CheckboxGroup props</h3>
        <PropsTable props={groupProps} />
      </UsageSection>
    </div>
  )
}
