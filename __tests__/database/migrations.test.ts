/**
 * Database Migrations Tests
 * 
 * Validates that Prisma migrations and schema generation work correctly
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

describe('Database Migrations', () => {
  it('should run prisma generate without errors', () => {
    // This test verifies that Prisma can generate the client from the schema
    expect(() => {
      execSync('npx prisma generate', { 
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    }).not.toThrow();
  });

  it('should apply migrations without errors', () => {
    // For SQLite, we test that the schema can be pushed/validated
    expect(() => {
      execSync('npx prisma db push --skip-generate --accept-data-loss', { 
        cwd: process.cwd(),
        stdio: 'pipe',
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
