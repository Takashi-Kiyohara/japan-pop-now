#!/usr/bin/env bash
# session-start.sh — SessionStart hook
# Loads pending work from Cowork Scheduled Tasks into Claude's context.
set +e

# Surface STATUS.json contents (from Cowork side, if present)
if [ -f content_operations/STATUS.json ]; then
  echo "=== Cowork Scheduled Task Status ==="
  cat content_operations/STATUS.json
  echo ""
fi

# List pending drafts
if [ -d content_operations/drafts ]; then
  PENDING=$(find content_operations/drafts -name "*.md" -type f 2>/dev/null | head -5)
  if [ -n "$PENDING" ]; then
    echo "=== Pending drafts from trend-monitor / article-drafter ==="
    echo "$PENDING"
    echo ""
  fi
fi

# Show queue
if [ -f content_operations/QUEUE.md ]; then
  echo "=== Current Queue ==="
  head -20 content_operations/QUEUE.md
  echo ""
fi

exit 0
