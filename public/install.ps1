$ErrorActionPreference = "Stop"
$manifestUrl = "https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/latest/download/latest.json"
$manifest = Invoke-RestMethod -Uri $manifestUrl
$asset = $manifest.assets."windows-x86_64"
if (-not $asset.url -or -not $asset.sha256) { throw "The release manifest is missing the Windows installer." }
$destination = Join-Path $env:TEMP "Gaze-Calibration-Card-Setup.exe"
Invoke-WebRequest -Uri $asset.url -OutFile $destination
$actual = (Get-FileHash -Algorithm SHA256 $destination).Hash.ToLowerInvariant()
if ($actual -ne $asset.sha256.ToLowerInvariant()) { Remove-Item $destination; throw "Checksum verification failed; nothing was installed." }
Write-Host "Verified the SHA256 checksum. Starting the Gaze Calibration Card installer from $destination."
Write-Host "This build is unsigned; Windows may ask you to confirm that you want to run it."
Start-Process -FilePath $destination
