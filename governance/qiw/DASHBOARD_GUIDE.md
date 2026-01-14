# QIW Dashboard Guide

**Document ID**: QIW-DASHBOARD-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse QA Team

---

## Purpose

This document describes the QIW Dashboard features, views, and usage for monitoring quality across all 5 channels.

**Status**: 📋 Documentation Complete | ⏳ Dashboard Implementation Pending

---

## Dashboard Overview

The QIW Dashboard provides real-time visibility into code quality, process health, and incident status across all 5 observation channels.

**URL**: `/governance/qiw/dashboard` (to be deployed)  
**Refresh Interval**: 30 seconds  
**Access**: All team members

---

## Dashboard Views

### 1. Channel Health View

**Purpose**: At-a-glance status of all 5 channels

**Layout**:
```
┌─────────────────────────────────────────┐
│     QIW Channel Health Status           │
├─────────────────────────────────────────┤
│  BUILD      [🟢 HEALTHY]     Score: 98  │
│  LINT       [🟢 HEALTHY]     Score: 95  │
│  TEST       [🟡 WARNING]     Score: 87  │
│  DEPLOYMENT [🟢 HEALTHY]     Score: 92  │
│  RUNTIME    [🟢 HEALTHY]     Score: 96  │
├─────────────────────────────────────────┤
│  Overall Quality Score: 93/100          │
└─────────────────────────────────────────┘
```

**Status Indicators**:
- 🟢 **HEALTHY** (Score 90-100): No issues, all metrics normal
- 🟡 **WARNING** (Score 70-89): Some medium incidents, attention needed
- 🟠 **DEGRADED** (Score 50-69): Multiple incidents, action required
- 🔴 **CRITICAL** (Score <50): Critical incidents, immediate action

**Channel Cards**:
Each channel displays:
- Current status (color-coded)
- Quality score (0-100)
- Active incident count
- Last incident timestamp
- Trend indicator (↑ improving, → stable, ↓ degrading)

**Click Action**: Opens detailed channel view

---

### 2. Active Incidents View

**Purpose**: List of all unresolved incidents requiring attention

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Active Incidents (7)                          Sort: Severity│
├─────────────────────────────────────────────────────────────┤
│  🔴 CRITICAL  Test pass rate at 92%                          │
│     QIW-TEST-20260114-001 | 2h ago | INVESTIGATING          │
│     Assigned: john@example.com | SLA: 2h remaining          │
│     [View Details] [Update Status]                          │
├─────────────────────────────────────────────────────────────┤
│  🟠 HIGH      Lint violations increased by 15                │
│     QIW-LINT-20260114-002 | 5h ago | INVESTIGATING          │
│     Assigned: jane@example.com | SLA: 19h remaining         │
│     [View Details] [Update Status]                          │
├─────────────────────────────────────────────────────────────┤
│  🟡 MEDIUM    Build duration increased 40%                   │
│     QIW-BUILD-20260114-003 | 1d ago | DETECTED              │
│     Assigned: Unassigned | SLA: 6d remaining                │
│     [View Details] [Assign]                                 │
└─────────────────────────────────────────────────────────────┘
```

**Filters**:
- Severity: All | Critical | High | Medium | Low
- Channel: All | Build | Lint | Test | Deployment | Runtime
- Status: All | Detected | Investigating | Remediated
- Assigned: All | Me | Unassigned | Specific User

**Sort Options**:
- Severity (default)
- Time (oldest first / newest first)
- SLA remaining (most urgent first)
- Channel

**Incident Card Details**:
- Severity indicator (color + text)
- Title
- Incident ID | Time elapsed | Current status
- Assignee | SLA remaining (with warning if <25% remaining)
- Action buttons

---

### 3. Recent Detections Timeline

**Purpose**: Chronological view of recent incident detections

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Recent Detections - Last 24 Hours           Show: All     │
├────────────────────────────────────────────────────────────┤
│  14:30  🔴 CRITICAL  Runtime error rate spike              │
│         Channel: Runtime | Auto-detected                   │
│         Error rate: 15% (baseline: 0.5%)                   │
├────────────────────────────────────────────────────────────┤
│  12:15  🟡 MEDIUM    Test duration degradation             │
│         Channel: Test | Auto-detected                      │
│         Duration increased 28% over baseline               │
├────────────────────────────────────────────────────────────┤
│  09:45  🟠 HIGH      Deployment failure                    │
│         Channel: Deployment | Auto-detected                │
│         Health checks failed post-deployment               │
├────────────────────────────────────────────────────────────┤
│  08:20  🟢 INFO      Issue resolved                        │
│         QIW-TEST-20260113-045 marked as remediated         │
└────────────────────────────────────────────────────────────┘
```

**Timeline Filters**:
- Last 24 hours
- Last 7 days
- Last 30 days
- Custom date range

**Entry Types**:
- Incident detected
- Incident status changed
- Incident resolved
- Detector triggered (but no incident created)

---

### 4. Blocking Status View

**Purpose**: Shows current quality gate blocks and their impact

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Quality Gate Blocking Status                              │
├────────────────────────────────────────────────────────────┤
│  🔴 3 PRs Currently Blocked                                │
│                                                             │
│  PR #456: Add payment processing                           │
│    Blocked by: QIW-TEST-20260114-001 (Critical)           │
│    Reason: Test pass rate below threshold                  │
│    Action: Fix 8 failing tests                             │
│    [View PR] [View Incident]                               │
│                                                             │
│  PR #457: Update user profile UI                           │
│    Blocked by: QIW-LINT-20260114-002 (High)               │
│    Reason: 3 high-severity lint violations                 │
│    Action: Fix lint violations before merge to main        │
│    [View PR] [View Incident]                               │
│                                                             │
│  Deployment to production: Blocked                         │
│    Blocked by: QIW-DEPLOY-20260114-010 (High)             │
│    Reason: Environment drift detected                      │
│    Action: Sync configurations before deployment           │
│    [View Deployment] [View Incident]                       │
└────────────────────────────────────────────────────────────┘
```

**Shows**:
- Count of blocked PRs
- List of blocked PRs with reasons
- Blocked deployments
- Actions required to unblock

---

### 5. Quality Score View

**Purpose**: Composite quality score with breakdown

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Overall Quality Score                                      │
│                                                             │
│           ┌────────┐                                        │
│           │   93   │                                        │
│           └────────┘                                        │
│          HEALTHY ✓                                          │
│                                                             │
│  Score Breakdown:                                           │
│  ███████████████████████████░░░░░  Build:       98/100     │
│  ████████████████████████░░░░░░░░  Lint:        95/100     │
│  █████████████████░░░░░░░░░░░░░░░  Test:        87/100 ⚠️  │
│  ██████████████████████░░░░░░░░░░  Deployment:  92/100     │
│  ███████████████████████████░░░░░  Runtime:     96/100     │
│                                                             │
│  Trend: ↑ +2 points this week                              │
└────────────────────────────────────────────────────────────┘
```

**Score Calculation**:
```
Quality Score = (
  (Build Score * 0.20) +
  (Lint Score * 0.15) +
  (Test Score * 0.30) +
  (Deployment Score * 0.15) +
  (Runtime Score * 0.20)
)

Channel Score = 100 - (
  (Critical Incidents * 25) +
  (High Incidents * 10) +
  (Medium Incidents * 3) +
  (Low Incidents * 1)
) with floor of 0
```

---

### 6. Incident Trends View

**Purpose**: Visualize incident patterns over time

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Incident Trends - Last 30 Days                            │
├────────────────────────────────────────────────────────────┤
│  Incidents by Severity:                                    │
│   15 │     x                                               │
│      │                                                     │
│   10 │         x       x                                   │
│      │   x         x       x     x                         │
│    5 │ x   x   x   x   x   x   x   x   x   x             │
│      │ ─────────────────────────────────────────          │
│    0 └───────────────────────────────────────             │
│        1   5   10  15  20  25  30 (days)                  │
│                                                             │
│   Critical: ──  High: ──  Medium: ──  Low: ──            │
│                                                             │
│  Incidents by Channel:                                     │
│   Build:      ████░░░░░░  4 incidents                     │
│   Lint:       ██████░░░░  6 incidents                     │
│   Test:       ████████░░  8 incidents                     │
│   Deployment: ██░░░░░░░░  2 incidents                     │
│   Runtime:    ████░░░░░░  4 incidents                     │
└────────────────────────────────────────────────────────────┘
```

**Views**:
- Incidents by severity over time (line chart)
- Incidents by channel (bar chart)
- MTTR trend (line chart)
- Resolution rate (area chart)

**Time Ranges**:
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range

---

### 7. MTTR Metrics View

**Purpose**: Track Mean Time To Remediation

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  Mean Time To Remediation (MTTR)                           │
├────────────────────────────────────────────────────────────┤
│  Overall MTTR: 6.2 hours                  Target: <8h      │
│  Trend: ↓ Improving (-1.3h vs last month)                 │
│                                                             │
│  By Severity:                                              │
│   Critical:  2.8h  ✓ (Target: <4h)                        │
│   High:     18.5h  ✗ (Target: <24h)                       │
│   Medium:   4.2d   ✓ (Target: <7d)                        │
│   Low:     12.5d   ✓ (Target: <30d)                       │
│                                                             │
│  By Channel:                                               │
│   Build:      4.2h                                         │
│   Lint:       8.5h                                         │
│   Test:      12.1h                                         │
│   Deployment: 6.8h                                         │
│   Runtime:    3.5h                                         │
│                                                             │
│  SLA Compliance: 87% (Target: >95%)                        │
│   On-Time:    26 incidents                                 │
│   Late:        4 incidents ⚠️                              │
└────────────────────────────────────────────────────────────┘
```

**Metrics**:
- Overall MTTR
- MTTR by severity
- MTTR by channel
- SLA compliance rate
- Trend analysis

---

### 8. Channel Performance View

**Purpose**: Deep dive into individual channel metrics

**Select Channel**: [Build] [Lint] [Test] [Deployment] [Runtime]

**Example - Test Channel**:
```
┌────────────────────────────────────────────────────────────┐
│  Test Channel Performance                                   │
├────────────────────────────────────────────────────────────┤
│  Key Metrics:                                              │
│   Test Pass Rate:      96.5%  ✓ (Threshold: >95%)         │
│   Coverage:            82.3%  ✓ (Baseline: 82%)           │
│   Execution Time:      8m 42s ⚠️ (+15% vs baseline)        │
│   Flaky Test Count:    3      ✓ (Target: <5)              │
│   Test Debt:           12     ⚠️ (12 skipped tests)        │
│                                                             │
│  Recent Detections:                                        │
│   • Test pass rate drop - 2h ago (Resolved)               │
│   • Coverage decrease - 1d ago (Investigating)             │
│   • Flaky test detected - 3d ago (Resolved)               │
│                                                             │
│  Active Incidents: 2                                       │
│   🟡 MEDIUM  Test duration degradation (1d)                │
│   🟡 MEDIUM  12 tests skipped/disabled (3d)                │
│                                                             │
│  Detector Status:                                          │
│   ✓ Test pass rate detector     (Last run: 5m ago)        │
│   ✓ Coverage detector            (Last run: 5m ago)        │
│   ✓ Flaky test detector          (Last run: 1h ago)        │
│   ✓ Test dodging detector        (Last run: 5m ago)        │
│   ✓ Skipped test detector        (Last run: 1h ago)        │
│   ✓ Duration degradation         (Last run: 1h ago)        │
└────────────────────────────────────────────────────────────┘
```

**Per-Channel Information**:
- Key metrics for that channel
- Thresholds and baselines
- Recent detections
- Active incidents
- Detector status

---

## Dashboard Features

### 1. Real-Time Updates

- Dashboard refreshes every 30 seconds
- WebSocket connection for instant critical alerts
- Visual indicator when data is stale
- Manual refresh button

### 2. Notifications

**In-App Notifications**:
- Desktop notifications for critical incidents (if enabled)
- Toast notifications for incidents assigned to you
- Badge count on dashboard tab

**Email Digests**:
- Daily summary (configurable time)
- Weekly digest (configurable day)
- Immediate alerts for critical incidents

### 3. Filtering & Search

**Global Search**:
- Search by incident ID
- Search by keyword in title/description
- Search by affected component

**Filters Persist**:
- User's filter preferences saved
- Quick filter presets
- Clear all filters option

### 4. Export & Reporting

**Export Options**:
- Export incident list to CSV
- Export metrics to JSON
- Generate PDF report

**Scheduled Reports**:
- Weekly team report
- Monthly governance report
- Quarterly trend analysis

---

## User Roles & Permissions

**All Users** (Read-Only):
- View all dashboard views
- View incident details
- View metrics and trends

**Engineers** (Contributor):
- All Read-Only permissions
- Update incident status
- Assign incidents
- Mark false positives

**Team Leads** (Maintainer):
- All Contributor permissions
- Reassign incidents
- Adjust detector thresholds
- Approve bypasses

**QA Team** (Admin):
- All Maintainer permissions
- Configure detectors
- Modify dashboard layout
- Manage user permissions

**Governance Liaison** (Governance):
- All permissions
- Access audit logs
- Generate compliance reports
- Override quality gates (with documentation)

---

## Dashboard Usage Patterns

### Daily Check-In (5 minutes)

1. Open Dashboard
2. Check Channel Health View - any red/orange?
3. Review Active Incidents - any assigned to you?
4. Check Blocking Status - any PRs blocked?
5. Take action on your assigned incidents

### Weekly Review (30 minutes)

1. Review Incident Trends - patterns emerging?
2. Check MTTR Metrics - meeting SLAs?
3. Review each Channel Performance - any degradation?
4. Identify systemic issues
5. Update team on trends

### Monthly Governance Review (1 hour)

1. Generate monthly report
2. Review Quality Score trend
3. Analyze MTTR by severity
4. Review SLA compliance
5. Identify process improvements
6. Update detector configurations
7. Present to stakeholders

---

## Alerts Configuration

**Per-User Settings**:
```
┌────────────────────────────────────────┐
│  My Alert Preferences                  │
├────────────────────────────────────────┤
│  Email Notifications:                  │
│    [✓] Critical incidents immediately  │
│    [✓] High incidents assigned to me   │
│    [✓] Daily digest at 08:00          │
│    [ ] Weekly digest                   │
│                                        │
│  Desktop Notifications:                │
│    [✓] Critical incidents              │
│    [✓] Incidents assigned to me        │
│    [ ] All incidents                   │
│                                        │
│  Slack Notifications:                  │
│    [✓] Critical incidents to #incidents│
│    [ ] All incidents to #qiw-alerts    │
└────────────────────────────────────────┘
```

---

## Mobile View

Dashboard is responsive and optimized for mobile:
- Simplified card layouts
- Swipe gestures for navigation
- Push notifications (via mobile app)
- Quick actions (assign, update status)

---

## API Access

Dashboard data available via REST API:

```bash
# Get channel health
GET /api/qiw/channels/health

# Get active incidents
GET /api/qiw/incidents?status=active

# Get metrics
GET /api/qiw/metrics?channel=test&range=7d

# Update incident
PATCH /api/qiw/incidents/{incident_id}
```

See API documentation for full details.

---

## Dashboard Implementation

**Technology Stack** (Recommended):
- **Frontend**: React + TypeScript
- **Charts**: Chart.js or D3.js
- **Real-time**: WebSocket or Server-Sent Events
- **API**: Node.js + Express
- **Data Source**: `qiw-events.json` + metrics database

**Deployment**:
- Host at `/governance/qiw/dashboard`
- Integrate with GitHub OAuth
- Deploy to Vercel/Netlify or internal hosting

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Documentation Complete, Awaiting Implementation
