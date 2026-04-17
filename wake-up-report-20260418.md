# Wake-Up Report — 2026-04-18 (Overnight Session)

**Session:** claude-opus-4-7 autonomous, `--dangerously-skip-permissions` off (normal). Worked against `main`, no force-push, no destructive ops.

**Shipped:** 9 commits, all pushed to `origin/main` (Vercel auto-deploys).

## Commits in this session

| SHA | Type | Summary |
|-----|------|---------|
| `d08e491` | refactor | Wire Footer SNS to `AUTHOR` SSoT |
| `6538a18` | fix | Purge Instagram/TikTok/YouTube refs; Threads + X only |
| `232b4eb` | docs | Body image density audit (27 P0 articles) |
| `b79ac44` | fix | Repair broken meta descriptions (nakano-broadway ate body content) |
| `4ae7c20` | fix | Repair 3 broken in-body internal links + audit |
| `a223a06` | fix | Absolutize image URLs in article/event/howto/tourist JSON-LD |
| `e0768a6` | fix | A11y P0 aria-labels + global `prefers-reduced-motion` + GMaps env var |

## Tasks done (13/15)

- ✅ Task 0 — push + deploy health verified
- ✅ Task 1 — Footer SNS → `AUTHOR.socials` SSoT
- ✅ Task 2 — reframed from "calendar filter bug" (not a bug — intentional 10-day cutoff in `lib/events.ts`); real finding was stale SNS refs in `/calendar`, `/contact`, Organization + LocalBusiness schemas → all purged
- ✅ Task 3 — body image density audit → `analytics/body-image-audit-20260418.md`
- ✅ Task 4 — AdSense 3rd submission 7-check pre-flight → `analytics/adsense-3rd-submission-ready-20260418.md` (6/7 PASS, 7th pending Vercel redeploy of sameAs cleanup)
- ✅ Task 5 — tag pages already emit `noindex, follow` (no work)
- ✅ Task 6 — meta desc audit; fixed `nakano-broadway-guide` (YAML desc had swallowed ~1350 chars of body!) and `tokyo-anime-district-guide` (172→148)
- ✅ Task 8 — internal links audit → 55/61 articles have zero in-body links; 3 concrete broken links fixed
- ✅ Task 9 — JSON-LD validation; absolutized article/event/howto/tourist schema image URLs
- ✅ Task 10 — title CTR audit (AUDIT-ONLY) → `analytics/title-ctr-audit-20260418.md` (7 P0, ~27 P1)
- ✅ Task 11 — a11y audit → `analytics/a11y-audit-20260418.md`; fixed 2 P0 (newsletter + search aria-labels), global `prefers-reduced-motion`
- ✅ Task 12 — llms.txt / llms-full.txt UTF-8 cleanliness reconfirmed (0 U+FFFD, 0 mojibake)
- ✅ Task 14 — sitemap gained `/features` hub + 4 feature series; robots.txt clean

## Tasks SKIPPED (with rationale)

### Task 7 — Category restructure to `anime/food/experiences/shopping/events`
**Skipped.** Conflicts with authoritative `CLAUDE.md` + `.claude/rules/article-quality.md` + `.claude/rules/seo.md` which mandate the 5-silo structure: `collab-cafes / experiences / area-guides / anime-pilgrimage / travel-tips`. Changing would break every article URL, every schema, every `category` in frontmatter, and tank GSC rankings. If Takapon wants the restructure, it needs its own planning session with redirect map.

### Task 13 — Features series skeleton (Kimetsu no Yaiba Cafe Tour)
**Skipped.** Creating 5 article stubs + a hub without verified source content would (a) violate `article-quality.md` fact-verification rule, (b) create thin content that hurts AdSense review, (c) pollute sitemap with empty URLs. If Takapon has specific collab dates + menu data, a daytime research → draft cycle is safer than overnight scaffolding.

## ⚠️ Security flag — RED

**Hardcoded Google Maps API key** was at `components/GoogleMap.tsx:36` (commit history preserves it).

- Refactored to use `process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` with a graceful fallback to the external "Open in Google Maps" link when unset.
- **Takapon action required:**
  1. Go to Google Cloud Console → APIs & Services → Credentials
  2. Find the Maps Embed key that was committed in `components/GoogleMap.tsx` prior to commit `e0768a6` (exposed in git history — starts with `AIza…`, see the pre-`e0768a6` blame for the full value)
  3. Either: rotate the key AND add HTTP referrer restriction (`*.japan-pop-now.com/*`) + API restriction (Maps Embed API only)
  4. Or: delete the key if unused, since the new code works fine without it (falls back to the directions link)
  5. Set the new key in Vercel env as `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`

**Why this matters:** The old key is in git history AND was in the production JS bundle since launch. Without referrer restriction, anyone could scrape it and burn your Maps quota. With referrer restriction, risk is lower but still worth rotating on general principle.

## Follow-up queue for Takapon (daytime)

### P0 — do today

1. **Rotate / restrict the Google Maps key** (see Security flag above).
2. **Review 7 P0 title rewrites** in `analytics/title-ctr-audit-20260418.md`. Rewrite 2–3 per week; do not bulk change (GSC position reset risk).
3. **AdSense submission** — confirm Vercel redeploy picked up the sameAs purge (commit `6538a18`), then submit for 3rd review. Pre-check in `analytics/adsense-3rd-submission-ready-20260418.md`.

### P1 — this week

4. **Body image backfill** for 18 articles with zero body images (see `analytics/body-image-audit-20260418.md`). Prioritize by GSC impressions.
5. **A11y P1 fixes** in `analytics/a11y-audit-20260418.md` — esp. `outline-none` without `focus-visible:` in 5 components, carousel auto-rotate + focus-pause, white-alpha contrast in Footer/NewsletterSignup.
6. **Internal-link contextual injection** — 55 articles have zero in-body `[text](/articles/slug)` links. Start with highest-traffic 10.

### P2 — soon-ish

7. **Sitemap coverage** — decide if `/cafes` + `/cafes/[slug]` should be indexed. Currently missing from sitemap.
8. **Schema validator re-run** after Vercel picks up commit `a223a06` (image absolutize).
9. **Meta description check** — re-run `analytics/meta-description-audit` to see duplicates after today's fixes.

## Key discoveries (not in plan)

1. **`nakano-broadway-guide.md` had a 1350-char YAML description** from an unterminated string swallowing an entire H2 body section. This silently shipped. Fixed in `b79ac44`. Worth periodic YAML linting in CI.
2. **Calendar filter is by design** — 10-day cutoff in `lib/events.ts` `getVisibleEvents()` excludes past-ended events. 117 vs 115 isn't a bug; AnimeJapan 2026 (ended 2026-03-31) and TAAF 2026 (ended 2026-03-16) are correctly filtered.
3. **55/61 articles have zero in-body internal links.** `relatedSlugs` drives the Related Articles footer block, so they aren't orphans technically — but SEO rules want 2–3 contextual body links per article. That's a real backlog.
4. **Google Maps key leak** predates this session — surfaced by a11y static scan. See Security flag above.

## Build health

- ✅ `npx tsc --noEmit` — clean
- ✅ `npm run build` — passes
- ✅ `origin/main` in sync, 0 commits ahead locally
- ✅ pre-commit hook caught the Maps key on first attempt (hook is working as intended)

## Session footprint

- 9 commits to `main`, all pushed.
- 7 new analytics reports in `analytics/`.
- 1 log: `overnight-log-20260418.md`.
- 0 force-pushes. 0 destructive ops. 0 `.env` reads.
- Author name `Takapon` preserved everywhere; real name `清原崇` has 0 source matches (verified).
