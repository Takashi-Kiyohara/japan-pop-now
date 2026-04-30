# Incident: CodeQL recurring FAILURE on PR runs — pr-diff-range extension pack

**Date:** 2026-04-30
**Affected workflow:** `.github/workflows/security.yml` (job `codeql`) on `pull_request` trigger
**Severity:** medium — CodeQL has been failing on every PR since at least 2026-04-28; PR #15's `fetch-depth: 0` fix turned out to be necessary but not sufficient. All 4 v3 Phase 3 PRs (#21/#22/#23/#24) merged this session via `--admin` override per the user's CodeQL-only override clause.
**Resolution this session:** root cause documented; PR fix deferred to next session per the workflow-file-touch caution rules.

## Symptom

Every PR's `CodeQL static analysis` check fails with the same error pattern. Push events to `main` (post-merge) PASS. So the failure is **scoped to the `pull_request` trigger**.

## Root cause (extracted from run 25103577562 logs)

```
A fatal error occurred: A 'codeql resolve extensions-by-pack' operation failed with error code 2

##[error]Error running analysis for javascript: Encountered a fatal error while running
"/opt/hostedtoolcache/CodeQL/2.25.2/x64/codeql/codeql database run-queries
  --ram=14575
  --threads=4
  --additional-packs=/home/runner/work/_temp/pr-diff-range
  --extension-packs=codeql-action/pr-diff-range
  /home/runner/work/_temp/codeql_databases/javascript
  --expect-discarded-cache
  --min-disk-free=1024
  -v
  --intra-layer-parallelism".
```

The CodeQL CLI fails to resolve the extension pack `codeql-action/pr-diff-range` at the path `/home/runner/work/_temp/pr-diff-range`. This is the **PR-scoped diff analysis** mechanism — the action injects an extension pack that limits CodeQL's scan to the lines changed in the PR, not the whole codebase.

## Why PR #15's fetch-depth fix was necessary but not sufficient

PR #15 added `fetch-depth: 0` to `actions/checkout@v4` for the `codeql` job. That was needed to allow the action to compute `merge-base(HEAD, origin/main)` — without full history, this lookup returned `undefined`. Verified by inspecting earlier logs (pre-#15) which threw an `undefined merge-base` error.

After PR #15: the merge-base resolves correctly, so the action successfully *creates* the pr-diff-range extension pack at `/home/runner/work/_temp/pr-diff-range`. But then CodeQL CLI itself fails to *resolve* the pack — a different error in a later step.

The `codeql resolve extensions-by-pack` failure is internal to CodeQL CLI v2.25.2 (the version pinned in the workflow's `github/codeql-action/init@f09c1c0a94de965c15400f5634aa42fac8fb8f88` = v3.27.5). There may be a version skew between the action's expected pack format and the CLI's parser.

Likely fixes (in priority order):

1. **Bump `github/codeql-action/init` and `analyze` to a newer release.** v3.27.5 is from late 2024; later v3.28+ / v3.29+ versions may have fixed the pr-diff-range pack format. The repo uses pinned commit hashes per security best practice — need to update both `init` and `analyze` SHA references.

2. **Disable pr-diff-range** if the newer action version doesn't fix it. The action accepts a config option to opt out of PR-diff scoping; needs verification of exact name (`disable-default-queries`, `pr-diff-range`, etc.).

3. **Remove the `pull_request` trigger from `codeql` job entirely.** Push-to-main scans cover everything; PR-time CodeQL is a nice-to-have. Trade-off: lose the per-PR feedback (which has been blocked anyway by this bug, so functionally no regression).

## Workaround (this session)

All 4 v3 Phase 3 PRs merged via `gh pr merge <N> --squash --admin` per the user's CodeQL-only override clause. Post-merge CodeQL runs on `main` complete successfully — security coverage is preserved, just delayed by one merge.

## Recommended next-session fix

1. Implement option (1): bump codeql-action to latest v3 release. Verify on a throwaway PR first by pushing a trivial change and watching the CodeQL run.
2. If (1) doesn't fix: implement option (2). Confirm no regressions vs option (3).
3. Document the bump in a follow-up `docs/incident/codeql-action-bump-{date}.md`.

PR branch suggestion: `fix/codeql-action-bump`.

## Notes

- This file is a docs-only commit per the `docs/**` allowlist for direct-main pushes. The workflow-file edit is the next-session work.
- No core CI behavior changed today; admin-overrides are explicitly authorized per the prompt's "CodeQL admin override 例外" clause.
