# QIW Escalation Workflow

**Document ID**: QIW-ESCALATION-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse Engineering Management + Governance Liaison

---

## Purpose

This document defines the escalation workflow for QIW incidents that exceed SLA thresholds or require elevated attention due to impact or complexity.

---

## Escalation Principles

1. **Timely Escalation**: Don't wait until SLA expires to escalate
2. **Clear Communication**: Provide context and impact when escalating
3. **Appropriate Level**: Escalate to the right level for the issue
4. **Blameless Culture**: Focus on resolution, not blame
5. **Follow-through**: Escalation doesn't end responsibility

---

## Escalation Triggers

### Automatic Triggers

**Time-Based**:
- 50% of SLA elapsed → Warning to assignee
- 75% of SLA elapsed → Pre-escalation notification
- 100% of SLA reached → Automatic escalation

**Severity-Based**:
- Critical incident detected → Immediate escalation
- Multiple high-severity incidents in same component → Escalation
- Repeat incident (same root cause) → Escalation

**Impact-Based**:
- Production outage → Immediate escalation
- SLA violation → Immediate escalation
- Security incident → Immediate escalation
- Multiple users affected → Escalation

### Manual Triggers

**Engineer-Initiated**:
- Root cause unclear after investigation
- Fix requires architectural changes
- Cross-team coordination needed
- Resource constraints blocking resolution
- Lack of expertise/knowledge

**Management-Initiated**:
- Pattern of similar incidents
- Strategic importance
- Compliance requirement
- Governance audit finding

---

## Escalation Levels

```
Level 0: Assigned Engineer
         ↓ (SLA: 50% elapsed or complexity)
Level 1: Team Lead
         ↓ (SLA: 75% elapsed or cross-team)
Level 2: Engineering Manager
         ↓ (SLA: 100% elapsed or critical impact)
Level 3: Engineering Director + Governance Liaison
         ↓ (Strategic or governance)
Level 4: Executive Team
```

---

## Level 0: Assigned Engineer

**Who**: Engineer assigned to the incident

**Responsibilities**:
- Investigate root cause
- Develop remediation plan
- Implement fix
- Verify resolution
- Update incident status

**When to Escalate**:
- Unable to determine root cause within reasonable time
- Fix requires expertise not possessed
- Fix requires changes outside their authority
- Blocked by external dependency
- 50% of SLA elapsed without resolution path

**Escalation Template**:
```markdown
**Escalating to**: Team Lead
**Incident ID**: QIW-TEST-20260114-ABC
**Channel**: Test
**Severity**: High
**Time Elapsed**: 8 hours (50% of SLA)

**Reason for Escalation**: 
Root cause investigation shows issue is in shared authentication library. 
Fix requires coordination with Auth team and may require architecture changes.

**Investigation Summary**:
- Failing tests in user-service
- Root cause: Auth token validation changed behavior
- Affects 12 test cases across 3 services
- Requires Auth team involvement

**Proposed Next Steps**:
1. Coordinate with Auth team lead
2. Assess if architectural change needed
3. Determine fix approach
4. Estimate time to resolution

**Blocking Issues**:
- Need Auth team availability
- Unclear if we can change our implementation or if Auth needs to fix
```

---

## Level 1: Team Lead

**Who**: Technical lead of the team owning the affected component

**Responsibilities**:
- Provide technical guidance
- Unblock engineers
- Coordinate with other teams
- Assess resource allocation
- Approve technical decisions
- Decide if further escalation needed

**When to Escalate**:
- Requires cross-team architectural decision
- Resource constraints (team fully loaded)
- 75% of SLA elapsed
- Incident reveals systemic issue
- Multiple teams affected

**Actions**:
1. **Review Investigation**
   - Validate root cause analysis
   - Assess proposed solution
   - Identify risks

2. **Coordinate Resources**
   - Assign additional engineers if needed
   - Coordinate with other team leads
   - Prioritize against other work

3. **Make Decisions**
   - Approve technical approach
   - Approve bypass requests (if appropriate)
   - Determine if architecture review needed

4. **Communicate**
   - Update stakeholders
   - Set expectations for resolution timeline
   - Document decisions

**Escalation Template**:
```markdown
**Escalating to**: Engineering Manager
**Incident ID**: QIW-TEST-20260114-ABC
**Channel**: Test
**Severity**: High
**Time Elapsed**: 18 hours (75% of SLA)

**Reason for Escalation**:
Issue requires architectural change affecting 3 teams. 
Decision needed on approach and resource allocation across teams.

**Context**:
- Shared auth library behavior changed
- 3 teams affected (User, Payment, Notification services)
- Two possible approaches:
  1. Revert auth library change (impacts all teams)
  2. Update all 3 services to new behavior (more work)

**Resource Requirements**:
- Auth team: 2 engineers, 3 days
- Service teams: 1 engineer each, 2 days
- Architecture review: 1 meeting

**Business Impact**:
- Tests failing blocks deployment of high-priority features
- 3 PRs currently blocked
- Release schedule at risk if not resolved in 6 hours

**Recommendation**:
Approach #1 (revert auth change) - faster, lower risk.
Auth team can make the change properly in next sprint.

**Seeking**:
- Approval of approach
- Resource allocation across teams
- Communication to stakeholders
```

---

## Level 2: Engineering Manager

**Who**: Manager responsible for engineering teams

**Responsibilities**:
- Allocate resources across teams
- Make architectural decisions
- Approve significant technical changes
- Manage stakeholder expectations
- Involve governance liaison for policy issues
- Approve emergency bypasses

**When to Escalate**:
- SLA expired (100%)
- Strategic/business impact
- Governance compliance issue
- Requires executive decision
- Cross-organization coordination needed

**Actions**:
1. **Assess Impact**
   - Business impact
   - User impact
   - Strategic importance
   - Compliance risk

2. **Make Decisions**
   - Approve architectural changes
   - Allocate budget if needed (e.g., infrastructure)
   - Approve emergency bypasses
   - Determine communication strategy

3. **Coordinate**
   - Across teams
   - With product management
   - With governance liaison
   - With executive team if needed

4. **Govern**
   - Ensure proper documentation
   - Ensure learnings captured
   - Ensure preventive measures implemented

**Escalation Template**:
```markdown
**Escalating to**: Engineering Director + Governance Liaison
**Incident ID**: QIW-RUNTIME-20260114-XYZ
**Channel**: Runtime
**Severity**: Critical
**Time Elapsed**: 5 hours (125% of SLA - EXPIRED)

**Reason for Escalation**:
Critical production incident with significant business impact.
Resolution requires executive decision on rollback vs. push forward.
Governance implications due to SLA violation.

**Situation**:
- Production error rate spike: 15% (baseline: 0.5%)
- Affecting payment processing
- Estimated impact: $50K/hour in failed transactions
- Started after deployment 4 hours ago

**Options**:
1. **Immediate Rollback** (30 min)
   - Pros: Stops revenue loss immediately
   - Cons: Delays important feature, customer disappointment
   
2. **Push Fix Forward** (2-3 hours)
   - Pros: Delivers new feature today as promised
   - Cons: Continued revenue loss, risk fix doesn't work

**Stakeholder Impact**:
- Product: Feature promised to key customer for today
- Sales: Demo scheduled for tomorrow with this feature
- Finance: Revenue loss accumulating
- Customers: Failed transactions, support tickets rising

**Technical Assessment**:
- Root cause identified: Race condition in payment queue
- Fix ready but needs thorough testing
- Confidence in fix: 80%
- Risk of fix making it worse: 20%

**Governance Implications**:
- Critical incident SLA violated (4h target exceeded)
- Production incident requires post-mortem
- QA gate should have caught this (testing gap)

**Recommendation**: 
Immediate rollback to stop revenue loss. Deploy fix tomorrow after proper testing.

**Seeking**:
- Executive decision on rollback vs. fix forward
- Stakeholder communication approval
- Post-mortem scheduling
- Governance review of testing gap
```

---

## Level 3: Engineering Director + Governance Liaison

**Who**: Senior engineering leadership + governance authority

**Responsibilities**:
- Make strategic decisions
- Handle governance/compliance issues
- Manage cross-organization impact
- Communicate to executives
- Ensure proper post-incident review
- Authorize policy changes if needed

**When to Escalate**:
- Board/executive level impact
- Legal/compliance implications
- Major customer impact
- Reputation risk
- Requires policy changes

**Actions**:
1. **Strategic Decision**
   - Balance business vs. technical factors
   - Consider long-term implications
   - Assess reputational impact

2. **Governance**
   - Ensure compliance maintained
   - Authorize emergency exceptions if needed
   - Mandate process improvements
   - Schedule governance review

3. **Communication**
   - Executive briefing
   - Customer communication (if needed)
   - Board notification (if threshold met)
   - Public statement (if required)

4. **Accountability**
   - Mandate blameless post-mortem
   - Ensure learnings implemented
   - Track remediation items
   - Report to board if required

---

## Level 4: Executive Team

**Who**: CTO, CEO, or Board

**Rarely Escalated**: Only for incidents with:
- Major customer impact (e.g., SLA violations for key accounts)
- Legal/regulatory implications
- Public relations crisis
- Financial impact exceeding threshold
- Strategic partnership at risk

---

## Escalation Process Steps

### Step 1: Prepare Escalation

```markdown
## Escalation Checklist

- [ ] Incident fully documented in qiw-events.json
- [ ] Root cause identified (or investigation summary)
- [ ] Remediation options evaluated
- [ ] Impact assessment complete
- [ ] Timeline and SLA status clear
- [ ] Recommendation formulated
- [ ] Required decision identified
```

### Step 2: Notify Next Level

**Methods** (use appropriate method for urgency):
- Critical/Urgent: Phone call + Slack/Teams + Email
- High: Slack/Teams + Email
- Medium: Email + mention in incident
- Low: Email

**Template Subject Lines**:
- Critical: `[URGENT ESCALATION] Critical QIW Incident - {Title}`
- High: `[ESCALATION] High Priority QIW Incident - {Title}`
- Medium: `[ESCALATION] QIW Incident - {Title}`

### Step 3: Brief Next Level

**In-Person/Call Brief** (for Critical/High):
1. **Situation** (30 seconds): What's happening?
2. **Impact** (30 seconds): Who/what is affected?
3. **Options** (1 minute): What are the choices?
4. **Recommendation** (30 seconds): What do you recommend?
5. **Decision Needed** (30 seconds): What decision is required?

### Step 4: Document Escalation

Update incident record:
```json
"escalation": {
  "escalated": true,
  "escalated_to": "engineering_manager",
  "escalated_at": "2026-01-14T10:00:00.000Z",
  "escalation_reason": "SLA expired, requires architectural decision and cross-team coordination",
  "escalation_level": 2,
  "decision_made": "Approved approach #1, allocated resources from teams A and B",
  "decision_by": "eng-manager@example.com",
  "decision_at": "2026-01-14T10:30:00.000Z"
}
```

### Step 5: Execute Decision

- Communicate decision to team
- Update incident status
- Implement approved approach
- Continue monitoring

### Step 6: Follow-Up

- Verify issue resolved
- Document lessons learned
- Update escalation procedures if needed
- Thank everyone involved

---

## De-Escalation

**When**: Issue resolved or moved to appropriate level

**Process**:
1. Notify escalated party of resolution
2. Thank them for their involvement
3. Summarize outcome
4. Document in incident record

```json
"escalation": {
  ...
  "de_escalated_at": "2026-01-14T12:00:00.000Z",
  "resolution_summary": "Issue resolved via approach #1. All teams coordinated successfully. Deployment unblocked."
}
```

---

## Escalation Metrics

**Track**:
- Escalation rate (% of incidents escalated)
- Escalation level distribution
- Time to escalation decision
- Effectiveness of escalations (did they help?)

**Target**:
- <10% incidents require escalation
- >90% resolved at Level 1 or below
- <30 minutes to escalation decision (Critical)
- <2 hours to escalation decision (High)

---

## Special Escalation Scenarios

### Security Incident

**Immediate Escalation**: Engineering Manager + Security Team + Governance Liaison

**Special Handling**:
- Limited distribution of details
- Security team leads investigation
- Separate security incident process may apply
- Coordinate with legal if data breach

### Compliance Violation

**Immediate Escalation**: Governance Liaison + Engineering Manager

**Special Handling**:
- Governance liaison assesses compliance impact
- Legal may be involved
- Remediation plan must address compliance
- May require external audit

### Customer-Facing Incident

**Escalation**: Engineering Manager + Product Manager + Customer Success

**Special Handling**:
- Customer communication plan needed
- Product manager involved in decision
- Customer success keeps customers informed
- May require compensation decision

---

## Communication During Escalation

**Principles**:
- ✅ Be clear and concise
- ✅ Focus on facts, not blame
- ✅ Present options with pros/cons
- ✅ Make a recommendation
- ✅ Specify decision needed
- ❌ Don't hide bad news
- ❌ Don't pass the buck without context
- ❌ Don't escalate without preparation

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Active
