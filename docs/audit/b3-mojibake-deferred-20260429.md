# Bucket 3 Mojibake Repair — Deferred Status (2026-04-29)

## Slam-dunk-kamakura-pilgrimage-2026

**Status:** DEFERRED — Critic loop sub-agent stalled at step 5 (apply targeted fix). The pre-fix mojibake count remains 31 in `content/articles/slam-dunk-kamakura-pilgrimage-2026.md`.

**Audit docs landed (steps 1-4 complete):**
- `docs/audit/slam-dunk-kamakura-pre-edit-20260428.md` (baseline)
- `docs/audit/slam-dunk-kamakura-damage-list-20260428.md` (damage classes)
- `docs/audit/slam-dunk-kamakura-proposed-fixes-20260428.md` (Op specs)
- `docs/audit/slam-dunk-kamakura-critic1-20260428.md` (structure-preservation Critic — outcome documented)

**Current article state:** UNCHANGED from main HEAD before this branch. The article already carries `robots: noindex,follow` + canonical → `kamakura-slam-dunk-pilgrimage-2026.mdx` per the D2 batch 5 finding, so it is already excluded from the sitemap. **No fallback needed** — the article is already in the safe-state pattern that Q2 A would apply.

**Next-session action:**
1. Resume from step 5: apply the deterministic `Buffer.from(content, 'binary').toString('utf8')` round-trip + `replace(/�/g, '—')` sweep
2. Run Critic 2 (content) and Critic 3 (relations)
3. Commit on `fix/slam-dunk-kamakura-mojibake-repair` branch + PR

## Tokyo-anime-collab-cafes-summer-2026

**Status:** DEFERRED — partial fix attempted by sub-agent introduced a regression (curly apostrophes `'` were stripped, e.g. `Tokyo's` → `Tokyos` and `What's` → `Whats`). The article was reverted to its pre-fix state on this branch.

**Likely root cause:** The article had a mix of correctly-encoded UTF-8 characters (proper curly apostrophes U+2019) AND Latin-1-misencoded mojibake bytes (`â` for stranded em-dash continuations). A whole-file `Buffer.from(content, 'binary').toString('utf8')` round-trip double-encodes the correctly-encoded chunks, yielding U+FFFD replacement chars that the post-step `replace(/�/g, '—')` then converts to em-dashes — but for the apostrophe positions, the round-trip produces invalid UTF-8 sequences where the bytes are dropped entirely.

**Audit docs landed (steps 1-4 complete):**
- `docs/audit/tokyo-anime-collab-cafes-summer-pre-edit-20260428.md`
- `docs/audit/tokyo-anime-collab-cafes-summer-damage-list-20260428.md`
- `docs/audit/tokyo-anime-collab-cafes-summer-proposed-fixes-20260428.md`
- `docs/audit/tokyo-anime-collab-cafes-summer-critic1-20260428.md`

**Article state:** Reverted to main HEAD pre-fix (mojibake count restored to 10, all curly apostrophes preserved).

**Lesson for next-session attempt:**

The whole-file Buffer round-trip works only when the file is uniformly mis-encoded. For files with mixed encoding (some sections proper UTF-8, some sections Latin-1-as-UTF-8), the fix needs to be **char-by-char with detection**:

```ts
// Pseudocode — only round-trip chars that are valid Latin-1 mojibake markers
function smartRecover(content: string): string {
  return content.replace(
    /([À-ÿ -¿][À-ÿ -¿°-ÿ])+/g,
    (match) => Buffer.from(match, 'binary').toString('utf8')
  )
}
```

Or selectively: only fix the well-known mojibake patterns (`â` → `—`, `Â¥` → `¥`, `ã©ã¸ãª...` → kanji) and leave correctly-encoded chars alone.

The akihabara fix worked because akihabara's curly apostrophes were already lost pre-fix (Critic 2 noted this as "pre-existing minimalist apostrophe style"). Summer-cafes still had its proper apostrophes intact, so the whole-file round-trip damaged them.

**Next-session action:**
1. Implement smart-recovery (selective mojibake replacement) in a helper script
2. Re-run on summer-cafes via the same Critic-loop protocol (Critic 1 will need to verify apostrophe preservation explicitly this time)
3. If Critic 1-3 PASS, commit on `fix/tokyo-anime-collab-cafes-summer-mojibake-repair` branch + PR
4. Apply same smart-recovery to slam-dunk-kamakura as belt-and-suspenders (slam-dunk may have the same mixed-encoding pattern as summer-cafes)

## Why this isn't a fallback (no `robots: noindex,follow` applied)

Per the original Q2 A fallback protocol:
- Slam-dunk-kamakura **already** has `robots: noindex,follow` (canonical+noindex sibling pattern). No further action needed — already in safe state.
- Summer-cafes is the canonical for the spring/summer collab-cafe tracker pair and is in current PROCEED status (per D2 batch 5). Reverting the regression returns it to the pre-fix state with mojibake intact, which is the same state main HEAD is in. No regression shipped, no fallback needed.

## Cross-reference

- B3 protocol spec: prior session's Phase 2 + Phase 3 mission prompts (Critic loop pattern from PR #18 akihabara repair)
- Mojibake-affected articles list source: D2 batch 5 finding (`docs/audit/phase0-summary-batch5-20260428.md`)
- Akihabara reference fix: PR #18 commit `287cff2`
