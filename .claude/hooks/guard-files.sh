#!/usr/bin/env bash
# guard-files.sh — PreToolUse hook for Write/Edit tools
# Comprehensive detection of secrets, hardcoded affiliate IDs, and site rule violations.
set -euo pipefail

INPUT=$(cat)
PATH_FIELD=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty' 2>/dev/null || true)

[ -z "$PATH_FIELD" ] && exit 0

block() {
  echo "[BLOCKED] $1" >&2
  echo "File: $PATH_FIELD" >&2
  exit 2
}

warn() {
  echo "[WARN] $1" >&2
  echo "File: $PATH_FIELD" >&2
}

# --- Protected paths -----------------------------------------------------
case "$PATH_FIELD" in
  *.env|*.env.*|*/.env|*/.env.*) block "Writing to .env files is forbidden" ;;
  */.git/*|*/.git) block "Direct .git directory edits are forbidden" ;;
  */node_modules/*) block "node_modules is immutable — edit source instead" ;;
  */.ssh/*|*/.aws/*|*/.gnupg/*) block "Credentials directory is protected" ;;
  */package-lock.json) warn "Editing package-lock.json directly — prefer npm install" ;;
  */.next/*|*/.vercel/*|*/dist/*|*/build/*) block "Build output directory is not for manual edits" ;;
esac

[ -z "$CONTENT" ] && exit 0

# ========================================================================
# SECRET DETECTION — comprehensive patterns
# ========================================================================

# GitHub tokens
echo "$CONTENT" | grep -qE 'gh[pousr]_[A-Za-z0-9_]{20,}' && block "GitHub token pattern detected"

# AWS credentials
echo "$CONTENT" | grep -qE 'AKIA[0-9A-Z]{16}' && block "AWS access key pattern detected"
echo "$CONTENT" | grep -qE 'aws_secret_access_key\s*[:=]\s*["\047]?[A-Za-z0-9/+=]{40}' && block "AWS secret key pattern detected"

# Google API keys
echo "$CONTENT" | grep -qE 'AIza[0-9A-Za-z_\-]{35}' && block "Google API key pattern detected"

# Stripe keys
echo "$CONTENT" | grep -qE '(sk|pk|rk)_live_[A-Za-z0-9]{20,}' && block "Stripe live key detected"
echo "$CONTENT" | grep -qE '(sk|pk|rk)_test_[A-Za-z0-9]{20,}' && warn "Stripe test key detected (prefer env var)"

# Slack tokens
echo "$CONTENT" | grep -qE 'xox[baprs]-[0-9]+-[0-9]+-[A-Za-z0-9]+' && block "Slack token detected"

# Generic JWT
echo "$CONTENT" | grep -qE 'eyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}' && warn "JWT pattern detected — verify not a real token"

# OpenAI / Anthropic
echo "$CONTENT" | grep -qE 'sk-ant-api[0-9]{2}-[A-Za-z0-9_\-]{80,}' && block "Anthropic API key detected"
echo "$CONTENT" | grep -qE 'sk-proj-[A-Za-z0-9_\-]{80,}' && block "OpenAI project key detected"
echo "$CONTENT" | grep -qE '(^|[^A-Za-z0-9])sk-[A-Za-z0-9]{48}([^A-Za-z0-9]|$)' && block "OpenAI-style API key detected"

# Vercel tokens (24 alphanumeric near 'VERCEL')
echo "$CONTENT" | grep -qE 'VERCEL_TOKEN\s*[:=]\s*["\047]?[A-Za-z0-9]{24}' && block "Vercel token detected"

# Generic high-entropy strings near sensitive keys
echo "$CONTENT" | grep -qiE '(api[_-]?key|secret|password|bearer|auth[_-]?token|access[_-]?token)\s*[:=]\s*["\047][A-Za-z0-9_\-/+=]{16,}["\047]' && {
  # Allow placeholder patterns
  if ! echo "$CONTENT" | grep -qiE '(api[_-]?key|secret|password|bearer|auth[_-]?token|access[_-]?token)\s*[:=]\s*["\047](your_?|xxx|todo|example|placeholder|\$\{|process\.env\.)' ; then
    block "Possible hardcoded credential — use process.env.*"
  fi
}

# SSH private keys
echo "$CONTENT" | grep -qE '(BEGIN (RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY)' && block "Private key block detected"

# Database connection strings
echo "$CONTENT" | grep -qE '(mongodb|postgres|mysql|redis)://[^:]+:[^@]+@' && block "DB connection string with inline password"

# ========================================================================
# AFFILIATE ID DETECTION — hardcoded IDs forbidden
# ========================================================================
case "$PATH_FIELD" in
  *.ts|*.tsx|*.js|*.jsx|*.md|*.mdx)
    # Klook
    if echo "$CONTENT" | grep -qE 'klook\.com[^"\047 ]*[?&](aff|aid)=[0-9]+' ; then
      if ! echo "$CONTENT" | grep -qE 'process\.env\.[A-Z_]*KLOOK' ; then
        block "Hardcoded Klook affiliate ID. Use process.env.NEXT_PUBLIC_KLOOK_AFF_ID"
      fi
    fi
    # Agoda
    if echo "$CONTENT" | grep -qE 'agoda\.com[^"\047 ]*[?&]cid=[0-9]+' ; then
      if ! echo "$CONTENT" | grep -qE 'process\.env\.[A-Z_]*AGODA' ; then
        block "Hardcoded Agoda cid. Use process.env.NEXT_PUBLIC_AGODA_AFF_ID"
      fi
    fi
    # Booking
    if echo "$CONTENT" | grep -qE 'booking\.com[^"\047 ]*[?&]aid=[0-9]+' ; then
      if ! echo "$CONTENT" | grep -qE 'process\.env\.[A-Z_]*BOOKING' ; then
        block "Hardcoded Booking aid. Use process.env.NEXT_PUBLIC_BOOKING_AFF_ID"
      fi
    fi
    # Amazon JP
    if echo "$CONTENT" | grep -qE 'amazon\.co\.jp[^"\047 ]*[?&]tag=[a-z0-9-]+-22' ; then
      if ! echo "$CONTENT" | grep -qE 'process\.env\.[A-Z_]*AMAZON' ; then
        block "Hardcoded Amazon JP associate tag. Use process.env.NEXT_PUBLIC_AMAZON_TAG"
      fi
    fi
    # GetYourGuide
    if echo "$CONTENT" | grep -qE 'getyourguide\.com[^"\047 ]*[?&]partner_id=[A-Za-z0-9_]+' ; then
      if ! echo "$CONTENT" | grep -qE 'process\.env\.[A-Z_]*GYG' ; then
        block "Hardcoded GetYourGuide partner_id. Use process.env.NEXT_PUBLIC_GYG_AFF_ID"
      fi
    fi
    ;;
esac

# ========================================================================
# CONTENT POLICY
# ========================================================================

# Real name leak (Takapon pseudonym rule)
if echo "$CONTENT" | grep -q '清原崇'; then
  case "$PATH_FIELD" in
    *content/articles/*|*/public/*|*components/*|*/app/*)
      block "Real name 清原崇 detected in public-facing content. Use 'Takapon'."
      ;;
  esac
fi

# Unsplash (site rule)
if echo "$CONTENT" | grep -qE 'unsplash\.com/' 2>/dev/null; then
  case "$PATH_FIELD" in
    *content/articles/*|*components/*|*/app/*)
      block "Unsplash images are forbidden on japan-pop-now. Use official sources."
      ;;
  esac
fi

# Past year as current in 2026 articles
case "$PATH_FIELD" in
  *content/articles/*.md)
    if echo "$CONTENT" | grep -qE '(In|In the year|as of)\s+(2023|2024)\b' 2>/dev/null; then
      warn "Past year (2023/2024) referenced as current. Current year is 2026."
    fi
    ;;
esac

# Inline styles in components
case "$PATH_FIELD" in
  *components/*.tsx|*app/*.tsx)
    if echo "$CONTENT" | grep -qE 'style=\{\{' 2>/dev/null; then
      warn "Inline style detected. Prefer Tailwind classes (design-system rule)."
    fi
    ;;
esac

# Emoji in UI components or articles
case "$PATH_FIELD" in
  *components/*.tsx|*app/*.tsx|*content/articles/*.md)
    # Detect common emoji Unicode blocks (approximate)
    if echo "$CONTENT" | grep -qE '[\xF0\x9F\x8C\x80-\xF0\x9F\x99\xBF]' 2>/dev/null; then
      warn "Emoji detected. Use lucide-react icons for UI, avoid in articles."
    fi
    ;;
esac

# Bare <a href="https://...affiliate..."> without wrapper
case "$PATH_FIELD" in
  *components/*.tsx|*app/*.tsx)
    if echo "$CONTENT" | grep -qE '<a\s+href="https?://[^"]*(klook|agoda|booking|getyourguide|amazon)' ; then
      if ! echo "$CONTENT" | grep -qE 'AffiliateLink' ; then
        warn "Bare <a> for affiliate link. Use <AffiliateLink> component."
      fi
    fi
    ;;
esac

# Article has affiliate link but no disclosure
case "$PATH_FIELD" in
  *content/articles/*.md)
    if echo "$CONTENT" | grep -qE '(klook\.com|agoda\.com|booking\.com|getyourguide\.com|amazon\.co\.jp)' ; then
      if ! echo "$CONTENT" | grep -qE '(AffiliateDisclosure|affiliate link|may earn)' ; then
        warn "Affiliate link present but no disclosure found. Add <AffiliateDisclosure />."
      fi
    fi
    ;;
esac

exit 0
