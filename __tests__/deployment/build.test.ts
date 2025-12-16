/**
 * Build Tests
 * 
 * Validates production build succeeds
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';

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
});
