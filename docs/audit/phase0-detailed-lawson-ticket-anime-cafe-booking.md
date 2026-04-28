# Phase 0 Detailed Eval: lawson-ticket-anime-cafe-booking
Date: 2026-04-28
Evaluator: Claude Opus (D2 batch 4)
Article reference: content/articles/lawson-ticket-anime-cafe-booking.md

## Phase 0 Questions
| # | Question | Score | Note |
| - | -------- | :---: | ---- |
| Q1 | Audience fit (international anime/pop traveler, Japan trip in 12mo) | YES | This is a textbook Q1-pass article. The Loppi/Lawson Ticket booking wall is the single biggest friction point for foreign anime cafe visitors. Article delivers concrete 6-step flow, phone-number workaround (Mobal SIM, hotel concierge, Japanese friend, eplus alternative), and the exact Japanese button labels (Lコードで探す, 二次元バーコード). Saves real friction, fills a knowledge gap. |
| Q2 | Search intent fit (demand exists; English competitors weak) | YES | "How to book anime cafe Japan" / "Loppi machine English" / "l-tike English" / "Lawson Ticket foreigner" — clear demand. English competitors are scattered Reddit threads or single-cafe walkthroughs. No comprehensive English Lawson Ticket how-to ranks well. |
| Q3 | Source viability (hard facts traceable to official site/X/press now) | YES | l-tike.com is canonical official source. Lawson stores ~14,000 figure traceable. Bank of Japan 40% cash usage cite (line 208). Pricing ranges cited (¥500-2,000) reflect typical anime cafe ticket fees. All hard facts traceable. |
| Q4 | Differentiation (something the top 3 EN competitors don't offer) | YES | Three differentiation hits: (a) Comparative — Lawson vs eplus vs Ticket Pia matrix; (b) Insider mechanic — phone number wall workarounds (Mobal SMS-capable SIM, hotel concierge, friend-booking with code-only access); (c) Stack-level — combines online flow + Loppi flow + cashier flow + mistake-avoidance into one guide. JSON-LD HowTo + FAQPage schemas embedded. |
| Q5 | Sustainability (will have value 90 days from now) | YES | Evergreen by definition. Lawson Ticket is a permanent platform; the workflow is stable across years. Annual refresh for any UI change is cheap. This is the kind of article that compounds traffic over years. |

## Hard-reject criteria
| # | Criterion | Triggered? | Note |
| - | --------- | :--------: | ---- |
| R1 | Cannibalization (>60% topic overlap with another article) | NO | Distinct from `how-to-book-anime-collab-cafe-japan` (which is the platform-overview hub) — this is the Lawson-specific deep dive. Sibling article relationship, not cannibalization. |
| R2 | Silo violation (not in 5 silos) | NO | Category: experiences. Valid silo. Practical travel-tips-style article correctly placed in experiences post-2026-04-19 migration. |
| R3 | Source ban hit (Unsplash/Getty/IP key visual without permission/generation) | NO | Hero is Japan Pop Now editorial Loppi placeholder (line 30). Body images: Lawson exterior (DXR / Wikimedia CC BY-SA 4.0, line 72), Loppi kiosk (Wikimedia CC BY-SA 3.0, line 127), QR scan (Wikimedia CC BY-SA 4.0, line 155), Loppi 2019 (Rebirth10 CC BY-SA 4.0, line 211). Image Credits section properly attributes (lines 263-267). Compliant. |
| R4 | No first-hand path (writer hasn't been + no insider research path) | NO | Writer claims booking 3 different anime cafes via Lawson in last 6 months (line 33: "JJK at Sweets Paradise, Demon Slayer ufotable, Spy×Family"). First-hand E-E-A-T signal is concrete. |

## Verdict
PROCEED (100)

## Recommendation
- PROCEED. This is one of the highest-quality Phase 0 articles in the corpus. Tightening recs:
  - Excellent JSON-LD schema embedding (FAQPage + HowTo) — ensure faqSchema and howToSchema exports are actually consumed by a wrapper component.
  - Image strict universal rule: 4 images, all CC-licensed Wikimedia or editorial. Topic axis is reasonable (Lawson exteriors + Loppi + QR scan), real-photo axis PASS, count axis adequate. Could strengthen with a Takapon-shot in-store Loppi photo at next refresh.
  - Internal links well-distributed (5 cross-references). `relatedSlugs` populated with 5 valid slugs.
  - Keep this article as anchor for any future Lawson UI changes (annual refresh).
