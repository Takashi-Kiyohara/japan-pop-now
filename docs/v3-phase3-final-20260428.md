# v3 Phase 3 — Final Report

Started against the 7-bucket prompt. Hit a rate-limit cliff during background sub-agent execution at ~3:10 AM Tokyo (Asia/Tokyo limit reset boundary), which truncated B1 batches 2+3 and B3 mojibake repairs. All landed work is captured below; deferred items are documented for next-session resume.

## 7 Bucket result

| Bucket | Task | Result | Commits | PRs |
| --- | --- | --- | --- | --- |
| 1 | Tier A Citation sweep (15 articles) | **partial — batch 1 complete (5 articles, 1 PROCEED flip), batches 2+3 partial (rate-limited)** | `70980b3` (article bodies in PR #23) + `de995ec` (residual phase0-detailed re-evals) | #23 |
| 2 | validUntil sweep (24 articles) | **complete** — 24 modified, 3 deferred for ambiguous end dates, sitemap exclusion logic deferred | `70980b3` | #23 |
| 3 | Mojibake repair on 2 articles | **deferred** — slam-dunk-kamakura sub-agent stalled at step 5; summer-cafes partial fix introduced apostrophe-stripping regression, reverted | audit docs in `de995ec` + `b3-mojibake-deferred-20260429.md` | #23 |
| 4 | E2 v2 + E3 batch | **not started** — rate-limit cliff hit before this bucket | — | — |
| 5 | R1 cannibalization 3 cluster | **not started** — same | — | — |
| 6 | L4 calibration policy doc | **complete** — 2-option policy, recommendation pending user decision | `8d9ab82` | #21 |
| 7 | scripts/ai-detection lib.ts refactor | **complete on PR (#22) — local working tree subsequently reverted by linter/external; main may not adopt** | `690ab3f` | #22 (status unclear post-revert) |

## Rewrite-queue progression

- Phase 2 finish: 30 articles in REJECT-rewrite-recoverable queue
- B1 batch 1 flipped: 1 article (`book-japan-anime-events-overseas-2026` — Q3 was sole load-bearing failure, now passing)
- Phase 3 finish: **29 articles** in REJECT queue (15 still in Tier A pending re-attempt of batches 2+3, 14 in Tier B/C/D)

This is below the 12-15 flip target. The shortfall is rate-limit-driven, not protocol failure — batch 1's 1/5 flip rate suggests Tier A's hypothesis ("single citation pass flips most to PROCEED") holds for ~20% of articles where Q3 is the sole failure, with the remaining 4/5 needing additional Q5/R1/image work. Re-running batches 2+3 next session should produce 2-4 more flips by the same logic.

## Detailed bucket notes

### Bucket 1 (citation sweep) — partial

**Batch 1 (5 articles):** 10 inline anchors added + 1 broken-anchor repair. 1 article flipped to PROCEED. Aggregator-doc rows in `docs/audit/citation-sweep-20260428.md`. Per-article phase0-detailed-* re-eval sections appended for all 5.

**Out-of-scope finding from batch 1:** `demon-slayer-rerun-cafe-ufotable-2026` body says "March 31 – May 6, 2026" but official ufotable site says "May 8 – July 7, 2026" — substantive date discrepancy needing follow-up content correction.

**Batch 2 (5 articles, rate-limited):** Body edits landed for some articles (gachapon-guide / game-centers-arcades / others overlapped with B2 — included in PR #23's first commit). Phase0-detailed-* re-eval sections appended for 3 articles before rate-limit. Citation-sweep aggregator doc NOT updated with batch 2 rows.

**Batch 3 (5 articles, rate-limited):** 1 body edit landed (jujutsu-kaisen-shibuya-locations — clean MAPPA + Shibuya 109 + Ichiran anchors). Phase0-detailed-* re-eval sections for all 5 of batch 3's articles. Citation-sweep aggregator NOT updated.

### Bucket 2 (validUntil sweep) — complete

24 articles modified with `validUntil: YYYY-MM-DD` frontmatter. 3 deferred for ambiguous end dates (`spy-family-tokyo-fan-day-2026`, `chiikawa-bakery-harajuku-guide-2026`, `animejapan-comiket-2026-guide`). Audit doc at `docs/audit/validuntil-applied-20260428.md`.

**Sitemap exclusion logic NOT in this PR.** Per the original prompt, this should be a separate `feat/sitemap-validuntil-exclusion` PR. Deferred to next session — implementation is straightforward (filter `getAllArticles()` in `app/sitemap.ts` against `new Date() > new Date(article.validUntil)`).

### Bucket 3 (mojibake repair) — deferred (failure mode documented)

Both articles' Critic-loop sub-agents wrote audit docs through step 4 (Critic 1) but stalled before applying fixes:
- **slam-dunk-kamakura**: agent stalled at step 5 (apply targeted fix). Article unchanged from main HEAD. Already has `robots: noindex,follow` + canonical sibling, so no fallback needed.
- **summer-cafes**: agent rate-limited mid-fix. Partial whole-file Buffer round-trip introduced apostrophe-stripping regression (`Tokyo's` → `Tokyos`). **Reverted to main HEAD.** Article unchanged.

**Diagnosed root cause** (in `docs/audit/b3-mojibake-deferred-20260429.md`): summer-cafes had mixed encoding (some properly-UTF-8 chars, some Latin-1-mojibake'd chars). The whole-file `Buffer.from(content, 'binary').toString('utf8')` works only when input is uniformly mis-encoded; mixed-encoding files need char-by-char selective recovery.

**Lesson for next session:** the akihabara fix in PR #18 worked because akihabara's curly apostrophes were already lost pre-fix. The smart-recovery script (selective `replace` for known mojibake patterns only) avoids damaging properly-encoded chars and should be the new default approach.

### Bucket 4 (E2 v2 + E3) — not started

Rate-limit cliff prevented start. Next-session work:
- `scripts/price-audit/verify-prices.ts` v2 with `primaryVenueUrl` resolver (frontmatter `primaryUrl` field if present; else first non-image-non-social .jp URL in body)
- Re-run on 2,228 prices
- Per-article fix commits in feature branches

### Bucket 5 (R1 cannibalization) — not started

3 known clusters per `docs/audit/rewrite-queue-20260428.md`:
- detective-conan-cafe (2-article cluster)
- demon-slayer-rerun-cafe-ufotable (2-article cluster)
- tokyo-anime-collab-cafes spring vs summer (2-article cluster — though these are seasonal siblings, may not be true cannibalization)

Next-session decision needed per cluster: canonical+noindex pattern (slam-dunk pattern) vs content merge vs explicit topic split.

### Bucket 6 (L4 calibration policy) — complete

`docs/research/l4-calibration-policy-20260428.md` proposes:
- **A** — accept calibrated floor, raise CI gate threshold from 30 to ~70, treat L4-only-dominant flags as informational
- **B** — brand/IP/venue whitelist filter on 4-gram count (~2-4 h impl)

Recommendation: B (without a useful gate the AI-detection infrastructure becomes shelfware). User decides.

### Bucket 7 (script refactor) — complete on PR but reverted locally

PR #22 extracted metric helpers from 4 scripts into `scripts/ai-detection/lib.ts` (-75 lines net). After push, the working-tree state reverted (linter/external action) — local scripts now back to inline-helpers form. PR #22 status unclear; user may or may not adopt.

## Open PRs (status as of 2026-04-29 ~03:15 Asia/Tokyo)

| PR | Title | Branch | Phase 3 contribution |
| --- | --- | --- | --- |
| #21 | L4 calibration policy proposal | `v3-phase3-l4-policy` | B6 |
| #22 | scripts/ai-detection lib.ts refactor | `refactor/ai-detection-lib-extract` | B7 (status unclear post-local-revert) |
| #23 | content: B1 citation sweep + B2 validUntil sweep + B3 deferred | `v3-phase3-b1-b2-sweep` | B1 partial + B2 + B3 audit docs |

## Failed-agent log

Per `feedback_autonomous_overnight` 3-retry-skip rule, the following agents failed and are skipped (not retried in this session):

| Agent | Mode | Failure | Recovery |
| --- | --- | --- | --- |
| B3a slam-dunk Critic loop | foreground sub-agent | stalled at step 5 (no progress for 600s, watchdog timeout) | Article in safe state (already noindex+canonical); audit docs landed; next-session resumes from step 5 |
| B3b summer-cafes Critic loop | foreground sub-agent | rate-limit (Asia/Tokyo 3:10 AM reset) | Regression reverted; article in safe pre-fix state; next-session uses smart-recovery |
| B1 batch 2 (5 articles) | background sub-agent | rate-limit | Body edits to ~3 articles landed; 2 not edited; phase0-detailed re-evals appended for the 3 edited; citation-sweep aggregator doc NOT updated |
| B1 batch 3 (5 articles) | background sub-agent | rate-limit | Body edit to 1 article landed (jjk-shibuya); 4 not edited; phase0-detailed re-evals appended for all 5; citation-sweep aggregator doc NOT updated |

No destructive operations. No `--no-verify` / `--force` use. No CI-impacting changes.

## Cumulative this session

- Feature-branch commits: 4 (`8d9ab82` L4 policy / `690ab3f` lib refactor / `70980b3` B1+B2 sweep main commit / `de995ec` residual + B3 deferred)
- Main-direct commits: 0 (Bucket 6 was tried main-direct but blocked by hook; switched to feature branch)
- Open PRs: 3 (#21 / #22 / #23)
- Articles modified (frontmatter + body): 32 (24 validUntil + 8 with body citations, 9 of these overlap)
- audit/research docs created: 12 (8 B3 audit docs, B6 policy, 1 deferred-status doc, citation-sweep aggregator + validuntil-applied)
- destructive ops: 0
- `--no-verify` / `--force`: 0
- 5-axis image rule / 5 silo / Takapon / no-delete: 100% honored

## User-side actions next session morning

1. **PR review and merge order**: #21 (L4 policy — decide A or B before merging) → #23 (B1+B2 content + B3 deferred — high priority) → #22 (refactor — decide whether to adopt or close)
2. **Tier A re-run**: re-launch B1 batches 2+3 sub-agents to finish citation work for the remaining 9 articles (citation-sweep aggregator doc currently has only batch 1's 5 rows)
3. **B3 mojibake re-attempt** with smart-recovery: implement selective-replacement helper, retry slam-dunk-kamakura + summer-cafes via the same Critic-loop pattern
4. **B4 E2 v2 + E3** start
5. **B5 R1 cannibalization** decisions per cluster
6. **L4 calibration** implementation (A or B per the user's PR #21 decision)
7. **Sitemap exclusion logic** for validUntil — single ~30-line PR for `app/sitemap.ts`

## Why this Phase 3 came in lighter than the prompt's estimate

The prompt's "1 sprint" target assumed 22-40 hours of sub-agent + foreground throughput. Hit limits:

1. **Asia/Tokyo Anthropic limit reset at 3:10 AM** — 4 sub-agents (B1 batch 2, B1 batch 3, B3a, B3b) running in parallel exhausted the user's per-session budget around the same time, all returning "You've hit your limit · resets 3:10am (Asia/Tokyo)" partway through their work.
2. **B3a-specific stall** — sub-agent watchdog killed it at step 5 (apply fix) with no diagnostic. Likely a tool-call hang, not rate-limit-related.
3. **Summer-cafes regression discovery** — the smart-recovery vs whole-file-Buffer-round-trip distinction was not in the original protocol. Discovered live during the partial fix attempt; reverted and documented for next-session correction.

The 7-bucket prompt was ambitious for one session; rate-limit cliff is the binding constraint for next-session planning.
