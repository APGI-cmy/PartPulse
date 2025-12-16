/**
 * Code Documentation Tests
 * 
 * Validates documentation exists and is complete
 * 
 * @jest-environment node
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Code Documentation', () => {
  it('should have README.md', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    
    expect(fs.existsSync(readmePath)).toBe(true);
    
    const content = fs.readFileSync(readmePath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have APP_DESCRIPTION.md', () => {
    const appDescPath = path.join(process.cwd(), 'APP_DESCRIPTION.md');
    
    expect(fs.existsSync(appDescPath)).toBe(true);
    
    const content = fs.readFileSync(appDescPath, 'utf-8');
    expect(content).toContain('PartPulse');
  });

  it('should have architecture documentation', () => {
    const archDir = path.join(process.cwd(), 'architecture');
    
    expect(fs.existsSync(archDir)).toBe(true);
    expect(fs.existsSync(path.join(archDir, 'ARCHITECTURE.md'))).toBe(true);
  });

  it('should have governance documentation', () => {
    const govStatusPath = path.join(process.cwd(), 'GOVERNANCE_STATUS.md');
    
    expect(fs.existsSync(govStatusPath)).toBe(true);
    
    const content = fs.readFileSync(govStatusPath, 'utf-8');
    expect(content).toContain('Governance');
  });
});
