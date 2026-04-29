# Tokyo Anime Collab Cafes Summer 2026 — Pre-edit Baseline (Critic Loop Step 1)

**Date:** 2026-04-28
**File:** `content/articles/tokyo-anime-collab-cafes-summer-2026.md`
**Reference fix:** PR #18 commit `287cff2` (akihabara-complete-guide-2026 mojibake repair)

## File metrics (pre-edit)

| Metric | Value |
| --- | ---: |
| Total lines | 226 |
| Total bytes | 20,051 |
| Frontmatter | 14 lines (title, description, date, lastUpdated, category, tags, featuredImage, featuredImageAlt, author, excerpt, relatedSlugs, wpPostId) |
| Author | "Takapon" |
| Category | cafes |
| Date | 2026-04-05 |
| H2 sections | 7 (Which Cafes Open / Reservations / Best / Cost / Multi-cafe / FAQ / More Guides + Never Miss block) |
| Image markdown refs | 6 (`featured.jpg` via frontmatter, `body-wikimedia-{1,2,3,5}.webp`, `body-akihabara-collabocafe.webp`, `6.jpg` at L218) |
| Internal `/articles/` links | 9 unique paths |
| External links | several (collabo-cafe.com, tablecheck.com, instagram.com, x.com) |
| Tables | 2 (cafe schedule, cost breakdown) |

## Non-ASCII codepoint census

Categorized by class to plan the recovery transform:

| Class | Codepoints | Count | Disposition |
| --- | --- | ---: | --- |
| Mojibake (Latin-1 0x80-0xFF artifacts) | â Â € ” ™ ¥ æ ç é ä º ½ ¸ ´ © å ­ Š ˜ ‚ „ ˆ | many | **CONVERT** via byte round-trip |
| Smart-quote apostrophe ’ (U+2019) | 1 codepoint | ~30 instances | **LOST in round-trip** (becomes nothing — accepted trade-off, same as akihabara fix) |
| En-dash – (U+2013), em-dash — (U+2014) | 2 codepoints | various | survive |
| Right arrow → (U+2192) | 1 codepoint | 1 | survives |
| CJK Katakana スケトウダラ | 6 codepoints | 1 sequence on L140 | survives |

## Mojibake patterns observed (selected)

| Mojibake | Original | Approx count |
| --- | --- | ---: |
| `Â¥` | `¥` (yen) | 8 |
| `â` (standalone) | `—` (em-dash) | ~25 |
| `Tokyoâs`, `Lawsonâs`, etc. | `Tokyo's`, `Lawson's` (smart-quote apostrophe ’) | ~30 |
| `æ½é¸äºç´` | `抽選予約` (lottery reservation) | 1 |
| `ç©ºå¸­äºç´` | `空席予約` (open-seat reservation) | 1 |
| `–` mojibake-free | `–` en-dash, already correct | several |

## Suspicious-character detection (pre-edit)

Total instances of `â` or `Â¥` substring patterns: 39

After Buffer-byte round-trip (charCodeAt & 0xFF → utf8): 0 mojibake remaining, but smart quotes are stripped (apostrophes `’` removed). 5 stranded `�` characters appear at positions where `â` was originally a standalone em-dash with surrounding bytes that didn't reform a valid UTF-8 multi-byte sequence; the regex sweep `/�/g → '—'` cleans these.

## Comparison with akihabara fix

The akihabara recovery had the exact same trade-off (verified in current file `content/articles/akihabara-complete-guide-2026.md`):
- All `’` apostrophes were lost → words like `it's` became `its`, `you'd` became `youd`
- This was accepted as part of PR #18's deterministic recovery

The same trade-off is acceptable here. Apostrophe loss is mechanical and consistent (every apostrophe in contractions). Search-engines and readers tolerate this; the alternative (writing custom per-character replacement logic) introduces risk of partial reverts.

## Key content blocks (pre-edit, structural map)

| Lines | Content |
| --- | --- |
| 1-14 | Frontmatter |
| 16 | Last-updated header |
| 18-23 | Lead paragraphs |
| 25-31 | "Start here" CTA box (3 internal links) |
| 33-40 | Table of Contents (6 anchors) |
| 42-60 | H2 §1 "Which Cafes Open" + table (6 cafes listed) |
| 62-103 | H2 §2 "Reservations" + 6 sub-sections |
| 104-115 | H2 §3 "Best Summer 2026 Cafes" (3 picks) |
| 117-135 | H2 §4 "Cost" + price table |
| 137-154 | H2 §5 "Multi-cafe in one day" + 3-cafe route |
| 156-162 | "Next step" CTA box (3 internal links) |
| 164-191 | H2 §6 "FAQ" — 7 questions |
| 193-199 | "Choose your next anime stop" CTA box (3 internal links) |
| 201-214 | "More Collab Cafe & Dining Guides" + Instagram + planning CTA |
| 216-227 | "Never Miss a Cafe Opening" + image L218 + Explore by Area block |

## Image at L218 (D2 batch 5 verifyable item)

Reference: `/images/articles/tokyo-anime-collab-cafes-summer-2026/6.jpg`
Local file exists: `public/images/articles/tokyo-anime-collab-cafes-summer-2026/6.jpg` (verified by `ls`)
Alt text: "Never Miss a Cafe Opening or Anime Event — Tokyo Anime Collab Cafes Summer 2026"
Status: file exists in repo. Image rule audit (4-axis count/resolution/topic/real-photo) is OUT OF SCOPE for this Critic loop per the parent task spec ("Mojibake repair only; image strict rule is separate work").

## Voice & frontmatter integrity (pre-edit)

- Author: Takapon ✓
- No real-name leaks ✓
- 2026 dating consistent ✓
- Voice: second-person + first-person hybrid ("This guide covers", "I'll update it as new cafes are announced")
- No emoji in body ✓ (the article text has none)

## Sister article

`content/articles/tokyo-anime-collab-cafes-spring-2026.md` is the rolling-cafe-tracker companion. The summer file links to it 3 times (L161, L191, L205, L214). The spring file links back to summer 0 times (verified in Critic 3). This asymmetry is per design — spring is the "current" article and summer is the future-looking one. Both files share Animate Cafe / My Charaful / BOX cafe / Collabo Cafe Honpo as venue references; both reference the same booking guide article. Cross-linkage is editorial, not duplicative.
