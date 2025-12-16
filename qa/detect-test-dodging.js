#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Test Dodging Detection Script
 * 
 * This script detects patterns that bypass testing requirements.
 * Per ForemanApp governance, test dodging is a governance violation.
 * 
 * Forbidden patterns:
 * - .skip() on test suites or individual tests
 * - .only() on tests (focused tests)
 * - Disabled tests via comments or conditions
 * - xdescribe, xit, xtest patterns
 * - Conditional test skipping
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

class TestDodgingDetector {
  constructor() {
    this.violations = [];
    this.checkedFiles = 0;
  }

  /**
   * Forbidden patterns that indicate test dodging
   */
  getForbiddenPatterns() {
    return [
      {
        pattern: /\.(skip|only)\(/g,
        name: 'Skip/Only Test',
        description: 'Tests using .skip() or .only() bypass full test execution'
      },
      {
        pattern: /x(describe|it|test)\(/g,
        name: 'Disabled Test Syntax',
        description: 'xdescribe, xit, xtest patterns disable tests'
      },
      {
        pattern: /(describe|it|test)\.skip\(/g,
        name: 'Skip Syntax',
        description: 'Explicit test skipping detected'
      },
      {
        pattern: /\/\/\s*(describe|it|test)\(/g,
        name: 'Commented Test',
        description: 'Tests commented out to avoid execution'
      },
      {
        pattern: /if\s*\([^)]*\)\s*{\s*return\s*;\s*}\s*\/\/\s*(skip|ignore|disable)/gi,
        name: 'Conditional Skip',
        description: 'Conditional early return to skip test'
      }
    ];
  }

  /**
   * Find all test files in the repository
   */
  findTestFiles() {
    const testDirs = ['__tests__', 'tests', 'test'];
    const testExtensions = ['.test.js', '.test.jsx', '.test.ts', '.test.tsx', '.spec.js', '.spec.jsx', '.spec.ts', '.spec.tsx'];
    
    const files = [];
    
    // Check if any test directories exist
    for (const dir of testDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        this.walkDir(dirPath, files, testExtensions);
      }
    }
    
    // Also check for test files in app, components, and lib directories
    const codeDirs = ['app', 'components', 'lib'];
    for (const dir of codeDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        this.walkDir(dirPath, files, testExtensions);
      }
    }
    
    return files;
  }

  /**
   * Recursively walk directory to find test files
   */
  walkDir(dir, fileList, extensions) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .next
        if (file !== 'node_modules' && file !== '.next' && file !== 'coverage') {
          this.walkDir(filePath, fileList, extensions);
        }
      } else {
        // Check if file matches test extensions
        if (extensions.some(ext => file.endsWith(ext))) {
          fileList.push(filePath);
        }
      }
    }
  }

  /**
   * Check a file for test dodging patterns
   */
  checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const patterns = this.getForbiddenPatterns();
    const relPath = path.relative(process.cwd(), filePath);
    
    for (const { pattern, name, description } of patterns) {
      let match;
      pattern.lastIndex = 0; // Reset regex
      
      while ((match = pattern.exec(content)) !== null) {
        // Calculate line number
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const line = content.split('\n')[lineNumber - 1].trim();
        
        this.violations.push({
          file: relPath,
          line: lineNumber,
          pattern: name,
          description,
          code: line
        });
      }
    }
  }

  /**
   * Run the detection
   */
  run() {
    console.log('\n' + '='.repeat(70));
    console.log('Test Dodging Detection - QA Governance Enforcement');
    console.log('='.repeat(70) + '\n');
    
    const testFiles = this.findTestFiles();
    
    if (testFiles.length === 0) {
      console.log(`${YELLOW}⚠️  No test files found.${RESET}`);
      console.log(`${YELLOW}   This may indicate missing test coverage.${RESET}\n`);
      // For now, we allow no tests (coverage will catch this)
      return 0;
    }
    
    console.log(`Found ${testFiles.length} test file(s) to check...\n`);
    
    for (const file of testFiles) {
      this.checkFile(file);
      this.checkedFiles++;
    }
    
    if (this.violations.length === 0) {
      console.log(`${GREEN}✅ PASSED - No test dodging detected${RESET}`);
      console.log(`   Checked ${this.checkedFiles} test file(s)\n`);
      return 0;
    }
    
    // Report violations
    console.log(`${RED}❌ FAILED - Test dodging detected${RESET}\n`);
    console.log(`Found ${this.violations.length} violation(s):\n`);
    
    for (const violation of this.violations) {
      console.log(`${RED}●${RESET} ${violation.file}:${violation.line}`);
      console.log(`  Pattern: ${violation.pattern}`);
      console.log(`  Reason: ${violation.description}`);
      console.log(`  Code: ${violation.code}`);
      console.log();
    }
    
    console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}`);
    console.log(`${RED}                    GOVERNANCE VIOLATION                        ${RESET}`);
    console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}`);
    console.log(`${RED}Test dodging is forbidden per ForemanApp governance policy.${RESET}`);
    console.log(`${RED}All tests must run. Use QA Parking for governed exceptions.${RESET}`);
    console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}\n`);
    
    return 1;
  }
}

// Run detection
const detector = new TestDodgingDetector();
const exitCode = detector.run();
process.exit(exitCode);
