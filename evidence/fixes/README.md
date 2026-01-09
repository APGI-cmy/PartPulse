# Fix Evidence Storage

## Purpose
This directory stores evidence and audit trail documentation for defect fixes in accordance with the **Defect Resolution and Maintenance Canon** from the maturion-foreman-governance repository.

## Structure

Each defect fix MUST have its own subdirectory:

```
/evidence/fixes/{issue-number}/
  discovery/           # Initial defect report, screenshots, logs
  triage/              # Classification, RCA, priority assessment
  architecture/        # Fix design, impact analysis
  implementation/      # PR links, code review evidence
  validation/          # Test results, CI logs
  deployment/          # Deployment logs, verification
  closure/             # Final evidence, lessons learned
```

## Requirements

### Discovery Phase
- Initial defect report with reproduction steps
- Screenshots or logs demonstrating the issue
- User impact assessment
- Discovery date and discoverer

### Triage Phase
- Classification decision (BUG/FEATURE/TECH_DEBT)
- Severity assessment (CRITICAL/HIGH/MEDIUM/LOW)
- Root cause analysis
- Priority justification

### Architecture Phase
- Fix design document
- Alternative approaches considered
- Success criteria
- Impact assessment
- Test strategy
- Deployment strategy

### Implementation Phase
- PR link(s)
- Code review comments
- Builder handover statement
- QA evidence (Red → Green)

### Validation Phase
- CI gate results (all green)
- Manual verification evidence
- Regression test results
- Production readiness checklist

### Deployment Phase
- Deployment log
- Version tag
- Release notes
- Post-deployment verification

### Closure Phase
- Production verification evidence
- User confirmation (if applicable)
- Lessons learned
- Governance promotion (if required)

## Audit Trail

All evidence must be:
- ✅ Complete (all phases documented)
- ✅ Traceable (clear chain from discovery to closure)
- ✅ Permanent (never deleted)
- ✅ Linked (issues, PRs, commits connected)

## Retention

Evidence is retained **permanently** for governance audit and learning purposes.

## References

- **Canonical Source**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`
- **Layer-Down Instructions**: `maturion-foreman-governance/governance/reports/DEFECT_RESOLUTION_CANON_LAYER_DOWN_INSTRUCTIONS.md`
- **Process Documentation**: `/docs/defect-resolution-process.md`
