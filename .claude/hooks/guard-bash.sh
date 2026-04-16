#!/usr/bin/env bash
# guard-bash.sh — PreToolUse hook for Bash tool
# Exit 0: allow, exit 2: block with error message
set -euo pipefail

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || true)

if [ -z "$CMD" ]; then
  exit 0
fi

# --- Hard blocks ---------------------------------------------------------
block() {
  echo "[BLOCKED] $1" >&2
  echo "Command: $CMD" >&2
  exit 2
}

# Env / secret exfiltration
echo "$CMD" | grep -qE '(cat|less|more|head|tail|bat|nano|vim|vi)\s+[^|]*\.env' && block "Reading .env file is not allowed"
echo "$CMD" | grep -qE '(cat|less|head|tail)\s+.*\.(pem|key|p12|crt)$' && block "Reading secret key file is not allowed"
echo "$CMD" | grep -qE 'cat\s+~?/\.ssh/' && block "Reading SSH keys is not allowed"
echo "$CMD" | grep -qE 'cat\s+~?/\.aws/' && block "Reading AWS credentials is not allowed"
echo "$CMD" | grep -qE '(^|\s)(printenv|env)(\s|$)' && block "Dumping environment variables is not allowed"

# Destructive FS
echo "$CMD" | grep -qE 'rm\s+-rf?\s+(/|~|\.\.\/|\.git|node_modules)' && block "Destructive rm -rf on protected path"
echo "$CMD" | grep -qE '(^|\s)(mkfs|dd\s+if=/dev)' && block "Dangerous disk operation"
echo "$CMD" | grep -qE '(^|\s)sudo(\s|$)' && block "sudo is not allowed"
echo "$CMD" | grep -qE '(^|\s)chmod\s+777' && block "chmod 777 is not allowed"

# Destructive git
echo "$CMD" | grep -qE 'git\s+push.*--force' && block "git push --force is not allowed"
echo "$CMD" | grep -qE 'git\s+push\s+-f(\s|$)' && block "git push -f is not allowed"
echo "$CMD" | grep -qE 'git\s+reset\s+--hard\s+origin' && block "git reset --hard origin is destructive"
echo "$CMD" | grep -qE 'git\s+filter-(branch|repo)' && block "git filter-branch/repo rewrites history"
echo "$CMD" | grep -qE 'git\s+clean\s+-[a-z]*f[a-z]*d' && block "git clean -fd can delete unstaged work"

# Pipe to shell (remote code execution)
echo "$CMD" | grep -qE '(curl|wget)[^|]*\|\s*(sh|bash|zsh|fish|python|ruby|perl|node)' && block "Pipe-to-shell pattern detected"

# Obvious exfiltration
echo "$CMD" | grep -qE 'curl[^|]*-[A-Za-z]*d[A-Za-z]*\s+[^|]*\$\{?[A-Z_]*(KEY|TOKEN|SECRET|PASS)' && block "Suspicious POST of env var to remote URL"

# Package publishing
echo "$CMD" | grep -qE '(npm|yarn|pnpm)\s+publish' && block "Package publish is not allowed"

# Unbounded recursion
echo "$CMD" | grep -qE '(find|grep)\s+/[^/]' && block "Recursive scan from root directory"

exit 0
