#!/usr/bin/env bash
# post-edit-format.sh — PostToolUse hook for Write/Edit
# Runs lint/format on the changed file. Non-blocking (exit 0 even on fail).
set +e

INPUT=$(cat)
PATH_FIELD=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)

[ -z "$PATH_FIELD" ] && exit 0
[ ! -f "$PATH_FIELD" ] && exit 0

case "$PATH_FIELD" in
  *.ts|*.tsx|*.js|*.jsx)
    npx eslint "$PATH_FIELD" --fix --quiet 2>/dev/null || true
    npx prettier --write "$PATH_FIELD" --log-level silent 2>/dev/null || true
    ;;
  *.md|*.mdx|*.json|*.css)
    npx prettier --write "$PATH_FIELD" --log-level silent 2>/dev/null || true
    ;;
esac

exit 0
