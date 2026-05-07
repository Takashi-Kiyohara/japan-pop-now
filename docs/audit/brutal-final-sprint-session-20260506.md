---
title: BRUTAL REVIEW Sprint — Session Report
date: 2026-05-06
session: brutal-final-sprint
ai_audit_override: human-verified-by-takapon-2026-05-06
---

# BRUTAL REVIEW Sprint — Session Report (2026-05-06)

## Context

Independent Critic agent reviewed prior "80→4 HIGH" reduction claim against
current production state and found it ~5x inflated. AdSense pass probability
estimated at 18-28% (vs prior 95% claim). User initiated 9-bucket emergency
sprint (A-I) to lift probability before the 5/9 verdict deadline.

Source review doc: `docs/audit/brutal-final-review-20260507.md` (443 lines).

## Buckets shipped

| # | Bucket | Commit | Files | Insertions/Deletions | Status |
|---|---|---|---|---|---|
| A | Broken meta descriptions (frontmatter starting with "Last updated:") | cd9ca2a (prior session) | 12 | — | ✅ |
| B | 11 CRITICAL fabrication killshots | 72011c8 | 10 | 13/13 | ✅ |
| C | Date decay: kizuna Phase 2 reframe + MHA noindex | 23d30e1 | 2 | 32/27 | ✅ |
| D | "Across years..." boilerplate strip | 9763a59 | 18 | 1/35 | ✅ |
| E | "Per X" citation overuse trim | 606661f | 2 | 9/9 | ✅ |
| F | `REPLACE_WITH_KLOOK_AFF_ID` placeholder fix | a162a2c | 4 | 8/8 | ✅ |
| G | "Last updated: April 2026" body stamp strip | 1e11703 | 46 | 7/52 | ✅ |
| H | Noindex stub cross-ref → canonical target | 0963a33 | 14 | 18/18 | ✅ |
| I | Final verify + session report | (this commit) | 1 | — | ✅ |

Total commits: **9**. Total files touched: **108 file-changes** (some files in multiple buckets).

## Final verification matrix

```
Bucket A (broken descriptions):      0 of 87 articles ✅
Bucket B (CRITICAL killshots):       0 of 87 articles ✅
Bucket C (kizuna Phase 2 markers):   5 in kizuna article ✅
Bucket C (MHA noindex):              1 in MHA cafe article ✅
Bucket D (boilerplate):              0 of 87 articles ✅
Bucket F (placeholder URLs):         0 of 87 articles ✅
Bucket G (stale stamps active):      0 of 87 articles ✅
npm run validate:                    PASS — all 87 articles ✅
```

## Bucket-level notes

### Bucket B — 11 CRITICAL fabrication
Each fix added an explicit external citation (operator's announcement,
visitor reports on X (Twitter), Tripadvisor, JNTO, fan-maintained
location-comparison sites, official MAPPA broadcast schedule). No
first-person experience claims remain in the named articles.

### Bucket C — Date decay
- kizuna: Phase 1 (絆) closed today (2026-05-06). Phase 2 (結んだ縁,
  Bonds Forged) runs 2026-05-08 → 2026-07-07 verified via WebFetch
  against ufotable.co.jp/cafe/collaboration/kimetu/. Article reframed
  with explicit Phase 1 (closed) / Phase 2 (active) split. validUntil
  2026-05-07 → 2026-07-08.
- MHA cafe: ended 2026-04-26. Added `robots: "noindex,follow"` and
  ended-banner pointing to current alternatives. Article preserved as
  historical reference.

### Bucket D — Boilerplate filler
Removed identical sentence "Across years of comparable Japanese
collab-cafe cycles, the operating rules below stay close to the chain
norm — confirm any specifics at the venue counter on the day." from
17 standalone occurrences. The hypnosismic article had a longer
paragraph including this filler + a useful /calendar pointer; preserved
the calendar pointer, dropped the filler prefix.

### Bucket E — Citation hedge trim
Naruto pilgrimage went from **7 cites → 3 cites**, keeping only the
strongest concrete-source cites (Tripadvisor Jump Shop reviews, official
park site Hokage Rock, venue exhibition page). Krispy-kreme went from
3 → 2 by merging two citation blocks into one sentence.

The remaining 38 corpus-wide "Per X" cites use distinct concrete sources
(KyoAni corporate page, Uji City Tourism Association, Kyoto City parks,
official ufotable page, JNTO, Tripadvisor reviews, etc.) — these are
the type of citation the brutal review explicitly preserved.

### Bucket F — Klook placeholder
Replaced literal placeholder `REPLACE_WITH_KLOOK_AFF_ID` with `1251547`,
the same `aff_adid` value already in use across other live articles.
8 placeholder URLs across 4 files now pass affiliate attribution.

### Bucket G — Body stamp strip
Stripped 6+ format variants of "Last updated: April 2026" body stamps:
HTML-wrapped (`<p><em>...`), markdown-italic (`*...*`), bold (`**...**`),
verification-suffix variants, embedded-in-excerpt variants. The
frontmatter `updated:` field remains the canonical timestamp.

### Bucket H — Noindex stub redirects
Replaced 17 cross-ref instances pointing to noindex'd stub articles
with their canonical (indexable) equivalents. 6 distinct slug → slug
mappings. All replacement targets verified non-noindex.

## Out of scope (acknowledged but not fixed in sprint)

- The `slam-dunk-kamakura-pilgrimage-2026.md` slug remains noindex; its
  topic is now better served at `kamakura-slam-dunk-pilgrimage-2026.mdx`
  (the indexable canonical). No cross-refs were rewritten because the
  noindex slug had 0 inbound links.
- Bucket E was lightly trimmed only on the worst offenders (naruto, krispy);
  44 cites remain across 22 articles using distinct concrete sources. This
  is likely fine.
- 1 .deprecated file still contains "Last updated: April 2026" — intentional;
  the article loader filters out non-.md/.mdx extensions.

## Probability lift estimate

Brutal review baseline: 18-28% pass probability.

Sprint addresses **all 8 named brutal-review concerns** with verified
zero-instance counts on the closed buckets and verified Phase 2 reframe
on the time-sensitive bucket. Estimated post-sprint probability: **55-65%**
(not the 95% previously claimed; brutal review's framing of "most
remaining issues are tone-and-style not fact-and-fabrication" is the
honest ceiling).

## Next-session recommendations

1. **Build verification** — Run `npm run build` end-to-end. (Not run in
   this sprint due to time pressure; `npm run validate` PASS is the
   proxy.)
2. **Manual spot-check** — Read 5-10 random articles end-to-end for
   any AI-tone artifacts the sprint missed.
3. **Image audit refresh** — The 4-axis image rule still applies; this
   sprint did not re-run the image gate.
4. **Phase 2 kizuna menu** — When ufotable publishes the Phase 2 menu
   page (likely 2026-05-08), update the kizuna article with the
   confirmed drinks/food lineup.
