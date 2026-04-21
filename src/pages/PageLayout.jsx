import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas } from '../components/Demo'
import { Input } from '../components/Input'
import { Button } from './Button'
import styles from './PageLayout.module.css'

export default function PageLayoutPage() {
  const [value, setValue] = useState('')

  return (
    <div>
      <PageHeader
        title="Page Layout"
        description="A responsive single-column layout centered on the page. Scales from 400 px up to 1 200 px with fluid side padding. Uses the H1 type scale, the primary dark button, and a labeled text input."
      />

      <Section title="Demo">
        <DemoCanvas style={{ padding: 0, background: 'var(--color-white)' }}>
          <div className={styles.page}>
            <div className={styles.container}>
              <h1 className={styles.heading}>
                The quick brown fox jumps over the lazy dog
              </h1>

              <Button variant="primary" size="md">Button</Button>

              <div className={styles.inputWrap}>
                <Input
                  label="Label"
                  required
                  placeholder="Input Text"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </DemoCanvas>
      </Section>
    </div>
  )
}
