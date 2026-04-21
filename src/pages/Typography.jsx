import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import styles from './Typography.module.css'

const typeScale = [
  { token: 'H1', element: 'h1', size: '48px', weight: '600 — SemiBold', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'H2', element: 'h2', size: '40px', weight: '600 — SemiBold', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'H3', element: 'h3', size: '32px', weight: '600 — SemiBold', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'H4', element: 'h4', size: '24px', weight: '600 — SemiBold', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'H5', element: 'h5', size: '16px', weight: '700 — Bold', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'Body', element: 'p', size: '16px', weight: '500 — Medium', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'Body Medium', element: 'p', size: '16px', weight: '600 — SemiBold', lineHeight: '1.0', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'Small', element: 'small', size: '14px', weight: '500 — Medium', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
  { token: 'Label', element: 'p', size: '14px', weight: '600 — SemiBold', lineHeight: '1.4', sample: 'The quick brown fox jumps over the lazy dog' },
]

const tokenMap = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  Body: 'body',
  'Body Medium': 'bodyMedium',
  Small: 'small',
  Label: 'label',
}

const sampleCode = `import styles from './Typography.module.css'

// Heading 1
<h1 className={styles.h1}>Page Title</h1>

// Heading 2
<h2 className={styles.h2}>Section Heading</h2>

// Heading 3
<h3 className={styles.h3}>Subsection</h3>

// Heading 4
<h4 className={styles.h4}>Card Title</h4>

// H5 / Section label
<h5 className={styles.h5}>Section Title</h5>

// Body
<p className={styles.body}>Regular body copy text.</p>

// Body Medium
<p className={styles.bodyMedium}>Medium weight body text.</p>

// Small
<small className={styles.small}>Small supporting text.</small>

// Label
<label className={styles.label}>Form label</label>`

const cssVarCode = `/* CSS custom properties */
--font-sans: 'Manrope', sans-serif;

--text-h1-size: 48px;    --text-h1-weight: 600;
--text-h2-size: 40px;    --text-h2-weight: 600;
--text-h3-size: 32px;    --text-h3-weight: 600;
--text-h4-size: 24px;    --text-h4-weight: 600;
--text-h5-size: 16px;    --text-h5-weight: 700;
--text-body-size: 16px;  --text-body-weight: 500;
--text-small-size: 14px; --text-small-weight: 500;
--text-label-size: 14px; --text-label-weight: 600;
--line-height-base: 1.4;

/* Text color — Greyscale/Grey 900 */
--color-grey-900: #0d0d0d;
--color-text-primary: #0d0d0d;`

export default function Typography() {
  return (
    <div>
      <PageHeader
        title="Typography"
        description="Type scale based on Manrope. Nine styles covering headings, body copy, and UI labels — all with a 1.4 line-height and zero letter-spacing."
      />

      <Section title="Type Scale" description="All styles use the Manrope typeface.">
        <DemoCanvas style={{ flexDirection: 'column', gap: '20px', padding: '40px 48px', alignItems: 'stretch' }}>
          {typeScale.map((t) => (
            <div key={t.token} className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.token}>{t.token}</span>
                <span className={styles.spec}>{t.size} / {t.weight}</span>
              </div>
              {(() => { const Tag = t.element; return <Tag className={styles[tokenMap[t.token]]}>{t.sample}</Tag> })()}
            </div>
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Scale Table">
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Style</th>
                <th>Element</th>
                <th>Size</th>
                <th>Weight</th>
                <th>Line Height</th>
              </tr>
            </thead>
            <tbody>
              {typeScale.map((t) => (
                <tr key={t.token}>
                  <td><code className={styles.code}>{t.token}</code></td>
                  <td><code className={styles.code}>&lt;{t.element}&gt;</code></td>
                  <td>{t.size}</td>
                  <td>{t.weight}</td>
                  <td>{t.lineHeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={sampleCode} language="jsx" />
        <h3 className={styles.subTitle}>CSS Custom Properties</h3>
        <CodeBlock code={cssVarCode} language="css" />
      </UsageSection>
    </div>
  )
}
