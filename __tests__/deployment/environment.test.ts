/**
 * Environment Configuration Tests
 * 
 * Validates environment variables and configuration
 * 
 * @jest-environment node
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Environment Configuration', () => {
  it('should have .env.example file with all required variables', () => {
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    expect(fs.existsSync(envExamplePath)).toBe(true);
    
    const content = fs.readFileSync(envExamplePath, 'utf-8');
    
    // Check for critical environment variables
    expect(content).toContain('DATABASE_URL');
    expect(content).toContain('AUTH_SECRET');
    expect(content).toContain('NEXTAUTH_URL');
  });

  it('should have Prisma schema configured', () => {
    const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma');
    
    expect(fs.existsSync(schemaPath)).toBe(true);
    
    const content = fs.readFileSync(schemaPath, 'utf-8');
    expect(content).toContain('datasource db');
    expect(content).toContain('generator client');
  });

  it('should have Next.js configuration', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    
    expect(fs.existsSync(nextConfigPath)).toBe(true);
  });

  // FL/CI: Test added to prevent DATABASE_URL validation failures
  // Issue: CI failed because DATABASE_URL didn't match Prisma schema provider
  // This test ensures DATABASE_URL format matches the schema provider requirement
  it('should have DATABASE_URL that matches Prisma schema provider', () => {
    const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    
    // Extract provider from schema
    const providerMatch = schemaContent.match(/provider\s*=\s*"(\w+)"/);
    expect(providerMatch).not.toBeNull();
    
    const provider = providerMatch![1];
    
    // DATABASE_URL must be set in tests
    expect(process.env.DATABASE_URL).toBeDefined();
    const dbUrl = process.env.DATABASE_URL!;
    
    // Validate URL matches provider
    if (provider === 'postgresql') {
      expect(dbUrl).toMatch(/^(postgresql|postgres):\/\//);
    } else if (provider === 'sqlite') {
      expect(dbUrl).toMatch(/^file:/);
    } else if (provider === 'mysql') {
      expect(dbUrl).toMatch(/^mysql:\/\//);
    }
    
    // This test prevents: "the URL must start with the protocol postgresql:// or postgres://"
    // Ensures CI workflows set DATABASE_URL correctly for the schema provider
  });
});
