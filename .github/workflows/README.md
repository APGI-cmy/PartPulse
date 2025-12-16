# GitHub Actions Workflows

This directory contains all CI/CD workflows for PartPulse.

## Active Workflows

### 1. Minimum Build-to-Red Gate (Bootstrap)

**File**: `minimum-build-to-red.yml`

**Purpose**: Temporary bootstrap gate enforcing basic PR hygiene while the full QA suite is being built.

**Trigger**: Pull requests to `main` and `develop` branches

**Checks**:
- ✅ Dependency lockfile exists (package-lock.json)
- ✅ No test dodging patterns (.skip, .only, || true)
- ✅ ESLint passes with zero warnings
- ✅ TypeScript type checking passes
- ✅ Next.js build succeeds

**Status**: BOOTSTRAP ONLY - Will be replaced by full Build-to-Green governance

**Notes**:
- Does NOT replace full QA enforcement
- Provides minimum viable gate during bootstrap phase
- Clearly labeled as temporary in all output
- Blocks PR merge if any check fails

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

## Relationship Between Workflows

```
Pull Request Created
        |
        |── minimum-build-to-red.yml (Bootstrap gate - basic hygiene)
        |   └── BLOCKS: Merge if hygiene fails
        |
        |── qa-enforcement.yml (Full governance - when ready)
        |   └── BLOCKS: Merge if any RED state
        |
        └── model-scaling-check.yml (Policy compliance)
            └── VALIDATES: Model usage patterns
```

## Future Evolution

As the QA test suite reaches completion (per `qa/QA_PLAN.md`):

1. **Bootstrap Phase** (Current)
   - `minimum-build-to-red.yml` provides basic hygiene
   - Full test suite under construction
   - Gap analysis approach intentionally starts RED

2. **Transition Phase** (When test suite >80% complete)
   - Both workflows run in parallel
   - `minimum-build-to-red.yml` marked for deprecation
   - Migration to full governance

3. **Governance Phase** (When test suite complete)
   - `minimum-build-to-red.yml` removed
   - `qa-enforcement.yml` becomes sole merge gate
   - Full Build-to-Green enforcement

## Governance Compliance

All workflows follow ForemanApp Agent Contract principles:

- **No Test Dodging**: Violations block merge absolutely
- **Build-to-GREEN**: RED states require fix or governed exception
- **One-Time Failures**: Root cause analysis and prevention mandatory
- **Evidence & Audit**: All failures captured for traceability

See `docs/governance/QA_GOVERNANCE_GUIDE.md` for complete governance documentation.
