# Phase 0 Detailed Evaluation — Final Aggregate (D2 batches 1-5) — 2026-04-28

**Total evaluated:** 65 articles (the weak + unknown buckets from the D1 prescreen at `docs/audit/phase0-prescreen-20260428.md`).

**Verdict distribution (across all 65):**

| Verdict | Count | % |
| --- | ---: | ---: |
| PROCEED (score 100) | **35** | 53.8% |
| REJECT — rewrite-recoverable | **30** | 46.2% |
| REJECT — not-rewrite-recoverable | **0** | 0.0% |

**Material conclusion: every D2-evaluated article has a rescue path.** Zero articles need to be deleted or noindex'd outright. All 30 rejects are queued in `docs/audit/rewrite-queue-20260428.md` (Bucket D3 output), prioritized by failed criterion.

## Per-batch breakdown

| Batch | Articles | PROCEED | REJECT-recoverable | REJECT-not-rec. | Notes |
| ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 14 | 5 | 9 | 0 | Includes 2 ship-blockers fixed in this PR series (akihabara mojibake repair PR #18, demon-slayer external URL fix in PR #17) |
| 2 | 14 | 2 | 12 | 0 | Highest reject rate — many event-tied articles without Q5 fold-up plans |
| 3 | 14 | 6 | 8 | 0 | JR Pass triangle cannibalization (3-way), 3 active-event Q5 failures |
| 4 | 14 | 14 | 0 | 0 | **Cleanest batch.** Cafes silo + pilgrimage sub-silo dominate. 5 articles need Q5 sustainability rescue (event collab cafes, contingent PROCEED) |
| 5 | 9 | 8 | 1 | 0 | Highest PROCEED rate (89%). Only spy-family-tokyo-fan-day rejected |
| **Total** | **65** | **35** | **30** | **0** | |

## Corpus-wide patterns (synthesized across batches)

### Pattern P1 — Q3 (source-citation density) is the dominant fixable failure

Across batches 1-5, **~28 articles** fail or weakly-pass Q3 (source viability). The failure mode is consistent: facts in the article are correct, but writers skip the inline `[official site](URL)` anchor step. Many bare URLs sit in the text without markdown anchors.

**Highest-leverage corpus-wide action:** a single-pass sweep that converts named-but-unlinked sources to inline anchors would flip an estimated 12-15 of the 30 rejects to PROCEED with no rewriting.

### Pattern P2 — Event-tied articles fail Q5 without `validUntil` + fold-up plans

~10 articles cover events ending within 90 days of evaluation date, with no `validUntil` frontmatter or post-event fold-up strategy. Examples:

- demon-slayer-rerun-cafe-ufotable-2026 (ends ~May 2026)
- demon-slayer-rerun-cafe-ufotable-kizuna-2026 (ends ~May 2026)
- jjk-sweets-paradise-complete-guide-2026 (ends 2026-04-29 — already past)
- jujutsu-kaisen-cafes-japan-2026-guide (ends 2026-04-29 — already past)
- jojo-stone-ocean-cafe-jojo-world-2026 (ends mid-June 2026)
- 5 contingent-PROCEED articles in batch 4 (MHA waffle, Okami × MH Sakaba, One Piece Cafe GENE, Pokemon Karaoke, Rilakkuma)
- spy-family-tokyo-fan-day-2026 (placeholder slots)

**Highest-leverage corpus-wide action:** establish `validUntil: YYYY-MM-DD` frontmatter convention (already in `jpn-seo-rules` Skill) and adopt corpus-wide. Each event-tied article also needs a 1-line fold-up plan (refresh / merge / archive).

### Pattern P3 — Cannibalization clusters

At least 4 known cannibalization clusters surfaced across batches:

| Cluster | Articles |
| --- | --- |
| JR Pass triangle | `japan-rail-pass-2026-guide` (canonical) + `jr-pass-anime-pilgrimage-routes-2026` + `japan-trip-checklist-anime-fans-2026` |
| Demon Slayer ufotable | `demon-slayer-rerun-cafe-ufotable-2026` + `demon-slayer-rerun-cafe-ufotable-kizuna-2026` |
| First-timer playbooks | `first-timers-japan-playbook-anime-fans-2026` + `japan-trip-checklist-anime-fans-2026` |
| Kamakura Slam Dunk | `kamakura-slam-dunk-pilgrimage-2026.mdx` (canonical) + `slam-dunk-kamakura-pilgrimage-2026.md` (already noindex+canonical resolved) |

**Highest-leverage corpus-wide action:** focused R1 sweep — pick a canonical sibling per cluster, route others to noindex+canonical (the slam-dunk-kamakura pattern is the exemplar).

### Pattern P4 — Image strict-axis violations

Beyond batch 1's 2 blockers (akihabara mojibake + demon-slayer external URL):

- `your-name-pilgrimage-tokyo`: Trigun cafe photo at line 39 (topic-axis fail per 4-axis universal rule) — **Critical**
- `nakano-broadway-guide`: Conan Namco campaign jpg used as Daily Chico soft serve proxy at line 83 (topic-axis fail)
- ~5 articles still reference `japan-pop-now.com/wp-content/uploads/...` (legacy WordPress paths)
- 2 articles (slam-dunk-kamakura, tokyo-anime-collab-cafes-summer) have UTF-8 mojibake from same import generation as akihabara

**Highest-leverage corpus-wide action:** vision-model image-topic audit pass (separate flow, not inside Phase 0 scope), plus the same `Buffer.from(content, 'binary').toString('utf8')` mojibake sweep applied to the 2 affected articles.

### Pattern P5 — Footer-link-block duplication

3+ articles have triplicated link blocks (e.g., tokyo-anime-district-guide lines 209-211 — same Osaka link 3 times). This is a content-bloat artifact from a CMS export.

**Highest-leverage corpus-wide action:** dedup sweep on `## More Area Guides` / footer-link sections.

### Pattern P6 — Empty `tags: []` and `relatedSlugs: []`

Most WP-migrated articles have empty arrays for these frontmatter fields. They're not technically invalid, but they leave SEO + internal-linking value on the table.

**Highest-leverage corpus-wide action:** auto-link sweep (already exists at `scripts/auto-link.ts`) re-run after rewrite-queue lands.

## D2 batch summaries (per-batch one-liners)

For per-article verdicts and recommendations, see:

- `docs/audit/phase0-summary-20260428.md` — batch 1 (14 articles, committed in PR #17)
- `docs/audit/phase0-summary-batch2-20260428.md` — batch 2 (14 articles)
- `docs/audit/phase0-summary-batch3-20260428.md` — batch 3 (14 articles)
- `docs/audit/phase0-summary-batch4-20260428.md` — batch 4 (14 articles)
- `docs/audit/phase0-summary-batch5-20260428.md` — batch 5 (9 articles)

Per-article detailed reports at `docs/audit/phase0-detailed-{slug}.md` (65 files total).

## D3 routing (Bucket D3 output)

Per the D3 rule:

- **PROCEED → keep** (35 articles, no action)
- **REJECT-recoverable → rewrite queue** (30 articles → `docs/audit/rewrite-queue-20260428.md`)
- **REJECT-not-recoverable → noindex frontmatter** (0 articles, no frontmatter changes needed)

D3 produces 0 destructive changes (no noindex flagging, no deletes). The entire D3 output is the rewrite queue document.

## What's NOT in this aggregate

- **Phase 0 Q3 weak-pass details per article**: see per-article `phase0-detailed-{slug}.md` reports
- **Q4/Q5 borderline rationale**: see per-article reports
- **Image-axis 4-strict findings**: covered separately by `jpn-image-management` Skill workflow (not Phase 0 scope)
- **AI-detection scores (Bucket C6 retroactive)**: those are at `docs/audit/ai-detection-retroactive-20260428.md`; cross-reference with Phase 0 verdicts before deciding rewrite priority
- **Price-mismatch detail**: at `docs/audit/price-mismatch-20260428.md` (Bucket E2)

## Recommended next-session triage order

1. **Q3 citation sweep** — single highest-leverage action; flips ~12-15 rejects to PROCEED
2. **Cannibalization clusters R1 sweep** — addresses 4 known clusters, including 1 already-resolved exemplar (slam-dunk-kamakura)
3. **`validUntil` corpus-wide adoption** — addresses Q5 failures + P2 pattern
4. **Image-axis vision-model pass** — addresses P4 pattern, separate from Phase 0
5. **WP-content-migration sweep** — addresses ~5 articles with legacy `wp-content/uploads/` paths
6. **Mojibake sweep on slam-dunk-kamakura + tokyo-anime-collab-cafes-summer** — same Buffer round-trip technique as the akihabara fix in PR #18
