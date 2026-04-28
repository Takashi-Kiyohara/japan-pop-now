# Incident: CodeQL pr-diff-range fail loop — fetch-depth fix

**Date:** 2026-04-28
**Affected workflow:** `.github/workflows/security.yml` (job `codeql`)
**Resolution:** add `fetch-depth: 0` to the CodeQL checkout step (this incident-doc PR).
**Severity:** medium — security workflow failed on every PR, blocking merges that required CodeQL ✅; PR #14 had to be merged via admin override.

## Symptom

Every PR ran the CodeQL job, the job failed during the `Init CodeQL` or `Analyze` step with the pr-diff-range extension reporting `undefined` for `main`. Result: the security workflow's CodeQL job stayed red, and any merge that required CodeQL ✅ was blocked.

## Root cause

`actions/checkout@v4` defaults to a **shallow clone (`fetch-depth: 1`)**. This pulls only the tip of the branch being analyzed. CodeQL's `pr-diff-range` extension — used to scope analysis to the changed lines on a PR — needs to compute `merge-base(HEAD, origin/main)`. With a depth-1 clone, `origin/main` is not in the local clone's commit history, and the merge-base lookup returns `undefined`. The CodeQL action then errors out (or, depending on the version, silently produces a malformed range that fails downstream).

The other two jobs in the same file (`secret-scan`, `npm-audit`) were unaffected:

- `secret-scan` already had `fetch-depth: 0` set explicitly (gitleaks needs full history to scan all commits, not just HEAD).
- `npm-audit` only needs HEAD's `package-lock.json`, so the default depth-1 was fine.

## Fix

Add `with: fetch-depth: 0` to the `codeql` job's checkout step, matching the pattern already used for `secret-scan`:

```yaml
- name: Checkout
  uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  with:
    fetch-depth: 0  # full history needed for CodeQL pr-diff-range extension
```

This pulls the full repository history at job start. For a repo of japan-pop-now's size, the cost is small (extra ~5-10 s on checkout) and is not on a hot path.

## Verification plan

1. Merge this PR.
2. Open or push to any PR after merge — CodeQL job should run with the deeper clone.
3. Inspect the CodeQL run log for "pr-diff-range" — value should resolve to a real `<sha>..<sha>` range, not `undefined`.
4. Run `gh run list --workflow=security.yml --limit 5` and confirm the `codeql` job is `success` rather than `failure`.

If CodeQL is still failing post-merge, the next root-cause candidates are:

- `queries: security-extended` config compilation error (CodeQL pack version mismatch)
- Action versions out of date with current GitHub-hosted runner image
- Repo-level Code Scanning settings overriding the workflow-level config

## Why this wasn't caught earlier

The shallow-clone default is convenient for most jobs, and the CodeQL extension's reliance on full history is a recent addition (early 2025). Existing workflows authored before that change continue to "work" until someone tries to use the pr-diff feature. The repo's other security job (gitleaks) had set `fetch-depth: 0` explicitly for unrelated reasons, masking the issue.

## Follow-up

- The fix should be applied as a **mechanical pattern** for any future CodeQL-using workflow.
- Consider adding a comment in `.github/workflows/security.yml` near the checkout block: `# CodeQL needs full history; do NOT remove fetch-depth: 0`.
- This is the second instance of "reset-once-fix-everywhere" workflow change in 2026 (the first was the gitleaks `fetch-depth: 0` add). If a third surfaces, codify in `.claude/rules/` or a CI README.
