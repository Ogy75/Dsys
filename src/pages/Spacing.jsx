import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection } from '../components/Demo'
import styles from './Spacing.module.css'

const scale = [
  { token: '--space-0-5', value: '2px',   rem: '0.125rem' },
  { token: '--space-1',   value: '4px',   rem: '0.25rem' },
  { token: '--space-1-5', value: '6px',   rem: '0.375rem' },
  { token: '--space-2',   value: '8px',   rem: '0.5rem' },
  { token: '--space-2-5', value: '10px',  rem: '0.625rem' },
  { token: '--space-3',   value: '12px',  rem: '0.75rem' },
  { token: '--space-4',   value: '16px',  rem: '1rem' },
  { token: '--space-5',   value: '20px',  rem: '1.25rem' },
  { token: '--space-6',   value: '24px',  rem: '1.5rem' },
  { token: '--space-8',   value: '32px',  rem: '2rem' },
  { token: '--space-10',  value: '40px',  rem: '2.5rem' },
  { token: '--space-12',  value: '48px',  rem: '3rem' },
  { token: '--space-14',  value: '56px',  rem: '3.5rem' },
  { token: '--space-16',  value: '64px',  rem: '4rem' },
  { token: '--space-23',  value: '92px',  rem: '5.75rem' },
  { token: '--space-25',  value: '100px', rem: '6.25rem' },
]

const usageCode = `/* Apply tokens via CSS custom properties */
.card {
  padding: var(--space-6);       /* 24px */
  margin-bottom: var(--space-4); /* 16px */
  gap: var(--space-3);           /* 12px */
}

.badge {
  padding: var(--space-1) var(--space-1-5); /* 4px 6px */
}

.hero {
  padding: var(--space-23) 0; /* 92px */
}`

export default function SpacingPage() {
  return (
    <div>
      <PageHeader title="Spacing" description="A base-4 spacing scale for consistent layout rhythm. All spacing values are multiples of 4px." />
      <Section title="Scale">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', padding: '32px' }}>
          {scale.map((s) => (
            <div key={s.token} className={styles.row}>
              <code className={styles.token}>{s.token}</code>
              <div className={styles.bar} style={{ width: s.value, minWidth: 4 }} />
              <span className={styles.value}>{s.value}</span>
              <span className={styles.rem}>{s.rem}</span>
            </div>
          ))}
        </DemoCanvas>
      </Section>
      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="css" />
      </UsageSection>
    </div>
  )
}
