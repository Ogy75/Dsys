import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Tooltip } from '../components/Tooltip'
import { Badge } from '../components/Badge'

/* ── Shared trigger style ─────────────────────────── */
function TriggerBtn({ children }) {
  return (
    <button
      type="button"
      style={{
        padding: '6px 14px',
        borderRadius: 6,
        border: '1px solid #e6e6e6',
        background: '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-small-size)',
        fontWeight: 600,
        color: 'var(--color-grey-600)',
        cursor: 'default',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

/* ── Code snippets ─────────────────────────────────── */
const basicCode = `import { Tooltip } from '@/components/Tooltip'

<Tooltip content="Helpful information goes here">
  <Button variant="secondary">Hover me</Button>
</Tooltip>`

const richCode = `<Tooltip
  title="Tooltip title"
  badge={<Badge variant="green" size="sm">New</Badge>}
  content="A longer description with more context that can wrap across multiple lines."
  side="bottom"
  align="start"
  variant="light"
>
  <Button variant="secondary">Rich tooltip</Button>
</Tooltip>`

const tooltipProps = [
  { name: 'children', type: 'ReactNode', default: '—', description: 'The trigger element. The tooltip is shown on hover.' },
  { name: 'content', type: 'string', default: '—', description: 'Main body text of the tooltip. SemiBold 14px.' },
  { name: 'title', type: 'string', default: '—', description: 'Optional bold title. Bold 16px. Rendered above content.' },
  { name: 'badge', type: 'ReactNode', default: '—', description: 'Optional badge rendered below the title.' },
  { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred side of the trigger. Automatically flips if there is not enough viewport space.' },
  { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Arrow alignment along the tooltip edge. start = left/top, center = middle, end = right/bottom.' },
  { name: 'variant', type: "'dark' | 'light'", default: "'dark'", description: 'Dark (#1a1a1a bg, light text) or light (#f7f7f7 bg, dark text).' },
]

/* ── Arrow position matrix ─────────────────────────── */
function ArrowGrid() {
  const configs = [
    // Top row: side=bottom, arrow on top of tooltip → align affects horizontal position
    { label: 'top-left',     side: 'bottom', align: 'start'  },
    { label: 'top-center',   side: 'bottom', align: 'center' },
    { label: 'top-right',    side: 'bottom', align: 'end'    },
    // Right column: side=left, arrow on right → align affects vertical position
    { label: 'right-top',    side: 'left',   align: 'start'  },
    { label: 'right-center', side: 'left',   align: 'center' },
    { label: 'right-bottom', side: 'left',   align: 'end'    },
    // Bottom row: side=top, arrow on bottom of tooltip → align affects horizontal
    { label: 'bottom-left',  side: 'top',    align: 'start'  },
    { label: 'bottom-center',side: 'top',    align: 'center' },
    { label: 'bottom-right', side: 'top',    align: 'end'    },
    // Left column: side=right, arrow on left → align affects vertical
    { label: 'left-top',     side: 'right',  align: 'start'  },
    { label: 'left-center',  side: 'right',  align: 'center' },
    { label: 'left-bottom',  side: 'right',  align: 'end'    },
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {configs.map(({ label, side, align }) => (
        <Tooltip
          key={label}
          content={`Arrow: ${label}`}
          side={side}
          align={align}
        >
          <TriggerBtn>{label}</TriggerBtn>
        </Tooltip>
      ))}
    </div>
  )
}

export default function TooltipPage() {
  return (
    <div>
      <PageHeader
        title="Tooltip"
        description="A small overlay that reveals contextual information on hover. Supports optional title and badge, dark and light variants, all four sides with start/center/end arrow alignment, and dynamic repositioning at viewport edges."
      />

      <Section title="Arrow positions">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <ArrowGrid />
        </DemoCanvas>
      </Section>

      <Section title="Variants — dark and light">
        <DemoCanvas style={{ gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Tooltip content="Dark tooltip (default)" side="bottom">
            <TriggerBtn>Dark (default)</TriggerBtn>
          </Tooltip>
          <Tooltip content="Light tooltip variant" side="bottom" variant="light">
            <TriggerBtn>Light</TriggerBtn>
          </Tooltip>
        </DemoCanvas>
      </Section>

      <Section title="With title">
        <DemoCanvas style={{ gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Tooltip title="Tooltip title" content="Body text with more context." side="bottom">
            <TriggerBtn>Dark + title</TriggerBtn>
          </Tooltip>
          <Tooltip title="Tooltip title" content="Body text with more context." side="bottom" variant="light">
            <TriggerBtn>Light + title</TriggerBtn>
          </Tooltip>
        </DemoCanvas>
      </Section>

      <Section title="With badge">
        <DemoCanvas style={{ gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Tooltip
            title="Tooltip title"
            badge={<Badge variant="green" size="sm">New</Badge>}
            content="A longer description with more context that can wrap across multiple lines of text."
            side="bottom"
          >
            <TriggerBtn>Dark + badge</TriggerBtn>
          </Tooltip>
          <Tooltip
            title="Tooltip title"
            badge={<Badge variant="purple" size="sm">Beta</Badge>}
            content="A longer description with more context that can wrap across multiple lines of text."
            side="bottom"
            variant="light"
          >
            <TriggerBtn>Light + badge</TriggerBtn>
          </Tooltip>
        </DemoCanvas>
        <CodeBlock code={richCode} language="jsx" />
      </Section>

      <Section title="Sides">
        <DemoCanvas style={{ gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip content="Tooltip on top" side="top">
            <TriggerBtn>Top</TriggerBtn>
          </Tooltip>
          <Tooltip content="Tooltip on bottom" side="bottom">
            <TriggerBtn>Bottom</TriggerBtn>
          </Tooltip>
          <Tooltip content="Tooltip on left" side="left">
            <TriggerBtn>Left</TriggerBtn>
          </Tooltip>
          <Tooltip content="Tooltip on right" side="right">
            <TriggerBtn>Right</TriggerBtn>
          </Tooltip>
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      <Section
        title="Viewport aware"
        description="The tooltip automatically flips to the opposite side when the preferred side would overflow the viewport. Try the buttons near the edges of the page."
      >
        <DemoCanvas style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Tooltip content="Prefers left — flips right near edge" side="left">
            <TriggerBtn>Prefers left</TriggerBtn>
          </Tooltip>
          <Tooltip content="Prefers right — flips left near edge" side="right">
            <TriggerBtn>Prefers right</TriggerBtn>
          </Tooltip>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <PropsTable props={tooltipProps} />
      </UsageSection>
    </div>
  )
}
