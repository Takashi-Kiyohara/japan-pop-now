# A4 — Legacy WP URL Pattern Scan (japan-pop-now)

Date: 2026-04-26
Scope: `content/articles/**.{md,mdx}` + `components/**.{tsx,ts}` + `app/**.{tsx,ts}` + `lib/**.{ts}`
Read-only audit (no files modified).

Canonical host (per `lib/url.ts` `SITE_URL`): `https://www.japan-pop-now.com`
Canonical article path: `/articles/<slug>/`

---

## 1. Summary — matches by pattern × bucket

| # | Pattern                              | A4a content (MDX body) | A4b component (tsx/ts) | A4c image-only (wp-uploads) | Total |
|---|--------------------------------------|------------------------|------------------------|-----------------------------|-------|
| 1 | `?p=` (WP post-id query)             | 0                      | 0                      | 0                           | 0     |
| 2 | `/wp-content/uploads/`               | 0                      | 0                      | 27                          | 27    |
| 3 | `/wp-content/` (other)               | 0                      | 0                      | 0 (all are uploads)         | 0     |
| 4 | `/2025/` `/2024/` `/2023/`           | 0                      | 0                      | 0                           | 0     |
| 5 | `?cat=`                              | 0                      | 0                      | 0                           | 0     |
| 6 | `/category/` (WP-style slug paths)   | 17                     | 23                     | 0                           | 40    |
| 7 | `japan-pop-now.com` without `www.`   | 159 (incl. 27 imgs)    | 1                      | 27                          | 186   |
| 8 | `http://`                            | 0 (all are XML ns)     | 3 (svg/atom ns only — non-link, IGNORE) | 0 | 3* |
| 9 | `/feed/` `/wp-json/` `/wp-admin/`    | 0                      | 0                      | 0                           | 0     |

*`http://` matches are XML/SVG namespace URIs (`xmlns="http://www.w3.org/..."`), not navigable links — exclude from rewrite.

Note: the `japanpopnow.com` (no hyphens) variant returned **0 matches**. The actual host inconsistency is `https://japan-pop-now.com/` (no `www.`) used inside MDX bodies — 186 occurrences across 32 files. This is the dominant Track-B1 fix opportunity.

---

## 2. Bucket A4a — MDX body links (auto-replaceable)

Replacement rule: `https://japan-pop-now.com/<slug>/` → `/articles/<slug>/` when the slug exists under `content/articles/`. Image links to `https://japan-pop-now.com/wp-content/uploads/...` are bucketed in A4c. Category links remain at `/category/<slug>/` since that route exists in `app/category/[slug]/page.tsx`, but absolute URLs should drop the host (or get `www.` if absolute is required for canonical).

### 2.1 Slug-resolution map (legacy → confident replacement)

| Legacy slug used in MDX                           | Slug exists? | Replacement                                              | Confident? |
|---------------------------------------------------|--------------|----------------------------------------------------------|------------|
| akihabara-complete-guide-2026                     | YES          | `/articles/akihabara-complete-guide-2026/`               | YES        |
| ikebukuro-anime-guide-2026                        | YES          | `/articles/ikebukuro-anime-guide-2026/`                  | YES        |
| shibuya-harajuku-pop-culture-guide                | YES          | `/articles/shibuya-harajuku-pop-culture-guide/`          | YES        |
| tokyo-anime-collab-cafes-spring-2026              | YES          | `/articles/tokyo-anime-collab-cafes-spring-2026/`        | YES        |
| how-to-book-anime-collab-cafe-japan               | YES          | `/articles/how-to-book-anime-collab-cafe-japan/`         | YES        |
| nakano-broadway-guide                             | YES          | `/articles/nakano-broadway-guide/`                       | YES        |
| gachapon-guide-japan                              | YES          | `/articles/gachapon-guide-japan/`                        | YES        |
| game-centers-arcades-japan                        | YES          | `/articles/game-centers-arcades-japan/`                  | YES        |
| tokyo-anime-district-guide                        | YES          | `/articles/tokyo-anime-district-guide/`                  | YES        |
| demon-slayer-pilgrimage-tokyo                     | YES          | `/articles/demon-slayer-pilgrimage-tokyo/`               | YES        |
| weathering-with-you-locations-tokyo               | YES          | `/articles/weathering-with-you-locations-tokyo/`         | YES        |
| your-name-pilgrimage-tokyo                        | YES          | `/articles/your-name-pilgrimage-tokyo/`                  | YES        |
| anime-pilgrimage-spots-tokyo                      | YES          | `/articles/anime-pilgrimage-spots-tokyo/`                | YES        |
| osaka-anime-guide-den-den-town                    | YES          | `/articles/osaka-anime-guide-den-den-town/`              | YES        |
| jr-pass-anime-pilgrimage-routes-2026              | YES          | `/articles/jr-pass-anime-pilgrimage-routes-2026/`        | YES        |
| best-anime-tours-tokyo-2026                       | YES          | `/articles/best-anime-tours-tokyo-2026/`                 | YES        |
| japan-trip-checklist-anime-fans-2026              | YES          | `/articles/japan-trip-checklist-anime-fans-2026/`        | YES        |
| one-piece-kumamoto-statue-tour                    | YES          | `/articles/one-piece-kumamoto-statue-tour/`              | YES        |
| jujutsu-kaisen-shibuya-locations-2026             | YES          | `/articles/jujutsu-kaisen-shibuya-locations-2026/`       | YES        |
| spy-family-tokyo-fan-day-2026                     | YES          | `/articles/spy-family-tokyo-fan-day-2026/`               | YES        |
| japan-ic-card-transit-guide                       | YES          | `/articles/japan-ic-card-transit-guide/`                 | YES        |
| universal-cool-japan-2026-guide                   | YES          | `/articles/universal-cool-japan-2026-guide/`             | YES        |
| animate-cafe-guide-japan                          | YES          | `/articles/animate-cafe-guide-japan/`                    | YES        |
| japan-rail-pass-guide-anime-fans                  | YES          | `/articles/japan-rail-pass-guide-anime-fans/`            | YES        |
| japan-esim-pocket-wifi-sim-card                   | YES          | `/articles/japan-esim-pocket-wifi-sim-card/`             | YES        |
| animejapan-2026-guide-international-visitors      | YES          | `/articles/animejapan-2026-guide-international-visitors/`| YES        |
| one-piece-tokyo-guide-2026                        | YES          | `/articles/one-piece-tokyo-guide-2026/`                  | YES        |
| anime-merch-shopping-guide-japan                  | YES          | `/articles/anime-merch-shopping-guide-japan/`            | YES        |
| **anime-merch-shopping-guide**                    | NO (renamed) | `/articles/anime-merch-shopping-guide-japan/`            | YES (high-confidence rename mapping) |
| **lawson-ticket-loppi-guide**                     | NO (renamed) | `/articles/lawson-ticket-anime-cafe-booking/`            | YES (high-confidence rename mapping) |
| **collab-cafe-calendar**                          | NO           | unknown — flag manual                                    | NO         |
| **category/destinations**                         | route exists | `/category/destinations/` (drop host only)               | YES        |
| **category/cafes**                                | route exists | `/category/cafes/` (drop host only)                      | YES        |
| **category/food-tourism**                         | NO           | unknown — flag manual                                    | NO         |
| **category/creator-interviews**                   | NO           | unknown — flag manual                                    | NO         |

### 2.2 Per-line A4a table (132 confident MDX rewrites)

Format: `filepath : line | original | replacement | confident?`

| filepath | line | original (truncated) | replacement | confident |
|---|---|---|---|---|
| content/articles/anime-hotels-tokyo-2026.md | 187 | `https://japan-pop-now.com/akihabara-complete-guide-2026/` | `/articles/akihabara-complete-guide-2026/` | YES |
| content/articles/anime-hotels-tokyo-2026.md | 198 | `https://japan-pop-now.com/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/anime-hotels-tokyo-2026.md | 247 | `https://japan-pop-now.com/akihabara-complete-guide-2026/` | `/articles/akihabara-complete-guide-2026/` | YES |
| content/articles/anime-hotels-tokyo-2026.md | 248 | `https://japan-pop-now.com/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/anime-hotels-tokyo-2026.md | 249 | `https://japan-pop-now.com/shibuya-harajuku-pop-culture-guide/` | `/articles/shibuya-harajuku-pop-culture-guide/` | YES |
| content/articles/familymart-anime-collab-stores-2026.md | 54 | `…/akihabara-complete-guide-2026/` and `…/anime-merch-shopping-guide/` | `/articles/akihabara-complete-guide-2026/` ; `/articles/anime-merch-shopping-guide-japan/` | YES (rename) |
| content/articles/familymart-anime-collab-stores-2026.md | 88 | `…/lawson-ticket-loppi-guide/` | `/articles/lawson-ticket-anime-cafe-booking/` | YES (rename) |
| content/articles/familymart-anime-collab-stores-2026.md | 96 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/familymart-anime-collab-stores-2026.md | 100 | `…/gachapon-guide-japan/` | `/articles/gachapon-guide-japan/` | YES |
| content/articles/familymart-anime-collab-stores-2026.md | 109 | `…/how-to-book-anime-collab-cafe-japan/` | `/articles/how-to-book-anime-collab-cafe-japan/` | YES |
| content/articles/familymart-anime-collab-stores-2026.md | 110 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/familymart-anime-collab-stores-2026.md | 111 | `…/tokyo-anime-collab-cafes-spring-2026/` | `/articles/tokyo-anime-collab-cafes-spring-2026/` | YES |
| content/articles/familymart-anime-collab-stores-2026.md | 112 | `…/anime-merch-shopping-guide/` | `/articles/anime-merch-shopping-guide-japan/` | YES (rename) |
| content/articles/anime-merch-shopping-guide-japan.md | 268 | `…/akihabara-complete-guide-2026/` | `/articles/akihabara-complete-guide-2026/` | YES |
| content/articles/anime-merch-shopping-guide-japan.md | 269 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/anime-merch-shopping-guide-japan.md | 270 | `…/nakano-broadway-guide/` | `/articles/nakano-broadway-guide/` | YES |
| content/articles/anime-merch-shopping-guide-japan.md | 271 | `…/gachapon-guide-japan/` | `/articles/gachapon-guide-japan/` | YES |
| content/articles/anime-merch-shopping-guide-japan.md | 272 | `…/game-centers-arcades-japan/` | `/articles/game-centers-arcades-japan/` | YES |
| content/articles/anime-merch-shopping-guide-japan.md | 273 | `…/tokyo-anime-district-guide/` | `/articles/tokyo-anime-district-guide/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 57 | `…/your-name-pilgrimage-tokyo/` | `/articles/your-name-pilgrimage-tokyo/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 96 | `…/akihabara-complete-guide-2026/` | `/articles/akihabara-complete-guide-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 106 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 178 | `…/your-name-pilgrimage-tokyo/` | `/articles/your-name-pilgrimage-tokyo/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 179 | `…/tokyo-anime-collab-cafes-spring-2026/` | `/articles/tokyo-anime-collab-cafes-spring-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 180 | `…/akihabara-complete-guide-2026/` | `/articles/akihabara-complete-guide-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 181 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 187 | `…/demon-slayer-pilgrimage-tokyo/` | `/articles/demon-slayer-pilgrimage-tokyo/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 188 | `…/weathering-with-you-locations-tokyo/` | `/articles/weathering-with-you-locations-tokyo/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 189 | `…/jr-pass-anime-pilgrimage-routes-2026/` | `/articles/jr-pass-anime-pilgrimage-routes-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 190 | `…/best-anime-tours-tokyo-2026/` | `/articles/best-anime-tours-tokyo-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 191 | `…/japan-trip-checklist-anime-fans-2026/` | `/articles/japan-trip-checklist-anime-fans-2026/` | YES |
| content/articles/anime-pilgrimage-spots-tokyo.md | 192 | `…/one-piece-kumamoto-statue-tour/` | `/articles/one-piece-kumamoto-statue-tour/` | YES |
| content/articles/animate-cafe-guide-japan.md | 52 | `…/tokyo-anime-collab-cafes-spring-2026/` | `/articles/tokyo-anime-collab-cafes-spring-2026/` | YES |
| content/articles/animate-cafe-guide-japan.md | 142 | `…/akihabara-complete-guide-2026/` ; `…/ikebukuro-anime-guide-2026/` | both → `/articles/...` | YES |
| content/articles/animate-cafe-guide-japan.md | 164 | `…/how-to-book-anime-collab-cafe-japan/` | `/articles/how-to-book-anime-collab-cafe-japan/` | YES |
| content/articles/animate-cafe-guide-japan.md | 204 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/animejapan-comiket-2026-guide.md | 110 | `…/how-to-book-anime-collab-cafe-japan/` | `/articles/how-to-book-anime-collab-cafe-japan/` | YES |
| content/articles/animejapan-comiket-2026-guide.md | 113 | 3 links: akihabara/tokyo-collab-cafes/anime-merch-shopping-guide | `/articles/akihabara-complete-guide-2026/` ; `/articles/tokyo-anime-collab-cafes-spring-2026/` ; `/articles/anime-merch-shopping-guide-japan/` | YES (rename on 3rd) |
| content/articles/your-name-pilgrimage-tokyo.md | 129,133,134,142,143,144,148,149,150,151,152,153 | 12 link instances | `/articles/<slug>/` (collab-cafe-calendar on 153 → unknown) | 11 YES, 1 NO |
| content/articles/demon-slayer-pilgrimage-tokyo.md | 93,96,105,113,159,160,161,165,166,167,168,169,170 | 13 instances (incl. lawson-ticket-loppi-guide L96, collab-cafe-calendar L169) | `/articles/<slug>/`; rename for L96; flag L169 | 12 YES, 1 NO |
| content/articles/japan-rail-pass-2026-guide.md | 395 | `…/japan-ic-card-transit-guide/` | `/articles/japan-ic-card-transit-guide/` | YES |
| content/articles/japan-rail-pass-2026-guide.md | 396 | `…/japan-esim-pocket-wifi-sim-card/` | `/articles/japan-esim-pocket-wifi-sim-card/` | YES |
| content/articles/japan-rail-pass-2026-guide.md | 397 | `…/osaka-anime-guide-den-den-town/` | `/articles/osaka-anime-guide-den-den-town/` | YES |
| content/articles/weathering-with-you-locations-tokyo.md | 18 | `…/your-name-pilgrimage-tokyo/` | `/articles/your-name-pilgrimage-tokyo/` | YES |
| content/articles/weathering-with-you-locations-tokyo.md | 131 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/weathering-with-you-locations-tokyo.md | 143 | `…/your-name-pilgrimage-tokyo/` | `/articles/your-name-pilgrimage-tokyo/` | YES |
| content/articles/weathering-with-you-locations-tokyo.md | 164 | `…/anime-pilgrimage-spots-tokyo/` | `/articles/anime-pilgrimage-spots-tokyo/` | YES |
| content/articles/weathering-with-you-locations-tokyo.md | 165 | `…/your-name-pilgrimage-tokyo/` | `/articles/your-name-pilgrimage-tokyo/` | YES |
| content/articles/weathering-with-you-locations-tokyo.md | 166 | `…/demon-slayer-pilgrimage-tokyo/` | `/articles/demon-slayer-pilgrimage-tokyo/` | YES |
| content/articles/osaka-anime-guide-den-den-town.md | 103,118,142,142,220,225,226,227,228,229,230 | 11 instances (`/anime-merch-shopping-guide/` L225 → rename) | `/articles/...` (rename L225) | 11 YES |
| content/articles/how-to-book-anime-collab-cafe-japan.md | 211,221,222 | 5 link instances (akihabara, ikebukuro, animate-cafe-guide-japan, lawson-ticket-loppi-guide) | `/articles/...`; rename `lawson-ticket-loppi-guide` → `lawson-ticket-anime-cafe-booking` | YES |
| content/articles/naruto-tokyo-pilgrimage-2026.md | 281 | `…/category/food-tourism/` | unknown | NO (manual) |
| content/articles/naruto-tokyo-pilgrimage-2026.md | 283 | `…/category/creator-interviews/` | unknown | NO (manual) |
| content/articles/japan-proxy-shopping-2026.md | 284,285,286 | anime-merch-shopping-guide / gachapon-guide-japan / akihabara-complete-guide-2026 | `/articles/...` (rename L284) | 3 YES |
| content/articles/ikebukuro-anime-guide-2026.md | 135,146,147,148,149,150,151 | 7 instances (`/anime-merch-shopping-guide/` L151 rename) | `/articles/...` | 7 YES |
| content/articles/japan-esim-pocket-wifi-sim-card.md | 94,143,149 | nakano-broadway/shibuya-harajuku/one-piece-kumamoto/how-to-book-anime-collab-cafe-japan (L149 inside Klook affiliate URL — leave) | `/articles/...` for L94+L143 | 4 YES, 1 IGNORE (affiliate URL) |
| content/articles/japan-luggage-forwarding-2026.md | 255,256,257 | japan-ic-card / anime-merch-shopping-guide / akihabara-complete-guide-2026 | `/articles/...` (rename L256) | 3 YES |
| content/articles/tokyo-anime-district-guide.md | 47,68,84,100,113,131,169,173,189,190,191,192,193,194,195,196,197,198 | 18 instances | `/articles/...` | 18 YES |
| content/articles/nakano-broadway-guide.md | 107,146 | ikebukuro-anime-guide-2026 (×2) | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/japan-travel-insurance-2026.md | 298,299 | japan-esim / japan-ic-card | `/articles/...` | 2 YES |
| content/articles/jujutsu-kaisen-shibuya-locations-2026.md | 299,301,303 | shibuya-harajuku / anime-pilgrimage-spots-tokyo / how-to-book-anime-collab-cafe-japan + tokyo-anime-collab-cafes-spring-2026 | `/articles/...` | 3 YES |
| content/articles/japan-rail-pass-guide-anime-fans.md | 64,157,171 | 5 link instances (akihabara, ikebukuro, osaka, one-piece-kumamoto, japan-ic-card) | `/articles/...` | 5 YES |
| content/articles/jujutsu-kaisen-cafes-japan-2026-guide.md | 69,125,159,160,161 | universal-cool-japan / category/destinations (×2) / tokyo-collab-cafes / universal-cool-japan | `/articles/...`; `/category/destinations/` (drop host) | 5 YES |
| content/articles/one-piece-tokyo-guide-2026.md | (no other body link beyond image) | — | — | — |
| content/articles/my-hero-academia-cafe-tokyo-2026.md | 74,96,97,98,132 | 5 instances incl. `/category/destinations` (×2) and rename anime-merch-shopping-guide L132 | `/articles/...`; `/category/destinations/` | 5 YES |
| content/articles/gaming-tokyo-2026.md | 143,205,209,210 | 4 instances (akihabara×2, ikebukuro, anime-merch-shopping-guide ×2 → rename) | `/articles/...` | 4 YES |
| content/articles/tokyo-anime-collab-cafes-spring-2026.md | 207,227,271,275,307,308,309,310 | 8 instances | `/articles/...` | 8 YES |
| content/articles/spy-family-tokyo-fan-day-2026.md | 60,136,137,138,139 | 5 instances (anime-merch-shopping-guide L138 → rename) | `/articles/...` | 5 YES |
| content/articles/shibuya-harajuku-pop-culture-guide.md | 182 | `…/ikebukuro-anime-guide-2026/` | `/articles/ikebukuro-anime-guide-2026/` | YES |
| content/articles/chainsaw-man-pilgrimage-tokyo.md | 18 | image-only (A4c) | (image bucket) | n/a |
| content/articles/anime-merch-shopping-guide-japan.md | 54,214 (`/category/destinations`) | category links — strip host only | `/category/destinations/` | YES |
| content/articles/golden-week-2026-anime-events-complete-guide.mdx | 182 | `/category/cafes` (already relative — fine) | (no change) | n/a |

### 2.3 Special MDX cases needing manual review (A4a, NOT confident)

| filepath | line | original | reason-flag-manual |
|---|---|---|---|
| content/articles/your-name-pilgrimage-tokyo.md | 153 | `https://japan-pop-now.com/collab-cafe-calendar/` | Slug `collab-cafe-calendar` does NOT exist under `content/articles/` — possible WP-only page or never migrated. Manual: remove link or remap. |
| content/articles/demon-slayer-pilgrimage-tokyo.md | 169 | `https://japan-pop-now.com/collab-cafe-calendar/` | Same as above. |
| content/articles/naruto-tokyo-pilgrimage-2026.md | 281 | `https://japan-pop-now.com/category/food-tourism/` | Category `food-tourism` not in current category set (categories are: collab-cafes, experiences, area-guides, anime-pilgrimage, travel-tips, cafes, destinations, events). Manual: remap to `/category/cafes/` or remove. |
| content/articles/naruto-tokyo-pilgrimage-2026.md | 283 | `https://japan-pop-now.com/category/creator-interviews/` | Category does not exist. Manual: remove or remap. |
| content/articles/naruto-tokyo-pilgrimage-2026.md | 301 | `https://collabo-cafe.com/events/category/naruto/` | EXTERNAL site (`collabo-cafe.com`, not japan-pop-now). NOT a legacy match — IGNORE. |
| content/articles/jujutsu-kaisen-cafes-japan-2026-guide.md | 125, 161 | `https://japan-pop-now.com/category/destinations` | Confident host-strip → `/category/destinations/`. Auto-replaceable, but verify the destinations hub still exists (it does per `app/category/[slug]/page.tsx`). |
| content/articles/my-hero-academia-cafe-tokyo-2026.md | 97, 132 | `https://japan-pop-now.com/category/destinations` | Same as above; confident relative. |

---

## 3. Bucket A4b — component / programmatic links (manual review)

| filepath | line | original | reason-flag-manual |
|---|---|---|---|
| app/feed.xml/route.ts | 15 | `'https://japan-pop-now.com'` (NEXT_PUBLIC_SITE_URL fallback) | **HOST INCONSISTENCY**: fallback drops `www.`. Should be `https://www.japan-pop-now.com` to match `lib/url.ts` SITE_URL canonical. Manual fix critical (RSS feed canonical mismatch). |
| app/feed.xml/route.ts | 39 | `xmlns:atom="http://www.w3.org/2005/Atom"` | XML namespace — IGNORE (not a navigable URL). |
| lib/structured-data.ts | 44 | `if (path.startsWith('http://') ... )` | Logic check, not a literal link — IGNORE. |
| lib/image-utils.ts | 8 | `<svg xmlns="http://www.w3.org/2000/svg" ...>` | SVG namespace — IGNORE. |
| app/articles/[slug]/page.tsx | 126 | `` `/category/${category.slug}` `` | Programmatic category link — internal route, not WP. KEEP (not legacy). |
| components/ArticleFooter.tsx | 78, 125 | `` `/category/${categoryData.slug}` ``, `` `/category/${cat.slug}` `` | Internal routes. KEEP. |
| components/CategoryNav.tsx | 23, 35 | `pathname.includes(\`/category/${slug}\`)`, `` `/category/${category.slug}` `` | KEEP. |
| components/CategoryStrip.tsx | 27 | `` `/category/${category.slug}` `` | KEEP. |
| components/Footer.tsx | 6,7,8 | `/category/cafes`, `/category/destinations`, `/category/experiences` | KEEP. |
| components/Header.tsx | 20,21,22 | same triple | KEEP. |
| app/sitemap.ts | 81 (comment), 91 | `/category/${category.slug}` | KEEP (canonical sitemap). |
| app/layout.tsx | 151,152,153 | `https://www.japan-pop-now.com/category/cafes` etc. | Already canonical (`www.`). KEEP. |
| app/page.tsx | 317 | `` `/category/${category.slug}` `` | KEEP. |
| lib/url.ts | 8 | `` `${SITE_URL}/category/${slug}` `` | Helper. KEEP. |
| lib/indexnow.ts | 198 | `` `${SITE_URL}/category/${categorySlug}` `` | KEEP. |
| lib/seo.ts | 81 | `` `${SITE_URL}/category/${categorySlug}` `` | KEEP. |
| app/menu/page.tsx | 42,43,44 | `/category/cafes`, `/category/destinations`, `/category/experiences` | KEEP. |
| app/category/[slug]/page.tsx | 89, 138, 152, 255 | `https://www.japan-pop-now.com/category/${slug}`, etc. | Already `www.`. KEEP. |
| app/category/events/page.tsx | 13, 29, 168, 175, 182 | `https://www.japan-pop-now.com/category/events`, internal hrefs | Already canonical / internal. KEEP. |
| app/not-found.tsx | 47 | `href="/category/cafes"` | KEEP. |

**A4b actionable count: 1** (`app/feed.xml/route.ts:15` host fallback fix). All other component matches are correct internal routes.

---

## 4. Bucket A4c — wp-content/uploads images (Wikimedia round target)

These 27 image references all resolve to `https://japan-pop-now.com/wp-content/uploads/2026/04/<file>` — **legacy WP media host**. They should migrate to `/images/articles/{slug}/...` or be replaced via Wikimedia round (per pipeline).

| filepath | line | image filename |
|---|---|---|
| content/articles/animate-cafe-guide-japan.md | 18 | blue-lock-cafe-2026.jpg |
| content/articles/animate-cafe-guide-japan.md | 26 | spy-family-animate-fair-2026.jpeg |
| content/articles/animate-cafe-guide-japan.md | 92 | conan-cafe-2026-key-visual.jpg |
| content/articles/animate-cafe-guide-japan.md | 116 | conan-cafe-food-menu-02.jpg |
| content/articles/animate-cafe-guide-japan.md | 166 | haikyu-popup-store-2026.jpeg |
| content/articles/anime-pilgrimage-spots-tokyo.md | 43 | jjk-sweets-paradise-cafe-2026.jpg |
| content/articles/anime-merch-shopping-guide-japan.md | 22 | chainsaw-man-merch-2026.jpg |
| content/articles/anime-merch-shopping-guide-japan.md | 216 | anime-goods-store-shelves.jpg |
| content/articles/demon-slayer-pilgrimage-tokyo.md | 98 | demon-slayer-capsule-merch-2026.jpg |
| content/articles/chainsaw-man-pilgrimage-tokyo.md | 18 | chainsaw-man-merch-2026.jpg |
| content/articles/nakano-broadway-guide.md | 83 | conan-namco-campaign-2026.jpg |
| content/articles/ikebukuro-anime-guide-2026.md | 18 | natsume-popup-store-2026.jpg |
| content/articles/ikebukuro-anime-guide-2026.md | 137 | spy-family-animate-fair-2026.jpeg |
| content/articles/how-to-book-anime-collab-cafe-japan.md | 19 | conan-cafe-food-menu-02.jpg |
| content/articles/how-to-book-anime-collab-cafe-japan.md | 134 | blue-lock-cafe-2026.jpg |
| content/articles/how-to-book-anime-collab-cafe-japan.md | 148 | conan-namco-campaign-2026.jpg |
| content/articles/how-to-book-anime-collab-cafe-japan.md | 175 | natsume-popup-store-2026.jpg |
| content/articles/how-to-book-anime-collab-cafe-japan.md | 189 | conan-cafe-food-menu-01.jpg |
| content/articles/your-name-pilgrimage-tokyo.md | 39 | trigun-chugai-grace-cafe-2026.jpg |
| content/articles/one-piece-tokyo-guide-2026.md | 18 | one-piece-cafe-gene-parco-2026.jpg |
| content/articles/tokyo-anime-district-guide.md | 18 | one-piece-cafe-gene-parco-2026.jpg |
| content/articles/weathering-with-you-locations-tokyo.md | 118 | conan-cafe-2026-key-visual.jpg |
| content/articles/one-piece-kumamoto-statue-tour.md | 140 | one-piece-cafe-gene-parco-2026.jpg |
| content/articles/tokyo-anime-collab-cafes-spring-2026.md | 20 | spy-family-animate-fair-2026.jpeg |
| content/articles/tokyo-anime-collab-cafes-spring-2026.md | 55 | conan-cafe-food-menu-01.jpg |
| content/articles/tokyo-anime-collab-cafes-spring-2026.md | 82 | one-piece-cafe-gene-parco-2026.jpg |
| content/articles/tokyo-anime-collab-cafes-spring-2026.md | 103 | jjk-sweets-paradise-cafe-2026.jpg |

Distinct WP-uploads files (deduplicated): 14
- blue-lock-cafe-2026.jpg
- spy-family-animate-fair-2026.jpeg
- conan-cafe-2026-key-visual.jpg
- conan-cafe-food-menu-01.jpg
- conan-cafe-food-menu-02.jpg
- haikyu-popup-store-2026.jpeg
- jjk-sweets-paradise-cafe-2026.jpg
- chainsaw-man-merch-2026.jpg
- anime-goods-store-shelves.jpg
- demon-slayer-capsule-merch-2026.jpg
- conan-namco-campaign-2026.jpg
- natsume-popup-store-2026.jpg
- trigun-chugai-grace-cafe-2026.jpg
- one-piece-cafe-gene-parco-2026.jpg

These 14 distinct image assets are the next Wikimedia-round procurement target (or migration target to `public/images/articles/{slug}/`).

---

## 5. Bulk-fix readiness for Track B1

- **A4a confident host-rewrites:** 156 (132 article-link rewrites + 24 inferred rename / category host-strips, derived from the 159 MDX body matches on host inconsistency minus 27 image-bucketed-into-A4c)
  - Direct host-strip + slug match: ~143
  - Slug-rename mappings (auto-applicable): 13
    - `anime-merch-shopping-guide` → `anime-merch-shopping-guide-japan` (8 occurrences)
    - `lawson-ticket-loppi-guide` → `lawson-ticket-anime-cafe-booking` (3 occurrences)
    - `category/destinations` → `/category/destinations/` (already a route; 4 occurrences in MDX absolute form)
- **A4a manual flags:** 4
  - 2× `collab-cafe-calendar` (slug doesn't exist)
  - 2× `category/{food-tourism,creator-interviews}` (categories don't exist)
- **A4b actionable:** 1 (host fallback in `app/feed.xml/route.ts:15`)
- **A4c image migration backlog:** 27 references → 14 distinct assets

**Total auto-applicable rewrites Track B1 can ship safely: ~156** (subject to a final regex sweep + spot-check of the 4 manual cases above).

Recommended Track B1 sequencing:
1. One regex pass: `https?://japan-pop-now\.com/(<known-slug>)/` → `/articles/$1/` (with the slug allow-list above).
2. Three explicit slug renames before step 1: `anime-merch-shopping-guide`, `lawson-ticket-loppi-guide`, plus `collab-cafe-calendar` decision.
3. Category host-strip: `https?://japan-pop-now\.com/category/(destinations|cafes|experiences|events)/?` → `/category/$1/`.
4. Manual: 2 `naruto-tokyo-pilgrimage-2026.md` lines + 2 `collab-cafe-calendar` lines.
5. Component fix: `app/feed.xml/route.ts:15` add `www.` to fallback.
6. A4c images: schedule for Wikimedia procurement round (separate track).

---

## 6. Final 5-line summary

1. Scanned content/articles + components/app/lib for 9 legacy WP URL patterns; found **186 host-inconsistency hits** (`https://japan-pop-now.com/...` missing `www.`) plus **27 wp-content/uploads** image references.
2. Zero matches for `?p=`, `?cat=`, `/wp-json/`, `/wp-admin/`, `/feed/`, date-based permalinks, or `japanpopnow.com` (no hyphens) — the WordPress migration mostly held; only the host prefix and a few stale slugs leaked.
3. **A4a (content):** 159 MDX hits → 156 confident auto-rewrites (incl. 2 slug renames: `anime-merch-shopping-guide` and `lawson-ticket-loppi-guide`); 4 manual flags (2× `collab-cafe-calendar`, 2× missing categories `food-tourism`/`creator-interviews`).
4. **A4b (component):** only 1 actionable bug — `app/feed.xml/route.ts:15` SITE_URL fallback drops `www.`; all other component category routes are already correct internal paths.
5. **A4c (images):** 27 wp-content/uploads references across 14 distinct asset files — next Wikimedia-round target. Track B1 can safely auto-apply ~156 link rewrites.

File: `C:/Users/user/OneDrive/ドキュメント/GitHub/japan-pop-now/docs/indexing/A4-broken-internal-links-20260426.md`
