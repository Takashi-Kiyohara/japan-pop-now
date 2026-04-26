# 4-Axis Image Audit — Batch ab (Track H REDO 3rd Step 2)

Date: 2026-04-26
Scope: 13 articles
Method: read-only. Rendered prod HTML scraped, own-slug images Read locally (md5 == prod assumed).
Floor rule (simplified): own-slug rendered image_count >= 5.

| slug | wc | imgs | 軸 1 floor | 軸 2 res | 軸 3 topic | 軸 4 real | priority | brief |
|------|----|------|-----------|----------|-----------|-----------|----------|-------|
| chainsaw-man-pilgrimage-tokyo | 2525 | 1 | FAIL (1<5) | PASS | PASS | PASS | P1 | Only featured.jpg rendered; body imgs 1-7 exist on disk but aren't referenced from article body. featured.jpg = real Kanda streetscape, on-topic. |
| chiikawa-bakery-harajuku-guide-2026 | 2636 | 10 | PASS | PASS (1200×900+) | PASS | PASS | clean | All 10 own-slug images are real on-site Chiikawa Bakery photos with branding visible. |
| chiikawa-land-tokyo-complete-2026 | 3035 | 3 | FAIL (3<5) | PASS (1200×720/800) | PASS | PASS | P1 | hero+body-merch+body-ticket all real interior shots of Chiikawa Land venue; below floor only. |
| cosplay-experience-tokyo-2026 | 1825 | 2 | FAIL (2<5) | PASS | PASS | PASS | P1 | featured.webp = real Osu cosplay festival, 3.jpg = real Akihabara X figure shop. Both on-topic. (1/2/4/5.jpg on disk are Unsplash+ watermarked but NOT rendered.) |
| dark-moon-chara-cafe-ikebukuro-2026 | 1970 | 3 | FAIL (3<5) | PASS | PASS | PASS | P1 | hero=Sunshine City atrium fountain, body-cafe=Cinema Sunshine IMAX exterior, body-area=Ikebukuro Nishiichibangai gate. All real Ikebukuro location photos. |
| demon-slayer-pilgrimage-tokyo | 2163 | 3 | FAIL (3<5) | PARTIAL | PARTIAL | PASS | P1 | featured=Kaminarimon during festival OK; body-kaminarimon=daytime Kaminarimon OK; **body-wikimedia-1=Mt-Mitake forest landscape, no Demon Slayer/Tokyo connection, generic mountain scene (軸 3 wrong-topic).** |
| demon-slayer-rerun-cafe-ufotable-2026 | 2900 | 3 | FAIL (3<5) | FAIL | FAIL | PASS | P1 | featured.jpg = generic Shibuya Hotel Gracery night scene (Godzilla head visible) — NOT ufotable cafe. body-1.jpg = generic residential street, body-2.jpg = Shinjuku Kabukicho night scene with Godzilla. **All 3 wrong-topic; body-1/body-2 also 800×500 sub-1600 (軸 2 fail).** |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | 2645 | 5 | PASS | PASS | PARTIAL | PASS | P1 | hero=Shibuya scramble crossing (generic, not Demon Slayer). body-menu=narrow Tokyo backstreet (generic). body-venues=Kabukicho neon street (generic). body-wikimedia=Keio Inadazutsumi Station exterior. body-wikimedia-2=Tokyo aerial park view. **None show ufotable cafe IP/venue (軸 3 wrong-topic across all 5).** |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | 2662 | 1 | FAIL (1<5) | PASS | FAIL | PASS | P1 | Only hero.webp rendered = generic Shibuya scramble crossing aerial. **No Conan IP visible, no named cafe venue (HEP FIVE/GEMS Shibuya/Global Gate). 軸 3 wrong-topic.** body-menu/body-venues exist but are .deprecated.webp (not rendered). |
| detective-conan-pilgrimage-events-2026 | 2344 | 3 | FAIL (3<5) | PASS | PASS | PASS | P1 | featured.jpg = Conan Manga Factory entrance with Kaitou Kid+Conan murals (on-topic). 1.jpg = JR rural train, 6.jpg = Conan-train at station with conductor — both Tottori pilgrimage train scenes, on-topic real photos. (2/3/4/5.jpg on disk Unsplash+ watermarked but NOT rendered.) |
| familymart-anime-collab-stores-2026 | 989 | 2 | FAIL (2<5) | PASS | PASS | PASS | P1 | featured.jpg=FamilyMart Sunshine City exterior at night (Ikebukuro, on-topic), 1.jpg=FamilyMart corner store dusk (on-topic). Real photos. (2/3.jpg on disk Unsplash+ watermarked but NOT rendered.) |
| first-timers-japan-playbook-anime-fans-2026 | 2601 | 4 | FAIL (4<5) | PASS | FAIL | PASS | P1 | featured.jpg=Akihabara neon street (OK for anime-fan playbook). body1.jpg=**Hakone torii gate over lake — irrelevant to first-timer-anime-fan content (軸 3)**. body2.jpg=Asakusa Fujiden okonomiyaki shopfront (generic Asakusa). body3.jpg=Shibuya crossing night (generic). 3 of 4 are generic Tokyo/landmark stock-style shots, not playbook-specific (IC card/eSIM/luggage). |
| gachapon-guide-japan | 2406 | 6 | PASS | PASS | FAIL | FAIL | **P0** | featured.jpg=Gashapon Department Ikebukuro entrance (on-topic real photo OK). **body1.jpg=Game Boy + Tetris cartridge (wrong-topic, gaming not gachapon).** **body2.jpg=underwater coral reef (totally wrong-topic).** **body3.jpg=Shibuya scramble at night (wrong-topic).** **body4.jpg=anime polaroid photos arrangement (wrong-topic).** **body5.jpg=children reading books in what looks like Africa (totally wrong-topic, also no relation to Japan/gachapon).** 5 of 6 body images are unrelated to gachapon. |

## FAIL notes (1-line each)

- chainsaw-man: floor 1<5 — body 1-7.jpg exist (Unsplash+ watermarked) but not referenced from .md, so unrendered.
- chiikawa-land: floor 3<5 — add body images.
- cosplay: floor 2<5 — add real cosplay studio/event images; clean up unrendered Unsplash+ files on disk.
- dark-moon: floor 3<5 — add Sunshine City Animate Cafe interior or collab body shots.
- demon-slayer-pilgrimage-tokyo: body-wikimedia-1.webp wrong-topic (Mt Mitake forest, no Demon Slayer/Tokyo connection).
- demon-slayer-rerun-cafe-ufotable-2026: featured + body-1 + body-2 all generic Tokyo scenes, NOT ufotable cafe; body-1/body-2 also 800×500 sub-1600.
- demon-slayer-rerun-cafe-ufotable-kizuna-2026: 5 images render but none show ufotable cafe / Demon Slayer IP — all generic Tokyo/Shibuya/station/park.
- detective-conan-cafe-tokyo-osaka-3venue-2026: only hero rendered, generic Shibuya scramble — neither Conan IP nor any of HEP FIVE/GEMS Shibuya/Global Gate venues visible.
- detective-conan-pilgrimage-events: floor 3<5 — add Tottori Conan pilgrimage venue body shots.
- familymart-anime-collab-stores: floor 2<5 — add Famima collab merch displays.
- first-timers-japan-playbook-anime-fans: floor 4<5 + body1 (Hakone torii) is wrong-topic for anime-fan playbook.
- gachapon-guide-japan: P0 — body1 (Game Boy), body2 (coral reef), body3 (Shibuya), body4 (anime polaroids), body5 (children reading, non-Japan) all wrong-topic; body5 violates 軸 4 spirit + 軸 3.

## Repository hygiene flags (not in audit table — not rendered, but should be cleaned)

- chainsaw-man-pilgrimage-tokyo/{1,2,3,4,5,6,7}.jpg — Unsplash+ watermarked, not referenced.
- cosplay-experience-tokyo-2026/{1,2,4,5}.jpg — Unsplash+ watermarked, not referenced.
- detective-conan-pilgrimage-events-2026/{2,3,4,5}.jpg — Unsplash+ watermarked, not referenced (3 and 5 also identical).
- familymart-anime-collab-stores-2026/{2,3}.jpg — Unsplash+ watermarked, not referenced.
- detective-conan-cafe-tokyo-osaka-3venue-2026/body-{menu,venues}.deprecated.webp — already deprecated by filename.

These represent banned-source content (per official_image_modification_ok rule §5) sitting in repo even though current MDX/MD doesn't import them.

## Priority summary

- **P0** (軸 4 / generation / banned source actively rendered): **gachapon-guide-japan**
- **P1** (軸 3 wrong-topic OR floor<5): chainsaw-man-pilgrimage-tokyo, chiikawa-land-tokyo-complete-2026, cosplay-experience-tokyo-2026, dark-moon-chara-cafe-ikebukuro-2026, demon-slayer-pilgrimage-tokyo, demon-slayer-rerun-cafe-ufotable-2026, demon-slayer-rerun-cafe-ufotable-kizuna-2026, detective-conan-cafe-tokyo-osaka-3venue-2026, detective-conan-pilgrimage-events-2026, familymart-anime-collab-stores-2026, first-timers-japan-playbook-anime-fans-2026
- **P2** (軸 2 only): none (demon-slayer-rerun-cafe-ufotable-2026 already counted P1)
- **clean**: chiikawa-bakery-harajuku-guide-2026

Note: "5+ minimum" floor (per simplified spec) is far below the universal-rule ceil(wc/400) floor; under the universal rule, 12 of 13 fail (only chiikawa-bakery passes both).
