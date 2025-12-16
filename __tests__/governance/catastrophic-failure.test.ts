/**
 * Catastrophic Failure Tracking Tests
 * 
 * Validates evidence capture and governance sync
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Catastrophic Failure Tracking', () => {
  it('should have evidence directory structure', () => {
    const evidenceDir = path.join(process.cwd(), 'qa/evidence');
    
    expect(fs.existsSync(evidenceDir)).toBe(true);
    expect(fs.existsSync(path.join(evidenceDir, 'README.md'))).toBe(true);
    expect(fs.existsSync(path.join(evidenceDir, 'capture.js'))).toBe(true);
  });

  it('should run governance sync checker successfully', () => {
    expect(() => {
      execSync('node qa/governance/sync-checker.js', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    }).not.toThrow();
  });

  it('should have policy version documented', () => {
    const policyPath = path.join(process.cwd(), 'docs/governance/POLICY_VERSION.md');
    
    expect(fs.existsSync(policyPath)).toBe(true);
    
    const content = fs.readFileSync(policyPath, 'utf-8');
    expect(content).toContain('Version');
  });
});
