"""Strip decorative emojis and Unsplash image references from article MDX.
Safe-list approach: only removes specific decorative emojis + full image lines
pointing at unsplash.com. Semantic symbols (✕, table keys) and meaningful
letters are left alone.
"""
import json
import os
import re
import sys
from glob import glob

sys.stdout.reconfigure(encoding='utf-8')

# Decorative emojis confirmed in the corpus (7 decorative + ⭐)
DECORATIVE = {'☕', '🗼', '🏪', '👥', '🎮', '🌆', '🏯', '⭐'}
DECO_PATTERN = re.compile('|'.join(re.escape(c) for c in DECORATIVE))
UNSPLASH_IMG = re.compile(r'!\[[^\]]*\]\([^)]*unsplash[^)]*\)', re.IGNORECASE)
UNSPLASH_BARE_URL = re.compile(r'https?://[^)\s]*unsplash\.com[^)\s]*', re.IGNORECASE)


def clean_markdown(path: str) -> tuple[int, int]:
    with open(path, encoding='utf-8') as f:
        original = f.read()

    emoji_removed = 0
    unsplash_removed = 0
    new_lines: list[str] = []
    for line in original.splitlines(keepends=True):
        # Count + drop Unsplash image markdown
        imgs = UNSPLASH_IMG.findall(line)
        if imgs:
            unsplash_removed += len(imgs)
            line = UNSPLASH_IMG.sub('', line)
        # Strip bare Unsplash URLs (e.g. "Photo: Unsplash" credit lines)
        if UNSPLASH_BARE_URL.search(line):
            unsplash_removed += len(UNSPLASH_BARE_URL.findall(line))
            line = UNSPLASH_BARE_URL.sub('', line)
        # Count + strip decorative emojis
        e_hits = DECO_PATTERN.findall(line)
        if e_hits:
            emoji_removed += len(e_hits)
            line = DECO_PATTERN.sub('', line)
        # Drop line if it collapsed to pure whitespace AND originally had a marker
        stripped = line.strip()
        if not stripped and (imgs or e_hits):
            continue
        # Also drop "Photo: Unsplash" orphan lines / duplicate blank lines will fold later
        new_lines.append(line)

    new_content = ''.join(new_lines)
    # Collapse 3+ blank lines into 2
    new_content = re.sub(r'\n{3,}', '\n\n', new_content)

    if new_content != original:
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
    return emoji_removed, unsplash_removed


def clean_events_json(path: str) -> int:
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    touched = 0
    for ev in data.get('events', []):
        thumb = ev.get('thumbnail', '')
        if 'unsplash' in thumb.lower():
            ev['thumbnail'] = ''
            touched += 1
    if touched:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')
    return touched


def main() -> None:
    files = sorted(glob('content/articles/*.md') + glob('content/articles/*.mdx'))
    total_emoji = 0
    total_unsplash = 0
    changed_files: list[str] = []
    for f in files:
        e, u = clean_markdown(f)
        if e or u:
            changed_files.append(f)
            total_emoji += e
            total_unsplash += u
            print(f'{f}: -{e} emoji, -{u} unsplash')

    ev_touched = clean_events_json('data/events.json')
    print(f'data/events.json: blanked {ev_touched} unsplash thumbnails')

    print('---')
    print(f'TOTAL emojis removed: {total_emoji}')
    print(f'TOTAL unsplash refs removed: {total_unsplash}')
    print(f'Files changed: {len(changed_files)}')


if __name__ == '__main__':
    main()
