---
name: r12-p0-middleware-fix-critic
description: External Critic verdict for R12-P0 emergency middleware bot-whitelist fix (commit 358f0dc) — GREEN, fix verified live
subagent_agentId: aa2e53126e5fc601b
subagent_type: general-purpose
date: 2026-05-14
fix_commit: 358f0dc
verdict: GREEN
---

# R12-P0 Critic — Middleware Bot Whitelist Fix Verification

**Critic spawned via:** Task tool subagent `general-purpose`
**agentId:** `aa2e53126e5fc601b`
**Fix commit:** `358f0dc` (fix(middleware): whitelist all Google verification bots)
**Deployed to production:** 2026-05-14T00:20:29Z (~70s after push)
**Date:** 2026-05-14

## Root cause (per prior external Critic Round 2)

`middleware.ts:162-166` had:
```js
const isKnownBot = /Googlebot|Bingbot|GPTBot|ClaudeBot|PerplexityBot|Applebot|Slurp|DuckDuckBot|Baiduspider|Yandex/i.test(ua)
const isBotLike  = /bot|crawler|spider|scraper|fetch|curl|wget|python|java(?!script)/i.test(ua)
if (isBotLike && !isKnownBot) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
}
```

Failure mode: `AdsBot-Google` contained "Bot" so `isBotLike=true`, but the literal substring `Googlebot` did NOT match `AdsBot-Google` so `isKnownBot=false` → `X-Robots-Tag: noindex, nofollow` returned to the AdSense crawler. 11 cycles of indexation-fix attempts could not see the underlying noindex header because the prior critic rounds tested with `Googlebot` UA only, which was correctly whitelisted.

## Fix verification — live curl test results

All 6 tests on the deployed `358f0dc`:

| # | UA | HTTP | X-Robots-Tag | Verdict |
|---|---|---|---|---|
| 1 | Mediapartners-Google | 200 | absent | GREEN |
| 2 | Google-InspectionTool/1.0 | 200 | absent | GREEN |
| 3 | AdsBot-Google | 200 | absent | GREEN (was broken before fix) |
| 4 | Googlebot/2.1 | 200 | absent | GREEN |
| 5 | "SomeUnknownBot/1.0" (negative test) | 200 | `noindex, nofollow` | GREEN — correctly tagged |
| 6 | Regular Chrome (negative test) | 200 | absent | GREEN — human users unaffected |

Negative tests confirm the isBotLike + !isKnownBot tagging logic still works correctly for non-whitelisted crawlers + regular browsers.

## Cache verification

Tests 3-6 initially returned `X-Vercel-Cache: HIT` with identical Etag, raising a cache-correlation question. Critic re-ran AdsBot-Google + Unknown bot with cache-busting query strings (`?_critic=r12p0-...`):
- AdsBot-Google still NO `X-Robots-Tag` (whitelist works fresh)
- Unknown bot still got `noindex, nofollow` (negative test still triggers)

This confirms middleware executes per-request and sets response headers correctly regardless of edge cache state — the Vercel edge serves the cached HTML body but middleware always applies `response.headers`.

## Other security headers (unchanged, sanity-verified)

CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all intact across all 6 tests. No regression.

## Critic verbatim closing

> "R12-P0 emergency middleware fix is verified live. The 11-cycle indexation failure root cause is resolved. AdSense reviewer crawl and GSC URL Inspection probes will no longer receive X-Robots-Tag: noindex."

## Files cited

- `middleware.ts` lines 160-200 (358f0dc diff)
- `gh api repos/Takashi-Kiyohara/japan-pop-now/deployments` confirmed 358f0dcd3e26c1604cf9cc9a53ff973eb6e5b096 deployed to Production environment with status success

## Sprint context

R12-P0 sits outside the R11 sprint cycle (which closed at commit `c8ff5d9`). This was an emergency single-file middleware fix prompted by external Critic Round 2 finding the root cause of 11 cycles of indexation failure. Scope was strictly bounded to `middleware.ts` per user instruction; no other files touched.
