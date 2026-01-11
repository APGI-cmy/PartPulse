# Governance Gate Mapping

## Purpose

This document maps canonical Governance Gate requirements to the repository-specific implementation in PartPulse.

**Canonical Source**: `maturion-foreman-governance/governance/canon/PR_GATE_REQUIREMENTS_CANON.md`  
**Governance Version**: 7dc8110ce2477e1eb441eb905c56951090df36ed (2026-01-11)

## Repository Information

**Repository**: APGI-cmy/PartPulse  
**Repository Type**: Application (Next.js Full-Stack)  
**Gate Applicability**: Full (Builder-authored PRs require comprehensive gates)

## Workflow Files

### Active Governance Gate Workflows

| Workflow File | Canonical Purpose | Status | Notes |
|--------------|------------------|---------|-------|
| `qa-enforcement.yml` | QA enforcement gate - validates test coverage and QA catalog alignment | ✅ Active | Primary QA gate |
| `qa-enforcement-v2.yml` | Enhanced QA enforcement with additional validations | ✅ Active | Extended QA checks |
| `qa-enforcement-v1-frozen.yml` | Frozen v1 QA enforcement (reference) | 🔒 Frozen | Historical reference |
| `minimum-build-to-red.yml` | Build-to-Red gate - validates minimum red test state | ✅ Active | Build-to-Green enforcement |
| `model-scaling-check.yml` | Model scaling validation | ✅ Active | Architecture validation |

### Workflow Locations

**Directory**: `.github/workflows/`

**Active Gate Files**:
- `.github/workflows/qa-enforcement.yml`
- `.github/workflows/qa-enforcement-v2.yml`
- `.github/workflows/minimum-build-to-red.yml`
- `.github/workflows/model-scaling-check.yml`

**Reference Files**:
- `.github/workflows/qa-enforcement-v1-frozen.yml`

## Validator Modules

### QA Validation

**QA Catalog Validation**:
- **Location**: Embedded in workflow files (no separate validator module)
- **Function**: Validates QA catalog alignment per BL-018
- **Triggers**: On PR to main branch

**Test Coverage Validation**:
- **Location**: Jest test framework + coverage reports
- **Function**: Validates test coverage meets governance requirements
- **Configuration**: `jest.config.js`

### Build Validation

**Build-to-Red Validation**:
- **Location**: `minimum-build-to-red.yml` workflow
- **Function**: Ensures red tests exist before green implementation
- **Evidence**: Requires architecture and QA plan completion

### Architecture Validation

**Model Scaling Check**:
- **Location**: `model-scaling-check.yml` workflow
- **Function**: Validates architecture scalability and component boundaries
- **Configuration**: Workflow-defined checks

## Configuration Files

### Gate Configuration

**Branch Protection**:
- **Location**: GitHub repository settings (not in code)
- **Required Status Checks**: 
  - QA Enforcement
  - QA Enforcement V2
  - Minimum Build to Red
  - Model Scaling Check
- **Status**: ✅ Active (pre-existing)

**Jest Configuration**:
- **Location**: `jest.config.js`
- **Purpose**: Test execution and coverage configuration
- **Coverage Thresholds**: Defined in config

**Environment Configuration**:
- **Location**: `.env.example`
- **Purpose**: Documents required environment variables
- **Validation**: CI workflows validate environment setup

## Evidence Location Mappings

### Initialization Evidence

**Initialization Evidence**:
- **Canonical Location**: `.architecture/REPOSITORY_INITIALIZATION_EVIDENCE.md`
- **Schema**: `governance/schemas/REPOSITORY_INITIALIZATION_EVIDENCE.schema.md` (canonical reference)
- **Status**: ✅ Created (FPC layer-down)

### Commissioning Evidence

**Commissioning Readiness**:
- **Location**: `governance/evidence/commissioning/COMMISSIONING_READINESS.md`
- **Schema**: Defined in `SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md`
- **Status**: ✅ Created (FPC layer-down)

### Architecture Evidence

**Architecture Documentation**:
- **Location**: `architecture/` directory (11 documents, 280 KB)
- **Key Files**:
  - `architecture/ARCHITECTURE.md`
  - `architecture/DATABASE_SCHEMA.md`
  - `architecture/FRONTEND_COMPONENTS.md`
  - `architecture/COMPONENT_BOUNDARIES.md`
  - `architecture/DATA_FLOW.md`
  - And 6 more architecture documents
- **Status**: ✅ Complete

**Architecture Checklist**:
- **Location**: `governance/architecture/ARCHITECTURE_DESIGN_CHECKLIST.md`
- **Purpose**: Architecture completeness validation
- **Status**: ✅ Present

### QA Evidence

**QA Plan**:
- **Location**: `qa/QA_PLAN.md`
- **Content**: 37 tests defined across 13 categories
- **Status**: ✅ Complete (definition phase)

**Failure Learning Log**:
- **Location**: `qa/FAILURE_LEARNING_LOG.md`
- **Schema**: `governance/schemas/FAILURE_SCHEMA.schema.md` (canonical reference)
- **Entries**: 6 FL entries documented
- **Status**: ✅ Active

**QA Evidence Directory**:
- **Location**: `qa/evidence/`
- **Purpose**: Test execution evidence and results
- **Status**: ✅ Present

### Governance Evidence

**Governance Alignment**:
- **Location**: `governance/alignment/GOVERNANCE_ALIGNMENT.md`
- **Purpose**: Track governance version synchronization
- **Status**: ✅ Created (FPC layer-down)

**Governance Version**:
- **Location**: `governance/GOVERNANCE_VERSION.md`
- **Purpose**: Document governance version, bindings, and compliance
- **Status**: ✅ Updated (FPC layer-down)

## Role-Based Gate Applicability

### Builder-Authored PRs

When PR author is a Builder agent (api-builder, ui-builder, qa-builder, schema-builder, integration-builder):

**Required Gates**:
- ✅ QA Enforcement (qa-enforcement.yml, qa-enforcement-v2.yml)
- ✅ Build-to-Red validation (minimum-build-to-red.yml)
- ✅ Architecture validation (model-scaling-check.yml)
- ✅ Test execution and coverage
- ✅ QA Catalog Alignment (BL-018)

### FM-Authored PRs

When PR author is ForemanApp agent:

**Required Gates**:
- ✅ QA Enforcement (scoped to FM-authored changes)
- ⚠️ Architecture validation (if architecture changes)
- ⚠️ Learning promotion validation (if promoting learnings)

### Governance Liaison PRs

When PR author is Governance Liaison agent:

**Required Gates**:
- ⚠️ Governance scope validation (changes limited to governance/ directory)
- ⚠️ Ripple validation (if Tier-0 changes)
- ⚠️ Constitutional compliance (if policy/canon changes)

**Note**: Governance Liaison gate applicability follows `AGENT_ROLE_GATE_APPLICABILITY.md` in canonical governance.

## Gate Exemptions & Overrides

### Exemptions

**No Exemptions Configured**: All PRs require applicable gates to pass before merge.

### Override Authority

**Override Authority**: Johan Ras (Human Authority)  
**Override Method**: Manual merge with justification documented in PR

**Prohibited Overrides**:
- Cannot bypass QA-as-Proof requirement
- Cannot bypass Build-to-Green requirement
- Cannot bypass Test Debt Constitutional Rule

## Evidence Generation

### Automated Evidence

**Test Execution Reports**:
- **Generated By**: Jest test runner
- **Location**: `coverage/` directory (gitignored)
- **Format**: HTML and JSON coverage reports

**CI Workflow Logs**:
- **Generated By**: GitHub Actions
- **Location**: GitHub Actions UI
- **Retention**: Per GitHub retention policy

### Manual Evidence

**Architecture Reviews**:
- **Created By**: ForemanApp agent + Builders
- **Location**: `architecture/` directory
- **Format**: Markdown documents

**QA Plan**:
- **Created By**: QA Builder agent
- **Location**: `qa/QA_PLAN.md`
- **Format**: Markdown with test catalog

**Failure Learnings**:
- **Created By**: Any agent discovering failure
- **Location**: `qa/FAILURE_LEARNING_LOG.md`
- **Format**: Markdown following FAILURE_SCHEMA.schema.md

## Validation Commands

### Local Validation

**Run Tests**:
```bash
npm test
```

**Run Tests with Coverage**:
```bash
npm test -- --coverage
```

**Lint Code**:
```bash
npm run lint
```

**Build Application**:
```bash
npm run build
```

### CI Validation

All gate validations run automatically on PR creation and updates via GitHub Actions workflows.

## Mapping Maintenance

**Maintained By**: Governance Liaison Agent  
**Review Frequency**: When canonical governance updates  
**Last Updated**: 2026-01-11  
**Next Review**: When governance version drift detected

### Update Triggers

This mapping should be reviewed and updated when:
- Canonical governance gate requirements change
- New workflows are added to this repository
- Workflow files are modified
- Gate applicability rules change
- Evidence locations change

### Drift Detection

Governance Liaison monitors for drift between:
- Canonical gate requirements in `maturion-foreman-governance`
- Implementation in this repository's workflows
- Evidence locations and formats

**Drift Detection**: Via `governance/alignment/GOVERNANCE_ALIGNMENT.md`

## Related Documents

- `governance/alignment/GOVERNANCE_ALIGNMENT.md` - Governance version tracking
- `governance/GOVERNANCE_VERSION.md` - Comprehensive governance binding information
- `.architecture/REPOSITORY_INITIALIZATION_EVIDENCE.md` - Initialization evidence
- `governance/evidence/commissioning/COMMISSIONING_READINESS.md` - Commissioning status

---

**Document Version**: 1.0  
**Created**: 2026-01-11  
**Created By**: Governance Liaison Agent (FPC Layer-Down)  
**Authority**: FPC_REPOSITORY_LAYERDOWN_GUIDE.md Phase 7.1
