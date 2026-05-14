#!/usr/bin/env python3
"""R15 Phase 0.3+0.4: probe URLs OUTSIDE the sitemap for redirect-error / 404 candidates.

GSC export 5/8 shows:
  - 20 redirect-error URLs
  - 2 404 URLs
  - 63 crawl-not-indexed
  - 66 detected-not-indexed

These are URLs Google has in its index from prior site state but our
current sitemap doesn't list. Candidates:

  - WP legacy date URLs:  /YYYY/MM/DD/<slug>
  - WP legacy query URLs: /?p=N / /?cat=N / /?tag=foo / /?feed=rss2 / /?paged=N
  - Uppercase /Articles/<slug>  (case-canonicalize)
  - Deprecated slugs in DELETED_ARTICLE_SLUGS
  - 6 cannibalization slugs (have canonical/noindex but might still show GSC error)
  - /tag/<slug>  (singular form vs plural /tags/<slug>)
  - /feed/ (root /feed/)
  - /menu, /bookmarks (deprecated nav)
  - WordPress author/category archive: /author/<n>, /category/<n>
"""
import concurrent.futures
import json
import sys
import urllib.request
from pathlib import Path

OUT_JSON = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\tmp\r15\non-sitemap-probe.json")
SITE = "https://www.japan-pop-now.com"
UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"


def trace(url: str, max_hops: int = 8, timeout: float = 10.0) -> dict:
    """Follow redirects, recording each hop."""
    chain: list[dict] = []
    current = url
    seen: set[str] = set()
    for hop in range(max_hops):
        if current in seen:
            chain.append({"url": current, "status": "LOOP"})
            break
        seen.add(current)
        req = urllib.request.Request(current, method="HEAD", headers={"User-Agent": UA})
        opener = urllib.request.build_opener(urllib.request.HTTPRedirectHandler)
        opener.handle_open = lambda *a, **kw: None  # not used
        try:
            req = urllib.request.Request(current, method="HEAD", headers={"User-Agent": UA})
            # use raw — don't auto-follow
            with urllib.request.urlopen(urllib.request.Request(
                current, method="HEAD", headers={"User-Agent": UA}
            ), timeout=timeout) as resp:
                status = resp.status
                location = resp.headers.get("Location", "")
                xrobots = resp.headers.get("X-Robots-Tag", "")
                chain.append({"url": current, "status": status, "xrobots": xrobots})
                # urlopen auto-follows by default; we got the final response
                # So break unless status 3xx (which urlopen wouldn't pass back here)
                break
        except urllib.error.HTTPError as e:
            status = e.code
            location = e.headers.get("Location", "") if e.headers else ""
            xrobots = e.headers.get("X-Robots-Tag", "") if e.headers else ""
            chain.append({"url": current, "status": status, "location": location, "xrobots": xrobots})
            if 300 <= status < 400 and location:
                # urlopen normally auto-follows 3xx, but if not relative we may
                # land here. Construct absolute.
                if location.startswith("/"):
                    current = SITE + location
                else:
                    current = location
                continue
            break
        except Exception as e:
            chain.append({"url": current, "error": str(e)})
            break
    return {"chain": chain, "final_status": chain[-1].get("status") if chain else None, "hops": len(chain)}


def probe_no_follow(url: str, timeout: float = 10.0) -> dict:
    """Single fetch WITHOUT following redirects. Use urllib manually."""
    try:
        # Build a request with no_redirect by using a custom handler
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None

        opener = urllib.request.build_opener(NoRedirect)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with opener.open(req, timeout=timeout) as resp:
                return {
                    "status": resp.status,
                    "location": resp.headers.get("Location", ""),
                    "xrobots": resp.headers.get("X-Robots-Tag", ""),
                }
        except urllib.error.HTTPError as e:
            return {
                "status": e.code,
                "location": e.headers.get("Location", "") if e.headers else "",
                "xrobots": e.headers.get("X-Robots-Tag", "") if e.headers else "",
            }
    except Exception as e:
        return {"status": -1, "error": str(e)}


# Candidate URL patterns
CANDIDATES: list[tuple[str, str]] = [
    # WP legacy date URLs (test a few date+slug combos)
    ("wp-date-real", f"{SITE}/2026/04/02/dragon-ball-marugame-seimen-collab-2026"),
    ("wp-date-deleted", f"{SITE}/2024/03/15/some-deleted-slug-that-never-existed"),
    # WP query URLs (root only per WP_LEGACY_QUERY_PARAMS)
    ("wp-p", f"{SITE}/?p=123"),
    ("wp-cat", f"{SITE}/?cat=1"),
    ("wp-tag", f"{SITE}/?tag=anime"),
    ("wp-feed", f"{SITE}/?feed=rss2"),
    ("wp-paged", f"{SITE}/?paged=2"),
    ("wp-page-id", f"{SITE}/?page_id=42"),
    ("wp-author", f"{SITE}/?author=1"),
    ("wp-m", f"{SITE}/?m=202604"),
    ("wp-s", f"{SITE}/?s=anime"),
    # /Articles/ uppercase (case-canonicalize)
    ("uppercase-articles", f"{SITE}/Articles/dragon-ball-marugame-seimen-collab-2026"),
    # Legacy slug redirects (LEGACY_ARTICLE_SLUGS)
    ("legacy-ucj", f"{SITE}/universal-cool-japan-2026-guide"),
    ("legacy-osaka", f"{SITE}/osaka-anime-guide-den-den-town"),
    ("legacy-onepiece-kumamoto", f"{SITE}/one-piece-kumamoto-statue-tour"),
    ("legacy-animate-cafe", f"{SITE}/animate-cafe-guide-japan"),
    ("legacy-anime-pilgrimage", f"{SITE}/anime-pilgrimage-spots-tokyo"),
    ("legacy-your-name", f"{SITE}/your-name-pilgrimage-tokyo"),
    ("legacy-esim", f"{SITE}/japan-esim-pocket-wifi-sim-card"),
    # Deleted slugs (should return 410)
    ("deleted-onepiece-cafe-gene", f"{SITE}/articles/one-piece-cafe-gene-parco-2026"),
    ("deleted-find-by-anime", f"{SITE}/articles/find-by-anime-in-japan-2026-pilgrimage-guides-by-series"),
    # 6 cannibalization slugs (have robots:noindex in frontmatter; should they
    # be 200-with-noindex or redirected? Let's see)
    ("cannib-demon-rerun", f"{SITE}/articles/demon-slayer-rerun-cafe-ufotable-2026"),
    ("cannib-osaka-collab", f"{SITE}/articles/osaka-anime-collab-cafes-pop-culture-2026"),
    ("cannib-jr-pass-anime", f"{SITE}/articles/japan-rail-pass-guide-anime-fans"),
    ("cannib-jr-pass-pilgrimage", f"{SITE}/articles/jr-pass-anime-pilgrimage-routes-2026"),
    ("cannib-conan-cafe", f"{SITE}/articles/detective-conan-cafe-2026-japan-guide"),
    ("cannib-slamdunk-kamakura", f"{SITE}/articles/slam-dunk-kamakura-pilgrimage-2026"),
    # Category migration (R10 setup)
    ("cat-old-collab", f"{SITE}/category/collab-cafes"),
    ("cat-old-pilgrimage", f"{SITE}/category/anime-pilgrimage"),
    ("cat-old-area", f"{SITE}/category/area-guides"),
    ("cat-old-travel", f"{SITE}/category/travel-tips"),
    # Singular tag form
    ("tag-singular", f"{SITE}/tag/anime"),
    ("tag-singular-2", f"{SITE}/tags/anime"),  # plural form
    # Root feed
    ("root-feed", f"{SITE}/feed/"),
    ("root-feed-noslash", f"{SITE}/feed"),
    # Deprecated paths
    ("menu", f"{SITE}/menu"),
    ("bookmarks", f"{SITE}/bookmarks"),
    # Some that GSC tools commonly flag
    ("apex-naked", "https://japan-pop-now.com"),
    ("apex-naked-path", "https://japan-pop-now.com/articles/dragon-ball-marugame-seimen-collab-2026"),
]


def main():
    results: list[dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(probe_no_follow, url): (label, url) for label, url in CANDIDATES}
        for fut in concurrent.futures.as_completed(futs):
            label, url = futs[fut]
            res = fut.result()
            results.append({"label": label, "url": url, **res})

    results.sort(key=lambda r: r["label"])
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print(f"{'label':35} {'status':>6}  location/xrobots")
    print("-" * 100)
    for r in results:
        status = r.get("status", "?")
        location = r.get("location", "")
        xrobots = r.get("xrobots", "")
        extra = location if location else (f"X-Robots-Tag: {xrobots}" if xrobots else "")
        print(f"{r['label']:35} {status:>6}  {extra}")


if __name__ == "__main__":
    main()
