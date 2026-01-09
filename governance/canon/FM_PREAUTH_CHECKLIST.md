# FM Pre-Authorization Checklist

**Document ID**: FM-PREAUTH-CHECKLIST-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Referenced In**: BL-020, FM_EXECUTION_MANDATE.md

---

## Purpose

This checklist defines the **mandatory pre-authorization requirements** that FM (Foreman) MUST verify before authorizing wave planning, builder assignment, or any implementation work to begin. This is the **FM Pre-Build Gate** that ensures all foundational work is complete before execution begins.

**FM Authority**: NO wave planning, builder assignment, or implementation may begin until ALL items on this checklist are verified and approved by FM.

---

## Constitutional Principle

**From BL-020 (Bootstrap Learning)**:
> "FM pre-authorization is not bureaucracy—it is insurance against rework. Every hour spent validating readiness saves days of implementation waste."

**From BUILD_PHILOSOPHY.md**:
> "One-Time Fully Functional Builds require complete preparation. Rushing to implementation without preparation guarantees rework."

**From FM_EXECUTION_MANDATE.md**:
> "FM has autonomous authority to BLOCK any work that violates pre-build requirements. No exceptions, no waivers, no 'just this once'."

---

## FM Pre-Authorization Checklist

**Status Legend**:
- ✅ = Verified and approved
- ⏳ = In progress
- ❌ = Incomplete or failed
- 🚫 = Blocked (cannot proceed)

---

### Section 1: Foundational Documentation

#### 1.1 Application Description
- [ ] APP_DESCRIPTION.md exists
- [ ] APP_DESCRIPTION.md is comprehensive (all required sections)
- [ ] Purpose and value proposition clearly defined
- [ ] All user roles and personas documented
- [ ] All workflows defined
- [ ] All data entities identified
- [ ] Security expectations documented
- [ ] Compliance requirements documented
- [ ] APP_DESCRIPTION.md approved by FM

**Evidence Required**:
- File path: `APP_DESCRIPTION.md`
- File size: [minimum ~30KB for typical application]
- Last modified date
- FM approval record

**Blocker if Not Met**: 🚫 CANNOT proceed to architecture or requirements

---

#### 1.2 Functional Requirements Specification (FRS)
- [ ] FRS document exists (using canonical template)
- [ ] All functional requirements documented with FR-XXX IDs
- [ ] All business rules documented with BR-XXX IDs
- [ ] All data requirements documented
- [ ] All integration requirements documented
- [ ] All non-functional requirements documented
- [ ] All user roles mapped to requirements
- [ ] All acceptance criteria defined
- [ ] All ambiguities resolved (no "TBD" or "TODO")
- [ ] FRS approved by FM

**Evidence Required**:
- File path: `governance/templates/FRS_[PROJECT].md` or similar
- Requirements count: [X functional requirements]
- Traceability to APP_DESCRIPTION verified
- FM approval record

**Blocker if Not Met**: 🚫 CANNOT proceed to architecture design

---

### Section 2: Architecture Freeze

#### 2.1 Architecture Documentation Complete
- [ ] All 11 mandatory architecture documents exist:
  - [ ] ARCHITECTURE.md (master)
  - [ ] DATABASE_SCHEMA.md
  - [ ] API_SPECIFICATION.md
  - [ ] FRONTEND_COMPONENTS.md
  - [ ] COMPONENT_BOUNDARIES.md
  - [ ] DATA_FLOW.md
  - [ ] SECURITY_ARCHITECTURE.md
  - [ ] AUDIT_LOGGING.md
  - [ ] EXTERNAL_DEPENDENCIES.md
  - [ ] DEPLOYMENT_GUIDE.md
  - [ ] IMPLEMENTATION_GUIDE.md
- [ ] All architecture documents complete (no "TBD", "TODO", or placeholders)
- [ ] All diagrams included where required
- [ ] All cross-references between documents valid
- [ ] Architecture version documented

**Evidence Required**:
- All 11 files present in `architecture/` directory
- Total documentation size: [minimum ~250KB for typical application]
- No grep results for "TODO", "TBD", "FIXME" in architecture files

**Blocker if Not Met**: 🚫 CANNOT proceed to QA planning

---

#### 2.2 FRS-to-Architecture Traceability
- [ ] Every FRS requirement mapped to architecture component
- [ ] Every data requirement mapped to database schema
- [ ] Every integration requirement mapped to external dependencies
- [ ] Every UI requirement mapped to frontend components
- [ ] Every security requirement mapped to security architecture
- [ ] No orphaned requirements (FRS without architecture)
- [ ] No orphaned architecture (architecture without FRS backing)
- [ ] Traceability matrix complete

**Evidence Required**:
- Traceability matrix document or section
- 100% coverage: [X FRS requirements] → [Y architecture components]
- No gaps identified

**Blocker if Not Met**: 🚫 CANNOT proceed to QA planning

---

#### 2.3 Architecture Review Completed
- [ ] Architecture review performed
- [ ] All review comments addressed
- [ ] No unresolved architecture conflicts
- [ ] No unresolved architecture gaps
- [ ] Technology stack validated
- [ ] Scalability validated
- [ ] Security validated
- [ ] Performance validated
- [ ] Testability validated
- [ ] Architecture review approved by technical authority
- [ ] Architecture review approved by FM

**Evidence Required**:
- Architecture review document or record
- Reviewer: [Name/Role]
- Review date: [Date]
- All action items closed
- FM approval record

**Blocker if Not Met**: 🚫 CANNOT proceed to QA planning

---

#### 2.4 Architecture Freeze Declaration
- [ ] Architecture freeze formally declared
- [ ] Freeze date recorded
- [ ] Architecture documents marked read-only (version controlled)
- [ ] Change control process established for post-freeze changes
- [ ] All stakeholders notified of freeze

**Evidence Required**:
- Architecture freeze declaration document or commit message
- Freeze date: [Date]
- Notification record

**Blocker if Not Met**: 🚫 CANNOT proceed to implementation

---

### Section 3: QA-to-Red Complete

#### 3.1 QA Plan Documentation
- [ ] QA_PLAN.md exists (using canonical structure)
- [ ] All test categories defined
- [ ] All test cases documented with TC-XXX IDs
- [ ] All test cases include clear descriptions
- [ ] All test cases include acceptance criteria
- [ ] All test cases include expected Red behavior
- [ ] Test data strategy documented
- [ ] Test infrastructure requirements documented
- [ ] Test execution strategy documented
- [ ] QA_PLAN version matches FRS and Architecture versions

**Evidence Required**:
- File path: `qa/QA_PLAN.md`
- Test count: [X test cases]
- Minimum file size: [~20KB for typical application]

**Blocker if Not Met**: 🚫 CANNOT proceed to test implementation

---

#### 3.2 FRS-to-QA Traceability
- [ ] Every FRS requirement has at least one test case
- [ ] Every business rule has test coverage
- [ ] Every data validation rule has test coverage
- [ ] Every error condition has test coverage
- [ ] Every integration point has test coverage
- [ ] Every UI interaction has test coverage
- [ ] No untested requirements
- [ ] Traceability matrix complete (FRS → QA)

**Evidence Required**:
- Traceability matrix in QA_PLAN.md
- Coverage: 100% of FRS requirements
- Gap analysis: No gaps

**Blocker if Not Met**: 🚫 CANNOT proceed to test implementation

---

#### 3.3 Architecture-to-QA Traceability
- [ ] Every architecture component has test coverage
- [ ] Every API endpoint has test coverage
- [ ] Every database entity has test coverage
- [ ] Every integration point has test coverage
- [ ] Every security control has test coverage
- [ ] Every data flow has test coverage
- [ ] No untested architecture
- [ ] Traceability matrix complete (Architecture → QA)

**Evidence Required**:
- Traceability matrix in QA_PLAN.md
- Coverage: 100% of architecture components
- Gap analysis: No gaps

**Blocker if Not Met**: 🚫 CANNOT proceed to test implementation

---

#### 3.4 Test Suite Implementation Complete
- [ ] All test cases from QA_PLAN.md implemented
- [ ] Test infrastructure complete (helpers, fixtures, mocks)
- [ ] Test infrastructure is production-quality (not stubs)
- [ ] Test data factories generate varied, realistic data
- [ ] All mocks implemented with realistic behavior
- [ ] Test isolation validated (tests run in any order)
- [ ] Zero test debt (no .skip, .todo, commented tests)
- [ ] No TODOs or placeholders in test code
- [ ] All test files committed to version control

**Evidence Required**:
- All test files present in `__tests__/` or `qa/` directory
- Test count matches QA_PLAN.md
- No grep results for ".skip", ".todo", "TODO", "FIXME" in test files
- Test infrastructure complete (no stub implementations)

**Blocker if Not Met**: 🚫 CANNOT proceed to Red validation

---

#### 3.5 Red Validation Complete
- [ ] Full test suite executed
- [ ] ALL tests FAIL (0% passing - expected Red state)
- [ ] Tests fail for correct reasons (testing real gaps, not infrastructure errors)
- [ ] No false positives (no tests passing incorrectly)
- [ ] Test output informative (clear what's missing)
- [ ] Test execution time acceptable
- [ ] Red validation report created
- [ ] Red validation evidence committed (test output, logs)
- [ ] Red validation approved by FM

**Evidence Required**:
- Red validation report document
- Test execution log: [X failed, 0 passed, X total]
- Validator: [FM or designated QA authority]
- Validation date: [Date]
- Commit hash of Red baseline

**Blocker if Not Met**: 🚫 CANNOT proceed to wave planning or implementation

---

### Section 4: Governance Alignment

#### 4.1 Governance Synchronization
- [ ] Governance version documented (GOVERNANCE_VERSION.md)
- [ ] All canonical governance files synced from upstream
- [ ] BUILD_PHILOSOPHY.md present and current
- [ ] Agent contracts current and reference canonical governance
- [ ] Policy documents current
- [ ] No governance conflicts or gaps
- [ ] Governance sync validated by Governance Liaison

**Evidence Required**:
- GOVERNANCE_VERSION.md file
- Current version: [X.Y.Z]
- Sync date: [Date]
- Governance Liaison approval

**Blocker if Not Met**: ⚠️ WARNING - May proceed with caution, but must resolve before merge

---

#### 4.2 CI/CD Infrastructure
- [ ] CI workflows configured (.github/workflows/)
- [ ] Test execution workflow configured
- [ ] Test dodging detection configured
- [ ] QA parking validation configured
- [ ] Governance policy sync check configured
- [ ] Merge gate workflow configured
- [ ] All CI checks tested and validated
- [ ] CI failure notifications configured

**Evidence Required**:
- All workflow files present
- Test CI run: [Link to successful test run]
- All gates tested: [Evidence]

**Blocker if Not Met**: ⚠️ WARNING - May proceed with caution, but must resolve before merge

---

#### 4.3 Issue Templates and Governance Tooling
- [ ] Issue templates configured (.github/ISSUE_TEMPLATE/)
- [ ] Catastrophic failure template present
- [ ] QA parking template present
- [ ] Design-phase RED template present
- [ ] Governance scripts present (qa/governance/)
- [ ] Test dodging detector present (qa/detect-test-dodging.js)
- [ ] QA parking watcher present (qa/parking/watcher.js)

**Evidence Required**:
- All templates and scripts present
- Scripts tested: [Evidence]

**Blocker if Not Met**: ⚠️ WARNING - May proceed with caution, but must resolve before merge

---

### Section 5: Wave Planning Readiness

#### 5.1 Build-to-Green Wave Plan
- [ ] Wave plan created (BUILD_TO_GREEN.md or in QA_PLAN.md)
- [ ] Tests mapped to waves
- [ ] Wave dependencies identified
- [ ] Wave priorities assigned
- [ ] Estimated completion per wave
- [ ] Risk assessment per wave
- [ ] Builder skill requirements per wave identified

**Evidence Required**:
- Wave plan document
- Number of waves: [X]
- Test distribution: Wave 1 ([Y] tests), Wave 2 ([Z] tests), etc.

**Blocker if Not Met**: 🚫 CANNOT assign builders or create wave issues

---

#### 5.2 Builder Role Identification
- [ ] Required builder types identified (UI, API, Schema, QA, Integration)
- [ ] Builder skill requirements documented per wave
- [ ] Builder capacity estimated
- [ ] Builder escalation paths defined
- [ ] Builder onboarding materials prepared

**Evidence Required**:
- Builder requirements document
- Skill matrix: [Builder type] → [Required skills]
- Agent contracts for builders present (.github/agents/)

**Blocker if Not Met**: 🚫 CANNOT assign builders

---

#### 5.3 Issue Creation Readiness
- [ ] Issue templates prepared for wave tasks
- [ ] Issue labeling strategy defined
- [ ] Issue assignment strategy defined
- [ ] Issue tracking approach defined
- [ ] Acceptance criteria template prepared

**Evidence Required**:
- Issue creation plan or template
- Label strategy documented

**Blocker if Not Met**: ⚠️ May proceed but must resolve before creating issues

---

### Section 6: Risk Assessment

#### 6.1 Technical Risk Assessment
- [ ] Technical risks identified
- [ ] Risk mitigation strategies defined
- [ ] High-risk areas identified for early attention
- [ ] External dependency risks assessed
- [ ] Performance risks assessed
- [ ] Security risks assessed

**Evidence Required**:
- Risk register or assessment document
- Risk count: [X risks identified]
- All high/critical risks have mitigation plans

**Blocker if Not Met**: ⚠️ WARNING - May proceed with caution, escalate high risks to FM

---

#### 6.2 Schedule and Capacity Risk
- [ ] Timeline estimated
- [ ] Resource capacity assessed
- [ ] Schedule risks identified
- [ ] Buffer/contingency planned
- [ ] Escalation thresholds defined

**Evidence Required**:
- Schedule estimate
- Capacity plan
- Risk factors documented

**Blocker if Not Met**: ⚠️ WARNING - May proceed, but monitor closely

---

### Section 7: FM Final Authorization

#### 7.1 Completeness Validation
- [ ] All blockers (🚫) resolved
- [ ] All warnings (⚠️) acknowledged and accepted
- [ ] All evidence collected and verified
- [ ] All traceability matrices validated
- [ ] All documentation complete and approved
- [ ] Zero architectural gaps
- [ ] Zero QA gaps
- [ ] Zero test debt

**FM Validation**:
- Validator: [FM Name/ID]
- Validation date: [Date]
- Validation notes: [Any concerns or conditions]

---

#### 7.2 Governance Liaison Sign-Off
- [ ] Governance Liaison reviewed all governance items
- [ ] No governance violations detected
- [ ] All canonical requirements met
- [ ] All constitutional requirements met
- [ ] Governance Liaison approves proceeding to implementation

**Governance Liaison Sign-Off**:
- Liaison: [Name/ID]
- Sign-off date: [Date]
- Notes: [Any governance considerations]

---

#### 7.3 FM Pre-Authorization Declaration

**Status**: [PENDING | APPROVED | REJECTED]

**If APPROVED**:
```
FM PRE-AUTHORIZATION GRANTED

Authorization ID: [Unique ID]
Date: [Date]
FM Authority: [FM Name/ID]
Governance Liaison: [Name/ID]

Authorized Activities:
- [X] Wave planning may begin
- [X] Builder assignment may occur
- [X] Implementation work may commence
- [X] Issue creation authorized

Conditions:
- [Any conditions or constraints]

This authorization is valid for this project/wave. Any significant changes to 
FRS, Architecture, or QA Plan require re-authorization.

Signed: [FM Authority]
Date: [Date]
```

**If REJECTED**:
```
FM PRE-AUTHORIZATION DENIED

Date: [Date]
FM Authority: [FM Name/ID]

Blockers Identified:
1. [Blocker 1 description]
2. [Blocker 2 description]
...

Required Actions:
1. [Action 1]
2. [Action 2]
...

Re-authorization required after blockers resolved.

Signed: [FM Authority]
Date: [Date]
```

---

## Usage Instructions

### For FM (Foreman)

**Before authorizing any wave planning or builder assignment**:
1. Review this checklist systematically, section by section
2. Verify evidence for each item
3. Mark each item as ✅, ⏳, ❌, or 🚫
4. Identify all blockers (🚫) - these MUST be resolved
5. Assess all warnings (⚠️) - determine if acceptable risk
6. Collect all evidence in authorization package
7. If all blockers resolved and warnings acceptable: **APPROVE**
8. If any critical blocker remains: **REJECT** with clear remediation path
9. Document authorization decision
10. Communicate decision to all stakeholders

**Do NOT authorize if**:
- Any 🚫 blocker unresolved
- Significant ⚠️ warnings create unacceptable risk
- Missing traceability (FRS → Architecture → QA)
- Test debt exists
- Architecture not frozen
- Red validation not complete or failed

### For Governance Liaison

**Before FM authorization review**:
1. Pre-validate all governance items (Section 4)
2. Verify all canonical governance synced
3. Ensure zero governance violations
4. Validate all constitutional requirements met
5. Provide sign-off to FM for Section 4 items
6. Flag any governance concerns to FM

**Do NOT sign off if**:
- Governance not synced with canonical sources
- Constitutional requirements not met
- Test debt exists
- Red validation incomplete

### For Builders

**Before starting implementation work**:
1. Verify FM pre-authorization was granted
2. Review authorization conditions
3. Confirm wave assignment received
4. Understand which tests must go GREEN in your wave
5. Review all relevant architecture documents
6. Review all relevant test cases
7. Do NOT proceed if authorization not granted

**If you discover gaps during implementation**:
1. STOP work immediately
2. Document gap clearly
3. ESCALATE to FM
4. Do NOT work around gaps
5. Wait for FM resolution before continuing

---

## Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/FM_PREAUTH_CHECKLIST.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- BL-020: FM Pre-Authorization Learning
- FM_EXECUTION_MANDATE.md
- BUILD_PHILOSOPHY.md
- Governance Liaison Agent Contract
- ForemanApp Agent Contract

---

## Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional Requirement)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: FM pre-authorization is non-negotiable  
**Enforcement**: FM + Governance Liaison (joint authority)
