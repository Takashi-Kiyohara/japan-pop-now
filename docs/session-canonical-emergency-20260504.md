# Session — Canonical Emergency 2026-05-04

**Trigger**: User-supplied WAIT-AND-INTERRUPT during the autonomous
Phase 1 daily monitor. GSC URL Inspection screenshot showed
`tokyo-anime-collab-cafes-spring-2026` with apex canonical and
"参照元サイトマップ: 検出されず", and the user hypothesized the canonical
generator was emitting apex across all pages.

**Outcome**: Hypothesis disconfirmed. No code change required.
Production state was already correct. Stale GSC crawl data (last-crawl
2026-04-10) was the source of the alarming UI display.

## Bucket A — apex canonical / og:url full audit

**COMPLETE.** No commits required (no leaks found).

Method:
- Fetched `https://www.japan-pop-now.com/sitemap.xml` (101 URLs).
- Per URL, fetched HTML with Googlebot UA, extracted first
  `<link rel="canonical">` and `<meta property="og:url">`.
- Counted hostname patterns; flagged any apex hosts.

Result:

| Axis | www host | apex host | empty |
| --- | ---: | ---: | ---: |
| Canonical | 101 | **0** | 0 |
| og:url | 101 | **0** | 0 |

No leaks. Audit doc: `docs/audit/canonical-apex-leak-20260504.md`.

## Bucket B — canonical generation logic fix

**SKIPPED.** Audit disconfirmed the hypothesis. Existing
canonical-generation logic (across `app/cafes/page.tsx`, article
metadata generators, sitemap helper) already emits www host.
No PR opened, no main change.

## Bucket C — sitemap coverage audit

**COMPLETE.** Method: enumerate every `content/articles/*.{md,mdx}`,
test slug membership in sitemap; for missing slugs, classify as
legitimate exclusion (validUntil-past or robots-noindex) or unknown.

Result: 79 article URLs in sitemap, 87 article files in repo,
**8 missing all with legitimate reasons**:

| Slug | Reason |
| --- | --- |
| animejapan-2026-guide-international-visitors | validUntil 2026-03-30 |
| jujutsu-kaisen-cafes-japan-2026-guide | validUntil 2026-04-30 |
| my-hero-academia-cafe-tokyo-2026 | validUntil 2026-04-27 |
| jjk-sweets-paradise-complete-guide-2026 | validUntil 2026-04-30 |
| my-hero-academia-waffle-diner-ikebukuro-2026 | validUntil 2026-04-27 |
| osaka-anime-collab-cafes-pop-culture-2026 | robots-noindex (cannibalization 308 source) |
| slam-dunk-kamakura-pilgrimage-2026 | robots-noindex (cannibalization, prior session) |
| demon-slayer-rerun-cafe-ufotable-2026 | robots-noindex (cannibalization 308 source) |

Zero unknown exclusions. **`tokyo-anime-collab-cafes-spring-2026` IS
in current sitemap** (the GSC "検出されず" was also stale-crawl
artifact).

## Bucket D — Google sitemap ping

**NOT POSSIBLE.** Endpoint `https://www.google.com/ping?sitemap=…` is
deprecated by Google since June 2023. Test:

```
$ curl -sI "https://www.google.com/ping?sitemap=https://www.japan-pop-now.com/sitemap.xml"
HTTP/2 404
```

Response body links to <https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping>
("Sitemaps ping is deprecated"). The supported path is the GSC
dashboard's manual sitemap re-submission. Documented for user in
`docs/notify/canonical-fix-20260504.md`.

## Bucket E — GSC re-submit priority list

**COMPLETE.** Output: `docs/notify/gsc-resubmit-priority-20260504.md`.

25 URLs listed in 4 tiers:

- Tier 1 (8): GSC-flagged URL + 2026-05-04 indexing-blast PR beneficiaries
- Tier 2 (3): wp-uploads-fix companions + /cafes hub (just lifted)
- Tier 3 (11): recent publish cohort
- Tier 4 (3): cannibalization redirect targets

User actions: (1) GSC Sitemaps panel → re-submit `sitemap.xml`,
(2) URL Inspection → REQUEST INDEXING on each URL.

## Cumulative emergency metrics

| Metric | This emergency |
| --- | --- |
| URLs audited | 101 |
| Apex leaks found | 0 |
| Sitemap-coverage gaps found | 0 (8 articles excluded all with legitimate reasons) |
| PRs opened | 0 |
| main commits | docs only (3 audit/notify/session files) |
| `--admin` overrides | 0 |
| `--no-verify` / `--force` / destructive ops | 0 |
| False claims | 0 (all audit results verified by parallel methods) |
| Critic-loop applications | n/a (no code change to gate) |

## Phase 1 daily monitor — resumed

The Phase 1 cron at `17 9 * * *` continues unchanged. Adding to its
verify list: a 24h re-audit of canonical hostname distribution
across all sitemap URLs to detect any regression after Google's
post-resubmit re-crawl. The baseline established today is
**101/101 www, 0/101 apex**.

## Closing note for human review on user-return

The GSC dashboard's URL Inspection display can lag the production
state by days when the URL is in a low-priority crawl bucket. The
healthy production state preceded the GSC display by ≥3 weeks for
this URL. Future "GSC says X" findings should be sanity-checked
against direct curl to the production HTML before assuming a code
defect.

Session canonical-emergency complete. Phase 1 resumes.
