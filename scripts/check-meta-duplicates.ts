#!/usr/bin/env node
/**
 * SEO meta sanity check.
 *
 * Walks content/articles/*.md, extracts frontmatter, and reports:
 *   - exact `description` duplicates (same string in 2+ files)
 *   - `description` length > 155
 *   - `title` length > 60
 *   - any author field that contains a forbidden real name
 *     (the project byline is "Japan Pop Now" — Takashi/Kiyohara/清原 are NG)
 *
 * Exits 1 if any violation is found, 0 if clean. Run via:
 *   npm run check-meta
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.resolve(process.cwd(), 'content/articles');
const TITLE_MAX = 60;
const DESC_MAX = 155;
const FORBIDDEN_AUTHOR_PATTERNS = [/Takashi/i, /Kiyohara/i, /清原/];

interface Row {
  slug: string;
  title: string;
  description: string;
  author: string;
}

function loadAll(): Row[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: f.replace(/\.mdx?$/, ''),
        title: typeof data.title === 'string' ? data.title : '',
        description: typeof data.description === 'string' ? data.description : '',
        author: typeof data.author === 'string' ? data.author : '',
      };
    });
}

function main(): void {
  const rows = loadAll();

  // Exact duplicates
  const byDesc = new Map<string, string[]>();
  for (const r of rows) {
    if (!r.description) continue;
    const list = byDesc.get(r.description) || [];
    list.push(r.slug);
    byDesc.set(r.description, list);
  }
  const duplicates = Array.from(byDesc.entries()).filter(
    ([, slugs]) => slugs.length > 1,
  );

  // Length violations
  const tooLongTitle = rows
    .filter((r) => r.title.length > TITLE_MAX)
    .map((r) => ({ slug: r.slug, length: r.title.length, value: r.title }));
  const tooLongDesc = rows
    .filter((r) => r.description.length > DESC_MAX)
    .map((r) => ({ slug: r.slug, length: r.description.length, value: r.description }));

  // Pseudonym violations
  const badAuthors = rows
    .filter((r) => FORBIDDEN_AUTHOR_PATTERNS.some((re) => re.test(r.author)))
    .map((r) => ({ slug: r.slug, author: r.author }));

  // Print
  console.log(`\n=== check-meta: ${rows.length} articles ===\n`);
  console.log(`title > ${TITLE_MAX}:        ${tooLongTitle.length}`);
  console.log(`description > ${DESC_MAX}:  ${tooLongDesc.length}`);
  console.log(`description duplicates: ${duplicates.length}`);
  console.log(`forbidden authors:      ${badAuthors.length}`);

  if (tooLongTitle.length) {
    console.log('\n[title too long]');
    for (const t of tooLongTitle) console.log(`  ${t.length}  ${t.slug}`);
  }
  if (tooLongDesc.length) {
    console.log('\n[description too long]');
    for (const d of tooLongDesc) console.log(`  ${d.length}  ${d.slug}`);
  }
  if (duplicates.length) {
    console.log('\n[duplicate descriptions]');
    for (const [desc, slugs] of duplicates) {
      console.log(`  ${slugs.length}× — ${slugs.join(', ')}`);
      console.log(`     "${desc.slice(0, 80)}..."`);
    }
  }
  if (badAuthors.length) {
    console.log('\n[forbidden author]');
    for (const a of badAuthors) console.log(`  ${a.slug}  →  "${a.author}"`);
  }

  const failures =
    tooLongTitle.length + tooLongDesc.length + duplicates.length + badAuthors.length;
  if (failures > 0) {
    console.log(`\n✗ ${failures} violations\n`);
    process.exit(1);
  }
  console.log('\n✓ all clean\n');
  process.exit(0);
}

main();
