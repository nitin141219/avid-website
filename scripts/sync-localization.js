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
      untranslatedByLanguage: {}
    }
  };

  files.forEach(file => {
    const enPath = path.join(LOCALIZATION_DIR, EN_LANG, file);
    report.files[file] = {};

    LANGUAGES.forEach(lang => {
      const langPath = path.join(LOCALIZATION_DIR, lang, file);
      const missing = getMissingKeys(enPath, langPath);
      const untranslated = getUntranslatedSameAsEnglishKeys(enPath, langPath);
      const issueCount = missing.length;
      const untranslatedCount = untranslated.length;

      report.summary.totalIssues += issueCount;
      report.summary.byLanguage[lang] = (report.summary.byLanguage[lang] || 0) + issueCount;
      report.summary.untranslatedSameAsEnglish += untranslatedCount;
      report.summary.untranslatedByLanguage[lang] =
        (report.summary.untranslatedByLanguage[lang] || 0) + untranslatedCount;
      
      report.files[file][lang] = {
        exists: fs.existsSync(langPath),
        missingKeys: issueCount > 0 ? missing : 'None',
        issueCount,
        untranslatedSameAsEnglish: untranslatedCount > 0 ? untranslated : 'None',
        untranslatedIssueCount: untranslatedCount
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
  
  const { allInSync, errors } = validateLocalizationStructure();
  
  const report = generateSyncReport();
  const hasNestedMissingKeys = (report.summary?.totalIssues || 0) > 0;
  const hasUntranslatedValues = (report.summary?.untranslatedSameAsEnglish || 0) > 0;

  if (allInSync && !hasNestedMissingKeys && !hasUntranslatedValues) {
    log('\n✅ All localization files are properly synced!', 'green');
    process.exit(0);
  } else {
    const structureIssues = errors.length;
    const nestedIssues = report.summary?.totalIssues || 0;
    const untranslatedIssues = report.summary?.untranslatedSameAsEnglish || 0;
    log(
      `\n❌ Found ${structureIssues + nestedIssues + untranslatedIssues} sync issues (structure: ${structureIssues}, missing nested keys: ${nestedIssues}, untranslated values: ${untranslatedIssues})`,
      'red'
    );
    log('\n⚠️  Action required:', 'yellow');
    log('1. Review the differences above', 'yellow');
    log('2. Update missing/untranslated translations in other languages', 'yellow');
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
};
