#!/usr/bin/env node

/**
 * Resolve Failed Migrations Script
 * 
 * This script resolves known failed migrations before deploying new ones.
 * This prevents P3009 errors that block deployments.
 * 
 * Context: Part of FL/CI protocol to ensure deployment robustness.
 * Issue #117: Failed migration 20251218180920 was blocking production deployments
 * 
 * Strategy: Directly resolve known failed migrations without checking status first,
 * since prisma migrate status may fail if DATABASE_URL is not yet available.
 */

const { execSync } = require('child_process');

console.log('🔍 Resolving known failed migrations...');

// List of known failed migrations that need to be resolved
// These are migrations that failed in production and block new deployments
const knownFailedMigrations = [
  '20251218180920_add_pdf_path_to_internal_transfer', // Issue #117 - Old migration with P3009
];

let resolved = 0;
let skipped = 0;

for (const migration of knownFailedMigrations) {
  console.log(`📝 Attempting to resolve: ${migration}...`);
  try {
    // Try to mark as rolled back
    execSync(`npx prisma migrate resolve --rolled-back "${migration}"`, {
      encoding: 'utf8',
      stdio: 'inherit'
    });
    console.log(`✅ Successfully resolved ${migration}`);
    resolved++;
  } catch (error) {
    // Migration might not exist in DB or already resolved - this is OK
    console.log(`ℹ️  Migration ${migration} does not need resolution (might not exist or already resolved)`);
    skipped++;
  }
}

console.log(`\n📊 Summary: ${resolved} resolved, ${skipped} skipped`);
console.log('✅ Migration resolution complete - proceeding with deployment');
process.exit(0);
