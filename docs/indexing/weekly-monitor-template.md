---
title: "Weekly Indexing Monitor — Manual Checklist"
purpose: "Track C3 — human-in-the-loop checklist for weekly indexing health review beyond what the daily automated monitor catches"
cadence: "every Monday morning, 10 min"
---

# Weekly Indexing Monitor — Manual Checklist

The daily automation (`scripts/check-indexing.ps1` + `.github/workflows/indexing-monitor.yml`) catches anomalies on the 40 monitored URLs. This weekly checklist covers signals the daily monitor cannot see.

Copy this template into a new file each week named `docs/indexing/weekly-YYYYMMDD.md` (Monday's date) and fill it in.

---

## Week of YYYY-MM-DD

### 1. GSC Coverage delta

Open Google Search Console → property `https://www.japan-pop-now.com/` → インデックス登録 → カバレッジ.

| Metric | This week | Last week | Δ | OK? |
|---|---:|---:|---:|---|
| 登録済み URL 数 | | | | |
| 検出 - インデックス未登録 | | | | |
| クロール済み - インデックス未登録 | | | | |
| 重複ページ (canonical 不一致) | | | | |
| エラー (4xx / 5xx) | | | | |

**Investigate** if:
- 登録済み URL 数 が前週比 −5 以上 (deindexing 発生中)
- 重複 canonical not user-selected が増加 (canonical bug の可能性)
- 4xx / 5xx エラーに新しい URL pattern が登場 (deploy 回帰)

### 2. GSC Search Performance delta

GSC → 検索パフォーマンス → 過去 28 日 vs 同期間前週.

| Metric | This week (28d) | Prior 28d | Δ | OK? |
|---|---:|---:|---:|---|
| Clicks | | | | |
| Impressions | | | | |
| 平均 CTR | | | | |
| 平均掲載順位 | | | | |

**Investigate** if:
- Clicks 前週比 −20% 以上 (algorithm update or indexing 影響の可能性)
- Impressions 急減 (URL discovery / sitemap 問題)
- 平均掲載順位 +5 以上悪化 (relevance / authority 損失)

### 3. Daily monitor — week summary

`.github/workflows/indexing-monitor.yml` で過去 7 日間に作成された Issue (label: `indexing`) を確認.

| Day | Anomalies count | Most-common type | Note |
|---|---:|---|---|
| Mon | | | |
| Tue | | | |
| Wed | | | |
| Thu | | | |
| Fri | | | |
| Sat | | | |
| Sun | | | |

**Investigate** if:
- 同じ URL × type で 3 日連続 anomaly → 修正 deploy が必要な恒久 bug
- 突然全 URL fetch-error → CI runner / DNS / Vercel 障害
- 全 URL canonical-mismatch → root layout / metadata の deploy 回帰

### 4. Sitemap snapshot

```bash
curl -s https://www.japan-pop-now.com/sitemap.xml | grep -c '<loc>'
```

Total URL 数: ____  (前週比 ±N)

新しい記事 ship 時に sitemap が更新されているか確認.

### 5. Dead-weight watchlist

`docs/indexing/noindex-applied-20260426.md` で識別された 0-inbound 記事 11 本のうち、まだ inbound link が増えていない slug を inbound-link injection 対象として queue.

このセクションで前週からの変化を記録:

| slug | 前週 inbound | 今週 inbound | action 必要? |
|---|---:|---:|---|
| cosplay-experience-tokyo-2026 | | | |
| jujutsu-kaisen-cafes-japan-2026-guide | | | |
| kyoto-anime-guide-2026 | | | |
| luvlab-harajuku-diy-accessory-experience | | | |
| naruto-tokyo-pilgrimage-2026 | | | |
| chiikawa-land-tokyo-complete-2026 | | | |
| dark-moon-chara-cafe-ikebukuro-2026 | | | |
| jojo-stone-ocean-cafe-jojo-world-2026 | | | |
| kamakura-slam-dunk-pilgrimage-2026 | | | |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | | | |
| pokemon-center-tokyo-complete-guide-2026 | | | |

inbound 0 のまま 30 日経過 → strict E2 criteria を満たすので noindex 候補に再編入.

### 6. Image quality snapshot

```bash
python scripts/image_quality_gate.py --strict 2>&1 | tail -3
```

| Metric | This week | Last week | Δ | Target |
|---|---:|---:|---:|---|
| Articles scanned | | | | — |
| LOW_DENSITY | | | | <= 20 |
| P0 FATAL (BODY_NO_IMAGES) | | | | 0 |
| LOW_BPP warnings | | | | falling |

### 7. Action queue (this week)

書き出し用:
- [ ]
- [ ]
- [ ]

### 8. Sign-off

Reviewed by: Takapon
Reviewed on: YYYY-MM-DD HH:MM JST
Next review: YYYY-MM-DD (Monday +7d)
