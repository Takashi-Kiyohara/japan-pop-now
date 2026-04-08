# AI Article Generation Pipeline — japan-pop-now

Complete guide to the article generation, validation, and publishing pipeline.

## Quick Start

### Create a New Article

```bash
npm run new-article
```

Interactive CLI that:
1. Shows available templates (collab cafe, pilgrimage, area guide, travel tip)
2. Prompts for title, slug, description, tags
3. Asks for template-specific info (anime name, location, etc.)
4. Auto-generates article file in `content/articles/`

### Validate All Articles

```bash
npm run validate
```

Checks all articles for:
- **Frontmatter**: title (required, <70 chars), description (required, 80-160 chars), date (valid format), category (one of 4), tags, author, featuredImage
- **Content**: minimum 500 words, at least 2 headings, FAQ section
- **Output**: errors (block publishing), warnings (best practices)

Exit code: 1 if errors found, 0 if only warnings

### Score an Article

```bash
npm run score content/articles/my-article.md
```

Scores 0-100 based on:
- Word count (0-15 pts): 1500+ = 15
- Heading structure (0-15 pts): proper h2/h3 hierarchy
- Internal links (0-10 pts): 3+ = 10
- External links (0-5 pts): 2+ = 5
- Images (0-10 pts): 3+ = 10
- FAQ section (0-10 pts): 3+ QAs = 10
- Meta description (0-10 pts): 120-155 chars optimal
- Title quality (0-10 pts): <60 chars + power words
- Readability (0-15 pts): paragraph structure, sentence variety

**Score interpretation**:
- 90+: ✨ Excellent, ready for publication
- 75-89: ✓ Good, minor improvements
- 60-74: ⚠️ Needs work, review weak areas
- <60: ❌ Significant revisions needed

### Check Content Freshness

```bash
npm run freshness
```

Flags articles needing updates:
- 90+ days old with year references
- Outdated year mentions (e.g., 2025 in 2026)
- Time-sensitive info (prices, hours, event dates)
- Season-specific references (Spring 2025)

### Auto-Insert Internal Links

```bash
npm run auto-link --dry-run
```

Preview mode (shows what would change):

```bash
npm run auto-link --apply
```

Applies changes. Intelligently adds up to 5 links per article where:
- Keywords from other articles are mentioned
- Links don't already exist
- Most relevant articles get priority

### Notify Search Engines

```bash
npm run ping
```

Pings:
- Google (sitemap notification)
- Bing (sitemap notification)
- IndexNow API (if INDEXNOW_KEY set in .env)

### Trigger Vercel Deployment

```bash
npm run deploy-hook
```

Triggers Vercel deployment via webhook (requires VERCEL_DEPLOY_HOOK_URL in .env).

## Templates

### Collaboration Cafe Guide

```
scripts/templates/collab-cafe.md
```

For articles about anime collaboration cafes. Includes:
- What is the cafe?
- Location & Access
- Menu Highlights
- Limited Merchandise
- How to Book
- Tips for International Visitors
- FAQ (3+ Q&As)

**Frontmatter fields**:
- category: `collab-cafes`
- tags: anime name, "collab cafe", city, etc.

**Example**:
```bash
npm run new-article
# 1. Collaboration Cafe Guide
# Title: Demon Slayer Cafe Tokyo 2026: Menu, Merch & Booking Guide
# Tags: Demon Slayer, collab cafe, Tokyo, anime
```

### Anime Pilgrimage Guide

```
scripts/templates/pilgrimage.md
```

For articles about anime filming locations. Includes:
- What is Anime Pilgrimage?
- Location Overview
- Must-Visit Locations
- Getting There
- Best Time to Visit
- Practical Tips
- Photography Guide
- FAQ (3+ Q&As)

**Frontmatter fields**:
- category: `anime-pilgrimage`
- tags: anime name, "pilgrimage", location, "anime holy sites"

### Area/Neighborhood Guide

```
scripts/templates/area-guide.md
```

For neighborhood/district guides. Includes:
- Area Overview
- How to Get There
- Best Anime Shops
- Anime Cafes & Restaurants
- Must-See Attractions
- Shopping Tips
- Where to Stay
- FAQ (3+ Q&As)

**Frontmatter fields**:
- category: `area-guides`
- tags: area name, "anime shops", city

### Travel Tip

```
scripts/templates/travel-tip.md
```

For practical travel guides. Includes:
- Quick Overview
- Why This Matters for Anime Fans
- Step-by-Step Guide
- Cost Breakdown
- Pro Tips from Experienced Travelers
- Common Mistakes to Avoid
- Resources & Links
- FAQ (3+ Q&As)

**Frontmatter fields**:
- category: `travel-tips`
- tags: tip subject, "travel guide", "Japan tips"

## Article Structure Best Practices

### Frontmatter

```yaml
---
title: "Full Title Here (Keep <70 chars, include keywords)"
description: "Meta description: 120-155 chars, compelling for SERPs"
date: "2026-04-08T00:00:00+09:00"
category: "collab-cafes" # Must be one of 4
tags: ["Anime Name", "collab cafe", "City", "anime cafe"]
featuredImage: "/images/article-slug.jpg"
featuredImageAlt: "Alt text for image"
author: "Japan Pop Now"
excerpt: "Optional: 150-200 char summary"
relatedSlugs: ["related-article-slug", "another-article"]
---
```

### Heading Hierarchy

```markdown
## Section 1 (H2)
Content...

### Subsection 1.1 (H3)
Content...

### Subsection 1.2 (H3)
Content...

## Section 2 (H2)
Content...

## FAQ (Always H2)

### Question 1?
Answer...

### Question 2?
Answer...
```

### Word Count Target

- Minimum: 500 words (validation requirement)
- Optimal: 1,000-1,500 words (scoring optimal)
- Maximum: No hard limit, but keep readable

### Link Guidelines

- Internal links: 3+ to related articles (0-10 pts in score)
- External links: 2+ to reputable sources (0-5 pts)
- Link text: descriptive, keyword-rich
- Use relative URLs: `[link text](/related-article-slug)`

### Image Guidelines

- Featured image: required in frontmatter
- Images in content: 3+ optimal (0-10 pts in score)
- Alt text: descriptive, includes keywords
- Use markdown: `![alt text](/images/image.jpg)`

## GitHub Actions: Continuous Content Check

Workflow: `.github/workflows/content-check.yml`

**Triggers on**:
- Pull request to any branch with changes to `content/articles/*.md`
- Direct push to main with article changes

**Actions**:
1. Runs `npm run validate` — fails PR if errors found
2. Scores all changed articles with `npm run score`
3. Posts quality scores as PR comment (for PRs only)

**Example PR comment**:
```
## 📋 Article Quality Report

✨ my-new-article: 88/100
⚠️ needs-revision: 62/100
```

## Environment Configuration

### .env File

```bash
# Required for some scripts
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
INDEXNOW_KEY=your-indexnow-key
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/...
NEXT_PUBLIC_SITE_URL=https://japan-pop-now.com
```

See `.env.example` for template.

## Common Workflows

### Publishing a New Article

1. **Create article**:
   ```bash
   npm run new-article
   # Follow prompts
   ```

2. **Edit article**:
   - Open `content/articles/your-slug.md`
   - Replace template placeholders
   - Add featured image path
   - Add internal links

3. **Validate and score**:
   ```bash
   npm run validate
   npm run score content/articles/your-slug.md
   ```

4. **Fix issues** (if needed):
   - Title/description length
   - Word count
   - Heading structure
   - FAQ section

5. **Auto-add internal links** (optional):
   ```bash
   npm run auto-link --dry-run  # Preview
   npm run auto-link --apply    # Apply
   ```

6. **Create PR and push**:
   - GitHub Actions validates automatically
   - Review PR quality scores
   - Merge when ready

7. **Deploy**:
   ```bash
   npm run deploy-hook
   # Or merge to main (if Vercel is connected)
   ```

8. **Notify search engines**:
   ```bash
   npm run ping
   ```

### Batch Content Update

1. **Check freshness**:
   ```bash
   npm run freshness
   ```

2. **Review flagged articles** (90+ days old with year refs)

3. **Update publish dates and content**:
   - Remove/update outdated year references
   - Refresh pricing/hours if changed

4. **Validate all**:
   ```bash
   npm run validate
   ```

5. **Deploy and ping**:
   ```bash
   npm run deploy-hook
   npm run ping
   ```

### Improving Article Quality

1. **Score article**:
   ```bash
   npm run score content/articles/my-article.md
   ```

2. **Identify weak areas** (score <50%):
   - Word count too low? → Add more content
   - No internal links? → Use auto-link
   - Missing FAQ? → Add FAQ section with 3+ Q&As
   - Poor readability? → Shorter paragraphs, varied sentences

3. **Make improvements**:
   - Edit article file
   - Re-score to verify

4. **Target score**: 75+ is good, 90+ is excellent

## Script Reference

### validate-articles.ts

Validates all articles for frontmatter & content requirements.

**Runs**:
```bash
npm run validate
```

**Output**: Errors (block publishing) and warnings (best practices)

**Exit code**: 1 if errors, 0 otherwise

---

### score-article.ts

Scores a single article 0-100 on quality metrics.

**Runs**:
```bash
npm run score content/articles/article-slug.md
```

**Output**: Breakdown of 9 scoring categories + JSON

---

### new-article.ts

Interactive CLI to generate new article from template.

**Runs**:
```bash
npm run new-article
```

**Prompts for**: Template, title, slug, description, tags, template-specific fields

**Creates**: `content/articles/{slug}.md` with template content

---

### validate-articles.ts

Validates all articles for frontmatter & content requirements.

**Runs**:
```bash
npm run validate
```

**Output**: Errors (block publishing) and warnings (best practices)

**Exit code**: 1 if errors, 0 otherwise

---

### auto-link.ts

Intelligently adds internal links between articles.

**Runs (dry-run)**:
```bash
npm run auto-link --dry-run
```

**Runs (apply)**:
```bash
npm run auto-link --apply
```

**Output**: List of links to be added (or added)

**Max**: 5 links per article

---

### freshness-check.ts

Flags articles needing updates.

**Runs**:
```bash
npm run freshness
```

**Output**: Articles 90+ days old with year references or time-sensitive info

---

### ping-search-engines.ts

Notifies Google, Bing, and IndexNow of new/updated content.

**Runs**:
```bash
npm run ping
```

**Requirements**: NEXT_PUBLIC_SITE_URL (for Google/Bing), INDEXNOW_KEY (for IndexNow)

---

### deploy.ts

Triggers Vercel deployment via webhook.

**Runs**:
```bash
npm run deploy-hook
```

**Requirements**: VERCEL_DEPLOY_HOOK_URL in .env

---

## Troubleshooting

### "Module not found: gray-matter"

Install dependencies:
```bash
npm install
```

### Script fails with "Cannot find tsx"

Install tsx:
```bash
npm install -D tsx
```

### Validation shows "too many errors"

- Check character counts (title <70, description 120-160)
- Check word count (minimum 500)
- Ensure category is one of: collab-cafes, anime-pilgrimage, area-guides, travel-tips
- Add at least 2 headings and an FAQ section

### Score is too low

Review weak areas in output:
- **Word count 0/15**: Article too short, add more content
- **Internal links 0/10**: Add 3+ links using `[text](/article-slug)`
- **FAQ 0/10**: Add FAQ section with 3+ Q&As
- **Images 0/10**: Add 3+ images to content
- **Readability 0-5/15**: Shorter paragraphs, more varied sentence length

### Auto-link finds no opportunities

Articles might already be heavily linked or have no overlapping keywords. This is fine.

### Deploy-hook fails

- Check VERCEL_DEPLOY_HOOK_URL is set in .env
- Verify URL is correct (from Vercel dashboard)
- Ensure it's a POST endpoint

---

## Architecture

### Directories

```
/scripts/
  ├── templates/           # Article templates
  │   ├── collab-cafe.md
  │   ├── pilgrimage.md
  │   ├── area-guide.md
  │   └── travel-tip.md
  ├── validate-articles.ts
  ├── score-article.ts
  ├── new-article.ts
  ├── auto-link.ts
  ├── freshness-check.ts
  ├── ping-search-engines.ts
  └── deploy.ts

/content/articles/          # Published articles (.md files)

/.github/workflows/
  └── content-check.yml     # CI validation on PRs
```

### How Articles Flow

```
Create (npm run new-article)
  ↓
Edit (add content, images, links)
  ↓
Validate (npm run validate) → Fix issues if needed
  ↓
Score (npm run score) → Improve quality if needed
  ↓
Auto-link (npm run auto-link --apply)
  ↓
Commit & Push
  ↓
GitHub Actions validates on PR
  ↓
Merge to main
  ↓
Deploy (npm run deploy-hook or Vercel auto-deploy)
  ↓
Ping (npm run ping) → Google, Bing, IndexNow
```

---

## Performance Tips

- **Validation**: O(n) where n = number of articles (~100ms per 50 articles)
- **Scoring**: ~50ms per article
- **Auto-link**: ~200ms for 50 articles
- **Freshness check**: ~150ms for 50 articles

All scripts run instantly on modern hardware.

---

## Support

For issues or improvements to the pipeline, check:
- Article templates: `/scripts/templates/`
- Validation rules: `/scripts/validate-articles.ts`
- Scoring criteria: `/scripts/score-article.ts`
- CI workflow: `/.github/workflows/content-check.yml`

---

**Last updated**: 2026-04-08
