# Defect Resolution Quick Reference

Quick reference for the defect resolution process in PartPulse.

**Full Documentation**: `/docs/defect-resolution-process.md`  
**Canonical Source**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`

---

## Defect Classification

| Type | Label | Use When |
|------|-------|----------|
| **BUG** | `defect-bug` | Behavior doesn't match specification |
| **FEATURE** | `defect-feature` | Required functionality missing |
| **TECH_DEBT** | `defect-tech-debt` | Works but violates quality standards |

## Severity Levels

| Severity | Label | Response Time |
|----------|-------|---------------|
| **CRITICAL** | `severity-critical` | Immediate |
| **HIGH** | `severity-high` | Within 24 hours |
| **MEDIUM** | `severity-medium` | Next sprint |
| **LOW** | `severity-low` | Backlog |

## Branch Naming

```
fix/ISSUE-{number}-{description}        # Standard fixes
hotfix/ISSUE-{number}-{description}     # Critical production fixes
tech-debt/ISSUE-{number}-{description}  # Tech debt remediation
```

## Fix Workflow

1. **Discover Defect** → Create issue with template
2. **Triage** (FM, 24 hrs) → Classify, assign severity
3. **Architecture** (FM) → RCA, fix design, rollback plan
4. **Authorize** (FM) → Safety checks, resource validation
5. **Implement** (Builder) → Red QA → Fix → Green
6. **Review** → All gates pass, FM validates 100% GREEN
7. **Deploy** → Production deployment with monitoring
8. **Verify** → Confirm fix in production, close issue

## Key Requirements

✅ **MANDATORY**:
- 100% GREEN (all tests pass)
- Zero test debt (no skips/todos)
- Architecture-first (always)
- Rollback plan (documented)
- Complete audit trail
- All gates pass

❌ **FORBIDDEN**:
- "Just a small fix" (minimizing)
- Skipping architecture review
- Bypassing tests
- "Will test later"
- Direct production edits

## Templates

**Issues**:
- `.github/ISSUE_TEMPLATE/defect-bug.yml`
- `.github/ISSUE_TEMPLATE/defect-feature.yml`
- `.github/ISSUE_TEMPLATE/defect-tech-debt.yml`

**PR**:
- `.github/PULL_REQUEST_TEMPLATE/fix_pr_template.md`

## Evidence Storage

```
/evidence/fixes/{issue-number}/
  discovery/       # Initial report, screenshots
  triage/          # Classification, RCA
  architecture/    # Fix design
  implementation/  # PR links
  validation/      # Test results
  deployment/      # Deployment logs
  closure/         # Final evidence
```

## Rollback

**Vercel Dashboard** (Fastest):
1. Go to https://vercel.com/apgi-cmy/partpulse
2. Deployments → Find last good deployment
3. "Promote to Production"
4. Verify rollback

**Full Procedures**: `/docs/rollback-procedures.md`

## Escalation

**Escalate to Human Owner When**:
- Fix attempt fails repeatedly (3+)
- Root cause cannot be identified
- Governance conflict
- Production risk excessive

## Questions?

- **Process**: `/docs/defect-resolution-process.md`
- **Templates**: `/docs/fix-pr-template.md`
- **Rollback**: `/docs/rollback-procedures.md`
- **Labels**: `/docs/github-labels-configuration.md`
- **Governance**: Governance Liaison or Johan Ras
