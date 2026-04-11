#!/usr/bin/env tsx
/**
 * process-image-inbox v4.2 — Face-Aware Featured + Semantic Body + No-Haiku
 *
 * v4.1 → v4.2 changes:
 * - Featured images now produce 3 variants (hero/list/og) via face-aware crop
 * - face-api.js detects faces (Moe, interviewees, etc.) and preserves them
 *   across all aspect ratios by computing a smart bounding-box crop
 * - Body images now go through smartResizeBodyImage (resize-only, no crop,
 *   but faces are still detected for library metadata)
 * - Frontmatter gains imageList (800x450) and imageOg (1200x630) fields
 * - Old featured images (including all variants) are backed up to _replaced/
 *   on replace-worst decisions
 *
 * Cost: still ¥0. face-api adds ~2s/image, sharp crop ~1s/variant.
 *
 * Decision precedence (unchanged from v4.1):
 *   1. Explicit position hint (body-top/featured/etc) → skip semantic
 *   2. Caption tag hint (#price/#food/etc) → use as image type
 *   3. OCR-derived image type → match to article sections
 *   4. Fall back to v4 quality-based rules
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import matter from 'gray-matter';
import {
  ocrImage,
  classifyImage,
  parseArticleStructure,
  matchSection,
  matchParagraphForPrice,
  disposeWorker,
  type ImageType,
  type OCRResult,
} from './scripts__semantic-placement';
import {
  generateFeaturedVariants,
  smartResizeBodyImage,
  FEATURED_VARIANTS,
  type VariantResult,
} from './scripts__face-aware-crop';
import { filterFramesByPerson } from './scripts__face-identify';

// ============================================================
// Constants
// ============================================================

const INBOX_DIR = 'public/images/inbox';
const LIBRARY_DIR = 'public/images/library';
const ARTICLES_DIR = 'content/articles';
const ARTICLES_IMG_DIR = 'public/images/articles';
const REPLACED_DIR = 'public/images/_replaced';
const LIBRARY_INDEX = 'data/image-library.json';
const STAGING_DIR = 'public/images/articles/_staging';

type Mode = 'library' | 'existing';
type PositionHint =
  | 'auto'
  | 'body-top'
  | 'body-bottom'
  | 'body-tall'
  | 'featured'
  | 'replace-worst'
  | `after-h2-${number}`;

type SizeHint = 'auto' | 'wide' | 'tall';

interface ParsedFilename {
  timestamp: string;
  mode: Mode;
  slug: string | null;
  positionHint: PositionHint;
  sizeHint: SizeHint;
  captionEncoded: string;
  ext: string;
}

interface QualityMeta {
  width: number;
  height: number;
  sharpness_score: number;
  brightness_score: number;
  file_size_kb: number;
  face_count?: number;
  variants?: {
    name: string;
    path: string;
    strategy: string;
  }[];
}

interface SemanticMeta {
  image_type: ImageType;
  ocr_text_preview: string;
  ocr_confidence: number;
  has_price: boolean;
  has_japanese: boolean;
  matched_section: {
    h2_title: string;
    h2_index: number;
    score: number;
    reason: string;
  } | null;
}

interface LibraryEntryV42 {
  id: string;
  path: string;
  source: 'ios-shortcut' | 'video-extract' | 'cowork' | 'manual';
  source_detail: {
    original_filename: string;
    video_id: string | null;
    frame_time_sec: number | null;
  };
  uploaded_at: string;
  mode: Mode;
  quality: QualityMeta;
  semantic: SemanticMeta | null;
  user_meta: {
    caption: string;
    slug_hint: string | null;
    position_hint: string;
  };
  usage: {
    articles: string[];
    inserted_at: string | null;
    position_applied: string | null;
    replaced_image: string | null;
  };
  status: 'indexed' | 'failed' | 'staging';
}

interface LibraryIndex {
  schema_version: string;
  description: string;
  entries: LibraryEntryV42[];
}

// ============================================================
// Parsing
// ============================================================

/**
 * Parse a position hint that may contain a `--[size]` suffix.
 * Examples:
 *   body-top              → { pos: 'body-top', size: 'auto' }
 *   body-top--wide        → { pos: 'body-top', size: 'wide' }
 *   body-top--tall        → { pos: 'body-top', size: 'tall' }
 *   after-h2-3--wide      → { pos: 'after-h2-3', size: 'wide' }
 */
function splitPositionAndSize(raw: string): { pos: PositionHint; size: SizeHint } {
  const m = raw.match(/^(.+?)--(wide|tall)$/);
  if (m) {
    return { pos: m[1] as PositionHint, size: m[2] as SizeHint };
  }
  return { pos: raw as PositionHint, size: 'auto' };
}

function parseFilenameV4(filename: string): ParsedFilename | null {
  const libMatch = filename.match(
    /^IMG_(\d{8}_\d{6})__library(?:__([A-Za-z0-9_-]+))?\.(jpe?g|png|webp)$/i
  );
  if (libMatch) {
    return {
      timestamp: libMatch[1],
      mode: 'library',
      slug: null,
      positionHint: 'auto',
      sizeHint: 'auto',
      captionEncoded: libMatch[2] || '',
      ext: libMatch[3],
    };
  }

  const existMatch = filename.match(
    /^IMG_(\d{8}_\d{6})__existing__([a-z0-9-]+)__([a-z0-9-]+(?:--(?:wide|tall))?)(?:__([A-Za-z0-9_-]+))?\.(jpe?g|png|webp)$/i
  );
  if (existMatch) {
    const { pos, size } = splitPositionAndSize(existMatch[3]);
    return {
      timestamp: existMatch[1],
      mode: 'existing',
      slug: existMatch[2],
      positionHint: pos,
      sizeHint: size,
      captionEncoded: existMatch[4] || '',
      ext: existMatch[5],
    };
  }

  return null;
}

function decodeCaption(encoded: string): string {
  if (!encoded) return '';
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

// ============================================================
// Quality
// ============================================================

async function computeQuality(imagePath: string): Promise<QualityMeta> {
  const stats = await sharp(imagePath).stats();
  const metadata = await sharp(imagePath).metadata();
  const fileStat = await fs.stat(imagePath);

  const avgStdev =
    stats.channels.reduce((acc, c) => acc + c.stdev, 0) / stats.channels.length;
  const sharpness = Math.min(100, Math.round(avgStdev * 1.5));

  const avgMean =
    stats.channels.reduce((acc, c) => acc + c.mean, 0) / stats.channels.length;
  const brightness = Math.round((avgMean / 255) * 100);

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    sharpness_score: sharpness,
    brightness_score: brightness,
    file_size_kb: Math.round(fileStat.size / 1024),
  };
}

// Body images: resize only (no crop), but record face count for library search
async function moveAndResizeBody(
  srcPath: string,
  destPath: string
): Promise<{ faceCount: number }> {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  const { faceCount } = await smartResizeBodyImage(srcPath, destPath, 1600);
  await fs.unlink(srcPath);
  return { faceCount };
}

// Library images: plain resize (cheaper, no face detection needed for storage)
async function moveAndResizeLibrary(srcPath: string, destPath: string): Promise<void> {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await sharp(srcPath)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(destPath);
  await fs.unlink(srcPath);
}

// Featured images: generate 3 variants via face-aware crop, delete source
async function generateFeaturedSet(
  srcPath: string,
  slug: string
): Promise<VariantResult[]> {
  const outputDir = path.join(ARTICLES_IMG_DIR, slug);
  await fs.mkdir(outputDir, { recursive: true });
  const variants = await generateFeaturedVariants(srcPath, outputDir);
  await fs.unlink(srcPath);
  return variants;
}

// ============================================================
// Article & existing image scan
// ============================================================

async function findArticleBySlug(slug: string): Promise<string | null> {
  for (const ext of ['.md', '.mdx']) {
    const p = path.join(ARTICLES_DIR, `${slug}${ext}`);
    try {
      await fs.access(p);
      return p;
    } catch {}
  }
  return null;
}

interface ExistingImage {
  webPath: string;
  absPath: string;
  lineIndex: number;
  isFeatured: boolean;
  quality: QualityMeta;
}

const IMG_MD_RE = /!\[[^\]]*\]\(([^)\s]+)\)/g;

async function scanExistingImages(
  articlePath: string,
  parsed: matter.GrayMatterFile<string>
): Promise<ExistingImage[]> {
  const result: ExistingImage[] = [];

  if (parsed.data.image && typeof parsed.data.image === 'string') {
    const webPath = parsed.data.image;
    const absPath = path.join(process.cwd(), 'public', webPath.replace(/^\//, ''));
    try {
      const quality = await computeQuality(absPath);
      result.push({ webPath, absPath, lineIndex: -1, isFeatured: true, quality });
    } catch {}
  }

  const lines = parsed.content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    IMG_MD_RE.lastIndex = 0;
    const matches = Array.from(lines[i].matchAll(IMG_MD_RE));
    for (const m of matches) {
      const webPath = m[1];
      if (!webPath.startsWith('/images/') && !webPath.startsWith('images/')) continue;
      const absPath = path.join(
        process.cwd(),
        'public',
        webPath.replace(/^\//, '')
      );
      try {
        const quality = await computeQuality(absPath);
        result.push({
          webPath,
          absPath,
          lineIndex: i,
          isFeatured: false,
          quality,
        });
      } catch {}
    }
  }

  return result;
}

// ============================================================
// Semantic-aware placement decision (unchanged from v4.1)
// ============================================================

type PlacementDecision =
  | { type: 'body-top' }
  | { type: 'body-bottom' }
  | { type: 'body-tall' }
  | { type: 'featured' }
  | { type: 'replace-worst'; replaced: ExistingImage }
  | { type: 'after-h2'; index: number }
  | { type: 'after-line'; line: number; label: string }
  | { type: 'staging'; reason: string };

async function decideSemanticPlacement(
  positionHint: PositionHint,
  caption: string,
  imagePath: string,
  newQuality: QualityMeta,
  articleContent: string,
  existing: ExistingImage[]
): Promise<{ decision: PlacementDecision; semantic: SemanticMeta | null }> {
  if (positionHint !== 'auto') {
    return {
      decision: applyExplicitHint(positionHint, newQuality, existing),
      semantic: null,
    };
  }

  console.log(`    OCR: ${path.basename(imagePath)}`);
  const ocr = await ocrImage(imagePath);
  const imageType = classifyImage(ocr, caption);
  console.log(
    `    classified: ${imageType} (hasPrice=${ocr.hasPrice}, hasJP=${ocr.hasJapanese}, words=${ocr.wordCount})`
  );

  const structure = parseArticleStructure(articleContent);

  let decision: PlacementDecision;
  let matchedSection: SemanticMeta['matched_section'] = null;

  if (imageType === 'price-tag') {
    const priceLineIdx = matchParagraphForPrice(articleContent);
    if (priceLineIdx !== null) {
      decision = {
        type: 'after-line',
        line: priceLineIdx,
        label: `paragraph-with-price (line ${priceLineIdx})`,
      };
      return {
        decision,
        semantic: buildSemanticMeta(ocr, imageType, matchedSection),
      };
    }
  }

  const match = matchSection(imageType, structure);
  if (match) {
    matchedSection = {
      h2_title: match.h2Title,
      h2_index: match.h2Index,
      score: match.score,
      reason: match.reason,
    };
    decision = { type: 'after-h2', index: match.h2Index };
    return {
      decision,
      semantic: buildSemanticMeta(ocr, imageType, matchedSection),
    };
  }

  decision = qualityBasedFallback(newQuality, existing);
  return {
    decision,
    semantic: buildSemanticMeta(ocr, imageType, null),
  };
}

function buildSemanticMeta(
  ocr: OCRResult,
  imageType: ImageType,
  matchedSection: SemanticMeta['matched_section']
): SemanticMeta {
  return {
    image_type: imageType,
    ocr_text_preview: ocr.text.slice(0, 200),
    ocr_confidence: ocr.confidence,
    has_price: ocr.hasPrice,
    has_japanese: ocr.hasJapanese,
    matched_section: matchedSection,
  };
}

function applyExplicitHint(
  hint: PositionHint,
  newQuality: QualityMeta,
  existing: ExistingImage[]
): PlacementDecision {
  if (hint === 'body-top') return { type: 'body-top' };
  if (hint === 'body-bottom') return { type: 'body-bottom' };
  if (hint === 'body-tall') return { type: 'body-tall' };
  if (hint === 'featured') return { type: 'featured' };
  if (hint === 'replace-worst') {
    const bodyImages = existing.filter((e) => !e.isFeatured);
    if (bodyImages.length === 0) return { type: 'body-top' };
    const worst = bodyImages.reduce((a, b) =>
      a.quality.sharpness_score < b.quality.sharpness_score ? a : b
    );
    return { type: 'replace-worst', replaced: worst };
  }
  const m = hint.match(/^after-h2-(\d+)$/);
  if (m) return { type: 'after-h2', index: parseInt(m[1], 10) };
  return { type: 'body-bottom' };
}

function qualityBasedFallback(
  newQuality: QualityMeta,
  existing: ExistingImage[]
): PlacementDecision {
  if (existing.length === 0) return { type: 'body-top' };

  const hasFeatured = existing.some((e) => e.isFeatured);
  if (!hasFeatured && newQuality.sharpness_score >= 70) {
    return { type: 'featured' };
  }

  const bodyImages = existing.filter((e) => !e.isFeatured);
  if (bodyImages.length >= 3) {
    const minExisting = Math.min(...bodyImages.map((e) => e.quality.sharpness_score));
    if (newQuality.sharpness_score < minExisting) {
      return {
        type: 'staging',
        reason: `quality fallback: sharpness ${newQuality.sharpness_score} < min ${minExisting}`,
      };
    }
  }

  if (bodyImages.length > 0) {
    const worst = bodyImages.reduce((a, b) =>
      a.quality.sharpness_score < b.quality.sharpness_score ? a : b
    );
    if (
      newQuality.sharpness_score > worst.quality.sharpness_score + 15 &&
      worst.quality.sharpness_score < 60
    ) {
      return { type: 'replace-worst', replaced: worst };
    }
  }

  return { type: 'body-bottom' };
}

// ============================================================
// Backup old featured variants to _replaced/
// ============================================================

async function backupOldFeatured(
  parsed: matter.GrayMatterFile<string>,
  slug: string
): Promise<string[]> {
  const backed: string[] = [];
  const candidates = [
    parsed.data.image,
    parsed.data.imageList,
    parsed.data.imageOg,
  ].filter((v): v is string => typeof v === 'string');

  await fs.mkdir(REPLACED_DIR, { recursive: true });
  const ts = Date.now();

  for (const webPath of candidates) {
    const abs = path.join(process.cwd(), 'public', webPath.replace(/^\//, ''));
    const backupName = `${ts}_${slug}_${path.basename(webPath)}`;
    const backupPath = path.join(REPLACED_DIR, backupName);
    try {
      await fs.copyFile(abs, backupPath);
      backed.push(webPath);
    } catch {}
  }
  return backed;
}

// ============================================================
// Apply placement — featured branch uses 3-variant generation
// ============================================================

interface ApplyContext {
  articlePath: string;
  srcPath: string; // inbox path (before any move)
  slug: string;
  altText: string;
  decision: PlacementDecision;
  timestamp: string;
}

interface ApplyResult {
  positionApplied: string;
  replacedImage: string | null;
  webPath: string; // primary image path used in library entry
  variants?: VariantResult[];
  faceCount?: number;
}

async function applyPlacementV42(ctx: ApplyContext): Promise<ApplyResult> {
  const { articlePath, srcPath, slug, altText, decision, timestamp } = ctx;
  const raw = await fs.readFile(articlePath, 'utf-8');
  const parsed = matter(raw);
  const mkImg = (alt: string, url: string) => `![${alt}](${url})`;

  // ----- FEATURED: generate 3 variants, update frontmatter -----
  if (decision.type === 'featured') {
    // Backup existing featured set if any
    const backed = await backupOldFeatured(parsed, slug);

    const variants = await generateFeaturedSet(srcPath, slug);
    const byName = (n: string) => variants.find((v) => v.name === n);
    const hero = byName('featured-hero.jpg');
    const list = byName('featured-list.jpg');
    const og = byName('featured-og.jpg');

    const heroWeb = `/images/articles/${slug}/featured-hero.jpg`;
    const listWeb = `/images/articles/${slug}/featured-list.jpg`;
    const ogWeb = `/images/articles/${slug}/featured-og.jpg`;

    parsed.data.image = heroWeb;
    parsed.data.imageList = listWeb;
    parsed.data.imageOg = ogWeb;
    if (altText) parsed.data.imageAlt = altText;

    const out = matter.stringify(parsed.content, parsed.data);
    await fs.writeFile(articlePath, out);

    const strategies = variants
      .map((v) => `${v.name.replace('featured-', '').replace('.jpg', '')}:${v.strategy}`)
      .join(',');
    const faceCount = hero?.faceCount ?? 0;
    const replacedStr = backed.length > 0 ? backed[0] : null;

    return {
      positionApplied: `featured-3variant(${strategies}, faces=${faceCount})`,
      replacedImage: replacedStr,
      webPath: heroWeb,
      variants,
      faceCount,
    };
  }

  // ----- REPLACE-WORST where worst is featured: also do 3-variant swap -----
  if (decision.type === 'replace-worst' && decision.replaced.isFeatured) {
    const backed = await backupOldFeatured(parsed, slug);

    const variants = await generateFeaturedSet(srcPath, slug);
    const hero = variants.find((v) => v.name === 'featured-hero.jpg');

    const heroWeb = `/images/articles/${slug}/featured-hero.jpg`;
    const listWeb = `/images/articles/${slug}/featured-list.jpg`;
    const ogWeb = `/images/articles/${slug}/featured-og.jpg`;

    parsed.data.image = heroWeb;
    parsed.data.imageList = listWeb;
    parsed.data.imageOg = ogWeb;
    if (altText) parsed.data.imageAlt = altText;

    const out = matter.stringify(parsed.content, parsed.data);
    await fs.writeFile(articlePath, out);

    return {
      positionApplied: `replace-featured-3variant(faces=${hero?.faceCount ?? 0})`,
      replacedImage: backed[0] || decision.replaced.webPath,
      webPath: heroWeb,
      variants,
      faceCount: hero?.faceCount ?? 0,
    };
  }

  // ----- BODY placements: resize (+ optional tall crop), then insert into MDX -----
  const destFilename = `${timestamp}.jpg`;
  const destPath = path.join(ARTICLES_IMG_DIR, slug, destFilename);
  const webPath = `/images/articles/${slug}/${destFilename}`;
  const isTallCrop = decision.type === 'body-tall';
  const { faceCount } = await moveAndResizeBody(srcPath, destPath, isTallCrop);

  let replacedImage: string | null = null;

  switch (decision.type) {
    case 'body-top': {
      const lines = parsed.content.split('\n');
      const h2Idx = lines.findIndex((l) => /^##\s/.test(l));
      const imgMd = `\n${mkImg(altText, webPath)}\n`;
      if (h2Idx === -1) parsed.content = imgMd + '\n' + parsed.content;
      else {
        lines.splice(h2Idx + 1, 0, imgMd);
        parsed.content = lines.join('\n');
      }
      break;
    }

    case 'body-tall': {
      // Same as body-bottom but image was 4:3 cropped — insert at bottom
      const lines = parsed.content.split('\n');
      const h2Indices: number[] = [];
      lines.forEach((l, i) => {
        if (/^##\s/.test(l)) h2Indices.push(i);
      });
      const imgMd = `\n${mkImg(altText, webPath)}\n`;
      if (h2Indices.length === 0) {
        parsed.content = parsed.content + '\n' + imgMd;
      } else {
        lines.splice(h2Indices[h2Indices.length - 1], 0, imgMd);
        parsed.content = lines.join('\n');
      }
      break;
    }

    case 'body-bottom': {
      const lines = parsed.content.split('\n');
      const h2Indices: number[] = [];
      lines.forEach((l, i) => {
        if (/^##\s/.test(l)) h2Indices.push(i);
      });
      const imgMd = `\n${mkImg(altText, webPath)}\n`;
      if (h2Indices.length === 0) {
        parsed.content = parsed.content + '\n' + imgMd;
      } else {
        lines.splice(h2Indices[h2Indices.length - 1], 0, imgMd);
        parsed.content = lines.join('\n');
      }
      break;
    }

    case 'after-h2': {
      const lines = parsed.content.split('\n');
      const h2Indices: number[] = [];
      lines.forEach((l, i) => {
        if (/^##\s/.test(l)) h2Indices.push(i);
      });
      const target = h2Indices[decision.index - 1];
      const imgMd = `\n${mkImg(altText, webPath)}\n`;
      if (target !== undefined) {
        lines.splice(target + 1, 0, imgMd);
      } else {
        parsed.content = parsed.content + '\n' + imgMd;
      }
      parsed.content = lines.join('\n');
      break;
    }

    case 'after-line': {
      const lines = parsed.content.split('\n');
      const imgMd = mkImg(altText, webPath);
      lines.splice(decision.line, 0, '', imgMd, '');
      parsed.content = lines.join('\n');
      break;
    }

    case 'replace-worst': {
      // Body replace (non-featured): swap markdown reference, backup old
      const oldWebPath = decision.replaced.webPath;
      await fs.mkdir(REPLACED_DIR, { recursive: true });
      const backupName = `${Date.now()}_${path.basename(oldWebPath)}`;
      const backupPath = path.join(REPLACED_DIR, backupName);
      try {
        await fs.copyFile(decision.replaced.absPath, backupPath);
      } catch {}
      replacedImage = oldWebPath;
      parsed.content = parsed.content.replace(
        new RegExp(
          `!\\[[^\\]]*\\]\\(${oldWebPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`,
          'g'
        ),
        mkImg(altText, webPath)
      );
      break;
    }
  }

  const out = matter.stringify(parsed.content, parsed.data);
  await fs.writeFile(articlePath, out);

  const label =
    decision.type === 'after-line'
      ? `after-line:${decision.line}(${decision.label})`
      : decision.type === 'after-h2'
        ? `after-h2-${decision.index}`
        : decision.type;

  return {
    positionApplied: `${label}(faces=${faceCount})`,
    replacedImage,
    webPath,
    faceCount,
  };
}

// ============================================================
// Library I/O
// ============================================================

async function loadLibrary(): Promise<LibraryIndex> {
  try {
    const data = await fs.readFile(LIBRARY_INDEX, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      schema_version: '4.2',
      description: 'Image library index (semantic + face-aware)',
      entries: [],
    };
  }
}

async function saveLibrary(idx: LibraryIndex): Promise<void> {
  idx.schema_version = '4.2';
  await fs.mkdir(path.dirname(LIBRARY_INDEX), { recursive: true });
  await fs.writeFile(LIBRARY_INDEX, JSON.stringify(idx, null, 2) + '\n');
}

// ============================================================
// Main
// ============================================================

async function listInboxImages(): Promise<string[]> {
  try {
    const files = await fs.readdir(INBOX_DIR);
    return files
      // Video files (.mp4/.mov etc.) are pre-extracted to jpg by the
      // GitHub Actions "Extract keyframes from video inbox" step before
      // this script runs. Non-image files are intentionally skipped here.
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => path.join(INBOX_DIR, f));
  } catch {
    return [];
  }
}

/**
 * Pre-process any `.filter` sidecar markers dropped by the video-extraction
 * step. Each sidecar names a target person (e.g. "moe"). We group all frames
 * sharing a sidecar-person and run filterFramesByPerson against the face DB
 * built by scripts__build-face-db.ts. Frames where the person is not
 * detected (euclidean ≥ 0.5) are deleted; matching frames continue into the
 * normal inbox pipeline.
 *
 * No-op if there are no .filter sidecars in the inbox.
 */
async function applyFaceFilters(): Promise<void> {
  let files: string[];
  try {
    files = await fs.readdir(INBOX_DIR);
  } catch {
    return;
  }

  const groups: Record<string, string[]> = {};
  for (const f of files) {
    if (!f.endsWith('.filter')) continue;
    const framePath = path.join(INBOX_DIR, f.replace(/\.filter$/, ''));
    try {
      const person = (await fs.readFile(path.join(INBOX_DIR, f), 'utf-8'))
        .trim()
        .toLowerCase();
      if (!person) continue;
      (groups[person] ??= []).push(framePath);
    } catch {
      // ignore unreadable sidecar
    }
  }

  for (const [person, frames] of Object.entries(groups)) {
    console.log(`[face-filter] ${person}: checking ${frames.length} frame(s)`);
    try {
      await filterFramesByPerson(frames, person);
    } catch (err) {
      console.warn(
        `[face-filter] ${person} failed: ${(err as Error).message}`
      );
    }
  }
}

function captionToAlt(caption: string, slug: string | null): string {
  const cleaned = caption
    .replace(/#[a-z]+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned) return cleaned;
  if (slug) return slug.replace(/-/g, ' ');
  return 'Image';
}

async function main() {
  const library = await loadLibrary();
  await applyFaceFilters();
  const inbox = await listInboxImages();

  if (inbox.length === 0) {
    console.log('Inbox empty.');
    console.log('::set-output name=changes::false');
    return;
  }

  console.log(`Processing ${inbox.length} inbox images (v4.2 face-aware + semantic)...`);

  const summary: string[] = [];
  let changes = false;

  try {
    for (const src of inbox) {
      const filename = path.basename(src);
      const parsedName = parseFilenameV4(filename);
      if (!parsedName) {
        summary.push(`- ⏭️ skipped (unparsable): ${filename}`);
        continue;
      }

      const caption = decodeCaption(parsedName.captionEncoded);
      const alt = captionToAlt(caption, parsedName.slug);

      try {
        const quality = await computeQuality(src);

        // ===== LIBRARY MODE =====
        if (parsedName.mode === 'library') {
          const yearMonth = `${parsedName.timestamp.slice(0, 4)}-${parsedName.timestamp.slice(4, 6)}`;
          const destFilename = `IMG_${parsedName.timestamp}.jpg`;
          const destPath = path.join(LIBRARY_DIR, yearMonth, destFilename);
          const webPath = `/images/library/${yearMonth}/${destFilename}`;
          await moveAndResizeLibrary(src, destPath);

          library.entries.push({
            id: `img_${parsedName.timestamp}`,
            path: webPath,
            source: 'ios-shortcut',
            source_detail: {
              original_filename: filename,
              video_id: null,
              frame_time_sec: null,
            },
            uploaded_at: new Date().toISOString(),
            mode: 'library',
            quality,
            semantic: null,
            user_meta: { caption, slug_hint: null, position_hint: 'auto' },
            usage: {
              articles: [],
              inserted_at: null,
              position_applied: null,
              replaced_image: null,
            },
            status: 'indexed',
          });
          summary.push(
            `- 📦 **library** \`${webPath}\` sharp=${quality.sharpness_score}${caption ? ` "${caption}"` : ''}`
          );
          changes = true;
          continue;
        }

        // ===== EXISTING MODE =====
        const slug = parsedName.slug!;
        const articlePath = await findArticleBySlug(slug);
        if (!articlePath) {
          const destPath = path.join(STAGING_DIR, filename);
          await moveAndResizeLibrary(src, destPath);
          summary.push(`- ⚠️ existing \`${slug}\`: article not found → staged`);
          changes = true;
          continue;
        }

        const rawArticle = await fs.readFile(articlePath, 'utf-8');
        const parsedArticle = matter(rawArticle);
        const existingImages = await scanExistingImages(articlePath, parsedArticle);

        const { decision, semantic } = await decideSemanticPlacement(
          parsedName.positionHint,
          caption,
          src,
          quality,
          parsedArticle.content,
          existingImages
        );

        if (decision.type === 'staging') {
          const destPath = path.join(STAGING_DIR, filename);
          await moveAndResizeLibrary(src, destPath);
          summary.push(`- 📦 **staging** \`${slug}\`: ${decision.reason}`);
          library.entries.push({
            id: `img_${parsedName.timestamp}`,
            path: `/images/articles/_staging/${path.basename(destPath)}`,
            source: 'ios-shortcut',
            source_detail: {
              original_filename: filename,
              video_id: null,
              frame_time_sec: null,
            },
            uploaded_at: new Date().toISOString(),
            mode: 'existing',
            quality,
            semantic,
            user_meta: {
              caption,
              slug_hint: slug,
              position_hint: parsedName.positionHint,
            },
            usage: {
              articles: [],
              inserted_at: null,
              position_applied: 'staging',
              replaced_image: null,
            },
            status: 'staging',
          });
          changes = true;
          continue;
        }

        const result = await applyPlacementV42({
          articlePath,
          srcPath: src,
          slug,
          altText: alt,
          decision,
          timestamp: parsedName.timestamp,
        });

        // Augment quality with face + variant info
        const qualityWithFaces: QualityMeta = {
          ...quality,
          face_count: result.faceCount,
          variants: result.variants?.map((v) => ({
            name: v.name,
            path: `/images/articles/${slug}/${v.name}`,
            strategy: v.strategy,
          })),
        };

        library.entries.push({
          id: `img_${parsedName.timestamp}`,
          path: result.webPath,
          source: 'ios-shortcut',
          source_detail: {
            original_filename: filename,
            video_id: null,
            frame_time_sec: null,
          },
          uploaded_at: new Date().toISOString(),
          mode: 'existing',
          quality: qualityWithFaces,
          semantic,
          user_meta: {
            caption,
            slug_hint: slug,
            position_hint: parsedName.positionHint,
          },
          usage: {
            articles: [slug],
            inserted_at: new Date().toISOString(),
            position_applied: result.positionApplied,
            replaced_image: result.replacedImage,
          },
          status: 'indexed',
        });

        const semLabel = semantic
          ? ` [${semantic.image_type}${semantic.matched_section ? `→${semantic.matched_section.h2_title}` : ''}]`
          : '';
        const replaceStr = result.replacedImage ? ` (replaced)` : '';
        summary.push(
          `- ✅ **existing** \`${slug}\`: ${result.positionApplied}${semLabel}${replaceStr}`
        );
        changes = true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        summary.push(`- ❌ \`${filename}\`: ${msg}`);
      }
    }
  } finally {
    await disposeWorker();
  }

  await saveLibrary(library);

  console.log('\n=== Summary ===');
  console.log(summary.join('\n'));
  console.log(`::set-output name=changes::${changes}`);
  console.log(`::set-output name=summary::${summary.join('%0A')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
