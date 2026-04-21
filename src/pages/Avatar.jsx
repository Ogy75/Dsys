import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'

const IMAGE_SRC = '/demo_avatar_pic.webp'

function CorporateIcon() {
  return <Icon name="corporate_fare" size={24} />
}

const SIZES = ['xsm', 'sm', 'md', 'xl', 'xxl']

const usageCode = `import { Avatar } from '@/components/Avatar'

// With status badge
<Avatar size="md" src="/demo_avatar_pic.webp" alt="User photo" status="online" />
<Avatar size="md" initials="JD" status="away" />
<Avatar size="md" icon={<CorporateIcon />} status="busy" />`

const avatarProps = [
  { name: 'size', type: "'xsm' | 'sm' | 'md' | 'xl' | 'xxl'", default: "'md'", description: 'Avatar diameter.' },
  { name: 'src', type: 'string', default: '—', description: 'Image URL for a photo avatar.' },
  { name: 'alt', type: 'string', default: '"Avatar"', description: 'Accessible label for photo avatars and icons.' },
  { name: 'initials', type: 'string', default: '"JD"', description: 'Text shown when no image or icon is provided.' },
  { name: 'icon', type: 'ReactNode', default: '—', description: 'Icon element rendered in the center of the avatar.' },
  { name: 'variant', type: "'default' | 'inverse'", default: "'default'", description: 'Dark or light background style.' },
  { name: 'status', type: "'online' | 'away' | 'busy'", default: '—', description: 'Shows a status badge at the bottom-right of the avatar.' },
]

export default function AvatarPage() {
  return (
    <div>
      <PageHeader
        title="Avatar"
        description="Circle avatars for user photos, initials, and company icons. Five sizes with a default dark style and an inverse light style."
      />

      <Section title="User photos">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} src={IMAGE_SRC} alt="User photo" />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Initials avatars">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} initials="JD" />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Company avatars">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} icon={<CorporateIcon />} />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Inverse avatars">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} initials="JD" variant="inverse" />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Status — online" description="Green badge indicating the user is active.">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} src={IMAGE_SRC} alt="User photo" status="online" />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Status — away" description="Amber badge indicating the user is away.">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} src={IMAGE_SRC} alt="User photo" status="away" />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Status — busy" description="Red badge indicating the user is busy.">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={size} size={size} src={IMAGE_SRC} alt="User photo" status="busy" />
          ))}
        </DemoCanvas>
      </Section>

      <Section title="Status with initials & company">
        <DemoCanvas style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {SIZES.map((size) => (
            <Avatar key={`init-${size}`} size={size} initials="JD" status="online" />
          ))}
          {SIZES.map((size) => (
            <Avatar key={`icon-${size}`} size={size} icon={<CorporateIcon />} status="away" />
          ))}
        </DemoCanvas>
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={avatarProps} />
      </UsageSection>
    </div>
  )
}
