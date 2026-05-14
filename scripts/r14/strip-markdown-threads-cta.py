#!/usr/bin/env python3
"""R14-cleanup: strip markdown-style inline Threads CTA from article MDX.

The prior R14-D regex caught only the HTML `<div className="jpn-cta">` wrapper.
29 articles use a plain markdown form instead:
    **Follow [@pop_now_jp](https://www.threads.net/@pop_now_jp)** for daily
    Tokyo pop culture updates.

The ThreadsCTA component auto-injects at article-end, so the inline body
copies are now duplicates.

Args: optional batch slice (start, end) for staged commits.
    python scripts/r14/strip-markdown-threads-cta.py            # all 29
    python scripts/r14/strip-markdown-threads-cta.py 0 10       # first 10
    python scripts/r14/strip-markdown-threads-cta.py 10 20      # next 10
    python scripts/r14/strip-markdown-threads-cta.py 20 30      # last 9
"""
import re
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

# Match a whole-line markdown-style Threads CTA. The line may be wrapped in
# bold (`**...**`) and end with a tail clause ("for daily updates", "for event
# tips", etc.). Strip the line plus any single trailing blank line.
PATTERN = re.compile(
    r"^[ \t]*\**Follow \[@pop_now_jp\]\(https://www\.threads\.net/@pop_now_jp\)\**[^\n]*\n?",
    re.MULTILINE,
)


def main():
    start = 0
    end = None
    if len(sys.argv) >= 3:
        start = int(sys.argv[1])
        end = int(sys.argv[2])

    candidates = []
    for path in sorted(ROOT.iterdir()):
        if path.suffix not in (".md", ".mdx"):
            continue
        text = path.read_text(encoding="utf-8")
        if PATTERN.search(text):
            candidates.append(path)

    if end is None:
        end = len(candidates)
    targets = candidates[start:end]

    print(f"Total candidates: {len(candidates)}; processing slice [{start}:{end}] = {len(targets)} articles")
    modified = 0
    for path in targets:
        text = path.read_text(encoding="utf-8")
        new_text, n = PATTERN.subn("", text)
        if n > 0:
            path.write_text(new_text, encoding="utf-8")
            modified += 1
            print(f"  stripped {n}: {path.name}")

    print(f"\nArticles modified: {modified}")


if __name__ == "__main__":
    main()
