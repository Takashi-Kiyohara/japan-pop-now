# R13 Bucket B — Headers / middleware reinforcement fix doc

**Bucket:** B
**Date:** 2026-05-14
**Items:** B1 Vary:UA / B2 Content-Language:en / B3 google-site-verification meta
**Commit:** `9d991ce` (single commit per spec batch-allowed for B1+B2; B3 inline)

## Changes

| # | item | file | line ref |
|---|---|---|---|
| B1 | `Vary: User-Agent` | `next.config.ts` | securityHeaders array |
| B2 | `Content-Language: en` | `next.config.ts` | securityHeaders array |
| B3 | `verification.google: '5364a8f3197d1e76'` (Metadata API) | `app/layout.tsx` | metadata.verification |

## Rationale

**B1 Vary on UA**: post-R12-P0 middleware bot whitelist treats AdsBot-Google / Mediapartners-Google / Google-InspectionTool differently from regular browsers. Without `Vary: User-Agent`, Vercel CDN could serve a cached response with X-Robots-Tag from a prior bot request to a subsequent browser request (or vice versa). With `Vary: User-Agent`, edge cache keys include UA, so bot responses and browser responses don't bleed across cache entries.

**B2 Content-Language**: explicit `Content-Language: en` declares the site language at the HTTP-header layer (complementing `<html lang="en">` at the HTML layer). Helps crawlers + accessibility tools.

**B3 google-site-verification meta**: existing file-method (`/google5364a8f3197d1e76.html`) is canonical; Metadata API adds belt-and-suspenders so a single missed deploy can't cause GSC verification regression.

## Evidence (TBD — fetched post-deploy in PDCA Round 1)

Expected curl outputs:
```
curl -sI https://www.japan-pop-now.com/ | grep -iE 'vary|content-language'
  Vary: User-Agent
  Content-Language: en

curl -s https://www.japan-pop-now.com/ | grep 'google-site-verification'
  <meta name="google-site-verification" content="5364a8f3197d1e76" />
```

## RULE compliance

- RULE B: this doc generated
- RULE H: 1 commit for whole bucket (B1+B2 batched per spec allowance; B3 also same commit since 1 file each)
- RULE M: no regression in R12-P0 middleware fix (middleware.ts not touched)

## Bucket B duration

~10 min.
