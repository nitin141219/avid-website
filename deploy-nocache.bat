@echo off
setlocal

set SSH_HOST=89.116.133.94
set SSH_PORT=65002
set SSH_USER=u296044710
set REMOTE_APP_PATH=/home/u296044710/domains/avidorganics.net/public_html
set SITE_URL=https://www.avidorganics.net/

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

echo.
echo Creating optimized .next without cache...
if exist .next-deploy rmdir /s /q .next-deploy
xcopy .next .next-deploy /E /I /Q /EXCLUDE:deploy-exclude.txt
if not exist deploy-exclude.txt (
	echo .next\cache\ > deploy-exclude.txt
	echo .next\dev\ >> deploy-exclude.txt
)
xcopy .next .next-deploy /E /I /Q /EXCLUDE:deploy-exclude.txt

echo.
echo Uploading build artifacts to %REMOTE_APP_PATH% ...

echo Preparing remote folders...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "mkdir -p %REMOTE_APP_PATH% %REMOTE_APP_PATH%/tmp"

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: Could not connect/create remote folder.
	pause
	exit /b 1
)

echo Cleaning previous .next build on server...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "rm -rf %REMOTE_APP_PATH%/.next"

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo WARNING: Could not fully remove old .next folder. Continuing anyway...
	echo.
)

echo Uploading .next-deploy folder to server...
scp -P %SSH_PORT% -r .next-deploy %SSH_USER%@%SSH_HOST%:%REMOTE_APP_PATH%/

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: Upload failed.
	pause
	exit /b 1
)

echo Renaming .next-deploy to .next on server...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cd %REMOTE_APP_PATH% && rm -rf .next && mv .next-deploy .next"

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: Could not rename .next-deploy to .next
	pause
	exit /b 1
)

echo.
echo Verifying routes-manifest.json on server...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "test -f %REMOTE_APP_PATH%/.next/routes-manifest.json"

if %ERRORLEVEL% NEQ 0 (
	echo.
	echo ERROR: Deployment incomplete - routes-manifest.json missing on server
	pause
	exit /b 1
)

echo.
echo Uploading package.json and public folder...
scp -P %SSH_PORT% package.json %SSH_USER%@%SSH_HOST%:%REMOTE_APP_PATH%/
scp -P %SSH_PORT% -r public %SSH_USER%@%SSH_HOST%:%REMOTE_APP_PATH%/

echo.
echo Restarting Passenger application...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "mkdir -p %REMOTE_APP_PATH%/tmp && touch %REMOTE_APP_PATH%/tmp/restart.txt"

echo.
echo Waiting 10 seconds for app to restart...
timeout /t 10 /nobreak > nul

echo.
echo Checking site status...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "curl -s -o /dev/null -w 'Homepage: %%{http_code}\n' %SITE_URL% && curl -s -o /dev/null -w 'Product Page: %%{http_code}\n' %SITE_URL%en/product/alpha-hydroxy-acids/aviga-hp-70"

echo.
echo ========================
echo Deployment Complete!
echo ========================
echo.
echo Site: %SITE_URL%
echo.
pause
