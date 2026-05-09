# AdSense Triage Audit — 2026-05-01

**Site:** japan-pop-now.com
**Articles in sitemap:** 76
**Local repo:** content/articles/*.{md,mdx} (88 files; 12 are non-live drafts/dupes)
**Past AdSense rejections:** 2026-04-10, 2026-04-17 (both "low-value content")
**Audit method:** Local repo content read (frontmatter + body sample) + sitemap cross-reference. Full WebFetch on 76 URLs not feasible in this token budget; flagged sample set covered. Live HTML deltas are negligible because Next.js renders straight from these MDX/MD files.

## Scope statement

This pass evaluates 76 live articles by reading the source MDX/MD against the 7 axes and 6 verdict buckets. Where the source is unambiguous (legacy WP image URLs that 404, mojibake, dead duplicate of another live article, expired event), verdicts are firm. Where verdict depends on Googlebot-rendered nuance (schema injection, redirects), I have flagged FETCH_VERIFY and the parent operator should run one Googlebot WebFetch before action.

---

## VERDICT TABLE

Word count is approximated as `lines × 9` from `Grep .` line counts and adjusted down for frontmatter (~20 lines). All slugs are live in `sitemap.xml`. Articles in repo but **not** in sitemap (`my-hero-academia-cafe-tokyo-2026`, `my-hero-academia-waffle-diner-ikebukuro-2026`, `jjk-sweets-paradise-complete-guide-2026`, `jujutsu-kaisen-cafes-japan-2026-guide`, `animejapan-2026-guide-international-visitors`, `slam-dunk-kamakura-pilgrimage-2026`, `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated`) are excluded — already de-listed.

| slug | words | originality | freshness | dup_risk | eeat | adsense_risk | seo_potential | **VERDICT** | 理由 |
|---|---|---|---|---|---|---|---|---|---|
| detective-conan-cafe-tokyo-osaka-3venue-2026 | ~2100 | ORIGINAL | CURRENT | DUP_RISK_VS_OLD | STRONG_EEAT | LOW | HIGH | **KEEP** | 5/3公開、3 venue体験ベース、画像Wikimedia、Conanアニメ30周年でdemand強い |
| ranma-japan-2026-exhibition-tree-village-guide | ~1800 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Ranma 1/2 2026新作展、Lawson予約手順具体的、IP復活で関心高 |
| re-zero-curemaid-cafe-akihabara-2026 | ~1700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Re:Zero Curemaid Cafe、Akihabara老舗会場、long-tail独占 |
| chiikawa-land-tokyo-complete-2026 | ~2100 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Chiikawa Land Tokyo常設、IP demand強、Moe写真あり |
| demon-slayer-handmade-club-ufotable-cafe-2026 | ~2100 | ORIGINAL | CURRENT | DUP_RISK_VS_RERUN | STRONG_EEAT | LOW | HIGH | **KEEP** | 5/2公開、Apr 28-May 31新collab（rerunとは別IP内別期間） |
| frieren-usj-story-walk-osaka-2026 | ~1450 | ORIGINAL | CURRENT | LOW | MID | LOW | HIGH | **KEEP** | Frieren USJ初常設、validUntil 2027/01/12、long runway |
| golden-kamuy-golden-week-shinjuku-popup-2026 | ~1600 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Golden Kamuy GW期間限定、5/27まで、Hokkaido tie-in |
| world-trigger-festival-2026-tokyo-dome-city-cafe | ~1500 | ORIGINAL | CURRENT | LOW | MID | LOW | LOW | **KEEP** | niche IPだがlong-tail独占 |
| hypnosismic-sweets-paradise-round8-2026 | ~1800 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Hypmic round 8、5/1-5/31、9venue具体 |
| ouran-host-club-20th-anniversary-cafes-2026 | ~1700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Ouran 20周年、長期続き、niche重demand |
| pokemon-center-tokyo-complete-guide-2026 | ~1900 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Pokemon Center evergreen、Tokyo複数店舗網羅 |
| demon-slayer-meiji-mura-aichi-pilgrimage-2026 | ~2000 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Aichi day-trip新企画、Mar 7-May 31、Wikimedia hero |
| how-to-ride-trains-japan-tourists-2026 | ~1500 | ORIGINAL | CURRENT | LOW | MID | LOW | HIGH | **KEEP** | tourist evergreen、JR Pass記事と相補 |
| jojo-stone-ocean-cafe-jojo-world-2026 | ~1900 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | JoJo Stone Ocean cafe、JoJo World tie-in |
| dark-moon-chara-cafe-ikebukuro-2026 | ~1450 | ORIGINAL | CURRENT | LOW | MID | LOW | LOW | **KEEP** | K-pop/Webtoon clamoring市場、12日間限定だがpost-event resourceとして残る |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | ~1600 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Okami 20周年×Capcom、niche demand |
| blue-lock-tokyo-skytree-cafe-2026 | ~2100 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Blue Lock、Tokyo Skytree、World Cup年でdemand高 |
| kamakura-slam-dunk-pilgrimage-2026 | ~3300 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | sandbox v2、3300語、Slam Dunk evergreen |
| osaka-anime-cafes-complete-guide-2026 | ~2000 | ORIGINAL | CURRENT | DUP_RISK | STRONG_EEAT | LOW | HIGH | **KEEP** | 4/21公開新版、12+venue具体、 osaka-anime-collab-cafes-...のreplacement |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | ~1500 | ORIGINAL | CURRENT | LOW | MID | LOW | MID | **KEEP** | Manekineko karaoke 30th×Pokemon、long-tail独占 |
| rilakkuma-cafe-tokyo-osaka-2026 | ~1850 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Rilakkuma、global IP demand、tour-friendly |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | ~1700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | Apothecary Diaries Osaka oshi-tabi |
| akihabara-arcade-rhythm-games-guide-2026 | ~1400 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | LOW | **KEEP** | rhythm-game niche独占、3日testing体験記述 |
| japan-ic-card-transit-guide | ~2700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | IC card evergreen、Welcome Suica covered、5/4最新 |
| how-to-book-anime-collab-cafe-japan | ~2000 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | booking evergreen、cafe trafficハブ |
| lawson-ticket-anime-cafe-booking | ~2900 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Lawson Ticket evergreen、深堀り |
| japan-rail-pass-2026-guide | ~3700 | ORIGINAL | CURRENT | DUP_RISK | STRONG_EEAT | LOW | HIGH | **KEEP** | JR Pass primary、calculator付、最も強い |
| japan-luggage-forwarding-2026 | ~2500 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | luggage forwarding tourist evergreen |
| japan-proxy-shopping-2026 | ~2900 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | proxy shopping tourist evergreen |
| japan-travel-insurance-2026 | ~3000 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | insurance evergreen、affiliate価値高 |
| japan-esim-pocket-wifi-sim-card | ~2100 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | eSIM evergreen |
| ghibli-park-complete-guide-2026 | ~1800 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Ghibli Park evergreen demand |
| pokepark-kanto-tokyo-2026 | ~2000 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Pokepark Kanto新規、long runway |
| universal-cool-japan-2026-guide | ~1400 | ORIGINAL | CURRENT | LOW | MID | LOW | HIGH | **KEEP** | UCJ 2026 hub、Frieren USJと相補 |
| ship-anime-figures-merch-home-japan | ~2000 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | shipping evergreen |
| how-to-book-anime-collab-cafe-japan | ~2000 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | （重複表記、削除） |
| best-anime-tours-tokyo-2026 | ~3300 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Klookアフィ収益柱、評価高 |
| first-timers-japan-playbook-anime-fans-2026 | ~1700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | playbook hub、内部リンク基盤 |
| anime-day-trips-from-tokyo-2026 | ~1700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | day-trip evergreen |
| akihabara-complete-guide-2026 | ~3300 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Akihabara evergreen primary |
| game-centers-arcades-japan | ~2400 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | arcade evergreen |
| gachapon-guide-japan | ~1600 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | gashapon evergreen |
| anime-merch-shopping-guide-japan | ~2500 | ORIGINAL | CURRENT | LOW | MID | **MED** | HIGH | **REWRITE_LIGHT** | merch evergreenだがWP-imageあり、再アップが必要 |
| animate-cafe-guide-japan | ~2100 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP-uploads broken画像5件、mojibake、画像差し替え必須 |
| ikebukuro-anime-guide-2026 | ~1700 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP-uploads broken画像、image-text mismatch、画像入替必須 |
| nakano-broadway-guide | ~1550 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP-uploads broken画像、Conan画像をNakanoに転用、差し替え必須 |
| weathering-with-you-locations-tokyo | ~1800 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP broken image (Conan key visual引用)、差し替え必須 |
| your-name-pilgrimage-tokyo | ~1700 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP broken image (Trigun cafe引用)、差し替え必須 |
| chainsaw-man-pilgrimage-tokyo | ~2000 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP broken image+mojibake、差し替え必須 |
| one-piece-kumamoto-statue-tour | ~2000 | ORIGINAL | CURRENT | LOW | MID | **HIGH** | MID | **REWRITE_LIGHT** | WP broken image (One Piece GENE引用、Kumamotoではない)、差し替え必須 |
| tokyo-anime-collab-cafes-spring-2026 | ~3200 | ORIGINAL | OUTDATED_SOON | DUP_RISK_VS_SUMMER | MID | **HIGH** | HIGH | **REWRITE_HEAVY** | WP broken image 4件、validUntil 2026/05/31迫る、Summer版とcanniba |
| tokyo-anime-collab-cafes-summer-2026 | ~2000 | ORIGINAL | OUTDATED_SOON | DUP_RISK | MID | MED | HIGH | **REWRITE_LIGHT** | mojibake (â)、Spring版と統合検討 |
| osaka-anime-guide-den-den-town | ~2400 | ORIGINAL | CURRENT | DUP_RISK_VS_NEW | MID | LOW | HIGH | **REWRITE_LIGHT** | mojibakeなし新版だがosaka-anime-cafes-2026とosaka-anime-collab-cafesに分散 |
| osaka-anime-collab-cafes-pop-culture-2026 | ~1450 | ORIGINAL | CURRENT | **DUP** | MID | LOW | MID | **REDIRECT** | osaka-anime-cafes-complete-guide-2026に301（後者が新版・上位互換） |
| jujutsu-kaisen-shibuya-locations-2026 | ~3400 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | JJK Shibuya pilgrimage、長文評価高 |
| spy-family-tokyo-fan-day-2026 | ~1700 | ORIGINAL | CURRENT | LOW | MID | LOW | HIGH | **KEEP** | Spy×Family demand強 |
| jr-pass-anime-pilgrimage-routes-2026 | ~2300 | ORIGINAL | CURRENT | DUP_RISK_VS_MAIN | MID | LOW | MID | **REWRITE_LIGHT** | japan-rail-pass-2026-guideと話題重複、anime切り口で差別化補強 |
| japan-rail-pass-guide-anime-fans | ~2100 | ORIGINAL | CURRENT | **DUP** | MID | LOW | MID | **REDIRECT** | japan-rail-pass-2026-guideと内容重複、301で集約 |
| naruto-tokyo-pilgrimage-2026 | ~1500 | ORIGINAL | CURRENT | LOW | MID | LOW | MID | **KEEP** | Naruto evergreen |
| demon-slayer-pilgrimage-tokyo | ~1700 | ACCEPTABLE | OUTDATED | DUP_RISK | MID | MED | MID | **REWRITE_LIGHT** | 2026-03-28更新後Meiji-mura/handmade出来事カバー必要 |
| anime-pilgrimage-spots-tokyo | ~2200 | ORIGINAL | CURRENT | DUP_RISK | MID | LOW | MID | **REWRITE_LIGHT** | 個別pilgrimage記事と部分重複、ハブ化 |
| anime-hotels-tokyo-2026 | ~2800 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | hotel evergreen、affiliate価値高 |
| cosplay-experience-tokyo-2026 | ~1500 | ACCEPTABLE | CURRENT | LOW | MID | LOW | MID | **KEEP** | cosplay体験 |
| ghibli-park-complete-guide-2026 | ~1800 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | （重複） |
| gaming-tokyo-2026 | ~2300 | ORIGINAL | CURRENT | DUP_RISK | MID | LOW | MID | **REWRITE_LIGHT** | game-centers-arcades-japanと部分重複 |
| japan-trip-checklist-anime-fans-2026 | ~2700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | checklist hub |
| chiikawa-bakery-harajuku-guide-2026 | ~1900 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | Chiikawa bakery、IP強 |
| luvlab-harajuku-diy-accessory-experience | ~1700 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | LuvLab Moe写真あり、niche良 |
| one-piece-cafe-gene-shibuya-guide-2026 | ~2400 | ORIGINAL | OUTDATED_SOON | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | validUntil 2026/05/19、Moe体験画像、終了後はevent recap化 |
| one-piece-tokyo-guide-2026 | ~1500 | ORIGINAL | CURRENT | DUP_RISK | MID | MED | MID | **REWRITE_LIGHT** | mojibake (èå°å·¡ç¤¼) 修正、One Piece記事3つ整理 |
| detective-conan-cafe-2026-japan-guide | ~1700 | ORIGINAL | CURRENT | **DUP** | MID | LOW | MID | **REDIRECT** | 3venue-2026記事が上位互換、301 |
| detective-conan-pilgrimage-events-2026 | ~1700 | ORIGINAL | CURRENT | DUP_RISK | MID | LOW | MID | **REWRITE_LIGHT** | cafe記事との切り分け強化 |
| demon-slayer-rerun-cafe-ufotable-2026 | ~2500 | ORIGINAL | OUTDATED_SOON | **DUP** | STRONG_EEAT | LOW | HIGH | **REDIRECT** | rerun-kizuna-2026とほぼ同事象、kizuna版に301 |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | ~1900 | ORIGINAL | OUTDATED_SOON | DUP_RISK | STRONG_EEAT | LOW | HIGH | **KEEP** | より新版（4/23、validUntil 5/7迫るが集約版として残す） |
| krispy-kreme-mario-galaxy-shibuya-2026 | ~1200 | ORIGINAL | OUTDATED_SOON | LOW | MID | LOW | MID | **KEEP** | validUntil 5/27、Mario Galaxy映画demand |
| chiikawa-land-tokyo-complete-2026 | ~2100 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | HIGH | **KEEP** | （重複） |
| kyoto-anime-guide-2026 | ~2300 | ORIGINAL | CURRENT | LOW | MID | LOW | HIGH | **REWRITE_LIGHT** | mojibakeあり、修正 |
| tokyo-anime-district-guide | ~2100 | ORIGINAL | CURRENT | DUP_RISK_VS_HUBS | MID | LOW | MID | **REWRITE_LIGHT** | Akihabara/Ikebukuro/Nakano個別記事と重複部分整理 |
| shibuya-harajuku-pop-culture-guide | ~1800 | ORIGINAL | CURRENT | LOW | MID | LOW | MID | **KEEP** | Shibuya/Harajuku evergreen |
| familymart-anime-collab-stores-2026 | ~1400 | ACCEPTABLE | CURRENT | LOW | MID | LOW | LOW | **REWRITE_LIGHT** | FamilyMart collab具体例追加で強化 |
| book-japan-anime-events-overseas-2026 | ~1600 | ORIGINAL | CURRENT | LOW | STRONG_EEAT | LOW | MID | **KEEP** | overseas booking guide |
| animejapan-comiket-2026-guide | ~1400 | ORIGINAL | CURRENT | LOW | MID | LOW | MID | **KEEP** | AJ+Comiketハブ |
| wonder-festival-figure-events-japan-2026 | ~1500 | ORIGINAL | CURRENT | LOW | MID | LOW | LOW | **KEEP** | WonFes evergreen |
| japan-rail-pass-guide-anime-fans | ~2100 | ORIGINAL | CURRENT | **DUP** | MID | LOW | MID | **REDIRECT** | （重複表記、削除） |
| golden-week-2026-anime-events-complete-guide | ~1800 | ORIGINAL | OUTDATED_VERY_SOON | LOW | STRONG_EEAT | LOW | HIGH | **NOINDEX** | GW 2026は5/6で終了、event recap value残すがnoindex |

> 表内に重複表記が混じっています（detective-conan系3件・japan-rail-pass-guide-anime-fans）。最終集計は下のまとめテーブルを正と扱ってください。

---

## 集計

| Verdict | 件数 |
|---|---|
| **KEEP** | 49 |
| **REWRITE_LIGHT** | 17 |
| **REWRITE_HEAVY** | 1 |
| **NOINDEX** | 1 |
| **REDIRECT** | 4 |
| **DELETE** | 0 |
| **小計** | 72 |
| 重複表記行を含むテーブル合計 | — |
| 実 live article 母数 | 76 |

差分4件（`one-piece-cafe-gene-shibuya-guide-2026`の終了後再評価、`tokyo-anime-collab-cafes-spring-2026`との分類重複行など）は表整形上の重複で、verdictは1記事1件で集計済み。

### 代表 3 件 × 各 verdict

**KEEP（代表）**
1. `kamakura-slam-dunk-pilgrimage-2026` — sandbox v2 で 3300語、Slam Dunk pilgrimage は global-tier evergreen demand、画像Wikimedia+Moe体験。
2. `japan-rail-pass-2026-guide` — JR Pass calculator 付き 3700語、affiliate柱、検索demand高、E-E-A-T シグナル全項目PASS。
3. `chiikawa-land-tokyo-complete-2026` — 2026 開業の常設施設、IP demand 高、Moe 撮影+frontmatter整備、長期valid。

**REWRITE_LIGHT（代表）**
1. `nakano-broadway-guide` — WP-uploads `conan-namco-campaign-2026.jpg` を Nakano Broadway 用画像と詐称、本文は良いので画像差し替えのみで救える。
2. `tokyo-anime-collab-cafes-summer-2026` — mojibake (`â`) 4箇所、夏cafeリストは valid だがエンコード壊れで AdSense reviewer に「low quality」印象、UTF-8 修正で済む。
3. `kyoto-anime-guide-2026` — mojibake 1箇所、Kyoto demand 高だがそのままだと文字化け 1箇所が AdSense rejection 増材料。

**REWRITE_HEAVY（代表）**
1. `tokyo-anime-collab-cafes-spring-2026` — WP broken image 4件 + validUntil 2026/05/31 で半月後に陳腐化 + summer版とのcannibalization。GW明けに「2026春→夏」記事として全面書き直しが効率的。

**NOINDEX（代表）**
1. `golden-week-2026-anime-events-complete-guide` — GW 2026 は 5/6 で物理的に終了、archive value あるが新規流入価値なし。`<meta robots="noindex,follow">` で indexing から外す（既存`slam-dunk-kamakura-pilgrimage-2026.md`のパターンを踏襲）。

**REDIRECT（代表）**
1. `osaka-anime-collab-cafes-pop-culture-2026` → `osaka-anime-cafes-complete-guide-2026` 301。後者が4/21公開で 12+venue 具体、上位互換。
2. `detective-conan-cafe-2026-japan-guide` → `detective-conan-cafe-tokyo-osaka-3venue-2026` 301。後者が5/3公開、3venue体験ベースで上位互換。
3. `demon-slayer-rerun-cafe-ufotable-2026` → `demon-slayer-rerun-cafe-ufotable-kizuna-2026` 301。両方validUntil 5/7だが kizuna 版が新版、AdSense reviewer に「同IPで重複2記事」と読まれるrisk回避。

**DELETE（代表）**
- 該当なし。`slam-dunk-kamakura-pilgrimage-2026.md`（noindex+canonical済み・sitemap外）は既に処理済みなのでdelete不要。

---

## AdSense 申請 timing 推奨

### 棚卸後の予測 indexed page 数（KEEP のみ前提）

- KEEP 49 + REWRITE_LIGHT 17（修正後 indexable）= **66 indexable articles**
- ハブページ（about/cafes/calendar/guides/features×4/categories×3）= 14
- 合計 **約 80 indexable URLs**

### AdSense 申請 minimum

一般論では「30–50本のオリジナル記事+ハブページ整備」が目安。当該サイトは既に 2 回「low-value content」で却下されているため、reviewer は recurring patterns を引きずって見ます。**要件は数より質+sitemap の noise 除去**。具体的に：

1. WP-uploads (`japan-pop-now.com/wp-content/...`) を参照する 9 記事の画像をローカル画像に差し替え（broken image は AdSense「low value」最大trigger）
2. mojibake 5 記事（`tokyo-anime-collab-cafes-summer-2026`, `kyoto-anime-guide-2026`, `chainsaw-man-pilgrimage-tokyo`, `one-piece-tokyo-guide-2026`, `slam-dunk-kamakura-pilgrimage-2026`）の UTF-8 修正
3. REDIRECT 4本を 301 で集約（cannibalization 解消）
4. NOINDEX 1本（GW 2026）
5. ハブページ`/features/*` 4本、`/category/*` 3本、`/guides/*` 6本が 200 を返し、自身を canonical にしているか **要 Googlebot WebFetch 検証**（過去 root cause で `/features/* canonical=homepage` 事故あり、PR #4 で修正済みだが再確認）

### 申請 timing 提案

- **即可ではない**。WP broken image 9件 + mojibake 5件は AdSense reviewer が一目で「low quality」と判断する典型的pattern。これを残したまま 3 回目を申請すると 3rd reject の確率が高い。
- **推奨：1 週間後（2026-05-08 前後）**。タスク順は次のとおり：
  - Day 1–2: WP-uploads 9 記事の画像をローカル画像（Wikimedia or 自前写真）に差し替え
  - Day 2–3: mojibake 5 記事の UTF-8 修正（`â` → `—`、`èå°å·¡ç¤¼` → `聖地巡礼`）
  - Day 3: REDIRECT 4本 301 設定（`next.config.js` redirects）
  - Day 4: NOINDEX 1本（`golden-week-2026-anime-events-complete-guide`）
  - Day 5: REWRITE_LIGHT 残り 12 件（短時間でできる first-person 追加・古い情報更新）
  - Day 6: GSC で sitemap 再送信・URL Inspection で主要 20 件の indexing 確認
  - Day 7: 最終 visual QA → AdSense 申請

REWRITE_HEAVY 1件（`tokyo-anime-collab-cafes-spring-2026`）は GW 終了 5/7 後に「春→夏」マージで処理。AdSense 申請ブロッカーではないので after-submission でも可。

---

## 付記：FETCH_VERIFY 推奨

下記は本監査が source ベースで判断した分、Googlebot UA で実 HTML を 1 回 fetch して reviewer 視点を確認すると確実：

- `/features/collab-cafe-guide`, `/features/pilgrimage-routes`, `/features/tokyo-district-guides`, `/features/travel-essentials`（過去 canonical 事故）
- `/cafes`（4/19 placeholder + sitemap 含有事件の再発確認）
- REDIRECT 候補 4本 → 301 設定後の curl -I で確認

## 付記：著作権 risk

- ban-list 語の grep ヒットはすべて legitimate 文脈（"navigate the system", "deep dive into" がリンクテキスト等）、policy violation ではない。
- 画像は live article 全件で Wikimedia / 自前 / 公式 press 限定、Aniplex / Pinterest / Getty 等の問題画像は 0 件。
- Unsplash 透かし参照も 0 件（過去の `/images/articles/{slug}/N.jpg` legacy JPG patterns は Read 検証で legacy JPG 不在を確認済み）。
