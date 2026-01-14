# QIW QA Gate Integration

**Document ID**: QIW-QA-GATE-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse DevOps + QA Team

---

## Purpose

This document describes how QIW integrates with CI/CD pipelines and quality gates to enforce quality standards and block problematic code from progressing through the development lifecycle.

---

## Quality Gate Philosophy

> **"Quality gates are not obstacles—they are safety nets that catch defects before they impact users."**

QIW implements **severity-based progressive gates** that:
- ✅ Catch issues early in the development process
- ✅ Provide rapid feedback to developers
- ✅ Block only when severity warrants blocking
- ✅ Allow informed decisions about acceptable risks
- ❌ Don't block progress unnecessarily

---

## Gate Hierarchy

```
1. Pre-Commit Hook (Local)
   ↓
2. Pull Request Gate (CI)
   ↓
3. Pre-Merge Gate (CI)
   ↓
4. Deployment Gate (CI/CD)
   ↓
5. Post-Deployment Monitoring (Runtime)
```

---

## Gate 1: Pre-Commit Hook (Local)

**When**: Before code is committed to local repository

**Channels Checked**: Lint

**Purpose**: Catch simple issues before they reach CI

**Implementation**:
```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
```

**Blocking Rules**:
- Critical lint violations: BLOCK commit
- High lint violations: WARN but allow
- Medium/Low: Allow

**Developer Experience**:
```bash
$ git commit -m "Add feature"
✗ eslint found 3 errors
  - Missing semicolon (line 45)
  - Unused variable (line 67)
  - Complexity exceeds 15 (line 120)

[BLOCKED] Fix lint errors before committing
```

**Bypass**: NOT ALLOWED for critical violations

---

## Gate 2: Pull Request Gate (CI)

**When**: When PR is opened or updated

**Channels Checked**: Build, Lint, Test

**Purpose**: Validate code changes are high quality before review

**GitHub Actions Workflow**:
```yaml
name: QIW Quality Gate - PR

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  qiw-quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Build Detector
        run: npm run qiw:detect:build
        
      - name: Run Lint Detector
        run: npm run qiw:detect:lint
        
      - name: Run Test Detector
        run: npm run qiw:detect:test
        
      - name: Evaluate Quality Gate
        run: npm run qiw:evaluate-gate pr
        
      - name: Post Results to PR
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const results = require('./qiw-gate-results.json');
            github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.issue.number,
              body: results.summary
            });
```

**Blocking Rules**:

| Severity | Channel | Action |
|----------|---------|--------|
| Critical | Build | ❌ BLOCK merge |
| Critical | Lint | ❌ BLOCK merge |
| Critical | Test | ❌ BLOCK merge |
| High | Build | ❌ BLOCK merge |
| High | Lint | ⚠️ WARN (block merge to main) |
| High | Test | ❌ BLOCK merge |
| Medium | Any | ✅ ALLOW (create tracking issue) |
| Low | Any | ✅ ALLOW (log only) |

**PR Comment Example**:
```markdown
## QIW Quality Gate Report

**Status**: ❌ BLOCKED

### Critical Issues (1)
- 🔴 **Test**: Test pass rate at 92% (below 95% threshold)
  - Incident ID: QIW-TEST-20260114-ABC
  - 8 failing tests in user authentication module
  - **Action Required**: Fix failing tests before merge

### Warnings (2)
- ⚠️ **Lint**: 3 high-severity violations
  - Complexity exceeds threshold in auth-handler.ts
  - **Recommendation**: Refactor before merge to main
  
- ⚠️ **Build**: Build duration increased 35%
  - New dependency added significant build time
  - **Recommendation**: Investigate before merge

### Summary
- Build: ✅ Passed
- Lint: ⚠️ Warnings
- Test: ❌ Failed
- **Next Steps**: Fix failing tests to unblock merge
```

---

## Gate 3: Pre-Merge Gate (CI)

**When**: Before PR is merged to target branch (main, production, release/*)

**Channels Checked**: Build, Lint, Test, Deployment (readiness)

**Purpose**: Final validation before code enters protected branches

**Additional Checks**:
- All PR gate checks passed
- No active critical/high incidents in target branch
- Code review approved
- Branch up to date with target
- Deployment readiness verified (for deployment-bound branches)

**Blocking Rules** (in addition to PR gate):

| Target Branch | Additional Requirements |
|---------------|-------------------------|
| main | No high lint violations, deployment readiness check passed |
| production | All incidents resolved, full test suite passed, deployment validated in staging |
| release/* | Release notes complete, version bumped, changelog updated |

**GitHub Branch Protection**:
```yaml
# .github/branch-protection.yml
main:
  required_status_checks:
    - QIW Quality Gate - PR
    - QIW Quality Gate - Pre-Merge
  required_reviews: 1
  enforce_admins: true
```

---

## Gate 4: Deployment Gate (CI/CD)

**When**: Before code is deployed to any environment

**Channels Checked**: Build, Test, Deployment

**Purpose**: Ensure deployment will succeed and application will be healthy

**Implementation**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  qiw-deployment-gate:
    runs-on: ubuntu-latest
    steps:
      - name: Run Deployment Readiness Check
        run: npm run qiw:detect:deployment-readiness
        
      - name: Verify Build Artifacts
        run: npm run qiw:verify-build
        
      - name: Validate Environment Config
        run: npm run qiw:validate-env production
        
      - name: Evaluate Deployment Gate
        run: npm run qiw:evaluate-gate deployment
        
  deploy:
    needs: qiw-deployment-gate
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: ./deploy.sh production
        
  post-deployment-validation:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Health Checks
        run: npm run qiw:health-checks production
        
      - name: Smoke Tests
        run: npm run qiw:smoke-tests production
```

**Blocking Rules**:

| Check | Severity | Action |
|-------|----------|--------|
| Build failed | Critical | ❌ BLOCK deployment |
| Tests failing | Critical | ❌ BLOCK deployment |
| Environment drift detected | High | ❌ BLOCK production (allow staging) |
| Deployment failure rate >10% | High | ⚠️ WARN, require approval |
| Health check configuration invalid | High | ❌ BLOCK deployment |

**Deployment Gate Output**:
```
QIW Deployment Gate Evaluation

Target Environment: production
Status: ❌ BLOCKED

Checks:
  ✅ Build artifacts validated
  ✅ All tests passed
  ❌ Environment configuration drift detected
  ✅ Health checks configured
  ⚠️  Recent deployment failure rate: 12% (exceeds 10% threshold)

Blocking Issues:
  1. [HIGH] Environment drift: 3 configuration differences between staging and production
     - DATABASE_POOL_SIZE: staging=20, production=10
     - CACHE_TTL: staging=3600, production=1800
     - LOG_LEVEL: staging=debug, production=info
     
     Action: Verify these differences are intentional or sync configurations

Decision: DEPLOYMENT BLOCKED
Reason: Environment drift must be resolved before production deployment
```

---

## Gate 5: Post-Deployment Monitoring (Runtime)

**When**: Continuously after deployment

**Channels Checked**: Runtime

**Purpose**: Detect issues in production and trigger automatic responses

**Implementation**:
```yaml
name: QIW Runtime Monitoring

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  runtime-monitoring:
    runs-on: ubuntu-latest
    steps:
      - name: Check Error Rates
        run: npm run qiw:detect:error-rate
        
      - name: Check Performance
        run: npm run qiw:detect:performance
        
      - name: Check Resource Utilization
        run: npm run qiw:detect:resources
        
      - name: Evaluate Incidents
        run: npm run qiw:evaluate-runtime
        
      - name: Auto-Rollback if Critical
        if: ${{ env.CRITICAL_INCIDENT == 'true' }}
        run: |
          echo "Critical incident detected, initiating rollback"
          ./rollback.sh production
          npm run qiw:notify-oncall
```

**Automatic Responses**:

| Incident | Severity | Automatic Action |
|----------|----------|------------------|
| Error rate spike >50% | Critical | Trigger rollback consideration, page on-call |
| SLA violation | Critical | Page on-call, create incident ticket |
| Memory leak detected | Critical | Alert on-call, prepare for restart |
| Performance degradation >30% | High | Alert team, trigger profiling |
| Exception rate anomaly | High | Alert team, increase logging |

---

## Quality Gate Check Status

GitHub PR checks show QIW status:

```
QIW Quality Gate - Build    ✅ Passed
QIW Quality Gate - Lint     ⚠️ Warning
QIW Quality Gate - Test     ✅ Passed
QIW Quality Gate - Overall  ⚠️ Warning (allowed)
```

**Status Meanings**:
- ✅ **Passed**: All checks passed, no incidents
- ⚠️ **Warning**: Medium severity incidents, allowed to proceed
- ❌ **Failed**: Critical/High severity incidents, BLOCKED

---

## Bypassing Quality Gates

### When is Bypass Allowed?

**NEVER ALLOWED**:
- ❌ Critical incidents blocking merge/deployment
- ❌ Test failures
- ❌ Build failures
- ❌ Security vulnerabilities

**MAY BE ALLOWED** (with approval):
- ⚠️ High severity lint violations (non-main branches)
- ⚠️ Environment drift with documented justification
- ⚠️ Coverage decrease with test debt tracking

### Bypass Process

1. **Request Bypass**:
   - Comment on PR: `@governance-liaison requesting QIW bypass`
   - Provide business justification
   - Provide remediation plan

2. **Governance Review**:
   - Governance Liaison reviews request
   - Engineering Manager consulted for critical cases
   - Decision documented in PR

3. **If Approved**:
   ```yaml
   # Add label to PR
   labels: ["qiw-bypass-approved"]
   
   # Gate checks for label
   - name: Check Bypass Approval
     if: contains(github.event.pull_request.labels.*.name, 'qiw-bypass-approved')
     run: echo "Bypass approved, allowing merge"
   ```

4. **Follow-up**:
   - Create tracking issue for remediation
   - Link to bypassed incident
   - Set due date per agreement
   - Track in QIW dashboard

---

## Integration with Existing CI/CD

### GitHub Actions Integration

Add QIW detectors to existing workflows:

```yaml
# Existing workflow
- name: Run Tests
  run: npm test

# Add QIW
- name: QIW Test Channel
  run: npm run qiw:detect:test
  if: always()  # Run even if tests fail

- name: QIW Gate Evaluation
  run: npm run qiw:evaluate-gate
  if: always()
```

### Gradual Rollout

**Phase 1: Observe Only** (Week 1-2)
- Run detectors but don't block
- Collect baseline metrics
- Tune thresholds
- Identify false positives

**Phase 2: Warn Only** (Week 3-4)
- Show warnings in PR comments
- Don't block merges yet
- Train team on responding to incidents
- Refine detection patterns

**Phase 3: Block on Critical** (Week 5-6)
- Block merges for critical incidents only
- Allow warnings to pass
- Monitor MTTR

**Phase 4: Full Enforcement** (Week 7+)
- Block based on full severity matrix
- Enable automatic rollback for critical runtime incidents
- Full dashboard deployment

---

## Monitoring Gate Effectiveness

### Key Metrics

1. **Gate Block Rate**: How often gates block (should be <5%)
2. **False Positive Rate**: Incorrectly blocked merges (target <2%)
3. **Defect Escape Rate**: Bugs reaching production despite gates (target <1%)
4. **MTTR from Detection**: Time from gate block to resolution
5. **Developer Satisfaction**: Team feedback on gate usefulness

### Regular Reviews

- **Weekly**: Review gate blocks, identify patterns
- **Monthly**: Adjust thresholds based on metrics
- **Quarterly**: Evaluate gate effectiveness, add/remove gates

---

## Troubleshooting

### Gate Failing Unexpectedly

1. Check incident details in `qiw-events.json`
2. Verify detection is accurate (not false positive)
3. Review recent changes that may have affected metrics
4. Check if thresholds need adjustment

### Gate Not Catching Known Issues

1. Review detector configuration
2. Check if issue matches detection patterns
3. Verify detector is enabled in config
4. Add new detection pattern if needed

### Gate Blocking Valid Code

1. Mark incident as false positive
2. Update detector threshold
3. Add exclusion if appropriate
4. Document reason for adjustment

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Active
