---
title: "Image Quality Gate Failure — 2026-04-26"
date: 2026-04-26
author: Takapon (via Claude Code)
status: blocking — emergency STOP per user; new commits to main halted until fix PR merges
severity: P0 (AdSense gate condition (b) broken)
---

# Image Quality Gate Failure — 2026-04-26

## TL;DR

GitHub Actions `Image Quality Gate` workflow failed on commit `fec8310` (run `24957668494`) with **4 P0 C1 MISSING errors** for `blue-lock-tokyo-skytree-cafe-2026`. Root cause: the 4 new `body-wikimedia-{2,3,4,5}.webp` files were created on disk during Phase 3b group A but **were never staged/committed**. The MDX body was updated to reference them (in commit `fec8310`), so production now points at non-existent files.

The fix is mechanical: add the 4 untracked .webp files to git and commit. **Per user's STOP directive, this turn does NOT commit to main** — fix is delivered as a branch + PR for user review/merge.

## Failed run details

- **Run**: https://github.com/Takashi-Kiyohara/japan-pop-now/actions/runs/24957668494
- **Workflow**: `Image Quality Gate`
- **Trigger**: push of commit `fec8310` (blue-lock MDX body image refs)
- **Result**: `Process completed with exit code 1` after `4 P0 / 54 warnings`

### P0 errors (all C1 MISSING)

```
X [blue-lock-tokyo-skytree-cafe-2026] C1 MISSING: /images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-2.webp
X [blue-lock-tokyo-skytree-cafe-2026] C1 MISSING: /images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-3.webp
X [blue-lock-tokyo-skytree-cafe-2026] C1 MISSING: /images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-4.webp
X [blue-lock-tokyo-skytree-cafe-2026] C1 MISSING: /images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-5.webp
```

### Pre-existing warnings (54)

These are pre-existing LOW_BPP / LOW_DENSITY warnings unrelated to the regression. Many are flagged in `docs/images/4-axis-audit-aggregate-20260426.md` Phase 3c+ scope.

## Affected commit chain

| commit | description | gate status |
|---|---|---|
| `b9bf9d9` | blue-lock 4-axis fix — first commit, but bash `git add` glob did not capture new body-wikimedia-{2,3,4,5}.webp; only deprecation renames + earlier articles' staged renames got into this commit | n/a — webp absent, but MDX still pointed at old body-1.jpg/body-2.jpg → gate did not fail YET |
| `ac37e8a` … `19ddd30` | 13 other Phase 3b articles' commits — their webps were correctly added | passed |
| `fec8310` | **blue-lock MDX body refs follow-up** — switched body markdown to reference the new body-wikimedia-{2,3,4,5}.webp paths. Webps STILL not in git from b9bf9d9. | **FAILED** — gate ran on this commit and detected 4 C1 MISSING |

Earlier failed runs `24957622786` (pokepark-kanto) and `24957660247` (summer-2026) were transient — at those snapshots, the missing files were caused by intermediate commit ordering and were resolved as subsequent commits added their respective webps. Only the blue-lock-specific failure persisted to the head of `main` as of `fec8310`.

## Root cause

In Phase 3b's per-article commit batch script:

```bash
git add content/articles/${slug}.* "public/images/articles/${slug}/body-wikimedia-"*.webp ...
```

The combination of:
- `git mv` having staged ~75 deprecation renames repo-wide BEFORE the loop ran
- The first loop iteration (`blue-lock-tokyo-skytree-cafe-2026`) running `git add` and committing → captured ALL pre-staged renames + the article's MDX edit, but the bash glob `body-wikimedia-*.webp` produced 0 matches at that moment because the `.webp` files weren't yet on the agent's disk in the right git state (or the glob's relative-path handling silently dropped non-matching tokens)
- The MDX changes for blue-lock body refs were not yet edited at THIS commit either — those came later in `fec8310`

Resulted in `b9bf9d9` carrying renames + non-blue-lock article changes but missing blue-lock's new webp files. Later `fec8310` updated MDX to reference the missing files. CI gate properly caught the contradiction.

## Why earlier checks didn't catch it

- Local Read tool verify (gate step 1) only checked individual files, not the cross-reference between MDX and disk.
- Earlier `git status` checks showed `?? public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-{2,3,4,5}.webp` as untracked, but I did not action this — assumed they had been added in `b9bf9d9`.

## Fix

1. Stage the 4 untracked webp files:
   ```
   git add public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-2.webp
   git add public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-3.webp
   git add public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-4.webp
   git add public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-5.webp
   ```
2. Commit on `fix/quality-gate-blue-lock-missing-webp` branch.
3. Push branch + open PR.
4. After user merges PR, the next `Image Quality Gate` run on main should report `0 P0 / 54 warnings` (warnings are pre-existing) and exit 0.

## Verification post-merge

The CI gate exits 0 when 0 P0 errors. The 54 warnings are pre-existing LOW_BPP / LOW_DENSITY and do not block.

User can confirm fix by:
1. Wait for merge + Vercel deploy
2. Run `gh run list --workflow="Image Quality Gate" --limit 5` and confirm the merge commit's run is `success`
3. Visit `https://www.japan-pop-now.com/articles/blue-lock-tokyo-skytree-cafe-2026` and visually confirm the 4 Tokyo Skytree body images load correctly

## Process improvements (next sprint)

1. **Repo-wide MDX-vs-disk check before any commit** — script `scripts/check-image-mdx-refs.py` that scans every article's image references and confirms each file exists on disk. Add to pre-commit hook or as a CI gate before image-quality-gate.
2. **Avoid bulk `git mv` followed by per-article add+commit** — the staged renames from earlier `git mv` calls bleed into the first loop iteration's commit, producing unintended bundling. Instead: do all `git mv` inside the per-article loop, OR run `git reset` between articles to keep staging clean.
3. **Stricter agent self-verify** — Phase 3 agents should run `git status --short` before reporting "file prep done" and explicitly list ANY untracked files in their report, not just the ones they intended to create.

## Affected files (locally untracked, NOT yet committed)

```
public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-2.webp  (601 KB)
public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-3.webp  (452 KB)
public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-4.webp  (526 KB)
public/images/articles/blue-lock-tokyo-skytree-cafe-2026/body-wikimedia-5.webp  (275 KB)
```

All 4 files passed local Read tool visual verify per Phase 3b group A agent's report (Tokyo Skytree variants from Solamachi / Asakusa / Sumida / Asahi Beer foreground). Wikimedia Commons CC BY-SA 3.0 / CC BY-SA 4.0 / CC BY 2.0 (multiple authors).

## STOP order compliance

Per user 2026-04-26 directive:
- ✅ Phase 3c batch halted (no agents launched this turn).
- ✅ Root cause identified via `gh run view 24957668494 --log-failed`.
- ✅ This incident doc written.
- 🟡 Fix delivered as PR (this turn, after this doc commit) — awaiting user review.
- ✅ No new commits to `main` until user merges.

Phase 3c / 3d / Step 4 work is paused until user signs off on this fix.
