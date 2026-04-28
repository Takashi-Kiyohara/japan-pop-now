# Akihabara Article — Proposed Fixes (Critic Loop Step 3)

**Date:** 2026-04-28
**File:** `content/articles/akihabara-complete-guide-2026.md`
**Status:** PROPOSED — not yet applied. Awaiting Critic 1 (structure-preservation) PASS before MDX is written.

Three operations, each independent, each 0-risk by design.

## Op 1 — UTF-8 mojibake recovery (mechanical round-trip)

```js
// Step 1a: Buffer round-trip undoes the UTF-8→Latin-1→UTF-8 mis-encoding
const recovered = Buffer.from(content, 'binary').toString('utf8')
// Step 1b: clean the single stranded byte
const cleaned = recovered.replace(/�/g, '—')
```

**Why deterministic.** Each mojibake codepoint in the file represents exactly one Latin-1 byte. The mojibake came from interpreting UTF-8 bytes as Latin-1 then re-encoding to UTF-8. The reverse — interpret each codepoint as a byte and decode the byte stream as UTF-8 — recovers the original text perfectly (validated: 362 of 363 mojibake instances recover; 1 stranded byte left as U+FFFD becomes `—` via the regex sweep).

**Pre/post sample (line 30):**

```
Before: "**The main artery: Chuo Dori (ä¸­å¤®éã).**"
After:  "**The main artery: Chuo Dori (中央通り).**"
```

**Risk surface.** None. The transformation is byte-level reversible. If any character does NOT round-trip cleanly (would decode to invalid UTF-8), Node throws — that hasn't happened in the verification run.

## Op 2 — Delete duplicate block (lines 261-292)

```diff
- L261: **UDX Building restaurants (2F-3F)** — The Akiba Ichi food court in the UDX building offers a range of Japanese restaurants in a cleaner, less hectic environment than street- evenings.
- L262:
- L263: **Common scam patterns:**
- L264:
- L265: • **Hidden drink fees (ドリンクバック):** They advertise ¥3,000 ...
- ... (lines 266-285: rest of the inserted Tout-section duplicate)
- L286:
- L287: ## Where to Eat (Beyond Theme Cafes)
- L288: Akihabara has excellent food beyond the maid and collab cafes. ...
- L289:
- L290: **Go Go Curry** — The iconic Akihabara curry chain. ...
- L291:
- L292: **Ramen spots along Chuo Dori** — Several quality ramen shops ...
```

After the cut, the file flows:

```
L253: ## Where to Eat (Beyond Theme Cafes)
L254:
L255: Akihabara has excellent food beyond the maid and collab cafes. A few standouts:
L256:
L257: **Go Go Curry** — The iconic Akihabara curry chain. ...
L258:
L259: **Ramen spots along Chuo Dori** — Several quality ramen shops ...
L260:
[--- cut lines 261-292 ---]
L294: **UDX Building restaurants (2F-3F)** — The Akiba Ichi food court ... than street-level options. Good for when you want a real meal, not a themed experience.
L295:
L296: **Eorzea Cafe (エオルゼアカフェ)** — A permanent Final Fantasy XIV themed cafe ...
L297:
L298: 💡 **Local tip:** The real Akihabara eating culture is quick and cheap ...
```

**Risk surface.** None. The cut removes only:
- 1 broken truncated line (L261, mid-word "street- evenings")
- A 23-line duplicate of an earlier section (L263-285)
- A 1-line duplicate H2 (L287)
- A 5-line duplicate intro/Go-Go-Curry/Ramen segment (L288-292) — already present at L253-259

Cross-section content (UDX full description at L294, Eorzea Cafe at L296, eating-culture local tip at L298) is preserved.

## Op 3 — Delete `undefined` literal lines (3 instances)

```diff
- L322: undefined
- L404: undefined
- L406: undefined
```

These are templating-artifact lines containing only the literal string `undefined`. No surrounding context references them. Deletion has no semantic effect.

**Risk surface.** None. The lines are obvious bugs — they don't contribute any prose or structure.

## Application order

1. Op 1 first (mojibake) — produces a fully-recovered Japanese-character version that simplifies later mechanical line operations
2. Op 2 second (duplicate cut) — line numbers must reference the recovered file, not the mojibake'd version (line numbers are stable across Op 1 since Op 1 doesn't add/remove lines)
3. Op 3 third (`undefined` literal) — line numbers shift by -32 after Op 2; the original-file line numbers (322, 404, 406) become (290, 372, 374) after Op 2

**Implementation:** a single Node script will apply all 3 ops in sequence, then write the result.

## Expected post-edit state

| Metric | Before | After |
| --- | ---: | ---: |
| Total lines | 423 | 423 − 32 (Op 2) − 3 (Op 3) = 388 |
| Mojibake chars | 363 | 0 |
| Duplicate H2 | 1 (L287) | 0 |
| `undefined` literal | 3 | 0 |
| H2 section count | 13 (incl. dup) | 12 |
| Image references | 4 | 4 (unchanged) |
| Internal links | 8 | 8 (unchanged) |
| Affiliate links | 11 | 11 (unchanged) |
| Frontmatter | unchanged | unchanged |
| Article voice | first-person resident | first-person resident |
| Reader-safety section (Tout Problem) | preserved | preserved |

## Critic 1 (structure preservation) — what it must verify

Open this proposal doc + the pre-edit baseline doc + the damage list. Confirm:

1. **All 12 legitimate H2 sections survive the edit.** No section is dropped. The duplicate L287 `## Where to Eat` is the ONLY H2 removed.
2. **All venue-specific facts (addresses, hours, access) are preserved.** No address, hour, or transit detail in the article is touched by the 3 operations.
3. **Internal-link integrity preserved.** All 8 inbound links (`/articles/...`) survive.
4. **Image-reference integrity preserved.** All 4 image markdown references survive at their lines (4 images in `public/images/articles/akihabara-complete-guide-2026/`: featured.jpg, body-wikimedia.webp, body-wikimedia-2.webp, body-wikimedia-3.webp, body-wikimedia-4.webp).
5. **Reader-safety Tout Problem section is preserved in full at its original location (L222-251).** The duplicate at L263-285 is removed, but the original is untouched.
6. **The truncated UDX line at L261 is replaced by the complete UDX line at L294.** No information is lost; the broken truncation is replaced by the full sentence.
7. **No new content (sentences, paragraphs, claims, links, images) is introduced.**

If all 7 PASS, Op 1+2+3 may be applied. If any FAIL, escalate to Q2 fallback (frontmatter `robots: noindex,follow` instead of editing).
