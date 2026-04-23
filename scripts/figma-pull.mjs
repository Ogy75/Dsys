/**
 * figma-pull.mjs
 * Pulls design tokens from Figma and regenerates the token section of src/index.css.
 *
 * Usage:
 *   FIGMA_TOKEN=xxx npm run figma:pull
 *   FIGMA_TOKEN=xxx npm run figma:pull:commit   (also git-commits the result)
 *
 * Requires: FIGMA_TOKEN env var (Figma Personal Access Token)
 * Optional: FIGMA_FILE_KEY env var (defaults to value in this file)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CSS_PATH = resolve(ROOT, 'src/index.css');

// Auto-load .env if present and vars not already set
const envPath = resolve(ROOT, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY ?? 'WKcqwrU6ILDFGTk7coDXVo';
const COMMIT = process.argv.includes('--commit');

const MARKER_START = '/* @tokens-generated:start */';
const MARKER_END   = '/* @tokens-generated:end */';

if (!TOKEN) {
  console.error('❌  FIGMA_TOKEN env var is required');
  process.exit(1);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function rgbToHex({ r, g, b }) {
  const ch = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

// Figma variable name (color/grey/700) → CSS custom property (--color-grey-700)
function toCssVar(name) {
  return '--' + name.replace(/\//g, '-');
}

// ── fetch ─────────────────────────────────────────────────────────────────────

console.log('⬇️   Fetching variables from Figma…');
const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
  headers: { 'X-Figma-Token': TOKEN },
});
if (!res.ok) {
  console.error('❌  Figma API error:', res.status, await res.text());
  process.exit(1);
}
const { meta } = await res.json();
const { variableCollections, variables } = meta;

// Build lookups
const varById = Object.fromEntries(Object.entries(variables).map(([id, v]) => [id, v]));
const collByName = {};
for (const [, c] of Object.entries(variableCollections)) collByName[c.name] = c;

// ── resolve ───────────────────────────────────────────────────────────────────

function resolveValue(v, modeId) {
  const raw = v.valuesByMode[modeId];
  if (!raw) return null;
  if (raw.type === 'VARIABLE_ALIAS') {
    const aliased = varById[raw.id];
    if (!aliased) return null;
    return `var(${toCssVar(aliased.name)})`;
  }
  if (v.resolvedType === 'COLOR') return rgbToHex(raw);
  if (v.resolvedType === 'FLOAT') return raw;
  return null;
}

// ── generate ──────────────────────────────────────────────────────────────────

function collectionLines(collectionName, groups) {
  const coll = collByName[collectionName];
  if (!coll) return [`  /* ⚠️  collection "${collectionName}" not found in Figma */`];

  const modeId = coll.modes[0].modeId;

  // Bucket variables into named groups by prefix, preserving order
  const buckets = {};
  for (const g of groups) buckets[g.prefix] = { header: g.header, lines: [] };

  for (const varId of coll.variableIds) {
    const v = varById[varId];
    if (!v || v.hiddenFromPublishing) continue;
    const val = resolveValue(v, modeId);
    if (val === null) continue;

    for (const g of groups) {
      if (v.name.startsWith(g.prefix)) {
        const suffix = typeof val === 'number' ? 'px' : '';
        buckets[g.prefix].lines.push(`  ${toCssVar(v.name)}: ${val}${suffix};`);
        break;
      }
    }
  }

  const out = [];
  for (const g of groups) {
    const b = buckets[g.prefix];
    if (!b.lines.length) continue;
    out.push(`  /* ${b.header} */`);
    out.push(...b.lines);
    out.push('');
  }
  return out;
}

const lines = [MARKER_START];

// Primitives — colors
lines.push(...collectionLines('Primitives', [
  { prefix: 'color/black', header: 'Base' },
  { prefix: 'color/white', header: '' },
  { prefix: 'color/gray/',  header: 'Gray scale' },
  { prefix: 'color/grey/',  header: 'Grey scale (Figma spec — used by components)' },
  { prefix: 'color/blue/',  header: 'Blue' },
  { prefix: 'color/green-ap/', header: 'Green AP' },
  { prefix: 'color/green/', header: 'Green' },
  { prefix: 'color/red/',   header: 'Red' },
  { prefix: 'color/yellow/',header: 'Yellow' },
  { prefix: 'color/purple/',header: 'Purple' },
  { prefix: 'color/lime/',  header: 'Lime' },
  { prefix: 'color/cyan/',  header: 'Cyan' },
  { prefix: 'color/light-blue/', header: 'Light Blue' },
]));

// Primitives — spacing + radius
lines.push(...collectionLines('Primitives', [
  { prefix: 'space/',  header: 'Spacing — matches Figma token scale' },
  { prefix: 'radius/', header: 'Border radius — matches Figma token scale' },
]));

// Tokens — semantic aliases
lines.push(...collectionLines('Tokens', [
  { prefix: 'color/text/',   header: 'Text colors' },
  { prefix: 'color/bg/',     header: 'Background colors' },
  { prefix: 'color/border',  header: 'Border colors' },
  { prefix: 'color/brand',   header: 'Brand' },
]));

// Remove trailing blank line before end marker
while (lines[lines.length - 1] === '') lines.pop();
lines.push(MARKER_END);

// ── write src/index.css ───────────────────────────────────────────────────────

let css = readFileSync(CSS_PATH, 'utf8');
const si = css.indexOf(MARKER_START);
const ei = css.indexOf(MARKER_END);

if (si === -1 || ei === -1) {
  console.error(`❌  Marker comments not found in src/index.css`);
  console.error(`    Add "${MARKER_START}" and "${MARKER_END}" around the generated token block.`);
  process.exit(1);
}

css = css.slice(0, si) + lines.join('\n') + css.slice(ei + MARKER_END.length);
writeFileSync(CSS_PATH, css);
console.log('✅  src/index.css updated from Figma');

// ── git ───────────────────────────────────────────────────────────────────────

if (COMMIT) {
  execSync('git add src/index.css', { cwd: ROOT, stdio: 'inherit' });
  execSync('git commit -m "chore: sync design tokens from Figma"', { cwd: ROOT, stdio: 'inherit' });
  console.log('✅  Committed to git');
}
