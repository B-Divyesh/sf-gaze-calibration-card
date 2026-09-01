$ErrorActionPreference = "Stop"

# Execute the production installer with controlled network and process helpers.
# A corrupt download must throw before it can start the installer.
$script:started = $false
$script:destination = $null

function global:Invoke-RestMethod {
  [pscustomobject]@{
    assets = @{
      "windows-x86_64" = [pscustomobject]@{
        url = "https://fixture.invalid/Gaze-Calibration-Card-Setup.exe"
        sha256 = ("0" * 64)
      }
    }
  }
}

function global:Invoke-WebRequest {
  param([string]$Uri, [string]$OutFile)
  $script:destination = $OutFile
  [System.IO.File]::WriteAllText($OutFile, "corrupt fixture")
}

function global:Start-Process {
  param([string]$FilePath)
  $script:started = $true
}

try {
  . (Join-Path $PSScriptRoot ".." "public" "install.ps1")
  throw "The installer completed despite a corrupt download."
} catch {
  if ($_.Exception.Message -notmatch "Checksum verification failed") { throw }
}

if ($script:started) { throw "Start-Process ran before checksum verification." }
if ($script:destination -and (Test-Path $script:destination)) { throw "The corrupt download was not removed." }
Write-Host "PowerShell installer rejected a corrupt download before Start-Process."
