/**
 * Face identification against pre-built face descriptor DB.
 *
 * Public API (for pipeline integration):
 *   - loadFaceDB(name)                     → FaceDB | null
 *   - identifyInImage(imgPath, db, t=0.5)  → { matched, bestScore, numFaces }
 *   - filterFramesByPerson(frames, personName)
 *     → writes .filtered marker alongside matching frames, removes the rest
 *
 * Threshold:
 *   Euclidean distance < 0.5 = same person (face-api default ~0.6, we use 0.5
 *   to be stricter and avoid false positives in the auto-publish path).
 */

import fs from 'node:fs/promises';
import path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faceapi = require('@vladmandic/face-api');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const canvas = require('canvas');
const { Canvas, Image, ImageData, loadImage } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const FACE_MODELS_DIR = 'data/face-models';
const FACE_DB_DIR = 'data/face-db';
const DEFAULT_THRESHOLD = 0.5;

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

export interface IdentifyResult {
  matched: boolean;
  bestScore: number; // lower = better match
  numFaces: number;
}

let modelsReady = false;
async function ensureModels(): Promise<void> {
  if (modelsReady) return;
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(FACE_MODELS_DIR);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(FACE_MODELS_DIR);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(FACE_MODELS_DIR);
  modelsReady = true;
}

export async function loadFaceDB(name: string): Promise<FaceDB | null> {
  const p = path.join(FACE_DB_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(p, 'utf-8');
    return JSON.parse(raw) as FaceDB;
  } catch {
    return null;
  }
}

function euclidean(a: number[] | Float32Array, b: number[] | Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] as number) - (b[i] as number);
    sum += d * d;
  }
  return Math.sqrt(sum);
}

export async function identifyInImage(
  imgPath: string,
  db: FaceDB,
  threshold: number = DEFAULT_THRESHOLD
): Promise<IdentifyResult> {
  await ensureModels();
  const img = await loadImage(imgPath);
  // @ts-expect-error — canvas type mismatch
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (!detections || detections.length === 0) {
    return { matched: false, bestScore: Number.POSITIVE_INFINITY, numFaces: 0 };
  }

  let bestScore = Number.POSITIVE_INFINITY;
  for (const det of detections) {
    const d = Array.from(det.descriptor as Float32Array);
    for (const ref of db.descriptors) {
      const score = euclidean(d, ref.descriptor);
      if (score < bestScore) bestScore = score;
    }
  }

  return {
    matched: bestScore < threshold,
    bestScore,
    numFaces: detections.length,
  };
}

/**
 * Filter a list of frame paths, keeping only those where `personName` is
 * detected. Returns the kept paths (same order) and deletes the rest.
 *
 * Also deletes any `<frame>.filter` marker sidecars.
 */
export async function filterFramesByPerson(
  frames: string[],
  personName: string,
  threshold: number = DEFAULT_THRESHOLD
): Promise<{ kept: string[]; scores: Record<string, number> }> {
  const db = await loadFaceDB(personName);
  if (!db) {
    console.warn(
      `[face-identify] no DB for "${personName}" — skipping filter, keeping all frames`
    );
    return { kept: frames, scores: {} };
  }

  const scores: Record<string, number> = {};
  const matched: string[] = [];
  const unmatched: string[] = [];

  for (const frame of frames) {
    try {
      const res = await identifyInImage(frame, db, threshold);
      scores[path.basename(frame)] = res.bestScore;
      if (res.matched) {
        matched.push(frame);
      } else {
        unmatched.push(frame);
      }
      await fs.unlink(`${frame}.filter`).catch(() => undefined);
    } catch (err) {
      console.warn(`[face-identify] error on ${frame}: ${(err as Error).message}`);
      matched.push(frame); // conservative: keep on error
    }
  }

  // Auto-detect mode: if nobody matched, the person isn't in this video —
  // keep ALL frames so non-person videos are not wiped out.
  if (matched.length === 0) {
    console.log(
      `[face-identify] ${personName}: 0 matches → person not in video, keeping all ${frames.length} frames`
    );
    return { kept: frames, scores };
  }

  // Person detected → delete non-matching frames, keep only person frames.
  for (const f of unmatched) {
    await fs.unlink(f).catch(() => undefined);
  }

  console.log(
    `[face-identify] ${personName}: kept ${matched.length}/${frames.length} frames (person detected)`
  );
  return { kept: matched, scores };
}

// CLI: node ... scripts__face-identify.ts <person> <img1> [img2...]
async function cli(): Promise<void> {
  const [person, ...imgs] = process.argv.slice(2);
  if (!person || imgs.length === 0) {
    console.log(
      'Usage: tsx scripts__face-identify.ts <person-name> <image...>'
    );
    process.exit(1);
  }
  const db = await loadFaceDB(person);
  if (!db) {
    console.error(`No face DB for "${person}"`);
    process.exit(1);
  }
  for (const img of imgs) {
    const res = await identifyInImage(img, db);
    console.log(
      `${img}\tmatched=${res.matched}\tscore=${res.bestScore.toFixed(3)}\tfaces=${res.numFaces}`
    );
  }
}

if (require.main === module) {
  cli().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
