---
title: "Pre-Flight Verification before GSC Sitemap Re-Submission (2026-04-26)"
date: 2026-04-26
author: Takapon (via Claude Code)
purpose: 8-item audit ensuring PR #3/#4 deploy didn't break canonical/robots/sitemap signals; gate before re-submitting sitemap to GSC
result_status: 7/8 PASS, 1 FAIL — fix in PR #6
sitemap_resubmit: NO-GO until PR #6 merges + Vercel re-deploy + verification curl
---

# Pre-Flight Verification — 2026-04-26

## TL;DR

**Status: 7/8 PASS, 1 FAIL → SITEMAP 再送信 NO-GO（PR #6 merge 後 re-run）**

| # | Item | Verdict | Notes |
|---:|---|---|---|
| 1 | features/* hubs canonical (4/4) | ✅ PASS | All 4 self-canonical, single-suffix titles. PR #4 confirmed live. |
| 2 | sitemap.xml content audit (99/99) | ✅ PASS | 99 actual = 99 expected. 0 legacy WP patterns. All canonical host. |
| 3 | encoding mojibake | ✅ PASS | Em-dash U+2014 properly UTF-8 encoded (14 hits in /features/collab-cafe-guide). 0 `??` source bugs. 0 U+FFFD replacement chars. |
| **4** | **PR #3 noindex 誤爆 audit** | ❌ **FAIL** | `/contact` is in sitemap.xml AND emits `<meta name="robots" content="noindex, follow">`. Sitemap × meta-tag contradiction. **Fix: PR #6.** Article-side check vacuously passes (0 frontmatters with robots: noindex). |
| 5 | /articles/* canonical (10 sample) | ✅ PASS | 10/10 self-canonical (May/April/March 2026 cohort spread). |
| 6 | Vercel env var | ✅ PASS | GH secrets empty (workflow uses default GITHUB_TOKEN). PR #4 deployed (production HTML confirms canonical fix live). Residual: `scripts/ping-search-engines.ts:77` still has old fallback (non-production utility, deferred). |
| 7 | Phase 2 sprint status | ✅ PASS | 14 main commits + 2 PRs merged (#3, #4), 1 PR open (#5). 0 failing tasks affecting AdSense/indexing. |
| 8 | Redirect chain trace (30 URLs) | ✅ PASS | 0 chains >2 hops, 0 5xx, 0 host mismatches. 11 OK 1-hop + 8 OK 410. Advisory: 11 wp-content paths return 403 (terminal but less ideal than 410). |

---

## Item 4 — Root cause + fix path

### What broke
PR #3 (E1 noindex wiring) added a sitemap filter for **articles** with `robots: noindex` frontmatter. It did NOT extend to **static routes** that emit `noindex` via their page-level metadata.

`/contact` was always `noindex` (intentionally — boilerplate utility per `app/contact/page.tsx:13-16`) but stayed listed in `staticPages` of `app/sitemap.ts`. Pre-PR #3 this just looked redundant. Post-PR #3 it became inconsistent with the article-branch contract.

### Fix shape (PR #6 — `fix/preflight-sitemap-static-noindex`)
```diff
// app/sitemap.ts
- {
-   url: `${baseUrl}/contact`,
-   changeFrequency: 'monthly',
-   priority: 0.4,
-   lastModified: new Date('2026-04-10'),
- },
+ // /contact intentionally excluded — robots=noindex per
+ // app/contact/page.tsx (boilerplate utility).
```

Plus advisory carry-over: `+/cafes` (real hub indexable but missing).
Plus comment for `/menu` exclusion (thin nav aid; keep out of sitemap).

PR: https://github.com/Takashi-Kiyohara/japan-pop-now/pull/6

### Why minimal scope
- Touches `app/sitemap.ts` only (1 file, +11 −6).
- No core behavior change beyond filtering; no API or component impact.
- `npx tsc --noEmit` clean.

---

## Item 2 advisory carry-over (already absorbed into PR #6)

The sitemap+redirects auditor surfaced two non-blocking advisories:
- `/cafes` is a real hub (carries campaign data) but missing from sitemap → **fixed in PR #6** (added with `priority: 0.9`).
- `/menu` is indexable but thin nav aid → **deliberately excluded** with comment in PR #6 explaining the editorial decision.

## Item 8 advisory (deferred to Phase 3)

11 `wp-content/uploads/*` paths return 403 (terminal, not chain-extending), but 410 Gone is the stronger removal signal. Optional improvement: `next.config.ts redirects()` rule for `wp-content/uploads/:path*` → 410. Not blocking; queued as Phase 3 task.

## Item 6 advisory (deferred to Phase 3)

`scripts/ping-search-engines.ts:77` still has fallback `'https://japan-pop-now.com'` (no www). This is the local/CI utility script; not a production runtime path. Easy fix in next sprint.

---

## Sub-reports referenced

- `docs/indexing/preflight-canonical-robots-20260426.md` — items 1, 4, 5 detail (4 features hubs / 10 articles / top 30 sitemap URLs)
- `docs/indexing/preflight-sitemap-redirects-20260426.md` — items 2, 8 detail (sitemap entry diff, 30 redirect chain traces)

---

## 修正必要 PR list

| PR | branch | 状態 | 内容 | 影響 |
|---|---|---|---|---|
| **#6** | `fix/preflight-sitemap-static-noindex` | OPEN — review待ち | sitemap から /contact 除外 + /cafes 追加 | Item 4 FAIL → PASS の唯一の経路 |
| (none) | — | — | Item 8 advisory (wp-uploads 410) は Phase 3 | non-blocking |
| (none) | — | — | Item 6 advisory (ping-search fallback) は Phase 3 | non-blocking |

---

## sitemap 再送信タイミング推奨

| 条件 | 結論 | 推奨タイミング |
|---|---|---|
| 現状（PR #6 unmerged） | **NO-GO** | submit しない — sitemap に /contact が残ったまま GSC が再 inspect すると "noindex marked" anomaly が +1 |
| PR #6 merge + Vercel deploy 反映 + curl で /contact 不在 + /cafes 存在を確認 | **GO** | merge から ~5 分後（Vercel deploy 通常時間）以降、いつでも |
| PR #5 (indexing-monitor) も merge 済 | **GO with monitoring** | sitemap 再送信後、daily 06:00 UTC で自動 health check が走る |

## 完了 verification（PR #6 merge 後の手順）

1. `git pull origin main` で merge 取り込み
2. Vercel deploy 反映を確認 — production `https://www.japan-pop-now.com/sitemap.xml` を curl
3. `/contact` URL が **不在** であることを確認 (`grep -c "/contact" sitemap.xml` = 0)
4. `/cafes` URL が **存在** であることを確認 (`grep -c "/cafes" sitemap.xml` >= 1)
5. その後 GSC → Sitemaps → 「サイトマップを送信」または「再送信」

**SITEMAP 再送信 NO-GO（PR #6 merge 後 re-run）**
