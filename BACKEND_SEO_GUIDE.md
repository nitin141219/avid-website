# Admin Panel SEO Integration Guide

## For Backend Team

### Current State
The frontend is **fully ready** to consume SEO overrides from your backend. All pages will work with default SEO until you implement the API below.

---

## API Endpoint to Implement

### **GET /api/v1/get-seo**

**Purpose**: Fetch custom SEO metadata for a specific page/locale

**Query Parameters:**
- `path` (string, required) - URL path without locale, e.g., `/product/amino-acids/avitau`
- `locale` (string, required) - Language code, e.g., `en`

**Example Request:**
```
GET /api/v1/get-seo?path=/market/pharmaceuticals&locale=en
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "title": "Pharmaceuticals | Bulk Chemical Supplier",
    "description": "High-quality pharmaceutical chemicals from Avid Organics",
    "keywords": ["pharmaceutical chemicals", "bulk supplier", "india"],
    "author": "Avid Organics Pvt. Ltd.",
    "canonical": "https://www.avidorganics.net/en/market/pharmaceuticals",
    "og_title": "Pharmaceutical Solutions | Avid Organics",
    "og_description": "Trusted manufacturer for pharma-grade chemicals",
    "og_image": "https://www.avidorganics.net/images/pharma-og.jpg",
    "twitter_title": "Pharmaceutical Chemicals",
    "twitter_description": "...",
    "twitter_image": "https://www.avidorganics.net/images/pharma-twitter.jpg",
    "faqs": [
      {
        "question": "Do you supply GMP-certified chemicals?",
        "answer": "Yes, we provide documentation and certifications as needed."
      }
    ]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "SEO override not found for this path/locale"
}
```

> **Note**: If no override exists, frontend uses **default SEO** (already implemented). This is graceful degradation.

---

## Database Schema Recommendation

```sql
CREATE TABLE seo_overrides (
  id SERIAL PRIMARY KEY,
  path VARCHAR(255) NOT NULL,        -- e.g., "/", "/product/amino-acids/avitau"
  locale VARCHAR(10) NOT NULL,       -- e.g., "en", "de", "fr", "es"
  title TEXT,
  description TEXT,
  keywords JSON,                     -- Array of strings
  author TEXT,
  canonical TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  faqs JSON,                         -- Array of { question, answer }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_path_locale UNIQUE(path, locale)
);
```

---

## Admin UI Fields to Add

### For **Blogs**, **News**, **Events** (Existing Forms)
Add optional SEO section:
- Meta Title
- Meta Description
- Keywords (comma-separated or multi-select)
- Open Graph Image URL (optional, uses main image if blank)
- FAQs (repeatable fields: question + answer)

### For **Static Pages** (New CRUD Module)
Create "SEO Settings" page in admin that allows editing SEO for any path:
- Path input (e.g., `/`, `/contact-us`, `/market/pharmaceuticals`)
- All fields above

---

## Testing

1. Create a test SEO override in your database:
```sql
INSERT INTO seo_overrides (path, locale, title, description, keywords, faqs)
VALUES (
  '/market/pharmaceuticals',
  'en',
  'Custom Pharma Title',
  'Custom description for pharma page',
  '["pharma", "custom keywords"]',
  '[{"question": "Test Q?", "answer": "Test A"}]'
);
```

2. Restart frontend dev server
3. Visit http://localhost:3000/en/market/pharmaceuticals
4. View page source → should see custom title, description, FAQ schema

---

## Deployment Priority

**Phase 1** (MVP):
- Implement `GET /api/v1/get-seo` endpoint
- Create database table
- Test with manual DB inserts

**Phase 2**:
- Add SEO fields to blog/news/event forms
- Admin UI for static page SEO management

**Phase 3**:
- Bulk SEO generator (auto-populate defaults for all products/markets)
- Analytics integration (track which custom SEO performs best)

---

## Questions?

Frontend integration is complete. Reach out if you need TypeScript types or clarification on expected data shapes.

**Frontend Engineer**: ✅ Ready  
**Backend Engineer**: ⏳ Pending API implementation
