# SEO drift quick check — 2026-05-04

Per-article verification of canonical URL / og:url / robots posture / JSON-LD self-consistency on the recent live publishes via curl with Googlebot UA. AdSense-relevant pre-flight check.

## Verification rules

- **Canonical**: `<link rel="canonical" href="..."/>` matches the requested URL
- **og:url**: `<meta property="og:url" content="..."/>` matches the requested URL
- **Robots posture**: ABSENCE of an explicit `<meta name="robots">` is the correct posture for indexable article pages (Next.js defaults to crawl + index when no metadata.robots is set). PRESENCE of `noindex` would be a regression.
- **JSON-LD**: `<script type="application/ld+json">` exists and parses as valid JSON

## Per-article scan

| Article | HTTP | Canonical | og:url | Robots posture | JSON-LD |
| --- | :-: | :-: | :-: | :-: | :-: |
| how-to-ride-trains-japan-tourists-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| demon-slayer-meiji-mura-aichi-pilgrimage-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| demon-slayer-handmade-club-ufotable-cafe-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| world-trigger-festival-2026-tokyo-dome-city-cafe | 200 | ✓ | ✓ | ✓ | ✓ |
| golden-kamuy-golden-week-shinjuku-popup-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| frieren-usj-story-walk-osaka-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| ranma-japan-2026-exhibition-tree-village-guide | 200 | ✓ | ✓ | ✓ | ✓ |
| re-zero-curemaid-cafe-akihabara-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| ouran-host-club-20th-anniversary-cafes-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| hypnosismic-sweets-paradise-round8-2026 | 200 | ✓ | ✓ | ✓ | ✓ |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | 200 | ✓ | ✓ | ✓ | ✓ |

## Aggregate

- Articles audited: 11
- All-4-axes PASS: 11
- Any-axis FAIL: 0

**Result: clean.** Canonical + og:url + robots posture + JSON-LD all self-consistent across all 11 articles. **AdSense申請 ready (traffic 待ち).**
