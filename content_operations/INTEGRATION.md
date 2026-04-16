# Cowork Scheduled Task ↔ Claude Code Integration

## Purpose

Nine Cowork Scheduled Tasks handle always-on content ops. Claude Code (CLI) handles deep implementation work on the same repo. They share state through `content_operations/` so work doesn't collide.

## Contract

### Shared directory: `content_operations/`

```
content_operations/
├── INTEGRATION.md          # this doc
├── STATUS.json             # current state — read by both sides
├── QUEUE.md                # pending human-readable tasks
├── drafts/                 # trend-monitor + article-drafter write here
│   └── {YYYY-MM-DD}-{slug}.md
├── rewrites/               # rewrite-scheduler writes here
│   └── {slug}-rewrite.md
├── reports/                # monthly-strategy-review + post-publish writes here
│   └── {YYYY-MM}-{task}.md
└── plans/                  # Claude Code writes multi-step implementation plans
    └── {slug}.md
```

### STATUS.json schema

```json
{
  "last_cowork_task_run": "2026-04-16T09:00:00Z",
  "last_cowork_task_name": "trend-monitor",
  "last_claude_session_end": "2026-04-16T10:30:00Z",
  "branch": "main",
  "files_changed": 3,
  "pending_drafts": 2,
  "pending_rewrites": 1,
  "build_status": "pass | fail | unknown",
  "next_scheduled": [
    { "name": "article-drafter", "at": "2026-04-16T15:00:00Z" }
  ],
  "locks": {
    "claude_active": false,
    "cowork_active": false
  }
}
```

### Lock protocol

Before Claude starts work: if `locks.cowork_active == true`, wait or warn user.
Before a Cowork Scheduled Task runs: if `locks.claude_active == true`, defer for 30 min.

Claude sets `locks.claude_active = true` on `SessionStart` and `false` on `Stop` (handled by hooks).

## Task-by-task handoffs

### 1. trend-monitor (daily)
- **Cowork side**: scrapes collabo-cafe.com, PR Times, X. Writes leads to `content_operations/drafts/{date}-{slug}.md` with frontmatter only (no body yet).
- **Claude Code side**: on `SessionStart`, lists pending drafts. User says "draft the Chiikawa one" → Claude reads frontmatter, expands to full article using `.claude/rules/article-quality.md`, commits.

### 2. editorial-planner (weekly)
- **Cowork side**: analyzes GSC data, competitor gaps. Writes `content_operations/reports/{week}-plan.md` with a prioritized content list.
- **Claude Code side**: on request, reads the week's plan and queues the top 5 drafts.

### 3. article-drafter (daily)
- **Cowork side**: for drafts with `auto_draft: true`, writes a full body. Sets frontmatter `status: needs_review`.
- **Claude Code side**: `article-critic` subagent reviews; user approves; Claude runs typecheck + build + push.

### 4. content-qa (every 6h)
- **Cowork side**: scans live site for broken images, 404 internal links, missing alt text. Writes findings to `content_operations/reports/qa-{date}.md`.
- **Claude Code side**: on request, reads the QA report, fixes the issues one by one.

### 5. rewrite-scheduler (weekly)
- **Cowork side**: identifies articles with declining CTR or outdated facts (prices, dates). Writes rewrite specs to `content_operations/rewrites/{slug}-rewrite.md`.
- **Claude Code side**: user says "do the rewrites" → Claude reads specs, applies changes, commits with `content:` prefix.

### 6. post-publish (on push)
- **Cowork side**: after each commit to main, posts to Threads + X with scheduled timing. Writes confirmation to `content_operations/reports/social-{date}.md`.
- **Claude Code side**: no action — read-only observer.

### 7. affiliate-optimizer (weekly)
- **Cowork side**: audits CTA CTR via GA4, suggests product swaps. Writes recommendations to `content_operations/reports/affiliate-{week}.md`.
- **Claude Code side**: on request, Claude updates product picks per affiliate rules.

### 8. monthly-strategy-review (monthly)
- **Cowork side**: generates the monthly dashboard. Writes `content_operations/reports/{YYYY-MM}-strategy.md`.
- **Claude Code side**: user reads the report, asks Claude to implement top recommendations.

### 9. freelance-weekly-review (disabled)
- N/A — kept for future re-enable.

## Dispatch patterns

User says → Claude does:
- **"trend check"** → read `content_operations/drafts/` pending list
- **"draft the top lead"** → read first draft frontmatter, expand body, critic pass, commit
- **"what did qa find?"** → read latest `qa-*.md`, summarize
- **"fix qa issues"** → iterate through report, fix each, commit per fix
- **"ship the rewrites"** → process each `rewrites/*.md`, commit one per rewrite

## Cowork task output format

Every Scheduled Task, when it writes to `content_operations/`, must include this header:

```markdown
---
produced_by: {task-name}
produced_at: {ISO-8601}
claude_action: {draft | rewrite | fix | review | none}
priority: {P0 | P1 | P2 | P3}
---
```

This lets Claude quickly triage what to work on first.

## Implementation checklist

- [ ] `content_operations/` exists in repo root
- [ ] `.gitignore` includes `content_operations/STATUS.json` (session state, not source of truth)
- [ ] Each Cowork Scheduled Task's prompt includes: "Output to `content_operations/{drafts|rewrites|reports}/`"
- [ ] Claude Code `SessionStart` hook surfaces pending items (see `.claude/hooks/session-start.sh`)
- [ ] Claude Code `Stop` hook updates `STATUS.json` (see `.claude/hooks/stop-quality-gate.sh`)
