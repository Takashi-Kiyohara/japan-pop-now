#!/usr/bin/env node
/**
 * Technical Debt Dashboard.
 *
 * Walks the repo and counts a handful of debt-flavour signals so we can
 * watch them trend over time:
 *
 *   - eslint-disable directives (specific rule + blanket)
 *   - explicit `any` annotations
 *   - TODO / FIXME / HACK comments
 *   - pages with `index: false` (noindex hubs/tags)
 *   - empty data files (e.g. content/cafes/cafes.json with [])
 *   - articles with empty featuredImage
 *
 * Output: debt-report.json at repo root, plus a one-line summary on stdout.
 *
 * Run:  npm run debt-report
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE_DIRS = ['app', 'components', 'lib', 'scripts'];
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const ARTICLE_DIR = path.join(ROOT, 'content/articles');
const DATA_DIRS = [path.join(ROOT, 'content/cafes')];
const OUTPUT = path.join(ROOT, 'debt-report.json');

interface Counts {
  eslintDisables: number;
  eslintDisableLines: { file: string; line: number; rule: string }[];
  explicitAny: number;
  todos: number;
  noindexPages: number;
  emptyDataFiles: string[];
  articlesMissingFeaturedImage: string[];
  totalSourceFiles: number;
  totalArticles: number;
}

// Files that contain regex literals matching the debt patterns themselves —
// scanning them produces self-referential false positives. Skip explicitly.
const SELF_EXCLUDE = new Set([path.resolve(__dirname, 'debt-report.ts')]);

function walkSource(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSource(full, out);
    } else if (
      SOURCE_EXTS.has(path.extname(entry.name)) &&
      !SELF_EXCLUDE.has(full)
    ) {
      out.push(full);
    }
  }
  return out;
}

function relPath(p: string): string {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

const counts: Counts = {
  eslintDisables: 0,
  eslintDisableLines: [],
  explicitAny: 0,
  todos: 0,
  noindexPages: 0,
  emptyDataFiles: [],
  articlesMissingFeaturedImage: [],
  totalSourceFiles: 0,
  totalArticles: 0,
};

// ── Source file scan ──────────────────────────────────────
const sourceFiles: string[] = [];
for (const d of SOURCE_DIRS) walkSource(path.join(ROOT, d), sourceFiles);
counts.totalSourceFiles = sourceFiles.length;

const eslintDisableRe = /eslint-disable(?:-next-line|-line)?(?:\s+([^\s*]+))?/;
const explicitAnyRe = /:\s*any(?![\w])|<any>|as\s+any\b/;
const todoRe = /\b(TODO|FIXME|HACK|XXX)\b/;
const noindexRe = /index\s*:\s*false/;

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf-8');
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const disable = line.match(eslintDisableRe);
    if (disable) {
      counts.eslintDisables += 1;
      counts.eslintDisableLines.push({
        file: relPath(file),
        line: i + 1,
        rule: disable[1] || '(blanket)',
      });
    }
    if (explicitAnyRe.test(line)) counts.explicitAny += 1;
    if (todoRe.test(line)) counts.todos += 1;
    if (noindexRe.test(line)) counts.noindexPages += 1;
  }
}

// ── Article scan ──────────────────────────────────────────
if (fs.existsSync(ARTICLE_DIR)) {
  const articleFiles = fs
    .readdirSync(ARTICLE_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  counts.totalArticles = articleFiles.length;
  for (const f of articleFiles) {
    const text = fs.readFileSync(path.join(ARTICLE_DIR, f), 'utf-8');
    const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const frontmatter = fmMatch[1];
    const fImg = frontmatter.match(/^featuredImage:\s*"?([^"\n]*)"?/m);
    if (!fImg || !fImg[1].trim()) {
      counts.articlesMissingFeaturedImage.push(f);
    }
  }
}

// ── Empty data files ─────────────────────────────────────
for (const dir of DATA_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const entry of fs.readdirSync(dir)) {
    if (!entry.endsWith('.json')) continue;
    const full = path.join(dir, entry);
    try {
      const data = JSON.parse(fs.readFileSync(full, 'utf-8'));
      if (Array.isArray(data) && data.length === 0) {
        counts.emptyDataFiles.push(relPath(full));
      } else if (
        typeof data === 'object' &&
        data !== null &&
        Object.keys(data).length === 0
      ) {
        counts.emptyDataFiles.push(relPath(full));
      }
    } catch {
      // not valid JSON — skip
    }
  }
}

// ── Output ────────────────────────────────────────────────
const generatedAt = new Date().toISOString();
const summary = {
  generatedAt,
  counts: {
    eslintDisables: counts.eslintDisables,
    explicitAny: counts.explicitAny,
    todos: counts.todos,
    noindexPages: counts.noindexPages,
    emptyDataFiles: counts.emptyDataFiles.length,
    articlesMissingFeaturedImage: counts.articlesMissingFeaturedImage.length,
  },
  totals: {
    sourceFiles: counts.totalSourceFiles,
    articles: counts.totalArticles,
  },
  details: {
    eslintDisables: counts.eslintDisableLines,
    emptyDataFiles: counts.emptyDataFiles,
    articlesMissingFeaturedImage: counts.articlesMissingFeaturedImage,
  },
};

fs.writeFileSync(OUTPUT, JSON.stringify(summary, null, 2) + '\n', 'utf-8');

const c = summary.counts;
console.log('\n=== japan-pop-now debt report ===');
console.log(`generated: ${generatedAt}`);
console.log(
  `source: ${counts.totalSourceFiles} files, articles: ${counts.totalArticles}`,
);
console.log(`  eslint-disable directives: ${c.eslintDisables}`);
console.log(`  explicit any: ${c.explicitAny}`);
console.log(`  TODO/FIXME/HACK: ${c.todos}`);
console.log(`  noindex page declarations: ${c.noindexPages}`);
console.log(`  empty data files: ${c.emptyDataFiles}`);
console.log(`  articles missing featuredImage: ${c.articlesMissingFeaturedImage}`);
console.log(`→ ${path.relative(ROOT, OUTPUT)}\n`);
