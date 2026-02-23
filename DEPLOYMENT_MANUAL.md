# AVID Application - Manual Deployment Guide

## ✅ Build Status
Your application has been successfully built and is ready for deployment.

**Build Summary:**
- TypeScript: 0 errors ✓
- All 56 routes compiled successfully ✓
- Localization files synced ✓
- Output: `.next/` folder (~150MB+)

## 📋 Files Ready for Deployment

```
.next/                          (Next.js compiled build)
package.json                    (Dependencies manifest)
package-lock.json              (Dependency lock)
public/                         (Static assets)
```

## 🚀 Deployment Steps

### Step 1: Connect to Hostinger Server
```bash
ssh -p 65002 u296044710@89.116.133.94
```
**Password:** Avid@2026#

### Step 2: Navigate to Home Directory
```bash
cd ~
mkdir -p public_html
cd public_html
```

### Step 3: Upload Files (From Your Local Machine - Run in Another Terminal)

#### Option A: Using SCP (Simple Copy)
```bash
# From Windows PowerShell on your machine:
scp -P 65002 -r "C:\Users\nrohit\Documents\AVID-01\.next" u296044710@89.116.133.94:~/public_html/
scp -P 65002 "C:\Users\nrohit\Documents\AVID-01\package.json" u296044710@89.116.133.94:~/public_html/
scp -P 65002 "C:\Users\nrohit\Documents\AVID-01\package-lock.json" u296044710@89.116.133.94:~/public_html/
```

#### Option B: Using SFTP (If SCP Fails)
```
# On your machine, create sftp-commands.txt:
cd public_html
mkdir .next
cd .next
put -r "C:\Users\nrohit\Documents\AVID-01\.next\*" .
cd ..
put "C:\Users\nrohit\Documents\AVID-01\package.json"
put "C:\Users\nrohit\Documents\AVID-01\package-lock.json"
quit

# Then run:
sftp -P 65002 -b sftp-commands.txt u296044710@89.116.133.94
```

### Step 4: Install Dependencies on Server
Once files are uploaded:

```bash
# Still connected to server
cd ~/public_html
npm install --production --omit=dev
```

### Step 5: Verify Installation
```bash
ls -la
# Should show: .next/  node_modules/  package.json  package-lock.json
```

### Step 6: Start the Application

**Option A: Direct Node.js**
```bash
npm start
# Or for production:
NODE_ENV=production npm start
```

**Option B: Using PM2 (Recommended for Production)**
```bash
npm install -g pm2  # if not already installed
pm2 start "npm start" --name "avid-app"
pm2 save
```

**Option C: Using Screen (Session)**
```bash
screen -S avid-app
npm start
# Press Ctrl+A then D to detach
```

### Step 7: Test Deployment
From your machine:
```bash
curl -I http://89.116.133.94:3000
# Or open in browser: http://89.116.133.94:3000
```

## 🌐 Accessing the Live Site

- **URL:** http://89.116.133.94:3000
- **Or:** https://www.avidorganics.net (if DNS configured)

## 🔧 Troubleshooting

### Connection Issues
- Verify password: `Avid@2026#`
- Check port: `65002`
- Verify SSH key if using key-based auth

### Upload Stuck?
- Check available disk space: `df -h`
- Check if port is blocked: `telnet 89.116.133.94 65002`

### App Won't Start?
```bash
# Check Node version
node --version  # Should be v16+ or v18+

# Check npm packages
npm list

# Check for errors
npm start 2>&1 | head -50
```

### Port Already in Use?
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port:
PORT=3001 npm start
```

## 📊 Application Features (Ready to Deploy)

✅ Mobile Image Support  
  - Responsive images with mobile/desktop fallbacks
  - Mobile images automatically selected on small screens
  - Admin forms support mobile image uploads

✅ Mobile UI Fixes
  - Header utilities (Login, Contact Us, Languages) visible on mobile
  - Carousels with swipe support and grab cursor feedback
  - Mobile-optimized navigation

✅ Complete CMS
  - Admin panel for News, Blogs, Events
  - Image upload with mobile image support
  - Full CRUD operations

✅ Localization
  - 4 languages supported (English, Spanish, French, German)
  - All translation files synced

✅ SEO Optimization
  - Dynamic meta tags
  - Sitemap generation
  - Robots.txt configuration

## 📝 Environment Variables
If needed, add `.env.production` file on server with:
```
DATABASE_URL=<your-db-url>
API_BASE_URL=<your-api-url>
NEXT_PUBLIC_API_URL=<your-public-api-url>
```

## 🎯 Post-Deployment Checklist

- [ ] Files uploaded successfully
- [ ] Dependencies installed
- [ ] Application started without errors
- [ ] Site accessible at http://89.116.133.94:3000
- [ ] Test mobile responsiveness
- [ ] Test image loading (both mobile and desktop)
- [ ] Test carousel swipe on mobile
- [ ] Test all navigation links
- [ ] Verify admin panel login works
- [ ] Configure domain DNS if using custom domain

## 🆘 Need Help?

If you encounter issues:

1. **SSH into server and check logs:**
   ```bash
   ssh -p 65002 u296044710@89.116.133.94
   cd ~/public_html
   npm start 2>&1  # View live errors
   ```

2. **Check system resources:**
   ```bash
   top  # CPU/Memory usage
   df -h  # Disk space
   ```

3. **Verify file permissions:**
   ```bash
   ls -la ~/public_html
   chmod 755 -R .next
   ```

---

**Created:** 2026-02-19  
**Project:** AVID Organics Landing Page  
**Build Version:** Next.js 16.1.6  
