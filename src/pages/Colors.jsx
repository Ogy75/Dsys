import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection } from '../components/Demo'
import styles from './Colors.module.css'

const palettes = [
  {
    name: 'Gray',
    swatches: [
      { token: 'gray-50', value: '#f9f9f9', label: '50' },
      { token: 'gray-100', value: '#f3f3f3', label: '100' },
      { token: 'gray-200', value: '#e5e5e5', label: '200' },
      { token: 'gray-300', value: '#d4d4d4', label: '300' },
      { token: 'gray-400', value: '#a3a3a3', label: '400' },
      { token: 'gray-500', value: '#737373', label: '500' },
      { token: 'gray-600', value: '#525252', label: '600' },
      { token: 'gray-700', value: '#404040', label: '700' },
      { token: 'gray-800', value: '#262626', label: '800' },
      { token: 'gray-900', value: '#171717', label: '900' },
    ],
  },
  {
    name: 'Blue',
    swatches: [
      { token: 'blue-50', value: '#eff6ff', label: '50' },
      { token: 'blue-100', value: '#dbeafe', label: '100' },
      { token: 'blue-500', value: '#3b82f6', label: '500' },
      { token: 'blue-600', value: '#2563eb', label: '600' },
      { token: 'blue-700', value: '#1d4ed8', label: '700' },
    ],
  },
  {
    name: 'Green',
    swatches: [
      { token: 'green-50', value: '#f0fdf4', label: '50' },
      { token: 'green-100', value: '#dcfce7', label: '100' },
      { token: 'green-500', value: '#22c55e', label: '500' },
      { token: 'green-600', value: '#16a34a', label: '600' },
    ],
  },
  {
    name: 'Red',
    swatches: [
      { token: 'red-50', value: '#fef2f2', label: '50' },
      { token: 'red-100', value: '#fee2e2', label: '100' },
      { token: 'red-500', value: '#ef4444', label: '500' },
      { token: 'red-600', value: '#dc2626', label: '600' },
    ],
  },
  {
    name: 'Yellow',
    swatches: [
      { token: 'yellow-50', value: '#fefce8', label: '50' },
      { token: 'yellow-100', value: '#fef9c3', label: '100' },
      { token: 'yellow-500', value: '#eab308', label: '500' },
      { token: 'yellow-600', value: '#ca8a04', label: '600' },
    ],
  },
  {
    name: 'Purple',
    swatches: [
      { token: 'purple-50', value: '#faf5ff', label: '50' },
      { token: 'purple-100', value: '#f3e8ff', label: '100' },
      { token: 'purple-500', value: '#a855f7', label: '500' },
      { token: 'purple-600', value: '#9333ea', label: '600' },
    ],
  },
]

const semanticColors = [
  { name: 'text-primary', value: '#171717', desc: 'Primary text' },
  { name: 'text-secondary', value: '#737373', desc: 'Secondary / subdued text' },
  { name: 'text-tertiary', value: '#a3a3a3', desc: 'Placeholder, hints' },
  { name: 'text-disabled', value: '#d4d4d4', desc: 'Disabled state text' },
  { name: 'text-inverse', value: '#ffffff', desc: 'Text on dark surfaces', border: true },
  { name: 'text-link', value: '#2563eb', desc: 'Clickable links' },
  { name: 'bg-page', value: '#f2f2f2', desc: 'Page background', border: true },
  { name: 'bg-surface', value: '#ffffff', desc: 'Cards, panels', border: true },
  { name: 'bg-subtle', value: '#f9f9f9', desc: 'Subtle backgrounds', border: true },
  { name: 'bg-muted', value: '#f3f3f3', desc: 'Muted backgrounds', border: true },
  { name: 'border', value: '#e5e5e5', desc: 'Default border' },
  { name: 'brand', value: '#2563eb', desc: 'Primary brand color' },
]

const usageCode = `/* Using color tokens via CSS custom properties */
.button {
  background-color: var(--color-brand);
  color: var(--color-text-inverse);
}

.card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
}

.label {
  color: var(--color-text-secondary);
}

/* Direct palette values */
.badge-success {
  background-color: var(--color-green-100);
  color: var(--color-green-600);
}

.badge-error {
  background-color: var(--color-red-100);
  color: var(--color-red-600);
}`

function isDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140
}

export default function Colors() {
  return (
    <div>
      <PageHeader
        title="Colors"
        description="A palette of neutrals plus semantic color roles. Use CSS custom properties (--color-*) to apply colors so themes remain swappable."
      />

      <Section title="Palette">
        {palettes.map((palette) => (
          <div key={palette.name} className={styles.paletteGroup}>
            <span className={styles.paletteName}>{palette.name}</span>
            <div className={styles.swatches}>
              {palette.swatches.map((s) => (
                <div key={s.token} className={styles.swatch}>
                  <div
                    className={styles.swatchColor}
                    style={{
                      backgroundColor: s.value,
                      border: s.value === '#ffffff' || s.value.startsWith('#f') ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <span className={styles.swatchLabel} style={{ color: isDark(s.value) ? '#fff' : '#404040' }}>
                      {s.label}
                    </span>
                  </div>
                  <span className={styles.swatchHex}>{s.value}</span>
                  <span className={styles.swatchToken}>--color-{s.token}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Semantic Colors" description="Semantic tokens map to palette values. Use these instead of raw hex or palette tokens.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0', padding: '0', overflow: 'hidden' }}>
          {semanticColors.map((c, i) => (
            <div key={c.name} className={styles.semanticRow} style={{ borderBottom: i < semanticColors.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div
                className={styles.semanticSwatch}
                style={{ backgroundColor: c.value, border: c.border ? '1px solid var(--color-border)' : 'none' }}
              />
              <code className={styles.semanticToken}>--color-{c.name}</code>
              <span className={styles.semanticValue}>{c.value}</span>
              <span className={styles.semanticDesc}>{c.desc}</span>
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
