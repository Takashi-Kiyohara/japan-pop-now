---
sprint: R19-S3 (W5 audit framework)
date: 2026-05-19
baseline_sha: e3f2c99
status: escalated — requires Cowork/user policy decision before S4
---

# W5 S3 — Escalation Queue

Per Critic R-2 patch B (max 3 re-rounds, then escalate) +
`feedback_critic_finding_no_deferral` (resolve in-session OR escalate, never
silently defer; never fabricate a resolution). One item escalated.

## PRESERVE LIST overrides (informational — not blocking)

All 10 PRESERVE-LIST slugs were below the maintain bar on raw axis score
and were hard-overridden to `maintain` (working as designed — Critic R-2 B
exists precisely because axis False Negatives are expected on a small,
advisory-voice corpus). Full per-slug override history with original axis
buckets is in `docs/audit/w5-bucket-result-20260519.md` §"PRESERVE LIST".

## ESC-1 — scoreG / scoreA first-person signal conflicts with site editorial policy

**Severity**: blocks honest S4 interpretation (NOT a code bug — a
spec-vs-policy conflict requiring human decision).

**Finding (PDCA Round 1→3, all empirically grounded, idempotent run)**:
- Round 1: scoreA = 0% corpus-wide (incl. all 5 confirmed-firsthand
  calibration articles). Root cause: Draft 2 `isFirstParty` required
  filename prefix `IMG_|moe-shot|takashi-`; real owned photos are
  descriptively named. **Fixed in Round 2** (reality-grounded per CLAUDE.md
  image policy; monotonic null→true for local assets). A → 7.95%.
- Round 3: scoreA still fails 4/5 firsthand calibration articles and
  scoreG = 7.95% corpus-wide, because both gate on
  `countFirstHandParagraphs ≥ 1` (Draft 2: 「私が」/「I visited」/「I went」…).
  The site's editorial rule `feedback_no_first_person_fabrication`
  **mandates advisory voice** ("Visitors report" / "If you go" / "On
  paper / In practice") and forbids first-person "I visited" phrasing —
  even for genuinely-visited venues. So the corpus structurally cannot
  produce the signal scoreG/A require. `chiikawa-bakery-harajuku-guide-2026`,
  `luvlab-harajuku-diy-accessory-experience`,
  `dragon-ball-marugame-seimen-collab-2026`,
  `jojo-stone-ocean-cafe-jojo-world-2026` are confirmed firsthand yet
  score `firstHandPara=0` (firstPartyRatio=1, i.e. real photos present).

**Why not auto-resolved in-session**: redefining scoreG / the first-person
detector is a scoring-POLICY change. The SoT mandates "推測 ban"; inventing
a new author-binding heuristic to force the numbers would be exactly the
fabrication `feedback_no_first_person_fabrication` + the SoT forbid, and it
would silently drive S4 to noindex/delete ~70 articles on a policy artifact.

**Consequence if shipped unflagged**: maintain bar (≥6 PASS **AND A∧F∧G
mandatory**) is near-unreachable on merit because G (and A's firstHandPara
component) are editorially suppressed → fix=70 / delete=5 / maintain=13
(9 of 13 maintain are PRESERVE overrides). S4 acting on this verbatim would
noindex-quarantine ~70 articles on the basis of a missing first-person
voice the site is *required* not to fabricate.

**Decision needed from Cowork/user (one of)**:
1. **Redefine axis G** for an advisory-voice site (e.g. author-binding via
   AuthorBox + dated freshness + venue-specific verifiable detail, NOT
   first-person), then re-run S3. (Recommended — aligns the framework with
   the site's own anti-fabrication policy.)
2. Keep G as-is but **drop G from the maintain mandatory set** (≥6 PASS +
   A∧F only), accepting first-person is N/A here.
3. Accept verbatim: ~70 articles → fix(noindex-quarantine). High-risk;
   contradicts `feedback_no_first_person_fabrication` indirectly.

S3 ships the framework + result + this escalation. **S4 must NOT execute
the delete/fix routing until ESC-1 is decided** — the bucket result is
valid as data; its maintain/fix interpretation is gated on this decision.

## Non-blocking notes (Critic-rule, not escalation)

- `competitor_top10 = 0`: no SERP API key in this environment, so 50
  press-less articles → `manual_SME_flag` (pass:null) per Draft 2 P-1
  designed degradation. Honest, expected; not an anomaly. press=38 +
  competitor=0 + manual_SME=50 = 88 (coverage total reconciles).
- GPTZero: `GPTZERO_API_KEY` absent → scoreE composite-only
  (`composite_regex_only`), the spec-sanctioned fallback. ESL-FP risk
  accepted per Draft 3 P-4 fallback clause.
- D = 100%: R11 inventory + Takashi library deferred to S6 (null-safe
  `.catch(()=>[])`); every venue article hits the weak-tier catch-all.
  Expected per spec; D is non-discriminating until S6 supplies inventory.
