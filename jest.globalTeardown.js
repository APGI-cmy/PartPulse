/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Jest Global Teardown
 * 
 * Runs once after all test suites complete
 * Cleans up test database
 */

const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('\n🧹 Jest Global Teardown: Cleaning up test database...\n');

  const dbPath = process.env.DATABASE_URL?.replace(/^file:/, '') || './.ci-test-db.sqlite';
  // Prisma creates database in prisma/ directory
  const dbFile = path.resolve(process.cwd(), 'prisma', dbPath);

  // Remove test database file
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('✓ Removed test database file');
  }

  const journalFile = `${dbFile}-journal`;
  if (fs.existsSync(journalFile)) {
    fs.unlinkSync(journalFile);
    console.log('✓ Removed journal file');
  }

  console.log('✓ Test database cleanup complete\n');
};
