---
title: "E2 Dead-Weight noindex Application Log (2026-04-26)"
date: 2026-04-26
author: Takapon (via Claude Code)
context: 24h indexing sprint Track E2 — apply robots:noindex,follow to dead-weight articles per E1 PR #3 wiring
status: 0 articles modified — strict criteria yields 0 candidates with current content state
---

# E2 — Dead-Weight noindex Application Log

## Methodology

Per the 24h sprint Track E2 brief, dead-weight criteria:
- Internal inbound link count = **0**
- Body word count **< 500**
- Article age **>= 30 days** (lastUpdated before 2026-03-26, with today = 2026-04-26)

A frontmatter `robots: noindex,follow` would tell Google to drop the article from index while preserving link equity to other pages.

## Result — **0 articles modified**

### Step 1: Inbound link analysis

Computed inbound link count per slug across all 77 articles (cross-references in MDX bodies, self-references excluded). Distribution:

| inbound count | article count |
|---:|---:|
| 0 | 11 |
| 1 | 16 |
| 2 | 14 |
| 3+ | 36 |

Note: top performer `tokyo-anime-collab-cafes-spring-2026` has 63 inbound links; `how-to-book-anime-collab-cafe-japan` and `akihabara-complete-guide-2026` tie at 29.

### Step 2: 0-inbound list (11 candidates)

```
cosplay-experience-tokyo-2026
jujutsu-kaisen-cafes-japan-2026-guide
kyoto-anime-guide-2026
luvlab-harajuku-diy-accessory-experience
naruto-tokyo-pilgrimage-2026
chiikawa-land-tokyo-complete-2026
dark-moon-chara-cafe-ikebukuro-2026
jojo-stone-ocean-cafe-jojo-world-2026
kamakura-slam-dunk-pilgrimage-2026
okami-20th-monster-hunter-sakaba-tokyo-osaka-2026
pokemon-center-tokyo-complete-guide-2026
```

### Step 3: Apply word-count + age filters

| slug | lastUpdated | wc | passes age (<2026-03-26)? | passes wc (<500)? |
|---|---|---:|---|---|
| cosplay-experience-tokyo-2026 | 2026-04-05 | 1825 | ❌ recent | ❌ |
| jujutsu-kaisen-cafes-japan-2026-guide | 2026-04-06 | 1558 | ❌ recent | ❌ |
| kyoto-anime-guide-2026 | 2026-04-02 | 3493 | ❌ recent | ❌ |
| luvlab-harajuku-diy-accessory-experience | 2026-04-15 | n/a (mdx parsing) | ❌ recent | ❌ |
| naruto-tokyo-pilgrimage-2026 | 2026-04-08 | 2493 | ❌ recent | ❌ |
| chiikawa-land-tokyo-complete-2026 | 2026-05-02 | 3035 | ❌ future | ❌ |
| dark-moon-chara-cafe-ikebukuro-2026 | 2026-04-26 | 1970 | ❌ recent | ❌ |
| jojo-stone-ocean-cafe-jojo-world-2026 | 2026-04-29 | 2848 | ❌ future | ❌ |
| kamakura-slam-dunk-pilgrimage-2026 | 2026-05-05 | 5340 | ❌ future | ❌ |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 2026-04-25 | 2028 | ❌ recent | ❌ |
| pokemon-center-tokyo-complete-guide-2026 | 2026-05-01 | 2907 | ❌ future | ❌ |

**Result: 0 articles match all 3 criteria.**

## Why no application?

1. **Word count < 500** is impossible by current editorial standards — the lowest article is ~1,500 words. Brief criteria likely intended to catch genuinely thin auto-generated stubs, of which we have none.
2. **All 11 zero-inbound articles are < 30 days old.** They are recently shipped pieces that haven't yet been internally linked from hubs/category pages. Noindex'ing them would harm their natural growth path.
3. The actual signal these articles need is **inbound link injection from hub pages**, not noindex.

## Recommendation — pivot from noindex to internal-link injection

The 11 zero-inbound articles are **un-discovered**, not **dead**. They will accrue inbound links naturally as the editorial calendar adds them to hub round-ups, related-article footers, and category pages. Specifically:

| slug | suggested hub link |
|---|---|
| cosplay-experience-tokyo-2026 | /category/experiences hub round-up |
| jujutsu-kaisen-cafes-japan-2026-guide | jjk-sweets-paradise (related-article footer) + tokyo-anime-collab-cafes-spring-2026 |
| kyoto-anime-guide-2026 | osaka-anime-guide-den-den-town (sister article); /guides/osaka-anime-guide hub |
| luvlab-harajuku-diy-accessory-experience | /category/experiences hub; shibuya-harajuku-pop-culture-guide |
| naruto-tokyo-pilgrimage-2026 | anime-pilgrimage-spots-tokyo (hub for pilgrimage); /guides/anime-pilgrimage-tokyo |
| chiikawa-land-tokyo-complete-2026 | dark-moon-chara-cafe-ikebukuro-2026 (sister Ikebukuro venue) |
| dark-moon-chara-cafe-ikebukuro-2026 | tokyo-anime-collab-cafes-spring-2026 (top inbound hub) |
| jojo-stone-ocean-cafe-jojo-world-2026 | tokyo-anime-collab-cafes-spring-2026 |
| kamakura-slam-dunk-pilgrimage-2026 | anime-pilgrimage-spots-tokyo; /guides/day-trips-from-tokyo |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | tokyo-anime-collab-cafes-spring-2026; osaka-anime-cafes-complete-guide-2026 |
| pokemon-center-tokyo-complete-guide-2026 | pokemon-karaoke-manekineko-30th-anniversary-2026; akihabara-complete-guide-2026 |

This work is a Phase 3+ candidate for the 24h sprint or a separate "internal-link densification" sprint.

## Track E2 status

**Closed for this sprint** — strict criteria deliver 0 hits, application pivots to internal-link injection (Phase 3+).

When PR #3 (E1 noindex wiring) merges, the wiring will be **available** for future use. We just don't have any current candidates strict enough to apply it to.

## Future re-evaluation triggers

Re-run E2 analysis when:
- GSC export shows article(s) with 28-day click = 0 AND impression < 10 (true Google-determined dead-weight)
- An article's `lastUpdated` is older than 30 days AND inbound links remain at 0 after internal-link densification sprint
- A category becomes orphaned (0 articles, e.g. /category/events / /category/culture currently)
