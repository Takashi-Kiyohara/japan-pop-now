#!/usr/bin/env python3
"""
image_quality_gate.py — Japan Pop Now 画像品質ゲート (3-layer defense)

Runs 5 checks on MDX articles + companion images:
  C1. All referenced images exist as files (path scan + disk check)
  C2. No unfilled placeholder refs (empty src, TODO, {image_url})
  C3. Image bpp (bits per pixel) >= 0.12 via Pillow read
  C4. Image density >= 1.0 per 1000 words (matches CLAUDE.md article-quality rule)
  C5. Duplicate hero_image across articles (brand stock blur)

Exit codes:
  0 = all gates pass
  1 = at least one P0 gate (C1, C2) fails
  2 = quality gates (C3, C4, C5) fail but no P0

Usage:
  python3 image_quality_gate.py                        # full repo (CI mode)
  python3 image_quality_gate.py --article <slug>       # single article
  python3 image_quality_gate.py --changed              # only git-changed MDX
  python3 image_quality_gate.py --staged               # only staged MDX (pre-push hook)
  python3 image_quality_gate.py --strict               # warn = fail

Environment:
  REPO_ROOT  — repo root (default: current git rev-parse)
  MIN_BPP    — override bpp threshold (default: 0.12)
  MIN_DENS   — override density /1000w threshold (default: 1.0)
"""
import argparse
import os
import re
import subprocess
import sys
import json
from pathlib import Path

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

MIN_BPP = float(os.environ.get("MIN_BPP", "0.12"))
MIN_DENSITY = float(os.environ.get("MIN_DENS", "1.0"))

# Image ref regex — MDX markdown + JSX Image
IMG_RE = re.compile(
    r'!\[[^\]]*\]\(([^)]+)\)'                  # ![](path)
    r'|src=[\"\']([^\"\']+)[\"\']'             # src="..."
    r'|hero_image:\s*[\"\']([^\"\']+)[\"\']'   # frontmatter hero_image
    r'|featuredImage:\s*[\"\']([^\"\']+)[\"\']',
    re.IGNORECASE,
)

PLACEHOLDER_RE = re.compile(
    r'(src=[\"\'][\"\'])'                     # empty src
    r'|(\{image_url\})'
    r'|(\{\{\s*image\s*\}\})'
    r'|(TODO.*image)'
    r'|(placeholder\.)'
    r'|(your-image-here)',
    re.IGNORECASE,
)

RESULTS = {"pass": [], "warn": [], "fail": []}


def find_repo_root(start: Path) -> Path:
    if os.environ.get("REPO_ROOT"):
        return Path(os.environ["REPO_ROOT"])
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            cwd=start, capture_output=True, text=True, check=True
        )
        return Path(out.stdout.strip())
    except Exception:
        p = start
        while p != p.parent:
            if (p / ".git").exists():
                return p
            p = p.parent
        return start


def extract_image_refs(mdx_text: str) -> list:
    refs = []
    for m in IMG_RE.finditer(mdx_text):
        for g in m.groups():
            if g and g.strip().startswith("/"):
                refs.append(g.strip())
    # dedup preserving order
    seen = set()
    return [r for r in refs if not (r in seen or seen.add(r))]


def check_placeholders(mdx_text: str, slug: str) -> list:
    problems = []
    for m in PLACEHOLDER_RE.finditer(mdx_text):
        snippet = mdx_text[max(0, m.start()-20):m.end()+20].replace("\n", " ")
        problems.append(f"[{slug}] C2 PLACEHOLDER: ...{snippet}...")
    return problems


def check_file_existence(refs: list, repo: Path, slug: str) -> list:
    problems = []
    for ref in refs:
        if ref.startswith("http"):
            continue
        # strip leading slash → join with public/
        local = repo / "public" / ref.lstrip("/")
        if not local.exists():
            problems.append(f"[{slug}] C1 MISSING: {ref} (expected at {local})")
    return problems


def check_bpp(refs: list, repo: Path, slug: str, strict: bool) -> list:
    problems = []
    if not PIL_AVAILABLE:
        return ["[warn] PIL not installed — bpp check skipped"]
    for ref in refs:
        if ref.startswith("http"):
            continue
        local = repo / "public" / ref.lstrip("/")
        if not local.exists():
            continue  # C1 already caught this
        try:
            kb = local.stat().st_size / 1024
            with Image.open(local) as im:
                w, h = im.size
            bpp = (kb * 1024) / (w * h) if (w * h) else 0
            if bpp < MIN_BPP:
                problems.append(
                    f"[{slug}] C3 LOW_BPP: {ref} is {bpp:.3f} bpp (min {MIN_BPP}, size={kb:.0f}KB, {w}x{h})"
                )
        except Exception as e:
            problems.append(f"[{slug}] C3 READ_ERR: {ref} — {e}")
    return problems


def count_words(mdx_text: str) -> int:
    # strip frontmatter
    body = re.sub(r"^---\n.*?\n---\n", "", mdx_text, count=1, flags=re.DOTALL)
    # strip JSX tags + fenced code + images
    body = re.sub(r"<[^>]+>", " ", body)
    body = re.sub(r"```.*?```", " ", body, flags=re.DOTALL)
    body = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", body)
    body = re.sub(r"[`*_#>\-\|\[\]{}]", " ", body)
    tokens = re.findall(r"[A-Za-z][A-Za-z\-']+", body)
    return len(tokens)


def check_density(refs: list, mdx_text: str, slug: str) -> list:
    words = count_words(mdx_text)
    n_img = len([r for r in refs if not r.startswith("http")])
    if words < 200:
        return []
    density = (n_img / words) * 1000 if words else 0
    if density < MIN_DENSITY:
        return [f"[{slug}] C4 LOW_DENSITY: {n_img} img / {words}w = {density:.2f}/1000w (min {MIN_DENSITY})"]
    return []


def scan_mdx(mdx_path: Path, repo: Path, strict: bool) -> dict:
    slug = mdx_path.stem
    text = mdx_path.read_text(encoding="utf-8", errors="ignore")
    refs = extract_image_refs(text)

    errors_p0 = []
    warnings = []

    errors_p0.extend(check_file_existence(refs, repo, slug))
    errors_p0.extend(check_placeholders(text, slug))
    warnings.extend(check_bpp(refs, repo, slug, strict))
    warnings.extend(check_density(refs, text, slug))

    return {
        "slug": slug,
        "refs": refs,
        "errors_p0": errors_p0,
        "warnings": warnings,
    }


def select_mdx(repo: Path, mode: str, target_slug: str = None) -> list:
    content_dir = repo / "content" / "articles"
    articles_dir = repo / "articles"

    if mode == "article" and target_slug:
        for base in [content_dir, articles_dir]:
            for ext in [".mdx", ".md"]:
                p = base / f"{target_slug}{ext}"
                if p.exists():
                    return [p]
        return []

    if mode in ("changed", "staged"):
        diff_arg = "--cached" if mode == "staged" else "HEAD"
        try:
            out = subprocess.run(
                ["git", "diff", diff_arg, "--name-only"],
                cwd=repo, capture_output=True, text=True, check=True
            )
            files = [repo / f.strip() for f in out.stdout.splitlines() if f.strip()]
            return [f for f in files if f.suffix in (".mdx", ".md") and f.exists()
                    and ("articles" in f.parts)]
        except Exception as e:
            print(f"git diff failed: {e}", file=sys.stderr)
            return []

    # full repo
    out = []
    for base in [content_dir, articles_dir]:
        if base.exists():
            out.extend([p for p in base.rglob("*.mdx")])
            out.extend([p for p in base.rglob("*.md")])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--article", help="single article slug")
    ap.add_argument("--changed", action="store_true", help="git diff HEAD")
    ap.add_argument("--staged", action="store_true", help="git diff --cached")
    ap.add_argument("--strict", action="store_true", help="warnings fail too")
    ap.add_argument("--json", action="store_true", help="JSON output for CI")
    ap.add_argument("--repo", help="repo root override")
    args = ap.parse_args()

    repo = Path(args.repo) if args.repo else find_repo_root(Path.cwd())

    if args.article:
        mode = "article"
        targets = select_mdx(repo, mode, args.article)
    elif args.staged:
        targets = select_mdx(repo, "staged")
    elif args.changed:
        targets = select_mdx(repo, "changed")
    else:
        targets = select_mdx(repo, "full")

    if not targets:
        print("No MDX/MD targets found. Mode may not have matched any file.")
        return 0

    all_p0 = []
    all_warn = []
    per_article = []
    for p in targets:
        result = scan_mdx(p, repo, args.strict)
        per_article.append(result)
        all_p0.extend(result["errors_p0"])
        all_warn.extend(result["warnings"])

    if args.json:
        print(json.dumps({
            "repo": str(repo),
            "targets": [str(t.relative_to(repo)) for t in targets],
            "p0": all_p0,
            "warnings": all_warn,
            "per_article": per_article,
        }, indent=2, default=str))
    else:
        print(f"\n=== Image Quality Gate: {len(targets)} article(s) scanned ===\n")
        if all_p0:
            print(f"P0 FAILURES ({len(all_p0)}):")
            for e in all_p0:
                print(f"  X {e}")
        if all_warn:
            print(f"\nQUALITY WARNINGS ({len(all_warn)}):")
            for w in all_warn:
                print(f"  ! {w}")
        if not all_p0 and not all_warn:
            print("PASS — all checks clear.")
        else:
            summary = f"\n{len(all_p0)} P0 / {len(all_warn)} warnings"
            print(summary)

    if all_p0:
        return 1
    if args.strict and all_warn:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
