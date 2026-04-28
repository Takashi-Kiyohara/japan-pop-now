---
name: jpn-seo-rules
description: v3-era SEO/AEO/GEO additions for japan-pop-now.com — extends `.claude/rules/seo.md` with LLM-citation optimization, E-E-A-T signals, intent matching, and freshness mechanics. Use during article authoring, audit, or when reviewing GSC performance.
---

# jpn-seo-rules — Phase 5 of v3 Adoption

## When to use

Trigger this skill when:

- Writing an article that needs to compete in 2026 SERPs (LLMs cite, AI Overviews dominate)
- Auditing an existing article that's underperforming (GSC clicks declining or stuck < 100/28d)
- Reviewing structured data coverage
- Planning a pillar / cluster expansion in any of the 5 silos

`.claude/rules/seo.md` remains the **base authoritative ruleset** (titles, meta, internal linking, silo structure, schema, GSC hygiene). This skill adds the v3 layer of techniques that emerged after that ruleset was written.

## Section 1 — LLM citation optimization

LLMs (Claude, ChatGPT, Perplexity, Gemini, Google AI Overviews) cite content with these markers:

### Definition-first paragraphs

- First non-intro paragraph of every H2 section: `[Subject] is [definition] — [qualifier].`
- Example: `Krispy Kreme Mario Galaxy Shibuya is a 4-week limited collab running 2026-04-15 → 2026-05-12 at the Shibuya Scramble Square 1F branch only.`
- Anti-pattern: lead with a hook sentence; LLMs skip those when extracting facts.

### Numbered lists for procedural content

LLMs preferentially cite numbered lists when answering "how to" intents. Use `1. 2. 3.` (not bullet `-`) for any sequence of steps. 5-7 items optimal.

### Inline source attribution

When stating a fact that originated from an official source, write `(per official site, confirmed 2026-04-28)` inline. LLMs use these as trust signals and pass them through in citations.

### "Last updated" header

Every article body should open with `**最終更新: 2026-04-28**` (Japanese) or `**Last updated: April 28, 2026**` (when slug is English). Component: `<Freshness date="2026-04-28" />` if available; plain markdown otherwise.

### Question-style H2s

Every article should have at least 3 H2s phrased as questions a reader actually types:

- ❌ `Access` → ✅ `How to get there from Shinjuku station`
- ❌ `Pricing` → ✅ `How much does it cost (and what's included)?`
- ❌ `Menu` → ✅ `What's the best item to order on a first visit?`

Pair with `FAQPage` JSON-LD (already supported via `lib/faq-schema.ts`).

## Section 2 — E-E-A-T signals (Experience emphasized)

Google's December 2022 update added "E" for Experience. For a travel site, this is the highest-ROI signal class.

### First-person experience markers

Every article should contain at least 2 of:

- A specific date the writer experienced the venue (`2026-03-12 lunch visit`)
- A queue-time observation (`12:15 arrival, seated 12:48`)
- A photo with EXIF-confirmable date (already enforced by image rules)
- A specific menu item ordered with verdict (`tried the strawberry parfait — good but the cheesecake outperformed it`)
- A travel-time observation from a real station (`Shibuya station Hachiko exit → 4 min walk via underground passage`)

These markers MUST be true. Fabricated experience = `seo.md` Fact Verification rule violation.

### Authoritativeness via citation

Every claim that can be sourced should link out:

- Official venue site for hours, address, prices
- Government/agency site for laws, holidays, transit info
- Wikimedia for historical / etymological facts
- Never link out to other affiliate aggregators (dilutes link equity)

### Trust via update cadence

Articles tagged `featured: true` (homepage candidates) must be re-verified ≤ 30 days. Auto-flag via:

```bash
# Find featured articles older than 30 days since last frontmatter `date`
find content/articles -name '*.mdx' -mtime +30 -exec grep -l 'featured: true' {} +
```

## Section 3 — Intent matching

Each article must declare its primary intent in frontmatter (or be inferable):

| Intent | Signal | URL pattern | Schema |
| --- | --- | --- | --- |
| Informational ("what is X") | Definition-first, FAQ | `/{silo}/what-is-X/` | Article + FAQPage |
| Navigational ("X official site / how to find") | Address, map embed, exit | `/{silo}/X-access/` | Article + LocalBusiness |
| Transactional ("book X / X tickets") | Price + CTA above fold | `/{silo}/book-X/` | Product or Event |
| Commercial-investigation ("X vs Y / best X") | Comparison table | `/{silo}/X-vs-Y/` | Article (no specific schema; use Itemlist) |
| Local ("X near Y") | Neighborhood breakdown | `/{silo}/X-in-{area}/` | Article + Place |

Mismatched intent (e.g., transactional intent with informational copy) = ranking ceiling.

## Section 4 — Freshness mechanics

### Date hedging

`.claude/rules/article-quality.md` already requires `as of April 2026` style hedges. v3 extends:

- For event articles, frontmatter `validUntil: "2026-05-12"` field. After that date, article auto-shows a stale banner.
- For evergreen articles (transit, area guides), include a "what's changed since X" section listing 2-3 recent updates with dates.

### Refreshes vs republishes

Distinction matters for GSC:

- **Refresh**: edit body without changing `date` frontmatter, keep URL. Triggers re-crawl. Use for fact updates.
- **Republish**: bump `date` to today, re-submit URL via GSC URL Inspection. Use only when ≥30% of body changed. Excessive republish = quality penalty.

### Sitemap priority signals

`app/sitemap.ts` should set `priority: 0.9` for articles updated in last 30 days, `0.7` for 30-90 days, `0.5` older. Tells search engines where to focus crawl budget.

## Section 5 — Internal linking depth

`.claude/rules/seo.md` requires 2-3 internal links per article. v3 specifies the WHERE and the HOW:

### Position discipline

| Position | Link type | Required |
| --- | --- | --- |
| First H2 body | Hub link (`/{silo}/`) | Yes |
| Mid-article | Sibling article in same silo | Yes |
| End-of-article | Cross-silo when relevant | Conditional |
| `relatedSlugs` block | 3-5 same-silo + 1 cross-silo | Yes |

### Anchor text distribution

Track anchor text variation per inbound link:

- Exact-match keyword: ≤ 30% of inbound anchors
- Branded ("japan-pop-now"): ≤ 10%
- Partial-match descriptive: ≥ 50%
- Generic ("read more"): always 0% (banned)

Inventory check: `npm run validate` should flag anchor distribution > thresholds.

## Section 6 — Anti-cannibalization

Two articles targeting the same primary keyword cannibalize each other.

### Pre-publish check

Before adding a new article, search the existing corpus for the proposed primary keyword:

```bash
grep -rli "primary-keyword" content/articles/
```

If a hit exists:

1. Strengthen the existing article instead of creating new
2. OR create the new article with strictly differentiated intent (e.g., one informational, one transactional) and explicitly cross-link them

### Title/H1 uniqueness

No two articles may share an exact H1 or first-30-character title prefix. `npm run validate` catches title duplication; widen to H1.

## Section 7 — GSC hygiene v3 additions

Beyond `.claude/rules/seo.md`:

- Submit XML sitemap to **both** properties (`japan-pop-now.com` and `www.japan-pop-now.com`) even with canonicalization — GSC sometimes splits report data.
- 404 pages must NOT redirect to homepage (soft-404 penalty). Ship a real 404 (already done in `app/not-found.tsx`).
- After republishing 5+ articles in a week, request URL Inspection on each individually (GSC limits ~30/day).
- Watch GSC Performance > Search appearance for "AI Overview" — track which articles get cited by Google AI Overviews and which don't, then propagate the citation patterns.

## DO NOT

- Stuff structured data with fake fields just to be schema-rich
- Add FAQPage schema for fewer than 3 real questions
- Set `priority: 1.0` on any URL (only homepage gets implicit 1.0)
- Use `noindex` as an SEO tactic (only for thin/duplicate content)
- Add `canonical` pointing to a different domain
- Internal-link to articles that are `noindex`
