#!/usr/bin/env python3
"""R13-H1: strip inline Disclosure blocks from article MDX.

The AffiliateDisclosure component is already auto-injected in
app/articles/[slug]/page.tsx around line 381. Inline disclosures in the
MDX body are duplicates that render the same text twice per article.

This script removes the inline pattern (and the surrounding blank line if
present) from every article. The component-rendered disclosure remains.
"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

# Two patterns observed in the corpus:
#   1. <div className="jpn-tip"><strong>Disclosure:</strong> ...affiliate links...</div>
#   2. Multi-line jpn-tip block
PATTERN_HTML = re.compile(
    r'<div className="jpn-tip"><strong>Disclosure:</strong>[^<]*This article contains affiliate links\.[^<]*</div>\s*\n?',
    re.MULTILINE,
)

# Older markdown variant used in 5 article-set articles:
# **Affiliate Disclosure:** Some links in this article are affiliate links...
PATTERN_MARKDOWN = re.compile(
    r'\*\*Affiliate Disclosure:\*\*\s+Some links in this article are affiliate links\.[^\n]*\n?',
    re.MULTILINE,
)

PATTERNS = [PATTERN_HTML, PATTERN_MARKDOWN]

modified = 0
total = 0
for path in sorted(ROOT.iterdir()):
    if path.suffix not in (".md", ".mdx"):
        continue
    total += 1
    text = path.read_text(encoding="utf-8")
    total_n = 0
    for pattern in PATTERNS:
        text, n = pattern.subn("", text)
        total_n += n
    if total_n > 0:
        path.write_text(text, encoding="utf-8")
        modified += 1
        print(f"  stripped {total_n} inline disclosure(s): {path.name}")

print(f"\nTotal articles scanned: {total}")
print(f"Articles modified: {modified}")
