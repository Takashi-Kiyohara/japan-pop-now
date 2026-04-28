# Phase 0 Detailed Eval: book-japan-anime-events-overseas-2026
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 2)
Article reference: content/articles/book-japan-anime-events-overseas-2026.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | Solves the most acute friction point overseas anime fans face: Japan booking systems requiring JP phone/credit card. Three-tier difficulty table (lines 39-46), platform-by-platform walkthrough (TableCheck, Lawson Ticket, LivePocket), proxy-service comparison — every section is trip-actionable. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "How to book Japan event from overseas" — clear demand, near-zero quality EN coverage. Most EN content stops at "use Klook." This article fills the medium-difficulty gap (Lawson Ticket, LivePocket nuances, proxy services). |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | NO | Specific claims like "anime pilgrimage tourism grew from 4.6% to 8.5%… Japan Tourism Agency data" (line 48) are stated without anchor link. ShingoTravel partner reference (line 22, 117) has `[ShingoTravel](#)` — a broken anchor (line 117), not a real URL. Klook redirect URL is concrete. Pricing for proxy services (¥1,500-5,000) is unsourced. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Differentiation hits: (a) explicit booking-difficulty tier table that maps event-type → platform → required-credentials (lines 39-46), (b) proxy-service comparison with named partner ShingoTravel (lines 90-117), (c) US-issued vs UK-issued Visa/Mastercard success-rate notes (lines 58, 83) — the kind of insider detail no platform-owned content can publish. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Booking platform mechanics (TableCheck, LivePocket, Loppi) change slowly. Specific prices on proxy services (¥1,500-3,000 range) are stable. The framework holds for 12+ months with annual refresh. ShingoTravel partnership is the volatile element but contained. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | `how-to-book-anime-collab-cafe-japan` is collab-cafe-specific reservation flow; this article is broader cross-platform-and-proxy. No overlap >60%. Linked appropriately (line 76). |
| R2 | Silo violation (not in 5 silos) | NO | `category: "experiences"` (line 6). Valid. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero image at `/images/articles/book-japan-anime-events-overseas-2026/featured.jpg` is Narita arrival gate stock — assumed Takapon original or licensed. No external URLs in image src. No IP key visuals reproduced. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | "I've tested every major platform from outside Japan" (line 11), specific card-success-rate observations (US Visa rejection, UK Mastercard success at line 58) — first-hand testing is structurally claimed and would be hard to fabricate. Path: viable. |

## Verdict
REJECT (0) — Q3 fail (sources + broken ShingoTravel anchor)

## Recommendation
- REJECT, but rewrite-recoverable. Two fixes:
  1. **Q3 fix**: Add inline link to JTA (Japan Tourism Agency) source for the 4.6%→8.5% pilgrimage tourism stat. Replace `[ShingoTravel](#)` (line 117) with the actual ShingoTravel URL or remove. Add inline links to TableCheck.com docs, l-tike.com booking guide, LivePocket help — these are official sources for the platforms named.
  2. Verify ShingoTravel partner setup is real (the [#] anchor suggests placeholder content). If partnership is not yet contractually live, pull the partner section entirely until it is.
- After fixes, re-run Phase 0 — should flip to PROCEED on Q3.
- This is one of the corpus's strongest "fill-the-knowledge-gap" articles when sources are added. High-leverage fix.
