# AGENT TEST EXECUTION PROTOCOL

**Status**: Canonical Governance Runbook  
**Protocol ID**: AGENT_TEST_EXECUTION_PROTOCOL  
**Version**: 1.0.0  
**Authority**: Governance Administrator (Layer-Down from maturion-foreman-governance)  
**Effective Date**: 2026-01-13  
**Compliance Deadline**: 2026-01-27  
**Purpose**: Mandatory local test execution and validation before PR creation/handover

---

## Authority and Scope

This protocol is layered down from canonical governance and is binding for all builder agents operating in this repository.

**Binding For**:
- All builder agents (API, UI, QA, Schema, Integration)
- Foreman (FM) agents
- Any agent creating PRs with code changes

---

## Core Principle: CI is Confirmation, NOT Diagnostic

**Fundamental Rule**: Agents MUST execute and validate all tests locally BEFORE creating a PR or handing over work. CI serves only as confirmation that local validation was correct, NOT as a diagnostic tool to discover failures.

### Why This Matters

**Problem**: Treating CI as diagnostic creates:
- Wasted CI resources on known-failing tests
- Delayed feedback cycles (waiting for CI instead of local verification)
- False confidence in "green" local status
- Technical debt accumulation through undetected test failures
- Merge blockers discovered late in the process

**Solution**: Local test execution ensures:
- Immediate feedback during development
- Known-good state before handover
- CI confirms what was already validated locally
- No surprises during PR review
- Faster merge cycles

---

## Protocol Requirements

### Requirement 1: Local Test Execution (Mandatory)

**Before creating ANY PR or handover**, agents MUST:

1. **Identify all test commands** from:
   - `package.json` scripts section (for Node.js projects)
   - Test runner configuration files (jest.config.js, etc.)
   - CI workflow files (.github/workflows/*.yml)

2. **Execute ALL test suites locally**:
   ```bash
   npm run test          # Unit tests
   npm run test:ci       # CI test suite
   npm run lint          # Linting
   npm run lint:deprecation  # Deprecation detection
   # Add any other test commands
   ```

3. **Document results** for each test command:
   - Command executed
   - Exit code (0 = pass, non-zero = fail)
   - Summary of output (tests passed, coverage, errors)
   - Any failures and how they were resolved

4. **Fix ALL failures** before proceeding:
   - No "will fix in CI" permitted
   - No "CI will tell us what's wrong" permitted
   - 100% pass rate required locally

### Requirement 2: Environment Parity

When executing tests locally, agents MUST:

1. **Match CI environment as closely as possible**:
   - Use same Node.js version as CI
   - Use same dependency versions (npm ci, not npm install)
   - Use same environment variables (from .env.example)

2. **Document environment differences** that cannot be replicated:
   - Database service containers (PostgreSQL, Redis, etc.)
   - Cloud services (AWS, Azure, etc.)
   - External APIs requiring credentials
   - Platform-specific services

3. **For non-replicable tests**:
   - Document why they cannot run locally
   - Explain what was attempted
   - Show evidence of code review/validation instead
   - Provide CI proof after push

### Requirement 3: PREHANDOVER_PROOF Evidence

All PRs MUST include a PREHANDOVER_PROOF comment containing:

**Required Sections**:

#### A. Test Execution Evidence
```
### Test Execution Results

Command: npm run test
Exit Code: 0
Output: 220 tests passed (0 failed)
Coverage: 87.3% statements, 82.1% branches
Status: ✅ PASSED

Command: npm run lint
Exit Code: 0
Output: 0 errors, 0 warnings
Status: ✅ PASSED

Command: npm run lint:deprecation
Exit Code: 0
Output: 0 deprecated APIs detected
Status: ✅ PASSED
```

#### B. Non-Replicable Tests (if any)
```
### Non-Replicable Tests

Command: npm run test:integration
Reason: Requires PostgreSQL service container (port 5432)
Attempted: Installed PostgreSQL locally, connection timeout
Validation: 
- No integration test files modified in this PR
- Unit tests cover all changed logic
- CI run shows all integration tests passing
CI Proof: [link to successful CI run]
```

#### C. CI Confirmation
```
### CI Confirmation

- QA Enforcement: [link] - ✅ All jobs passed
- Deprecation Detection: [link] - ✅ All jobs passed  
- Build to Red: [link] - ✅ All jobs passed
```

---

## Exception Process

### When Exceptions May Be Considered

Exceptions to local test execution are **RARE** and only permitted when:
- Tests require infrastructure not available locally (databases, cloud services)
- Tests require platform-specific features (CI-only features)
- Tests require credentials/secrets not available in development
- Tests take excessively long (>10 minutes) making local execution impractical

### Exception Requirements

For each exception, agents MUST:

1. **Document the test command** that cannot be replicated
2. **Explain specifically why** it cannot run locally
3. **Show what was attempted** to run it locally
4. **Provide alternative validation**:
   - Code review of test files
   - Unit test coverage of same logic
   - Manual verification of functionality
   - CI proof after push
5. **Get FM approval** if exception involves core functionality tests

### Exception Documentation Format

```markdown
### Test Exception Request

**Test Command**: `npm run test:e2e`
**Cannot Run Locally Because**: Requires Playwright with browser automation which is not configured in development environment
**Attempted**: Installed Playwright, encountered permission errors with browser installation
**Alternative Validation**:
- Reviewed E2E test files - no changes in this PR
- All component unit tests pass locally
- Manual testing of UI changes completed
- Screenshots of UI changes provided
**FM Approval**: Not required (no E2E tests modified, UI unit tests cover changes)
**CI Confirmation**: Will provide link after push
```

---

## Test Types and Execution Requirements

### 1. Unit Tests
- **Command**: `npm run test` or `npm test`
- **Local Execution**: ✅ REQUIRED - No exceptions
- **Rationale**: Unit tests are self-contained and fast
- **Pass Criteria**: 100% of unit tests pass, no skipped tests

### 2. Integration Tests
- **Command**: `npm run test:integration` or similar
- **Local Execution**: ⚠️ REQUIRED with exceptions
- **Exception Allowed**: If requires database/external services
- **Pass Criteria**: 100% pass or documented exception with alternative validation

### 3. Linting
- **Command**: `npm run lint`
- **Local Execution**: ✅ REQUIRED - No exceptions
- **Rationale**: Linting is fast and requires no external services
- **Pass Criteria**: 0 errors, 0 warnings

### 4. Deprecation Detection
- **Command**: `npm run lint:deprecation`
- **Local Execution**: ✅ REQUIRED - No exceptions
- **Rationale**: Deprecation checking is fast and critical (BL-026)
- **Pass Criteria**: 0 deprecated APIs detected

### 5. Type Checking
- **Command**: `npm run typecheck` or `tsc --noEmit`
- **Local Execution**: ✅ REQUIRED - No exceptions
- **Rationale**: Type checking is fast and catches build errors early
- **Pass Criteria**: 0 type errors

### 6. End-to-End Tests
- **Command**: `npm run test:e2e`
- **Local Execution**: ⚠️ RECOMMENDED with exceptions
- **Exception Allowed**: If requires full application stack or browsers
- **Pass Criteria**: Exception documented with UI testing evidence

---

## Builder Responsibilities

### Before Creating PR

Builders MUST:
1. ✅ Execute all replicable tests locally
2. ✅ Fix all test failures
3. ✅ Document any non-replicable tests with exceptions
4. ✅ Achieve 100% pass rate (or documented exceptions)
5. ✅ Prepare PREHANDOVER_PROOF evidence

### In PR Description

Builders MUST include:
1. ✅ Summary of tests executed locally
2. ✅ Results of each test command
3. ✅ Any exceptions with justification
4. ✅ Statement: "All tests executed locally, CI is confirmation only"

### After PR Creation

Builders MUST:
1. ✅ Monitor CI execution for confirmation
2. ✅ Update PREHANDOVER_PROOF with CI links
3. ✅ If CI fails unexpectedly, investigate immediately
4. ✅ Document any CI-only failures as learning opportunities

---

## FM Responsibilities

FM MUST:
1. ✅ Verify PREHANDOVER_PROOF present in all PRs
2. ✅ Validate test execution evidence is complete
3. ✅ Review exception justifications for legitimacy
4. ✅ Reject PRs without proper test execution evidence
5. ✅ Escalate repeated violations to Governance Liaison

---

## Governance Liaison Responsibilities

Governance Liaison MUST:
1. ✅ Audit PRs for protocol compliance
2. ✅ Validate PREHANDOVER_PROOF completeness
3. ✅ Review exception patterns for policy gaps
4. ✅ Update protocol based on legitimate exception patterns
5. ✅ Train builders on protocol requirements

---

## Enforcement Rules

### Pre-PR Checklist

Before creating PR, verify:
- [ ] All unit tests executed locally and passed
- [ ] All integration tests executed or exception documented
- [ ] All linting checks passed
- [ ] Deprecation detection passed (BL-026 compliance)
- [ ] Type checking passed
- [ ] PREHANDOVER_PROOF prepared with all evidence
- [ ] Exception requests prepared if needed

### PR Gate Requirements

PRs MUST NOT be approved without:
- [ ] PREHANDOVER_PROOF present as comment
- [ ] Test execution evidence for all test types
- [ ] 100% pass rate or legitimate exceptions
- [ ] CI confirmation links added
- [ ] FM review and approval of exceptions

### Violation Consequences

**Minor Violations** (missing documentation):
- PR blocked until PREHANDOVER_PROOF provided
- Builder reminded of protocol requirements
- Learning log entry created

**Major Violations** (no local testing):
- PR rejected immediately
- Builder training required before next task
- Escalation to Governance Liaison
- Task assignment blocked until training complete

**Repeated Violations**:
- Builder contract review required
- FM escalation to Johan
- Possible role reassignment

---

## Integration with Existing Protocols

### Execution Bootstrap Protocol

This protocol **extends** the Execution Bootstrap Protocol (EXECUTION_BOOTSTRAP_PROTOCOL.md):
- Execution Bootstrap Protocol: Focuses on CI job verification before handover
- **This Protocol**: Focuses on local test execution before PR creation
- Both protocols work together for comprehensive quality assurance

### BL-026 Deprecation Detection

This protocol **enforces** BL-026 requirements:
- Deprecation detection (`npm run lint:deprecation`) MUST be executed locally
- 0 deprecated APIs required before PR creation
- No exceptions permitted (per BL-026 policy)

### Zero Test Debt Constitutional Rule

This protocol **implements** Zero Test Debt principle:
- All tests MUST pass locally before handover
- No "will fix later" permitted
- No test skipping permitted
- 100% pass rate required

---

## Learning Capture

When this protocol reveals issues, capture learning:

### Test Execution Failures

If local test execution reveals failures:
1. Document the failure in FAILURE_LEARNING_LOG.md
2. Create prevention test if applicable
3. Update protocol if systematic issue discovered

### Exception Patterns

If multiple builders request same exception:
1. Review if exception should be policy
2. Consider infrastructure improvements
3. Update protocol with standard exception template

### CI Divergence

If CI results differ from local results:
1. Investigate environment difference
2. Document in learning log
3. Update protocol with environment parity guidance

---

## Attestation Requirements

### Builder Attestation

All builders MUST attest to understanding this protocol:

**Attestation Statement**:
> "I, [Builder Name], understand and acknowledge:
> 1. I must execute all tests locally before creating any PR
> 2. CI is for confirmation only, not diagnostics
> 3. I must document test execution results in PREHANDOVER_PROOF
> 4. I must achieve 100% pass rate or document legitimate exceptions
> 5. I may not create PRs with known test failures
> 6. Violations will result in PR rejection and may block future task assignments
> 
> **Signed**: [Builder Name]  
> **Date**: [YYYY-MM-DD]  
> **Agent Role**: [api-builder/ui-builder/etc.]"

### Attestation Storage

Attestations MUST be stored in:
- **File**: `governance/evidence/attestations/test-execution-protocol-attestations.md`
- **Format**: Markdown with builder name, date, role, signature
- **Tracking**: FM maintains attestation status per builder

### Attestation Enforcement

- [ ] Builders without attestation CANNOT be assigned new tasks
- [ ] Attestation required before first PR under this protocol
- [ ] Re-attestation required after protocol updates
- [ ] FM verifies attestation before task assignment

---

## Monitoring and Metrics

### Metrics to Track

**Per Builder**:
- Number of PRs with PREHANDOVER_PROOF
- Number of PRs without PREHANDOVER_PROOF
- Number of exception requests
- Number of CI failures after local "pass"
- Average time from PR creation to CI confirmation

**Repository-Wide**:
- Protocol compliance rate (PRs with proper evidence / total PRs)
- Exception frequency by test type
- CI failure rate on "locally validated" PRs
- Time saved by catching failures locally

### Quarterly Review

FM MUST review metrics quarterly:
- Identify builders needing additional training
- Identify systematic exception patterns requiring policy update
- Validate protocol effectiveness
- Recommend protocol improvements

---

## Related Policies and Documents

This protocol works with:

1. **EXECUTION_BOOTSTRAP_PROTOCOL.md**
   - Both ensure quality before handover
   - Bootstrap focuses on CI jobs, this focuses on tests
   - Use both for complete validation

2. **AUTOMATED_DEPRECATION_DETECTION_GATE.md (BL-026)**
   - Deprecation checking MUST be executed locally (this protocol)
   - Pre-commit and CI gates enforce (BL-026 policy)
   - Zero tolerance for deprecated APIs (constitutional)

3. **PREHANDOVER_PROOF_TEMPLATE.md**
   - Template includes test execution evidence section
   - This protocol defines what evidence is required
   - Template enforces protocol compliance

4. **Zero Test Debt Constitutional Rule**
   - This protocol implements local enforcement
   - CI gates provide final validation
   - Both ensure zero test debt

5. **Builder Agent Contracts**
   - All builder contracts reference this protocol
   - Compliance is mandatory for all builders
   - Violations trigger contract review

---

## Implementation Checklist

For protocol implementation complete, verify:

- [ ] Protocol document created in governance/runbooks/
- [ ] .agent file binds to protocol (test_execution section)
- [ ] PREHANDOVER_PROOF_TEMPLATE updated with test execution section
- [ ] All builder contracts updated to reference protocol
- [ ] Builder attestation template created
- [ ] Attestation tracking document created
- [ ] PR checklist templates updated
- [ ] FM trained on enforcement procedures
- [ ] Initial builder training session conducted
- [ ] First 5 PRs audited for compliance
- [ ] Evidence captured in governance/evidence/

**FM Sign-off Required**: Protocol not active until FM verifies implementation complete and all builders trained.

---

## Training Requirements

### Initial Training (Mandatory)

All builders MUST complete training covering:
1. Core principle: CI is confirmation, not diagnostic
2. Local test execution requirements
3. PREHANDOVER_PROOF evidence requirements
4. Exception process and criteria
5. Enforcement rules and consequences
6. Integration with other protocols
7. Practical exercise: Create sample PREHANDOVER_PROOF

**Duration**: 30-45 minutes  
**Format**: Synchronous session with all builders  
**Completion**: Attestation signed after training

### Ongoing Training

Builders receive updates when:
- Protocol is revised
- New test types are added
- Exception patterns change
- Systematic issues discovered

---

## Summary

**Protocol**: Mandatory local test execution before PR creation  
**Core Principle**: CI is confirmation, NOT diagnostic  
**Enforcement**: PREHANDOVER_PROOF required in all PRs  
**Tolerance**: 100% pass rate or documented legitimate exceptions  
**Integration**: Works with Execution Bootstrap Protocol and BL-026  
**Authority**: Canonical governance, constitutional enforcement  

**Key Principle**: 
> "Run tests locally. Fix failures immediately. Document results. CI confirms what you already know is green."

---

## Version History

### Version 1.0.0 (2026-01-13)

**Initial Release**:
- Established core principle: CI is confirmation only
- Defined local test execution requirements
- Created exception process
- Integrated with PREHANDOVER_PROOF template
- Established attestation requirements
- Defined enforcement rules

**Effective Date**: 2026-01-13  
**Compliance Deadline**: 2026-01-27  
**Next Review**: 2026-04-13 (quarterly)

---

**Protocol Status**: ACTIVE  
**Enforcement**: IMMEDIATE  
**Binding**: All builders  
**Authority**: Constitutional

---

**END OF PROTOCOL**
