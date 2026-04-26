#!/usr/bin/env python3
"""
check-image-mdx-refs.py — pre-commit / CI safeguard against missing-file regressions.

Scans every article in `content/articles/*.{md,mdx}`, extracts all image references
that point under `/images/articles/`, and verifies each one has a corresponding file
on disk under `public/images/articles/`.

Why this exists:
    On 2026-04-26 commit `fec8310`, the GitHub Actions Image Quality Gate failed with
    4 P0 C1 MISSING errors because Phase 3b's per-article batch script bled
    pre-staged renames into the first commit and dropped 4 webp files for blue-lock
    on the floor (see docs/incident/quality-gate-fail-20260426.md). MDX referenced
    those files, but the files were never committed. This check would have caught
    that contradiction in seconds.

Coverage of image-reference syntaxes:
    1. Markdown: ![alt](/images/articles/{slug}/{file}.{webp,jpg,jpeg,png})
    2. Frontmatter: featuredImage / heroImage / hero_image / featured_image / cover
    3. JSX <img src="/images/articles/.../{file}">
    4. Next.js <Image src="/images/articles/.../{file}"> (and any other component
       that takes a `src` attribute starting with /images/articles/)
    5. JSON-LD (rare, but `image` fields inside <script type="application/ld+json">
       embedded in MDX) — best-effort, regex catches simple cases.

Exit codes:
    0   all references resolve to existing files
    1   one or more references missing — printed to stderr, suitable for CI fail

Usage:
    python3 scripts/check-image-mdx-refs.py
    python3 scripts/check-image-mdx-refs.py --json   # machine-readable summary
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = REPO_ROOT / "content" / "articles"
IMAGES_ROOT = REPO_ROOT / "public" / "images"

# Single regex captures any /images/articles/{slug}/{file}.ext occurrence regardless
# of the surrounding syntax (markdown ![]() , JSX src="..." , frontmatter value,
# JSON-LD field). Restricting to .webp/.jpg/.jpeg/.png matches the existing repo
# convention; if .gif/.avif/.svg start being used, extend this list.
IMG_REF_RE = re.compile(
    r"/images/articles/[A-Za-z0-9._\-/]+\.(?:webp|jpg|jpeg|png|gif|avif)",
    re.IGNORECASE,
)


def find_article_files() -> list[Path]:
    if not ARTICLES_DIR.is_dir():
        return []
    return sorted(
        p for p in ARTICLES_DIR.iterdir() if p.suffix in (".md", ".mdx")
    )


def extract_refs(text: str) -> set[str]:
    return {m.group(0) for m in IMG_REF_RE.finditer(text)}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="emit JSON report on stdout")
    args = parser.parse_args()

    article_files = find_article_files()
    total_refs = 0
    missing: dict[str, list[str]] = {}
    by_slug_count: dict[str, int] = {}

    for fp in article_files:
        slug = fp.stem
        try:
            text = fp.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            print(f"WARN: cannot read {fp}: {exc}", file=sys.stderr)
            continue
        refs = extract_refs(text)
        by_slug_count[slug] = len(refs)
        total_refs += len(refs)
        for ref in refs:
            # ref looks like /images/articles/{...}/{file}.ext
            local_path = REPO_ROOT / "public" / ref.lstrip("/")
            if not local_path.is_file():
                missing.setdefault(slug, []).append(ref)

    if args.json:
        report = {
            "articles_scanned": len(article_files),
            "total_refs": total_refs,
            "missing_count": sum(len(v) for v in missing.values()),
            "missing_articles": len(missing),
            "missing": missing,
        }
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(f"=== check-image-mdx-refs ===")
        print(f"Articles scanned:    {len(article_files)}")
        print(f"Total image refs:    {total_refs}")
        if not missing:
            print(f"Missing files:       0")
            print(f"Result:              OK -- every MDX-referenced image exists on disk")
            return 0
        miss_count = sum(len(v) for v in missing.values())
        print(f"Missing files:       {miss_count} across {len(missing)} article(s)")
        print(f"Result:              FAIL")
        print()
        print("Per-article breakdown:")
        for slug in sorted(missing):
            print(f"  {slug}:")
            for ref in sorted(missing[slug]):
                print(f"    X {ref}")
        print()
        print(
            "Each MDX/JSX reference under /images/articles/ must have a corresponding "
            "file in public/images/articles/."
        )
        print(
            "Common cause: agent created a webp on disk but the per-article commit "
            "script did not git-add it before committing. See docs/incident/quality-gate-fail-20260426.md."
        )
    return 0 if not missing else 1


if __name__ == "__main__":
    sys.exit(main())
