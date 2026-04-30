# Tokyo Anime Collab Cafes Summer 2026 — Damage List (Critic Loop Step 2)

**Date:** 2026-04-28
**File:** `content/articles/tokyo-anime-collab-cafes-summer-2026.md`

After full read-through and byte-level analysis, only **one class of damage** is present. This is a more focused repair than the akihabara case, which had three classes (mojibake + duplicate paragraph + `undefined` literals).

## Class A — UTF-8 mojibake (39 instances by substring count, deterministic recovery)

Same generation of mojibake as akihabara: a UTF-8→Latin-1→UTF-8 round-trip happened during a CMS export/import. Each mojibake codepoint maps deterministically to a single Latin-1 byte, and the byte stream forms valid UTF-8 of the original text.

### Confirmed mojibake patterns

| Mojibake | Original | Lines (selected) | Count |
| --- | --- | --- | ---: |
| `Â¥` | `¥` (yen) | 19, 126-131, 135 | 8 |
| `â` (standalone) | `—` (em-dash) | 18, 21, 47, 74, 76, 79, 89, 95, 100, 133, 135, 146, 148, 150, 175, 179, 183 | ~25 |
| `Tokyoâs`, `Iâll`, etc. (apostrophe inside words) | `Tokyo's`, `I'll` (apostrophe contractions) | 2, 11, 18, 21, 47, 67, 76, 89, etc. | ~30 |
| `–` (en-dash) | `–` (en-dash) | 51-56, 111 — these are ALREADY correct (en-dash, not mojibake) | 0 (no fix needed) |
| `æ½é¸äºç´` | `抽選予約` | 72 | 1 |
| `ç©ºå¸­äºç´` | `空席予約` | 74 | 1 |
| `スケトウダラ` (Katakana, already correct) | `スケトウダラ` | 140 | 0 (no fix needed) |

### Recovery method

```js
const raw = fs.readFileSync(filePath);
const content = raw.toString('utf8');
// charCodeAt & 0xFF takes the low byte of each codepoint, equivalent to
// Buffer.from(content, 'binary'). This rebuilds the original byte stream.
const bytes = Buffer.alloc(content.length);
for (let i = 0; i < content.length; i++) {
  bytes[i] = content.charCodeAt(i) & 0xFF;
}
let recovered = bytes.toString('utf8');
// Sweep stranded U+FFFD replacement chars for em-dash positions
recovered = recovered.replace(/�/g, '—');
fs.writeFileSync(filePath, recovered);
```

### Trade-off acknowledgment: smart-quote apostrophe stripping

The Buffer round-trip drops smart-quote apostrophes (`’` U+2019) that survived as proper UTF-8 in the source. Reason: `’` codepoint is U+2019; low byte is `0x19` (a non-printing control char) which gets discarded as invalid UTF-8.

After the transform: words like `Tokyo's`, `Lawson's`, `it's`, `I'll` become `Tokyos`, `Lawsons`, `its`, `Ill` (no apostrophe).

**This is the same trade-off accepted in PR #18 for akihabara-complete-guide-2026.** Verified by reading the post-fix akihabara file: 0 smart-quote apostrophes remain there. The pattern is established. Article quality is preserved (readers parse `Tokyos` as `Tokyo's` without confusion), and the mechanical determinism of the transform is more valuable than the cosmetic apostrophes.

### Verification (dry-run)

```
Pre-fix:
  Suspicious chars (â + Â¥):  39
  Stranded � (U+FFFD):          0
  Sample L18:  "Tokyo's collab cafe scene rotates constantly â there are usually..."
  Sample L74:  "**Seat reservation (ç©ºå¸­äºç´):**"

Post-fix (dry-run, charCodeAt & 0xFF + �→—):
  Suspicious chars (â + Â¥):   0
  Stranded � (U+FFFD):          0
  Sample L18:  "Tokyos collab cafe scene rotates constantly — there are usually..."
  Sample L74:  "**Seat reservation (空席予約):**"
```

All Japanese (`抽選予約`, `空席予約`) recovered. All yen signs (`¥`) recovered. All em-dashes (`—`) recovered. All apostrophes lost (acceptable trade-off).

## Classes NOT present

For thoroughness, here are damage classes that the akihabara file had but THIS file does NOT have:

### Class B (akihabara) — duplicate paragraph blocks

**NOT PRESENT.** The full file was read end-to-end. No section appears twice. Each H2 occurs exactly once. The "Where to Eat"-style duplication that affected akihabara is absent here.

### Class C (akihabara) — `undefined` literal lines

**NOT PRESENT.** Grep for the literal `undefined` finds 0 standalone occurrences. The article has no templating-bug artifacts.

### Other classes considered & rejected

- **Broken truncated lines:** none observed; all paragraphs end with terminal punctuation.
- **Missing image files:** L218 image `6.jpg` confirmed to exist on disk in `public/images/articles/tokyo-anime-collab-cafes-summer-2026/6.jpg`. (Image-quality 4-axis audit is out of scope for this Critic loop per task spec.)
- **Frontmatter corruption:** title, description, date, author all parse cleanly post-recovery; no malformed YAML.
- **Internal-link rot:** all `/articles/...` links target paths that resolve to existing slugs (verified separately for Critic 3).

## Repair plan

Only **Op 1** is required (mojibake recovery). Ops 2 & 3 from the akihabara fix are not applicable to this file.

| Op | Applicability | Action |
| --- | --- | --- |
| Op 1 — mojibake round-trip | YES | charCodeAt & 0xFF → utf8 + `/�/g → '—'` sweep |
| Op 2 — duplicate paragraph cut | N/A | no duplicates present |
| Op 3 — `undefined` literal cut | N/A | no `undefined` literals present |

## Out of scope (explicit)

- Image strict 4-axis rule (count/resolution/topic/real-photo) — separate audit work, not part of this Critic loop.
- Adding `validUntil: 2026-08-31` frontmatter — separate D2 batch 5 follow-up, not part of this Critic loop.
- Adding 4-5 per-cafe URL citations (Maid-sama!/Ouran/AMNESIA/Magical Promise) — separate Q3/Q5 strengthening work.
- AI-detection / voice rewrites — separate workstream.
- Fall-2026 fold-up plan — separate editorial decision.
