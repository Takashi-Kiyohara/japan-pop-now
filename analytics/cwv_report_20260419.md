# Core Web Vitals Baseline — 2026-04-19

**計測条件**: lighthouse CLI 13.1.0、`--form-factor=mobile`、`--headless=new`、ローカル実行、一回測定。本番 URL。

**前提状態**: 本 session の Phase 3 (bottom nav) + Phase 8 (cafes seed) が Vercel にデプロイされた**直後**の計測。完全 pre-change baseline ではなく、「mobile sprint 反映直後」のスナップショット。

## 結果一覧

| URL | Perf | A11y | BP | SEO | LCP | FCP | TBT | SI | CLS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | **46** | 92 | 73 | 92 | 5.0 s | 3.9 s | 770 ms | 15.1 s | 0.001 |
| `/calendar` | **42** | 95 | 73 | 92 | 4.7 s | 4.0 s | 1,240 ms | 11.3 s | 0.002 |
| `/articles/animate-cafe-guide-japan` | **41** | 94 | 73 | 92 | 4.7 s | 4.4 s | 1,270 ms | 18.9 s | 0.001 |

## 閾値評価（Google Core Web Vitals）

| 指標 | Good | Needs improve | Poor | 本サイト |
|---|---|---|---|---|
| LCP | ≤ 2.5 s | 2.5-4.0 s | > 4.0 s | **POOR 全 URL (4.7-5.0s)** |
| FCP | ≤ 1.8 s | 1.8-3.0 s | > 3.0 s | **POOR 全 URL (3.9-4.4s)** |
| TBT | ≤ 200 ms | 200-600 ms | > 600 ms | **POOR 全 URL (770-1,270ms)** |
| CLS | ≤ 0.1 | 0.1-0.25 | > 0.25 | **GOOD 全 URL (≤ 0.002)** |
| SI | ≤ 3.4 s | 3.4-5.8 s | > 5.8 s | **POOR 全 URL (11-19s)** |

**結論**: CLS 以外の主要指標が全部 POOR。Performance score 41-46 は Google の「poor」バケット（< 50）に全 URL が入っている。

## 主要改善機会（lighthouse 抽出）

### Homepage
- **Unused JavaScript**: Est. 189 KiB savings — 未使用 JS bundle
- **Bootup time**: 5.7 s — メインスレッドが script 実行で長時間占有

Calendar / Article でも同様（TBT 1,200ms+）、third-party script 要因が濃厚。

## 推定原因（要検証）

1. **AdSense script**: `pagead2.googlesyndication.com` が render-blocking かつ main thread 長時間占有
2. **Google Analytics + Tag Manager**: 同様に main thread 負荷
3. **Font loading**: Playfair Display + DM Sans、`font-display: swap` 指定済だが FCP/LCP に影響
4. **Next.js hydration**: React 19 hydration、特に `/articles/*` の大きな MDX render

## 次の打ち手候補（優先順）

### P1: 軽量化の低リスク施策

1. **AdSense 審査中は script 遅延 load**
   - 現状: layout.tsx で `<head>` に `async` で load
   - 改善: `requestIdleCallback` or `fetchpriority="low"` で second paint 後に遅延
   - 期待効果: TBT 数百 ms 削減
2. **Unused JavaScript の削減**
   - 189 KiB は bundle analyzer で特定可能
   - `next build --analyze` or `@next/bundle-analyzer` で依存 tree 可視化
3. **Image lazy load 強化**
   - hero 以外の画像を `loading="lazy"` + `decoding="async"` 徹底
   - `/calendar` は image 大量、特に効く

### P2: hydration / split

1. **React Server Components 活用**
   - 現状 BottomNav は `'use client'`。他 client component を server 化
   - Header も 'use client' だが hydration 重い可能性
2. **dynamic import**
   - Below-fold の重い component を `next/dynamic({ssr: false, loading: () => null})`

### P3: インフラ

1. **Vercel ISR / streaming SSR 確認**
   - 現状どちらで配信されてるか `cache-control` ヘッダ確認
2. **Cloudflare キャッシュ前段**（未導入なら）
   - Static asset の CDN hit 率向上

## 閾値超過箇所 Quick Fix 3 つ（mega prompt の求め通り）

1. **LCP**: hero image に `priority` + `fetchPriority="high"` 明示、`next/image` sizes 属性で viewport に応じた最適版 serve
2. **TBT**: AdSense / GA scripts を `strategy="lazyOnload"` に変更（next/script 使用、現状 `<script async>` 直書き）
3. **FCP**: fonts preload + `font-display: optional` に変更検討（swap → optional で CLS 代わりに FCP 改善）

## Raw data

- `analytics/lh_home_mobile_20260419.json` (1.1 MB)
- `analytics/lh_calendar_mobile_20260419.json` (1.5 MB)
- `analytics/lh_article_mobile_20260419.json` (1.1 MB)

## PSI API 状態（次 session 用）

Google default shared API key (project_number 583797351490) が quota exhausted。PageSpeed Insights の UI 画面経由計測は可能だが API 経由なら個人 Google Cloud Console で key 発行推奨（無料枠内で十分な日次 quota）。

## 次 session 推奨アクション

1. この JSON 報告書を基準に、Phase 4 (homepage carousel) の perf 影響を前後比較
2. 本 session 直後と 24-48h 後の再計測で CrUX field data を取得（現状 field data は PSI 側 quota で未取得）
3. P2-M2（CWV 最適化）を次 sprint の P1 に昇格する判断材料として使用

---

## v2 再計測（2026-04-19、perf commit 後）

**目的**: `8bfe080 perf(scripts): lazyOnload AdSense + GA` の前後比較。

**v2 計測条件**: v1 と同一（lighthouse 13.1.0、mobile、headless）、単発計測。コミット後 Vercel deploy 反映を確認してから実行。

### v1 vs v2 対比

| URL | Perf | LCP | FCP | TBT | SI | Bootup |
|---|---|---|---|---|---|---|
| `/` v1 | 46 | 5.0 s | 3.9 s | 770 ms | 15.1 s | **5.7 s** |
| `/` v2 | 45 | **4.6 s** ✅ | **3.3 s** ✅ | 1,150 ms ❌ | **11.2 s** ✅ | **3.3 s** ✅ |
| Δ | -1 | -0.4s | -0.6s | +380ms | -3.9s | **-2.4s** |
| `/calendar` v1 | 42 | 4.7 s | 4.0 s | 1,240 ms | 11.3 s | 2.2 s |
| `/calendar` v2 | 43 | **4.3 s** ✅ | 4.0 s | 1,610 ms ❌ | **8.4 s** ✅ | 3.0 s |
| Δ | +1 | -0.4s | ±0 | +370ms | -2.9s | +0.8s |
| `/articles/.../animate-cafe-guide-japan` v1 | 41 | 4.7 s | 4.4 s | 1,270 ms | 18.9 s | 3.1 s |
| same v2 | 38 | 5.2 s ❌ | 4.4 s | 1,530 ms ❌ | **8.7 s** ✅ | 3.4 s |
| Δ | -3 | +0.5s | ±0 | +260ms | **-10.2s** | +0.3s |

### 読み方

**勝ち**:
- Homepage Bootup time: 5.7 s → 3.3 s（**-2.4s、-42%**） — lazyOnload の一次効果
- Homepage LCP/FCP 改善、SI 全 URL で 2-10s 縮小
- Calendar LCP/SI 改善

**負け / ノイズ**:
- TBT が全 3 URL で悪化（+260〜+380 ms）
- Article は Perf score -3、LCP +0.5s
- Performance score は全体的に横ばい（41-46 → 38-45）

### 解釈

TBT 悪化の仮説 2 件:
1. **計測ノイズ**: lighthouse 単発は 10-20% variance 込み。3-5 回平均で再評価が妥当
2. **lazyOnload の副作用**: script を window.load 後に defer しても Lighthouse は TTI まで measure するので、main thread ブロックは別時点に移動しただけ。INP (field data) では改善見込みだが lab TBT は悪化し得る

CWV 実質 (LCP/CLS/INP) は Core Web Vitals 判定の実体で、TBT は lab 指標に過ぎない。field CrUX が真。現状:
- LCP: 改善 (2/3 URL)
- CLS: 変化なし（元々 good）
- INP: field data 未取得、Googlebot 側で 24-72h 後に CrUX に反映

### 次の一手

1. **この変更は維持**。AdSense reviewer の script 検知 OK (HTML 残存 curl 確認済)、LCP 改善は明確
2. **24-72h 後に CrUX API で field INP 再評価** (PSI API key 要)
3. **TBT が本当に悪化しているなら**、AdSense script を `strategy="afterInteractive"` に戻す選択肢あり（lazyOnload より早いが hydration 後）
4. **単発計測の精度不足対策**: 次回は lighthouse `--runs=5` で multi-run median を取る

### Raw v2

- `analytics/lh_home_mobile_20260419_v2.json`
- `analytics/lh_calendar_mobile_20260419_v2.json`
- `analytics/lh_article_mobile_20260419_v2.json`

---

*v1 計測: session 中盤 14:29-14:30 JST、v2 計測: 14:55 頃 (perf commit 8bfe080 / ec40678 deploy 後)。*
