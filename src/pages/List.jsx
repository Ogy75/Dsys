import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { List, ListItem } from '../components/List'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Checkbox } from '../components/Checkbox'
import { Radio } from '../components/Radio'
import { Toggle } from '../components/Toggle'
import { Icon } from '../components/Icon'

/* ── Icon helpers ───────────────────────────── */
/* Action icons: 16px — sized for sm IconButton (28px) */
function EditIcon()    { return <Icon name="edit"           size={16} /> }
function DeleteIcon()  { return <Icon name="delete"         size={16} /> }
function CopyIcon()    { return <Icon name="content_copy"   size={16} /> }
function ShareIcon()   { return <Icon name="share"          size={16} /> }
function DownloadIcon(){ return <Icon name="download"       size={16} /> }
function MoreIcon()    { return <Icon name="more_vert"      size={16} /> }

/* Leading icons: 20px */
function FolderIcon()  { return <Icon name="folder"         size={20} /> }
function ImageIcon()   { return <Icon name="image"          size={20} /> }
function MusicIcon()   { return <Icon name="headphones"     size={20} /> }
function VideoIcon()   { return <Icon name="movie"          size={20} /> }
function DocIcon()     { return <Icon name="description"    size={20} /> }
function StarIcon()    { return <Icon name="star"           size={20} /> }
function HomeIcon()    { return <Icon name="home"           size={20} /> }
function SettingsIcon(){ return <Icon name="settings"       size={20} /> }
function PersonIcon()  { return <Icon name="person"         size={20} /> }
function NotifIcon()   { return <Icon name="notifications"  size={20} /> }
function InboxIcon()   { return <Icon name="inbox"          size={20} /> }
function SendIcon()    { return <Icon name="send"           size={20} /> }

/* Trailing chevron: 20px */
function ChevronIcon() { return <Icon name="chevron_right"  size={20} style={{ color: 'var(--color-grey-400)' }} /> }

/* ── Demo data ──────────────────────────────── */
const basicItems = [
  { id: '1', label: 'Dashboard' },
  { id: '2', label: 'Projects' },
  { id: '3', label: 'Team members' },
  { id: '4', label: 'Settings' },
]

const descItems = [
  { id: '1', label: 'Inbox',         description: '12 unread messages' },
  { id: '2', label: 'Sent',          description: 'Last sent 2 hours ago' },
  { id: '3', label: 'Drafts',        description: '3 unsaved drafts' },
  { id: '4', label: 'Archived',      description: 'Auto-archived after 30 days' },
]

const iconItems = [
  { id: '1', label: 'Home',          leading: <HomeIcon /> },
  { id: '2', label: 'Inbox',         leading: <InboxIcon /> },
  { id: '3', label: 'Notifications', leading: <NotifIcon /> },
  { id: '4', label: 'Sent',          leading: <SendIcon /> },
  { id: '5', label: 'Settings',      leading: <SettingsIcon /> },
]

const iconDescItems = [
  { id: '1', label: 'Documents',     description: '128 files',       leading: <FolderIcon /> },
  { id: '2', label: 'Images',        description: '40 files',        leading: <ImageIcon /> },
  { id: '3', label: 'Music',         description: '16 tracks',       leading: <MusicIcon /> },
  { id: '4', label: 'Videos',        description: '8 recordings',    leading: <VideoIcon /> },
]

const avatarItems = [
  { id: '1', label: 'Alice Johnson',   description: 'alice@example.com',   initials: 'AJ' },
  { id: '2', label: 'Ben Carter',      description: 'ben@example.com',     initials: 'BC' },
  { id: '3', label: 'Clara Davis',     description: 'clara@example.com',   initials: 'CD' },
  { id: '4', label: 'David Evans',     description: 'david@example.com',   initials: 'DE' },
]

const trailingItems = [
  { id: '1', label: 'Dashboard',     trailing: 'Jan 12' },
  { id: '2', label: 'Reports',       trailing: 'Dec 28' },
  { id: '3', label: 'Analytics',     trailing: 'Dec 14' },
  { id: '4', label: 'Exports',       trailing: 'Nov 30' },
]

/* ── Code snippets ──────────────────────────── */
const basicCode = `import { List } from '@/components/List'

<List
  items={[
    { id: '1', label: 'Dashboard' },
    { id: '2', label: 'Projects' },
    { id: '3', label: 'Settings' },
  ]}
/>`

const iconCode = `<List
  items={[
    { id: '1', label: 'Home',    leading: <HomeIcon /> },
    { id: '2', label: 'Inbox',   leading: <InboxIcon /> },
    { id: '3', label: 'Profile', leading: <PersonIcon /> },
  ]}
/>`

const avatarCode = `<List>
  <ListItem
    label="Alice Johnson"
    description="alice@example.com"
    leading={<Avatar initials="AJ" />}
    trailing="Admin"
  />
</List>`

const controlsCode = `<List>
  <ListItem
    label="Enable notifications"
    description="Receive alerts for new activity"
    controls={<Toggle checked={checked} onChange={setChecked} />}
  />
</List>`

const actionsCode = `<List>
  <ListItem
    label="design-system.fig"
    description="Figma file · 4.2 MB"
    leading={<DocIcon />}
    trailing="Today"
    actions={[
      { icon: <EditIcon />,   label: 'Rename',   onClick: () => {} },
      { icon: <ShareIcon />,  label: 'Share',    onClick: () => {} },
      { icon: <DeleteIcon />, label: 'Delete',   onClick: () => {} },
    ]}
  />
</List>`

const controlsActionsCode = `<List>
  <ListItem
    label="Send weekly digest"
    description="Every Monday at 9:00 AM"
    leading={<SendIcon />}
    controls={<Toggle checked={on} onChange={setOn} />}
    actions={[
      { icon: <EditIcon />,   label: 'Edit',   onClick: () => {} },
      { icon: <DeleteIcon />, label: 'Delete', onClick: () => {} },
    ]}
  />
</List>`

/* ── Props tables ───────────────────────────── */
const listProps = [
  { name: 'items',   type: 'ListItemDef[]', default: '[]',    description: 'Array of item definitions. Alternatively use ListItem children directly.' },
  { name: 'size',    type: '"sm" | "md" | "lg"', default: '"md"', description: 'Applies uniformly to all items when using the items array API.' },
  { name: 'divider', type: 'boolean',       default: 'false', description: 'Adds a 1px separator between items.' },
  { name: 'className', type: 'string',      default: '—',     description: 'Extra class name on the <ul> element.' },
]

const itemProps = [
  { name: 'label',       type: 'ReactNode', default: '—',      description: 'Primary text.' },
  { name: 'description', type: 'ReactNode', default: '—',      description: 'Secondary text rendered below the label.' },
  { name: 'leading',     type: 'ReactNode', default: '—',      description: 'Icon, avatar, or any node shown on the left.' },
  { name: 'trailing',    type: 'ReactNode', default: '—',      description: 'Text, badge, or any node shown on the right.' },
  { name: 'controls',    type: 'ReactNode', default: '—',      description: 'Checkbox, Radio, or Toggle shown on the far right. Always visible.' },
  { name: 'actions',     type: 'Action[]',  default: '—',      description: 'Up to 3 icon buttons revealed on hover (shape: { icon, label, onClick }).' },
  { name: 'onClick',     type: '() => void',default: '—',      description: 'Makes the row interactive (hover highlight + pointer cursor).' },
  { name: 'selected',    type: 'boolean',   default: 'false',  description: 'Highlights the item as the active / selected row.' },
  { name: 'disabled',    type: 'boolean',   default: 'false',  description: 'Dims the item and removes all interactivity.' },
  { name: 'size',        type: '"sm" | "md" | "lg"', default: '"md"', description: 'Item height: sm 40px, md 56px, lg 64px.' },
]

/* ── Page ───────────────────────────────────── */
export default function ListPage() {
  /* Checkbox state */
  const [checked, setChecked] = useState(['1', '3'])
  function toggleCheck(id) {
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  /* Radio state */
  const [radio, setRadio] = useState('compact')

  /* Toggle state */
  const [toggles, setToggles] = useState({ notif: true, digest: false, tips: true, updates: false })
  function setToggle(key, val) { setToggles(prev => ({ ...prev, [key]: val })) }

  /* Selected row state */
  const [selectedRow, setSelectedRow] = useState('2')

  /* Controls + actions toggle state */
  const [caToggles, setCaToggles] = useState({ send: true, archive: false, forward: true })
  function setCaToggle(key, val) { setCaToggles(prev => ({ ...prev, [key]: val })) }

  return (
    <div>
      <PageHeader
        title="List"
        description="A vertical collection of rows supporting icons, avatars, metadata, controls, and hover-revealed action buttons. Compose via the items array API or by nesting ListItem children directly."
      />

      {/* ── Optional slots ── */}
      <Section title="Optional slots" description="Icons, description, dividers, trailing text, and controls are all independent and optional.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <List divider>
              <ListItem
                label="Label only"
              />
              <ListItem
                label="Label + description"
                description="Secondary line of text"
              />
              <ListItem
                label="Label + icon"
                leading={<Icon name="folder" />}
              />
              <ListItem
                label="Label + icon + description"
                description="All three content slots"
                leading={<Icon name="description" />}
              />
              <ListItem
                label="Label + trailing text"
                trailing="Jan 12"
              />
              <ListItem
                label="Label + icon + trailing"
                leading={<Icon name="inbox" />}
                trailing={<Badge variant="gray">12</Badge>}
              />
              <ListItem
                label="Label + control"
                controls={<Toggle checked onChange={() => {}} />}
              />
            </List>
          </div>
        </DemoCanvas>
      </Section>

      {/* ── Basic ── */}
      <Section title="Default" description="Simple text-only list. All items show a background highlight on hover.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List items={basicItems} />
          </div>
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      {/* ── With description ── */}
      <Section title="With secondary text" description="A description line sits below the label in a smaller, muted style.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List items={descItems} />
          </div>
        </DemoCanvas>
        <CodeBlock code={`<List items={[
  { id: '1', label: 'Inbox', description: '12 unread messages' },
  ...
]} />`} language="jsx" />
      </Section>

      {/* ── With leading icon ── */}
      <Section title="With leading icon" description="Pass any ReactNode to leading — typically a 20px Material icon.">
        <DemoCanvas style={{ gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <List items={iconItems} />
          </div>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <List items={iconDescItems} />
          </div>
        </DemoCanvas>
        <CodeBlock code={iconCode} language="jsx" />
      </Section>

      {/* ── With avatar ── */}
      <Section title="With avatar" description="Use the Avatar component as the leading element for people lists.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <List>
              {avatarItems.map(item => (
                <ListItem
                  key={item.id}
                  label={item.label}
                  description={item.description}
                  leading={<Avatar initials={item.initials} />}
                  trailing={<ChevronIcon />}
                />
              ))}
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={avatarCode} language="jsx" />
      </Section>

      {/* ── With trailing ── */}
      <Section title="With trailing content" description="Right-side slot for metadata text, badges, or chevrons.">
        <DemoCanvas style={{ gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Text</p>
            <List items={trailingItems} />
          </div>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Badge</p>
            <List>
              <ListItem label="Inbox"     trailing={<Badge variant="gray">12</Badge>} />
              <ListItem label="Mentions"  trailing={<Badge variant="red">3</Badge>} />
              <ListItem label="Drafts"    trailing={<Badge variant="yellow">5</Badge>} />
              <ListItem label="Scheduled" trailing={<Badge variant="blue">2</Badge>} />
            </List>
          </div>
        </DemoCanvas>
      </Section>

      {/* ── Divider ── */}
      <Section title="With divider" description="Add divider to draw 1px separators between rows.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List divider>
              <ListItem label="Account"      leading={<PersonIcon />} trailing={<ChevronIcon />} />
              <ListItem label="Notifications" leading={<NotifIcon />} trailing={<ChevronIcon />} />
              <ListItem label="Inbox"        leading={<InboxIcon />}  trailing={<Badge variant="gray">12</Badge>} />
              <ListItem label="Settings"     leading={<SettingsIcon />} trailing={<ChevronIcon />} />
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={`<List divider>\n  <ListItem label="Account" leading={<PersonIcon />} trailing={<ChevronIcon />} />\n  ...\n</List>`} language="jsx" />
      </Section>

      {/* ── Selectable rows ── */}
      <Section title="Selectable rows" description="Pass onClick and selected to track an active row.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List>
              {iconItems.map(item => (
                <ListItem
                  key={item.id}
                  label={item.label}
                  leading={item.leading}
                  selected={selectedRow === item.id}
                  onClick={() => setSelectedRow(item.id)}
                />
              ))}
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={`<List>\n  {items.map(item => (\n    <ListItem\n      key={item.id}\n      label={item.label}\n      selected={selected === item.id}\n      onClick={() => setSelected(item.id)}\n    />\n  ))}\n</List>`} language="jsx" />
      </Section>

      {/* ── Sizes ── */}
      <Section title="Sizes" description="Three height variants: sm (40px), md (56px, default), lg (64px). Icon dimensions scale accordingly: sm 20px, md 24px, lg 32px.">
        <DemoCanvas style={{ gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {['sm', 'md', 'lg'].map(size => (
            <div key={size} style={{ flex: '1 1 260px', minWidth: 220 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{size}</p>
              <List
                size={size}
                items={[
                  { id: '1', label: 'Dashboard', leading: <Icon name="home" /> },
                  { id: '2', label: 'Projects',  leading: <Icon name="folder" /> },
                  { id: '3', label: 'Settings',  leading: <Icon name="settings" /> },
                ]}
              />
            </div>
          ))}
        </DemoCanvas>
      </Section>

      {/* ── Checkbox controls ── */}
      <Section title="Controls — Checkbox" description="Checkbox control on the right. Clicking the row or the checkbox toggles the state.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List divider>
              {[
                { id: '1', label: 'Marketing emails',   description: 'Promotions and announcements' },
                { id: '2', label: 'Product updates',    description: 'New features and improvements' },
                { id: '3', label: 'Security alerts',    description: 'Login and account activity' },
                { id: '4', label: 'Weekly digest',      description: 'Summary of your week' },
              ].map(item => (
                <ListItem
                  key={item.id}
                  label={item.label}
                  description={item.description}
                  selected={checked.includes(item.id)}
                  onClick={() => toggleCheck(item.id)}
                  controls={
                    <Checkbox
                      checked={checked.includes(item.id)}
                      onChange={() => toggleCheck(item.id)}
                    />
                  }
                />
              ))}
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={`<List divider>\n  <ListItem\n    label="Marketing emails"\n    selected={checked}\n    onClick={() => setChecked(!checked)}\n    controls={<Checkbox checked={checked} onChange={setChecked} />}\n  />\n</List>`} language="jsx" />
      </Section>

      {/* ── Radio controls ── */}
      <Section title="Controls — Radio" description="Radio group implemented as a List — only one option selected at a time.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List divider>
              {[
                { id: 'compact',      label: 'Compact',      description: 'Show more content in less space' },
                { id: 'comfortable',  label: 'Comfortable',  description: 'Balanced spacing for readability' },
                { id: 'spacious',     label: 'Spacious',     description: 'Generous padding for touch targets' },
              ].map(item => (
                <ListItem
                  key={item.id}
                  label={item.label}
                  description={item.description}
                  selected={radio === item.id}
                  onClick={() => setRadio(item.id)}
                  controls={
                    <Radio
                      name="density"
                      value={item.id}
                      checked={radio === item.id}
                      onChange={() => setRadio(item.id)}
                    />
                  }
                />
              ))}
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={`<List divider>\n  {options.map(opt => (\n    <ListItem\n      key={opt.id}\n      label={opt.label}\n      selected={radio === opt.id}\n      onClick={() => setRadio(opt.id)}\n      controls={<Radio name="density" value={opt.id} checked={radio === opt.id} onChange={() => setRadio(opt.id)} />}\n    />\n  ))}\n</List>`} language="jsx" />
      </Section>

      {/* ── Toggle controls ── */}
      <Section title="Controls — Toggle" description="Toggle control on the right for boolean on/off settings.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <List divider>
              {[
                { key: 'notif',   label: 'Push notifications',  description: 'Receive alerts on your device' },
                { key: 'digest',  label: 'Email digest',        description: 'Daily summary at 8:00 AM' },
                { key: 'tips',    label: 'Tips and tricks',     description: 'Helpful hints as you work' },
                { key: 'updates', label: 'Product updates',     description: 'Be first to hear about new features' },
              ].map(item => (
                <ListItem
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  controls={
                    <Toggle
                      checked={toggles[item.key]}
                      onChange={val => setToggle(item.key, val)}
                    />
                  }
                />
              ))}
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={controlsCode} language="jsx" />
      </Section>

      {/* ── Icon button group ── */}
      <Section title="Icon button group" description="Up to 3 action buttons in the trailing slot. Revealed on hover; always accessible via keyboard focus.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <List divider>
              <ListItem
                label="design-system.fig"
                description="Figma file · 4.2 MB"
                leading={<DocIcon />}
                trailing="Today"
                actions={[
                  { icon: <EditIcon />,    label: 'Rename', onClick: () => {} },
                  { icon: <ShareIcon />,   label: 'Share',  onClick: () => {} },
                  { icon: <DeleteIcon />,  label: 'Delete', onClick: () => {} },
                ]}
              />
              <ListItem
                label="brand-assets.zip"
                description="Archive · 18.7 MB"
                leading={<FolderIcon />}
                trailing="Yesterday"
                actions={[
                  { icon: <DownloadIcon />, label: 'Download', onClick: () => {} },
                  { icon: <CopyIcon />,     label: 'Copy link', onClick: () => {} },
                  { icon: <DeleteIcon />,   label: 'Delete',    onClick: () => {} },
                ]}
              />
              <ListItem
                label="Q4-report.pdf"
                description="PDF · 1.1 MB"
                leading={<DocIcon />}
                trailing="Dec 28"
                actions={[
                  { icon: <ShareIcon />,    label: 'Share',    onClick: () => {} },
                  { icon: <DownloadIcon />, label: 'Download', onClick: () => {} },
                  { icon: <DeleteIcon />,   label: 'Delete',   onClick: () => {} },
                ]}
              />
              <ListItem
                label="hero-image.png"
                description="PNG · 840 KB"
                leading={<ImageIcon />}
                trailing="Dec 14"
                actions={[
                  { icon: <DownloadIcon />, label: 'Download', onClick: () => {} },
                  { icon: <EditIcon />,     label: 'Edit',     onClick: () => {} },
                  { icon: <DeleteIcon />,   label: 'Delete',   onClick: () => {} },
                ]}
              />
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={actionsCode} language="jsx" />
      </Section>

      {/* ── Controls + actions ── */}
      <Section title="Controls + icon button group" description="Toggle control and action buttons coexist. Controls are always visible; actions reveal on hover.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 520 }}>
            <List divider>
              {[
                { key: 'send',    label: 'Send weekly digest',  description: 'Every Monday at 9:00 AM',      leading: <SendIcon /> },
                { key: 'archive', label: 'Auto-archive read',   description: 'After 7 days of inactivity',   leading: <FolderIcon /> },
                { key: 'forward', label: 'Forward to team',     description: 'CC your default team address',  leading: <ShareIcon /> },
              ].map(item => (
                <ListItem
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  leading={item.leading}
                  controls={
                    <Toggle
                      checked={caToggles[item.key]}
                      onChange={val => setCaToggle(item.key, val)}
                    />
                  }
                  actions={[
                    { icon: <EditIcon />,   label: 'Edit',   onClick: () => {} },
                    { icon: <DeleteIcon />, label: 'Delete', onClick: () => {} },
                  ]}
                />
              ))}
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={controlsActionsCode} language="jsx" />
      </Section>

      {/* ── Disabled ── */}
      <Section title="Disabled" description="Disabled items are dimmed and non-interactive.">
        <DemoCanvas>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <List>
              <ListItem label="Active item"   leading={<HomeIcon />} trailing="Jan 12" />
              <ListItem label="Disabled item" leading={<FolderIcon />} trailing="Unavailable" disabled />
              <ListItem label="Another active"  leading={<StarIcon />} trailing="Dec 28" />
            </List>
          </div>
        </DemoCanvas>
        <CodeBlock code={`<ListItem label="Disabled item" disabled />`} language="jsx" />
      </Section>

      {/* ── Usage + Props ── */}
      <UsageSection title="Usage">
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>List props</h3>
        <PropsTable props={listProps} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 12px' }}>ListItem props</h3>
        <PropsTable props={itemProps} />
      </UsageSection>
    </div>
  )
}
