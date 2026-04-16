---
description: Full PDCA pipeline — take a draft from content_operations/drafts/, expand, audit, build-validate, commit, push
argument-hint: "{slug or draft filename}"
---

Pipeline for `$ARGUMENTS`:

1. **Read draft**: find the draft in `content_operations/drafts/` matching `$ARGUMENTS` (by slug or filename).

2. **Expand body** following `.claude/rules/article-quality.md`. If it's a cafe article, apply the 9-element stack.

3. **Write to** `content/articles/$ARGUMENTS.md`.

4. **Verify images** — invoke `image-verifier` subagent to confirm all referenced images exist in `public/`.

5. **SEO audit** — invoke `seo-auditor` subagent.

6. **Critic pass (MANDATORY per PDCA 3x rule)** — invoke `article-critic` subagent. If critic finds kill reasons, fix and re-run critic.

7. **Affiliate audit** — invoke `affiliate-auditor` subagent. Fix any CRITICAL issues.

8. **Build validate** — invoke `build-validator` subagent.

9. **Commit**: `content: publish {slug}`

10. **Push** (with user confirmation per security rules).

11. **Update queue**: move the draft entry from "Open" to "Completed" in `content_operations/QUEUE.md`.

At each step, report terse status. Do not ask for confirmation until step 10.
