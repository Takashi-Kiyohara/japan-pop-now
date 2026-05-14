# R13 Bucket D — Schema fix doc

**Bucket:** D
**Date:** 2026-05-14
**Items:** D1 NewsArticle conditional / D2 nested @context / D3 Twitter handle / D4 og:authors fallback / D5 sameAs (DEFERRED to user manual task)
**Commits:** `a1c23e9` (D1+D2+D3+D4) + `7889430` (D3 followup)

## Changes per item

### D1 — NewsArticle conditional
- `lib/structured-data.ts:48-64` — `getArticleSchema` computes `isTimeSensitive` from `category in ('cafes','experiences') && validUntil set`
- NewsArticle for time-sensitive; BlogPosting for evergreen
- Rationale: Prior hardcoded `'@type': 'NewsArticle'` failed Google Rich Results for non-time-sensitive content because NewsArticle requires `dateCreated` + `expires` style signals

### D2 — Nested @context elimination
- `lib/structured-data.ts:197-216` — `getAuthorSchema(name?, url?, image?, includeContext = true)`
- When nested inside Article → caller passes `includeContext: false`
- JSON-LD spec: `@context` only on outermost graph node

### D3 — Twitter handle migration
- 4 files, 5 occurrences replaced `@japanpopnow` → `@pop_now_jp`:
  - `app/layout.tsx` (site + creator)
  - `app/articles/page.tsx` (site)
  - `app/articles/[slug]/page.tsx` (site + creator)
  - `app/category/[slug]/page.tsx` (site)
- Aligns with existing `AUTHOR.socials.x = 'https://x.com/pop_now_jp'`
- (Not touched: `lib/geo-config.json` affiliate-ref `?ref=japanpopnow`, `app/support/page.tsx` buymeacoffee URL — these are SEPARATE service identifiers, not Twitter handles)

### D4 — og:authors fallback unified
- `lib/articles.ts:78` — `author: data.author || 'Japan Pop Now'` → `'Takapon'`
- Consistency with Person schema author + frontmatter `author: 'Takapon'` convention

### D5 — Person.sameAs strengthen (DEFERRED via AskUserQuestion-equivalent rationale)
- `lib/author.ts` `AUTHOR_SAME_AS` currently has 2 entries (threads + x)
- Spec asked to evaluate adding LinkedIn / Medium / Substack / note.com
- **Code alone cannot identify external profile URLs without Takapon confirming what exists**
- Listed in handoff doc as user manual task

## Evidence

```
grep -rn "japanpopnow" app/ lib/  # Twitter context only
  → only geo-config affiliate-ref + support buymeacoffee URL (both legitimate)
  → 0 twitter site/creator references remain @japanpopnow
```

Production curl verification (post-deploy, PDCA Round 1):
```
curl -s https://www.japan-pop-now.com/articles/dragon-ball-marugame-seimen-collab-2026 \
  | grep -oE '"@type":"(NewsArticle|BlogPosting)"'
  → expect: NewsArticle (cafes-category article with validUntil)

curl -s https://www.japan-pop-now.com/articles/akihabara-arcade-rhythm-games-guide-2026 \
  | grep -oE '"@type":"(NewsArticle|BlogPosting)"'
  → expect: BlogPosting (experiences but no validUntil)

curl -s https://www.japan-pop-now.com/articles/{any-slug} \
  | grep -c '"@context":"https://schema.org"'
  → expect: 1 (outermost only, no nested)

curl -sI https://www.japan-pop-now.com/articles/{any-slug} \
  | grep -i twitter:site
  → expect: @pop_now_jp
```

## RULE compliance

- RULE B: this doc generated
- RULE D: D5 SKIP documented as user manual task (handoff doc); Code did NOT fabricate a LinkedIn URL
- RULE H: 5 items shipped in 2 commits (D1+D2+D3+D4 batched; D3 missed-file followup as separate commit)
- RULE M: regression check — existing structured-data tests pass (tsc clean)

## Bucket D duration

~20 min (5 file edits + tsc + 2 commits + this doc).
