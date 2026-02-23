@echo off
setlocal EnableExtensions EnableDelayedExpansion

set SSH_HOST=89.116.133.94
set SSH_PORT=65002
set SSH_USER=u296044710
set REMOTE_APP_PATH=/home/u296044710/domains/avidorganics.net/public_html
set SITE_URL=https://www.avidorganics.net/
set PRODUCT_URL=https://www.avidorganics.net/en/product/alpha-hydroxy-acids/aviga-hp-70
set SUSTAINABILITY_URL=https://www.avidorganics.net/en/sustainability
set DEPLOY_ARCHIVE=deploy-artifacts.tar.gz
set MAX_RETRIES=3

echo ========================
echo Building Next.js App...
echo ========================
call npm run build

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: Build failed. Deployment aborted.
	pause
	exit /b 1
)

if not exist .next\routes-manifest.json (
	echo.
	echo ERROR: Local build is incomplete. Missing .next\routes-manifest.json
	echo Run a clean build and try again.
	pause
	exit /b 1
)

where scp >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: scp is not available. Install OpenSSH Client on Windows.
	pause
	exit /b 1
)

where ssh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: ssh is not available. Install OpenSSH Client on Windows.
	pause
	exit /b 1
)

if exist %DEPLOY_ARCHIVE% del /f /q %DEPLOY_ARCHIVE%

echo.
echo Creating deployment archive (excluding .next/cache and .next/dev)...
tar --exclude=.next/cache --exclude=.next/dev -czf %DEPLOY_ARCHIVE% .next public package.json package-lock.json

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: Could not create deployment archive.
	pause
	exit /b 1
)

echo.
echo Preparing remote folder...
call :RunSshWithRetry "mkdir -p %REMOTE_APP_PATH% %REMOTE_APP_PATH%/tmp"
if !ERRORLEVEL! NEQ 0 goto :DeployFailed

echo.
echo Uploading deployment archive...
call :RunScpWithRetry "%DEPLOY_ARCHIVE%" "%SSH_USER%@%SSH_HOST%:%REMOTE_APP_PATH%/"
if !ERRORLEVEL! NEQ 0 goto :DeployFailed

echo.
echo Extracting archive and cleaning old build...
call :RunSshWithRetry "cd %REMOTE_APP_PATH% && rm -rf .next && tar -xzf %DEPLOY_ARCHIVE% && rm -f %DEPLOY_ARCHIVE%"
if !ERRORLEVEL! NEQ 0 goto :DeployFailed

echo.
echo Verifying required manifest file on server...
call :RunSshWithRetry "test -f %REMOTE_APP_PATH%/.next/routes-manifest.json"
if !ERRORLEVEL! NEQ 0 (
	echo.
	echo ERROR: Missing .next/routes-manifest.json on server after extraction.
	goto :DeployFailed
)

echo.
echo Installing production dependencies and restarting Passenger...
call :RunSshWithRetry "cd %REMOTE_APP_PATH% && ((/opt/alt/alt-nodejs22/root/usr/bin/npm install --production --omit=dev) || (/opt/alt/alt-nodejs20/root/usr/bin/npm install --production --omit=dev) || (npm install --production --omit=dev)) && mkdir -p tmp && touch tmp/restart.txt"
if !ERRORLEVEL! NEQ 0 goto :DeployFailed

echo.
echo Waiting for app restart...
timeout /t 10 /nobreak >nul

echo.
echo HTTP health checks:
call :RunSshWithRetry "curl -I -s -o /dev/null -w 'Homepage: %%{http_code}\n' %SITE_URL% && curl -I -s -o /dev/null -w 'Product: %%{http_code}\n' %PRODUCT_URL% && curl -I -s -o /dev/null -w 'Sustainability: %%{http_code}\n' %SUSTAINABILITY_URL%"

echo.
echo ===== DEPLOY COMPLETE =====
if exist %DEPLOY_ARCHIVE% del /f /q %DEPLOY_ARCHIVE%
pause
exit /b 0

:RunSshWithRetry
set "SSH_CMD=%~1"
set /a SSH_TRY=1
:SshRetryLoop
echo SSH attempt !SSH_TRY!/%MAX_RETRIES%...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "%SSH_CMD%"
if !ERRORLEVEL! EQU 0 exit /b 0
if !SSH_TRY! GEQ %MAX_RETRIES% exit /b 1
set /a SSH_TRY+=1
echo Retrying SSH in 5 seconds...
timeout /t 5 /nobreak >nul
goto :SshRetryLoop

:RunScpWithRetry
set "SCP_SRC=%~1"
set "SCP_DEST=%~2"
set /a SCP_TRY=1
:ScpRetryLoop
echo SCP attempt !SCP_TRY!/%MAX_RETRIES%...
scp -P %SSH_PORT% "%SCP_SRC%" %SCP_DEST%
if !ERRORLEVEL! EQU 0 exit /b 0
if !SCP_TRY! GEQ %MAX_RETRIES% exit /b 1
set /a SCP_TRY+=1
echo Retrying SCP in 5 seconds...
timeout /t 5 /nobreak >nul
goto :ScpRetryLoop

:DeployFailed
echo.
echo ERROR: Deployment failed after retries.
echo You can retry by running deploy.bat again.
if exist %DEPLOY_ARCHIVE% del /f /q %DEPLOY_ARCHIVE%
pause
exit /b 1

