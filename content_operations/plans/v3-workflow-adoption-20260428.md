# v3 Workflow Adoption — Plan (2026-04-28)

## Mission

User mission prompt (2026-04-28 第 2 弾) instructed full adoption of a "v3 workflow" with 9 buckets (項目 1-9). Items 1, 2, 3, 7, 8, 9 marked as "やれ"; items 4, 5, 6 implicitly out of scope this turn.

## Context Mismatch (acknowledged at start of turn)

Mission prompt referenced these as pre-existing, but verification on this branch (`main`, sha checked at turn start) found them absent:

| Mission claim | Reality |
| --- | --- |
| 8 memory files "必読" | 3 exist (image-related); 5 missing (`feedback_v3_workflow_adoption`, `feedback_no_file_delete`, `feedback_finish_no_deferral`, `feedback_plain_language`, `feedback_autonomous_overnight`) |
| 既存 Skill 4 件 | `.claude/skills/` directory does not exist (project or user level) |
| 73 articles | 77 in `content/articles/*.mdx` |
| v3 workflow Phase 0/2/3.5/4/5/6 | No occurrence in `docs/`, `content_operations/`, `_drafts/`, `.claude/rules/`, or recent commits |
| Active "REDO 3rd Phase 3c-3g" framework | Confirmed in last 50 commits (image 4-axis strict, 軸 5 hero) |

The 5 missing feedback memories effectively **duplicate** existing ones:
- `feedback_no_file_delete` ≈ CLAUDE.md L34 + `feedback_destructive_ops`
- `feedback_autonomous_overnight` ≈ `user_role` + `feedback_destructive_ops`
- `feedback_plain_language` ≈ `feedback_tone`
- `feedback_finish_no_deferral` — no exact equivalent (will save as new memory)
- `feedback_v3_workflow_adoption` — will save as new memory after this session

## Adoption Strategy

Treating "v3 adoption" as **materialization** of a verbally-discussed plan, not extension of pre-existing infrastructure. Buckets ranked by safety + ROI for this session:

### Phase 1 — this session (estimate 6-8 h equivalent)

| Bucket | Output | Status |
| --- | --- | --- |
| Plan + Skills scaffold | this file + `.claude/skills/` dir | in progress |
| A1 | `.claude/skills/jpn-translation-style/SKILL.md` | pending |
| A2 | `.claude/skills/jpn-seo-rules/SKILL.md` | pending |
| A3 | `.claude/skills/jpn-article-audit/SKILL.md` | pending |
| A4 | `.claude/skills/jpn-image-management/SKILL.md` | pending |
| B1 | `.claude/skills/jpn-article-preflight/SKILL.md` | pending |
| B2 | `.claude/skills/jpn-quality-reviewer/SKILL.md` | pending |
| B3 | `.claude/skills/jpn-anti-ai-detection/SKILL.md` | pending |
| C1 | `docs/research/ai-detection-theory-20260428.md` | pending |
| F | `docs/research/klook-viator-image-policy-20260428.md` | pending |
| D1 | `docs/audit/phase0-prescreen-20260428.md` + `scripts/audit/phase0-prescreen.ts` | pending |
| E1 | `scripts/price-audit/extract-prices.ts` | pending |

### Phase 2 — deferred to next overnight session

| Bucket | Reason for deferral |
| --- | --- |
| C2-C6 (pre-AI corpus + baseline + check-article + CI gate + retroactive 77 scan) | Requires 100-200 web fetches for corpus + 4-6 h script implementation; better as dedicated overnight |
| D2 (Opus detailed evaluation, 8 並列, 12-20 h) | Cost-heavy; want D1 prescreen result first to scope properly |
| D3 (rewrite vs noindex decision per article) | Depends on D2 |
| E2 (price verification batch) | Web fetch quota; 10-20 h; depends on E1 extraction first |
| E3 (price fix commits) | Depends on E2 |
| G (scheduled task updates) | Want Phase 1 outputs stable before wiring scheduled tasks to them |

## Commit Convention

Conventional commits per `CLAUDE.md` L78, with v3 marker in subject body:

```
feat(skills): create jpn-translation-style [v3 adopt A1]

[body explaining what the Skill covers]
```

## Hard Stops (per `reference_rules_files.md`: rules > mission)

- No `--no-verify`, no `--force`, no `git reset --hard origin/main`
- `npm run build` + `npx tsc --noEmit` green before push (Skill `.md` files do not enter build, so verified at code-touching commits)
- 5-silo structure stays (collab-cafes / experiences / area-guides / anime-pilgrimage / travel-tips)
- Author "Takapon" only, never real name
- Image source priority preserved: Wikimedia → 公式 X → 公式 web press → GMaps owner
- Never delete files (rename to `.deprecated` or set frontmatter `robots: noindex,follow`)
- No SKILL describes a behavior that conflicts with `.claude/rules/*.md` — when conflict, rules win

## Out-of-scope this session

- Item 4-6 from mission's 乖離 list (not marked "やれ")
- Any commit that modifies live article frontmatter without explicit fix target (E2/E3 wave handles those next session)
- Klook/Viator image asset adoption — gated on F research outcome (this session only researches)
- AI-detection CI gate enforcement — gated on C1-C6 baseline (Phase 2)
