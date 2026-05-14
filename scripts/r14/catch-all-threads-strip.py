#!/usr/bin/env python3
"""R14-final: catch-all strip of remaining @pop_now_jp body references.

Surfaces 4 inline pattern variants that prior cleanups missed:

  (a) "Share on Threads:" CTA paragraph
        **Share on Threads:** "<quote>" — Tag **[@pop_now_jp](https://www.threads.net/@pop_now_jp)**
      (and variant: ...Share your experience on Threads — tag ...)

  (b) Orphan bullet at end of a related-links list
        - [@pop_now_jp](https://www.threads.net/@pop_now_jp)

  (c) Inline prose link
        For the fastest updates, follow **[@pop_now_jp](https://www.threads.net/@pop_now_jp)**.

  (d) Table row in venue meta block
        | **Threads** | [@pop_now_jp](https://www.threads.net/@pop_now_jp) |

  (e) Naruto literal text (R14-A renamed @japanpopnow→@pop_now_jp but didn't strip)
        Tag us in your Naruto pilgrimage photos on Threads: @pop_now_jp

The ThreadsCTA component auto-injects the Threads CTA at article-end.
All inline body references are duplicates that should be removed.

Usage:
    python scripts/r14/catch-all-threads-strip.py
"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    # (a) Share on Threads CTA — multi-quote variants, may end in ** or **#tag**
    # Includes optional colon after "Share on Threads" (file format `**Share on Threads:**`)
    ("share-on-threads-CTA", re.compile(
        r"^\*\*(?:Share on Threads:?|Have a [^*]+\?)\*\*[^\n]*\[@pop_now_jp\]\(https://www\.threads\.net/@pop_now_jp\)[^\n]*\n?",
        re.MULTILINE,
    )),
    # (b) Orphan bullet
    ("orphan-bullet", re.compile(
        r"^[ \t]*[-*]\s+\[@pop_now_jp\]\(https://www\.threads\.net/@pop_now_jp\)\s*\n?",
        re.MULTILINE,
    )),
    # (c) Inline prose
    ("inline-prose-follow", re.compile(
        r"^[^\n]*\bfollow\s+\*?\*?\[@pop_now_jp\]\(https://www\.threads\.net/@pop_now_jp\)\*?\*?[^\n]*\n?",
        re.MULTILINE | re.IGNORECASE,
    )),
    # (d) Table row in venue meta
    ("table-row-threads", re.compile(
        r"^\|\s*\*\*Threads\*\*\s*\|\s*\[@pop_now_jp\]\(https://www\.threads\.net/@pop_now_jp\)\s*\|\s*\n?",
        re.MULTILINE,
    )),
    # (e) Naruto-style literal text
    ("inline-tag-literal", re.compile(
        r"^[^\n]*\bTag us in[^\n]*?@pop_now_jp[^\n]*\n?",
        re.MULTILINE,
    )),
]


def main():
    grand_total = 0
    per_pattern: dict[str, int] = {name: 0 for name, _ in PATTERNS}
    files_modified: set[str] = set()

    for path in sorted(ROOT.iterdir()):
        if path.suffix not in (".md", ".mdx"):
            continue
        text = path.read_text(encoding="utf-8")
        per_file = 0
        for name, pat in PATTERNS:
            new_text, n = pat.subn("", text)
            if n > 0:
                text = new_text
                per_pattern[name] += n
                per_file += n
        if per_file > 0:
            path.write_text(text, encoding="utf-8")
            files_modified.add(path.name)
            print(f"  {path.name}: stripped {per_file}")
            grand_total += per_file

    print(f"\nPer-pattern strip counts:")
    for name, n in per_pattern.items():
        print(f"  {name}: {n}")
    print(f"\nTotal lines stripped: {grand_total} across {len(files_modified)} files")


if __name__ == "__main__":
    main()
