# Hostinger Deployment Guide

## Quick Deploy

**On Windows:**
```bash
deploy.bat
```

**On Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

This will build your Next.js app and show you the next steps.

---

## Deployment Methods

### ✅ Option 1: SSH/Git Deployment (Recommended if Node.js enabled)

**Prerequisites:**
- Node.js hosting enabled on your Hostinger account
- SSH access to your server

**Steps:**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Set up git on Hostinger server:**
   ```bash
   ssh your_username@your_server
   cd public_html
   git init --bare app.git
   cd app.git/hooks
   ```

3. **Create post-receive hook:**
   Create file: `post-receive` (no extension)
   ```bash
   #!/bin/bash
   GIT_WORK_TREE=/home/user/public_html/app.git/work git checkout -f
   cd /home/user/public_html/app.git/work
   npm install --production
   pm2 restart avid-app
   ```
   
   Make it executable:
   ```bash
   chmod +x post-receive
   ```

4. **Add remote and push:**
   ```bash
   git remote add hostinger ssh://user@your_server/~/app.git
   git push hostinger main
   ```

---

### ✅ Option 2: SFTP/Manual Upload (Works everywhere)

**Prerequisites:**
- FTP/SFTP access (usually included with Hostinger)
- SSH access (optional, for commands)

**Steps:**

1. **Build project:**
   ```bash
   npm run build
   ```

2. **Files to upload:**
   - `.next/` folder (production build)
   - `package.json`
   - `package-lock.json`
   - `public/` folder (if needed)

3. **Upload via SFTP or File Manager:**
   - Use FileZilla, WinSCP, or Hostinger File Manager
   - Upload to `public_html/` or your app directory

4. **Install production dependencies:**
   ```bash
   ssh your_username@your_server
   cd public_html
   npm install --production
   ```

5. **Start the app:**
   ```bash
   npm start
   ```

---

### ✅ Option 3: Using Hostinger's File Manager

1. Build locally: `npm run build`
2. In Hostinger control panel → File Manager
3. Upload `.next/` folder
4. Upload `package.json` and `package-lock.json`
5. Use Terminal in File Manager to run `npm install --production`

---

## Configuration

### Environment Variables

On Hostinger, set these in your control panel or `.env.production`:

```env
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_BASE_URL=https://www.avidorganics.net
BACKEND_URL=https://api.avidorganics.net/
JWT_SECRET=your_secret_here
NODE_ENV=production
```

### Port Configuration

Next.js runs on **port 3000** by default. Hostinger typically:
- Maps port 3000 to port 80/443
- Or use a reverse proxy

Check Hostinger documentation for your hosting type.

---

## Using ProcessManager (PM2)

If you have SSH access:

```bash
npm install -g pm2
pm2 start "npm start" --name "avid-organics"
pm2 startup
pm2 save
```

---

## Troubleshooting

**Build fails?**
- Check Node.js version matches: `node -v`
- Clear cache: `rm -rf .next node_modules && npm install`

**App won't start?**
- Check logs: `pm2 logs`
- Verify environment variables are set
- Check port 3000 is allowed/not blocked

**Git push fails?**
- Verify SSH key is added: `ssh-keygen -t rsa`
- Add public key to Hostinger SSH keys
- Test connection: `ssh user@server`

**File upload fails?**
- Ensure directory is writable
- Check file permissions: `chmod 755`

---

## Deployment Checklist

- [ ] Built project locally: `npm run build`
- [ ] `.next` folder generated
- [ ] `.env.production` configured
- [ ] Uploaded to Hostinger
- [ ] Dependencies installed on server
- [ ] Node.js process running (PM2 or manual)
- [ ] Domain pointing to server
- [ ] SSL certificate active
- [ ] Test: Visit your domain

---

## Need Help?

- Hostinger docs: https://support.hostinger.com/
- Next.js production: https://nextjs.org/docs/deployment
- PM2 docs: https://pm2.keymetrics.io/
