/**
 * Test Dodging Detection Tests
 * 
 * Validates that no test dodging patterns exist
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Test Dodging Detection', () => {
  it('should not have test skipping patterns in tests', () => {
    const testFiles = findTestFiles('__tests__');
    const violations: string[] = [];

    testFiles.forEach(file => {
      // Skip checking the test-dodging test itself
      if (file.includes('test-dodging.test.ts')) {
        return;
      }
      
      const content = fs.readFileSync(file, 'utf-8');
      // Check for actual skip patterns - look for method calls not in strings
      const skipPattern = /\b(it|test|describe)\s*\.\s*skip\s*\(/g;
      const matches = content.match(skipPattern);
      
      if (matches && matches.length > 0) {
        violations.push(file);
      }
    });

    expect(violations).toEqual([]);
  });

  it('should not have test isolation patterns in tests', () => {
    const testFiles = findTestFiles('__tests__');
    const violations: string[] = [];

    testFiles.forEach(file => {
      // Skip checking the test-dodging test itself
      if (file.includes('test-dodging.test.ts')) {
        return;
      }
      
      const content = fs.readFileSync(file, 'utf-8');
      // Check for actual only patterns - look for method calls not in strings
      const onlyPattern = /\b(it|test|describe)\s*\.\s*only\s*\(/g;
      const matches = content.match(onlyPattern);
      
      if (matches && matches.length > 0) {
        violations.push(file);
      }
    });

    expect(violations).toEqual([]);
  });

  it('should run detect-test-dodging script successfully', () => {
    expect(() => {
      execSync('node qa/detect-test-dodging.js', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    }).not.toThrow();
  });
});

function findTestFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findTestFiles(fullPath));
    } else if (item.endsWith('.test.ts') || item.endsWith('.test.js')) {
      files.push(fullPath);
    }
  });

  return files;
}
