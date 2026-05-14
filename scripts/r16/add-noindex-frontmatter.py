#!/usr/bin/env python3
"""R16 Phase 2: add `robots: noindex, follow` to 5 user-approved RED articles.

Per user response (AskUserQuestion 2026-05-14): noindex the 5 non-cannibal
forced-RED articles that score 11-13/14 but trip the firsthand/originality
override. These articles drop from sitemap auto-filter (app/sitemap.ts:90
excludes articles with robots:noindex).
"""
import re
from pathlib import Path

ARTS = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

TARGETS = [
    "animejapan-2026-guide-international-visitors",
    "best-anime-tours-tokyo-2026",
    "chainsaw-man-pilgrimage-tokyo",
    "krispy-kreme-mario-galaxy-shibuya-2026",
    "your-name-pilgrimage-tokyo",
]

for slug in TARGETS:
    for ext in (".md", ".mdx"):
        path = ARTS / (slug + ext)
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        # Skip if already has robots: noindex
        if re.search(r"^robots:\s*['\"]?noindex", text, re.MULTILINE):
            print(f"  {slug}{ext}: already noindex, skipping")
            break
        # Insert robots field before the closing --- of frontmatter
        # Pattern: find the first standalone --- after line 1, insert robots line above it
        m = re.match(r"^(---\n.*?\n)(---\n)", text, re.DOTALL)
        if not m:
            print(f"  {slug}{ext}: no frontmatter detected, skipping")
            break
        # Add a comment + the robots field at end of frontmatter
        addition = (
            "# R16 (2026-05-14): forced-RED per HCU firsthand+originality override.\n"
            "# Author/Cowork can rewrite + re-enable indexing later. Sitemap.ts auto-excludes.\n"
            "robots: 'noindex, follow'\n"
        )
        new_text = m.group(1) + addition + m.group(2) + text[m.end():]
        path.write_text(new_text, encoding="utf-8")
        print(f"  {slug}{ext}: added robots noindex")
        break
