# R19 chain — autonomous run final aggregate (REVISED, 2026-05-21)

Supersedes `r19-chain-autonomous-final-aggregate-20260521.md`, which Cowork R-1 correctly flagged: its "projected maintain 71" was a projection, not a live value. Live main at that point was 43. This revision reports **only live `node w5-content-triage.mjs` JSON values**.

## Stop trigger

**SOFT — live triage maintain = 70** on branch `chore/esc-3-ab-impl` HEAD `2aab5d3`.
Caveat: the soft-stop spec says "actual MAIN bucket recompute ≥ 70". main HEAD `5471774` still triages to 43 — the `scoreA(c)/(d)` engine change is on the branch, not merged. The threshold is met **conditional on PR #105 merging**. Code-side work is complete; merge is a user action.

Run note: this leg ran past the nominal 08:00 JST hard deadline (started ~09:21 JST after the Cowork R-1 correction arrived). Continued under the user's explicit "chain 継続" instruction.

## What went wrong in the first aggregate (root cause)

My ESC-2 `scoreA(c)` implementation (commit `bd7aeb1`) was authored on the `s5-sprint1-w5-fix` branch. When PR #91 was **squash-merged**, the squash kept the 10 article changes but the audit-engine change to `scripts/audit/w5-content-triage.mjs` did not survive into the squashed commit on main. Result:

- main's `scoreA` had only (a) firsthand + (b) advisory+press.
- All 47 sprint-1-to-5 articles received `voice:"advisory"` frontmatter expecting `scoreA(c)` to count them — but (c) did not exist on main.
- Press-less articles kept failing axis A → stayed in fix bucket.
- My "projection 71" arithmetic assumed (c) was live. It was not. **Live main = 43.**

This is the exact failure mode memory `feedback_session_doc_json_reconcile` exists to prevent: a claimed number that the JSON SoT does not support.

## Live triage trajectory (every figure is a real triage run)

| State | maintain | fix | delete | source |
|---|---:|---:|---:|---|
| main `5471774` pre-fix | 43 | 41 | 4 | triage on main |
| + `scoreA(c)+(d)` re-add | 61 | 23 | 4 | triage on branch |
| + sprint 6 (3 articles) | 64 | 20 | 4 | triage on branch |
| + sprint 7 (6 articles) | **70** | 14 | 4 | triage on branch `2aab5d3` |

Axis% at HEAD `2aab5d3`: A 72.7, B 43.2, C 95.5, D 100, E 79.5, F 80.7, G 75.0.

## ESC-3 implementation status

### (b) scoreA(c) + scoreA(d) + scoreG(c) + scoreG(d) — DONE

- `scoreA(c)`: advisory + AuthorBox + Wikimedia ≤ 0.3 + IG ≥ 3 (re-added; was lost in PR #91 squash).
- `scoreA(d)`: (c) + wordCount ≥ 1500 (ESC-3 firsthand_optional tag, per user spec — strict superset of (c), audit-trail branch).
- `scoreG(c)` / `scoreG(d)`: parallel structure.
- Main-loop reorder: scoreC computed before scoreA + scoreG.
- Net effect: +18 maintain (43 → 61).

### (a) PRESS_MAP backfill — NOT DONE

Sub-agent dispatched to WebSearch + WebFetch-verify press URLs for ~49 fix-bucket slugs crashed mid-run (API socket error after 154 tool uses, ~11.7 min). **Zero output files written.** Not incorporated.

The 70 threshold was reached **without** (a). (a) remains available as a future margin-add and as the proper fix for the 14 remaining fix-bucket articles. It should be re-attempted in a fresh session with the WebFetch-200-verify discipline (memory `feedback_websearch_contact_hallucination`) — do NOT trust the crashed run's partial state (there is none).

## Sprint chain summary

| Sprint | PR | Articles | Status |
|---|---|---:|---|
| 1 | #91 | 10 | merged |
| 2 | #101 | 10 | merged |
| 3 | #102 | 10 | merged |
| 4 | #103 | 10 | merged |
| 5 | #104 | 7 | merged |
| ESC-2/3 (b) + sprint 6 + sprint 7 | **#105** | 9 (3+6) + engine | **OPEN — merge unblocks main=70** |

## Remaining fix bucket (14 articles, on branch)

Post-(c)/(d) + sprints 6-7, 14 articles remain in fix. Most fail axis A because they are press-less AND have IG < 3 (so (c)/(d) cannot fire) OR lack `voice:advisory`. They need either:
- ESC-3 (a) press-URL backfill → scoreA(b), or
- IG augmentation to reach IG ≥ 3 → scoreA(c), or
- `voice:advisory` frontmatter where still missing.

Notable: 4 are R17-noindexed (`tokyo-anime-district-guide`, `shibuya-harajuku-pop-culture-guide`, `naruto-tokyo-pilgrimage-2026`, `ikebukuro-anime-guide-2026`) — deferred per R17 closure. 1 is the redirect-stub `detective-conan-cafe-2026-japan-guide`.

## Cowork external Critic queue

| PR | Critic action |
|---|---|
| #105 | R-1 against deploy-preview — verify the live triage 70 reproduces, verify scoreA(c)/(d) logic, verify sprint 6+7 TL;DR body-verbatim ¥ |
| #101–#104 | R-1 (if not already run) — these merged but Cowork R-1 verdicts may still be owed |

Per memory `feedback_independent_critic_required`: maintain=70 is a Code-side triage result. AdSense-reapply-gate "ready" is not final until Cowork external R-1 verifies on the deployed site.

## Next-run starting point

```
main HEAD:                        5471774
main live maintain:               43  (scoreA(c)/(d) not yet merged)
branch chore/esc-3-ab-impl HEAD:  2aab5d3
branch live maintain:             70  (PR #105)
on PR #105 merge → main maintain: 70  →  AdSense reapply gate READY
remaining fix bucket:             14  (4 R17-noindex + 1 redirect-stub + 9 needing (a) or IG work)
ESC-3 (a) PRESS_MAP backfill:     NOT DONE — re-attempt in fresh session
```

## Discipline check

- 禁止 phrase (省エネ / convergent / good enough / honest scope downgrade / "External Critic GREEN"): **0 hits** in this document.
- `feedback_session_doc_json_reconcile`: every count here is a live triage JSON value; "projection" is never reported as live.
- `feedback_critic_finding_no_deferral`: the Cowork R-1 finding (fabricated soft stop) is resolved in-chain — the 70 is now real and triage-verified, and the root cause (squash-dropped commit) is identified + fixed in PR #105.
- `feedback_handoff_doc_skepticism`: the 70 is backed by the actual triage stdout (`[triage] 88 articles → maintain=70 fix=14 delete=4`), not a self-claim.
- `feedback_independent_critic_required`: this aggregate does NOT claim external verification; Cowork R-1 on PR #105 is the closure gate.

🤖 Generated with [Claude Code](https://claude.com/claude-code) (autonomous run 2026-05-21, revised post-Cowork-R-1)
