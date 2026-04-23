/**
 * figma-push.mjs
 * Reads design token values from src/index.css and pushes them to Figma variables.
 * Only updates primitive (non-alias) variables — semantic Token aliases are defined
 * by their alias relationship, not raw values, and are left untouched.
 *
 * Usage:
 *   FIGMA_TOKEN=xxx npm run figma:push
 *
 * Requires: FIGMA_TOKEN env var (Figma Personal Access Token)
 * Optional: FIGMA_FILE_KEY env var
 */

import { readFileSync, existsSync } from 'fs';
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

const MARKER_START = '/* @tokens-generated:start */';
const MARKER_END   = '/* @tokens-generated:end */';

if (!TOKEN) {
  console.error('❌  FIGMA_TOKEN env var is required');
  process.exit(1);
}

// ── helpers ───────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a: 1,
  };
}

// ── parse src/index.css ───────────────────────────────────────────────────────

const css = readFileSync(CSS_PATH, 'utf8');
const si = css.indexOf(MARKER_START);
const ei = css.indexOf(MARKER_END);

if (si === -1 || ei === -1) {
  console.error('❌  Marker comments not found in src/index.css');
  process.exit(1);
}

const tokenBlock = css.slice(si + MARKER_START.length, ei);
const cssVars = {};
for (const m of tokenBlock.matchAll(/^\s*(--[\w-]+):\s*(.+?);/gm)) {
  cssVars[m[1].trim()] = m[2].trim();
}
console.log(`📄  Parsed ${Object.keys(cssVars).length} CSS custom properties`);

// ── fetch Figma variables ─────────────────────────────────────────────────────

console.log('⬆️   Fetching current Figma variables…');
const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
  headers: { 'X-Figma-Token': TOKEN },
});
if (!res.ok) {
  console.error('❌  Figma API error:', res.status, await res.text());
  process.exit(1);
}
const { meta } = await res.json();
const { variableCollections, variables } = meta;

// Build CSS var name → figma variable lookup
// Figma name "color/grey/700" → CSS "--color-grey-700"
const figmaByCSS = {};
for (const [, v] of Object.entries(variables)) {
  const cssName = '--' + v.name.replace(/\//g, '-');
  figmaByCSS[cssName] = v;
}

// Build collection → first modeId
const modeByCollection = {};
for (const [, c] of Object.entries(variableCollections)) {
  modeByCollection[c.id] = c.modes[0].modeId;
}

// ── build update payload ──────────────────────────────────────────────────────

const variableValues = [];
let updated = 0;
let skipped = 0;
const notFound = [];

for (const [cssName, cssVal] of Object.entries(cssVars)) {
  // Skip alias values (var(--...)) — those are semantic tokens, not primitives
  if (cssVal.startsWith('var(')) { skipped++; continue; }

  const figmaVar = figmaByCSS[cssName];
  if (!figmaVar) {
    notFound.push(cssName);
    skipped++;
    continue;
  }

  const modeId = modeByCollection[figmaVar.variableCollectionId];
  let value;

  if (figmaVar.resolvedType === 'COLOR') {
    if (!cssVal.startsWith('#')) { skipped++; continue; }
    value = hexToRgb(cssVal);
  } else if (figmaVar.resolvedType === 'FLOAT') {
    // CSS values are like "8px" or "8" — strip px
    value = parseFloat(cssVal);
    if (isNaN(value)) { skipped++; continue; }
  } else {
    skipped++;
    continue;
  }

  variableValues.push({ action: 'UPDATE', variableId: figmaVar.id, modeId, value });
  updated++;
}

if (notFound.length) {
  console.warn(`⚠️   ${notFound.length} CSS vars have no matching Figma variable (they may be app-specific or manually defined):`);
  notFound.slice(0, 10).forEach(n => console.warn(`     ${n}`));
  if (notFound.length > 10) console.warn(`     … and ${notFound.length - 10} more`);
}

if (variableValues.length === 0) {
  console.log('ℹ️   No primitive values to update — Figma is already in sync.');
  process.exit(0);
}

// ── push to Figma ─────────────────────────────────────────────────────────────

console.log(`📤  Pushing ${updated} variable updates to Figma…`);
const pushRes = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables`, {
  method: 'POST',
  headers: { 'X-Figma-Token': TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variableCollections: [],
    variables: [],
    variableModes: [],
    variableValues,
  }),
});

if (!pushRes.ok) {
  console.error('❌  Figma push error:', pushRes.status, await pushRes.text());
  process.exit(1);
}

await pushRes.json();
console.log(`✅  Pushed ${updated} values to Figma (${skipped} skipped / aliases or unmatched)`);
