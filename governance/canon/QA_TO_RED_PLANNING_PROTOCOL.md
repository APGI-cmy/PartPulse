# QA-to-Red Planning Protocol

**Document ID**: QARPP-CANON-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Referenced In**: BUILD_PHILOSOPHY.md, BYG_DOCTRINE.md

---

## Purpose

This protocol defines the **mandatory process for QA-to-Red planning** that must be completed before any implementation work begins. QA-to-Red is the foundation of Build-to-Green methodology and is a **constitutional requirement**.

**FM Authority**: QA-to-Red plan MUST be 100% complete and approved by FM before wave planning or builder assignment.

---

## Constitutional Principle

**From BUILD_PHILOSOPHY.md**:
> "QA-First Architecture-Driven Development means QA is planned BEFORE implementation. Red QA defines the gap. Green QA proves completion."

**From BYG_DOCTRINE.md**:
> "Build-to-Green is not a methodology — it is a law. Red QA is the contract. Green QA is the proof."

**One-Time Build Law**:
> "A build works perfectly the first time, or it doesn't happen. QA-to-Red ensures we know what 'perfect' means before building."

---

## 1. QA-to-Red Overview

### 1.1 What is QA-to-Red?

**QA-to-Red** is the practice of:
1. Writing comprehensive test suites BEFORE implementation
2. Running tests to verify they FAIL (Red state) - proving gap exists
3. Using Red tests as the contract for what must be built
4. Building implementation until ALL tests pass (Green state)
5. Green state = Build complete

### 1.2 Why QA-to-Red?

**Benefits**:
- ✅ Forces complete understanding of requirements before building
- ✅ Ensures testability is designed in (not bolted on)
- ✅ Provides objective completion criteria (Green = Done)
- ✅ Prevents scope creep and gold plating
- ✅ Catches requirement gaps early (before implementation)
- ✅ Enables one-time builds (no "fix later" or rework)

**Without QA-to-Red**:
- ❌ Implementation drives design (backward)
- ❌ "Works on my machine" (untested edge cases)
- ❌ Scope ambiguity ("is this done?")
- ❌ Test debt accumulation
- ❌ Post-merge defects
- ❌ Rework and iteration cycles

---

## 2. QA-to-Red Planning Process

### Phase 1: Requirements Analysis

**Input**: Approved FRS (Functional Requirements Specification)

**Activities**:
1. Review all functional requirements (FR-XXX)
2. Review all business rules (BR-XXX)
3. Review all data requirements
4. Review all integration requirements
5. Review all non-functional requirements (performance, security, etc.)
6. Identify all testable behaviors
7. Identify all edge cases and error conditions

**Output**: Complete list of test scenarios

**Completeness Criteria**:
- [ ] Every FRS requirement has at least one test scenario
- [ ] Every business rule has validation test
- [ ] Every error condition has test coverage
- [ ] Every data validation rule has test
- [ ] Every integration point has test
- [ ] All edge cases identified and testable

---

### Phase 2: Test Architecture Design

**Input**: Test scenarios from Phase 1, Architecture documents

**Activities**:
1. Define test categories and organization
2. Design test data strategy (fixtures, factories, mocks)
3. Define test infrastructure requirements
4. Design integration test approach
5. Design end-to-end test approach
6. Define test isolation strategy
7. Define test execution order and dependencies
8. Estimate test execution time

**Output**: QA Test Architecture

**Completeness Criteria**:
- [ ] Test categories defined (unit, integration, e2e, etc.)
- [ ] Test data strategy complete (no "TBD" on test data)
- [ ] Test infrastructure requirements documented
- [ ] Test isolation approach defined
- [ ] Test execution strategy defined
- [ ] Mocking strategy for external dependencies defined

---

### Phase 3: Test Plan Creation

**Input**: QA Test Architecture

**Activities**:
1. Create comprehensive test plan document (QA_PLAN.md)
2. List all test cases with descriptions
3. Map tests to FRS requirements (traceability)
4. Map tests to architecture components
5. Define test priorities (which tests gate merge)
6. Define test execution environment requirements
7. Define test data requirements per test
8. Document expected Red state (how tests will fail initially)

**Output**: QA_PLAN.md (comprehensive test plan)

**Structure**:
```markdown
# QA Plan - [Project Name]

## Test Categories
### Category 1: [Name]
- **TC-001**: [Test Case Description]
  - **FRS**: [FR-XXX, FR-YYY]
  - **Architecture**: [Component/Layer]
  - **Type**: [Unit/Integration/E2E]
  - **Priority**: [P0-Critical/P1-High/P2-Medium/P3-Low]
  - **Expected Red**: [How will this fail initially?]
  - **Acceptance**: [What makes this test pass?]
```

**Completeness Criteria**:
- [ ] All test cases documented
- [ ] All test cases mapped to FRS requirements
- [ ] All test cases mapped to architecture components
- [ ] All test priorities assigned
- [ ] All test data requirements documented
- [ ] Expected Red state documented per test
- [ ] Acceptance criteria clear per test

---

### Phase 4: Test Implementation

**Input**: QA_PLAN.md

**Activities**:
1. Implement test infrastructure (helpers, fixtures, mocks)
2. Implement all test cases per QA_PLAN.md
3. Ensure test infrastructure is production-quality (not stubs)
4. Implement test data factories with realistic, varied data
5. Implement all mocks for external dependencies
6. Validate test isolation (tests don't interfere with each other)
7. Document any test limitations or assumptions

**Output**: Complete test suite (all tests implemented)

**Completeness Criteria**:
- [ ] All test cases from QA_PLAN.md implemented
- [ ] All test infrastructure complete (no stubs, no TODOs)
- [ ] Test data factories generate varied, realistic data
- [ ] All mocks implemented with realistic behavior
- [ ] Test isolation validated (can run in any order)
- [ ] No skipped tests (.skip, .todo, commented out)
- [ ] Zero test debt

---

### Phase 5: Red Validation

**Input**: Complete test suite

**Activities**:
1. Run complete test suite
2. Verify ALL tests FAIL (Red state)
3. Verify tests fail for the RIGHT reasons (testing what we think)
4. Verify no false positives (tests passing incorrectly)
5. Document Red state baseline
6. Fix any test infrastructure issues
7. Re-run to confirm consistent Red state

**Output**: Red QA Validation Report

**Red State Criteria** (all must be true):
- [ ] ALL tests run (no skipped tests)
- [ ] ALL tests FAIL (0% passing is expected)
- [ ] Tests fail for correct reasons (not infrastructure errors)
- [ ] Test failures are informative (clear what's missing)
- [ ] No false positives (no tests passing by accident)
- [ ] Test infrastructure stable (consistent results)

**Red State Validation**:
```bash
# Expected output:
Tests: 37 failed, 0 passed, 37 total
Status: RED (0% passing) ✅ EXPECTED
```

**Why Validate Red?**
- Confirms tests actually test something (not no-op tests)
- Proves gap exists (we haven't built it yet)
- Validates test infrastructure works
- Establishes baseline for Build-to-Green

---

### Phase 6: FM Approval

**Input**: Red QA Validation Report, QA_PLAN.md, Test suite

**Activities**:
1. FM reviews QA plan completeness
2. FM validates FRS traceability
3. FM verifies Red state validation
4. FM confirms zero test debt
5. FM approves QA-to-Red completion

**Output**: FM QA-to-Red Approval

**FM Approval Criteria**:
- [ ] QA_PLAN.md complete and comprehensive
- [ ] All FRS requirements have test coverage
- [ ] Test suite implemented and complete
- [ ] Red state validated and documented
- [ ] Zero test debt (no skips, stubs, or TODOs)
- [ ] Test infrastructure production-quality
- [ ] No architecture gaps preventing testing
- [ ] No FRS ambiguities blocking test definition

**If FM Rejects**:
- Identify gaps and missing tests
- Update QA_PLAN.md
- Implement missing tests
- Validate Red state again
- Resubmit for approval

---

## 3. QA Plan Structure (Canonical Template)

### 3.1 QA_PLAN.md Required Sections

```markdown
# QA Plan - [Project Name]

**Version**: [X.Y.Z]  
**Date**: [YYYY-MM-DD]  
**Status**: [Red Validation Pending | Red Validated | Green (Complete)]  
**FRS Version**: [X.Y.Z]  
**Architecture Version**: [X.Y.Z]

---

## 1. Executive Summary
[Test strategy overview, coverage summary, risk areas]

## 2. Test Categories
[Organized test suites by category]

### 2.1 [Category Name]
**Purpose**: [What this category tests]  
**Coverage**: [What FRS areas/components]

#### Test Cases
- **TC-XXX**: [Test Description]
  - **FRS**: [Requirement IDs]
  - **Architecture**: [Component]
  - **Type**: [Unit/Integration/E2E]
  - **Priority**: [P0/P1/P2/P3]
  - **Expected Red**: [How fails initially]
  - **Acceptance**: [Pass criteria]

## 3. Test Data Strategy
[Fixtures, factories, mocks]

## 4. Test Infrastructure
[Helpers, utilities, test environment]

## 5. Test Execution
[How to run tests, CI integration]

## 6. Traceability Matrix
[FRS Requirement → Test Cases mapping]

## 7. Coverage Analysis
[Coverage metrics and gaps]

## 8. Red Validation Results
[Red state validation evidence]

## 9. Build-to-Green Plan
[Wave mapping - which tests go green in each wave]
```

### 3.2 Test Case Template

**Every test case MUST include**:

```markdown
**TC-XXX**: [Clear, concise test description]

- **Description**: [What behavior is being tested]
- **FRS Requirement**: [FR-XXX, BR-YYY]
- **Architecture Component**: [Component/Layer being tested]
- **Test Type**: [Unit | Integration | E2E]
- **Priority**: [P0-Critical | P1-High | P2-Medium | P3-Low]

**Preconditions**:
- [What must be true before test runs]
- [Required test data]
- [System state]

**Test Steps**:
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Expected Result**:
- [What should happen]
- [Expected data/state]
- [Expected response]

**Expected Red Behavior**:
- [How will this fail before implementation?]
- [What error/failure is expected?]

**Acceptance Criteria** (for Green):
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Test Data**:
- [Specific test data needed]
- [Fixtures or factories used]

**Dependencies**:
- [Other tests this depends on]
- [External services/mocks]

**Notes**:
- [Any special considerations]
- [Edge cases covered]
```

---

## 4. Test Categories (Standard Classification)

### 4.1 Database Schema Compliance
**Purpose**: Verify database schema matches architecture  
**Coverage**: All entities, relationships, constraints  
**Type**: Integration tests

### 4.2 API Contract Compliance
**Purpose**: Verify API endpoints match specification  
**Coverage**: All endpoints, request/response schemas, errors  
**Type**: Integration tests

### 4.3 Authentication & Authorization
**Purpose**: Verify security controls work correctly  
**Coverage**: Login, permissions, session management  
**Type**: Integration tests

### 4.4 Business Logic
**Purpose**: Verify business rules enforced  
**Coverage**: All BR-XXX rules from FRS  
**Type**: Unit + Integration tests

### 4.5 Data Validation
**Purpose**: Verify input validation works  
**Coverage**: All validation rules from FRS  
**Type**: Unit tests

### 4.6 Data Flows
**Purpose**: Verify data flows correctly through system  
**Coverage**: All data flow paths from architecture  
**Type**: Integration tests

### 4.7 Frontend Components
**Purpose**: Verify UI components render and behave correctly  
**Coverage**: All UI components from architecture  
**Type**: Component tests

### 4.8 Integration Points
**Purpose**: Verify external integrations work  
**Coverage**: All external dependencies from architecture  
**Type**: Integration tests (with mocks)

### 4.9 Error Handling
**Purpose**: Verify error conditions handled correctly  
**Coverage**: All exception flows from FRS  
**Type**: Unit + Integration tests

### 4.10 Performance
**Purpose**: Verify performance requirements met  
**Coverage**: All non-functional requirements from FRS  
**Type**: Performance tests

### 4.11 Security
**Purpose**: Verify security requirements met  
**Coverage**: All security requirements from FRS  
**Type**: Security tests

### 4.12 Governance Compliance
**Purpose**: Verify governance requirements met  
**Coverage**: Test dodging, QA parking, policy sync  
**Type**: Governance tests

---

## 5. Test Infrastructure Requirements

### 5.1 Test Helpers and Utilities

**MUST be production-quality** (not stubs):
- User factories (create realistic test users)
- Data factories (generate varied, realistic data)
- Authentication helpers (login, session management)
- Database helpers (setup, teardown, fixtures)
- API helpers (request/response utilities)
- Mock services (external dependencies)
- Assertion helpers (custom assertions)

**Test Helper Quality Standards**:
- ✅ Fully implemented (no stubs, no TODOs)
- ✅ Generate varied data (not just one hardcoded case)
- ✅ Handle edge cases
- ✅ Well-documented
- ✅ Maintainable
- ✅ Reusable across tests

### 5.2 Test Data Strategy

**Fixtures**:
- Known, static test data for repeatable tests
- Stored in version control
- Loaded before test runs

**Factories**:
- Generate dynamic test data programmatically
- Support customization for specific test scenarios
- Generate realistic, varied data

**Mocks**:
- Simulate external dependencies
- Realistic behavior (not just "return true")
- Support different scenarios (success, failure, timeout, etc.)

### 5.3 Test Isolation

**Every test MUST**:
- Run independently (no dependencies on other tests)
- Clean up after itself (database, files, state)
- Not interfere with other tests (no shared mutable state)
- Be runnable in any order
- Be runnable in parallel (if infrastructure supports)

---

## 6. Red Validation Process

### 6.1 Red Validation Checklist

**Before declaring Red Validation complete**:

- [ ] All tests implemented (per QA_PLAN.md)
- [ ] All tests run successfully (no infrastructure errors)
- [ ] All tests FAIL (0% passing)
- [ ] Test failures are for correct reasons (testing real gaps)
- [ ] No false positives (no accidental passes)
- [ ] Test output is informative (clear what's missing)
- [ ] Test execution time acceptable (< X minutes)
- [ ] Test isolation verified (can run in any order)
- [ ] Zero test debt (no skips, stubs, TODOs)
- [ ] Test infrastructure complete and production-quality

### 6.2 Red Validation Evidence

**Document and commit**:
1. Test execution log showing all failures
2. Test summary (X failed, 0 passed, X total)
3. Red validation report with date and validator
4. Commit hash of Red validation baseline

**Example Red Validation Report**:
```markdown
# Red QA Validation Report

**Project**: PartPulse  
**Date**: 2025-12-16  
**Validator**: ForemanApp  
**QA Plan Version**: 1.0.0

## Test Execution Summary
- **Total Tests**: 37
- **Passed**: 0 (0%)
- **Failed**: 37 (100%)
- **Skipped**: 0
- **Execution Time**: 8.2 seconds

## Red State Validation: ✅ PASS

All tests fail as expected, proving the gap exists and tests are valid.

## Test Infrastructure Status
- Test helpers: Complete ✅
- Test data factories: Complete ✅
- Mocks: Complete ✅
- Test isolation: Verified ✅
- Zero test debt: Confirmed ✅

## Ready for Build-to-Green: ✅ YES

**Approval**: ForemanApp  
**Date**: 2025-12-16  
**Commit**: a1b2c3d4
```

---

## 7. Build-to-Green Planning

### 7.1 Wave Mapping

**After Red Validation**, map tests to implementation waves:

**Wave 1**: Foundation (database, API structure)  
**Tests**: TC-001 through TC-008 (8 tests)

**Wave 2**: Security (authentication, authorization)  
**Tests**: TC-009 through TC-013 (5 tests)

**Wave 3**: Business Logic (core features)  
**Tests**: TC-014 through TC-019 (6 tests)

...and so on.

**Wave Criteria**:
- Dependencies respected (foundation before features)
- Logical grouping (related functionality together)
- Risk-based (high-risk areas early)
- Incremental value (each wave delivers value)

### 7.2 Green = Done

**Build-to-Green Principle**:
- Wave 1 complete = TC-001 through TC-008 all GREEN
- Wave 2 complete = TC-009 through TC-013 all GREEN
- Project complete = ALL tests GREEN (100% passing)

**No Partial Credit**:
- 99% GREEN = NOT COMPLETE
- "Only 2 tests failing" = NOT COMPLETE
- GREEN or NOT GREEN (binary state)

---

## 8. FM Pre-Build Gate

**FM MUST BLOCK** wave planning and builder assignment if:

- [ ] QA_PLAN.md missing or incomplete
- [ ] Test suite not implemented
- [ ] Test infrastructure has stubs or TODOs
- [ ] Red validation not performed
- [ ] Red validation failed (tests passing incorrectly)
- [ ] Test debt exists (skips, TODOs, incomplete tests)
- [ ] FRS traceability gaps (requirements without tests)
- [ ] Architecture gaps preventing testing

**No Waivers**: QA-to-Red completion cannot be waived. If QA-to-Red is blocked, implementation is blocked.

---

## 9. Governance Enforcement

### 9.1 Governance Liaison Role

**Governance Liaison MUST**:
- Verify QA_PLAN.md exists and is complete
- Validate Red validation was performed
- Ensure zero test debt before FM gate
- Confirm FRS traceability completeness
- Block any attempt to bypass QA-to-Red

### 9.2 Builder Protection

**Builders MUST NOT**:
- Begin implementation without approved QA-to-Red plan
- Implement features not covered by tests
- Skip tests or create test debt
- Work around incomplete QA plan

**Builders MUST**:
- Use QA plan as implementation contract
- Build until tests pass (Green)
- STOP if QA gaps discovered during implementation
- ESCALATE to FM if QA plan incomplete or ambiguous

---

## 10. Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/QA_TO_RED_PLANNING_PROTOCOL.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- BUILD_PHILOSOPHY.md (Supreme Authority)
- BYG_DOCTRINE.md (Build-to-Green Doctrine)
- FM_EXECUTION_MANDATE.md
- Governance Liaison Agent Contract
- QA_POLICY_MASTER.md

---

## Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional Requirement)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: QA-to-Red planning is non-negotiable  
**Enforcement**: Governance Liaison + FM Pre-Build Gate
