---
name: r14-cleanup-critic-round-1
description: R14-cleanup Round 1 (post-cleanup-batches d9d9ce2/896eeba/642f5c8/f4ab3f5) external Critic — RED, caught 3rd pattern variant (H2 boilerplate) that R14-D + cleanup batches missed
subagent_agentId: a97fb6296e7eee19b
subagent_type: general-purpose
critic_round: 1
date: 2026-05-14
HEAD_at_critic: 8d8863a
verdict: RED — 3rd pattern variant (H2 "Never Miss a Cafe Opening") still rendering duplicate Threads CTA on 50 articles
---

# R14-cleanup Critic Round 1 — Verdict

**agentId:** `a97fb6296e7eee19b`
**Date:** 2026-05-14
**HEAD at critic:** `8d8863a` (R14-cleanup fix doc + handoff doc commit)
**Deploy verified:** 2026-05-14 ~05:00 GMT

## Verdict: RED — caught 3rd pattern variant

The spec's 3 named greps all returned 0, AND the `aria-label="Follow on Threads"` component-render count was exactly 1 per article. By the literal letter of the verification checklist, this would have been GREEN.

But the critic invoked the spec's explicit backstop clause:
> "If the deployed HTML count is N>1 even after the cleanup, that's a RED — the inline strip didn't fully eliminate duplicates and another pattern variant exists."

Live HTML inspection of `chainsaw-man-pilgrimage-tokyo` (one of the cleanup-batch articles) showed:

1. `<p><a href="https://www.threads.net/@pop_now_jp" rel="nofollow noopener noreferrer" target="_blank">Follow on Threads</a></p>`
   - Source: `content/articles/chainsaw-man-pilgrimage-tokyo.md:259` — bare markdown link inside H2 "Never Miss a Cafe Opening or Anime Event"

2. `<div class="jpn-cta not-prose" role="complementary" aria-label="Follow on Threads">...auto-injected component...`
   - Source: `app/articles/[slug]/page.tsx:402` auto-injected `<ThreadsCTA />`

Both visible Threads-CTA paragraphs in the same article body, side by side. This was precisely the duplicate-text signal that the R14-D ThreadsCTA dedup was designed to remove.

## Scope of the residual issue

- **49 articles** still carried `[Follow on Threads](https://www.threads.net/@pop_now_jp)` as a standalone body paragraph
- **50 articles** still carried the H2 "Never Miss a Cafe Opening or Anime Event" section that hosted the duplicate link
- These were not in R14-cleanup batches 1/2/3 scope (which targeted only the `**Follow [@pop_now_jp](...)**` markdown bold pattern)
- Origin: pre-existing (commit `43a7b9b` 2026-05-10 Instagram → Threads bulk migration), pre-dating R14 by 4 days

## Critic verbatim (key passages)

> "Calling RED per the spec's explicit 'if another pattern variant exists' clause. The cleanup phase declared itself 'truly clean' but 49 articles still have visible duplicate Threads CTA in the rendered DOM."

> "Comparison vs R14 Critic R1 baseline: that critic targeted only the `<div className="jpn-cta">` HTML wrapper — same systemic blind spot. R14-cleanup Critic R1 (this critic) inherits the same blind spot if scoped only to the 3 named greps. The user spec wisely included the 'deployed HTML count is N>1' backstop, which this verdict honors."

> "Pattern-#3 origin commit 43a7b9b predates R14 by 4 days and was not surfaced by either R14 critic or the cleanup script's regex."

## Required fixes (applied in commit `b13340e`)

1. Strip bare `[Follow on Threads](https://www.threads.net/@pop_now_jp)` markdown links from 49 article bodies (md+mdx).
2. Strip the H2 "Never Miss a Cafe Opening or Anime Event" boilerplate section entirely (50 articles).
3. Re-run live HTML count test: each article should have exactly 1 DOM-rendered Threads CTA component in the article body.
4. Update `r14-fix-D-cleanup-20260514.md` to list the 3rd pattern variant.

## Sequel verdict

R14-cleanup Critic Round 2 (agentId `a42608700c3d8a564`) returned GREEN on commit `b13340e` — all 3 pattern variants stripped, 1-render confirmed.

R14-final phase then surfaced 5 MORE pattern variants the R2 critic didn't probe — see `r14-final-live-verify-20260514.md` + commits `67aa1a5` (Step 1) and `88ccb19` (Step 2).

## Backfill note

This doc was created post-hoc during R14-final (commit chain `67aa1a5` → `88ccb19` → this doc commit) per the user's R14-final Step 4 spec: "agentId `a97fb6296e7eee19b` を frontmatter" — the critic doc was missing when R14-cleanup-R2 ran. Backfilled here from the agent's verdict output preserved in the prior turn's logs.
