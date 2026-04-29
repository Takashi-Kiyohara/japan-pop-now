# Slam Dunk Kamakura Article — Proposed Fixes (Critic Loop Step 3)

**Date:** 2026-04-28
**File:** `content/articles/slam-dunk-kamakura-pilgrimage-2026.md`
**Status:** PROPOSED — not yet applied. Awaiting Critic 1 (structure-preservation) PASS before file is rewritten.

## Operations

Only Op 1 from the akihabara playbook is needed. Op 2 (duplicate-block delete) and Op 3 (`undefined` literal delete) are skipped because the corresponding damage classes are absent (verified in damage list).

## Op 1 — UTF-8 mojibake recovery (TARGETED replacement, NOT naive round-trip)

**IMPORTANT divergence from akihabara playbook**: this article is in a **mixed encoding state**. Pre-edit byte inspection shows:

- 39 instances of `'` (U+2019) — already-VALID UTF-8 right single quote (raw bytes `E2 80 99`)
- 7 instances of `—` (U+2014) — already-VALID UTF-8 em-dash (raw bytes `E2 80 94`)
- 33 instances of `â` — MOJIBAKE em-dash (raw bytes `C3 A2 C2 80 C2 94`, 6 bytes for what should be 3)
- 13 instances of `Â¥` — MOJIBAKE yen (raw bytes `C3 82 C2 A5`, 4 bytes for what should be 2)
- 9 CJK kanji/hiragana mojibake sequences

A naive `Buffer.from(content, 'binary').toString('utf8')` round-trip (the akihabara recipe) **would destroy the 47 already-valid 3-byte UTF-8 chars** because their JS-string codepoints (e.g. U+2019 = 8217 = 0x2019) overflow the 0-255 byte range used by the `binary` encoding — `binary` keeps only the low byte, so U+2019 becomes 0x19 (control char). All apostrophes and the 7 valid em-dashes would silently disappear.

Therefore Op 1 is implemented as **targeted JS-string replacement** instead, replacing only the precise mojibake sequences (each verified by codepoint inspection):

```js
const fs = require('fs');
const raw = fs.readFileSync(path, 'utf8');
let out = raw;

// Apply CJK replacements first (longer matches before shorter)
const cjk = [
  // 鎌倉高校前 (Kamakurakokomae) — L50, L54, L56
  [String.fromCodePoint(0xE9, 0x8E, 0x8C, 0xE5, 0x80, 0x89, 0xE9, 0xAB, 0x98, 0xE6, 0xA0, 0xA1, 0xE5, 0x89, 0x8D), '鎌倉高校前'],
  // 号踏切 — L50 (corrupted-byte form) and L54 (clean form)
  [String.fromCodePoint(0xE5, 0x8F, 0xB7, 0xE8, 0xB8, 0x8C, 0xE5, 0x88, 0x87), '号踏切'], // L50 had a bit-flip in middle byte
  [String.fromCodePoint(0xE5, 0x8F, 0xB7, 0xE8, 0xB8, 0x8F, 0xE5, 0x88, 0x87), '号踏切'],
  // 陵南高校 (Ryonan High School) — L73
  [String.fromCodePoint(0xE9, 0x99, 0xB5, 0xE5, 0x8D, 0x97, 0xE9, 0xAB, 0x98, 0xE6, 0xA0, 0xA1), '陵南高校'],
  // のりおりくん (Noriori-kun, Enoden Day Pass) — L109
  [String.fromCodePoint(0xE3, 0x81, 0xAE, 0xE3, 0x82, 0x8A, 0xE3, 0x81, 0x8A, 0xE3, 0x82, 0x8A, 0xE3, 0x81, 0x8F, 0xE3, 0x82, 0x93), 'のりおりくん'],
  // 大仏 (Great Buddha) — L125
  [String.fromCodePoint(0xE5, 0xA4, 0xA7, 0xE4, 0xBB, 0x8F), '大仏'],
];
for (const [from, to] of cjk) out = out.split(from).join(to);

// Single-char mojibake (3-codepoint forms)
const mojiChars = [
  [String.fromCodePoint(0xE2, 0x80, 0x94), '—'],   // em-dash
  [String.fromCodePoint(0xE2, 0x80, 0x99), "'"],   // right single quote
  [String.fromCodePoint(0xE2, 0x86, 0x92), '→'],   // right arrow (L231)
];
for (const [from, to] of mojiChars) out = out.split(from).join(to);

// Single-char mojibake (2-codepoint form)
out = out.split(String.fromCodePoint(0xC2, 0xA5)).join('¥');     // yen sign

fs.writeFileSync(path, out, 'utf8');
```

**Why this is safe.** Each replacement targets a unique JS-string sequence that only appears as mojibake (verified by enumerating the file's non-ASCII sequences — see `.tmp_strategy.js` output). The valid UTF-8 chars (`'`, `—`, `→` already in clean form, etc.) are NOT in any mojibake-pattern key, so they pass through unchanged.

**Verification baseline.** The akihabara repair used the naive round-trip method, which works when the entire file is uniformly mojibake'd. This article has mixed encoding (some valid UTF-8, some mojibake) — likely because the import generation that produced both files handled certain character classes differently. The targeted approach is conservative and verified by post-edit Latin-1 codepoint count.

### Pre/post sample (line 21)

```
Before: "Crossing â where Sakuragi and Haruko wave at each other in Slam Dunk's opening sequence â is a 100-meter walk west from Kamakurakokomae Station on the Enoden line. ... Budget around Â¥4,700-5,700 (~$32-39) for the whole trip from Tokyo, ..."

After:  "Crossing — where Sakuragi and Haruko wave at each other in Slam Dunk's opening sequence — is a 100-meter walk west from Kamakurakokomae Station on the Enoden line. ... Budget around ¥4,700-5,700 (~$32-39) for the whole trip from Tokyo, ..."
```

(The `'` in `Dunk's` was already a valid U+2019 right single quote in the source file — preserved untouched. Only the mojibake `â` em-dashes and `Â¥` yens are transformed.)

### Pre/post sample (line 50)

```
Before: "...officially named Kamakurakokomae No.1 Railroad Crossing (éåé«æ ¡å1å·è¸å), located at..."
After:  "...officially named Kamakurakokomae No.1 Railroad Crossing (鎌倉高校前1号踏切), located at..."
```

### Pre/post sample (line 109)

```
Before: "...buy the Enoden Day Pass (ã®ããããã) for Â¥800 at Kamakura or Fujisawa Station."
After:  "...buy the Enoden Day Pass (のりおりくん) for ¥800 at Kamakura or Fujisawa Station."
```

### Pre/post sample (line 125)

```
Before: "Walk 7 minutes to Kotoku-in and see the Great Buddha (å¤§ä») â Â¥300 admission."
After:  "Walk 7 minutes to Kotoku-in and see the Great Buddha (大仏) — ¥300 admission."
```

### Pre/post sample (line 231)

```
Before: "[Check our complete guide to anime collaboration cafes currently open â](/articles/tokyo-anime-collab-cafes-spring-2026)"
After:  "[Check our complete guide to anime collaboration cafes currently open →](/articles/tokyo-anime-collab-cafes-spring-2026)"
```

(The `â` here is the start of the 3-byte UTF-8 sequence for `→` U+2192. Round-trip restores the right-arrow.)

### Risk surface

Zero. Each replacement is a deterministic JS-string substitution keyed by a precise sequence of codepoints. The mojibake sequences are unique (no overlap with any valid UTF-8 char in the file — verified by enumerating all non-ASCII sequences). The valid UTF-8 chars (`'`, `—`, `→`) at their already-correct codepoints are not touched.

Post-replacement, the only remaining Latin-1 codepoints (U+0080-U+00FF range) are the 13 legitimate `¥` (U+00A5) yen signs — these are correct UTF-8 and intentional content.

## Op 2 — SKIPPED (no duplicate paragraph blocks present)

Pre-edit verification: H2 count = 10, all unique. No 30+ char paragraph appears twice. No truncated mid-word lines.

## Op 3 — SKIPPED (no `undefined` literal lines present)

Pre-edit verification: 0 lines containing only the literal string `undefined`.

## Application order

Single Node script applies Op 1 + the U+FFFD sweep (no-op safety) and writes the file in place.

## Expected post-edit state

| Metric | Before | After |
| --- | ---: | ---: |
| Total lines | 244 | 244 (unchanged — no line additions/deletions) |
| Mojibake `Â` count | 13 | 0 |
| Mojibake `â` count | 33 | 0 |
| Mojibake `ã` count | 6 | 0 |
| `�` U+FFFD count | 0 | 0 |
| Total suspicious chars | ~52 | 0 |
| H2 section count | 10 | 10 |
| Image references | 7 | 7 |
| Internal `/articles/` link slugs (unique) | 11 | 11 |
| Frontmatter | unchanged | unchanged |
| Article voice | first-person resident | first-person resident |
| Canonical + robots noindex | preserved | preserved |

## Critic 1 (structure preservation) — what it must verify

Open this proposal doc + the pre-edit baseline doc + the damage list. Confirm:

1. **All 10 legitimate H2 sections survive the edit.** No section is dropped. No H2 is removed; no H2 is added.
2. **All venue-specific facts (addresses, prices, fares, hours, walking times) are preserved.** Op 1 only touches mojibake codepoints; English numerals and place names are not transformed.
3. **Internal-link integrity preserved.** All 11 unique `/articles/` slugs survive (the body text contains markdown links — Op 1 transforms only mojibake codepoints, not ASCII characters in URLs).
4. **Image-reference integrity preserved.** All 7 image markdown references survive (paths and alt text are pure ASCII; only the prose around them — captions like "Photo: Yuya Tamai / [Wikimedia Commons]..." — contain mojibake that gets recovered).
5. **Frontmatter integrity preserved.** Mojibake `â` in description/excerpt becomes `—` em-dash (the original character) — that's a faithful recovery, not a frontmatter rewrite.
6. **Canonical + robots noindex pair preserved.** This `.md` remains the noindex sibling pointing at `kamakura-slam-dunk-pilgrimage-2026.mdx`.
7. **No new content (sentences, paragraphs, claims, links, images) is introduced.**

If all 7 PASS, Op 1 may be applied. If any FAIL, escalate to Q2 fallback (already noindex; no further action needed beyond confirming frontmatter has the directive — which it does).
