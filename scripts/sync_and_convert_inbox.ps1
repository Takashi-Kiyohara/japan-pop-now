# sync_and_convert_inbox.ps1
# ==========================
# Japan Pop Now inbox HEIC auto-converter (Windows wrapper).
#
# Purpose: Drop iPhone photos (whatever extension) into the OneDrive inbox,
# then run this script. It detects HEIC-in-JPG payloads and converts them to
# WebP q92 without any iOS Shortcut patching.
#
# Usage (PowerShell 7+ recommended, works on Windows PowerShell 5.1):
#   pwsh -File scripts\sync_and_convert_inbox.ps1
#   pwsh -File scripts\sync_and_convert_inbox.ps1 -DryRun
#   pwsh -File scripts\sync_and_convert_inbox.ps1 -Inbox "D:\custom\inbox"
#
# Safety:
#   - ASCII-only per feedback_powershell_ascii_only (no Japanese / em-dash / emoji).
#   - Resolves the inbox via -Inbox, $env:JPN_INBOX, or a list of known roots.
#   - Never deletes real JPEGs or HEIC originals (feedback_no_file_delete).
#     HEIC originals are moved into inbox\_heic_original\.

[CmdletBinding()]
param(
    [string]$Inbox = "",
    [switch]$DryRun,
    [int]$Quality = 92,
    [string]$Python = ""
)

$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message)
    Write-Host "[sync_and_convert_inbox] $Message"
}

function Resolve-PythonExe {
    param([string]$Explicit)
    if ($Explicit -and (Test-Path -LiteralPath $Explicit)) {
        return (Resolve-Path -LiteralPath $Explicit).Path
    }
    $candidates = @("python3", "python", "py")
    foreach ($name in $candidates) {
        $cmd = Get-Command $name -ErrorAction SilentlyContinue
        if ($cmd) {
            if ($name -eq "py") {
                return "py -3"
            }
            return $cmd.Source
        }
    }
    throw "Python not found on PATH. Install Python 3.10+ or pass -Python 'C:\path\to\python.exe'."
}

function Ensure-PillowHeif {
    param([string]$PyExe)
    $check = & cmd /c "$PyExe -c ""import pillow_heif, PIL; print('OK')""" 2>$null
    if ($LASTEXITCODE -eq 0 -and $check -match "OK") {
        return
    }
    Write-Log "Installing pillow-heif + Pillow into the current Python environment..."
    & cmd /c "$PyExe -m pip install --disable-pip-version-check --quiet pillow pillow-heif"
    if ($LASTEXITCODE -ne 0) {
        throw "pip install failed (exit $LASTEXITCODE). Try running the script in an elevated shell or pass -Python for a venv."
    }
}

function Resolve-Inbox {
    param([string]$Explicit)
    if ($Explicit) {
        if (-not (Test-Path -LiteralPath $Explicit)) {
            throw "Inbox path does not exist: $Explicit"
        }
        return (Resolve-Path -LiteralPath $Explicit).Path
    }
    if ($env:JPN_INBOX -and (Test-Path -LiteralPath $env:JPN_INBOX)) {
        return (Resolve-Path -LiteralPath $env:JPN_INBOX).Path
    }
    # Known roots on the Windows host. Wrap each candidate in an explicit
    # array to avoid PowerShell collapsing a single-element result into a
    # scalar (feedback_powershell_pitfalls).
    $userHome = $env:USERPROFILE
    $candidates = @()
    # NOTE: The live OneDrive path on the Windows host contains a
    # non-ASCII (Japanese) folder name that we cannot hardcode here
    # (feedback_powershell_ascii_only). Set $env:JPN_INBOX once and the
    # script will pick it up; otherwise the English fallbacks below
    # cover the other known locations.
    $candidates += (Join-Path $userHome "OneDrive\Documents\Claude\Projects\K10_Japan Pop Now\images_sync\inbox")
    $candidates += (Join-Path $userHome "Documents\Claude\Projects\K10_Japan Pop Now\images_sync\inbox")
    $candidates += (Join-Path $PSScriptRoot "..\images_sync\inbox")
    foreach ($cand in $candidates) {
        if (Test-Path -LiteralPath $cand) {
            return (Resolve-Path -LiteralPath $cand).Path
        }
    }
    throw "Inbox not found. Pass -Inbox or set JPN_INBOX. Checked: $($candidates -join '; ')"
}

# Locate the sibling Python script.
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$converter = Join-Path $scriptRoot "convert_inbox_heic.py"
if (-not (Test-Path -LiteralPath $converter)) {
    throw "convert_inbox_heic.py not found next to this script (expected: $converter)."
}

$pyExe = Resolve-PythonExe -Explicit $Python
Write-Log "Python: $pyExe"

Ensure-PillowHeif -PyExe $pyExe

$inboxPath = Resolve-Inbox -Explicit $Inbox
Write-Log "Inbox : $inboxPath"

$args = @("`"$converter`"", "--inbox", "`"$inboxPath`"", "--quality", "$Quality")
if ($DryRun) {
    $args += "--dry-run"
}

$cmdline = "$pyExe " + ($args -join " ")
Write-Log "Running: $cmdline"

# Use cmd /c so quoting survives across PowerShell/Python boundary.
& cmd /c $cmdline
$exit = $LASTEXITCODE
if ($exit -ne 0) {
    Write-Log "Converter exited with code $exit"
    exit $exit
}

Write-Log "Done. Any HEIC originals are in: $inboxPath\_heic_original"
Write-Log "Manifests: $inboxPath\_manifest_*.json"
