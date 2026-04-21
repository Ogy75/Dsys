import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Drawer } from '../components/Drawer'
import { Button } from './Button'

const BODY_SHORT = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'

const BODY_LONG = Array(16).fill(BODY_SHORT).join('\n\n')

const usageCode = `import { Drawer } from '@/components/Drawer'
import { Button } from '@/components/Button'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  side="right"
  title="Drawer Title"
  footer={<Button onClick={() => setOpen(false)}>Confirm</Button>}
>
  Drawer body content goes here.
</Drawer>`

const drawerProps = [
  { name: 'open', type: 'boolean', default: '—', description: 'Controls visibility.' },
  { name: 'onClose', type: '() => void', default: '—', description: 'Called when the backdrop or Escape key is triggered.' },
  { name: 'side', type: "'left' | 'right'", default: "'right'", description: 'Which edge the drawer slides in from.' },
  { name: 'title', type: 'string', default: '—', description: 'Optional heading. Bold 16px.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Body content. Scrolls vertically when content overflows.' },
  { name: 'footer', type: 'ReactNode', default: '—', description: 'Optional action rendered at the bottom with 40px bottom padding.' },
]

export default function DrawerPage() {
  const [open, setOpen] = useState({
    right: false,
    left: false,
    noTitle: false,
    noFooter: false,
    scroll: false,
  })

  const toggle = (key, val) => setOpen(o => ({ ...o, [key]: val }))

  return (
    <div>
      <PageHeader
        title="Drawer"
        description="A panel that slides in from the left or right edge of the viewport over a darkened backdrop. min-width 240px, max-width 500px, full viewport height. Body content scrolls when it overflows. Background scroll is locked while open."
      />

      <Section title="Side" description="Slides in from the right or left.">
        <DemoCanvas style={{ gap: 12 }}>
          <Button size="lg" onClick={() => toggle('right', true)}>Open right</Button>
          <Button size="lg" variant="secondary" onClick={() => toggle('left', true)}>Open left</Button>
        </DemoCanvas>
        <CodeBlock code={usageCode} language="jsx" />
      </Section>

      <Section title="Optional title" description="title prop omitted — body starts at the top.">
        <DemoCanvas>
          <Button size="lg" onClick={() => toggle('noTitle', true)}>Open without title</Button>
        </DemoCanvas>
      </Section>

      <Section title="Optional footer" description="footer prop omitted — no action button at the bottom.">
        <DemoCanvas>
          <Button size="lg" onClick={() => toggle('noFooter', true)}>Open without footer</Button>
        </DemoCanvas>
      </Section>

      <Section title="Scrollable body" description="Body scrolls when content exceeds the viewport height.">
        <DemoCanvas>
          <Button size="lg" onClick={() => toggle('scroll', true)}>Open with long content</Button>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={drawerProps} />
      </UsageSection>

      <Drawer
        open={open.right}
        onClose={() => toggle('right', false)}
        side="right"
        title="Drawer Title"
        footer={<Button size="lg" onClick={() => toggle('right', false)}>Confirm</Button>}
      >
        <p>{BODY_SHORT}</p>
      </Drawer>

      <Drawer
        open={open.left}
        onClose={() => toggle('left', false)}
        side="left"
        title="Drawer Title"
        footer={<Button size="lg" onClick={() => toggle('left', false)}>Confirm</Button>}
      >
        <p>{BODY_SHORT}</p>
      </Drawer>

      <Drawer
        open={open.noTitle}
        onClose={() => toggle('noTitle', false)}
        side="right"
        footer={<Button size="lg" onClick={() => toggle('noTitle', false)}>Confirm</Button>}
      >
        <p>{BODY_SHORT}</p>
      </Drawer>

      <Drawer
        open={open.noFooter}
        onClose={() => toggle('noFooter', false)}
        side="right"
        title="No Footer"
      >
        <p>{BODY_SHORT}</p>
      </Drawer>

      <Drawer
        open={open.scroll}
        onClose={() => toggle('scroll', false)}
        side="right"
        title="Long Content"
        footer={<Button size="lg" onClick={() => toggle('scroll', false)}>Confirm</Button>}
      >
        {BODY_LONG.split('\n\n').map((p, i) => (
          <p key={i} style={{ marginBottom: 16 }}>{p}</p>
        ))}
      </Drawer>
    </div>
  )
}
