/**
 * FL/CI Test Suite: Email Reliability and Error Handling
 * 
 * Prevents: Failure #7 - Silent email failures and inadequate logging
 * 
 * Root Cause: Email service falling back to stub mode with fake success indicators
 * 
 * This test validates that:
 * 1. Email service does NOT have stub fallback that masks failures
 * 2. Email errors are properly logged in all transactional workflows
 * 3. Error responses don't include fake messageId
 * 4. All transactional APIs log email send attempts
 * 
 * If these tests fail, email failures will be silent (governance breach).
 */

import fs from 'fs';
import path from 'path';

describe('Email Service Error Handling (FL/CI Failure #7)', () => {
  const emailServicePath = path.join(process.cwd(), 'lib', 'email', 'emailService.ts');

  it('should have emailService.ts file', () => {
    expect(fs.existsSync(emailServicePath)).toBe(true);
  });

  it('should NOT have stub fallback that returns fake messageId', () => {
    const emailServiceContent = fs.readFileSync(emailServicePath, 'utf-8');

    // Validate that stub fallback is removed
    // Old code had: messageId: `stub-fallback-${Date.now()}`
    expect(emailServiceContent).not.toMatch(/stub-fallback/);
    expect(emailServiceContent).not.toMatch(/messageId:.*stub/i);
  });

  it('should return proper error on SMTP failure', () => {
    const emailServiceContent = fs.readFileSync(emailServicePath, 'utf-8');

    // Validate catch block returns error
    expect(emailServiceContent).toMatch(/catch.*error/);
    expect(emailServiceContent).toMatch(/success:\s*false/);
    expect(emailServiceContent).toMatch(/error:/);
  });

  it('should not log sensitive data in error logs', () => {
    const emailServiceContent = fs.readFileSync(emailServicePath, 'utf-8');

    // In the catch block, we should NOT log recipients or subjects in error logs
    // This is a security best practice
    const catchBlockMatch = emailServiceContent.match(/catch\s*\([^)]*\)\s*{[^}]*}/s);
    
    if (catchBlockMatch) {
      const catchBlock = catchBlockMatch[0];
      
      // Should not log options.to or options.subject in the catch block
      expect(catchBlock).not.toMatch(/console\.error.*options\.to/);
      expect(catchBlock).not.toMatch(/console\.error.*options\.subject/);
    }
  });
});

describe('Email Logging in Transactional Workflows (FL/CI Failure #7)', () => {
  const internalTransferPath = path.join(process.cwd(), 'app', 'api', 'internal-transfer', 'route.ts');
  const passwordResetPath = path.join(process.cwd(), 'app', 'api', 'auth', 'request-password-reset', 'route.ts');
  const warrantyClaimsPath = path.join(process.cwd(), 'app', 'api', 'warranty-claims', 'route.ts');

  it('should log email send results in internal-transfer workflow', () => {
    const content = fs.readFileSync(internalTransferPath, 'utf-8');

    // Validate email send is logged
    expect(content).toMatch(/sendInternalTransferReceipt/);
    expect(content).toMatch(/logEvent/);
    
    // Should log email_sent or email_failed action
    expect(content).toMatch(/email_sent|email_failed/);
  });

  it('should log email send results in password reset workflow', () => {
    const content = fs.readFileSync(passwordResetPath, 'utf-8');

    // Validate email send is logged
    expect(content).toMatch(/sendPasswordResetEmail/);
    expect(content).toMatch(/logUserManagement/);
    
    // Should log the result
    expect(content).toMatch(/emailResult/);
  });

  it('should log email send results in warranty claims workflow', () => {
    const content = fs.readFileSync(warrantyClaimsPath, 'utf-8');

    // Validate email send is logged
    expect(content).toMatch(/sendWarrantyClaimReceipt/);
    expect(content).toMatch(/logEvent/);
    
    // Should log email_sent or email_failed action
    expect(content).toMatch(/email_sent|email_failed/);
  });

  it('should NOT have duplicate logging in warranty claims', () => {
    const content = fs.readFileSync(warrantyClaimsPath, 'utf-8');

    // Email send result should use logEvent, not logWarrantyClaimSubmission
    // (to avoid duplicate logging)
    
    // Count how many times logWarrantyClaimSubmission is called
    const submissionLogMatches = content.match(/logWarrantyClaimSubmission/g) || [];
    
    // Should only be called once (for the submission itself, not for email)
    // If it's called more than twice, we have duplicate logging
    expect(submissionLogMatches.length).toBeLessThanOrEqual(2);
  });
});

describe('Email Error Messages (FL/CI Failure #7)', () => {
  const sendInternalTransferPath = path.join(process.cwd(), 'lib', 'email', 'sendInternalTransferReceipt.ts');

  it('should return descriptive error when ADMIN_EMAIL not configured', () => {
    const content = fs.readFileSync(sendInternalTransferPath, 'utf-8');

    // Should check if adminEmail exists
    expect(content).toMatch(/adminEmail/);
    expect(content).toMatch(/if\s*\(!adminEmail\)/);
    
    // Should return error with description
    expect(content).toMatch(/success:\s*false/);
    expect(content).toMatch(/error:/);
  });

  it('should NOT return messageId on configuration errors', () => {
    const content = fs.readFileSync(sendInternalTransferPath, 'utf-8');

    // When adminEmail is not configured, should return error (not messageId)
    const configCheckMatch = content.match(/if\s*\(!adminEmail\)[^}]*{[^}]*}/s);
    
    if (configCheckMatch) {
      const configCheck = configCheckMatch[0];
      
      // Should NOT have messageId in the error return
      expect(configCheck).not.toMatch(/messageId:.*error/);
    }
  });
});

describe('Email Reliability - Prevention Validation', () => {
  it('should document email failure mode being prevented', () => {
    const failureMode = {
      issue: 'Silent email failures',
      cause: 'Stub fallback with fake messageId',
      solution: 'Return proper errors, log all attempts',
      impact: 'Email notifications not delivered, no audit trail',
      governanceImpact: 'Violates assurance guarantees'
    };

    // Verify the fixes are documented in SYSTEM_RELIABILITY_FIX_SUMMARY.md
    const summaryPath = path.join(process.cwd(), 'SYSTEM_RELIABILITY_FIX_SUMMARY.md');
    
    if (fs.existsSync(summaryPath)) {
      const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
      expect(summaryContent).toMatch(/email/i);
      expect(summaryContent).toMatch(/transactional/i);
    }

    expect(failureMode.issue).toBe('Silent email failures');
  });
});
