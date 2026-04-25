---
title: "24h Indexing-Recovery Sprint — Status"
date: 2026-04-26
author: Takapon (via Claude Code)
sprint_started: 2026-04-26 02:50 JST
update_cadence: "every 4h or on milestone"
---

# 24h Autonomous Sprint — Indexing Recovery + Quality Compounding

## Phase 1 + Phase 2 (early) (T+0h..T+2h) — Audit + 2 PRs + 4 main commits

### Track 完了率 (T+2h)

| Track | 状態 | % | 備考 |
|---|---|---:|---|
| A1 sitemap diff | ✅ done | 100 | 0 stale / 0 missing — perfect parity |
| A2 Googlebot crawl | ✅ done | 100 | **CRITICAL**: /features/* 4 hub canonical → homepage（deindex 経路）→ PR #4 |
| A3 WP redirects | ✅ done | 100 | 2-hop chain x4（trailing-slash + middleware）→ Phase 3 で next.config redirects() hoist |
| A4 broken internal links | ✅ done | 100 | 186 host-inconsistency + 27 wp-uploads images + 1 feed.xml bug |
| B1 bulk URL rewrite | ✅ done | 100 | 174 refs / 27 files 変換、commit f83ccd4 |
| B2 sitemap fix | ⏸ N/A | — | A1 で perfect parity 確認、不要（noindex filter は PR #3 同梱） |
| B3 features canonical fix | ✅ PR open | 90 | PR #4（fix/canonical-hosts、B4 と同梱） |
| B4 feed.xml SITE_URL fix | ✅ PR open | 90 | PR #4 に同梱 |
| C1 daily indexing monitor | — pending | 0 | Phase 2 残 — scripts/check-indexing.ps1 + GitHub Actions |
| C2 anomaly issue auto-create | — pending | 0 | C1 の延長 |
| C3 weekly monitor template | — pending | 0 | docs/indexing/weekly-monitor-template.md |
| D GSC inspection queue | ✅ done | 100 | docs/indexing/gsc-inspection-queue-20260426.md（40 URLs、Tier 1/2/3） |
| E1 noindex wiring | ✅ PR open | 90 | PR #3（wiring + sitemap filter 同梱） |
| E2 dead-weight noindex apply | — blocked | 0 | E1 merge + GSC click 0/imp <10 検証が前提 |
| F1 Wikimedia round 5 | — pending | 0 | LOW_DENSITY 残 15 本、Phase 2/3 で push |
| F2 Top 20 AIO audit | — pending | 0 | structured data + image alt 整合 |
| F3 last-chance content briefs | — pending | 0 | cafe ending within 7 days 検出 |

### main 直 commits（清原さん action 不要、push 済）

| SHA | 説明 |
|---|---|
| 4e09272 | docs(indexing): Track A1-A4 audit reports |
| 297afae | docs(indexing): GSC URL Inspection queue (Track D) |
| f83ccd4 | content(seo): bulk rewrite 174 host-prefixed internal links (Track B1) |
| d407d25 | docs(sprint): 24h indexing-recovery status — Phase 1 |
| (this) | docs(sprint): Phase 2 early update — PR #4 + 2 PRs open |

### PR 待ち（清原さん review + merge 必要）

| PR | branch | 内容 | priority | URL |
|---|---|---|---|---|
| **#3** | `feat/noindex-deadweight` | E1 wiring: Article.robots + generateMetadata + sitemap filter | P0 | https://github.com/Takashi-Kiyohara/japan-pop-now/pull/3 |
| **#4** | `fix/canonical-hosts` | B3 + B4 同梱: features/* canonical homepage 誤継承 + feed.xml SITE_URL fallback drops www | **P0**（最優先 — deindex 進行中） | https://github.com/Takashi-Kiyohara/japan-pop-now/pull/4 |

### Indexing audit 主発見（重要度順）

1. **A2/B3 — `/features/*` 4 hub pages が homepage に canonicalize** ＝ Google にとって "これは homepage の重複 page" 認識 → 4 hubs が deindex される。site の骨格が壊れている可能性。今すぐ PR で fix。
2. **A4 — 186 host-inconsistency** = `https://japan-pop-now.com/...`（www 抜き）が MDX 全体に散在、内部リンク equity を 308 redirect でロス。Track B1 で 174 件解消、残 12 は images / unknown slugs（後続）。
3. **A4 — 27 wp-content/uploads images** = WP 移行で残った legacy 画像、403 で crawl budget 浪費。Wikimedia round 5 のターゲット（F1 で対処）。
4. **A3 — 5 redirect chains 2 hops** = `/foo/` → trailing-slash 308 → middleware redirect → 最終 URL の構造。次の sprint で `next.config.ts` の redirects() に hoist 可能。
5. **A1 — sitemap perfect parity** = 0 stale, 0 missing、77 articles すべて反映。E1 マージ後に noindex filter 機能で sitemap 整合性が更に upgrade される。

### Takapon 物理作業 list

1. **PR #3 review + merge**（E1 wiring、5 分）
2. **GSC URL Inspection 40 件投入**（`docs/indexing/gsc-inspection-queue-20260426.md` 参照、3-4 日 throttling 込み）
3. **GSC sitemap 再送信**（新しい sitemap が反映されたら、property → sitemap → 「再送信」）
4. **PR #features-canonical review + merge**（B3、5 分） — 最優先、deindex 進行を止める
5. **PR #feed-xml-canonical review + merge**（B4、5 分）

### 24h で解決できなかった item（Phase 1 終時点では unknown）

未着手 tracks（C1/C2/C3、F1/F2/F3、E2）は Phase 2 以降で消化。現在の T+1h 時点では正常進捗。

### Next Code prompt 推奨（user 朝チェック時）

(a) PR 全 review + merge → "merge done" を chat に返信  
(b) GSC inspection 40 件投入の進捗報告  
(c) Phase 2 起動：「Phase 1 audit + B/D sprint 完了確認、C/F sprint 走らせて」

## Phase 2 (T+1h..T+8h) — TBD

予定:
- B3 PR (features canonical fix)
- B4 PR (feed.xml fix)
- C1 monitoring script (PR)
- C2 GitHub Actions (PR)
- F1 Wikimedia round 5（残 LOW_DENSITY 15 本のうち near-miss を更に push）
- F2 Top 20 AIO audit

## Phase 3 (T+8h..T+16h) — TBD

- F3 cafe last-chance briefs
- E2 dead-weight noindex apply（E1 merge 待ち）

## Phase 4 (T+16h..T+24h) — TBD

- 全 track 整理 + 最終 24h report
- next sprint プロンプト推奨
