# JPN Rewrite Log - April 2026

Automated log written by the jpn-rewrite-scheduler scheduled task.

## Rewrite - 2026-04-22

Bi-weekly stale content refresh run (scheduled task: jpn-rewrite-scheduler). 2 articles selected from the top-of-stale list (both 29 days since lastUpdated). Neither `content_operations/rewrite-queue.md` nor `content_operations/audit-report-*.md` existed, so candidates were picked by scanning `content/articles/` frontmatter `lastUpdated` dates.

| Article | Type | Changes | CI Result | Attempts |
|---------|------|---------|-----------|----------|
| anime-merch-shopping-guide-japan.md | MAJOR | Fixed description/excerpt drift (body is a general shops guide, not JJK PLAZA); added live "JJK PLAZA Chair:Black" status section with per-venue open/ended status (Umeda ended, Solamachi final days, Nagoya ended, Sendai opens Apr 24, Kyoto May 13); bumped lastUpdated; updated visible "Last updated: April 2026" -> "April 22, 2026" | PASS (commit b5444e88) | 1/5 |
| how-to-book-anime-collab-cafe-japan.md | MINOR | Bumped lastUpdated; updated visible "Last updated: March 2026" -> "April 22, 2026"; added Apr 22 freshness note confirming Lawson Ticket / e+ / Animate Cafe Reserve + lottery model still current; converted one external japan-pop-now.com link to internal /articles/ path | PASS (commit 5aea709c) | 1/5 |

### Notes
- WebSearch (JP-first) surfaced current JJK PLAZA Chair:Black venue/date table from collabo-cafe.com and official @jujutsu_plaza X posts; cross-checked via jujutsukaisen.jp and essential-japan.com.
- No pop-up cancellations or price changes detected; only natural end-of-run status transitions.
- Both CI passes were clean on attempt 1: seo-validation, build-and-lint (20.x), validate, Validate Articles, image-quality, CodeQL, secret scan, npm audit - all green.
- Author retained as "Takapon" on both (was already Takapon).
- No queue file existed, so no items removed. Recommend creating `content_operations/rewrite-queue.md` or `reports/audit-report-{date}.md` so future scheduled runs have deterministic input.



## Rewrite - 2026-04-29

Bi-weekly stale content refresh run (scheduled task: jpn-rewrite-scheduler). 2 articles selected from the top-of-stale `.md` list (35 days and 32 days since lastUpdated). `content_operations/rewrite-queue.md` and any `audit-report-*.md` still do not exist, so candidates were picked by scanning `content/articles/` frontmatter `lastUpdated` dates and prioritizing time-sensitive cafe content.

| Article | Type | Changes | CI Result | Attempts |
|---------|------|---------|-----------|----------|
| tokyo-anime-collab-cafes-spring-2026.md | MAJOR | (1) Bumped lastUpdated 2026-03-25 -> 2026-04-29 and refreshed visible "Last update" line; (2) **Fixed factual error**: 2026 Conan movie is "Highway no Datenshi" (ハイウェイの堕天使) not "The One-Eyed Remnant" (隻眼の残像 — that was 2025). Rebuilt the Conan section with the actual two-period BOX cafe&space schedule (Shibuya/Ikebukuro Grandscape/Solamachi: Apr-May first half / May-Jun-Aug second half); (3) Marked 6 collabs as ENDED with explicit dates and "What instead?" pointers — JJK PLAZA Tokyo Solamachi (Apr 26), MDD S2 mottocafe (Apr 19), Tokyo Revengers Princess Cafe (Apr 26), Reborn! and GALLERY (Apr 22), HUNTER×HUNTER Gratte (Apr 15), MHA × DECOTTO (Apr 26); (4) Promoted JJK PLAZA Sendai Loft (Apr 24-May 20) as the currently-running venue and added Kyoto Loft (May 13-Jun 10) as upcoming; (5) Updated Black Jack Tokyo end date (May 18 in Tokyo, May 25 elsewhere) with full Collabo_Index Ikebukuro PARCO 8F venue + menu detail; (6) Reframed Ouran section to flag Tokyo closing in 3 days plus Osaka/Hakata May 23-Jun 4; (7) Renamed "Open Now: April 2026" -> "Late April-May 2026 (Including Golden Week)" and "Coming in April" -> "Closing Through May 2026" | PASS (commit 8d2eb627) | 1/5 |
| animate-cafe-guide-japan.md | MINOR | Bumped lastUpdated 2026-03-28 -> 2026-04-29; updated visible "Last updated: March 2026" -> "April 29, 2026" with current-status note; added a new "What Is Currently Running (Late April 2026)" section near the top covering i7 (アイドリッシュセブン) Rivare Chaya at Animate Cafe Tokyo/Osaka (Apr 7-May 10), DECOTTO between-collabs status (MHA closed Apr 26), and Gratte rotation note; updated excerpt to mention current i7 collab | PASS (commit 09da8f54) | 1/5 |

### Notes
- WebSearch (JP-first) confirmed: JJK PLAZA Sendai is open as of Apr 24 with Chair:Black standing panels installed (per @jujutsu_plaza X), Kyoto Loft May 13-Jun 10 on schedule. Conan 2026 movie title verified across conan-movie.jp, eiga.com, cinematoday.jp, and Wikipedia (ja).
- CI passed clean on attempt 1 for both: seo-validation, build-and-lint (20.x), validate, Validate Articles, image-quality, CodeQL, secret scan, npm audit, security-checks - all green. visual-qa was excluded from gating per task spec.
- Author retained as "Takapon" on both (was already Takapon).
- No queue file existed, so no items removed. Recommendation from 2026-04-22 run still stands: create `content_operations/rewrite-queue.md` so future scheduled runs have deterministic input.
- 6 cafes flagged as ended is unusually high for a single bi-weekly window — this reflects the natural Apr 22-26 turnover wave (most spring runs ended on 4/26 with Golden Week starting 4/29). Worth flagging to editorial-planner: schedule the next refresh of this article for 2026-05-13 to capture Kyoto Loft opening + Black Jack Tokyo closing + Ouran Osaka/Hakata launch.
