param(
  [string]$OutputDir = (Join-Path $PSScriptRoot '..\dist')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-NormalizedZipPath {
  param(
    [string]$Path
  )

  return ($Path -replace '\\', '/')
}

function Assert-ChildPath {
  param(
    [string]$ParentPath,
    [string]$ChildPath,
    [string]$Label
  )

  $parentFullPath = [System.IO.Path]::GetFullPath($ParentPath)
  $childFullPath = [System.IO.Path]::GetFullPath($ChildPath)
  $comparison = [System.StringComparison]::OrdinalIgnoreCase

  if ($childFullPath.Equals($parentFullPath, $comparison)) {
    throw "$Label must be inside $parentFullPath, not equal to it."
  }

  $parentWithSeparator = $parentFullPath.TrimEnd(
    [System.IO.Path]::DirectorySeparatorChar,
    [System.IO.Path]::AltDirectorySeparatorChar
  ) + [System.IO.Path]::DirectorySeparatorChar

  if (-not $childFullPath.StartsWith($parentWithSeparator, $comparison)) {
    throw "$Label must stay inside $parentFullPath. Got $childFullPath."
  }
}

function Remove-DirectorySafely {
  param(
    [string]$ParentPath,
    [string]$TargetPath,
    [string]$Label
  )

  if (-not (Test-Path -LiteralPath $TargetPath)) {
    return
  }

  Assert-ChildPath -ParentPath $ParentPath -ChildPath $TargetPath -Label $Label
  Remove-Item -LiteralPath $TargetPath -Recurse -Force
}

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$manifestPath = Join-Path $repoRoot 'manifest.json'

if (-not (Test-Path -LiteralPath $manifestPath)) {
  throw "manifest.json was not found at $manifestPath"
}

$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json

if ($manifest.manifest_version -ne 3) {
  throw "Expected manifest_version 3."
}

if ([string]::IsNullOrWhiteSpace($manifest.version)) {
  throw "manifest version is required."
}

if (($manifest.description).Length -gt 132) {
  throw "manifest description must be 132 characters or fewer."
}

$includeFiles = @(
  'manifest.json',
  'assets/icons/icon-16.png',
  'assets/icons/icon-32.png',
  'assets/icons/icon-48.png',
  'assets/icons/icon-128.png',
  'src/shared/rulesStore.js',
  'src/content/contentScript.js',
  'src/popup/popup.html',
  'src/popup/popup.css',
  'src/popup/popup.js'
)

$missingFiles = @()
foreach ($relativePath in $includeFiles) {
  $sourcePath = Join-Path $repoRoot $relativePath
  if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    $missingFiles += $relativePath
  }
}

if ($missingFiles.Count -gt 0) {
  throw "Missing package files: $($missingFiles -join ', ')"
}

$outputRoot = [System.IO.Path]::GetFullPath($OutputDir)
$stageRoot = Join-Path $outputRoot 'package-stage'
$zipName = "board-mute-$($manifest.version).zip"
$zipPath = Join-Path $outputRoot $zipName

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
Remove-DirectorySafely -ParentPath $outputRoot -TargetPath $stageRoot -Label 'package stage directory'
New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null

foreach ($relativePath in $includeFiles) {
  $sourcePath = Join-Path $repoRoot $relativePath
  $destinationPath = Join-Path $stageRoot $relativePath
  $destinationDir = Split-Path -Parent $destinationPath

  New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
  Copy-Item -LiteralPath $sourcePath -Destination $destinationPath
}

if (Test-Path -LiteralPath $zipPath) {
  Assert-ChildPath -ParentPath $outputRoot -ChildPath $zipPath -Label 'release zip'
  Remove-Item -LiteralPath $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
  $stageRoot,
  $zipPath,
  [System.IO.Compression.CompressionLevel]::Optimal,
  $false
)

$expectedEntries = $includeFiles | ForEach-Object { Get-NormalizedZipPath -Path $_ } | Sort-Object
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
  $entries = $zip.Entries |
    Where-Object { -not [string]::IsNullOrEmpty($_.Name) } |
    ForEach-Object { Get-NormalizedZipPath -Path $_.FullName } |
    Sort-Object
} finally {
  $zip.Dispose()
}

$unexpectedEntries = @($entries | Where-Object { $_ -notin $expectedEntries })
$missingEntries = @($expectedEntries | Where-Object { $_ -notin $entries })

if ($missingEntries.Count -gt 0) {
  throw "ZIP is missing entries: $($missingEntries -join ', ')"
}

if ($unexpectedEntries.Count -gt 0) {
  throw "ZIP has unexpected entries: $($unexpectedEntries -join ', ')"
}

if ($entries -notcontains 'manifest.json') {
  throw "ZIP must contain manifest.json at the root."
}

$excludedPatterns = @(
  '^docs/',
  '^scripts/',
  '^README\.md$',
  '^PRIVACY\.md$',
  '^\.git/',
  '^\.gitignore$',
  '^dist/',
  '\.zip$',
  '\.log$'
)

foreach ($entry in $entries) {
  foreach ($pattern in $excludedPatterns) {
    if ($entry -match $pattern) {
      throw "ZIP contains excluded entry: $entry"
    }
  }
}

Write-Output "Built $zipPath"
Write-Output "Entries:"
$entries | ForEach-Object { Write-Output "  $_" }
