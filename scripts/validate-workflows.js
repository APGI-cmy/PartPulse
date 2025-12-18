#!/usr/bin/env node

/**
 * Workflow Governance Validator
 * 
 * Validates all GitHub Actions workflow files against governance policy.
 * Prevents post-merge failures by enforcing workflow rules.
 * 
 * Usage: node scripts/validate-workflows.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WORKFLOWS_DIR = path.join(__dirname, '../.github/workflows');
const REQUIRED_WORKFLOWS = [
  'minimum-build-to-red.yml',
  'qa-enforcement.yml',
  'model-scaling-check.yml'
];

// Note: qa-enforcement-v2.yml was removed as it violated naming conventions
// (forbidden version suffix pattern)

let exitCode = 0;
const errors = [];
const warnings = [];

console.log('🔍 Validating GitHub Actions workflows...\n');

// Get all workflow files
const workflowFiles = fs.readdirSync(WORKFLOWS_DIR)
  .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
  .filter(file => !file.endsWith('.experimental.yml'));

console.log(`Found ${workflowFiles.length} workflow files to validate\n`);

// Check each workflow file
for (const file of workflowFiles) {
  const filePath = path.join(WORKFLOWS_DIR, file);
  
  // Skip README and documentation files
  if (file === 'README.md' || file.endsWith('.md')) {
    continue;
  }
  
  console.log(`Validating: ${file}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const workflow = yaml.load(content);
    
    // Rule 1: Must have 'on' trigger
    if (!workflow.on) {
      errors.push(`❌ ${file}: Missing 'on:' trigger block`);
      exitCode = 1;
      continue;
    }
    
    // Rule 2: If has push trigger, must also have pull_request trigger
    const triggers = workflow.on;
    
    // Handle different trigger formats
    let hasPush = false;
    let hasPullRequest = false;
    
    if (typeof triggers === 'string') {
      // Simple string format: on: push
      hasPush = triggers === 'push';
      hasPullRequest = triggers === 'pull_request';
    } else if (Array.isArray(triggers)) {
      // Array format: on: [push, pull_request]
      hasPush = triggers.includes('push');
      hasPullRequest = triggers.includes('pull_request');
    } else if (typeof triggers === 'object') {
      // Object format: on: { push: {...}, pull_request: {...} }
      hasPush = 'push' in triggers;
      hasPullRequest = 'pull_request' in triggers;
    }
    
    if (hasPush && !hasPullRequest) {
      errors.push(`❌ ${file}: Has 'push' trigger but missing 'pull_request' trigger (violates PR Check Parity)`);
      exitCode = 1;
    }
    
    // Rule 3: Check for forbidden naming patterns
    const forbiddenPatterns = [
      { pattern: /-v\d+\.yml$/, desc: 'version suffix (e.g., -v1.yml, -v2.yml)' },
      { pattern: /-frozen\.yml$/, desc: 'frozen backup suffix' },
      { pattern: /-backup\.yml$/, desc: 'backup suffix' },
      { pattern: /-old\.yml$/, desc: 'old version suffix' },
      { pattern: /-new\.yml$/, desc: 'new version suffix' },
      { pattern: /-temp\.yml$/, desc: 'temporary suffix' },
      { pattern: /-test\.yml$/, desc: 'test suffix' },
    ];
    
    for (const {pattern, desc} of forbiddenPatterns) {
      if (pattern.test(file)) {
        errors.push(`❌ ${file}: Uses forbidden naming pattern: ${desc}`);
        exitCode = 1;
      }
    }
    
    // Rule 4: Check for duplicate job definitions (basic check)
    if (workflow.jobs) {
      const jobNames = Object.keys(workflow.jobs);
      // This is a simple check - a full duplicate detection would compare job content
      if (jobNames.length === 0) {
        warnings.push(`⚠️  ${file}: Workflow has no jobs defined`);
      }
    } else {
      warnings.push(`⚠️  ${file}: Workflow has no jobs section`);
    }
    
    console.log(`  ✅ ${file} passed validation\n`);
    
  } catch (error) {
    errors.push(`❌ ${file}: YAML parse error: ${error.message}`);
    exitCode = 1;
  }
}

// Check for required workflows
console.log('Checking for required workflows...\n');
for (const required of REQUIRED_WORKFLOWS) {
  if (!workflowFiles.includes(required)) {
    errors.push(`❌ Missing required workflow: ${required}`);
    exitCode = 1;
  } else {
    console.log(`  ✅ Required workflow found: ${required}`);
  }
}

// Check for potential duplicates (files with similar names)
console.log('\nChecking for potential duplicate workflows...\n');
const baseNames = new Map();
for (const file of workflowFiles) {
  // Extract base name (remove version suffixes, -old, -new, etc.)
  const baseName = file
    .replace(/-v\d+/, '')
    .replace(/-frozen/, '')
    .replace(/-backup/, '')
    .replace(/-old/, '')
    .replace(/-new/, '')
    .replace(/\.yml$/, '');
  
  if (baseNames.has(baseName)) {
    const existing = baseNames.get(baseName);
    warnings.push(`⚠️  Potential duplicates detected: ${existing} and ${file}`);
  } else {
    baseNames.set(baseName, file);
  }
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60) + '\n');

if (errors.length > 0) {
  console.log('❌ ERRORS:\n');
  errors.forEach(error => console.log(error));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(warning => console.log(warning));
  console.log('');
}

if (exitCode === 0 && warnings.length === 0) {
  console.log('✅ All workflow files passed validation!');
  console.log('✅ All required workflows present');
  console.log('✅ No governance violations detected\n');
} else if (exitCode === 0) {
  console.log(`✅ Validation passed with ${warnings.length} warning(s)\n`);
} else {
  console.log(`❌ Validation FAILED with ${errors.length} error(s)\n`);
  console.log('Please fix the errors above before committing.');
  console.log('See .github/workflows/WORKFLOW_GOVERNANCE.md for details.\n');
}

process.exit(exitCode);
