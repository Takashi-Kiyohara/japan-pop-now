# Section 5 AdSense Readiness — R7 partial-cleanup update 2026-05-10 (v4)

**Sprint reference:** `docs/session-r7-partial-cleanup-20260510.md` (R7) + `docs/session-brutal-fix-20260510.md` (R6)
**Audit reference:** `docs/audit/full-corpus-audit-20260510.json` + `.md`
**Past AdSense rejections:** 2026-04-10, 2026-04-17 (both "low-value content")
**Supersedes:** the prior R6 v4 placeholder; treat this as the canonical post-R7 v4.

## TL;DR

R7 closed 5 of the 6 outstanding partial items from R6's brutal-fix critic
verdict (CI red fixed, 7 Why...Love residuals cleaned, /terms + /dmca shipped,
/about expanded to 1598 body words, klook MD-link state already 100%). The
single remaining out-of-session item is H17 em-dash density (60+ articles,
judgment-heavy) plus off-page gates (GSC indexed-URL count, GA4 organic
landings) that require external snapshots. AdSense pass-probability re-estimated
**70-77%**.

## Buckets closed (R7) — see `docs/session-r7-partial-cleanup-20260510.md`

- **R7-S1**: CI/CD Pipeline ESLint fix (CookieConsent setState-in-effect). Commit `d5a09ed`.
- **R7-S2**: 7 Why...Love residual instances cleaned across 7 files. Commit `fcffe04`.
- **R7-S3**: klook MD-link verification — 90/90 already compliant; no fix needed.
- **R7-S4**: /terms (1500+ words, 10 sections) + /dmca (800+ words, 7 sections) + footer wired. Commit `0b7d136`.
- **R7-S5**: /about expansion 327 → 1598 body words across 10 sections (mission, editorial principles, research methodology, image policy, affiliate disclosure, business inquiries, privacy, editorial team, coverage scope, reader feedback). Commit `0b7d136`.
- **R7-S6**: External Critic R7 — pending (background subagent in flight).

## HANDOFF Section-5 tree, populated with current data

| Gate | Value | Source |
|---|---|---|
| Bucket A-I content fixes all PASS | YES (87/87 PASS_ALL_10) | `full-corpus-audit-20260510.json` |
| AdSense gate active (belt-and-suspenders) | YES (NEXT_PUBLIC_ADSENSE_ENABLED + ID required) | `app/layout.tsx` |
| og-image exists | YES (`/og-image.png`, 17795 bytes) | `public/og-image.png` |
| AuthorBox renders on every article | YES | `app/articles/[slug]/page.tsx:406` |
| SSR cookie banner | YES (initial HTML carries DOM) | `components/CookieConsent.tsx` |
| Klook compliance ≥ 95% | YES (HTML 100% + MD 100%) | `tmp/klook-check.mjs`, `tmp/klook-md-check.mjs` |
| Slam-dunk slug normalized | YES (308 redirect) | `next.config.ts:302` |
| /terms page exists + ≥800 words | YES (10 sections, 1500+ words) | `app/terms/page.tsx` |
| /dmca page exists | YES (7 sections, 800+ words) | `app/dmca/page.tsx` |
| /about ≥1500 words | YES (1598 body words) | `app/about/page.tsx` |
| Why...Love H2/TOC residuals | 0 across active files | corpus grep |
| illustrative venue context residuals | 0 across active files | corpus grep |
| voice/series/template frontmatter | 0 active | corpus grep |
| Instagram URL residuals | 0 | corpus grep |
| CI/CD Pipeline green on HEAD | Expected GREEN (R7-S1 fix on `d5a09ed`) | `gh run list` |
| Independent Critic GREEN | R6 GREEN (with 1 residual now closed); R7 in flight | (background) |
| GSC indexed URLs ≥ 5 | TBD — needs `mcp__gsc__index_inspect` | external |
| GA4 organic ≥ 1/day × 7 days | TBD | external |
| `cwv-daily` workflow green | TBD next scheduled fire | external |

## AdSense pass-probability estimate

| Window | Estimate |
|---|---|
| Pre-2026-05-08 sprint | ~40-50% |
| Post-2026-05-08 sprint | 65-75% |
| Post-2026-05-09 R4 RED-fix (v2) | 75-82% |
| Post-2026-05-09 R5 structural (v3) | 80-85% |
| Post-2026-05-10 R6 brutal-fix | 65-72% |
| **Post-2026-05-10 R7 partial-cleanup (this v4)** | **70-77%** |

The R7 estimate climbs back from R6's 65-72% because:
- CI/CD Pipeline GREEN restores deploy-confidence trail
- 7 lingering Why...Love residuals removed (R6's regex was scoped to "Love" literal; R7 caught the "Going Crazy / treat as pilgrimage / Coming Out" variants and the 4 TOC/Q-form issues)
- /about now passes the AdSense reviewer threshold for "substantial about page" (1500+ words covering mission, sourcing, image policy, affiliate disclosure, privacy, editorial team)
- /terms + /dmca close standard reviewer-checklist items (legal pages exist, DMCA procedure documented with named contact email)

The estimate is intentionally conservative (not 80-85% as v3 claimed):
- H17 em-dash density (60+ articles) still a known template-detection risk
- Off-page gates remain unverified

## APPROVE / HOLD / REJECT

**Still HOLD-AND-MONITOR** for off-page indicators. The on-page residual risk
is now structurally closed except for em-dash density. GO conditions:

1. **External Critic R7** GREEN (in flight, 5-stage verify: CI, corpus grep, file existence, deployed URLs, audit re-run).
2. **H17 em-dash density** sweep complete (60+ articles, ≤5/k average).
3. **GSC indexed URLs ≥ 5**.
4. **GA4 organic ≥ 1/day × 7 days**.
5. **`cwv-daily` workflow** green on next scheduled fire.

If all five pass within next 7-10 day window, **APPROVE** for re-application.

## Owner / next checkpoint

- **Owner:** Takapon
- **Next checkpoint:** 2026-05-15 (1 week)
  - Re-run audit; confirm 87/87 + candidatesTotal 0 maintained.
  - Pull GSC indexed-URL snapshot.
  - Pull GA4 7-day organic-visit count.
  - H17 em-dash density sweep.
  - Re-evaluate AdSense GO / NO-GO based on the five signals.
