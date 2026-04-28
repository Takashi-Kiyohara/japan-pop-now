---
name: jpn-translation-style
description: Anti-AI-flavored writing style for japan-pop-now.com travel articles. Use when drafting, rewriting, or auditing any `content/articles/*.mdx`. Layers 1-2 are auto-greppable; Layers 3-5 require manual reading.
---

# jpn-translation-style — Phase 3.5 of v3 Adoption

## When to use

Trigger this skill when:

- Writing a new article in `content/articles/`
- Rewriting an existing article (anything that touches body prose)
- Auditing prose quality (e.g. before publishing or in retroactive sweeps)

This skill **complements** `.claude/rules/article-quality.md` (which already bans `Let's dive in`, `In today's world`, `truly unique`). It does NOT replace those rules — it deepens them with Japanese-language equivalents and structural patterns.

## Layer 1 — Banned phrases (auto-grep)

Run before commit; any hit must be rewritten with concrete substitution.

### Japanese

| Banned | Why | Acceptable substitution pattern |
| --- | --- | --- |
| 様々な / さまざまな | Vague filler | List 2-3 specific items instead |
| 多種多様 / バラエティ豊か | Cliché | Specific count + examples |
| 魅力的 / 魅力たっぷり | Empty positive | What specifically is interesting? |
| 必見スポット / 見逃せない | Overused | Specific reason it matters |
| 心ゆくまで楽しめる | Hollow | Concrete activity duration |
| 〜と言っても過言ではない | Hedge filler | Drop or quantify |
| 〜は欠かせません | Imperative cliché | Reason-based recommendation |
| 思い出に残る | Generic | Specific moment or detail |
| 素敵な時間を過ごせる | Empty | Specific activity outcome |
| 〜ならではの (vague) | Often empty | Concrete distinguishing fact |
| 〜はもちろん〜も | Filler parallelism | Single direct claim |
| ぜひ一度訪れてみて(ください) | Closing cliché | Concrete CTA with timing/cost |
| 訪れる価値あり | Empty endorsement | Reason-based ("〜なら立ち寄る価値") |
| 老若男女問わず | Generic audience | Specific audience |
| 都会の喧騒を忘れて | Cliché opener | Specific contrast detail |
| 隠れた名店 / 知る人ぞ知る | Cliché reveal | Concrete reason for low profile |
| 風情ある / 趣のある | Vague atmosphere | Concrete sensory detail |

### English (when mixed in)

| Banned | Why | Substitution |
| --- | --- | --- |
| Let's dive in / Let's explore | AI opener | Cut entirely |
| In today's world | AI scene-set | Cut entirely |
| Truly unique / one-of-a-kind | Empty intensifier | Specific distinguishing fact |
| Unforgettable / memorable | Cliché closer | Specific moment |
| Hidden gem | Overused | Concrete reason |
| Must-see / must-visit | Overused | Why it matters to specific reader |
| A perfect blend | AI tell | Specific fusion detail |
| Vibrant tapestry | AI signature | Cut |
| Whether you're X or Y, this is for you | AI parallel | Pick one audience |
| Look no further | AI CTA | Direct CTA |
| Delve into | AI verb | Walk / try / order |
| Bustling streets | AI generic | Specific street name + scene |

### Auto-grep snippet

```bash
# Layer 1 sweep — exits 1 if any hit
PHRASES_JP="様々な|多種多様|バラエティ豊か|魅力的|必見スポット|見逃せない|心ゆくまで|過言ではない|欠かせません|思い出に残る|素敵な時間|ならではの|はもちろん|ぜひ一度|訪れる価値あり|老若男女問わず|都会の喧騒|隠れた名店|知る人ぞ知る|風情ある|趣のある"
PHRASES_EN="Let's dive|In today's world|truly unique|one-of-a-kind|unforgettable|memorable|hidden gem|must-see|must-visit|perfect blend|vibrant tapestry|whether you're|look no further|delve into|bustling streets"
grep -rEn "$PHRASES_JP|$PHRASES_EN" content/articles/*.mdx && exit 1 || exit 0
```

## Layer 2 — Syntax patterns (auto-grep)

### Pattern: parallel-list overuse

`〜だけでなく、〜も` appearing 3+ times in one article = AI tell. Limit to 1-2 per article.

```bash
grep -c "だけでなく" content/articles/{slug}.mdx
# > 2 = warn
```

### Pattern: 体言止め list rhythm

`...。\n...。\n...。` with all sentences ending in noun-only (体言止め) for 4+ consecutive lines = AI tell. Mix in 1-2 verbal endings (〜ます / 〜です / 〜できます).

### Pattern: "〜という方/〜な方は" repetition

Targeting cliché reader-segmentation. Limit to 1 use per article max.

### Pattern: bullet-paragraph imbalance

Articles with > 60% content as bullet lists (markdown `- ` lines / total lines) signal AI scaffolding. Mix in narrative paragraphs.

### Pattern: identical sentence-length runs

5+ consecutive sentences within 10% of the same length = AI rhythm. Vary deliberately.

```bash
# Length variance check (manual scan): split content by 。, count chars per sentence
```

## Layer 3 — Voice and rhythm (manual)

Read the article aloud (mentally). Flag if:

- Every paragraph sounds like the same narrator with the same tone
- No first-person observation markers (`実は`, `意外と`, `個人的には`, `〜してみた`)
- No moment of contradiction or surprise (everything is uniformly positive)
- No specific numbers / measurements / times (everything is round-numbered or vague)
- No tactile sensory detail (smell, texture, sound — not just sight)

## Layer 4 — Perspective (manual)

Flag if the article:

- Uses only third-person description, never `あなた` (you) framing in intros
- Treats the reader as an abstract "visitor" not a specific persona
- Has zero personal narrative ("〜行ってみた / 〜してみたら")
- Lists features without ranking or preference ("X もある、Y もある、Z もある")
- Avoids any negative observation (a true human will note at least one drawback)

A non-AI travel article almost always has at least one moment of "this part was a letdown" or "the queue was longer than I expected" or "skip the X, do Y instead."

## Layer 5 — Cultural / local specificity (manual)

Flag if the article:

- Could describe ANY Japanese venue/area (no neighborhood-specific landmark, exit number, off-hour timing)
- Uses generic Japan tropes (sakura/kimono/sushi) without local angle
- Has no insider mechanic (best train car for Shibuya rush, exit at right station, when the line clears)
- Names attractions but not their micro-context (specific shop on a specific street with a specific opening minute quirk)
- Treats Japan-as-monolith vs Tokyo-Osaka-Kyoto as distinct cultures

## Workflow

When invoked:

1. Run Layer 1 + Layer 2 grep against the target MDX. If any hit, fix before proceeding.
2. Read the article body prose. Apply Layer 3-5 manual checks.
3. If 2+ Layer 3-5 flags fire, the article needs structural rewrite, not phrase swap.
4. Save findings as a comment block at top of `content_operations/rewrites/{slug}-style-{date}.md` for traceability when rewriting.

## Conflicts with other rules

- `article-quality.md` voice rules (`No AI-flavored phrasing`) — this skill provides the concrete list. When in doubt, this skill's list is authoritative.
- `seo.md` "Definition-first paragraph (X is …)" — that pattern is explicitly LLM-citation friendly and stays. Layer 1 ban does not apply to it.
- `affiliate.md` CTA copy — affiliate CTAs need urgency hooks; rules from affiliate.md win for that block.

## DO NOT

- Replace banned phrases with synonyms from the same list (`必見` → `見逃せない` is still AI). Substitute with concrete specifics.
- Strip ALL AI-style phrasing if the result is bland — partial human warmth requires keeping some idiomatic phrasing. Aim for human variation, not phrase-purity.
- Apply this to QUOTED content (interview snippets, official text, verbatim signs). Mark those as quotes and exempt.
