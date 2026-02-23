@echo off
REM AVID Organics - One-Command SSH Deployment to Hostinger
REM Just 2 steps!

echo.
echo ========================================
echo   AVID Organics - Deploy to Hostinger
echo        (One Command!)
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Step 1: Building your site...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Hostinger...
echo.

REM SSH details (from Hostinger)
set SSH_HOST=89.116.133.94
set SSH_PORT=65002
set SSH_USER=u296044710
set REMOTE_PATH=~/public_html/avid-app

REM Create remote folder if it doesn't exist
powershell -Command "& { ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% 'mkdir -p %REMOTE_PATH%' }"

REM Upload files via SCP
echo Uploading .next folder...
powershell -Command "& { scp -P %SSH_PORT% -r .next %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/ }"

echo Uploading package.json...
powershell -Command "& { scp -P %SSH_PORT% package.json %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/ }"

echo Uploading package-lock.json...
powershell -Command "& { scp -P %SSH_PORT% package-lock.json %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/ }"

if exist "public\" (
    echo Uploading public folder...
    powershell -Command "& { scp -P %SSH_PORT% -r public %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/ }"
)

REM Install and start on remote server
echo.
echo Installing dependencies on server...
powershell -Command "& { ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% 'cd %REMOTE_PATH% && npm install --production' }"

echo.
echo Starting app with PM2...
powershell -Command "& { ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% 'cd %REMOTE_PATH% && npm install -g pm2 && pm2 start \"npm start\" --name \"avid-app\" && pm2 save' }"

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your site is now live!
echo Visit: https://www.avidorganics.net
echo.
pause
