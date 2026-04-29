# L4 Calibration Hybrid — Adopted Policy (2026-04-29)

User decision after PR #21 review: **A-improved hybrid** — keep the strict L4 threshold but add explicit escape hatches so legitimate Takapon-byline / well-written articles aren't false-positive-blocked.

## Threshold tiers

| Score | Level | Action |
| ---: | --- | --- |
| < 30 | **L1** clean | no action |
| 30 – 49 | **L2** log only | append to `docs/audit/ai-detection-log/{YYYY-MM-DD}.md`, never block |
| 50 – 69 | **L3** warn | log + suggest a Critic-loop run; never block |
| ≥ 70 | **L4** block-eligible | block UNLESS an escape hatch passes |

## Five escape hatches (priority order, first-passing wins)

### 1. `human_baseline_match`

**DEFERRED for this iteration.** Cosine similarity vs the 130-article human travel-prose corpus at `.tmp/pre-ai-corpus/`. Implementing this requires a vector-embedding pipeline (e.g., sentence-transformers running on Vercel CI) — too heavy for first-pass. Always returns FAIL for now; falls through to the next hatch.

Future-work spec: compute corpus-mean embedding once, cache as `docs/research/human-corpus-embedding-20260429.json`; cosine similarity ≥ 0.85 = pass.

### 2. `takapon_byline_first_person`

**Implemented.** Pass when both:

- ≥ 3 sentences contain a first-person pronoun (`I`, `I've`, `I'd`, `my`) — word-boundary-aware regex
- ≥ 1 inline `Photo:` credit anywhere in the body

Rationale: an article with multiple first-person sentences AND photo credits is almost certainly an authentic Takapon-experience piece, regardless of MATTR / 4-gram metrics that a brand/venue-heavy collab-cafe article is bound to fail.

### 3. `voice_marker`

**Implemented.** Pass when both:

- frontmatter `voice:` field is set (any non-empty string — the value itself is documentation, not a control)
- body contains at least one signature phrase from `[I've, weekly visits, years of, I personally, my team, written from, first-person]`

Rationale: lighter-touch fallback for articles where Takapon writes in first person but doesn't have many photo credits (e.g., a Shibuya night-walk piece that draws on Wikimedia images).

### 4. `pattern_allow`

**Implemented.** Pass when both:

- ZERO occurrences of the AI-typical phrase ban-list: `delve, furthermore, moreover, navigate the, in today's fast-paced, it's worth noting, unleash, dive into, a testament to`
- Sentence-start diversity score ≥ 0.6 (= unique first-words ÷ total sentences across body, ignoring case/punctuation)

Rationale: an article that avoids common AI tells AND has varied sentence openings reads human regardless of statistical metrics. The ban-list is short and high-signal; sentence-start diversity is the cheapest available "natural-prose" check.

### 5. `manual_override`

**Implemented.** Pass when frontmatter contains:

```yaml
ai_audit_override: "human-verified-by-takapon-YYYY-MM-DD"
```

Date format strictly validated. Use this as the last-resort hatch when an article was hand-reviewed and verified human, but doesn't satisfy any of the heuristic hatches (e.g., a press-release-heavy article in third-person with very little prose). The PR-comment cross-check (Takapon comments confirming the override) is enforced out-of-band by reviewer policy.

## CI workflow change

`.github/workflows/ai-detection-gate.yml` is updated to:

- Replace direct invocation of `scripts/ai-detection/check-article.ts` with the wrapper at `scripts/audit/ai-detection-gate.ts`
- Parse `.blocked` (boolean) from the wrapper's `--json` output instead of comparing `.composite` to a threshold
- Threshold logic moves entirely into the wrapper; the workflow stays simple ("if blocked, fail")

## Dry-run results

Across all 77 corpus articles (see `docs/audit/l4-hybrid-dryrun-20260429.md`):

| Tier | Count | % |
| --- | ---: | ---: |
| L1 clean | 0 | 0% |
| L2 log only | 0 | 0% |
| L3 warn | 4 | 5.2% |
| L4 (composite ≥ 70) | 73 | 94.8% |
| **Of L4: rescued by escape hatch** | **47** | 60.0% of all articles |
| **Of L4: actually blocked** | **26** | 33.7% of all articles |

**Net effect vs the pre-hybrid threshold-30 gate**: from 73 articles failed → **26 articles failed** (47-article reduction in false positives). Of the 47 rescues, 43 came from `takapon_byline_first_person` (most useful hatch), 3 from `pattern_allow`, 1 from `voice_marker`. Zero `manual_override` overrides on the corpus today (expected — none have been added).

This still leaves 26 articles flagged, which is the right shape: those are the structurally-AI-resembling articles (heavy brand-term repetition, low first-person voice, no Takapon photo) that genuinely need a quality-pass.

## What this PR ships

- `scripts/audit/ai-detection-gate.ts` (220 lines) — the wrapper with hybrid logic + 5 hatch impls
- `.github/workflows/ai-detection-gate.yml` updated to call the wrapper and parse `.blocked`
- `docs/audit/l4-hybrid-dryrun-20260429.md` — full per-article matrix
- This policy doc (`docs/policy/l4-calibration-hybrid-20260429.md`)
- Existing `docs/research/l4-calibration-policy-20260428.md` kept unchanged as the historical note (Option A vs Option B trade-off analysis that led to this decision)

## Historical note

The PR #21 doc proposed two policy options:

- **A** — accept calibrated floor (raise gate threshold from 30 to ~70)
- **B** — brand/IP/venue whitelist (filter domain-specific tokens before 4-gram count)

User chose **A-improved**: keep A's higher threshold but add explicit escape hatches that catch legitimate Takapon-byline articles still scoring ≥ 70 due to brand-term repetition. This is more robust than pure A (no false-positive penalty for human Takapon work) without the maintenance overhead of B (no dictionary upkeep).

The full Option A vs B analysis stays at `docs/research/l4-calibration-policy-20260428.md` for reference.

## Follow-up work

- Implement `human_baseline_match` once embedding pipeline lands (deferred for separate PR)
- Add `voice` and `ai_audit_override` to the frontmatter schema in `lib/articles.ts` (next session's `feat/frontmatter-voice-override` PR)
- Adjust ban-list as new AI tells are observed (re-tune ~quarterly)
- Re-run `--scan` after every major rewrite-queue cycle to catch regression
