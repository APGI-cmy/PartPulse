# QIW Incident Response Procedures

**Document ID**: QIW-INCIDENT-RESPONSE-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse QA Team + Governance Liaison

---

## Purpose

This document defines step-by-step procedures for responding to QIW incidents from detection through remediation and closure.

---

## Incident Lifecycle

```
DETECTION → TRIAGE → INVESTIGATION → REMEDIATION → VERIFICATION → CLOSURE
```

---

## Phase 1: Detection

### Automated Detection

**When**: Detector identifies anomaly matching configured pattern

**Actions**:
1. Detector creates incident record in `qiw-events.json`
2. Incident assigned `status: "detected"`
3. Notification sent per severity level
4. Quality gate updated (if blocking incident)

**Incident Fields Populated**:
- `incident_id`, `timestamp`, `channel`, `severity`
- `title`, `description`
- `detection` (detector, method, confidence)
- `metrics` (relevant metric values)
- `evidence` (logs, commits, PR numbers, CI run URLs)

---

### Manual Detection

**When**: Team member identifies quality issue not caught by automated detectors

**Actions**:
1. Team member manually creates incident in `qiw-events.json`:
   ```json
   {
     "incident_id": "QIW-MANUAL-{TIMESTAMP}-{HASH}",
     "detection": {
       "detector": "manual",
       "detection_method": "manual_report",
       "confidence": 1.0
     },
     "metadata": {
       "created_by": "user@example.com"
     }
   }
   ```
2. Follow same notification and quality gate process

---

## Phase 2: Triage

**Responsible**: On-call engineer (Critical), Team Lead (High), Assigned Engineer (Medium/Low)

**Timeframe**:
- Critical: Within 15 minutes
- High: Within 2 hours
- Medium: Within 24 hours
- Low: Within 1 week

**Triage Steps**:

1. **Validate Incident**
   - Verify the incident is real (not a false positive)
   - Confirm detection accuracy
   - Check if duplicate of existing incident

2. **Assess Impact**
   ```json
   "impact": {
     "affected_components": ["auth-service", "user-api"],
     "affected_branches": ["main"],
     "user_impact": "high",
     "business_impact": "Service degraded for authentication flows"
   }
   ```

3. **Determine Severity** (confirm or adjust)
   - Critical: Production outage, security breach, complete system failure
   - High: Major feature broken, significant performance degradation
   - Medium: Minor feature broken, test failures, moderate technical debt
   - Low: Cosmetic issues, minor technical debt

4. **Assign Owner**
   ```json
   "remediation": {
     "assigned_to": "engineer@example.com"
   }
   ```

5. **Update Status**
   ```json
   "status": "investigating"
   ```

---

### Triage Decision Matrix

| Incident Type | Severity | Assigned To | Action |
|---------------|----------|-------------|--------|
| Production errors spike | Critical | On-call | Immediate response, consider rollback |
| Build failing on main | High | Team lead | Block merges, urgent fix |
| Test coverage decreased | High | PR author | Require fix before merge |
| Lint violations increased | Medium | PR author | Create tracking issue |
| Minor complexity increase | Low | Backlog | Log for future refactor |

---

## Phase 3: Investigation

**Goal**: Understand root cause and determine remediation approach

**Investigation Steps**:

1. **Gather Evidence**
   - Review logs referenced in `evidence`
   - Check related commits and PRs
   - Examine CI/CD run results
   - Review related incidents

2. **Identify Root Cause**
   - What caused the anomaly?
   - When did it start?
   - Is it isolated or systemic?
   - Are there contributing factors?

3. **Document Findings**
   ```json
   "description": "Root cause: Database connection pool exhausted due to missing timeout configuration in new feature deployed in PR #123. Contributing factor: Load testing not performed before deployment."
   ```

4. **Develop Remediation Plan**
   ```json
   "remediation": {
     "remediation_plan": "1. Rollback to previous version. 2. Add connection timeout config. 3. Add load tests. 4. Redeploy with monitoring."
   }
   ```

---

## Phase 4: Remediation

**Goal**: Fix the issue and prevent recurrence

**Remediation Steps**:

1. **Implement Fix**
   - Code changes, configuration updates, or process changes
   - Follow normal PR process unless Critical severity
   - For Critical: May bypass some gates with governance approval

2. **Test Fix**
   - Verify fix resolves the issue
   - Ensure no regression
   - Test in staging before production (if applicable)

3. **Deploy/Merge Fix**
   - Deploy fix to affected environment
   - Merge fix to affected branches
   - Monitor for resolution

4. **Document Resolution**
   ```json
   "remediation": {
     "resolution": "Added connection timeout configuration (60s). Implemented connection pool monitoring. Added load tests covering 2x normal traffic.",
     "completed_at": "2026-01-14T10:30:00.000Z"
   }
   ```

---

### Remediation Patterns by Channel

**Build Channel**:
- Fix dependency conflicts
- Update build configuration
- Optimize build performance
- Fix environment-specific issues

**Lint Channel**:
- Fix code style violations
- Refactor complex code
- Remove lint bypasses
- Update linting rules if justified

**Test Channel**:
- Fix failing tests
- Add missing test coverage
- Fix flaky tests (remove non-determinism)
- Optimize slow tests
- Re-enable skipped tests

**Deployment Channel**:
- Fix deployment scripts
- Sync environment configurations
- Improve health checks
- Optimize deployment process

**Runtime Channel**:
- Fix bugs causing errors
- Optimize performance bottlenecks
- Fix memory leaks
- Scale resources if needed
- Implement proper error handling

---

## Phase 5: Verification

**Goal**: Confirm the fix resolved the issue

**Verification Steps**:

1. **Verify Metrics Returned to Normal**
   ```javascript
   // Example: Error rate verification
   const errorRate = getCurrentErrorRate();
   const baseline = getBaselineErrorRate();
   if (errorRate <= baseline * 1.1) { // Within 10% of baseline
     console.log('Metrics returned to normal');
   }
   ```

2. **Verify No Recurrence**
   - Monitor for 24-48 hours (Critical/High)
   - Monitor for 7 days (Medium/Low)
   - Ensure issue doesn't reappear

3. **Run Automated Detectors**
   - Confirm detectors no longer trigger on this issue
   - Verify fix passes all quality gates

4. **Document Verification**
   ```json
   "remediation": {
     "verification": "Error rate returned to baseline within 30 minutes of deployment. Monitored for 48 hours with no recurrence. All tests passing. CI build times back to normal."
   }
   ```

---

## Phase 6: Closure

**Goal**: Close the incident and capture learnings

**Closure Steps**:

1. **Update Incident Status**
   ```json
   "status": "remediated"
   ```

2. **Complete All Incident Fields**
   - Ensure all required fields populated
   - Add any additional evidence
   - Link related incidents

3. **Post-Mortem (for Critical/High)**
   - Conduct blameless post-mortem
   - Document in separate file if extensive
   - Identify process improvements
   - Create follow-up issues for improvements

4. **Update Metrics**
   - Calculate MTTR for this incident
   - Update channel health scores
   - Update dashboard

5. **Notify Stakeholders**
   - Inform team of resolution
   - Update any blocking PRs/issues
   - Report to governance liaison (if required)

---

## Special Cases

### False Positive

**When**: Triage determines incident is not valid

**Actions**:
```json
"status": "false_positive",
"remediation": {
  "resolution": "Detector triggered on expected behavior. Baseline configuration was out of date. Updated baseline to current normal values.",
  "completed_at": "2026-01-14T09:00:00.000Z"
}
```

**Follow-up**: Update detector configuration to prevent future false positives

---

### Escalation Required

**When**: Incident cannot be resolved within SLA

**Escalation Workflow**:
1. **50% of SLA elapsed**: Warning notification to assignee
2. **SLA threshold reached**: Escalate to next level
   - Critical: 2h → Engineering Manager + Governance Liaison
   - High: 12h → Team Lead + Governance Liaison
   - Medium: 5d → Team Lead
   - Low: 21d → Team Lead

**Escalation Documentation**:
```json
"escalation": {
  "escalated": true,
  "escalated_to": "engineering_manager",
  "escalated_at": "2026-01-14T10:00:00.000Z",
  "escalation_reason": "Root cause unclear after initial investigation. Requires expert consultation."
}
```

---

### Duplicate Incident

**When**: New incident is duplicate of existing incident

**Actions**:
1. Link incidents via `related_incidents`
2. Mark newer incident with note
3. Close duplicate with reference to primary
4. Track all occurrences in primary incident

```json
"metadata": {
  "tags": ["duplicate"],
  "related_incidents": ["QIW-TEST-20260114-ABC"]
},
"status": "remediated",
"remediation": {
  "resolution": "Duplicate of QIW-TEST-20260114-ABC. Consolidated tracking in primary incident."
}
```

---

### Emergency Bypass

**When**: Critical business need requires bypassing QIW block

**Requirements**:
- Governance Liaison approval REQUIRED
- Engineering Manager approval REQUIRED
- Document business justification
- Create follow-up remediation issue

**Documentation**:
```json
"metadata": {
  "tags": ["emergency_bypass"],
  "bypass_approved_by": ["governance@example.com", "eng-manager@example.com"],
  "bypass_reason": "Critical hotfix required for production outage. Issue will be properly remediated in follow-up PR #XYZ.",
  "bypass_timestamp": "2026-01-14T11:00:00.000Z"
}
```

---

## Incident Response Tools

### Querying Open Incidents

```bash
# Get all open critical incidents
jq '.events[] | select(.severity == "critical" and .status != "remediated" and .status != "false_positive")' \
  governance/memory/PartPulse/qiw-events.json

# Get incidents by channel
jq '.events[] | select(.channel == "test" and .status != "remediated")' \
  governance/memory/PartPulse/qiw-events.json
```

### Updating Incident

```javascript
const fs = require('fs');
const eventsFile = 'governance/memory/PartPulse/qiw-events.json';
const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));

const incident = events.events.find(e => e.incident_id === 'QIW-TEST-20260114-ABC');
incident.status = 'investigating';
incident.remediation = {
  assigned_to: 'engineer@example.com',
  remediation_plan: 'Fix failing test assertions'
};
incident.metadata.updated_at = new Date().toISOString();

events.last_updated = new Date().toISOString();
fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
```

---

## Communication Templates

### Critical Incident Alert

```
Subject: [CRITICAL] QIW Incident - {Title}

Incident ID: {incident_id}
Channel: {channel}
Severity: CRITICAL
Status: {status}

Description: {description}

Impact: {business_impact}

Assigned To: {assigned_to}
Expected Resolution: {mttr_target}

Action Required: {action_required}

Incident Link: {link_to_dashboard}
```

### Resolution Notification

```
Subject: [RESOLVED] QIW Incident - {Title}

Incident ID: {incident_id}
Resolved At: {completed_at}
MTTR: {actual_mttr}

Resolution: {resolution}

Verification: {verification}

Root Cause: {root_cause_summary}

Preventive Measures: {preventive_measures}
```

---

## Metrics to Track

- **MTTR** (Mean Time To Remediation) by severity
- **MTTD** (Mean Time To Detection)
- **Incident count** by channel and severity
- **False positive rate** by detector
- **Escalation rate**
- **SLA compliance rate**
- **Repeat incident rate** (same root cause)

---

## Best Practices

1. ✅ **Act Quickly**: Respond within SLA timeframes
2. ✅ **Communicate**: Keep stakeholders informed
3. ✅ **Document**: Complete all incident fields thoroughly
4. ✅ **Verify**: Confirm resolution before closing
5. ✅ **Learn**: Extract lessons from each incident
6. ✅ **Improve**: Update detectors and processes based on learnings
7. ✅ **Prevent**: Address root causes, not just symptoms
8. ❌ **Don't Blame**: Focus on process improvement, not individuals
9. ❌ **Don't Rush**: Take time to understand before fixing
10. ❌ **Don't Ignore**: Every incident deserves proper attention

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Active
