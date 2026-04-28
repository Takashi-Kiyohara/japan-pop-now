---
name: jpn-article-audit
description: Phase 4 fact-check + price/hours/address verification protocol for japan-pop-now.com articles. Use before publishing any new article, during retroactive sweeps, or whenever a claim's accuracy is suspect. Hallucination detection layer + official-source confrontation layer.
---

# jpn-article-audit — Phase 4 of v3 Adoption

## When to use

Trigger this skill when:

- Pre-publish check on a new draft
- Retroactive audit of an existing article (e.g., quarterly sweep, GSC anomaly investigation, user feedback)
- Any time a price / opening hour / address / closure date is mentioned
- Before sending a Submit URL for re-indexing in GSC

This skill **complements** `.claude/rules/article-quality.md` Fact Verification section. That section says to web-search before publishing. This skill specifies HOW to confront the sourced fact and what to do when sources disagree.

## Section 1 — Claim taxonomy

Before auditing, classify each non-prose claim into a category:

| Category | Examples | Verification target |
| --- | --- | --- |
| **Hard fact (mutable)** | price, hours, address, phone, dates | Official venue site or operator |
| **Hard fact (immutable)** | distance from station (m), historical date | Official venue / Wikipedia / Wikimedia |
| **Soft fact** | "popular among teens", "best seller" | Source must be cited; otherwise drop |
| **Editorial** | "the cheesecake outperformed the parfait" | Author's own experience marker required |
| **Forecast** | "expected to sell out" | Drop unless venue announced |

Hallucination most often appears in **Soft fact** category dressed as **Hard fact** (e.g., a fabricated specific price for a venue that hasn't been visited).

## Section 2 — Hallucination detection (auto + manual)

### Auto-greppable signals

```bash
# Suspiciously round prices in JP context (¥1000, ¥2000, ¥3000) — real menu prices rarely round
grep -E '¥(1000|2000|3000|4000|5000|10000)' content/articles/{slug}.mdx

# Generic phone-number patterns that don't match real Japanese formats
grep -E '03-1234-5678|0120-XXX-XXX' content/articles/{slug}.mdx

# Coordinates that look fake (X.0, Y.0)
grep -E '[0-9]+\.0+,\s*[0-9]+\.0+' content/articles/{slug}.mdx

# URLs to typo-squatted or fake official sites (e.g. "krispykremedonut.jp" instead of real)
grep -Eo 'https?://[^ )"]+' content/articles/{slug}.mdx | sort -u
```

### Manual hallucination flags

Read the article and flag any claim with these signatures:

- **Specific number + no source** ("seats 80 customers", "opens at 10:30") → must have an official-site link OR an experience marker (`visited 2026-04-XX`)
- **Confident historical date for a recent venue** ("opened in 2018") → cross-check Wayback Machine
- **Brand collab "exclusively" or "first ever"** → check the brand's official press release
- **Insider mechanic with no plausible source path** ("the locals know to enter via the back stairs") → drop unless author confirmed
- **Specific menu item name + price + size** ("Strawberry Parfait, ¥1,580, 350ml") → must match official menu PDF / image, or be from a dated visit photo

### When in doubt, drop the specific

A vague-but-true statement ("around ¥1,500-¥1,800") beats a specific-but-fabricated one ("¥1,680"). Hedging language is allowed: `およそ¥1,500前後 (公式メニュー、2026-04-28 確認)`.

## Section 3 — Price verification protocol

### Step 1 — Extract

```bash
# Pulls all yen / dollar / yuan / euro / won price patterns
node scripts/price-audit/extract-prices.ts content/articles/{slug}.mdx
```

Output: JSON of `{ slug, price, surrounding_text, nearest_url }`.

### Step 2 — Confront

For each extracted price:

1. WebFetch the `nearest_url` (or, if none, the venue's official site)
2. Confirm the price string appears on the live page (allow ±¥50 tolerance for menu rounding)
3. If page returns 404 / 5xx, mark as `unverifiable` and flag for user
4. If price differs > ¥50, mark as `mismatch` with the live price recorded

### Step 3 — Triage

| Verdict | Action |
| --- | --- |
| `match` | No change |
| `mismatch ±¥50-¥500` | Update article inline, log in `docs/audit/price-mismatch-{date}.md` |
| `mismatch >¥500` | Flag for manual review (might be tier change, not just inflation) |
| `unverifiable` | Replace specific price with hedged range OR drop the price entirely |

### Step 4 — Commit cadence

One commit per article on price fixes (`fix(price): {slug} — verify against official, ¥X→¥Y`). Avoid batching prices across articles in single commit (makes diffs unreviewable).

## Section 4 — Hours / address verification

Same 4-step pattern as price, but:

- Hours: confront against Google Maps listing AND official site (they sometimes disagree; trust official site)
- Address: must match official site exactly (postal code + 都道府県 + city + chōme + 番地). Google Maps display address is sometimes slightly different.
- Phone: only include if it appears on the official site (don't pull from third-party listings)

## Section 5 — Closure / cancellation check

For collab-cafe and event articles especially:

- **Before publishing**: confirm event end date against official site
- **After publishing, monthly**: re-verify still active. If event ended, decide:
  - Article has historical value → set frontmatter `validUntil: "YYYY-MM-DD"` and add a "this event has ended" banner via component
  - Article has no value post-event → set `robots: noindex,follow` (per `feedback_destructive_ops.md`: NEVER delete files)

## Section 6 — Output: audit report

For each article audited, write a report at `docs/audit/article-audit-{slug}-{date}.md`:

```markdown
# Article Audit: {slug}
Date: {YYYY-MM-DD}
Auditor: Claude Code session {session-id-short}

## Hard facts checked
| Claim | Source | Verdict |
| --- | --- | --- |
| Price ¥1,580 strawberry parfait | krispykreme.jp/shibuya | match |
| Hours 10:00-22:00 | krispykreme.jp/shibuya | match |
| Address 渋谷区渋谷2-24-12 | krispykreme.jp/shibuya | match |

## Hallucination flags
- (none) / (list)

## Recommendations
- [ ] Fix X
- [ ] Manual review Y

## Submitted commits
- {sha} fix(price): ...
```

## Section 7 — Cadence

| Trigger | Audit depth |
| --- | --- |
| New draft pre-publish | Full Section 1-6 |
| 30-day post-publish | Section 3-5 only (price/hours/closure) |
| 90-day | Section 1-6 again |
| User-reported fact issue | Targeted: only the disputed claim, plus any logically dependent ones |
| GSC click decline > 50% in 14 days | Full Section 1-6 + competitor recency check |

## DO NOT

- Mark an article as "audited" without writing the audit report (no shadow audits)
- Trust aggregator sites (TripAdvisor, Tabelog, Hot Pepper) for hard facts — official only
- "Update" an article based on a verbal source (Twitter post without official-site confirmation)
- Strip a price entirely if a hedged range is acceptable to the reader
- Audit articles in batch and commit fixes as a single super-commit (one commit per slug)
