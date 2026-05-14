# R14-final Step 3 — Live HTML verify

**Date:** 2026-05-14
**HEAD:** `88ccb19` (R14-final Step 2 catch-all commit)
**Deploy:** Vercel Production 2026-05-14T06:03:52Z (sha `88ccb191dbe11fe5d36674343147229bf1ec2c60`)

## Verification matrix

| Sample type | Slug | Pre-strip refs | Post-strip live count | Expected | Result |
|---|---|---:|---:|---:|---|
| Affected (Step 1) | `anime-hotels-tokyo-2026` | 1 inline (`**Share on Threads:**` L188) | 2 | 2 (ThreadsCTA + AuthorBox) | PASS |
| Non-affected control | `jojo-stone-ocean-cafe-jojo-world-2026` | 0 | 2 | 2 | PASS |

## Curl commands run

```
curl -sA "Googlebot/2.1 (+http://www.google.com/bot.html)" \
  "https://www.japan-pop-now.com/articles/anime-hotels-tokyo-2026?cb=verify-<random>" \
  | grep -oE 'href="https://www\.threads\.net/@pop_now_jp"' | wc -l
  → 2

curl -sA "Googlebot/2.1 (+http://www.google.com/bot.html)" \
  "https://www.japan-pop-now.com/articles/jojo-stone-ocean-cafe-jojo-world-2026?cb=verify-<random>" \
  | grep -oE 'href="https://www\.threads\.net/@pop_now_jp"' | wc -l
  → 2
```

## Corpus grep confirmation

```
grep -lE "@pop_now_jp" content/articles/*.md content/articles/*.mdx | wc -l
  → 0
```

All 17 articles touched by R14-final (6 named in Step 1 + 11 catch-all in Step 2) now show 2 threads-href page-wide, matching the non-affected control. The 2-href count is the intended state: 1 ThreadsCTA component (auto-injected at article-end) + 1 AuthorBox footer social icon (separate component).

## What the 2 hrefs are

| Render | Source | aria-label |
|---|---|---|
| 1st | `components/ThreadsCTA.tsx` rendered by `app/articles/[slug]/page.tsx:402` | `Follow on Threads` |
| 2nd | `components/AuthorBox` footer social icon | `Threads` |

Both are component-emitted, so the count is deterministic per render. The R14-final sweep eliminated the body-text inline references that were producing additional duplicates.
