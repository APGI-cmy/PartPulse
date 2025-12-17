#!/usr/bin/env node

/**
 * Vercel Database Deployment Configuration Validator
 * 
 * This script validates that the project is correctly configured for
 * automatic database migration deployment from Vercel.
 * 
 * Run this in CI to catch configuration issues before deployment.
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

const fs = require('fs');
const path = require('path');

let hasErrors = false;
const errors = [];
const warnings = [];
const success = [];

console.log('🔍 Validating Vercel Database Deployment Configuration...\n');

// ============================================================================
// CHECK 1: Migration files exist and are committed
// ============================================================================

console.log('📁 Checking migration files...');

const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');

if (!fs.existsSync(migrationsDir)) {
  errors.push('❌ CRITICAL: prisma/migrations directory does not exist');
  hasErrors = true;
} else {
  success.push('✅ prisma/migrations directory exists');
  
  const entries = fs.readdirSync(migrationsDir);
  const migrationDirs = entries.filter(entry => {
    const fullPath = path.join(migrationsDir, entry);
    return fs.statSync(fullPath).isDirectory();
  });
  
  if (migrationDirs.length === 0) {
    errors.push('❌ CRITICAL: No migration directories found in prisma/migrations');
    hasErrors = true;
  } else {
    success.push(`✅ Found ${migrationDirs.length} migration(s)`);
    
    // Check each migration has migration.sql
    migrationDirs.forEach(dir => {
      const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
      if (!fs.existsSync(sqlFile)) {
        errors.push(`❌ Missing migration.sql in ${dir}`);
        hasErrors = true;
      }
    });
  }
  
  // Check migration_lock.toml
  const lockFile = path.join(migrationsDir, 'migration_lock.toml');
  if (!fs.existsSync(lockFile)) {
    errors.push('❌ CRITICAL: prisma/migrations/migration_lock.toml missing');
    hasErrors = true;
  } else {
    const lockContent = fs.readFileSync(lockFile, 'utf8');
    if (!lockContent.includes('provider = "postgresql"')) {
      errors.push('❌ migration_lock.toml missing postgresql provider');
      hasErrors = true;
    } else {
      success.push('✅ migration_lock.toml has postgresql provider');
    }
  }
}

// ============================================================================
// CHECK 2: Migrations are NOT in .gitignore
// ============================================================================

console.log('\n🚫 Checking .gitignore...');

const gitignorePath = path.join(process.cwd(), '.gitignore');

if (!fs.existsSync(gitignorePath)) {
  warnings.push('⚠️  No .gitignore found');
} else {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const lines = gitignoreContent.split('\n');
  
  const problematicPatterns = [
    'prisma/migrations',
    'prisma/migrations/',
    '/prisma/migrations',
    '/prisma/migrations/',
  ];
  
  const foundPattern = problematicPatterns.find(pattern => 
    lines.some(line => line.trim() === pattern)
  );
  
  if (foundPattern) {
    errors.push(`❌ CRITICAL: .gitignore contains "${foundPattern}" - migrations will not be committed!`);
    hasErrors = true;
  } else {
    success.push('✅ Migrations are NOT gitignored');
  }
}

// ============================================================================
// CHECK 3: Build script includes prisma migrate deploy
// ============================================================================

console.log('\n⚙️  Checking build script...');

const packageJsonPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  errors.push('❌ CRITICAL: package.json not found');
  hasErrors = true;
} else {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const buildScript = packageJson.scripts?.build;
  
  if (!buildScript) {
    errors.push('❌ CRITICAL: No "build" script in package.json');
    hasErrors = true;
  } else {
    // Check for prisma migrate deploy
    if (!buildScript.includes('prisma migrate deploy')) {
      errors.push('❌ CRITICAL: Build script missing "prisma migrate deploy"');
      hasErrors = true;
    } else {
      success.push('✅ Build script includes "prisma migrate deploy"');
    }
    
    // Check order: generate -> migrate -> build
    const generateIndex = buildScript.indexOf('prisma generate');
    const migrateIndex = buildScript.indexOf('prisma migrate deploy');
    const nextBuildIndex = buildScript.indexOf('next build');
    
    if (generateIndex === -1) {
      warnings.push('⚠️  Build script missing "prisma generate"');
    }
    
    if (migrateIndex === -1) {
      // Already reported above
    } else if (nextBuildIndex === -1) {
      warnings.push('⚠️  Build script missing "next build"');
    } else {
      // Check order
      if (generateIndex > migrateIndex) {
        errors.push('❌ "prisma generate" must run BEFORE "prisma migrate deploy"');
        hasErrors = true;
      }
      
      if (migrateIndex > nextBuildIndex) {
        errors.push('❌ "prisma migrate deploy" must run BEFORE "next build"');
        hasErrors = true;
      }
      
      if (generateIndex < migrateIndex && migrateIndex < nextBuildIndex) {
        success.push('✅ Build script commands in correct order');
      }
    }
  }
}

// ============================================================================
// CHECK 4: Schema file exists
// ============================================================================

console.log('\n📋 Checking Prisma schema...');

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

if (!fs.existsSync(schemaPath)) {
  errors.push('❌ CRITICAL: prisma/schema.prisma not found');
  hasErrors = true;
} else {
  success.push('✅ prisma/schema.prisma exists');
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Check for User model (most projects need this)
  if (!schemaContent.includes('model User')) {
    warnings.push('⚠️  No User model found in schema');
  } else {
    success.push('✅ User model found in schema');
  }
  
  // Check for datasource with env variable
  if (!schemaContent.includes('env("DATABASE_URL")')) {
    warnings.push('⚠️  Schema should use env("DATABASE_URL")');
  } else {
    success.push('✅ Schema uses DATABASE_URL environment variable');
  }
}

// ============================================================================
// CHECK 5: Environment variable documentation
// ============================================================================

console.log('\n📄 Checking documentation...');

const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envExamplePath)) {
  warnings.push('⚠️  No .env.example file found');
} else {
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  if (!envExampleContent.includes('DATABASE_URL')) {
    warnings.push('⚠️  .env.example missing DATABASE_URL');
  } else {
    success.push('✅ DATABASE_URL documented in .env.example');
  }
}

// ============================================================================
// CHECK 6: Tests exist for deployment validation
// ============================================================================

console.log('\n🧪 Checking deployment tests...');

const deploymentTestPath = path.join(
  process.cwd(), 
  '__tests__', 
  'deployment', 
  'database-schema-deployment.test.ts'
);

if (!fs.existsSync(deploymentTestPath)) {
  warnings.push('⚠️  No deployment validation tests found');
} else {
  success.push('✅ Deployment validation tests exist');
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(70));

if (success.length > 0) {
  console.log('\n✅ PASSED CHECKS:');
  success.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log('\n❌ FAILED CHECKS:');
  errors.forEach(msg => console.log(`   ${msg}`));
}

console.log('\n' + '='.repeat(70));

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED');
  console.log('\n🚨 CRITICAL: Database migrations will NOT deploy to Vercel!');
  console.log('\nPlease fix the errors above before deploying.');
  console.log('\nSee docs/DATABASE_MIGRATION_DEPLOYMENT.md for details.');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  console.log('\nConfiguration is valid but some improvements recommended.');
  process.exit(0);
} else {
  console.log('\n✅ VALIDATION PASSED');
  console.log('\n🎉 Project is correctly configured for Vercel database deployment!');
  console.log('\nMigrations will be applied automatically during Vercel builds.');
  process.exit(0);
}
