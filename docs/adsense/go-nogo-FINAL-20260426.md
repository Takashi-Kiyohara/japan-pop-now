---
title: "AdSense 3rd Submit GO/NO-GO 最終判定（2026-04-26、データ待ち版）"
date: 2026-04-26
author: Takapon (via Claude Code)
status: provisional — Gate 3/3a 確定 PASS、Gate 1/2/4 は GSC export 未着で評価不能、最終判定保留
context: 4/24 NO-GO → 4/25 朝 NO-GO（前進）→ 4/25 夕 WAIT（Gate 3+3a PASS）→ 4/26 (本書) 最終判定 PENDING
supersedes: go-nogo-20260425.md
---

# AdSense 3rd Submit GO/NO-GO 最終判定 — 2026-04-26

## TL;DR — **WAIT**（2 件の user 側ブロッカー）

| 項目 | 状態 |
|---|---|
| 現時点の判定 | **WAIT — データ + コード PR の 2 ブロッカーが解消するまで GO 確定不能** |
| 確定 PASS | Gate 3 ✅（LOW_DENSITY 15 ≤ 20）、Gate 3a ✅（P0 FATAL 0） |
| 確定 PENDING | Gate 1 / 2 / 4 — **GSC export 未受領**。本セッションで取得試行も path 不在 |
| 副次ブロッカー | **noindex wiring が core code 側に未実装** — `app/articles/[slug]/page.tsx` + `lib/articles.ts` 改修必要、これは pre-push hook で意図的に PR 必須化されている領域 |
| ブロッカー解消後の経路 | (a) GSC で Gate 1/2/4 確定 → 全 PASS なら GO、Gate 4 不足なら下記 realign 案 A/B/C から選択 |

---

## Gate 達成状況

| # | Gate | 要件 | 4/25 夕 | 4/26 朝（本書） | 備考 |
|---|---|---|---|---|---|
| 1 | GSC 登録済 URL | >= 50 | PENDING | **PENDING** | GSC export 未着、後述 |
| 2 | Daily click 7 日平均 | >= 20 | PENDING | **PENDING** | 同上 |
| 3 | LOW_DENSITY 残 | <= 20 | 15 ✅ | **15** ✅ | 4/25 sprint で確定 |
| 3a | BODY_NO_IMAGES (P0 FATAL) | = 0 | 0 ✅ | **0** ✅ | 4/24 から維持 |
| 4 | 非カフェ月 50+ click 記事 | >= 3 | PENDING | **PENDING** | GSC page-level CSV 要 |

---

## ブロッカー 1 — GSC export 未受領

### 何が起きたか
本セッションで brief 指定の path `/sessions/dreamy-sharp-davinci/mnt/K10_Japan Pop Now/inbox/` を読みに行ったが、Windows / OneDrive / Downloads / Desktop / Box / Google Drive recent files、いずれにも GSC CSV 不在。スクリーンショット添付もなし。

### 取得 path の整合性
brief の `/sessions/dreamy-sharp-davinci/...` は別 Claude session の sandbox mount point と思われ、本 Claude Code セッション（Windows）からは可視化できない。

### user 側で必要なアクション（5-15 分）
以下のいずれかで GSC データを本セッションから読める場所に配置：

**Option A（推奨、GSC UI 5 分）**
1. https://search.google.com/search-console を開く
2. property `https://japanpopnow.com/`（または `https://www.japan-pop-now.com/`）を選択
3. インデックス登録 → カバレッジ → 「登録済み」の URL 数を確認（数値だけで OK）
4. 検索パフォーマンス → 過去 28 日 → 「日付」タブ → 「エクスポート」→ CSV
5. 検索パフォーマンス → 過去 28 日 → 「ページ」タブ → 「エクスポート」→ CSV
6. CSV 2 件を `C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\.tmp\gsc_20260426\` に保存
7. coverage 数値は Claude チャットに貼って OK（`登録済 URL: NN`）

**Option B（自動化、次セッション用）**
```powershell
pwsh "C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\scripts\inject-gsc-creds.ps1"
# その後 Claude Code を再起動 → GSC MCP が活きる
```

**Option C（数値だけ即書き込み）**
チャットで以下 3 行貼るだけでも Gate 1/2/4 暫定判定可能：
```
GSC 登録済 URL 数: NN
過去 7 日 daily click 平均: NN.N
過去 28 日 page-level 上位 10 記事の (slug, click) ペア: ...
```

---

## ブロッカー 2 — noindex wiring 未実装（PR 必須）

### 現状
`app/articles/[slug]/page.tsx` の `generateMetadata` は frontmatter の `robots` フィールドを読まない。`lib/articles.ts` の `Article` 型にも `robots` フィールド未定義。よって frontmatter に `robots: noindex,follow` を書いても output に反映されない。

### 必要 patch（合計 3 ファイル × 数行）
これは **core code** 改修なので `.git/hooks/pre-push` の docs/image-only 制約に弾かれる。**user 側で feature branch + PR が必要**。

```diff
// lib/articles.ts (Article 型に robots 追加)
 export type Article = {
   slug: string
   ...
   relatedSlugs?: string[]
+  robots?: string  // "noindex,follow" など
 }
```

```diff
// lib/articles.ts (getArticleBySlug の return に追加、行 60 付近)
   return {
     slug,
     ...
     relatedSlugs: data.relatedSlugs,
+    robots: data.robots,
     content,
   }
```

```diff
// app/articles/[slug]/page.tsx (generateMetadata の return に追加、行 90 付近)
   return {
     title: article.title,
     description: article.description,
+    robots: article.robots
+      ? { index: !article.robots.includes('noindex'), follow: !article.robots.includes('nofollow') }
+      : undefined,
     alternates: { ... },
     openGraph: { ... },
     twitter: { ... },
   };
```

### 動作確認手順
1. PR mege 後 `npm run build` → エラー無し
2. 任意の 1 記事に `robots: "noindex,follow"` を frontmatter に追加 → `npm run dev` で開いて `view-source` の `<meta name="robots">` を確認
3. 確認後、本書記載の dead-weight 候補に一括適用 → `content/articles/` 配下のみのコミット → pre-push hook PASS で main 直 push 可能

### 見積
- PR 作成 + 動作確認: **15-20 分**
- 適用 + push: **10 分**

---

## P0-C dead-weight 候補（GSC 不在のため non-GSC ヒューリスティクスのみ、要 GSC 検証）

repo signals のみでの評価。**GSC click 0-1 + impression < 10 の確認なしに noindex 化は行わない**。本セクションは GSC データ受領後の作業対象を絞り込む候補リスト。

### Tier 1 — 0 inbound + LOW_DENSITY（noindex 第一候補）

| slug | lastUpdated | inbound | wc | density |
|---|---|---|---|---|
| kyoto-anime-guide-2026 | 2026-04-02 | 0 | 3,476 | 0.60 |
| anime-pilgrimage-spots-tokyo | 2026-03-25 | 0 | 2,624 | 0.40 |
| anime-merch-shopping-guide-japan | 2026-04-22 | 0 | 3,219 | 0.30 |
| book-japan-anime-events-overseas-2026 | 2026-04-04 | 0 | 2,330 | 0.42 |

### Tier 2 — 1-2 inbound + LOW_DENSITY（review/consolidate）

| slug | inbound | wc | density |
|---|---|---|---|
| anime-hotels-tokyo-2026 | 1 | 2,736 | 0.70 |
| chainsaw-man-pilgrimage-tokyo | 2 | 2,419 | 0.42 |
| wonder-festival-figure-events-japan-2026 | 1 | 1,744 | 0.56 |
| golden-week-2026-anime-events-complete-guide | 1 | 2,190 | 0.59 |

### Tier 3 — keep（≥3 inbound、LOW_DENSITY でも保持）

how-to-book-anime-collab-cafe-japan (39 inbound), tokyo-anime-district-guide (15), japan-esim-pocket-wifi-sim-card (13), game-centers-arcades-japan (7), jujutsu-kaisen-shibuya-locations-2026 (6), gaming-tokyo-2026 (5), japan-proxy-shopping-2026 (3) — これらは hub/参照記事なので画像補強で対応すべき。

### GSC 受領後の判定ルール（brief Step 3 そのまま）

- `click = 0 ∧ imp < 10` → **noindex 確定**
- `click ≤ 1 ∧ 10 ≤ imp ≤ 100` → 保留（タイトル/メタ rewrite 候補）
- `click ≥ 2` → 保持確定（density は別途補強）

→ Tier 1 の 4 本が GSC で `click=0 ∧ imp<10` を満たせば即 noindex、Tier 2 は GSC 次第で振り分け。

---

## Gate 4 realign 検討（非カフェ winner >= 3 が達成困難な場合）

GSC で非カフェ 28 日 click >= 47（≒月 50 click）の記事が 0-2 本だった場合の選択肢。

### A. Gate 4 を「非カフェ最大 click 記事 >= 30/月」に realign（推奨）
- 根拠: AdSense 申請評価で reviewer が見るのは "サイトが価値を提供しているか" であり、>= 50 は当初厳格すぎ
- 30/月（28 日 click >= 28）を満たす記事が 1 本でもあれば「非カフェ領域に sustained reader がいる」証拠として機能
- realign 後 Gate 4 PASS なら **GO**、4 PASS

### B. Gate 4 を諦めて 3/4 PASS で submit（中リスク）
- Gate 1 + 2 PASS、Gate 3/3a PASS 確認済の状態で submit
- reject される場合は「カテゴリ多様性不足」が理由として明示される可能性
- 利点: フィードバックループが速い（reviewer の reject 文言で次の手が決まる）

### C. Gate 4 達成まで submit defer（保守）
- 非カフェに sustained traffic 記事を 1 本作るまで wait
- 工数 4-8 時間（Topic research + GEO/AEO ワークアウト + DNS 切替後の click 回復待ち 1-2 週）
- 利点: reviewer feedback の history を綺麗に保てる（4 reject になると Google 側で site quality flag 強化）

### 推奨: A → B → C の順で評価。GSC 数値見て即決可能。

---

## 結論 — **WAIT（条件付き GO 経路あり）**

Gate 3/3a が技術側で完全クリアされ、AdSense reviewer の "thin content" 印象を avoid する核心 3 ルートが消滅。残るは GSC 数値での Gate 1/2/4 確定のみ。

**条件付き GO ロジック**：
```
if GSC[Gate1] >= 50 and GSC[Gate2] >= 20 and GSC[Gate4] >= 3:
    → GO（即 3rd submit）
elif GSC[Gate1] >= 50 and GSC[Gate2] >= 20 and GSC[Gate4_realigned] >= 1:
    → GO（option A 適用後）
elif GSC[Gate1] >= 50 and GSC[Gate2] >= 20 and GSC[Gate4] in {0, 1, 2}:
    → 選択：option B（3/4 で submit）または option C（defer）
elif GSC[Gate2] < 20:  # daily click が DNS 切替で死んでいる
    → 1-2 週待機、画像側はこのまま温存（Gate 3/3a 状態維持）
elif GSC[Gate1] < 50:  # crawl/index 障害の signal
    → 別 sprint で sitemap 再提出 + canonical 監査
```

---

## 次アクション（user 側、優先順）

| 優先 | アクション | 工数 | 完了条件 |
|---|---|---|---|
| **U-1** | GSC export を `.tmp/gsc_20260426/` に配置（or 数値チャット貼り） | 5-15 分 | Gate 1/2/4 即確定 |
| **U-2** | noindex wiring PR（diff は本書記載通り） | 15-20 分 | core code 側で robots 反映 |
| **U-3** | U-1 + U-2 完了後、Claude Code で GSC 数値検証 → 条件付き GO ロジックに従い submit or defer | 10-30 分 | 最終判定書 `docs/adsense/go-nogo-{YYYYMMDD}.md` で GO/NO-GO 確定 |

---

## データソース・参照

- 4/25 夕方版: `docs/adsense/go-nogo-20260425.md`（Gate 3/3a PASS 経緯）
- cafe triage: `docs/adsense/cafe-density-blocked-20260425.md`
- 画像品質出力: `.tmp/iq_after_20260425.txt`
- noindex wiring 調査: `app/articles/[slug]/page.tsx:46-91`、`lib/articles.ts:11-29`
- pre-push hook: `.git/hooks/pre-push`（許可: docs/** + public/images/articles/** + content/articles/**.{md,mdx} + .tmp/** + .gitignore）

## Appendix: 判定遷移表

| 時点 | LOW_DENSITY | P0 FATAL | Gates 1/2/4 | noindex 化 | 判定 |
|---|---|---|---|---|---|
| 4/21 audit | 36 | 10 | unknown | 0 | (assessment 未) |
| 4/24 doc | 36 | 10 | PENDING | 0 | NO-GO |
| 4/25 朝 | 29 | 0 | PENDING | 0 | NO-GO（前進） |
| 4/25 夕 | 15 ✅ | 0 ✅ | PENDING | 0 | WAIT（Gate 3+3a PASS） |
| **4/26 朝** | **15 ✅** | **0 ✅** | **PENDING** | **0**（wiring 未） | **WAIT（user action 待ち）** |
| 目標 | <= 20 | 0 | all PASS | dead weight 4-8 本 | **GO** |
