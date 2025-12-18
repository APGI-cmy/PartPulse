# GitHub Actions Workflows

This directory contains all CI/CD workflows for PartPulse.

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

**See Also**:
- **Workflow Governance Policy**: `WORKFLOW_GOVERNANCE.md` (CANONICAL)
- **QA Governance Guide**: `docs/governance/QA_GOVERNANCE_GUIDE.md`
- **FL/CI Policy**: `qa/FAILURE_LEARNING_LOG.md`

## Validation

To validate all workflows before committing:

```bash
npm run workflows:validate
```

This checks:
- ✅ All workflows have valid `on:` triggers
- ✅ No push-only workflows (must include pull_request)
- ✅ No duplicate workflow files
- ✅ YAML syntax is valid
