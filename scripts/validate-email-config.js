#!/usr/bin/env node
/**
 * Email Configuration Validation Script
 * 
 * This script validates that:
 * 1. Email service TypeScript files exist and have correct structure
 * 2. Password reset email function exists
 * 3. Environment variables format is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Email Configuration Validation\n');

// Check files exist
console.log('✓ Checking email service files...');
const filesToCheck = [
  'lib/email/emailService.ts',
  'lib/email/sendPasswordResetEmail.ts',
  'lib/email.ts',
  'app/api/auth/request-password-reset/route.ts',
];

let allFilesExist = true;
for (const file of filesToCheck) {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing!');
  process.exit(1);
}

// Check email service has sender name support
console.log('\n✓ Checking sender name formatting...');
const emailServicePath = path.join(__dirname, '..', 'lib/email/emailService.ts');
const emailServiceContent = fs.readFileSync(emailServicePath, 'utf8');

if (emailServiceContent.includes('EMAIL_FROM_NAME')) {
  console.log('  ✓ EMAIL_FROM_NAME environment variable is used');
} else {
  console.error('  ❌ EMAIL_FROM_NAME environment variable not found');
  process.exit(1);
}

if (emailServiceContent.includes('PartPulse')) {
  console.log('  ✓ Default sender name "PartPulse" is configured');
} else {
  console.error('  ❌ Default sender name not found');
  process.exit(1);
}

// Check password reset email exists
console.log('\n✓ Checking password reset email function...');
const passwordResetPath = path.join(__dirname, '..', 'lib/email/sendPasswordResetEmail.ts');
const passwordResetContent = fs.readFileSync(passwordResetPath, 'utf8');

if (passwordResetContent.includes('sendPasswordResetEmail')) {
  console.log('  ✓ sendPasswordResetEmail function exists');
} else {
  console.error('  ❌ sendPasswordResetEmail function not found');
  process.exit(1);
}

// Check it's exported from lib/email.ts
console.log('\n✓ Checking exports...');
const emailExportsPath = path.join(__dirname, '..', 'lib/email.ts');
const emailExportsContent = fs.readFileSync(emailExportsPath, 'utf8');

if (emailExportsContent.includes('sendPasswordResetEmail')) {
  console.log('  ✓ sendPasswordResetEmail is exported from lib/email.ts');
} else {
  console.error('  ❌ sendPasswordResetEmail not exported');
  process.exit(1);
}

// Check password reset API uses the function
console.log('\n✓ Checking password reset API integration...');
const apiPath = path.join(__dirname, '..', 'app/api/auth/request-password-reset/route.ts');
const apiContent = fs.readFileSync(apiPath, 'utf8');

if (apiContent.includes('sendPasswordResetEmail')) {
  console.log('  ✓ Password reset API imports sendPasswordResetEmail');
} else {
  console.error('  ❌ Password reset API does not import sendPasswordResetEmail');
  process.exit(1);
}

if (apiContent.includes('await sendPasswordResetEmail')) {
  console.log('  ✓ Password reset API calls sendPasswordResetEmail');
} else {
  console.error('  ❌ Password reset API does not call sendPasswordResetEmail');
  process.exit(1);
}

// Check .env.example has correct configuration
console.log('\n✓ Checking .env.example configuration...');
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

if (envExampleContent.includes('partpulse.trane@gmail.com')) {
  console.log('  ✓ .env.example uses canonical sender: partpulse.trane@gmail.com');
} else {
  console.error('  ❌ .env.example does not use canonical sender');
  process.exit(1);
}

if (envExampleContent.includes('EMAIL_FROM_NAME')) {
  console.log('  ✓ .env.example includes EMAIL_FROM_NAME variable');
} else {
  console.error('  ❌ .env.example missing EMAIL_FROM_NAME variable');
  process.exit(1);
}

// Check no references to old email
console.log('\n✓ Checking for legacy email references in code...');
if (emailServiceContent.includes('PartPulse2025@gmail.com')) {
  console.error('  ❌ emailService.ts still contains old email address');
  process.exit(1);
}
if (passwordResetContent.includes('PartPulse2025@gmail.com')) {
  console.error('  ❌ sendPasswordResetEmail.ts still contains old email address');
  process.exit(1);
}
if (apiContent.includes('PartPulse2025@gmail.com')) {
  console.error('  ❌ request-password-reset route still contains old email address');
  process.exit(1);
}
console.log('  ✓ No legacy email addresses found in modified code');

console.log('\n✅ Email configuration validation passed!');
console.log('\n📋 Summary:');
console.log('   - All required files exist');
console.log('   - Email sender name formatting implemented');
console.log('   - Password reset email function created and integrated');
console.log('   - .env.example updated with canonical sender');
console.log('   - No legacy email addresses in modified code');
console.log('\n⚠️  Note: Actual email sending requires valid SMTP credentials');
console.log('   configured in Supabase Auth SMTP settings and Vercel environment variables.');
console.log('\n📧 Canonical Sender: PartPulse <partpulse.trane@gmail.com>');

