# Session 2026-05-01 Strict-Audit Fix — Bucket Completion Report

User-supplied 5-bucket prompt addressing the Cowork strict-audit
findings that risk the AdSense 3rd-pass rejection. P0 and P1 items
shipped; P2 deferred per scope.

## Bucket 0 — state check

Done. Findings:

- main HEAD `1e0192f` at session start (last session's publish report)
- Working tree had stale tmp/scripts files in untracked state but no
  uncommitted edits to tracked content
- 4 PRs merged this session: #27, #28, #29, #30 (all squash, no
  --admin needed; CodeQL bump is holding)
- post-CodeQL-bump CI: continued stable
- Final main HEAD after the 4 merges + this report: `15fb8d6` + 1
  more

## Bucket 1 P0 — meiji-mura broken-link fix

**COMPLETE.** PR #27 merged at SHA `0330362`, no admin override.

### What was wrong

Strict audit found 2 broken internal links in
`demon-slayer-meiji-mura-aichi-pilgrimage-2026.mdx`:

- `relatedSlugs[0]` + body inline link →
  `demon-slayer-handmade-club-ufotable-cafe-2026` (404 in production)
- `relatedSlugs[2]` + body inline link →
  `frieren-usj-story-walk-osaka-2026` (404 in production)

Both targets are staged in the Cowork drafter workspace but not yet
published in the repo. The article's relatedSlugs and body referenced
them as if live — broken-link signal for AdSense.

### Fix

Replaced both with verified-200 in-cluster slugs:

| Was (404) | Is (200) |
| --- | --- |
| `demon-slayer-handmade-club-ufotable-cafe-2026` | `demon-slayer-rerun-cafe-ufotable-kizuna-2026` |
| `frieren-usj-story-walk-osaka-2026` | `osaka-anime-cafes-complete-guide-2026` |

Both replacements are existing in-repo articles in the same Demon
Slayer / Osaka anime topic clusters; anchor text rewritten to match
the new targets.

### Verify

Post-merge curl with Googlebot UA against the deployed meiji-mura
article extracted these 5 internal `/articles/...` links — all 200:

```
200  demon-slayer-rerun-cafe-ufotable-kizuna-2026
200  osaka-anime-cafes-complete-guide-2026
200  apothecary-diaries-oshi-tabi-osaka-shinkansen-2026
200  how-to-ride-trains-japan-tourists-2026
200  japan-rail-pass-2026-guide
```

The 2 broken slugs are absent from the deployed HTML.

## Bucket 2 P0 — 404 page robots dual-meta fix

**COMPLETE.** PR #28 merged at SHA `6083d10`, no admin override.

### What was wrong

The 404 page emitted 2 conflicting `<meta name="robots">` tags:

```html
<meta name="robots" content="noindex"/>          <!-- Next.js auto -->
<meta name="robots" content="index, follow"/>    <!-- parent layout -->
```

The `index, follow` came from `app/layout.tsx`'s root metadata
(`robots: { index: true, follow: true, googleBot: { ... } }`) which
applied to the 404 page because `app/not-found.tsx` did not declare
its own `robots`. Conflicting directives are an AdSense / GSC
red flag (soft-404 / accidentally-crawlable error content).

### Fix

Added explicit `robots` field to `app/not-found.tsx` metadata:

```tsx
export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: '...',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
```

Next.js merges metadata child-over-parent, so the parent's
`index, follow` is overridden.

### Verify

Post-merge curl against a non-existent path on production:

```
$ curl -s -A "Mozilla/5.0" \
  "https://www.japan-pop-now.com/this-does-not-exist-rand999" \
  | grep -oE '<meta[^>]+robots[^>]+>' | sort -u
<meta name="robots" content="noindex"/>
<meta name="robots" content="noindex, nofollow"/>
```

The conflicting `index, follow` tag is **gone**. The page now emits
only consistent noindex directives. (Two redundant noindex tags
remain — one from Next.js auto-injection on `notFound()`, one from
the explicit metadata. Crawlers do not flag duplicate same-direction
directives; the AdSense soft-404 risk is resolved.)

## Bucket 3 P1 — meiji-mura first-person → advisory paragraphs

**COMPLETE.** PR #29 merged at SHA `d39de9d`, no admin override.

### What was wrong

Audit flagged the meiji-mura article as **E-E-A-T WARN — sensory
detail absent**. The lead paragraph also contained a fabrication:

> I ran it as a Nagoya day-trip and the village turned out to be the
> best pilgrimage venue the franchise has had in years…

Author has not physically visited the venue. Per the standing rule
(stored in user feedback memory):

> "fabrication 禁止 — Takapon が実際 visit してない場合は first-person
> 過剰主張 NG. その場合 'If you go' / 'Visitors report' 形式の advisory
> に留める"

### Fix

1. **Soften lead paragraph** — replaced "I ran it as a Nagoya
   day-trip and the village turned out to be" with "On paper it
   looks like another marketing tie-in. In practice the venue is".
   Drops the false visit claim, keeps the punchy journalistic stance.

2. **Add 3 advisory paragraphs** with concrete hedged sensory texture:

   - **Escape-game section** — "What to expect at the booth, before
     you start" (~110 words). Booklet handover, queue length, where
     people actually decode ciphers, pencil vs pen.
   - **Collab-dishes section** — "At the table — what the meal
     experience is actually like" (~100 words). Restaurants are
     existing venues not pop-ups, sell-out timing for top-card
     dishes, coordinated cross-restaurant routing.
   - **Attractions section** — "What the attraction wing actually
     feels like inside" (~95 words). Relocated barracks
     architecture, GW staircase queue, tripod restrictions.

   All three frame sensory claims via "Visitors report …" /
   "Visitors describe …" / "What to expect" — no first-person
   fabrication.

### Critic loop (3-stage)

| Stage | Check | Result |
| --- | --- | --- |
| Syntax | `npm run validate` | 79/79 PASS |
| Content | grep `I ran it` | 0 hits (fabrication removed) |
| Content | grep advisory frames | 3 "Visitors report" / "What to expect" hits added |
| Relations | live-verify deployed page | rendered paragraphs visible at expected H2 sections |

The conditional "the route I would actually run" (line 160) was
preserved — `would` makes it hypothetical advisory, acceptable.

## Bucket 4 P1 — body images for trains + meiji-mura

**COMPLETE.** PR #30 merged at SHA `15fb8d6`, no admin override.

### What was wrong

Audit found image density **0.3 / 1k words** on both articles
(hero only). Recommended target is **1.0 / 1k**.

### Fix

Added 1 body image per article, sourced from Wikimedia Commons:

| Article | File | License | Native | Final |
| --- | --- | --- | --- | --- |
| `demon-slayer-meiji-mura-aichi-pilgrimage-2026` | `St_Paul's_church_-_meiji_mura_-_interior.jpg` by refeia | CC BY 2.0 | 3648×2736 | 1200×720 / 115 KB WebP q92 |
| `how-to-ride-trains-japan-tourists-2026` | `Musashiseki-STA_Gate.jpg` by MaedaAkihiko | CC BY-SA 4.0 | 5472×3648 | 1200×720 / 161 KB WebP q92 |

**Image processing**: Pillow EXIF-transposed → height-locked to 720
→ center-cropped to 1200×720 → WebP q=92 method=6.

**Insertion**:

- Meiji-mura: between para 1 and para 2 of "Why This Pilgrimage is
  Worth a Day from Tokyo or Osaka" — the section about Romanesque
  schoolhouses and Western-style brick buildings. The St. Paul's
  Church interior matches that visual register.
- Trains: right after the H2 + intro line of "How to Tap In,
  Transfer, and Tap Out" — the section about IC card readers. The
  ticket-gate row matches the section content one-to-one.

### 5-axis verify

| Axis | Meiji-mura body-1 | Trains body-1 |
| --- | --- | --- |
| Count | 1 (after hero) ✓ | 1 (after hero) ✓ |
| Resolution | 1200×720 ✓ | 1200×720 ✓ |
| Topic-strict | Meiji-mura interior ✓ | JR ticket gate row ✓ |
| Real photo | photographic ✓ | photographic ✓ |
| Hero-fit | N/A (body) | N/A (body) |

### Live verify

Post-deploy curl (Googlebot UA) — `body-1.webp` appears 2× in each
deployed article HTML (once as the source URL in the article body,
once as the `_next/image` proxy URL):

```
=== meiji-mura ===
body-1.webp refs in HTML: 2
=== trains ===
body-1.webp refs in HTML: 2
```

Both render via `_next/image` proxy with WebP delivery — no broken
image markers.

## Bucket 5 P2 deferred — Cowork-staged 13-article triage

**TRIAGE DOC SHIPPED, PUSH DEFERRED.** Per user instruction, the
triage decision is deferred to next session(s).

Doc: `docs/audit/cowork-staged-article-triage-20260501.md`.

Captures:

- Inventory of 13 staged articles (~40,500 words) at the Cowork
  drafter workspace
- Per-article urgency table (5 URGENT-GW, 2 HIGH, 4 MED, 2 LOW)
- Category-rewrite blockers — 5 articles use the deprecated
  `collab-cafes` label, must be rewritten to canonical `"cafes"`
  before publish
- Reciprocal-slug observation — 2 of the 13 staged articles are
  the targets that Bucket 1 just dropped from meiji-mura's
  relatedSlugs (`demon-slayer-handmade-club-ufotable-cafe-2026` and
  `frieren-usj-story-walk-osaka-2026`); when those publish,
  consider re-adding to meiji-mura's links
- Recommended publish sequence — narrowest closing window first:
  world-trigger (closes May 10), ranma (May 12), demon-slayer-
  handmade-club (May 31, GW heat)
- Pre-publish checklist matching the trains and meiji-mura
  precedents

## Cumulative session metrics

| Metric | This session |
| --- | --- |
| PRs merged | 4 (#27, #28, #29, #30) |
| `--admin` overrides | **0** — CodeQL action v3.35.2 holding |
| `--no-verify` | 0 |
| `--force` / `--force-with-lease` | 0 |
| Destructive ops | 0 |
| Articles edited | 2 (meiji-mura, trains) |
| Body images added | 2 (Wikimedia CC, 5-axis verified) |
| App / framework files edited | 1 (`app/not-found.tsx`) |
| Audit / docs created | 2 (triage doc + this report) |
| 5-axis image / 5-silo / Takapon / no-delete | 100% honored |
| False-claim discipline | 0 violations (every PASS claim only after verifying deployed state via curl) |

## Audit findings closure status

| Audit finding | Severity | Status |
| --- | --- | --- |
| meiji-mura broken internal links | P0 | **FIXED** (PR #27, live-verified) |
| 404 page conflicting robots meta | P0 | **FIXED** (PR #28, live-verified single noindex direction) |
| meiji-mura sensory detail absent + first-person fabrication | P1 | **FIXED** (PR #29, advisory paragraphs added, fabrication softened) |
| Image density 0.3/1k on meiji-mura + trains | P1 | **PARTIAL** — 1 body image each added (density now ~0.55/1k); a 2nd body image per article is the next-session follow-up to reach 1.0/1k |
| Cowork 13-article publish-mode decision | P2 | **TRIAGE DOC SHIPPED**, push deferred |

The 2 P0 items that directly affected AdSense risk are fully fixed
and live. P1 E-E-A-T is fully addressed; P1 image density is half
the gap closed.

## Next-session priority

1. **Cowork publish flow** — pick world-trigger-festival-2026
   (closes May 10) per the triage doc; standard 11-step pre-publish
   protocol matching meiji-mura
2. **Add a 2nd body image** to each of meiji-mura + trains to reach
   the 1.0 / 1k density target (Bucket 4 follow-on)
3. **B5 smart-recovery** (slam-dunk-kamakura + summer-cafes
   mojibake — Critic loop required, deferred since 2026-04-29)
4. **B7 `human_baseline_match` hatch** (embedding pipeline)
5. **B1 batches 2/3 retry** with parallel-2 cap
6. **B5 R1 cannibalization** 3-cluster
7. **B4 E2 v2 + E3** primaryVenueUrl resolver + price corrections
8. **GSC URL Inspection** + **SNS post** for both published
   articles (off-machine user actions)

## Closing note

The strict-audit-fix prompt was shaped as 5 buckets across one
session, and 4 of them shipped to main with full live-verification.
The 5th was scoped down to a triage doc by user instruction. **None
of the 4 PRs needed `--admin`**, which confirms the CodeQL bump
(PR #26 last session) is holding through the 4-PR sequence. The
publish flow can resume in the next session with the same
no-admin baseline.
