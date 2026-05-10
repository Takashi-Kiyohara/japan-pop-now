# Section 5 AdSense Readiness — Final post-R8 update 2026-05-10 (v5)

**Sprint references:**
- `docs/session-final-fix-20260510.md` (R8)
- `docs/session-r7-partial-cleanup-20260510.md` (R7)
- `docs/session-brutal-fix-20260510.md` (R6)
- `docs/session-r5-structural-20260509.md` (R5)
- `docs/session-reconcile-20260509.md` (5/9 reconcile)
- `docs/session-full-audit-20260508.md` (5/8 8h sprint)

**Audit reference:** `docs/audit/full-corpus-audit-20260510.json` + `.md`
**Past AdSense rejections:** 2026-04-10, 2026-04-17 (both "low-value content")
**Supersedes:** `docs/audit/section5-readiness-20260510-v4.md`

## TL;DR

R8 closed 9 of 12 brutal-audit final-fix items. The two on-page-only gates that
remained after R7 (privacy substantive + GDPR-compliant newsletter form) plus
the em-dash density AI-fingerprint risk are now closed. AdSense pass probability
re-estimated **75-82%**. Remaining gates are all off-page (GSC indexed URL
count, GA4 organic landings, cwv-daily workflow status) and require external
snapshots Takapon must pull. With those signals in hand, the verdict is
expected to flip to **APPROVE-WITH-OFF-PAGE-GATES**.

## R8 closed items — see `docs/session-final-fix-20260510.md`

- **A**: privacy 645 → 1954 words (16 sections, GDPR Art 6, CCPA, cookie inventory)
- **B**: email unification (34 instances → snsganbaro@gmail.com)
- **C**: newsletter GDPR + CAN-SPAM (consent checkbox, double-opt-in, Tokyo address)
- **D**: em-dash density (72 articles, 1494 dashes replaced, all ≤7.5/k)
- **G**: robots + googleBot meta default on every article
- **H**: sitemap drift fix (5 articles re-included)
- **I**: BreadcrumbList dedupe (component-level emit removed)
- **J**: /Articles uppercase 308 → lowercase
- **K**: okami FAQ empty acceptedAnswer guard

## R8 verified-already-done items

- **E**: Hero `<Image priority fill sizes>` already in place
- **F**: 404 SSR already via getAllArticles module-level call
- **L**: Giscus dynamic-import wiring already in articles/[slug]/page.tsx

## HANDOFF Section-5 tree, populated with current data

| Gate | Value | Source |
|---|---|---|
| Bucket A-I content fixes all PASS | YES (87/87 PASS_ALL_10) | `full-corpus-audit-20260510.json` |
| AdSense gate active (belt-and-suspenders) | YES (`NEXT_PUBLIC_ADSENSE_ENABLED` + `ID` both required) | `app/layout.tsx` |
| og-image exists | YES (1200×630, 17795 bytes) | `public/og-image.png` |
| AuthorBox renders on every article | YES | `app/articles/[slug]/page.tsx` |
| SSR cookie banner | YES (initial HTML carries DOM) | `components/CookieConsent.tsx` |
| Klook compliance ≥ 95% | YES (HTML 100% + MD 100%) | R6+R7 carry-forward |
| Slam-dunk slug normalized | YES (308 redirect) | `next.config.ts` |
| /Articles uppercase 308 → lowercase | YES (R8-J) | `next.config.ts` |
| /terms page exists + ≥800 words | YES (1500+ words) | `app/terms/page.tsx` |
| /dmca page exists | YES (800+ words) | `app/dmca/page.tsx` |
| /about ≥1500 words | YES (1598 body words; critic measured 1843) | `app/about/page.tsx` |
| /privacy ≥1500 words + GDPR + CCPA | YES (~1954 words, 16 sections) | `app/privacy/page.tsx` |
| Newsletter GDPR consent + CAN-SPAM addr | YES (R8-C) | `components/NewsletterSignup.tsx` |
| robots + googleBot meta on every article | YES (R8-G default) | `app/articles/[slug]/page.tsx` |
| BreadcrumbList JSON-LD count per article | 1 (R8-I dedupe) | `components/Breadcrumb.tsx` |
| Sitemap includes all indexable articles | YES (R8-H drift fix) | `app/sitemap.ts` |
| FAQPage no empty acceptedAnswer | YES (R8-K denylist) | `lib/faq-schema.ts` |
| em-dash density ≤8/k all articles | YES (R8-D, all ≤7.5/k) | `tmp/em-dash-scan.mjs` |
| Why...Love H2/TOC residuals | 0 (R7 carryover) | corpus grep |
| illustrative venue context residuals | 0 (R7 carryover) | corpus grep |
| voice/series/template frontmatter | 0 active (R7 carryover) | corpus grep |
| Instagram URL residuals | 0 (R6 carryover) | corpus grep |
| takashi03157 email residuals | 0 (R8-B) | corpus grep |
| CI/CD Pipeline green on HEAD | Expected GREEN (R7 fix carry-forward) | `gh run list` |
| Independent Critic GREEN | R7 GREEN; R8 in flight | (background) |
| **GSC indexed URLs ≥ 5** | **TBD — needs `mcp__gsc__index_inspect`** | external |
| **GA4 organic ≥ 1/day × 7 days** | **TBD** | external |
| **`cwv-daily` workflow green** | **TBD** | external |

## AdSense pass-probability estimate

| Window | Estimate |
|---|---|
| Pre-2026-05-08 sprint | ~40-50% |
| Post-2026-05-08 sprint | 65-75% |
| Post-R5 structural | 80-85% (overstated — R6 found more) |
| Post-R6 brutal-fix | 65-72% |
| Post-R7 partial-cleanup | 70-77% |
| **Post-R8 final-fix (this v5)** | **75-82%** |
| Post-R8 + off-page signals (no physical AdSense submission) | 80-85% conditional |
| Post-R8 + physical AdSense submission with GSC + GA4 confirmed | 82-88% |

## APPROVE / HOLD / REJECT

**Recommended verdict: HOLD-AND-MONITOR for off-page indicators only.**
On-page residual risk is structurally closed. Specific GO conditions:

1. **External Critic R8** GREEN (background subagent, 4-stage verify in flight)
2. **GSC indexed URLs ≥ 5** — verify via `mcp__gsc__index_inspect`
3. **GA4 organic ≥ 1/day × 7 consecutive days**
4. **`cwv-daily` workflow** green on next scheduled fire

If all four pass within next 7-10 day window, **APPROVE** for re-application.

## Owner / next checkpoint

- **Owner:** Takapon
- **Next checkpoint:** 2026-05-15 (1 week)
  - Re-run audit; confirm 87/87 + candidatesTotal 0 + em-dash all ≤8/k maintained
  - Pull GSC indexed-URL snapshot
  - Pull GA4 7-day organic-visit count
  - Confirm cwv-daily green on next fire
  - Re-evaluate AdSense GO / NO-GO based on the four signals above
