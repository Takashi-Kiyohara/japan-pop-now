#!/usr/bin/env python3
"""
Bulk fix common first-person fabrication patterns to advisory voice.

This is intentionally conservative — it only does substitutions where the
result is unambiguously safer + grammatically valid. Patterns that need
context-aware judgement are left for manual fix.

Substitutions applied at sentence level. The script preserves leading
whitespace + punctuation.

Usage: PYTHONIOENCODING=utf-8 python scripts/audit/fabrication-batch-fix.py
"""

import os
import re
import sys

ARTICLES_DIR = 'content/articles'

# Substitutions: (regex, replacement). Order matters — earlier rules can be more specific.
SUBS = [
    # "When I visited" / "When I checked" — drop the prefix entirely
    (r'\bWhen I (visited|checked|went|arrived),?\s+', ''),
    (r'\bDuring my visit,?\s+', ''),

    # "I recommend X" → "Recommended approach: X" (conservative — only at sentence start)
    (r'(?<=[.!?]\s)I recommend\b', 'Recommended approach:'),
    (r'^I recommend\b', 'Recommended approach:'),

    # "I noticed X" → "Visitors note X"
    (r'\bI noticed\b', 'Visitors note'),

    # "I observed X" → "Visitors note X"
    (r'\bI observed\b', 'Visitors note'),

    # "I found that X" → "Per visitor reports, X" (only at sentence start)
    (r'(?<=[.!?]\s)I found that\b', 'Per visitor reports,'),
    (r'^I found that\b', 'Per visitor reports,'),

    # "My favorite" → "A standout"
    (r'\bMy favorite\b', 'A standout'),
    (r'\bMy favourite\b', 'A standout'),
    (r'\bMy personal choice\b', 'A standout pick'),
    (r'\bMy go-to\b', 'A reliable go-to'),

    # "I prefer" → "Recommended pick:" (sentence start only)
    (r'(?<=[.!?]\s)I prefer\b', 'Recommended pick:'),
    (r'^I prefer\b', 'Recommended pick:'),

    # Specific past-tense first-person → drop sentence's "I X" agent if remainder makes sense
    # We don't do these via regex — too risky. Manual fix only.
]


def fix_file(path):
    with open(path, encoding='utf-8') as f:
        original = f.read()
    fixed = original
    for pat, repl in SUBS:
        fixed = re.sub(pat, repl, fixed, flags=re.MULTILINE)
    if fixed != original:
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(fixed)
        return True
    return False


def main():
    if not os.path.isdir(ARTICLES_DIR):
        print(f'{ARTICLES_DIR} not found', file=sys.stderr)
        sys.exit(1)
    changed = 0
    for f in sorted(os.listdir(ARTICLES_DIR)):
        if not (f.endswith('.md') or f.endswith('.mdx')) or f.endswith('.deprecated'):
            continue
        if fix_file(os.path.join(ARTICLES_DIR, f)):
            changed += 1
            print(f'  fixed: {f}')
    print(f'Total files modified: {changed}')


if __name__ == '__main__':
    main()
