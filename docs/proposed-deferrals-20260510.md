# R10 proposed deferrals — 2026-05-10

Per RULE D, Code may not unilaterally defer FAIL items. This doc tracks deferrals proposed to user with explicit approval.

## R10-25 — Giscus repo path real-name leak

**FAIL evidence (Phase 0 critic agentId `a55d910f0b611b1b3`):**
`components/GiscusComments.tsx:23` contains `script.setAttribute('data-repo', 'Takashi-Kiyohara/japan-pop-now');`. This emits the operator's real legal name `Takashi-Kiyohara` to public HTML when the giscus widget mounts, violating project rule "Author is 'Takapon'. Never use the real name 清原崇" (`CLAUDE.md`).

**Why deferred:**
- The `data-repo` attribute MUST match the actual GitHub repository path for the giscus widget to load comments. Changing the attribute without renaming the GitHub repo breaks all comment functionality.
- Renaming the GitHub repository (e.g. to a `takapon-pop-now/japan-pop-now-comments` org-aliased path) is out-of-scope for in-session code work — it requires manual GitHub admin action, repo URL migration for inbound links, and re-config of OAuth/webhooks.

**User decision (2026-05-10):** "Defer — accept artifact". Document the leak as a known artifact (giscus iframe necessarily exposes the repo path).

**Action items:**
- This doc records the user's explicit approval of the deferral.
- No code change in R10.
- Optional next-step (Takapon-side, not blocking): rename the GitHub repo to a Takapon-aliased org and update `data-repo` accordingly.

**Status:** DEFER-APPROVED 2026-05-10. Not counted toward R10 FAIL list.

---

## R10-15 — sitemap mha-waffle-diner spec mismatch (NOT a deferral, documented as spec-error-not-FAIL)

**Phase 0 critic finding:** spec asked for sitemap to include literal slug `mha-waffle-diner`. Actual article slug is `my-hero-academia-waffle-diner-ikebukuro-2026` (full canonical), which IS in sitemap.xml (verified separately as R10-17 PASS).

**User decision (2026-05-10):** "Document as spec-mismatch only" — recognize that the spec phrased a slug abbreviation that doesn't match the real slug; the article is reachable; no fix needed.

**Status:** RECLASSIFIED 2026-05-10 — moved from FAIL → DOCUMENT-ONLY. Real slug present. Not counted as FAIL.

**Adjusted R10 FAIL count after these two reclassifications: 16** (was 18; minus R10-15 doc-only minus R10-25 user-deferred).
