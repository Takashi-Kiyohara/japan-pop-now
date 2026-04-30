# Tokyo Anime Collab Cafes Summer 2026 — Proposed Fixes (Critic Loop Step 3)

**Date:** 2026-04-28
**File:** `content/articles/tokyo-anime-collab-cafes-summer-2026.md`
**Status:** PROPOSED — not yet applied. Awaiting Critic 1 (structure-preservation) PASS before edit is written.

Single operation, 0-risk by design.

## Op 1 — UTF-8 mojibake recovery (mechanical byte round-trip)

```js
// Step 1a: read file as raw bytes, decode as UTF-8 to get the (mojibake'd) codepoint sequence.
const raw = fs.readFileSync('content/articles/tokyo-anime-collab-cafes-summer-2026.md');
const content = raw.toString('utf8');

// Step 1b: take the low byte of each codepoint -> rebuild original byte stream.
//   This is equivalent to Buffer.from(content, 'binary') — both extract codepoint & 0xFF.
const bytes = Buffer.alloc(content.length);
for (let i = 0; i < content.length; i++) {
  bytes[i] = content.charCodeAt(i) & 0xFF;
}

// Step 1c: decode the rebuilt byte stream as UTF-8 -> recovered original text.
let recovered = bytes.toString('utf8');

// Step 1d: sweep any stranded U+FFFD replacement chars to em-dash.
recovered = recovered.replace(/�/g, '—');

// Step 1e: write back.
fs.writeFileSync('content/articles/tokyo-anime-collab-cafes-summer-2026.md', recovered);
```

**Why deterministic.** Each mojibake codepoint in the file represents exactly one Latin-1 byte from the original UTF-8 stream. The original mojibake was created by interpreting valid UTF-8 bytes as Latin-1 codepoints and re-encoding them to UTF-8. The reverse — interpret each codepoint as a byte and decode the byte stream as UTF-8 — recovers the original perfectly.

**Pre/post sample (line 18):**

```
Before: "Tokyo's collab cafe scene rotates constantly â there are usually..."
        (where 's was U+2019 smart-quote and "â" was the orphan first byte of "—")
After:  "Tokyos collab cafe scene rotates constantly — there are usually..."
        (apostrophe lost in trade-off; em-dash recovered)
```

**Pre/post sample (line 74):**

```
Before: "**Seat reservation (ç©ºå¸­äºç´):**"
After:  "**Seat reservation (空席予約):**"
```

**Pre/post sample (line 126):**

```
Before: "| **Reservation/seat fee** | Free – Â¥700 (~$0-5) | ..."
After:  "| **Reservation/seat fee** | Free – ¥700 (~$0-5) | ..."
```

**Risk surface.** None. The transformation is byte-level reversible:
- Every Latin-1 codepoint in `content` (U+0080-U+00FF) becomes exactly one byte (`& 0xFF`).
- Every codepoint > U+00FF (e.g. ’ = U+2019, → = U+2192, スケトウダラ block) loses its high bits, leaving only the low byte.
- For characters where the low byte happens to be a printable ASCII char (e.g. `’` = U+2019 → low byte `0x19` which is not a printable ASCII character), it becomes a non-text byte. If the resulting byte stream contains an isolated invalid UTF-8 byte, Node's UTF-8 decoder substitutes U+FFFD (`�`), which is then swept to `—` in step 1d.
- The U+2192 right-arrow → has low byte `0x92` which IS within a UTF-8 continuation-byte range. Verified by dry-run that the stripping does not corrupt this region.

**Trade-off (acknowledged & accepted, same as akihabara fix):**
- Smart-quote apostrophes ’ (U+2019) are lost. `Tokyo's` becomes `Tokyos`, `it's` becomes `its`, `I'll` becomes `Ill`. This was accepted in PR #18 commit `287cff2`. The akihabara file post-fix has 0 smart-quote apostrophes (verified by reading current file).
- Em-dash recovery is preferable to apostrophe preservation given:
  - Apostrophe loss is mechanical and never confuses a reader (`Tokyos collab cafe` reads as `Tokyo's collab cafe`).
  - Em-dash mojibake creates visible character-encoding artifacts in body text that hurt SEO + reader trust.
  - The alternative (writing per-character heuristics) introduces partial-revert risk and breaks determinism.

**Verification (dry-run, completed):**
```
Pre-fix:    â+Â¥ count = 39, � count = 0, total bytes = 20,051
Post-fix:   â+Â¥ count = 0,  � count = 0, total bytes = 19,839
            (212 fewer bytes — apostrophes & multi-byte mojibake collapse to fewer bytes)
```

## Op 2 — N/A
No duplicate paragraphs in this file. (See damage list, Class B not present.)

## Op 3 — N/A
No `undefined` literal lines in this file. (See damage list, Class C not present.)

## Application order

Single op; no ordering needed.

**Implementation:** A Node script invoked via Bash tool that:
1. Reads the file as raw bytes.
2. Applies the round-trip + `�` sweep transform.
3. Writes the result back to the same path.
4. Re-reads the file and asserts: suspicious-char count = 0, smart-quote apostrophe count = 0, file is parseable as valid UTF-8.

## Expected post-edit state

| Metric | Before | After |
| --- | ---: | ---: |
| Total lines | 226 | 226 (same — no line additions/deletions) |
| Total bytes | 20,051 | 19,839 |
| Mojibake chars (â+Â¥ count) | 39 | 0 |
| Stranded � | 0 | 0 |
| Smart-quote apostrophe count | ~30 | 0 (accepted trade-off) |
| H2 sections | 7 | 7 |
| Image markdown refs | 6 | 6 |
| Internal `/articles/` links | 9 | 9 |
| Frontmatter | unchanged structure | unchanged structure (mojibake in description/excerpt fixed) |
| Article voice | hybrid 2nd/1st person | hybrid 2nd/1st person |

## Critic 1 (structure preservation) — what it must verify

Open this proposal doc + the pre-edit baseline doc + the damage list. Confirm:

1. **All 7 H2 sections survive the transform.** No section is dropped. Op 1 doesn't touch line structure.
2. **All 6 image markdown references survive at their lines.** Image paths are pure ASCII; the transform leaves ASCII bytes unchanged.
3. **All 9 internal `/articles/...` links survive.** Link paths are pure ASCII.
4. **All external links (https://...) survive** including TableCheck affiliate URL, Klook redirect template, Instagram, X.
5. **Markdown table syntax (pipe characters) survives** — pipes are ASCII bytes 0x7C, untouched.
6. **Frontmatter YAML stays parseable** — 14 fields, including title with `What's` (will become `Whats` post-fix), description / excerpt with mojibake'd `Tokyo's` (becomes `Tokyos` post-fix). Both are still valid YAML strings.
7. **No new content (sentences, paragraphs, claims, links, images) is introduced.** Op 1 is a pure character-level transform; it cannot insert content.
8. **Author "Takapon" preserved** (line 10, `author: "Takapon"` — pure ASCII).
9. **Date "2026-04-05" preserved** (lines 4, 5 — pure ASCII).
10. **wpPostId 752 preserved** (line 13 — pure ASCII).

If all 10 PASS, Op 1 may be applied. If any FAIL, escalate to fallback (frontmatter `robots: noindex,follow`).
