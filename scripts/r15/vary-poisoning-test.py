#!/usr/bin/env python3
"""R15 Phase 0.5: Vary header poisoning real-world test.

Sequential 4-step fetch per URL: curl → Googlebot → curl → Googlebot.
Records X-Robots-Tag + body hash + x-vercel-cache per step.

Poisoning REAL if step 2 (Googlebot) sees the curl response's noindex
due to cache HIT keyed only on URL.
"""
import hashlib
import json
import sys
import urllib.request
from pathlib import Path

OUT_JSON = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\tmp\r15\vary-poisoning.json")

CURL_UA = "curl/8.0.1"
GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

TEST_URLS = [
    "https://www.japan-pop-now.com/",
    "https://www.japan-pop-now.com/articles/dragon-ball-marugame-seimen-collab-2026",
    "https://www.japan-pop-now.com/articles/jojo-stone-ocean-cafe-jojo-world-2026",
    "https://www.japan-pop-now.com/cafes",
    "https://www.japan-pop-now.com/articles",
]


def fetch(url: str, ua: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read()
            return {
                "status": resp.status,
                "xrobots": resp.headers.get("X-Robots-Tag", ""),
                "vary": resp.headers.get("Vary", ""),
                "vercel_cache": resp.headers.get("X-Vercel-Cache", ""),
                "body_md5": hashlib.md5(body).hexdigest()[:10],
                "body_len": len(body),
            }
    except urllib.error.HTTPError as e:
        return {
            "status": e.code,
            "xrobots": e.headers.get("X-Robots-Tag", "") if e.headers else "",
            "vary": e.headers.get("Vary", "") if e.headers else "",
            "vercel_cache": e.headers.get("X-Vercel-Cache", "") if e.headers else "",
            "body_md5": "ERR",
            "body_len": 0,
        }
    except Exception as e:
        return {"status": -1, "error": str(e)}


def main():
    results: list[dict] = []
    for url in TEST_URLS:
        seq = []
        for i, ua in enumerate([CURL_UA, GOOGLEBOT_UA, CURL_UA, GOOGLEBOT_UA]):
            res = fetch(url, ua)
            res["step"] = i + 1
            res["ua_kind"] = "curl" if ua == CURL_UA else "Googlebot"
            seq.append(res)
        # Poisoning: if step 2 (Googlebot) has same body_md5 as step 1 (curl)
        # AND step 1 had noindex while step 2 expected clean → POISONED
        step1 = seq[0]
        step2 = seq[1]
        poisoned = (
            step1.get("body_md5") == step2.get("body_md5")
            and "noindex" in step1.get("xrobots", "").lower()
            and "noindex" not in step2.get("xrobots", "").lower()
        )
        # Or just: step2.xrobots contains noindex (more direct check)
        step2_noindex = "noindex" in step2.get("xrobots", "").lower()
        # Step 2 should NOT have noindex (Googlebot is whitelisted post-R12-P0)
        gbot_clean = not step2_noindex and not ("noindex" in seq[3].get("xrobots", "").lower())
        results.append({
            "url": url,
            "sequence": seq,
            "googlebot_clean": gbot_clean,
            "body_match_curl_vs_gbot": step1.get("body_md5") == step2.get("body_md5"),
            "poisoning_real": poisoned,
        })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print(f"{'URL':70} step1(curl) step2(gbot) step3(curl) step4(gbot)  poisoned?")
    print("-" * 130)
    for r in results:
        s = r["sequence"]
        labels = [f"{x['status']}/{x['xrobots'][:20] or 'NULL':22}/{x['vercel_cache'][:5]}" for x in s]
        ps = "YES" if r["poisoning_real"] else "no"
        url_short = r["url"].replace("https://www.japan-pop-now.com", "")
        print(f"{url_short:70} {labels[0]:50}  {ps}")
        for i, x in enumerate(s[1:], 2):
            print(f"{'  step ' + str(i):70} {x['status']}/{x['xrobots'][:20] or 'NULL':22}/{x['vercel_cache'][:5]:5}")
        print()

    # Verdict
    any_poisoned = any(r["poisoning_real"] for r in results)
    any_gbot_dirty = any(not r["googlebot_clean"] for r in results)
    print(f"\n=== Verdict ===")
    print(f"Any poisoning detected: {any_poisoned}")
    print(f"Any Googlebot UA dirty: {any_gbot_dirty}")


if __name__ == "__main__":
    main()
