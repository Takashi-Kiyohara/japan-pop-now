#!/usr/bin/env python3
"""Find mojibake (double-encoded UTF-8) patterns in named articles."""
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

# Bytes-level mojibake patterns (so the Python source has no risky literals).
# Common double-encoding artifacts: when UTF-8 was decoded as latin-1 then re-encoded.
PATTERN_BYTES = [
    bytes.fromhex("efbfbd"),               # U+FFFD replacement char
    bytes.fromhex("c3a9"),                 # mojibake for é when text-then-utf8 mismangle
    bytes.fromhex("e282ac"),               # raw euro that might be mojibake-edge
    b"\xe2\x80\x99",                       # right single quotation mark (curly apostrophe; benign in markdown)
    bytes.fromhex("c3a8"),                 # é variant
    bytes.fromhex("c3a0"),                 # à mojibake
    bytes.fromhex("c2a0"),                 # non-breaking space (often mojibake artifact)
    bytes.fromhex("c3a2e282ac"),           # â€ multi-byte garbled sequence
]

# Only flag patterns associated with garbled content; curly quotes are normal.
# Decode-test approach: try latin-1 -> utf-8 roundtrip on each line and flag
# differences as suspected mojibake.

targets = [
    "tokyo-anime-collab-cafes-summer-2026",
    "kyoto-anime-guide-2026",
    "chainsaw-man-pilgrimage-tokyo",
    "one-piece-tokyo-guide-2026",
    "slam-dunk-kamakura-pilgrimage-2026",
]


def find_mojibake_in_line(line_bytes: bytes) -> list[str]:
    hits = []
    text = line_bytes.decode("utf-8", errors="replace")
    if "�" in text:
        hits.append("U+FFFD replacement char present")
    if any(p in line_bytes for p in [b"\xc3\xa2\xe2\x82\xac", b"\xe2\x80\xa2\xe2\x80\x9d"]):
        hits.append("multi-byte garbled sequence")
    if "Ã©" in text or "Ã¨" in text or "Ã " in text or "ï¼" in text:
        hits.append("Latin-1 over UTF-8 mojibake")
    return hits


for slug in targets:
    for ext in (".md", ".mdx"):
        path = ROOT / (slug + ext)
        if not path.exists():
            continue
        raw = path.read_bytes()
        any_hit = False
        for i, line in enumerate(raw.splitlines(), 1):
            hits = find_mojibake_in_line(line)
            if hits:
                if not any_hit:
                    print(f"\n=== {slug}{ext} ===")
                    any_hit = True
                preview = line[:120].decode("utf-8", errors="replace")
                print(f"  L{i}: {', '.join(hits)}: {preview}")
        if not any_hit:
            print(f"  {slug}{ext}: 0 mojibake")
