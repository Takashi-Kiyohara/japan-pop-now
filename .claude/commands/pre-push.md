---
description: Pre-push safety check — build-validator + affiliate-auditor + secret scan on staged files
---

Before any push to main, run:

1. **Build validator** — invoke `build-validator` subagent. Must return ALL PASS.

2. **Affiliate audit on staged articles** — for any article in `git diff --cached --name-only` matching `content/articles/*.md`, invoke `affiliate-auditor`. Any CRITICAL blocks push.

3. **Secret scan** — `git diff --cached | grep -E '(gh[pousr]_|AKIA|AIza|sk_live_|sk-ant|xox[baprs]-|BEGIN.*PRIVATE KEY)'`. Any match = BLOCK.

4. **Branch check** — if on main, require 0 TS errors. If on feature branch, warn about TS errors but allow.

5. **SEO spot check** — if ≥ 1 article staged, invoke `seo-auditor` on those specifically.

Report:
```
## Pre-push report
- Build: PASS
- Affiliate: PASS (3 articles audited, 0 critical)
- Secrets: PASS
- Branch: main (TS clean)
- SEO: 1 MED warning on {slug}:line

VERDICT: safe to push
```

Only on all-pass, run `git push origin {current-branch}` with user confirmation.
