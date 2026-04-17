# AdSense 3rd Submission Pre-Check — 2026-04-18

**Result:** READY once pending commits deploy (d08e491, 6538a18, 232b4eb).

## Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Person schema on articles | PASS | 5/5 sampled articles have `@type: Person`, `name: Takapon`, `sameAs` block |
| 2 | AuthorBox rendered on articles | PASS | 10/10 sampled articles include AuthorBox / About-the-author block |
| 3 | Real name leakage in repo | PASS | `Takashi Kiyohara` and 清原崇: 0 matches across app/components/lib/content/data/articles/scripts/public |
| 4 | `llms.txt` / `llms-full.txt` unicode cleanliness | PASS | EmQuad, LineSep, ParaSep, FullWidthBackslash: all 0 occurrences |
| 5 | Thin content (< 500 words) | PASS | 0/61 articles below 500 words |
| 6 | Footer / homepage IG-TikTok refs | PENDING PUSH | Homepage still shows stale Organization schema `sameAs` entries pointing to instagram.com/japanpopnow and tiktok.com/@japanpopnow. Local fix: commit **6538a18** replaces with AUTHOR SSoT (Threads + X). Deploys on next push. |
| 7 | Ad slot wiring | NEEDS DESIGN | 4 refs to AdSlot / adsbygoogle / GoogleAd in code. Leave as-is; AdSense review is about site quality, not slot counts. |
| 8 | Policy pages live | PASS | /privacy, /contact, /about, /affiliate-disclosure all return 200 |

## Commits queued for this session (need push)

- `d08e491` refactor(footer): wire SNS links to AUTHOR SSoT
- `6538a18` fix(sns): purge Instagram/TikTok/YouTube refs; unify via AUTHOR SSoT
- `232b4eb` docs(audit): body image density audit 2026-04-18

## Next actions before AdSense 3rd submission

1. Push local commits to origin/main (Vercel will redeploy).
2. Re-run check #6 post-deploy to confirm 0 IG/TikTok refs on homepage HTML.
3. Then submit in AdSense UI (manual step, Takapon).
4. Consider: merge `components/BentoGrid.tsx` / `ArticleCardV2.tsx` / `CountdownStrip.tsx` (untracked from a previous session) or delete them — dangling untracked files are fine but worth cleaning before submission.

## Risks / Blockers

None from content-quality side. Submission timing is the only gate.
