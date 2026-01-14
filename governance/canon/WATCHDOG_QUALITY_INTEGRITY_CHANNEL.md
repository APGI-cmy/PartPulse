# Quality Integrity Watchdog (QIW) Channel Specification

**Document ID**: QIW-SPEC-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Status**: Active  
**Authority**: Maturion Governance / FM Office  
**Scope**: Cross-Repository Standard

---

## Purpose

The **Quality Integrity Watchdog (QIW)** is a governance monitoring system that observes development lifecycle channels for anomalies, defects, and quality violations. QIW provides continuous oversight across 5 mandatory observation channels to ensure code quality, process compliance, and early defect detection.

**Mission**: Prevent defects from reaching production through systematic observation, automated anomaly detection, and governance-enforced quality gates.

---

## Constitutional Principle

> "Quality cannot be inspected in—it must be built in. QIW ensures quality is monitored continuously, not just at final gates."

**From BUILD_PHILOSOPHY.md**:
> "One-Time Fully Functional Builds require continuous quality validation. Waiting until the end guarantees rework."

**From Governance Doctrine**:
> "Every repository MUST implement QIW monitoring. Quality visibility is not optional—it is constitutional."

---

## The 5 Observation Channels

QIW monitors quality across five mandatory channels throughout the development lifecycle:

### Channel 1: Build
**What It Monitors**: Code compilation, dependency resolution, build process health  
**Purpose**: Detect build failures, dependency conflicts, configuration errors  
**Frequency**: Every commit, every PR, every deployment preparation

**Key Metrics**:
- Build success rate
- Build duration
- Dependency resolution failures
- Configuration errors
- Build artifact integrity

**Anomaly Patterns**:
- Build failure rate exceeds 5% in main branch
- Build duration increases >50% without justification
- Recurring dependency conflicts
- Intermittent build failures (flaky builds)
- Build artifact corruption

---

### Channel 2: Lint
**What It Monitors**: Code style, static analysis, linting violations  
**Purpose**: Enforce code quality standards, detect code smells, maintain consistency  
**Frequency**: Pre-commit, every PR

**Key Metrics**:
- Linting violation count
- Violation severity distribution
- Code complexity metrics
- Style consistency score
- Technical debt indicators

**Anomaly Patterns**:
- Lint violations increase without remediation plan
- Critical violations merged to main
- Linting checks bypassed or disabled
- Consistent violations in specific modules (quality debt accumulation)
- Code complexity exceeds thresholds

---

### Channel 3: Test
**What It Monitors**: Test execution, coverage, reliability, test health  
**Purpose**: Ensure comprehensive testing, detect test gaps, prevent test degradation  
**Frequency**: Every commit, every PR, scheduled regression runs

**Key Metrics**:
- Test pass rate
- Test coverage percentage
- Test execution time
- Flaky test count
- Test dodging incidents
- Test debt (skipped/disabled tests)

**Anomaly Patterns**:
- Test pass rate drops below 95%
- Coverage decreases without approval
- Flaky tests increase (>2% failure rate on stable code)
- Test execution time degrades >25%
- Test dodging detected (code changes without test updates)
- Skipped tests not tracked in test debt register

---

### Channel 4: Deployment
**What It Monitors**: Deployment process, environment health, deployment success  
**Purpose**: Ensure reliable deployments, detect deployment failures, validate environments  
**Frequency**: Every deployment, environment health checks

**Key Metrics**:
- Deployment success rate
- Deployment duration
- Rollback frequency
- Environment drift detection
- Configuration validation failures
- Post-deployment health check results

**Anomaly Patterns**:
- Deployment failure rate exceeds 10%
- Repeated rollbacks to same version
- Environment configuration drift
- Deployment duration increases significantly
- Health checks failing post-deployment
- Manual intervention required frequently

---

### Channel 5: Runtime
**What It Monitors**: Application behavior in production/staging, errors, performance  
**Purpose**: Detect runtime defects, performance degradation, production incidents  
**Frequency**: Continuous (real-time monitoring)

**Key Metrics**:
- Error rate (4xx, 5xx responses)
- Performance metrics (latency, throughput)
- Resource utilization (CPU, memory, disk)
- Exception/crash count
- User-reported incidents
- SLA compliance

**Anomaly Patterns**:
- Error rate exceeds baseline by >20%
- Response time degradation >30%
- Memory leaks or resource exhaustion
- Repeated crashes in specific modules
- SLA violations
- Production incidents correlating with recent deployments

---

## Severity-Based Blocking Logic

QIW uses a severity classification to determine blocking behavior at quality gates:

### Severity Levels

**CRITICAL (P0)**:
- Blocks all merges immediately
- Requires immediate remediation
- Examples: Build failures, critical security vulnerabilities, production outages

**HIGH (P1)**:
- Blocks merge to main/production branches
- Requires remediation before next release
- Examples: Test failures, high-severity lint violations, deployment failures

**MEDIUM (P2)**:
- Warning issued, does not block
- Requires remediation within sprint
- Examples: Coverage decrease, medium lint violations, performance degradation

**LOW (P3)**:
- Informational only
- Track in backlog for future remediation
- Examples: Minor style violations, technical debt accumulation

### Blocking Rules

```
IF severity = CRITICAL:
  BLOCK all merges
  REQUIRE immediate fix
  ESCALATE to on-call team
  
IF severity = HIGH:
  IF target_branch IN [main, production, release/*]:
    BLOCK merge
    REQUIRE remediation plan
  ELSE:
    ALLOW with warning
    TRACK in incident log
    
IF severity = MEDIUM:
  ALLOW merge
  CREATE tracking issue
  REPORT in dashboard
  
IF severity = LOW:
  ALLOW merge
  LOG for metrics
```

---

## Incident Schema

All QIW anomalies are recorded as structured incidents in `memory/PartPulse/qiw-events.json`:

```json
{
  "incident_id": "QIW-{CHANNEL}-{TIMESTAMP}-{HASH}",
  "timestamp": "2026-01-14T07:58:00.000Z",
  "channel": "build|lint|test|deployment|runtime",
  "severity": "critical|high|medium|low",
  "status": "detected|investigating|remediated|false_positive",
  "title": "Brief description of anomaly",
  "description": "Detailed description with context",
  "detection": {
    "detector": "automated|manual",
    "detection_method": "threshold|pattern|manual_report",
    "confidence": 0.0-1.0
  },
  "impact": {
    "affected_components": ["component1", "component2"],
    "affected_branches": ["main", "feature/xyz"],
    "user_impact": "none|low|medium|high|critical",
    "business_impact": "Description of business impact"
  },
  "metrics": {
    "metric_name": "value",
    "baseline": "expected_value",
    "deviation": "percentage or absolute difference"
  },
  "evidence": {
    "logs": ["log_reference_1", "log_reference_2"],
    "commits": ["commit_sha_1"],
    "pr_numbers": [123],
    "ci_run_urls": ["https://..."],
    "screenshots": ["path/to/screenshot"]
  },
  "remediation": {
    "assigned_to": "user_or_team",
    "remediation_plan": "Description of plan",
    "completed_at": "2026-01-14T08:30:00.000Z",
    "resolution": "Description of how resolved",
    "verification": "How resolution was verified"
  },
  "escalation": {
    "escalated": true,
    "escalated_to": "team_or_role",
    "escalated_at": "2026-01-14T08:00:00.000Z",
    "escalation_reason": "Why escalated"
  },
  "metadata": {
    "created_by": "system|user_id",
    "updated_at": "2026-01-14T08:15:00.000Z",
    "tags": ["tag1", "tag2"],
    "related_incidents": ["QIW-TEST-20260114-ABC"]
  }
}
```

---

## Dashboard Requirements

QIW implementations MUST provide a dashboard with the following features:

### Real-Time Views
- **Channel Health**: Status indicators for all 5 channels (green/yellow/red)
- **Active Incidents**: Count and list of unresolved incidents by severity
- **Recent Detections**: Timeline of last 24h incidents
- **Blocking Status**: Current quality gate block status

### Metrics & Trends
- **Quality Score**: Composite score across all channels (0-100)
- **Incident Trends**: 7-day, 30-day incident counts by channel and severity
- **MTTR (Mean Time To Remediation)**: Average time to resolve incidents
- **Channel Performance**: Individual channel metrics over time

### Reporting
- **Daily Summary**: Automated daily report of QIW activity
- **Weekly Digest**: Trends, top issues, recommendations
- **Incident Reports**: Detailed post-mortem for critical incidents
- **Compliance Report**: Governance adherence metrics

### Alerting
- **Critical Alerts**: Immediate notification for P0 incidents
- **Threshold Alerts**: Notifications when metrics exceed thresholds
- **Escalation Alerts**: Notifications for unresolved incidents past SLA
- **Digest Notifications**: Scheduled summaries for stakeholders

---

## QA Gate Integration

QIW integrates with CI/CD quality gates to enforce blocking logic:

### Pre-Commit Hooks
- Lint channel validation
- Local test execution (if configured)
- Pre-commit quality score check

### Pull Request Gates
- Build channel validation (must pass)
- Lint channel validation (must pass or be acknowledged)
- Test channel validation (must pass, coverage requirements)
- No critical or high incidents in affected code

### Pre-Merge Gates
- All PR gates must pass
- No active critical incidents in target branch
- Deployment readiness check (if deployment-bound branch)

### Post-Merge Monitoring
- Runtime channel monitoring for new deployments
- Incident correlation with recent merges
- Automatic rollback triggers on critical runtime incidents

---

## Escalation Workflow

```
INCIDENT DETECTED
  ↓
[Is Severity = Critical?]
  YES → IMMEDIATE ESCALATION to on-call + block all merges
  NO → Continue
  ↓
[Assign to appropriate team based on channel]
  ↓
[Track in incident log]
  ↓
[Set remediation SLA based on severity:]
  Critical: 4 hours
  High: 24 hours
  Medium: 7 days
  Low: 30 days
  ↓
[Monitor remediation progress]
  ↓
[SLA approaching expiration?]
  YES → ESCALATE to team lead
  NO → Continue monitoring
  ↓
[SLA exceeded?]
  YES → ESCALATE to engineering manager + governance liaison
  NO → Continue
  ↓
[Remediation completed?]
  YES → Verify resolution → Close incident → Update metrics
  NO → Continue escalation chain
```

---

## Implementation Requirements

Every repository adopting QIW MUST implement:

1. **Configuration File** (`qiw-config.json`):
   - Define all 5 channels
   - Configure thresholds for each channel
   - Define severity mappings
   - Configure blocking rules
   - Define dashboard endpoint
   - Configure alerting

2. **Event Memory** (`memory/PartPulse/qiw-events.json`):
   - Append-only incident log
   - Schema-validated entries
   - Indexed for querying
   - Backed up regularly

3. **Detector Implementation**:
   - Automated detectors for each channel
   - Integration with CI/CD pipelines
   - Real-time monitoring for runtime channel
   - Threshold-based anomaly detection

4. **Documentation**:
   - Channel-specific detection patterns
   - Incident response procedures
   - Dashboard usage guide
   - Escalation contacts

5. **Integration**:
   - CI/CD pipeline integration
   - Quality gate enforcement
   - Dashboard deployment
   - Alert routing

---

## Metrics & Reporting

### Key Performance Indicators (KPIs)

**Quality Indicators**:
- Overall Quality Score (composite across all channels)
- Incident count by severity (trend over time)
- Mean Time To Detection (MTTD)
- Mean Time To Remediation (MTTR)
- Repeat incident rate

**Process Indicators**:
- Gate block frequency
- False positive rate
- SLA compliance rate
- Escalation frequency
- Manual intervention rate

**Channel-Specific**:
- Build success rate
- Lint compliance score
- Test coverage and pass rate
- Deployment success rate
- Runtime error rate

### Reporting Cadence

- **Real-time**: Dashboard updates, critical alerts
- **Daily**: Incident summary, channel health
- **Weekly**: Trend analysis, top issues
- **Monthly**: Governance compliance report, KPI review
- **Quarterly**: Strategic review, process improvements

---

## Governance Compliance

### Mandatory Requirements

✅ All 5 channels MUST be configured and monitored  
✅ Incident schema MUST be followed for all detections  
✅ Severity-based blocking MUST be enforced at quality gates  
✅ Dashboard MUST be accessible to all team members  
✅ Escalation workflow MUST be documented and followed  
✅ MTTR SLAs MUST be tracked and reported  

### Audit Requirements

QIW implementations are subject to governance audits:
- Configuration audit: Verify all channels configured
- Incident audit: Random sample of incidents for proper handling
- Blocking audit: Verify gates enforcing blocking rules
- Dashboard audit: Verify dashboard accuracy and uptime
- Process audit: Verify escalation workflow followed

### Non-Compliance Consequences

- Warning: First violation, 7 days to remediate
- Escalation: Second violation, governance liaison involved
- Merge Freeze: Third violation, repository enters governance hold
- Mandatory Review: Persistent violations trigger FM review

---

## Reference Implementations

**FM Office Repository**: Reference implementation with full dashboard  
**R_Roster Repository**: Streamlined implementation for smaller projects  
**Governance Self-Audit PR**: Example integration with governance processes

---

## Version History

| Version | Date | Changes | Authority |
|---------|------|---------|-----------|
| 1.0.0 | 2026-01-14 | Initial canonical specification | Maturion Governance / FM Office |

---

## Canonical Status

**This document is canonical and authoritative.**

**Source**: Maturion Governance  
**Adopted By**: FM Office, R_Roster, PartPulse, [additional repos]  
**Enforcement**: Mandatory for all repositories under Maturion Governance  
**Authority**: Constitutional requirement per Governance Doctrine  

---

## Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Governance Board  
**Effective Date**: 2026-01-14  
**Mandatory Compliance**: YES (Constitutional Requirement)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: QIW implementation is mandatory  
**Enforcement**: Governance Liaison + FM (joint authority)
