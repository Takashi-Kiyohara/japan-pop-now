---
description: Daily standup — read STATUS.json, list pending drafts/rewrites/QA items, propose top 3 tasks for today
---

1. Read `content_operations/STATUS.json` — report:
   - Last Cowork task run
   - Last Claude session end
   - Current lock state

2. List pending items:
   - `content_operations/drafts/*.md` → count + top 3 slugs
   - `content_operations/rewrites/*.md` → count + top 3 slugs
   - `content_operations/reports/qa-*.md` → latest, summarize unresolved issues
   - `content_operations/QUEUE.md` → P0 and P1 items

3. Check git status:
   - Unstaged changes?
   - Unpushed commits on current branch?

4. Propose top 3 tasks for today, ranked by:
   - Revenue impact (affiliate CRITICAL > SEO HIGH > content)
   - Staleness (older drafts first)
   - Effort (quick wins before multi-hour work)

5. Output format:
   ```
   ## Daily Ops — YYYY-MM-DD

   ### Pending queue
   - Drafts: {n} (oldest: {slug} from {date})
   - Rewrites: {n}
   - QA issues: {n} unresolved

   ### Proposed for today
   1. [P0] … — ~{mins}
   2. [P1] … — ~{mins}
   3. [P1] … — ~{mins}
   ```

Do not start work until user picks one.
