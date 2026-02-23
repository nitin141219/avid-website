#!/usr/bin/env pwsh
# Optimized AVID deployment - excludes unnecessary .next cache/dev files

$ErrorActionPreference = "Stop"

$SSH_HOST = "89.116.133.94"
$SSH_PORT = 65002
$SSH_USER = "u296044710"
$REMOTE_PATH = "/home/u296044710/domains/avidorganics.net/public_html"
$SITE_URL = "https://www.avidorganics.net/"

Write-Host "`n====================================" -ForegroundColor Cyan
Write-Host "  AVID Optimized Deployment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Step 1: Build check
Write-Host "`n[1/6] Checking local build..." -ForegroundColor Yellow
if (!(Test-Path ".next\BUILD_ID")) {
    Write-Host "No existing build found. Running npm run build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed!" -ForegroundColor Red
        exit 1
    }
}

if (!(Test-Path ".next\routes-manifest.json")) {
    Write-Host "ERROR: Missing routes-manifest.json in build!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Local build verified" -ForegroundColor Green

# Step 2: Create optimized tarball (exclude cache and dev dirs)
Write-Host "`n[2/6] Creating optimized deployment archive..." -ForegroundColor Yellow
Write-Host "Excluding: .next/cache, .next/dev (not needed in production)" -ForegroundColor Gray

if (Test-Path "deploy-optimized.tar.gz") { Remove-Item "deploy-optimized.tar.gz" -Force }

# Create tarball excluding cache and dev directories
tar -czf deploy-optimized.tar.gz `
    --exclude=".next/cache" `
    --exclude=".next/dev" `
    ".next" "package.json" "package-lock.json" "public"

if (!(Test-Path "deploy-optimized.tar.gz")) {
    Write-Host "ERROR: Failed to create tarball!" -ForegroundColor Red
    exit 1
}

$size = (Get-Item "deploy-optimized.tar.gz").Length / 1MB
Write-Host "✓ Archive created: $([math]::Round($size, 2)) MB (optimized)" -ForegroundColor Green

# Step 3: Upload
Write-Host "`n[3/6] Uploading to Hostinger..." -ForegroundColor Yellow
Write-Host "NOTE: Enter SSH password when prompted" -ForegroundColor Gray
scp -P $SSH_PORT "deploy-optimized.tar.gz" "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Upload complete" -ForegroundColor Green

# Step 4: Extract and deploy
Write-Host "`n[4/6] Extracting on server..." -ForegroundColor Yellow

$remoteExtract = @"
set -e
cd $REMOTE_PATH
echo '[Server] Removing old .next directory...'
rm -rf .next
echo '[Server] Extracting deployment archive...'
tar -xzf deploy-optimized.tar.gz
rm deploy-optimized.tar.gz
echo '[Server] ✓ Extraction complete'
"@

ssh -p $SSH_PORT "${SSH_USER}@${SSH_HOST}" $remoteExtract
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Extraction failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Extraction successful" -ForegroundColor Green

# Step 5: Install dependencies and restart
Write-Host "`n[5/6] Installing dependencies and restarting..." -ForegroundColor Yellow

$remoteRestart = @"
set -e
cd $REMOTE_PATH
echo '[Server] Verifying manifest...'
if [ ! -f .next/routes-manifest.json ]; then
    echo 'ERROR: routes-manifest.json missing!'
    exit 1
fi
echo '[Server] ✓ Manifest exists'
echo '[Server] Installing production dependencies...'
(/opt/alt/alt-nodejs22/root/usr/bin/npm install --production --omit=dev 2>&1 | head -20) || \
(/opt/alt/alt-nodejs20/root/usr/bin/npm install --production --omit=dev 2>&1 | head -20) || \
(npm install --production --omit=dev 2>&1 | head -20)
echo '[Server] Restarting Passenger...'
mkdir -p tmp
touch tmp/restart.txt
echo '[Server] ✓ Restart triggered'
"@

ssh -p $SSH_PORT "${SSH_USER}@${SSH_HOST}" $remoteRestart
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Deployment may be incomplete" -ForegroundColor Yellow
}

# Step 6: Verify deployment
Write-Host "`n[6/6] Verifying deployment..." -ForegroundColor Yellow
Write-Host "Waiting 15 seconds for app to start..." -ForegroundColor Gray
Start-Sleep -Seconds 15

$verifyScript = @"
cd $REMOTE_PATH
echo '[Server] HTTP Status Check:'
http_code=\$(curl -I -s -o /dev/null -w '%{http_code}' $SITE_URL)
echo "HTTP \$http_code"
if [ "\$http_code" = "200" ]then
    echo '✅ DEPLOYMENT SUCCESSFUL!'
    exit 0
else
    echo '⚠️  HTTP code: '\$http_code
    echo 'Recent errors:'
    tail -n 30 stderr.log 2>/dev/null || echo 'No error log'
    exit 1
fi
"@

ssh -p $SSH_PORT "${SSH_USER}@${SSH_HOST}" $verifyScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "🌐 Visit: $SITE_URL" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Deployment uploaded but app may have issues" -ForegroundColor Yellow
    Write-Host "Check logs on the server" -ForegroundColor Gray
}

# Cleanup
Write-Host "`nCleaning up..." -ForegroundColor Gray
Remove-Item "deploy-optimized.tar.gz" -Force -ErrorAction SilentlyContinue
Write-Host "Done.`n" -ForegroundColor Green
