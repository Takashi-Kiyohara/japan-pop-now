/**
 * Semantic placement helper (v4.1)
 *
 * OCR-based + caption-hint-based section classification.
 * Called from process-image-inbox_v4.ts when mode=existing & position=auto.
 *
 * Zero API cost — uses tesseract.js locally in GitHub Actions.
 *
 * Install:
 *   npm install --save-dev tesseract.js
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { createWorker, type Worker } from 'tesseract.js';

// ============================================================
// Image type classification
// ============================================================

export type ImageType =
  | 'price-tag' // menu board, price sign, ¥ symbols
  | 'signage' // street/shop sign, Japanese text
  | 'food' // dish/plate photo (text unlikely)
  | 'goods' // merchandise/plush/figure
  | 'interior' // shop interior
  | 'exterior' // shop exterior
  | 'scene' // general scene, no strong signal
  | 'menu'; // menu item list

export interface OCRResult {
  text: string;
  confidence: number;
  hasPrice: boolean;
  hasJapanese: boolean;
  wordCount: number;
}

let cachedWorker: Worker | null = null;

async function getWorker(): Promise<Worker> {
  if (cachedWorker) return cachedWorker;
  // Initialize with both English and Japanese
  cachedWorker = await createWorker(['eng', 'jpn']);
  return cachedWorker;
}

export async function disposeWorker(): Promise<void> {
  if (cachedWorker) {
    await cachedWorker.terminate();
    cachedWorker = null;
  }
}

/**
 * Run OCR on image. Returns raw text and useful flags.
 */
export async function ocrImage(imagePath: string): Promise<OCRResult> {
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(imagePath);
    const text = data.text || '';
    const confidence = data.confidence || 0;

    // Price detection: ¥ symbol OR digit + 円 OR "price"/"cost" keywords
    const hasPrice =
      /¥\s?\d/.test(text) ||
      /\d[,\d]*\s*円/.test(text) ||
      /\b(price|cost|fee|menu|¥)\b/i.test(text) ||
      /\b\d{3,5}\s*(yen|jpy)\b/i.test(text);

    const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(text);

    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

    return { text, confidence, hasPrice, hasJapanese, wordCount };
  } catch (err) {
    console.error('OCR failed:', err);
    return {
      text: '',
      confidence: 0,
      hasPrice: false,
      hasJapanese: false,
      wordCount: 0,
    };
  }
}

// ============================================================
// Caption hint parsing
// ============================================================

const CAPTION_HINTS: Record<string, ImageType> = {
  '#price': 'price-tag',
  '#menu': 'menu',
  '#food': 'food',
  '#goods': 'goods',
  '#merch': 'goods',
  '#interior': 'interior',
  '#exterior': 'exterior',
  '#signage': 'signage',
  '#sign': 'signage',
  '#scene': 'scene',
};

export function captionHintToType(caption: string): ImageType | null {
  if (!caption) return null;
  const lower = caption.toLowerCase();
  for (const [tag, type] of Object.entries(CAPTION_HINTS)) {
    if (lower.includes(tag)) return type;
  }
  return null;
}

// ============================================================
// Classify image from OCR + caption
// ============================================================

export function classifyImage(
  ocr: OCRResult,
  caption: string
): ImageType {
  // Caption hint wins if present
  const hint = captionHintToType(caption);
  if (hint) return hint;

  // OCR-based rules
  if (ocr.hasPrice) {
    // Likely price tag or menu
    return ocr.wordCount > 20 ? 'menu' : 'price-tag';
  }

  if (ocr.hasJapanese && ocr.wordCount > 3) {
    return 'signage';
  }

  if (ocr.wordCount > 15 && !ocr.hasJapanese) {
    // Lots of English text → probably menu or info board
    return 'menu';
  }

  // No strong OCR signal → scene
  return 'scene';
}

// ============================================================
// Section matching — find best H2 section for image type
// ============================================================

export interface SectionMatch {
  h2Index: number; // 1-based
  h2Title: string;
  lineIndex: number; // in content lines array
  score: number;
  reason: string;
}

// Keyword sets per image type (lowercase, matched against H2 titles AND following paragraphs)
const TYPE_KEYWORDS: Record<ImageType, string[]> = {
  'price-tag': [
    'price',
    'pricing',
    'cost',
    'fee',
    'menu',
    'how much',
    '値段',
    '料金',
    '価格',
    '¥',
    'yen',
  ],
  menu: [
    'menu',
    'food',
    'drink',
    'order',
    'what we ate',
    'what to order',
    'メニュー',
    '飲食',
  ],
  food: [
    'food',
    'eat',
    'ate',
    'dish',
    'plate',
    'cuisine',
    'what we ate',
    'taste',
    'flavor',
    '料理',
    '食事',
  ],
  goods: [
    'goods',
    'merch',
    'merchandise',
    'shopping',
    'buy',
    'souvenir',
    'plush',
    'figure',
    'character goods',
    'グッズ',
    'お土産',
  ],
  interior: [
    'inside',
    'interior',
    'atmosphere',
    'decor',
    'decoration',
    'seating',
    'vibe',
    '内装',
    '店内',
  ],
  exterior: [
    'outside',
    'exterior',
    'getting there',
    'location',
    'how to get',
    'access',
    'entrance',
    'facade',
    '外観',
    'アクセス',
  ],
  signage: [
    'getting there',
    'location',
    'how to get',
    'access',
    'entrance',
    'directions',
    'find',
    '場所',
    'アクセス',
  ],
  scene: [], // no strong match, will fall back
};

interface ArticleStructure {
  h2s: { index: number; title: string; lineIndex: number; bodyText: string }[];
}

export function parseArticleStructure(content: string): ArticleStructure {
  const lines = content.split('\n');
  const h2s: ArticleStructure['h2s'] = [];
  let current: ArticleStructure['h2s'][number] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) h2s.push(current);
      current = {
        index: h2s.length + 1,
        title: m[1],
        lineIndex: i,
        bodyText: '',
      };
    } else if (current && !/^#/.test(line)) {
      current.bodyText += ' ' + line;
    }
  }
  if (current) h2s.push(current);

  return { h2s };
}

export function matchSection(
  type: ImageType,
  structure: ArticleStructure
): SectionMatch | null {
  const keywords = TYPE_KEYWORDS[type];
  if (keywords.length === 0) return null;

  let best: SectionMatch | null = null;

  for (const h2 of structure.h2s) {
    const titleLower = h2.title.toLowerCase();
    const bodyLower = h2.bodyText.toLowerCase();

    let score = 0;
    let reason = '';

    for (const kw of keywords) {
      if (titleLower.includes(kw)) {
        score += 10;
        reason += `title:${kw} `;
      }
      if (bodyLower.includes(kw)) {
        score += 2;
        reason += `body:${kw} `;
      }
    }

    if (score > (best?.score || 0)) {
      best = {
        h2Index: h2.index,
        h2Title: h2.title,
        lineIndex: h2.lineIndex,
        score,
        reason: reason.trim(),
      };
    }
  }

  // Require minimum score to accept match
  if (!best || best.score < 10) return null;
  return best;
}

// ============================================================
// Paragraph-level matching for price tags — finds specific
// paragraph mentioning ¥ or prices and returns insert line
// ============================================================

export function matchParagraphForPrice(content: string): number | null {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      /¥\s?\d/.test(line) ||
      /\d[,\d]*\s*円/.test(line) ||
      /\d{3,5}\s*(yen|jpy)/i.test(line) ||
      /\b(costs?|priced?|starting at|from)\s+¥?\d/i.test(line)
    ) {
      // Return the line after this paragraph (next blank line)
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '') return j;
      }
      return i + 1;
    }
  }
  return null;
}
