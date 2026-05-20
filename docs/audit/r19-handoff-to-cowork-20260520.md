# R19 Phase C Sprint 1 — Cowork handoff (2026-05-20)

PR: [#91](https://github.com/Takashi-Kiyohara/japan-pop-now/pull/91) · branch `s5-sprint1-w5-fix` · HEAD `96030a4` · 10/10 slugs in `maintain` bucket post-fix.

This handoff captures sprint1's Code-side resolution of Cowork external Critic R-1's three P0 items + number corrections + the next gate Cowork is asked to run (R-2 against deployed preview).

---

## 1. P0 resolution (per R-1 verdict)

### P0-1 — AI-detection L4 gate BLOCKED on JJK + 3venue (composite 90)

**Resolution path: Path B (substantive revise), NOT Path A (`ai_audit_override`).**

| Slug | Commit | Approach | Post-fix gate verdict |
|---|---|---|---|
| `jujutsu-kaisen-cafes-japan-2026-guide` | `482ee92` | 3-round prose surgery: brand rotation (12→4 literal "Jujutsu Kaisen 5th Anniversary Cafe" mentions; first definitional kept), city-list paraphrase, image-credit suffix variation, sentence-start diversity boost | composite 90 (L4) · `blocked: false` via hatch #4 `pattern_allow` (0 ban-list hits + diversity **0.625** ≥ 0.6) |
| `detective-conan-cafe-tokyo-osaka-3venue-2026` | `801c7be` | Banned-phrase fix ("navigate the booking flow" → "handle the Japanese booking flow"), CC BY-SA 4.0 suffix rotation (12× → 4 license-compliant variants), pudding/RPT/Photo opener variation | composite 90 (L4) · `blocked: false` via hatch #4 `pattern_allow` (0 ban-list hits + diversity **0.653** ≥ 0.6) |

Re-verified locally at HEAD `96030a4` via `npx tsx scripts/audit/ai-detection-gate.ts {slug} --json`. Production CI workflow [`26143310631`](https://github.com/Takashi-Kiyohara/japan-pop-now/actions/runs/26143310631) confirms both PASS post-push.

**No `ai_audit_override`** field added to either article — manual-override hatch unused. Per memory `reference_ai_audit_override_format.md`, the override is reserved for the `human-verified-by-takapon-YYYY-MM-DD` case; not applicable here.

### P0-2 — `ranma` TL;DR ¥ range fabricated (`¥1,500-3,000`)

**Resolution: body-verbatim values.** Commit `42c1b21`.

Current TL;DR (line 49):

> 価格目安: 入場 ¥2,000-5,200 + 予算総額 ¥2,200-8,000 (前売 / 当日 / ボーナス券で価格差、本文 §基本情報 参照)

Body backing (verified by Code-side R-2):
- `## Before you go` table (line 67): "Budget | **2,200 yen to 8,000 yen** per person"
- `## The Two 2026 Events at a Glance` table (line 75): "Advance 2,000 yen / Bonus 5,000 yen / Day-of 2,200 yen or 5,200 yen"
- Line 108: "Day-of tickets are 2,200 yen general and 5,200 yen bonus"

All four TL;DR numeric anchors map to body cells. Caveat: TL;DR references `§基本情報` but the literal heading name is `## Before you go` — cosmetic anchor mismatch, numbers themselves are body-verbatim (R-2 graded PASS on numeric honesty, flagged the literal-anchor caveat).

### P0-3 — `blue-lock` line 51 firsthand fab "I can confirm"

**Resolution: advisory-tone rewrite.** Commit `9c7bcab`.

Before: `"After spending a full day running between all three, I can confirm they're worth the trip, but only if you plan your route right. Total damage: around 12,000 to 15,000 yen depending on how much merch you grab."`

After: `"The verified-route below confirms that covering all three in one day is feasible, but only with careful timing. Budget guide: around 12,000 to 15,000 yen depending on merch volume."`

Whole-file cross-scan via R-2 (broad signature list `I can confirm | I visited | after spending | I checked | I tasted | in my experience | I tried | I saw | I noticed | I confirmed | I personally | when I | my visit | my own`): **0 hits** in the live `.md`. One residual hit at `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated:118` ("I saw fans swapping duplicates") is in the `.deprecated` file (not loaded by the article registry); informational-only.

`voice: "advisory"` frontmatter intact (line 8).

---

## 2. CI status (PR #91, HEAD `96030a4`)

| Check | Status |
|---|:-:|
| AI-detection score gate | ✅ PASS (both R-1 P0 articles + the other 8 sprint1 slugs) |
| audit-gate (article-audit-gate) | ✅ PASS |
| Validate Articles | ✅ PASS |
| Image MDX refs check ×2 | ✅ PASS |
| image-quality | ✅ PASS |
| klook-compliance | ✅ PASS |
| MDX validate | ✅ PASS |
| Secret scan (gitleaks) | ✅ PASS |
| CodeQL static analysis + CodeQL | ✅ PASS |
| security-checks | ✅ PASS |
| seo-validation | ✅ PASS |
| Vercel preview + Vercel Preview Comments | ✅ PASS (preview Ready) |
| **build-and-lint (20.x)** | ❌ FAIL — **pre-existing on main** (5 `<a>` → `<Link>` errors in files NOT touched by PR #91) |
| **npm audit** | ❌ FAIL — **pre-existing on main** (transitive `protobufjs` CVE GHSA-xq3m-2v4x-88gg via `@xenova/transformers` devDep) |

The two FAILs are NOT sprint1 regressions. Cleanup PR [#96](https://github.com/Takashi-Kiyohara/japan-pop-now/pull/96) addresses both with local CI green + embedder smoke test PASS. On its merge to main, PR #91 clears via rebase.

---

## 3. Re-audit (Step 4 completion criterion)

Verified directly against `docs/audit/w5-bucket-result-20260519.json` (regenerated at audit recheck commit `864547c`, after R-1 P0 fixes):

| # | slug | bucket | passCount |
|---|---|---|:-:|
| 1 | demon-slayer-rerun-cafe-ufotable-kizuna-2026 | maintain | 7 |
| 2 | detective-conan-cafe-tokyo-osaka-3venue-2026 | maintain | 7 |
| 3 | golden-kamuy-golden-week-shinjuku-popup-2026 | maintain | 7 |
| 4 | world-trigger-festival-2026-tokyo-dome-city-cafe | maintain | 7 |
| 5 | blue-lock-tokyo-skytree-cafe-2026 | maintain | 7 |
| 6 | frieren-usj-story-walk-osaka-2026 | maintain | 7 |
| 7 | ranma-japan-2026-exhibition-tree-village-guide | maintain | 6 |
| 8 | animate-cafe-guide-japan | maintain | 6 |
| 9 | dark-moon-chara-cafe-ikebukuro-2026 | maintain | 7 |
| 10 | jujutsu-kaisen-cafes-japan-2026-guide | maintain | 7 |

**10/10 in `maintain` with passCount ≥ 6** (8 at 7, 2 at 6). Bucket totals: maintain 24 (+10 from baseline 14), fix 60, delete 4. PRESERVE 10/10 unchanged.

---

## 4. Number correction (acknowledged)

**Correct fix-bucket split: 21 press / 39 no press** (sums to 60 ✓).

Verified at HEAD `96030a4`:
```
node -e ' /* see below */ '
flat entries total: 88
  flat non-null: 39   flat null: 49
maintain 24 · fix 60 · delete 4
fix ∩ press URL non-null: 21
fix ∩ press URL null-or-missing-key: 39
```

The prior **31 / 29 figure was incorrect** — acknowledged here. Source of error not isolated in this session's artifacts (the figure does not appear in PR #91 body, R-1/R-2/R-3 records, or fix-evidence doc); likely from an earlier Cowork-facing communication. Going forward, the canonical number is **21 / 39** computed against `docs/audit/w5-press-sources-flat.json` + `docs/audit/w5-bucket-result-20260519.json`.

This re-bounds the ESC-2 deferral scope. Of the 60 fix-bucket articles, only the 21 with `officialPress` non-null can presently reach `maintain` via `scoreA(b)` after a content fix; the 39 without need either a press-URL backfill (Cowork policy round, candidate for the `scoreA(c)` branch under discussion) or a different fix path. Sprint 1 selected 10/21 from the press-available pool per the user's Option-1 decision.

---

## 5. Code-side audit chain — sprint 1

| Round | Source | Verdict | Artifact |
|---|---|:-:|---|
| R-1 | Cowork external | YELLOW · 3 P0 | (verdict text Cowork-owned; not materialized in repo) |
| R-1 fix-evidence | Code-side | (record) | [`docs/audit/r19-phase-c-sprint1-fixes-evidence-20260520.md`](r19-phase-c-sprint1-fixes-evidence-20260520.md) |
| R-2 | Code-side independent Agent (jpn-article-audit scope) | YELLOW · 16 collateral | [`docs/audit/r19-critic-round-2-20260520.md`](r19-critic-round-2-20260520.md) |
| R-2 repair | Code-side | (fixes) | commit `99e3337` (16 sites: 8 grammar + 1 source-citation + 7 grammar/proper-noun on 3venue) |
| R-3 | Code-side independent Agent | GREEN | [`docs/audit/r19-critic-round-3-20260520.md`](r19-critic-round-3-20260520.md) |
| R-3 residual | Code-side | (1-line fix) | commit `0fa67a4` (3venue:246 Image Credits placeholder restored) |

R-2 root-cause memory rule added: [`feedback_rotation_script_proper_noun_safety.md`](../../memory/feedback_rotation_script_proper_noun_safety.md) — variant lists must be honest paraphrases (no placeholders), slot-compatible (no double-"in"), and must skip citation/quoted-name spans. Sprint 2 apply scripts should pre-audit variant arrays against these rules before `--apply`.

---

## 6. What Cowork is asked to do

1. **External Critic R-2** — independent verify of the deployed-preview state of PR #91 (current Vercel preview URL: `japan-pop-now-git-s5-sprint1-w5-fix-takashi-kiyoharas-projects.vercel.app`). The Code-side R-2/R-3 chain above passed against the source tree; Cowork's R-2 closes the production-deployed verification per memory `feedback_independent_critic_required` (`never claim cycle/sprint/bucket completion without an external Agent-tool Critic verifying the deployed URL`).
2. **Merge cleanup PR [#96](https://github.com/Takashi-Kiyohara/japan-pop-now/pull/96)** — small CI-only PR; lint + protobufjs CVE; all checks green; required before PR #91 CI can clear.
3. **Decide on ESC-2 path** — given the corrected 21/39 split, the 39 press-less fix-bucket articles either need (a) a press-URL backfill push (Cowork policy round; some of the missing entries may have findable official-press URLs that were not in the initial sweep), or (b) a `scoreA(c)` branch to unlock `maintain` without `officialPress`. The 5 press-less articles in the original passCount-asc top-10 plus the redirect-stub `detective-conan-cafe-2026-japan-guide` (has `redirect_to`/`canonical` to 3venue) were deferred to this same ESC-2 decision.
4. **Sprint 2 selection** — the next 10 articles for the same retrofit pattern (`voice:advisory` + TL;DR + em-dash halving where applicable) should be drawn from the **remaining 11 press-available fix-bucket articles** (21 − 10 already done in sprint 1). After Cowork's R-2 + ESC-2 decision, sprint 2 can launch.

Until Cowork R-2 lands, PR #91 stays open with the Code-side chain at GREEN; sprint closure is conditional on R-2 verdict.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
