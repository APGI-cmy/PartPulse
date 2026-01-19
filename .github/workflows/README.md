# GitHub Actions Workflows

This directory contains all CI/CD workflows for PartPulse.

## Evidence-Based Validation (BL-027/028)

**Authority**: Layered down from APGI-cmy/maturion-foreman-governance#981

All CI validation gates now accept **EITHER**:
1. **Script execution** (traditional automated validation)
2. **Evidence-based validation** (PREHANDOVER_PROOF + manual attestation)

### How Evidence-Based Validation Works

When a PR includes a `PREHANDOVER_PROOF.md` (or `PREHANDOVER_PROOF_*.md`) file that documents validation for a specific gate, that gate will:
1. Check for the presence of PREHANDOVER_PROOF
2. Verify the gate is documented in the proof
3. **ACCEPT** the evidence-based validation and skip script execution
4. Mark the gate as passing based on manual attestation

### Example Usage

For agent-driven PRs where local validation has been performed:

1. Create `PREHANDOVER_PROOF.md` using template in `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`
2. Document each gate validation with results (exit codes, outputs, etc.)
3. Include gate names like:
   - "Test Dodging Detection" or "test-dodging"
   - "QA Parking Validation" or "qa-parking"
   - "Governance Sync Validation" or "governance-sync"
   - "Deprecation Detection" or "deprecation"
   - "Test Suite Execution" or "test-execution"
4. Commit PREHANDOVER_PROOF.md to the PR branch
5. CI gates will detect and accept the evidence-based validation

### Benefits

- **Flexibility**: Allows manual validation when automated scripts cannot run locally
- **Governance**: Maintains evidence trail through PREHANDOVER_PROOF
- **Agent-friendly**: Supports agent-driven PRs with BL-027/028 compliance
- **Dual-mode**: Still runs automated validation when PREHANDOVER_PROOF not present

## Active Workflows

### 1. Minimum Build-to-Red Gate

**File**: `minimum-build-to-red.yml`

**Purpose**: CI scaffolding enforcing basic hygiene while the full RED QA suite (37 tests per QA_PLAN.md) is being implemented.

**Trigger**: Pull requests to `main` and `develop` branches

**Checks**:
- ✅ Dependency lockfile exists (package-lock.json)
- ✅ No test dodging patterns (.skip, .only, || true)
- ✅ ESLint passes with zero warnings
- ✅ TypeScript type checking passes
- ✅ Next.js build succeeds

**Status**: ACTIVE - Non-semantic hygiene enforcement

**Notes**:
- This is CI scaffolding ONLY - enforces basic hygiene
- Does NOT relax BUILD-TO-GREEN requirements
- Full governance remains mandatory and unaltered
- Blocks PR merge on hygiene violations (fail closed)
- Full QA enforcement remains in qa-enforcement.yml

---

### 2. QA Enforcement Workflow

**File**: `qa-enforcement.yml`

**Purpose**: Full Build-to-Green governance enforcement per ForemanApp contract.

**Trigger**: Pushes to `main`, `develop`, and `copilot/**` branches, plus all PRs

**Checks**:
- Test dodging detection
- QA parking registry validation
- Governance policy synchronization
- Full test suite execution
- Merge gate (aggregated)

**Status**: ACTIVE - Full governance enforcement

**Notes**:
- Captures evidence on failures
- Blocks merge on any RED state
- Enforces One-Time Failure Doctrine
- See `docs/governance/QA_GOVERNANCE_GUIDE.md` for details

---

### 3. Model Scaling Check

**File**: `model-scaling-check.yml`

**Purpose**: Validates GitHub Copilot model scaling policy compliance.

**Status**: ACTIVE

**Notes**: See `docs/governance/github-builder-model-scaling-policy.md`

---

## Workflow Relationship

```
Pull Request Created
        |
        |── minimum-build-to-red.yml (Hygiene scaffolding)
        |   ├── Enforces: Lockfile, no test dodging, lint, typecheck, build
        |   └── BLOCKS: Merge on hygiene violations
        |
        |── qa-enforcement.yml (Full governance)
        |   ├── Enforces: Full BUILD-TO-GREEN requirements
        |   └── BLOCKS: Merge on any RED state
        |
        └── model-scaling-check.yml (Policy compliance)
            └── VALIDATES: Model usage patterns
```

## Execution Order & Governance

PartPulse follows True North execution order:
1. ✅ APP_DESCRIPTION (complete)
2. ✅ ARCHITECTURE (11 docs, complete)
3. 🔴 RED QA (0/37 tests exist - being implemented)
4. ❌ BUILD-TO-GREEN (mandatory, not yet achieved)
5. ❌ MERGE (blocked until BUILD-TO-GREEN)

**Hygiene vs. Governance:**
- `minimum-build-to-red.yml` = Non-semantic hygiene (lockfile, no dodging, builds)
- `qa-enforcement.yml` = Full BUILD-TO-GREEN governance (37 tests + parking + sync)

Both must pass. Neither relaxes requirements.

## Governance Compliance

All workflows follow ForemanApp Agent Contract principles:

- **No Test Dodging**: Violations block merge absolutely
- **Build-to-GREEN**: RED states require fix or governed exception
- **One-Time Failures**: Root cause analysis and prevention mandatory
- **Evidence & Audit**: All failures captured for traceability

See `docs/governance/QA_GOVERNANCE_GUIDE.md` for complete governance documentation.
