---
description: Run all 4 audit subagents on articles from the last 30 days
---

1. List articles in `content/articles/` with `date:` within the last 30 days (via frontmatter).

2. For each article, invoke these subagents IN PARALLEL (single message, multiple Agent tool calls):
   - `seo-auditor`
   - `image-verifier`
   - `affiliate-auditor`
   - `article-critic` (only for articles without `audit_passed: true` in frontmatter)

3. Aggregate findings into `content_operations/reports/audit-$(date +%Y-%m-%d).md`:
   - Group by severity (CRITICAL / HIGH / MED)
   - Group by article slug
   - Estimate revenue impact for affiliate CRITICALs

4. If ≥ 3 articles have CRITICAL issues, append a P0 item to `content_operations/QUEUE.md`.

5. Report summary to user:
   ```
   Audited {n} articles.
   CRITICAL: {n} issues across {m} articles
   HIGH: {n} issues
   Full report: content_operations/reports/audit-{date}.md
   ```
