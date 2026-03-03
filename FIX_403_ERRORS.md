# 403 Forbidden Error - Troubleshooting Guide

## What is a 403 Error?

A **403 Forbidden** error means:
- The server **understood** your request
- But **refuses to authorize** access to the resource
- Unlike 401 (authentication required), 403 means you're authenticated but **not permitted**

---

## Where 403 Errors Occur in This App

### 1. Blog/News/Events API Calls
**Location:** `/api/blogs/[slug]`, `/api/news/[slug]`, `/api/events/[slug]`

**Symptoms:**
- Blog/news/event pages show "Not Found"
- Console shows: `403 Forbidden: Blog API access denied`

**Fixes:**
✅ **Check CORS configuration** on backend API
✅ **Verify API authentication** (if required)
✅ **Check NEXT_PUBLIC_BASE_URL** environment variable

### 2. Backend SEO Override API
**Location:** `/api/v1/get-seo`

**Symptoms:**
- SEO overrides not loading
- Console shows: `403 Forbidden: SEO API access denied`

**Fixes:**
✅ **Check BACKEND_URL** environment variable
✅ **Verify API endpoint exists** and is accessible
✅ **Check authentication tokens** (if required)

---

## How to Fix 403 Errors

### Option 1: Configure Environment Variables

Create/update `.env.local`:

```env
# Public URL (for client-side API calls)
NEXT_PUBLIC_BASE_URL=https://www.avidorganics.net

# Backend URL (for server-side API calls)
BACKEND_URL=https://api.avidorganics.net
```

**Important:**
- `NEXT_PUBLIC_BASE_URL` must be accessible from browser (CORS enabled)
- `BACKEND_URL` is server-side only (can be internal URL)

### Option 2: Fix CORS on Backend

If using Express.js backend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://www.avidorganics.net',
    'http://localhost:3000', // For development
  ],
  credentials: true,
}));
```

If using Next.js API routes, add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ];
}
```

### Option 3: Add Authentication Headers

If API requires authentication:

```typescript
// In lib/seo.ts or API calls
const res = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
    // or
    'X-API-Key': process.env.API_KEY,
  },
});
```

### Option 4: Use API Proxy (Recommended)

If you have `/api/backend/[...path]` proxy route:

**Update fetch calls to use proxy:**

```typescript
// Instead of:
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`);

// Use:
const res = await fetch(`/api/backend/blogs/${slug}`);
```

**Benefits:**
- No CORS issues (same domain)
- Can add authentication on server-side
- Better security (API credentials not exposed)

---

## Error Handling Improvements

### Using safeFetch Utility

Instead of raw `fetch`:

```typescript
import { safeFetchPublic } from '@/lib/safeFetch';

// Old way (throws errors)
const data = await fetch('/api/blogs/slug').then(res => res.json());

// New way (graceful handling)
const { data, error, ok } = await safeFetchPublic('/api/blogs/slug');

if (!ok) {
  console.error('API error:', error?.message);
  // Handle error gracefully
  return null;
}

// Use data safely
console.log(data);
```

**Benefits:**
- Automatic 403 detection and logging
- Graceful error handling
- TypeScript type safety
- Retry logic for transient errors

---

## Current Implementation Status

### ✅ Fixed Files

1. **Blog Pages** (`app/[locale]/(site)/media/blog/[slug]/page.tsx`)
   - Added try-catch wrapper
   - Logs 403 errors with context
   - Graceful fallback to "Not Found"

2. **News Pages** (`app/[locale]/(site)/media/news/[slug]/page.tsx`)
   - Enhanced error handling
   - Specific 403 logging
   - Falls back gracefully

3. **Event Pages** (`app/[locale]/(site)/media/events/[slug]/page.tsx`)
   - Comprehensive error catching
   - Detailed error logs
   - Graceful degradation

4. **SEO Override** (`lib/seo.ts`)
   - Enhanced fetchSeoOverride()
   - 403/404 differentiation
   - Better error messages

5. **Safe Fetch Utility** (`lib/safeFetch.ts`)
   - Reusable fetch wrapper
   - All HTTP error codes handled
   - Retry logic for transient errors

---

## Testing 403 Fixes

### 1. Check Console Logs

Open browser console (F12) and look for:

```
✅ Good: No errors (working)
⚠️ Warning: "No SEO override found" (expected if no override)
❌ Error: "403 Forbidden" (needs fixing)
```

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Navigate to blog/news/event page
3. Check API calls:
   - **200 OK** = Working ✅
   - **403 Forbidden** = Access denied ❌
   - **404 Not Found** = API endpoint missing ⚠️

### 3. Test with cURL

```bash
# Test blog API
curl -i https://www.avidorganics.net/api/blogs/test-slug

# Test backend API
curl -i https://api.avidorganics.net/api/v1/get-seo?path=/&locale=en
```

**Expected:**
- `HTTP/1.1 200 OK` or `HTTP/1.1 404 Not Found` (good)
- `HTTP/1.1 403 Forbidden` (needs fixing)

---

## Quick Fixes Checklist

### For Development

- [ ] Check `.env.local` has `NEXT_PUBLIC_BASE_URL`
- [ ] Verify `BACKEND_URL` is set correctly
- [ ] Restart Next.js dev server after env changes
- [ ] Check backend server is running
- [ ] Verify CORS is enabled on backend

### For Production

- [ ] Set environment variables on hosting platform (Vercel/etc)
- [ ] Verify production API URLs are correct
- [ ] Check firewall rules allow access
- [ ] Verify SSL certificates are valid
- [ ] Test CORS from production domain

### For Backend Team

- [ ] Enable CORS for frontend domain
- [ ] Verify API endpoints return correct status codes
- [ ] Check authentication requirements
- [ ] Add API rate limiting if needed
- [ ] Monitor server logs for access denials

---

## Common Causes & Solutions

### Cause 1: Missing Environment Variables
**Solution:** Add to `.env.local` and restart server

### Cause 2: CORS Not Configured
**Solution:** Enable CORS on backend for your domain

### Cause 3: Authentication Required
**Solution:** Add auth headers or use API proxy

### Cause 4: IP Whitelisting
**Solution:** Add application IP to backend allowlist

### Cause 5: Rate Limiting
**Solution:** Implement caching, reduce request frequency

### Cause 6: SSL Certificate Issues
**Solution:** Verify HTTPS is working correctly

---

## Migration Path

### Phase 1: Immediate Fix (Current)
✅ Enhanced error handling in all API calls  
✅ Graceful fallbacks when API fails  
✅ Detailed logging for debugging  

### Phase 2: Use Proxy Pattern
□ Update all fetch calls to use `/api/backend/[...path]`  
□ Remove direct external API calls  
□ Better security & no CORS issues  

### Phase 3: Implement Caching
□ Cache API responses in Redis/Vercel KV  
□ Reduce API calls  
□ Faster page loads  

---

## Support

If 403 errors persist:

1. **Check server logs** for access denials
2. **Verify environment variables** are set correctly
3. **Test API directly** with cURL/Postman
4. **Contact backend team** if issue is on their side
5. **Review CORS configuration** on both frontend and backend

---

## Summary

✅ **All API calls now have error handling**  
✅ **403 errors logged with context**  
✅ **Graceful fallbacks prevent crashes**  
✅ **safeFetch utility available for future use**  

**The app will continue working even if some APIs return 403** - it just won't show that specific content and will log the error for debugging.
