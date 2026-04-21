import { useState, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Spinner } from '../components/Spinner'
import { SplitButton } from '../components/SplitButton'
import { IconButton } from '../components/IconButton'
import { Icon } from '../components/Icon'
import styles from './Button.module.css'

const SPINNER_SIZE = { sm: 'sm', md: 'sm', lg: 'md' }
const SPINNER_COLOR = {
  primary: 'white', secondary: 'white', danger: 'white',
  ghost: 'gray', outline: 'gray',
}

export function Button({ variant = 'primary', size = 'md', disabled = false, loading = false, iconLeft, iconRight, children, onClick }) {
  const [ripples, setRipples] = useState([])
  const nextId = useRef(0)

  function handleClick(e) {
    if (loading) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextId.current++

    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)

    onClick?.(e)
  }

  const hasIcon = loading || iconLeft || iconRight

  return (
    <button
      className={[
        styles.btn, styles[variant], styles[size],
        loading ? styles.loading : '',
        hasIcon ? styles.withIcon : '',
        (loading || iconLeft) ? styles.hasIconLeft : '',
        iconRight ? styles.hasIconRight : '',
      ].join(' ')}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y }}
        />
      ))}
      {loading
        ? <Spinner size={SPINNER_SIZE[size]} color={SPINNER_COLOR[variant]} />
        : iconLeft && <span className={styles.icon} aria-hidden="true">{iconLeft}</span>
      }
      {children}
      {!loading && iconRight && <span className={styles.icon} aria-hidden="true">{iconRight}</span>}
    </button>
  )
}

function IconDownload()    { return <Icon name="download"        size={16} /> }
function IconPlus()        { return <Icon name="add"             size={16} /> }
function IconArrowRight()  { return <Icon name="arrow_forward"   size={16} /> }
function IconTrash()       { return <Icon name="delete"          size={16} /> }
function IconCheck()       { return <Icon name="check"           size={16} /> }
function IconEdit()        { return <Icon name="edit"            size={20} /> }
function IconClock()       { return <Icon name="schedule"        size={20} /> }
function IconEye()         { return <Icon name="visibility"      size={20} /> }
function IconTrashFilled() { return <Icon name="delete"          size={20} /> }

const variantCode = `<Button variant="primary">Button</Button>
<Button variant="secondary">Button</Button>
<Button variant="danger">Button</Button>
<Button variant="ghost">Button</Button>
<Button variant="outline">Button</Button>`

const sizeCode = `<Button size="lg">Button</Button>
<Button size="md">Button</Button>
<Button size="sm">Button</Button>`

const disabledCode = `<Button variant="primary" disabled>Button</Button>
<Button variant="secondary" disabled>Button</Button>
<Button variant="danger" disabled>Button</Button>
<Button variant="ghost" disabled>Button</Button>
<Button variant="outline" disabled>Button</Button>`

const iconCode = `{/* Prefix icon */}
<Button iconLeft={<IconPlus />}>Add item</Button>
<Button size="lg" iconLeft={<IconDownload />}>Download</Button>

{/* Suffix icon */}
<Button iconRight={<IconArrowRight />}>Continue</Button>
<Button size="lg" variant="outline" iconRight={<IconArrowRight />}>Learn more</Button>`

const splitCode = `import { SplitButton } from '@/components/SplitButton'

const [value, setValue] = useState('')

<SplitButton
  label="Publish"
  onClick={() => publish()}
  items={[
    { value: 'draft',    label: 'Save as draft', icon: <IconEdit /> },
    { value: 'schedule', label: 'Schedule…',     icon: <IconClock /> },
    { value: 'preview',  label: 'Preview',       icon: <IconEye /> },
  ]}
  value={value}
  onChange={setValue}
/>

<SplitButton variant="secondary" size="lg" label="Export" onClick={handleExport}
  items={[
    { value: 'csv',  label: 'Export as CSV'  },
    { value: 'xlsx', label: 'Export as XLSX' },
    { value: 'pdf',  label: 'Export as PDF'  },
  ]}
/>`

const iconOnlyCode = `import { IconButton } from '@/components/IconButton'

<IconButton variant="primary"   size="md" icon={<IconPlus />}       aria-label="Add" />
<IconButton variant="secondary" size="lg" icon={<IconDownload />}   aria-label="Download" />
<IconButton variant="danger"    size="sm" icon={<IconTrash />}      aria-label="Delete" />
<IconButton variant="ghost"     size="md" icon={<IconArrowRight />} aria-label="Next" />
<IconButton variant="outline"   size="md" icon={<IconCheck />}      aria-label="Confirm" />`

const loadingCode = `<Button loading>Saving…</Button>
<Button variant="secondary" loading>Loading</Button>
<Button variant="danger" loading>Deleting…</Button>
<Button variant="ghost" loading>Processing</Button>
<Button variant="outline" loading>Please wait</Button>`

const componentCode = `import { Button } from '@/components/Button'

<Button variant="primary" size="md">
  Save changes
</Button>

<Button variant="danger" size="sm" onClick={handleDelete}>
  Delete
</Button>`

const splitItems = [
  { value: 'draft',    label: 'Save as draft', icon: <IconEdit /> },
  { value: 'schedule', label: 'Schedule…',     icon: <IconClock /> },
  { value: 'preview',  label: 'Preview',       icon: <IconEye /> },
  { value: 'delete',   label: 'Delete',        icon: <IconTrashFilled />, disabled: true },
]

const buttonProps = [
  { name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'", default: "'primary'", description: 'Visual style of the button.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls padding and font size.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button. Each variant has its own disabled color — not a generic opacity reduction.' },
  { name: 'iconLeft', type: 'ReactNode', default: '—', description: 'Icon element rendered before the label. Use a 16×16 SVG with stroke="currentColor".' },
  { name: 'iconRight', type: 'ReactNode', default: '—', description: 'Icon element rendered after the label. Use a 16×16 SVG with stroke="currentColor".' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Disables the button and prepends an appropriately sized spinner. Spinner is white for filled variants, gray for ghost/outline.' },
  { name: 'onClick', type: '() => void', default: '—', description: 'Click handler.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Button label or content.' },
]

const variants = ['primary', 'secondary', 'danger', 'ghost', 'outline']
const sizes = ['lg', 'md', 'sm']

export default function ButtonPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <PageHeader
        title="Button"
        description="Triggers an action. Five variants (Primary, Secondary, Danger, Ghost, Outline), three sizes, and per-variant disabled states. All buttons use a pill shape (border-radius: 40px) and Poppins Medium at 16px for large and medium, Regular at 14px for small."
      />

      <Section title="Variants" description="Default state at medium size.">
        <DemoCanvas style={{ alignItems: 'center' }}>
          {variants.map(v => <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>)}
        </DemoCanvas>
        <CodeBlock code={variantCode} />
      </Section>

      <Section title="Sizes" description="Primary variant shown at all three sizes.">
        <DemoCanvas style={{ alignItems: 'center' }}>
          {sizes.map(s => <Button key={s} size={s}>Button</Button>)}
        </DemoCanvas>
        <CodeBlock code={sizeCode} />
      </Section>

      <Section title="All variants × all sizes">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
          {sizes.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>{s}</span>
              {variants.map(v => <Button key={v} variant={v} size={s}>Button</Button>)}
            </div>
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Disabled states" description="Each variant uses specific disabled colors rather than a generic opacity.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
          {sizes.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>{s}</span>
              {variants.map(v => <Button key={v} variant={v} size={s} disabled>Button</Button>)}
            </div>
          ))}
        </DemoCanvas>
        <CodeBlock code={disabledCode} />
      </Section>

      <Section title="Split button" description="Left side triggers the primary action; right chevron opens a dropdown for secondary options. Available in primary, secondary, and outline variants at LG and MD sizes.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>lg</span>
            <SplitButton variant="primary"   size="lg" label="Publish" items={splitItems} />
            <SplitButton variant="secondary" size="lg" label="Export"  items={splitItems} />
            <SplitButton variant="outline"   size="lg" label="Share"   items={splitItems} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>md</span>
            <SplitButton variant="primary"   size="md" label="Publish" items={splitItems} />
            <SplitButton variant="secondary" size="md" label="Export"  items={splitItems} />
            <SplitButton variant="outline"   size="md" label="Share"   items={splitItems} />
          </div>
        </DemoCanvas>
        <CodeBlock code={splitCode} />
      </Section>

      <Section title="With icons" description="iconLeft and iconRight accept any 16×16 SVG element. LG and MD sizes shown.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>lg</span>
            <Button size="lg" iconLeft={<IconPlus />}>Add item</Button>
            <Button size="lg" variant="secondary" iconLeft={<IconDownload />}>Download</Button>
            <Button size="lg" variant="danger" iconLeft={<IconTrash />}>Delete</Button>
            <Button size="lg" variant="ghost" iconRight={<IconArrowRight />}>Learn more</Button>
            <Button size="lg" variant="outline" iconRight={<IconCheck />}>Confirm</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>md</span>
            <Button size="md" iconLeft={<IconPlus />}>Add item</Button>
            <Button size="md" variant="secondary" iconLeft={<IconDownload />}>Download</Button>
            <Button size="md" variant="danger" iconLeft={<IconTrash />}>Delete</Button>
            <Button size="md" variant="ghost" iconRight={<IconArrowRight />}>Learn more</Button>
            <Button size="md" variant="outline" iconRight={<IconCheck />}>Confirm</Button>
          </div>
        </DemoCanvas>
        <CodeBlock code={iconCode} />
      </Section>

      <Section title="Icon-only buttons" description="Square buttons with a single icon — width equals height at every size. Always pass aria-label for accessibility.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
          {sizes.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>{s}</span>
              {variants.map(v => (
                <IconButton key={v} variant={v} size={s} icon={<IconPlus />} aria-label="Add" />
              ))}
            </div>
          ))}
        </DemoCanvas>
        <CodeBlock code={iconOnlyCode} />
      </Section>

      <Section title="Loading states" description="Pass loading to disable the button and show a spinner before the label. Spinner size adapts to the button size; color adapts to the variant.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
          {sizes.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 28 }}>{s}</span>
              {variants.map(v => <Button key={v} variant={v} size={s} loading>Button</Button>)}
            </div>
          ))}
        </DemoCanvas>
        <CodeBlock code={loadingCode} />
      </Section>

      <Section title="Interactive">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Clicked {count} time{count !== 1 ? 's' : ''}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={() => setCount(c => c + 1)}>Click me</Button>
            <Button variant="outline" onClick={() => setCount(0)}>Reset</Button>
          </div>
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={componentCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Button props</h3>
        <PropsTable props={buttonProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>SplitButton props</h3>
        <PropsTable props={[
          { name: 'variant', type: "'primary' | 'secondary' | 'outline'", default: "'primary'", description: 'Visual style applied to both halves.' },
          { name: 'size', type: "'md' | 'lg'", default: "'md'", description: 'Height of both halves.' },
          { name: 'label', type: 'string', default: "'Button'", description: 'Label for the left (action) half.' },
          { name: 'onClick', type: '() => void', default: '—', description: 'Handler for the left half click.' },
          { name: 'items', type: '{ value, label, icon?, onClick?, disabled? }[]', default: '[]', description: 'Options shown in the dropdown panel. Optional icon renders a 24×24 slot before the label (same pattern as Dropdown).' },
          { name: 'value', type: 'string', default: '—', description: 'Currently selected item value (highlighted in the panel).' },
          { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Called with the selected item value when an option is clicked.' },
        ]} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>IconButton props</h3>
        <PropsTable props={[
          { name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'", default: "'primary'", description: 'Visual style — same variants as Button.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Width and height are equal at every size.' },
          { name: 'icon', type: 'ReactNode', default: '—', description: 'Single icon element rendered centered. Use a 16×16 SVG with stroke="currentColor".' },
          { name: 'aria-label', type: 'string', default: '—', description: 'Accessible label describing the action (required, since there is no visible text).' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
          { name: 'onClick', type: '() => void', default: '—', description: 'Click handler.' },
        ]} />
      </UsageSection>
    </div>
  )
}
