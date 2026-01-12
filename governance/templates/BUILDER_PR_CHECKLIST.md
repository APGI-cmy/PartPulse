# Builder PR Checklist (Category 0, 8, 9)

**Purpose**: Mandatory checklist for Builder PRs  
**Version**: 2.0.0  
**Authority**: Execution Bootstrap Protocol + Builder Contract Obligations  
**Effective**: 2026-01-12

---

## Instructions

ALL builders MUST complete this checklist before submitting PR for FM review. Copy into PR description.

---

## Category 0: Execution Bootstrap Protocol (MANDATORY, v2.0.0+)

**Authority**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md

**7-Step Verification REQUIRED for PRs that create/modify**:
- Workflows (.github/workflows/*.yml)
- CI gates or checks
- Build scripts (package.json scripts)
- Test infrastructure
- Governance execution artifacts

**If this PR modifies execution artifacts, complete all steps**:

- [ ] **Step 1**: Identified ALL CI jobs from workflow files
- [ ] **Step 2**: Executed EVERY command locally
- [ ] **Step 3**: Documented results for EACH command
- [ ] **Step 4**: Fixed ALL failures
- [ ] **Step 5**: Verified 100% pass rate (local or justified exceptions)
- [ ] **Step 6**: Waited for GitHub Actions completion
- [ ] **Step 7**: Created PREHANDOVER_PROOF (comment on this PR)

**PREHANDOVER_PROOF Status**: 
- [ ] Provided (see comment below)
- [ ] Not Required (this PR does not modify workflows/gates/execution artifacts)

**Hard Stop**: If execution artifacts modified but Category 0 incomplete, PR is BLOCKED.

---

## Category 8: Builder Core Obligations

**Authority**: Builder contract (.github/agents/[builder-name].md), BUILD_PHILOSOPHY.md

### Architecture Conformance
- [ ] Implementation exactly matches frozen architecture
- [ ] No architectural decisions made independently
- [ ] No scope creep beyond assigned task
- [ ] Design Freeze respected (T0-004)

### Build-to-Green Execution
- [ ] Built to GREEN on first attempt (no iteration to solution)
- [ ] All assigned QA-to-Red tests now passing
- [ ] No new test failures introduced
- [ ] 100% test pass rate achieved

### Zero Test Debt
- [ ] No test skipping (.skip, .only, xtest, etc.)
- [ ] No commented-out tests
- [ ] No test stubs or placeholders
- [ ] All tests complete and executable
- [ ] Test dodging detection passes

### Zero Warnings
- [ ] ESLint: 0 errors, 0 warnings
- [ ] TypeScript: 0 type errors, 0 warnings
- [ ] Build: No build warnings
- [ ] Deprecation: No deprecated API usage

### Code Quality
- [ ] All code checked and verified
- [ ] No placeholder comments ("TODO", "FIXME", "HACK")
- [ ] No debug code or console.logs left behind
- [ ] Proper error handling implemented
- [ ] Types properly defined (no `any` without justification)

### Scope Boundaries
- [ ] Only modified files within builder's allowed paths
- [ ] No modifications to governance/** (escalate to FM if needed)
- [ ] No modifications to .github/agents/** (escalate if needed)
- [ ] No modifications to other builders' domains

---

## Category 9: Builder Handover Requirements

**Authority**: Builder contracts, FM_BUILDER_APPOINTMENT_PROTOCOL.md

### Test Evidence
- [ ] All assigned tests passing (show proof)
- [ ] Test output captured and documented
- [ ] Coverage maintained or improved
- [ ] Integration tests passing (if applicable)

### Local Verification
- [ ] `npm run lint` - PASSED (0 errors, 0 warnings)
- [ ] `npm run build` - PASSED (builds successfully)
- [ ] `npm run test` - PASSED (all tests green)
- [ ] `npm run lint:deprecation` - PASSED (if applicable)
- [ ] All local checks documented with evidence

### CI Verification
- [ ] Pushed changes to trigger CI
- [ ] Waited for ALL workflows to complete
- [ ] qa-enforcement.yml - ALL jobs PASSED
- [ ] deprecation-detection.yml - PASSED (if applicable)
- [ ] CI run URLs captured

### Documentation
- [ ] Code comments added where needed
- [ ] Complex logic explained
- [ ] API documentation updated (if applicable)
- [ ] Architecture conformance documented

### Prior Debt Handling
**If prior debt discovered during implementation**:
- [ ] Prior debt reported to FM immediately
- [ ] Work STOPPED until FM re-assigns responsibility
- [ ] Did NOT fix prior debt outside my scope
- [ ] Escalation documented

---

## Builder Self-Verification

### Quality Confirmation
- [ ] I confirm implementation matches frozen architecture exactly
- [ ] I confirm all tests passing (100% GREEN)
- [ ] I confirm zero test debt
- [ ] I confirm zero warnings
- [ ] I confirm local verification completed

### Evidence Checklist
- [ ] Test output included in PR description or comment
- [ ] Local check results documented
- [ ] CI run URLs provided
- [ ] PREHANDOVER_PROOF provided (if applicable)

### Handover Declaration
**I hereby confirm**:
- All assigned tasks completed
- Build-to-GREEN achieved on first attempt
- All quality gates satisfied
- Ready for FM review and merge

**Builder**: [Agent Name]  
**Date**: [YYYY-MM-DD]  
**Assignment**: [Issue/Task Number]

---

## Special Categories (If Applicable)

### If Removing Tests
**Authority**: governance/policies/TEST_REMOVAL_GOVERNANCE_GATE_LOCAL.md

- [ ] Test removal authorized by FM
- [ ] Traceability analysis completed
- [ ] Documentation provided
- [ ] FM approval documented in issue/PR

### If Suppressing Warnings
**Authority**: governance/policies/ZERO_WARNING_TEST_DEBT_IMMEDIATE_REMEDY_DOCTRINE.md

- [ ] Warning suppression NOT used (prohibited for builders)
- [ ] All warnings fixed (not suppressed)
- [ ] If cannot fix, escalated to FM

---

## Escalation Protocol

**If any checks fail or cannot be completed**:

1. **STOP** - Do not proceed with handover
2. **DOCUMENT** - Describe what is failing and why
3. **ESCALATE** - Report to FM immediately
4. **WAIT** - Do not attempt workarounds or shortcuts

**Escalation Paths**:
- Technical blockers → FM
- Governance questions → FM → Governance Liaison
- Scope conflicts → FM
- Prior debt discovery → FM (IMMEDIATE)

---

## Builder Classes (Domain-Specific)

### API Builder
- [ ] API routes implemented per architecture
- [ ] Business logic correct
- [ ] Data validation complete
- [ ] Error handling implemented
- [ ] No frontend logic added

### UI Builder
- [ ] Components match architecture spec
- [ ] Layouts implemented correctly
- [ ] Styling complete
- [ ] Accessibility considered
- [ ] No backend logic added

### QA Builder
- [ ] Test suite comprehensive
- [ ] All requirements covered
- [ ] Test infrastructure solid
- [ ] Coverage targets met
- [ ] No production code modified

### Schema Builder
- [ ] Database schema correct
- [ ] Migrations created
- [ ] Constraints defined
- [ ] Indexes optimized
- [ ] No application logic added

### Integration Builder
- [ ] Integrations implemented per spec
- [ ] External APIs called correctly
- [ ] Error handling robust
- [ ] Retry logic appropriate
- [ ] No domain logic added

---

## References

- **Protocol**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md
- **Template**: governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
- **Builder Contract**: .github/agents/[your-builder-name].md
- **Build Philosophy**: BUILD_PHILOSOPHY.md
- **FM Appointment**: governance/ROLE_APPOINTMENT_PROTOCOL.md

---

## Final Check

Before requesting FM review:

- [ ] All categories completed (0, 8, 9)
- [ ] PREHANDOVER_PROOF provided (if applicable)
- [ ] All tests GREEN (100%)
- [ ] Zero test debt
- [ ] Zero warnings
- [ ] Evidence documented
- [ ] Ready for merge

**If any item unchecked, do NOT request review. Fix or escalate first.**

---

**Version**: 2.0.0  
**Effective**: 2026-01-12  
**Applies To**: All builder agents (API, UI, QA, Schema, Integration)

---

**This checklist is MANDATORY for all builder PRs. Incomplete checklists will be rejected by FM.**
