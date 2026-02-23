# Red Hat Display Font - Self-Hosting Security Fix

## Overview
This guide helps you self-host the Red Hat Display font locally to resolve the security issue with Google Fonts.

## Security Issue Fixed
✅ **Removed**: Google Fonts external CDN dependency  
✅ **Removed**: Third-party tracking through Google Fonts  
✅ **Added**: Local font hosting (GDPR/Privacy compliant)  
✅ **Benefit**: Faster font loading (cached from your domain)  

## Font Files Required

Download these WOFF2 font files from [Google Fonts](https://fonts.google.com/specimen/Red+Hat+Display) or [fontsource](https://fontsource.org/fonts/red-hat-display):

Place them in `public/fonts/`:

```
public/
  fonts/
    RedHatDisplay-Light.woff2        (weight: 300)
    RedHatDisplay-Regular.woff2      (weight: 400)
    RedHatDisplay-Medium.woff2       (weight: 500)
    RedHatDisplay-SemiBold.woff2     (weight: 600)
    RedHatDisplay-Bold.woff2         (weight: 700)
    RedHatDisplay-ExtraBold.woff2    (weight: 800)
    RedHatDisplay-Black.woff2        (weight: 900)
```

## Installation Methods

### Method 1: Using NPM Package (Recommended)

Install from `@fontsource`:

```bash
npm install @fontsource/red-hat-display
```

Update `lib/fonts.ts`:

```typescript
import "@fontsource/red-hat-display/300.css";
import "@fontsource/red-hat-display/400.css";
import "@fontsource/red-hat-display/500.css";
import "@fontsource/red-hat-display/600.css";
import "@fontsource/red-hat-display/700.css";
import "@fontsource/red-hat-display/800.css";
import "@fontsource/red-hat-display/900.css";

export const redHatDisplay = {
  variable: "--font-red-hat",
};
```

### Method 2: Manual Download

1. Visit [Google Fonts - Red Hat Display](https://fonts.google.com/specimen/Red+Hat+Display)
2. Download the family (or individual weights)
3. Convert to WOFF2 format (if needed)
4. Place in `public/fonts/`
5. Current `lib/fonts.ts` is already configured for this method

### Method 3: Using Python Script (Bulk Download)

```python
import requests
import os

# Create fonts directory
os.makedirs("public/fonts", exist_ok=True)

# Font weights and their URLs (from Google Fonts CDN)
fonts = {
    "300": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CxXHc6Q.woff2",
    "400": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CldHc6Q.woff2",
    "500": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CxDHc6Q.woff2",
    "600": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CNwHc6Q.woff2",
    "700": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CNoHc6Q.woff2",
    "800": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CMQHc6Q.woff2",
    "900": "https://fonts.gstatic.com/s/redhatdisplay/v21/LDIoaIlHaEyVxMgKqRe7pWxhzh3qDhD8_vfgdqf70CNgHc6Q.woff2",
}

weight_names = {
    "300": "Light",
    "400": "Regular",
    "500": "Medium",
    "600": "SemiBold",
    "700": "Bold",
    "800": "ExtraBold",
    "900": "Black",
}

for weight, url in fonts.items():
    name = weight_names[weight]
    filename = f"public/fonts/RedHatDisplay-{name}.woff2"
    
    response = requests.get(url)
    with open(filename, "wb") as f:
        f.write(response.content)
    
    print(f"✓ Downloaded {filename}")

print("✓ All fonts downloaded successfully!")
```

### Method 4: Direct CDN (Still Some Privacy Concerns)

If you prefer not to host locally, you can use Google Fonts with better privacy (though less optimal):

```css
/* In global.css */
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;600;700;800;900&display=swap');
```

**Not Recommended** - Still tracks requests to Google.

## Verification

After setting up fonts, verify the setup:

### 1. Check font files exist:

```bash
ls -la public/fonts/
```

Expected output:
```
RedHatDisplay-Light.woff2
RedHatDisplay-Regular.woff2
RedHatDisplay-Medium.woff2
RedHatDisplay-SemiBold.woff2
RedHatDisplay-Bold.woff2
RedHatDisplay-ExtraBold.woff2
RedHatDisplay-Black.woff2
```

### 2. Start dev server and inspect in browser:

```bash
npm run dev
```

Open DevTools → Network tab → filter by "woff2"  
You should see font requests pointing to your local domain:
```
http://localhost:3000/_next/static/media/RedHatDisplay-Regular.woff2
```

NOT to `fonts.gstatic.com`

## Security Benefits Summary

| Aspect | Before (Google Fonts) | After (Self-Hosted) |
|--------|----------------------|-------------------|
| **Third-party tracking** | ❌ Google tracks requests | ✅ No external tracking |
| **Privacy** | ❌ Data sent to Google | ✅ Data stays local |
| **GDPR Compliance** | ⚠️ Requires consent banner | ✅ No consent needed |
| **Performance** | 🔄 External request | ✅ Cached locally |
| **Availability** | 🔄 Depends on Google | ✅ Always available |

## Troubleshooting

### Fonts not appearing
1. Clear browser cache: `Ctrl+Shift+Del`
2. Rebuild Next.js: `npm run build`
3. Check file paths in `lib/fonts.ts`

### 404 errors for fonts
1. Ensure fonts are in `public/fonts/`
2. Verify filenames match exactly
3. Check Next.js is running in dev mode

### Build errors
1. Ensure all font files exist before building
2. Run `npm run dev` first to test
3. Check console for error messages

## References

- [Next.js Local Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts)
- [Fontsource - Red Hat Display](https://fontsource.org/fonts/red-hat-display)
- [Google Fonts Privacy Policy](https://policies.google.com/privacy)
- [GDPR & Google Fonts](https://www.dataprivacymanager.com/google-fonts-gdpr/)
