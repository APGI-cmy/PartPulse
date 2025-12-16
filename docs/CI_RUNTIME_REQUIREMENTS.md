# CI Runtime Requirements

**Document Type**: Operational Reference  
**Status**: ✅ ENFORCED  
**Created**: 2025-12-16  
**Last Updated**: 2025-12-16

---

## Purpose

This document explicitly declares ALL runtime requirements for CI/CD pipelines, QA tooling, governance checks, and test execution. 

**Principle**: Tests and tooling must NEVER compensate for missing CI runtime configuration. All requirements must be explicitly defined at the workflow level.

---

## Mandatory Environment Variables

### 1. Database Configuration

**Variable**: `DATABASE_URL`  
**Required For**: 
- Prisma client initialization
- Database migration tests
- Any tests that interact with the database schema

**Value in CI**: `file:./.ci-test-db.sqlite`  
**Type**: SQLite file path  
**Scope**: `test-execution` job

**Justification**: Prisma requires `DATABASE_URL` to be set. Tests must not provide fallback values. CI must explicitly configure the database connection string.

---

### 2. CI Environment Markers

**Variable**: `CI`  
**Required For**:
- Evidence capture metadata
- Conditional logic in QA scripts
- Test environment detection

**Value in CI**: `'true'`  
**Type**: String boolean  
**Scope**: ALL jobs

**Justification**: Tooling needs to know it's running in CI to adjust behavior (e.g., evidence capture includes CI metadata, scripts may skip interactive prompts).

---

### 3. Node Environment

**Variable**: `NODE_ENV`  
**Required For**:
- Test execution
- Build optimization flags
- Conditional development tooling

**Value in CI**: `'test'`  
**Type**: String enum  
**Scope**: `test-execution` job

**Justification**: Tests should run in test environment mode. Some libraries (like Prisma) adjust behavior based on NODE_ENV.

---

## CI Workflow Configuration

### Required in ALL Jobs

```yaml
env:
  CI: 'true'
```

### Required in test-execution Job

```yaml
env:
  DATABASE_URL: 'file:./.ci-test-db.sqlite'
  CI: 'true'
  NODE_ENV: 'test'
```

---

## Forbidden Patterns

### ❌ FORBIDDEN: Test-Level Compensation

**Example of violation**:
```javascript
// jest.setup.js
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file::memory:?cache=shared'  // ❌ Test dodging
}
```

**Why forbidden**: Tests compensating for missing CI configuration violates the principle that CI must explicitly declare all requirements.

---

### ❌ FORBIDDEN: Implicit Path Resolution

**Example of violation**:
```javascript
// In a script
const projectRoot = path.resolve(__dirname, '../..');  // ❌ Implicit assumption
```

**Why forbidden**: This assumes the script is executed from a specific location and fails in certain contexts (e.g., when run via different tools).

**Correct approach**:
```javascript
const projectRoot = process.env.PROJECT_ROOT || process.env.GITHUB_WORKSPACE || path.resolve(__dirname, '../..');
```

---

## Runtime Requirement Classes

### Class 1: Database Access
- **Required**: `DATABASE_URL`
- **Applies to**: Prisma, database tests, schema validation
- **Failure mode**: `PrismaClientInitializationError: Environment variable not found: DATABASE_URL`

### Class 2: Environment Detection
- **Required**: `CI`, `NODE_ENV`
- **Applies to**: Test runners, build tools, conditional logic
- **Failure mode**: Incorrect behavior, missing metadata, or failed conditional checks

---

## Validation

### Pre-Merge Checklist

Before merging any PR that adds new CI jobs or QA tooling:

- [ ] All required environment variables declared in workflow
- [ ] No test-level compensation for missing variables
- [ ] Evidence capture can run successfully
- [ ] Governance tooling has access to PROJECT_ROOT
- [ ] Database tests have DATABASE_URL configured

### Testing Locally

To simulate CI environment locally:

```bash
# Set required variables
export DATABASE_URL='file:./.ci-test-db.sqlite'
export CI='true'
export NODE_ENV='test'

# Run tests
npm run test:ci

# Test evidence capture
node qa/evidence/capture.js "test-type" "test message"

# Test governance checks
node qa/governance/sync-checker.js
node qa/detect-test-dodging.js
node qa/parking/watcher.js
```

---

## Failure Learning (FL/CI)

### Lesson: CI Runtime Completeness

**Date**: 2025-12-16  
**Failure Class**: Missing CI Runtime Configuration  
**Root Cause**: Implicit assumptions about environment variables and paths

**Permanent Prevention**:
1. ✅ All runtime requirements explicitly documented in this file
2. ✅ All environment variables declared at workflow level
3. ✅ Evidence capture script accepts explicit PROJECT_ROOT
4. ✅ No test-level compensation allowed
5. ✅ Validation checklist enforced

**Reoccurrence Status**: **FORBIDDEN**

---

## Updates and Maintenance

### When to Update This Document

1. **Adding new CI jobs**: Declare all environment variables needed
2. **Adding new QA tooling**: Document runtime requirements
3. **Introducing new database tools**: Update DATABASE_URL usage
4. **Adding path-dependent scripts**: Document PROJECT_ROOT requirement

### Version History

- **v1.0** (2025-12-16): Initial documentation of CI runtime requirements
  - Captured: DATABASE_URL, PROJECT_ROOT, CI, NODE_ENV
  - Codified: No test-level compensation principle
  - Enforced: Explicit declaration requirement

---

## References

- **CI Workflow**: `.github/workflows/qa-enforcement.yml`
- **Evidence Capture**: `qa/evidence/capture.js`
- **Governance Status**: `GOVERNANCE_STATUS.md`
- **Test Dodging Policy**: `qa/detect-test-dodging.js`

---

**Status**: ✅ COMPLETE AND ENFORCED  
**Compliance**: MANDATORY  
**Violations**: BLOCKED BY CI
