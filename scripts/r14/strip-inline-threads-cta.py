#!/usr/bin/env python3
"""R14-D step 2: strip inline ThreadsCTA blocks from article MDX.

ThreadsCTA component is auto-injected by app/articles/[slug]/page.tsx.
Articles that ALSO carry the inline jpn-cta block with the identical
"Follow @pop_now_jp on Threads" text now render the CTA twice.
Strip the inline pattern.
"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

# Pattern observed in the corpus:
# <div className="jpn-cta"><p><strong>Follow <a href="..." rel="nofollow" target="_blank">@pop_now_jp on Threads</a></strong> for daily Tokyo pop culture updates.</p></div>
PATTERN = re.compile(
    r'<div (?:className|class)="jpn-cta">\s*<p>.*?@pop_now_jp on Threads.*?</p>\s*</div>\s*\n?',
    re.MULTILINE | re.DOTALL,
)

modified = 0
total = 0
for path in sorted(ROOT.iterdir()):
    if path.suffix not in (".md", ".mdx"):
        continue
    total += 1
    text = path.read_text(encoding="utf-8")
    new_text, n = PATTERN.subn("", text)
    if n > 0:
        path.write_text(new_text, encoding="utf-8")
        modified += 1
        print(f"  stripped {n}: {path.name}")

print(f"\nTotal articles scanned: {total}")
print(f"Articles modified: {modified}")
