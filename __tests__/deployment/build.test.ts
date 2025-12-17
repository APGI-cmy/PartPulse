/**
 * Build Tests
 * 
 * Validates production build succeeds
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Production Build', () => {
  it('should build successfully', () => {
    expect(() => {
      execSync('npm run build', {
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 120000, // 2 minutes
      });
    }).not.toThrow();
  }, 150000); // 2.5 minute timeout for the test

  it('should pass TypeScript type checking during build', () => {
    // Build includes TypeScript checking
    expect(() => {
      execSync('npm run build', {
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 120000,
      });
    }).not.toThrow();
  }, 150000);

  // FL/CI: Test added to prevent Vercel DEPLOYMENT_NOT_FOUND 404 errors
  // Issue: App deployed to Vercel showed 404 with DEPLOYMENT_NOT_FOUND error
  // Root Cause: Missing 'output: standalone' configuration in next.config.ts
  // This test ensures Next.js output is properly configured for serverless deployment
  it('should have Next.js output configuration for deployment', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    expect(fs.existsSync(nextConfigPath)).toBe(true);
    
    const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
    
    // Check for output configuration
    // Next.js 16+ requires explicit output mode for Vercel
    expect(configContent).toMatch(/output\s*:\s*['"]standalone['"]/);
  });

  // FL/CI: Verify standalone build output is created
  // Vercel needs .next/standalone directory to serve the app
  it('should create standalone build output for Vercel deployment', () => {
    const standalonePath = path.join(process.cwd(), '.next/standalone');
    
    // After build, standalone directory should exist
    expect(fs.existsSync(standalonePath)).toBe(true);
    
    // Should contain server.js entry point
    const serverJsPath = path.join(standalonePath, 'server.js');
    expect(fs.existsSync(serverJsPath)).toBe(true);
    
    // Should contain package.json
    const packageJsonPath = path.join(standalonePath, 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
  });
});
