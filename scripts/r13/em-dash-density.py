#!/usr/bin/env python3
"""Em-dash density scan: count `—` per 1,000 words per article."""
import re
from pathlib import Path
import sys

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

def density(text: str) -> tuple[int, int, float]:
    # Strip frontmatter
    if text.startswith("---"):
        end = text.find("---", 4)
        if end != -1:
            text = text[end + 3:]
    em_count = text.count("—")
    words = len(re.findall(r"\b\w+\b", text))
    per_k = (em_count / max(words, 1)) * 1000
    return em_count, words, per_k


results = []
for path in sorted(ROOT.iterdir()):
    if path.suffix not in (".md", ".mdx"):
        continue
    text = path.read_text(encoding="utf-8")
    em, words, per_k = density(text)
    results.append((path.stem, em, words, round(per_k, 2)))

# Sort by per_k desc
results.sort(key=lambda r: -r[3])

print(f"{'slug':60} {'em':>6} {'words':>8} {'per_1k':>8}")
print("-" * 84)
over_4 = []
for slug, em, words, per_k in results:
    marker = "  <-- OVER 4/k" if per_k > 4 else ""
    if per_k >= 1:  # only show >= 1 em-dash density
        print(f"{slug:60} {em:>6} {words:>8} {per_k:>8.2f}{marker}")
    if per_k > 4:
        over_4.append(slug)

print("\n--- Summary ---")
print(f"Total articles: {len(results)}")
print(f"Articles >4/k em-dash density: {len(over_4)}")
if over_4:
    print("Slugs needing em-dash sweep:")
    for s in over_4:
        print(f"  {s}")
