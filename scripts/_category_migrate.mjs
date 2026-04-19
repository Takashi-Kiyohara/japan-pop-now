// One-shot migration helper for the 2026-04-19 category rename.
// Safe to re-run: replacements only match old slugs that no longer exist
// after the first run. Delete this file after the migration commit lands.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'content/articles';
const MAP = {
  'collab-cafes': 'cafes',
  'anime-pilgrimage': 'destinations',
  'area-guides': 'destinations',
  'travel-tips': 'experiences',
};

const files = readdirSync(DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
const report = [];
let changed = 0;

for (const f of files) {
  const p = join(DIR, f);
  let content = readFileSync(p, 'utf8');
  const orig = content;

  for (const [oldSlug, newSlug] of Object.entries(MAP)) {
    const patterns = [
      new RegExp(`^category:\\s*"${oldSlug}"`, 'm'),
      new RegExp(`^category:\\s*'${oldSlug}'`, 'm'),
      new RegExp(`^category:\\s*${oldSlug}$`, 'm'),
    ];
    for (const re of patterns) {
      content = content.replace(re, (match) => match.replace(oldSlug, newSlug));
    }
  }

  if (content !== orig) {
    writeFileSync(p, content);
    const m = content.match(/^category:\s*["']?([^"'\n]+)["']?/m);
    report.push(`${f}  ->  ${m ? m[1] : '?'}`);
    changed++;
  }
}

console.log(`Changed ${changed} files:`);
console.log(report.join('\n'));
