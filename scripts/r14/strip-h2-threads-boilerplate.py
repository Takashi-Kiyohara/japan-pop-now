#!/usr/bin/env python3
"""R14-cleanup R2: strip the H2 'Never Miss a Cafe Opening or Anime Event'
boilerplate section (and the bare [Follow on Threads](...) link inside).

50 articles carry an H2 block of the form:
    ## Never Miss a Cafe Opening or Anime Event
    Join 1,000+ Japan pop culture fans. Weekly updates...

    [Follow on Threads](https://www.threads.net/@pop_now_jp)

    Follow for weekly collab cafe updates & Japan pop culture content.

This H2 was the source of the residual duplicate Threads CTA render flagged
by R14-cleanup external Critic (agentId a97fb6296e7eee19b). The component
auto-injects the Threads CTA at article-end, so this body section is a
duplicate of the same intent.

Strip the entire H2 section up to the next H2 or end of document.
"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

# Match the H2 header through the body (everything before the next ## H2
# or end of file). Tolerates whitespace and the variable closing paragraph.
PATTERN = re.compile(
    r"\n##\s+Never Miss a Cafe Opening or Anime Event\s*\n"  # H2 line
    r"(?:.*?\n)*?"                                            # zero or more body lines (non-greedy)
    r"(?=\n##?#?\s|\Z)",                                       # stop at next H2 OR H3 OR end
    re.MULTILINE,
)

modified = 0
for path in sorted(ROOT.iterdir()):
    if path.suffix not in (".md", ".mdx"):
        continue
    text = path.read_text(encoding="utf-8")
    new_text, n = PATTERN.subn("\n", text)
    if n > 0:
        path.write_text(new_text, encoding="utf-8")
        modified += 1
        print(f"  stripped {n}: {path.name}")

print(f"\nArticles modified: {modified}")
