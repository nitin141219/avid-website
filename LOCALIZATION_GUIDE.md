# 🌍 Localization Synchronization Guide

This document explains how to maintain synchronized translations across all language versions of the website.

## Overview

Your website supports **English (main)**, **German**, **Spanish**, and **French**. To prevent content mismatches, we've implemented an automatic synchronization system that:

- ✅ Validates translation file structures
- ✅ Detects missing translations
- ✅ Prevents commits with out-of-sync files
- ✅ Generates sync reports

## Quick Setup

### 1. **Initial Installation** (One-time)

```bash
# Install dependencies (this runs the git hook setup automatically)
npm install

# Or manually setup the git hook
npm run setup-git-hook
```

### 2. **Verify Synchronization**

Check if all language files are in sync:

```bash
npm run check-translations
```

Expected output if everything is synced:
```
✅ All localization files are properly synced!
```

## Daily Workflow

### When You Edit English Content

1. **Edit English files** in `localization/en/`:
   ```
   localization/en/home.json
   localization/en/about.json
   localization/en/sustainability.json
   etc.
   ```

2. **Before committing**, the git hook will automatically:
   - Check if German, Spanish, and French files have matching structure
   - Alert you if translations are missing or out of sync

3. **If sync issues are detected**:
   ```
   ❌ Localization files are out of sync!
   ❌ Please fix the sync issues before committing.
   
   To check the sync status, run:
     npm run check-translations
   ```

4. **Update missing translations** or **restore sync**:
   - Manual: Edit the language files to match the English structure
   - Or use a translation service (see below)

5. **Commit your changes** once sync is verified

## Translation Workflow

### Option A: Manual Translation (Current Method)

When you update English files:

1. Note the changes you made
2. Update the same keys in German (`localization/de/`)
3. Translate the content into each language
4. Run `npm run check-translations` to verify sync
5. Commit when sync is confirmed

### Option B: Automated Translation (Future)

To enable automatic translation via Google Translate or DeepL:

1. Edit `localization.config.json`:
   ```json
   "translationApis": {
     "enabled": true,
     "provider": "google-translate",
     "apiKey": "YOUR_API_KEY"
   }
   ```

2. The system will automatically sync translations on build

## File Structure

```
localization/
├── en/                 # English (source language)
│   ├── home.json
│   ├── about.json
│   ├── sustainability.json
│   ├── product.json
│   ├── market.json
│   ├── careers.json
│   ├── contact.json
│   ├── header.json
│   ├── common.json
│   ├── login.json
│   ├── sign-up.json
│   ├── media.json
│   ├── privacy.mdx
│   └── terms.mdx
├── de/                 # German
├── es/                 # Spanish
└── fr/                 # French
```

All three language directories must mirror the English structure exactly.

## NPM Commands

```bash
# Check if translations are in sync
npm run check-translations

# Setup or verify git hooks
npm run setup-git-hook

# Build project (automatically checks translations first)
npm run build

# Development server
npm run dev

# Start production server
npm run start
```

## Common Issues & Solutions

### Issue: "Localization files are out of sync!"

**Solution:**
```bash
# 1. Check which files are out of sync
npm run check-translations

# 2. This will generate a detailed report at:
#    localization-sync-report.json

# 3. Update the missing translations in the language files

# 4. Re-run to confirm sync
npm run check-translations

# 5. Commit your changes
git add localization/
git commit -m "Update translations for [feature]"
```

### Issue: "Git hook not running"

**Solution:**
```bash
# Re-setup the git hook
npm run setup-git-hook

# Verify it's installed
ls -la .git/hooks/pre-commit
```

### Issue: ".git/hooks/pre-commit: Permission denied"

**Solution (macOS/Linux):**
```bash
chmod +x .git/hooks/pre-commit
npm run setup-git-hook
```

## Translation Guidelines

### When Updating English Files

Remember to maintain these patterns across all languages:

1. **Keep structure identical** - Don't reorder keys or sections
2. **Translate content only** - Don't change JSON structure
3. **Preserve special characters** - Newlines (`\n`), quotes, etc.
4. **Use professional translations** - Quality matters for your brand

### Example: Adding New Content

**English (`en/home.json`):**
```json
{
  "new_section": {
    "title": "Building Tomorrow",
    "description": "Innovation drives our future"
  }
}
```

**German (`de/home.json`):**
```json
{
  "new_section": {
    "title": "Morgen aufbauen",
    "description": "Innovation treibt unsere Zukunft an"
  }
}
```

**Spanish (`es/home.json`):**
```json
{
  "new_section": {
    "title": "Construyendo el Mañana",
    "description": "La innovación impulsa nuestro futuro"
  }
}
```

**French (`fr/home.json`):**
```json
{
  "new_section": {
    "title": "Construire Demain",
    "description": "L'innovation stimule notre avenir"
  }
}
```

## Monitoring & Reports

### Sync Report Generation

Every time you run `npm run check-translations`, a detailed report is generated:

```bash
localization-sync-report.json
```

This report shows:
- Timestamp of the check
- Status of each language file
- Missing keys per language
- Sync percentage for each file

### Continuous Integration

The build process now includes translation validation:

```bash
npm run build
```

This will:
1. Check translations are in sync
2. Generate a sync report
3. Build the Next.js application
4. Fail the build if sync issues are found

## Best Practices

### ✅ DO:
- Run `npm run check-translations` before starting work
- Keep English files updated first
- Translate all changes to other languages promptly
- Use professional translation services for quality
- Review translations before commits

### ❌ DON'T:
- Change JSON structure in translation files
- Mix English content in translation files
- Commit without fixing sync warnings
- Delete keys from language files
- Manually write translations if you don't know the language

## Translating with Professional Services

### Google Cloud Translation API

1. Get API credentials from Google Cloud Console
2. Set environment variable:
   ```bash
   export GOOGLE_TRANSLATE_API_KEY="your-key"
   ```
3. Update `localization.config.json`
4. Run build - translations auto-sync

### DeepL API

1. Sign up at https://www.deepl.com/pro
2. Get API key
3. Configure in `localization.config.json`:
   ```json
   "provider": "deepl",
   "apiKey": "your-key"
   ```

## Support

For issues or questions:

1. Check `localization-sync-report.json` for details
2. Review git hooks: `cat .git/hooks/pre-commit`
3. Verify file structure matches between languages
4. Run: `npm run check-translations -- --verbose`

## References

- **Localization Config**: `localization.config.json`
- **Sync Script**: `scripts/sync-localization.js`
- **Git Hook Setup**: `scripts/setup-git-hook.js`
- **Report Output**: `localization-sync-report.json`

---

**Last Updated:** February 19, 2026
**Maintained by:** Development Team
