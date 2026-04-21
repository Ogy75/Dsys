import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection } from '../components/Demo'
import styles from './BorderRadius.module.css'

const radii = [
  { token: '--radius-sm',   value: '4px',   label: 'S' },
  { token: '--radius-md',   value: '8px',   label: 'M' },
  { token: '--radius-lg',   value: '16px',  label: 'L' },
  { token: '--radius-xl',   value: '24px',  label: 'XL' },
  { token: '--radius-2xl',  value: '32px',  label: '2XL' },
  { token: '--radius-full', value: '100px', label: 'Full' },
]

const usageCode = `/* Apply via CSS custom properties */
.button  { border-radius: var(--radius-md);   } /* 8px  */
.card    { border-radius: var(--radius-xl);   } /* 24px */
.badge   { border-radius: var(--radius-full); } /* 100px */
.input   { border-radius: var(--radius-md);   } /* 8px  */
.modal   { border-radius: var(--radius-2xl);  } /* 32px */`

export default function BorderRadiusPage() {
  return (
    <div>
      <PageHeader title="Border Radius" description="Six radius values for consistent corner rounding across components." />
      <Section title="Scale">
        <DemoCanvas style={{ flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
          {radii.map((r) => (
            <div key={r.token} className={styles.item}>
              <div
                className={styles.box}
                style={{ borderRadius: r.value }}
              />
              <span className={styles.label}>{r.label}</span>
              <span className={styles.value}>{r.value}</span>
              <code className={styles.token}>{r.token}</code>
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
