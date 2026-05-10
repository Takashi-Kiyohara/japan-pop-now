# R10 fix doc — K-source bucket (R10-46/47)

**Bucket id:** K-source
**Target items:** R10-46, R10-47 (P0)
**Source-of-truth critic:** agentId `a55d910f0b611b1b3` (Phase 0 enumeration)
**Fix completed:** 2026-05-10 (via 4 commits)

## Before state (R10 critic evidence)

- `app/page.tsx:273, 282` — `'aff_id=' + (process.env.NEXT_PUBLIC_KLOOK_AFF_ID || '')` (env var unset → emits `aff_id=&utm_source=...`)
- `app/category/[slug]/page.tsx:31, 43, 55` — same pattern (3 instances)
- `app/guides/[topic]/page.tsx:146-305` — `aff_id=${baseClookId}` template literal (12 instances)
- `lib/affiliate-map.ts:27` — `aff_id=${KLOOK_AFF_ID}` helper (1 instance, used by ArticleBody.tsx)

**Critic verdict (R10-46):** "every CTA from app pages → klook is non-compliant; env var unset → empty value emitted"
**Critic verdict (R10-47):** live HTML on `https://www.japan-pop-now.com/articles/akihabara-arcade-rhythm-games-guide-2026` confirmed `<a href="https://www.klook.com/en-US/activity/109393-japan-esim…?aff_id=&utm_source=…"` — empty aff_id in production

## Fix

| Commit | File | Change |
|---|---|---|
| `5376243` | `lib/affiliate-map.ts` | KLOOK_AFF_ID literal `'1251547'` (was env var); param `aff_adid=` (was `aff_id=`) |
| `2f20417` | `app/page.tsx` | 2 inline href: `aff_adid=1251547` literal |
| `7ea2f7b` | `app/category/[slug]/page.tsx` | 3 inline href: `aff_adid=1251547` literal |
| `1990601` | `app/guides/[topic]/page.tsx` | baseClookId hardcoded `1251547`; 12 template-literal CTAs use `aff_adid=` |

## After state (deployed URL verify)

- `grep -rn "aff_id=" app/ components/ lib/` (excluding comment blocks): **0 matches**
- Live verify of `https://www.japan-pop-now.com/articles/akihabara-arcade-rhythm-games-guide-2026` (Googlebot UA, post-deploy): no `aff_id=&` empty parameter; programmatic CTAs ship `aff_adid=1251547`

## RULE compliance

- RULE H: 1 source-file = 1 commit (4 commits for 4 files; not bundled)
- RULE I: `aff_adid=[0-9]+` is the standard; `aff_id=` short form treated as non-compliant
- RULE E: evidence cites real source-file paths + real deployed URLs, not tmp/ scratchpad

## Linked items

- R10-43/44/45/48 (article-level klook) — see `fix-K-articles-20260510.md`
- R10-52 (audit script regex widen) — see `fix-K-audit-widen-20260510.md`
