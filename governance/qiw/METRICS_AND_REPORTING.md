# QIW Metrics and Reporting

**Document ID**: QIW-METRICS-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse QA Team + Governance Liaison

---

## Purpose

This document defines the metrics tracked by QIW, reporting cadence, KPIs, and analysis guidelines for quality monitoring and governance compliance.

---

## Metric Categories

### 1. Quality Indicators
Measure overall quality and incident trends

### 2. Process Indicators
Measure effectiveness of QIW process itself

### 3. Channel-Specific Metrics
Measure health of individual observation channels

---

## Quality Indicators

### Overall Quality Score

**Definition**: Composite score (0-100) across all 5 channels  
**Formula**:
```
Quality Score = (
  (Build Score * 0.20) +
  (Lint Score * 0.15) +
  (Test Score * 0.30) +
  (Deployment Score * 0.15) +
  (Runtime Score * 0.20)
)
```

**Targets**:
- Excellent: 90-100
- Good: 75-89
- Acceptable: 60-74
- Needs Improvement: <60

**Tracking**: Continuous, reported daily

---

### Incident Count

**Definition**: Total number of incidents by severity over time period

**Metrics**:
- Total incidents
- Critical incidents
- High severity incidents
- Medium severity incidents
- Low severity incidents

**Targets**:
- Critical: 0 per week
- High: <5 per week
- Medium: <15 per week
- Low: <30 per week

**Tracking**: Daily/Weekly/Monthly

**Analysis**:
- Trend over time (increasing/decreasing)
- Distribution by channel
- Repeat incidents (same root cause)

---

### Mean Time To Detection (MTTD)

**Definition**: Average time from anomaly occurrence to QIW detection

**Formula**:
```
MTTD = Σ(Detection Time - Anomaly Start Time) / Number of Incidents
```

**Targets**:
- Build: <5 minutes
- Lint: <5 minutes (pre-commit)
- Test: <5 minutes
- Deployment: <10 minutes
- Runtime: <5 minutes

**Tracking**: Monthly

---

### Mean Time To Remediation (MTTR)

**Definition**: Average time from detection to resolution

**Formula**:
```
MTTR = Σ(Resolution Time - Detection Time) / Number of Resolved Incidents
```

**Targets by Severity**:
- Critical: <4 hours
- High: <24 hours
- Medium: <7 days
- Low: <30 days

**Tracking**: Daily/Weekly/Monthly

**Breakdown**:
- MTTR by severity
- MTTR by channel
- MTTR by team
- MTTR trend over time

---

### Repeat Incident Rate

**Definition**: Percentage of incidents with same root cause as previously resolved incident

**Formula**:
```
Repeat Rate = (Repeat Incidents / Total Incidents) * 100
```

**Target**: <10%

**Tracking**: Monthly

**Analysis**: Indicates effectiveness of root cause fixes

---

### SLA Compliance Rate

**Definition**: Percentage of incidents resolved within SLA

**Formula**:
```
SLA Compliance = (Incidents Resolved Within SLA / Total Resolved Incidents) * 100
```

**Target**: >95%

**Tracking**: Weekly/Monthly

**Breakdown**:
- By severity
- By channel
- By team

---

## Process Indicators

### False Positive Rate

**Definition**: Percentage of incidents marked as false positives

**Formula**:
```
False Positive Rate = (False Positives / Total Incidents) * 100
```

**Target**: <2%

**Tracking**: Weekly

**Analysis**:
- By detector
- By channel
- Root cause of false positives

**Action**: Adjust detector thresholds if FP rate exceeds 5%

---

### Gate Block Rate

**Definition**: Percentage of PRs/deployments blocked by quality gates

**Formula**:
```
Block Rate = (Blocked Items / Total Items) * 100
```

**Target**: <5% (indicates good quality practices)

**Tracking**: Weekly

**Analysis**:
- Block rate by gate (PR vs. Deployment)
- Block rate by channel
- Trend over time

**Note**: Very low (<1%) may indicate gates too lenient. Very high (>10%) may indicate systemic quality issues.

---

### Escalation Rate

**Definition**: Percentage of incidents requiring escalation

**Formula**:
```
Escalation Rate = (Escalated Incidents / Total Incidents) * 100
```

**Target**: <10%

**Tracking**: Monthly

**Breakdown**:
- By escalation level
- By incident severity
- By channel

---

### Detector Health

**Definition**: Reliability and effectiveness of automated detectors

**Metrics**:
- Detector uptime (% time operational)
- Detector accuracy (true positives / (true positives + false positives))
- Detector coverage (% of anomalies caught)

**Targets**:
- Uptime: >99%
- Accuracy: >95%
- Coverage: >90%

**Tracking**: Weekly

---

### Quality Gate Bypass Rate

**Definition**: Percentage of gates bypassed with approval

**Formula**:
```
Bypass Rate = (Bypassed Gates / Total Gates) * 100
```

**Target**: <1%

**Tracking**: Monthly

**Analysis**: Each bypass should be reviewed for patterns

---

## Channel-Specific Metrics

### Build Channel

**Metrics**:
- Build success rate
- Build duration (p50, p95)
- Dependency resolution failures
- Build failure rate on main branch

**Targets**:
- Success rate: >95%
- Duration increase: <10% vs baseline
- Failures on main: <5% per week

---

### Lint Channel

**Metrics**:
- Total lint violations
- Violations by severity (error, warning)
- Code complexity (cyclomatic complexity)
- Lint bypass count

**Targets**:
- Critical violations: 0 on main
- Total violations: Not increasing
- Complexity: <15 per function

---

### Test Channel

**Metrics**:
- Test pass rate
- Test coverage (line, branch, statement)
- Flaky test count
- Test dodging incidents
- Test debt (skipped tests)
- Test execution time

**Targets**:
- Pass rate: >95%
- Coverage: >80% (or baseline)
- Flaky tests: <5 total
- Test dodging: 0 per week
- Execution time: <10 minutes

---

### Deployment Channel

**Metrics**:
- Deployment success rate
- Deployment duration
- Rollback frequency
- Environment drift count
- Post-deployment health check failures

**Targets**:
- Success rate: >90%
- Duration: <30 minutes
- Rollbacks: <2 per month
- Environment drift: 0
- Health check failures: 0

---

### Runtime Channel

**Metrics**:
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)
- CPU utilization
- Memory utilization
- Exception count
- SLA compliance

**Targets**:
- Error rate: <1%
- P95 response time: <500ms
- CPU utilization: <70%
- Memory: Stable (no leaks)
- SLA compliance: >99%

---

## Reporting Cadence

### Real-Time

**Audience**: All engineers  
**Content**: Critical incidents  
**Delivery**: Dashboard, Slack/email alerts  

**Includes**:
- Critical incident alerts
- Quality gate block notifications
- SLA expiration warnings

---

### Daily

**Audience**: Team members  
**Content**: Daily incident summary  
**Delivery**: Email digest (08:00)  

**Includes**:
- Incidents detected yesterday
- Incidents resolved yesterday
- Active critical/high incidents
- PRs currently blocked
- MTTR for resolved incidents

**Template**:
```
QIW Daily Digest - 2026-01-14

Channel Health:
  Build: 🟢 98  Lint: 🟢 95  Test: 🟡 87  Deploy: 🟢 92  Runtime: 🟢 96

Yesterday's Activity:
  • 3 new incidents detected (1 high, 2 medium)
  • 5 incidents resolved
  • MTTR: 6.2 hours (target: <8h)

Active Critical/High Incidents: 2
  • QIW-TEST-20260114-001 - Test pass rate at 92% (2h old, INVESTIGATING)
  • QIW-LINT-20260114-002 - Lint violations increased (5h old, INVESTIGATING)

Blocked PRs: 3
  • PR #456 - Blocked by QIW-TEST-20260114-001
  • PR #457 - Blocked by QIW-LINT-20260114-002
  • PR #458 - Blocked by QIW-BUILD-20260113-045

Actions Needed:
  • Fix failing tests in auth module
  • Address lint violations before merge to main
  • Resolve build configuration issue

View full dashboard: /governance/qiw/dashboard
```

---

### Weekly

**Audience**: Team + Team Leads  
**Content**: Weekly trends and analysis  
**Delivery**: Email (Monday 09:00)  

**Includes**:
- Quality score trend
- Incident count by channel and severity
- MTTR metrics
- SLA compliance
- Top issues
- Recommendations

**Template**:
```
QIW Weekly Digest - Week of 2026-01-07

Overall Quality Score: 93 (↑ +2 from last week) 🟢

Incidents This Week:
  • Total: 24 (↓ -3 from last week)
  • Critical: 0 ✓
  • High: 4 (↑ +1)
  • Medium: 12 (↓ -3)
  • Low: 8 (↓ -1)

MTTR by Severity:
  • Critical: N/A (no incidents)
  • High: 18.5h (target: <24h) ✓
  • Medium: 4.2d (target: <7d) ✓
  • Low: 12.5d (target: <30d) ✓

SLA Compliance: 87% (target: >95%) ⚠️
  • On-time: 26 incidents
  • Late: 4 incidents

Channel Breakdown:
  • Build: 4 incidents, MTTR 4.2h
  • Lint: 6 incidents, MTTR 8.5h
  • Test: 8 incidents, MTTR 12.1h (⚠️ increasing trend)
  • Deployment: 2 incidents, MTTR 6.8h
  • Runtime: 4 incidents, MTTR 3.5h

Top Issues:
  1. Test flakiness in auth module (3 incidents)
  2. Lint violations accumulating in legacy code (2 incidents)
  3. Build time increasing with new dependencies (1 incident)

Recommendations:
  • Focus on fixing flaky tests in auth module
  • Schedule tech debt sprint for lint violations
  • Review recent dependency additions for build impact

Team Recognition:
  • Fastest resolution: jane@example.com (1.2h avg MTTR)
  • Most incidents resolved: john@example.com (8 resolved)

View full report: /governance/qiw/reports/weekly/2026-W02
```

---

### Monthly

**Audience**: Engineering Managers + Governance Liaison  
**Content**: Monthly trends, KPI review, governance compliance  
**Delivery**: Report generated, presentation scheduled  

**Includes**:
- Monthly KPI dashboard
- Incident trends analysis
- Channel performance comparison
- MTTR trends
- Process improvement recommendations
- Governance compliance assessment

**Sections**:
1. Executive Summary
2. Quality Metrics
3. Process Metrics
4. Channel Analysis
5. Trends and Patterns
6. Governance Compliance
7. Recommendations

---

### Quarterly

**Audience**: Executive Team + Board (if applicable)  
**Content**: Strategic review, long-term trends  
**Delivery**: Executive presentation  

**Includes**:
- Quarterly quality trends
- Year-over-year comparison
- Impact on business metrics (deployment frequency, MTBF, customer satisfaction)
- ROI of QIW implementation
- Strategic recommendations

---

## Metric Collection

### Data Sources

**Primary**:
- `governance/memory/PartPulse/qiw-events.json` (incident data)

**Secondary**:
- CI/CD logs (build, test, deployment metrics)
- Application monitoring (runtime metrics)
- Git history (code churn, PR data)
- Linter output (code quality metrics)

### Collection Frequency

- Real-time: Runtime metrics (every 1-5 minutes)
- Continuous: Build, lint, test metrics (every commit/PR)
- Hourly: Aggregated runtime metrics
- Daily: Incident summaries, MTTR calculations
- Weekly: Trend analysis, SLA compliance
- Monthly: KPI rollups, governance reports

---

## Analysis Guidelines

### Trend Analysis

**Look for**:
- Increasing incident counts (quality degrading)
- Increasing MTTR (process degrading)
- Patterns by channel (specific area needs attention)
- Patterns by team (training or resource needs)
- Correlation with deployments (new code quality)

**Red Flags**:
- Sudden spike in incidents
- MTTR trending upward
- SLA compliance dropping
- Repeat incidents increasing
- False positive rate increasing

---

### Root Cause Analysis

For patterns of incidents:
1. Group incidents by similarity
2. Identify common factors
3. Determine root cause
4. Propose systemic fix
5. Track implementation
6. Verify effectiveness

---

### Comparative Analysis

**Compare**:
- This week vs. last week
- This month vs. last month
- This quarter vs. last quarter
- Team A vs. Team B (for learning, not competition)
- Channel A vs. Channel B (resource allocation)

---

## Metric Visualization

### Charts and Graphs

**Line Charts**: Trends over time
- Quality score
- Incident count
- MTTR

**Bar Charts**: Comparisons
- Incidents by channel
- Incidents by severity
- MTTR by channel

**Pie Charts**: Distribution
- Incidents by channel (%)
- Incidents by severity (%)

**Heat Maps**: Patterns
- Incident frequency by day/time
- Incident concentration by module

**Gauges**: Current status
- Quality score
- SLA compliance
- Channel health

---

## Reporting Tools

**Recommended Tools**:
- **Dashboard**: Real-time metrics (React + Chart.js)
- **Reports**: Automated report generation (Node.js + PDFKit)
- **Analytics**: Trend analysis (Python + Pandas)
- **Alerts**: Threshold monitoring (Node.js + Nodemailer)

**Data Export**:
- CSV: For spreadsheet analysis
- JSON: For programmatic access
- PDF: For formal reports
- API: For integration with other tools

---

## Governance Reporting

### Compliance Metrics

**QIW Implementation Compliance**:
- ✅ All 5 channels operational
- ✅ Incident schema followed
- ✅ SLA targets met
- ✅ Dashboard accessible
- ✅ Escalation process followed

**Audit Trail**:
- All incidents logged in `qiw-events.json`
- Append-only integrity maintained
- All escalations documented
- All bypasses approved and tracked

**Monthly Governance Report**:
```
QIW Governance Compliance Report - January 2026

Implementation Status: ✅ COMPLIANT

Channel Operations:
  ✅ Build channel: Operational
  ✅ Lint channel: Operational
  ✅ Test channel: Operational
  ✅ Deployment channel: Operational
  ✅ Runtime channel: Operational

Incident Management:
  • Total incidents: 87
  • Schema compliance: 100%
  • Append-only integrity: Verified ✓
  • SLA compliance: 87% (target: >95%) ⚠️

Quality Gates:
  • Gates operational: 100%
  • Block rate: 4.2% ✓
  • Bypass rate: 0.8% ✓
  • False positive rate: 1.5% ✓

Process Compliance:
  • Escalation process followed: 100%
  • Incident response procedures followed: 98%
  • Documentation complete: 100%

Issues Identified:
  • SLA compliance below target (87% vs. 95%)
  • 4 incidents exceeded SLA (all High severity)

Recommendations:
  • Focus on reducing MTTR for High severity incidents
  • Consider adding resources to QA team
  • Review test channel detector accuracy

Governance Liaison Sign-Off:
  Name: governance@example.com
  Date: 2026-02-01
  Status: Approved with recommendations
```

---

## Continuous Improvement

### Metric Review Cycle

**Monthly Review**:
1. Review all metrics
2. Identify trends
3. Propose threshold adjustments
4. Implement improvements
5. Verify effectiveness

**Quarterly Review**:
1. Assess metric relevance
2. Add/remove metrics as needed
3. Update targets based on baseline
4. Strategic recommendations

---

## Best Practices

1. ✅ **Track Consistently**: Don't skip metric collection
2. ✅ **Analyze Regularly**: Weekly minimum for trends
3. ✅ **Act on Data**: Metrics without action are wasted
4. ✅ **Communicate**: Share metrics broadly
5. ✅ **Improve**: Use metrics to drive improvement
6. ❌ **Don't Game**: Metrics should reflect reality
7. ❌ **Don't Overload**: Too many metrics dilute focus
8. ❌ **Don't Ignore**: Pay attention to concerning trends

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Active
