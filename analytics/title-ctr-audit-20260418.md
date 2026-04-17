---
name: title-ctr-audit-20260418
description: CTR-optimization audit of all 58 article titles — 33 exceed 60 chars, 20 pass, 7 P0 rewrites flagged for Takapon daytime review.
type: report
---

# Title CTR Audit — 2026-04-18

**Audit only. No files rewritten.** Bulk title rewrites risk breaking inbound links and GSC position tracking — surfaced here for Takapon to triage.

## Summary

- **Total articles audited:** 58 (excluding `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated`)
- **PASS (zero flags):** 20
- **OVER_60 chars:** 33
- **WEAK_OPENING:** 6
- **NO_NUMBER:** 2
- **NO_YEAR:** 4
- **EVEN_NUMBER:** 5
- **P0 (multi-flag):** 7
- **P1 (OVER_60 single-flag):** ~27
- **P2 (single non-length):** 5

## Top-10 Rewrite Candidates

Prioritize these — highest overrun + flag severity.

| # | Slug | Cur. chars | Flag |
|---|------|-----------:|------|
| 1 | `shibuya-harajuku-pop-culture-guide` | 105 | OVER_60 |
| 2 | `animejapan-2026-guide-international-visitors` | 104 | OVER_60 |
| 3 | `ikebukuro-anime-guide-2026` | 102 | OVER_60 |
| 4 | `universal-cool-japan-2026-guide` | 96 | OVER_60 |
| 5 | `game-centers-arcades-japan` | 95 | OVER_60 + WEAK_OPENING (P0) |
| 6 | `demon-slayer-pilgrimage-tokyo` | 94 | OVER_60 |
| 7 | `detective-conan-cafe-2026-japan-guide` | 92 | OVER_60 |
| 8 | `weathering-with-you-locations-tokyo` | 91 | OVER_60 |
| 9 | `how-to-book-anime-collab-cafe-japan` | 90 | OVER_60 + WEAK_OPENING (P0) |
| 10 | `japan-esim-pocket-wifi-sim-card` | 90 | OVER_60 |

## P0 (Highest Priority — multiple flags)

| Slug | Current | Chars | Flags | Suggested |
|---|---|---:|---|---|
| `game-centers-arcades-japan` | The Complete Guide to Japanese Game Centers & Arcades (2026) — Crane Games, Rhythm Games & More | 95 | OVER_60, WEAK_OPENING | Japan Game Centers 2026: Crane Games, Rhythm & Arcades Guide |
| `how-to-book-anime-collab-cafe-japan` | How to Book an Anime Collab Cafe in Japan [2026] — Step-by-Step Lottery and Walk-In Guide | 90 | OVER_60, WEAK_OPENING | Book Anime Collab Cafes Japan [2026]: Lottery & Walk-In Guide |
| `one-piece-kumamoto-statue-tour` | One Piece Kumamoto Statue Tour 2026 — All 10 Straw Hat Statues, Locations, and Itinerary | 88 | OVER_60, EVEN_NUMBER | One Piece Kumamoto Tour 2026: All 9 Straw Hat Statue Spots |
| `luvlab-harajuku-diy-accessory-experience` | LuvLab Harajuku: Make Your Own Italian Charms, Snake Bracelets and Custom Keychains | 83 | OVER_60, NO_YEAR | LuvLab Harajuku 2026: DIY Charms, Bracelets & Keychains Guide |
| `animate-cafe-guide-japan` | How to Book Animate Cafe Japan [2026] — Lottery System, Locations and Gratte Guide | 82 | OVER_60, WEAK_OPENING | Animate Cafe Japan [2026]: Lottery, Locations & Gratte Guide |
| `tokyo-anime-collab-cafes-spring-2026` | Tokyo Anime Collab Cafes Spring 2026: 12 Open Now [With Map & Booking Tips] | 75 | OVER_60, EVEN_NUMBER | Tokyo Anime Collab Cafes Spring 2026: 11 Open Now [+Map] |
| `ship-anime-figures-merch-home-japan` | How to Ship Anime Figures & Merch Home from Japan: Complete Guide (2026) | 72 | OVER_60, WEAK_OPENING | Ship Anime Figures from Japan 2026: Full Carrier Guide |

## P1 (OVER_60 only)

27 articles. Full table in commit history or re-run seo-auditor agent. Notable:

- `animejapan-2026-guide-international-visitors` → `AnimeJapan 2026 Visitor Guide: Tickets, Access & Tips`
- `shibuya-harajuku-pop-culture-guide` → `Shibuya & Harajuku Pop Culture Guide 2026 [Walking Route]`
- `ikebukuro-anime-guide-2026` → `Ikebukuro Anime Guide 2026: Animate, Otome Road & Cafes`
- `kyoto-anime-guide-2026` → `Kyoto Anime Guide 2026: Pilgrimages, Studios & Otaku Spots`

## P2 (single non-length flag)

| Slug | Flag | Suggested |
|---|---|---|
| `anime-pilgrimage-spots-tokyo` | EVEN_NUMBER + NO_YEAR | 9 Anime Pilgrimage Spots in Tokyo You Can Visit Today [2026] |
| `first-timers-japan-playbook-anime-fans-2026` | WEAK_OPENING | First-Timer's Japan Anime Playbook 2026: What to Do & Book |
| `gaming-tokyo-2026` | EVEN_NUMBER | Gaming Tokyo 2026: Pokemon Center, Nintendo Store & 9 More |
| `akihabara-complete-guide-2026` | WEAK_OPENING (mid) | Akihabara 2026: Complete Pop Culture Guide [Map & Tips] |
| `book-japan-anime-events-overseas-2026` | WEAK_OPENING | Book Japan Anime Events from Overseas [2026]: Step-by-Step |

## Recommendation for Takapon

1. **Do not bulk-rewrite.** Each title change = GSC position reset risk. Rewrite 3–5 per week and watch impressions.
2. Start with the 7 P0 rewrites — biggest combined overrun + flag wins.
3. Preserve primary keyword stem (`demon-slayer-pilgrimage-tokyo` keeps "Demon Slayer Pilgrimage Tokyo" as front-anchor).
4. Verify the 5 articles with `EVEN_NUMBER` flags still match their body content after changing count (e.g. `one-piece-kumamoto` — body may list 10 statues).
5. Skip title changes for articles currently ranking top-10 in GSC — keep momentum.
