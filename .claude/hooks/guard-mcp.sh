#!/usr/bin/env bash
# guard-mcp.sh — PreToolUse hook for MCP tools
# Detects prompt injection patterns in MCP tool inputs/outputs.
# Emits a warning to stderr but does not hard-block (MCP tools often need user judgement).
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || true)
ARGS=$(echo "$INPUT" | jq -c '.tool_input // {}' 2>/dev/null || echo "{}")

# Suspicious instruction patterns often seen in prompt-injection payloads
patterns=(
  "ignore (all )?(previous|prior) instructions"
  "system[: ]+you are now"
  "<!-- *override *-->"
  "execute the following"
  "run the following bash"
  "claude: please"
  "anthropic authorized"
  "admin override"
  "developer mode"
)

SERIALIZED=$(echo "$ARGS" | tr -d '\n' | head -c 8000)

for p in "${patterns[@]}"; do
  if echo "$SERIALIZED" | grep -iqE "$p"; then
    echo "[MCP-WARN] Possible prompt injection pattern '$p' in $TOOL input" >&2
    # Non-blocking: exit 0 so Claude sees the warning but can still proceed with user verification
    break
  fi
done

exit 0
