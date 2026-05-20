# R19 Phase C Sprint 1 — Independent Critic Round 2 (2026-05-20)

# VERDICT: YELLOW

Range audited: `s5-sprint1-w5-fix` branch, HEAD = `864547c6501edaeb5e86a4b40e26654944a6fd8e`
Working tree: `C:\Users\user\japan-pop-now`
Commits under verification (R-1 P0 fixes): `482ee92`, `801c7be`, `9c7bcab`, `42c1b21`
Scope: 10 articles in `content/articles/` (post-sprint1 state)

This Round 2 follows Cowork external Critic R-1 (YELLOW, 3 P0 items). All three P0 fixes were applied + pushed. Claims 1, 2, 3, 5, 6, 7, 8, 9 PASS. **Claim 4 (JJK substantive rotation) PASSES the diversification headcount but introduces material prose-quality regressions and one source-citation integrity issue. Claim 5 (3venue substantive rotation) shows the same regression pattern.** Net verdict: YELLOW — the gate-pass is real, but the rewrite mechanism degraded reader-facing prose.

---

## Claim 1 — `voice: "advisory"` frontmatter present (10/10) — PASS

Grep `^voice:` across all 10 target slugs:

| Slug | Line | Value |
|---|---|---|
| dark-moon-chara-cafe-ikebukuro-2026.mdx | 8 | "advisory" |
| detective-conan-cafe-tokyo-osaka-3venue-2026.mdx | 9 | "advisory" |
| blue-lock-tokyo-skytree-cafe-2026.md | 8 | "advisory" |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026.mdx | 9 | "advisory" |
| animate-cafe-guide-japan.md | 13 | "advisory" |
| golden-kamuy-golden-week-shinjuku-popup-2026.mdx | 30 | "advisory" |
| jujutsu-kaisen-cafes-japan-2026-guide.md | 15 | "advisory" |
| frieren-usj-story-walk-osaka-2026.mdx | 26 | "advisory" |
| ranma-japan-2026-exhibition-tree-village-guide.mdx | 32 | "advisory" |
| world-trigger-festival-2026-tokyo-dome-city-cafe.mdx | 28 | "advisory" |

10/10 frontmatters carry `voice: "advisory"`. The `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated` shadow file still carries `voice: "friend-guide"`; harmless because the deprecated extension excludes it from the article loader, but flagged. **PASS**.

---

## Claim 2 — `## TL;DR` present with access/hours/price (10/10) — PASS

Each of the 10 articles has a `## TL;DR` H2 (lines 22, 44, 52, 50, 54, 44, 46, 22, 47, 44) carrying explicit access + hours + price-band info in Japlish hybrid. Sample (animate):

> アクセス: Ikebukuro Station / Akihabara Station 直結。営業時間: venue ごと異なる (典型 11:00-22:00 範囲、公式リリース参照)。価格目安: drink ¥500-700 / bonus card ¥600 / 食事 ¥1,000-1,800 (公式メニュー基準)。

All 10 TL;DRs follow the same pattern (アクセス / 営業時間 / 価格目安 / 予約). **PASS**.

---

## Claim 3 — No first-person firsthand-fab phrases — PASS

Grep across all 10 files for: `I can confirm|I visited|after spending a full day|I checked|I tasted|in my experience|I tried|I saw|I noticed|I found that|I personally|I would recommend|when I went|when I was there|I spent|I confirmed`. Plus secondary scan: `\bI [a-z]+ ed\b|\bI'(ve|ll|m|d)\b|\bmy visit\b|\bmy own\b|\bfor me\b|\bwhen I\b`.

- 0 matches in the 10 live articles.
- 1 match in `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated:118` ("I saw fans swapping duplicates") — file is `.deprecated`, not loaded by the article registry, **not a live regression**.

Specifically verified clean: the previously-flagged blue-lock line 51 (P0-3 target) reads `"The verified-route below confirms that covering all three in one day is feasible..."` — advisory tone, no `I can confirm` or `after spending a full day`. **PASS**.

---

## Claim 4-JJK — JJK substantive rotation per 482ee92 — PARTIAL PASS / regression flagged

Diversification headcount PASSES:
- `"Jujutsu Kaisen 5th Anniversary Cafe"` literal mention: 12 → **4** (target was rotation, achieved). 
- Sweets Paradise app mention rotation: applied (4 mentions varied).
- City-list paraphrased: applied.

But the **rewrite mechanism introduced 6+ prose regressions**:

| Line | Defect | Type |
|---|---|---|
| `jjk:51` | Table cell "Event \| the 5th Anniversary cafe at Sweets Paradise 2026" — lowercase article-start fragment | Grammar |
| `jjk:55` | "A second wave in **across the seven-city tour (Yokohama through Fukuoka), and Fukuoka** runs from..." — broken double-Fukuoka + "in across the" | Grammar (severe) |
| `jjk:68` | Alt text: "for the this anniversary cafe collab 2026" — broken "the this" | Alt text quality |
| `jjk:107` | Table cell "Booking method \| the official booking app only" — lowercase article-start fragment | Grammar |
| `jjk:191` (FAQ H3) | "When does the the 5th Anniversary cafe start?" — double "the" | Grammar |
| `jjk:198` | "Current coverage runs in **Tokyo, Osaka, Hiroshima, in the second-wave cities (Yokohama–Kyoto), and Fukuoka**" — list grammar broken (extra "in") | Grammar |
| `jjk:213` (Sources) | "Essential Japan, "this anniversary cafe collab at Sweets Paradise 2026"" — the **citation title was edited** to escape the AI gate; the cited source's real title contains "Jujutsu Kaisen 5th Anniversary Cafe" | Source integrity |

The Source-1 title edit is the most serious — it falsifies what the source actually says in order to dodge a phrase-frequency gate. Per `.claude/skills/jpn-article-audit/SKILL.md` Section 2 ("never trust aggregator sites… official only"), citation strings are reader-facing source-truth claims and must match the cited page's real title. **FAIL on prose quality + 1 source-integrity issue, PASS on diversification headcount.**

---

## Claim 5-3venue — "handle the Japanese booking flow" per 801c7be — PASS (with collateral damage)

Target line found at `detective-conan-cafe-tokyo-osaka-3venue-2026.mdx:167`:
> Cannot handle the Japanese booking flow? The nuclear option is to have your hotel concierge book on your behalf…

Direct replacement of "navigate the booking flow" → "handle the Japanese booking flow". The exact P0-1 fix is in place. **PASS for the targeted phrase.**

However, the same commit applied broader prose surgery to the 3venue article (rotation/diversity work), introducing the same class of regression as JJK:

| Line | Defect |
|---|---|
| `3venue:56` | `The "the RPT cafe theme" collab runs at 8 venues…` — "RPT" abbreviation introduced with no definitional anchor + article duplication ("The the RPT…" pattern when read with leading article) |
| `3venue:59` | `the 2026 edition is themed "the 2026 themed run" (港町レトロ)` — replaced the real theme name "Retro Port Town" inside the quoted-name slot with the placeholder paraphrase "the 2026 themed run". The real official theme name is `港町レトロ` → "Retro Port Town"; inserting "the 2026 themed run" misrepresents the brand-side theme label |
| `3venue:131` | Menu entry **"Angel this dessert plate:** 1,590 yen" — was "Angel Pudding à la Mode" before; menu item name has been broken |
| `3venue:134` | Caption: "the showa-era yoshoku tradition the the RPT cafe theme cafe menu draws from" — double "the" + uncoordinated nesting |
| `3venue:139` (alt text) | "the Angel Pudding, the retro yoshoku dessert behind the Angel Pudding à la Mode" — alt text fragment |

Lines 59 and 131 are the most concerning: the **official Japanese theme name and one official menu-item name were rewritten into vague placeholders inside quoted-name slots**, which is closer to fact-rewriting than to prose rotation. Per audit skill Section 2 ("Specific menu item name + price + size → must match official menu PDF / image"), `Angel Pudding à la Mode` is a hard-fact menu item; changing the displayed name string for rotation purposes is a soft-data fabrication risk.

**Targeted P0-1 phrase fix PASS; collateral rotation regressions flagged.**

---

## Claim 6-blue-lock — line 51 firsthand → advisory per 9c7bcab — PASS

Diff at `blue-lock-tokyo-skytree-cafe-2026.md:51`:
- Before: `After spending a full day running between all three, I can confirm they're worth the trip, but only if you plan your route right. Total damage: around 12,000 to 15,000 yen depending on how much merch you grab.`
- After: `The verified-route below confirms that covering all three in one day is feasible, but only with careful timing. Budget guide: around 12,000 to 15,000 yen depending on merch volume.`

Whole-file cross-check: grepped all firsthand-fab signatures (I can confirm / I visited / after spending / I checked / I tasted / in my experience / I tried / I saw / I noticed / I confirmed / I personally / when I / my visit / my own) — **0 hits in the live `.md`**. The single hit at `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated:118` ("I saw fans swapping duplicates") is in the deprecated file and not loaded.

One residual firsthand-style line on `:125` was already softened in an earlier sprint commit ("Trading happens informally near the exit — Visitor reports describe fans swapping duplicates…"), so the advisory voice holds. **PASS**.

---

## Claim 7-ranma — TL;DR ¥ values match body §基本情報 per 42c1b21 — PASS (with literal-anchor caveat)

TL;DR (line 49) post-fix:
> 価格目安: 入場 ¥2,000-5,200 + 予算総額 ¥2,200-8,000 (前売 / 当日 / ボーナス券で価格差、本文 §基本情報 参照)

Body support:
- Line 67 (`## Before you go` table): "Budget | **2,200 yen to 8,000 yen** per person (exhibition ticket 2,000 yen or 5,000 yen + Tree Village cafe order + 1 or 2 merch items)" — supplies the ¥2,200-8,000.
- Line 75 (`## The Two 2026 Events at a Glance` table): "Advance 2,000 yen / Bonus 5,000 yen / Day-of 2,200 yen or 5,200 yen" — supplies the ¥2,000-5,200 admission range.
- Line 108: "Day-of tickets are 2,200 yen general and 5,200 yen bonus" — confirms the 5,200 upper-bound.

All four TL;DR numeric anchors are body-verbatim. **PASS on numeric honesty.**

Caveat: the TL;DR points to `§基本情報` but no H2/H3 literally named `基本情報` exists in this article — the supporting tables are under `## Before you go` and `## The Two 2026 Events at a Glance`. This is a stale-section-name reference, but the numbers themselves are body-backed. Minor cosmetic gap, not a P0 regression.

---

## Claim 8 — Em-dash density retained (not stripped) — PASS

Em-dash (`—`) count per article (all 10):

| Article | Count |
|---|---|
| frieren-usj-story-walk-osaka-2026 | 25 |
| detective-conan-cafe-tokyo-osaka-3venue-2026 | 14 |
| ranma-japan-2026-exhibition-tree-village-guide | 14 |
| demon-slayer-rerun-cafe-ufotable-kizuna-2026 | 13 |
| golden-kamuy-golden-week-shinjuku-popup-2026 | 12 |
| blue-lock-tokyo-skytree-cafe-2026 | 11 |
| jujutsu-kaisen-cafes-japan-2026-guide | 11 |
| world-trigger-festival-2026-tokyo-dome-city-cafe | 11 |
| dark-moon-chara-cafe-ikebukuro-2026 | 9 |
| animate-cafe-guide-japan | 5 |

No article was reduced to zero em-dashes. The "halving" did not strip the rhetorical device entirely. Lowest (animate: 5) still reads naturally. **PASS**.

---

## Claim 9 — No phantom `/articles/` slugs — PASS

Extracted all `/articles/{slug}` references from the 10 target articles. Unique non-self-reference slugs:

```
how-to-book-anime-collab-cafe-japan, tokyo-anime-collab-cafes-spring-2026,
akihabara-complete-guide-2026, anime-day-trips-from-tokyo-2026,
japan-ic-card-transit-guide, ikebukuro-anime-guide-2026,
familymart-anime-collab-stores-2026, jjk-sweets-paradise-complete-guide-2026,
re-zero-curemaid-cafe-akihabara-2026, hypnosismic-sweets-paradise-round8-2026,
lawson-ticket-anime-cafe-booking, demon-slayer-pilgrimage-tokyo,
osaka-anime-cafes-complete-guide-2026, japan-rail-pass-2026-guide,
japan-trip-checklist-anime-fans-2026, universal-cool-japan-2026-guide,
jujutsu-kaisen-shibuya-locations-2026, demon-slayer-handmade-club-ufotable-cafe-2026,
world-trigger-festival-2026-tokyo-dome-city-cafe, dark-moon-chara-cafe-ikebukuro-2026,
golden-kamuy-golden-week-shinjuku-popup-2026, ranma-japan-2026-exhibition-tree-village-guide,
detective-conan-cafe-tokyo-osaka-3venue-2026, animate-cafe-guide-japan
```

24/24 resolve to files in `content/articles/` (verified via directory listing). 0 phantom slugs. **PASS**.

---

## Surprises / gaps flagged

1. **JJK + 3venue substantive-rotation rewrites are mechanical and degrade prose.** The L4 AI-detection gate was unblocked via hatch #4 (pattern_allow + diversity ≥0.6), but the path to clearing diversity was string-substitution on high-frequency tokens ("Jujutsu Kaisen 5th Anniversary Cafe" → "JJK abbrev / paraphrase"). The substitutions broke 6+ sentences in JJK and 5+ in 3venue (catalogued in Claims 4 + 5). The gate now PASSES on metric, but the article reads worse than it did before the fix.

2. **JJK Sources[1] citation title was edited** to clear the gate. The bibliography line now reads `Essential Japan, "this anniversary cafe collab at Sweets Paradise 2026"`. Citation strings should mirror what the cited page actually says — this is a source-integrity issue separate from the prose-quality issue. Recommend reverting just the Sources block to the original title.

3. **3venue:59 quoted theme name was overwritten.** The official theme is 港町レトロ → "Retro Port Town"; the rotation changed the English quote to "the 2026 themed run" while keeping the Japanese 港町レトロ intact. The mixed-language sentence now contains a contradiction: the Japanese name and the English name no longer refer to the same string. This is closer to data-fabrication than prose rotation.

4. **3venue:131 menu-item name was overwritten.** `Angel Pudding à la Mode` (a hard-fact menu item with a 1,590-yen price tag visible 3 lines down) was replaced with `Angel this dessert plate`. Per audit skill Section 2, menu item names are hard-fact category and must match official menu / press release. Recommend reverting just the menu-item display strings.

5. **ranma TL;DR anchors `§基本情報` but no such literal heading exists.** Numbers match the body, but the reader who clicks "see §基本情報" finds no such section. Either rename a body H2 to `基本情報` or change the TL;DR pointer to `本文 ## Before you go` / `## The Two 2026 Events at a Glance`. Cosmetic, not a P0.

6. **Deprecated file `blue-lock-tokyo-skytree-cafe-2026.mdx.deprecated` still carries `voice: "friend-guide"` and one `I saw` firsthand line.** Not loaded by article registry (`.deprecated` extension), so not a live regression, but if any future tool ever indexes `.deprecated` files this would re-appear. Worth a follow-up sweep.

---

## Recommendation

**YELLOW: merge-blocked on substantive grounds; the 3 surface-level P0 fixes (blue-lock advisory rewrite + 3venue booking-flow phrase + ranma TL;DR ¥ values) are correct and well-targeted, but the JJK + 3venue substantive rotations introduced ~11 prose regressions and 1 source-integrity issue.** Before declaring sprint1 closed:

1. Revert the JJK Sources[1] citation title to its original (the source's actual title), keeping the rest of the rotation work.
2. Hand-edit the 6 broken-grammar lines in JJK (`:51`, `:55`, `:68`, `:107`, `:191`, `:198`) to read as natural English while preserving the diversification gain.
3. Hand-edit the 5 broken-grammar lines in 3venue (`:56`, `:59`, `:131`, `:134`, `:139`) — and specifically restore "Retro Port Town" as the English theme name on line 59 and "Angel Pudding à la Mode" as the menu-item name on line 131 (the prices nearby are unchanged and require these labels for context).
4. Optionally: rename one ranma H2 to `## 基本情報` or update the TL;DR pointer (cosmetic).

After those edits the sprint can move to GREEN on Round 3.
