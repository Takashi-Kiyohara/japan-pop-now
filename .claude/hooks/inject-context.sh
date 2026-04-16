#!/usr/bin/env bash
# inject-context.sh — UserPromptSubmit hook
# Injects small bits of relevant context into Claude's view at prompt time.
# Stdout is added to the conversation; keep it minimal.
set +e

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' 2>/dev/null || true)

# If the user mentions a specific article slug, surface its frontmatter
if echo "$PROMPT" | grep -qE 'content/articles/[a-z0-9-]+\.md'; then
  SLUG=$(echo "$PROMPT" | grep -oE 'content/articles/[a-z0-9-]+\.md' | head -1)
  if [ -f "$SLUG" ]; then
    echo "<system>Article frontmatter for $SLUG:"
    awk '/^---$/{c++} c==1 || (c==2 && /^---$/)' "$SLUG" | head -25
    echo "</system>"
  fi
fi

# Surface current build status flag if present
if [ -f .build-status ]; then
  echo "<system>Last build: $(cat .build-status)</system>"
fi

exit 0
