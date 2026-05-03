# Canonical / og:url Apex-Leak Audit — Emergency Bucket A

**Trigger**: GSC URL Inspection of `tokyo-anime-collab-cafes-spring-2026`
showed `canonical: https://japan-pop-now.com/articles/{slug}` (apex,
not www) with last-crawl 2026-04-10 and "参照元サイトマップ: 検出されず".
Working hypothesis was that canonical-generation logic emits apex
across all pages, defeating the apex→www redirect and creating an
indexing dead-loop.

**Method**: Fetched all 101 URLs from current `sitemap.xml` with
Googlebot UA. Extracted the first `<link rel="canonical" href="…">`
and `<meta property="og:url" content="…">` from each response.
Counted hostname patterns and flagged any apex-host URLs.

**Result**: **0 apex leaks across 101 sitemap URLs**, both axes.
The hypothesis is **disconfirmed for current production state**.

## Per-axis hostname distribution

| Axis | `https://www.japan-pop-now.com` count | Apex `https://japan-pop-now.com` count | Empty |
| --- | ---: | ---: | ---: |
| `<link rel="canonical">` | 101 | 0 | 0 |
| `<meta property="og:url">` | 101 | 0 | 0 |

## Sample verifications (5 URLs spot-checked beyond the audit script)

| URL | Final HTTP | Canonical |
| --- | :-: | --- |
| /articles/tokyo-anime-collab-cafes-spring-2026 | 200 | https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-spring-2026 ✓ |
| /articles/tokyo-anime-collab-cafes-summer-2026 | 200 | https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-summer-2026 ✓ |
| /articles/demon-slayer-rerun-cafe-ufotable-2026 | 308→200 | redirect target's canonical (kizuna) ✓ |
| /articles/osaka-anime-collab-cafes-pop-culture-2026 | 308→200 | redirect target's canonical (cafes-complete) ✓ |
| / (homepage) | 200 | https://www.japan-pop-now.com ✓ |

## Conclusion

The GSC report's "apex canonical" finding was **stale crawl data**.
Last-crawl date 2026-04-10 predates this project's apex→www 308
redirect (already in `next.config.ts:113-118` before the 2026-05-04b
indexing-blast session) and the canonical-generation logic that emits
`https://www.japan-pop-now.com/...` across every metadata callsite.

**No code change required for Bucket B canonical-fix scope.** The fix
the GSC dashboard surfaces will land naturally on the next Googlebot
re-crawl of the URL.

## Linked observation: sitemap presence

GSC also reported "参照元サイトマップ: 検出されず" for the same URL.
Spot-check of current sitemap (`/tmp/sitemap_urls.txt` from the audit
fetch): **`tokyo-anime-collab-cafes-spring-2026` IS in current
sitemap.xml**. Like the canonical, the GSC's "missing from sitemap"
observation is from the 2026-04-10 crawl when the sitemap content
differed.

## What to do instead

1. Skip Bucket B (canonical-generation fix). Logic is already correct.
2. Trigger GSC re-crawl for the affected URLs via URL Inspection
   Tool — see `docs/notify/gsc-resubmit-priority-20260504.md`.
3. Continue Phase 1 daily monitor as scheduled. Add a 24h re-audit
   pass on the same axes to confirm stability.
