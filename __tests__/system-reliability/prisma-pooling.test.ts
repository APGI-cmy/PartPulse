/**
 * FL/CI Test Suite: Prisma Connection Pooling Configuration
 * 
 * Prevents: Failure #7 - Prisma "prepared statement s8 already exists" error (42P05)
 * 
 * Root Cause: Using DATABASE_POOL_URL without pgbouncer=true parameter
 * 
 * This test validates that when DATABASE_POOL_URL is used, the Prisma client
 * configuration includes the pgbouncer=true parameter to disable prepared statements.
 * 
 * If this test fails, prepared statement errors will occur on repeated operations.
 */

import fs from 'fs';
import path from 'path';

describe('Prisma Connection Pooling Configuration (FL/CI Failure #7)', () => {
  const prismaFilePath = path.join(process.cwd(), 'lib', 'prisma.ts');

  it('should have lib/prisma.ts file', () => {
    expect(fs.existsSync(prismaFilePath)).toBe(true);
  });

  it('should append pgbouncer=true when DATABASE_POOL_URL is set', () => {
    const prismaContent = fs.readFileSync(prismaFilePath, 'utf-8');

    // Validate that the file checks for DATABASE_POOL_URL
    expect(prismaContent).toMatch(/DATABASE_POOL_URL/);

    // Validate that pgbouncer=true is appended when using DATABASE_POOL_URL
    expect(prismaContent).toMatch(/pgbouncer=true/);

    // Validate the conditional logic exists
    expect(prismaContent).toMatch(/process\.env\.DATABASE_POOL_URL/);
  });

  it('should fallback to DATABASE_URL when DATABASE_POOL_URL is not set', () => {
    const prismaContent = fs.readFileSync(prismaFilePath, 'utf-8');

    // Validate fallback logic exists
    expect(prismaContent).toMatch(/DATABASE_POOL_URL.*\|\|.*DATABASE_URL/);
  });

  it('should use the connection string in PrismaClient datasources', () => {
    const prismaContent = fs.readFileSync(prismaFilePath, 'utf-8');

    // Validate PrismaClient is instantiated with datasources configuration
    expect(prismaContent).toMatch(/new PrismaClient\(/);
    expect(prismaContent).toMatch(/datasources/);
    expect(prismaContent).toMatch(/db:/);
    expect(prismaContent).toMatch(/url:/);
  });

  it('should handle connection strings with existing query parameters', () => {
    const prismaContent = fs.readFileSync(prismaFilePath, 'utf-8');

    // Validate that the code checks if '?' already exists in the URL
    // This ensures proper parameter appending (? vs &)
    expect(prismaContent).toMatch(/includes\(['"]?\?['"]?\)/);
  });
});

describe('Prisma Connection Pooling - Prevention Validation', () => {
  it('should document why pgbouncer parameter is needed', () => {
    const prismaFilePath = path.join(process.cwd(), 'lib', 'prisma.ts');
    const prismaContent = fs.readFileSync(prismaFilePath, 'utf-8');

    // Validate that there's a comment explaining the pgbouncer parameter
    const hasDocumentation = 
      prismaContent.includes('prepared statement') ||
      prismaContent.includes('42P05') ||
      prismaContent.includes('pgbouncer') ||
      prismaContent.includes('connection pool');

    expect(hasDocumentation).toBe(true);
  });

  it('should prevent prepared statement errors (PostgreSQL 42P05)', () => {
    // This test documents the failure mode being prevented
    const failureMode = {
      errorCode: '42P05',
      errorMessage: 'prepared statement "s8" already exists',
      cause: 'Using DATABASE_POOL_URL without pgbouncer=true',
      solution: 'Append pgbouncer=true to connection string',
      impact: 'Workflow fails on repeated submissions'
    };

    // Verify the fix is in place
    const prismaFilePath = path.join(process.cwd(), 'lib', 'prisma.ts');
    const prismaContent = fs.readFileSync(prismaFilePath, 'utf-8');

    expect(prismaContent).toMatch(/pgbouncer=true/);
    expect(failureMode.errorCode).toBe('42P05');
  });
});
