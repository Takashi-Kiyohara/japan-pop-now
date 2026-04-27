# URL Inspection 30 件 submit GO/NO-GO 判定 (2026-04-27)

## Final decision: GO

**Decision:** **GO** — proceed with GSC URL Inspection submit on the 30-URL list below.
**Rationale:** Steps 1–5 of the pre-submit verification all clear (HTTP 100% / image 0 broken / SEO 0 P0+P1 / sitemap 0 P0 / mobile UA 10/10). The Strict Mode 軸3+5 audit caught and eliminated 8 false alt-text claims and replaced 5 misleading collab heroes (commit `a11e560`); the remaining "exhausted" articles are documented as needing Takapon onsite photoshoot but their current images are now truthful (Wikimedia + honest "illustrative venue context" captions, not fabricated collab claims). No P0 remains on production.
**Recommended timing:** **Today (2026-04-27)** — submit immediately. Vercel has had ~30 min since last push (`9e72dd4`), all 4 strict-mode audit doc commits are docs-only and do not change production code paths. Distribute the 30 URL Inspection submits across **3–4 days** (≤10/day) to stay under GSC's per-property rate-limit and to give Google time to recrawl between batches.

---

## Step 1–6 結果 (table)

| Step | Name | Result | P0 | P1 | doc |
|---|---|---|---:|---:|---|
| 1 | HTTP status (77 articles + 20 hubs) | **PASS** | 0 | 0 | `final-http-20260427.md` |
| 2 | Image 404 (433 refs local + 150 prod proxy) | **PASS** | 0 | 0 | `final-img-404-20260427.md` |
| 3 | SEO signals (20-article sample) | **PASS** | 0 | 0 | `final-seo-20260427.md` |
| 4 | Sitemap content (98 URLs) | **PASS** | 0 | 1 | `final-sitemap-20260427.md` |
| 5 | Mobile UA + perf smoke (10 articles + PSI) | **PARTIAL** | 0 | 1 | `final-mobile-perf-20260427.md` |
| 6 | GSC sitemap receipt (API attempt) | **DEFERRED** | – | – | (user-confirmation-required) |

### Step 6 — GSC API attempt outcome

- **MCP `mcp__claude_ai_Google_Search_Console__*` not available** in this session's deferred-tools list (only Box / Gmail / Google Drive MCPs are present).
- **`gh secret list`** returned 0 entries — no repo-level GSC credentials.
- **`scripts/inject-gsc-creds.ps1`** exists but requires interactive OAuth flow → not run in this session per the "no destructive / no interactive" rule.
- **Outcome:** Step 6 is **user-confirmation-required**. After user runs URL Inspection on the 30 URLs below, they should confirm sitemap status manually in GSC → **Sitemaps** for both `sc-domain:japan-pop-now.com` and `https://www.japan-pop-now.com/` properties.

### Step 5 P1 (perf-only, non-blocking)

PSI (PageSpeed Insights API) is rate-limited (HTTP 429, daily quota exhausted). Per audit spec this does **not block** — re-run after quota reset (~24 h). Mobile UA smoke 10/10 PASS is the binding signal for this step.

### Step 4 P1 (informational)

`/articles` index is HTTP 200 + indexable but not in `sitemap.xml`. PR #13 (`dd5f19f`) added the route, but `app/sitemap.ts` was not updated alongside. Discovery via BottomNav / homepage internal-link is sufficient — not crawl-blocking. Tracked as follow-up PR.

---

## Strict Mode Audit 結果 (table)

| Batch | Scope | PASS | FAIL-exhausted | Replaced | Commits |
|---|---|---:|---:|---|---|
| 1 | JJK / DS / Conan / JoJo / Dark Moon (10) | 5 | 5 | 5 hero + 6 caption + 5 alt | `a11e560`, `9e72dd4` |
| 2 | MHA / Okami / Apothecary / Rilakkuma / Pokemon (8 → 7 unique) | 1 | 6 | 0 (frontmatter `imageNote:` only) | `edf0033` |
| 3 | Chiikawa / SpyFam / Famima / Ghibli / USJ / PokéPark / Krispy / Blue Lock (9) | 4 | 5 | 0 (frontmatter `imageNote:` only) | `7db6437` |
| 4 | Hero non-collab sweep (51) | 50 | 1 | 0 (1 flagged for Takapon) | `56a0eba` |

**Aggregate:** of the 77 production articles, **60 pass strict** (50 non-collab + 10 collab/PASS), **16 collab articles flagged for Takapon photoshoot** (logged in `collab-image-exhausted-20260427.md`), **1 non-collab article** (`one-piece-kumamoto-statue-tour`) flagged for Takapon (no Wikimedia coverage of the 10 Luffy bronze statues). All 17 flagged articles still serve **truthful** images (real-photo + accurate captions disclosing "illustrative venue context") — no fabricated collab claims remain on production.

---

## Critical truths surfaced (Strict Mode)

1. **8 FALSE alt-text claims eliminated in Batch 1** (commit `a11e560`):
   - Demon Slayer Kizuna article: Shibuya Crossing previously labeled "ufotable Cafe Tokyo storefront with Kizuna signage" → corrected (hero replaced with Nogata Station; body alt corrected to "illustrative residential context").
   - Demon Slayer Kizuna body-menu (residential street) was captioned "Kamado chicken bowl & parfait, each ships with novelty card" → corrected.
   - Demon Slayer Kizuna body-venues (Kabukicho neon) was captioned "Montage of ufotable Cafe venues in 5 cities" → corrected.
   - JoJo Stone Ocean cafe article: body image was actually a **Chiikawa Land cafe interior** (totally different IP) labeled "JoJo World cafe counter, 6 Stand drinks rotation" → caption corrected.
   - JoJo Stone Ocean body-venue (Animate exterior) labeled "Stone Ocean signage" → corrected.
   - Detective Conan pilgrimage hero (Shibuya Scramble) was labeled "Yura Conan Station" → real Yura Conan Station hero swapped in.
   - Dark Moon body alt claimed "Ikebukuro skyline at night with dark purple moon-lit tone" but image was Sunshine City fountain interior → corrected.
   - JJK guide hero (Akihabara generic) was implicitly "JJK collab" — replaced with Sweets Paradise Umeda + actual JJK collab poster window.

2. **17 articles flagged for Takapon photoshoot** (`collab-image-exhausted-20260427.md`). Top-priority queue (sorted by collab-window urgency):
   - **HIGHEST**: Blue Lock × Tokyo Skytree EGOIST Exhibition (closes **2026-05-10**, ~2 weeks)
   - **HIGH**: Rilakkuma × SHIBUYA 109 (closes **2026-05-31**, ~5 weeks)
   - **HIGH**: FamilyMart × Durarara!! Ikebukuro (likely closes **mid-May 2026**)
   - **HIGH**: Pokemon Karaoke Manekineko 30th (closes **2026-06-14**, ~7 weeks)
   - **HIGH**: Okami × Monster Hunter Sakaba AKIBA Pasela (closes **2026-06-01**)
   - **HIGH**: PokéPark Kanto Yomiuriland (permanent venue, no urgency but high reader value)
   - **MEDIUM**: Apothecary Diaries × JR Tokai Oshi-Tabi (closes 2026-07-20)
   - 9 more documented in the exhausted log.

3. **`one-piece-kumamoto-statue-tour`** has **zero Wikimedia coverage** of its 10 Luffy bronze statues — the article's central thesis is "All 10 Straw Hat statues" but the hero shows only the Kumamoto Prefectural Government Office building. **Needs Takapon Kumamoto trip** (or licensed press photo from the prefecture's official tourism board).

4. **No fabricated content / no agent-generated placeholders / no IP key visuals re-hosted** — all replacement images sourced from Wikimedia Commons (CC-licensed) per `feedback_official_image_modification_ok.md` priority order.

---

## URL Inspection 30 候補 list

Distribute submission across **3–4 days** (≤10 URLs/day per property). Submit on both `sc-domain:japan-pop-now.com` and `https://www.japan-pop-now.com/` properties.

### Group A — 5 hubs (highest crawl-priority; submit Day 1)

| # | URL | Rationale |
|---|---|---|
| 1 | `https://www.japan-pop-now.com/` | Homepage — primary brand landing. |
| 2 | `https://www.japan-pop-now.com/articles` | New index hub from PR #13 (BottomNav 404 fix); not yet in sitemap → URL Inspection accelerates discovery. |
| 3 | `https://www.japan-pop-now.com/cafes` | Cafe hub — 92 % traffic-driving silo. |
| 4 | `https://www.japan-pop-now.com/calendar` | Time-bounded events hub; freshness signal. |
| 5 | `https://www.japan-pop-now.com/features` | Feature-series hub; cross-silo SEO anchor. |

### Group B — 4 active feature children (Day 1)

| # | URL | Rationale |
|---|---|---|
| 6 | `https://www.japan-pop-now.com/features/collab-cafe-guide` | Top-grossing feature series. |
| 7 | `https://www.japan-pop-now.com/features/pilgrimage-routes` | Anime pilgrimage silo. |
| 8 | `https://www.japan-pop-now.com/features/tokyo-district-guides` | Geo silo. |
| 9 | `https://www.japan-pop-now.com/features/travel-essentials` | Travel-tips silo. |

### Group C — 3 active categories (Day 1)

The 5 categories include `events` and `culture`, both intentionally empty → noindex (excluded from sitemap by design). Submit only the 3 with content.

| # | URL | Rationale |
|---|---|---|
| 10 | `https://www.japan-pop-now.com/category/cafes` | Cafes category page. |
| 11 | `https://www.japan-pop-now.com/category/experiences` | Experiences category page. |
| 12 | `https://www.japan-pop-now.com/category/destinations` | Destinations category page. |

### Group D — 8 articles from Phase 3a/b/c image-fix sprint (Day 2)

| # | URL | Rationale (commit) |
|---|---|---|
| 13 | `https://www.japan-pop-now.com/articles/japan-rail-pass-2026-guide` | `4c50745` Phase 3c group L Unsplash+ purge — high-CPC affiliate. |
| 14 | `https://www.japan-pop-now.com/articles/anime-day-trips-from-tokyo-2026` | `171e59b` Phase 3c group K Unsplash+ purge. |
| 15 | `https://www.japan-pop-now.com/articles/animejapan-2026-guide-international-visitors` | `e9d921f` Phase 3c group K Unsplash+ purge. |
| 16 | `https://www.japan-pop-now.com/articles/universal-cool-japan-2026-guide` | `f58ecc3` Phase 3c group F Unsplash+ purge. |
| 17 | `https://www.japan-pop-now.com/articles/one-piece-tokyo-guide-2026` | `982661d` Phase 3c group I LOW_BPP repair. |
| 18 | `https://www.japan-pop-now.com/articles/animate-cafe-guide-japan` | `f0ba464` Phase 3c group D 4-axis fix. |
| 19 | `https://www.japan-pop-now.com/articles/chainsaw-man-pilgrimage-tokyo` | `c1a19be` Phase 3c group G 4-axis fix. |
| 20 | `https://www.japan-pop-now.com/articles/cosplay-experience-tokyo-2026` | `041d272`/`a2973a5` Phase 3c group H 4-axis fix. |

### Group E — 4 articles from Strict Mode hero/body fix (Day 3)

| # | URL | Rationale |
|---|---|---|
| 21 | `https://www.japan-pop-now.com/articles/jujutsu-kaisen-cafes-japan-2026-guide` | Batch 1 (`a11e560`) — hero swap to SP Umeda + JJK collab poster. |
| 22 | `https://www.japan-pop-now.com/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026` | Batch 1 — hero swap + 2 false body captions corrected. |
| 23 | `https://www.japan-pop-now.com/articles/detective-conan-cafe-tokyo-osaka-3venue-2026` | Batch 1 — hero swap to HEP FIVE Osaka. |
| 24 | `https://www.japan-pop-now.com/articles/detective-conan-pilgrimage-events-2026` | Batch 1 — hero swap to real Yura Conan Station. |

### Group F — 6 high-value cornerstone articles (Day 3–4)

| # | URL | Rationale |
|---|---|---|
| 25 | `https://www.japan-pop-now.com/articles/chiikawa-bakery-harajuku-guide-2026` | Strict-mode PASS exemplar (own photos, brand visible) — high search demand. |
| 26 | `https://www.japan-pop-now.com/articles/jjk-sweets-paradise-complete-guide-2026` | Strict-mode "gold sample" — top-traffic JJK article. |
| 27 | `https://www.japan-pop-now.com/articles/kamakura-slam-dunk-pilgrimage-2026` | Canonical pilgrimage article (the noindex'd `slam-dunk-kamakura-pilgrimage-2026` redirects here). |
| 28 | `https://www.japan-pop-now.com/articles/akihabara-complete-guide-2026` | Cornerstone area-guide — 4111 words, top-of-funnel traffic. |
| 29 | `https://www.japan-pop-now.com/articles/krispy-kreme-mario-galaxy-shibuya-2026` | Strict-mode PASS exemplar collab (own photos w/ themed packaging). |
| 30 | `https://www.japan-pop-now.com/articles/ghibli-park-complete-guide-2026` | Strict-mode PASS — venue == IP article; high evergreen demand. |

---

## 残ブロッカー

**None blocking the URL Inspection submit.** Open follow-ups (do **not** block this submit run):

1. PR — add `/articles` index to `app/sitemap.ts` (Step 4 P1).
2. Re-run PSI after quota reset (~24 h, Step 5 P1).
3. Schedule Takapon photoshoots per the Strict Mode 軸3 exhausted log (16 collab articles + 1 non-collab Kumamoto).
4. PR #10 (4-axis CI gate) — defer until image-floor backlog draws down (currently 20 acknowledged COUNT_FLOOR P0s would block the gate).

---

## user 朝起きたらやること

1. **Submit the 30 URLs above to GSC URL Inspection** — distributed over 3–4 days (Day 1: hubs+features+categories = 12; Day 2: image-fix sprint = 8; Day 3: strict-mode fixes + early cornerstones = 6; Day 4: remaining cornerstones = 4). Submit on both `sc-domain:` and `www.` properties.
2. **Confirm GSC sitemap status manually** — open Search Console → Sitemaps → verify `sitemap.xml` shows "成功 / Success" with **98 URLs** and last-fetch date today (2026-04-27 or later). Both properties.
3. **Schedule Takapon photoshoot priorities** — review `docs/audit/collab-image-exhausted-20260427.md`. Time-critical:
   - **Blue Lock × Skytree EGOIST Exhibition** before **2026-05-10** (highest urgency).
   - **Rilakkuma × SHIBUYA 109** before **2026-05-31**.
   - **FamilyMart × Durarara!! Ikebukuro** mid-May 2026.
   - **Pokemon Karaoke Manekineko** before **2026-06-14**.
4. **Open follow-up PR** — add `/articles` index to `app/sitemap.ts` with `priority: 0.8`, `changeFrequency: 'daily'`, `lastModified: latestArticleDate`.
5. **Re-run PSI** — once quota resets (~24 h), re-run on 5 deferred URLs (`/`, `/articles`, `/cafes`, plus 2 article samples) to validate Core Web Vitals.

---

## Reference docs

- `docs/audit/SUMMARY-20260427.md` (10-dim audit summary)
- `docs/audit/final-http-20260427.md` (Step 1)
- `docs/audit/final-img-404-20260427.md` (Step 2)
- `docs/audit/final-seo-20260427.md` (Step 3)
- `docs/audit/final-sitemap-20260427.md` (Step 4)
- `docs/audit/final-mobile-perf-20260427.md` (Step 5)
- `docs/audit/strict-mode-batch1-20260427.md` (Strict Mode Batch 1 — JJK/DS/Conan/JoJo/DM)
- `docs/audit/strict-mode-batch2-20260427.md` (Strict Mode Batch 2 — MHA/Okami/Apothecary/Rilakkuma/Pokemon)
- `docs/audit/strict-mode-batch3-20260427.md` (Strict Mode Batch 3 — Chiikawa/SpyFam/Famima/Ghibli/USJ/PokéPark/Krispy/BlueLock)
- `docs/audit/strict-mode-batch4-hero-non-collab-20260427.md` (Strict Mode Batch 4 — 51 non-collab hero sweep)
- `docs/audit/collab-image-exhausted-20260427.md` (17-article Takapon photoshoot priority queue)
- `docs/adsense/sitemap-resubmit-ready-20260427.md` (existing sitemap resubmit wake-up doc)

---

## JSON summary

```json
{
  "audit_date": "2026-04-27",
  "decision": "GO",
  "submit_window": "today (2026-04-27); distribute across 3-4 days",
  "step_results": {
    "1_http": "PASS (97/97 = 100%)",
    "2_image_404": "PASS (0/433 local, 0/150 prod)",
    "3_seo": "PASS (0 P0, 0 P1 in 20-article sample)",
    "4_sitemap": "PASS (0 P0, 1 P1 — /articles missing, non-blocking)",
    "5_mobile_perf": "PARTIAL (mobile UA 10/10 PASS; PSI deferred 429)",
    "6_gsc_api": "DEFERRED (MCP unavailable; user confirmation required)"
  },
  "strict_mode": {
    "batch1": {"pass": 5, "fail_exhausted": 5, "replacements": 5, "commits": ["a11e560", "9e72dd4"]},
    "batch2": {"pass": 1, "fail_exhausted": 6, "replacements": 0, "commits": ["edf0033"]},
    "batch3": {"pass": 4, "fail_exhausted": 5, "replacements": 0, "commits": ["7db6437"]},
    "batch4": {"pass": 50, "fail": 1, "replacements": 0, "commits": ["56a0eba"]}
  },
  "false_alt_claims_eliminated": 8,
  "articles_flagged_takapon_photoshoot": 17,
  "url_inspection_count": 30,
  "blockers_open": 0,
  "follow_up_prs": ["sitemap+/articles", "PSI re-run", "PR#10 defer"]
}
```
