# Akihabara Article — Damage List (Critic Loop Step 2)

**Date:** 2026-04-28
**File:** `content/articles/akihabara-complete-guide-2026.md`

Three classes of damage identified, each addressable independently.

## Class A — UTF-8 mojibake (363 instances, deterministic recovery)

The file was saved at some point through a UTF-8→Latin-1→UTF-8 round-trip, leaving Japanese characters and certain symbols mojibake'd. Examples:

| Mojibake | Original | Count (approx) |
| --- | --- | ---: |
| `Â¥` | `¥` (yen sign) | ~80 |
| `â` (standalone) | `—` (em-dash) | ~30 |
| `â¢` | `•` (bullet) | ~14 |
| `ã©ã¸ãªä¼é¤¨` etc. (CJK sequences) | Original Japanese (e.g. `ラジオ会館`) | ~150 |
| `ð¡` | `💡` | ~10 |
| `â ï¸` | `⚠️` | ~3 |
| `ã·ã«ã¯ãããç§èå` | `シルクハット秋葉原` | various |

**Recovery method.** A `Buffer.from(content, 'binary').toString('utf8')` round-trip recovers 362 of 363 instances perfectly (this is mechanical, not semantic — each mojibake codepoint maps deterministically to its original byte, and the byte stream becomes valid UTF-8 with the original characters). The 1 stranded artifact (a single byte that lost its UTF-8 continuation bytes earlier in the file's history) shows up as `�` (U+FFFD replacement character) at em-dash positions; a regex sweep `/�/g → '—'` cleans the last instance.

After Op 1 (round-trip + `�`→`—`), suspicious-character count = 0.

**Verification.** Compare a sampled set of recovered Japanese terms against expected (e.g., `ラジオ会館 = Radio Kaikan`, `中央通り = Chuo Dori`, `歩行者天国 = Hokousha Tengoku`, `ドリンクバック = drink-back fee`, `アットホームカフェ = @Home Cafe`). All recovered terms match expected meaning from surrounding English context. **Mojibake recovery is 0-risk: deterministic byte-level reversal.**

## Class B — duplicate paragraph block (lines 261-292, 32 lines)

Between the legitimate "Where to Eat" section (L253-259) and its continuation (L294+), 32 lines of corrupted/duplicated content were inserted at some point — likely during a CMS export/import or merge accident.

The duplication is exact line-for-line for 15 long lines (≥30 chars):

```
L231 ↔ L265   "**Hidden drink fees** ..."
L233 ↔ L267   "**Champagne pressure** ..."
L235 ↔ L269   "**Unclear time charges** ..."
L237 ↔ L271   "**Cash-only enforcement** ..."
L239 ↔ L273   "**How to tell a scam from a real maid cafe:**"
L241 ↔ L275   "**Touts on the street = red flag** ..."
L243 ↔ L277   "**No visible storefront = avoid** ..."
L245 ↔ L279   "**No prices at the entrance = avoid** ..."
L247 ↔ L281   "**Pressure tactics = leave immediately** ..."
L249 ↔ L283   "**Safe choices** ..."
L251 ↔ L285   "💡 **Local tip:** Weekday evenings ..."
L253 ↔ L287   "## Where to Eat (Beyond Theme Cafes)"
L255 ↔ L288   "Akihabara has excellent food ..."
L257 ↔ L290   "**Go Go Curry** ..."
L259 ↔ L292   "**Ramen spots along Chuo Dori** ..."
```

Plus the broken truncated line:

```
L261: "**UDX Building restaurants (2F-3F)** — The Akiba Ichi food court in the UDX building offers a range of Japanese restaurants in a cleaner, less hectic environment than street- evenings."
                                                                                                                                                                              ^^^^^^^^^^^^^^^^^^^
                                                                                                                                                                              truncated, ends mid-word
L294: "**UDX Building restaurants (2F-3F)** — The Akiba Ichi food court in the UDX building offers a range of Japanese restaurants in a cleaner, less hectic environment than street-level options. Good for when you want a real meal, not a themed experience."
                                                                                                                                                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                                                                                                                                              full, correct
```

**Fix.** Delete lines 261-292 inclusive (32 lines). This removes:
- The broken truncated L261 UDX line
- The 32-line duplicate Tout section (L263-285) re-pasted into Where to Eat
- The duplicate Where to Eat H2 at L287
- The duplicate intro/Go Go Curry/Ramen lines (L288-292)

What's PRESERVED on either side of the cut:
- L253-259: real "Where to Eat" intro + Go Go Curry + Ramen
- L294-298: full UDX line + Eorzea Cafe + 💡 Local tip about eating culture
- All before L253: scam Tout section (the legitimate occurrence at L222-251)
- All after L298: When to Go section onwards

**Verification.** After the cut, the H2 sequence becomes 12 sections (was 13 with the duplicate), and the Where to Eat section flows L253→L294 as: H2 → intro → Go Go Curry → Ramen → UDX → Eorzea → Local tip. That's the natural Where-to-Eat-section structure. **Duplicate removal is mechanical, 0-risk.**

## Class C — `undefined` literal lines (3 instances)

Lines 322, 404, 406 contain the literal string `undefined` as their entire content. These are templating-bug artifacts (a JS-side `${variable}` was concatenated into MDX when the variable was `undefined`).

```
L322: undefined
L404: undefined
L406: undefined
```

L322 sits between the "Combine With: Nearby Neighborhoods" section header (L324) and the When-to-Go section's transit info (L300-320). Removing the standalone literal is safe.

L404 and L406 sit between "More Area Guides" link list (L395-402) and the FAQ section (L410). Removing both is safe.

**Fix.** Delete the 3 lines. **0-risk — these are clearly broken artifacts, not intentional content.**

## Out of scope

- The L141 H2 `## Game Centers & Arcades (ゲームセンター)` keeps its parenthetical Japanese (correct, intentional, a normal stylistic choice in this article)
- Article-quality / SEO / image-strict-rule audits are NOT part of this Critic loop. This loop is mojibake + duplicate + literal-`undefined` cleanup only.
- Voice and structural rewrites are out of scope. No new content is added.
