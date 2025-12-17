/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Jest Global Setup
 * 
 * Runs once before all test suites
 * Ensures deterministic test database lifecycle
 */

const { execSync } = require('child_process');

module.exports = async () => {
  console.log('\n🔧 Jest Global Setup: Initializing test database...\n');

  // Ensure DATABASE_URL is set for tests
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable must be set for tests.\n' +
      'For PostgreSQL (required by schema): DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"\n' +
      'Ensure the URL format matches the provider in prisma/schema.prisma'
    );
  }

  console.log(`✓ Using DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

  try {
    // Deploy migrations to test database using migrate deploy
    // This ensures migration history is tracked in _prisma_migrations table
    // Critical for build tests that run "prisma migrate deploy"
    console.log('✓ Deploying migrations to test database...');
    
    try {
      execSync('npx prisma migrate deploy', {
        cwd: process.cwd(),
        stdio: 'pipe',
        env: process.env,
      });
      console.log('✓ Test database migrations deployed successfully\n');
    } catch (deployError) {
      // If deploy fails due to schema drift, reset and deploy
      console.log('✓ Schema drift detected, resetting database...');
      execSync('npx prisma migrate reset --force --skip-seed --skip-generate', {
        cwd: process.cwd(),
        stdio: 'pipe',
        env: process.env,
      });
      console.log('✓ Test database reset complete\n');
    }
  } catch (error) {
    console.error('❌ Failed to setup test database:', error.message);
    if (error.stdout) console.error('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    throw error;
  }
};
