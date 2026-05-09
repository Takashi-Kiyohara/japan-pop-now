# Section 5 AdSense Readiness — Re-evaluation 2026-05-08

**Sprint reference:** `docs/session-full-audit-20260508.md`
**Audit reference:** `docs/audit/full-corpus-audit-20260509.json` + `.md`
**Past AdSense rejections:** 2026-04-10, 2026-04-17 (both "low-value content")

## TL;DR

**Recommended verdict:** **HOLD-AND-MONITOR** for one further data window
(GSC indexed-URL count + GA4 organic-visit count) before re-applying. Content
quality has been lifted from 14/87 → 84/87 PASS_ALL_10 across 10 axes, but the
"low-value content" rejection signal is partly off-page (indexing density,
backlink shape, GA-side engagement). Body-of-work is materially stronger than
at either prior rejection; AdSense council still appears to weight surfaceable
quality + traffic shape together.

## HANDOFF Section-5 tree, populated with current data

| Gate | Value | Source |
|---|---|---|
| Bucket A-I content fixes all PASS | YES (84/87 PASS_ALL_10, 0 in any failing bucket) | `full-corpus-audit-20260509.json` |
| Independent Critic GREEN | Round 1 GREEN; Round 2 expected GREEN (in flight); Round 3 pending | This sprint |
| GSC registered URLs ≥ 5 | TBD — needs `mcp__gsc__list_sitemaps` + `index_inspect` snapshot | external |
| Impressions = 0/day for 7 consecutive days | TBD — needs GSC search-analytics 7-day window | external |
| Redirect errors > 5 | NO — `internal-link-graph-20260508` reports 0 broken / 0 noindex refs | this sprint |
| 4xx surface > 0 | TBD — re-run `redirect-chain-full-trace.sh` against `sitemap.xml` | external |
| Meta description broken > 0 | NO — `metaDesc` axis fail = 0 across all 87 | `full-corpus-audit-20260509.json` |

## AdSense pass probability estimate

**Pre-sprint baseline (audit script first run, 2026-05-08 morning):** ~40-50%
(carried over from `session-yellow-to-green-20260507.md`).

**Post-sprint estimate:** **65-75%** conditional on the off-page checks
passing. Lift drivers:

- imageDensity axis: 24 fails → 1 fail (the lone fail is `jr-pass-anime-pilgrimage-routes-2026`, a noindex-with-canonical page; cumulative 46 new Wikimedia images across 17 articles).
- fabrication axis: 4 fails (ASCII regex) → 0 fails (after curly-apostrophe regex fix surfaced 9 hidden articles + 16 hits, all rewritten).
- title axis: 36 fails → 0 fails (every title now ≤60 chars, primary keyword + year preserved).
- internal-link health: 1 orphan + 9 noindex refs → 0 + 0.
- freshness axis: false-positive boilerplate detection re-tuned — no remaining "as of November 2024" / "Last updated: 202[0-4]" / "in 2024 currently" patterns.
- adsense-fitness composite: 73 fails → 3 fails (2 of 3 are word-count gate, 1 is noindex).

If the off-page checks (GSC indexed >= 5, GA organic visits > 0) pass, push to
75-80% conditional on the body-of-work signal weighting. If GSC stays at 0
indexed URLs after a 7-day window, drop to 50%.

## APPROVE / HOLD / REJECT

**HOLD-AND-MONITOR** for the off-page indicators. Specifically:
- Run `mcp__gsc__list_sitemaps` + `index_inspect` on the live sitemap; require
  ≥ 5 indexed URLs visible to Google before re-applying.
- Confirm GA4 records ≥ 1 organic landing per day for 7 consecutive days.
- Confirm `cwv-retry` workflow runs green on its next scheduled fire (the guard
  fix from this sprint should remove the phantom-push failure mode).

If all three pass within the next 7-10 day window, **APPROVE** for re-application
with a fresh AdSense submission.

## DO NOT SUBMIT triggers (residual risk)

- `animejapan-comiket-2026-guide` (1425 words) and
  `familymart-anime-collab-stores-2026` (1020 words) currently miss the
  `word_count >= 1500` adsense-fitness gate. AdSense council does not enforce
  a strict minimum, but ≥ 1,500 word average across the indexed surface is a
  signal to honor. Recommend a +200-word expansion sweep on those two before
  any re-submission, OR a noindex flag if the topic is too niche to expand.
- 5 cluster-cannibalization keyword groups remain (demon slayer, detective
  conan, one piece, osaka anime, tokyo anime). None are urgent reduce-now
  candidates, but a canonical-consolidation review before re-submission would
  remove an off-page risk vector.

## Owner / next checkpoint

- **Owner:** Takapon
- **Next checkpoint:** 2026-05-15 (1 week)
  - Re-run `npx tsx scripts/audit/full-corpus-audit.ts` to confirm no
    regressions.
  - Pull GSC indexed-URL snapshot.
  - Pull GA4 7-day organic-visit count.
  - Re-evaluate AdSense GO / NO-GO based on the three signals.
