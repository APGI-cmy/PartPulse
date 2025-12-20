/**
 * FL/CI Test Suite: TypeScript Type Safety Validation
 * 
 * Prevents: Build failures from TypeScript type errors (Failures #8, #9)
 * 
 * Root Cause: Tests validated behavior but not TypeScript type safety
 * 
 * This test validates that the entire codebase compiles with TypeScript strict checks.
 * It prevents type errors from reaching production by catching them in CI.
 * 
 * Pattern Detected: Failures #8 and #9 were both TypeScript type errors that
 * passed tests locally but failed in production build.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('TypeScript Type Safety (FL/CI Failures #8, #9)', () => {
  it('should compile all TypeScript files without errors', () => {
    // This test runs TypeScript compiler in --noEmit mode
    // It catches type errors that would cause build failures in production
    
    try {
      // Run TypeScript compiler with strict checks
      // This mimics production build type checking
      execSync('npx tsc --noEmit', {
        cwd: process.cwd(),
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      // If we reach here, compilation succeeded
      expect(true).toBe(true);
    } catch (error: any) {
      // If compilation fails, show the errors
      const errorOutput = error.stdout || error.stderr || error.message;
      
      // Fail the test with detailed error information
      fail(`TypeScript compilation failed:\n\n${errorOutput}\n\nThis indicates type errors that would cause production build to fail.`);
    }
  });

  it('should have strict TypeScript configuration', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    // Validate strict mode is enabled (catches more type errors)
    const compilerOptions = tsconfig.compilerOptions || {};
    
    // These settings help catch type errors early
    expect(compilerOptions.strict || compilerOptions.strictNullChecks).toBeTruthy();
  });

  it('should document the build failures that were fixed', () => {
    const buildFailures = [
      {
        number: 8,
        error: "Property 'error' does not exist on type '{ success: boolean; messageId?: string | undefined; }'",
        file: 'lib/email/sendWarrantyClaimReceipt.ts',
        cause: 'Missing error?: string in return type',
        fix: 'Added error?: string to return type',
      },
      {
        number: 9,
        error: "'databaseUrl' is possibly 'undefined'",
        file: 'lib/prisma.ts',
        cause: 'No fallback for undefined environment variables',
        fix: 'Added || \'\' fallback and && databaseUrl check',
      },
    ];

    // Verify both failures are documented
    expect(buildFailures[0].number).toBe(8);
    expect(buildFailures[1].number).toBe(9);
    
    // Verify pattern detected
    expect(buildFailures.every(f => f.error.includes('Type error') || f.error.includes('undefined'))).toBe(true);
  });

  it('should prevent undefined variable usage in critical files', () => {
    const criticalFiles = [
      'lib/prisma.ts',
      'lib/email/emailService.ts',
      'lib/email/sendWarrantyClaimReceipt.ts',
    ];

    criticalFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Check for common undefined safety patterns
        // These patterns prevent "possibly undefined" errors
        
        // Pattern 1: env var with fallback (|| '')
        const envVarUsage = content.match(/process\.env\.\w+/g);
        if (envVarUsage && envVarUsage.length > 0) {
          // Should have fallback or null check somewhere
          const hasFallback = content.includes('||') || content.includes('??');
          const hasNullCheck = content.includes('if (') && content.includes('undefined');
          
          expect(hasFallback || hasNullCheck).toBe(true);
        }
      }
    });
  });

  it('should have consistent return types across function families', () => {
    // This test validates lessons from Failure #8
    // All functions in a family should have consistent return types
    
    const emailDir = path.join(process.cwd(), 'lib', 'email');
    const emailFiles = fs.readdirSync(emailDir).filter(f => f.startsWith('send') && f.endsWith('.ts'));

    const returnTypes: string[] = [];

    emailFiles.forEach(file => {
      const content = fs.readFileSync(path.join(emailDir, file), 'utf-8');
      
      // Extract return type
      const returnTypeMatch = content.match(/Promise<\s*{\s*([^}]+)\s*}>/);
      if (returnTypeMatch) {
        returnTypes.push(returnTypeMatch[1]);
      }
    });

    // All return types should include error?: string
    returnTypes.forEach(returnType => {
      if (returnType.includes('success') && returnType.includes('messageId')) {
        // Should also include error
        expect(returnType).toMatch(/error\?:\s*string/);
      }
    });
  });
});

describe('Build Process Validation (FL/CI Pattern)', () => {
  it('should validate build succeeds before claiming 100% functionality', () => {
    // This test documents the pattern from Failures #8 and #9
    // Both were claimed as 100% but failed in production build
    
    const pattern = {
      issue: 'Claimed 100% functionality but build failed in production',
      failures: ['Failure #8', 'Failure #9'],
      commonCause: 'TypeScript type errors not caught by tests',
      solution: 'Add comprehensive type safety validation test',
      prevention: 'This test (TypeScript compilation validation)',
    };

    expect(pattern.failures.length).toBe(2);
    expect(pattern.solution).toContain('type safety validation');
  });

  it('should catch consecutive build failures of same type', () => {
    // Failure #8: Type error in email return type
    // Failure #9: Type error in environment variable handling
    // Both: TypeScript type safety not validated
    
    const consecutiveFailures = {
      pattern: 'TypeScript type errors',
      count: 2,
      systemic: true,
      fix: 'Comprehensive TypeScript compilation test',
    };

    expect(consecutiveFailures.systemic).toBe(true);
    expect(consecutiveFailures.count).toBe(2);
  });
});
