/**
 * CATASTROPHIC FAILURE TEST - Database Schema Deployment
 * 
 * FL/CI Entry: Failure #3 - Prisma Migrations Not Deployed to Production
 * 
 * This test ensures that the critical database deployment infrastructure
 * is in place and will prevent future deployment failures.
 * 
 * Failure Mode: Production database has no tables despite schema existing
 * Root Cause: Migrations directory was gitignored AND build script didn't run migrations
 * Impact: Complete production failure - no authentication, no data storage possible
 * Prevention: This test validates the entire migration deployment pipeline
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('CATASTROPHIC FAILURE PREVENTION: Database Schema Deployment', () => {
  
  describe('Migration Files Exist and Are Tracked', () => {
    it('should have a migrations directory', () => {
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const exists = fs.existsSync(migrationsDir);
      
      expect(exists).toBe(true);
      if (!exists) {
        throw new Error('CRITICAL: prisma/migrations directory does not exist. Database schema cannot be deployed.');
      }
    });

    it('should have at least one migration', () => {
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const entries = fs.readdirSync(migrationsDir);
      
      // Filter out migration_lock.toml
      const migrationDirs = entries.filter(entry => {
        const fullPath = path.join(migrationsDir, entry);
        return fs.statSync(fullPath).isDirectory();
      });
      
      expect(migrationDirs.length).toBeGreaterThan(0);
      if (migrationDirs.length === 0) {
        throw new Error('CRITICAL: No migration directories found. Database schema cannot be deployed.');
      }
    });

    it('should have migration_lock.toml with postgresql provider', () => {
      const lockFile = path.join(process.cwd(), 'prisma', 'migrations', 'migration_lock.toml');
      const exists = fs.existsSync(lockFile);
      
      expect(exists).toBe(true);
      
      if (exists) {
        const content = fs.readFileSync(lockFile, 'utf8');
        expect(content).toContain('provider = "postgresql"');
      }
    });

    it('should NOT have migrations directory in .gitignore', () => {
      const gitignorePath = path.join(process.cwd(), '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf8');
      const lines = content.split('\n');
      
      // Check for various patterns that would ignore migrations
      const problematicPatterns = [
        'prisma/migrations',
        'prisma/migrations/',
        '/prisma/migrations',
        '/prisma/migrations/',
      ];
      
      const foundPattern = problematicPatterns.find(pattern => 
        lines.some(line => line.trim() === pattern)
      );
      
      expect(foundPattern).toBeUndefined();
      if (foundPattern) {
        throw new Error(
          `CRITICAL: .gitignore contains "${foundPattern}" which prevents migration files from being committed. ` +
          'This will cause production deployment failures. Remove this line from .gitignore immediately.'
        );
      }
    });
  });

  describe('Build Script Deploys Migrations', () => {
    it('should include "prisma migrate deploy" in build script', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const buildScript = packageJson.scripts?.build;
      
      expect(buildScript).toBeDefined();
      expect(buildScript).toContain('prisma migrate deploy');
      
      if (!buildScript || !buildScript.includes('prisma migrate deploy')) {
        throw new Error(
          'CRITICAL: Build script does not include "prisma migrate deploy". ' +
          'Migrations will not be applied to production database during deployment. ' +
          'Expected: "prisma generate && prisma migrate deploy && next build"'
        );
      }
    });

    it('should run migrations BEFORE building Next.js', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const buildScript = packageJson.scripts?.build || '';
      
      const migrateIndex = buildScript.indexOf('prisma migrate deploy');
      const nextBuildIndex = buildScript.indexOf('next build');
      
      expect(migrateIndex).toBeGreaterThan(-1);
      expect(nextBuildIndex).toBeGreaterThan(-1);
      expect(migrateIndex).toBeLessThan(nextBuildIndex);
      
      if (migrateIndex >= nextBuildIndex) {
        throw new Error(
          'CRITICAL: "prisma migrate deploy" must run BEFORE "next build" in build script. ' +
          'Otherwise, the application may try to use database tables that don\'t exist yet.'
        );
      }
    });

    it('should generate Prisma client before migrations', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const buildScript = packageJson.scripts?.build || '';
      
      const generateIndex = buildScript.indexOf('prisma generate');
      const migrateIndex = buildScript.indexOf('prisma migrate deploy');
      
      expect(generateIndex).toBeGreaterThan(-1);
      expect(migrateIndex).toBeGreaterThan(-1);
      expect(generateIndex).toBeLessThan(migrateIndex);
    });
  });

  describe('Migration SQL Validates Schema', () => {
    it('should have migration SQL that creates User table', () => {
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const entries = fs.readdirSync(migrationsDir);
      
      const migrationDirs = entries.filter(entry => {
        const fullPath = path.join(migrationsDir, entry);
        return fs.statSync(fullPath).isDirectory();
      });
      
      // Find any migration.sql file
      let foundUserTable = false;
      
      for (const dir of migrationDirs) {
        const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
        if (fs.existsSync(sqlFile)) {
          const sql = fs.readFileSync(sqlFile, 'utf8');
          if (sql.includes('CREATE TABLE "User"') || sql.includes('CREATE TABLE User')) {
            foundUserTable = true;
            break;
          }
        }
      }
      
      expect(foundUserTable).toBe(true);
      if (!foundUserTable) {
        throw new Error(
          'CRITICAL: No migration creates the User table. ' +
          'User authentication will fail in production. ' +
          'Verify migrations are correctly generated from schema.prisma.'
        );
      }
    });

    it('should have migration SQL that creates required auth tables', () => {
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const entries = fs.readdirSync(migrationsDir);
      
      const migrationDirs = entries.filter(entry => {
        const fullPath = path.join(migrationsDir, entry);
        return fs.statSync(fullPath).isDirectory();
      });
      
      const requiredTables = ['User', 'Account', 'Session'];
      const foundTables = new Set<string>();
      
      for (const dir of migrationDirs) {
        const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
        if (fs.existsSync(sqlFile)) {
          const sql = fs.readFileSync(sqlFile, 'utf8');
          
          for (const table of requiredTables) {
            if (sql.includes(`CREATE TABLE "${table}"`) || sql.includes(`CREATE TABLE ${table}`)) {
              foundTables.add(table);
            }
          }
        }
      }
      
      for (const table of requiredTables) {
        expect(foundTables.has(table)).toBe(true);
        if (!foundTables.has(table)) {
          throw new Error(
            `CRITICAL: No migration creates the ${table} table. ` +
            'Authentication system requires this table. ' +
            'User registration and login will fail.'
          );
        }
      }
    });
  });

  describe('Schema and Migration Consistency', () => {
    it('should have schema.prisma with User model', () => {
      const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      expect(schema).toContain('model User');
      
      // Verify critical fields for authentication
      expect(schema).toContain('email');
      expect(schema).toContain('password');
      expect(schema).toContain('role');
    });

    it('should have User model with unique email constraint', () => {
      const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Check for email uniqueness
      const hasUniqueEmail = 
        schema.includes('email') && 
        (schema.includes('@unique') || schema.includes('@@unique'));
      
      expect(hasUniqueEmail).toBe(true);
      if (!hasUniqueEmail) {
        throw new Error(
          'CRITICAL: User.email field must have @unique constraint. ' +
          'Without this, duplicate user registrations are possible, causing security issues.'
        );
      }
    });
  });

  describe('End-to-End Registration Workflow Validation', () => {
    it('should verify registration API endpoint exists', () => {
      const createFirstAdminPath = path.join(
        process.cwd(), 
        'app', 
        'api', 
        'auth', 
        'create-first-admin',
        'route.ts'
      );
      
      const exists = fs.existsSync(createFirstAdminPath);
      expect(exists).toBe(true);
      
      if (exists) {
        const content = fs.readFileSync(createFirstAdminPath, 'utf8');
        
        // Verify it uses Prisma
        expect(content).toContain('prisma.user.create');
        
        // Verify it hashes passwords
        expect(content).toContain('bcrypt');
        
        // Verify it validates input
        expect(content).toContain('sanitize');
      }
    });

    it('should verify complete registration flow components exist', () => {
      const criticalPaths = [
        // Frontend
        'app/auth/first-admin/page.tsx',
        
        // API endpoints
        'app/api/auth/create-first-admin/route.ts',
        'app/api/auth/can-create-first-admin/route.ts',
        
        // Database schema
        'prisma/schema.prisma',
        
        // Auth configuration
        'app/api/auth/[...nextauth]/route.ts',
      ];
      
      const missingPaths: string[] = [];
      
      for (const relativePath of criticalPaths) {
        const fullPath = path.join(process.cwd(), relativePath);
        if (!fs.existsSync(fullPath)) {
          missingPaths.push(relativePath);
        }
      }
      
      expect(missingPaths.length).toBe(0);
      if (missingPaths.length > 0) {
        throw new Error(
          'CRITICAL: Missing required files for user registration workflow:\n' +
          missingPaths.map(p => `  - ${p}`).join('\n') +
          '\n\nUser registration cannot function without these components.'
        );
      }
    });
  });

  describe('Documentation and Governance', () => {
    it('should document database deployment in README or docs', () => {
      // Check for deployment documentation
      const docsToCheck = [
        'README.md',
        'VERCEL_DEPLOYMENT_FIX.md',
        'docs/deployment.md',
      ];
      
      let foundDocumentation = false;
      
      for (const doc of docsToCheck) {
        const docPath = path.join(process.cwd(), doc);
        if (fs.existsSync(docPath)) {
          const content = fs.readFileSync(docPath, 'utf8');
          if (content.includes('prisma migrate') || content.includes('database migration')) {
            foundDocumentation = true;
            break;
          }
        }
      }
      
      expect(foundDocumentation).toBe(true);
    });
  });
});
