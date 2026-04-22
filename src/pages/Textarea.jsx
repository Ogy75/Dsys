import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Textarea } from '../components/Textarea'

const statesCode = `<Textarea fieldLabel="Label" required placeholder="Add your text here placeholder..." />
<Textarea fieldLabel="Label" required value="Text" onChange={() => {}} />
<Textarea fieldLabel="Label" value="Input Text" disabled onChange={() => {}} />
<Textarea fieldLabel="Label" required value="Input Text" error="Error message" onChange={() => {}} />`

const resizeCode = `<Textarea fieldLabel="Label" resize="horizontal" value="Input Text" onChange={() => {}} />
<Textarea fieldLabel="Label" resize="vertical" value="Input Text" onChange={() => {}} />
<Textarea fieldLabel="Label" resize="both" value="Input Text" onChange={() => {}} />`

const LONG_TEXT = `Line 1: The quick brown fox jumps over the lazy dog.
Line 2: Pack my box with five dozen liquor jugs.
Line 3: How vexingly quick daft zebras jump!
Line 4: The five boxing wizards jump quickly.
Line 5: Sphinx of black quartz, judge my vow.
Line 6: Jackdaws love my big sphinx of quartz.
Line 7: The jay, pig, fox, zebra, and my wolves quack!
Line 8: Blowzy red vixens fight for a quick jump.
Line 9: Bright vixens jump; dozy fowl quack.
Line 10: Quick wafting zephyrs vex bold Jim.
Line 11: Quick zephyrs blow, vexing daft Jim.
Line 12: Sex-charged fop blew my junk TV quiz.
Line 13: How quickly daft jumping zebras vex.
Line 14: Two driven jocks help fax my big quiz.
Line 15: Five quacking zephyrs jolt my wax bed.`

const scrollCode = `<Textarea
  fieldLabel="Notes"
  rows={6}
  value={longText}
  onChange={e => setLongText(e.target.value)}
/>`

const usageCode = `import { Textarea } from '@/components/Textarea'

<Textarea
  fieldLabel="Description"
  required
  placeholder="Add your text here..."
  value={value}
  onChange={e => setValue(e.target.value)}
/>

<Textarea
  fieldLabel="Notes"
  resize="vertical"
  rows={8}
  value={notes}
  onChange={e => setNotes(e.target.value)}
  error={errors.notes}
/>`

const textareaProps = [
  { name: 'fieldLabel', type: 'string', default: "'Label'", description: 'Visible label text. Falls back to "Label" when omitted.' },
  { name: 'label', type: 'string', default: '—', description: 'Alias for fieldLabel.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Shows a red asterisk next to the label. Hidden when disabled.' },
  { name: 'placeholder', type: 'string', default: '—', description: 'Placeholder text.' },
  { name: 'value', type: 'string', default: '—', description: 'Controlled value.' },
  { name: 'onChange', type: '(e) => void', default: '—', description: 'Change handler.' },
  { name: 'error', type: 'string', default: '—', description: 'Error message. Shows red border and red message below right-aligned.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state: grey bg, grey border, grey text, no asterisk.' },
  { name: 'resize', type: "'none' | 'horizontal' | 'vertical' | 'both'", default: "'none'", description: 'Controls which axes the user can resize the textarea.' },
  { name: 'rows', type: 'number', default: '6', description: 'Number of visible text rows. Controls initial height.' },
  { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Visually hides the label while keeping it accessible for screen readers.' },
  { name: 'inputRef', type: 'React.Ref', default: '—', description: 'Ref forwarded to the underlying textarea DOM element.' },
  { name: 'onKeyDown', type: '(e) => void', default: '—', description: 'Keydown handler on the textarea. Useful for shortcuts like Cmd+Enter to submit.' },
]

export default function TextareaPage() {
  const [errorOn, setErrorOn] = useState(true)
  const [scrollText, setScrollText] = useState(LONG_TEXT)

  return (
    <div>
      <PageHeader
        title="Textarea"
        description="Multi-line text input. Supports required/optional labels, error state, disabled state, and per-axis resize control."
      />

      <Section title="States">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400, gap: 16 }}>
          <Textarea fieldLabel="Label" required placeholder="Add your text here placeholder..." />
          <Textarea fieldLabel="Label" required value="Text" onChange={() => {}} />
          <Textarea fieldLabel="Label" value="Input Text" disabled onChange={() => {}} />
          <Textarea
            fieldLabel="Label"
            required
            placeholder="Add your text here placeholder..."
            error={errorOn ? 'Error message' : undefined}
          />
        </DemoCanvas>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)' }}>Error state:</span>
          <button
            type="button"
            onClick={() => setErrorOn(v => !v)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              padding: '2px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-grey-300)',
              background: errorOn ? 'var(--color-grey-800)' : 'var(--color-white)',
              color: errorOn ? 'var(--color-white)' : 'var(--color-grey-800)',
              cursor: 'pointer',
            }}
          >
            {errorOn ? 'On' : 'Off'}
          </button>
        </div>
        <div style={{ marginTop: 16 }} />
        <CodeBlock code={statesCode} language="jsx" />
      </Section>

      <Section title="Resize" description="Pass resize='horizontal', 'vertical', or 'both' to let users drag to resize on that axis. A grip indicator appears in the bottom-right corner.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400, gap: 16 }}>
          <Textarea fieldLabel="Horizontal only" resize="horizontal" value="Drag the right edge to resize." onChange={() => {}} />
          <Textarea fieldLabel="Vertical only" resize="vertical" value="Drag the bottom edge to resize." onChange={() => {}} />
          <Textarea fieldLabel="Both axes" resize="both" value="Drag any corner to resize." onChange={() => {}} />
        </DemoCanvas>
        <CodeBlock code={resizeCode} language="jsx" />
      </Section>

      <Section title="Scroll" description="When content exceeds the fixed row height, a scrollbar appears. The textarea height stays fixed and text scrolls inside.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 400, gap: 16 }}>
          <Textarea
            fieldLabel="Notes"
            rows={6}
            value={scrollText}
            onChange={e => setScrollText(e.target.value)}
          />
        </DemoCanvas>
        <CodeBlock code={scrollCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={textareaProps} />
      </UsageSection>
    </div>
  )
}
