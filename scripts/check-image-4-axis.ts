#!/usr/bin/env -S npx tsx
/**
 * check-image-4-axis.ts — TypeScript-based 4-axis image gate.
 *
 * Supplements the existing Python `scripts/image_quality_gate.py` (which enforces
 * a flat 1.0/1000w density floor + bpp + placeholder check) with four stricter
 * axes that the Memory feedback rules require for every article:
 *
 *   軸1 count floor (stepped):
 *     <800w  → ≥2 images
 *     800–1499w  → ≥4
 *     1500–2499w → ≥5
 *     ≥2500w  → ≥6
 *
 *   軸2 alt-text + filename quality:
 *     - filename / alt MUST NOT contain unsplash|getty|shutterstock|stock-photo
 *     - file MUST exist on disk under public/{src}
 *
 *   軸3 alt-text content match heuristic:
 *     - alt ≥20 chars (no empty / "image" placeholders)
 *     - alt MUST NOT match illustration|schematic|diagram|generated|ai-generated|render
 *
 *   軸4 real-photo heuristic via filename:
 *     - filename MUST NOT match illustration|schematic|diagram|generated|ai-
 *
 * Usage:
 *   npx tsx scripts/check-image-4-axis.ts
 *   npx tsx scripts/check-image-4-axis.ts --json
 *   npx tsx scripts/check-image-4-axis.ts --slug=blue-lock-tokyo-skytree-cafe-2026
 *   npx tsx scripts/check-image-4-axis.ts --strict
 *
 * Exit codes:
 *   0 — no P0 violations (warnings allowed unless --strict)
 *   1 — at least one P0 violation, or any violation under --strict
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const ARTICLES_DIR = join(REPO_ROOT, 'content', 'articles');
const PUBLIC_DIR = join(REPO_ROOT, 'public');

// --- args ----------------------------------------------------------------
const argv = process.argv.slice(2);
const JSON_MODE = argv.includes('--json');
const STRICT = argv.includes('--strict');
const SLUG_ARG = argv.find((a) => a.startsWith('--slug='));
const ONLY_SLUG = SLUG_ARG ? SLUG_ARG.split('=')[1] : null;

// --- regexes -------------------------------------------------------------
const STOCK_RE = /unsplash|getty|shutterstock|stock-photo/i;
const NON_PHOTO_ALT_RE = /illustration|schematic|diagram|generated|ai-generated|render/i;
const NON_PHOTO_FILE_RE = /illustration|schematic|diagram|generated|ai-/i;

// markdown image:  ![alt](path)
const MD_IMG_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
// JSX-ish: src="..." with optional alt="..."  (alt may appear before or after)
const JSX_IMG_RE = /<(?:img|Image|next\/image)[^>]*?\bsrc=["']([^"']+)["'][^>]*\/?>/gi;
const JSX_ALT_RE = /\balt=["']([^"']*)["']/i;

// --- types ---------------------------------------------------------------
interface ImageRef {
  src: string;
  alt: string;
  position: 'frontmatter' | 'body-md' | 'body-jsx';
  line: number;
}

interface Violation {
  slug: string;
  axis: 1 | 2 | 3 | 4;
  level: 'P0' | 'WARN';
  src?: string;
  message: string;
}

interface ArticleResult {
  slug: string;
  words: number;
  images: number;
  refs: ImageRef[];
  violations: Violation[];
}

// --- helpers -------------------------------------------------------------
function listArticles(): string[] {
  if (!existsSync(ARTICLES_DIR)) return [];
  return readdirSync(ARTICLES_DIR)
    .filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.includes('.deprecated'))
    .map((f) => join(ARTICLES_DIR, f))
    .sort();
}

function countWords(body: string): number {
  let b = body;
  // strip fenced code
  b = b.replace(/```[\s\S]*?```/g, ' ');
  b = b.replace(/`[^`]*`/g, ' ');
  // strip JSX/HTML tags
  b = b.replace(/<[^>]+>/g, ' ');
  // strip image markdown
  b = b.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ');
  // strip link markdown but keep label
  b = b.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // strip residual markdown punctuation
  b = b.replace(/[`*_#>\-|\[\]{}]/g, ' ');
  const tokens = b.match(/[A-Za-z][A-Za-z\-']+/g) ?? [];
  return tokens.length;
}

function lineOf(text: string, idx: number): number {
  let line = 1;
  for (let i = 0; i < idx && i < text.length; i++) {
    if (text[i] === '\n') line += 1;
  }
  return line;
}

function extractRefs(body: string, frontmatter: Record<string, unknown>): ImageRef[] {
  const refs: ImageRef[] = [];

  // frontmatter featuredImage
  const fmFeatured = frontmatter.featuredImage;
  if (typeof fmFeatured === 'string' && fmFeatured.startsWith('/images/articles/')) {
    const altRaw = frontmatter.featuredImageAlt;
    const alt = typeof altRaw === 'string' ? altRaw : '';
    refs.push({ src: fmFeatured, alt, position: 'frontmatter', line: 0 });
  }

  // markdown body images
  for (const m of body.matchAll(MD_IMG_RE)) {
    const alt = m[1] ?? '';
    const src = m[2] ?? '';
    if (!src.startsWith('/images/articles/')) continue;
    refs.push({ src, alt, position: 'body-md', line: lineOf(body, m.index ?? 0) });
  }

  // JSX <img>/<Image> tags
  for (const m of body.matchAll(JSX_IMG_RE)) {
    const tag = m[0];
    const src = m[1] ?? '';
    if (!src.startsWith('/images/articles/')) continue;
    const altMatch = tag.match(JSX_ALT_RE);
    const alt = altMatch?.[1] ?? '';
    refs.push({ src, alt, position: 'body-jsx', line: lineOf(body, m.index ?? 0) });
  }

  return refs;
}

function requiredCount(words: number): number {
  if (words < 800) return 2;
  if (words < 1500) return 4;
  if (words < 2500) return 5;
  return 6;
}

function checkArticle(filePath: string): ArticleResult {
  const slug = filePath.split(/[\\/]/).pop()!.replace(/\.mdx?$/, '');
  const text = readFileSync(filePath, 'utf-8');
  const parsed = matter(text);
  const body = parsed.content;
  const fm = parsed.data ?? {};
  const words = countWords(body);
  const refs = extractRefs(body, fm);
  const violations: Violation[] = [];

  // 軸1 stepped count floor (only meaningful for non-stub bodies)
  if (words >= 200) {
    const need = requiredCount(words);
    if (refs.length < need) {
      violations.push({
        slug,
        axis: 1,
        level: 'P0',
        message: `軸1 COUNT_FLOOR: ${refs.length} images for ${words}w (need ≥${need})`,
      });
    }
  }

  for (const ref of refs) {
    const filename = ref.src.split('/').pop() ?? '';
    const altLower = ref.alt.trim();

    // 軸2.a stock-photo source check (filename or alt)
    if (STOCK_RE.test(filename) || STOCK_RE.test(altLower)) {
      violations.push({
        slug,
        axis: 2,
        level: 'P0',
        src: ref.src,
        message: `軸2 STOCK_SOURCE: ${ref.src} matches ${STOCK_RE.source}`,
      });
    }

    // 軸2.b file existence
    const local = join(PUBLIC_DIR, ref.src.replace(/^\/+/, ''));
    let exists = false;
    try {
      exists = existsSync(local) && statSync(local).isFile();
    } catch {
      exists = false;
    }
    if (!exists) {
      violations.push({
        slug,
        axis: 2,
        level: 'P0',
        src: ref.src,
        message: `軸2 MISSING_FILE: ${ref.src} (expected at public/${ref.src.replace(/^\/+/, '')})`,
      });
    }

    // 軸3 alt-text quality
    const altCompact = altLower.replace(/\s+/g, ' ');
    if (altCompact.length === 0) {
      violations.push({
        slug,
        axis: 3,
        level: 'P0',
        src: ref.src,
        message: `軸3 EMPTY_ALT: ${ref.src} has empty alt`,
      });
    } else if (/^(image|photo|picture)\.?$/i.test(altCompact)) {
      violations.push({
        slug,
        axis: 3,
        level: 'P0',
        src: ref.src,
        message: `軸3 PLACEHOLDER_ALT: ${ref.src} alt="${altCompact}" is a placeholder`,
      });
    } else if (altCompact.length < 20) {
      violations.push({
        slug,
        axis: 3,
        level: 'WARN',
        src: ref.src,
        message: `軸3 SHORT_ALT: ${ref.src} alt is ${altCompact.length} chars (<20)`,
      });
    }
    if (NON_PHOTO_ALT_RE.test(altCompact)) {
      violations.push({
        slug,
        axis: 3,
        level: 'P0',
        src: ref.src,
        message: `軸3 NON_PHOTO_ALT: ${ref.src} alt matches ${NON_PHOTO_ALT_RE.source}`,
      });
    }

    // 軸4 filename real-photo heuristic
    if (NON_PHOTO_FILE_RE.test(filename)) {
      violations.push({
        slug,
        axis: 4,
        level: 'P0',
        src: ref.src,
        message: `軸4 NON_PHOTO_FILENAME: ${ref.src} matches ${NON_PHOTO_FILE_RE.source}`,
      });
    }
  }

  return {
    slug,
    words,
    images: refs.length,
    refs,
    violations,
  };
}

// --- main ----------------------------------------------------------------
function main(): number {
  const articles = listArticles();
  const filtered = ONLY_SLUG ? articles.filter((p) => p.includes(`${ONLY_SLUG}.md`)) : articles;

  if (filtered.length === 0) {
    if (JSON_MODE) {
      process.stdout.write(
        JSON.stringify({ p0: [], warnings: [], total_articles: 0, total_images: 0 }, null, 2) + '\n',
      );
    } else {
      process.stderr.write(`No articles matched (slug=${ONLY_SLUG ?? '*'})\n`);
    }
    return 0;
  }

  const allP0: Violation[] = [];
  const allWarn: Violation[] = [];
  let totalImages = 0;
  const perArticle: ArticleResult[] = [];

  for (const fp of filtered) {
    const result = checkArticle(fp);
    perArticle.push(result);
    totalImages += result.images;
    for (const v of result.violations) {
      if (v.level === 'P0') allP0.push(v);
      else allWarn.push(v);
    }
  }

  if (JSON_MODE) {
    process.stdout.write(
      JSON.stringify(
        {
          p0: allP0,
          warnings: allWarn,
          total_articles: filtered.length,
          total_images: totalImages,
          per_article: perArticle.map((r) => ({
            slug: r.slug,
            words: r.words,
            images: r.images,
            violations: r.violations,
          })),
        },
        null,
        2,
      ) + '\n',
    );
  } else {
    const C_RED = '\x1b[31m';
    const C_YEL = '\x1b[33m';
    const C_GRN = '\x1b[32m';
    const C_DIM = '\x1b[2m';
    const C_OFF = '\x1b[0m';
    const useColor = process.stdout.isTTY;
    const red = (s: string) => (useColor ? `${C_RED}${s}${C_OFF}` : s);
    const yel = (s: string) => (useColor ? `${C_YEL}${s}${C_OFF}` : s);
    const grn = (s: string) => (useColor ? `${C_GRN}${s}${C_OFF}` : s);
    const dim = (s: string) => (useColor ? `${C_DIM}${s}${C_OFF}` : s);

    process.stdout.write(
      `\n=== Image 4-Axis Gate: ${filtered.length} article(s), ${totalImages} image ref(s) ===\n\n`,
    );
    if (allP0.length > 0) {
      process.stdout.write(red(`P0 VIOLATIONS (${allP0.length}):\n`));
      for (const v of allP0) {
        process.stdout.write(`  ${red('X')} [${v.slug}] ${v.message}\n`);
      }
      process.stdout.write('\n');
    }
    if (allWarn.length > 0) {
      process.stdout.write(yel(`WARNINGS (${allWarn.length}):\n`));
      for (const v of allWarn) {
        process.stdout.write(`  ${yel('!')} [${v.slug}] ${v.message}\n`);
      }
      process.stdout.write('\n');
    }
    if (allP0.length === 0 && allWarn.length === 0) {
      process.stdout.write(grn('PASS — all 4 axes clear.\n'));
    } else {
      process.stdout.write(
        dim(`Summary: ${allP0.length} P0 / ${allWarn.length} warnings across ${filtered.length} article(s)\n`),
      );
    }
  }

  if (allP0.length > 0) return 1;
  if (STRICT && allWarn.length > 0) return 1;
  return 0;
}

process.exit(main());
