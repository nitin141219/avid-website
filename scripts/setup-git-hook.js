#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Git Pre-Commit Hook Setup
 * This script sets up automatic localization sync checks before commits
 * Run: node scripts/setup-git-hook.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOOKS_DIR = path.join(__dirname, '../.git/hooks');
const PRE_COMMIT_HOOK = path.join(HOOKS_DIR, 'pre-commit');

const preCommitContent = `#!/bin/bash

# Pre-commit hook: Check localization synchronization
# This script ensures all language files are in sync before committing

echo "🔍 Checking localization sync before commit..."

# Auto-sync locale shape with English source of truth
node scripts/sync-localization.js --fix

# Run the sync validation script
node scripts/sync-localization.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Localization files are out of sync!"
  echo "❌ Please fix the sync issues before committing."
  echo ""
  echo "To check the sync status, run:"
  echo "  npm run check-translations"
  echo ""
  exit 1
fi

# Stage any auto-sync changes in localization files
git add localization/*.json localization/*/*.json 2>/dev/null || true

echo "✅ Localization files are in sync!"
exit 0
`;

function setupGitHook() {
  try {
    // Check if .git directory exists
    if (!fs.existsSync(path.join(__dirname, '../.git'))) {
      console.log('❌ Not a git repository. Please run this from the project root after initializing git.');
      process.exit(1);
    }

    // Create hooks directory if it doesn't exist
    if (!fs.existsSync(HOOKS_DIR)) {
      fs.mkdirSync(HOOKS_DIR, { recursive: true });
      console.log('✅ Created .git/hooks directory');
    }

    // Write the pre-commit hook
    fs.writeFileSync(PRE_COMMIT_HOOK, preCommitContent);
    
    // Make it executable (Unix-like systems)
    if (process.platform !== 'win32') {
      fs.chmodSync(PRE_COMMIT_HOOK, '755');
    }

    console.log('✅ Git pre-commit hook installed successfully!');
    console.log(`   Location: ${PRE_COMMIT_HOOK}`);
    console.log('');
    console.log('The hook will now run automatically before each commit to check');
    console.log('if all localization files are in sync.');
    
  } catch (error) {
    console.error('❌ Error setting up git hook:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupGitHook();
}
