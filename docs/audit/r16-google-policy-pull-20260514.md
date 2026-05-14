# R16 Phase 0.0 — Google policy snapshot (WebFetch)

**Date:** 2026-05-14
**Sources fetched:**
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Spam policy current state

### Scaled content abuse
> "many pages are generated for the primary purpose of manipulating search rankings and not helping users"
> "Using generative AI tools or other similar tools to generate many pages without adding value"

Key takeaways:
- No explicit AI-page count threshold; the criterion is "value addition"
- Scraping + content stitching without value-add flagged
- The R10-R15 sprint history (87 articles, many with Takapon attribution + verified sources) sits well within the value-add definition

### Site reputation abuse
> "third-party content is published on a host site mainly because of that host's already-established ranking signals"

Not applicable to japan-pop-now.com (no third-party content; all editorial by Takapon).

### AI-generated content
No explicit threshold. Determining factor is **whether each page adds user value**.

## HCU criteria current state

(Note: source page dated 2025-12-10 per WebFetch; March 2026 update specifics not in this snapshot. R16 spec's "March 2026 HCU update for Google new weight on experience/originality" framing is based on user assertion + observable indexing patterns since 2026-03. The audit script's #13/#14 criteria target those axes regardless of exact policy doc date.)

### Experience / firsthand-knowledge axis
> "Does your content clearly demonstrate first-hand expertise and a depth of knowledge (for example, expertise that comes from having actually used a product or service, or visiting a place)?"

Implementation in R16 audit: signal weight comes from
- `imageCredit` containing "Takapon" (verified ownership)
- specific date/visit references ("April 2026", "March 8 visit")
- price/queue/timing specifics that imply observation
- photographed-content captions referencing the photo

### Information originality / uniqueness axis
> "Does the content provide original information, reporting, research, or analysis?"
> "If the content draws on other sources, does it avoid simply copying or rewriting those sources, and instead provide substantial additional value and originality?"

Implementation in R16 audit: signal weight comes from
- comparison tables (multi-row `|` or `<ResponsiveTable>`)
- verdict / recommendation sections
- tradeoff analysis phrases
- step-by-step instructions not derivable from press release alone

### HCU self-assessment items adapted to per-article binary
- Original reporting or research present?
- Substantial, comprehensive topic coverage? (R16 criterion 1: wordCount ≥1000)
- Insightful analysis beyond obvious observations? (R16 criterion 14)
- Spelling/stylistic issues absent? (R16 criterion 4: mojibake = 0)
- Evidence of expertise or authorship clarity? (R16 criterion 13: firsthand)
- Content demonstrating who created it? (frontmatter author = Takapon, R14 confirmed)

## How R16 audit criteria map to current policy

| R16 criterion | Maps to Google policy axis |
|---|---|
| #1 wordCount ≥1000 | HCU comprehensive coverage |
| #2 fabrication = 0 | HCU "no first-hand fabrication" + spam policy "value addition" |
| #3 em-dash density ≤8/k | HCU "spelling/stylistic absent" + AI-text heuristic signal |
| #4 mojibake = 0 | HCU stylistic absent |
| #5 Klook compliance | Affiliate FTC + spam policy (no cloaking) |
| #6 schema valid | Technical SEO baseline |
| #7 image authenticity | HCU experience axis (real photos) |
| #8 internal links ≥3 | Site architecture / topical authority |
| #9 external citations ≥3 | E-E-A-T trust signal |
| #10 factual hedges | HCU "not changing dates to fake freshness" |
| #11 isIndexable | Technical baseline |
| #12 duplicate passage ≤1 | Spam policy "stitched content without value-add" |
| #13 firsthand experience 0-10 | HCU Experience axis (★ March 2026 weight) |
| #14 information originality 0-10 | HCU Originality axis (★ March 2026 weight) |

## R16 binary thresholds

| Criterion | PASS condition |
|---|---|
| 1 wordCount | ≥1000 |
| 2 fabrication | = 0 |
| 3 em-dash | ≤8/k |
| 4 mojibake | = 0 |
| 5 klook | all aff_adid + rel=sponsored |
| 6 schema | publisher.logo 200 + frontmatter complete |
| 7 image authenticity | ≥6/10 |
| 8 internal links | ≥3 |
| 9 external citations | ≥3 |
| 10 factual hedges | no past-year-as-current + has hedge phrases |
| 11 isIndexable | meta robots index unless intentional noindex |
| 12 duplicate passage | ≤1 |
| 13 firsthand experience | ≥6/10 |
| 14 information originality | ≥6/10 |

Total score = count of PASS criteria, range 0-14.

## 3-band classification (RULE S)

- **GREEN ≥12/14**: GSC submit ready
- **YELLOW 9-11/14**: 1-3 fixes needed, auto-fixable in Phase 1
- **RED ≤8/14**: rewrite or noindex via user approval

Override rule: criterion #13 ≤3 OR #14 ≤3 forces RED even if other criteria GREEN (HCU direct-hit risk).
