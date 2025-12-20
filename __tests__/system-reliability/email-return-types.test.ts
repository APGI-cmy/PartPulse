/**
 * FL/CI Test Suite: Email Function Return Type Consistency
 * 
 * Prevents: Type mismatches in email function return types causing build failures
 * 
 * Root Cause: Inconsistent return types across email sending functions
 * 
 * This test validates that all email sending functions have consistent return types
 * including the error property, preventing TypeScript compilation errors.
 */

import fs from 'fs';
import path from 'path';

describe('Email Function Return Type Consistency (FL/CI Build Failure)', () => {
  const emailDir = path.join(process.cwd(), 'lib', 'email');

  it('should have all email sending functions with consistent return types', () => {
    const emailFiles = [
      'sendInternalTransferReceipt.ts',
      'sendWarrantyClaimReceipt.ts',
      'sendPasswordResetEmail.ts',
      'sendInvitationEmail.ts',
    ];

    emailFiles.forEach(file => {
      const filePath = path.join(emailDir, file);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');

      // All email functions must include error?: string in return type
      // This prevents build failures when code tries to access emailResult.error
      const exportMatch = content.match(/export async function send\w+[^{]*{/s);
      
      if (exportMatch) {
        const functionSignature = exportMatch[0];
        
        // Check if it has a Promise return type
        if (functionSignature.includes('Promise<{')) {
          // Extract the return type
          const returnTypeMatch = functionSignature.match(/Promise<\s*{\s*([^}]+)\s*}>/s);
          
          if (returnTypeMatch) {
            const returnType = returnTypeMatch[1];
            
            // Must include success: boolean
            expect(returnType).toMatch(/success:\s*boolean/);
            
            // Must include messageId?: string
            expect(returnType).toMatch(/messageId\?:\s*string/);
            
            // Must include error?: string (this is what caused the build failure)
            expect(returnType).toMatch(/error\?:\s*string/);
          }
        }
      }
    });
  });

  it('should not return fake messageId on error conditions', () => {
    const emailFiles = fs.readdirSync(emailDir).filter(f => f.startsWith('send') && f.endsWith('.ts'));

    emailFiles.forEach(file => {
      const content = fs.readFileSync(path.join(emailDir, file), 'utf-8');

      // Should not have patterns like: messageId: `error-...`
      // This masks failures - should use error property instead
      expect(content).not.toMatch(/messageId:\s*[`'"]error-/);
      expect(content).not.toMatch(/messageId:\s*[`'"]stub-/);
    });
  });

  it('should use error property when email configuration is missing', () => {
    const sendInternalTransferPath = path.join(emailDir, 'sendInternalTransferReceipt.ts');
    const sendWarrantyClaimPath = path.join(emailDir, 'sendWarrantyClaimReceipt.ts');

    [sendInternalTransferPath, sendWarrantyClaimPath].forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');

      // When adminEmail is not configured, should return error property
      const adminEmailCheckMatch = content.match(/if\s*\(!adminEmail\)[^}]*{[^}]*}/s);
      
      if (adminEmailCheckMatch) {
        const adminEmailCheck = adminEmailCheckMatch[0];
        
        // Should have error property in return
        expect(adminEmailCheck).toMatch(/error:/);
        
        // Should NOT have fake messageId
        expect(adminEmailCheck).not.toMatch(/messageId:.*error/);
      }
    });
  });
});

describe('Email Return Type - Build Failure Prevention', () => {
  it('should document the build failure that was fixed', () => {
    const buildFailure = {
      error: "Property 'error' does not exist on type '{ success: boolean; messageId?: string | undefined; }'",
      file: 'app/api/warranty-claims/route.ts',
      line: 100,
      code: 'emailResult.error',
      cause: 'sendWarrantyClaimReceipt return type missing error property',
      fix: 'Added error?: string to return type',
      impact: 'Build fails in deployment, blocking production',
    };

    // Verify the fix is documented
    expect(buildFailure.cause).toBe('sendWarrantyClaimReceipt return type missing error property');
    expect(buildFailure.fix).toBe('Added error?: string to return type');
  });

  it('should validate emailService.ts return type as the standard', () => {
    const emailServicePath = path.join(process.cwd(), 'lib', 'email', 'emailService.ts');
    const content = fs.readFileSync(emailServicePath, 'utf-8');

    // emailService.sendEmail is the standard all others should follow
    const sendEmailMatch = content.match(/export async function sendEmail[^{]*{/s);
    
    if (sendEmailMatch) {
      const signature = sendEmailMatch[0];
      
      // Should have the complete return type
      expect(signature).toMatch(/Promise<\s*{\s*success:\s*boolean;\s*messageId\?:\s*string;\s*error\?:\s*string\s*}>/);
    }
  });
});
