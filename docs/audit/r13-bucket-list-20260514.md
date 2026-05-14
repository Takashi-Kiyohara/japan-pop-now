# R13 Bucket List — 24 root cause systematic fix sprint

**Date:** 2026-05-14
**Sprint:** R13 MASTER FIX (post R12-P0 middleware-bot-whitelist resolution)
**Branch:** main
**Starting HEAD:** `d488e81` (R12-P0 critic GREEN)
**Spec scope:** 24 root cause × estimated 3-5 commits each = ~70-100 commits target
**Inherited rules:** R10 NO-SHORTCUT RULE A-J + R13 RULE K-P (commit-floor + word-ban + Cowork-gate)
**Active memory baseline:** 12 memories present in user's auto-memory; 15+ memories named in R13 spec ★ list don't exist (per `feedback_master_sprint_pattern`: work from current codebase only, hybrid mode user-approved in prior session)

## R12-P0 inheritance

`project_middleware_bot_whitelist_r12_p0.md` is the canonical record of the middleware bot-whitelist fix that closed the 11-cycle indexation-failure blackhole at commit `358f0dc`. Layer 11 ("bot-crawlability") added to the integrity checklist; R13 critic rounds must include the AdsBot-Google / Mediapartners-Google / Google-InspectionTool live curl tests.

## 24 root cause × 8 bucket map

### Bucket A — Asset 404 (P0, 30 min estimated, 3 commits)
| # | item | commit count | notes |
|---|---|---|---|
| A1 | `/public/logo.png` 60-600px | 1 | brand-consistent SVG/PNG; Organization.logo + publisher.logo references |
| A2 | favicon.ico + 5 PNG variants | 1 | from logo.png via Pillow/sharp |
| A3 | manifest icons + 2 screenshots | 1 | 6 icons + 540/1280 screenshots |

### Bucket B — Headers / middleware (P0, 30 min, 3 commits)
| # | item | commit count |
|---|---|---|
| B1 | `Vary: User-Agent` in next.config.ts headers() | 1 |
| B2 | `Content-Language: en` | batch with B1 |
| B3 | google-site-verification meta tag in app/layout.tsx | 1 |

### Bucket C — Sitemap (P1, 45 min, 2-3 commits)
| # | item | commit count |
|---|---|---|
| C1 | `export const revalidate = 3600` in app/sitemap.ts | 1 |
| C2 | `/articles` hub + cafe individual slugs added | 1 |
| C3 | 6 cannibalization slug production exclusion verify | 0-1 (revalidate-only if already excluded) |

### Bucket D — Schema (P1, 1h, 4-5 commits)
| # | item | commit count |
|---|---|---|
| D1 | NewsArticle conditional (cafes/experiences with validUntil) vs BlogPosting | 1 |
| D2 | nested `@context` removal in getAuthorSchema | 1 |
| D3 | Twitter `@japanpopnow` → `@pop_now_jp` | 1 |
| D4 | og:authors fallback Takapon unify | 1 |
| D5 | Person.sameAs evaluate (LinkedIn etc) or skip + manual task | 0-1 |

### Bucket E — Redirect arch + canonical (P1, 45 min, 3 commits)
| # | item | commit count |
|---|---|---|
| E1 | `/:year/:month/:day/:slug` existence guard via middleware | 1 |
| E2 | frontmatter `canonical:` field read in lib/articles.ts | 1 |
| E3 | hreflang redundancy resolve (`en` + `x-default`) | 1 |

### Bucket F — External citations + rehype plugin (P0 ★ biggest E-E-A-T leverage, 2-3h, ~20-30 commits)
| # | item | commit count |
|---|---|---|
| F1 | `rehype-external-links` plugin install + wire | 1 |
| F2 | 86 article × 3-5 external citation pass (batch ≤10) | ~9-15 |
| F3 | Internal anchor text diversification (batch ≤10) | ~9-15 |

### Bucket G — Content quality (P1, 1.5-2h, ~12-15 commits)
| # | item | commit count |
|---|---|---|
| G1 | DBZ first-person strip | 1 |
| G2 | 5 mojibake articles fix | 5 (1 per article) |
| G3 | em-dash density ≤4/k corpus-wide (batch ≤10) | ~8-9 |

### Bucket H — Boilerplate component-ize (P1, 45 min, ~3-4 commits)
| # | item | commit count |
|---|---|---|
| H1 | AffiliateDisclosure component + 30 article MDX strip | 2 (component + sed strip) |
| H2 | Threads CTA component | 1 |
| H3 | "Pro tip/Heads up" template variation | 1 batch |

## PDCA + Critic stages (post-bucket execution)

| Stage | Type | Doc |
|---|---|---|
| PDCA R1 internal | Code self-verify | (inline updates to bucket fix docs) |
| Critic R1 | external Task subagent | `r13-critic-round-1-20260514.md` |
| PDCA R2 + Critic R2 | external + RED fix | `r13-critic-round-2-20260514.md` |
| Critic R3 final | external + Section 5 | `r13-critic-round-3-final-20260514.md` |
| Cowork handoff | Code output for Cowork | `r13-handoff-to-cowork-20260514.md` |

## Commit count target

Aggregate: ~70-100 commits across 8 buckets + 4 critic rounds. RULE K floor: <40 commits = crisis doc.

## RULE compliance plan

| RULE | Mechanism |
|---|---|
| A | this doc generated pre-Bucket-A |
| B | per-bucket fix doc generated per bucket |
| C | 3 external Critic rounds via Task subagent, agentIds in frontmatter |
| D | AskUserQuestion for any defer |
| E | evidence cites real fetched URLs only; no `tmp/` |
| F | no memory creation without AskUserQuestion |
| G | timeline JSON + bucket duration tracked |
| H | 1 article 1 commit; F2/G3 batches ≤10 |
| I | klook compliance regression-monitored |
| J | 11-layer checklist (with Layer 11 bot-crawlability) |
| K | <40 commits = crisis doc |
| L | no banned-vocabulary phrases ("convergent" / "省エネ" etc.) |
| M | regression check against R5-R12 fixes |
| N | Cowork external verify gate (handoff doc) |
| O | 24 root cause × PASS/FAIL matrix in handoff |
| P | AskUserQuestion for defer / scope change / new memory / 7h-50% / regression / Layer 11 hit |

## Active memory references (12 exist in user's memory dir)

- feedback_master_sprint_pattern — "realistic 1-3h" vs spec ask; affects pacing
- feedback_full_corpus_audit_required — 10-axis audit before AdSense claim (now 11-axis post-R12)
- feedback_layer2_audit_required — 3-layer (content/structural/privacy) for AdSense
- feedback_nextjs_redirects_case_insensitive — affects Bucket E redirect work
- feedback_v3_workflow_adoption — verify-asserted-infrastructure-first
- feedback_tone / feedback_category_silos / feedback_sns_policy / feedback_destructive_ops
- project_klook_source_fix_r10 — Bucket I (klook) regression baseline
- project_r10_no_shortcut_20260510 — sprint discipline baseline
- project_middleware_bot_whitelist_r12_p0 — Layer 11 + Bucket B regression baseline

## Memory files asserted in R13 spec ★ list but NOT present

(documented honestly per `feedback_master_sprint_pattern`)
- overclaim_treadmill_pattern, in_session_critic_not_external, finish_no_deferral
- critic_full_layer_checklist, audit_layer_completeness, session_doc_json_reconcile
- url_http_verify_before_handoff, critic_routing_layer, wildcard_redirect_ban
- url_slug_verify, image_claim_verify_strict, takapon_pseudonym, no_first_person_fabrication
- threads_not_instagram, bare_klook_url_ban

Working from current codebase + 12 existing memories only.

## Launch sequence

1. Bucket A (assets) — generate via Pillow Python script
2. Bucket B (headers)
3. Bucket C (sitemap)
4. Bucket D (schema)
5. Bucket E (redirects)
6. Bucket F (citations) — biggest scope
7. Bucket G (content quality)
8. Bucket H (boilerplate)
9. Internal PDCA Round 1
10. External Critic R1 / R2 / R3
11. Cowork handoff

Start: 2026-05-14 (this session)
