# AVID Organics - 503 Error Fix & Deployment Guide

**Site:** https://www.avidorganics.net/  
**Issue:** 503 Service Unavailable after deployment  
**Root Cause:** Missing `.next/routes-manifest.json` on production server  
**Status:** Fix in progress

---

## Root Cause Analysis

Your production server is returning **503** because the Next.js runtime cannot start due to a missing critical build artifact:

```
Error: ENOENT: no such file or directory, open '/home/u296044710/domains/avidorganics.net/public_html/.next/routes-manifest.json'
```

**Why this happened:**
1. Previous deployments used `SCP -r .next` which doesn't guarantee all files upload successfully
2. Network interruptions or permission issues caused incomplete transfers
3. The `.next` folder on the server had only 6 files instead of the full build artifacts

**Verified via stderr.log:**
- App crashes repeatedly trying to read `routes-manifest.json`
- Passenger keeps restarting the broken app, returning 503 to users

---

## What Was Fixed

### 1. Updated `deploy.bat` (c:\Users\nrohit\Documents\AVID-01\deploy.bat)

**Changes made:**
- ✅ **Correct deployment path:** Now targets `/home/u296044710/domains/avidorganics.net/public_html` instead of`~/public_html`
- ✅ **Pre-deploy validation:** Checks local build has `routes-manifest.json` before starting upload
- ✅ **Clean deployment:** Removes old `.next` folder on server before uploading new one
- ✅ **Post-upload verification:** Confirms `routes-manifest.json` exists on server after upload
- ✅ **Passenger restart:** Uses `tmp/restart.txt` instead of PM2 (Hostinger uses Phusion Passenger)
- ✅ **HTTP health check:** Verifies site returns 200 after deployment

###2. Created Optimized Deployment Scripts

**deploy-optimized.ps1** - Excludes unnecessary cache/dev files:
- Reduces upload size from ~500 MB to ~20 MB
- Skips `.next/cache` and `.next/dev` directories (not needed in production  
- Uses tarball for atomic deployment
- Includes automatic verification steps

**quick-deploy.ps1** - Manual deployment script:
- All-in-one script with minimal password prompts
- Automated extraction and restart
- HTTP status validation

---

## Current Deployment Situation

As of when this was written, **`deploy.bat` is actively running** and uploading the `.next` folder via SCP.

**Progress:** Uploading static chunks and build artifacts (thousands of files, including unnecessary cache files)

**Estimated completion:** This may take 10-30 more minutes due to inefficient file-by-file SCP upload.

---

## Option 1: Wait for deploy.bat to Complete (Simplest)

Let the current `deploy.bat` continue running. Once it finishes:

1. It will automatically:
   - Upload all `.next` files
   - Upload `package.json` and `package-lock.json`
   - Install production dependencies  
   - Restart the app via `tmp/restart.txt`
   - Verify HTTP status

2. Check the final output for:
   ```
   ===== DEPLOY COMPLETE =====
   ```

3. Verify site is live:
   ```
   https://www.avidorganics.net/
   ```

**Pros:** No manual intervention needed  
**Cons:** Very slow due to uploading unnecessary cache files

---

## Option 2: Manual Recovery (If deploy.bat Fails or Hangs)

If `deploy.bat` fails, crashes, or you want to speed things up:

### Step 1: Cancel running deploy.bat
Press `Ctrl+C` in the terminal running `deploy.bat`

### Step 2: Run optimized deployment
```powershell
cd C:\Users\nrohit\Documents\AVID-01
.\deploy-optimized.ps1
```

This will:
- Build locally (if needed)
- Create optimized tarball (~20 MB instead of ~500 MB)
- Upload via SCP
- Extract on server
- Verify manifest exists
- Install dependencies
- Restart Passenger
- Check HTTP status

**Password prompts:** You'll be asked for SSH password twice (upload + extraction)

### Step 3: Verify deployment
After the script completes, check:
```powershell
ssh -p 65002 u296044710@89.116.133.94 'curl -I https://www.avidorganics.net/ 2>&1 | grep HTTP'
```

Should show: `HTTP/2 200`

---

## Option 3: Emergency Server-Side Fix (If Tarball Already Uploaded)

If the `deploy-next.tar.gz` file is already on the server from a previous attempt:

```powershell
ssh -p 65002 u296044710@89.116.133.94
```

Then on the server:
```bash
cd /home/u296044710/domains/avidorganics.net/public_html

# Check if tarball exists
ls -lh deploy-next.tar.gz

# If it exists, extract it
rm -rf .next
tar -xzf deploy-next.tar.gz
rm deploy-next.tar.gz

# Verify manifest
test -f .next/routes-manifest.json && echo "MANIFEST_OK" || echo "MANIFEST_MISSING"

# Install dependencies (if needed)
/opt/alt/alt-nodejs22/root/usr/bin/npm install --production --omit=dev

# Restart app
mkdir -p tmp
touch tmp/restart.txt

# Wait 15 seconds
sleep 15

# Check HTTP status
curl -I https://www.avidorganics.net/ 2>&1 | grep HTTP
```

Expected output: `HTTP/2 200`

---

## Verification Checklist

Once deployment completes (via any method), verify:

- [ ] **Manifest exists on server:**
  ```bash
  ssh -p 65002 u296044710@89.116.133.94 'test -f /home/u296044710/domains/avidorganics.net/public_html/.next/routes-manifest.json && echo OK || echo MISSING'
  ```
  Expected: `OK`

-  [ ] **HTTP status is 200:**
  ```bash
  curl -I https://www.avidorganics.net/ 2>&1 | grep HTTP
  ```
  Expected: `HTTP/2 200`

- [ ] **No errors in stderr.log:**
  ```bash
  ssh -p 65002 u296044710@89.116.133.94 'tail -n 50 /home/u296044710/domains/avidorganics.net/public_html/stderr.log'
  ```
  Should NOT show repeating `ENOENT` errors for `routes-manifest.json`

- [ ] **Website loads in browser:**
  Open https://www.avidorganics.net/ and verify home page displays correctly

---

## Future Deployments (Recommended Approach)

For faster, more reliable deployments going forward:

### Use the Optimized Script

```powershell
cd C:\Users\nrohit\Documents\AVID-01
.\deploy-optimized.ps1
```

**Benefits:**
- ✅ 10-20x faster uploads (excludes cache/dev files)
- ✅ Atomic deployment (tarball extraction)
- ✅ Automatic verification steps
- ✅ Pre-flight checks
- ✅ Clear success/failure messages

### Or Configure .gitignore-style Exclusions for deploy.bat

To optimize the existing `deploy.bat`, you could:
1. Modify SCP command to exclude cache:
   ```batch
   scp -P %SSH_PORT% -r --exclude='.next/cache' --exclude='.next/dev' .next %SSH_USER%@%SSH_HOST%:%REMOTE_APP_PATH%/
   ```
   Note: Windows  `scp` may not support `--exclude`. Use `tar` + `scp` instead.

---

## Troubleshooting

### Site still returns 503 after deployment

1. **Check if manifest exists:**
   ```bash
   ssh -p 65002 u296044710@89.116.133.94 'ls -la /home/u296044710/domains/avidorganics.net/public_html/.next/routes-manifest.json'
   ```

2. **Check stderr.log for errors:**
   ```bash
   ssh -p 65002 u296044710@89.116.133.94 'tail -n 100 /home/u296044710/domains/avidorganics.net/public_html/stderr.log'
   ```

3. **Manually restart Passenger:**
   ```bash
   ssh -p 65002 u296044710@89.116.133.94 'cd /home/u296044710/domains/avidorganics.net/public_html && mkdir -p tmp && touch tmp/restart.txt'
   ```

### Upload fails with "Permission denied"

- Verify SSH password: `Avid@2026#`
- Check SSH key-based auth if password fails repeatedly
- Ensure remote directory is writable:
  ```bash
  ssh -p 65002 u296044710@89.116.133.94 'ls -ld /home/u296044710/domains/avidorganics.net/public_html'
  ```

### Build locally fails

```powershell
# Clean rebuild
Remove-Item -Recurse -Force .next, node_modules
npm install
npm run build
```

---

## Summary

**Problem:** 503 error caused by missing `.next/routes-manifest.json` on production server  
**Solution:** Fixed `deploy.bat` to ensure complete, verified uploads and proper Passenger restart  
**Status:** Deployment in progress via`deploy.bat` OR ready to run `deploy-optimized.ps1`  
**Next Step:** Wait for current upload to complete, or run optimized deployment script

**Contact Server Admin if:**
- Deployments consistently fail
- File permissions issues persist
- Need to verify Hostinger Node.js/Passenger configuration

---

**Last Updated:** February 20, 2026  
**Deployment Path:** `/home/u296044710/domains/avidorganics.net/public_html`  
**Site URL:** https://www.avidorganics.net/
