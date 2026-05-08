#!/usr/bin/env node
/**
 * Convert a downloaded image (JPG/PNG) to WebP at q92, max width 1200.
 *
 * Usage:
 *   node scripts/image-procurement/webp-convert.mjs <input> <output>
 */

import sharp from 'sharp'
import fs from 'fs'

const [, , input, output] = process.argv

if (!input || !output) {
  console.error('Usage: webp-convert.mjs <input> <output>')
  process.exit(1)
}

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input)
  process.exit(2)
}

try {
  const meta = await sharp(input).metadata()
  const width = meta.width && meta.width > 1200 ? 1200 : meta.width
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(output)
  const size = fs.statSync(output).size
  console.log('OK', output, size, 'bytes')
} catch (err) {
  console.error('Conversion failed:', err.message)
  process.exit(3)
}
