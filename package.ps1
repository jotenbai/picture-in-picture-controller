# Build a Chrome Web Store–ready ZIP from extension source files.
# Usage: .\package.ps1
# Output: pip-controller-v<version>.zip (version from manifest.json)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

$rootFiles = @(
  "manifest.json",
  "background.js",
  "popup.html",
  "popup.js",
  "popup-i18n.js"
)

$contentFiles = @("bridge.js", "pip-toggle.js")
$iconFiles = @("icon16.png", "icon32.png", "icon48.png", "icon128.png")

$manifestPath = Join-Path $Root "manifest.json"
if (-not (Test-Path $manifestPath)) {
  throw "manifest.json not found in $Root"
}

$manifest = Get-Content $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$version = $manifest.version
if (-not $version) {
  throw "manifest.json has no version field"
}

$zipName = "pip-controller-v$version.zip"
$zipPath = Join-Path $Root $zipName
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) "pip-controller-package-$([Guid]::NewGuid().ToString('N'))"

function Assert-FileExists([string]$path, [string]$label) {
  if (-not (Test-Path $path)) {
    throw "Missing $label : $path"
  }
}

foreach ($f in $rootFiles) {
  Assert-FileExists (Join-Path $Root $f) $f
}
$contentDir = Join-Path $Root "content"
$iconsDir = Join-Path $Root "icons"

foreach ($f in $contentFiles) {
  Assert-FileExists (Join-Path $contentDir $f) "content\$f"
}
foreach ($f in $iconFiles) {
  Assert-FileExists (Join-Path $iconsDir $f) "icons\$f"
}

$tempContent = Join-Path $tempDir "content"
$tempIcons = Join-Path $tempDir "icons"
New-Item -ItemType Directory -Path $tempDir, $tempContent, $tempIcons -Force | Out-Null

try {
  foreach ($f in $rootFiles) {
    Copy-Item (Join-Path $Root $f) (Join-Path $tempDir $f)
  }
  foreach ($f in $contentFiles) {
    Copy-Item (Join-Path $contentDir $f) (Join-Path $tempContent $f)
  }
  foreach ($f in $iconFiles) {
    Copy-Item (Join-Path $iconsDir $f) (Join-Path $tempIcons $f)
  }

  if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
  }

  Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -CompressionLevel Optimal
  $sizeKb = [math]::Round((Get-Item $zipPath).Length / 1KB, 1)
  Write-Host "OK: $zipPath ($sizeKb KB)"
  Write-Host "Upload this ZIP in Chrome Web Store Developer Dashboard."
}
finally {
  if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
  }
}
