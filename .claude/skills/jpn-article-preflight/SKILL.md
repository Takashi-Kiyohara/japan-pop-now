---
name: jpn-article-preflight
description: Phase 0 + Phase 2 combined preflight for new article candidates on japan-pop-now.com. Use BEFORE drafting any new article in `content/articles/` or _drafts/. 5 must-pass questions + 4 hard-reject criteria + Phase 2 outline trigger. Score 0 or 100 — no partial credit.
---

# jpn-article-preflight — Phase 0 + Phase 2 of v3 Adoption

## When to use

Trigger this skill when:

- A new article slug is being proposed (mission prompt, scheduled task draft, manual idea)
- Before any drafting work starts (do NOT write the article first then justify it)
- During retroactive sweeps to flag existing articles that would have failed Phase 0 had it been applied at the time

This skill exists because pre-v3, articles were drafted on intuition. With 77 articles already published, every new addition must clear a higher bar to avoid cannibalizing the existing corpus.

## Phase 0 — Pre-draft gate

### 5 must-pass questions

Each is binary (Yes / No). All 5 must be Yes to proceed. Score is 100 (proceed) or 0 (reject) — **no partial credit, no "mostly yes"**.

#### Q1 — Audience fit

> Would the target reader (an international anime/pop-culture-curious traveler arriving in Japan in the next 12 months) find this article concretely useful for their trip?

Yes signals:
- Article enables a specific decision (which cafe, which station, which date window)
- Article saves real friction (queue timing, ticket process, language barrier)
- Article fills a knowledge gap that English-language competitors don't fill

No signals:
- Article is a curiosity piece a reader might enjoy AT HOME but won't act on during a trip
- Article duplicates a guidebook entry already on TimeOut Tokyo / Tokyo Cheapo / Tofugu

#### Q2 — Search intent fit

> Is there demonstrable search demand we can plausibly capture in the next 6 months?

Verification path:

```bash
# Quick check via 1 minute of GSC + competitive scan
# 1. GSC > Performance > Queries — is the proposed primary keyword (or close variant) showing impressions?
# 2. Google search the primary keyword — are top 10 English-language pages already strong (DR > 50, content depth)?
```

Yes signals:
- Existing GSC impressions on related keywords (we're already partially ranking)
- Top-10 English competitors are weak (thin content, outdated, no English variant)
- Long-tail variant has zero good English answers

No signals:
- TimeOut/TripAdvisor own positions 1-3 with > 1000 word articles
- Zero search volume even on long-tail variants (no demand at all)

#### Q3 — Source viability

> Can the article's load-bearing facts (price, hours, address, dates) be sourced from official channels right now?

Official channels (in priority order, per `jpn-image-management` skill):

1. Brand official .jp site (`sweets-paradise.jp`, `pokemon.co.jp/ex/cafe`, etc.)
2. Verified brand X account
3. 公式 press release
4. Government / transit agency site (for travel-tips silo)

Yes signal:
- All hard facts traceable to ≥ 1 official source within 10 minutes of WebFetch

No signal:
- Hard facts only available on aggregator sites (Tabelog, TripAdvisor) — those drift and are not citable
- Brand / venue has no English-or-Japanese .jp presence

#### Q4 — Differentiation

> What does this article offer that the top 3 English competitors don't?

Acceptable differentiation classes:

- **Recency**: collab event happening in the next 90 days, English coverage doesn't exist yet
- **Insider mechanic**: specific timing / line / exit / sub-route only available to someone on the ground
- **Comparative**: explicit ranking / contrast across multiple venues with consistent criteria (English competitors usually do single-venue reviews)
- **Stack-level**: combines venue + transit + pre-visit prep into one place (the 9-element collab-cafe stack)

Unacceptable:
- "Better SEO" alone — that's not differentiation, that's a fight we lose to higher-DR sites

#### Q5 — Sustainability

> Will this article still have value 90 days from now?

| Article type | 90-day value test |
| --- | --- |
| Time-limited event | Will it become anchor for future iterations? Set `validUntil` + plan post-event update path |
| Evergreen guide | Yes by definition (transit, area, basics) |
| Seasonal | Document seasonal refresh cadence (`japan-rail-pass-2026-guide` → `…-2027-guide` annual update plan) |
| Pop-culture trend | Does the IP have ongoing presence (Slam Dunk, JJK = yes; one-off film tie-in cafe = no unless folded into a hub) |

Yes signal:
- Clear post-90-day plan (refresh, fold, evergreen)

No signal:
- Article will be obsolete and orphaned in 90 days with no rescue path

### 4 hard-reject criteria

Any one of these triggers immediate REJECT, regardless of Phase 0 question scores.

1. **Cannibalization**: an existing article in `content/articles/` already targets the same primary keyword OR has > 60% topic overlap. Pre-publish grep:

   ```bash
   grep -rli "{primary-keyword}" content/articles/
   ```

   If hit — strengthen the existing article instead.

2. **Silo violation**: the topic doesn't fit any of the 5 silos (`collab-cafes`, `experiences`, `area-guides`, `anime-pilgrimage`, `travel-tips`). Per `feedback_category_silos` (project memory): never restructure silos. If a topic doesn't fit, the topic doesn't get an article.

3. **Source ban hit**: the only available image / hard-fact source is from the banned list (Unsplash, Getty, IP key visuals without permission, generation). If you can't ship the article without one of these, you can't ship the article.

4. **No first-hand path**: nobody on the team can or has visited / experienced the subject AND no insider research path exists. E-E-A-T Experience signal would be fabricated. (See `jpn-translation-style` Layer 4.)

## Phase 2 — Pre-draft outline

Only after Phase 0 PASS. Phase 2 is the bridge from "approved" to "drafted".

### 2.1 — Search intent declaration

In the draft frontmatter, add (for tracking, can be stripped before publish):

```yaml
intent: informational | navigational | transactional | commercial-investigation | local
primary_keyword: "JJK sweets paradise tokyo"
secondary_keywords: ["jujutsu kaisen cafe collab", "JJK collab 2026", "Sweets Paradise Tokyo"]
```

This drives URL pattern, schema choice, and CTA placement (per `jpn-seo-rules`).

### 2.2 — Outline against article-quality.md stack

For collab-cafe articles, draft outline must hit the 9-element stack from `.claude/rules/article-quality.md`:

1. TL;DR summary box
2. Comparison table (if multi-location)
3. Menu ranking (top 3-5)
4. Limited merch / loot guide
5. 1-hour plan
6. Common mistakes → success tips
7. Pre-visit checklist
8. Freshness date badge
9. Booking CTA (Klook affiliate)

For other silos, the equivalent stack varies:

- **experiences**: hero → safety/age/skill → cost & duration → access → reservation flow → insider tip → CTA
- **area-guides**: hero → 1-hour anchor → 4-hour anchor → 1-day anchor → access map → eat/sleep → CTA
- **anime-pilgrimage**: hero → IP context → ordered route → access logistics → photo etiquette → after-route options → CTA
- **travel-tips**: hero → TL;DR → step-by-step → common errors → cost comparison → official source links → CTA

### 2.3 — Image source plan

Per `jpn-image-management` 軸 1 floor:

- Calculate target image count (`ceil(word_count_target / 400)`)
- Pre-search Wikimedia Commons + 公式 X / press for at least 80% of slots
- Identify Takapon-photoshoot gaps (image we cannot source) — block these from the slot list, or note "text-only section"

### 2.4 — Differentiation receipt

Write a 1-paragraph differentiation note to `_drafts/{slug}.differentiation.md`:

- The 1-2 sentence summary of WHY this article is being created
- The 3 top English competitors and their specific weaknesses
- The angle this article will take that those don't

This becomes the editorial check before publish: did the finished draft actually deliver on this differentiation? If not, defer publish until it does.

## Output

When invoked, produce a Phase 0 + Phase 2 report at:

```
content_operations/preflight/{slug}-preflight-{date}.md
```

Format:

```markdown
# Preflight: {slug}
Date: {YYYY-MM-DD}

## Phase 0
| # | Question | Score | Note |
| - | -------- | ----- | ---- |
| Q1 | Audience fit | Yes/No | … |
| Q2 | Search intent | Yes/No | … |
| Q3 | Source viability | Yes/No | … |
| Q4 | Differentiation | Yes/No | … |
| Q5 | Sustainability | Yes/No | … |

| # | Reject criterion | Triggered? | Note |
| - | ---------------- | ---------- | ---- |
| R1 | Cannibalization | Yes/No | … |
| R2 | Silo violation | Yes/No | … |
| R3 | Source ban hit | Yes/No | … |
| R4 | No first-hand path | Yes/No | … |

## Verdict
PROCEED (100) | REJECT (0)

## Phase 2 (only if PROCEED)
- Intent: …
- Primary keyword: …
- Stack outline: …
- Image source plan: …
- Differentiation: see _drafts/{slug}.differentiation.md
```

## DO NOT

- Auto-pass Phase 0 because the proposed article "looks fine"
- Score 50 / 70 / 90 — only 0 or 100 are valid
- Skip Phase 2 because Phase 0 passed; both are required
- Allow a Phase 0 reject to be appealed without addressing the failed question concretely (re-running Phase 0 after a structural change is fine)
- Begin drafting body prose before Phase 2 outline lands in `_drafts/`
