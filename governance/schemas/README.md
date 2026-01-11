# Governance Schemas

This directory contains references to canonical governance schemas from the Maturion Governance Centre.

## Schema Source

**Canonical Repository**: https://github.com/APGI-cmy/maturion-foreman-governance  
**Schema Location**: `governance/schemas/`  
**Governance Version**: v2.0.0

## Available Schemas

All governance schemas are available in the canonical repository and should be referenced by agents and validation tools directly from:

```
https://github.com/APGI-cmy/maturion-foreman-governance/tree/main/governance/schemas
```

### Key Schemas for Application Repositories

1. **REPOSITORY_INITIALIZATION_EVIDENCE.schema.md** - Repository initialization evidence format
2. **BUILDER_QA_REPORT.schema.md** - Builder QA report structure
3. **GPCA_PREDICTION_REPORT.schema.md** - Gate-Predictive Compliance Analysis format
4. **GOVERNANCE_COMPLIANCE_REPORT.schema.json** - Governance compliance reporting
5. **WAVE_IMPLEMENTATION_PROGRESS.schema.md** - Wave progress tracking
6. **RIPPLE_SIGNAL.schema.md** - Cross-repository ripple signaling
7. **WARNING_DISCOVERY_REPORT.schema.md** - Warning discovery and tracking
8. **FAILURE_SCHEMA.schema.md** - Failure learning documentation
9. **LEARNING_SCHEMA.schema.md** - Learning capture and promotion

## Usage

Agents and validation tools should reference schemas from the canonical repository rather than copying them locally. This ensures:
- Always using the latest schema version
- Consistent validation across all repositories
- No schema drift or outdated copies
- Simplified governance version updates

## Local Copies

Do NOT copy schemas locally unless explicitly required for:
- Offline validation
- Performance-critical path validation
- Specific governance version lock-in (with documented justification)

If local copies are required, they MUST:
- Include schema version and source URL in header
- Be validated against canonical source regularly
- Be updated when governance version changes
