import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection } from '../components/Demo'
import styles from './Shadows.module.css'

const shadows = [
  { token: '--shadow-xs', label: 'XS' },
  { token: '--shadow-sm', label: 'SM' },
  { token: '--shadow-md', label: 'MD' },
  { token: '--shadow-lg', label: 'LG' },
  { token: '--shadow-xl', label: 'XL' },
]

const usageCode = `/* Apply via CSS custom properties */
.card    { box-shadow: var(--shadow-sm); }
.modal   { box-shadow: var(--shadow-xl); }
.popover { box-shadow: var(--shadow-md); }
.tooltip { box-shadow: var(--shadow-xs); }`

export default function ShadowsPage() {
  return (
    <div>
      <PageHeader title="Shadows" description="Five elevation levels. Use to convey hierarchy and depth between surfaces." />
      <Section title="Scale">
        <DemoCanvas style={{ flexWrap: 'wrap', gap: 32, padding: '48px' }}>
          {shadows.map((s) => (
            <div key={s.token} className={styles.card} style={{ boxShadow: `var(${s.token})` }}>
              <span className={styles.label}>{s.label}</span>
              <code className={styles.token}>{s.token}</code>
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
