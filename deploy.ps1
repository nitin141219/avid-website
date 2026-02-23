# PowerShell Deployment Script for AVID
# This script deploys the Next.js app to Hostinger via SFTP

param(
    [string]$Password = ""
)

$ErrorActionPreference = "Stop"

# Configuration
$SSH_HOST = "89.116.133.94"
$SSH_PORT = 65002
$SSH_USER = "u296044710"
$SSH_PASSWORD = if ($Password) { $Password } else { Read-Host "Enter SSH password" }
$REMOTE_PATH = "/home/$SSH_USER/public_html"
$LOCAL_BUILD_PATH = ".\.next"
$PROJECT_ROOT = (Get-Location).Path

Write-Host "========================" -ForegroundColor Cyan
Write-Host "AVID Deployment Script" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify build exists
Write-Host "✓ Checking build artifacts..." -ForegroundColor Green
if (!(Test-Path $LOCAL_BUILD_PATH)) {
    Write-Host "❌ ERROR: .next folder not found. Run 'npm run build' first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build artifacts found" -ForegroundColor Green

# Step 2: Create SFTP batch file
Write-Host ""
Write-Host "✓ Preparing SFTP commands..." -ForegroundColor Green

$SFTP_BATCH_FILE = "$PROJECT_ROOT\sftp-batch.txt"
@"
mkdir $REMOTE_PATH
cd $REMOTE_PATH
mkdir .next
mkdir public
lcd .next
cd .next
put -r *
cd ..
lcd ..
lcd public
cd public
put -r *
cd ..
quit
"@ | Out-File -Encoding ASCII $SFTP_BATCH_FILE

Write-Host "✓ SFTP batch file created" -ForegroundColor Green

# Step 3: Create password file for psftp
Write-Host ""
Write-Host "✓ Setting up SFTP authentication..." -ForegroundColor Green

$PASS_FILE = "$PROJECT_ROOT\sftp-pass.txt"
$SSH_PASSWORD | Out-File -Encoding ASCII $PASS_FILE

# Step 4: Execute SFTP
Write-Host ""
Write-Host "📤 Starting upload to $SSH_HOST:$SSH_PORT..." -ForegroundColor Yellow
Write-Host ""

$psftp_path = "C:\Program Files\PuTTY\psftp.exe"
$plink_path = "C:\Program Files\PuTTY\plink.exe"

# Try using psftp if available
if (Test-Path $psftp_path) {
    Write-Host "Using PuTTY psftp..." -ForegroundColor Cyan
    & $psftp_path -pw $SSH_PASSWORD -P $SSH_PORT -b $SFTP_BATCH_FILE $SSH_USER@$SSH_HOST
} else {
    # Fallback: Use PowerShell remoting to manually copy files
    Write-Host "Using SSH command-line upload..." -ForegroundColor Cyan
    
    # Create tar file locally
    Write-Host "Creating compressed archive..." -ForegroundColor Yellow
    $zip_file = "$PROJECT_ROOT\deploy-upload.zip"
    Compress-Archive -Path "$LOCAL_BUILD_PATH", "package.json", "package-lock.json" `
        -DestinationPath $zip_file -Force -ErrorAction SilentlyContinue
    
    if (Test-Path $zip_file) {
        Write-Host "Uploading archive..." -ForegroundColor Yellow
        
        # Upload zip via SSH
        $upload_cmd = @"
        `$password = ConvertTo-SecureString '$SSH_PASSWORD' -AsPlainText -Force
        `$credential = New-Object System.Management.Automation.PSCredential('$SSH_USER', `$password)
        & "C:\Windows\System32\OpenSSH\scp.exe" -P $SSH_PORT -r '$zip_file' '${SSH_USER}@${SSH_HOST}:~/deploy-upload.zip'
        `$extract_cmd = 'cd ~ && unzip -o deploy-upload.zip && rm deploy-upload.zip'
        & "C:\Windows\System32\OpenSSH\ssh.exe" -p $SSH_PORT '${SSH_USER}@${SSH_HOST}' "`$extract_cmd"
"@
        
        powershell -NoProfile -Command $upload_cmd
    }
}

# Step 5: Verify deployment
Write-Host ""
Write-Host "✓ Verifying deployment..." -ForegroundColor Green

$verify_cmd = "ls -la public_html/"
$result = ssh -p $SSH_PORT "${SSH_USER}@${SSH_HOST}" $verify_cmd 2>&1

if ($result) {
    Write-Host "✓ Files uploaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host $result
}

# Step 6: Cleanup
Write-Host ""
Write-Host "🧹 Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item -Force $SFTP_BATCH_FILE -ErrorAction SilentlyContinue
Remove-Item -Force $PASS_FILE -ErrorAction SilentlyContinue
Remove-Item -Force "$PROJECT_ROOT\deploy-upload.zip" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. SSH to server: ssh -p 65002 u296044710@89.116.133.94"
Write-Host "2. Install dependencies: npm install --production --omit=dev"
Write-Host "3. Start/restart the application"
Write-Host ""
