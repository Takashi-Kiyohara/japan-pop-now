import os, re, glob

existing = set()
for root, _, files in os.walk('public/images/articles'):
    for f in files:
        if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif')):
            p = os.path.join(root, f).replace(os.sep, '/')
            if p.startswith('public/'):
                p = p[len('public'):]
            existing.add(p)

IMG_RE = re.compile(r'!\[[^\]]*\]\((/images/[^)\s]+)\)')
EMPTY_RE = re.compile(r'!\[[^\]]*\]\(\s*\)')

def process_file(md):
    with open(md, encoding='utf-8') as fh:
        original = fh.read()
    new_lines = []
    removed = [0]
    for line in original.splitlines(keepends=True):
        had_image_marker = bool(IMG_RE.search(line) or EMPTY_RE.search(line))
        def repl(m):
            if m.group(1) not in existing:
                removed[0] += 1
                return ''
            return m.group(0)
        modified = IMG_RE.sub(repl, line)
        def repl_empty(m):
            removed[0] += 1
            return ''
        modified = EMPTY_RE.sub(repl_empty, modified)
        if modified.strip() == '' and had_image_marker:
            continue
        new_lines.append(modified)
    new_content = ''.join(new_lines)
    if new_content != original:
        with open(md, 'w', encoding='utf-8', newline='') as fh:
            fh.write(new_content)
        return removed[0]
    return 0

total = 0
changed = 0
for md in sorted(glob.glob('content/articles/*.md')):
    n = process_file(md)
    if n:
        print(f'{md}: removed {n}')
        total += n
        changed += 1
print('---')
print(f'TOTAL removed: {total} across {changed} files')
