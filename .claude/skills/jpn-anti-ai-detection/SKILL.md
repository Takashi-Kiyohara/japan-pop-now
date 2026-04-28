---
name: jpn-anti-ai-detection
description: Detection-side companion to `jpn-translation-style`. Use AFTER an article is drafted to scan for AI-fingerprint signatures across 6 layers (Layer 1-2 grep, Layer 3-5 statistics, Layer 6 manual). Produces a 0-100 AI-flavor score for ship-gating and retroactive sweeps.
---

# jpn-anti-ai-detection — Phase 3.5 detection layer of v3 Adoption

## When to use

Trigger this skill when:

- An article draft is post-`jpn-translation-style` rewrite, ready to score
- Retroactive sweep across `content/articles/` to flag AI-fingerprint candidates for rewrite (Bucket C6 in v3 plan)
- A reader / GSC anomaly suggests an article may read AI-flavored

This skill is **detection**. `jpn-translation-style` is **writing**. They share Layer 1 vocabulary but use it differently:

- `jpn-translation-style` (drafting time): "don't write banned phrase X"
- `jpn-anti-ai-detection` (audit time): "count occurrences of banned phrase X to score the article"

## Layer architecture

| Layer | Method | Run cost | Where |
| --- | --- | --- | --- |
| 1 | Phrase grep (auto) | <1s | local |
| 2 | Syntax-pattern grep (auto) | <1s | local |
| 3 | Sentence-length variance (statistical) | ~5s | local |
| 4 | Type-token ratio + n-gram repetition (statistical) | ~10s | local |
| 5 | Burstiness + structural-monotony score (statistical) | ~15s | local |
| 6 | Human read-through (manual) | ~5min/article | human |

## Layer 1 — Phrase signature grep

Reuses the banned-phrase list from `jpn-translation-style` Layer 1. Counted, not just flagged.

```bash
node scripts/ai-detection/check-article.ts <article.mdx> --layer=1
# Output: { layer: 1, hits: [...], score: 0-100 }
```

Score logic:
- 0 hits → Layer-1 score 0
- 1-2 hits → 20
- 3-5 hits → 50
- 6+ hits → 90

## Layer 2 — Syntax-pattern grep

Reuses Layer-2 patterns from `jpn-translation-style` (parallel-list overuse, 体言止め runs, bullet-paragraph imbalance, identical sentence-length runs).

```bash
node scripts/ai-detection/check-article.ts <article.mdx> --layer=2
```

Score:
- 0 patterns hit → 0
- 1 pattern moderately → 20
- 2 patterns moderately → 50
- 3+ patterns OR any pattern severely → 90

## Layer 3 — Sentence-length variance

AI prose tends toward uniform sentence length. Human writers vary deliberately (short punchy sentence after a long winding one).

Metric: standard deviation of sentence length (in characters), normalized by mean length (= coefficient of variation, CV).

| CV (characters) | Score |
| --- | --- |
| < 0.30 (uniform — AI-like) | 90 |
| 0.30 - 0.45 | 60 |
| 0.45 - 0.65 (target human range) | 0-20 |
| > 0.65 (very high variance, may be erratic) | 30 |

## Layer 4 — Type-token ratio (TTR) + n-gram repetition

### TTR (lexical diversity)

`TTR = unique_tokens / total_tokens` over a 500-token sliding window.

| TTR | Score |
| --- | --- |
| < 0.40 (heavy repetition — AI-like) | 80 |
| 0.40 - 0.55 | 40 |
| 0.55 - 0.75 (target human range) | 0-20 |
| > 0.75 (overly diverse, may be artificial) | 30 |

### N-gram repetition

Count of identical 4-grams within an article. AI prose recycles phrasing more than human prose.

| Repeated 4-grams (excluding stopwords) | Score |
| --- | --- |
| 0-2 | 0 |
| 3-5 | 30 |
| 6-10 | 60 |
| 11+ | 90 |

## Layer 5 — Burstiness + structural monotony

### Burstiness (per Tian's GPTZero)

Burstiness measures variation in sentence-level perplexity proxy (here, sentence-length variance + lexical diversity per sentence). Human prose has bursty rhythm; AI is even.

Implementation: compute `(std_dev_sentence_perplexity_proxy / mean) * 100`. Higher = more human-like.

| Burstiness score | AI-flavor score |
| --- | --- |
| < 20 (very even — AI-like) | 90 |
| 20-40 | 50 |
| 40-70 (target) | 0-20 |
| > 70 (erratic) | 30 |

### Structural monotony

Counts:
- Headings of identical length (H2 character count variance)
- Sections of near-identical word count
- Paragraphs of near-identical sentence count

If the article's H2 sections are all 200-220 words, all open with definition-first paragraphs, and all close with a 1-sentence summary — that's a v3 template, not necessarily bad, but score it.

| Structural monotony | Score |
| --- | --- |
| Detected (H2 lengths within 10% of each other AND identical paragraph rhythm) | 60 |
| Partially detected | 30 |
| Varied | 0 |

## Layer 6 — Manual read-through

After Layers 1-5 score, an Opus-tier reviewer reads the article and flags:

- **Voice consistency**: does the article sound like one human, or like a panel-edited LLM?
- **Hidden contradictions**: does paragraph 3 contradict paragraph 8 in subtle ways (e.g., describes the venue as both quiet and bustling)?
- **Off-key moments**: any sentence that, on a second read, feels like the writer wasn't actually there?
- **Uniformly positive**: does the article land EVERY observation as positive? Real reviews note ≥ 1 drawback.

Manual layer score: 0 (no flags), 30 (1-2 flags), 60 (3-4 flags), 90 (5+ flags or any "fabricated experience" suspicion).

## Composite AI-flavor score

```
score = max(L1, L2, L3, L4, L5, L6)  # worst-axis dominates
```

Why max not weighted-mean: a single severe AI fingerprint (e.g., 6+ Layer 1 hits) is enough to call the article AI-flavored even if other layers are clean.

| Composite score | Verdict |
| --- | --- |
| 0-20 | Clean — ship |
| 21-40 | Light AI flavor — fix layer with highest score, re-run |
| 41-70 | Significant — rewrite affected sections |
| 71-100 | Heavy AI flavor — full rewrite required |

## Output

```
docs/audit/ai-detection-{slug}-{date}.md
```

```markdown
# AI Detection: {slug}
Date: {YYYY-MM-DD}
Article: {sha}

## Per-layer scores
| Layer | Score | Top hits |
| ----- | ----- | -------- |
| 1 phrase | XX | ["様々な" x3, "魅力的" x2, ...] |
| 2 syntax | XX | ["parallel-list x4 occurrences"] |
| 3 length variance | XX | CV = 0.32 |
| 4 TTR + 4-gram | XX | TTR 0.42, 4-gram repeats 7 |
| 5 burstiness + monotony | XX | burst 25, all H2 within 8% |
| 6 manual | XX | (Opus review notes) |

## Composite
{0-100} — {SHIP / FIX-LAYER / REWRITE-SECTIONS / FULL-REWRITE}

## Top-3 fixes
1. ...
2. ...
3. ...
```

## Retroactive sweep mode

For Bucket C6 (77-article scan):

```bash
node scripts/ai-detection/scan-corpus.ts --output docs/audit/ai-detection-retroactive-20260428.md
```

Produces a matrix:

| slug | composite | dominant layer | recommendation |
| ---- | --------- | -------------- | -------------- |
| akihabara-arcade-rhythm-games-guide-2026 | 35 | L1 | fix-layer |
| ... | | | |

Articles scoring 71+ get rewrite tickets. Articles scoring 41-70 get section rewrite tickets. Articles 0-40 get a single-line note in the retroactive doc and stay live.

## Why this skill is decoupled from `jpn-translation-style`

- `jpn-translation-style` runs at draft time, by the writer, to avoid producing AI-flavored prose
- `jpn-anti-ai-detection` runs at audit time, by a reviewer, to score what was produced
- Confusing them leads to either blocking too many drafts at write time, or shipping AI-flavored prose because the writer trusts their own judgment

Both reference the same Layer 1-2 lists but use them with different cost models (write-time grep is fast/strict; audit-time scoring is graded).

## DO NOT

- Run only Layer 1-2 grep and call the article "AI-checked" — Layers 3-5 catch what Layer 1-2 misses
- Average per-layer scores instead of taking max (a 90 in any layer means problem)
- Score statistical layers without a calibrated human baseline (Bucket C2-C3 produces this; until then, treat L3-L5 thresholds as provisional)
- Use Layer 6 score as primary — manual is for catching what statistics missed, not for reverting statistical findings
- Apply scoring to quoted/embedded content (interview snippets, official text); exclude those before measurement
