# L4 Calibration Policy — 2026-04-28

## Background

The Bucket C3 calibration (`docs/research/human-baseline-20260428.json`) shifted the AI-flag thresholds for L3 / L4 / L5 statistical metrics to match a 130-article pre-2023 travel-prose corpus. The MATTR-50 threshold moved from literature `0.55` to calibrated `0.85` — a 30-point relaxation in line with travel writing's natural lexical diversity.

After calibration, the retroactive scan at `docs/audit/ai-detection-retroactive-calibrated-20260428.md` shows:

| Verdict | Uncalibrated | Calibrated | Delta |
| --- | ---: | ---: | --- |
| SHIP | 0 | 0 | — |
| FIX_LAYER | 0 | 5 | +5 |
| SECTION_REWRITE | 4 | 19 | +15 |
| FULL_REWRITE | 73 | 53 | -20 |

20 articles freed from full-rewrite, but **all 77 still flagged composite ≥ 30 with L4 dominant**. The dominance is driven by 4-gram repetition: japan-pop-now articles repeat brand / IP / venue / food terms more than even the calibrated travel-prose baseline allows.

This is **not a script bug**. Collab-cafe and pilgrimage articles by their nature recur on:

- IP names (e.g., "Demon Slayer", "Jujutsu Kaisen", "Pokémon", "Chainsaw Man")
- Venue names (e.g., "Animate Akihabara", "Pokemon Center", "Sweets Paradise")
- Food terms (e.g., "menu", "drink", "parfait", "limited", "collab")
- Geographic markers (e.g., "Shibuya", "Ikebukuro", "Akihabara", "Shinjuku")

These terms recur 6-15× across a 2,000-word article, inflating 4-gram repetition counts well above the corpus baseline (which contains generic city / country / theme guides, not narrowly-IP-focused features).

## Two policy options

### Option A — Accept the calibrated floor

Treat the 53 full-rewrite + 19 section-rewrite + 5 fix-layer = **77 articles** as the new content-quality bar. Use the CALIBRATED scan (PR #20) as a relative ranking of which articles need the most work, not as an absolute "AI-suspect" verdict.

**Pros:**

- Zero implementation cost — already shipped
- The calibrated scan IS useful as a ranking — articles with higher composite are objectively further from the human-prose center, even if all are flagged
- Forces a high content-quality floor (citations, voice variety, anti-template-rhythm)

**Cons:**

- "All 77 articles flagged" makes the AI-detection gate noise rather than signal — the CI gate (`.github/workflows/ai-detection-gate.yml`) would block every PR
- Loses the binary go / no-go semantic the gate was designed for
- Conflates "structurally repeats brand terms" with "AI-generated"

**Operational implication if adopted:** raise the CI gate threshold from `composite >= 30` to something like `composite >= 70`, and treat L4-only-dominant flags as informational rather than blocking. Add a per-PR allowlist where article-author can mark a known-OK structural repetition pattern.

### Option B — Brand / IP / venue whitelist (refine L4)

Filter brand / IP / venue tokens out of the 4-gram-repetition count. Keep MATTR computation as-is (place-name diversity is a useful human signal), but exclude N-gram repetitions that are entirely composed of "domain-specific" tokens.

**Implementation:**

- Maintain a curated allowlist file at `lib/ai-detection-vocabulary-allowlist.json` (or similar) with tokens that should not count in 4-gram repetition. Seed it from:
  - The `category` taxonomy from `lib/categories.ts` (cafes, events, destinations, experiences, culture)
  - Top 200 most-frequent N-gram-bearing tokens across the corpus that match a brand / IP / venue regex (proper-noun heuristic + Wikipedia-known anime IP list)
  - Wikipedia / wikidata for anime / manga IP names (one-time fetch, refresh quarterly)
- In `scripts/ai-detection/check-article.ts` (and shared lib post-Bucket-7-refactor), filter tokens against the allowlist before computing 4-grams
- Keep computation deterministic — allowlist is a static file, not re-derived per run

**Pros:**

- Restores the AI-detection gate's signal-to-noise ratio
- Codifies what "domain-specific repetition" looks like in this niche
- Whitelist is reviewable and auditable
- Works even when the next anime IP becomes popular — just add to the list

**Cons:**

- Implementation cost: ~2-4 h to seed the allowlist, integrate into 4-gram computation, validate that calibrated scan now produces a bimodal (clean vs flagged) distribution rather than the current monomodal (everything flagged) output
- Allowlist maintenance overhead: must update when new IPs / venues become article topics
- Risk: a compromised / over-permissive allowlist could let real AI text through

## Recommendation

**Adopt Option B (brand whitelist).** The gate's value is in catching prose that doesn't read like a human travel writer's voice, not in penalizing structural domain repetition. Without a whitelist, the gate becomes noise and gets ignored — which is the worst outcome (gate exists but no one trusts it).

Proposed implementation order:

1. Seed allowlist from category taxonomy + top-200 N-gram-bearing corpus tokens (~2 h work, mechanical)
2. Add `--allowlist=` flag to `scripts/ai-detection/check-article.ts` and pass through in `scan-corpus.ts` / `recalibrate-corpus-scan.ts` / CI gate workflow
3. Re-run retroactive scan with allowlist; verify distribution becomes bimodal
4. Update Skill `.claude/skills/jpn-anti-ai-detection/SKILL.md` to document the allowlist mechanism + maintenance protocol

If the bimodal distribution doesn't emerge after Option B, fall back to Option A and adjust gate threshold instead.

## Decision needed from user

User to confirm Option A or Option B (or modify). This doc is the deliverable for Bucket 6 of v3 Phase 3 — it stops at the policy proposal so the user can decide before Phase 4 implementation.
