---
title: "Track H — Generated Infographic Hero/Featured Audit + Replacement Summary (2026-04-26)"
date: 2026-04-26
author: Takapon (via Claude Code)
context: 24h sprint Track H. User feedback flagged jjk-sweets-paradise hero as a generated infographic with "menu at a glance" text + 8-character donut graphic — AdSense-blocking placeholder pattern. Audit confirmed the pattern was repo-wide, not isolated.
---

# Track H — Image Audit + Replacement Summary

## Audit results (Step 1)

Sub-reports:
- `docs/images/hero-audit-step1a-20260426.md` — 9 hero.webp files (alphabetical first half)
- `docs/images/hero-audit-step1b-20260426.md` — 9 hero.webp files (alphabetical second half)
- `docs/images/hero-audit-step1c-20260426.md` — 35 featured.* files (representative sample of 65)

### Aggregate counts

| Tier | hero.webp (18) | featured.* (35 sampled / 65 total) | Total flagged |
|---|---:|---:|---:|
| **A 実写 OK** | 13 | ~30 (85%) | majority |
| **B Wikimedia neutral OK** | 0 | 0 | 0 |
| **C Generated infographic NG** | 4 | 1 confirmed (~2 extrapolated) | **5** |
| **D Unsplash/watermark/mismatch NG** | 1 | 4 confirmed (~5-6 extrapolated) | **5** |

**Replacement priority targets (P0/P1 confirmed): 9 articles**

## Replacements (Step 2-3)

All 9 replacement targets cleared via Wikimedia Commons. **0 articles needed Takapon photoshoot.**

### P0 — Generated infographics (4 hero replaced)

| commit | slug | replacement | source |
|---|---|---|---|
| 76a0250 | jjk-sweets-paradise | Sweets Paradise Umeda storefront | CC BY-SA 4.0, Tokumeigakarinoaoshima |
| f8c90f8 | dark-moon-chara-cafe-ikebukuro-2026 | Sunshine City Atrium (Ikebukuro) | CC BY 2.0, Dick Thomas Johnson |
| 3c1e342 | pokemon-karaoke-manekineko-30th-anniversary-2026 | Karaoke Manekineko Fukkusaki (3rd distinct chain venue) | CC BY-SA 4.0, Chacmool |
| df0504f | rilakkuma-cafe-tokyo-osaka-2026 | **Real Rilakkuma Cafe Arashiyama** (recovered from wrong-folder Mario Galaxy) | CC BY 2.0, Gordon Cheung |

### P0 — Featured.* watermarks/stock/IP (4 replaced)

| commit | slug | replacement | source |
|---|---|---|---|
| 4eaea5a | cosplay-experience-tokyo-2026 | Shibuya Halloween 2023 (Tokyo cosplay context) | CC BY 2.0, Dick Thomas Johnson |
| bb22680 | japan-luggage-forwarding-2026 | Sagawa delivery truck (distinct from body Yamato van) | CC0, Syced |
| 38ee802 | japan-esim-pocket-wifi-sim-card | SIM card vending machine (real Japan transit context) | CC BY-SA 4.0, Z thomas |
| 1e865c4 | blue-lock-tokyo-skytree-cafe-2026 | Tokyo Skytree from base (daytime ground angle, distinct from body night view) | CC BY-SA 4.0, Ruthsic |

### Duplicate dedup (1 replaced)

| commit | slug | replacement | source |
|---|---|---|---|
| 3d5feaa | golden-week-2026-anime-events-complete-guide | Koinobori matsuri Sagami River (Children's Day = GW finale) | CC BY 2.0, Guilhem Vellut |

The Meguro River sakura remains on `tokyo-anime-collab-cafes-spring-2026` (63 inbound links — kept on the higher-priority article).

### Source breakdown

- **Wikimedia Commons**: 9/9 (100%)
- **公式 X/Threads**: 0 (not needed)
- **公式 web press**: 0 (not needed)
- **Google Maps owner**: 0 (not needed)

## Source 不在 (Step 4) — **0 escalations**

All 9 P0 replacement targets had viable Wikimedia coverage. No Takapon photoshoot queue additions needed. The expected pattern from prior audits ("cafe → Wikimedia 0% → photoshoot") again proved wrong: chain venue exteriors (Sweets Paradise, Sunshine City, Karaoke Manekineko, Rilakkuma Cafe Arashiyama, Tokyo Skytree, Sagawa truck, SIM vending machines) are well-documented on Commons.

## jjk-sweets-paradise 即修正 (Step 5)

- **採用 source**: `File:SWEETS_PARADISE_Umeda_shop.jpg` (CC BY-SA 4.0, Tokumeigakarinoaoshima)
- **commit SHA**: `76a0250`
- **結果**: 1200×720 WebP, 160.6 KB, bpp 1.487, real Sweets Paradise venue exterior (distinct from body-wikimedia-1 Nagoya Spiral Towers and body-wikimedia-2 Yokohama Vivre).
- **frontmatter changes**:
  - heroImageAlt → "Sweets Paradise Umeda storefront in Osaka — illustrative chain venue, one of the cities hosting the Jujutsu Kaisen 5th Anniversary cafe in April 2026"
  - imageCredit → "Photo: Tokumeigakarinoaoshima / Wikimedia Commons, CC BY-SA 4.0"

## Deferred (P1/P2/Phase 3+)

| slug | issue | tier | recommended action |
|---|---|---|---|
| japan-ic-card-transit-guide | flat Suica mock with overlay text | P1 (hero) | Wikimedia Suica/PASMO commuter scene next sprint |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | real Shibuya photo, wrong venue | P2 (mismatch) | Replace with ufotable Tokyo studio area photo |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | real Shibuya photo, wrong venue | P2 (mismatch) | Replace with venue-specific Wikimedia |
| jojo-stone-ocean-cafe-jojo-world-2026 | real Harajuku photo, wrong venue | P2 (mismatch) | Replace with jojo-world venue or neutral cafe |
| (~17 featured.* extrapolated) | content mismatch (Yokohama for Tokyo etc.) | P2 (review) | Slug-by-slug review — Phase 3 sprint |
| (5 not-yet-audited featured.*) | extrapolated D risk (Unsplash leakage) | review | Sample once full repo state stabilizes |

## 影響

| Metric | Before Track H | After Track H |
|---|---:|---:|
| Generated-infographic hero | 4 | 0 |
| Watermarked/stock featured | 4 | 0 |
| Wrong-folder content (Krispy Kreme/Mario in Rilakkuma) | 1 | 0 |
| Duplicate hero across articles | 1 pair | 0 |
| LOW_DENSITY count | 15 | 14 (≤ cap 20, Gate 3 PASS) |
| P0 FATAL | 0 | 0 (Gate 3a PASS) |
| **Core 5 maintained** | ✅ | ✅ |

## Total Track H commits (9)

```
76a0250 hero P0 jjk-sweets-paradise
f8c90f8 hero dark-moon-chara-cafe-ikebukuro
3c1e342 hero pokemon-karaoke-manekineko-30th
df0504f hero rilakkuma-cafe-tokyo-osaka
4eaea5a featured cosplay-experience-tokyo
bb22680 featured japan-luggage-forwarding
38ee802 featured japan-esim-pocket-wifi-sim-card
1e865c4 featured blue-lock-tokyo-skytree-cafe
3d5feaa featured golden-week (dedup vs spring)
```

All on origin/main as of 2026-04-26.
