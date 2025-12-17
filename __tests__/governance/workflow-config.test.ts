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
import { glob } from 'glob';

describe('Workflow DATABASE_URL Configuration', () => {
  // FL/CI: Test added after incomplete fix in commit d4abe6f missed qa-enforcement-v1-frozen.yml
  // This test ensures ALL workflow files are checked for DATABASE_URL consistency
  it('should have DATABASE_URL matching Prisma provider in ALL workflow files', async () => {
    // Read Prisma schema to get required provider
    const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const providerMatch = schemaContent.match(/provider\s*=\s*"(\w+)"/);
    
    expect(providerMatch).not.toBeNull();
    const provider = providerMatch![1];
    
    // Find all workflow files
    const workflowPattern = path.join(process.cwd(), '.github/workflows/*.yml');
    const workflowFiles = await glob(workflowPattern);
    
    expect(workflowFiles.length).toBeGreaterThan(0);
    
    const violations: string[] = [];
    
    // Check each workflow file
    for (const workflowFile of workflowFiles) {
      const content = fs.readFileSync(workflowFile, 'utf-8');
      
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
  it('should have DATABASE_URL set in all jobs that run npm ci', async () => {
    const workflowPattern = path.join(process.cwd(), '.github/workflows/*.yml');
    const workflowFiles = await glob(workflowPattern);
    
    const violations: string[] = [];
    
    for (const workflowFile of workflowFiles) {
      const content = fs.readFileSync(workflowFile, 'utf-8');
      const fileName = path.basename(workflowFile);
      
      // Skip empty or template files
      if (content.trim().length < 10) continue;
      
      // Find all jobs
      const jobMatches = content.matchAll(/^\s{2}[\w-]+:\s*$/gm);
      
      for (const jobMatch of jobMatches) {
        const jobStartIndex = jobMatch.index!;
        const jobName = jobMatch[0].trim().replace(':', '');
        
        // Find the next job or end of file
        const remainingContent = content.substring(jobStartIndex);
        const nextJobMatch = remainingContent.substring(1).match(/^\s{2}[\w-]+:\s*$/m);
        const jobEndIndex = nextJobMatch 
          ? jobStartIndex + nextJobMatch.index! + 1
          : content.length;
        
        const jobContent = content.substring(jobStartIndex, jobEndIndex);
        
        // Check if this job runs npm ci
        if (/npm\s+ci/m.test(jobContent)) {
          // Check if DATABASE_URL is set in this job's context
          // (either in env section or in the step that runs npm ci)
          const hasDbUrl = /DATABASE_URL:/m.test(jobContent);
          
          if (!hasDbUrl) {
            const lineNumber = content.substring(0, jobStartIndex).split('\n').length;
            violations.push(
              `${fileName}:${lineNumber} - Job "${jobName}" runs npm ci but DATABASE_URL is not set`
            );
          }
        }
      }
    }
    
    if (violations.length > 0) {
      const message = `Jobs running npm ci without DATABASE_URL:\n` +
        violations.map(v => `  - ${v}`).join('\n') +
        `\n\nPrisma postinstall hook requires DATABASE_URL to be set during npm ci`;
      
      throw new Error(message);
    }
  });
});
