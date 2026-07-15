# scripts/pack.ps1 - assembles a Chrome Web Store zip of ONLY runtime-required files.
# Non-destructive: never touches the working tree; builds a clean staging copy + zip.
$ErrorActionPreference = 'Stop'

$root     = Split-Path -Parent $PSScriptRoot
$staging  = Join-Path $root 'package'
$manifest = Get-Content (Join-Path $root 'manifest.json') -Raw | ConvertFrom-Json
$zipPath  = Join-Path $root ("lies-make-fires-v{0}.zip" -f $manifest.version)
$modelDir = 'models/onnx-community/all-MiniLM-L6-v2-ONNX'

$files = @(
  'manifest.json','background.js','content.js','offscreen.js','offscreen.html','ico128.png',
  'dist_/transformers.js',
  'wasm/ort-wasm-simd-threaded.asyncify.wasm','wasm/ort-wasm-simd-threaded.asyncify.mjs',
  'sampleStructures/googleItem.html',
  "$modelDir/config.json","$modelDir/tokenizer.json","$modelDir/tokenizer_config.json",
  "$modelDir/special_tokens_map.json","$modelDir/vocab.txt",
  "$modelDir/onnx/model_q4f16.onnx","$modelDir/onnx/model_q4f16.onnx_data"
)

# 1. Fail early if any required (possibly gitignored) asset is missing
$missing = $files | Where-Object { -not (Test-Path (Join-Path $root $_)) }
if ($missing) { Write-Error ("Missing required files:`n  " + ($missing -join "`n  ")) }

# 2. Clean staging + old zip
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

# 3. Copy allowlist, preserving relative structure
foreach ($f in $files) {
  $dst = Join-Path $staging $f
  New-Item -ItemType Directory -Path (Split-Path $dst -Parent) -Force | Out-Null
  Copy-Item (Join-Path $root $f) $dst -Force
}

# 4. Zip with FORWARD-SLASH entry names (Chrome-safe); manifest.json lands at zip root
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem $staging -Recurse -File | ForEach-Object {
    $entry = $_.FullName.Substring($staging.Length + 1).Replace('\','/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip, $_.FullName, $entry, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $zip.Dispose() }

$zipMB = [math]::Round((Get-Item $zipPath).Length/1MB, 2)
Write-Host ("Built {0}  ({1} MB, {2} files)" -f (Split-Path $zipPath -Leaf), $zipMB, $files.Count)
