"""Apply category reclassification per _drafts/category_migration_plan.csv.
Updates only the `category:` field in frontmatter; slugs/filenames untouched.
"""
import csv, re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = '_drafts/category_migration_plan.csv'

with open(CSV_PATH, encoding='utf-8') as f:
    plan = list(csv.DictReader(f))

CAT_LINE = re.compile(r'^(category:\s*[\"\']?)([\w-]+)([\"\']?\s*)$', re.M)

changed = 0
for row in plan:
    slug = row['slug']
    expected_old = row['old_category']
    new_cat = row['new_category']
    path = f'content/articles/{slug}.md'
    if not os.path.exists(path):
        print(f'MISS: {path}')
        continue
    with open(path, encoding='utf-8') as f:
        text = f.read()
    m = CAT_LINE.search(text)
    if not m:
        print(f'NO CAT FIELD: {slug}')
        continue
    if m.group(2) != expected_old:
        print(f'WARN: {slug} category was "{m.group(2)}" expected "{expected_old}" — skipping')
        continue
    new_text = CAT_LINE.sub(rf'\g<1>{new_cat}\g<3>', text, count=1)
    if new_text == text:
        continue
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(new_text)
    print(f'OK: {slug}: {expected_old} -> {new_cat}')
    changed += 1

print(f'---\nTotal changed: {changed}')
