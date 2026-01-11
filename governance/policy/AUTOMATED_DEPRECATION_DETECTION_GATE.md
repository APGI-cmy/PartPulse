# POLICY: AUTOMATED DEPRECATION DETECTION GATE

## Status
Canonical Governance Policy  
**Policy ID**: AUTOMATED_DEPRECATION_DETECTION_GATE  
**Version**: v1.0  
**Authority**: Johan Ras (CS2)  
**Effective Date**: 2026-01-11  
**Learning Reference**: BL-026 (Automated Deprecation Detection)  
**Related**: BL-024 (Zero Warning Test Debt)  
**Scope**: All repositories, all builders, all code changes  
**Enforcement**: Mandatory via pre-commit hooks and CI/CD gates

---

## 1. Purpose

This policy establishes **mandatory automated detection and blocking of deprecated API usage** across all TypeScript/JavaScript code to prevent technical debt accumulation and future breaking changes.

Deprecated APIs are a form of **technical debt** that:
- Create future breaking changes when removed
- Require emergency migrations during upgrades
- Introduce security vulnerabilities when unmaintained
- Accumulate silently until catastrophic

This policy ensures deprecated API usage is **detected immediately** and **blocked automatically** before entering the codebase.

This policy is **normative and mandatory**.

---

## 2. Constitutional Authority

This policy derives authority from:
- **BUILD_PHILOSOPHY.md** - 100% GREEN mandate, zero technical debt philosophy
- **QA_POLICY_MASTER.md** - Build-to-Green requirements and quality doctrine
- **BL-024** - Zero Warning Test Debt (expanded to deprecation warnings)
- **BL-026** - Automated Deprecation Detection (this learning)
- **CS2 Decision 2026-01-11** - Mandatory deprecation gate for all repositories

---

## 3. Policy Statement

**ALL deprecated API usage is BLOCKED at two enforcement points:**

1. **Pre-commit Hook**: Local blocking before code is committed
2. **CI/CD Gate**: Remote blocking before code is merged

**No deprecated APIs may enter the codebase without explicit FM approval and documentation.**

---

## 4. Technical Implementation Requirements

### 4.1 ESLint Configuration (Mandatory)

All repositories MUST implement ESLint with deprecation detection:

**Required Dependencies**:
```json
{
  "devDependencies": {
    "eslint": "^9",
    "eslint-plugin-deprecation": "^3.0.0",
    "typescript": "^5"
  }
}
```

**Required ESLint Configuration** (eslint.config.mjs):
```javascript
import deprecation from 'eslint-plugin-deprecation';
import tseslint from 'typescript-eslint';

export default [
  // ... other configs
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      deprecation: deprecation
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'deprecation/deprecation': 'error' // MUST be 'error', not 'warn'
    }
  }
];
```

**CRITICAL**: The rule MUST be set to `'error'` to block builds. Setting to `'warn'` is a governance violation.

### 4.2 Pre-commit Hook (Mandatory)

All repositories MUST implement a pre-commit hook that runs deprecation detection:

**Required Dependencies**:
```json
{
  "devDependencies": {
    "husky": "^9.0.0"
  }
}
```

**Installation Commands**:
```bash
npm install --save-dev husky
npx husky init
```

**Pre-commit Hook** (.husky/pre-commit):
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running deprecation detection..."
npm run lint:deprecation || {
  echo "❌ BLOCKED: Deprecated API usage detected"
  echo "Fix deprecation errors before committing"
  echo "See: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md"
  exit 1
}
```

**Required package.json Script**:
```json
{
  "scripts": {
    "lint:deprecation": "eslint . --max-warnings 0"
  }
}
```

### 4.3 CI/CD Gate (Mandatory)

All repositories MUST implement a CI/CD workflow that blocks merges on deprecation usage:

**Required Workflow** (.github/workflows/deprecation-detection.yml):
```yaml
name: Deprecation Detection

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, develop]

permissions:
  contents: read

jobs:
  deprecation-check:
    name: Detect Deprecated API Usage
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Deprecation Detection
        run: npm run lint:deprecation
      
      - name: Evidence Capture on Failure
        if: failure()
        run: |
          echo "❌ Deprecated API usage detected"
          echo "This is a BLOCKING failure"
          echo "Fix all deprecations before merge"
          echo "See: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md"
```

**Integration with Merge Gate**: The deprecation-check job MUST be added to the merge-gate dependencies in the main QA workflow.

---

## 5. Deprecation Types Detected

The ESLint deprecation plugin detects:

1. **Deprecated Functions/Methods**
   - Functions marked with `@deprecated` JSDoc tag
   - Methods from dependencies marked as deprecated

2. **Deprecated Classes**
   - Classes marked with `@deprecated` JSDoc tag
   - Imported classes with deprecation notices

3. **Deprecated Properties**
   - Object properties marked as deprecated
   - Configuration options marked for removal

4. **Deprecated Imports**
   - Entire modules marked as deprecated
   - Specific exports marked for removal

5. **Deprecated Types** (TypeScript)
   - Type definitions marked with `@deprecated`
   - Interface members marked for removal

---

## 6. Exception Process

### 6.1 When Exceptions May Be Considered

Exceptions are **RARE** and only permitted when:
- Migration path is not yet available from library maintainer
- Temporary use required during gradual migration
- No alternative exists and functionality is critical
- FM has approved a phased migration plan

### 6.2 Exception Request Process

1. **Document the Deprecation**
   - What API is deprecated
   - Why it's being used
   - What the migration path is
   - Timeline for removal

2. **Submit to FM for Approval**
   - Written justification
   - Migration plan with dates
   - Alternative solutions explored
   - Impact assessment

3. **FM Approval Required**
   - Explicit written approval from FM
   - Approval includes deadline for removal
   - Approval includes quarterly review requirement

4. **Whitelist Entry**
   - Add to `governance/deprecation-whitelist.json`
   - Include FM approval reference
   - Include expiration date
   - Include quarterly review date

5. **Code Documentation**
   - Add `// eslint-disable-next-line deprecation/deprecation` ONLY for approved items
   - Add comment with FM approval reference and expiration
   - Add TODO with removal date

### 6.3 Whitelist Format

**File**: `governance/deprecation-whitelist.json`

```json
{
  "version": "1.0",
  "lastReview": "2026-01-11",
  "nextReview": "2026-04-11",
  "exceptions": [
    {
      "id": "DEP-001",
      "api": "oldFunction() in legacy-lib",
      "file": "app/legacy/adapter.ts",
      "reason": "No migration path available until legacy-lib@3.0",
      "approved_by": "FM",
      "approval_date": "2026-01-11",
      "expiration_date": "2026-03-11",
      "migration_plan": "Switch to newFunction() when legacy-lib@3.0 released",
      "quarterly_review": "2026-04-11",
      "status": "active"
    }
  ]
}
```

### 6.4 Quarterly Review

FM MUST review deprecation whitelist quarterly:
- Verify exceptions still justified
- Check for available migration paths
- Remove resolved exceptions
- Escalate overdue migrations
- Update expiration dates if necessary

---

## 7. Enforcement Rules

### 7.1 Pre-commit Blocking

- Commits with deprecation errors MUST be blocked locally
- Developer sees immediate feedback
- No deprecated code enters git history

### 7.2 CI/CD Blocking

- PRs with deprecation errors MUST fail CI
- Cannot merge until deprecations resolved
- Merge gate enforces policy

### 7.3 No Weakening Permitted

The following are **PROHIBITED**:
- ❌ Changing `'error'` to `'warn'` in ESLint config
- ❌ Disabling the deprecation rule
- ❌ Skipping the pre-commit hook
- ❌ Bypassing the CI check
- ❌ Global eslint-disable for deprecation
- ❌ Removing the workflow

**Any weakening is a governance violation requiring CS2 escalation.**

### 7.4 Existing Codebase Audit

When implementing this policy:
1. Run deprecation detection across entire codebase
2. Document ALL existing deprecations
3. Create remediation plan for each
4. Either:
   - Fix all immediately (preferred), OR
   - Create whitelist entries with FM approval and migration plan
5. No merge permitted until audit complete

---

## 8. Codebase Audit Process

### 8.1 Initial Audit

**Command**:
```bash
npm run lint:deprecation 2>&1 | tee governance/evidence/deprecation-audit-$(date +%Y-%m-%d).log
```

### 8.2 Audit Report Template

**File**: `governance/evidence/deprecation-audit-YYYY-MM-DD.md`

```markdown
# Deprecation Audit Report

**Date**: YYYY-MM-DD
**Repository**: [name]
**Audited By**: [agent/person]
**Policy**: AUTOMATED_DEPRECATION_DETECTION_GATE v1.0

## Summary

- Total deprecated API usages found: X
- Critical deprecations (no migration path): Y
- Minor deprecations (migration available): Z
- Action required: [IMMEDIATE FIX | WHITELIST WITH PLAN]

## Findings

### 1. [API Name] in [file:line]
- **Deprecated API**: `functionName()`
- **Replacement**: `newFunctionName()`
- **Migration Complexity**: [LOW | MEDIUM | HIGH]
- **Recommendation**: [FIX NOW | SCHEDULE | WHITELIST]
- **FM Decision**: [PENDING | APPROVED | FIX REQUIRED]

[Repeat for each finding]

## Resolution Plan

1. Immediate fixes (completed): X/Y
2. Scheduled migrations: A/B
3. Whitelisted exceptions: M/N
4. Status: [COMPLETE | IN PROGRESS | BLOCKED]

## FM Sign-off

- [ ] All deprecations reviewed
- [ ] Whitelist approved (if applicable)
- [ ] Migration timelines set
- [ ] Policy implementation complete

**FM Signature**: _______________
**Date**: _______________
```

### 8.3 Remediation Requirements

For each deprecation found:
1. Attempt immediate fix (preferred)
2. If not fixable immediately:
   - Document in audit report
   - Create tech debt ticket
   - Submit exception request to FM
   - Add to whitelist ONLY if FM approved
   - Set migration deadline
3. Re-run audit to verify resolution

**No implementation complete until audit clean or all exceptions whitelisted.**

---

## 9. Documentation Requirements

### 9.1 Builder Contracts

All builder agent contracts MUST reference this policy:

**Required Section** in `.github/agents/[builder]-agent.md`:
```markdown
## Code Quality Requirements

Builders MUST comply with:
- Deprecation Detection Gate (governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md)
- No deprecated APIs without FM approval
- Pre-commit hooks MUST pass
- CI deprecation checks MUST be green
```

### 9.2 Onboarding Documentation

Create/Update `docs/governance/DEPRECATION_ENFORCEMENT_GUIDE.md`:
- Explain what deprecations are
- Why they're blocked
- How to check for deprecations locally
- Exception request process
- Quarterly review cycle

### 9.3 Development Workflow Documentation

Update development documentation to include:
- How to run deprecation checks locally: `npm run lint:deprecation`
- What to do when deprecation detected
- How to request exceptions
- Where to find whitelist

---

## 10. Learning Reference: BL-026

**Learning ID**: BL-026  
**Title**: Automated Deprecation Detection Required  
**Context**: Code quality and technical debt prevention  
**Date Recorded**: 2026-01-11

**Observation**:
Deprecated APIs accumulate silently in codebases until library updates force emergency migrations. This creates:
- Unexpected breaking changes during routine updates
- Emergency work when deprecated APIs removed
- Security vulnerabilities from unmaintained code paths
- Technical debt that compounds over time

**Root Cause**:
- No automated detection of deprecated API usage
- Deprecation warnings ignored or unseen
- No enforcement mechanism at commit or merge time
- Reactive rather than proactive approach to deprecations

**Learning**:
Deprecation detection MUST be automated and enforced at two gates:
1. Pre-commit hook - immediate developer feedback
2. CI/CD gate - merge blocking enforcement

Deprecations are technical debt and MUST be treated with same zero-tolerance as test failures and warnings.

**Governance Impact**:
- Requires ESLint with deprecation plugin configured as error-level
- Requires pre-commit hooks with deprecation checks
- Requires CI/CD workflow with deprecation gate
- Requires exception process with FM approval
- Requires quarterly whitelist review

**Implementation Requirements**:
- ESLint plugin: `eslint-plugin-deprecation`
- Pre-commit tool: `husky`
- CI workflow: `.github/workflows/deprecation-detection.yml`
- Whitelist: `governance/deprecation-whitelist.json`
- Audit: Initial codebase scan with remediation plan

**Status**: Canonical - MUST be implemented in all repositories

**Related Learnings**:
- BL-024: Zero Warning Test Debt (extends to deprecation warnings)
- Pattern: Technical debt accumulation prevention
- Precedent: Same zero-tolerance philosophy as test failures

---

## 11. Relationship to BL-024

**BL-024** established Zero Warning Test Debt.  
**BL-026** extends this to deprecation warnings:

| Aspect | BL-024 (Warnings) | BL-026 (Deprecations) |
|--------|-------------------|----------------------|
| Detection | Lint warnings | Deprecation warnings |
| Enforcement | Error level | Error level |
| Tolerance | Zero | Zero |
| Pre-commit | Blocked | Blocked |
| CI/CD | Gate blocks | Gate blocks |
| Exceptions | FM approval required | FM approval required |
| Review | Quarterly | Quarterly |

**Philosophy**: Deprecation warnings ARE technical debt warnings and fall under the same zero-tolerance mandate.

---

## 12. Compliance Checklist

For policy implementation complete, verify:

- [ ] ESLint plugin installed: `eslint-plugin-deprecation`
- [ ] ESLint configured with deprecation rule as 'error'
- [ ] TypeScript parser configured for deprecation detection
- [ ] Husky installed for git hooks
- [ ] Pre-commit hook created and runs deprecation check
- [ ] CI workflow created: `deprecation-detection.yml`
- [ ] Merge gate updated to depend on deprecation check
- [ ] Initial codebase audit completed
- [ ] Audit findings documented
- [ ] All deprecations fixed OR whitelisted with FM approval
- [ ] Deprecation whitelist created (if needed)
- [ ] Builder contracts updated with policy reference
- [ ] Onboarding docs updated with deprecation guidance
- [ ] Exception process documented
- [ ] Quarterly review schedule set
- [ ] Evidence captured in governance/evidence/

**FM Sign-off Required**: Policy not active until FM verifies implementation complete.

---

## 13. Related Policies

This policy works with:

1. **POLICY-NO-ONLY-LANGUAGE.md**
   - Both prevent minimizing technical debt
   - Both enforce 100% GREEN standard
   - Both require accurate status reporting

2. **QA_POLICY_MASTER.md**
   - Deprecations block Build-to-Green
   - Gate-Eligible Green requires zero deprecations
   - Same enforcement philosophy

3. **BUILD_PHILOSOPHY.md**
   - Zero technical debt mandate
   - 100% GREEN includes zero deprecations
   - No "will fix later" permitted

4. **T0-003: Zero Test Debt Constitutional Rule**
   - Extends to deprecation debt
   - Same constitutional authority
   - Same non-negotiable enforcement

---

## 14. Maintenance and Updates

### 14.1 Policy Updates

This policy may be updated by:
- Johan Ras (CS2) - Direct authority
- Governance Administrator - With CS2 approval
- FM - For implementation details only, not requirements

### 14.2 Whitelist Maintenance

Deprecation whitelist MUST be:
- Reviewed quarterly by FM
- Updated when migrations complete
- Audited for expired exceptions
- Reported in governance metrics

### 14.3 Tool Updates

When tools updated:
- ESLint plugin version bumps require testing
- Configuration changes require FM approval
- Tool changes must not weaken enforcement
- Migration guides must be created

---

## 15. Summary

**Policy**: Mandatory automated deprecation detection and blocking  
**Enforcement**: Pre-commit hooks + CI/CD gates  
**Tolerance**: Zero deprecated APIs without FM approval  
**Learning**: BL-026 (Automated Deprecation Detection)  
**Related**: BL-024 (Zero Warning Test Debt)  
**Authority**: CS2 constitutional mandate  

**Key Principle**: 
> "Deprecated APIs are technical debt. Technical debt is blocked. No exceptions without FM approval."

---

## 16. Acceptance and Acknowledgment

By working in repositories with this policy, builders acknowledge:
1. They have read and understood this policy
2. They will not use deprecated APIs without FM approval
3. They will fix deprecation errors before committing
4. They will follow the exception process if needed
5. They accept that deprecation errors block merges

**This is non-negotiable. This is the standard.**

---

**Policy Status**: ACTIVE  
**Enforcement**: IMMEDIATE  
**Version**: 1.0  
**Effective Date**: 2026-01-11  
**Next Review**: 2026-04-11 (quarterly)

---

**END OF POLICY**
