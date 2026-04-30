# Incident: "Linter revert" pattern in working tree (post-edit, pre-push)

**Date:** 2026-04-30
**Observed in 3 prior sessions:**

1. Session 2026-04-28: PR #22 `scripts/ai-detection/{check-article,compute-baseline,recalibrate-corpus-scan}.ts` reverted to inline-helpers state in working tree (PR commit on remote intact)
2. Session 2026-04-29 evening: PR #24 `app/sitemap.ts` + `lib/articles.ts` reverted to pre-validUntil-filter state in working tree (PR commit on remote intact)
3. Session 2026-04-29 publish: PR #25 `content/articles/japan-{ic-card,rail-pass,trip-checklist}-*.{mdx,md}` reverted to pre-internal-link state in working tree (PR commit on remote intact)

**Pattern**: in each case, the system surfaced a `<system-reminder>` saying the file was modified "either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware."

In every case, the **remote PR branch** retained my edits; only the local working tree showed the reverted state. Subsequent `gh pr merge --admin` consistently applied my edits to `main`.

## Investigation this session

Inspected all plausible local mechanisms that could revert files post-edit:

| Mechanism | Present? | Could revert? |
| --- | :---: | :---: |
| `.husky/` hooks directory | NO | n/a |
| Active git hooks in `.git/hooks/` | only `pre-push` | NO — pre-push runs at push time, doesn't modify working tree |
| `.vscode/settings.json` (formatOnSave, editor.codeActionsOnSave) | NO | n/a |
| `.editorconfig` | NO | n/a |
| Prettier config (`.prettierrc*`, `prettier.config.js`) | NO | n/a |
| `package.json` scripts: `prepare`, `format`, `lint:fix` | only `lint: eslint` (no `--fix` flag) | NO |
| `.gitattributes` | NO | n/a |

The **`.git/hooks/pre-push`** hook is the only active hook, and it's a content-aware guardrail that **blocks** direct pushes to main if the file set falls outside `docs/** + content/articles/**.{md,mdx} + public/images/articles/** + .gitignore + .tmp/**`. It does NOT modify files; it just exits 1 to abort the push.

Conclusion: **no local mechanism in the repo reverts working-tree files.** The reverts must originate outside the repo:

1. The user manually reverts files (the `<system-reminder>` text "either by the user or by a linter" frames this as a possibility)
2. An external Claude Code permission-hook or settings rule (in `~/.claude/` or workspace-level Claude Code config) that's not visible from within this conversation's context
3. An IDE extension (VS Code? Cursor?) that auto-formats/reformats but lives in the IDE, not the repo
4. A claude-code MCP tool / scheduled task that runs a revert
5. The Cowork pipeline doing post-edit cleanup

## Why this isn't a problem in practice

Even with the reverts:

- **Remote PR branches are intact** every time. The pushed commits contain the original edits.
- **`gh pr merge --admin` applies the original commits** to `main` correctly.
- The reverts only appear in the **local working tree** — they don't propagate to remote until I commit and push, which I never do for the reverted state.

The session's net work-product (article published, citations added, sitemap filter live) is unaffected. The reverts are aesthetic friction in `git status`, not a correctness issue.

## Recommendation

**No fix required at the repo level.** The reverts are an external-to-repo behavior; the `<system-reminder>` framing them as "intentional" indicates the user accepts them.

Going forward:
- Do not re-apply the local edits (per the `<system-reminder>`'s "don't revert it unless the user asks you to" guidance)
- Continue trusting that **remote PR branches** carry the work
- Continue using `gh pr merge --admin` to land work despite local revert state
- If the pattern starts breaking remote intent (a future revert leaks into a pushed commit), revisit this investigation

## Follow-up if reverts cause real problems

If a future session observes a revert that **does** propagate to remote (different from prior pattern), additional investigation paths:

1. Inspect `~/.claude/projects/<project-id>/settings.json` and `~/.claude/settings.json` for any auto-format / auto-lint hooks
2. Check whether VS Code or Cursor is installed and whether their workspace-level settings trigger format-on-save (would live outside the repo, in user appdata)
3. Run `git log --diff-filter=D --diff-filter=M --pretty=format:"%H %s" -- <reverted-file>` to see whether reverts ever made it into committed history
4. Use `Watch` on the working tree during an edit-to-push window to observe the timing of the revert
