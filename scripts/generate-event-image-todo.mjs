/**
 * Generate EVENT_IMAGE_TODO.md from data/events.json.
 * Priority order:
 *   1. Events starting within 30 days (highest-CTA window)
 *   2. Currently open non-permanent events
 *   3. Permanent venues (steady traffic)
 *   4. Everything else still in range
 * Events already ended (endDate < today) are skipped.
 *
 * Output: EVENT_IMAGE_TODO.md at repo root.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data/events.json');
const OUT = path.join(ROOT, 'EVENT_IMAGE_TODO.md');
const today = new Date();
const DAY = 86_400_000;

const raw = JSON.parse(fs.readFileSync(DATA, 'utf-8'));
const events = raw.events || [];

function daysUntil(iso) {
  return Math.round((new Date(iso).getTime() - today.getTime()) / DAY);
}

function priority(ev) {
  if (ev.endDate === '2099-12-31') return { tier: 3, label: 'PERMANENT' };
  const endD = new Date(ev.endDate).getTime();
  if (endD < today.getTime()) return { tier: 99, label: 'ENDED' };
  const startD = new Date(ev.startDate).getTime();
  const daysToStart = Math.round((startD - today.getTime()) / DAY);
  const daysToEnd = Math.round((endD - today.getTime()) / DAY);
  if (daysToStart >= 0 && daysToStart <= 30) return { tier: 1, label: `STARTS IN ${daysToStart}d` };
  if (startD <= today.getTime() && daysToEnd > 0) return { tier: 2, label: `OPEN · ${daysToEnd}d left` };
  return { tier: 4, label: `future (${daysToStart}d)` };
}

const scored = events
  .map((ev) => ({ ev, ...priority(ev) }))
  .filter((x) => x.label !== 'ENDED')
  .sort((a, b) => a.tier - b.tier || a.ev.startDate.localeCompare(b.ev.startDate));

const lines = [];
lines.push('# Event Image Research Queue');
lines.push('');
lines.push(`Generated: ${today.toISOString().slice(0, 10)} · ${scored.length} events pending official images`);
lines.push('');
lines.push('## Rules (read before sourcing)');
lines.push('');
lines.push('1. **Do not scrape anime character art.** DMCA/copyright risk is too high.');
lines.push('2. **Do not use Unsplash or stock photos** — reverting the 2026-04-16 cleanup.');
lines.push('3. **Allowed sources:**');
lines.push('   - (a) Takapon original photos (venue exterior, food shots he took himself)');
lines.push('   - (b) Venue press kits with explicit redistribution license');
lines.push('   - (c) Royalty-free / CC0 with attribution');
lines.push('4. **Target filename:** `public/images/events/{event-id}.webp` — 600×400 or larger.');
lines.push('5. After placing a file, set `thumbnail: "/images/events/{id}.webp"` in `data/events.json`.');
lines.push('');
lines.push('## TODO List (sorted by priority)');
lines.push('');

const tierHeading = {
  1: '### 🔴 Tier 1 — Starting within 30 days (highest priority)',
  2: '### 🟠 Tier 2 — Currently open',
  3: '### 🔵 Tier 3 — Permanent venues',
  4: '### ⚪ Tier 4 — Future (> 30 days out)',
};

let currentTier = null;
for (const { ev, tier, label } of scored) {
  if (tier !== currentTier) {
    lines.push('');
    lines.push(tierHeading[tier] || `### Tier ${tier}`);
    lines.push('');
    currentTier = tier;
  }
  const url = ev.officialUrl || ev.source || '(no source)';
  lines.push(`- **${ev.ip}** — ${ev.title}`);
  lines.push(`  - \`id\`: \`${ev.id}\``);
  lines.push(`  - Venue: ${ev.venue} (${ev.city})`);
  lines.push(`  - Dates: ${ev.startDate} → ${ev.endDate} (${label})`);
  lines.push(`  - Source: <${url}>`);
  lines.push(`  - Target file: \`public/images/events/${ev.id}.webp\``);
  lines.push('');
}

fs.writeFileSync(OUT, lines.join('\n'), 'utf-8');
console.log(`Wrote ${OUT}`);
console.log(`Tiers: ${JSON.stringify(Object.fromEntries(
  [1, 2, 3, 4].map((t) => [t, scored.filter((s) => s.tier === t).length])
))}`);
console.log(`Total: ${scored.length}`);
