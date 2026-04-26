<#
.SYNOPSIS
  Daily indexing health check for japan-pop-now.com (Track C1).

.DESCRIPTION
  Crawls the 40 URLs in $UrlList with Googlebot UA, captures HTTP status,
  canonical, meta robots, and final URL. Writes a JSON log per run, and
  exits non-zero when any anomaly is detected (canonical mismatch, noindex,
  4xx/5xx, redirect to a non-canonical host, etc).

  Designed to run from .github/workflows/indexing-monitor.yml on a daily
  cron, so each run produces a comparable log artifact and a failure can be
  surfaced as a GitHub Issue automatically.

.PARAMETER OutDir
  Directory to write the JSON log into. Defaults to .tmp/indexing-monitor
  in the repo root.

.PARAMETER TimeoutSec
  Per-request HTTP timeout. Defaults to 15 seconds.

.NOTES
  Update $UrlList in tandem with docs/indexing/gsc-inspection-queue-20260426.md.
  The two are intentionally co-located in the codebase as the canonical
  "important URL" set; if they drift, the monitor stops reflecting reality.
#>

param(
  [string]$OutDir = "$PSScriptRoot/../.tmp/indexing-monitor",
  [int]$TimeoutSec = 15
)

$ErrorActionPreference = 'Stop'

# --- URL list (mirror of docs/indexing/gsc-inspection-queue-20260426.md) ---
# Update both files together when adding/removing URLs.
$UrlList = @(
  # Tier 1 — backbone hubs + top-inbound articles (15)
  'https://www.japan-pop-now.com/',
  'https://www.japan-pop-now.com/articles',
  'https://www.japan-pop-now.com/calendar',
  'https://www.japan-pop-now.com/guides',
  'https://www.japan-pop-now.com/category/cafes',
  'https://www.japan-pop-now.com/category/experiences',
  'https://www.japan-pop-now.com/category/destinations',
  'https://www.japan-pop-now.com/articles/tokyo-anime-collab-cafes-spring-2026',
  'https://www.japan-pop-now.com/articles/how-to-book-anime-collab-cafe-japan',
  'https://www.japan-pop-now.com/articles/akihabara-complete-guide-2026',
  'https://www.japan-pop-now.com/articles/ikebukuro-anime-guide-2026',
  'https://www.japan-pop-now.com/articles/japan-ic-card-transit-guide',
  'https://www.japan-pop-now.com/articles/anime-pilgrimage-spots-tokyo',
  'https://www.japan-pop-now.com/articles/demon-slayer-pilgrimage-tokyo',
  'https://www.japan-pop-now.com/articles/animate-cafe-guide-japan',
  # Tier 2 — recent ship (13)
  'https://www.japan-pop-now.com/articles/detective-conan-cafe-tokyo-osaka-3venue-2026',
  'https://www.japan-pop-now.com/articles/chiikawa-land-tokyo-complete-2026',
  'https://www.japan-pop-now.com/articles/pokemon-center-tokyo-complete-guide-2026',
  'https://www.japan-pop-now.com/articles/jjk-sweets-paradise-complete-guide-2026',
  'https://www.japan-pop-now.com/articles/jojo-stone-ocean-cafe-jojo-world-2026',
  'https://www.japan-pop-now.com/articles/dark-moon-chara-cafe-ikebukuro-2026',
  'https://www.japan-pop-now.com/articles/okami-20th-monster-hunter-sakaba-tokyo-osaka-2026',
  'https://www.japan-pop-now.com/articles/my-hero-academia-waffle-diner-ikebukuro-2026',
  'https://www.japan-pop-now.com/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026',
  'https://www.japan-pop-now.com/articles/blue-lock-tokyo-skytree-cafe-2026',
  'https://www.japan-pop-now.com/articles/osaka-anime-cafes-complete-guide-2026',
  'https://www.japan-pop-now.com/articles/kamakura-slam-dunk-pilgrimage-2026',
  'https://www.japan-pop-now.com/articles/pokemon-karaoke-manekineko-30th-anniversary-2026',
  # Tier 3 — mid-tier inbound (12)
  'https://www.japan-pop-now.com/articles/tokyo-anime-district-guide',
  'https://www.japan-pop-now.com/articles/japan-rail-pass-2026-guide',
  'https://www.japan-pop-now.com/articles/japan-esim-pocket-wifi-sim-card',
  'https://www.japan-pop-now.com/articles/osaka-anime-guide-den-den-town',
  'https://www.japan-pop-now.com/articles/nakano-broadway-guide',
  'https://www.japan-pop-now.com/articles/shibuya-harajuku-pop-culture-guide',
  'https://www.japan-pop-now.com/articles/your-name-pilgrimage-tokyo',
  'https://www.japan-pop-now.com/articles/gachapon-guide-japan',
  'https://www.japan-pop-now.com/articles/one-piece-kumamoto-statue-tour',
  'https://www.japan-pop-now.com/articles/weathering-with-you-locations-tokyo',
  'https://www.japan-pop-now.com/articles/game-centers-arcades-japan',
  'https://www.japan-pop-now.com/articles/anime-merch-shopping-guide-japan'
)

if (-not (Test-Path $OutDir)) {
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMddHHmm'
$logPath   = Join-Path $OutDir "run-$timestamp.json"

$ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
$results   = New-Object System.Collections.ArrayList
$anomalies = New-Object System.Collections.ArrayList

function Get-MetaContent {
  param([string]$Html, [string]$Name)
  $pattern = '<meta\s+name="' + [regex]::Escape($Name) + '"\s+content="([^"]+)"'
  if ($Html -match $pattern) { return $matches[1] }
  return $null
}

function Get-Canonical {
  param([string]$Html)
  if ($Html -match '<link\s+rel="canonical"\s+href="([^"]+)"') { return $matches[1] }
  return $null
}

function Get-Title {
  param([string]$Html)
  if ($Html -match '<title>([^<]+)</title>') { return $matches[1] }
  return $null
}

function Test-CanonicalMatch {
  param([string]$Expected, [string]$Actual)
  if (-not $Actual) { return $false }
  $a = $Expected.TrimEnd('/').ToLower()
  $b = $Actual.TrimEnd('/').ToLower()
  return $a -eq $b
}

foreach ($url in $UrlList) {
  Write-Host ('Checking {0} ...' -f $url)
  $entry = [ordered]@{
    url = $url
    status = $null
    finalUrl = $null
    canonical = $null
    robots = $null
    title = $null
    error = $null
  }

  try {
    $resp = Invoke-WebRequest -Uri $url -Headers @{'User-Agent' = $ua} -UseBasicParsing -MaximumRedirection 5 -TimeoutSec $TimeoutSec
    $entry.status = [int]$resp.StatusCode
    $entry.finalUrl = $resp.BaseResponse.ResponseUri.AbsoluteUri
    $html = $resp.Content
    $entry.canonical = Get-Canonical -Html $html
    $entry.robots = Get-MetaContent -Html $html -Name 'robots'
    $entry.title = Get-Title -Html $html

    # Anomaly detection
    if ($entry.status -ne 200) {
      [void]$anomalies.Add([ordered]@{ type = 'non-200'; url = $url; status = $entry.status })
    }
    if ($entry.canonical -and -not (Test-CanonicalMatch -Expected $url -Actual $entry.canonical)) {
      [void]$anomalies.Add([ordered]@{ type = 'canonical-mismatch'; url = $url; canonical = $entry.canonical })
    }
    if ($entry.robots -and ($entry.robots -match 'noindex')) {
      [void]$anomalies.Add([ordered]@{ type = 'noindex-set'; url = $url; robots = $entry.robots })
    }
    if ($entry.finalUrl -and -not (Test-CanonicalMatch -Expected $url -Actual $entry.finalUrl)) {
      [void]$anomalies.Add([ordered]@{ type = 'redirect'; url = $url; finalUrl = $entry.finalUrl })
    }
  } catch {
    $entry.error = $_.Exception.Message
    [void]$anomalies.Add([ordered]@{ type = 'fetch-error'; url = $url; error = $entry.error })
  }

  [void]$results.Add($entry)
}

$summary = [ordered]@{
  timestamp     = (Get-Date).ToString('o')
  urls_checked  = $UrlList.Count
  anomaly_count = $anomalies.Count
  anomalies     = $anomalies
  results       = $results
}

$summary | ConvertTo-Json -Depth 10 | Set-Content -Path $logPath -Encoding utf8

Write-Host ''
Write-Host '=== Summary ==='
Write-Host ('URLs checked : {0}' -f $UrlList.Count)
Write-Host ('Anomalies    : {0}' -f $anomalies.Count)
Write-Host ('Log          : {0}' -f $logPath)

if ($anomalies.Count -gt 0) {
  Write-Host ''
  Write-Host 'Anomalies:'
  foreach ($a in $anomalies) {
    Write-Host ('  - [{0}] {1}' -f $a.type, $a.url)
  }
  exit 1
}

exit 0
