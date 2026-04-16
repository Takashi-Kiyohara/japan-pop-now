# Critic Report — Claude Code Setup v2

Date: 2026-04-16
Reviewer: Claude (Critic loop per user rule)

## TL;DR
v2 is structurally solid (27 files, 5 rules / 7 hooks / 5 agents / 8 MCP) but has **gaps in affiliate enforcement, shallow secret detection, soft TS gate, and no custom slash commands**. 14 issues found: 6 P0 (must-fix), 5 P1 (important), 3 P2 (nice-to-have).

## 全体像 (Overall)

| Layer | v2 state | Verdict |
|---|---|---|
| Rules (path-scoped) | 5 files, good coverage | OK |
| Hooks (PreTool/Stop/Session) | 7 hooks | WEAK: Stop gate warns but doesn't block |
| Subagents | 5 (seo / image / critic / build / scout) | GAP: no affiliate-auditor |
| MCP | 8 servers, GSC enabled | GAP: GA4 missing = no revenue attribution |
| Cowork integration | INTEGRATION.md + STATUS.json | NOT ENFORCED: lock protocol is doc-only |
| CLAUDE.md | ~120 lines, dense | BORDERLINE: ~3k tokens/session |
| Custom commands | None | MISSING: `/publish-draft` etc. |

## 各者の関連性 (Interconnections)

**Issue D (P0):** `stop-quality-gate.sh` WARNS on TS errors but doesn't block. Should hard-fail on `main` branch when changed files are .ts/.tsx.

**Issue E (P1):** STATUS.json lock protocol is documentation only — no hook reads `locks.cowork_active`. Claude could clobber a running Cowork task.

**Issue F (P1):** Subagents don't explicitly reference MCP servers. `seo-auditor` should cite `gsc` MCP; `research-scout` should cite `fetch` MCP. Current `tools:` field is too vague.

## 戦略との適合性 (Strategic Fit)

**Issue H (P1):** Automation goal is "push/画像挿入/SNS全自動" but no hook signals Cowork's post-publish task after `git push`. Missing trigger file pattern.

**Issue I (P2):** UK migration → Moe委託. Setup has no "less-technical user" layer. Need `docs/ONBOARDING.md` + `.env.example`.

**Issue J (P1):** No automation for affiliate compliance. 55 articles exist — unknown how many have 3-CTA placement, disclosure, nofollow sponsored.

## Affiliate concerns (user flagged)

**Issue K (P0):** `guard-files.sh` has no detection for hardcoded affiliate IDs. Klook `?aff=12345` or Amazon `?tag=snsganbaro-22` leaking into source should hard-block.

**Issue L (P0):** **MISSING subagent: `affiliate-auditor`**. Should check per-article: 3-CTA positions, disclosure presence, nofollow+sponsored attrs, UTM params, no dead product IDs.

**Issue M (P2):** No dead-link detector. Klook/Agoda product IDs discontinue silently. Should be scheduled (weekly).

**Issue N (P1):** No GA4 MCP = no conversion attribution. Can't tell which article → which affiliate earns.

**Issue O (P0):** Affiliate disclosure rule exists but not enforced. Hook should verify `<AffiliateDisclosure />` in all articles with affiliate links.

## Security concerns (user flagged)

**Issue P (P0):** Secret detection in `guard-files.sh` is shallow. Missing patterns:
- GitHub tokens: `ghp_[A-Za-z0-9]{36,}`, `gho_`, `ghs_`, `ghu_`, `ghr_`
- AWS access keys: `AKIA[0-9A-Z]{16}` + secret key patterns
- Google API keys: `AIza[0-9A-Za-z_-]{35}`
- Stripe: `sk_live_`, `pk_live_`, `rk_live_`
- Vercel: `[a-zA-Z0-9]{24}` with Vercel context
- Slack: `xox[baprs]-[0-9]+-[A-Za-z0-9]+`
- Generic JWT: `eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`
- Generic high-entropy strings near sensitive keys

**Issue Q (P0):** No pre-commit secret scan. If Claude's guard fails (e.g., editing a binary), secrets could still land in a commit. Needs `pre-commit` hook with `detect-secrets` or `gitleaks`.

**Issue R (P1):** Current CSP uses `'unsafe-inline' 'unsafe-eval'` for scripts. Next.js 16 supports nonce-based CSP (`next.js nonce`). Should tighten.

**Issue U (P1):** No automated `npm audit`. Needs GitHub Action with weekly cron + failure issue creation.

**Issue W (P1):** No GitHub Actions workflow audit. Unpinned actions (`@v4` instead of SHA), over-broad permissions.

**Issue V (P2):** No `.env.example` for env var documentation (Moe handoff prep).

## Token optimization

**Issue A (P2):** CLAUDE.md ~120 lines is OK but can be trimmed by moving "Code Standards" detail to a rule file.

## Missing things

**Issue AD (P1):** No custom slash commands in `.claude/commands/*.md`. Would enable:
- `/publish-draft {slug}` — reads draft, critics, builds, pushes
- `/audit-month` — runs 3 auditor agents on last 30-day articles
- `/daily-ops` — reads STATUS.json + lists pending work

---

## Fix plan

### P0 (this pass — implement now)
1. Create `affiliate-auditor.md` subagent
2. Upgrade `guard-files.sh` with comprehensive secret + affiliate ID patterns
3. Upgrade `stop-quality-gate.sh` to block on TS errors on main
4. Create affiliate disclosure enforcement in `guard-files.sh`
5. Create `.githooks/pre-commit` for secret scan (uses detect-secrets if available, regex fallback)
6. Wire `.githooks` path in settings.json

### P1 (this pass — implement now)
7. Add GA4 MCP to `mcp.json`
8. Create `.claude/commands/` with 3 custom commands
9. Create `.env.example`
10. Create `.github/workflows/security.yml` (weekly npm audit + secret scan)
11. Create `WORKFLOW.md` (PDCA flows doc)
12. Bind MCP tools explicitly in subagent frontmatter

### P2 (document, not implement)
13. ADR pattern → `docs/adr/` — future
14. Moe onboarding doc → `docs/ONBOARDING.md` — closer to Sep
15. CHANGELOG.md — lighter priority

---

## Strategic fit verdict

Current setup **adequately supports development quality** but **under-invests in monetization governance and secret detection**. Given the user's ¥200k/mo goal and UK migration (handoff to non-technical person), the P0 fixes are non-negotiable before scaling article production.
