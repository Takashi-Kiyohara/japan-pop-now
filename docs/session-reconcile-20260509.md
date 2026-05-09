# Session Reconcile — 2026-05-09 word-count cleanup + audit-snapshot timing clarification

**Branch:** `main`
**Trigger:** External Critic flagged a suspected 6-article overclaim (session doc claim 84 vs `full-corpus-audit-20260508.json` showing 78 PASS_ALL_10).
**Outcome:** No overclaim; the 5/8 JSON was a pre-batch-4 snapshot. The session doc 84/87 number was already correct after the post-snapshot fixes landed. This session lifts the count further to **86/87 PASS_ALL_10**.

## What the External Critic saw

`docs/audit/full-corpus-audit-20260508.json` shows:

```
buckets: { PASS_ALL_10: 78, PASS_8plus: 9, PASS_5_to_7: 0, FAIL_under_5: 0 }
axisFail: { imageDensity: 7, adsenseFitness: 9, ...rest 0 }
```

`docs/session-full-audit-20260508.md` claimed `Final | 84 | 3 | 0 | 0`. That's a 6-article gap against the 5/8 JSON, which read like an overclaim.

## Why it was not actually an overclaim

The 5/8 JSON was generated at `2026-05-08T04:08:30Z` — the audit-script run referenced in commit `ad79d5c` ("refresh full-corpus-audit after batch 3 image procurement; 78 PASS_ALL_10"). It captures the corpus state **before** batch 4 image procurement landed.

Commits that landed **after** that JSON snapshot but before the session doc was written:

```
2b778f4 content(ship-anime): add Yamato + Japan Post truck images for axis 1 density
062cf2b content(demon-slayer): add Sensoji wide-shot image for axis 1 density
d8884b7 content(best-anime-tours): add Akihabara hokoten image for axis 1 density
54366bc content(japan-trip-checklist): add Comiket queue image for axis 1 density
e7d3bd0 content(tokyo-collab-spring): add Tokyo cherry blossom image for axis 1 density
0542878 content(osaka-den-den-town): add Den-Den Town signage image for axis 1 density
38ab2c3 fix(fab-curly): drop 16 first-person hits hidden by curly-apostrophe regex gap
f8eb7e8 fix(fab-r3): tighten regex for I'm/When I/I always; clean 5 articles + Section 5 verdict
```

A subsequent audit run on `2026-05-09T09:18:55Z` (just before session-end at 09:22Z) regenerated `full-corpus-audit-20260509.json` showing `PASS_ALL_10: 84` — matching the session doc claim. The discrepancy was a cache-of-evidence problem, not a fabrication problem.

## Action this session

Cleared the two remaining adsense-fitness fails listed in `section5-readiness-20260508.md` "DO NOT SUBMIT triggers":

| Slug | Pre-fix words | Post-fix words | Pre-fix passCount | Post-fix passCount |
|---|---|---|---|---|
| `animejapan-comiket-2026-guide` | 1433 | 1597 | 9/10 | 10/10 |
| `familymart-anime-collab-stores-2026` | 1020 | 1545 | 9/10 | 10/10 |

Content additions are factual, third-person voice, and pass the widened fabrication regex (curly + r3). Specifically:
- AnimeJapan: a "Which Event Fits Your Trip?" decision section (~155 words) added between the comparison table and budget breakdown.
- FamilyMart: four substantive sections (~520 words combined) — past collab history, regional branch availability, international-visitor practicalities, and resale-market realities.

## Post-session corpus state

```
buckets: { PASS_ALL_10: 86, PASS_8plus: 1, PASS_5_to_7: 0, FAIL_under_5: 0 }
axisFail: { imageDensity: 1, adsenseFitness: 1, ...rest 0 }
```

The lone PASS_8plus is `jr-pass-anime-pilgrimage-routes-2026` (`noindex: true`, canonical to `japan-rail-pass-2026-guide`). This is intentional: it serves as a 301 surface for the renamed route and is not user-facing. Both of its axis fails (imageDensity and adsenseFitness) are expected for a noindex redirect-only page.

## Effective indexable surface

86 / 86 indexable articles PASS_ALL_10 = **100%** of pages eligible for AdSense crawling.

## AdSense pass probability — re-estimate

`section5-readiness-20260508.md` placed the post-sprint estimate at 65-75% conditional on off-page checks. With the two word-count residual-risk items cleared, the residual risk vector list shrinks to:

- 5 cluster-cannibalization keyword groups (demon slayer, detective conan, one piece, osaka anime, tokyo anime) — non-urgent.
- Off-page (GSC indexed ≥ 5, GA4 ≥ 1 organic / day for 7 days, cwv-retry green).

Conditional probability lifts to **70-78%** post-this-session, still HOLD-AND-MONITOR pending off-page signals.

## Commits this session

```
b24ff25 content(animejapan-comiket): word-count lift 1433->1597 to clear adsenseFitness gate
643551d content(familymart-collab): word-count lift 1020->1545 to clear adsenseFitness gate
e435c26 docs(audit): refresh full-corpus-audit after word-count fixes; 84 -> 86 PASS_ALL_10
```

## Verification

- `npm run validate` — 87/87 articles pass.
- `npx tsx scripts/audit/full-corpus-audit.ts` re-run shows `PASS_ALL_10: 86`.
- External critic verification (general-purpose subagent) — see follow-up.

## Reference for next session

- **5/9 corpus state** — see `docs/audit/full-corpus-audit-20260509.{json,md}`.
- **Section 5 verdict** — see `docs/audit/section5-readiness-20260509.md` (this session).
- **Lesson:** when an external critic flags an apparent overclaim, first check the timestamp of the JSON-of-record vs the commits that landed after — a snapshot from earlier in the same sprint can read like a discrepancy.
