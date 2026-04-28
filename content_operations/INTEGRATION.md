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
- **Cowork side (v3 addition)**: for every proposed article, run Phase 0 5-question + 4-reject pre-flight per `.claude/skills/jpn-article-preflight/SKILL.md`. Score is binary (0 or 100); only score-100 candidates make it into the prioritized list. Each candidate also gets a Phase 2 outline declaration (intent, primary keyword, silo, stack template).
- **Claude Code side**: on request, reads the week's plan and queues the top 5 drafts.

### 3. article-drafter (daily)
- **Cowork side**: for drafts with `auto_draft: true`, writes a full body. Sets frontmatter `status: needs_review`.
- **Cowork side (v3 addition)**: before declaring `status: needs_review`, the drafter must run two automated gates against the body output:
  1. Layer 1 banned-phrase grep per `.claude/skills/jpn-translation-style/SKILL.md` (CI-callable via `npx tsx scripts/ai-detection/check-article.ts <slug> --json` and inspecting `.layer1.score`). If any L1 hit, the drafter rewrites and re-grep before saving.
  2. Composite AI-detection score per `scripts/ai-detection/check-article.ts`. If composite ≥ 30, do not set `status: needs_review` — set `status: needs_rewrite` and include the dominant-layer note in the draft frontmatter.
- **Claude Code side**: `article-critic` subagent reviews; user approves; Claude runs typecheck + build + push.

### 4. content-qa (every 6h)
- **Cowork side**: scans live site for broken images, 404 internal links, missing alt text. Writes findings to `content_operations/reports/qa-{date}.md`.
- **Claude Code side**: on request, reads the QA report, fixes the issues one by one.

### 5. rewrite-scheduler (weekly)
- **Cowork side**: identifies articles with declining CTR or outdated facts (prices, dates). Writes rewrite specs to `content_operations/rewrites/{slug}-rewrite.md`.
- **Claude Code side**: user says "do the rewrites" → Claude reads specs, applies changes, commits with `content:` prefix.

### 6. post-publish (on push)
- **Cowork side**: after each commit to main, posts to Threads + X with scheduled timing. Writes confirmation to `content_operations/reports/social-{date}.md`.
- **Cowork side (v3 addition)**: in the same pass, run `scripts/ai-detection/check-article.ts <changed-slug> --json` against any newly-published or substantially-rewritten article (commit message includes `feat(content):` or `content(rewrite):`). If `.layer1.score > 0` OR `.composite >= 30`, write an alert to `content_operations/reports/post-publish-alert-{date}.md` with the slug, dominant layer, and a 1-line recommendation (refresh / rewrite / noindex). The post-publish task does NOT block the push (already happened); alerts are surfaced to the user on next session via `SessionStart`.
- **Claude Code side**: no action — read-only observer (alert files surfaced by SessionStart hook).

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

## v3 phase integration (added 2026-04-28)

Three Cowork tasks have new automated gates wired in (see task-by-task notes above):

- **editorial-planner** — runs Phase 0 (`jpn-article-preflight` Skill) on each candidate; only score-100 candidates make the prioritized list.
- **article-drafter** — runs Layer 1 banned-phrase grep + composite AI-detection score (`scripts/ai-detection/check-article.ts`); composite ≥ 30 routes to `status: needs_rewrite` instead of `status: needs_review`.
- **post-publish** — runs the same AI-detection check on newly-published / rewritten articles; non-zero L1 or composite ≥ 30 writes an alert file to `reports/post-publish-alert-{date}.md`.

**Threshold** (composite ≥ 30) is the SHIP / FIX_LAYER boundary in the Skill. After Bucket C3 baseline lands at `docs/research/human-baseline-20260428.json`, the Cowork task prompts should re-anchor the threshold against the project-calibrated score (likely a different absolute number with the same intent: "≥ FIX_LAYER boundary").

**Skill references** the Cowork task prompts must include verbatim:

```
Before saving the draft, run:
  npx tsx scripts/ai-detection/check-article.ts <slug> --json

Parse the JSON. If .layer1.score > 0 OR .composite >= 30 (after C3
calibration: use the calibrated boundary from
docs/research/human-baseline-20260428.json), set status to
"needs_rewrite" and write the dominant-layer note in frontmatter.
Do NOT set "needs_review" until both gates pass.
```

**Phase 0 reference** the editorial-planner prompt must include verbatim:

```
For each candidate, score Phase 0 (5 questions + 4 reject criteria) per
.claude/skills/jpn-article-preflight/SKILL.md. The score is binary:
0 or 100. Only candidates scoring 100 are added to the prioritized list.
For each Q-failure or R-trigger, capture a 1-sentence rationale in the
plan doc so the Claude Code side can decide whether to override.
```
