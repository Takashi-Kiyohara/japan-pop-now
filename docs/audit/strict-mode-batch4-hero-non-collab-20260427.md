# Strict-mode Batch 4 — 軸5 Hero Audit (Non-Collab Sweep)

Date: 2026-04-27
Auditor: Claude (Opus 4.7 1M context)
Scope: 51 non-collab articles (collab batch handled by parallel agents)

## 軸5 axes recap

- 軸5-1 Frame fit: subject not cut off, no letterbox, no distortion under 1200x720 cover crop with `centering=(0.5, 0.35)`.
- 軸5-2 Subject clarity: article subject (venue, gear, IP) immediately identifiable in cropped frame.
- 軸5-3 Communicate-value: composition expresses thesis (e.g. "JR Pass guide" hero should show Pass/Shinkansen).

## Matrix

| slug | hero ref | 5-1 | 5-2 | 5-3 | verdict | replaced? | source | commit |
|------|----------|-----|-----|-----|---------|-----------|--------|--------|
| akihabara-arcade-rhythm-games-guide-2026 | hero.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| akihabara-complete-guide-2026 | featured.jpg 1920x1275 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| animate-cafe-guide-japan | featured.jpg 1920x1280 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| anime-day-trips-from-tokyo-2026 | featured.jpg 2064x1300 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| anime-hotels-tokyo-2026 | featured.jpg 1920x1280 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| anime-merch-shopping-guide-japan | featured.jpg 1920x1440 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| anime-pilgrimage-spots-tokyo | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| animejapan-2026-guide-international-visitors | featured.jpg 1920x1440 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| animejapan-comiket-2026-guide | featured.jpg 1920x1440 | PASS | MARG | MARG | PASS-borderline | no | n/a | n/a |
| best-anime-tours-tokyo-2026 | featured.jpg 1920x1280 | PASS | PASS | MARG | PASS-borderline | no | n/a | n/a |
| book-japan-anime-events-overseas-2026 | featured.jpg 1920x1283 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| chainsaw-man-pilgrimage-tokyo | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| cosplay-experience-tokyo-2026 | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| detective-conan-pilgrimage-events-2026 | featured.webp 1200x720 | PASS | MARG | PASS | PASS-borderline | no | n/a | n/a |
| first-timers-japan-playbook-anime-fans-2026 | featured.jpg 1920x1246 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| gachapon-guide-japan | featured.jpg 1280x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| game-centers-arcades-japan | featured.jpg 1920x1272 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| gaming-tokyo-2026 | featured.jpg 1920x1440 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| golden-week-2026-anime-events-complete-guide | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| how-to-book-anime-collab-cafe-japan | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| ikebukuro-anime-guide-2026 | featured.jpg 1920x1440 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-esim-pocket-wifi-sim-card | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-ic-card-transit-guide | hero.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-luggage-forwarding-2026 | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-proxy-shopping-2026 | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-rail-pass-2026-guide | hero-wikimedia.webp 1600x1200 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-rail-pass-guide-anime-fans | hero-wikimedia.webp 1600x1066 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-travel-insurance-2026 | hero-wikimedia.webp 1600x1204 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| japan-trip-checklist-anime-fans-2026 | featured.jpg 1920x1280 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| jr-pass-anime-pilgrimage-routes-2026 | featured.jpg 1280x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| kamakura-slam-dunk-pilgrimage-2026 | hero.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| kyoto-anime-guide-2026 | featured.jpg 1920x1280 | PASS | PASS | MARG | PASS-borderline | no | n/a | n/a |
| lawson-ticket-anime-cafe-booking | featured.jpg 1920x1080 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| luvlab-harajuku-diy-accessory-experience | interior-table.webp 1105x829 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| nakano-broadway-guide | featured.jpg 1920x1274 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| naruto-tokyo-pilgrimage-2026 | featured.webp 1200x720 | PASS | MARG | MARG | PASS-borderline | no | n/a | n/a (alt explicitly says "illustrative venue context for the Naruto pilgrimage route" — JUMP SHOP is the article's recommended Naruto merch destination since Tokyo lacks Naruto-specific venues per the article's opening paragraph) |
| one-piece-cafe-gene-shibuya-guide-2026 | moe-featured.jpg 1200x900 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| one-piece-kumamoto-statue-tour | featured.jpg 1200x720 | PASS | FAIL | FAIL | FAIL | no (no source) | source-absent | flagged for Takapon photoshoot |
| one-piece-tokyo-guide-2026 | hero-wikimedia.webp 1200x720 | PASS | MARG | MARG | PASS-borderline | no | n/a | n/a |
| osaka-anime-cafes-complete-guide-2026 | hero.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| osaka-anime-collab-cafes-pop-culture-2026 | hero-wikimedia.webp 1200x720 | PASS | MARG | MARG | PASS-borderline | no | n/a | n/a |
| osaka-anime-guide-den-den-town | featured.jpg 2064x1300 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| shibuya-harajuku-pop-culture-guide | featured.jpg 1920x1275 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| ship-anime-figures-merch-home-japan | featured.jpg 1920x1446 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| slam-dunk-kamakura-pilgrimage-2026 | featured.jpg 1920x1280 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| tokyo-anime-collab-cafes-spring-2026 | featured.jpg 1920x1440 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| tokyo-anime-collab-cafes-summer-2026 | featured.jpg 1920x1437 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| tokyo-anime-district-guide | featured.jpg 1920x1280 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| weathering-with-you-locations-tokyo | featured.jpg 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| wonder-festival-figure-events-japan-2026 | featured.webp 1200x720 | PASS | PASS | PASS | PASS | no | n/a | n/a |
| your-name-pilgrimage-tokyo | featured.jpg 1920x1440 | PASS | PASS | PASS | PASS | no | n/a | n/a (alt-text mismatch noted: image is Suga Shrine stairs, alt says Yunika Vision) |

## Summary

- Total non-collab articles audited: 51
- Hero PASS: 50 (incl. 6 PASS-borderline: animejapan-comiket-2026-guide, best-anime-tours-tokyo-2026, detective-conan-pilgrimage-events-2026, kyoto-anime-guide-2026, naruto-tokyo-pilgrimage-2026, one-piece-tokyo-guide-2026, osaka-anime-collab-cafes-pop-culture-2026 — 7 borderline)
- Hero FAIL: 1
  - one-piece-kumamoto-statue-tour — hero shows Kumamoto Prefectural Government Office building only, no Luffy bronze statue visible (article's central thesis is "All 10 Straw Hat statues" so the hero must show a statue)
- Replacements completed: 0
- Replacements with no available source (flagged): 1 (one-piece-kumamoto-statue-tour)

## Source-absence note (one-piece-kumamoto-statue-tour)

Searched Wikimedia Commons for: "Luffy statue Kumamoto", "Monkey D Luffy bronze", "ルフィ像", "ONE PIECE Kumamoto", "Kumamoto Prefectural Office Luffy". All returned zero matches. No Wikimedia file documents the Luffy statue at Kumamoto Prefectural Government Office.

Per memory rule (`feedback_official_image_modification_ok.md` § "When agent reports 'no source found'"):
1. Slug documented in this audit doc.
2. Flag for Takapon photoshoot priority queue: capture Luffy statue at Kumamoto Prefectural Government Office, ideally including statue + building context.
3. Hero left unchanged for now; current hero correctly identifies the venue (statue #1 is at this office) but does not show the statue itself.
4. Generation banned per memory rule — no placeholder created.

## Notes

- `your-name-pilgrimage-tokyo` alt text is wrong (says "Yunika Vision" but image is Suga Shrine stairs). Image itself is correct subject — alt-text fix recommended in a separate text-only commit, not this hero audit.
- Borderline PASSes flagged for future review but pass 軸5 minimum.
- `naruto-tokyo-pilgrimage-2026` hero (JUMP SHOP) initially flagged FAIL but reclassified PASS-borderline: the article's opening paragraph explicitly states Tokyo lacks Naruto-specific pilgrimage venues, JUMP SHOP is the article's primary recommended destination, and the alt text honestly labels it "illustrative venue context".
- Pokemon-themed `anime-hotels-tokyo-2026` hero contains Pokemon IP visuals — outside this audit's hero-fit scope; provenance review recommended separately.
- All 51 heroes have aspect ratios within usable bounds (1.33–1.78). No "too horizontal" hero detected; the user's prior "too horizontal" feedback applies to no slug in this non-collab batch (the issue was concentrated in the collab batch handled by parallel agents).
