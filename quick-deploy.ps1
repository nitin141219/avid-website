# Quick PowerShell deployment for AVID to Hostinger
# Single SSH session to avoid password re-prompts

$ErrorActionPreference = "Stop"

$SSH_HOST = "89.116.133.94"
$SSH_PORT = 65002
$SSH_USER = "u296044710"
$REMOTE_PATH = "/home/u296044710/domains/avidorganics.net/public_html"
$SITE_URL = "https://www.avidorganics.net/"

Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "  AVID Organics - Quick Deploy" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Step 1: Build
Write-Host "`n[1/5] Building Next.js app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Verify local build
Write-Host "`n[2/5] Verifying local build artifacts..." -ForegroundColor Yellow
if (!(Test-Path ".next\routes-manifest.json")) {
    Write-Host "ERROR: Missing .next\routes-manifest.json locally!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Local build is complete" -ForegroundColor Green

# Step 3: Create tarball
Write-Host "`n[3/5] Creating deployment archive..." -ForegroundColor Yellow
if (Test-Path "deploy.tar.gz") { Remove-Item "deploy.tar.gz" -Force }
tar -czf deploy.tar.gz ".next" "package.json" "package-lock.json" "public"
if (!(Test-Path "deploy.tar.gz")) {
    Write-Host "ERROR: Failed to create tarball!" -ForegroundColor Red
    exit 1
}
$size = (Get-Item "deploy.tar.gz").Length / 1MB
Write-Host "✓ Archive created: $([math]::Round($size, 2)) MB" -ForegroundColor Green

# Step 4: Upload
Write-Host "`n[4/5] Uploading to Hostinger..." -ForegroundColor Yellow
Write-Host "NOTE: You'll be prompted for SSH password" -ForegroundColor Gray
scp -P $SSH_PORT "deploy.tar.gz" "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Upload complete" -ForegroundColor Green

# Step 5: Extract and restart (single SSH session)
Write-Host "`n[5/5] Extracting and restarting on server..." -ForegroundColor Yellow
Write-Host "NOTE: You'll be prompted for SSH password again" -ForegroundColor Gray

$remoteScript = @"
set -e
cd $REMOTE_PATH
echo '[Server] Cleaning old .next...'
rm -rf .next
echo '[Server] Extracting deployment...'
tar -xzf deploy.tar.gz
rm deploy.tar.gz
echo '[Server] Verifying manifest...'
if [ ! -f .next/routes-manifest.json ]; then
    echo 'ERROR: routes-manifest.json missing after extraction!'
    exit 1
fi
echo '[Server] ✓ Manifest verified'
echo '[Server] Installing production dependencies...'
(/opt/alt/alt-nodejs22/root/usr/bin/npm install --production --omit=dev) || \
(/opt/alt/alt-nodejs20/root/usr/bin/npm install --production --omit=dev) || \
(npm install --production --omit=dev)
echo '[Server] Restarting Passenger...'
mkdir -p tmp
touch tmp/restart.txt
echo '[Server] ✓ Restart file touched'
echo '[Server] Waiting 15 seconds for app to start...'
sleep 15
echo '[Server] Checking HTTP status...'
http_code=\$(curl -I -s -o /dev/null -w '%{http_code}' $SITE_URL)
echo "[Server] HTTP response: \$http_code"
if [ "\$http_code" = "200" ]; then
    echo '[Server] ✅ DEPLOYMENT SUCCESSFUL!'
    exit 0
elif [ "\$http_code" = "503" ]; then
    echo '[Server] ⚠️  Still getting 503. Checking stderr log...'
    tail -n 20 stderr.log 2>/dev/null || echo 'No stderr.log'
    exit 1
else
    echo "[Server] ⚠️  Unexpected HTTP code: \$http_code"
    exit 1
fi
"@

ssh -p $SSH_PORT "${SSH_USER}@${SSH_HOST}" $remoteScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "🌐 Visit: $SITE_URL" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment completed but app may have errors" -ForegroundColor Red
    Write-Host "Check logs on the server for more details" -ForegroundColor Yellow
    exit 1
}

# Cleanup
Write-Host "`nCleaning up local tarball..." -ForegroundColor Gray
Remove-Item "deploy.tar.gz" -Force -ErrorAction SilentlyContinue
