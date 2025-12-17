# Failure Learning Log (FL/CI)

## Purpose

This log implements the **Failure Learning / Continuous Improvement (FL/CI) Policy**. Every failure is an opportunity to:
1. **Register** the failure - Document what went wrong and why
2. **Incorporate** into QA suite - Add tests to prevent it forever
3. **Prevent** permanently - Implement safeguards

This makes our QA suite progressively better, eliminating entire classes of errors over time.

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
