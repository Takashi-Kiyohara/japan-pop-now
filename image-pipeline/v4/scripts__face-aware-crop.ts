/**
 * Face-aware smart cropping for featured image variants.
 *
 * Generates 3 crops from a single source image, preserving faces and main subject:
 *   - featured-hero.jpg  (1600x667, 2.4:1)  for article hero
 *   - featured-list.jpg  (800x450,  16:9)   for article card in lists
 *   - featured-og.jpg    (1200x630, 1.9:1)  for OG / Twitter card
 *
 * Cost: ¥0. Uses face-api.js + sharp, both local.
 *
 * Fallback chain:
 *   1. Face detection → crop to include all faces + 20% padding
 *   2. No faces → sharp's `position: 'attention'` smart crop
 *   3. Attention fails → plain center crop
 *
 * Install:
 *   npm install --save-dev @vladmandic/face-api canvas sharp
 * Models needed in data/face-models/:
 *   ssd_mobilenetv1 (detection only, no recognition required for cropping)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// face-api.js requires canvas polyfills
// eslint-disable-next-line @typescript-eslint/no-var-requires
const faceapi = require('@vladmandic/face-api');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const FACE_MODELS_DIR = 'data/face-models';

interface CropBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface VariantSpec {
  name: string;
  width: number;
  height: number;
}

export const FEATURED_VARIANTS: VariantSpec[] = [
  { name: 'featured-hero.jpg', width: 1600, height: 667 },
  { name: 'featured-list.jpg', width: 800, height: 450 },
  { name: 'featured-og.jpg', width: 1200, height: 630 },
];

// ============================================================
// Face detection (one-time model load)
// ============================================================

let modelsLoaded = false;

async function ensureModels(): Promise<void> {
  if (modelsLoaded) return;
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(FACE_MODELS_DIR);
    modelsLoaded = true;
  } catch (err) {
    console.warn('Face detection models not found; falling back to attention crop');
  }
}

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function detectFaces(imagePath: string): Promise<FaceBox[]> {
  await ensureModels();
  if (!modelsLoaded) return [];

  try {
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi.detectAllFaces(
      img as unknown as faceapi.TNetInput,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
    );
    return detections.map((d: { box: FaceBox }) => d.box);
  } catch (err) {
    console.warn('Face detection failed:', err);
    return [];
  }
}

// ============================================================
// Compute crop box that includes all faces
// ============================================================

function unionBoundingBox(faces: FaceBox[]): FaceBox {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const f of faces) {
    minX = Math.min(minX, f.x);
    minY = Math.min(minY, f.y);
    maxX = Math.max(maxX, f.x + f.width);
    maxY = Math.max(maxY, f.y + f.height);
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function expandBox(box: FaceBox, paddingFactor: number): FaceBox {
  const padW = box.width * paddingFactor;
  const padH = box.height * paddingFactor;
  return {
    x: box.x - padW,
    y: box.y - padH,
    width: box.width + padW * 2,
    height: box.height + padH * 2,
  };
}

/**
 * Compute a CropBox of target aspect ratio that
 *   a) entirely contains the faceBox (with padding)
 *   b) stays within image bounds
 *   c) is as tight as possible
 */
function computeFaceAwareCrop(
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
  faceBox: FaceBox
): CropBox {
  const targetRatio = targetWidth / targetHeight;

  // Start with faceBox, grow to target ratio
  let cropW = faceBox.width;
  let cropH = faceBox.height;
  const faceRatio = faceBox.width / faceBox.height;

  if (faceRatio > targetRatio) {
    // Face is wider than target → grow height
    cropH = cropW / targetRatio;
  } else {
    // Face is taller than target → grow width
    cropW = cropH * targetRatio;
  }

  // Grow to minimum 60% of image dimension for quality
  const minCropW = imageWidth * 0.6;
  if (cropW < minCropW) {
    cropW = minCropW;
    cropH = cropW / targetRatio;
  }

  // Cap at image dimensions
  if (cropW > imageWidth) {
    cropW = imageWidth;
    cropH = cropW / targetRatio;
  }
  if (cropH > imageHeight) {
    cropH = imageHeight;
    cropW = cropH * targetRatio;
  }

  // Center on face
  const faceCenterX = faceBox.x + faceBox.width / 2;
  const faceCenterY = faceBox.y + faceBox.height / 2;
  let left = faceCenterX - cropW / 2;
  let top = faceCenterY - cropH / 2;

  // Clamp to image bounds
  left = Math.max(0, Math.min(imageWidth - cropW, left));
  top = Math.max(0, Math.min(imageHeight - cropH, top));

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(cropW),
    height: Math.round(cropH),
  };
}

// ============================================================
// Generate variants
// ============================================================

export interface VariantResult {
  name: string;
  path: string;
  width: number;
  height: number;
  strategy: 'face-aware' | 'attention' | 'center';
  faceCount: number;
}

export async function generateFeaturedVariants(
  sourcePath: string,
  outputDir: string
): Promise<VariantResult[]> {
  await fs.mkdir(outputDir, { recursive: true });

  // Get source dimensions
  const meta = await sharp(sourcePath).metadata();
  const srcW = meta.width || 0;
  const srcH = meta.height || 0;
  if (!srcW || !srcH) throw new Error('Invalid source image dimensions');

  // Detect faces once
  const faces = await detectFaces(sourcePath);
  const paddedFaceBox =
    faces.length > 0 ? expandBox(unionBoundingBox(faces), 0.3) : null;

  const results: VariantResult[] = [];

  for (const variant of FEATURED_VARIANTS) {
    const outPath = path.join(outputDir, variant.name);
    let strategy: VariantResult['strategy'] = 'center';

    try {
      if (paddedFaceBox) {
        const crop = computeFaceAwareCrop(
          srcW,
          srcH,
          variant.width,
          variant.height,
          paddedFaceBox
        );

        await sharp(sourcePath)
          .rotate()
          .extract(crop)
          .resize(variant.width, variant.height, { fit: 'cover' })
          .jpeg({ quality: 88, progressive: true })
          .toFile(outPath);
        strategy = 'face-aware';
      } else {
        // Fall back to sharp's attention crop
        await sharp(sourcePath)
          .rotate()
          .resize(variant.width, variant.height, {
            fit: 'cover',
            position: sharp.strategy.attention,
          })
          .jpeg({ quality: 88, progressive: true })
          .toFile(outPath);
        strategy = 'attention';
      }
    } catch (err) {
      console.warn(
        `${variant.name} face/attention crop failed, using center:`,
        err
      );
      await sharp(sourcePath)
        .rotate()
        .resize(variant.width, variant.height, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 88, progressive: true })
        .toFile(outPath);
      strategy = 'center';
    }

    results.push({
      name: variant.name,
      path: outPath,
      width: variant.width,
      height: variant.height,
      strategy,
      faceCount: faces.length,
    });
  }

  return results;
}

// ============================================================
// Also crop body images if they have faces (optional)
// ============================================================

// Target dimensions for portrait→landscape auto-crop on body images
const BODY_CROP_WIDTH = 1200;
const BODY_CROP_HEIGHT = 675; // 16:9

// Taller crop option (4:3) for body images
const BODY_TALL_WIDTH = 1200;
const BODY_TALL_HEIGHT = 900; // 4:3

/**
 * For body images:
 * - Landscape (w ≥ h): resize to maxWidth, preserve aspect ratio (no crop)
 * - Portrait (h > w): smart-crop to 1200×675 (16:9)
 *     · Face detected → face-aware crop (all faces preserved)
 *     · No faces      → sharp attention crop
 *     · Fallback      → center crop
 */
export async function smartResizeBodyImage(
  sourcePath: string,
  destPath: string,
  maxWidth = 1600,
  forceTallCrop = false   // true → 4:3 (1200×900) instead of 16:9 (1200×675)
): Promise<{ strategy: string; faceCount: number }> {
  const meta = await sharp(sourcePath).metadata();
  const srcW = meta.width || 0;
  const srcH = meta.height || 0;

  const cropW = forceTallCrop ? BODY_TALL_WIDTH  : BODY_CROP_WIDTH;
  const cropH = forceTallCrop ? BODY_TALL_HEIGHT : BODY_CROP_HEIGHT;

  const isPortrait = srcH > srcW || forceTallCrop;

  // ── Portrait or tall-crop → smart crop ─────────────────────
  if (isPortrait) {
    const faces = await detectFaces(sourcePath);
    const label = forceTallCrop ? 'tall' : 'portrait';

    try {
      if (faces.length > 0) {
        const paddedBox = expandBox(unionBoundingBox(faces), 0.3);
        const crop = computeFaceAwareCrop(srcW, srcH, cropW, cropH, paddedBox);
        await sharp(sourcePath)
          .rotate()
          .extract(crop)
          .resize(cropW, cropH, { fit: 'cover' })
          .jpeg({ quality: 85, progressive: true })
          .toFile(destPath);
        return { strategy: `${label}-face-crop`, faceCount: faces.length };
      }

      // No faces → attention crop
      await sharp(sourcePath)
        .rotate()
        .resize(cropW, cropH, { fit: 'cover', position: sharp.strategy.attention })
        .jpeg({ quality: 85, progressive: true })
        .toFile(destPath);
      return { strategy: `${label}-attention-crop`, faceCount: 0 };

    } catch (err) {
      console.warn(`${label} crop failed, using center:`, err);
      await sharp(sourcePath)
        .rotate()
        .resize(cropW, cropH, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85, progressive: true })
        .toFile(destPath);
      return { strategy: `${label}-center-crop`, faceCount: 0 };
    }
  }

  // ── Landscape → resize only, preserve aspect ────────────────
  const faces = await detectFaces(sourcePath);
  await sharp(sourcePath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(destPath);

  return {
    strategy: srcW <= maxWidth ? 'no-crop' : 'resize-only',
    faceCount: faces.length,
  };
}
