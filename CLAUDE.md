# Design System

A React design system component library and documentation site.

## Tech Stack

- **React 18** with JSX (no TypeScript)
- **Vite** for bundling and dev server
- **React Router v6** for navigation
- **CSS Modules** for component styles (no Tailwind, no CSS-in-JS)
- No test framework configured

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
src/
  components/     # Reusable UI components (one .jsx + one .module.css per component)
  pages/          # Demo/doc pages for each component (one per route)
  index.css       # Global CSS reset + design tokens (:root variables)
  App.jsx         # Router setup — all routes defined here
  nav.js          # Sidebar navigation structure
  main.jsx        # React entry point
```

## Adding a New Component

1. **Component file** — `src/components/MyComponent.jsx`
   - Named export: `export function MyComponent({ ... }) {}`
   - Import styles from `./MyComponent.module.css`

2. **CSS Module** — `src/components/MyComponent.module.css`
   - Use design tokens from `src/index.css` (e.g. `var(--radius-full)`, `var(--font-sans)`)
   - No Tailwind classes

3. **Page file** — `src/pages/MyComponent.jsx`
   - Default export
   - Use `PageHeader`, `Section`, `DemoCanvas`, `CodeBlock`, `UsageSection`, `PropsTable` from `../components/Demo`

4. **Register the route** — in `src/App.jsx`:
   - Import the page
   - Replace the `<PlaceholderPage>` route with the real page component

5. **Nav** — the route already exists in `src/nav.js`; no changes needed unless adding a new entry

## Design Tokens (src/index.css)

All tokens are CSS custom properties on `:root`.

### Typography
| Token | Value |
|---|---|
| `--font-sans` | `'Manrope', sans-serif` |
| `--font-mono` | `'JetBrains Mono', monospace` |
| `--text-small-size` | `14px` |
| `--text-small-weight` | `500` |
| `--line-height-base` | `1.4` |

### Spacing
`--space-0-5` (2px) · `--space-1` (4px) · `--space-1-5` (6px) · `--space-2` (8px) · `--space-3` (12px) · `--space-4` (16px) · `--space-5` (20px) · `--space-6` (24px) · `--space-8` (32px)

### Border Radius
| Token | Value |
|---|---|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `24px` |
| `--radius-full` | `100px` |

### Greyscale (Figma spec)
| Token | Hex |
|---|---|
| `--color-grey-50` | `#f7f7f7` |
| `--color-grey-100` | `#f2f2f2` |
| `--color-grey-300` | `#cccccc` |
| `--color-grey-400` | `#a3a3a3` |
| `--color-grey-500` | `#737373` |
| `--color-grey-600` | `#4d4d4d` |
| `--color-grey-800` | `#1a1a1a` |
| `--color-grey-900` | `#0d0d0d` |

### Semantic Colors
| Token | Value |
|---|---|
| `--color-text-primary` | `#0d0d0d` |
| `--color-text-disabled` | `var(--color-gray-300)` → `#d4d4d4` |
| `--color-bg-page` | `#f2f2f2` |
| `--color-bg-surface` | `#ffffff` |
| `--color-border` | `var(--color-gray-200)` → `#e5e5e5` |

### Shadows
`--shadow-xs` · `--shadow-sm` · `--shadow-md` · `--shadow-lg` · `--shadow-xl`

## Demo Page Components (src/components/Demo.jsx)

| Component | Usage |
|---|---|
| `<PageHeader title description />` | Top of every page |
| `<Section title description>` | Wraps each demo block |
| `<DemoCanvas style={{}}>` | Grey-background preview area |
| `<CodeBlock code language />` | Syntax-highlighted code snippet |
| `<UsageSection>` | Bottom usage + props section |
| `<PropsTable props={[{name,type,default,description}]} />` | Props reference table |

## Component Patterns

- **Sizing** — components typically support `size` prop: `'sm' | 'md' | 'lg'`
- **Disabled state** — use a `.disabled` CSS class with `color: var(--color-grey-400)`; do not rely on HTML `disabled` alone for non-input elements
- **Icons** — inline SVGs, 16×16, `aria-hidden="true"`, `stroke="currentColor"` so they inherit color
- **Interactive elements inside non-button spans** — use a `<button type="button">` with `aria-label`
- **No external icon library** — all icons are authored inline as SVG components

## Figma Source

Designs live in the **cursor-testing** Figma file (`nAXkC6c5Q8LAg4ExFw6xPX`). When implementing from Figma, convert Tailwind output to CSS Modules and map raw hex values to the nearest design token.
