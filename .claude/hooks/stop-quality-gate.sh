#!/usr/bin/env bash
# stop-quality-gate.sh — Stop hook
# HARD-BLOCKS on main branch when TS errors exist in changed files.
# On feature branches, warns only.
set +e

CHANGED=$(git diff --name-only HEAD 2>/dev/null)
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# STATUS.json always updated
if [ -d content_operations ]; then
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  cat > content_operations/STATUS.json <<EOF
{
  "last_claude_session_end": "$ts",
  "branch": "$BRANCH",
  "files_changed": $(echo "$CHANGED" | grep -cv '^$'),
  "source": "claude-code-stop-hook",
  "locks": { "claude_active": false, "cowork_active": false }
}
EOF
fi

[ -z "$CHANGED" ] && exit 0

# --- TypeScript gate -----------------------------------------------------
TS_CHANGED=$(echo "$CHANGED" | grep -E '\.(ts|tsx)$' || true)

if [ -n "$TS_CHANGED" ]; then
  echo "[QG] Running npx tsc --noEmit for changed .ts/.tsx files …" >&2
  TSC_OUT=$(npx tsc --noEmit 2>&1)
  TSC_EXIT=$?

  if [ $TSC_EXIT -ne 0 ]; then
    echo "$TSC_OUT" | tail -20 >&2

    # HARD BLOCK on main branch
    if [ "$BRANCH" = "main" ]; then
      cat >&2 <<EOF

[QG] BLOCK: TypeScript errors on main branch. Fix before stopping.

Run: npx tsc --noEmit
Or move work to a feature branch: git checkout -b fix/typescript-$(date +%s)

EOF
      exit 2
    else
      echo "[QG] WARN: TypeScript errors on branch '$BRANCH'. Fix before merging to main." >&2
    fi
  else
    echo "[QG] TypeScript: pass" >&2
  fi
fi

# --- Article validate ----------------------------------------------------
ARTICLES_CHANGED=$(echo "$CHANGED" | grep -E '^content/articles/' || true)
if [ -n "$ARTICLES_CHANGED" ]; then
  if [ -f package.json ] && grep -q '"validate"' package.json; then
    echo "[QG] Running npm run validate …" >&2
    VAL_OUT=$(npm run validate 2>&1)
    VAL_EXIT=$?
    if [ $VAL_EXIT -ne 0 ]; then
      echo "$VAL_OUT" | tail -15 >&2
      if [ "$BRANCH" = "main" ]; then
        echo "[QG] BLOCK: Article validation failed on main." >&2
        exit 2
      fi
    fi
  fi
fi

# --- Staged .env check ---------------------------------------------------
STAGED_ENV=$(git diff --cached --name-only 2>/dev/null | grep -E '^\.env' || true)
if [ -n "$STAGED_ENV" ]; then
  echo "[QG] BLOCK: .env file is staged. Unstage before stopping: git restore --staged $STAGED_ENV" >&2
  exit 2
fi

exit 0
