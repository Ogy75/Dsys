import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Alert } from '../components/Alert'

const variantsCode = `<Alert variant="info" title="Info">Your session will expire in 5 minutes.</Alert>
<Alert variant="warning" title="Warning">This action cannot be undone.</Alert>
<Alert variant="success" title="Success">Changes have been saved successfully.</Alert>
<Alert variant="danger" title="Danger">Something went wrong. Please try again.</Alert>`

const linkCode = `<Alert variant="info" title="Info" link={{ label: 'Learn more', href: '/docs' }}>
  Your account is missing some information.
</Alert>`

const dismissCode = `<Alert variant="success" title="Success" dismissable>
  Profile updated successfully.
</Alert>

<Alert variant="danger" title="Danger" dismissable onDismiss={() => console.log('dismissed')}>
  Failed to save changes.
</Alert>`

const componentCode = `import { Alert } from '@/components/Alert'

<Alert variant="info" title="Info">
  Your session will expire in 5 minutes.
</Alert>

<Alert variant="warning" title="Warning" link={{ label: 'Review changes', href: '/review' }}>
  You have unsaved changes.
</Alert>

<Alert variant="danger" title="Danger" dismissable onDismiss={handleDismiss}>
  Something went wrong. Please try again.
</Alert>`

const alertProps = [
  { name: 'variant', type: "'info' | 'warning' | 'success' | 'danger'", default: "'info'", description: 'Sets the border color and icon.' },
  { name: 'title', type: 'string', default: '—', description: 'Header text shown inline with the icon. SemiBold 16px.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Body message below the header.' },
  { name: 'link', type: '{ label: string, href?: string }', default: '—', description: 'Optional link rendered below the body message.' },
  { name: 'dismissable', type: 'boolean', default: 'false', description: 'Shows an X button in the header. The alert removes itself when clicked.' },
  { name: 'onDismiss', type: '() => void', default: '—', description: 'Called when the dismiss button is clicked.' },
]

export default function AlertPage() {
  return (
    <div>
      <PageHeader
        title="Alert"
        description="Inline contextual feedback. White background with a colored border and matching icon. Header row shows icon + title; body text and an optional link appear below, indented to align with the title. Four variants: Info, Warning, Success, Danger."
      />

      <Section title="Variants" description="Default state — not dismissable, no link.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Alert variant="info" title="Info">Your session will expire in 5 minutes.</Alert>
          <Alert variant="warning" title="Warning">This action cannot be undone.</Alert>
          <Alert variant="success" title="Success">Changes have been saved successfully.</Alert>
          <Alert variant="danger" title="Danger">Something went wrong. Please try again.</Alert>
        </DemoCanvas>
        <CodeBlock code={variantsCode} />
      </Section>

      <Section title="With link" description="An optional link renders below the body in blue.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Alert variant="info" title="Info" link={{ label: 'Learn more', href: '#' }}>Your account is missing some information.</Alert>
          <Alert variant="warning" title="Warning" link={{ label: 'Review changes', href: '#' }}>You have unsaved changes that will be lost.</Alert>
          <Alert variant="success" title="Success" link={{ label: 'View details', href: '#' }}>Payment completed successfully.</Alert>
          <Alert variant="danger" title="Danger" link={{ label: 'Contact support', href: '#' }}>Failed to process your request.</Alert>
        </DemoCanvas>
        <CodeBlock code={linkCode} />
      </Section>

      <Section title="Dismissable" description="Pass dismissable to show an X button in the header. The alert removes itself on click.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Alert variant="info" title="Info" dismissable>Your session will expire in 5 minutes.</Alert>
          <Alert variant="warning" title="Warning" dismissable>This action cannot be undone.</Alert>
          <Alert variant="success" title="Success" dismissable>Changes have been saved successfully.</Alert>
          <Alert variant="danger" title="Danger" dismissable>Something went wrong. Please try again.</Alert>
        </DemoCanvas>
        <CodeBlock code={dismissCode} />
      </Section>

      <Section title="Dismissable with link">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Alert variant="info" title="Info" dismissable link={{ label: 'Learn more', href: '#' }}>
            Your account is missing some information.
          </Alert>
          <Alert variant="danger" title="Danger" dismissable link={{ label: 'Contact support', href: '#' }}>
            Failed to process your request.
          </Alert>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={componentCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={alertProps} />
      </UsageSection>
    </div>
  )
}
