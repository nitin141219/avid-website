#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Localization Sync Script
 * Automatically synchronizes English content to other languages
 * Usage: node scripts/sync-localization.js
 */

const fs = require('fs');
const path = require('path');

const LOCALIZATION_DIR = path.join(__dirname, '../localization');
const LANGUAGES = ['de', 'es', 'fr'];
const EN_LANG = 'en';

// Keys/values intentionally allowed to remain identical across locales.
const SAME_AS_ENGLISH_VALUE_ALLOWLIST = new Set([
  'kg',
  'Net Zero',
  'MEHQ',
  'Guaiacol',
  'Chlorhexidine',
  'Vanillin',
  'Glycine USP',
  'Taurine',
  'Glycolic Acid',
  'AviGa™ HP70',
  'AviGa™ Bio HP70',
  'AviGa™ T',
  'AviGly™ HP',
  'AviGly™ T',
  'AviTau™',
  'AviVan™',
  'Blog',
  'Downloads',
  'Jobs',
  'Contact',
  'Mission',
  'Vision',
  'Innovation',
  'Certifications',
]);

const SAME_AS_ENGLISH_PATH_ALLOWLIST = [
  /^menu\.(aviga_bio_hp|aviga_hp|aviga_t|avigly_hp|avigly_t|avitau|avivan)$/,
  /^menu\.submenu\.(blogs|downloads|jobs)$/,
  /^menu\.side_popup\.title$/,
  /^product\..+\.supplyChain\.packagingOptions\.\d+\.(unit|texts)$/,
  /^product\..+\.information\.subText$/,
  /^Sustainability\..+\.target\d+\.value$/,
];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTranslatableString(value) {
  return typeof value === 'string' && /[A-Za-z]/.test(value.trim());
}

function shouldAllowSameAsEnglish(keyPath, value) {
  if (SAME_AS_ENGLISH_VALUE_ALLOWLIST.has(String(value).trim())) return true;
  return SAME_AS_ENGLISH_PATH_ALLOWLIST.some((pattern) => pattern.test(keyPath));
}

function getValueType(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Translate English text using a simple mapping strategy
 * For production, this should use a translation API
 */
function getTranslationMap(enContent, language) {
  // This is a placeholder - in production, you'd use Google Translate, DeepL, or similar
  // For now, we'll copy the structure and keep English as fallback
  return enContent;
}

/**
 * Check if JSON files are in sync with English version
 */
function checkFilesInSync(filename) {
  const enPath = path.join(LOCALIZATION_DIR, EN_LANG, filename);
  
  if (!fs.existsSync(enPath)) {
    return { inSync: true, missing: false }; // File doesn't exist in English, skip
  }

  const enContent = fs.readFileSync(enPath, 'utf-8');
  let allInSync = true;
  const results = {};

  LANGUAGES.forEach(lang => {
    const langPath = path.join(LOCALIZATION_DIR, lang, filename);
    
    if (!fs.existsSync(langPath)) {
      allInSync = false;
      results[lang] = { exists: false, inSync: false };
      return;
    }

    const langContent = fs.readFileSync(langPath, 'utf-8');
    
    try {
      const enJson = JSON.parse(enContent);
      const langJson = JSON.parse(langContent);
      
      // Check if structure matches (keys are the same)
      const enKeys = JSON.stringify(Object.keys(enJson).sort());
      const langKeys = JSON.stringify(Object.keys(langJson).sort());
      
      const inSync = enKeys === langKeys;
      results[lang] = { exists: true, inSync };
      
      if (!inSync) {
        allInSync = false;
      }
    } catch (e) {
      results[lang] = { exists: true, inSync: false, error: e.message };
      allInSync = false;
    }
  });

  return { inSync: allInSync, results };
}

/**
 * Check structure of JSON files to ensure all languages match
 */
function validateLocalizationStructure() {
  log('\n📋 Checking localization file structure...', 'blue');
  
  const files = fs.readdirSync(path.join(LOCALIZATION_DIR, EN_LANG))
    .filter(f => f.endsWith('.json'));

  let allFilesInSync = true;
  const errors = [];

  files.forEach(file => {
    const { inSync, results } = checkFilesInSync(file);
    
    if (!inSync) {
      allFilesInSync = false;
      log(`\n⚠️  File: ${file}`, 'yellow');
      
      Object.entries(results).forEach(([lang, result]) => {
        if (!result.inSync) {
          const msg = `   ${lang}: ${result.exists ? 'Structure mismatch' : 'File missing'}`;
          log(msg, 'yellow');
          errors.push({ file, lang, ...result });
        }
      });
    } else {
      log(`✅ ${file}`, 'green');
    }
  });

  return { allInSync: allFilesInSync, errors };
}

/**
 * Compare English file with translated version to identify missing keys
 */
function getMissingKeys(enFile, langFile) {
  try {
    const enJson = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const langJson = JSON.parse(fs.readFileSync(langFile, 'utf-8'));

    function findMissing(enObj, langObj, path = '') {
      const missing = [];
      
      for (const key in enObj) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (!(key in langObj)) {
          missing.push(currentPath);
        } else if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
          missing.push(...findMissing(enObj[key], langObj[key], currentPath));
        }
      }
      
      return missing;
    }

    return findMissing(enJson, langJson);
  } catch (e) {
    return [];
  }
}

/**
 * Compare English vs locale values and detect untranslated same-as-English strings
 */
function getUntranslatedSameAsEnglishKeys(enFile, langFile) {
  try {
    const enJson = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const langJson = JSON.parse(fs.readFileSync(langFile, 'utf-8'));

    function findSameAsEnglish(enObj, langObj, path = '') {
      const same = [];

      for (const key in enObj) {
        const currentPath = path ? `${path}.${key}` : key;
        const enValue = enObj[key];

        if (!(key in langObj)) continue;
        const langValue = langObj[key];

        if (isObject(enValue) && isObject(langValue)) {
          same.push(...findSameAsEnglish(enValue, langValue, currentPath));
          continue;
        }

        if (
          isTranslatableString(enValue) &&
          typeof langValue === 'string' &&
          enValue.trim() === langValue.trim() &&
          !shouldAllowSameAsEnglish(currentPath, enValue)
        ) {
          same.push(currentPath);
        }
      }

      return same;
    }

    return findSameAsEnglish(enJson, langJson);
  } catch (e) {
    return [];
  }
}

/**
 * Detect value-shape drifts that cause visual/content mismatch despite key parity
 */
function getValueDriftIssues(enFile, langFile) {
  try {
    const enJson = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const langJson = JSON.parse(fs.readFileSync(langFile, 'utf-8'));

    function collectDrifts(enValue, langValue, keyPath = '') {
      const issues = [];
      const enType = getValueType(enValue);
      const langType = getValueType(langValue);

      if (enType !== langType) {
        issues.push(`${keyPath || '<root>'}: type mismatch (${enType} vs ${langType})`);
        return issues;
      }

      if (enType === 'array') {
        if (enValue.length !== langValue.length) {
          issues.push(`${keyPath || '<root>'}: array length mismatch (${enValue.length} vs ${langValue.length})`);
        }

        const iterations = Math.min(enValue.length, langValue.length);
        for (let i = 0; i < iterations; i += 1) {
          issues.push(...collectDrifts(enValue[i], langValue[i], `${keyPath}[${i}]`));
        }
        return issues;
      }

      if (enType === 'object') {
        // Missing/extra keys are already reported by structural checks.
        for (const key of Object.keys(enValue)) {
          if (!(key in langValue)) continue;
          const nextPath = keyPath ? `${keyPath}.${key}` : key;
          issues.push(...collectDrifts(enValue[key], langValue[key], nextPath));
        }
        return issues;
      }

      if (enType === 'string') {
        const enTrimmed = enValue.trim();
        const langTrimmed = langValue.trim();

        if (enTrimmed === '' && langTrimmed !== '') {
          issues.push(`${keyPath}: English empty but locale has content`);
        } else if (enTrimmed !== '' && langTrimmed === '') {
          issues.push(`${keyPath}: English has content but locale is empty`);
        }
      }

      return issues;
    }

    return collectDrifts(enJson, langJson);
  } catch (e) {
    return [];
  }
}

/**
 * Auto-fix locale shape/content parity against English to prevent visual drifts.
 * - Keeps translated non-empty strings when compatible.
 * - Forces empty/non-empty parity with English.
 * - Aligns object keys, array lengths, and value types.
 */
function syncValueWithEnglish(enValue, localeValue) {
  const enType = getValueType(enValue);
  const localeType = getValueType(localeValue);

  if (enType !== localeType) {
    return cloneValue(enValue);
  }

  if (enType === 'array') {
    const result = [];
    for (let i = 0; i < enValue.length; i += 1) {
      result.push(syncValueWithEnglish(enValue[i], localeValue[i]));
    }
    return result;
  }

  if (enType === 'object') {
    const result = {};
    for (const key of Object.keys(enValue)) {
      result[key] = syncValueWithEnglish(enValue[key], localeValue[key]);
    }
    return result;
  }

  if (enType === 'string') {
    const enTrimmed = enValue.trim();
    const localeTrimmed = localeValue.trim();

    // English intentionally empty: locale should also be empty for visual parity.
    if (enTrimmed === '') return '';

    // English has content but locale is blank: fallback to English to avoid empty UI.
    if (localeTrimmed === '') return enValue;

    // Keep translated content.
    return localeValue;
  }

  return localeValue;
}

function autoSyncLocalizationFromEnglish() {
  log('\n🛠️  Auto-syncing localization shape from English...', 'blue');
  const files = fs.readdirSync(path.join(LOCALIZATION_DIR, EN_LANG)).filter((f) => f.endsWith('.json'));
  let changedFiles = 0;

  files.forEach((file) => {
    const enPath = path.join(LOCALIZATION_DIR, EN_LANG, file);
    const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

    LANGUAGES.forEach((lang) => {
      const langPath = path.join(LOCALIZATION_DIR, lang, file);
      if (!fs.existsSync(langPath)) {
        fs.writeFileSync(langPath, JSON.stringify(enJson, null, 2) + '\n');
        changedFiles += 1;
        log(`➕ Created missing file from English: ${lang}/${file}`, 'yellow');
        return;
      }

      const langJson = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
      const synced = syncValueWithEnglish(enJson, langJson);
      const before = JSON.stringify(langJson);
      const after = JSON.stringify(synced);

      if (before !== after) {
        fs.writeFileSync(langPath, JSON.stringify(synced, null, 2) + '\n');
        changedFiles += 1;
        log(`♻️  Synced: ${lang}/${file}`, 'yellow');
      }
    });
  });

  if (changedFiles === 0) {
    log('✅ No locale files needed sync changes.', 'green');
  } else {
    log(`✅ Auto-sync updated ${changedFiles} locale file(s).`, 'green');
  }
}

/**
 * Generate a detailed sync report
 */
function generateSyncReport() {
  log('\n📊 Generating detailed localization sync report...', 'blue');
  
  const files = fs.readdirSync(path.join(LOCALIZATION_DIR, EN_LANG))
    .filter(f => f.endsWith('.json'));

  const report = {
    timestamp: new Date().toISOString(),
    files: {},
    summary: {
      totalIssues: 0,
      byLanguage: {},
      untranslatedSameAsEnglish: 0,
      untranslatedByLanguage: {},
      valueDriftIssues: 0,
      valueDriftByLanguage: {}
    }
  };

  files.forEach(file => {
    const enPath = path.join(LOCALIZATION_DIR, EN_LANG, file);
    report.files[file] = {};

    LANGUAGES.forEach(lang => {
      const langPath = path.join(LOCALIZATION_DIR, lang, file);
      const missing = getMissingKeys(enPath, langPath);
      const untranslated = getUntranslatedSameAsEnglishKeys(enPath, langPath);
      const valueDrifts = getValueDriftIssues(enPath, langPath);
      const issueCount = missing.length;
      const untranslatedCount = untranslated.length;
      const valueDriftCount = valueDrifts.length;

      report.summary.totalIssues += issueCount;
      report.summary.byLanguage[lang] = (report.summary.byLanguage[lang] || 0) + issueCount;
      report.summary.untranslatedSameAsEnglish += untranslatedCount;
      report.summary.untranslatedByLanguage[lang] =
        (report.summary.untranslatedByLanguage[lang] || 0) + untranslatedCount;
      report.summary.valueDriftIssues += valueDriftCount;
      report.summary.valueDriftByLanguage[lang] =
        (report.summary.valueDriftByLanguage[lang] || 0) + valueDriftCount;
      
      report.files[file][lang] = {
        exists: fs.existsSync(langPath),
        missingKeys: issueCount > 0 ? missing : 'None',
        issueCount,
        untranslatedSameAsEnglish: untranslatedCount > 0 ? untranslated : 'None',
        untranslatedIssueCount: untranslatedCount,
        valueDrifts: valueDriftCount > 0 ? valueDrifts : 'None',
        valueDriftIssueCount: valueDriftCount
      };
    });
  });

  // Save report to file
  const reportPath = path.join(__dirname, '../localization-sync-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`✅ Report saved to: ${reportPath}`, 'green');
  return report;
}

/**
 * Main function
 */
function main() {
  log('\n🔄 Starting Localization Sync Check...', 'blue');
  log(`📁 Localization directory: ${LOCALIZATION_DIR}`, 'blue');

  if (process.argv.includes('--fix')) {
    autoSyncLocalizationFromEnglish();
  }
  
  const { allInSync, errors } = validateLocalizationStructure();
  
  const report = generateSyncReport();
  const hasNestedMissingKeys = (report.summary?.totalIssues || 0) > 0;
  const hasUntranslatedValues = (report.summary?.untranslatedSameAsEnglish || 0) > 0;
  const hasValueDrift = (report.summary?.valueDriftIssues || 0) > 0;

  if (allInSync && !hasNestedMissingKeys && !hasUntranslatedValues && !hasValueDrift) {
    log('\n✅ All localization files are properly synced!', 'green');
    process.exit(0);
  } else {
    const structureIssues = errors.length;
    const nestedIssues = report.summary?.totalIssues || 0;
    const untranslatedIssues = report.summary?.untranslatedSameAsEnglish || 0;
    const valueDriftIssues = report.summary?.valueDriftIssues || 0;
    log(
      `\n❌ Found ${structureIssues + nestedIssues + untranslatedIssues + valueDriftIssues} sync issues (structure: ${structureIssues}, missing nested keys: ${nestedIssues}, untranslated values: ${untranslatedIssues}, value drift: ${valueDriftIssues})`,
      'red'
    );
    log('\n⚠️  Action required:', 'yellow');
    log('1. Review the differences above', 'yellow');
    log('2. Update missing/untranslated/drifted translations in other languages', 'yellow');
    log('3. Run this script again to verify', 'yellow');
    log('\n📄 Detailed report saved to: localization-sync-report.json\n', 'yellow');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateLocalizationStructure,
  getMissingKeys,
  getUntranslatedSameAsEnglishKeys,
  getValueDriftIssues,
  autoSyncLocalizationFromEnglish,
};
