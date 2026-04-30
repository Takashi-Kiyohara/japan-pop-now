# Session 2026-04-30 Evening — Bucket Completion Report

User-supplied 7-bucket prompt focused on resolving the PR #23 conflict, hunting the recurring CodeQL + linter-revert issues, and continuing the Phase 3 cleanup tail.

## Bucket 0 — state check

Done. Findings:

- main HEAD `b499499` (last session's report) — no drift since prior session
- 4 open PRs: #23 (target), #10/#2/#1 (older non-priority)
- 78 articles in repo
- PR #23 had 1 truly conflicted file: `tokyo-anime-collab-cafes-spring-2026.md` (`UU` status)

## Bucket 1 — PR #23 rebase + conflict resolve

**COMPLETE.** Merged via `gh pr merge 23 --squash --admin` (`c28d64b` on main).

### Conflict shape

```diff
 date: "2026-03-25"
-<<<<<<< HEAD
-lastUpdated: "2026-04-29"
-=======
-lastUpdated: "2026-03-25"
-validUntil: "2026-05-31"
->>>>>>> 70980b3 (B1 Tier A citation + B2 validUntil sweep)
+lastUpdated: "2026-04-29"
+validUntil: "2026-05-31"
 category: "cafes"
```

Both edits were compatible — kept HEAD's newer `lastUpdated` (Spring cafes bi-weekly refresh from `09da8f5`/`8d2eb62`) AND added PR #23's `validUntil` (seasonal end date for sitemap exclusion via PR #24's logic).

### Process snag

The first `git rebase --continue` fired before the Edit tool had cleared the markers (Edit failed because file wasn't Read first; bash chained ahead). The broken commit `9e9c2b1` reached the branch with conflict markers in the YAML — caught by `npm run validate` failure. Cleaned by:

1. Read the broken file
2. Edit the conflict block to the merged form
3. Validate: 78/78 PASS
4. Commit fix (`bc20a2b`) + `git push --force-with-lease` (acceptable per the user's prompt explicitly listing this command)
5. PR #23 merge state: DIRTY → MERGEABLE → admin-merged

Squash-merge collapsed `9e9c2b1` + `bc20a2b` into a single clean commit on main.

## Bucket 2 — Linter revert root cause

**COMPLETE — no repo-level mechanism found, no fix required.**

Investigated all plausible local mechanisms:

| Mechanism | Present? | Could revert files? |
| --- | :---: | :---: |
| `.husky/` | NO | n/a |
| `.git/hooks/*` (active) | only `pre-push` | NO — guards push, doesn't modify |
| `.vscode/settings.json` | NO | n/a |
| `.editorconfig` / `.prettierrc*` / `prettier.config.js` | NO | n/a |
| `package.json` scripts: `prepare`/`format`/`lint:fix` | NO (only `lint: eslint`) | NO |
| `.gitattributes` | NO | n/a |

The pre-push hook is a content-aware guardrail that **blocks** non-allowlist files from direct main pushes. It does not modify working-tree state.

**Conclusion**: reverts originate outside the repo (user manual, IDE extension, external claude-code hook, or Cowork pipeline cleanup). The `<system-reminder>` framing of "intentional" is the authoritative signal. Remote PR branches are unaffected by the local revert pattern, and `--admin` merge consistently applies original edits to main.

Documented in `docs/incident/linter-revert-investigation-20260430.md`. No follow-up PR.

## Bucket 3 — CodeQL recurring FAILURE root cause

**COMPLETE — root cause identified, fix deferred to next session.**

Failure pattern from run 25103577562 logs:

```
A fatal error occurred: A 'codeql resolve extensions-by-pack' operation failed with error code 2

##[error]Error running analysis for javascript: ...codeql database run-queries
  --additional-packs=/home/runner/work/_temp/pr-diff-range
  --extension-packs=codeql-action/pr-diff-range ...
```

**Root cause**: PR-only failure. Push-to-main runs PASS. The `codeql-action/pr-diff-range` extension pack — used to scope analysis to PR diff lines — fails to resolve in CodeQL CLI v2.25.2 paired with `github/codeql-action@f09c1c0` (= v3.27.5 from late 2024). Likely an action↔CLI version skew that was fixed in later v3.28+/v3.29+ releases.

PR #15's `fetch-depth: 0` was necessary (merge-base lookup needed full history) but not sufficient (the extension pack format issue is downstream of merge-base).

**Workaround used this session**: `gh pr merge --admin` for PR #23 (and the 4 PRs in last session) per the user's CodeQL-only override clause.

**Recommended next-session fix**: bump `github/codeql-action/init` and `analyze` to latest v3 release. Verify on a throwaway PR. Branch suggestion: `fix/codeql-action-bump`.

Documented in `docs/incident/codeql-pr-diff-range-failure-20260430.md`. Fix deferred — next-session work touches `.github/workflows/security.yml` which is high-blast-radius and benefits from a clean dedicated PR.

## Bucket 4 — B1 batches 2/3 retry

**NOT STARTED.** Sub-agent rate-limit risk identical to the prior cliff (Asia/Tokyo reset boundary). Defer to a session that explicitly schedules around the limit window. Parallel-2 cap design noted but not implemented.

## Bucket 5 — B3 smart-recovery (mojibake)

**NOT STARTED.** The selective-replace algorithm design is documented in last session's `docs/audit/b3-mojibake-deferred-20260429.md`. Implementation requires building a small mojibake-pattern→target-char map, applying via regex sweep with apostrophe-preservation guarantee, then 3-Critic loop. Estimated 2-3 h focused work; defer to its own session for proper Critic-loop discipline.

## Bucket 6 — B4 E2 v2 + B5 R1 cannibalization

**NOT STARTED.** Same defer rationale.

## Bucket 7 — `human_baseline_match` hatch

**NOT STARTED.** Embedding pipeline standalone work; defer.

## Cumulative session metrics

- main-direct commits: 2 (PR #23 admin-merge `c28d64b` + 2 incident docs `912d64a`)
- PRs merged: 1 (#23 squash via --admin override)
- PR force-with-lease pushes: 1 (PR #23 fix-commit, explicit user authorization in prompt)
- destructive ops: 0
- `--no-verify` / `--force` (regular): 0
- 5-axis image / 5-silo / Takapon / no-delete: 100% honored
- Critic loop: applied to PR #23 conflict resolve (Critic 1 syntax = validate 78/78 PASS; Critic 2 content = lastUpdated newer + validUntil compatible; Critic 3 relations = no cross-article impact since change was frontmatter-only)

## All v3 Phase 3 PRs now merged

| PR | Title | Merge SHA |
| -- | --- | --- |
| #21 | feat(ai-detection): L4 hybrid gate (5 escape hatches) | `8b2d511` |
| #22 | refactor(ai-detection): extract metric helpers to lib.ts | `c306acf` |
| #23 | content: B1 citation sweep + B2 validUntil sweep | `c28d64b` (this session) |
| #24 | feat(sitemap): exclude validUntil-past articles | `6d55ede` |
| #25 | content(internal-links): 3 transit articles → trains article | `1ae47c2` |

The Phase 3 plan (started 2026-04-29) is structurally complete. Remaining work is residual cleanup (B1 batches 2-3, mojibake smart-recovery, B4 E2 v2, B5 R1 clusters, human-baseline hatch) — all documented for resumption.

## Next-session priority

1. **CodeQL action bump** — `fix/codeql-action-bump` PR with version bump + verify on throwaway PR
2. **B5 smart-recovery** for slam-dunk-kamakura + tokyo-anime-collab-cafes-summer mojibake (Critic loop)
3. **B1 batches 2/3 retry** with parallel-2 cap (rate-limit-window-aware scheduling)
4. **B4 E2 v2** primaryVenueUrl resolver + E3 price corrections
5. **B5 R1 cannibalization** 3 cluster (3 separate PRs)
6. **B7 human_baseline_match** hatch (embedding pipeline)
7. **GSC URL Inspection** for `how-to-ride-trains-japan-tourists-2026` (off-machine user action)
8. **SNS post** for new article (manual or Cowork pipeline)
