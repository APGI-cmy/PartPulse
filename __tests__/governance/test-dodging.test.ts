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
      const content = fs.readFileSync(file, 'utf-8');
      // Check for actual skip patterns, not in test descriptions
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Skip lines that are in string literals or test descriptions
        if (line.includes('describe(') || line.includes('it(')) {
          const hasSkipKeyword = /\b(skip|only)\s*\(/.test(line) || /\.(skip|only)\(/.test(line);
          if (hasSkipKeyword && file !== '__tests__/governance/test-dodging.test.ts') {
            violations.push(`${file}:${idx + 1}`);
          }
        }
      });
    });

    expect(violations).toEqual([]);
  });

  it('should not have test isolation patterns in tests', () => {
    const testFiles = findTestFiles('__tests__');
    const violations: string[] = [];

    testFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // Check for actual only patterns, not in test descriptions
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Skip lines that are in string literals or test descriptions  
        if (line.includes('describe(') || line.includes('it(')) {
          const hasOnlyPattern = /\.(only)\(/.test(line) || /\bonly\s*\(/.test(line);
          if (hasOnlyPattern && file !== '__tests__/governance/test-dodging.test.ts') {
            violations.push(`${file}:${idx + 1}`);
          }
        }
      });
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
