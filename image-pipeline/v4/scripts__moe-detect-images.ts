/**
 * Moe face detection scanner for images.
 *
 * Scans a folder of images (default: public/images/inbox/) and runs face
 * detection + recognition against Moe's face descriptor database.
 *
 * Public API (for pipeline integration):
 *   - detectMoeInImages(folder)  → { file, hasMoe, confidence, numFaces }[]
 *
 * CLI usage:
 *   npx tsx image-pipeline/v4/scripts__moe-detect-images.ts [folder]
 *   npx tsx image-pipeline/v4/scripts__moe-detect-images.ts           # default: public/images/inbox/
 *
 * HEIC support:
 *   Converts HEIC/HEIF to temporary JPG before face detection.
 *   (Critical: 23 inbox images are HEIC but mislabeled as .jpg)
 *
 * Output:
 *   - Console table with results
 *   - JSON file: data/moe-detection-results.json
 *   - Sorted by confidence (best match first)
 *
 * Confidence levels:
 *   - hasMoe=true, confidence<0.4  → moe-featured-candidate (very confident)
 *   - hasMoe=true, confidence<0.5  → moe-confirmed (confident)
 *   - hasMoe=false                 → no-moe
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faceapi = require('@vladmandic/face-api');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const canvas = require('canvas');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

const { Canvas, Image, ImageData, loadImage } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const FACE_MODELS_DIR = 'data/face-models';
const FACE_DB_DIR = 'data/face-db';
const DEFAULT_INBOX_FOLDER = 'public/images/inbox';
const MOE_CONFIDENCE_THRESHOLD = 0.5; // euclidean distance < 0.5 = match
const MOE_FEATURED_THRESHOLD = 0.4; // very confident match
const HEIC_EXTENSIONS = /\.(heic|heif)$/i;
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|heic|heif)$/i;

interface DescriptorEntry {
  source: string;
  descriptor: number[];
}

interface FaceDB {
  name: string;
  builtAt: string;
  modelVersion: string;
  descriptors: DescriptorEntry[];
}

export interface MoeDetectionResult {
  file: string;
  hasMoe: boolean;
  confidence: number; // euclidean distance, lower = better match
  numFaces: number;
  confidenceLevel?: 'moe-featured-candidate' | 'moe-confirmed' | 'no-moe';
}

let modelsReady = false;

/**
 * Ensure face-api models are loaded from disk.
 */
async function ensureModels(): Promise<void> {
  if (modelsReady) return;
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(FACE_MODELS_DIR);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(FACE_MODELS_DIR);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(FACE_MODELS_DIR);
    modelsReady = true;
  } catch (err) {
    throw new Error(
      `Failed to load face-api models from ${FACE_MODELS_DIR}: ${(err as Error).message}`
    );
  }
}

/**
 * Load Moe's face descriptor database.
 */
async function loadMoeDB(): Promise<FaceDB | null> {
  const p = path.join(FACE_DB_DIR, 'moe.json');
  try {
    const raw = await fs.readFile(p, 'utf-8');
    return JSON.parse(raw) as FaceDB;
  } catch {
    return null;
  }
}

/**
 * Euclidean distance between two float arrays.
 */
function euclidean(a: number[] | Float32Array, b: number[] | Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] as number) - (b[i] as number);
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/**
 * Convert HEIC/HEIF image to temporary JPG using sharp.
 * Returns the path to a temporary JPG file.
 * Caller must clean up the temporary file.
 */
async function convertHeicToJpg(imgPath: string): Promise<string> {
  const tmpPath = path.join(path.dirname(imgPath), `.tmp_${path.basename(imgPath)}.jpg`);
  await sharp(imgPath).jpeg({ quality: 85 }).toFile(tmpPath);
  return tmpPath;
}

/**
 * Detect faces in a single image and compute best match score against Moe DB.
 * Handles HEIC/HEIF by converting to temporary JPG first.
 */
async function detectMoeInImage(
  imgPath: string,
  moeDB: FaceDB
): Promise<MoeDetectionResult> {
  let workingPath = imgPath;
  let isTempFile = false;

  try {
    // Check if it's a HEIC file (either by extension or by magic bytes)
    const isHeic =
      HEIC_EXTENSIONS.test(imgPath) ||
      (await checkIfHeic(imgPath));

    if (isHeic) {
      try {
        workingPath = await convertHeicToJpg(imgPath);
        isTempFile = true;
      } catch (err) {
        console.warn(
          `[moe-detect] failed to convert HEIC ${path.basename(imgPath)}: ${(err as Error).message}`
        );
        return {
          file: path.basename(imgPath),
          hasMoe: false,
          confidence: Number.POSITIVE_INFINITY,
          numFaces: 0,
          confidenceLevel: 'no-moe',
        };
      }
    }

    // Load and detect faces
    const img = await loadImage(workingPath);
    // @ts-expect-error — canvas type mismatch
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const result: MoeDetectionResult = {
      file: path.basename(imgPath),
      hasMoe: false,
      confidence: Number.POSITIVE_INFINITY,
      numFaces: detections?.length ?? 0,
      confidenceLevel: 'no-moe',
    };

    if (!detections || detections.length === 0) {
      return result;
    }

    // Find best match score across all detected faces and Moe descriptors
    let bestScore = Number.POSITIVE_INFINITY;
    for (const det of detections) {
      const d = Array.from(det.descriptor as Float32Array);
      for (const ref of moeDB.descriptors) {
        const score = euclidean(d, ref.descriptor);
        if (score < bestScore) bestScore = score;
      }
    }

    result.confidence = bestScore;
    result.hasMoe = bestScore < MOE_CONFIDENCE_THRESHOLD;

    if (result.hasMoe) {
      if (bestScore < MOE_FEATURED_THRESHOLD) {
        result.confidenceLevel = 'moe-featured-candidate';
      } else {
        result.confidenceLevel = 'moe-confirmed';
      }
    }

    return result;
  } catch (err) {
    console.warn(
      `[moe-detect] error processing ${path.basename(imgPath)}: ${(err as Error).message}`
    );
    return {
      file: path.basename(imgPath),
      hasMoe: false,
      confidence: Number.POSITIVE_INFINITY,
      numFaces: 0,
      confidenceLevel: 'no-moe',
    };
  } finally {
    // Clean up temporary file
    if (isTempFile) {
      await fs.unlink(workingPath).catch(() => undefined);
    }
  }
}

/**
 * Check if a file is actually HEIC format by reading first few bytes (magic number).
 * HEIC files start with 'ftyp' (0x66 0x74 0x79 0x70) at offset 4.
 */
async function checkIfHeic(filePath: string): Promise<boolean> {
  try {
    const handle = await fs.open(filePath, 'r');
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, 12, 0);
    await handle.close();
    // Check for ftyp signature at offset 4
    return buffer.toString('ascii', 4, 8) === 'ftyp';
  } catch {
    return false;
  }
}

/**
 * List all images in a folder that match supported extensions.
 */
async function listImagesInFolder(folder: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(folder);
    return entries
      .filter((e) => IMAGE_EXTENSIONS.test(e))
      .map((e) => path.join(folder, e))
      .sort();
  } catch (err) {
    throw new Error(`Failed to read folder ${folder}: ${(err as Error).message}`);
  }
}

/**
 * Main detection function: scan a folder and detect Moe in all images.
 */
export async function detectMoeInImages(folder: string): Promise<MoeDetectionResult[]> {
  // Validate folder
  if (!existsSync(folder)) {
    console.warn(`[moe-detect] folder not found: ${folder}`);
    return [];
  }

  // Load Moe DB
  const moeDB = await loadMoeDB();
  if (!moeDB) {
    console.warn(`[moe-detect] no Moe face database found. Run: npx tsx image-pipeline/v4/scripts__build-face-db.ts moe`);
    return [];
  }

  // Ensure models are ready
  await ensureModels();

  // List images
  const images = await listImagesInFolder(folder);
  if (images.length === 0) {
    console.log(`[moe-detect] no images found in ${folder}`);
    return [];
  }

  console.log(`[moe-detect] scanning ${images.length} image(s) from ${folder}`);

  // Process each image
  const results: MoeDetectionResult[] = [];
  for (const imgPath of images) {
    const result = await detectMoeInImage(imgPath, moeDB);
    results.push(result);
  }

  // Sort by confidence (best match first)
  results.sort((a, b) => a.confidence - b.confidence);

  return results;
}

/**
 * CLI entry point.
 */
async function cli(): Promise<void> {
  const folder = process.argv[2] ?? DEFAULT_INBOX_FOLDER;

  console.log(`\n[moe-detect] Starting Moe face detection...`);
  console.log(`[moe-detect] Folder: ${folder}\n`);

  const results = await detectMoeInImages(folder);

  if (results.length === 0) {
    console.log('No images to process.');
    return;
  }

  // Print results table
  console.log('='.repeat(90));
  console.log(
    `${'File':<40} ${'Moe?':<8} ${'Confidence':<15} ${'Faces':<8} ${'Level':<25}`
  );
  console.log('='.repeat(90));

  let moeCount = 0;
  let featuredCount = 0;

  for (const result of results) {
    const moeStr = result.hasMoe ? 'YES' : 'NO';
    const confStr = result.confidence === Number.POSITIVE_INFINITY
      ? '—'
      : result.confidence.toFixed(4);
    const levelStr = result.confidenceLevel ?? '—';

    console.log(
      `${result.file.substring(0, 39):<40} ${moeStr:<8} ${confStr:<15} ${result.numFaces:<8} ${levelStr:<25}`
    );

    if (result.hasMoe) {
      moeCount++;
      if (result.confidenceLevel === 'moe-featured-candidate') {
        featuredCount++;
      }
    }
  }

  console.log('='.repeat(90));
  console.log(`\nSummary: ${moeCount} image(s) with Moe, ${featuredCount} featured candidates\n`);

  // Write JSON results to file
  const outputPath = 'data/moe-detection-results.json';
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Results saved to: ${outputPath}`);
}

if (require.main === module) {
  cli().catch((err) => {
    console.error(`[moe-detect] fatal error: ${(err as Error).message}`);
    process.exit(1);
  });
}
