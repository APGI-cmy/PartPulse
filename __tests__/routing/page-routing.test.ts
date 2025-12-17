/**
 * Page Routing Tests
 * 
 * These tests verify that all application pages are properly wired and accessible.
 * They ensure that navigation from the sidebar and main pages does not result in 404 errors.
 * 
 * This prevents the issue described in GitHub Issue #79 where pages rendered 404
 * due to missing authentication/database setup.
 */

import { routes, navItems } from '@/lib/routes';
import fs from 'fs';
import path from 'path';

describe('Page Routing - Route Configuration', () => {
  /**
   * Test 1: Verify all routes are defined
   * 
   * Ensures that the centralized routes configuration exists and contains
   * all expected routes.
   */
  it('should have all required routes defined in centralized config', () => {
    expect(routes).toBeDefined();
    
    // Main application routes
    expect(routes.dashboard).toBe('/');
    expect(routes.internalTransfer).toBe('/internal-transfer');
    expect(routes.warrantyClaims).toBe('/warranty-claims');
    expect(routes.reports).toBe('/reports');
    expect(routes.settings).toBe('/settings');
    expect(routes.settingsAdmin).toBe('/settings/admin');
    expect(routes.userInvite).toBe('/users/invite');
    
    // Auth routes
    expect(routes.signIn).toBe('/auth/signin');
  });
  
  /**
   * Test 2: Verify navigation items match routes
   * 
   * Ensures that all navigation items in the sidebar have corresponding
   * route definitions.
   */
  it('should have navigation items that match defined routes', () => {
    expect(navItems).toBeDefined();
    expect(Array.isArray(navItems)).toBe(true);
    expect(navItems.length).toBeGreaterThan(0);
    
    // Verify each nav item has required properties
    navItems.forEach(item => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('href');
      expect(item).toHaveProperty('icon');
      expect(typeof item.name).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(item.href).toMatch(/^\//); // Must start with /
    });
  });
  
  /**
   * Test 3: Verify dynamic route generators
   * 
   * Ensures that dynamic route helper functions work correctly.
   */
  it('should generate dynamic routes correctly', () => {
    expect(routes.warrantyClaimDetail('123')).toBe('/warranty-claims/123');
    expect(routes.warrantyClaimDetail(456)).toBe('/warranty-claims/456');
    
    expect(routes.warrantyClaimAdmin('abc')).toBe('/warranty-claims/abc/admin');
    expect(routes.warrantyClaimAdmin(789)).toBe('/warranty-claims/789/admin');
  });
  
  /**
   * Test 4: Verify no hard-coded paths in navigation
   * 
   * Ensures all navigation uses the centralized routes configuration
   * and doesn't use hard-coded strings.
   */
  it('should use centralized routes for navigation items', () => {
    const validRoutes = Object.values(routes).filter(r => typeof r === 'string');
    
    navItems.forEach(item => {
      // Check if the href matches any defined route
      const isValidRoute = validRoutes.includes(item.href);
      
      if (!isValidRoute) {
        fail(`Navigation item "${item.name}" has href "${item.href}" which is not in centralized routes config`);
      }
    });
  });
  
  /**
   * Test 5: Verify routes don't have trailing slashes
   * 
   * Ensures consistent route formatting without trailing slashes.
   */
  it('should not have trailing slashes in routes', () => {
    Object.entries(routes).forEach(([_key, value]) => {
      if (typeof value === 'string' && value !== '/') {
        expect(value).not.toMatch(/\/$/);
      }
    });
  });
});

describe('Page Routing - File System Routes', () => {
  const projectRoot = path.join(__dirname, '../..');
  
  /**
   * Test 6: Verify all route files exist
   * 
   * Checks that each defined route has a corresponding page.tsx file
   * in the app directory structure.
   */
  it('should have page files for all static routes', () => {
    const staticRoutes = [
      { file: 'app/page.tsx' },
      { file: 'app/internal-transfer/page.tsx' },
      { file: 'app/warranty-claims/page.tsx' },
      { file: 'app/reports/page.tsx' },
      { file: 'app/settings/page.tsx' },
      { file: 'app/settings/admin/page.tsx' },
      { file: 'app/users/invite/page.tsx' },
      { file: 'app/auth/signin/page.tsx' },
    ];
    
    staticRoutes.forEach(({ file }) => {
      const filePath = path.join(projectRoot, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
  
  /**
   * Test 7: Verify dynamic route files exist
   * 
   * Checks that dynamic route handlers exist.
   */
  it('should have page files for all dynamic routes', () => {
    const dynamicRoutes = [
      { file: 'app/warranty-claims/[id]/page.tsx' },
      { file: 'app/warranty-claims/[id]/admin/page.tsx' },
      { file: 'app/internal-transfer/[id]/page.tsx' },
    ];
    
    dynamicRoutes.forEach(({ file }) => {
      const filePath = path.join(projectRoot, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
  
  /**
   * Test 8: Verify success/confirmation pages exist
   * 
   * Ensures that success pages are implemented.
   */
  it('should have success/confirmation pages', () => {
    const successPages = [
      { file: 'app/internal-transfer/success/page.tsx' },
    ];
    
    successPages.forEach(({ file }) => {
      const filePath = path.join(projectRoot, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

describe('Page Routing - Middleware Protection', () => {
  const projectRoot = path.join(__dirname, '../..');
  
  /**
   * Test 9: Verify protected routes are configured in middleware
   * 
   * Ensures that authentication middleware is properly configured
   * to protect sensitive routes.
   */
  it('should have middleware configuration for protected routes', () => {
    const middlewarePath = path.join(projectRoot, 'middleware.ts');
    expect(fs.existsSync(middlewarePath)).toBe(true);
    
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
    
    // Check that middleware exports a config with matchers
    expect(middlewareContent).toContain('export const config');
    expect(middlewareContent).toContain('matcher');
    
    // Check that key routes are protected
    expect(middlewareContent).toContain('/internal-transfer');
    expect(middlewareContent).toContain('/warranty-claims');
    expect(middlewareContent).toContain('/reports');
    expect(middlewareContent).toContain('/settings');
  });
});

describe('Page Routing - Component Integration', () => {
  const projectRoot = path.join(__dirname, '../..');
  
  /**
   * Test 10: Verify sidebar component exists and uses routes
   * 
   * Ensures the sidebar component is properly implemented.
   */
  it('should have a sidebar component that uses centralized routes', () => {
    const sidebarPath = path.join(projectRoot, 'components/ui/sidebar.tsx');
    expect(fs.existsSync(sidebarPath)).toBe(true);
    
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
    
    // Check that sidebar imports navItems from routes
    expect(sidebarContent).toContain('import');
    expect(sidebarContent).toContain('navItems');
    expect(sidebarContent).toContain('@/lib/routes');
  });
  
  /**
   * Test 11: Verify Link components are used correctly
   * 
   * Ensures Next.js Link components are used for navigation.
   */
  it('should use Next.js Link components in sidebar', () => {
    const sidebarPath = path.join(projectRoot, 'components/ui/sidebar.tsx');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
    
    // Check for Link import and usage
    expect(sidebarContent).toContain('import Link from "next/link"');
    expect(sidebarContent).toContain('<Link');
    expect(sidebarContent).toContain('href=');
  });
});

describe('Page Routing - Documentation', () => {
  const projectRoot = path.join(__dirname, '../..');
  
  /**
   * Test 12: Verify routes are documented
   * 
   * Ensures that the routes configuration file has proper documentation.
   */
  it('should have documentation for route configuration', () => {
    const routesPath = path.join(projectRoot, 'lib/routes.ts');
    const routesContent = fs.readFileSync(routesPath, 'utf-8');
    
    // Check for JSDoc comments or explanatory comments
    expect(routesContent).toMatch(/\/\*\*|\*|\/\//); // Has comments
    
    // Check for key documentation phrases
    expect(routesContent.toLowerCase()).toMatch(/route|navigation|path/);
  });
});
