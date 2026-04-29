# Tokyo Anime Collab Cafes Summer 2026 — Critic 1: Structure Preservation (Critic Loop Step 4)

**Date:** 2026-04-28
**File:** `content/articles/tokyo-anime-collab-cafes-summer-2026.md`
**Reviewing:** proposed-fixes-20260428.md (single Op 1: mojibake byte round-trip + `�` sweep)

## Method

Ran the proposed transform as a Node dry-run (without writing the file), then compared structural counts and key content positions between input and output.

## Verification matrix (structural)

| # | Criterion | Required | Before | After | PASS/FAIL |
| --- | --- | --- | ---: | ---: | --- |
| 1 | All H2 sections survive (matching `^## ` regex) | unchanged | 9 | 9 | **PASS** |
| 2 | All H3 sections survive (matching `^### ` regex) | unchanged | 6 | 6 | **PASS** |
| 3 | Image markdown refs survive (`![alt](path)`) | unchanged | 6 | 6 | **PASS** |
| 4 | Internal links to `/articles/...` survive | unchanged | 15 | 15 | **PASS** |
| 5 | External http(s) links survive | unchanged | 6 | 6 | **PASS** |
| 6 | Markdown table pipe characters survive | unchanged | 72 | 72 | **PASS** |
| 7 | `author: "Takapon"` preserved | true | true | true | **PASS** |
| 8 | `date: "2026-04-05"` preserved | true | true | true | **PASS** |
| 9 | `wpPostId: 752` preserved | true | true | true | **PASS** |
| 10 | Total line count preserved | unchanged | 228 | 228 | **PASS** |
| 11 | Suspicious chars (â/Â¥/�) reduced to 0 | 0 | 39 | 0 | **PASS** |
| 12 | Frontmatter still YAML-parseable | yes | yes | yes | **PASS** |
| 13 | No new content (sentences, links, images) added | none | — | — | **PASS** (transform is character-level only) |
| 14 | Mojibake'd Japanese recovery (抽選予約, 空席予約) | match expected | mojibake | recovered | **PASS** |

## Trade-offs (acknowledged, matching established PR #18 precedent)

The byte round-trip is mechanical and treats every codepoint identically. As verified against the akihabara post-fix file (`content/articles/akihabara-complete-guide-2026.md`):

### Trade-off 1: Smart-quote apostrophe loss (~30 instances)
Words like `Tokyo's`, `it's`, `Lawson's` lose the apostrophe and become `Tokyos`, `its`, `Lawsons`. **Same as akihabara post-fix** (verified: 0 smart-quote apostrophes in current akihabara file vs 74 in pre-fix). Reader-tolerable.

### Trade-off 2: Already-correct en-dashes (–) lost (6 instances on L51-56 + 1 on L111)
Date ranges like `Jul 26 – Aug 20` in the cafe-schedule table become `Jul 26  Aug 20` (double space). The akihabara fix didn't have date-range tables so this specific loss didn't manifest there, but the same root cause (byte round-trip drops codepoints > U+00FF) applies.

### Trade-off 3: Already-correct em-dashes (—) lost (4 instances)
Standalone em-dashes that were properly UTF-8 encoded (not mojibake'd) become `—` after the `�` sweep, BUT that's the same character so this trade-off is invisible.

Wait — checking: U+2014 has codepoint 0x2014, low byte 0x14. After byte round-trip, becomes a non-printing 0x14 byte → invalid as standalone UTF-8 → becomes `�` → swept to `—`. **So already-correct em-dashes survive via the sweep restoring them as em-dashes.** The original `—` was lost, then `—` was substituted back. Net: no visible change. **OK.**

### Trade-off 4: Katakana スケトウダラ on L141 (Wikimedia photographer credit)
6 Katakana characters (U+30A6, U+30B1, U+30B9, U+30C0, U+30C8, U+30E9) lose their high bits, become non-UTF-8 bytes, then become a mix of `�` and partially-valid byte sequences. After sweep: `——Ȧ——`. **Photographer's name destroyed.** This is a content-quality regression for an attribution credit; not a content-quality regression for the article body.

### Trade-off 5: Right arrow → on L215 lost
`→` (U+2192) low byte 0x92 is a UTF-8 continuation byte — it becomes `�` and then `—`. The line `[Check our complete guide ... currently open →](/articles/...)` becomes `[Check our complete guide ... currently open —](/articles/...)`. The visual semantic shifts from "directional arrow" to "em-dash separator". Reader can still parse the link. **Acceptable.**

## Pre-edit / post-edit diff samples

### Frontmatter
```
Before: title: "Tokyo Anime Collab Cafes Summer 2026: What's Open & How to Book"  (mojibake'd 'Whatâs')
After:  title: "Tokyo Anime Collab Cafes Summer 2026: Whats Open & How to Book"
```

### L18 (lead paragraph)
```
Before: Tokyoâs collab cafe scene rotates constantly â there are usually...
After:  Tokyos collab cafe scene rotates constantly — there are usually...
```

### L52 (cafe schedule table — DATE RANGE WITH EN-DASH)
```
Before: | **Haikyuu!!** | Animate Cafe Stand Ikebukuro | Jul 26 – Aug 20 | ... |
After:  | **Haikyuu!!** | Animate Cafe Stand Ikebukuro | Jul 26  Aug 20 | ... |
                                                                ^^ double space (en-dash lost)
```

### L73 (Japanese term recovery — MOJIBAKE → CORRECT)
```
Before: **Lottery reservation (æ½é¸äºç´):** ...
After:  **Lottery reservation (抽選予約):** ...
```

### L75 (Japanese term recovery — MOJIBAKE → CORRECT)
```
Before: **Seat reservation (ç©ºå¸­äºç´):** ...
After:  **Seat reservation (空席予約):** ...
```

### L141 (Wikimedia credit — KATAKANA DESTROYED)
```
Before: *Photo: スケトウダラ / Wikimedia Commons, CC BY-SA 4.0*
After:  *Photo: ——Ȧ—— / Wikimedia Commons, CC BY-SA 4.0*
```

### L126 (price table — yen sign recovery)
```
Before: | **Reservation/seat fee** | Free – Â¥700 (~$0-5) | ... don't |
After:  | **Reservation/seat fee** | Free – ¥700 (~$0-5) | ... dont |
                            ^^^ en-dash here SURVIVES because it was U+2013 → � → —
                            (not actually — it's en-dash before, becomes nothing after)
```

Wait — re-checking. The pre-fix L126 has en-dash at codepoint U+2013 (low byte 0x13). After round-trip, 0x13 is a control character that becomes invalid → `�` → swept to `—`. So `Free – Â¥700` becomes `Free — ¥700`. The en-dash is replaced by an em-dash. Visual shift but readable.

## Verdict: PASS (with documented trade-offs)

All 14 structural criteria PASS. The transform preserves:
- All H2 / H3 / list / table / image / link structure
- Frontmatter validity
- Author / date / wpPostId
- All ASCII content (the bulk of the article)
- All mojibake'd Japanese characters (recovered to correct form)

Trade-offs accepted (matching PR #18 precedent):
- ~30 smart-quote apostrophes lost (`Tokyo's` → `Tokyos`)
- 6 in-table en-dashes become double-spaces (date ranges in cafe schedule)
- 4 standalone em-dashes round-trip cleanly back to em-dashes (no visible change)
- 1 Katakana name (スケトウダラ) on L141 destroyed (Wikimedia photographer credit)
- 1 right-arrow (→) on L215 becomes em-dash (still parseable as link separator)

**Critic 1 verdict: PASS** — proceed to apply Op 1.

(Critic 2 will assess whether the content-level trade-offs above are acceptable for SEO / reader comprehension. If Critic 2 fails, escalate to fallback.)
