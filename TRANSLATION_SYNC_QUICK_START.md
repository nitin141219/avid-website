# 🔄 Automatic Translation Sync - Quick Start

## ✅ What's Been Set Up

Your project now has **automatic synchronization** for all language translations. Here's what's been configured:

### 1. **Sync Validation Script**
- **File**: `scripts/sync-localization.js`
- **Checks**: All translation files match English structure
- **Generates**: Detailed sync report
- **Run**: `npm run check-translations`

### 2. **Git Pre-Commit Hook**
- **File**: `scripts/setup-git-hook.js`
- **Purpose**: Prevents commits with out-of-sync translations
- **Setup**: Runs automatically on `npm install`
- **Manual setup**: `npm run setup-git-hook`

### 3. **Build Integration**
- **Integration**: Build process now checks translations first
- **Command**: `npm run build` (auto-checks before building)
- **Benefit**: Catches sync issues early

### 4. **Configuration File**
- **File**: `localization.config.json`
- **Purpose**: Centralized settings for the sync system
- **Can enable**: Automatic translation via API (Google Translate, DeepL)

### 5. **Documentation**
- **Guide**: `LOCALIZATION_GUIDE.md` (comprehensive guide)
- **Report**: `localization-sync-report.json` (after each check)

---

## 🚀 How It Works Now

### When You Update English Content:

```
You edit English file → Git Hook checks → 
  ✅ In sync? → Commit succeeds
  ❌ Out of sync? → Commit blocked → Update translations → Try again
```

### Example Workflow:

```bash
# 1. You update localization/en/home.json
# 2. Try to commit:
git commit -m "Update hero section"

# 3. Git hook automatically runs:
# ✅ All localization files are properly synced!

# 4. Commit succeeds ✅

# OR if out of sync:
# ❌ Localization files are out of sync!
# Fix translations first by updating:
#   - localization/de/home.json
#   - localization/es/home.json  
#   - localization/fr/home.json

# 5. Check status:
npm run check-translations

# 6. Commit after updating
git commit -m "Update hero section with translations"
```

---

## 📋 Common Commands

```bash
# Check if all languages are in sync
npm run check-translations

# Setup/verify git hook
npm run setup-git-hook

# Build (auto-checks translations)
npm run build

# Development server
npm run dev

# View sync report (generated automatically)
cat localization-sync-report.json
```

---

## 📁 File Organization

All language directories must have identical structure:

```
localization/
├── en/        ← English (source - update this first)
│   ├── home.json
│   ├── about.json
│   ├── Product.json
│   └── ... (14 files)
│
├── de/        ← German (keep in sync with en/)
├── es/        ← Spanish (keep in sync with en/)
└── fr/        ← French (keep in sync with en/)
```

---

## ⚙️ Supported Languages

| Language | Code | Folder |
|----------|------|--------|
| English | en | `localization/en/` |
| German | de | `localization/de/` |
| Spanish | es | `localization/es/` |
| French | fr | `localization/fr/` |

---

## 🎯 Best Practice Workflow

### For Every Change to English:

1. **Update English file first**
   ```bash
   # Edit localization/en/home.json
   ```

2. **Check if sync needed**
   ```bash
   npm run check-translations
   ```

3. **Update other languages**
   - Copy new keys to German, Spanish, French files
   - Translate the content to each language
   - Keep the JSON structure identical

4. **Verify sync**
   ```bash
   npm run check-translations
   # Expected: ✅ All localization files are properly synced!
   ```

5. **Commit your changes**
   ```bash
   git add localization/
   git commit -m "Update [section] with [change]"
   # Git hook automatically validates before committing
   ```

---

## 🔍 What the Sync Check Does

When you run `npm run check-translations`, it:

✅ Validates all JSON files are valid  
✅ Checks German has all English keys  
✅ Checks Spanish has all English keys  
✅ Checks French has all English keys  
✅ Generates a detailed report  
✅ Shows which files/languages are out of sync  

---

## ⚠️ If Sync Fails

**Problem**: "Localization files are out of sync!"

**Solution**:
1. Run: `npm run check-translations`
2. Review: `localization-sync-report.json`
3. Find missing keys for each language
4. Add the missing translations
5. Run: `npm run check-translations` again
6. Commit when sync passes ✅

---

## 📚 Full Documentation

For detailed information, see: **`LOCALIZATION_GUIDE.md`**

Topics covered:
- Setting up automatic translation APIs
- Translation best practices
- Troubleshooting common issues
- Monitoring sync reports
- Continuous integration setup

---

## ✨ Key Benefits

✅ **No More Out-of-Sync Translations** - Git hook prevents bad commits  
✅ **Early Detection** - Catch issues during development, not production  
✅ **Automated Validation** - Build process checks automatically  
✅ **Clear Reports** - Know exactly what's missing and where  
✅ **Easy Setup** - Works automatically after `npm install`  
✅ **Scalable** - Ready for automatic translation APIs (Google, DeepL)  

---

## 🚨 Important Reminders

### DO:
- ✅ Update English files first
- ✅ Translate all changes to German, Spanish, French
- ✅ Keep JSON structure identical across all languages
- ✅ Use professional translations
- ✅ Run `npm run check-translations` before committing

### DON'T:
- ❌ Change JSON structure in translation files
- ❌ Use English text in translation files
- ❌ Commit with sync warnings
- ❌ Delete keys from translation files
- ❌ Mix multiple languages in one file

---

## 📞 Need Help?

1. **Check sync status**: `npm run check-translations`
2. **Review guide**: `LOCALIZATION_GUIDE.md`  
3. **Check report**: `localization-sync-report.json`
4. **Re-setup hook**: `npm run setup-git-hook`

---

**Status**: ✅ All systems operational  
**Last Updated**: February 19, 2026  
**Translation Files**: 14 files × 4 languages = 56 total files, all in sync
