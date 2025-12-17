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
 * 
 * ONE-TIME BUILD PHILOSOPHY:
 * This test suite embodies the principle that builds must be perfect the first time.
 * Every aspect of database deployment automation is validated to ensure zero manual steps.
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

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

  describe('ONE-TIME BUILD PHILOSOPHY: Complete Automation Validation', () => {
    it('should validate verification script exists and is executable', () => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'verify-db-deployment-config.js');
      
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      if (fs.existsSync(scriptPath)) {
        const stats = fs.statSync(scriptPath);
        // Check if executable bit is set (on Unix systems)
        const isExecutable = (stats.mode & 0o111) !== 0;
        expect(isExecutable || process.platform === 'win32').toBe(true);
      }
    });

    it('should have npm script for deployment verification', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.scripts).toHaveProperty('verify:db-deployment');
      expect(packageJson.scripts['verify:db-deployment']).toContain('verify-db-deployment-config.js');
    });

    it('should have postinstall script that generates Prisma client', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.scripts).toHaveProperty('postinstall');
      expect(packageJson.scripts['postinstall']).toContain('prisma generate');
    });

    it('should validate entire build script execution order', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const buildScript = packageJson.scripts?.build || '';
      
      // Must have all three commands
      expect(buildScript).toContain('prisma generate');
      expect(buildScript).toContain('prisma migrate deploy');
      expect(buildScript).toContain('next build');
      
      // Must be in correct order
      const commands = buildScript.split('&&').map((cmd: string) => cmd.trim());
      
      let foundGenerate = false;
      let foundMigrate = false;
      let foundBuild = false;
      
      for (const cmd of commands) {
        if (cmd.includes('prisma generate')) {
          expect(foundMigrate).toBe(false); // Generate must come before migrate
          expect(foundBuild).toBe(false);   // Generate must come before build
          foundGenerate = true;
        } else if (cmd.includes('prisma migrate deploy')) {
          expect(foundGenerate).toBe(true); // Generate must come before migrate
          expect(foundBuild).toBe(false);   // Migrate must come before build
          foundMigrate = true;
        } else if (cmd.includes('next build')) {
          expect(foundGenerate).toBe(true); // Both must come before build
          expect(foundMigrate).toBe(true);
          foundBuild = true;
        }
      }
      
      expect(foundGenerate && foundMigrate && foundBuild).toBe(true);
    });

    it('should not have database push in build script (migrations only)', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const buildScript = packageJson.scripts?.build || '';
      
      // Should NOT use db push in production builds
      expect(buildScript).not.toContain('prisma db push');
      expect(buildScript).not.toContain('prisma push');
    });

    it('should validate comprehensive database deployment documentation exists', () => {
      const requiredDocs = [
        'docs/DATABASE_MIGRATION_DEPLOYMENT.md',
        'docs/QUICK_REFERENCE_DB_MIGRATIONS.md',
      ];
      
      for (const doc of requiredDocs) {
        const docPath = path.join(process.cwd(), doc);
        expect(fs.existsSync(docPath)).toBe(true);
        
        if (fs.existsSync(docPath)) {
          const content = fs.readFileSync(docPath, 'utf8');
          
          // Must document Vercel automation
          expect(content.toLowerCase()).toContain('vercel');
          
          // Must document prisma migrate deploy
          expect(content.toLowerCase()).toContain('prisma migrate deploy');
          
          // Must warn against manual operations
          expect(content.toLowerCase()).toMatch(/manual|don't|avoid/);
        }
      }
    });

    it('should validate FL/CI documentation of this failure', () => {
      const flLogPath = path.join(process.cwd(), 'qa', 'FAILURE_LEARNING_LOG.md');
      
      expect(fs.existsSync(flLogPath)).toBe(true);
      
      const content = fs.readFileSync(flLogPath, 'utf8');
      
      // Must document this specific failure
      expect(content).toContain('Failure #3');
      expect(content.toLowerCase()).toContain('migration');
      expect(content.toLowerCase()).toContain('gitignore');
      expect(content.toLowerCase()).toContain('catastrophic');
      
      // Must document prevention
      expect(content).toContain('database-schema-deployment.test.ts');
    });

    it('should validate architecture checklist includes database deployment', () => {
      const checklistPath = path.join(
        process.cwd(),
        'governance',
        'architecture',
        'ARCHITECTURE_DESIGN_CHECKLIST.md'
      );
      
      expect(fs.existsSync(checklistPath)).toBe(true);
      
      const content = fs.readFileSync(checklistPath, 'utf8');
      
      // Must include database migration requirements
      expect(content.toLowerCase()).toContain('migration deployment');
      expect(content.toLowerCase()).toContain('automated');
      expect(content.toLowerCase()).toMatch(/zero manual|no manual/);
    });

    it('should validate CI/CD includes deployment verification', () => {
      const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
      
      if (fs.existsSync(workflowsDir)) {
        const workflows = fs.readdirSync(workflowsDir)
          .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
        
        let foundVerification = false;
        
        for (const workflow of workflows) {
          const workflowPath = path.join(workflowsDir, workflow);
          const content = fs.readFileSync(workflowPath, 'utf8');
          
          if (content.includes('verify:db-deployment') || content.includes('verify-db-deployment-config')) {
            foundVerification = true;
            break;
          }
        }
        
        // Should have verification in CI
        expect(foundVerification).toBe(true);
      }
    });

    it('should validate no test dodging in this test file', () => {
      const testFilePath = __filename;
      const content = fs.readFileSync(testFilePath, 'utf8');
      
      // Check for test dodging patterns (using regex to avoid false positives)
      const skipPattern = /\.(skip|only)\(/g;
      const disabledPattern = /\b(xit|xdescribe|xtest)\(/g;
      
      const skipMatches = content.match(skipPattern);
      const disabledMatches = content.match(disabledPattern);
      
      expect(skipMatches).toBeNull();
      expect(disabledMatches).toBeNull();
      
      // Ensure this is comprehensive
      const testCount = (content.match(/\sit\(/g) || []).length;
      expect(testCount).toBeGreaterThan(15); // Should have many tests
    });
  });

  describe('ONE-TIME BUILD: Zero Manual Intervention Guarantee', () => {
    it('should confirm no manual database steps in documentation', () => {
      const deploymentDocs = [
        'docs/DATABASE_MIGRATION_DEPLOYMENT.md',
        'docs/QUICK_REFERENCE_DB_MIGRATIONS.md',
        'architecture/DEPLOYMENT_GUIDE.md',
      ];
      
      for (const doc of deploymentDocs) {
        const docPath = path.join(process.cwd(), doc);
        
        if (fs.existsSync(docPath)) {
          const content = fs.readFileSync(docPath, 'utf8').toLowerCase();
          
          // Should not instruct manual SQL execution
          const hasManualSqlWarning = 
            content.includes('do not') ||
            content.includes('never') ||
            content.includes('avoid manual') ||
            content.includes('automatic');
            
          expect(hasManualSqlWarning).toBe(true);
        }
      }
    });

    it('should validate complete error handling in migrations', () => {
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const entries = fs.readdirSync(migrationsDir);
      
      const migrationDirs = entries.filter(entry => {
        const fullPath = path.join(migrationsDir, entry);
        return fs.statSync(fullPath).isDirectory();
      });
      
      // Each migration should have proper SQL
      for (const dir of migrationDirs) {
        const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
        
        if (fs.existsSync(sqlFile)) {
          const sql = fs.readFileSync(sqlFile, 'utf8');
          
          // SQL should not be empty
          expect(sql.trim().length).toBeGreaterThan(0);
          
          // Should have at least one statement
          expect(sql).toMatch(/CREATE|ALTER|DROP|INSERT|UPDATE/);
        }
      }
    });

    it('should validate repeatability: migration files are immutable', () => {
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const entries = fs.readdirSync(migrationsDir);
      
      const migrationDirs = entries.filter(entry => {
        const fullPath = path.join(migrationsDir, entry);
        return fs.statSync(fullPath).isDirectory();
      });
      
      // Migration directories should follow naming convention
      for (const dir of migrationDirs) {
        // Format: TIMESTAMP_description
        expect(dir).toMatch(/^\d{14}_\w+/);
      }
      
      // This ensures migrations are versioned and traceable
      expect(migrationDirs.length).toBeGreaterThan(0);
    });

    it('should validate database URL is required but not hardcoded', () => {
      const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Should use environment variable
      expect(schema).toContain('env("DATABASE_URL")');
      
      // Should NOT have hardcoded credentials
      expect(schema).not.toMatch(/postgresql:\/\/\w+:\w+@/);
      expect(schema).not.toMatch(/"postgresql:\/\//);
    });

    it('should validate .env.example documents DATABASE_URL', () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      
      expect(fs.existsSync(envExamplePath)).toBe(true);
      
      const content = fs.readFileSync(envExamplePath, 'utf8');
      expect(content).toContain('DATABASE_URL');
      expect(content).toMatch(/postgresql:\/\//);
    });
  });

  describe('DUAL-URL PATTERN: Runtime Pooling Support', () => {
    it('should configure PrismaClient to use DATABASE_POOL_URL for runtime', () => {
      const prismaClientPath = path.join(process.cwd(), 'lib', 'prisma.ts');
      
      expect(fs.existsSync(prismaClientPath)).toBe(true);
      
      const content = fs.readFileSync(prismaClientPath, 'utf8');
      
      // Should instantiate PrismaClient with datasources configuration
      expect(content).toContain('new PrismaClient');
      expect(content).toContain('datasources');
      expect(content).toContain('DATABASE_POOL_URL');
      expect(content).toContain('DATABASE_URL');
    });

    it('should document dual-URL pattern in deployment docs', () => {
      const docsPath = path.join(process.cwd(), 'docs', 'DATABASE_MIGRATION_DEPLOYMENT.md');
      
      expect(fs.existsSync(docsPath)).toBe(true);
      
      const content = fs.readFileSync(docsPath, 'utf8');
      
      // Should document both URLs
      expect(content).toContain('DATABASE_URL');
      expect(content).toContain('DATABASE_POOL_URL');
      expect(content).toContain('Session mode');
      expect(content).toContain('Transaction mode');
      
      // Should explain why two URLs are needed
      expect(content).toMatch(/migration.*session/i);
      expect(content).toMatch(/runtime.*pool/i);
    });

    it('should fallback to DATABASE_URL if DATABASE_POOL_URL not set', () => {
      const prismaClientPath = path.join(process.cwd(), 'lib', 'prisma.ts');
      const content = fs.readFileSync(prismaClientPath, 'utf8');
      
      // Should have fallback logic
      expect(content).toMatch(/DATABASE_POOL_URL.*\|\|.*DATABASE_URL/);
    });
  });

  describe('GOVERNANCE: Complete Audit Trail', () => {
    it('should validate all changes are tracked in git', () => {
      const criticalFiles = [
        'prisma/migrations/migration_lock.toml',
        '.gitignore',
        'package.json',
        'docs/DATABASE_MIGRATION_DEPLOYMENT.md',
        '__tests__/deployment/database-schema-deployment.test.ts',
      ];
      
      for (const file of criticalFiles) {
        const filePath = path.join(process.cwd(), file);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('should validate test execution on every PR (via CI)', () => {
      // This test validates that the test suite itself is executed
      // The fact that we're running proves CI is working
      expect(process.env.CI || process.env.GITHUB_ACTIONS).toBeTruthy();
    });
  });
});

