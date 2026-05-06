# [B4] REWRITE_HEAVY deferred — user input needed (2026-05-06)

3 articles flagged for HEAVY rewrite in the AdSense audit. None can be done in-session without crossing the no-fabrication line. Per the v3 prompt, frieren is noindex'd now (already shipped in same-day commit 4793538), the other 2 wait for Takapon's first-hand observations.

## frieren-usj-story-walk-osaka-2026 (already noindex'd as B4 immediate action)

**Status**: `robots: "noindex,follow"` added 2026-05-06 in commit `4793538`.

**Reason**: Pre-open press paraphrase. Universal Studios Japan opens the Frieren Story Walk attraction on **2026-05-30**. The pre-open content is operator-press summary — useful for travelers but flagged as "AdSense risk" per the audit (low first-hand value, likely to be flagged as thin/derived content if reviewer sees it before opening).

**What Takapon needs to do (post 2026-05-30)**:
1. Visit the Stage 18 Story Walk at USJ Osaka. Capture first-hand:
   - Walk-through experience (estimated 8–12 min per ride source TBD)
   - e-seitai-ken (free ride ticket) collection process timing — actual queue length
   - Themed restaurant menu confirmation (current items + price — operator may rotate)
   - Hollywood Dream ride takeover — actual sound design, theming, ride length
2. Photograph: Stage 18 entrance signage; the Auserst grimoire library entry frame; the field of blue moon weed; restaurant interior; merchandise wall.
3. Replace the press-paraphrase paragraphs with first-hand walkthrough. Keep the booking + access frames as-is (factual, source-cited).
4. Remove `robots: "noindex,follow"` from frontmatter; bump `lastUpdated` to visit date.
5. Verify: post-deploy, /articles/frieren-usj-story-walk-osaka-2026 appears in sitemap.xml again; meta robots tag absent (defaults to index,follow).

**Estimated effort post-visit**: 2–3h editing + 30 min image processing.

---

## anime-hotels-tokyo-2026

**Status**: in sitemap, currently `index,follow`.

**Audit flag**: HEAVY rewrite — needs lodging verification (real hotel stays).

**What's missing**: First-hand impressions of the listed hotels — room photos, breakfast quality, soundproofing assessment, distance-to-station verification, IP-themed amenity confirmation. Currently the article is operator-spec summary, which is fine but lacks the differentiation a Takapon stay would add.

**What Takapon needs to do**:
1. Identify which 3–5 anime hotels Takapon has actually stayed at (or plans to stay at) in 2026. The article currently lists hotels that may or may not match Takapon's stay history.
2. For each stayed-at hotel:
   - Booking confirmation screenshot or receipt
   - Room interior photo (tasteful, no PII)
   - Comparison vs. operator's listing photos (any divergence?)
   - One paragraph of first-hand impression (≥80 words, advisory voice OK)
3. For hotels NOT stayed at: keep operator-spec but mark with "Operator info — Takapon has not stayed" hedge.
4. Drop image + text additions to: `public/images/articles/anime-hotels-tokyo-2026/{hotel-slug}-room.webp` + edit body content with new sections.

**Estimated effort**: 4–6h depending on stay count.

**Blocker**: This is the one HEAVY task I can't even partially do. The Cowork drafter pipeline could collect operator data; first-hand stay records belong only to Takapon.

---

## anime-merch-shopping-guide-japan

**Status**: in sitemap, `index,follow`. Has explicit redirect from legacy URL `/anime-merch-shopping-guide-japan` → `/articles/anime-merch-shopping-guide-japan` per next.config.ts.

**Audit flag**: HEAVY — needs Takapon's shopping-trip records.

**What's missing**: Receipt photos, prices Takapon actually paid, store-by-store experience comparison. Currently the article is shopping-guide aggregation — useful but not differentiated by first-hand pricing.

**What Takapon needs to do**:
1. From recent shopping trips (Takapon should have receipts from Akihabara / Nakano / Ikebukuro store visits):
   - Anonymized receipt photos (block any PII, store stamp + line items visible)
   - Specific item-level prices (vs. listed prices online)
   - Time-of-day notes (when each store is least crowded)
   - Bag/packaging notes if relevant for international shipment
2. Add a "What I actually paid" table: 5–10 representative items × 3 stores × actual price.
3. Add "Shopping flow I use" section: one ~3 paragraph route Takapon actually walks (not invented).

**Estimated effort**: 3–4h depending on receipt count.

**Blocker**: Same as anime-hotels — first-hand purchase records are user-only.

---

## How Code can help when Takapon returns

For each of the 2 HEAVY-deferred articles (anime-hotels, anime-merch), Cowork or Takapon can drop notes/photos to:
- `content_operations/drafts/{slug}-takapon-additions-{date}.md` — text additions
- `public/images/articles/{slug}/takapon-{n}.webp` — photos

Code can then merge the text into the article + run the image-axis-5 audit + bump lastUpdated. ~30 min per article from drop to deploy.

For frieren post-2026-05-30, same flow.

## Combined timeline
- **2026-05-06 (today)**: frieren noindex'd; deferred-list documented (this file).
- **2026-05-30+**: frieren first-hand rewrite by Takapon, then Code merge + un-noindex.
- **TBD**: anime-hotels, anime-merch — when Takapon has the source material.

Until those rewrites land, the 3 articles either stay noindex'd (frieren) or stay live as operator-aggregation (anime-hotels, anime-merch). For AdSense purposes, the current state is acceptable: the 2 live articles meet the technical bar (sitemap, schema, internal links, disclosure) even without the heavy rewrite. The rewrite is a quality boost, not a gating requirement.
