# pre_push_gate.ps1 — Japan Pop Now image validation before git push
# Source this from any push script OR invoke directly.
# ASCII-only.
#
# Usage (source):
#   . .\pre_push_gate.ps1
#   if (-not (Invoke-ImageGate -RepoPath $repoPath -ChangedOnly)) { exit 1 }
#
# Usage (standalone):
#   powershell -File pre_push_gate.ps1 -RepoPath C:\path\to\repo

param(
    [string]$RepoPath = "",
    [switch]$ChangedOnly,
    [switch]$Strict
)

function Find-PythonExe {
    foreach ($cand in @("python3", "python", "py")) {
        try {
            $v = & $cand --version 2>&1
            if ($LASTEXITCODE -eq 0) { return $cand }
        } catch {}
    }
    return $null
}

function Ensure-Pillow {
    param([string]$py)
    $check = & $py -c "import PIL" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Installing Pillow..." -ForegroundColor DarkGray
        & $py -m pip install --quiet --user Pillow 2>&1 | Out-Null
    }
}

function Invoke-ImageGate {
    param(
        [string]$RepoPath,
        [switch]$ChangedOnly,
        [switch]$Strict
    )

    if (-not (Test-Path $RepoPath)) {
        Write-Host "ERROR: Invalid repo path: $RepoPath" -ForegroundColor Red
        return $false
    }

    $py = Find-PythonExe
    if (-not $py) {
        Write-Host "WARN: Python not found, skipping image quality gate." -ForegroundColor Yellow
        Write-Host "  Install Python 3.11+ and re-run for image validation." -ForegroundColor Yellow
        return $true  # don't block if python missing (optional gate)
    }

    Ensure-Pillow -py $py

    $gateScript = Join-Path $RepoPath "scripts\image_quality_gate.py"
    if (-not (Test-Path $gateScript)) {
        Write-Host "WARN: image_quality_gate.py not in repo, skipping." -ForegroundColor Yellow
        return $true
    }

    $args = @($gateScript, "--repo", $RepoPath)
    if ($ChangedOnly) { $args += "--staged" }
    if ($Strict)      { $args += "--strict" }

    Write-Host "`n=== Image Quality Gate ===" -ForegroundColor Cyan
    & $py @args
    $code = $LASTEXITCODE

    if ($code -eq 0) {
        Write-Host "PASS — image gate clear.`n" -ForegroundColor Green
        return $true
    } elseif ($code -eq 2) {
        Write-Host "WARN — quality warnings only (non-blocking without -Strict).`n" -ForegroundColor Yellow
        return $true
    } else {
        Write-Host "FAIL — P0 image errors, push blocked.`n" -ForegroundColor Red
        return $false
    }
}

# If invoked directly (not sourced)
if ($MyInvocation.InvocationName -ne '.') {
    if (-not $RepoPath) {
        Write-Host "ERROR: -RepoPath required when run standalone" -ForegroundColor Red
        exit 1
    }
    if (Invoke-ImageGate -RepoPath $RepoPath -ChangedOnly:$ChangedOnly -Strict:$Strict) {
        exit 0
    } else {
        exit 1
    }
}
