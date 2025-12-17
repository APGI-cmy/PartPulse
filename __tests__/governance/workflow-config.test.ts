/**
 * Workflow Configuration Consistency Tests
 * 
 * FL/CI: Added to prevent incomplete environment configuration fixes
 * 
 * Validates that ALL workflow files have consistent DATABASE_URL configuration
 * that matches the Prisma schema provider.
 * 
 * @jest-environment node
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Workflow DATABASE_URL Configuration', () => {
  // FL/CI: Test added after incomplete fix in commit d4abe6f missed qa-enforcement-v1-frozen.yml
  // This test ensures ALL workflow files are checked for DATABASE_URL consistency
  it('should have DATABASE_URL matching Prisma provider in ALL workflow files', () => {
    // Read Prisma schema to get required provider
    const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const providerMatch = schemaContent.match(/provider\s*=\s*"(\w+)"/);
    
    expect(providerMatch).not.toBeNull();
    const provider = providerMatch![1];
    
    // Find all workflow files using Node.js built-ins
    const workflowsDir = path.join(process.cwd(), '.github/workflows');
    const files = fs.readdirSync(workflowsDir);
    const workflowFiles = files
      .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
      .map(f => path.join(workflowsDir, f));
    
    expect(workflowFiles.length).toBeGreaterThan(0);
    
    const violations: string[] = [];
    
    // Check each workflow file
    for (const workflowFile of workflowFiles) {
      const content = fs.readFileSync(workflowFile, 'utf-8');
      
      // Skip empty or minimal files (like placeholders)
      if (content.trim().length < 10) continue;
      
      // Find all DATABASE_URL declarations
      const urlMatches = content.matchAll(/DATABASE_URL:\s*['"](.*?)['"]/g);
      
      for (const match of urlMatches) {
        const url = match[1];
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        // Validate URL matches provider
        let isValid = false;
        if (provider === 'postgresql') {
          isValid = /^(postgresql|postgres):\/\//.test(url);
        } else if (provider === 'sqlite') {
          isValid = /^file:/.test(url);
        } else if (provider === 'mysql') {
          isValid = /^mysql:\/\//.test(url);
        }
        
        if (!isValid) {
          const fileName = path.basename(workflowFile);
          violations.push(
            `${fileName}:${lineNumber} - DATABASE_URL="${url}" doesn't match provider="${provider}"`
          );
        }
      }
    }
    
    // Report all violations
    if (violations.length > 0) {
      const message = `DATABASE_URL mismatch found in ${violations.length} location(s):\n` +
        violations.map(v => `  - ${v}`).join('\n') +
        `\n\nAll workflow files must use DATABASE_URL that matches Prisma provider="${provider}"`;
      
      throw new Error(message);
    }
    
    // This test prevents: Incomplete fixes that miss workflow files
    // Ensures: ALL workflow files are validated for DATABASE_URL consistency
  });

  // FL/CI: Validate that workflow files with npm ci have DATABASE_URL set
  it('should have DATABASE_URL set in steps that run npm ci', () => {
    const workflowsDir = path.join(process.cwd(), '.github/workflows');
    const files = fs.readdirSync(workflowsDir);
    const workflowFiles = files
      .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
      .map(f => path.join(workflowsDir, f));
    
    const violations: string[] = [];
    
    for (const workflowFile of workflowFiles) {
      const content = fs.readFileSync(workflowFile, 'utf-8');
      const fileName = path.basename(workflowFile);
      
      // Skip empty or template files
      if (content.trim().length < 10) continue;
      
      // Find all steps that run npm ci
      const stepMatches = content.matchAll(/- name:([^\n]+)\n([\s\S]*?)(?=\n\s{0,4}- name:|\n\s{0,4}jobs:|\n\s{0,4}$)/g);
      
      for (const stepMatch of stepMatches) {
        const stepName = stepMatch[1].trim();
        const stepContent = stepMatch[2];
        
        // Check if this step runs npm ci
        if (/npm\s+ci\b/m.test(stepContent)) {
          // Check if DATABASE_URL is set in this step's env section
          // Look for env: followed by DATABASE_URL within the same step
          const hasEnvSection = /env:\s*\n[\s\S]*?DATABASE_URL:/m.test(stepContent);
          
          if (!hasEnvSection) {
            const lineNumber = content.substring(0, stepMatch.index).split('\n').length;
            violations.push(
              `${fileName}:${lineNumber} - Step "${stepName}" runs npm ci but DATABASE_URL is not set in env`
            );
          }
        }
      }
    }
    
    if (violations.length > 0) {
      const message = `Steps running npm ci without DATABASE_URL in env:\n` +
        violations.map(v => `  - ${v}`).join('\n') +
        `\n\nPrisma postinstall hook requires DATABASE_URL to be set during npm ci`;
      
      throw new Error(message);
    }
  });
});
