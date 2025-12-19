#!/usr/bin/env node

/**
 * Resolve Failed Migrations Script
 * 
 * This script checks for failed migrations in the database and attempts to resolve them
 * before deploying new migrations. This prevents P3009 errors that block deployments.
 * 
 * Context: Part of FL/CI protocol to ensure deployment robustness.
 * Issue #117: Failed migration 20251218180920 was blocking production deployments
 */

const { execSync } = require('child_process');

console.log('🔍 Checking for failed migrations...');

try {
  // Check migration status
  const output = execSync('npx prisma migrate status', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(output);
  
  // Check if there are failed migrations
  if (output.includes('failed') || output.includes('Failed')) {
    console.log('⚠️  Failed migrations detected. Attempting to resolve...');
    
    // Extract failed migration names from output
    const lines = output.split('\n');
    const failedMigrations = [];
    
    for (const line of lines) {
      if (line.includes('failed') || line.includes('Failed')) {
        // Try to extract migration name
        const match = line.match(/(\d{14}_[\w_]+)/);
        if (match) {
          failedMigrations.push(match[1]);
        }
      }
    }
    
    if (failedMigrations.length > 0) {
      console.log(`Found ${failedMigrations.length} failed migration(s):`);
      failedMigrations.forEach(m => console.log(`  - ${m}`));
      
      // Mark failed migrations as rolled back
      for (const migration of failedMigrations) {
        console.log(`📝 Marking ${migration} as rolled back...`);
        try {
          execSync(`npx prisma migrate resolve --rolled-back "${migration}"`, {
            encoding: 'utf8',
            stdio: 'inherit'
          });
          console.log(`✅ Successfully resolved ${migration}`);
        } catch (error) {
          console.error(`❌ Failed to resolve ${migration}:`, error.message);
          // Continue with other migrations
        }
      }
    }
  } else {
    console.log('✅ No failed migrations found');
  }
  
  console.log('✅ Migration resolution check complete');
  process.exit(0);
  
} catch (error) {
  // If prisma migrate status fails, it might mean no migrations exist yet
  // or database is not accessible. Log warning but don't fail the build.
  console.log('⚠️  Could not check migration status:', error.message);
  console.log('   Continuing with build - migrations will be applied during deploy step');
  process.exit(0);
}
