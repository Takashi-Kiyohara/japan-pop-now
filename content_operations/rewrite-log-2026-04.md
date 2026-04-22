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

