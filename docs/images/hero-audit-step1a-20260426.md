---
title: "Hero Audit Step 1a (9 files, 2026-04-26)"
---

# Hero Audit Step 1a

| slug | classification | description | text overlay? | replacement priority |
|---|---|---|---|---|
| akihabara-arcade-rhythm-games-guide-2026 | A | Real photo of a SOUND VOLTEX arcade cabinet mid-play, player visible from behind, vibrant in-game gameplay screen | yes (in-game UI: "SOUND VOLTEX", score counters — part of the cabinet, not overlay) | keep |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | A | Real night photo of Osaka Dotonbori street arcade with red neon "道頓堀" gate, Asahi signage, pedestrians | no | keep |
| chiikawa-land-tokyo-complete-2026 | A | Real photo inside Chiikawa Bakery store interior, customers shopping, large mascot statue (yellow Chiikawa) on counter, blue logo wall | minor (in-store signage "CHIIKAWA BAKERY" — diegetic) | keep |
| dark-moon-chara-cafe-ikebukuro-2026 | C | Aerial dusk photo of generic Tokyo cityscape with highway interchange — no cafe, no Ikebukuro landmark, no character branding; topic mismatch and feels like a stock filler | no | P0 |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | A | Real photo of Shibuya Scramble Crossing, neon billboards (UNIQLO, H&M, Shibuya 109), cars and crowds — vivid documentary night shot | no (only diegetic billboards) | keep (note: topic mismatch — Shibuya, not ufotable cafe; reclassify as B/borderline P2 if strict) |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | A | Real aerial photo of Shibuya Center-gai at night, illuminated billboards and crowd flowing through the alley | no | keep (topic mismatch — Shibuya not Conan cafe; borderline P2) |
| japan-ic-card-transit-guide | C | Flat illustration: navy background with bubble pattern, green Suica-style rectangle with NFC waves, title text "Suica IC card — Japan transit 2026" bottom-left | yes, "Suica IC card — Japan transit 2026" | P1 |
| jjk-sweets-paradise-complete-guide-2026 | C | Generated infographic: dark gradient bg, big "JJK x Sweets Paradise / 5th Anniversary Cafe / 9 cities * April 2-29, 2026" title block, decorative donut shape, "5 YEARS" red badge, city labels strip at bottom | yes, full title block + city list | P0 |
| jojo-stone-ocean-cafe-jojo-world-2026 | A | Real photo of dense Tokyo merch/character-goods shop interior (likely Takeshita-dori / Harajuku), packed with shoppers and rainbow displays | minor (Japanese in-shop signs — diegetic) | keep (topic mismatch — generic Harajuku, not Jojo World; borderline P2) |

## Counts
- A: 6
- B: 0
- C: 3 (replacement targets)
- D: 0
- (Topic-mismatch flag on 3 of the A-class images — see Notable findings)

## Notable findings
- **P0 generated infographic on collab cafe**: `jjk-sweets-paradise-complete-guide-2026/hero.webp` is a textbook AdSense-blocking design composite (gradient bg + bold sans title + decorative donut + city-label strip). Highest replacement priority.
- **P0 content mismatch + low-effort**: `dark-moon-chara-cafe-ikebukuro-2026/hero.webp` is a generic Tokyo aerial with no Ikebukuro identifier and no cafe/character relevance — reads as a placeholder.
- **P1 schematic illustration**: `japan-ic-card-transit-guide/hero.webp` is a flat vector-style Suica mock with overlaid title text. Functional but clearly design, not photo. Lower traffic/severity than collab-cafe articles.
- **Topic-mismatch on 3 A-class photos**: `demon-slayer-rerun-cafe-ufotable-kizuna-2026` (Shibuya Scramble), `detective-conan-cafe-tokyo-osaka-3venue-2026` (Shibuya Center-gai), and `jojo-stone-ocean-cafe-jojo-world-2026` (generic Harajuku merch shop) all use real photos but none depict the actual collab venue. Strict reading would label these P2 (content mismatch). They pass AdSense visual-quality bar but weaken topical relevance / E-E-A-T signal.
- **Cleanly keep (4)**: akihabara-arcade (SOUND VOLTEX cabinet — perfect topical match), apothecary-diaries (Dotonbori — matches Osaka shinkansen oshi-tabi), chiikawa-land (actual Chiikawa Bakery interior — excellent match).
- No D-class watermark/Unsplash branding detected on any of the 9 files.
- Recommended replacement order: (1) jjk-sweets-paradise, (2) dark-moon-chara-cafe, (3) japan-ic-card-transit-guide, then optionally re-shoot/re-source the 3 topic-mismatched A-class heroes.
