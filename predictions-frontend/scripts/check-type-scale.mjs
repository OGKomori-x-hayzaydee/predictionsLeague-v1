#!/usr/bin/env node
/**
 * Guardrail for the font-size type scale (see the `--text-3xs/2xs/caption`
 * tokens and codemod notes in src/index.css). Fails if any .jsx/.js file
 * under src/ introduces a new hardcoded pixel (or rem-equivalent) arbitrary
 * font-size/line-height value, e.g. `text-[13px]`, `text-[0.625rem]`,
 * `leading-[22px]` — the same one-off-value-per-component pattern that
 * caused the original size drift this scale was built to fix.
 *
 * Not flagged (intentionally out of scope):
 *   - `leading-[<number>]` with no unit (e.g. `leading-[0.9]`) — a
 *     unitless line-height ratio, a legitimate one-off for tight display
 *     numerals, not a duplicate of a named size.
 *   - Arbitrary values for anything other than text-size/line-height
 *     (widths, gaps, radii, etc.) — a different, much larger, mostly
 *     legitimate category of one-off layout measurements.
 *   - Inline `style={{ fontSize: ... }}` driven by a component's own
 *     `size` prop (TokenBadge/ChipToken/Podium-style proportional
 *     scaling) — add a `// type-scale-allow` comment on that line if a
 *     new case like this trips the check.
 *
 * Usage: node scripts/check-type-scale.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC_DIR = fileURLToPath(new URL('../src', import.meta.url));
const PATTERN = /\b(?:text|leading)-\[\s*[\d.]+(?:px|rem|em)\s*\]/g;
const ALLOW_COMMENT = 'type-scale-allow';
const EXTENSIONS = new Set(['.js', '.jsx']);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (EXTENSIONS.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

function checkFile(path) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    if (line.includes(ALLOW_COMMENT)) return;
    const matches = line.match(PATTERN);
    if (matches) hits.push({ line: i + 1, matches, text: line.trim() });
  });
  return hits;
}

function main() {
  const files = walk(SRC_DIR);
  const violations = [];

  for (const file of files) {
    const hits = checkFile(file);
    if (hits.length > 0) violations.push({ file, hits });
  }

  if (violations.length === 0) {
    console.log('✓ No hardcoded arbitrary text-size/leading values found.');
    return;
  }

  console.error(`\nFound ${violations.length} file(s) with hardcoded arbitrary text-size/leading values.`);
  console.error('Use the shared type-scale tokens instead (text-3xs/2xs/xs/caption/sm/base/lg/xl/2xl/3xl/...),');
  console.error(`or add a trailing "// ${ALLOW_COMMENT}" comment if this is genuinely a one-off (e.g. proportional inline sizing driven by a size prop).\n`);

  for (const { file, hits } of violations) {
    console.error(file.replace(SRC_DIR, 'src'));
    for (const hit of hits) {
      console.error(`  ${hit.line}: ${hit.matches.join(', ')}`);
    }
  }

  process.exitCode = 1;
}

main();
