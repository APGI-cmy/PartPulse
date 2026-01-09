# Builder Escalation Guidance

**Document ID**: BUILDER-ESCALATION-GUIDE-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Audience**: All Builder Agents

---

## Purpose

This document provides comprehensive guidance for builders on **when to STOP work and ESCALATE** to FM (Foreman). Understanding when and how to escalate is critical to maintaining One-Time Build discipline and preventing wasted effort on incorrect paths.

**Core Principle**: Escalation is not failure—it's professional responsibility. **When in doubt, STOP and ESCALATE.**

---

## Constitutional Foundation

**From BUILD_PHILOSOPHY.md**:
> "Builder Protection: Builders MUST NOT begin implementation without architecture freeze, make architectural decisions during implementation, work around undefined architecture, or proceed if architecture is incomplete. Builders MUST STOP if architecture gaps discovered, ESCALATE to FM immediately, Wait for architecture clarification/completion, Never guess or assume architectural intent."

**From Agent Boundaries Doctrine**:
> "Each agent has defined scope and authority. Working outside scope or beyond authority is a constitutional violation. When scope unclear or authority insufficient: STOP and ESCALATE."

---

## Section 1: When to STOP and ESCALATE

### 1.1 STOP IMMEDIATELY and ESCALATE If:

#### 1.1.1 Architecture Gaps or Ambiguity
**STOP if**:
- Architecture specification unclear or ambiguous
- Component interfaces not defined
- Data structures not specified
- Integration patterns not documented
- Error handling approach not defined
- Security requirements not specified
- Performance requirements not clear

**Why**: Guessing architectural intent leads to rework and architectural drift. FM must clarify or update architecture.

**Example Escalation**:
> "Architecture gap: EXTERNAL_DEPENDENCIES.md specifies integration with Payment API but does not define error handling for timeout scenarios. Need clarification on: retry logic, fallback behavior, user notification approach."

---

#### 1.1.2 Test Failures You Cannot Resolve
**STOP if**:
- Assigned tests consistently fail despite correct implementation
- Test expectations seem incorrect or unclear
- Test infrastructure broken or incomplete
- Mock behavior doesn't match real system behavior
- Tests flaky (pass sometimes, fail other times)

**Why**: Continuous test failure indicates either implementation gap, test gap, or architecture gap. FM must diagnose root cause.

**Example Escalation**:
> "Test TC-045 (authentication flow) fails with 'session not found' despite correct implementation. Mock session store may be incorrectly configured. Have verified implementation matches architecture spec. Need review of test infrastructure."

---

#### 1.1.3 Scope Ambiguity
**STOP if**:
- Unclear what features to implement
- Unclear where feature boundaries are
- Conflicting requirements or specifications
- Acceptance criteria ambiguous
- Wave assignment unclear

**Why**: Implementing wrong scope wastes effort and creates rework. FM must clarify scope boundaries.

**Example Escalation**:
> "Scope ambiguity: Wave 3 assignment includes 'user management' but FRS has two definitions: FR-023 (basic user CRUD) and FR-045 (advanced permission management). Need clarification on Wave 3 scope."

---

#### 1.1.4 Technical Blockers
**STOP if**:
- External dependency unavailable or broken
- Development environment setup fails
- Required tools or libraries not available
- Build process fails (not due to your code)
- Database migrations fail
- CI infrastructure failing

**Why**: Technical blockers beyond builder control need FM intervention or escalation to infrastructure.

**Example Escalation**:
> "Technical blocker: Database migration #005 fails with 'permission denied' on test database. Migration runs successfully locally but fails on CI. Need infrastructure support."

---

#### 1.1.5 Security Concerns
**STOP if**:
- Potential security vulnerability discovered
- Unclear how to securely implement a feature
- Security requirements conflict with functionality
- Third-party library has known vulnerabilities
- Data exposure risk identified

**Why**: Security issues are critical and require FM review before proceeding. Never implement insecure code.

**Example Escalation**:
> "Security concern: API endpoint /api/users/:id returns all user data including password hash. Architecture spec doesn't specify which fields to expose. Need security review before implementing response schema."

---

#### 1.1.6 Performance Issues
**STOP if**:
- Implementation causes unacceptable performance degradation
- Database queries too slow
- Memory usage excessive
- Response times exceed requirements
- Unclear how to optimize within architecture

**Why**: Performance issues may require architectural changes. FM must determine if optimization within scope or architecture adjustment needed.

**Example Escalation**:
> "Performance issue: Query for user transaction history takes 8+ seconds with 10K records. Current implementation fetches all records then filters. Architecture doesn't specify pagination approach. Need guidance on optimization strategy."

---

#### 1.1.7 Test Debt Temptation
**STOP if**:
- Tempted to use `.skip()` to make tests pass
- Tempted to comment out failing tests
- Tempted to stub test implementation "temporarily"
- Tempted to use `|| true` bypass
- Cannot achieve GREEN without test debt

**Why**: Test debt is NEVER acceptable. If GREEN cannot be achieved without test debt, there's a deeper problem (architecture gap, test gap, or requirement gap). FM must diagnose.

**Example Escalation**:
> "Test debt temptation: TC-067 (concurrent user access) fails intermittently. Tempted to skip this test to proceed. Issue appears to be race condition in test infrastructure. Need FM review before proceeding—will NOT skip test."

---

#### 1.1.8 Merge Gate Failures
**STOP if**:
- Merge gate failing and reason unclear
- CI workflows failing unexpectedly
- Governance checks failing unexpectedly
- All tests pass locally but fail on CI
- Merge blocked and unsure why

**Why**: Merge gate failures indicate either builder issue, infrastructure issue, or configuration issue. FM must diagnose and resolve.

**Example Escalation**:
> "Merge gate failure: CI workflow 'qa-enforcement' failing with 'registry.json validation error' but QA parking registry is empty and validation passes locally. Need FM investigation of CI configuration."

---

### 1.2 STOP and CONSIDER ESCALATION If:

These situations may not require immediate escalation but warrant pausing to assess:

#### 1.2.1 Implementation Taking Longer Than Expected
- If estimated 2 hours, now at 6 hours with no end in sight
- May indicate architecture gap, scope misunderstanding, or technical complexity not anticipated

**Action**: Document what's taking longer and why, then escalate for FM assessment.

---

#### 1.2.2 Multiple Approaches Seem Viable
- If architecture doesn't specify which approach to use
- If multiple implementation patterns could satisfy requirements

**Action**: Document all viable approaches with pros/cons, then escalate for FM decision.

---

#### 1.2.3 Deviation from Architecture Seems Necessary
- If following architecture seems impossible or extremely difficult
- If architecture seems incorrect for this specific case

**Action**: Document why deviation seems necessary, then escalate. Do NOT deviate without FM approval.

---

#### 1.2.4 Discovering Existing Code Issues
- If working on Wave 3 but discover Wave 1 code has bugs
- If finding technical debt in previously completed waves

**Action**: Document issues found but DO NOT fix (out of scope). Escalate for FM to assign remediation appropriately.

---

## Section 2: How to ESCALATE Effectively

### 2.1 Escalation Template

**Use this template for all escalations**:

```markdown
# BUILDER ESCALATION

**Escalation ID**: [Auto-generated or BUILDER-YYYY-MM-DD-NNN]  
**Date**: [YYYY-MM-DD]  
**Time**: [HH:MM UTC]  
**Builder**: [Your Name/Agent Type]  
**Priority**: [CRITICAL | HIGH | MEDIUM | LOW]

---

## Context

**PR**: [PR number if applicable, or N/A]  
**Wave/Task**: [What you're working on]  
**Assigned Tests**: [TC-XXX through TC-YYY]  
**Work State**: [% complete estimate]

---

## Issue

**Category**: [Architecture Gap | Test Failure | Scope Ambiguity | Technical Blocker | Security Concern | Performance Issue | Test Debt Temptation | Merge Gate Failure | Other]

**Clear Description**:
[Describe the problem in detail. Be specific. Include error messages, symptoms, what you expected vs. what you got.]

---

## When

**Occurred**: [When did this issue first appear?]  
**Duration**: [How long have you been stuck?]  
**Impact**: [What work is blocked?]

---

## What You've Tried

1. [First thing you tried and result]
2. [Second thing you tried and result]
3. [Third thing you tried and result]

**Research Done**:
- [Documentation reviewed]
- [Similar code examined]
- [Stack Overflow / resources consulted]

---

## Why You're Blocked

[Clear explanation of why you cannot proceed without FM intervention. What specific decision, clarification, or action do you need?]

---

## Impact Assessment

**Blocked Work**:
- [Specific tests blocked]
- [Specific features blocked]
- [Dependencies blocked]

**Urgency**:
- [ ] CRITICAL: Wave completely blocked
- [ ] HIGH: Major functionality blocked
- [ ] MEDIUM: Specific feature blocked
- [ ] LOW: Minor clarification needed

**Workaround Available**: [YES / NO]  
**If YES**: [Describe workaround, but do NOT implement without FM approval]

---

## Request

**What You Need from FM**:
- [ ] Architecture clarification
- [ ] Scope clarification
- [ ] Technical assistance
- [ ] Test infrastructure fix
- [ ] Security review
- [ ] Performance guidance
- [ ] Merge gate investigation
- [ ] Permission to deviate from architecture
- [ ] Other: [specify]

**Specific Question(s)**:
1. [Question 1]
2. [Question 2]
3. [Question 3]

---

## Evidence

**Attached**:
- [ ] Error logs
- [ ] Test output
- [ ] Screenshots
- [ ] Code snippets
- [ ] Architecture references
- [ ] Other: [specify]

**Evidence Location**: [Links to files, logs, screenshots]

---

## Proposed Solutions (Optional)

If you have ideas for potential solutions, list them here (but do NOT implement without FM approval):

1. **Solution A**: [Description]  
   - **Pros**: [Benefits]  
   - **Cons**: [Drawbacks]  
   - **Architecture Impact**: [None / Minor / Major]

2. **Solution B**: [Description]  
   - **Pros**: [Benefits]  
   - **Cons**: [Drawbacks]  
   - **Architecture Impact**: [None / Minor / Major]

---

## Next Steps

**Your Status**: BLOCKED - Waiting for FM response  
**Continuing Work**: [What can you work on while waiting, if anything]  
**Response Needed By**: [If time-sensitive, specify deadline]

---

**Builder**: [Your Name/Agent Type]  
**Tag**: @ForemanApp (or appropriate FM contact)  
**Escalation Method**: [GitHub Issue / PR Comment / Direct Message]
```

---

### 2.2 Escalation Channels

**Primary Channel**: GitHub Issue
- Create new issue using escalation template
- Tag with `escalation` label
- Tag with appropriate category label (`architecture`, `qa`, `security`, etc.)
- Tag FM in issue body

**Secondary Channel**: PR Comment
- If escalation related to specific PR
- Comment on PR using escalation template
- Tag FM in comment

**Emergency Channel**: Direct Communication
- Only for CRITICAL escalations (security, production issues)
- Follow up with formal escalation documentation

---

### 2.3 Escalation Priority Levels

**CRITICAL**: 
- Security vulnerability discovered
- Production-impacting issue
- Entire wave blocked
- Deadline at risk

**HIGH**:
- Major functionality blocked
- Multiple tests blocked
- Architecture gap affecting multiple features
- Performance issue significant

**MEDIUM**:
- Specific feature blocked
- Single test blocked
- Scope clarification needed
- Technical blocker with potential workaround

**LOW**:
- Minor clarification needed
- Documentation gap
- Non-blocking question
- Enhancement suggestion

---

### 2.4 After Escalating

**DO**:
- ✅ Wait for FM response before proceeding with blocked work
- ✅ Document your escalation time (for learnings)
- ✅ Work on non-blocked tasks if available
- ✅ Be available to provide additional information
- ✅ Test FM's resolution when provided
- ✅ Confirm resolution worked

**DO NOT**:
- ❌ Proceed with guessing/assuming
- ❌ Implement workarounds without FM approval
- ❌ Skip tests to work around blockers
- ❌ Modify architecture without FM approval
- ❌ Ignore escalation and hope problem goes away
- ❌ Pressure FM to rush resolution

---

## Section 3: Escalation Response Expectations

### 3.1 Response Times (General Guidelines)

**CRITICAL**: Within 2 hours  
**HIGH**: Within 4 hours  
**MEDIUM**: Within 1 business day  
**LOW**: Within 2 business days

*Note: Actual response times may vary. These are guidelines.*

---

### 3.2 What FM Will Do

**FM will**:
1. Acknowledge escalation
2. Assess issue and priority
3. Investigate root cause
4. Provide one of:
   - Architecture clarification/update
   - Scope clarification
   - Technical solution/workaround
   - Test infrastructure fix
   - Security guidance
   - Permission to deviate (with conditions)
   - Escalation to higher authority (Johan)
   - Issue closure (if misunderstanding)
5. Document resolution
6. Validate builder can proceed

---

### 3.3 Possible FM Responses

**1. Clarification Provided**:
- FM explains architecture/scope
- Builder can proceed with clarity

**2. Architecture Updated**:
- FM updates architecture documents
- Builder proceeds with updated guidance

**3. Workaround Authorized**:
- FM authorizes specific workaround
- Conditions and limitations specified

**4. Investigation Needed**:
- FM needs more time to investigate
- Interim guidance provided if possible

**5. Escalated to Higher Authority**:
- Issue requires Johan or CodexAdvisor
- FM coordinates escalation
- Builder informed of progress

**6. Issue Resolved (Misunderstanding)**:
- FM clarifies builder misunderstood
- Provides correct understanding
- Builder proceeds

---

## Section 4: Escalation Examples

### Example 1: Architecture Gap

```markdown
# BUILDER ESCALATION

**Builder**: UI-Builder-Agent  
**Priority**: HIGH

## Issue
**Category**: Architecture Gap

FRONTEND_COMPONENTS.md specifies UserProfileForm component but does not define validation rules for phone number field. FRS FR-089 requires phone number validation but doesn't specify format (international, US-only, etc.).

## What You've Tried
1. Reviewed FRS FR-089: Only says "phone number must be valid"
2. Reviewed FRONTEND_COMPONENTS.md: No validation rules specified
3. Checked similar forms: Inconsistent patterns

## Why You're Blocked
Cannot implement validation without knowing required format. Incorrect implementation would fail QA.

## Request
Need clarification on phone number validation requirements:
1. Format: International or US-only?
2. Required vs. optional?
3. Validation pattern (regex)?

## Proposed Solutions
**Solution A**: US-only format (XXX) XXX-XXXX  
**Solution B**: International E.164 format +1XXXXXXXXXX

Recommend Solution B for future scalability.

**Status**: BLOCKED - Waiting for FM clarification
```

---

### Example 2: Test Failure

```markdown
# BUILDER ESCALATION

**Builder**: API-Builder-Agent  
**Priority**: HIGH

## Issue
**Category**: Test Failure

TC-034 (POST /api/orders validation) fails with "Expected 400, got 500" when submitting order with missing required field. Implementation correctly validates and returns 400 locally, but test fails on CI.

## What You've Tried
1. Verified implementation returns 400 with missing field
2. Test passes 10/10 times locally
3. Test fails 10/10 times on CI
4. Compared local vs. CI test output: Different error format

## Why You're Blocked
Test infrastructure may have environment-specific issue. Cannot achieve GREEN without resolving.

## Request
Need FM investigation of test infrastructure. Possible causes:
1. CI environment missing validation middleware
2. CI database seeding different from local
3. Test mock configured differently on CI

## Evidence
- Local test output: [link]
- CI test output: [link]
- Implementation code: [link]

**Status**: BLOCKED - Need test infrastructure review
```

---

### Example 3: Security Concern

```markdown
# BUILDER ESCALATION

**Builder**: Integration-Builder-Agent  
**Priority**: CRITICAL

## Issue
**Category**: Security Concern

While implementing external API integration (TC-056), discovered that EXTERNAL_DEPENDENCIES.md specifies storing API keys in environment variables, but doesn't specify encryption or secrets management approach.

Current implementation would expose API keys in plain text in .env file (even though .env is .gitignored).

## What You've Tried
1. Reviewed SECURITY_ARCHITECTURE.md: No secrets management section
2. Reviewed EXTERNAL_DEPENDENCIES.md: Says "store in env vars" but no encryption guidance
3. Researched best practices: Should use secrets manager (AWS Secrets Manager, Vault, etc.)

## Why You're Blocked
Cannot implement insecure pattern. Need security-approved approach.

## Request
Need immediate security review and guidance on:
1. Which secrets management solution to use?
2. How to access secrets from application?
3. How to handle secrets in test environment?

## Proposed Solutions
**Solution A**: Use Vercel environment variables (encrypted at rest)  
**Solution B**: Use AWS Secrets Manager  
**Solution C**: Use HashiCorp Vault

Recommend Solution A for Vercel deployment (simpler, built-in).

**Status**: BLOCKED - Need security approval before implementing
```

---

## Section 5: Anti-Patterns (What NOT to Do)

### 5.1 DO NOT: Guess or Assume

**Bad**:
> "Architecture doesn't specify error format, so I'll just use whatever seems reasonable."

**Good**:
> "Architecture doesn't specify error format. ESCALATING for clarification before implementing."

---

### 5.2 DO NOT: Work Around Problems Silently

**Bad**:
> "Test TC-045 keeps failing, so I'll just skip it and move on."

**Good**:
> "Test TC-045 failing despite correct implementation. ESCALATING for test infrastructure review. Will NOT skip test."

---

### 5.3 DO NOT: Implement First, Ask Forgiveness Later

**Bad**:
> "I'll implement it my way and if FM doesn't like it, they'll tell me."

**Good**:
> "Two approaches seem viable. ESCALATING to ask which approach FM wants before implementing."

---

### 5.4 DO NOT: Hide Problems

**Bad**:
> "There's a small security issue but it's not in my assigned scope, so I'll ignore it."

**Good**:
> "Discovered security issue outside my scope. ESCALATING to FM so it can be properly assigned and addressed."

---

### 5.5 DO NOT: Pressure for Quick Resolution

**Bad**:
> "I need this resolved immediately or I can't meet my deadline!"

**Good**:
> "Priority: HIGH. This blocks Wave 3 completion. Estimated timeline impact: 2 days if not resolved by EOD. Available to provide any additional information needed for diagnosis."

---

## Section 6: Escalation Learnings

**After Escalation Resolved**:
1. Document resolution in escalation issue/comment
2. Note how long resolution took
3. Note what the root cause was
4. Note how similar issues can be prevented
5. Thank FM for resolution

**Contribute to Learning**:
- If escalation revealed architecture gap → captured in architecture updates
- If escalation revealed test gap → captured in QA plan updates
- If escalation revealed process gap → captured in governance learnings

---

## Canonical Reference

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/BUILDER_ESCALATION_GUIDANCE.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- BUILD_PHILOSOPHY.md (Builder Protection)
- T0-014: FM Merge Gate Management Canon
- All Builder Agent Contracts
- Agent Boundaries Doctrine

---

## Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES - All Builders

---

**Escalation is Professional Responsibility**: When in doubt, STOP and ESCALATE. It's not failure—it's discipline.
