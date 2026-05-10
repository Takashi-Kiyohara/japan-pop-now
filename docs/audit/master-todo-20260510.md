# R10 master-todo — fresh codebase enumeration 2026-05-10

**Source:** Independent enumeration critic agentId `a55d910f0b611b1b3` (Phase 0, R10 sprint)
**Method:** Fresh deployed-URL fetch + corpus grep + file inspection. **No tmp/ files cited as evidence.** No prior audit doc trusted. Klook compliance standard = `aff_adid=[0-9]+` only (not `aff_id=` short form, per project policy).
**HEAD at enumeration time:** `cf460e9` (Vercel-deployed)
**Enumeration window:** 2026-05-10T07:00–07:25Z UTC

## Aggregate

- **Total items:** 54 (≥39 per RULE A)
- **PASS:** 35
- **FAIL:** 18 — these become R10 fix scope (Phase 1-N)
- **UNKNOWN:** 0
- **INFO (raw counts feeding ratios):** 3 (R10-42, R10-43, R10-54 partial)

## R10 fix scope (FAIL items only — no judgment-call defer)

Per RULE D, Code may not unilaterally defer. R10-25 (Giscus repo URL leaks real name) is a special case — the URL must match the actual GitHub repo for discussions to load — proposed for explicit user-approval defer track.

| id | layer | item | verdict | fix priority |
|---|---|---|---|---|
| R10-12 | CI | klook-gate workflow does NOT exist | FAIL | P1 (defensive — would have caught R10-46/47) |
| R10-13 | CI | cwv-daily.yml failing on HEAD | FAIL | P2 (workflow-internal, not user-facing) |
| R10-15 | sitemap | spec asked for `mha-waffle-diner` literal; actual slug is `my-hero-academia-waffle-diner-ikebukuro-2026` | DOCUMENT-ONLY (user-approved 2026-05-10) | Spec-text mismatch; real slug IS in sitemap (R10-17 PASS). No code change. Adding redirect for the abbreviation = zero value + wildcard-trap risk per `feedback_nextjs_redirects_case_insensitive`. CLOSED-AS-NOT-A-FAULT. |
| R10-25 | pseudonym | `Takashi-Kiyohara/japan-pop-now` hardcoded in `components/GiscusComments.tsx:23` (real GitHub repo path) | DEFER (user-approved 2026-05-10) | Accepted as known artifact: giscus iframe necessarily exposes the repo path. Tracked in `docs/proposed-deferrals-20260510.md`. Comments-on-docs note added. |
| R10-28 | image | slam-dunk article: 4 Takapon refs vs 5 Wikimedia — Wikimedia majority | FAIL | P0 (R9 partial-claim regression) |
| R10-33 | fab | broad spec regex finds 265 hits across 87 files; audit script uses narrower whitelist returning 0 | FAIL | P1 (audit-script widen, not content rewrite — would surface real items) |
| R10-34 | fab | animejapan-comiket-2026-guide.md: 2 broad-regex hits | FAIL | P2 (under broad regex; under narrow regex = PASS) |
| R10-35 | fab | frieren-usj-story-walk + japan-rail-pass-2026-guide: 2 broad-regex hits each | FAIL | P2 (same as R10-34) |
| R10-44 | affiliate | 38 instances of `aff_id=` SHORT FORM across 10 .mdx articles | FAIL | **P0 — production attribution broken** |
| R10-45 | affiliate | 6 truly bare `https://www.klook.com` URLs across 2 .md articles | FAIL | **P0 — production attribution broken** |
| R10-46 | affiliate | source code (`app/page.tsx`, `app/category/[slug]/page.tsx`, `app/guides/[topic]/page.tsx`) uses `aff_id=` short form with empty env var; emits `aff_id=&` in production HTML | FAIL | **P0 — every programmatic CTA broken** |
| R10-47 | affiliate | live HTML emits `aff_id=&utm_source=...` with empty value (verified on akihabara-arcade-rhythm-games-guide URL) | FAIL | **P0 — corollary of R10-46** |
| R10-48 | affiliate | klook compliance ratio = ~85/160 ≈ 53% on full corpus; session report claims 100% | FAIL | (closes when R10-44/45/46 fixed) |
| R10-49 | doc-recon | `section5-readiness-master-20260510.md` cites `tmp/klook-final-check.mjs` as evidence (RULE E violation) | FAIL | P1 (rewrite section to cite real evidence) |
| R10-50 | doc-recon | audit JSON `fabrication=0` derived from narrow whitelist, not spec catch-all | FAIL | (closes when R10-33 fixed) |
| R10-51 | doc-recon | AdSense 78-85% probability claim has no derivation method documented | FAIL | P1 (re-state as editorial estimate, not measured) |
| R10-52 | doc-recon | audit script affiliate axis regex only matches `affiliate.klook.com`, missing `www.klook.com` (74% of corpus) | FAIL | P1 (widen audit regex; closes R10-43/44/45 detection) |

## R10 PASS baseline (35 items — protect, do not touch)

### Layer 1 routing (6/7 PASS)

| id | item | evidence |
|---|---|---|
| R10-1 | /Articles/<slug> uppercase → 301 lowercase | `301 Moved Permanently / Location: /articles/akihabara-arcade-rhythm-games-guide-2026` (live curl 07:00:53Z) |
| R10-2 | /articles/<slug>/ trailing slash → 308 → 200 | `308 Permanent Redirect / Location: /articles/...rhythm-games-guide-2026 → 200` (live, 07:00:55Z) |
| R10-3 | /articles/<slug> direct 200, body ≥10KB | `200 OK / Content-Length: 257320` (07:00:52Z) |
| R10-4 | apex http → https → www-https hop count = 2 | `308 → https://japan-pop-now.com → 308 → https://www.japan-pop-now.com → 200` (07:00:56Z) — 2 hops, accepted |
| R10-5 | /this-does-not-exist → 404 | `404` HTTP code (07:00:58Z) |
| R10-6 | legacy `/lawson-ticket-anime-cafe-booking` → /articles/... 308 → 200 | `308 / Location: /articles/lawson-ticket-anime-cafe-booking → 200 / 295467 bytes` (07:01:02Z) |
| R10-7 | apex direct article (no www) → www first | `308 / Location: https://www.japan-pop-now.com/articles/...` (07:00:44Z) |

### Layer 2 CI (4/6 PASS)

| id | item | evidence |
|---|---|---|
| R10-8 | "CI/CD Pipeline" run on HEAD cf460e9 | `"name":"CI/CD Pipeline","status":"completed","conclusion":"success"` (gh run list, 07:01) |
| R10-9 | "MDX Validate" workflow | `"name":"MDX Validate","conclusion":"success"` |
| R10-10 | "Image Quality Gate" workflow | `"name":"Image Quality Gate","conclusion":"success"` |
| R10-11 | "Content Check" workflow | `"name":"Content Check","conclusion":"success"` |

### Layer 3 sitemap (2/4 PASS, 1 spec-mismatch documented)

| id | item | evidence |
|---|---|---|
| R10-14 | /sitemap.xml HTTP 200, ≥80 entries | `HTTP 200 / size 19464 / 100 <url> entries` (07:01) |
| R10-16 | lastmod values vary across articles | `32 unique lastmod values across 100 entries` (07:01) |
| R10-17 | mha-waffle-diner article reachable in sitemap as full slug | `<loc>.../my-hero-academia-waffle-diner-ikebukuro-2026</loc>` (07:01) |

### Layer 4 privacy (6/6 PASS — R8-A holds)

| id | item | evidence |
|---|---|---|
| R10-18 | /privacy HTTP 200, ≥1500 words | `HTTP 200 / 6545 words` (07:01) |
| R10-19 | "Article 6" / GDPR present | `2 hits for "Article 6"` (07:01) |
| R10-20 | CCPA section present | `2 hits for "CCPA"` (07:01) |
| R10-21 | Cookie inventory `<table>` present | `1 <table element` (07:01) |
| R10-22 | contact email = snsganbaro@gmail.com | `snsganbaro@gmail.com (3 occurrences); takashi03157 = 0` (07:01) |
| R10-23 | Last-updated date ≥2026-05-01 | `Last updated: 2026-05-10` (07:01) |

### Layer 5 pseudonym (3/4 PASS)

| id | item | evidence |
|---|---|---|
| R10-24 | takashi03157@gmail.com NOT in app/components/content/lib | `No matches found` (07:01) |
| R10-26 | Takapon byline on akihabara-arcade article | `3 occurrences "Takapon"` (07:01) |
| R10-27 | Takapon byline on animate-cafe-guide-japan article | `3 occurrences "Takapon"` (07:01) |

### Layer 6 image (4/5 PASS — R10-28 FAIL)

| id | item | evidence |
|---|---|---|
| R10-29 | Krispy: imageCredit field present | `imageCredit: 'Photo: Takapon / Japan Pop Now (Shibuya Cine Tower visit, April 2026)'` (file inspection 07:02) |
| R10-30 | Krispy: every body image caption has Takapon attribution | `4 image refs / 4 captions all end "Photo: Takapon / Japan Pop Now"` (07:02) |
| R10-31 | "illustrative venue context" placeholder absent | `No files found` (corpus grep 07:02) |
| R10-32 | /og-image.png ≥10KB | `200 / 17795 bytes` (07:02) |

### Layer 7 fabrication (2/5 PASS — R10-33/34/35 FAIL under spec broad regex)

| id | item | evidence |
|---|---|---|
| R10-36 | "not a visited account" string absent | `No files found` (corpus grep 07:03) |
| R10-37 | only deprecated file has "I've tested" form | `content/articles/blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated:95: I've tested this route and it works.` (PASS — deprecated ignored) |

### Layer 8 schema (4/4 PASS)

| id | item | evidence |
|---|---|---|
| R10-38 | BreadcrumbList JSON-LD count = 1 | `1 occurrence` (akihabara article HTML 07:01) |
| R10-39 | Article schema present (NewsArticle subclass) | `"@type":"NewsArticle"` (07:02) |
| R10-40 | FAQPage acceptedAnswer non-empty on okami | `12 acceptedAnswer occurrences with non-empty "text" field` (07:02) |
| R10-41 | og:image meta present per article | `8 og:image occurrences (multiple sizes)` (07:02) |

### Layer 9 affiliate (0/8 PASS — major systemic FAIL across R10-43..R10-48)

INFO items R10-42 / R10-43 are raw counts feeding the ratio:
| id | item | evidence |
|---|---|---|
| R10-42 | total klook URLs across articles | `123 instances across 54 files` (INFO, grep 07:03) |
| R10-43 | klook URLs with compliant `aff_adid=[0-9]+` | `85 instances` (INFO, grep 07:03) |

### Layer 10 doc-json-reconcile (0/4 PASS — R10-49..R10-52 all FAIL)

### Other (R10-53/54)

| id | item | evidence |
|---|---|---|
| R10-53 | content articles file count = 87 active | `58 .md + 29 .mdx + 1 .deprecated = 88 files; audit reports 87 (deprecated excluded) ✓` (07:02) |
| R10-54 | dropped article slug `mha-waffle-diner` exists under different name | `content/articles/my-hero-academia-waffle-diner-ikebukuro-2026.mdx (live 200)` (07:02) |

## R9 overclaim trail (audit-this-doc-against-prior-claims)

| Prior claim | R10 fresh measurement |
|---|---|
| "Klook 118/118 = 100%" (session-final-fix-20260510 + section5-readiness-master) | 53% (85 compliant of ~160 total when source-code CTAs + bare URLs counted; tmp/ scratchpad cite was the basis, RULE E violation) |
| "PASS_ALL_10 87/87 / fabrication=0" (full-corpus-audit-20260510.json) | TRUE per audit script, but audit uses verb-whitelist regex; spec broad regex finds 265 hits across 87 articles |
| "AdSense 78-85% probability post-R9" (session-master-final-20260510) | unsourced editorial estimate; no derivation methodology documented |
| "R9 closed L16 slam-dunk migration" | partial: 4 Takapon refs vs 5 Wikimedia; Wikimedia majority remains |

## Phase 1 fix order (P0 first, no batch except em-dash)

1. **Bucket K-source-code (P0):** R10-46/47 — fix klook URL builders in `app/page.tsx`, `app/category/[slug]/page.tsx`, `app/guides/[topic]/page.tsx`. Replace `aff_id=` with `aff_adid=1251547` literal (since env var is empty in production anyway). 1 commit per app file = 3 commits.
2. **Bucket K-articles (P0):** R10-44/45 — sweep 38 `aff_id=` short form + 6 bare URLs across 12 article files. 1 article 1 commit = 12 commits (em-dash exemption does NOT apply to klook).
3. **Bucket K-audit-widen (P1):** R10-52 — widen audit script regex to include `www.klook.com` URLs and to count `aff_id=` short form as NON-compliant.
4. **Bucket K-gate (P1):** R10-12 — add `.github/workflows/klook-gate.yml` to CI-fail any PR introducing non-compliant klook URL or bare URL.
5. **Bucket slam-dunk-finish (P0):** R10-28 — replace 2-3 of the remaining 5 Wikimedia body refs in kamakura-slam-dunk article with body-takapon-{4,5,6,7}.{webp,jpg} that were already copied to the folder in R9 but never wired up.
6. **Bucket fab-widen (P1):** R10-33/50 — widen audit script fabrication regex from verb-whitelist to spec catch-all `\bI[''`]?(ve| have| had|'?d|'?ll| will|'?m| am)\s+\w+`. Run audit; the resulting hits become a new fix list (potentially 100+ items).
7. **Bucket pseudonym-giscus (DEFERRAL CANDIDATE):** R10-25 — needs user approval; can't change `data-repo` without breaking comments. AskUserQuestion required.
8. **Bucket doc-rewrite (P1):** R10-49/51 — rewrite section5 doc to remove tmp/ cites, re-state AdSense estimate as editorial.

## Bucket fix doc tracker (per RULE B)

| Bucket | Doc path (to be created) | Fix commits |
|---|---|---|
| K-source | docs/audit/fix-K-source-20260510.md | TBD |
| K-articles | docs/audit/fix-K-articles-20260510.md | TBD |
| K-audit-widen | docs/audit/fix-K-audit-widen-20260510.md | TBD |
| K-gate | docs/audit/fix-K-gate-20260510.md | TBD |
| slam-dunk-finish | docs/audit/fix-slamdunk-finish-20260510.md | TBD |
| fab-widen | docs/audit/fix-fab-widen-20260510.md | TBD |
| pseudonym-giscus | (proposed-deferrals-20260510.md after user approval) | TBD |
| doc-rewrite | docs/audit/fix-doc-rewrite-20260510.md | TBD |

## R10 critic round tracker (per RULE C)

| Round | Subagent agentId | Doc path | Verdict |
|---|---|---|---|
| Phase 0 enumeration | a55d910f0b611b1b3 | (this file synthesizes its output) | 35 PASS / 18 FAIL / 0 UNKNOWN |
| R1 (post-fix) | TBD | docs/audit/critic-round-1-20260510.md | TBD |
| R2 (post-R1-fix) | TBD | docs/audit/critic-round-2-20260510.md | TBD |
| R3 (final) | TBD | docs/audit/critic-round-3-20260510.md | TBD |
