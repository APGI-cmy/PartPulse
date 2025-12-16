# QA Directory - PartPulse

This directory contains the Quality Assurance infrastructure for PartPulse, implementing the ForemanApp Agent Contract governance model.

## Contents

### QA Plan

- **[QA_PLAN.md](./QA_PLAN.md)** - Comprehensive QA strategy defining 13 categories mapped to architecture
  - Gap analysis approach (RED on first run by design)
  - Evidence requirements per category
  - Test file specifications
  - GREEN definitions (local vs gate-eligible)
  - Build-to-GREEN workflow

### QA Reports

- **QA_REPORT.md** - Latest QA validation report (auto-generated)
- **QA_RESULTS.json** - Latest QA results in JSON format (auto-generated)
- **WAVE_10_FINAL_QA_REPORT.md** - Historical QA report from Wave 10

### QA Scripts

- **run-qa.py** - Python script for architecture compliance validation
- **check-qa-plan-status.js** - Node.js script to check QA Plan test file compliance
- **detect-test-dodging.js** - Detects forbidden test patterns (.skip, .only, etc.)

### QA Subdirectories

- **parking/** - QA Parking Station (governed RED states)
  - `registry.json` - Active parking entries
  - `registry-schema.json` - JSON schema for parking registry
  - `watcher.js` - Validates and monitors parked items
  
- **evidence/** - Catastrophic failure evidence capture
  - `capture.js` - Script to capture failure evidence
  - Evidence directories created automatically on failures

- **governance/** - Governance compliance mechanisms
  - `sync-checker.js` - Validates governance policy synchronization

## Usage

### Check QA Plan Status

Shows gap between current implementation and QA Plan requirements:

```bash
npm run qa:plan-status
```

**Expected first run**: 🔴 RED (0% completion)  
**Purpose**: Reveals implementation gaps to guide Build-to-GREEN

### Run Complete QA Check

Runs all QA validations:

```bash
npm run qa:check
```

Includes:
- Test dodging detection
- QA parking validation
- Governance sync check
- Full test suite with coverage

### Run Architecture QA

Validates implementation against architecture specification:

```bash
python3 qa/run-qa.py
```

Generates:
- `qa/QA_REPORT.md` - Human-readable report
- `qa/QA_RESULTS.json` - Machine-readable results

### Individual QA Checks

```bash
# Detect test dodging
node qa/detect-test-dodging.js

# Validate QA parking
node qa/parking/watcher.js

# Check governance sync
node qa/governance/sync-checker.js

# Capture failure evidence (auto-triggered by CI)
node qa/evidence/capture.js "type" "message" "logs"
```

## QA Philosophy

### Gap Analysis Approach

The QA Plan treats architecture as **requirements specification** and implementation as **system under test**. The first run is intentionally RED, revealing all gaps.

### RED on First Run (By Design)

This is not a failure - it's the intended starting point:

1. **Architecture defines requirements** (11 documents, 280KB)
2. **QA Plan defines validation** (13 categories, 37+ test files)
3. **First run shows gaps** (0% completion expected)
4. **Build-to-GREEN closes gaps** (systematic implementation)

### Governed RED States

When tests fail during implementation, use governed exceptions:

#### QA Parking (Implementation Phase)

For implementation-phase RED states:
```bash
# Create issue: .github/ISSUE_TEMPLATE/qa-parking.yml
# Add to registry with category: "parking"
```

#### DP-RED (Design Phase)

For design-phase RED states:
```bash
# Create issue: .github/ISSUE_TEMPLATE/dp-red.yml
# Add to registry with category: "dp-red"
```

**Never allowed**: `.skip()`, `.only()`, commented tests, or test dodging

## QA Categories

The QA Plan defines 13 categories mapped to architecture:

1. **Database Schema Compliance** (`/architecture/DATABASE_SCHEMA.md`)
2. **API Contract Compliance** (`/architecture/API_SPECIFICATION.md`)
3. **Authentication & Authorization** (`/architecture/SECURITY_ARCHITECTURE.md`)
4. **Security Controls** (`/architecture/SECURITY_ARCHITECTURE.md`)
5. **Audit Logging Compliance** (`/architecture/AUDIT_LOGGING.md`)
6. **Data Flow Compliance** (`/architecture/DATA_FLOW.md`)
7. **Frontend Components** (`/architecture/FRONTEND_COMPONENTS.md`)
8. **Component Boundaries** (`/architecture/COMPONENT_BOUNDARIES.md`)
9. **External Dependencies** (`/architecture/EXTERNAL_DEPENDENCIES.md`)
10. **Deployment Compliance** (`/architecture/DEPLOYMENT_GUIDE.md`)
11. **Documentation Compliance** (All architecture docs)
12. **Performance Compliance** (`/architecture/ARCHITECTURE.md`)
13. **Governance Compliance** (`/docs/governance/QA_GOVERNANCE_GUIDE.md`)

Each category specifies:
- Evidence requirements (files, tests, documentation)
- Test file locations and test cases
- Acceptance criteria for GREEN

## Definition of GREEN

### GREEN (Local) - Developer GREEN

For local development confidence:
- All tests pass locally
- No test dodging detected
- Build succeeds
- Linting passes (no critical)

### GREEN (Gate-Eligible) - Merge GREEN

For merge authorization:
- All tests pass in CI
- No test dodging detected
- All governance checks pass
- QA parking valid (no expired)
- Build succeeds in CI
- No high/critical vulnerabilities
- CodeQL scan clean
- All approvals obtained

**Only Gate-Eligible GREEN permits merge.**

## Build-to-GREEN Workflow

### Phase 1: Discovery (Expect RED)

```bash
npm run qa:plan-status
```

Review gaps, prioritize, create issues.

### Phase 2: Systematic Gap Closure

For each RED category:
1. Read architecture document
2. Write tests first (TDD)
3. Implement functionality
4. Verify GREEN locally
5. Commit and push
6. CI validates
7. Next category

### Phase 3: Validation

```bash
npm run qa:check
```

Verify all GREEN, request review, merge.

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/qa-enforcement.yml`

Runs on every push/PR:
- Test dodging detection
- QA parking validation
- Governance sync check
- Test execution
- Build validation
- Merge gate (blocks if RED)

### Evidence Capture

On CI failure, evidence automatically captured to `qa/evidence/`:
- Failure metadata
- Git context
- CI environment
- Logs and traces

## Governance Compliance

This QA infrastructure implements the ForemanApp Agent Contract:

### Core Invariants

✅ **RED Ownership** - RED states owned until resolved  
✅ **Zero Test Dodging** - No skips, only governed exceptions  
✅ **One-Time Failures** - Prevent recurrence permanently  
✅ **Merge Gate Supremacy** - RED blocks merge absolutely  
✅ **Evidence & Audit** - Immutable evidence on all failures

### Policy Version

Current: **1.1.0** (with DP-RED support)  
Location: `/docs/governance/POLICY_VERSION.md`

## Documentation

- **QA Plan**: Complete strategy and requirements (`QA_PLAN.md`)
- **QA Governance Guide**: Mechanisms and workflows (`/docs/governance/QA_GOVERNANCE_GUIDE.md`)
- **Policy Version**: Governance policy history (`/docs/governance/POLICY_VERSION.md`)
- **Architecture Design Checklist**: Design governance (`/governance/architecture/ARCHITECTURE_DESIGN_CHECKLIST.md`)

## Support

For questions about:
- **QA Plan**: See `QA_PLAN.md`
- **Governance**: See `/docs/governance/QA_GOVERNANCE_GUIDE.md`
- **Parking/DP-RED**: Create issue using templates in `.github/ISSUE_TEMPLATE/`
- **Failures**: Check evidence in `qa/evidence/`

---

**Remember**: RED on first run is success. It reveals the path to GREEN.
