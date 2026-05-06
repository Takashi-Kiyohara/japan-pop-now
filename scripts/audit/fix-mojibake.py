#!/usr/bin/env python3
"""
Bucket A — mojibake repair.

For each input file:
  1. Read as UTF-8.
  2. Use ftfy.fix_text to repair latin1→utf8 mojibake (the common pattern
     from a previous WordPress export round-trip).
  3. Write back if changed; report a diff stat.

Critic loop step 1 (syntax) is satisfied by markdown / mdx parse via
gray-matter / next-mdx-remote later in npm run validate; this script
only modifies character data.
"""

import sys
import argparse
import ftfy

def repair(path: str, dry_run: bool = False) -> dict:
    with open(path, 'r', encoding='utf-8') as f:
        original = f.read()
    fixed = ftfy.fix_text(original)
    delta = len(original) - len(fixed)  # mojibake compresses
    changed = original != fixed
    if changed and not dry_run:
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(fixed)
    # Count remaining suspect chars (anything in 0x80-0xFF range outside CJK / common Western Latin)
    suspect = sum(1 for c in fixed if '' <= c < ' ')
    return {
        'path': path,
        'changed': changed,
        'delta_chars': delta,
        'suspect_remaining': suspect,
    }

def main():
    p = argparse.ArgumentParser()
    p.add_argument('files', nargs='+')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    for path in args.files:
        r = repair(path, dry_run=args.dry_run)
        marker = 'CHANGED' if r['changed'] else 'unchanged'
        print(f"{marker:9s}  {path}  delta_chars={r['delta_chars']:+d}  suspect_remaining={r['suspect_remaining']}")

if __name__ == '__main__':
    main()
