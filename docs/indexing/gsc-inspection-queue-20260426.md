---
title: "GSC URL Inspection 申請キュー (2026-04-26)"
date: 2026-04-26
author: Takapon (via Claude Code)
context: 24h indexing-recovery sprint Track D — GSC traffic ほぼ 0、indexing 通っていない疑惑への対処として URL Inspection 申請を 30+ 件まとめて行うための queue
usage: GSC 検索バーの上部「URLを入力 / Enter URL of japanpopnow.com」に 1 行ずつ貼って Enter → 「インデックス登録をリクエスト」ボタンをクリック → ~1 分待つ → 次の URL に進む
quota: 1 日 10-12 件まで（Google 側 throttling）。3 日連続で投入完了想定
---

# GSC URL Inspection Queue — 2026-04-26

## ⚠️ Takapon 物理作業の手順

1. https://search.google.com/search-console を開く
2. property `https://www.japan-pop-now.com/` を選択（apex `japanpopnow.com` は今回 not used）
3. ページ上部の検索バー（「URLを入力 / Enter URL of...」）に **下記の URL を 1 行ずつコピペ** → Enter
4. インデックス検査結果画面で **「インデックス登録をリクエスト」（Request Indexing）** をクリック
5. 「URLは Google に送信されました」が出たら次の URL に進む
6. **1 日に 10-12 件で throttling される**ので、超えたら翌日に持ち越し
7. 全 40 件投入完了まで 3-4 日

## 投入優先順（合計 40 URLs、3 tier）

### Tier 1 — Hub & 上位 inbound（最優先 15 件、Day 1）

site の骨格 = ハブと top performer。Google が「site の重要 URL」を理解する index priming に直結。

```
https://www.japan-pop-now.com/
https://www.japan-pop-now.com/articles
https://www.japan-pop-now.com/calendar
https://www.japan-pop-now.com/guides
https://www.japan-pop-now.com/category/cafes
https://www.japan-pop-now.com/category/experiences
https://www.japan-pop-now.com/category/destinations
https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-spring-2026
https://www.japan-pop-now.com/articles/how-to-book-anime-collab-cafe-japan
https://www.japan-pop-now.com/articles/akihabara-complete-guide-2026
https://www.japan-pop-now.com/articles/ikebukuro-anime-guide-2026
https://www.japan-pop-now.com/articles/japan-ic-card-transit-guide
https://www.japan-pop-now.com/articles/anime-pilgrimage-spots-tokyo
https://www.japan-pop-now.com/articles/demon-slayer-pilgrimage-tokyo
https://www.japan-pop-now.com/articles/animate-cafe-guide-japan
```

### Tier 2 — Recent ship 13 件（Day 2）

新着記事は GSC が自然 crawl するまで時差があり、URL Inspection で submit すると数日早く index される。

```
https://www.japan-pop-now.com/articles/detective-conan-cafe-tokyo-osaka-3venue-2026
https://www.japan-pop-now.com/articles/chiikawa-land-tokyo-complete-2026
https://www.japan-pop-now.com/articles/pokemon-center-tokyo-complete-guide-2026
https://www.japan-pop-now.com/articles/jjk-sweets-paradise-complete-guide-2026
https://www.japan-pop-now.com/articles/jojo-stone-ocean-cafe-jojo-world-2026
https://www.japan-pop-now.com/articles/dark-moon-chara-cafe-ikebukuro-2026
https://www.japan-pop-now.com/articles/okami-20th-monster-hunter-sakaba-tokyo-osaka-2026
https://www.japan-pop-now.com/articles/my-hero-academia-waffle-diner-ikebukuro-2026
https://www.japan-pop-now.com/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026
https://www.japan-pop-now.com/articles/blue-lock-tokyo-skytree-cafe-2026
https://www.japan-pop-now.com/articles/osaka-anime-cafes-complete-guide-2026
https://www.japan-pop-now.com/articles/kamakura-slam-dunk-pilgrimage-2026
https://www.japan-pop-now.com/articles/pokemon-karaoke-manekineko-30th-anniversary-2026
```

### Tier 3 — 中位 inbound 12 件（Day 3）

Google の crawl 漏れリスクが残る中堅。

```
https://www.japan-pop-now.com/articles/tokyo-anime-district-guide
https://www.japan-pop-now.com/articles/japan-rail-pass-2026-guide
https://www.japan-pop-now.com/articles/japan-esim-pocket-wifi-sim-card
https://www.japan-pop-now.com/articles/osaka-anime-guide-den-den-town
https://www.japan-pop-now.com/articles/nakano-broadway-guide
https://www.japan-pop-now.com/articles/shibuya-harajuku-pop-culture-guide
https://www.japan-pop-now.com/articles/your-name-pilgrimage-tokyo
https://www.japan-pop-now.com/articles/gachapon-guide-japan
https://www.japan-pop-now.com/articles/one-piece-kumamoto-statue-tour
https://www.japan-pop-now.com/articles/weathering-with-you-locations-tokyo
https://www.japan-pop-now.com/articles/game-centers-arcades-japan
https://www.japan-pop-now.com/articles/anime-merch-shopping-guide-japan
```

## ランク根拠

| 上位 inbound 数 | カウント | 採用 tier |
|---|---:|---|
| tokyo-anime-collab-cafes-spring-2026 | 63 | Tier 1 |
| how-to-book-anime-collab-cafe-japan | 29 | Tier 1 |
| akihabara-complete-guide-2026 | 29 | Tier 1 |
| ikebukuro-anime-guide-2026 | 24 | Tier 1 |
| japan-ic-card-transit-guide | 22 | Tier 1 |
| anime-pilgrimage-spots-tokyo | 16 | Tier 1 |
| demon-slayer-pilgrimage-tokyo | 13 | Tier 1 |
| animate-cafe-guide-japan | 13 | Tier 1 |
| tokyo-anime-district-guide | 12 | Tier 3 |
| japan-rail-pass-2026-guide | 12 | Tier 3 |
| japan-esim-pocket-wifi-sim-card | 12 | Tier 3 |
| osaka-anime-guide-den-den-town | 11 | Tier 3 |
| nakano-broadway-guide | 11 | Tier 3 |
| shibuya-harajuku-pop-culture-guide | 10 | Tier 3 |
| your-name-pilgrimage-tokyo | 9 | Tier 3 |
| gachapon-guide-japan | 9 | Tier 3 |
| one-piece-kumamoto-statue-tour | 8 | Tier 3 |
| weathering-with-you-locations-tokyo | 7 | Tier 3 |
| game-centers-arcades-japan | 7 | Tier 3 |
| anime-merch-shopping-guide-japan | 7 | Tier 3 |

集計コマンド：`grep -lE "/articles/${slug}([\"/\)#?]|$)" content/articles/*.{md,mdx}` で各 slug の言及件数をカウント、自己参照除外。

## 完了報告（Takapon 用）

投入完了したら、本書末尾に以下フォーマットで追記してください：

```
## 投入ログ

### Day 1 (YYYY-MM-DD)
- [x] https://www.japan-pop-now.com/  Submitted: HH:MM
- [x] https://www.japan-pop-now.com/articles  Submitted: HH:MM
...
```

これで Claude Code 側で Day N+7 の indexing 状況を URL Inspection の自動 polling で追えるようになる（C1 monitoring script で実装予定）。

## 注意

- **/category/events** と **/category/culture** は現状 0 記事 hub のため、sitemap からも noindex 化されている。submit しても "0 articles" で価値判定されるので **除外**。記事追加後に submit する。
- **/cafes** という top-level path は存在しない（`/category/cafes` のみ）。混同注意。
- 本書はあくまで GSC 自動 polling C1 が動くまでの一時的 manual queue。C1 merge 後は不要になる。
