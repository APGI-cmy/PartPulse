# QA/Governance Compliance Guide

## Overview

PartPulse implements comprehensive QA and governance compliance per the ForemanApp Agent Contract. This document explains the mechanisms, workflows, and policies that enforce governance.

---

## Core Principles

### 1. No Test Dodging
- All tests must run, always
- No `.skip()`, `.only()`, or disabled tests
- Violations trigger governance failure
- Use QA Parking for legitimate exceptions

### 2. Build-to-GREEN
- All CI checks must pass before merge
- RED states block merge absolutely
- Fix-to-GREEN or governed exception only
- No explanations, only elimination

### 3. One-Time Failures
- Failures occur once, prevention forever
- Root cause analysis mandatory
- QA strengthened to detect permanently
- Lessons propagated across repos

### 4. Governed RED States
- QA Parking for intentional RED
- Must be approved, tracked, time-bound
- Visible and auditable
- Cannot be forgotten

---

## Mechanisms

### Test Dodging Detection

**Script**: `qa/detect-test-dodging.js`

Detects forbidden patterns:
- `.skip()` and `.only()` on tests
- `xdescribe`, `xit`, `xtest` patterns
- Commented-out tests
- Conditional test skipping

**Usage**:
```bash
node qa/detect-test-dodging.js
npm run qa:check
```

**CI Integration**: Runs on every push/PR

### QA Parking Station

**Registry**: `qa/parking/registry.json`  
**Watcher**: `qa/parking/watcher.js`

Tracks governed RED states with:
- Unique ID (PARK-XXX)
- Type (test, build, lint, security, other)
- Justification
- Expiry condition
- Approval (repo owner required)
- Tracking issue

**Adding Parking**:
1. Create QA Parking Request issue
2. Owner reviews and approves
3. Add entry to registry.json
4. Link issue in registry
5. Monitor via watcher

**Registry Entry Example**:
```json
{
  "id": "PARK-001",
  "type": "test",
  "reason": "External API unavailable for testing",
  "location": "lib/external-api.test.ts",
  "parkedBy": "developer",
  "parkedDate": "2025-12-16T10:00:00Z",
  "expiryCondition": "After Wave 5 API integration",
  "expiryDate": "2025-12-31",
  "approvedBy": "repo-owner",
  "approvalDate": "2025-12-16T10:30:00Z",
  "status": "active",
  "issueUrl": "https://github.com/.../issues/123"
}
```

**Usage**:
```bash
node qa/parking/watcher.js
```

**CI Integration**: Runs on every push/PR

### Catastrophic Failure Tracking

**Evidence Dir**: `qa/evidence/`  
**Capture Script**: `qa/evidence/capture.js`

Captures:
- Failure metadata
- Git context (commit, branch, author)
- CI environment details
- Logs and stack traces
- Timestamps

**Evidence Structure**:
```
qa/evidence/
└── 2025-12-16_103000_FAIL-001/
    ├── metadata.json
    ├── context.json
    ├── logs.txt
    └── stack-trace.txt
```

**Usage**:
```bash
node qa/evidence/capture.js "failure-type" "failure message" "logs"
```

**CI Integration**: Automatic on CI failures

**Reporting**:
1. Failure captured to evidence/
2. Create Catastrophic Failure issue
3. Link evidence directory
4. Perform root cause analysis
5. Implement prevention
6. Strengthen QA
7. Close with resolution

### Governance Sync Checker

**Script**: `qa/governance/sync-checker.js`

Validates:
- All governance artifacts present
- Package.json scripts configured
- Policy version documented
- Mechanisms operational

**Usage**:
```bash
node qa/governance/sync-checker.js
```

**CI Integration**: Runs on every push/PR

---

## CI Workflows

### QA Enforcement Workflow

**File**: `.github/workflows/qa-enforcement.yml`

**Jobs**:
1. **Test Dodging Check**: Detects test dodging patterns
2. **QA Parking Check**: Validates parking registry
3. **Governance Sync Check**: Ensures policy compliance
4. **Test Execution**: Runs full test suite
5. **Merge Gate**: Blocks merge if any RED

**Trigger**: Every push to main/develop, all PRs

**Failure Handling**: Automatic evidence capture

---

## Issue Templates

### Catastrophic Failure Template

**File**: `.github/ISSUE_TEMPLATE/catastrophic-failure.yml`

Use when:
- CI/CD failure blocks merge
- Build failure occurs
- Test failure in production
- Data loss or corruption
- Security incident

**Required**:
- Failure ID from evidence
- Evidence path
- Impact description
- Root cause (during investigation)
- Prevention plan

### QA Parking Template

**File**: `.github/ISSUE_TEMPLATE/qa-parking.yml`

Use when:
- Test cannot pass immediately
- Build issue requires external fix
- Lint violation needs refactoring
- Security finding needs time

**Required**:
- Type of parking
- Detailed justification
- Location/path
- Expiry condition
- Impact assessment

**Approval**: Repo owner must approve before parking

---

## Developer Workflow

### Normal Development

1. Write code and tests
2. Run tests locally: `npm test`
3. Check for test dodging: `node qa/detect-test-dodging.js`
4. Commit and push
5. CI runs all checks
6. Merge when GREEN

### When Tests Fail

**Option 1: Fix Immediately** (Preferred)
1. Fix the failing test
2. Push fix
3. CI validates
4. Merge when GREEN

**Option 2: QA Parking** (Governed Exception)
1. Cannot fix immediately?
2. Create QA Parking Request issue
3. Provide detailed justification
4. Wait for owner approval
5. Update registry.json
6. Link issue in registry
7. Set clear expiry condition
8. Monitor via watcher
9. Fix before expiry

### When CI Fails

1. CI captures evidence automatically
2. Review logs and evidence directory
3. Create Catastrophic Failure issue
4. Link evidence
5. Perform root cause analysis
6. Implement fix
7. Strengthen QA to prevent recurrence
8. Update governance if needed
9. Close issue with resolution

---

## Commands Reference

```bash
# Run tests
npm test
npm run test:watch
npm run test:ci

# QA checks
npm run qa:check                          # All QA checks
node qa/detect-test-dodging.js            # Test dodging
node qa/parking/watcher.js                # Parking validation
node qa/governance/sync-checker.js        # Governance sync

# Evidence capture (usually automatic)
node qa/evidence/capture.js "type" "msg" "logs"

# Architecture QA (Python)
python3 qa/run-qa.py
```

---

## Governance Policy

**Version**: 1.0.0  
**Authority**: ForemanApp Agent Contract  
**Location**: `docs/governance/POLICY_VERSION.md`

**Policy Sync**: Automatic via sync-checker.js

**Updates**: Per Self-Evolution Requirement when new failure modes discovered

---

## FAQs

### Can I skip a failing test temporarily?

No. Test skipping is forbidden per Zero Test Dodging Rule. Use QA Parking with approval instead.

### What if the CI is wrong?

CI is never wrong about RED/GREEN. Fix the code or test, or use QA Parking if fix requires time.

### How long can I park a QA item?

As short as possible. Set realistic expiry. Items parked > 90 days trigger warnings.

### Who can approve QA Parking?

Only repo owner or explicitly authorized admins.

### What if I disagree with governance?

Governance is non-negotiable. It prevents catastrophic failures. Follow the process.

---

## Support

- **Documentation**: This file
- **Policy**: `docs/governance/POLICY_VERSION.md`
- **Agent Contract**: `.github/agents/PartPulse-agent.md`
- **Issues**: Use templates for parking/failures

---

**Remember**: Perfect software, one time, every time.
