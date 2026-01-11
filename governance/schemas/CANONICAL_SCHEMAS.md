# Canonical Governance Schemas Reference

## Purpose

This document provides references to canonical governance schemas maintained in the `maturion-foreman-governance` repository. These schemas define normative structures for governance artifacts used in this repository.

**Schema Source Repository**: `https://github.com/APGI-cmy/maturion-foreman-governance`  
**Schema Directory**: `governance/schemas/`  
**Governance Version**: 7dc8110ce2477e1eb441eb905c56951090df36ed (2026-01-11)

## Why Reference Instead of Copy?

Per FPC Layer-Down Guide Phase 5.1, we **reference** schemas rather than copying them to prevent governance drift. This ensures:
- Single source of truth in canonical governance repository
- Automatic alignment when governance repository updates
- No manual synchronization required
- Reduced risk of schema version conflicts

## Available Canonical Schemas

### Evidence & Audit Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **REPOSITORY_INITIALIZATION_EVIDENCE.schema.md** | `governance/schemas/REPOSITORY_INITIALIZATION_EVIDENCE.schema.md` | Structure for repository initialization evidence (used in `.architecture/REPOSITORY_INITIALIZATION_EVIDENCE.md`) |
| **BRANCH_PROTECTION_EVIDENCE.schema.md** | `governance/schemas/BRANCH_PROTECTION_EVIDENCE.schema.md` | Structure for branch protection configuration evidence |
| **EVIDENCE_CATALOG.schema.md** | `governance/schemas/EVIDENCE_CATALOG.schema.md` | Structure for evidence catalog documents |
| **PLATFORM_READINESS_EVIDENCE.schema.md** | `governance/schemas/PLATFORM_READINESS_EVIDENCE.schema.md` | Structure for platform readiness evidence |

### Builder & QA Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **BUILDER_QA_REPORT.schema.md** | `governance/schemas/BUILDER_QA_REPORT.schema.md` | Structure for builder QA reports |
| **BUILDER_QA_SUMMARY.structure.md** | `governance/schemas/BUILDER_QA_SUMMARY.structure.md` | Structure for builder QA summaries |
| **BUILD_QA_REPORT.schema.json** | `governance/schemas/BUILD_QA_REPORT.schema.json` | JSON schema for build QA reports |

### Governance & Compliance Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **GOVERNANCE_CHANGE_PROPOSAL.schema.md** | `governance/schemas/GOVERNANCE_CHANGE_PROPOSAL.schema.md` | Structure for governance change proposals |
| **GOVERNANCE_COMPLIANCE_REPORT.schema.json** | `governance/schemas/GOVERNANCE_COMPLIANCE_REPORT.schema.json` | JSON schema for governance compliance reports |
| **CONTROL_MAPPING.schema.md** | `governance/schemas/CONTROL_MAPPING.schema.md` | Structure for control mappings |

### Learning & Failure Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **FAILURE_SCHEMA.schema.md** | `governance/schemas/FAILURE_SCHEMA.schema.md` | Structure for failure learning entries |
| **LEARNING_SCHEMA.schema.md** | `governance/schemas/LEARNING_SCHEMA.schema.md` | Structure for learning entries |

### Delegation & Audit Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **DELEGATED_ACTION_AUDIT.schema.md** | `governance/schemas/DELEGATED_ACTION_AUDIT.schema.md` | Structure for delegated action audit entries |
| **DELEGATED_ACTION_INSTRUCTION.schema.md** | `governance/schemas/DELEGATED_ACTION_INSTRUCTION.schema.md` | Structure for delegated action instructions |
| **DELEGATION_INSTRUCTION.schema.md** | `governance/schemas/DELEGATION_INSTRUCTION.schema.md` | Structure for delegation instructions |
| **DELEGATION_RESPONSE.schema.md** | `governance/schemas/DELEGATION_RESPONSE.schema.md` | Structure for delegation responses |
| **PLATFORM_ACTION_AUDIT_ENTRY.schema.md** | `governance/schemas/PLATFORM_ACTION_AUDIT_ENTRY.schema.md` | Structure for platform action audit entries |

### Warning & Remediation Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **WARNING_DISCOVERY_REPORT.schema.md** | `governance/schemas/WARNING_DISCOVERY_REPORT.schema.md` | Structure for warning discovery reports |
| **WARNING_REMEDIATION_REPORT.schema.md** | `governance/schemas/WARNING_REMEDIATION_REPORT.schema.md` | Structure for warning remediation reports |
| **WARNING_VERIFICATION_REPORT.schema.md** | `governance/schemas/WARNING_VERIFICATION_REPORT.schema.md` | Structure for warning verification reports |

### Requirements & Ripple Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **REQUIREMENT_SPECIFICATION.schema.md** | `governance/schemas/REQUIREMENT_SPECIFICATION.schema.md` | Structure for requirement specifications |
| **RIPPLE_SCAN_REPORT.schema.md** | `governance/schemas/RIPPLE_SCAN_REPORT.schema.md` | Structure for ripple scan reports |
| **RIPPLE_SIGNAL.schema.md** | `governance/schemas/RIPPLE_SIGNAL.schema.md` | Structure for ripple signals |

### Wave & Progress Schemas

| Schema | Canonical Location | Purpose |
|--------|-------------------|----------|
| **WAVE_IMPLEMENTATION_PROGRESS.schema.md** | `governance/schemas/WAVE_IMPLEMENTATION_PROGRESS.schema.md` | Structure for wave implementation progress tracking |
| **GPCA_PREDICTION_REPORT.schema.md** | `governance/schemas/GPCA_PREDICTION_REPORT.schema.md` | Structure for Gate Predictive Compliance Analysis reports |

## Schema Usage in This Repository

### Active Schemas Currently Used

1. **REPOSITORY_INITIALIZATION_EVIDENCE.schema.md** - Used in `.architecture/REPOSITORY_INITIALIZATION_EVIDENCE.md`
2. **FAILURE_SCHEMA.schema.md** - Used in `qa/FAILURE_LEARNING_LOG.md`
3. **BUILDER_QA_REPORT.schema.md** - Used by QA Builder agent for QA reports
4. **GOVERNANCE_COMPLIANCE_REPORT.schema.json** - Used by governance CI workflows

### Schemas Available for Future Use

All schemas listed above are available for use as this repository evolves. Agents should reference the canonical schema when creating new governance artifacts.

## Accessing Canonical Schemas

### For Agents

When creating a governance artifact that requires schema compliance:

1. **Identify the schema** from the table above
2. **Access canonical version** at `https://github.com/APGI-cmy/maturion-foreman-governance/tree/main/governance/schemas/[SCHEMA_FILE]`
3. **Follow schema structure** exactly as defined in canonical source
4. **Do NOT copy schema** into this repository - always reference canonical source
5. **Validate compliance** using schema validation tools or manual review

### For Humans

To review a schema:
1. Navigate to `https://github.com/APGI-cmy/maturion-foreman-governance`
2. Browse to `governance/schemas/`
3. Open the schema file of interest
4. Review structure, requirements, and examples

## Schema Version Tracking

**Current Governance Version**: 7dc8110ce2477e1eb441eb905c56951090df36ed (2026-01-11)  
**Last Schema Review**: 2026-01-11  
**Next Review**: When governance version updates (detected via `governance/alignment/GOVERNANCE_ALIGNMENT.md`)

When the canonical governance repository updates, the Governance Liaison agent is responsible for:
- Detecting schema changes via drift detection
- Reviewing schema updates for impact on this repository
- Updating this reference document if new schemas are added
- Ensuring artifacts in this repository remain compliant with updated schemas

## Schema Validation

### Automated Validation

CI workflows should validate governance artifacts against canonical schemas where automated validation is supported (e.g., JSON schemas).

### Manual Validation

Agents creating governance artifacts should manually validate against canonical schema requirements as defined in each schema document.

### Validation Failures

If an artifact fails schema validation:
1. Review canonical schema requirements
2. Correct artifact to match schema
3. Re-validate
4. If schema appears incorrect or unclear, escalate to Governance Administrator via Johan Ras

## Related Documents

- `governance/alignment/GOVERNANCE_ALIGNMENT.md` - Tracks governance version and drift detection
- `.architecture/REPOSITORY_INITIALIZATION_EVIDENCE.md` - Example of schema compliance
- `governance/GOVERNANCE_VERSION.md` - Overall governance version and binding information

---

**Document Version**: 1.0  
**Created**: 2026-01-11  
**Created By**: Governance Liaison Agent (FPC Layer-Down)  
**Authority**: FPC_REPOSITORY_LAYERDOWN_GUIDE.md Phase 5.1
