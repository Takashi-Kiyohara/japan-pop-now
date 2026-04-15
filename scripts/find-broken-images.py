import os, re, glob, sys
existing = set()
for root, _, files in os.walk('public/images/articles'):
    for f in files:
        if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif')):
            p = os.path.join(root, f).replace(os.sep, '/')
            # strip leading 'public'
            if p.startswith('public/'):
                p = p[len('public'):]
            existing.add(p)

broken = {}
empties = {}
for md in sorted(glob.glob('content/articles/*.md')):
    with open(md, encoding='utf-8') as fh:
        content = fh.read()
    for m in re.finditer(r'!\[[^\]]*\]\((/images/[^)\s]+)\)', content):
        p = m.group(1)
        if p not in existing:
            broken.setdefault(md, []).append(p)
    for m in re.finditer(r'!\[[^\]]*\]\(\s*\)', content):
        empties.setdefault(md, []).append('(empty)')

for md, paths in broken.items():
    print(md)
    for p in paths:
        print('  -', p)
print('---EMPTY---')
for md, paths in empties.items():
    print(md, len(paths))
print('---')
print('total broken refs:', sum(len(v) for v in broken.values()), 'across', len(broken), 'files')
print('total empty:', sum(len(v) for v in empties.values()), 'across', len(empties), 'files')
