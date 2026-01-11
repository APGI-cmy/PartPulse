#!/usr/bin/env node

/**
 * Deprecation Detection Pre-commit Check
 * 
 * This script checks TypeScript/TSX files for deprecated API usage.
 * It only checks staged files to be efficient.
 * 
 * Policy: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md
 * Learning: BL-026 (Automated Deprecation Detection)
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');

try {
  // Get list of staged TypeScript files
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
    .split('\n')
    .filter(file => file.match(/\.(ts|tsx)$/) && existsSync(file))
    .join(' ');

  if (!stagedFiles) {
    console.log('✅ No TypeScript files to check for deprecations');
    process.exit(0);
  }

  console.log('🔍 Checking staged TypeScript files for deprecated API usage...');
  
  // Run ESLint with deprecation-only config on staged files
  // --no-inline-config ignores eslint-disable comments for other rules
  execSync(`npx eslint --config eslint.config.deprecation.mjs --no-inline-config ${stagedFiles} --no-error-on-unmatched-pattern`, {
    stdio: 'inherit',
    encoding: 'utf-8'
  });

  console.log('✅ No deprecated APIs detected in staged files');
  process.exit(0);

} catch (error) {
  console.error('');
  console.error('❌ COMMIT BLOCKED: Deprecated API usage detected');
  console.error('');
  console.error('Fix all deprecation errors before committing.');
  console.error('See: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md');
  console.error('');
  console.error('To check deprecations: npm run lint:deprecation');
  console.error('To request an exception: Submit to FM with justification');
  console.error('');
  process.exit(1);
}
