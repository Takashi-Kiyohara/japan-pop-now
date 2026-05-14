---
name: r13-critic-round-2
description: R13 external Critic Round 2 — verifies R1 fix application; Fix 1 GREEN, Fix 2 RED (Vary still not at CDN)
subagent_agentId: a21a55759f86ef1cc
subagent_type: general-purpose
critic_round: 2
date: 2026-05-14
HEAD_at_critic: 4ca138e
verdict: YELLOW (Fix 1 GREEN, Fix 2 RED, 9 R1-GREEN layers stable)
---

# R13 Critic Round 2 — Verdict

**agentId:** `a21a55759f86ef1cc`
**Date:** 2026-05-14
**HEAD at evaluation:** `4ca138e41321476a69c17fdf42576dfca9a3a1b5`
**Deploy verified:** 4ca138e success Production at 2026-05-14T01:17:17Z

## R1 fix verification

| Fix | Status | Evidence |
|---|---|---|
| Fix 1 — akiba klook rel | GREEN | All 3 anchors (L56/L107/L148) now `rel="nofollow sponsored noopener"`; 0 hits of `nofollow nofollow` |
| Fix 2 — Vary:User-Agent | **RED** | Production Vary header is framework-only: `rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`; middleware-set `User-Agent` does NOT survive to response |

## Fix 2 root cause analysis (R2 critic verbatim)

> "Next.js App Router emits its framework Vary header AFTER middleware NextResponse.next() returns, overwriting (not merging) any middleware-set Vary on the same NextResponse. The R1 fix assumed merge semantics; production behavior is overwrite."

R2 critic recommended Option A (vercel.json) as the highest-signal fix because vercel.json headers apply at CDN edge AFTER framework headers with documented "later wins, comma-joined" merge semantics.

## R1-GREEN layers regression check

| Layer | Status | Note |
|---|---|---|
| L1 Routing | stable | 5/5 articles 200 |
| L2 Build | stable | exit 0 |
| L3 Sitemap | stable | 79 article entries, cafes present, cannibalization absent |
| L4 Privacy | stable | 5521 words (slight whitespace-strip method delta vs R1's 6552; both above 1500 baseline) |
| L5 Pseudonym | stable | 0 hits |
| L6 Image | stable | 11/11 Bucket A assets 200 |
| L7 Fabrication | stable | 0 first-person hits |
| L8 Schema | stable | conditional + publisher.logo 200 |
| L10 Doc reconcile | stable | 10 docs |
| L11 Bot-crawlability | **PARTIAL** | Google bot whitelist still PASS, but Vary:User-Agent durability lock still missing |

## Required R3 fix

Switch to vercel.json approach for Vary:User-Agent. Add:
```json
{
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "Vary", "value": "User-Agent, Accept-Encoding" }] }
  ]
}
```

Verification gate: `curl -sI -A "Mediapartners-Google" https://www.japan-pop-now.com/?cb=<random> | grep -i ^vary` must show `User-Agent` token in Vary value.

## R2 critic notes (verbatim)

> "R1 fix application introduced NO new issues. The akiba klook rel fix is clean. The middleware Vary code itself does not break anything — it just doesn't achieve its goal."

> "The middleware Vary attempt is not a regression on R12-P0. The R12-P0 bot whitelist (4 Google UAs no noindex, unknown bots tagged noindex) is still working — confirmed independently. Fix 2 RED concerns the durability lock (Vary:User-Agent at CDN) only; the immediate AdSense crawlability path through the whitelist is intact."

> "Until Vary:User-Agent ships, the bot-whitelist edge case (an AdsBot response cached under a UA-agnostic key, then served to a human) remains the residual risk. Severity is low because R12-P0 already removed the noindex tag for Google bots, but the durability lock is incomplete."
