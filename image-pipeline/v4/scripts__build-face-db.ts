/**
 * Build face descriptor database for known people (Moe, etc.).
 *
 * Usage:
 *   npx tsx image-pipeline/v4/scripts__build-face-db.ts <person-name>
 *   npx tsx image-pipeline/v4/scripts__build-face-db.ts           # all folders
 *
 * Reads reference images from:
 *   data/face-db/<person>/*.{jpg,jpeg,png,webp}
 *
 * Writes descriptor DB to:
 *   data/face-db/<person>.json
 *
 * Format:
 *   {
 *     "name": "moe",
 *     "builtAt": "2026-04-11T...",
 *     "descriptors": [
 *       { "source": "ref01.jpg", "descriptor": [128 floats] },
 *       ...
 *     ]
 *   }
 *
 * Requires models in data/face-models/:
 *   ssd_mobilenetv1   — detection
 *   face_landmark_68  — landmarks (required by recognition net)
 *   face_recognition  — 128-d descriptor
 *
 * Typical workflow:
 *   1. Put 5–10 reference photos of Moe into data/face-db/moe/ (clear face,
 *      varied angles/expressions, single-subject preferred)
 *   2. Run this script → produces data/face-db/moe.json
 *   3. Upload videos with __moe suffix; face-identify.ts filters frames
 *      where euclidean distance to any moe descriptor < 0.5
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
const IMG_EXT = /\.(jpe?g|png|webp)$/i;

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

async function ensureModels(): Promise<void> {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(FACE_MODELS_DIR);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(FACE_MODELS_DIR);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(FACE_MODELS_DIR);
}

async function computeDescriptorForImage(
  imgPath: string
): Promise<number[] | null> {
  const img = await loadImage(imgPath);
  // @ts-expect-error — faceapi canvas type mismatch
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) return null;
  return Array.from(detection.descriptor as Float32Array);
}

async function listReferenceImages(personDir: string): Promise<string[]> {
  const entries = await fs.readdir(personDir);
  return entries
    .filter((e) => IMG_EXT.test(e))
    .map((e) => path.join(personDir, e))
    .sort();
}

async function buildForPerson(personName: string): Promise<void> {
  const personDir = path.join(FACE_DB_DIR, personName);
  const stat = await fs.stat(personDir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.warn(`[skip] ${personDir} is not a directory`);
    return;
  }

  const refs = await listReferenceImages(personDir);
  if (refs.length === 0) {
    console.warn(`[skip] no reference images in ${personDir}`);
    return;
  }

  console.log(`[${personName}] building from ${refs.length} reference(s)`);
  const descriptors: DescriptorEntry[] = [];
  for (const ref of refs) {
    const src = path.basename(ref);
    try {
      const d = await computeDescriptorForImage(ref);
      if (d) {
        descriptors.push({ source: src, descriptor: d });
        console.log(`  ✓ ${src}`);
      } else {
        console.log(`  ⚠ ${src} (no face found)`);
      }
    } catch (err) {
      console.log(`  ✗ ${src} (${(err as Error).message})`);
    }
  }

  if (descriptors.length === 0) {
    console.warn(`[${personName}] no usable descriptors, skipping write`);
    return;
  }

  const db: FaceDB = {
    name: personName,
    builtAt: new Date().toISOString(),
    modelVersion: 'face-api.js ssd_mobilenetv1 + recognition v1',
    descriptors,
  };

  const outPath = path.join(FACE_DB_DIR, `${personName}.json`);
  await fs.writeFile(outPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(
    `[${personName}] wrote ${descriptors.length} descriptor(s) → ${outPath}`
  );
}

async function main(): Promise<void> {
  await ensureModels();

  const arg = process.argv[2];
  if (arg) {
    await buildForPerson(arg);
    return;
  }

  // no arg → build all person dirs
  const entries = await fs.readdir(FACE_DB_DIR, { withFileTypes: true });
  const persons = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => !n.startsWith('.'));
  if (persons.length === 0) {
    console.log(
      `No person directories found in ${FACE_DB_DIR}. Create e.g. data/face-db/moe/ and add reference photos.`
    );
    return;
  }
  for (const p of persons) {
    await buildForPerson(p);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
