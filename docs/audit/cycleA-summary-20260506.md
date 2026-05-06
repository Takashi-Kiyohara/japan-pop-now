# [cycleA] Discovery audit — 2026-05-06

**Scope completed**: 8 of 13 axes (A1, A2, A3, A6 light, A8, A10, A11 light, A14).
**Scope skipped**: 5 axes need APIs / runners not available in this session — A4 (Rich Results Test API), A5 (full link-graph BFS — too expensive), A7 (full E-E-A-T audit — multi-hour read of every article), A9 (Lighthouse runner), A12 (GA4 API). A13 partially covered (WP legacy 410 verified; Vercel function logs not accessed).

**TL;DR**: Site state is unexpectedly clean post-redirect-fix. **0 P0 / 0 P1 / 3 P2.** Most expected risks (canonical-self regression, image-file refs, AdSense ban-list, sitemap drift, security headers) are clean.

---

## A1 — URL canonicalization layer (redirect chain trace)

**Methodology**: Googlebot UA + 100 sitemap URLs + WP legacy patterns + tags/author/search + paged. Earlier session (2026-05-06 P0 fix) generated 120 PASS / 18 FAIL chain trace results; this Cycle A spot-checks the unverified patterns.

### Results
| Pattern | Status | Hops |
|---|---|---|
| All sitemap canonical URLs (100) | ✓ | 0 |
| 18 legacy flat slugs (any trailing) on www | ✓ | 1 |
| WP legacy `/?p=NNN`, `/?paged=N` | ✓ | 0 (returns 410) |
| `/wp-login.php`, `/wp-admin` | ✓ | 0 (returns 403) |
| `/tags`, `/tags/2026`, `/tags/anime` | ✓ | 0 (200 + meta robots noindex) |
| `/search?q=test` | ✓ | 0 (200 + meta robots noindex) |
| `/author/takapon` | ⚠ | 0 (returns 404 — see P2-3) |
| Apex variants | known limit | 2 (Vercel platform redirect, see redirect arch ref memory) |

**Verdict**: PASS for the indexable surface. The 18 apex-side 2-hop entries from the P0 verify run are a known Vercel platform limitation; manual user dashboard action would resolve.

---

## A2 — sitemap.xml completeness

**Methodology**: `diff` between `content/articles/*.{md,mdx}` slugs and sitemap `<loc>` entries.

- content/articles file count: 88 (incl. 1 `.mdx.deprecated`)
- sitemap article URLs: 78
- missing-from-sitemap: 10

### Classification of 10 absences (all intentional)

| Slug | Reason | Verified |
|---|---|---|
| `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated` | `.deprecated` rename (no-delete rule) | ✓ |
| `demon-slayer-rerun-cafe-ufotable-2026` | cannibalization 308 → kizuna-2026 in next.config.ts | ✓ |
| `osaka-anime-collab-cafes-pop-culture-2026` | cannibalization 308 → osaka-anime-cafes-complete-guide | ✓ |
| `animejapan-2026-guide-international-visitors` | validUntil 2026-03-30 (past) | ✓ |
| `golden-week-2026-anime-events-complete-guide` | validUntil 2026-05-06 (today; borderline) | P2-1 |
| `jjk-sweets-paradise-complete-guide-2026` | validUntil 2026-04-30 (past) | ✓ |
| `jujutsu-kaisen-cafes-japan-2026-guide` | validUntil 2026-04-30 (past) + `robots: noindex,follow` | ✓ |
| `my-hero-academia-cafe-tokyo-2026` | validUntil 2026-04-27 (past) | ✓ |
| `my-hero-academia-waffle-diner-ikebukuro-2026` | validUntil 2026-04-27 (past) | ✓ |
| `slam-dunk-kamakura-pilgrimage-2026` | `robots: noindex,follow` (no validUntil) | ✓ |

**Verdict**: PASS. 100% of absences explained. Cross-checked: noindex articles correctly excluded from sitemap (no contradiction).

---

## A3 — robots.txt + meta robots + X-Robots-Tag consistency

### robots.txt (live)
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

(plus per-bot allow rules for Googlebot / Bingbot / GPTBot / ClaudeBot / PerplexityBot / ChatGPT-User / Applebot-Extended)

Host: https://www.japan-pop-now.com
Sitemap: https://www.japan-pop-now.com/sitemap.xml
```
**Verdict**: ✓ no contradictions with sitemap; AI crawler allowlist intentional.

### meta robots
- Indexable articles: no `<meta name="robots">` → defaults to `index, follow` ✓
- Confirmed via `app/articles/[slug]/page.tsx` line 60–64: emission is conditional on `robots:` frontmatter only.
- `/tags/*` and `/search?q=*` correctly emit `noindex, follow` ✓

### Contradiction check
- `slam-dunk-kamakura-pilgrimage-2026` (robots:noindex) — sitemap-excluded ✓
- `jujutsu-kaisen-cafes-japan-2026-guide` (robots:noindex) — sitemap-excluded ✓

**Verdict**: PASS, 0 contradictions.

---

## A6 (light) — image reference / file existence

**Methodology**: extract every `![alt](/images/...)` reference from non-deprecated articles, verify the file exists in `public/`.

- featuredImage references: 87 → 87 files exist (0 missing) ✓
- body image references: 399 unique → 399 files exist (0 missing) ✓

**Skipped** (per resource budget): full 5-axis content audit (count / resolution / topic-match / real-photo / hero-frame) requires per-file Read on ~400 images.

**Verdict**: PASS for existence; full visual audit out of scope.

---

## A8 — AdSense policy risks

### AI ban-list grep
Pattern: `\b(delve|furthermore|moreover|navigate the|dive into|a testament to|embark on|treasure trove|unleash|it'?s worth noting|in today'?s world|truly unique|let'?s dive in)\b` (case-insensitive).

Hits: 7 — **all confirmed false positives** after context inspection:
- "navigate the system / booking flow / Japanese site / complex" — literal English usage, not the AI-flavored "navigate the world of X" meaning
- "Deep dive into Tokyo's electronics" / "deeper dive into how gashapon machines work" — internal-link descriptor copy

**Actual ban-list hits: 0** ✓

### Thin content (<800 words)
Improved word-counter that tolerates MDX import lines and varied frontmatter. **0 articles below 800 words**.

(First-pass naive parser flagged 2 false positives — `first-timers-japan-playbook-anime-fans-2026.md` (17,920 bytes) and `luvlab-harajuku-diy-accessory-experience.md` (16,278 bytes). Both contain ~3000 words of real content.)

### Disclosure / privacy infrastructure
- `<AffiliateDisclosure />` component exists at `components/AffiliateDisclosure.tsx`
- Auto-injection via MDX wrapper confirmed on live article: rendered HTML contains "Affiliate disclos…", "may earn", "commission", "sponsored"
- Footer carries `/about`, `/privacy`, `/contact`, `/affiliate-disclosure` links — all 4 pages return 200

**Verdict**: PASS.

---

## A10 — security / CSP / middleware

Live response headers on `/articles/akihabara-complete-guide-2026`:

| Header | Value | OK |
|---|---|---|
| Content-Security-Policy | full default-src/script-src/etc per next.config.ts | ✓ |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | ✓ |
| X-Content-Type-Options | nosniff | ✓ |
| X-Frame-Options | SAMEORIGIN | ✓ |
| Referrer-Policy | strict-origin-when-cross-origin | ✓ |
| Permissions-Policy | camera/mic/geo/cohort/payment/usb/sensors all `()` | ✓ |
| X-XSS-Protection | `1; mode=block` | ✓ |
| Cross-Origin-Opener-Policy | same-origin-allow-popups | ✓ |

**Verdict**: PASS, 8/8 required headers present.

---

## A11 (light) — originality / boilerplate

### Duplicate-intro detection
First 150 chars of body across all articles, deduplicated. Only repeat: `## Quick answer` heading line. No paragraph-level duplicate intros.

### Cannibalization (title-prefix collision)
First-5-word prefix of title across all 87 sitemap titles. **All 87 unique** at the 5-word prefix level.

### Author / pseudonym
- 88/88 articles have `author: "Takapon"` ✓
- 0 articles contain `清原崇` or `Takashi Kiyohara` ✓

### Skipped (resource)
Full TF-IDF cosine similarity matrix and >0.7 similarity pairs. Surface signal (intros + titles) suggests no obvious cannibalization.

**Verdict**: PASS at the surface. Full content overlap analysis requires embedding API.

---

## A14 — canonical self-reference deep audit

**Methodology**: live HTML for 16 representative URLs (4 features hubs, 3 category hubs, 4 silo hubs, articles index, homepage, about, sample article).

| URL | canonical | OK |
|---|---|---|
| `/cafes` | self | ✓ |
| `/calendar` | self | ✓ |
| `/category/cafes` | self | ✓ |
| `/category/experiences` | self | ✓ |
| `/category/destinations` | self | ✓ |
| `/features` | self | ✓ |
| `/features/collab-cafe-guide` | self | ✓ |
| `/features/pilgrimage-routes` | self | ✓ |
| `/features/tokyo-district-guides` | self | ✓ |
| `/features/travel-essentials` | self | ✓ |
| `/guides` | self | ✓ |
| `/guides/tokyo-anime-cafes` | self | ✓ |
| `/articles` | self | ✓ |
| `/` (homepage) | `https://www.japan-pop-now.com` (= self) | ✓ |
| `/about` | self | ✓ |
| `/articles/akihabara-complete-guide-2026` | self | ✓ |

**Verdict**: PASS, 16/16. The historical `/features/* → homepage` regression (project_jpn_indexing_root_cause_20260426 known case) is **NOT** present in current state.

---

## P0 / P1 / P2 classification

### P0 — immediate fix required: **0**
None.

### P1 — fix this cycle: **0**
None.

### P2 — fix in Cycle D polish: **3**

**P2-1 — `/tags/anime` meta robots is `noindex` (missing `, follow`)**
Other tag pages emit `noindex, follow`. This one only `noindex`. Functionally equivalent for indexing (Google treats `noindex` alone as "don't index but you may follow links"), so low priority. Trace to `app/tags/[tag]/page.tsx` and unify.

**P2-2 — Apex 2-hop limitation**
Vercel platform-level apex 308 fires before any `next.config` rule. Resolves with manual dashboard action documented in `docs/notify/post-redirect-fix-resubmit-20260506.md`. Not a code-side fix.

**P2-3 — `/author/takapon` returns 404**
`lib/author.ts` defines a `Person` schema for Takapon but no `app/author/[name]/page.tsx` route exists. The schema is referenced from `<head>` JSON-LD, so SEO impact is minimal (Google can resolve Person from the JSON-LD even without a page). Optional: add a real Author page or remove `sameAs` `author` URL claims to avoid 404 link-trail. Borderline P2.

---

## Skipped axes — recommend running externally

| Axis | Why skipped | How to run |
|---|---|---|
| A4 — Rich Results validation | Needs Rich Results Test API quota | Run `https://search.google.com/test/rich-results` per representative URL; or `npm i -D @schema-validator/cli` |
| A5 — link-graph BFS / orphans / depth | Crawl + BFS too expensive without persistent index | Use `lib/articles.ts` to build the graph offline, BFS from `/`, list orphans; estimate ~2h |
| A7 — full E-E-A-T audit | Per-article Read of ~88 files + AuthorBox + first-person count + external-link count = ~3–4h | Spawn an Explore agent: "Audit each article for AuthorBox at end, ≥3 first-person sentences, ≥3 official source links; report failures with line citations" |
| A9 — Lighthouse on top 20 URLs | Needs Chrome / Lighthouse runner; this session has neither | `npx unlighthouse --site https://www.japan-pop-now.com` |
| A12 — GA4 traffic source | Needs GA4 API access + service account | n/a |
| A13 — Vercel function logs | Needs Vercel CLI session | `vercel logs --since 24h --filter status=5xx` |

---

## Cycle A status: **NOT formally complete**

Reason: 5 of 13 axes were skipped (with justification). The completed 8 axes show 0 P0 / 0 P1 — a clean state — but a full Cycle A "DONE" claim would require running the skipped axes too.

**No `cycleA-DONE.flag` is created.** Per "false claim 厳禁" rule, I am NOT claiming Cycle A complete.

### Recommended path forward

1. The user reviews this summary. If the 5 skipped axes don't reveal new issues, Cycle B work (P0+P1 fixes) is **trivially empty** (0 fixes to apply).
2. If the user wants the skipped axes covered, a separate session can run them (Lighthouse + link-graph BFS + Rich Results validation are the highest-leverage).
3. The 3 P2 items can be deferred to Cycle D polish or fixed individually now.

### Cycle B preliminary impact

If Cycle A's skipped axes yield 0 P0/P1 (as the completed 8 suggest), Cycle B has nothing to fix. The remediation cycle structure assumes problems exist. Today's audit shows the recent P0 fixes (PRs #53/#54/#55 for redirect chain + paged 410 + hreflang dup) and prior cleanup leave the site in a healthy baseline.
