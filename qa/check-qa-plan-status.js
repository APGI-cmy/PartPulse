#!/usr/bin/env node
/**
 * QA Plan Status Checker
 * 
 * Validates current implementation against QA_PLAN.md requirements.
 * Expected to be RED on first run (gap analysis approach).
 * 
 * This script checks for the existence of test files required by QA_PLAN.md.
 * 
 * Exit codes:
 *   0 - All test files exist (GREEN)
 *   1 - Test files missing (expected RED for gap analysis)
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Constants for consistent display symbols and formatting
const SYMBOLS = {
  GREEN: '✅',
  RED: '🔴',
  SEPARATOR: '='.repeat(70)
};

const FORMATTING = {
  CATEGORY_PRECISION: 1,  // Decimal places for category percentages
  OVERALL_PRECISION: 1    // Decimal places for overall percentage
};

// Define required test files per QA_PLAN.md
const REQUIRED_TEST_FILES = {
  'Category 1: Database Schema': [
    '__tests__/database/schema-compliance.test.ts',
    '__tests__/database/migrations.test.ts',
    '__tests__/database/data-integrity.test.ts'
  ],
  'Category 2: API Contracts': [
    '__tests__/api/endpoint-existence.test.ts',
    '__tests__/api/contract-compliance.test.ts',
    '__tests__/api/validation.test.ts',
    '__tests__/api/error-handling.test.ts'
  ],
  'Category 3: Authentication & Authorization': [
    '__tests__/auth/authentication.test.ts',
    '__tests__/auth/authorization.test.ts',
    '__tests__/auth/session-management.test.ts'
  ],
  'Category 4: Security Controls': [
    '__tests__/security/trust-boundaries.test.ts',
    '__tests__/security/input-security.test.ts',
    '__tests__/security/data-protection.test.ts',
    '__tests__/security/vulnerability-scan.test.ts'
  ],
  'Category 5: Audit Logging': [
    '__tests__/audit/audit-model.test.ts',
    '__tests__/audit/audit-coverage.test.ts',
    '__tests__/audit/audit-integrity.test.ts'
  ],
  'Category 6: Data Flows': [
    '__tests__/workflows/internal-transfer.test.ts',
    '__tests__/workflows/warranty-claim.test.ts',
    '__tests__/workflows/user-invitation.test.ts'
  ],
  'Category 7: Frontend Components': [
    '__tests__/components/component-existence.test.ts',
    '__tests__/components/component-rendering.test.ts',
    '__tests__/components/accessibility.test.ts'
  ],
  'Category 8: Component Boundaries': [
    '__tests__/architecture/layer-separation.test.ts',
    '__tests__/architecture/dependency-direction.test.ts'
  ],
  'Category 9: External Dependencies': [
    '__tests__/external/email-service.test.ts',
    '__tests__/external/storage-service.test.ts',
    '__tests__/external/pdf-generation.test.ts'
  ],
  'Category 10: Deployment': [
    '__tests__/deployment/build.test.ts',
    '__tests__/deployment/environment.test.ts',
    '__tests__/deployment/production-readiness.test.ts'
  ],
  'Category 11: Documentation': [
    '__tests__/documentation/code-documentation.test.ts'
  ],
  'Category 12: Performance': [
    '__tests__/performance/page-load.test.ts',
    '__tests__/performance/api-response.test.ts'
  ],
  'Category 13: Governance': [
    '__tests__/governance/test-dodging.test.ts',
    '__tests__/governance/qa-parking.test.ts',
    '__tests__/governance/catastrophic-failure.test.ts'
  ]
};

function checkFileExists(filePath) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  return fs.existsSync(fullPath);
}

function checkQAPlanCompliance() {
  console.log('\n' + SYMBOLS.SEPARATOR);
  console.log('QA Plan Compliance Check - Gap Analysis');
  console.log(SYMBOLS.SEPARATOR);
  console.log('\nChecking test file requirements from QA_PLAN.md...\n');

  let totalFiles = 0;
  let existingFiles = 0;
  let missingFiles = 0;

  const results = {};

  for (const [category, files] of Object.entries(REQUIRED_TEST_FILES)) {
    const categoryResults = {
      total: files.length,
      existing: 0,
      missing: 0,
      missingFiles: []
    };

    for (const file of files) {
      totalFiles++;
      if (checkFileExists(file)) {
        existingFiles++;
        categoryResults.existing++;
      } else {
        missingFiles++;
        categoryResults.missing++;
        categoryResults.missingFiles.push(file);
      }
    }

    results[category] = categoryResults;
  }

  // Print results by category
  for (const [category, result] of Object.entries(results)) {
    const status = result.missing === 0 ? `${SYMBOLS.GREEN} GREEN` : `${SYMBOLS.RED} RED`;
    const percentage = ((result.existing / result.total) * 100).toFixed(FORMATTING.CATEGORY_PRECISION);
    
    console.log(`${status} ${category}`);
    console.log(`   ${result.existing}/${result.total} files exist (${percentage}%)`);
    
    if (result.missing > 0) {
      console.log('   Missing:');
      for (const file of result.missingFiles) {
        console.log(`     - ${file}`);
      }
    }
    console.log();
  }

  // Print summary
  console.log(SYMBOLS.SEPARATOR);
  console.log('Summary');
  console.log(SYMBOLS.SEPARATOR);
  console.log(`Total Test Files Required: ${totalFiles}`);
  console.log(`Existing: ${existingFiles} ${SYMBOLS.GREEN}`);
  console.log(`Missing: ${missingFiles} ${SYMBOLS.RED}`);
  
  const overallPercentage = ((existingFiles / totalFiles) * 100).toFixed(FORMATTING.OVERALL_PRECISION);
  console.log(`Completion: ${overallPercentage}%`);
  console.log(SYMBOLS.SEPARATOR);

  if (missingFiles > 0) {
    console.log(`\n${SYMBOLS.RED} STATUS: RED`);
    console.log('\nThis is expected behavior for gap analysis approach.');
    console.log('The QA Plan reveals gaps between architecture and implementation.');
    console.log('Next step: Build-to-GREEN by systematically implementing missing tests.\n');
    return 1; // Exit code 1 indicates expected RED (gap analysis result)
  } else {
    console.log(`\n${SYMBOLS.GREEN} STATUS: GREEN`);
    console.log('\nAll required test files exist per QA_PLAN.md.\n');
    return 0; // Exit code 0 indicates success
  }
}

// Run the check
const exitCode = checkQAPlanCompliance();
process.exit(exitCode);
