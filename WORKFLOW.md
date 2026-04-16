# Claude Code Workflows — japan-pop-now.com

How the setup pieces fit together in day-to-day operation.

## The 3-Layer Architecture

```
┌───────────────────────────────────────────────────────────┐
│  Cowork Scheduled Tasks (always-on)                       │
│  trend-monitor / editorial-planner / article-drafter /    │
│  content-qa / rewrite-scheduler / post-publish /          │
│  affiliate-optimizer / monthly-strategy-review            │
└─────────────────────┬─────────────────────────────────────┘
                      │ writes to
                      ▼
       ┌───────────────────────────────┐
       │   content_operations/         │
       │   ├── STATUS.json  ← contract │
       │   ├── drafts/                 │
       │   ├── rewrites/               │
       │   ├── reports/                │
       │   ├── plans/                  │
       │   └── QUEUE.md                │
       └─────────────────────┬─────────┘
                             │ read on SessionStart
                             ▼
┌───────────────────────────────────────────────────────────┐
│  Claude Code (on-demand deep implementation)              │
│  - Hooks guard every action                               │
│  - 6 subagents do parallel audits                         │
│  - 8 MCP servers expand capabilities                      │
│  - 4 slash commands bundle common workflows               │
└───────────────────────────────────────────────────────────┘
```

## Daily flow

### Morning (User opens Claude Code)
1. `SessionStart` hook runs → surfaces STATUS.json + pending drafts
2. User: `/daily-ops`
3. Claude reads queue, proposes top 3 tasks
4. User picks one

### Article publishing
1. User: `/publish-draft chiikawa-osaka-2026`
2. Claude:
   - Reads `content_operations/drafts/2026-04-16-chiikawa-osaka.md`
   - Expands body per `.claude/rules/article-quality.md`
   - Writes `content/articles/chiikawa-osaka-2026.md`
   - `guard-files.sh` hook blocks any violation (Unsplash / real name / hardcoded affiliate ID)
   - Invokes `image-verifier` → confirms images exist
   - Invokes `seo-auditor` → checks meta / AEO / internal links
   - Invokes `article-critic` → mandatory 2nd pass
   - Invokes `affiliate-auditor` → 3-CTA + disclosure
   - Invokes `build-validator` → tsc + lint + build
   - `git commit` → `pre-commit` hook runs secret scan
   - Shows diff, asks user to approve push

### Before push to main
1. User: `/pre-push`
2. Claude runs build-validator + affiliate-auditor + secret scan
3. On all-pass → push with confirmation
4. Cowork's `post-publish` task sees the commit, posts to Threads + X

### Weekly audit
1. User: `/audit-month`
2. Claude parallel-invokes seo / image / affiliate / critic on last-30-day articles
3. Report written to `content_operations/reports/audit-{date}.md`
4. If ≥ 3 CRITICALs, auto-adds P0 to QUEUE.md

## PDCA 3x rule (user's mandatory rule)

Every article goes through 3 passes before publish:

1. **Draft** — Claude writes based on rules
2. **Visual QA** — `image-verifier` + hero crop check
3. **Critic** — `article-critic` — MUST run, cannot skip

If any pass fails, fix + re-run that pass. Do NOT proceed to push until all 3 pass.

## Subagent routing

| User intent | Subagent |
|---|---|
| "check SEO" / "メタ確認" | seo-auditor |
| "broken images" / "画像チェック" | image-verifier |
| "review this draft" / "記事レビュー" | article-critic |
| "can I ship?" / "ビルド確認" | build-validator |
| "affiliate check" / "CTA確認" | affiliate-auditor |
| "research" / "調べて" / "一次情報" | research-scout |

## MCP routing

| Need | MCP server |
|---|---|
| Next.js 16 / React 19 docs | context7 |
| Visual QA / screenshots | playwright |
| Issue / PR / Actions log | github |
| Web page fetch | fetch |
| Perf / a11y audit | lighthouse |
| Bundle size / route tree | next-devtools |
| GSC queries / CTR by page | gsc (requires setup) |
| GA4 sessions / conversions | ga4 (requires setup) |
| Scoped file access | filesystem-content |

## Hook execution order

```
UserPromptSubmit → inject-context.sh  (adds article frontmatter if referenced)
         ↓
      user task
         ↓
PreToolUse (Bash) → guard-bash.sh     (blocks rm -rf, pipe-to-sh, etc.)
PreToolUse (Write/Edit) → guard-files.sh  (blocks secrets, affiliate IDs, Unsplash)
PreToolUse (mcp__*) → guard-mcp.sh    (logs injection patterns)
         ↓
      tool runs
         ↓
PostToolUse (Write/Edit) → post-edit-format.sh  (eslint --fix + prettier)
         ↓
      ... (loop continues) ...
         ↓
Stop → stop-quality-gate.sh           (tsc check, updates STATUS.json, blocks on main)
SessionStart → session-start.sh       (surfaces pending work next time)
```

## Security chokepoints

```
Code edit ──── guard-files.sh ────┐
                                   │
                                   ▼
                          PostToolUse formatting
                                   │
                                   ▼
                         (Claude stops, user reviews)
                                   │
                                   ▼
                          git commit ──── .githooks/pre-commit ────┐
                                                                    │
                                                                    ▼
                                                             git push ──── GitHub Actions security.yml
                                                                                           │
                                                                                           ▼
                                                                                    gitleaks / npm audit / CodeQL
```

Three independent layers mean even if one fails, the others catch secrets before they leave the repo.

## When to use Cowork skills vs Claude Code

| Task | Use |
|---|---|
| One-off deep implementation | Claude Code |
| Recurring daily/weekly ops | Cowork Scheduled Task |
| Strategic analysis | Cowork `jpn-analytics-strategist` skill |
| Writing articles from scratch | Either — `/publish-draft` in CC or `jpn-translation-style` in Cowork |
| Quick file question | Cowork (file preview fast) |
| Multi-file refactor with type safety | Claude Code (tsc loop) |
| Image sync / HEIC conversion | Cowork Scheduled Task |
| Scheduled Threads/X posting | Cowork Scheduled Task |

## Emergency operations

### Secret leaked to repo
1. IMMEDIATELY rotate the credential at source (GitHub / AWS / etc)
2. `git filter-repo` to purge from history (requires user approval per security rules)
3. Force-push only if user confirms (normally blocked by deny rules)
4. Open GitHub issue, post-mortem

### Build broken on main
1. `git revert` the offending commit
2. Open a fix branch
3. Invoke `build-validator` until clean
4. PR → merge

### Affiliate link broken (dead product)
1. `affiliate-auditor` flags it
2. `research-scout` finds a replacement
3. Update article
4. Re-run auditor
