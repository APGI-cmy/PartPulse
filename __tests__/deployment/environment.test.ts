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
});
