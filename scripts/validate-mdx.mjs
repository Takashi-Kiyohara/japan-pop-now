#!/usr/bin/env node
// validate-mdx.mjs -- Pre-merge MDX syntax validator for japan-pop-now.
// Catches the exact failure class that broke CI on 2026-04-19:
//   1. Unclosed void tags (<br>, <hr>, <wbr>) that break next-mdx-remote strict JSX parsing.
//   2. Legacy internal links `/slug/` or `/slug` that should be `/articles/slug`.
//
// Exits with code 1 on any FAIL. Prints a structured report.

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'content', 'articles');

// Top-path tokens that are NOT article slugs -- legitimate site sections.
const RESERVED_TOP_PATHS = new Set([
  'articles', 'category', 'guides', 'tags', 'features', 'api',
  'calendar', 'about', 'privacy', 'search', 'contact',
  'affiliate-disclosure', 'admin', 'upload', 'robots.txt',
  'sitemap.xml', 'llms.txt', 'favicon.ico', 'ads.txt', '_next',
  'images', 'icons', 'fonts', 'videos', 'og',
]);

// Negative lookbehind: match `<br>`, `<br>` (no trailing space or slash).
// Allows `<br />`, `<br/>`, `<br class="x" />`.
const VOID_TAG_RE = /<(br|hr|wbr)(?:\s+[^>]*?)?(?<![/\s])>/gi;

// Markdown link `](/slug/)` or `](/slug)`.
const MD_LINK_RE = /\]\(\/([a-z0-9][a-z0-9-]*)\/?\)/g;
// JSX/HTML `href="/slug/"` or `href="/slug"`.
const HREF_ATTR_RE = /href="\/([a-z0-9][a-z0-9-]*)\/?"/g;

// JSX strict-mode violations inside open tags:
//   style="..."  -- React requires object form: style={{...}}
//   class="..."  -- React requires className="..."
// Scope the match to an open tag to avoid markdown text false positives.
const JSX_STYLE_RE = /<[a-zA-Z][a-zA-Z0-9]*[^>]*?\s(style)="[^"]*"/g;
const JSX_CLASS_RE = /<[a-zA-Z][a-zA-Z0-9]*[^>]*?\s(class)="[^"]*"/g;

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...await walk(p));
    else if (ent.isFile() && p.endsWith('.mdx')) out.push(p);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

async function main() {
  let voidFails = [];
  let linkFails = [];
  let styleFails = [];
  let classFails = [];

  let files;
  try {
    files = await walk(ARTICLES_DIR);
  } catch (e) {
    console.log(`SKIP: content/articles not found (${e.code}).`);
    process.exit(0);
  }

  for (const fp of files) {
    const content = await readFile(fp, 'utf8');
    const rel = relative(ROOT, fp);

    // Void tag check
    VOID_TAG_RE.lastIndex = 0;
    let m;
    while ((m = VOID_TAG_RE.exec(content)) !== null) {
      voidFails.push({ file: rel, line: lineOf(content, m.index), match: m[0] });
    }

    // Legacy link check (both md + href)
    for (const [re, kind] of [[MD_LINK_RE, 'md'], [HREF_ATTR_RE, 'href']]) {
      re.lastIndex = 0;
      while ((m = re.exec(content)) !== null) {
        const slug = m[1];
        if (RESERVED_TOP_PATHS.has(slug)) continue;
        if (slug.length < 3) continue;
        linkFails.push({ file: rel, line: lineOf(content, m.index), kind, match: m[0], slug });
      }
    }

    // JSX strict-mode: style="..." string (must be object)
    JSX_STYLE_RE.lastIndex = 0;
    while ((m = JSX_STYLE_RE.exec(content)) !== null) {
      styleFails.push({ file: rel, line: lineOf(content, m.index) });
    }

    // JSX strict-mode: class="..." (should be className)
    JSX_CLASS_RE.lastIndex = 0;
    while ((m = JSX_CLASS_RE.exec(content)) !== null) {
      classFails.push({ file: rel, line: lineOf(content, m.index) });
    }
  }

  const hasVoid  = voidFails.length > 0;
  const hasLink  = linkFails.length > 0;
  const hasStyle = styleFails.length > 0;
  const hasClass = classFails.length > 0;

  console.log(`\n=== MDX Validator ===`);
  console.log(`Scanned: ${files.length} file(s) in content/articles/`);

  if (hasVoid) {
    console.log(`\nFAIL: ${voidFails.length} unclosed void tag(s).`);
    for (const f of voidFails.slice(0, 30)) {
      console.log(`  ${f.file}:${f.line}  ${f.match}`);
    }
    if (voidFails.length > 30) console.log(`  ...and ${voidFails.length - 30} more.`);
    console.log(`  FIX: replace <br> with <br />, <hr> with <hr />, <wbr> with <wbr />.`);
  }

  if (hasStyle) {
    console.log(`\nFAIL: ${styleFails.length} HTML-style \`style="..."\` attr(s) in JSX context.`);
    for (const f of styleFails.slice(0, 30)) {
      console.log(`  ${f.file}:${f.line}`);
    }
    if (styleFails.length > 30) console.log(`  ...and ${styleFails.length - 30} more.`);
    console.log(`  FIX: remove inline style (use CSS class) OR convert to style={{...}} object.`);
  }

  if (hasClass) {
    console.log(`\nFAIL: ${classFails.length} \`class="..."\` attr(s) in JSX context.`);
    for (const f of classFails.slice(0, 30)) {
      console.log(`  ${f.file}:${f.line}`);
    }
    if (classFails.length > 30) console.log(`  ...and ${classFails.length - 30} more.`);
    console.log(`  FIX: rename class= to className= inside JSX/MDX tags.`);
  }

  if (hasLink) {
    console.log(`\nFAIL: ${linkFails.length} legacy internal link(s).`);
    for (const f of linkFails.slice(0, 30)) {
      console.log(`  ${f.file}:${f.line}  [${f.kind}] ${f.match} -> /articles/${f.slug}`);
    }
    if (linkFails.length > 30) console.log(`  ...and ${linkFails.length - 30} more.`);
    console.log(`  FIX: canonical URL is /articles/{slug}. Rewrite legacy /slug/ -> /articles/slug.`);
  }

  const totalFails = voidFails.length + linkFails.length + styleFails.length + classFails.length;
  if (totalFails === 0) {
    console.log(`PASS - all MDX syntax clean.`);
    process.exit(0);
  } else {
    console.log(`\nBLOCKED: ${voidFails.length} void + ${styleFails.length} style + ${classFails.length} class + ${linkFails.length} link issues.`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(2); });