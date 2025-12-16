/**
 * ARCH-FAIL-01: Runtime Navigation Wiring Tests
 * 
 * These tests enforce that ALL user-facing navigation uses relative paths
 * and that NO hard-coded deployment URLs exist in the codebase.
 * 
 * This is a critical architectural requirement to prevent DEPLOYMENT_NOT_FOUND
 * errors in production environments.
 */

import fs from 'fs';
import path from 'path';

describe('ARCH-FAIL-01: Runtime Navigation Wiring', () => {
  const projectRoot = path.join(__dirname, '../..');
  
  /**
   * Test 1: No hard-coded deployment URLs in UI code
   * 
   * Scans all TypeScript/JavaScript UI files to ensure no deployment URLs
   * are hard-coded (e.g., https://something.vercel.app).
   */
  describe('No Hard-Coded Deployment URLs', () => {
    const uiDirectories = [
      'app',
      'components',
      'lib'
    ];
    
    const deploymentUrlPattern = /https?:\/\/[a-zA-Z0-9-]+\.vercel\.app[^\s"')]*|https?:\/\/[a-zA-Z0-9-]+\.netlify\.app[^\s"')]*|https?:\/\/preview-[a-zA-Z0-9-]+\.[^\s"')]+/gi;
    
    uiDirectories.forEach(dir => {
      it(`should not contain hard-coded deployment URLs in ${dir}/`, () => {
        const dirPath = path.join(projectRoot, dir);
        if (!fs.existsSync(dirPath)) {
          return; // Skip if directory doesn't exist
        }
        
        const violations: string[] = [];
        
        function scanDirectory(directory: string) {
          const entries = fs.readdirSync(directory, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            
            if (entry.isDirectory()) {
              // Skip node_modules and .next
              if (entry.name === 'node_modules' || entry.name === '.next') {
                continue;
              }
              scanDirectory(fullPath);
            } else if (entry.isFile()) {
              // Only scan TypeScript and JavaScript files
              if (!/\.(tsx?|jsx?)$/.test(entry.name)) {
                continue;
              }
              
              const content = fs.readFileSync(fullPath, 'utf-8');
              const matches = content.match(deploymentUrlPattern);
              
              if (matches) {
                const relativePath = path.relative(projectRoot, fullPath);
                violations.push(
                  `${relativePath}: Found hard-coded deployment URL(s): ${matches.join(', ')}`
                );
              }
            }
          }
        }
        
        scanDirectory(dirPath);
        
        if (violations.length > 0) {
          throw new Error(
            `Found hard-coded deployment URLs:\n${violations.join('\n')}\n\n` +
            `All navigation MUST use relative paths (e.g., /transfers) or ` +
            `environment-derived base URLs (process.env.NEXT_PUBLIC_BASE_URL).`
          );
        }
      });
    });
  });
  
  /**
   * Test 2: All Link components use relative paths
   * 
   * Validates that Next.js Link components use relative paths starting with /
   * and not absolute URLs (except for external links).
   */
  describe('Link Components Use Relative Paths', () => {
    it('should use relative paths in all Link components', () => {
      const violations: string[] = [];
      
      function scanForLinks(directory: string) {
        const entries = fs.readdirSync(directory, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(directory, entry.name);
          
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.next') {
              continue;
            }
            scanForLinks(fullPath);
          } else if (entry.isFile() && /\.tsx$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            // Match Link components with href attributes
            // Look for suspicious patterns: Link href="http..." or Link href="https..."
            const suspiciousLinkPattern = /<Link[^>]+href=["'](https?:\/\/[^"']+)["']/g;
            let match;
            
            while ((match = suspiciousLinkPattern.exec(content)) !== null) {
              const url = match[1];
              
              // Allow external links to legitimate external services
              // But flag internal deployment URLs
              if (url.includes('.vercel.app') || url.includes('.netlify.app') || url.includes('preview-')) {
                const relativePath = path.relative(projectRoot, fullPath);
                violations.push(
                  `${relativePath}: Link component with hard-coded deployment URL: ${url}`
                );
              }
            }
          }
        }
      }
      
      const appDir = path.join(projectRoot, 'app');
      const componentsDir = path.join(projectRoot, 'components');
      
      if (fs.existsSync(appDir)) scanForLinks(appDir);
      if (fs.existsSync(componentsDir)) scanForLinks(componentsDir);
      
      if (violations.length > 0) {
        throw new Error(
          `Found Link components with hard-coded deployment URLs:\n${violations.join('\n')}\n\n` +
          `Use relative paths like href="/transfers" instead.`
        );
      }
    });
  });
  
  /**
   * Test 3: All router.push() calls use relative paths
   * 
   * Validates that router.push() and router.replace() calls use relative paths.
   */
  describe('Router Navigation Uses Relative Paths', () => {
    it('should use relative paths in all router.push/replace calls', () => {
      const violations: string[] = [];
      
      function scanForRouterCalls(directory: string) {
        const entries = fs.readdirSync(directory, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(directory, entry.name);
          
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.next') {
              continue;
            }
            scanForRouterCalls(fullPath);
          } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            // Match router.push() or router.replace() with absolute URLs
            const routerPushPattern = /router\.(push|replace)\s*\(\s*["'`](https?:\/\/[^"'`]+)["'`]/g;
            let match;
            
            while ((match = routerPushPattern.exec(content)) !== null) {
              const method = match[1];
              const url = match[2];
              
              // Flag internal deployment URLs
              if (url.includes('.vercel.app') || url.includes('.netlify.app') || url.includes('preview-')) {
                const relativePath = path.relative(projectRoot, fullPath);
                violations.push(
                  `${relativePath}: router.${method}() with hard-coded deployment URL: ${url}`
                );
              }
            }
          }
        }
      }
      
      const appDir = path.join(projectRoot, 'app');
      const componentsDir = path.join(projectRoot, 'components');
      
      if (fs.existsSync(appDir)) scanForRouterCalls(appDir);
      if (fs.existsSync(componentsDir)) scanForRouterCalls(componentsDir);
      
      if (violations.length > 0) {
        throw new Error(
          `Found router navigation with hard-coded deployment URLs:\n${violations.join('\n')}\n\n` +
          `Use relative paths like router.push('/transfers') instead.`
        );
      }
    });
  });
  
  /**
   * Test 4: window.location assignments use relative paths
   * 
   * Validates that direct window.location assignments use relative paths.
   */
  describe('Window Location Uses Relative Paths', () => {
    it('should use relative paths in window.location assignments', () => {
      const violations: string[] = [];
      
      function scanForWindowLocation(directory: string) {
        const entries = fs.readdirSync(directory, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(directory, entry.name);
          
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.next') {
              continue;
            }
            scanForWindowLocation(fullPath);
          } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            // Match window.location assignments with absolute URLs
            const windowLocationPattern = /window\.location(?:\.(href|assign|replace))?\s*=\s*["'`](https?:\/\/[^"'`]+)["'`]/g;
            let match;
            
            while ((match = windowLocationPattern.exec(content)) !== null) {
              const url = match[2];
              
              // Flag internal deployment URLs
              if (url.includes('.vercel.app') || url.includes('.netlify.app') || url.includes('preview-')) {
                const relativePath = path.relative(projectRoot, fullPath);
                violations.push(
                  `${relativePath}: window.location assignment with hard-coded deployment URL: ${url}`
                );
              }
            }
          }
        }
      }
      
      const appDir = path.join(projectRoot, 'app');
      const componentsDir = path.join(projectRoot, 'components');
      
      if (fs.existsSync(appDir)) scanForWindowLocation(appDir);
      if (fs.existsSync(componentsDir)) scanForWindowLocation(componentsDir);
      
      if (violations.length > 0) {
        throw new Error(
          `Found window.location assignments with hard-coded deployment URLs:\n${violations.join('\n')}\n\n` +
          `Use relative paths like window.location.href = '/transfers' instead.`
        );
      }
    });
  });
  
  /**
   * Test 5: Environment variable configuration is correct
   * 
   * If base URLs are needed, they should come from environment variables.
   */
  describe('Environment Variable Configuration', () => {
    it('should define NEXTAUTH_URL in .env.example', () => {
      const envExamplePath = path.join(projectRoot, '.env.example');
      
      if (!fs.existsSync(envExamplePath)) {
        throw new Error('.env.example file is missing');
      }
      
      const content = fs.readFileSync(envExamplePath, 'utf-8');
      
      if (!content.includes('NEXTAUTH_URL')) {
        throw new Error(
          '.env.example must define NEXTAUTH_URL for authentication.\n' +
          'This should be set to the actual deployment URL in production, not hard-coded in code.'
        );
      }
    });
    
    it('should not have hard-coded preview URLs in .env.example', () => {
      const envExamplePath = path.join(projectRoot, '.env.example');
      
      if (!fs.existsSync(envExamplePath)) {
        return; // Already tested above
      }
      
      const content = fs.readFileSync(envExamplePath, 'utf-8');
      
      // Check for NEXT_PUBLIC_BASE_URL or similar that might override navigation
      const baseUrlMatch = content.match(/NEXT_PUBLIC_BASE_URL\s*=\s*["']?(https?:\/\/[^"'\s]+)/i);
      
      if (baseUrlMatch) {
        const url = baseUrlMatch[1];
        // This is actually OK if it's documented as deployment-specific
        // Just ensure it's not pointing to a preview deployment
        if (url.includes('preview-') || (url.includes('.vercel.app') && url.includes('-'))) {
          throw new Error(
            `.env.example contains a hard-coded preview deployment URL: ${url}\n` +
            `Use a placeholder like "https://your-domain.com" instead.`
          );
        }
      }
    });
  });
  
  /**
   * Test 6: Validate navigation pattern documentation
   * 
   * Ensure navigation best practices are documented.
   */
  describe('Navigation Pattern Documentation', () => {
    it('should have documented navigation patterns in architecture', () => {
      const architectureDir = path.join(projectRoot, 'architecture');
      
      if (!fs.existsSync(architectureDir)) {
        throw new Error('architecture/ directory is missing');
      }
      
      // Check if navigation patterns are documented
      const architectureFiles = fs.readdirSync(architectureDir);
      const relevantDocs = architectureFiles.filter(file => 
        file.toLowerCase().includes('navigation') || 
        file.toLowerCase().includes('frontend') ||
        file.toLowerCase().includes('component')
      );
      
      if (relevantDocs.length === 0) {
        throw new Error(
          'No navigation documentation found in architecture/.\n' +
          'Consider adding navigation best practices to FRONTEND_COMPONENTS.md or similar.'
        );
      }
    });
  });
});
