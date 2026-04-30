# Slam Dunk Kamakura Article — Critic 1: Structure Preservation (Critic Loop Step 4)

**Date:** 2026-04-28
**File:** `content/articles/slam-dunk-kamakura-pilgrimage-2026.md`
**Verdict:** **PASS** (after revision of Op 1 from naive round-trip to targeted replacement)

## Summary

The proposal as originally drafted (naive `Buffer.from(content, 'binary').toString('utf8')` round-trip) **would have FAILED Critic 1** because this article is in a mixed encoding state — 47 already-valid UTF-8 chars (39 right single quotes `'` U+2019 and 7 em-dashes `—` U+2014, plus 1 right arrow `→` U+2192) coexist with the mojibake `â`, `Â¥`, and CJK sequences.

A naive round-trip drops these valid chars to control codes (e.g. U+2019 → U+0019, invisible, breaking `Dunk's` → `Dunks`). Verified in dry-run: 39 apostrophes silently destroyed, plus 7 em-dashes and 1 right arrow turned into invalid UTF-8.

Critic 1 caught this and required Op 1 to be revised to **targeted JS-string replacement**: each mojibake sequence (verified via codepoint enumeration) is replaced with its correct char, while valid UTF-8 is left untouched.

After revision, dry-run verifies all 7 structural-preservation criteria PASS.

## 7-criteria verification (POST-revision)

### 1. All 10 H2 sections survive

POST-revision dry-run output:
```
H2 count: 10
```

| Line | Heading (post-edit, all preserved) |
| ---: | --- |
| 35 | Table of Contents |
| 45 | Where Is the Famous Slam Dunk Train Crossing? |
| 66 | What Other Slam Dunk Locations Can You Visit in Kamakura? |
| 84 | How Do You Get to Kamakura from Tokyo? |
| 111 | What's the Best Half-Day Pilgrimage Route? |
| 133 | Is the Crossing Still Crowded in 2026? |
| 149 | What Should You Know About Etiquette and Local Rules? |
| 185 | FAQ: Frequently Asked Questions |
| 218 | More Pilgrimage Guides |
| 233 | Never Miss a Cafe Opening or Anime Event |

PASS — all 10 H2 sections present at original line numbers.

### 2. Venue-specific facts preserved

Op 1 only modifies the specific mojibake codepoints. ASCII content (English numerals like "12 minutes", "¥4,700-5,700", "30-45 minutes", venue names like "Amalfi Cafe", "Kotoku-in", "Komachi-dori", addresses like "Koegoe 1-1-25", times like "9:00", "10:15", "11:45", "15:00-15:30") is not in any mojibake-pattern key. Verified by inspection — none of the mojibake patterns match these strings.

PASS — all venue facts (addresses, prices, fares, hours, walking times) preserved.

### 3. Internal-link integrity preserved

POST-revision dry-run output:
```
Unique internal /articles/ links: 11
```

The link list `/articles/japan-rail-pass-2026-guide`, `/articles/japan-ic-card-transit-guide`, `/articles/anime-day-trips-from-tokyo-2026`, `/articles/anime-pilgrimage-spots-tokyo`, `/articles/your-name-pilgrimage-tokyo`, `/articles/demon-slayer-pilgrimage-tokyo`, `/articles/weathering-with-you-locations-tokyo`, `/articles/one-piece-kumamoto-statue-tour`, `/articles/tokyo-anime-collab-cafes-spring-2026`, `/articles/slam-dunk-kamakura-pilgrimage-2026` (self), `/articles/kamakura-slam-dunk-pilgrimage-2026` (canonical sibling — frontmatter only).

PASS — all 11 unique internal `/articles/` slugs survive at their lines.

### 4. Image-reference integrity preserved

POST-revision dry-run output:
```
Image refs: 7
```

7 body image refs at lines 47, 68, 86, 113, 135, 151, 235 (paths `/images/articles/slam-dunk-kamakura-pilgrimage-2026/{1.jpg,2.webp,3.webp,4.webp,5.jpg,6.jpg,7.jpg}`). Featured image in frontmatter at line 8. Op 1 doesn't touch ASCII characters in markdown image syntax.

PASS — all 7 image references + 1 featured-image frontmatter ref preserved.

### 5. Frontmatter integrity preserved

```
description: "Last updated: April 2026. The Kamakurakokomae No.1 Railroad Crossing — Slam Dunk's most iconic real-world location, with the Shonan coast stretching behind..."
```

The mojibake `â` in description/excerpt (lines 3 and 11) becomes em-dash `—` (the original character). The `'` in `Dunk's` is preserved as U+2019 right single quote. All other frontmatter fields (`title`, `date`, `lastUpdated`, `category`, `tags`, `featuredImage`, `featuredImageAlt`, `author`, `excerpt`, `relatedSlugs`, `wpPostId`, `robots`, `canonical`) — pure ASCII, not transformed.

PASS — frontmatter is recovered, not rewritten.

### 6. Canonical + robots noindex pair preserved

`robots: "noindex,follow"` (line 14) and `canonical: "https://www.japan-pop-now.com/articles/kamakura-slam-dunk-pilgrimage-2026"` (line 15) are pure ASCII, not modified by Op 1. The `.md` remains the noindex sibling pointing at the `kamakura-slam-dunk-pilgrimage-2026.mdx` canonical version.

PASS — D2 batch 5 noindex/canonical contract preserved.

### 7. No new content introduced

Op 1 (targeted replacement) is purely a substitution. No new sentences, paragraphs, claims, links, or images are added. Total line count unchanged at 244 (vs original 244).

POST-revision dry-run:
```
Total lines: 244
```

PASS — no new content.

## Mental dry-run on 5+ mojibake samples

Sample 1 (line 21, em-dash + yen):
- Before: `Crossing â where Sakuragi ... Budget around Â¥4,700-5,700`
- After: `Crossing — where Sakuragi ... Budget around ¥4,700-5,700`
- Apostrophe in `Dunk's` (already valid U+2019): preserved as `Dunk's`. PASS.

Sample 2 (line 50, kanji block):
- Before: `Crossing (éåé«æ ¡å1å·è¸å), located at...`
- After: `Crossing (鎌倉高校前1号踏切), located at...`
- Note: L50 has a corrupted middle byte (`B8 8C` instead of `B8 8F`) — the targeted CJK replacement covers BOTH forms (mapping both to `踏切` via separate map entries). PASS.

Sample 3 (line 73, Ryonan kanji):
- Before: `Ryonan High School (éµåé«æ ¡) in the manga â not Shohoku`
- After: `Ryonan High School (陵南高校) in the manga — not Shohoku`
- PASS.

Sample 4 (line 109, Hiragana + yen):
- Before: `Pass (ã®ããããã) for Â¥800`
- After: `Pass (のりおりくん) for ¥800`
- PASS.

Sample 5 (line 125, kanji + em-dash + yen):
- Before: `Buddha (å¤§ä») â Â¥300 admission. ... but you're in Kamakura and it's one of...`
- After: `Buddha (大仏) — ¥300 admission. ... but you're in Kamakura and it's one of...`
- Apostrophes in `you're` and `it's` (both already valid U+2019): preserved. PASS.

Sample 6 (line 231, right arrow):
- Before: `currently open â](/articles/tokyo-anime-collab-cafes-spring-2026)`
- After: `currently open →](/articles/tokyo-anime-collab-cafes-spring-2026)`
- PASS.

Sample 7 (line 137, em-dash with already-valid apostrophe):
- Before: `Yes, but it's managed now. During the 2023 peak â right after THE FIRST SLAM DUNK's theatrical run â the crossing area...`
- After: `Yes, but it's managed now. During the 2023 peak — right after THE FIRST SLAM DUNK's theatrical run — the crossing area...`
- Apostrophes in `it's`, `DUNK's` (both already U+2019): preserved. PASS.

## Final Verdict

**PASS — Op 1 (revised, targeted replacement) preserves all structural elements.**

The article voice (first-person knowledgeable resident), residential-respect framing, etiquette section, transport-route timestamps, FAQ Q&A pairs, canonical+robots noindex contract, all internal links, all image refs, all H2 sections, and all venue facts are preserved. No new content. Mojibake cleanup only.

Op 1 may be applied. Critic 2 (content logic) and Critic 3 (cross-article relations) follow.
