# R14 Bucket D cleanup — markdown-form inline Threads CTA strip

**Bucket:** D (cleanup phase)
**Date:** 2026-05-14
**Commits:** `d9d9ce2` (batch 1/3), `896eeba` (batch 2/3), `642f5c8` (batch 3/3), `f4ab3f5` (jjk-shibuya manual)
**Cause:** Original R14-D regex (commit `815e80d`) targeted the HTML `<div className="jpn-cta">` wrapper. 29 articles used a second, plain-markdown form that the regex did not match.

## Two inline patterns discovered

| Pattern | Example | Caught by R14-D? | Caught by R14-cleanup? |
|---|---|---|---|
| HTML wrapper | `<div className="jpn-cta"><p><strong>Follow <a href="...">@pop_now_jp on Threads</a></strong>...</p></div>` | YES (`815e80d`) | — |
| Markdown bold | `**Follow [@pop_now_jp](https://www.threads.net/@pop_now_jp)** for daily...` | NO | YES (`d9d9ce2`/`896eeba`/`642f5c8`) |
| Mid-paragraph inline | `Planning your anime pilgrimage? Follow [@pop_now_jp](...) for weekly...` | NO | YES (`f4ab3f5`, hand-edit) |

## 29 article list (stripped across cleanup commits)

### Batch 1/3 — first 10
1. anime-day-trips-from-tokyo-2026
2. anime-merch-shopping-guide-japan
3. anime-pilgrimage-spots-tokyo
4. animejapan-comiket-2026-guide
5. best-anime-tours-tokyo-2026
6. book-japan-anime-events-overseas-2026
7. chainsaw-man-pilgrimage-tokyo
8. cosplay-experience-tokyo-2026
9. demon-slayer-pilgrimage-tokyo
10. detective-conan-pilgrimage-events-2026

### Batch 2/3 — next 10
11. familymart-anime-collab-stores-2026
12. gaming-tokyo-2026
13. ghibli-park-complete-guide-2026
14. how-to-book-anime-collab-cafe-japan
15. ikebukuro-anime-guide-2026
16. japan-trip-checklist-anime-fans-2026
17. jr-pass-anime-pilgrimage-routes-2026
18. kyoto-anime-guide-2026
19. one-piece-tokyo-guide-2026
20. osaka-anime-collab-cafes-pop-culture-2026

### Batch 3/3 — remaining 8
21. osaka-anime-guide-den-den-town
22. ship-anime-figures-merch-home-japan
23. slam-dunk-kamakura-pilgrimage-2026
24. spy-family-tokyo-fan-day-2026
25. tokyo-anime-collab-cafes-summer-2026
26. tokyo-anime-district-guide
27. wonder-festival-figure-events-japan-2026
28. your-name-pilgrimage-tokyo

### Manual fix — 29th article (mid-paragraph variant)
29. jujutsu-kaisen-shibuya-locations-2026 (commit `f4ab3f5`) — rewrote sentence to reference the auto-injected CTA at article-end rather than duplicating the link inline

## Verification

```
grep -lE "Follow \[@pop_now_jp\]" content/articles/*.md content/articles/*.mdx | wc -l
  → 0

npm run validate
  → ✨ All articles pass validation!  (88/88)
```

## Component behavior unchanged

`components/ThreadsCTA.tsx` (committed in `db5779c`) is still auto-injected by `app/articles/[slug]/page.tsx:402`. Each article renders the CTA exactly once at article-end. The 29 inline duplicates are now removed from the indexable body HTML.

## Strip-script source-of-truth

`scripts/r14/strip-markdown-threads-cta.py` is the deterministic regen script for batched runs. Supports optional `start end` slice arguments.

## RULE compliance

- RULE B: this fix doc generated
- RULE C: external Critic Round 1 (this cleanup phase) pending — Task subagent invocation follows
- RULE H: 3 batched commits (10/10/8 articles) + 1 manual single-commit, all within RULE H's spec-allowed batch exception for boilerplate sweeps
- RULE I: no Klook regression; this strip only touches CTA-block paragraphs
- RULE M: ThreadsCTA component unchanged; only inline duplicates removed

## R14-cleanup duration

~25 min (script build + 4 strip commits + verify).
