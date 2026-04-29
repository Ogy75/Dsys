import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Input } from '../components/Input'
import { Button } from './Button'

const basicCode = `<Input fieldLabel="Label" required size="lg" placeholder="Placeholder" />
<Input fieldLabel="Label" required size="lg" value="Input Text" />
<Input fieldLabel="Label" required size="md" placeholder="Placeholder" />
<Input fieldLabel="Label" required size="md" value="Input Text" />`

const stateCode = `// Disabled (label grey, no asterisk per spec)
<Input fieldLabel="Label" size="lg" value="Input Text" disabled />
<Input fieldLabel="Label" size="lg" placeholder="Placeholder" disabled />

// Focused — handled automatically by CSS :focus

// Error
<Input fieldLabel="Label" required size="lg" value="Input Text" error="Error message" />
<Input fieldLabel="Label" required size="md" value="Input Text" error="Error message" />`

const componentCode = `import { Input } from '@/components/Input'

<Input
  fieldLabel="Email"
  required
  size="lg"
  placeholder="you@example.com"
  type="email"
/>

<Input
  size="md"
  ariaLabel="Search"
  placeholder="Search…"
  value={value}
  onChange={e => setValue(e.target.value)}
/>

<Input
  fieldLabel="Email"
  required
  size="md"
  value={value}
  onChange={e => setValue(e.target.value)}
  error={errors.field}
/>`

const inputProps = [
  { name: 'size', type: "'lg' | 'md'", default: "'lg'", description: 'LG: 10px padding. MD: 6px 8px padding.' },
  { name: 'fieldLabel', type: 'string', default: "'Label'", description: 'Visible label (Figma). If omitted and there is no `ariaLabel`, defaults to "Label".' },
  { name: 'label', type: 'string', default: '—', description: 'Alias for `fieldLabel`.' },
  { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Set true to hide the label row (use with `ariaLabel`).' },
  { name: 'ariaLabel', type: 'string', default: '—', description: 'If set without `fieldLabel`/`label`, no visible label; used as input aria-label.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Shows a red asterisk next to the label. Hidden when disabled.' },
  { name: 'placeholder', type: 'string', default: '—', description: 'Placeholder text.' },
  { name: 'type', type: 'string', default: "'text'", description: 'HTML input type.' },
  { name: 'value', type: 'string', default: '—', description: 'Controlled value.' },
  { name: 'onChange', type: '(e) => void', default: '—', description: 'Change handler.' },
  { name: 'error', type: 'string', default: '—', description: 'Error message. Shows red border, red error icon, and red message below right-aligned.' },
  { name: 'helperText', type: 'string', default: '—', description: 'Supporting hint text. Hidden when error is set.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state: grey bg, grey border, grey text.' },
  { name: 'autoComplete', type: 'string', default: "'off'", description: "HTML autocomplete attribute. Set to 'on' or a specific token (e.g. 'email', 'name') to enable browser suggestions." },
  { name: 'passwordToggle', type: 'boolean', default: 'true', description: "When type='password', shows an eye icon button on the right to reveal/hide the value. Set false to disable." },
  { name: 'borderless', type: 'boolean', default: 'false', description: 'Renders the input without a border or background. Useful for inline editing or filter inputs.' },
]

function ErrorToggle({ on, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
      <span style={{ fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)' }}>Error state:</span>
      <Button size="sm" variant={on ? 'primary' : 'secondary'} onClick={onToggle}>
        {on ? 'On' : 'Off'}
      </Button>
    </div>
  )
}

export default function InputPage() {
  const [lgError, setLgError] = useState(true)
  const [mdError, setMdError] = useState(true)

  return (
    <div>
      <PageHeader
        title="Input"
        description={'Matches Figma: SemiBold \u201cLabel\u201d + optional * above the field; default visible text is Label when you do not pass fieldLabel. Manrope Medium 14px inside the input. Two sizes (LG, MD). Use ariaLabel without fieldLabel for labelless fields.'}
      />

      <Section title="LG — States">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 360, gap: 12 }}>
          <Input fieldLabel="Label" required size="lg" value="Input Text" onChange={() => {}} />
          <Input fieldLabel="Label" required size="lg" placeholder="Placeholder" />
          <Input fieldLabel="Label" size="lg" value="Input Text" disabled />
          <Input fieldLabel="Label" size="lg" placeholder="Placeholder" disabled />
          <Input fieldLabel="Label" required size="lg" value="Input Text" error={lgError ? 'Error message' : undefined} onChange={() => {}} />
        </DemoCanvas>
        <ErrorToggle on={lgError} onToggle={() => setLgError(e => !e)} />
        <div style={{ marginBottom: 16 }} />
        <CodeBlock code={basicCode} />
      </Section>

      <Section title="MD — States">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 360, gap: 12 }}>
          <Input fieldLabel="Label" required size="md" value="Input Text" onChange={() => {}} />
          <Input fieldLabel="Label" required size="md" placeholder="Placeholder" />
          <Input fieldLabel="Label" size="md" value="Input Text" disabled />
          <Input fieldLabel="Label" size="md" placeholder="Placeholder" disabled />
          <Input fieldLabel="Label" required size="md" value="Input Text" error={mdError ? 'Error message' : undefined} onChange={() => {}} />
        </DemoCanvas>
        <ErrorToggle on={mdError} onToggle={() => setMdError(e => !e)} />
      </Section>

      <Section title="Password" description="type='password' shows an eye toggle on the right to reveal or hide the value. Set passwordToggle={false} to disable it.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 360, gap: 12 }}>
          <Input fieldLabel="Password" required size="lg" type="password" placeholder="Enter password" />
          <Input fieldLabel="Password" required size="md" type="password" placeholder="Enter password" />
          <Input fieldLabel="Password" required size="lg" type="password" placeholder="Enter password" passwordToggle={false} />
        </DemoCanvas>
      </Section>

      <Section
        title="Optional: no visible label"
        description="Prefer fieldLabel for almost every field. Omit it only when the purpose is obvious (for example inline search). Pass ariaLabel when there is no visible label."
      >
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 360, gap: 12 }}>
          <Input ariaLabel="Example field" size="lg" placeholder="Placeholder" />
          <Input ariaLabel="Example field" size="lg" value="Input Text" onChange={() => {}} />
          <Input ariaLabel="Search" size="md" placeholder="Search…" />
        </DemoCanvas>
        <CodeBlock code={`// Omit fieldLabel only when necessary; set ariaLabel for accessibility
<Input ariaLabel="Search" size="md" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />`} language="jsx" />
      </Section>

      <Section title="LG vs MD side by side">
        <DemoCanvas style={{ alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 280px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LG</p>
            <Input fieldLabel="Label" required size="lg" placeholder="Placeholder" />
            <Input fieldLabel="Label" required size="lg" value="Input Text" onChange={() => {}} />
            <Input fieldLabel="Label" required size="lg" value="Input Text" error={lgError ? 'Error message' : undefined} onChange={() => {}} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 280px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MD</p>
            <Input fieldLabel="Label" required size="md" placeholder="Placeholder" />
            <Input fieldLabel="Label" required size="md" value="Input Text" onChange={() => {}} />
            <Input fieldLabel="Label" required size="md" value="Input Text" error={mdError ? 'Error message' : undefined} onChange={() => {}} />
          </div>
        </DemoCanvas>
        <CodeBlock code={stateCode} />
      </Section>

      <Section
        title="Borderless"
        description="Pass borderless to render the input without a border or background. Useful for inline editing or for filter inputs embedded inside table cells."
      >
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 360, gap: 12 }}>
          <Input fieldLabel="Label" size="lg" placeholder="Placeholder" borderless />
          <Input fieldLabel="Label" size="lg" value="Input Text" onChange={() => {}} borderless />
          <Input fieldLabel="Label" size="md" placeholder="Placeholder" borderless />
          <Input fieldLabel="Label" size="md" value="Input Text" disabled borderless />
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={componentCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={inputProps} />
      </UsageSection>
    </div>
  )
}
