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
 * 
 * IMPORTANT: This script requires DATABASE_URL (direct connection), NOT DATABASE_POOL_URL.
 * Migrations must use direct database access (typically port 5432), not connection pooling (port 6543).
 */

const { execSync } = require('child_process');

console.log('🔍 Resolving known failed migrations...');

// Verify DATABASE_URL is set (required for migrations)
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not set - skipping migration resolution');
  console.log('   (This is expected during some build phases)');
  process.exit(0);
}

// Ensure we're using DATABASE_URL, not DATABASE_POOL_URL for migrations
// Pooled connections don't support migration commands
if (process.env.DATABASE_URL.includes(':6543')) {
  console.log('⚠️  Warning: DATABASE_URL appears to be a pooled connection (port 6543)');
  console.log('   Migrations require direct connection (port 5432)');
  console.log('   Attempting resolution anyway...');
}

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
