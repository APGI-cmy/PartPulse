# FM Gate Readiness Checklist

**Document ID**: FM-GATE-READY-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active Template  
**Authority**: Maturion Foreman Governance  
**Purpose**: FM prepares merge gate before builder PRs

---

## Purpose

This checklist ensures that FM establishes merge gate infrastructure and requirements **before** builders create PRs. This prevents builders from submitting work only to discover missing gate requirements, unclear standards, or unready infrastructure.

**FM Responsibility**: FM MUST complete this checklist before authorizing builders to create PRs.

---

## FM Gate Readiness Checklist

### Section 1: CI/CD Infrastructure

#### 1.1 Required CI Workflows Configured
- [ ] Test execution workflow (runs all tests)
- [ ] Test dodging detection workflow
- [ ] QA parking validation workflow
- [ ] Governance policy sync check workflow
- [ ] Build/compilation workflow
- [ ] Linting workflow
- [ ] Type checking workflow
- [ ] Security scanning workflow (if applicable)
- [ ] Deployment validation workflow (if applicable)

**Location**: `.github/workflows/`  
**Evidence**: All workflow files present and tested

---

#### 1.2 CI Workflow Testing Complete
- [ ] All workflows tested on feature branch
- [ ] All workflows pass successfully
- [ ] Workflow failure notifications configured
- [ ] Workflow required status checks configured
- [ ] No flaky workflows (consistent results)

**Evidence**: Links to successful test runs for each workflow

---

#### 1.3 Branch Protection Rules Configured
- [ ] Main branch protected
- [ ] Require pull request before merge
- [ ] Require approvals (number specified)
- [ ] Dismiss stale approvals on new commits
- [ ] Require status checks to pass before merge
- [ ] Require branches to be up to date before merge
- [ ] Include administrators in restrictions
- [ ] Restrict who can push to main branch

**Evidence**: Screenshot or export of branch protection rules

---

### Section 2: Governance Tooling

#### 2.1 Test Dodging Detection
- [ ] Script present: `qa/detect-test-dodging.js`
- [ ] Script tested and working
- [ ] Detects `.skip()`, `.todo()`
- [ ] Detects commented-out tests
- [ ] Detects `|| true` bypasses
- [ ] CI integration configured
- [ ] Failure notifications configured

**Evidence**: Test run showing detection working

---

#### 2.2 QA Parking Validation
- [ ] Registry present: `qa/parking/registry.json`
- [ ] Schema present: `qa/parking/registry-schema.json`
- [ ] Watcher present: `qa/parking/watcher.js`
- [ ] Watcher tested and working
- [ ] CI integration configured
- [ ] Validation rules enforced (owner, expiry, issue)

**Evidence**: Test run showing validation working

---

#### 2.3 Governance Sync Checker
- [ ] Script present: `qa/governance/sync-checker.js`
- [ ] GOVERNANCE_VERSION.md present
- [ ] Policy version documented
- [ ] Sync check tested and working
- [ ] CI integration configured

**Evidence**: Test run showing sync check working

---

### Section 3: QA Infrastructure

#### 3.1 Test Framework Configured
- [ ] Test framework installed (Jest, Vitest, etc.)
- [ ] Test configuration file present
- [ ] Test scripts in package.json
- [ ] Test execution command documented
- [ ] Test isolation configured
- [ ] Test parallelization configured (if applicable)

**Evidence**: `package.json` scripts, config files

---

#### 3.2 Test Infrastructure Present
- [ ] Test helper functions available
- [ ] Test data factories available
- [ ] Mock utilities available
- [ ] Database test helpers available
- [ ] API test helpers available
- [ ] Authentication test helpers available

**Location**: `__tests__/helpers/` or equivalent  
**Evidence**: Files present and functional

---

#### 3.3 Test Execution Validated
- [ ] Tests can run locally
- [ ] Tests can run on CI
- [ ] Test execution time acceptable
- [ ] Test output clear and informative
- [ ] Test failures easy to debug

**Evidence**: Local test run + CI test run

---

### Section 4: Documentation & Standards

#### 4.1 Implementation Standards Documented
- [ ] Coding standards documented
- [ ] Code review checklist available
- [ ] Architecture guide available
- [ ] API specification available
- [ ] Database schema documented
- [ ] Security requirements documented

**Location**: `architecture/IMPLEMENTATION_GUIDE.md` and related docs  
**Evidence**: All documents present and current

---

#### 4.2 Merge Requirements Documented
- [ ] Gate-Eligible GREEN definition documented
- [ ] Required CI checks listed
- [ ] Approval requirements documented
- [ ] Documentation requirements listed
- [ ] Evidence requirements listed

**Location**: This checklist + T0-014 Merge Gate Canon  
**Evidence**: Documentation complete

---

#### 4.3 Builder Guidance Documented
- [ ] How to run tests locally
- [ ] How to check CI status
- [ ] When to STOP and escalate
- [ ] How to request merge review
- [ ] What evidence to provide
- [ ] Pre-handover checklist available

**Location**: `docs/BUILDER_GUIDE.md` or in agent contracts  
**Evidence**: Documentation available

---

### Section 5: Escalation Paths

#### 5.1 Escalation Procedures Defined
- [ ] When to escalate documented
- [ ] How to escalate documented
- [ ] Who to escalate to documented
- [ ] Escalation template provided
- [ ] Response time expectations documented

**Location**: `governance/escalation/ESCALATION_POLICY.md`  
**Evidence**: Policy present and clear

---

#### 5.2 Issue Templates Configured
- [ ] Catastrophic failure template
- [ ] QA parking request template
- [ ] Design-phase RED template
- [ ] Builder escalation template
- [ ] Bug report template

**Location**: `.github/ISSUE_TEMPLATE/`  
**Evidence**: All templates present

---

### Section 6: Validation & Evidence

#### 6.1 Gate Validation Tested
- [ ] Build gate tested (compilation, type check, lint)
- [ ] QA gate tested (all tests passing scenario)
- [ ] QA gate tested (failing test scenario - should block)
- [ ] Governance gate tested (test dodging detection)
- [ ] Governance gate tested (QA parking validation)
- [ ] Architecture gate approach defined
- [ ] Security gate approach defined
- [ ] CI gate tested (all workflows)

**Evidence**: Test results for each gate component

---

#### 6.2 Evidence Collection Process
- [ ] Evidence location defined (where to put logs, reports)
- [ ] Evidence format defined (markdown, logs, screenshots)
- [ ] Evidence requirements documented per gate
- [ ] Evidence review process defined

**Location**: FM procedures or this document  
**Evidence**: Process documented

---

### Section 7: Communication

#### 7.1 Builder Notification
- [ ] Gate requirements communicated to builders
- [ ] Gate readiness announced
- [ ] Documentation links provided
- [ ] Support/escalation contacts provided
- [ ] Q&A session held (if needed)

**Evidence**: Communication record (issue comment, doc, etc.)

---

#### 7.2 Stakeholder Notification
- [ ] Johan notified of gate readiness
- [ ] Governance Liaison notified
- [ ] Other stakeholders notified (if applicable)

**Evidence**: Notification record

---

## FM Gate Readiness Declaration

**Once all items above are complete**, FM issues this declaration:

```markdown
# FM Gate Readiness Declaration

**Project**: [Project Name]
**Date**: [YYYY-MM-DD]
**FM Authority**: [FM Name/ID]

---

## Declaration

I declare that the merge gate infrastructure is **READY** for builder PRs.

All gate components have been configured, tested, and validated. Builders may now create pull requests with confidence that:

1. All gate requirements are clear and documented
2. All CI workflows are configured and tested
3. All governance tooling is functional
4. All documentation and standards are available
5. All escalation paths are defined

---

## Gate Components Status

| Component | Status | Evidence |
|-----------|--------|----------|
| CI/CD Infrastructure | ✅ READY | [links to workflows] |
| Governance Tooling | ✅ READY | [links to test runs] |
| QA Infrastructure | ✅ READY | [links to test framework] |
| Documentation | ✅ READY | [links to docs] |
| Escalation Paths | ✅ READY | [link to policy] |
| Validation | ✅ COMPLETE | [links to test results] |

---

## Builder Authorization

Builders are **AUTHORIZED** to create PRs for:
- [Wave X]: [Tests TC-XXX through TC-YYY]
- [Wave Y]: [Tests TC-AAA through TC-BBB] (after Wave X complete)

---

## Merge Gate Requirements Summary

**Gate-Eligible GREEN** requires:
- ✅ 100% tests passing (no exceptions)
- ✅ All CI workflows GREEN
- ✅ Zero test dodging violations
- ✅ Zero test debt
- ✅ All governance checks passing
- ✅ Architecture compliance validated
- ✅ Security requirements met
- ✅ All documentation updated
- ✅ All evidence provided

---

## Support & Escalation

**For questions or issues**:
- Review documentation: [links]
- Check examples: [links]
- Escalate to FM: [contact/tag]
- Emergency: [process]

---

## FM Approval

**Status**: ✅ GATE READY FOR BUILDER PRs

**Approved By**: [FM Name/ID]  
**Approval Date**: [YYYY-MM-DD]  
**Valid For**: [Wave X, Wave Y, etc.]

---

**Builders may now proceed to create PRs.**

Signed: [FM Authority]
Date: [YYYY-MM-DD]
```

---

## Usage Instructions

### For FM

**Before authorizing ANY builder PRs**:
1. Complete this entire checklist systematically
2. Test all gate components
3. Validate all workflows passing
4. Ensure all documentation available
5. Issue Gate Readiness Declaration
6. Communicate to builders
7. Monitor initial PRs closely for any gate issues

**Do NOT authorize builder PRs if**:
- Any checklist item incomplete
- Any gate component not tested
- Any workflow failing
- Documentation gaps exist
- Escalation paths undefined

### For Builders

**Before creating PR**:
1. Verify FM has issued Gate Readiness Declaration
2. Review all gate requirements
3. Review all documentation
4. Understand escalation procedures
5. Complete your assigned work
6. Self-validate using pre-handover checklist
7. Create PR only when confident of GREEN

**If gate readiness unclear**:
- STOP before creating PR
- Request clarification from FM
- Do NOT create PR hoping to figure it out

---

## Canonical Reference

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/templates/FM_GATE_READINESS_CHECKLIST.md  
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
**Usage**: Mandatory for FM before builder PRs authorized

---

**Gate Readiness First**: Never rush to implementation. Prepare the gate, then authorize the work.
