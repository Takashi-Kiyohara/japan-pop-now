---
name: jpn-quality-reviewer
description: Phase 6 Reader Simulation (3 personas) + Red Flag final check before publishing or republishing any article. Use AFTER drafting and AFTER `jpn-article-audit` fact-check has passed. **Requires Opus-tier model** — judgment-heavy, not pattern-matched. Single-shot, not batch.
---

# jpn-quality-reviewer — Phase 6 of v3 Adoption

## When to use

Trigger this skill when:

- An article draft has passed `jpn-article-audit` (Phase 4) and `jpn-translation-style` Layer 1-2 grep
- A republished article has a major (>30%) rewrite
- A retroactive review is being done on a published article that's underperforming

This skill **must run on Opus** (or equivalent flagship model). The work is:

- Inhabit 3 distinct reader personas
- Predict their reactions, objections, and confusion points
- Catch tone / pacing / completeness issues that pattern-grep cannot
- Decide ship-vs-rewrite

Haiku and lighter models will give a thumbs-up too readily — they pattern-match "looks like a good article" rather than simulating reader reactions.

## Section 1 — Reader Simulation (3 personas)

For each article, simulate a 5-minute read for each of the 3 personas. The simulation produces a per-persona report.

### Persona A — Curious newcomer

**Profile**: international traveler (US/EU/SEA), aged 24-38, going to Japan in next 6 months, casual interest in anime/pop culture, doesn't know the IP this article covers.

**Mindset**:
- "Why should I care about this?"
- "Will I understand it without backstory?"
- "Is this worth the trip vs other options?"
- "Will I look out of place / be the only foreigner?"

**Simulate questions**:
1. After the intro, does Persona A understand WHO the IP/venue is? (No "obviously you know JJK is Jujutsu Kaisen")
2. By mid-article, has Persona A been given a reason to add this to their itinerary?
3. By the end, does Persona A know the cost / time commitment / language barrier?
4. What does Persona A NOT understand that they'd need to Google?
5. Would Persona A close the tab and book, or close the tab and forget?

**Output**: 1 paragraph "Persona A reaction" + list of confusion points.

### Persona B — Hardcore fan

**Profile**: international hardcore fan of the IP, watched the entire anime, read the manga, knows merch lore, has visited Japan 1-3 times before.

**Mindset**:
- "Tell me something I don't know."
- "Is this just regurgitating the press release?"
- "Where are the deep-cuts: voice actor cameo, hidden menu item, easter eggs?"
- "Is the writer actually a fan or is this content marketing?"

**Simulate questions**:
1. Is there at least 1 fact-or-detail Persona B doesn't already know?
2. Does the article use IP-specific terminology correctly (no "宿儺" mistake, no calling Levi the wrong rank)?
3. Are the menu items / merch tied back to specific arcs / character moments where applicable?
4. Does the article cite official numbered episodes / volumes / chapter for IP connections?
5. Would Persona B share this article with their fan group, or roll their eyes?

**Output**: 1 paragraph "Persona B reaction" + list of fan-credibility flags.

### Persona C — Time-pressed traveler

**Profile**: arriving in Tokyo tomorrow, has 1 free afternoon, must decide between this collab cafe and 2 other things.

**Mindset**:
- "Just tell me: should I go or not?"
- "How long does this take?"
- "What's the worst case (sold out, line, closed)?"
- "Where exactly do I go from {their hotel area}?"

**Simulate questions**:
1. Is the answer to "should I go" findable in the first 2 minutes of reading?
2. Are time / cost / access spelled out without scrolling past 5 paragraphs?
3. Is the failure mode covered (what if it's sold out — fallback?)
4. Is access clear from a major station Persona C would actually start from (Shibuya / Shinjuku / Ueno / Tokyo)?
5. Is there a CTA that respects Persona C's time (book now → 2 click)?

**Output**: 1 paragraph "Persona C reaction" + list of friction points.

## Section 2 — Red Flag final check

Independent of personas, a single-pass scan for ship-blocker issues:

### Critical (block publish — fix before ship)

| Flag | Detection |
| --- | --- |
| Real name "清原崇" anywhere | grep |
| Past year stated as current ("in 2024") | grep `(2023\|2024)\| year` for current-tense usage |
| Image-rule violation (軸 3 wrong-venue, 軸 4 fake graphic) | manual visual |
| Footnote syntax `[^N]` | grep — breaks remark-gfm |
| `<table>` inside `<div>` | grep — breaks parsing |
| `class=` instead of `className=` | grep |
| Affiliate link without `rel="nofollow sponsored noopener"` | grep |
| Fabricated specific (price ¥1,580 with no source check pass) | check against `jpn-article-audit` report |
| H1 in body (Next.js auto-generates from title) | grep `^# ` in body |

### Major (ship-conditional — note in commit, fix follow-up)

| Flag | Detection |
| --- | --- |
| Image density < 軸 1 floor | image_count < ceil(word_count/400) |
| 0 internal links (orphan) | grep `](/` content/articles/{slug}.mdx |
| 0 outbound official-source links | grep `https?://` count |
| FAQPage with < 3 questions | manual |
| Frontmatter missing `featuredImage` or `featuredImageAlt` | yaml lint |
| No author byline / wrong author | grep "Takapon" |

### Minor (note for next refresh)

| Flag | Detection |
| --- | --- |
| Image density 1.0/1k - 2.5/1k (above floor but below recommended) | calc |
| Average paragraph > 6 sentences (wall of text) | manual |
| No dated visit marker (`visited 2026-XX-XX`) | grep |
| No "what's changed since" section on evergreen | manual |

## Section 3 — Output

Produce a single review file at:

```
content_operations/reviews/{slug}-review-{date}.md
```

Format:

```markdown
# Quality Review: {slug}
Date: {YYYY-MM-DD}
Reviewer: Claude Opus 4.X (session {short-id})
Article version: {commit-sha-of-draft}

## Persona A — Curious newcomer
{1-paragraph simulated reaction}
Confusion points:
- ...

## Persona B — Hardcore fan
{1-paragraph reaction}
Fan-credibility flags:
- ...

## Persona C — Time-pressed traveler
{1-paragraph reaction}
Friction points:
- ...

## Red Flags
### Critical (must fix)
- (none) | (list)

### Major (ship-conditional)
- (none) | (list)

### Minor (next refresh)
- (none) | (list)

## Verdict
SHIP | SHIP_WITH_FIXES | REWRITE | REJECT

## Recommended actions before next step
1. ...
```

## Verdict decision matrix

| Critical flags | Major flags | Persona A/B/C any "would not" | Verdict |
| --- | --- | --- | --- |
| 0 | 0 | 0 | SHIP |
| 0 | 1-2 | 0 | SHIP_WITH_FIXES (fix in same commit, then ship) |
| 0 | 3+ | 0 | REWRITE (defer to draft revision cycle) |
| 1+ | any | any | REWRITE — critical must clear |
| 0 | any | 1+ persona reports "would close tab" | REWRITE — reader simulation ranks above flag count |

The persona simulation has veto power. A clean Red-Flag scan that fails Persona simulation = REWRITE.

## Why Opus

- Reader simulation requires inhabiting a perspective, not pattern-matching for keywords
- Tone calibration ("does this sound like a real fan" vs "does this sound like marketing copy") needs nuance
- Ship-vs-rewrite is judgment under uncertainty — preference for false-positive (over-rewrite) over false-negative (ship bad article)

If Opus is unavailable, do not run this skill on a smaller model and claim "reviewed". Defer the review until Opus capacity is available.

## Cost discipline

Each review = ~5K tokens of careful reading + ~3K tokens of simulation + output. Budget accordingly. For batch reviews (e.g., retroactive 77-article sweep), serialize and sleep between articles to avoid context contamination.

## DO NOT

- Run reviewer simulations in parallel within a single agent call (cross-persona contamination)
- Skip personas because the article "obviously" passes for one of them
- Accept SHIP verdict if any Persona reaction includes "close tab" / "boring" / "not for me"
- Use this skill to gloss over `jpn-article-audit` failures (audit is a prereq, not a substitute)
- Run on a smaller model (Haiku, Sonnet-4-or-lower) — defer until Opus available
