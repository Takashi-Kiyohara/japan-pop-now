#!/usr/bin/env tsx
/**
 * Fabrication sweep — find author-first-person experience claims that
 * violate feedback_no_first_person_fabrication.
 *
 * Per the rule:
 *   - First-person + specific detail (price / time / place / interior /
 *     queue / item brand) = HIGH (must rewrite to advisory or remove)
 *   - First-person + subjective sensory ("smells like", "feels like",
 *     "you'll touch", "you'll feel") = MED (must rewrite to advisory)
 *   - General sustained voice ("I have walked first-time visitors") with
 *     no specific verifiable claim = LOW (acceptable for voice:friend-guide
 *     articles)
 *
 * Articles excluded from sitemap (robots:noindex or past validUntil) are
 * still audited because they could be re-published later.
 *
 * Output: a markdown report grouping hits by article + by severity.
 *
 * Usage:
 *   npx tsx scripts/audit/fabrication-sweep.ts > docs/audit/fabrication-sweep-{date}.md
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const today = new Date().toISOString().slice(0, 10);

// Patterns. Each tuple: [name, regex, defaultSeverity].
// Default severity may be elevated to HIGH if the same sentence contains
// a specific marker (yen amount, minute count, brand, etc.).
const PATTERNS: { name: string; re: RegExp; defaultSeverity: 'HIGH' | 'MED' }[] = [
  { name: 'I_have_perfect',     re: /\bI'?ve (stayed|visited|tested|spent|eaten|bought|walked|tried|seen|been|taken|booked|owned|shopped|toured)\b/g, defaultSeverity: 'HIGH' },
  { name: 'I_simple_past',      re: /\bI (stayed|visited|tested|spent|ate|bought|tried|saw|noticed|booked|owned|shopped|toured|walked\b(?!\sthrough))\b/g, defaultSeverity: 'HIGH' },
  { name: 'My_personal',        re: /\b(My (personal choice|favourite|favorite|recommendation|honest take|own experience|go-to))\b/gi, defaultSeverity: 'HIGH' },
  { name: 'in_my_experience',   re: /\b(in my experience|the last (few|three|six|several) months I|over the past (few|three|six|several) (months|years) I)\b/gi, defaultSeverity: 'HIGH' },
  { name: 'I_perception',       re: /\bI (felt|found|believe|recommend|prefer|think|noticed)\b/g, defaultSeverity: 'MED' },
  { name: 'sensory_advisory',   re: /\b(smells? like|feels? like|tastes? like|sounds? like|you'?ll (touch|feel|smell|hear|taste|notice))\b/gi, defaultSeverity: 'MED' },
];

// Markers in same sentence that elevate MED → HIGH (specific verifiable detail)
const SPECIFIC_MARKERS = [
  /¥\s*\d/,              // yen amount
  /\$\s*\d/,             // dollar amount
  /\d+\s*(min|minute|hour|day|week|month|night)/i,  // time spans
  /\d+\s*(yen|usd|jpy)/i, // currency
  /(receipt|queue|line|wait|booked|reservation|check-?in|check-?out)/i, // experience markers
];

type Hit = {
  pattern: string;
  match: string;
  severity: 'HIGH' | 'MED' | 'LOW';
  line: number;
  context: string;
  voiceFrontmatter?: string;
};

function classify(matched: string, sentenceContext: string, voice: string | undefined, def: 'HIGH' | 'MED'): 'HIGH' | 'MED' | 'LOW' {
  // Sustained-voice sentences (no specific marker, voice:friend-guide set) → LOW
  const hasSpecific = SPECIFIC_MARKERS.some((re) => re.test(sentenceContext));
  if (hasSpecific) return 'HIGH';
  if (voice && def === 'MED') return 'LOW';
  return def;
}

function getSentence(text: string, idx: number): string {
  // Find sentence boundaries by . ! ? around idx
  const start = Math.max(0, text.lastIndexOf('.', idx - 1) + 1);
  let end = text.indexOf('.', idx);
  if (end < 0) end = text.length;
  return text.slice(start, end + 1).trim().replace(/\s+/g, ' ');
}

function lineOf(text: string, idx: number): number {
  let line = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function sweepFile(fp: string): { slug: string; voice?: string; hits: Hit[]; fmStatus: string } {
  const raw = fs.readFileSync(fp, 'utf-8').replace(/^﻿/, '');
  const { data, content } = matter(raw);
  const slug = path.basename(fp).replace(/\.mdx?$/, '');
  const voice = typeof data.voice === 'string' ? data.voice : undefined;
  const robots = typeof data.robots === 'string' ? data.robots : '';
  const validUntil = typeof data.validUntil === 'string' ? data.validUntil : '';
  let fmStatus = 'in-sitemap';
  if (robots.includes('noindex')) fmStatus = 'noindex';
  else if (validUntil && validUntil < today) fmStatus = 'expired';

  const hits: Hit[] = [];
  for (const p of PATTERNS) {
    p.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = p.re.exec(content)) !== null) {
      const sentence = getSentence(content, m.index);
      const severity = classify(m[0], sentence, voice, p.defaultSeverity);
      hits.push({
        pattern: p.name,
        match: m[0],
        severity,
        line: lineOf(content, m.index),
        context: sentence,
        voiceFrontmatter: voice,
      });
    }
  }
  return { slug, voice, hits, fmStatus };
}

function main() {
  if (!fs.existsSync(ARTICLES_DIR)) { console.error('content/articles not found'); process.exit(1); }
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.endsWith('.deprecated'));

  const byArticle: Map<string, { slug: string; voice?: string; hits: Hit[]; fmStatus: string }> = new Map();
  for (const f of files) {
    const r = sweepFile(path.join(ARTICLES_DIR, f));
    if (r.hits.length) byArticle.set(r.slug, r);
  }

  // Counts
  let countHigh = 0, countMed = 0, countLow = 0;
  for (const r of byArticle.values()) {
    for (const h of r.hits) {
      if (h.severity === 'HIGH') countHigh++;
      else if (h.severity === 'MED') countMed++;
      else countLow++;
    }
  }
  const sitemapArticles = files.length;
  const articlesWithHits = byArticle.size;

  console.log(`# Fabrication sweep — ${today}`);
  console.log(``);
  console.log(`Articles audited: ${sitemapArticles}`);
  console.log(`Articles with at least one hit: ${articlesWithHits}`);
  console.log(`Hits: HIGH=${countHigh}  MED=${countMed}  LOW=${countLow}  TOTAL=${countHigh + countMed + countLow}`);
  console.log(``);

  // Sort articles by HIGH count desc, then MED count desc
  const sorted = Array.from(byArticle.values()).sort((a, b) => {
    const aH = a.hits.filter((h) => h.severity === 'HIGH').length;
    const bH = b.hits.filter((h) => h.severity === 'HIGH').length;
    if (aH !== bH) return bH - aH;
    const aM = a.hits.filter((h) => h.severity === 'MED').length;
    const bM = b.hits.filter((h) => h.severity === 'MED').length;
    return bM - aM;
  });

  console.log(`## Per-article breakdown (sorted by HIGH desc)`);
  console.log(``);
  console.log(`| Slug | Status | Voice | HIGH | MED | LOW |`);
  console.log(`|---|---|---|---|---|---|`);
  for (const r of sorted) {
    const h = r.hits.filter((x) => x.severity === 'HIGH').length;
    const m = r.hits.filter((x) => x.severity === 'MED').length;
    const l = r.hits.filter((x) => x.severity === 'LOW').length;
    console.log(`| \`${r.slug}\` | ${r.fmStatus} | ${r.voice ?? '-'} | ${h} | ${m} | ${l} |`);
  }
  console.log(``);

  // HIGH details first
  console.log(`## HIGH-severity hits (must remove or rewrite)`);
  console.log(``);
  for (const r of sorted) {
    const high = r.hits.filter((h) => h.severity === 'HIGH');
    if (!high.length) continue;
    console.log(`### \`${r.slug}\` (${r.fmStatus}, voice=${r.voice ?? '-'})`);
    console.log(``);
    for (const h of high) {
      console.log(`- L${h.line} **${h.pattern}** \`${h.match}\``);
      console.log(`  > ${h.context.slice(0, 200).replace(/\n/g, ' ')}`);
    }
    console.log(``);
  }

  // MED details
  console.log(`## MED-severity hits (rewrite to advisory)`);
  console.log(``);
  for (const r of sorted) {
    const med = r.hits.filter((h) => h.severity === 'MED');
    if (!med.length) continue;
    console.log(`### \`${r.slug}\` (${r.fmStatus}, voice=${r.voice ?? '-'})`);
    console.log(``);
    for (const h of med.slice(0, 30)) {
      console.log(`- L${h.line} **${h.pattern}** \`${h.match}\``);
      console.log(`  > ${h.context.slice(0, 200).replace(/\n/g, ' ')}`);
    }
    if (med.length > 30) console.log(`- ... ${med.length - 30} more MED hits in this article`);
    console.log(``);
  }
}

main();
