import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import styles from './Card.module.css'

function Card({ title, description, footer, children, padding = 'md' }) {
  return (
    <div className={[styles.card, styles[padding]].join(' ')}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      {children && <div className={styles.body}>{children}</div>}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}

const basicCode = `<Card title="Card Title" description="A short description of what this card contains.">
  Card body content goes here.
</Card>`

const cardProps = [
  { name: 'title', type: 'string', default: '—', description: 'Card heading.' },
  { name: 'description', type: 'string', default: '—', description: 'Subtitle beneath the heading.' },
  { name: 'footer', type: 'ReactNode', default: '—', description: 'Footer content, rendered at the bottom.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Body content.' },
  { name: 'padding', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Internal padding.' },
]

export default function CardPage() {
  return (
    <div>
      <PageHeader title="Card" description="A contained surface for grouping related content. Use for dashboard widgets, list items, and content panels." />

      <Section title="Basic">
        <DemoCanvas>
          <Card title="Getting Started" description="Follow the steps below to configure your workspace.">
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              This is the card body. Add any content here — text, images, form fields, or custom components.
            </p>
          </Card>
        </DemoCanvas>
        <CodeBlock code={basicCode} />
      </Section>

      <Section title="With Footer">
        <DemoCanvas style={{ gap: 20, flexWrap: 'wrap' }}>
          <Card
            title="Pro Plan"
            description="Everything in Free, plus advanced features."
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>$12<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)' }}>/mo</span></span>
                <button className={styles.cardBtn}>Upgrade</button>
              </div>
            }
          >
            <ul style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 2, listStyle: 'none' }}>
              <li>✓ Unlimited projects</li>
              <li>✓ Custom domains</li>
              <li>✓ Priority support</li>
            </ul>
          </Card>
          <Card
            title="Team"
            description="Built for collaboration at scale."
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>$48<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)' }}>/mo</span></span>
                <button className={styles.cardBtn}>Upgrade</button>
              </div>
            }
          >
            <ul style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 2, listStyle: 'none' }}>
              <li>✓ Everything in Pro</li>
              <li>✓ Team management</li>
              <li>✓ SSO / SAML</li>
            </ul>
          </Card>
        </DemoCanvas>
      </Section>

      <Section title="Compact">
        <DemoCanvas style={{ flexWrap: 'wrap', gap: 16 }}>
          {['Design', 'Development', 'Marketing', 'Analytics'].map((name) => (
            <Card key={name} padding="sm">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{name}</p>
                <p style={{ fontSize: 24, fontWeight: 600 }}>{Math.floor(Math.random() * 200 + 50)}</p>
              </div>
            </Card>
          ))}
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={`import { Card } from '@/components/Card'\n\n<Card\n  title="Card Title"\n  description="Optional description"\n  footer={<button>Action</button>}\n>\n  Body content\n</Card>`} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={cardProps} />
      </UsageSection>
    </div>
  )
}
