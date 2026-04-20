# P0-H Audit: content/articles 配下で本文画像が不足している記事を特定
# Usage:
#   .\p0h_imageless_audit.ps1 -Repo "C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now"
# Output: <Repo>\audits\20260421\p0h_imageless.md + p0h_imageless.json

param(
    [Parameter(Mandatory=$true)] [string]$Repo,
    [string]$ArticlesDir = "content/articles",
    [string]$OutDir = "audits/20260421",
    [double]$MinDensity = 1.0
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8

$articlesPath = Join-Path $Repo $ArticlesDir
if (-not (Test-Path $articlesPath)) {
    Write-Error "Articles dir not found: $articlesPath"
    exit 1
}

$outPath = Join-Path $Repo $OutDir
New-Item -ItemType Directory -Force -Path $outPath | Out-Null

$results = @()

Get-ChildItem -Path $articlesPath -Filter "*.mdx" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    $body = $content -replace '(?s)^---.*?---\s*', ''
    $words = ($body -split '\s+' | Where-Object { $_ -match '\S' }).Count

    $imgCount = 0
    $imgCount += ([regex]::Matches($body, '<img[^>]+>')).Count
    $imgCount += ([regex]::Matches($body, '!\[[^\]]*\]\([^)]+\)')).Count
    $imgCount += ([regex]::Matches($body, '<Image\b')).Count
    $imgCount += ([regex]::Matches($body, '<OptimizedImage\b')).Count

    $density = if ($words -gt 0) { ($imgCount / $words) * 1000 } else { 0 }
    $flag = ($imgCount -eq 0) -or ($density -lt $MinDensity)

    if ($flag) {
        $slug = $file.BaseName
        $results += [PSCustomObject]@{
            slug          = $slug
            words         = $words
            body_images   = $imgCount
            density_1000w = [math]::Round($density, 2)
            severity      = if ($imgCount -eq 0) { "FATAL" } else { "WARN" }
        }
    }
}

$results = $results | Sort-Object severity, density_1000w

$jsonOut = Join-Path $outPath "p0h_imageless.json"
$results | ConvertTo-Json -Depth 3 | Out-File $jsonOut -Encoding utf8
Write-Host "JSON: $jsonOut"

$mdOut = Join-Path $outPath "p0h_imageless.md"
$fatalCount = ($results | Where-Object { $_.severity -eq 'FATAL' } | Measure-Object).Count
$warnCount  = ($results | Where-Object { $_.severity -eq 'WARN'  } | Measure-Object).Count

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# P0-H Imageless Articles Audit")
[void]$sb.AppendLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
[void]$sb.AppendLine("Articles dir: $ArticlesDir")
[void]$sb.AppendLine("Threshold: < $MinDensity images per 1000 words")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("Total flagged: $($results.Count)")
[void]$sb.AppendLine("- FATAL (0 body images): $fatalCount")
[void]$sb.AppendLine("- WARN (low density): $warnCount")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("## Flagged Articles")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("| Severity | Slug | Words | Body Images | Density/1000w |")
[void]$sb.AppendLine("|---|---|---|---|---|")
foreach ($r in $results) {
    [void]$sb.AppendLine("| $($r.severity) | $($r.slug) | $($r.words) | $($r.body_images) | $($r.density_1000w) |")
}
$sb.ToString() | Out-File $mdOut -Encoding utf8
Write-Host "Markdown: $mdOut"

Write-Host ""
Write-Host "=== SUMMARY ==="
Write-Host "Total flagged: $($results.Count)"
Write-Host "FATAL (0 images): $fatalCount"
Write-Host "WARN (low density): $warnCount"
Write-Host ""
Write-Host "Top 10 most critical:"
$results | Select-Object -First 10 | Format-Table severity, slug, words, body_images, density_1000w -AutoSize
