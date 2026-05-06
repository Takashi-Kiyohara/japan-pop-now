#!/usr/bin/env bash
# Verify every URL pattern after the apex+trailing+legacy single-hop fix.
# Asserts: num_redirects ≤1 for HTTPS hits on Googlebot UA.
# Reads the live sitemap so the article list is authoritative.
# Usage: scripts/verify-redirect-chains.sh [DOMAIN]
#   DOMAIN defaults to www.japan-pop-now.com.

set -u

DOMAIN="${1:-www.japan-pop-now.com}"
APEX="japan-pop-now.com"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

# Article slugs that are LEGACY flat URLs (test pre /articles/ form).
LEGACY_SLUGS=(
  lawson-ticket-anime-cafe-booking
  anime-merch-shopping-guide-japan
  nakano-broadway-guide
  tokyo-anime-district-guide
  gachapon-guide-japan
  japan-ic-card-transit-guide
  akihabara-complete-guide-2026
  how-to-book-anime-collab-cafe-japan
  weathering-with-you-locations-tokyo
  ikebukuro-anime-guide-2026
  tokyo-anime-collab-cafes-spring-2026
  universal-cool-japan-2026-guide
  osaka-anime-guide-den-den-town
  one-piece-kumamoto-statue-tour
  animate-cafe-guide-japan
  anime-pilgrimage-spots-tokyo
  your-name-pilgrimage-tokyo
  japan-esim-pocket-wifi-sim-card
)
LEGACY_LONG_SLUG="the-complete-guide-to-japanese-game-centers-arcades-2026-crane-games-rhythm-games-more"

PASS=0
FAIL=0
FAIL_URLS=()

trace() {
  local url="$1"
  local max="$2"
  local label="$3"
  local got
  got=$(curl -s -A "$UA" -o /dev/null -w "%{num_redirects}|%{response_code}|%{url_effective}" -L "$url" 2>&1)
  local nr="${got%%|*}"
  local rest="${got#*|}"
  local code="${rest%%|*}"
  local final="${rest#*|}"
  if [[ "$nr" -le "$max" && ( "$code" == "200" || "$code" == "410" ) ]]; then
    PASS=$((PASS+1))
    printf "  PASS [%-2s≤%s] %-22s %s -> %s\n" "$nr" "$max" "$label" "$url" "$final"
  else
    FAIL=$((FAIL+1))
    FAIL_URLS+=("$label: $url (nr=$nr, code=$code, final=$final)")
    printf "  FAIL [%-2s>%s] %-22s %s -> %s (code=%s)\n" "$nr" "$max" "$label" "$url" "$final" "$code"
  fi
}

echo "=== Redirect chain trace verification ==="
echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Domain: $DOMAIN"
echo "Apex:   $APEX"
echo

echo "--- 1) sitemap article URLs (canonical, expect num_redirects=0) ---"
SITEMAP_URLS=$(curl -sL "https://$DOMAIN/sitemap.xml" 2>/dev/null | grep -oE '<loc>[^<]+</loc>' | sed 's/<\/\?loc>//g' | grep -E '/articles/[^/]+$')
for u in $SITEMAP_URLS; do
  trace "$u" 0 "sitemap-article"
done

echo
echo "--- 2) legacy flat-slug on www, no trailing (expect 1 hop) ---"
for slug in "${LEGACY_SLUGS[@]}"; do
  trace "https://$DOMAIN/$slug" 1 "www+legacy"
done
trace "https://$DOMAIN/$LEGACY_LONG_SLUG" 1 "www+legacy-long"
trace "https://$DOMAIN/collab-cafe-calendar" 1 "www+calendar-flat"

echo
echo "--- 3) legacy flat-slug on www, WITH trailing (expect 1 hop) ---"
for slug in "${LEGACY_SLUGS[@]}"; do
  trace "https://$DOMAIN/$slug/" 1 "www+legacy+trail"
done
trace "https://$DOMAIN/$LEGACY_LONG_SLUG/" 1 "www+legacy-long+trail"
trace "https://$DOMAIN/collab-cafe-calendar/" 1 "www+calendar+trail"

echo
echo "--- 4) apex + canonical /articles/ + trailing (expect 1 hop) ---"
SAMPLE_ARTICLES=$(echo "$SITEMAP_URLS" | head -10)
for u in $SAMPLE_ARTICLES; do
  apex_url="${u/https:\/\/$DOMAIN/https:\/\/$APEX}/"
  trace "$apex_url" 1 "apex+article+trail"
done

echo
echo "--- 5) apex + legacy flat slug, WITH trailing (expect 1 hop) ---"
for slug in "${LEGACY_SLUGS[@]:0:6}"; do
  trace "https://$APEX/$slug/" 1 "apex+legacy+trail"
done

echo
echo "--- 6) /feed and /feed/ (expect 1 hop, ends at /feed.xml) ---"
trace "https://$DOMAIN/feed" 1 "www+feed"
trace "https://$DOMAIN/feed/" 1 "www+feed+trail"
trace "https://$APEX/feed" 1 "apex+feed"
trace "https://$APEX/feed/" 1 "apex+feed+trail"

echo
echo "--- 7) /?paged=N (expect 410 Gone) ---"
got=$(curl -s -A "$UA" -o /dev/null -w "%{num_redirects}|%{response_code}" "https://$DOMAIN/?paged=2")
echo "  /?paged=2 -> $got (expect 0|410)"

echo
echo "--- 8) hreflang count on representative articles (expect 2: en + x-default) ---"
for u in $(echo "$SITEMAP_URLS" | head -3); do
  count=$(curl -sL -A "$UA" "$u" 2>/dev/null | grep -cE '<link[^>]+hreflang')
  echo "  $u : hreflang count = $count (expect 2)"
done

echo
echo "=== SUMMARY ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
if [[ $FAIL -gt 0 ]]; then
  echo
  echo "FAILED URLs:"
  for f in "${FAIL_URLS[@]}"; do
    echo "  - $f"
  done
  exit 1
fi
exit 0
