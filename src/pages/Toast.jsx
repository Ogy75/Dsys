import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { ToastProvider, useToast, POSITIONS } from '../components/Toast'
import { Button } from './Button'
import styles from './Toast.module.css'

// ─── Position picker ──────────────────────────────────────────────────────────

const POSITION_GRID = [
  ['top-left',    'top-center',    'top-right'   ],
  ['',            'center-center', ''            ],
  ['bottom-left', 'bottom-center', 'bottom-right'],
]

function PositionPicker({ value, onChange }) {
  return (
    <div className={styles.positionGrid}>
      {POSITION_GRID.map((row, r) =>
        row.map((pos, c) => (
          <button
            key={`${r}-${c}`}
            type="button"
            className={[
              styles.positionDot,
              pos === '' ? styles.positionDotEmpty : '',
              pos === value ? styles.positionDotActive : '',
            ].join(' ')}
            onClick={() => pos && onChange(pos)}
            aria-label={pos || undefined}
            aria-pressed={pos === value}
            disabled={pos === ''}
          />
        ))
      )}
    </div>
  )
}

// ─── Demo sections ────────────────────────────────────────────────────────────

function VariantDemo({ position }) {
  const { toast } = useToast()
  return (
    <DemoCanvas style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'info',    title: 'Info',    message: 'Your session will expire in 5 minutes.' })}>Info</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'success', title: 'Success', message: 'Changes have been saved successfully.' })}>Success</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'warning', title: 'Warning', message: 'This action cannot be undone.' })}>Warning</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'danger',  title: 'Error',   message: 'Something went wrong. Please try again.' })}>Error</Button>
    </DemoCanvas>
  )
}

const LONG_MESSAGE = 'We detected unusual activity on your account from an unrecognized device in a different location. For your security, we have temporarily limited certain account features. Please review your recent activity and confirm whether this was you before continuing.'

function ReadTimerDemo() {
  const { toast } = useToast()
  return (
    <DemoCanvas style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'warning', title: 'Security alert', message: LONG_MESSAGE })}>
        Trigger long toast
      </Button>
    </DemoCanvas>
  )
}

function DismissibleDemo() {
  const { toast } = useToast()
  return (
    <DemoCanvas style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'info',    title: 'Update available',  message: 'A new version of the app is ready to install.',                          dismissible: true })}>Info</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'success', title: 'File exported',     message: 'Your report has been downloaded successfully.',                          dismissible: true })}>Success</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'warning', title: 'Unsaved changes',   message: 'You have changes that have not been saved yet.',                         dismissible: true })}>Warning</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'danger',  title: 'Payment failed',    message: 'We could not process your payment. Please check your card details.',    dismissible: true })}>Error</Button>
    </DemoCanvas>
  )
}

function ActionDemo() {
  const { toast } = useToast()
  return (
    <DemoCanvas style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'info',    title: 'Update available',  message: 'A new version is ready to install.',            dismissible: true, action: { label: 'Install now',  onClick: () => {} } })}>Info</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'success', title: 'File exported',     message: 'Your report has been downloaded.',              dismissible: true, action: { label: 'Open file',    onClick: () => {} } })}>Success</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'warning', title: 'Unsaved changes',   message: 'You have changes that have not been saved.',    dismissible: true, action: { label: 'Save now',     onClick: () => {} } })}>Warning</Button>
      <Button variant="secondary" size="md" onClick={() => toast({ variant: 'danger',  title: 'Payment failed',    message: 'We could not process your payment.',            dismissible: true, action: { label: 'Retry',        onClick: () => {} } })}>Error</Button>
    </DemoCanvas>
  )
}

// ─── Code samples ─────────────────────────────────────────────────────────────

const providerCode = `import { ToastProvider } from '@/components/Toast'

<ToastProvider position="top-right">
  {/* rest of your app */}
</ToastProvider>`

const variantsCode = `const { toast } = useToast()

toast({ variant: 'info',    title: 'Info',    message: 'Your session will expire in 5 minutes.' })
toast({ variant: 'success', title: 'Success', message: 'Changes have been saved successfully.' })
toast({ variant: 'warning', title: 'Warning', message: 'This action cannot be undone.' })
toast({ variant: 'danger',  title: 'Error',   message: 'Something went wrong. Please try again.' })`

const dismissibleCode = `toast({
  variant: 'warning',
  title: 'Unsaved changes',
  message: 'You have changes that have not been saved yet.',
  dismissible: true,
})`

const actionCode = `toast({
  variant: 'warning',
  title: 'Unsaved changes',
  message: 'You have changes that have not been saved.',
  dismissible: true,
  action: {
    label: 'Save now',
    onClick: () => saveChanges(),
  },
})`

const positionCode = `// All supported positions
<ToastProvider position="top-left" />
<ToastProvider position="top-center" />
<ToastProvider position="top-right" />
<ToastProvider position="center-center" />
<ToastProvider position="bottom-left" />
<ToastProvider position="bottom-center" />
<ToastProvider position="bottom-right" />   {/* default */}`

const toastProps = [
  { name: 'variant', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Sets the icon and tinted background color.' },
  { name: 'title', type: 'string', default: '—', description: 'SemiBold 16px label shown in the header row.' },
  { name: 'message', type: 'string', default: '—', description: 'Optional 14px body text indented to align under the title.' },
  { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a ✕ button; the toast waits for the user to close it. When false, the toast auto-closes after the estimated reading time (minimum 6 s).' },
  { name: 'action', type: '{ label: string, onClick: () => void }', default: '—', description: 'Optional action button rendered above the color bar. Only shown on dismissible toasts.' },
]

const providerProps = [
  { name: 'position', type: "'top-left' | 'top-center' | 'top-right' | 'center-center' | 'bottom-left' | 'bottom-center' | 'bottom-right'", default: "'bottom-right'", description: 'Corner or edge where the toast stack appears.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'The subtree that can call useToast().' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToastPage() {
  const [position, setPosition] = useState('top-right')

  return (
    <ToastProvider position={position}>
      <div>
        <PageHeader
          title="Toast"
          description="Ephemeral notifications rendered in a fixed overlay. Non-dismissible toasts auto-close after the estimated reading time (minimum 6 s). Dismissible toasts stay until the user clicks ✕. All toasts fade out over 120 ms on close."
        />

        <Section
          title="Position"
          description="Choose where toasts appear. The 3×3 grid mirrors the nine screen positions."
        >
          <DemoCanvas style={{ flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <PositionPicker value={position} onChange={setPosition} />
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {position}
            </span>
          </DemoCanvas>
          <CodeBlock code={positionCode} language="jsx" />
        </Section>

        <Section title="Variants" description="Non-dismissible — auto-close after the estimated reading time of the message.">
          <VariantDemo position={position} />
          <CodeBlock code={variantsCode} language="jsx" />
        </Section>

        <Section title="Reading timer" description="Non-dismissible toast with a long message. Auto-closes after the estimated reading time at 200 wpm (minimum 2.5 s). The message below is 43 words → ~13 s.">
          <ReadTimerDemo />
        </Section>

        <Section title="Dismissible" description="Pass dismissible — the toast stays until the user clicks ✕.">
          <DismissibleDemo />
          <CodeBlock code={dismissibleCode} language="jsx" />
        </Section>

        <Section title="With action" description="Pass an action object to add a primary button before the color bar. Only available on dismissible toasts.">
          <ActionDemo />
          <CodeBlock code={actionCode} language="jsx" />
        </Section>

        <UsageSection title="Usage">
          <CodeBlock code={providerCode} language="jsx" />
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>toast() options</h3>
          <PropsTable props={toastProps} />
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>&lt;ToastProvider&gt; props</h3>
          <PropsTable props={providerProps} />
        </UsageSection>
      </div>
    </ToastProvider>
  )
}
