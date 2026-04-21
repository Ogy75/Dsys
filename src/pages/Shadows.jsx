import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection } from '../components/Demo'
import styles from './Shadows.module.css'

const shadows = [
  { token: '--shadow-xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)', label: 'XS' },
  { token: '--shadow-sm', value: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)', label: 'SM' },
  { token: '--shadow-md', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)', label: 'MD' },
  { token: '--shadow-lg', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', label: 'LG' },
  { token: '--shadow-xl', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', label: 'XL' },
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
            <div key={s.token} className={styles.card} style={{ boxShadow: s.value }}>
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
