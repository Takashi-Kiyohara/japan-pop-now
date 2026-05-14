---
name: r15-critic-round-1
description: R15 external Critic Round 1 — full 11-layer + 6 fix verification GREEN, RULE T GSC submit GO
subagent_agentId: a8e4cf324b097d8a5
subagent_type: general-purpose
critic_round: 1
date: 2026-05-14
HEAD_at_critic: 0cd6747
verdict: GREEN — RULE T GSC submit GO
---

# R15 Critic Round 1 — Verdict

**agentId:** `a8e4cf324b097d8a5`
**Date:** 2026-05-14
**HEAD:** `0cd6747`
**Deploy:** Production, Age ~204s at critic evaluation

## 11-layer scoring (all GREEN)

| Layer | Verdict | Evidence |
|---|---|---|
| L1 Routing | GREEN | 5/5 sample URLs HTTP 200 with Googlebot UA |
| L2 CI | GREEN | npm run validate 88/88 pass, 0 errors |
| L3 Sitemap | GREEN | 106 URLs; /menu + /bookmarks absent; 5/6 cannibal slugs absent (1 hit was /guides/tokyo-anime-cafes hub URL, not a cannibal article) |
| L4 Privacy | GREEN | /privacy 200, 5236 words (above 1500 floor) |
| L5 Pseudonym | GREEN | 0 hits for "Takashi Kiyohara\|清原崇" |
| L6 Image | GREEN | 12/12 manifest-referenced Bucket A assets 200 |
| L7 Fabrication | GREEN | DBZ first-person triplet 0 hits |
| L8 Schema | GREEN | BlogPosting present; publisher.logo /logo.png 200 |
| L9 Affiliate | GREEN | 0 `aff_id=N` hits; rel="nofollow sponsored noopener" on 3 sample articles |
| L10 Doc reconcile | GREEN | master audit 11958B (>10KB); fix-evidence 5630B; 3 scripts present |
| L11 Bot crawlability | GREEN | R12-P0 intact |

## 6 Phase-1 fix verifications (all GREEN)

| Fix | Result |
|---|---|
| A — category single-hop ×4 | all "1 hops, final 200" |
| B — mixed-case bare-slug ×3 | all "1 hops, final 200" |
| C — sitemap_index 308 | "308 → /sitemap.xml" |
| D — WP residue 410 | /wp-admin/wp-content/xmlrpc all 410 |
| E — /menu noindex | `<meta name="robots" content="noindex, follow"/>` |
| F — /bookmarks noindex | `<meta name="robots" content="noindex, follow"/>` |

## R12-P0 regression check

- Mediapartners-Google: no X-Robots-Tag header (stable)
- EvilBot/1.0: `noindex, nofollow` (stable)

R12-P0 bot whitelist + R13-A asset 200s + R14 Threads CTA dedup all intact.

## RULE T GSC submit verdict: GO

Critic verbatim:
> "GSC 22nd submit attempt has GREEN runway across all 11 layers + 6 fixes — recommend GO."

## Critic verbatim notes

> "R15 sprint shipped clean: 20 redirect-error URLs now 1-hop (Fix A closes GSC chain pattern), 7 mixed-case 404s closed (Fix B), WP residue eliminated as 410 (Fix D), sitemap_index canonicalized (Fix C), /menu+/bookmarks sitemap-meta now aligned (Fix E+F). Vary poisoning not triggered, R12-P0 bot whitelist intact, no regression on R10-R14 wins."

## Minor advisory (not blocking)

> "Critic Bucket A asset list contained 5 name-stale entries (icon-192x192.png, icon-512x512.png, screenshot-mobile.png, screenshot-desktop.png, og-default.jpg) — repo actually uses icon-192.png / screenshot-1280.png naming convention; all 12 real referenced assets (per manifest.json) return 200."

This was a critic-side spec issue, not a repo issue. All 12 manifest-referenced assets verified 200.

## Required fixes for R2/R3

None. R2 and R3 proceed as regression-check + Section 5 final verdict rounds.
