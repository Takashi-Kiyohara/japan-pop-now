#!/usr/bin/env node
/**
 * Walks public/images/**\/*.{jpg,png,webp,avif} and writes a JSON manifest
 * mapping each public-relative URL → { width, height }.
 *
 * MDXImage (components/MDXImage.tsx) imports this manifest at build time so
 * it can hand correct width/height to next/image without a runtime sharp
 * dependency.
 *
 * Run after adding new images:
 *   npm run images
 *
 * The output file is checked into git so production builds don't need to
 * re-walk the filesystem.
 */

import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';

const ROOT = path.resolve(process.cwd(), 'public/images');
const OUTPUT = path.resolve(process.cwd(), 'lib/image-manifest.json');
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

interface ImageEntry {
  width: number;
  height: number;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function publicUrl(absPath: string): string {
  // /public/images/foo/bar.jpg → /images/foo/bar.jpg
  const rel = path.relative(path.resolve(process.cwd(), 'public'), absPath);
  return '/' + rel.split(path.sep).join('/');
}

function main(): void {
  const files = walk(ROOT);
  const manifest: Record<string, ImageEntry> = {};
  let skipped = 0;

  for (const file of files) {
    try {
      const buf = fs.readFileSync(file);
      const { width, height } = imageSize(buf);
      if (typeof width !== 'number' || typeof height !== 'number') {
        skipped += 1;
        continue;
      }
      manifest[publicUrl(file)] = { width, height };
    } catch (err) {
      skipped += 1;
      console.warn(`[warn] could not read ${file}:`, (err as Error).message);
    }
  }

  // Sort keys for deterministic git diffs.
  const sorted = Object.fromEntries(
    Object.keys(manifest)
      .sort()
      .map((k) => [k, manifest[k]]),
  );

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');

  const total = files.length;
  const written = Object.keys(sorted).length;
  console.log(`✓ image manifest: ${written}/${total} images, ${skipped} skipped`);
  console.log(`  → ${path.relative(process.cwd(), OUTPUT)}`);
}

main();
