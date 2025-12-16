/**
 * Production Readiness Tests
 * 
 * Validates production-ready configuration
 * 
 * @jest-environment node
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Production Readiness', () => {
  it('should have package.json with required scripts', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('start');
    expect(packageJson.scripts).toHaveProperty('test');
  });

  it('should have TypeScript configuration', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig).toHaveProperty('compilerOptions');
  });

  it('should have ESLint configuration', () => {
    const eslintPath = path.join(process.cwd(), 'eslint.config.mjs');
    
    expect(fs.existsSync(eslintPath)).toBe(true);
  });
});
