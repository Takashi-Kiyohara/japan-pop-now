#!/usr/bin/env python3
"""R15 Phase 0.2: live audit of all sitemap URLs across 6 Google bot UAs.

For each URL × UA cell, records:
  - HTTP status
  - X-Robots-Tag header (or NULL)
  - Location header (3xx only)
  - Vary header
  - x-vercel-cache
  - canonical link (200 only)

Output: JSON to tmp/r15/audit-matrix.json + markdown table to stdout.
"""
import concurrent.futures
import json
import re
import sys
import urllib.request
from pathlib import Path

URL_FILE = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\tmp\r15\sitemap-urls.txt")
OUT_JSON = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\tmp\r15\audit-matrix.json")

UAS: list[tuple[str, str]] = [
    ("Googlebot", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"),
    ("InspectionTool", "Mozilla/5.0 (compatible; Google-InspectionTool/1.0; +https://search.google.com/search-console/about)"),
    ("AdsBot", "AdsBot-Google (+http://www.google.com/adsbot.html)"),
    ("Mediapartners", "Mediapartners-Google"),
    ("Googlebot-Image", "Googlebot-Image/1.0"),
    ("Googlebot-Smartphone", "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"),
]


def fetch(url: str, ua: str, timeout: float = 20.0) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = resp.status
            headers = {k: v for k, v in resp.headers.items()}
            body_head = resp.read(4096).decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        status = e.code
        headers = {k: v for k, v in e.headers.items()} if e.headers else {}
        try:
            body_head = e.read(4096).decode("utf-8", errors="replace")
        except Exception:
            body_head = ""
    except Exception as e:
        return {"status": -1, "error": str(e)}

    canonical = ""
    m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', body_head)
    if m:
        canonical = m.group(1)

    return {
        "status": status,
        "xrobots": headers.get("X-Robots-Tag", ""),
        "location": headers.get("Location", ""),
        "vary": headers.get("Vary", ""),
        "vercel_cache": headers.get("X-Vercel-Cache", ""),
        "canonical": canonical,
    }


def audit_url(url: str) -> dict:
    """Audit one URL across all UAs."""
    cells: dict[str, dict] = {}
    for ua_name, ua_str in UAS:
        cells[ua_name] = fetch(url, ua_str)
    return {"url": url, "cells": cells}


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--top":
        urls = URL_FILE.read_text(encoding="utf-8").strip().split("\n")[: int(sys.argv[2])]
    else:
        urls = URL_FILE.read_text(encoding="utf-8").strip().split("\n")
    print(f"Auditing {len(urls)} URLs × {len(UAS)} UAs = {len(urls) * len(UAS)} cells", file=sys.stderr)

    results: list[dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(audit_url, u): u for u in urls}
        for i, fut in enumerate(concurrent.futures.as_completed(futures)):
            r = fut.result()
            results.append(r)
            if (i + 1) % 10 == 0:
                print(f"  {i + 1}/{len(urls)} done", file=sys.stderr)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(results, indent=2), encoding="utf-8")

    # Summary stats
    total_cells = len(results) * len(UAS)
    noindex_cells = 0
    non200_cells = 0
    redirect_cells = 0
    cells_404 = 0
    for r in results:
        for ua_name, cell in r["cells"].items():
            xr = cell.get("xrobots", "") or ""
            if "noindex" in xr.lower():
                noindex_cells += 1
            s = cell.get("status", 0)
            if s != 200:
                non200_cells += 1
                if 300 <= s < 400:
                    redirect_cells += 1
                elif s == 404:
                    cells_404 += 1

    print(json.dumps({
        "total_urls": len(results),
        "total_cells": total_cells,
        "noindex_cells": noindex_cells,
        "non200_cells": non200_cells,
        "redirect_cells": redirect_cells,
        "404_cells": cells_404,
    }, indent=2))


if __name__ == "__main__":
    main()
