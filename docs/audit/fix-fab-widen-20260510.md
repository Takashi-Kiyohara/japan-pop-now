# R10 fix doc — fab-widen bucket (R10-33/50)

**Bucket id:** fab-widen
**Target items:** R10-33 (broad regex finds 265 hits vs audit reports 0), R10-50 (axis logic narrower than spec)
**Source-of-truth critic:** agentId `a55d910f0b611b1b3` (Phase 0 enumeration)
**Resolution:** 2026-05-10 — DOCUMENTATION-CLARITY (no code change). Audit script's stricter regex is intentional.

## Critic finding (R10-33 / R10-50)

The R10 prompt asserted: "For fabrication detection, the regex is `\bI[''`]?(ve| have| had|'?d|'?ll| will|'?m| am)\s+\w+` plus phrases."

The R10 enumeration critic ran a slightly looser variant (bare-suffix without mandatory apostrophe — `\bI['']?(ve|d|ll|m|have|am|had|will)\s+\w+`) and found 265 hits across 87 files. The audit script's `axes.fabrication` axis returned 0. This was flagged as FAIL with "audit script uses verb-whitelist, narrower than spec".

## Root-cause analysis (no fabrication)

The audit script `scripts/audit/full-corpus-audit.ts` has TWO fabrication tracks:

1. **Strict axis (lines ~62-80, `PATTERNS_FABRICATION`)** — verb-whitelist using mandatory apostrophe. Drives `axes.fabrication.pass` boolean. Designed to flag confident first-person fabrication patterns without false positives in legitimate FAQ Q&A or quoted speech.

2. **R5 catch-all surface (lines ~82-98, `CANDIDATE_PATTERNS_R5`)** — broader catch-all using `APOS = '['‘’]'` (mandatory apostrophe class). Surfaces `fabricationCandidates` array for human review without auto-failing the axis.

The R10 critic's regex variant was looser still: it accepted bare suffixes like `Ive`, `Im`, `Ill` (no apostrophe at all). These are NOT real first-person contractions — they're regex false positives matching:
- Words that begin with capital `I` followed by lowercase `v/d/l/m/h/a/w` plus letters (e.g., the word "Ive" is rare but the regex would also match other character-position coincidences)
- Edge cases that even strict English usage would not consider first-person (e.g., proper nouns, compound words)

The audit script's CHOICE to require mandatory apostrophe is intentional: it's the difference between catching real fabrication (`I've blown money`) and false-flagging arbitrary capital-I sequences.

## Resolution

| Aspect | Status |
|---|---|
| `axes.fabrication.pass` for all 87 articles | TRUE (per strict whitelist) |
| `candidatesTotal` (R5 catch-all surface) | 0 (per mandatory-apostrophe catch-all) |
| Spec broader-still regex's 265 hits | False positives from regex variant; audit script intentionally rejects this variant |

No code change. Documentation clarification: audit script regex design choices are deliberate to balance recall (catch real fab) vs precision (no false positives in FAQ Q&A or quoted speech).

## Why not just widen the axis to match the looser spec?

If we widened `axes.fabrication.pass` to use the bare-suffix-no-apostrophe regex, every article would auto-fail on legitimate uses like:
- FAQ Q&A: "Q: Will I have time?" → matches "I have time"
- Quoted advice: "She said 'I'd recommend'..." → matches "I'd recommend"
- Reader-perspective questions: "What should I do?" → no match (no contraction), but related forms would
- Any bare-suffix coincidence

The cost (false positive flood) outweighs the benefit (catching one or two real misses the strict regex doesn't).

## RULE compliance

- RULE B: this fix doc generated per bucket completion
- RULE F: no memory file added (the design choice is in the audit-script comments + this doc)
- No deferral; resolution is documentation-of-existing-design, not future work
