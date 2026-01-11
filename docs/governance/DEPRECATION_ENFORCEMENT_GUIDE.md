# Deprecation Enforcement Guide

**Version**: 1.0  
**Date**: 2026-01-11  
**Status**: Active  
**Policy**: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md  
**Learning**: BL-026 (Automated Deprecation Detection)

---

## Overview

This repository enforces **zero-tolerance for deprecated API usage** to prevent technical debt accumulation and future breaking changes. Deprecated APIs are automatically detected and blocked at both commit time (pre-commit hook) and merge time (CI/CD gate).

This is a **constitutional requirement** under BL-026 and BL-024 (Zero Warning Test Debt).

---

## What Are Deprecated APIs?

Deprecated APIs are functions, methods, classes, or types that library maintainers have marked for future removal. Using deprecated APIs creates technical debt because:

- **Breaking Changes**: Deprecated APIs will be removed in future versions, causing breaking changes
- **Security Risks**: Unmaintained deprecated code may contain security vulnerabilities
- **Emergency Work**: Requires emergency migrations during routine dependency updates
- **Accumulation**: Silent accumulation until catastrophic failure

---

## Detection System

### Two-Level Enforcement

1. **Pre-commit Hook** (Local)
   - Runs automatically before each commit
   - Checks only staged TypeScript/TSX files
   - Blocks commit if deprecations detected
   - Provides immediate developer feedback

2. **CI/CD Gate** (Remote)
   - Runs on all pushes and pull requests
   - Checks entire TypeScript/TSX codebase
   - Blocks merge if deprecations detected
   - Required for merge gate approval

### Technology Stack

- **ESLint Rule**: `@typescript-eslint/no-deprecated`
- **Parser**: `@typescript-eslint/parser` with TypeScript project support
- **Hook Manager**: `husky` for git hooks
- **CI**: GitHub Actions workflows

---

## Developer Workflow

### Checking for Deprecations Locally

Before committing, you can manually check for deprecations:

```bash
# Check entire codebase
npm run lint:deprecation

# Check specific files
npx eslint path/to/file.ts --rule "@typescript-eslint/no-deprecated: error"
```

### What Happens When You Commit

1. You attempt to commit: `git commit -m "Your message"`
2. Pre-commit hook runs automatically
3. Hook checks staged TypeScript files for deprecations
4. If deprecations found:
   - Commit is **BLOCKED**
   - Error message shows which APIs are deprecated
   - You must fix before committing
5. If no deprecations:
   - Commit proceeds normally

### Fixing Deprecation Errors

When a deprecation is detected:

1. **Read the error message** - It tells you:
   - Which file and line number
   - What API is deprecated
   - What to use instead (if available)

2. **Find the replacement**:
   - Check library documentation
   - Look for migration guides
   - Search for the new API

3. **Update your code**:
   - Replace deprecated API with new API
   - Test your changes
   - Commit again

**Example**:
```typescript
// ❌ DEPRECATED - This will be blocked
const result = zodSchema.safeParse(data);
if (!result.success) {
  const errors = result.error.flatten(); // flatten() is deprecated
}

// ✅ CORRECT - Use the new API
const result = zodSchema.safeParse(data);
if (!result.success) {
  const errors = result.error.issues; // Use issues array instead
}
```

---

## Exception Process

### When Exceptions May Be Considered

Exceptions are **RARE** and only permitted when:
- No migration path exists from library maintainer yet
- Temporary use required during gradual migration
- No alternative exists and functionality is critical
- You have FM-approved migration plan

### How to Request an Exception

1. **Document the deprecation**:
   - What API is deprecated and why
   - Why it must be used temporarily
   - What the migration path will be
   - Timeline for removal

2. **Submit to FM**:
   - Create issue with template: `governance/templates/deprecation-exception-request.md`
   - Include full justification
   - Propose migration plan with dates
   - Explain alternatives explored

3. **Wait for FM approval**:
   - Do NOT proceed without approval
   - FM will review and respond
   - May request additional information
   - May require alternative approach

4. **If approved**:
   - FM adds to whitelist: `governance/deprecation-whitelist.json`
   - Add code comment with approval reference
   - Add `// eslint-disable-next-line @typescript-eslint/no-deprecated` above usage
   - Include FM approval reference and expiration date in comment
   - Set quarterly review date

**Example code comment for exception**:
```typescript
// FM APPROVED EXCEPTION (DEP-001)
// Approval: Issue #123, Date: 2026-01-11, Expires: 2026-04-11
// Reason: No migration path until library v3.0 released
// Migration Plan: Switch to newFunction() when library v3.0 available
// Quarterly Review: 2026-04-11
// eslint-disable-next-line @typescript-eslint/no-deprecated
const result = oldFunction();
```

### Quarterly Review

All exceptions are reviewed quarterly:
- FM reviews whitelist every 3 months
- Checks for available migration paths
- Removes resolved exceptions
- Escalates overdue migrations
- Updates or expires stale exceptions

**Default answer for exceptions: NO**

---

## Common Scenarios

### Scenario 1: Third-Party Library Deprecation

**Problem**: A dependency you use has deprecated an API.

**Solution**:
1. Check library's migration guide
2. Update to new API
3. Test thoroughly
4. Commit

**If no migration path exists yet**:
1. Submit exception request to FM
2. Document when migration will be possible
3. Wait for approval before proceeding

### Scenario 2: Internal Code Deprecation

**Problem**: You marked your own code as `@deprecated` and now ESLint is flagging it.

**Solution**:
1. If you're actively removing it: Remove usages first, then the deprecated code
2. If it's a gradual migration: Create migration plan and remove usages progressively
3. Do NOT commit with your own deprecated APIs still in use

**Best Practice**: Don't mark code as deprecated until you've removed all internal usages.

### Scenario 3: Test Code with Deprecated APIs

**Problem**: Tests are using deprecated APIs.

**Solution**:
- Tests are production code for QA (per BUILD_PHILOSOPHY.md)
- Same rules apply to test code
- Update tests to use new APIs
- No exceptions for test code

### Scenario 4: Legacy Code with Many Deprecations

**Problem**: Inheriting legacy code with many deprecated APIs.

**Solution**:
1. Create tech debt ticket for complete migration
2. Submit exception request with phased migration plan
3. Get FM approval with deadline
4. Add all to whitelist with expiration dates
5. Execute migration plan on schedule
6. Remove from whitelist as fixed

**Important**: This is for inherited legacy code only. New code never gets exceptions.

---

## Troubleshooting

### "Pre-commit hook not running"

**Cause**: Husky not installed or hooks not set up.

**Solution**:
```bash
npm install
npm run prepare
```

### "ESLint can't find TypeScript configuration"

**Cause**: TypeScript parser needs project configuration.

**Solution**: Verify `tsconfig.json` exists in project root and is valid.

### "False positive - not actually deprecated"

**Cause**: Rare, but TypeScript definitions may be incorrect.

**Solution**:
1. Verify in library source code
2. If truly false positive, submit exception request
3. Include evidence that API is not actually deprecated
4. Get FM approval

### "CI failing but local passes"

**Cause**: Different files checked, or local cache issue.

**Solution**:
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Check exact command CI uses
npx eslint '**/*.ts' '**/*.tsx' --rule "@typescript-eslint/no-deprecated: error"
```

---

## For Builders

### Builder Responsibilities

All builders MUST:
- ✅ Understand this deprecation policy before coding
- ✅ Check for deprecations before committing
- ✅ Fix deprecations immediately when detected
- ✅ Request exceptions BEFORE committing deprecated code
- ✅ Follow FM-approved migration plans
- ✅ Never bypass or disable the deprecation gate

### Builder Onboarding Checklist

Before starting work:
- [ ] Read governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md
- [ ] Read this guide (docs/governance/DEPRECATION_ENFORCEMENT_GUIDE.md)
- [ ] Understand BL-026 learning
- [ ] Test pre-commit hook works: `git commit --allow-empty -m "test"`
- [ ] Know how to check deprecations: `npm run lint:deprecation`
- [ ] Understand exception process
- [ ] Acknowledge zero-tolerance policy

### When Assigned to Fix Deprecations

If you receive a deprecation tech debt ticket:
1. Review the whitelist entry
2. Check for available migration path
3. Update code to use new API
4. Run full test suite
5. Verify deprecation check passes
6. Remove from whitelist
7. Mark ticket complete

---

## References

- **Policy**: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md
- **Learning**: BL-026 in governance/canon/BOOTSTRAP_EXECUTION_LEARNINGS.md
- **Related**: BL-024 (Zero Warning Test Debt)
- **Build Philosophy**: BUILD_PHILOSOPHY.md (Zero Technical Debt)
- **QA Policy**: governance/policy/QA_POLICY_MASTER.md

---

## Summary

**Key Points**:
- Deprecated APIs are blocked at commit and merge time
- Zero tolerance - no exceptions without FM approval
- Two-level enforcement: pre-commit hook + CI gate
- Exception requests require justification and migration plan
- Quarterly review of all exceptions
- Same rules for production and test code

**Remember**: 
> "Deprecated APIs are technical debt. Technical debt is blocked. No exceptions without FM approval."

---

**Document Owner**: Governance Liaison  
**Maintained By**: Foreman (FM)  
**Review Frequency**: Quarterly  
**Last Updated**: 2026-01-11  
**Next Review**: 2026-04-11
