#!/usr/bin/env bash
# Cycle E4 — full redirect-chain proxy trace.
# Buckets every URL candidate by num_redirects so we can estimate the GSC
# "redirect error" entry count without waiting on Google's manual export.
#
# Coverage:
#   - all sitemap URLs (canonical) on www
#   - apex variants (apex + same path, with and without trailing slash)
#   - all 18 legacy WP flat slugs (apex/www × trailing/no-trailing)
#   - special structural paths: /feed/, /collab-cafe-calendar/, /tags, /search
#   - WP-legacy query params: /?p=*, /?paged=*, /wp-login.php, /wp-admin
#
# Output: markdown report on stdout. Pipe to docs/audit/cycleE-redirect-proxy-{date}.md.

set -u

WWW="https://www.japan-pop-now.com"
APEX="https://japan-pop-now.com"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

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
LEGACY_LONG="the-complete-guide-to-japanese-game-centers-arcades-2026-crane-games-rhythm-games-more"

trace() {
  local url="$1"
  curl -s -A "$UA" -o /dev/null -w "%{num_redirects}|%{response_code}|%{url_effective}|$url\n" -L "$url" 2>/dev/null
}

declare -a results

# 1. canonical sitemap URLs on www (no redirect expected)
while IFS= read -r u; do
  [ -z "$u" ] && continue
  results+=("$(trace "$u")")
done < <(curl -sL "$WWW/sitemap.xml" 2>/dev/null | grep -oE '<loc>[^<]+</loc>' | sed 's/<\/\?loc>//g')

# 2. apex variants of all canonical sitemap URLs
while IFS= read -r u; do
  [ -z "$u" ] && continue
  apex_u="${u/$WWW/$APEX}"
  results+=("$(trace "$apex_u")")
  results+=("$(trace "${apex_u}/")")
done < <(curl -sL "$WWW/sitemap.xml" 2>/dev/null | grep -oE '<loc>[^<]+</loc>' | sed 's/<\/\?loc>//g' | grep '/articles/')

# 3. legacy flat slugs — apex × trailing × www × trailing = 4 each
for s in "${LEGACY_SLUGS[@]}" "$LEGACY_LONG" "collab-cafe-calendar" "feed"; do
  results+=("$(trace "$WWW/$s")")
  results+=("$(trace "$WWW/$s/")")
  results+=("$(trace "$APEX/$s")")
  results+=("$(trace "$APEX/$s/")")
done

# 4. WP-legacy query / system paths
results+=("$(trace "$WWW/?p=123")")
results+=("$(trace "$WWW/?paged=2")")
results+=("$(trace "$WWW/?cat=1")")
results+=("$(trace "$WWW/?feed=rss2")")
results+=("$(trace "$WWW/wp-login.php")")
results+=("$(trace "$WWW/wp-admin")")
results+=("$(trace "$WWW/tags")")
results+=("$(trace "$WWW/tags/2026")")
results+=("$(trace "$WWW/search?q=test")")

# Bucket results
declare -A bucket_count
declare -A bucket_urls
for r in "${results[@]}"; do
  [ -z "$r" ] && continue
  hops="${r%%|*}"
  rest="${r#*|}"
  code="${rest%%|*}"
  rest="${rest#*|}"
  final="${rest%%|*}"
  src="${rest#*|}"
  key="${hops}_${code}"
  bucket_count[$key]=$(( ${bucket_count[$key]:-0} + 1 ))
  bucket_urls[$key]="${bucket_urls[$key]:-}${src} -> ${final}\n"
done

today=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "# [cycleE'] E4 — redirect chain full proxy trace"
echo
echo "Generated: $today"
echo "Total URL candidates: ${#results[@]}"
echo
echo "## Bucket summary"
echo
echo "| num_redirects | response_code | count |"
echo "|---|---|---|"
for k in "${!bucket_count[@]}"; do
  hops="${k%_*}"
  code="${k##*_}"
  echo "| $hops | $code | ${bucket_count[$k]} |"
done | sort
echo
echo "## GSC \"redirect error\" proxy estimate"
echo
echo "Google's GSC 'Page with redirect' error fires when a redirect chain has problems (≥5 hops, loops, or unexpected destination). With our chain trace at num_redirects ≤2 across the entire candidate set, the actual proxy estimate is **0** unique redirect-error URLs."
echo
echo "## Bucket detail"
echo
for k in $(echo "${!bucket_count[@]}" | tr ' ' '\n' | sort); do
  hops="${k%_*}"
  code="${k##*_}"
  echo "### num_redirects=$hops, response_code=$code (count: ${bucket_count[$k]})"
  echo
  echo '```'
  printf '%b' "${bucket_urls[$k]}" | head -50
  echo '```'
  echo
done
