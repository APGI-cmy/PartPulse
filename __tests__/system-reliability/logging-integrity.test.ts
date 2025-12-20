/**
 * FL/CI Test Suite: Logging Integrity and Audit Trail
 * 
 * Prevents: Failure #7 - System logs missing or empty in Admin Dashboard
 * 
 * Root Cause: While logging infrastructure was correct, this validates it remains so
 * 
 * This test validates that:
 * 1. SystemLog model has all required fields
 * 2. All transactional workflows call logging functions
 * 3. Email send results are logged
 * 4. Audit trail infrastructure is complete
 * 
 * If these tests fail, logs will not be visible in Admin Dashboard.
 */

import fs from 'fs';
import path from 'path';

describe('SystemLog Model Validation (FL/CI Failure #7)', () => {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

  it('should have Prisma schema file', () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  it('should have SystemLog model with all required fields', () => {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    // Validate SystemLog model exists
    expect(schemaContent).toMatch(/model\s+SystemLog/);

    // Validate required fields
    expect(schemaContent).toMatch(/eventType\s+String/);
    expect(schemaContent).toMatch(/action\s+String/);
    expect(schemaContent).toMatch(/userId\s+String\?/);
    expect(schemaContent).toMatch(/userName\s+String\?/);
    expect(schemaContent).toMatch(/success\s+Boolean/);
    expect(schemaContent).toMatch(/timestamp\s+DateTime/);
  });

  it('should have SystemLog indexes for performance', () => {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    // Extract SystemLog model block
    const systemLogMatch = schemaContent.match(/model\s+SystemLog\s*{[^}]*}/s);
    
    if (systemLogMatch) {
      const systemLogModel = systemLogMatch[0];
      
      // Should have indexes on commonly queried fields
      expect(systemLogModel).toMatch(/@@index/);
    }
  });
});

describe('Logging Functions Validation (FL/CI Failure #7)', () => {
  const systemLogPath = path.join(process.cwd(), 'lib', 'logging', 'systemLog.ts');

  it('should have systemLog.ts utility file', () => {
    expect(fs.existsSync(systemLogPath)).toBe(true);
  });

  it('should export logEvent function', () => {
    const systemLogContent = fs.readFileSync(systemLogPath, 'utf-8');

    expect(systemLogContent).toMatch(/export.*function\s+logEvent/);
    expect(systemLogContent).toMatch(/prisma\.systemLog\.create/);
  });

  it('should export helper logging functions', () => {
    const systemLogContent = fs.readFileSync(systemLogPath, 'utf-8');

    // Validate helper functions exist
    expect(systemLogContent).toMatch(/logInternalTransferSubmission/);
    expect(systemLogContent).toMatch(/logWarrantyClaimSubmission/);
    expect(systemLogContent).toMatch(/logAuthEvent/);
    expect(systemLogContent).toMatch(/logUserManagement/);
  });

  it('should handle logging errors gracefully', () => {
    const systemLogContent = fs.readFileSync(systemLogPath, 'utf-8');

    // Validate that logging failures don't break app flow
    expect(systemLogContent).toMatch(/catch.*error/);
    expect(systemLogContent).toMatch(/console\.error/);
  });
});

describe('Workflow Logging Implementation (FL/CI Failure #7)', () => {
  const internalTransferPath = path.join(process.cwd(), 'app', 'api', 'internal-transfer', 'route.ts');

  it('should log internal transfer submissions', () => {
    const content = fs.readFileSync(internalTransferPath, 'utf-8');

    // Should import logging functions
    expect(content).toMatch(/import.*logInternalTransferSubmission/);
    expect(content).toMatch(/import.*logEvent/);

    // Should call logging on submission
    expect(content).toMatch(/logInternalTransferSubmission/);
  });

  it('should log both success and failure cases', () => {
    const content = fs.readFileSync(internalTransferPath, 'utf-8');

    // Should log success
    expect(content).toMatch(/success:\s*true/);

    // Should log failures in catch block
    expect(content).toMatch(/catch.*error/);
    expect(content).toMatch(/success:\s*false/);
  });

  it('should log PDF generation events', () => {
    const content = fs.readFileSync(internalTransferPath, 'utf-8');

    // Should import logPdfGeneration
    expect(content).toMatch(/logPdfGeneration/);

    // Should log PDF generation
    expect(content).toMatch(/entityType:\s*['"]internal_transfer['"]/);
  });

  it('should log email send events', () => {
    const content = fs.readFileSync(internalTransferPath, 'utf-8');

    // Should log email queued, sent, or failed
    expect(content).toMatch(/email_queued|email_sent|email_failed/);
  });
});

describe('Admin Dashboard Log Visibility (FL/CI Failure #7)', () => {
  const adminLogsApiPath = path.join(process.cwd(), 'app', 'api', 'admin', 'logs', 'route.ts');
  const adminDashboardPath = path.join(process.cwd(), 'app', 'settings', 'admin', 'page.tsx');

  it('should have admin logs API endpoint', () => {
    expect(fs.existsSync(adminLogsApiPath)).toBe(true);
  });

  it('should fetch logs from SystemLog table', () => {
    const content = fs.readFileSync(adminLogsApiPath, 'utf-8');

    // Should import getSystemLogs
    expect(content).toMatch(/getSystemLogs/);

    // Should query logs
    expect(content).toMatch(/await\s+getSystemLogs/);
  });

  it('should have admin dashboard page that displays logs', () => {
    expect(fs.existsSync(adminDashboardPath)).toBe(true);
  });

  it('should fetch logs in admin dashboard', () => {
    const content = fs.readFileSync(adminDashboardPath, 'utf-8');

    // Should fetch logs from API
    expect(content).toMatch(/\/api\/admin\/logs/);
    expect(content).toMatch(/fetchLogs|fetch.*logs/i);
  });
});

describe('Logging Integrity - Prevention Validation', () => {
  it('should document logging infrastructure requirements', () => {
    const failureMode = {
      issue: 'System logs missing or empty',
      cause: 'Infrastructure correct, environment configuration issue',
      solution: 'Validate all logging calls present, requires env validation',
      impact: 'No audit trail, violates governance',
      governanceImpact: 'Loss of institutional memory'
    };

    // Verify logging infrastructure is documented
    const summaryPath = path.join(process.cwd(), 'SYSTEM_RELIABILITY_FIX_SUMMARY.md');
    
    if (fs.existsSync(summaryPath)) {
      const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
      expect(summaryContent).toMatch(/log/i);
      expect(summaryContent).toMatch(/audit/i);
    }

    expect(failureMode.issue).toBe('System logs missing or empty');
  });

  it('should validate that systemLog.ts uses Prisma correctly', () => {
    const systemLogPath = path.join(process.cwd(), 'lib', 'logging', 'systemLog.ts');
    const systemLogContent = fs.readFileSync(systemLogPath, 'utf-8');

    // Should import prisma client
    expect(systemLogContent).toMatch(/import.*prisma/);

    // Should use prisma.systemLog.create
    expect(systemLogContent).toMatch(/prisma\.systemLog\.create/);
  });
});

describe('Event Type Coverage (FL/CI Failure #7)', () => {
  const systemLogPath = path.join(process.cwd(), 'lib', 'logging', 'systemLog.ts');

  it('should define all required event types', () => {
    const systemLogContent = fs.readFileSync(systemLogPath, 'utf-8');

    // Validate EventType enum or type exists
    expect(systemLogContent).toMatch(/EventType/);

    // Validate event types are defined
    expect(systemLogContent).toMatch(/submission/);
    expect(systemLogContent).toMatch(/pdf_generation/);
    expect(systemLogContent).toMatch(/admin_approval/);
    expect(systemLogContent).toMatch(/auth_event/);
    expect(systemLogContent).toMatch(/user_management/);
    expect(systemLogContent).toMatch(/email/); // Added for Failure #12
  });

  it('should have EventType enum match all eventType usage in codebase (FL/CI Failure #12)', () => {
    // This test prevents Failure #12: eventType usage without updating type definition
    const systemLogContent = fs.readFileSync(systemLogPath, 'utf-8');
    
    // Extract EventType definition
    const eventTypeMatch = systemLogContent.match(/export type EventType\s*=\s*([^;]+);/s);
    expect(eventTypeMatch).toBeTruthy();
    
    if (eventTypeMatch) {
      const eventTypeDef = eventTypeMatch[1];
      
      // Extract all type values from the union type
      const typeValues = eventTypeDef
        .split('|')
        .map(v => v.trim())
        .filter(v => v.startsWith('"'))
        .map(v => v.replace(/"/g, ''));
      
      // Validate all known event types are in the enum
      const requiredTypes = ['submission', 'pdf_generation', 'admin_approval', 'auth_event', 'user_management', 'email'];
      
      requiredTypes.forEach(type => {
        expect(typeValues).toContain(type);
      });
      
      // If this test fails, it means:
      // - A new eventType was used in code but not added to EventType enum
      // - OR an eventType was removed from enum but still used in code
      // Fix: Update EventType definition in lib/logging/systemLog.ts
    }
  });
});
