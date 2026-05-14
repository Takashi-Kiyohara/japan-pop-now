#!/usr/bin/env python3
"""R14-C: em-dash sweep targeting top-N articles for density ≤4/k.

Strategy: replace approximately half of em-dashes with period / comma / parentheses.
Preserve em-dash only for:
  - dialogue-style parenthetical clauses where alternatives reduce readability
  - frontmatter (untouched)

Heuristic replacement order (priority):
  1. ` — ` between two clauses ending in word → replace with `. `
  2. ` — ` followed by lowercase word → replace with `, ` (continuing thought)
  3. ` — ` preceded by short phrase → replace with `: ` (introduces detail)

Random-walk: alternate between rules so the per-article density drops below 4/k
without flattening voice variety entirely.

Usage: python scripts/r14/em-dash-sweep.py <slug-list-file-or-comma-separated>
       python scripts/r14/em-dash-sweep.py --top 25
"""
import re
import sys
import random
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")


def split_frontmatter(text: str) -> tuple[str, str]:
    if not text.startswith("---"):
        return "", text
    end = text.find("---", 4)
    if end == -1:
        return "", text
    return text[: end + 3], text[end + 3:]


def density(body: str) -> float:
    em = body.count("—")
    words = len(re.findall(r"\b\w+\b", body))
    return (em / max(words, 1)) * 1000


def sweep(body: str, target_density: float = 3.5) -> tuple[str, int]:
    """Drop em-dashes by alternating replacements until density ≤ target."""
    rng = random.Random(42)  # deterministic
    n_replaced = 0
    while density(body) > target_density:
        em_positions = [m.start() for m in re.finditer(r" — ", body)]
        if not em_positions:
            break
        # remove every other em-dash, starting with a random offset
        offset = n_replaced % 2  # alternate
        candidates = em_positions[offset::2]
        if not candidates:
            candidates = em_positions[: 1]
        pos = rng.choice(candidates)
        before = body[max(0, pos - 60):pos]
        after = body[pos + 3:pos + 60]
        # heuristic replacement choice
        if re.search(r"[a-z]$", before.strip()) and re.search(r"^[A-Z]", after.strip()):
            repl = ". "
        elif re.search(r"^[a-z]", after.strip()):
            repl = ", "
        else:
            repl = ": "
        body = body[:pos] + repl + body[pos + 3:]
        n_replaced += 1
        if n_replaced > 200:  # safety stop
            break
    return body, n_replaced


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print(__doc__)
        sys.exit(1)

    targets: list[str] = []
    if sys.argv[1] == "--top" and len(sys.argv) > 2:
        n = int(sys.argv[2])
        results = []
        for path in sorted(ROOT.iterdir()):
            if path.suffix not in (".md", ".mdx"):
                continue
            text = path.read_text(encoding="utf-8")
            _, body = split_frontmatter(text)
            d = density(body)
            results.append((d, path.stem))
        results.sort(reverse=True)
        targets = [slug for _, slug in results[:n]]
    else:
        if "," in sys.argv[1]:
            targets = sys.argv[1].split(",")
        else:
            targets = [sys.argv[1]]

    summary = []
    for slug in targets:
        for ext in (".md", ".mdx"):
            path = ROOT / (slug + ext)
            if not path.exists():
                continue
            text = path.read_text(encoding="utf-8")
            fm, body = split_frontmatter(text)
            before_d = density(body)
            new_body, n = sweep(body)
            after_d = density(new_body)
            if n > 0:
                path.write_text(fm + new_body, encoding="utf-8")
                summary.append((slug, before_d, after_d, n))
                print(f"  {slug}: {before_d:.2f} -> {after_d:.2f} /k ({n} replaced)")
            else:
                print(f"  {slug}: {before_d:.2f} /k (no change needed)")
            break

    print(f"\nTotal articles modified: {len(summary)}")


if __name__ == "__main__":
    main()
