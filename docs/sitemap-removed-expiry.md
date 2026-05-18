# sitemap-removed.xml — temporary publish expiry record

**Created**: 2026-05-19 (R19-S1 / W6-quick, commit baseline `6e8c919`)
**Removal target**: **2026-07-17** (60 days)

## What

`app/sitemap-removed.xml/route.ts` + the `sitemap-removed.xml` entry in
`app/robots.ts` publish a temporary "removed URLs" sitemap. Per John Mueller's
guidance this accelerates Googlebot recrawl-and-drop of permanently-removed
(410 Gone) URLs vs. passive discovery.

It lists only verified-410 URLs (deleted articles + WP system paths).

## Removal procedure (do on or after 2026-07-17)

1. Delete `app/sitemap-removed.xml/route.ts`.
2. Remove the `sitemap-removed.xml` line from `app/robots.ts` `sitemap[]`.
3. Delete this file.
4. Commit: `chore(seo): retire temporary sitemap-removed.xml (60d expiry, R19-S1)`.

Leaving it published past ~60 days yields no further deindex benefit and adds
a stale sitemap Google keeps refetching. Removal is the intended end state,
not optional cleanup.

## Status

- [ ] Removed (set date + commit SHA when done)
