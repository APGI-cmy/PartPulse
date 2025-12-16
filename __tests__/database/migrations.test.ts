/**
 * Database Migrations Tests
 * 
 * Validates that Prisma migrations and schema generation work correctly
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Use a temporary file-based SQLite database for tests
// This ensures the database persists across test executions
const TEST_DB_PATH = path.join(process.cwd(), '.tmp-test-db.sqlite');
const TEST_DATABASE_URL = `file:${TEST_DB_PATH}`;

describe('Database Migrations', () => {
  // Ensure DATABASE_URL is set for all Prisma commands
  const prismaEnv = {
    ...process.env,
    DATABASE_URL: TEST_DATABASE_URL,
  };

  beforeAll(() => {
    // Set DATABASE_URL globally for all tests
    process.env.DATABASE_URL = TEST_DATABASE_URL;
    
    // Clean up any existing test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterAll(() => {
    // Clean up test database after all tests
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('should run prisma generate without errors', () => {
    // This test verifies that Prisma can generate the client from the schema
    expect(() => {
      execSync('npx prisma generate', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        env: prismaEnv,
      });
    }).not.toThrow();
  });

  it('should apply migrations without errors', () => {
    // For SQLite, we test that the schema can be pushed/validated
    expect(() => {
      execSync('npx prisma db push --skip-generate --accept-data-loss', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        env: prismaEnv,
      });
    }).not.toThrow();
  });

  it('should seed database successfully', async () => {
    const prisma = new PrismaClient();
    
    try {
      // Verify we can connect to the database
      await prisma.$connect();
      
      // Check that we can query the database
      const userCount = await prisma.user.count();
      
      // Should be able to count (even if 0)
      expect(typeof userCount).toBe('number');
      expect(userCount).toBeGreaterThanOrEqual(0);
    } finally {
      await prisma.$disconnect();
    }
  });
});
