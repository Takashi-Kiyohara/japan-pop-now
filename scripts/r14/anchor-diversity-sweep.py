#!/usr/bin/env python3
"""R14-E: anchor diversity sweep targeting top-10 anchor-stuffed articles.

Strategy: for each article in the target list, find internal links of the form
`[Title with 2026 in it](/articles/slug)` and rewrite roughly half of them to
descriptive variants like `[the Slam Dunk Kamakura pilgrimage notes]`,
`[our Ghibli Park walkthrough]`, etc.

Deterministic via slug hash to avoid run-to-run anchor churn.
"""
import re
import hashlib
from pathlib import Path

ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\content\articles")

# Top 10 anchor-stuffed articles (from anchor-diversity scan)
TARGETS = [
    "anime-day-trips-from-tokyo-2026",
    "demon-slayer-handmade-club-ufotable-cafe-2026",
    "my-hero-academia-cafe-tokyo-2026",
    "anime-pilgrimage-spots-tokyo",
    "pokepark-kanto-tokyo-2026",
    "anime-hotels-tokyo-2026",
    "dark-moon-chara-cafe-ikebukuro-2026",
    "how-to-book-anime-collab-cafe-japan",
    "osaka-anime-cafes-complete-guide-2026",
    "spy-family-tokyo-fan-day-2026",
]

# Slug → descriptive anchor alternatives (3 variants each).
# Variants intentionally pluralized / contextualized to reduce exact-match scent.
ALTERNATIVES = {
    "kamakura-slam-dunk-pilgrimage-2026": [
        "the Kamakura Slam Dunk pilgrimage notes",
        "our Slam Dunk Kamakura walkthrough",
        "the Enoden Slam Dunk route",
    ],
    "demon-slayer-meiji-mura-aichi-pilgrimage-2026": [
        "the Demon Slayer × Meiji-mura visit notes",
        "our Aichi Demon Slayer pilgrimage guide",
        "the Meiji-mura Demon Slayer walkthrough",
    ],
    "ranma-japan-2026-exhibition-tree-village-guide": [
        "the Ranma 1/2 Tree Village pop-up notes",
        "our Ranma exhibition recap",
        "the Tree Village Ranma walkthrough",
    ],
    "anime-pilgrimage-spots-tokyo": [
        "our Tokyo pilgrimage spot roundup",
        "the Tokyo seichi junrei guide",
        "10 spots for Tokyo anime pilgrimage",
    ],
    "ghibli-park-complete-guide-2026": [
        "our Ghibli Park walkthrough",
        "the Ghibli Park visit notes",
        "the full Ghibli Park guide",
    ],
    "japan-rail-pass-2026-guide": [
        "the JR Pass buying guide",
        "our Japan Rail Pass walkthrough",
        "the JR Pass value notes",
    ],
    "japan-esim-pocket-wifi-sim-card": [
        "the eSIM vs Pocket WiFi comparison",
        "our Japan connectivity guide",
        "the Japan eSIM walkthrough",
    ],
    "dark-moon-chara-cafe-ikebukuro-2026": [
        "the Ikebukuro Dark Moon cafe notes",
        "our Dark Moon visit walkthrough",
        "the Ikebukuro Chara Cafe recap",
    ],
    "demon-slayer-handmade-club-ufotable-cafe-2026": [
        "our Demon Slayer Handmade Club walkthrough",
        "the Ufotable Demon Slayer cafe notes",
        "the Handmade Club visit guide",
    ],
    "my-hero-academia-cafe-tokyo-2026": [
        "the MHA Tokyo cafe walkthrough",
        "our My Hero Academia cafe notes",
        "the MHA collab cafe guide",
    ],
    "pokepark-kanto-tokyo-2026": [
        "our PokéPark Kanto walkthrough",
        "the Tokyo PokéPark visit notes",
        "the PokéPark Kanto guide",
    ],
    "anime-hotels-tokyo-2026": [
        "the Tokyo anime hotel roundup",
        "our themed-hotel guide for Tokyo",
        "the Tokyo IP hotel notes",
    ],
    "how-to-book-anime-collab-cafe-japan": [
        "the booking walkthrough for anime collab cafes",
        "our collab cafe reservation guide",
        "the collab cafe booking notes",
    ],
    "osaka-anime-cafes-complete-guide-2026": [
        "our Osaka anime cafe roundup",
        "the Osaka collab cafe walkthrough",
        "the Kansai anime cafe guide",
    ],
    "spy-family-tokyo-fan-day-2026": [
        "the Spy x Family fan day notes",
        "our Spy x Family Tokyo recap",
        "the SxF fan event walkthrough",
    ],
    "frieren-usj-story-walk-osaka-2026": [
        "the Frieren USJ walkthrough",
        "our Frieren Story Walk recap",
        "the Osaka Frieren visit notes",
    ],
    "jujutsu-kaisen-cafes-japan-2026-guide": [
        "our JJK cafe roundup",
        "the Jujutsu Kaisen collab cafe guide",
        "the JJK Japan cafe notes",
    ],
    "blue-lock-tokyo-skytree-cafe-2026": [
        "our Blue Lock Skytree walkthrough",
        "the Blue Lock Tokyo cafe notes",
        "the BLLK Skytree recap",
    ],
    "tokyo-anime-collab-cafes-spring-2026": [
        "our spring collab cafe roundup",
        "the Tokyo collab cafe spring tracker",
        "the spring 2026 collab cafe notes",
    ],
    "animejapan-2026-guide-international-visitors": [
        "the AnimeJapan international visitor guide",
        "our AnimeJapan walkthrough",
        "the AnimeJapan event notes",
    ],
    "gaming-tokyo-2026": [
        "our Tokyo gaming district guide",
        "the Tokyo gaming-spot roundup",
        "the Tokyo gaming walkthrough",
    ],
    "akihabara-complete-guide-2026": [
        "our Akihabara walkthrough",
        "the Akihabara district guide",
        "the Akihabara visit notes",
    ],
    "ikebukuro-anime-guide-2026": [
        "our Ikebukuro walkthrough",
        "the Ikebukuro Otome Road guide",
        "the Ikebukuro anime district notes",
    ],
    "jjk-sweets-paradise-complete-guide-2026": [
        "our JJK Sweets Paradise walkthrough",
        "the JJK collab cafe notes",
        "the Jujutsu Kaisen sweets guide",
    ],
    "familymart-anime-collab-stores-2026": [
        "our FamilyMart anime collab roundup",
        "the FamilyMart anime store tracker",
        "the FamilyMart collab notes",
    ],
    "apothecary-diaries-oshi-tabi-osaka-shinkansen-2026": [
        "our Apothecary Diaries oshi-tabi walkthrough",
        "the Osaka shinkansen Apothecary guide",
        "the Apothecary Diaries Osaka notes",
    ],
    "rilakkuma-cafe-tokyo-osaka-2026": [
        "our Rilakkuma cafe walkthrough",
        "the Rilakkuma Tokyo+Osaka tour notes",
        "the Rilakkuma cafe guide",
    ],
    "krispy-kreme-mario-galaxy-shibuya-2026": [
        "our Krispy Kreme Mario Galaxy notes",
        "the Shibuya Cine Tower Krispy guide",
        "the Mario Galaxy donut walkthrough",
    ],
}


def pick_variant(slug: str, salt: int) -> str | None:
    options = ALTERNATIVES.get(slug)
    if not options:
        return None
    # deterministic pick by slug + salt
    h = int(hashlib.md5(f"{slug}-{salt}".encode()).hexdigest(), 16)
    return options[h % len(options)]


def process(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(r"\[([^\]]*2026[^\]]*)\]\(/articles/([^)]+)\)")
    matches = list(pattern.finditer(text))
    if not matches:
        return 0
    # rewrite every other match (offset by file-hash so files don't all rewrite the same ones)
    file_hash = int(hashlib.md5(path.name.encode()).hexdigest(), 16)
    offset = file_hash % 2
    replaced = 0
    parts: list[str] = []
    cursor = 0
    for i, m in enumerate(matches):
        parts.append(text[cursor:m.start()])
        slug = m.group(2)
        if i % 2 == offset:
            variant = pick_variant(slug, i)
            if variant:
                parts.append(f"[{variant}](/articles/{slug})")
                replaced += 1
            else:
                parts.append(m.group(0))
        else:
            parts.append(m.group(0))
        cursor = m.end()
    parts.append(text[cursor:])
    if replaced > 0:
        path.write_text("".join(parts), encoding="utf-8")
    return replaced


def main():
    summary: list[tuple[str, int]] = []
    for slug in TARGETS:
        for ext in (".md", ".mdx"):
            path = ROOT / (slug + ext)
            if not path.exists():
                continue
            n = process(path)
            summary.append((slug + ext, n))
            print(f"  {slug + ext}: {n} anchors rewritten")
            break

    total = sum(n for _, n in summary)
    print(f"\nTotal anchors rewritten: {total} across {len(summary)} articles")


if __name__ == "__main__":
    main()
