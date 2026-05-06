# Handoff — full remediation (cycles A → A2 → B' → D'-day0) — 2026-05-06

User-facing summary doc for Takapon's return on 2026-05-18 (or whenever the AdSense decision window opens).

## Where to start
Read this doc first. Then check:
1. `docs/audit/cycleD-day0-baseline-20260506.md` — readiness verdict from current state
2. `docs/audit/cycleB-originality-20260506.md` — JR Pass cluster decision needed
3. `docs/notify/cycleA2-A12-user-export.md` — your 15-minute manual exports

## TL;DR

**Site is healthy.** PRs #53 / #54 / #55 (P0 redirect emergency, 2026-05-06 morning) plus this remediation cycle (PRs #58 / #59 + direct-to-main docs) leave the codebase in a clean baseline.

**Adsense readiness: PARTIAL GO**. One real blocker (JR Pass cluster, your decision) + four unknowns (CWV / GSC indexed-count / GSC redirect-error count / GA4 traffic) waiting on either time-elapsed or your manual export.

## What changed across the 4 sessions

### Session 1 — P0 redirect emergency fix (PRs #53 + #54 + #55, sha 7ed444a / 0ef6cf1)
| Flow | Before | After |
|---|---|---|
| www + canonical /articles/{slug} | 0 hop | 0 hop |
| www + legacy + trailing | 2 hop | **1 hop** |
| www + /feed/ | 2 hop | **1 hop** |
| www + canonical + trailing | 1 hop | 1 hop |
| apex + legacy + trailing | 3 hop | **2 hop** (saved 1) |
| apex (any) | 2 hop | 2 hop (Vercel platform limitation) |
| /?paged=N | 200 | **410** + noindex |
| Article hreflang count | 4 | **2 (self-referential)** |

100% www-side ≤1 hop. Apex stays at 2 hops because Vercel platform 308 fires before next.config; resolves with the manual dashboard action below.

### Session 2 — Cycle A discovery (8/13 axes; 0 P0/P1/3 P2; Critic GREEN)
- Site state already clean post the P0 fix.
- 3 P2 documented (apex 2-hop, /author/takapon 404, /tags/anime — later reclassified as 404 not P2).

### Session 3 — Cycle A2 skipped-axes (3 ran, 2 deferred; 1 P1 + 5 P2; Critic GREEN iter 2)
- **A4** schema PASS (5/5 sample, structure-centralized).
- **A5** internal-link graph: 1 P1 — stale `slam-dunk-kamakura` links. Fixed in Cycle B'.
- **A7** E-E-A-T: AuthorBox auto-injected, advisory voice intentional, 11 articles with <3 external links (P2).
- **A9** CWV: BLOCKED (PageSpeed API quota); reschedule.
- **A12** GA4 traffic: BLOCKED (no service-account creds); user export needed.

### Session 4 — Cycle B' polish + originality (1 P1 fixed; 1 new P1; Critic GREEN)
- **P1-A5-1** stale links fixed: 3 links retargeted.
- **P1-B2-1 NEW**: 3 JR-Pass articles cluster cannibalization — needs your decision.
  - `japan-rail-pass-2026-guide`, `japan-rail-pass-guide-anime-fans`, `jr-pass-anime-pilgrimage-routes-2026`
  - Mutual cosine 0.61–0.71. Likely splits PageRank.
  - Options: merge / differentiate / keep — see `docs/audit/cycleB-summary-20260506.md`.

### Session 5 — Cycle D' Day 0 baseline (this session, partial cycle)
- Cycle D' as specified is a 3-day monitoring window. I delivered Day 0 baseline only — full cycle D' requires 24/48/72h elapsed time.

## Manual actions needed (~60 min total)

### A. Vercel apex 1-hop optimization (30 sec, optional)
Vercel dashboard → Project `japan-pop-now` → Domains → apex `japan-pop-now.com` → confirm 308 + (if available) disable auto-redirect so next.config `has:host` rules become reachable. Re-run `bash scripts/verify-redirect-chains.sh`; expectation is apex flows drop from 2 hops to 1.

### B. GSC URL Inspection re-submission (30–45 min)
List in `docs/notify/post-redirect-fix-resubmit-20260506.md` (5 priority articles + 5 hub pages).

### C. Day 1/2/3 GSC + GA4 exports (15 min × 3 days)
Procedure in `docs/notify/cycleA2-A12-user-export.md`.

Day 1 (2026-05-07), Day 2 (2026-05-08), Day 3 (2026-05-09):
- GSC: snapshot indexed/redirect-error/crawled-not-indexed/discovered-not-indexed counts → `analytics/gsc-coverage-{yyyymmdd}.txt`.
- Retry CWV via PageSpeed API (quota refreshes daily) on 5 URLs.

### D. JR Pass cluster decision (30 min)
Read `docs/audit/cycleB-originality-20260506.md` and `docs/audit/cycleB-summary-20260506.md`. Pick:
1. **Merge** — keep `japan-rail-pass-2026-guide`, 308 the other two via next.config.ts (matches existing cannibalization pattern).
2. **Differentiate** — rewrite intros + scope of each article so the angle is clearly distinct.
3. **Keep & accept** — let Google decide, accept SERP fragmentation.

Recommended: **option 2** for SEO + content-strategy balance.

### E. Cycle D' verdict (after Day 3)
Re-evaluate the Technical + Content GO checklists in `docs/audit/cycleD-day0-baseline-20260506.md` with the Day 3 GSC + CWV data.
- Both GO → apply AdSense (3rd attempt).
- Content still FAIL on JR Pass → defer applying until cluster handled.

## Files to consult

| File | Purpose |
|---|---|
| `docs/handoff-fullremediation-20260506.md` (this file) | start here |
| `docs/audit/cycleA-summary-20260506.md` | discovery audit, 8/13 axes |
| `docs/audit/cycleA2-summary-20260506.md` | skipped-axes re-attempt, A4/A5/A7 |
| `docs/audit/cycleA2-A5-graph-20260506.md` | link-graph audit output |
| `docs/audit/cycleB-summary-20260506.md` | polish results, JR Pass decision |
| `docs/audit/cycleB-originality-20260506.md` | TF-IDF cosine output |
| `docs/audit/cycleD-day0-baseline-20260506.md` | readiness verdict from current state |
| `docs/notify/post-redirect-fix-resubmit-20260506.md` | GSC re-submit URL list |
| `docs/notify/cycleA2-A12-user-export.md` | manual export procedure |
| `docs/session-redirect-emergency-20260506.md` | original P0 redirect-fix session report |
| `scripts/audit/internal-pagerank.ts` | re-runnable graph audit |
| `scripts/audit/originality-cosine.ts` | re-runnable cosine audit |
| `scripts/verify-redirect-chains.sh` | re-runnable chain trace asserter |

## Files in repo not touched
The whole `content_operations/` Cowork-managed staging pipeline is untouched. Cowork scheduled-tasks continue running; their output is a separate concern.

## Open backlog (after Day 3 / your return)

### Real
- **P1-B2-1**: JR Pass cluster decision (you).
- **P2-A7-1**: 11 articles with <3 external official-source links — add 1–2 each.
- **P2-A9-1**: CWV audit (rerun once API quota refreshes).
- **P2-A12-1**: GA4 traffic audit (your export).
- **P2-B3**: 20 evergreen articles with `lastUpdated` >30 days — quarterly freshness sweep.

### Optional / cosmetic
- **P3-B3**: 9 articles with frontmatter `lastUpdated` ahead of git last-commit date — confirm dates are honest.
- **P3-A4-1**: 2 article files carry UTF-8 BOM (production handles fine; cosmetic).
- **P3-A7-2**: Person `sameAs` has 2 entries — add `/about` for 3 (+10 min in `lib/author.ts`).
- **P3-Cycle-A**: `/author/takapon` returns 404 — optional `/author/[name]` page.

## Memory updated
- `reference_japan_pop_now_redirect_arch.md` (last session) — Vercel + Next.js layer ordering gotchas

The 4-cycle-prompt v3 protocol itself wasn't memory-saved; it's documented in this handoff for any return-session reference.
