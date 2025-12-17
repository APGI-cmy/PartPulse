# Failure Learning Log (FL/CI)

## Purpose

This log implements the **Failure Learning / Continuous Improvement (FL/CI) Policy**. Every failure is an opportunity to:
1. **Register** the failure - Document what went wrong and why
2. **Incorporate** into QA suite - Add tests to prevent it forever
3. **Prevent** permanently - Implement safeguards

This makes our QA suite progressively better, eliminating entire classes of errors over time.

---

## Failure #2: Vercel Deployment 404 - DEPLOYMENT_NOT_FOUND Error

**Date**: 2025-12-17  
**Issue**: App deploying to 404 page
**PR**: #88 (copilot/fix-signup-page-404-error)  
**Symptom**: After successful merge and deployment, accessing `https://partpulse.vercel.app/auth/signin` showed:
```
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
ID: cpt1::dnb86-1765950603785-464a17bf92bf
```

### What Went Wrong

**Root Cause**: Missing `output: 'standalone'` configuration in `next.config.ts`

**Technical Details**:
- Next.js 16.x requires explicit output mode configuration for Vercel serverless deployments
- Without `output: 'standalone'`, Next.js doesn't create the `.next/standalone` directory
- Vercel cannot locate the deployment entry point (server.js) without this structure
- The build succeeds locally and in CI, but Vercel returns DEPLOYMENT_NOT_FOUND when accessed

**Impact**:
- Complete production outage - app inaccessible
- Users see Vercel error page instead of application
- All functionality blocked despite successful build and deployment
- Critical severity - blocks all business value

### Why It Happened

1. **Next.js 16 Breaking Change**: Prior versions auto-detected Vercel deployment mode; v16+ requires explicit configuration
2. **Silent Failure**: Build succeeds without the config - error only appears at runtime on Vercel
3. **No Validation**: No test checked for required deployment configuration
4. **Documentation Gap**: Deployment docs existed but didn't mandate this setting
5. **Knowledge Gap**: Common deployment pattern not captured in QA suite

### How We Fixed It

1. **Immediate Fix**:
   - Added `output: 'standalone'` to `next.config.ts`
   - Verified `.next/standalone` directory is created during build
   - Confirmed structure includes `server.js`, `package.json`, and required dependencies

2. **FL/CI Implementation**:
   - ✅ **Registered**: This entry documents the failure
   - ✅ **Incorporated**: Added tests in `__tests__/deployment/build.test.ts`:
     - Test validates `output: 'standalone'` exists in next.config.ts
     - Test validates `.next/standalone` directory is created
     - Test validates standalone structure has required files (server.js, package.json)
   - ✅ **Prevented**: Tests will fail immediately if output config is removed or misconfigured

3. **Documentation Updated**:
   - Created `DEPLOYMENT_FIX_404.md` - detailed root cause analysis
   - Updated `VERCEL_DEPLOYMENT_FIX.md` - marked primary fix
   - Synchronized deployment documentation with actual requirements

### Files Changed

**Fix:**
- `next.config.ts` - Added `output: 'standalone'` configuration

**FL/CI Prevention:**
- `__tests__/deployment/build.test.ts` - Added 2 tests to prevent recurrence
  - `should have Next.js output configuration for deployment`
  - `should create standalone build output for Vercel deployment`

**Documentation:**
- `DEPLOYMENT_FIX_404.md` - Created comprehensive fix documentation
- `VERCEL_DEPLOYMENT_FIX.md` - Updated with primary root cause

### Prevention Mechanism

**Tests Added**:
1. **Output Configuration Test**: Validates `output: 'standalone'` exists in next.config.ts
2. **Standalone Structure Test**: Validates `.next/standalone` directory and required files exist after build

These tests:
- Run in CI on every build
- Fail immediately if configuration is missing or incorrect
- Verify both the configuration AND its effect (standalone output creation)
- Catch the issue before deployment, not after

**Result**: This exact deployment failure can never happen again undetected.

### Lessons Learned

1. **Framework Version Awareness**: Major version upgrades require deployment configuration review
2. **Build vs. Runtime Validation**: Successful build doesn't guarantee successful deployment
3. **Test the Platform**: Deployment configuration must be tested, not just application code
4. **Detect Early**: Configuration issues should fail in CI, not in production
5. **Document Deployment Requirements**: Platform-specific requirements must be explicit and tested
6. **Standalone Output Critical**: For serverless platforms (Vercel, AWS Lambda), output mode determines deployment viability
7. **Silent Failures Are Deadly**: Errors that only appear in production are the most dangerous

### Governance Alignment

**One-Time Failure Doctrine**: ✅
- First occurrence: Identified and fixed
- Prevention: Tests added to detect permanently
- Propagation: Documented for team knowledge

**Zero Test Dodging**: ✅
- Tests run on every build
- No conditional logic or bypasses
- Clear failure messages guide remediation

**Evidence & Audit**: ✅
- Complete failure documentation
- Root cause analysis captured
- Fix and prevention mechanism documented
- Traceable to issue and deployment ID

---

## Failure #1: Prisma DATABASE_URL Validation Failure in CI

**Date**: 2025-12-17  
**Issue**: [#84](https://github.com/MaturionISMS/PartPulse/issues/84)  
**Commit**: 46e9565bb273be5864d983bbe17515f4335095ba (referenced in issue)

### What Went Wrong

**Symptom**: CI workflows failed with error:
```
Error validating datasource db: the URL must start with the protocol postgresql:// or postgres://.
```

**Root Cause**: 
- Prisma schema specifies `provider = "postgresql"` (line 9-10 in prisma/schema.prisma)
- CI workflows were setting `DATABASE_URL='file:./.ci-test-db.sqlite'` (SQLite)
- When `npm ci` runs, it triggers `postinstall` script which runs `prisma generate`
- `prisma generate` validates the datasource URL against the schema provider
- SQLite URL (`file:`) doesn't match PostgreSQL provider requirement

**Impact**:
- Blocked PR merges
- Failed CI builds
- Wasted developer time
- Violated BUILD-TO-GREEN gate

### Why It Happened

1. **Schema-URL Mismatch**: Production uses PostgreSQL, but tests tried to use SQLite for simplicity
2. **Validation Timing**: Prisma validates DATABASE_URL during `npm ci` (postinstall), not just during test execution
3. **Inadequate Testing**: No test validated that DATABASE_URL format matches schema provider
4. **Documentation Gap**: No clear guidance on database requirements for CI
5. **Incomplete Fix**: Initial fix missed `qa-enforcement-v1-frozen.yml` workflow file

### How We Fixed It

1. **Immediate Fix (Commit d4abe6f)**: 
   - Added PostgreSQL service containers to main CI workflows
   - Updated DATABASE_URL in workflows to use PostgreSQL: `postgresql://testuser:testpass@localhost:5432/testdb`
   - Modified `jest.globalSetup.js` to work with PostgreSQL instead of SQLite

2. **Follow-up Fix (Commit 93ef1d7) - FL/CI Lesson**:
   - **Issue**: Merge still failed - `qa-enforcement-v1-frozen.yml` still had SQLite URLs
   - **Root Cause**: Incomplete audit of all workflow files during initial fix
   - **Fix**: Added PostgreSQL service container to frozen workflow
   - **Updated**: All 3 DATABASE_URL occurrences in the frozen workflow
   - **Lesson**: Must audit ALL workflow files when fixing environment configuration

3. **FL/CI Implementation**:
   - ✅ **Registered**: This entry documents the failure AND the incomplete fix
   - ✅ **Incorporated**: Added test in `__tests__/deployment/environment.test.ts` that validates DATABASE_URL matches schema provider
   - ✅ **Prevented**: New test will fail immediately if DATABASE_URL doesn't match schema

### Files Changed

**Initial Fix:**
- `.github/workflows/qa-enforcement.yml` - Added PostgreSQL service, updated DATABASE_URL
- `.github/workflows/qa-enforcement-v2.yml` - Added PostgreSQL service, updated DATABASE_URL  
- `.github/workflows/minimum-build-to-red.yml` - Updated DATABASE_URL for all install steps
- `jest.globalSetup.js` - Removed SQLite-specific logic, made provider-agnostic
- `__tests__/deployment/environment.test.ts` - Added test to validate DATABASE_URL matches provider

**Follow-up Fix (FL/CI in action):**
- `.github/workflows/qa-enforcement-v1-frozen.yml` - Added PostgreSQL service, updated DATABASE_URL (3 occurrences)

### Prevention Mechanism

**Test Added**: `should have DATABASE_URL that matches Prisma schema provider`

This test:
- Reads the Prisma schema to determine the configured provider
- Validates that `process.env.DATABASE_URL` matches the provider format
- Fails immediately if there's a mismatch
- Runs in CI on every build

**Result**: This exact error can never happen again undetected.

### Lessons Learned

1. **Validate Early**: Environment configuration should be validated before running commands that depend on it
2. **Match Production**: Test environments should match production database type to avoid hidden issues
3. **Test the Tests**: Even test infrastructure needs tests (meta-testing)
4. **Document Assumptions**: Make database requirements explicit in README and CI
5. **Provider Consistency**: If schema requires PostgreSQL, all environments (dev, test, CI) should use it
6. **Complete Audit**: When fixing environment issues, check ALL workflow files systematically (use `find` or `grep -r`)
7. **FL/CI Validation**: Incomplete fixes can cause repeat failures - this is a **catastrophic pattern** that must be avoided

**CRITICAL FL/CI INSIGHT**: This failure occurred TWICE:
- First failure: SQLite URLs in main workflows
- Second failure: Incomplete fix missed frozen workflow

**Prevention for future environment fixes:**
```bash
# Always audit ALL files when fixing environment configuration
find .github/workflows -name "*.yml" -exec grep -l "DATABASE_URL" {} \;
# Verify each file is updated
grep -r "DATABASE_URL.*file:" .github/workflows/
```

### Related Documentation

- Issue: #84
- Prisma Schema: `prisma/schema.prisma` lines 9-10
- Test: `__tests__/deployment/environment.test.ts` (new test added)
- Workflows: `.github/workflows/qa-enforcement*.yml`

---

## Template for Future Failures

```markdown
## Failure #N: [Brief Description]

**Date**: YYYY-MM-DD  
**Issue**: [Link to issue]  
**Commit**: [SHA if applicable]

### What Went Wrong
[Symptom and error message]

### Root Cause
[Why it happened]

### Impact
[Consequences]

### How We Fixed It
[Solution implemented]

### FL/CI Implementation
- ✅ **Registered**: [This entry]
- ✅ **Incorporated**: [Test added]
- ✅ **Prevented**: [Prevention mechanism]

### Files Changed
[List of files]

### Prevention Mechanism
[Describe the test/check added]

### Lessons Learned
[Key takeaways]
```

---

## Statistics

- **Total Failures Logged**: 1
- **Total Tests Added**: 1
- **Failure Classes Eliminated**: 1 (DATABASE_URL validation mismatch)
- **Last Updated**: 2025-12-17

---

**Note**: This log is a living document. Every failure that occurs must be added here with full FL/CI treatment.
