# Dimension 1: Deployment Integrity Audit (2026-04-27)

## Status: ✅ GO

## Findings
| # | severity | description | auto-fixed | commit/PR |
|---|---|---|---|---|
| — | — | No findings. Working tree clean (untracked dev artifacts only), local == origin/main, latest production deploy SHA == HEAD == `8084873`, all probed endpoints return 200. | — | — |

## Verifications run

### 1. Working tree
```
$ git status
On branch main
Your branch is up to date with 'origin/main'.
Untracked files: (dev-only artifacts: .tmp/, analytics/lh_*, scripts/__pycache__/, push_20260425_week2/, scripts/_redo_phase3c_*.py, components/{ArticleCardV2,BentoGrid,CountdownStrip}.tsx, data/popular.json, middleware.ts.bak.*, claude-code-batch-a-20260417.md, .claude/settings.local.json, scripts/inject-gsc-creds.ps1, docs/images/redo3rd-phase3b-prod-verify-20260426.md)
nothing added to commit but untracked files present
```
No tracked files modified or deleted → **PASS** (untracked OK per policy).

### 2. Local vs origin/main
```
$ git log origin/main..HEAD --oneline
(empty)
$ git rev-parse HEAD             # 8084873a97ab93fb7a1719021f9d778510e34c7d
$ git rev-parse origin/main      # 8084873a97ab93fb7a1719021f9d778510e34c7d
```
Local HEAD identical to origin/main → **PASS**.

### 3. Vercel deploy SHA vs main HEAD
```
$ gh api repos/Takashi-Kiyohara/japan-pop-now/deployments?per_page=5
sha=8084873... env=Production created=2026-04-26T16:56:45Z  state=success
sha=9c3f3a0... env=Production created=2026-04-26T16:50:00Z  state=success
sha=629bd31... env=Preview    created=2026-04-26T16:44:33Z  (PR #10 branch)
sha=2a9c9e6... env=Preview    created=2026-04-26T16:41:43Z  (PR #10 branch)
sha=c246430... env=Production created=2026-04-26T16:37:53Z  state=success
```
Latest **Production** deploy SHA `8084873` == HEAD == origin/main. Status `success`, target_url `https://japan-pop-c1m9e3rw2-takashi-kiyoharas-projects.vercel.app`. → **PASS** (no deploy lag).

### 4. Production homepage health
```
$ curl -sI https://www.japan-pop-now.com/
HTTP/1.1 200 OK
Server: Vercel
Etag: "117igdmjwb2513f"
X-Nextjs-Prerender: 1
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
→ **PASS**.

### 5. Production article sample (3 random slugs)
```
$ curl -sIL -A "Mozilla/5.0" https://www.japan-pop-now.com/articles/akihabara-complete-guide-2026
HTTP/1.1 308 Permanent Redirect → HTTP/1.1 200 OK
$ curl -sIL -A "Mozilla/5.0" https://www.japan-pop-now.com/articles/chiikawa-bakery-harajuku-guide-2026
HTTP/1.1 308 Permanent Redirect → HTTP/1.1 200 OK
$ curl -sIL -A "Mozilla/5.0" https://www.japan-pop-now.com/articles/demon-slayer-pilgrimage-tokyo
HTTP/1.1 308 Permanent Redirect → HTTP/1.1 200 OK
```
The 308 → 200 chain is the expected Next.js trailing-slash canonicalization (no-trailing-slash policy). Final response `200 OK` → **PASS** for all 3 sampled articles.

## Conclusion
- **GO**: working tree clean, local in sync with origin/main, latest Vercel production deploy points at HEAD `8084873` with `success` state, homepage and 3 sampled articles return 200. No deploy lag, no P0 findings.
