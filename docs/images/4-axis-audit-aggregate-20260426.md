---
title: "4-axis Audit Aggregate (2026-04-26)"
context: Track H REDO 3rd Step 2 — 6 parallel agents audited 73 articles (4 P0 already-fixed excluded). All articles inspected via rendered HTML + per-image Read tool visual classify on 4 axes.
status: 18 P0 + 48 P1 + 2 clean — repo-wide image quality crisis confirmed
---

# 4-axis Audit Aggregate — 2026-04-26

## Methodology recap

For each of 73 articles (4 already-fixed P0 excluded):
1. Word count from MDX body
2. Floor (軸 1): user simplified spec = 5+ images minimum
3. Curl rendered HTML, extract all `<img>` references
4. For each image: Read local file (md5 == prod verified) → 4-axis classify
   - 軸 2 解像度 (≥ 1600 source / ≥ 1200×720 output)
   - 軸 3 topic match (article subject / named venue / IP)
   - 軸 4 real photo (no generation / illustration / schematic)

Priority labels:
- **P0**: 軸 4 violation (illustration/generated/schematic) OR Unsplash+/IP-art watermark OR full content duplicate
- **P1**: 軸 3 violation (topic mismatch) OR 軸 1 floor < 50% of word-count target
- **P2**: 軸 2 violation (low-res) OR 軸 1 floor 50-100% of target

## Aggregate counts (73 audited)

| Status | Count |
|---|---:|
| P0 (軸 4 / Unsplash+ / IP / duplicate content) | **18** |
| P1 (軸 3 / heavy floor) | 48 |
| P2 (軸 2 / floor 50-100%) | 5 |
| Clean (all 4 axes PASS) | **2** |

**Plus 4 already-fixed P0 articles** (Step 1, not in this audit): jjk-sweets-paradise, detective-conan-cafe-2026-japan-guide, japan-ic-card-transit-guide, kamakura-slam-dunk-pilgrimage-2026.

**Plus 2 clean articles**: chiikawa-bakery-harajuku-guide-2026 (10 real on-site photos) + one-piece-cafe-gene-shibuya-guide-2026 (9/9 PASS, gold-standard reference for IP+venue imagery).

## P0 list (18 articles, ordered by severity)

### Tier P0-A — full content replacement (article-wide repair)

1. **rilakkuma-cafe-tokyo-osaka-2026** — body-goods.webp + body-menu.webp are pixel-duplicates of Krispy-Kreme/Mario Galaxy assets; ZERO Rilakkuma content. Hero replaced in Track H Wave 2A but body still wrong.
2. **gachapon-guide-japan** — 5/6 rendered body images off-topic (Game Boy, coral reef, Shibuya scramble, anime polaroids, kids reading books). No gachapon content.

### Tier P0-B — IP/copyright violation

3. **blue-lock-tokyo-skytree-cafe-2026** — featured.jpg + body-1.jpg are anime production-committee IP key visuals (EGOIST Exhibition + Honey Lemon Cafe banner). Track H Wave 2C replaced featured.webp but featured.jpg still on disk and may be referenced.
4. **jujutsu-kaisen-cafes-japan-2026-guide** — Unsplash+ on 2.jpg + Totoro/Crayon-Shinchan IP mismatches
5. **luvlab-harajuku-diy-accessory-experience** — 1 hashtag-overlay composite (`product-overview`) + 4 white-bg studio cutouts (banned stock-photo pattern)
6. **animejapan-2026-guide-international-visitors** — Unsplash+ watermarks on 1.jpg + 4.jpg

### Tier P0-C — Unsplash+ contamination (most articles)

7. **anime-day-trips-from-tokyo-2026** — 1.jpg Unsplash+ watermark
8. **ghibli-park-complete-guide-2026** — 4 Unsplash+ watermarked files
9. **japan-rail-pass-2026-guide** — 4 Unsplash+ watermarked files
10. **japan-rail-pass-guide-anime-fans** — 5 Unsplash+ watermarked files
11. **japan-travel-insurance-2026** — 5 Unsplash+ watermarked files + 2 illustration composites + 5 non-Japan stock photos
12. **naruto-tokyo-pilgrimage-2026** — 6/8 Unsplash+ watermarked + featured = Awajishima Nijigen no Mori (NOT Tokyo)
13. **one-piece-tokyo-guide-2026** — Unsplash+ contamination
14. **osaka-anime-collab-cafes-pop-culture-2026** — Unsplash+ watermarks
15. **pokepark-kanto-tokyo-2026** — Unsplash+ watermarks
16. **slam-dunk-kamakura-pilgrimage-2026** — Unsplash+ watermarks (note: separate from kamakura-slam-dunk-pilgrimage-2026 which IS already-fixed; this is an older slug variant still in repo)
17. **tokyo-anime-collab-cafes-summer-2026** — Unsplash+ tiled watermarks + topic mismatch
18. **universal-cool-japan-2026-guide** — Unsplash+ tiled watermarks

## P1 list (48 articles)

Topic mismatches (most user-visible):
- **how-to-book-anime-collab-cafe-japan** — featured = Doraemon manga lounge (NOT Lawson Loppi). 29 inbound links → high-traffic topic-mismatch.
- **apothecary-diaries-oshi-tabi-osaka-shinkansen-2026** — box-cafe shows Chiikawa Bakery cup; doshomachi shows asphalt road markings instead of Sukunahikona Shrine
- **best-anime-tours-tokyo-2026** — body4 = Kyoto pagoda, body5 = Mt Fuji (wrong region for Tokyo article)
- **anime-hotels-tokyo-2026** — 1.jpg generic hotel corner with no anime decor
- **animejapan-comiket-2026-guide** — 1.jpg generic empty street
- **ikebukuro-anime-guide-2026** — body3 = Shibuya (wrong district)
- **japan-trip-checklist-anime-fans-2026** — body3 = Shibuya, body4 = seashell, body5 = Akihabara
- **mha-cafe-tokyo-2026** — 2.jpg shows anime izakaya with Naruto+Kimetsu+Dragon Ball signage on an MHA-cafe article (4 IPs visible, 1 article topic — egregious mismatch)
- **jr-pass-anime-pilgrimage-routes-2026** — body3/body4 alt says Shinkansen/JR-Pass but pixels show Tsutenkaku and Tokyo Tower
- **kumamoto-statue** (one-piece-kumamoto-statue-tour) — shows no Straw Hat statues despite being titled "statue tour"
- **weathering-with-you-locations-tokyo** — featured = Shibuya Scramble (wrong district for the film, which uses Tenocha/Shimbashi area)
- **spy-family-tokyo-fan-day-2026** — 1.jpg = Tokyo Intl Forum (not a SPY×FAMILY collab venue)
- **tokyo-anime-collab-cafes-spring-2026** — body5.jpg = Game Boy/Tetris (caption says "collab cafe merchandise")

Floor failures (severe shortfalls):
- gaming-tokyo-2026 (1/5)
- japan-proxy-shopping-2026 (1/8)
- how-to-book-anime-collab-cafe-japan (1/8)
- anime-merch-shopping-guide-japan (1/9)
- anime-pilgrimage-spots-tokyo (1/7)
- book-japan-anime-events-overseas-2026 (1/7)
- kyoto-anime-guide-2026 (2/9)
- jujutsu-kaisen-shibuya-locations-2026 (2/9)
- mha-cafe-tokyo-2026 (2/5)
- japan-trip-checklist-anime-fans-2026 (5/12)

EXIF rotation bug (round-4 carryover):
- **osaka-anime-guide-den-den-town** — body-wikimedia-2/3 are 90°-sideways (same EXIF transpose bug as round-4; jjk fix already done in 8b71010 but other round-4 articles leaked)

Low-res hero/featured:
- pokemon-center-tokyo-complete-guide-2026 (hero 141 KB thumb)
- pokemon-karaoke-manekineko-30th-anniversary-2026 (hero 171 KB thumb — note: this was Track H Wave 2A replacement, agent picked a smallish source)
- animate-cafe-guide-japan body-wikimedia-1 (480px) + body-wikimedia-2 (600px) — round-4 carryover

Caption/pixel drift:
- jr-pass body3/body4 (alt says JR ticket; pixels show Tsutenkaku + Tokyo Tower)
- mha-cafe-tokyo 2.jpg (alt says MHA cafe; pixels show Naruto+Kimetsu+Dragon Ball izakaya)

## Repo hygiene flags (16+ orphan Unsplash+ files on disk)

Not currently rendered, but lingering:
- chainsaw-man-pilgrimage-tokyo: 1-7.jpg
- cosplay-experience-tokyo-2026: 1.jpg / 2.jpg / 4.jpg / 5.jpg
- detective-conan-pilgrimage-events-2026: 2-5.jpg
- familymart-anime-collab-stores-2026: 2-3.jpg

These should be deprecated (renamed to `.deprecated.jpg`) per the JJK pattern even if MDX doesn't reference them. Agents may otherwise mistakenly point at them in future rounds.

## Sub-doc references (per-batch detail)

- `docs/images/4-axis-audit-batch-aa-20260426.md` — 13 articles
- `docs/images/4-axis-audit-batch-ab-20260426.md` — 13 articles
- `docs/images/4-axis-audit-batch-ac-20260426.md` — 13 articles
- `docs/images/4-axis-audit-batch-ad-20260426.md` — 13 articles
- `docs/images/4-axis-audit-batch-ae-20260426.md` — 13 articles
- `docs/images/4-axis-audit-batch-af-20260426.md` — 8 articles

## Step 3 fix priority order

For Step 3, fix in this order to maximize AdSense readiness gain per fix:

1. **Tier P0-A (2)** — full article repair (rilakkuma, gachapon)
2. **Tier P0-B (4)** — IP/copyright (blue-lock, jjk-cafes-2026, luvlab, animejapan-international)
3. **Tier P0-C (12)** — Unsplash+ contamination across travel-tips + pilgrimage articles
4. **Top P1 (10)** — visible topic mismatches with high inbound links (how-to-book, kumamoto-statue, weathering-with-you, mha-cafe, jr-pass, etc.)
5. **Floor shortfalls** — bring 10 articles with 1-2 images up to 5+
6. **Round-4 carryovers** — den-den-town EXIF + animate-cafe low-res
7. **Repo hygiene** — orphan .jpg cleanup

## Estimated work scope

If each P0 article needs 4-5 image replacements (audit + Wikimedia/公式 search + Pillow + MDX update + verify):
- 18 P0 × ~30 min = ~9 hours of agent work
- 48 P1 × ~15 min = ~12 hours

Realistic phase plan:
- **Phase 3a** (this turn): top 4 P0 articles (parallel agents)
- **Phase 3b** (next turn): remaining 14 P0
- **Phase 3c** (subsequent turns): P1 batch
- **Phase 3d**: P2 + repo hygiene

Per user's explicit demand "全部に反映" (apply to all articles), this is multi-day work.
