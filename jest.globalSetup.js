/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Jest Global Setup
 * 
 * Runs once before all test suites
 * Ensures deterministic test database lifecycle
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('\n🔧 Jest Global Setup: Initializing test database...\n');

  // Ensure DATABASE_URL is set for tests
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./.ci-test-db.sqlite';
  }

  // Parse database path correctly - Prisma creates it in prisma/ directory
  const dbPath = process.env.DATABASE_URL.replace(/^file:/, '');
  const dbFile = path.resolve(process.cwd(), 'prisma', dbPath);

  // Remove existing test database to ensure clean state
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('✓ Removed existing test database');
  }

  const journalFile = `${dbFile}-journal`;
  if (fs.existsSync(journalFile)) {
    fs.unlinkSync(journalFile);
    console.log('✓ Removed existing journal file');
  }

  try {
    // Push Prisma schema to create fresh database
    console.log('✓ Creating fresh test database...');
    execSync('npx prisma db push --force-reset --skip-generate --accept-data-loss', {
      cwd: process.cwd(),
      stdio: 'pipe',
      env: process.env,
    });
    console.log('✓ Test database schema applied successfully');

    // Verify database was created
    if (!fs.existsSync(dbFile)) {
      console.error(`Expected database file at: ${dbFile}`);
      console.error(`Current directory: ${process.cwd()}`);
      console.error(`DATABASE_URL: ${process.env.DATABASE_URL}`);
      throw new Error('Test database file was not created');
    }
    console.log(`✓ Test database file verified at: ${dbFile}\n`);
  } catch (error) {
    console.error('❌ Failed to setup test database:', error.message);
    if (error.stdout) console.error('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    throw error;
  }
};
