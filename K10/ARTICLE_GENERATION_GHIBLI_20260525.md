# Article Generation Log — Ghibli Museum Mitaka 2026 Visitor Guide

Started 2026-05-25, continued 2026-05-26.

| Phase | Step | Status |
|---|---|---|
| 1 | Brief read | ✅ |
| 1 | ghibli-park sibling read | ✅ |
| 1 | pokemon-center golden-standard read | ✅ |
| 1 | Wikimedia Commons API query × 4 (Ghibli Museum / Mitaka Station / Inokashira Park / supplementary) | ✅ |
| 1 | Source URL HTTP verify (museum + Lawson + Wikipedia, all 200; l-tike.com root 000 / use lawson.co.jp/ghibli_museum path) | ✅ |
| 1 | Operator data extracted (hours / price / address / Saturn rotation / Robot statue verbatim) | ✅ |
| 2 | TL;DR | ⏳ |
| 2 | Visit at a glance | ⏳ |
| 2 | 11 H2 body sections | ⏳ |
| 3 | Wikimedia download + WebP convert | ⏳ |
| 3 | Image placement + frontmatter wire | ⏳ |
| 4 | PR + CI + merge | ⏳ |
| 5 | Live prod verify | ⏳ |

## Image candidates (verified via Wikimedia Commons API)

| Role | File | Dimensions | License | Artist |
|---|---|---|---|---|
| hero | Ghibli_Museum,_Mitaka,_Tokyo,_20240823_1131_5545.jpg | 3905×5868 | CC BY 4.0 | Jakub Hałun |
| body-exterior | Ghibli Museum, Mitaka (9406835593).jpg | 2930×3906 | CC BY 2.0 | Rob Young |
| body-sign | Ghibli Museum sign, Mitaka 2014-04-23.jpg | 2448×3264 | CC BY 4.0 | Thibaut120094 |
| body-bus | Mitaka City Bus C3012 (Ghibli Museum) at Mitaka Station Bus Stop 9, Front View.jpg | 3024×4032 | CC BY-SA 4.0 | Christopher Corneschi |
| body-station | JR East Mitaka Station Gate, Mitaka City 20240128.jpg | 6000×4000 | CC BY-SA 4.0 | Mister0124 |
| body-inokashira | Swanboats on Inokashira Pond - Sep 20, 2019.jpg | 5184×3456 | CC BY 2.0 | Real Estate Japan |

6 images total = floor for 2400w article (ceil(2400/400)=6). No Robot Soldier closeup (IP / derivative concerns), no museum interior (operator-prohibited).

## Source URLs verified HTTP 200 (2026-05-26)

- https://www.ghibli-museum.jp/en/                        (museum EN root)
- https://www.ghibli-museum.jp/en/tickets/                 (ticket policy SoT)
- https://www.ghibli-museum.jp/en/hours-and-directions/   (hours / access SoT)
- https://www.ghibli-museum.jp/en/welcome/                (exhibits / shop / cafe SoT)
- https://www.ghibli-museum.jp/en/films/                  (Saturn Theater rotation SoT)
- https://www.ghibli-museum.jp/en/info/                   (accessibility policy)
- https://www.ghibli-museum.jp/en/contacts/               (contact)
- https://www.ghibli-museum.jp/                           (JP root)
- https://www.lawson.co.jp/ghibli_museum/                 (Lawson Ticket entry)
- https://www.lawson.co.jp/ghibli_museum/english.html     (Lawson Ticket EN)
- https://ghibli-park.jp/en/ticket/                       (Ghibli Park comparison source)
- https://en.wikipedia.org/wiki/Ghibli_Museum             (history)

Note: `l-tike.com/static/lottery/spe0102/ghibli/` and `l-tike.com/ghibli/` return 000 to my curl (likely geo/anti-bot); the canonical entry is via lawson.co.jp/ghibli_museum/english.html which forwards to the actual purchase flow at `l-tike.com/st1/ghibli-en/...` (verified path exists, returns 000 to scraper).
