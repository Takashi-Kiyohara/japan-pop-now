# Tier A Citation Sweep — 2026-04-28

Per `docs/audit/rewrite-queue-20260428.md` Tier A protocol: inline `[source name](URL)` citations added to back facts that previously lacked anchor links. Re-evaluated Phase 0 Q3 on each article and noted whether the article flipped from REJECT to PROCEED.

## Batch 1 of 3 (this row set)

| slug | citations added | source URLs | re-eval Q3 | flipped to PROCEED? |
| --- | ---: | --- | --- | :---: |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | 2 | https://recommend.jr-central.co.jp/oshi-tabi/ ; https://www.animate.co.jp/shop/umeda/ | YES (was already YES) | NO (Q5 + image-reshoot still failing; Q3 not load-bearing) |
| best-anime-tours-tokyo-2026 | 3 | https://www.klook.com/en-US/search/result/?query=akihabara%20tour ; https://www.viator.com/Tokyo/d334-ttd?q=Akihabara ; https://www.viator.com/Tokyo-tours/Anime-and-Manga-Tours/d334-g6-c111 ; https://www.klook.com/en-US/search/result/?query=anime%20tokyo ; https://arigatojapan.co.jp/ | YES (flipped from NO) | NO (Q5 still failing — tour prices change monthly, KLOOK15 code expires) |
| book-japan-anime-events-overseas-2026 | 2 (+1 broken-anchor repair) | https://www.mlit.go.jp/kankocho/tokei_hakusho/index.html ; https://www.govoyagin.com/ | YES (flipped from NO) | YES (Q3 was the only failed Q; broken `[ShingoTravel](#)` anchor repaired, JTA stat anchored) |
| dark-moon-chara-cafe-ikebukuro-2026 | 2 | https://the-chara.com/ ; https://livepocket.jp/ | YES (was already YES) | NO (Q5 still failing — needs `postEventPlan` for May 6 collab end; Q3 not load-bearing) |
| demon-slayer-rerun-cafe-ufotable-2026 | 1 | https://livepocket.jp/ | YES (was already YES) | NO (R1 cannibalization with `demon-slayer-rerun-cafe-ufotable-kizuna-2026` + Q5 still failing; also surfaced date discrepancy — official ufotable page shows May 8 – July 7, 2026 vs article's "March 31 – May 6") |

## Methodology notes

- **Source priority** per `.claude/rules/affiliate.md` and project memory: brand official `.jp` site → 公式 X (verified handle) → 公式 web press → government/transit official site. NEVER aggregator (TripAdvisor, Tabelog, HotPepper) for citation.
- **WebFetch fetches used:** 7 successful, 4 failed (404 on some hypothetical Vol.3-specific URLs). Within the 10-15 quota for the batch.
- **Edits per article:** 1-3 inline anchors, per the "don't over-cite" guideline.
- **Linter notes:** During the sweep run, an out-of-band linter added `validUntil` frontmatter fields to articles 1 (2026-07-21), 4 (2026-05-07), 5 (2026-05-07). These are partial Q5 contributions but do not on their own document post-event fold-up plans.

## Out-of-scope concerns surfaced

1. **demon-slayer-rerun-cafe-ufotable-2026 — date discrepancy.** Article says collab is March 31 – May 6, 2026; official ufotable site says May 8 – July 7, 2026. Required follow-up: content-correction pass to update body dates and the `validUntil` field. Cited URL currently contradicts body text.
2. **book-japan-anime-events-overseas-2026 — unverified ShingoTravel partnership.** 9 brand mentions remain in body (intro, comparison table, dedicated H2 section, FAQ). Audit doc recommendation #2 was "pull the partner section entirely until partnership is contractually live." Citation sweep took the lighter intervention (replace broken anchor + neutralize partnership language at intro). Editorial decision needed: keep, fully remove, or replace with verified alternative.
3. **apothecary-diaries — image reshoot still pending** per existing imageNote (hero is wrong-area Dotonbori; needs Shin-Osaka platform poster + Animate Umeda 3F window + Sukunahikona Shrine).

## Summary (this batch)

- **Total citations added:** 10 inline anchors across 5 articles + 1 broken-anchor repair.
- **Articles flipped to PROCEED:** 1 (`book-japan-anime-events-overseas-2026`).
- **Articles still in REJECT queue:**
  - `apothecary-diaries-oshi-tabi-osaka-shinkansen-2026` — Q5 fold-up + image reshoot.
  - `best-anime-tours-tokyo-2026` — Q5 sustainability (tour prices, expiring discount codes).
  - `dark-moon-chara-cafe-ikebukuro-2026` — Q5 post-event plan (12-day collab ends May 6).
  - `demon-slayer-rerun-cafe-ufotable-2026` — R1 cannibalization + Q5 + body-date fact correction.
- **Q3 flip rate (citation sweep effectiveness):** 5/5 articles now pass Q3. Q3 was the sole load-bearing failure on 1 of 5.

The Tier A protocol's "single citation pass per article would flip these to PROCEED" hypothesis holds for 1/5 in this batch. The other 4 articles had Q3 as either already-YES (audit-doc disagrees with queue) or as one of multiple failed axes. The citation sweep is still high-leverage work — it strengthens the corpus's E-E-A-T floor regardless of whether it alone unlocks PROCEED.
