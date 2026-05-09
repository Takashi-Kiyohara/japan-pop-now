# Section 5 AdSense Readiness — Update 2026-05-09

**Sprint reference:** `docs/session-reconcile-20260509.md`
**Audit reference:** `docs/audit/full-corpus-audit-20260509.json` + `.md`
**Past AdSense rejections:** 2026-04-10, 2026-04-17 (both "low-value content")
**Supersedes:** `docs/audit/section5-readiness-20260508.md`

## TL;DR

**Recommended verdict:** still **HOLD-AND-MONITOR**, but the on-page residual risk
is now zero. Word-count expansions on `animejapan-comiket-2026-guide` and
`familymart-anime-collab-stores-2026` cleared the last adsense-fitness gate.
PASS_ALL_10 86 / 87 — the lone exception is the intentionally noindex
redirect surface `jr-pass-anime-pilgrimage-routes-2026`.

Off-page signals (GSC ≥ 5 indexed, GA4 ≥ 1 organic / day × 7 days, cwv-daily
green) remain the gating items before re-application.

## HANDOFF Section-5 tree, populated with current data

| Gate | Value | Source |
|---|---|---|
| Bucket A-I content fixes all PASS | YES (86/87 PASS_ALL_10, 0 in any failing bucket; remaining 1 is noindex) | `full-corpus-audit-20260509.json` |
| Independent Critic GREEN | R1 GREEN, R2 GREEN, R3 APPROVE-WITH-CONDITIONS, R4 (this session) pending | `session-reconcile-20260509.md` |
| GSC registered URLs ≥ 5 | TBD — needs `mcp__gsc__list_sitemaps` + `index_inspect` snapshot | external |
| Impressions = 0/day for 7 consecutive days | TBD — needs GSC search-analytics 7-day window | external |
| Redirect errors > 5 | NO — `internal-link-graph-20260509` reports 0 broken / 0 noindex refs | last sprint |
| 4xx surface > 0 | TBD — re-run `redirect-chain-full-trace.sh` against `sitemap.xml` | external |
| Meta description broken > 0 | NO — `metaDesc` axis fail = 0 across all 87 | `full-corpus-audit-20260509.json` |
| Adsense-fitness on indexable surface | 100% (86 / 86 indexable; the 1 fail is the noindex redirect surface) | `full-corpus-audit-20260509.json` |

## AdSense pass probability estimate

| Window | Estimate |
|---|---|
| Pre-2026-05-08 sprint | ~40-50% |
| Post-2026-05-08 sprint | 65-75% (per `section5-readiness-20260508.md`) |
| **Post-2026-05-09 word-count fixes** | **70-78%** |

Lift drivers since 5/8:
- adsense-fitness axis: 3 fails → 1 fail (the lone fail is the noindex redirect surface).
- DO-NOT-SUBMIT trigger 1 cleared (`animejapan-comiket-2026-guide` 1433 → 1597 words).
- DO-NOT-SUBMIT trigger 2 cleared (`familymart-anime-collab-stores-2026` 1020 → 1545 words).

## APPROVE / HOLD / REJECT

**Still HOLD-AND-MONITOR** for off-page indicators. Specifically:
- Run `mcp__gsc__list_sitemaps` + `index_inspect` on the live sitemap; require ≥ 5 indexed URLs visible to Google before re-applying.
- Confirm GA4 records ≥ 1 organic landing per day for 7 consecutive days.
- Confirm `cwv-daily` workflow runs green on its next scheduled fire (the guard fix from the 5/8 sprint should remove the phantom-push failure mode; the rename to `cwv-daily.yml` in commit `7749d48` refreshed the GH registration).

If all three pass within the next 7-10 day window, **APPROVE** for re-application with a fresh AdSense submission.

## Residual risk

- 5 cluster-cannibalization keyword groups (demon slayer, detective conan, one piece, osaka anime, tokyo anime). None are urgent reduce-now candidates, but a canonical-consolidation review before re-submission would remove an off-page risk vector.
- The `jr-pass-anime-pilgrimage-routes-2026` redirect surface should eventually be retired (.deprecated rename) once GSC stops reporting hits to its old URL — at that point the 1 PASS_8plus drops out and the corpus reads 86/86 = 100%.

## Owner / next checkpoint

- **Owner:** Takapon
- **Next checkpoint:** 2026-05-15 (1 week)
  - Re-run `npx tsx scripts/audit/full-corpus-audit.ts` to confirm no regressions.
  - Pull GSC indexed-URL snapshot via `mcp__gsc__index_inspect`.
  - Pull GA4 7-day organic-visit count.
  - Re-evaluate AdSense GO / NO-GO based on the three signals.
