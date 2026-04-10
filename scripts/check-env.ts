#!/usr/bin/env node
/**
 * Sanity check for affiliate / analytics environment variables.
 *
 * Reads the canonical list from `lib/env.ts` (via direct import) and reports:
 *   - Which vars are set in the current process.env
 *   - Which are missing
 *   - The masked value of each set var (last 4 chars only)
 *
 * Run locally with `.env.local` loaded:
 *   npx tsx scripts/check-env.ts
 *
 * For Vercel:
 *   vercel env pull .env.production.local
 *   npx tsx scripts/check-env.ts
 */

import path from 'path';
import fs from 'fs';

// Minimal .env parser — no `dotenv` dep needed since this script only runs locally.
// Handles `KEY=value`, `KEY="value"`, `KEY='value'`, comments and blank lines.
function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf-8');
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const candidates = ['.env.local', '.env.production.local', '.env'];
for (const f of candidates) {
  loadEnvFile(path.resolve(process.cwd(), f));
}

// Canonical list — keep in sync with lib/env.ts ValidatedEnv interface.
const REQUIRED_VARS = ['NEXT_PUBLIC_ADSENSE_ID'] as const;

const OPTIONAL_VARS = [
  'NEXT_PUBLIC_KLOOK_AFFILIATE_ID',
  'NEXT_PUBLIC_BOOKING_AFFILIATE_ID',
  'NEXT_PUBLIC_AMAZON_ASSOCIATE_ID',
  'NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_ID',
  'NEXT_PUBLIC_AGODA_AFFILIATE_ID',
  'NEXT_PUBLIC_JRPASS_AFFILIATE_ID',
  'NEXT_PUBLIC_AWIN_AFFILIATE_ID',
  'NEXT_PUBLIC_GA4_ID',
  'NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE',
] as const;

// Variables that USED to be referenced under the wrong name.
// If any of these are set in the environment but the corresponding
// canonical name is empty, that is a misconfiguration to fix.
const LEGACY_TYPOS: Record<string, string> = {
  NEXT_PUBLIC_KLOOK_AFF_ID: 'NEXT_PUBLIC_KLOOK_AFFILIATE_ID',
  NEXT_PUBLIC_BOOKING_AFF_ID: 'NEXT_PUBLIC_BOOKING_AFFILIATE_ID',
  NEXT_PUBLIC_GYG_AFF_ID: 'NEXT_PUBLIC_GETYOURGUIDE_AFFILIATE_ID',
  NEXT_PUBLIC_AGODA_AFF_ID: 'NEXT_PUBLIC_AGODA_AFFILIATE_ID',
};

function mask(value: string): string {
  if (!value) return '(empty)';
  if (value.length <= 4) return '****';
  return `****${value.slice(-4)}`;
}

let missingRequired = 0;
let missingOptional = 0;
let legacyHits = 0;

console.log('\n=== japan-pop-now env check ===\n');

console.log('Required:');
for (const key of REQUIRED_VARS) {
  const val = process.env[key];
  if (!val) {
    console.log(`  ❌ ${key}  MISSING`);
    missingRequired += 1;
  } else {
    console.log(`  ✓  ${key}  ${mask(val)}`);
  }
}

console.log('\nOptional (affiliate / analytics):');
for (const key of OPTIONAL_VARS) {
  const val = process.env[key];
  if (!val) {
    console.log(`  ⚠  ${key}  unset`);
    missingOptional += 1;
  } else {
    console.log(`  ✓  ${key}  ${mask(val)}`);
  }
}

console.log('\nLegacy typos (should NOT be set):');
for (const [legacy, canonical] of Object.entries(LEGACY_TYPOS)) {
  const legacyVal = process.env[legacy];
  if (legacyVal) {
    const canonicalVal = process.env[canonical];
    if (!canonicalVal) {
      console.log(
        `  ❌ ${legacy} is set but ${canonical} is empty — copy the value to the canonical name`,
      );
      legacyHits += 1;
    } else {
      console.log(
        `  ⚠  ${legacy} is set (canonical ${canonical} also set, safe to delete the legacy var)`,
      );
    }
  }
}

console.log('\n=== Summary ===');
console.log(`  required missing: ${missingRequired}`);
console.log(`  optional missing: ${missingOptional}`);
console.log(`  legacy typos still set: ${legacyHits}`);

if (missingRequired > 0 || legacyHits > 0) {
  process.exit(1);
}
process.exit(0);
