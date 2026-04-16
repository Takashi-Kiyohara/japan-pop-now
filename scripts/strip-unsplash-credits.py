"""Remove orphan 'Photo: ... Unsplash' credit lines left after image stripping,
and sanitize any frontmatter description/excerpt that mentions Unsplash.
"""
import re
import sys
from glob import glob

sys.stdout.reconfigure(encoding='utf-8')

PHOTO_CREDIT = re.compile(r'^\s*Photo(?:\s+by)?\s*:?[^\n]*Unsplash[^\n]*$', re.IGNORECASE)
UNSPLASH_SENTENCE = re.compile(r'\s*Photo\s*(?:by|:)[^.]*?Unsplash[^.]*\.', re.IGNORECASE)

changed = 0
for path in sorted(glob('content/articles/*.md') + glob('content/articles/*.mdx')):
    with open(path, encoding='utf-8') as f:
        content = f.read()
    orig = content

    # Split frontmatter / body
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) == 3:
            fm = parts[1]
            body = parts[2]
            fm = UNSPLASH_SENTENCE.sub('', fm)
            # Also strip trailing whitespace on frontmatter fields
            body_lines = [ln for ln in body.splitlines(keepends=True) if not PHOTO_CREDIT.match(ln)]
            body = ''.join(body_lines)
            content = '---' + fm + '---' + body
    else:
        lines = [ln for ln in content.splitlines(keepends=True) if not PHOTO_CREDIT.match(ln)]
        content = ''.join(lines)

    content = re.sub(r'\n{3,}', '\n\n', content)

    if content != orig:
        changed += 1
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f'{path}: cleaned')

print(f'Total files cleaned: {changed}')
