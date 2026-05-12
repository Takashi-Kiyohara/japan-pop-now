# Canonical hostname drift audit — 20260512

Sweeps every URL in production `sitemap.xml` and verifies the rendered `<link rel="canonical">` and `<meta property="og:url">` point to the www host. Baseline (2026-05-04): 101/101 www on both axes.

## Per-URL

| URL | Canonical host | og:url host |
| --- | --- | --- |

## Aggregate

- URLs audited: 101
- Canonical apex leaks: 0
- og:url apex leaks: 0

**Result: clean.** All sitemap URLs emit www host on both axes.
