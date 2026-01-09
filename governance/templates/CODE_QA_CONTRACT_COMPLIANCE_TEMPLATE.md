# Code/QA/Contract Compliance Template

**Document ID**: COMPLIANCE-CHECK-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active Template  
**Authority**: Maturion Foreman Governance  
**Purpose**: Validate compliance before merge authorization

---

## Purpose

This template provides a structured format for FM to validate that a PR meets all code quality, QA, and contract compliance requirements before authorizing merge. This is the comprehensive compliance validation that sits between "PR submitted" and "merge authorized".

**FM Usage**: Complete this template for every PR before issuing merge authorization.

---

## PR Information

**PR Number**: [#XXX]  
**PR Title**: [Title]  
**Branch**: [feature/branch-name]  
**Builder**: [Builder Name/Type]  
**Wave**: [Wave X] or [Standalone Feature]  
**Assigned Tests**: [TC-XXX through TC-YYY] or [N/A]  
**Review Date**: [YYYY-MM-DD]  
**FM Reviewer**: [FM Name/ID]

---

## Section 1: Code Quality Compliance

### 1.1 Build Compliance
- [ ] Code compiles without errors
- [ ] Type checking passes (zero errors)
- [ ] No TypeScript `any` types (unless explicitly justified)
- [ ] Build process completes successfully
- [ ] No build warnings (unless whitelisted)

**Build Evidence**: [link to build log]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 1.2 Linting Compliance
- [ ] ESLint passes with zero errors
- [ ] ESLint passes with zero warnings (unless whitelisted)
- [ ] No disabled rules without justification
- [ ] Code style consistent with project standards

**Lint Evidence**: [link to lint output]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 1.3 Code Standards Compliance
- [ ] Follows implementation guide standards
- [ ] Function/variable naming consistent
- [ ] Comments appropriate (not excessive, not missing)
- [ ] No commented-out code
- [ ] No debug console.logs (unless legitimate logging)
- [ ] Error handling implemented properly
- [ ] No hardcoded values (use constants/config)

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 1.4 Security Compliance
- [ ] No hardcoded secrets or credentials
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities (if applicable)
- [ ] Input validation implemented
- [ ] Authentication/authorization implemented per spec
- [ ] Sensitive data encrypted (if applicable)
- [ ] Security scan passes (if configured)

**Security Evidence**: [link to security scan or review notes]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 1.5 Performance Compliance
- [ ] No obvious performance anti-patterns
- [ ] Database queries optimized (indexes used)
- [ ] No N+1 query problems
- [ ] Large data sets paginated
- [ ] Memory leaks prevented
- [ ] Resource cleanup implemented (connections, files)

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ⚠️ ACCEPTABLE | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

## Section 2: QA Compliance

### 2.1 Test Execution Compliance
- [ ] All assigned tests passing (100%)
- [ ] No test failures
- [ ] No test errors
- [ ] No test timeouts
- [ ] Full test suite passing (no regressions)
- [ ] Tests pass consistently (not flaky)

**Test Results**: [X passed, 0 failed, X total]  
**Test Evidence**: [link to test execution log]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 2.2 Test Debt Compliance (ZERO TOLERANCE)
- [ ] No `.skip()` patterns
- [ ] No `.todo()` patterns
- [ ] No commented-out tests
- [ ] No `|| true` test bypasses
- [ ] No conditional test skipping
- [ ] No stub test implementations
- [ ] No incomplete test assertions

**Test Dodging Check**: [link to dodging detection output]  
**Status**: [✅ PASS | ❌ FAIL - BLOCKER]  
**Issues**: [List any violations, or "None"]

**Zero Test Debt Principle**: ANY test debt = IMMEDIATE MERGE BLOCK

---

### 2.3 Test Infrastructure Compliance
- [ ] Test helpers production-quality (not stubs)
- [ ] Test data factories generate varied, realistic data
- [ ] Mocks implement realistic behavior
- [ ] Test isolation validated (tests independent)
- [ ] No shared mutable state between tests
- [ ] Test fixtures appropriate and complete

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 2.4 Test Coverage Compliance
- [ ] All assigned test cases implemented
- [ ] All FRS requirements covered (if applicable)
- [ ] All error paths tested
- [ ] All edge cases tested
- [ ] No untested code paths (if coverage tool used)

**Coverage Evidence**: [link to coverage report or mapping]  
**Status**: [✅ PASS | ❌ FAIL]  
**Gaps**: [List any coverage gaps, or "None"]

---

## Section 3: Architecture Contract Compliance

### 3.1 Component Boundary Compliance
- [ ] Component boundaries respected
- [ ] No unauthorized cross-component dependencies
- [ ] Interface contracts followed
- [ ] Layering architecture followed (if applicable)
- [ ] No circular dependencies introduced

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 3.2 API Contract Compliance
- [ ] API endpoints match specification
- [ ] Request schemas match specification
- [ ] Response schemas match specification
- [ ] Error handling matches specification
- [ ] Status codes correct per specification
- [ ] Authentication/authorization per specification

**API Evidence**: [link to API tests or validation]  
**Status**: [✅ PASS | ❌ FAIL]  
**Deviations**: [List any deviations, or "None"]

---

### 3.3 Database Contract Compliance
- [ ] Database schema matches specification
- [ ] All required fields present
- [ ] Data types correct
- [ ] Constraints implemented (foreign keys, unique, etc.)
- [ ] Indexes present per specification
- [ ] Migrations tested

**DB Evidence**: [link to schema validation or tests]  
**Status**: [✅ PASS | ❌ FAIL]  
**Deviations**: [List any deviations, or "None"]

---

### 3.4 Data Flow Compliance
- [ ] Data flows match architecture specification
- [ ] Data transformations correct
- [ ] Data validation at proper boundaries
- [ ] Caching implemented per specification (if applicable)
- [ ] Transaction boundaries correct

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 3.5 Security Architecture Compliance
- [ ] Authentication implemented per architecture
- [ ] Authorization (RBAC/ABAC) implemented per architecture
- [ ] Session management per architecture
- [ ] Encryption per architecture (at rest, in transit)
- [ ] Security headers configured
- [ ] Input sanitization per architecture

**Security Evidence**: [link to security tests or review]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 3.6 Audit Logging Compliance
- [ ] Required events logged per specification
- [ ] Log format matches specification
- [ ] Log data complete (who, what, when, where)
- [ ] Sensitive data not logged (or properly masked)
- [ ] Audit tests passing

**Audit Evidence**: [link to audit tests]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

## Section 4: Governance Compliance

### 4.1 Policy Compliance
- [ ] Governance version synchronized
- [ ] No governance policy violations
- [ ] Test dodging policy complied with
- [ ] QA parking policy complied with (if used)
- [ ] No-only-language policy complied with

**Governance Check**: [link to governance sync output]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 4.2 Agent Boundary Compliance
- [ ] Builder stayed within assigned scope
- [ ] No cross-agent violations
- [ ] No governance file modifications (unless authorized)
- [ ] No unauthorized architecture changes

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 4.3 Escalation Compliance
- [ ] All escalations properly handled
- [ ] Escalation procedures followed (if any occurred)
- [ ] No unresolved escalations blocking merge

**Escalation Status**: [None | All Resolved | Pending]  
**Details**: [If any escalations occurred, list status]

---

### 4.4 Learning Capture Compliance
- [ ] Failures documented (if any occurred)
- [ ] Prevention measures documented
- [ ] Learnings captured in FAILURE_LEARNING_LOG.md
- [ ] No catastrophic failures untracked

**Learning Evidence**: [link to learning log updates, or "N/A - no failures"]  
**Status**: [✅ COMPLETE | N/A]

---

## Section 5: Documentation Compliance

### 5.1 Code Documentation
- [ ] Public APIs documented
- [ ] Complex logic commented
- [ ] Function/method documentation complete
- [ ] Type definitions documented (TypeScript)

**Review Notes**: [Observations]  
**Status**: [✅ PASS | ⚠️ ACCEPTABLE | ❌ FAIL]  
**Issues**: [List any issues, or "None"]

---

### 5.2 Architecture Documentation
- [ ] Architecture documents updated (if changes)
- [ ] API specification updated (if changes)
- [ ] Database schema updated (if changes)
- [ ] Data flow diagrams updated (if changes)

**Documentation Status**: [No Changes Needed | Updated]  
**Evidence**: [links to updated docs, or "N/A"]

---

### 5.3 PR Documentation
- [ ] PR description comprehensive
- [ ] What changed clearly explained
- [ ] Why changed clearly explained
- [ ] Testing approach documented
- [ ] Acceptance criteria met
- [ ] Evidence provided (test logs, screenshots, etc.)

**PR Quality**: [✅ EXCELLENT | ✅ GOOD | ⚠️ ADEQUATE | ❌ INSUFFICIENT]  
**Review Notes**: [Observations]

---

## Section 6: CI/CD Compliance

### 6.1 CI Workflow Compliance
- [ ] All required CI workflows passing
- [ ] Test execution workflow GREEN
- [ ] Test dodging detection workflow GREEN
- [ ] QA parking validation workflow GREEN
- [ ] Governance sync check workflow GREEN
- [ ] Build workflow GREEN
- [ ] Lint workflow GREEN
- [ ] Type check workflow GREEN
- [ ] Security scan workflow GREEN (if configured)

**CI Status**: [All GREEN | Some FAILING]  
**CI Evidence**: [links to all workflow runs]  
**Failed Workflows**: [List any, or "None"]

---

### 6.2 Branch Status Compliance
- [ ] Branch up to date with main
- [ ] No merge conflicts
- [ ] All required checks passing
- [ ] All required approvals obtained

**Branch Status**: [✅ READY | ⚠️ NEEDS UPDATE | ❌ CONFLICTS]  
**Evidence**: [link to PR checks page]

---

## Section 7: Overall Compliance Assessment

### 7.1 Compliance Summary

| Category | Status | Blockers |
|----------|--------|----------|
| Code Quality | [✅/❌] | [None or list] |
| QA Compliance | [✅/❌] | [None or list] |
| Architecture Contract | [✅/❌] | [None or list] |
| Governance | [✅/❌] | [None or list] |
| Documentation | [✅/❌] | [None or list] |
| CI/CD | [✅/❌] | [None or list] |

---

### 7.2 Gate-Eligible GREEN Status

**Overall Status**: [✅ GATE-ELIGIBLE GREEN | ❌ NOT READY]

**If NOT READY, Blocking Issues**:
1. [Issue 1 - category and details]
2. [Issue 2 - category and details]
3. [Issue 3 - category and details]
...

**Required Remediation Actions**:
1. [Action 1 with owner]
2. [Action 2 with owner]
3. [Action 3 with owner]
...

**Estimated Remediation Time**: [X hours/days]

---

### 7.3 FM Decision

**Merge Authorization**: [✅ AUTHORIZED | ❌ BLOCKED | ⏳ PENDING REMEDIATION]

**Decision Rationale**:
[Brief explanation of decision]

**If AUTHORIZED**:
- All compliance requirements met
- Zero blockers
- Evidence complete
- Gate-Eligible GREEN achieved

**If BLOCKED**:
- [List specific blockers]
- [Required remediation actions]
- [When to resubmit for review]

**If PENDING**:
- [What is pending]
- [When will decision be made]
- [What information needed]

---

### 7.4 FM Approval & Authorization

**Reviewed By**: [FM Name/ID]  
**Review Date**: [YYYY-MM-DD]  
**Review Duration**: [X minutes/hours]

**Authorization Status**: [AUTHORIZED | BLOCKED | PENDING]  
**Authorization Date**: [YYYY-MM-DD if authorized]

**Next Steps**:
- [If authorized: Proceed to merge]
- [If blocked: Builder remediates and resubmits]
- [If pending: Specific next actions]

**FM Notes**:
[Any additional observations, commendations, or concerns]

---

**FM Signature**: [FM Name/ID]  
**Date**: [YYYY-MM-DD]

---

## Evidence Package

**All evidence referenced above, consolidated**:

1. Build Log: [link]
2. Test Results: [link]
3. Lint Output: [link]
4. Type Check Output: [link]
5. Test Dodging Check: [link]
6. QA Parking Validation: [link]
7. Governance Sync Check: [link]
8. Security Scan: [link]
9. CI Workflow Runs: [links]
10. Architecture Review: [link or notes]
11. Code Review Notes: [link or notes]
12. PR Description: [link]
13. Updated Documentation: [links]
14. Learning Log: [link if updated]

**Evidence Location**: [Where all evidence is stored/linked]

---

## Canonical Reference

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/templates/CODE_QA_CONTRACT_COMPLIANCE_TEMPLATE.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- T0-014: FM Merge Gate Management Canon
- FM_EXECUTION_MANDATE.md
- ForemanApp Agent Contract

---

## Approval

**Status**: ✅ APPROVED TEMPLATE  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Usage**: Mandatory for FM pre-merge compliance validation

---

**Comprehensive Validation**: Every PR, every time. No shortcuts. No exceptions.
