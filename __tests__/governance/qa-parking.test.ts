/**
 * QA Parking Tests
 * 
 * Validates QA parking registry and watcher
 * 
 * @jest-environment node
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('QA Parking', () => {
  it('should have valid parking registry schema', () => {
    const registryPath = path.join(process.cwd(), 'qa/parking/registry.json');
    
    expect(fs.existsSync(registryPath)).toBe(true);
    
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    
    // Registry should be an object with parkedItems array
    expect(registry).toHaveProperty('parkedItems');
    expect(Array.isArray(registry.parkedItems)).toBe(true);
  });

  it('should run parking watcher successfully', () => {
    expect(() => {
      execSync('node qa/parking/watcher.js', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    }).not.toThrow();
  });

  it('should not have expired parking entries', () => {
    const registryPath = path.join(process.cwd(), 'qa/parking/registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    
    const now = new Date();
    const expired = registry.parkedItems.filter((entry: any) => {
      if (entry.expiryDate) {
        return new Date(entry.expiryDate) < now;
      }
      return false;
    });

    expect(expired).toEqual([]);
  });
});
