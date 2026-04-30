# Slam Dunk Kamakura Article — Damage List (Critic Loop Step 2)

**Date:** 2026-04-28
**File:** `content/articles/slam-dunk-kamakura-pilgrimage-2026.md`

## Damage class inventory

| Class | Description | Found in this article? |
| --- | --- | --- |
| A | UTF-8 mojibake (UTF-8→Latin-1→UTF-8 round-trip) | **YES** — see Class A below |
| B | Duplicate paragraph block (CMS export accident) | NO — verified, no duplicate H2, no duplicate prose |
| C | Standalone `undefined` literal lines | NO — verified, 0 instances of bare `undefined` line |
| D | Stranded U+FFFD `�` replacement chars | NO — verified, 0 instances |

This article has **only Class A damage** — pure UTF-8 mojibake. Same import generation as akihabara per D2 batch 5 finding. Confirms Op 1-only fix is sufficient.

## Class A — UTF-8 mojibake (raw counts via grep)

| Pattern | Original | Count |
| --- | --- | ---: |
| `Â¥` | `¥` (yen sign) | 13 |
| `Â` (other Â usage besides `Â¥`) | leading byte for various 2-byte UTF-8 starts (e.g. `¥`, `°`, NBSP) | 13 total `Â` (incl. the 13 `Â¥` — 0 standalone) |
| `â` (standalone or with continuation) | em-dash `—` and other 3-byte sequences (e.g. `â `, `â`) | 33 |
| `ã` (with continuation) | leading byte for CJK Hiragana/Katakana 3-byte UTF-8 | 6 |
| `â¢` | `•` | 0 |
| `ð¡` | `💡` | 0 |
| `â ï¸` | `⚠️` | 0 |
| `�` (U+FFFD replacement) | stranded byte that lost continuation | 0 |

Totals: about 33 `â` + 13 `Â¥` + 6 `ã` ≈ 52 mojibake codepoint instances (counts overlap when one mojibake spans multiple codepoints, e.g. `â` is one codepoint within a 3-codepoint mojibake `â`; the practical count of "mojibake characters" is about 52, all rendering as garbled text in the raw `.md`).

### Located damage (selected lines, before fix)

| Line | Mojibake snippet (excerpt) | Recovered original |
| ---: | --- | --- |
| 3 (frontmatter description) | `Crossing â Slam Dunk's` | `Crossing — Slam Dunk's` (em-dash) |
| 11 (frontmatter excerpt) | `Crossing â Slam Dunk's` | `Crossing —` |
| 20 | `Crossing â Slam Dunk's most iconic` | `—` |
| 21 | `Â¥4,700-5,700`, `Crossing â where Sakuragi`, `crossing â is a 100-meter walk` | `¥4,700-5,700`, two em-dashes |
| 23 | `Â¥16.2 billion`, `crowds â but Kamakura City` | `¥16.2 billion`, em-dash |
| 50 | `Crossing (éåé«æ ¡å1å·è¸å)`, `behind it â that combination` | `Crossing (鎌倉高校前1号踏切)`, em-dash |
| 54 | `(éåé«æ ¡å1å·è¸å)` | `(鎌倉高校前1号踏切)` |
| 56 | `Kamakurakokomae (éåé«æ ¡å)` | `Kamakurakokomae (鎌倉高校前)` |
| 64 | `light â around 4:00-5:00 PM â gives` | `light — around 4:00-5:00 PM —` |
| 73 | `Ryonan High School (éµåé«æ ¡)`, `manga â not Shohoku`, `assume.) â do not enter`, `campus â do not enter` | `(陵南高校)`, em-dash, em-dash |
| 94-95 | `Â¥950`, `Â¥200 (or use Enoden Day Pass Â¥800)` | `¥950`, `¥200`, `¥800` |
| 104 | `Tokyo Station â the Yokosuka Line`, `gates (itâs a separate building` (`it's`) | em-dash, apostrophe (`â` from raw bytes) |
| 107, 109 | `Â¥950`, `(ã®ããããã) for Â¥800` | `¥950`, `(のりおりくん) for ¥800` |
| 117 | `9:00 â Depart Tokyo Station` | `9:00 —` em-dash |
| 119, 121, 123, 125, 127, 129, 131 | `10:00 â`, `10:15 â`, etc., timestamps with `â` for em-dash | `—` em-dashes throughout the route |
| 121 | `crossing. Spend 30-45 minutes here â wait` | em-dash |
| 125 | `Buddha (å¤§ä») â Â¥300 admission`, `not Slam Dunk-related, but youâre in Kamakura` | `(大仏) — ¥300 admission`, `you're` |
| 137 | `2023 peak â right after THE FIRST SLAM DUNKâs theatrical run â the crossing` | em-dash, apostrophe (`â`s`), em-dash |
| 161 | `noise â especially before 8:00 AM or after 8:00 PM â affects` | em-dash, em-dash |
| 188 | `crossing on a regular road â thereâs no admission`, `Â¥200 from Kamakura Station, or free with the Â¥800 day pass)` | em-dash, `there's`, two `¥` |
| 192 | `(before 7:00 AM) is actually the best time for photography â clear light` | em-dash |
| 196 | `Â¥1,900 on JR. A 7-day Japan Rail Pass costs Â¥50,000` | `¥1,900`, `¥50,000` |
| 200 | `High Schoolâs exterior` | `School's exterior` |
| 204 | `crossing itself is small â the experience` | em-dash |
| 231 | `currently open â`(closing arrow) | em-dash to right-arrow `→` (the byte was originally `→`, mojibake'd to `â`; round-trip will recover correctly) |

Note on line 231: the original character was `→` (right-arrow U+2192), which encodes as `E2 86 92` in UTF-8. When mis-decoded as Latin-1 then re-encoded, those bytes become `â` — the visible part being `â`. Buffer round-trip recovers `→`.

## Recovery method

`Buffer.from(content, 'binary').toString('utf8')` is the deterministic byte-level reversal. Each codepoint in the mojibake'd file is exactly one Latin-1 byte (0x00-0xFF). The byte stream, when re-decoded as UTF-8, restores the original characters.

After Op 1 round-trip, expected suspicious-character count = 0. (No `�` U+FFFD present pre-edit means no `�→—` regex sweep is strictly necessary, but applying it is safe and idempotent for defense in depth.)

## Verification anchors (sample of expected recoveries)

| Mojibake | Expected | Reasoning |
| --- | --- | --- |
| `Â¥` | `¥` | `C2 A5` UTF-8 for `¥`; mojibake'd as `Â¥` (Â=C2, ¥=A5) |
| `â` (em-dash position) | `—` | `E2 80 94` UTF-8 for `—`; mojibake'd as `â` |
| `â`s` | `'s` | `E2 80 99` UTF-8 for `'`; mojibake'd as `â` |
| `â` (line 231) | `→` | `E2 86 92` UTF-8 for `→`; mojibake'd as `â` |
| `éåé«æ ¡å1å·è¸å` | `鎌倉高校前1号踏切` | each Kanji is 3 UTF-8 bytes; round-trip restores |
| `(ã®ããããã)` | `(のりおりくん)` | each Hiragana is 3 UTF-8 bytes; round-trip restores |
| `å¤§ä»` | `大仏` | "Great Buddha" Kanji |
| `éµåé«æ ¡` | `陵南高校` | "Ryonan High School" Kanji |

All recovered terms are plausible from surrounding English context (e.g. `(鎌倉高校前)` follows "Kamakurakokomae", `(大仏)` follows "Great Buddha", `¥4,700-5,700` follows "Budget around"). Mechanical reversal is 0-risk.

## Out of scope

- This article's `.md`-not-`.mdx` sibling structure (D2 batch 5 finding: `kamakura-slam-dunk-pilgrimage-2026.mdx` is the canonical version with `robots: noindex,follow` already set on the `.md`). Frontmatter is not modified.
- No duplicate paragraph blocks present — Op 2 from akihabara playbook is NOT applied here.
- No `undefined` literal lines present — Op 3 from akihabara playbook is NOT applied here.
- Article-quality / SEO / image-strict-rule audits are NOT part of this Critic loop.
