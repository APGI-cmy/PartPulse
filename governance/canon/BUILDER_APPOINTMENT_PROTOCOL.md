# Builder Appointment Protocol

**Document ID**: BAP-CANON-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Referenced In**: FM_PREAUTH_CHECKLIST.md, WAVE_PLANNING_GUIDE.md, BUILD_PHILOSOPHY.md

---

## Purpose

This protocol defines the **mandatory process for selecting, appointing, and assigning builders** to wave-based implementation work. Builder appointment is a critical FM responsibility that ensures the right builder with the right skills receives the right wave assignment with complete preparation.

**FM Authority**: Builder appointment is an FM-exclusive authority. Only FM may assign builders to waves.

---

## Constitutional Principle

**From BUILD_PHILOSOPHY.md**:
> "Builder success depends on preparation. FM provides complete wave packages, not partial assignments."

**From BL-020 (Bootstrap Learning)**:
> "FM pre-authorization includes builder readiness validation. Appointing unprepared builders guarantees failure."

**One-Time Build Law**:
> "Right builder + Right preparation + Right wave = One-time success."

---

## 1. Builder Appointment Overview

### 1.1 What is Builder Appointment?

**Builder Appointment** is the FM process of:
1. Identifying required builder types and skills
2. Selecting qualified builders (agents or human developers)
3. Preparing complete wave packages
4. Formally assigning builders to waves
5. Providing builders with authorization and resources
6. Monitoring builder progress and providing support

### 1.2 FM Exclusive Authority

**FM CONTROLS**:
- ✅ Which builders are available
- ✅ Which builders get which waves
- ✅ When builders may begin work
- ✅ What preparation builders receive
- ✅ Builder performance evaluation

**BUILDERS CANNOT**:
- ❌ Self-assign to waves
- ❌ Select which wave to work on
- ❌ Begin work without FM authorization
- ❌ Modify wave scope
- ❌ Reassign themselves to different waves

---

## 2. Builder Types and Specializations

### 2.1 Common Builder Types

#### UI Builder
**Focus**: Frontend components, pages, user interactions
**Skills Required**:
- Frontend framework (React, Vue, etc.)
- HTML/CSS/JavaScript
- State management
- Component architecture
- Accessibility (WCAG)
- Responsive design

**Typical Wave Assignment**:
- Frontend component implementation
- Page creation and routing
- UI state management
- Form validation (UI layer)
- User interaction flows

**Example Waves**: "Wave 3: Transfer UI Components", "Wave 5: Dashboard Implementation"

---

#### API Builder
**Focus**: Backend API endpoints, business logic, data access
**Skills Required**:
- Backend framework (Next.js API routes, Express, etc.)
- RESTful API design
- Database query optimization
- Business logic implementation
- Error handling
- API security

**Typical Wave Assignment**:
- API endpoint implementation
- Service layer logic
- Data validation (backend)
- Error response handling
- Integration with database

**Example Waves**: "Wave 1: Transfer API Endpoints", "Wave 4: Warranty Claim API"

---

#### Schema Builder
**Focus**: Database schema, migrations, data models
**Skills Required**:
- Database design (SQL, NoSQL)
- ORM/query builders (Prisma, TypeORM, etc.)
- Schema migrations
- Data modeling
- Database optimization (indexes, constraints)

**Typical Wave Assignment**:
- Database schema implementation
- Migration scripts
- Seed data creation
- Database constraints and indexes
- Data integrity rules

**Example Waves**: "Wave 0: Database Foundation", "Wave 2: Extended Schema"

---

#### Integration Builder
**Focus**: External API integrations, third-party services
**Skills Required**:
- API integration patterns
- Authentication (OAuth, API keys, etc.)
- Error handling and retries
- Rate limiting
- Data transformation
- Integration testing

**Typical Wave Assignment**:
- External service integration
- API client implementation
- Authentication flows
- Data sync logic
- Fallback strategies

**Example Waves**: "Wave 6: Email Service Integration", "Wave 8: PDF Generation Service"

---

#### QA Builder
**Focus**: Test implementation, test infrastructure, QA validation
**Skills Required**:
- Testing frameworks (Jest, Playwright, Cypress, etc.)
- Test architecture
- Mocking and fixtures
- Test data factories
- CI/CD test integration

**Typical Wave Assignment**:
- Test infrastructure setup
- Test case implementation
- Mock/fixture creation
- Test data factories
- QA validation

**Example Waves**: "Wave 0: QA Infrastructure", "QA-to-Red Validation"

---

#### Full-Stack Builder
**Focus**: End-to-end feature implementation (UI + API + Schema)
**Skills Required**:
- All UI Builder skills
- All API Builder skills
- All Schema Builder skills
- End-to-end understanding
- Integration skills

**Typical Wave Assignment**:
- Complete features (frontend + backend + database)
- Complex workflows spanning multiple layers
- Large waves requiring multiple skills

**Example Waves**: "Wave 10: Complete Reporting Feature", "Wave 12: Multi-Step Wizard"

---

### 2.2 Builder Skill Matrix

| Builder Type | Frontend | Backend | Database | Integration | Testing |
|--------------|----------|---------|----------|-------------|---------|
| UI Builder | ⭐⭐⭐ | ⭐ | - | ⭐ | ⭐⭐ |
| API Builder | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| Schema Builder | - | ⭐ | ⭐⭐⭐ | - | ⭐⭐ |
| Integration Builder | ⭐ | ⭐⭐⭐ | - | ⭐⭐⭐ | ⭐⭐ |
| QA Builder | ⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ |
| Full-Stack | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

**Legend**: ⭐⭐⭐ Expert, ⭐⭐ Proficient, ⭐ Basic, - Not Required

---

## 3. Builder Selection Process

### 3.1 Phase 1: Wave Skill Requirements Analysis

**Input**: Wave plan with wave definitions

**Activities**:
For each wave:
1. Analyze QA-IDs assigned to wave
2. Review architecture components targeted
3. Identify required technical skills
4. Determine builder type needed
5. Estimate complexity level
6. Identify special requirements

**Output**: Wave-to-Builder-Type mapping

**Template**:
```markdown
## Wave Skill Requirements

### Wave X: [Wave Name]
**QA Range**: QA-XXX to QA-YYY ([N] tests)
**Architecture Components**: [List components]

**Required Skills**:
- [Skill 1]: [Proficiency level]
- [Skill 2]: [Proficiency level]
- [Skill 3]: [Proficiency level]

**Builder Type**: [UI/API/Schema/Integration/QA/Full-Stack]

**Complexity**: [Low/Medium/High]

**Special Requirements**:
- [Requirement 1]
- [Requirement 2]

**Estimated Effort**: [X hours/days]
```

**Example**:
```markdown
## Wave Skill Requirements

### Wave 1: Internal Transfer API Implementation
**QA Range**: QA-026 to QA-035 (10 tests)
**Architecture Components**: 
- API.InternalTransfers.CreateEndpoint
- API.InternalTransfers.ListEndpoint
- API.InternalTransfers.GetEndpoint
- Service.InternalTransferService
- Repository.InternalTransferRepository

**Required Skills**:
- Next.js API Routes: ⭐⭐⭐ Expert
- TypeScript: ⭐⭐⭐ Expert
- Prisma ORM: ⭐⭐ Proficient
- REST API Design: ⭐⭐⭐ Expert
- Error Handling: ⭐⭐⭐ Expert
- Testing (Integration): ⭐⭐ Proficient

**Builder Type**: API Builder

**Complexity**: High (10 endpoints with full CRUD + validation)

**Special Requirements**:
- Must understand Prisma relationships
- Must implement comprehensive error handling
- Must follow REST API conventions

**Estimated Effort**: 3-4 days
```

---

### 3.2 Phase 2: Builder Availability Assessment

**Input**: Wave-to-Builder-Type mapping

**Activities**:
1. Identify available builders per type
2. Check builder capacity (current workload)
3. Check builder skill level (matches requirements)
4. Check builder track record (past performance)
5. Identify builder conflicts (dependencies, blockers)

**Output**: Available builders per wave

**Builder Availability Matrix**:
```markdown
## Builder Availability

| Builder Name | Type | Available | Capacity | Skill Match | Track Record |
|--------------|------|-----------|----------|-------------|--------------|
| ui-builder | UI | ✅ Yes | 100% | ⭐⭐⭐ Excellent | 95% success |
| api-builder | API | ✅ Yes | 50% | ⭐⭐⭐ Excellent | 98% success |
| schema-builder | Schema | ⏳ Busy | 0% (Wave X) | ⭐⭐⭐ Excellent | 100% success |
| qa-builder | QA | ✅ Yes | 100% | ⭐⭐⭐ Excellent | 90% success |
| developer-john | Full-Stack | ✅ Yes | 75% | ⭐⭐ Good | 85% success |
```

**Availability States**:
- ✅ **Available**: Builder can start immediately
- ⏳ **Busy**: Builder assigned to another wave (check completion ETA)
- 🚫 **Unavailable**: Builder on leave, decommissioned, or blocked

---

### 3.3 Phase 3: Builder Selection

**Input**: Wave skill requirements + Builder availability

**Activities**:
1. Match builders to waves based on skills and availability
2. Prioritize critical waves (assign best builders first)
3. Balance workload across builders
4. Consider builder preferences (if applicable)
5. Plan for builder dependencies (e.g., schema before API)

**Output**: Wave-to-Builder assignments

**Selection Criteria** (in priority order):
1. **Skill Match**: Builder skills meet wave requirements (MANDATORY)
2. **Availability**: Builder available when wave needs to start (MANDATORY)
3. **Track Record**: Builder has good success rate (HIGH PRIORITY)
4. **Capacity**: Builder has sufficient capacity (HIGH PRIORITY)
5. **Complexity Match**: Builder experience matches wave complexity (MEDIUM PRIORITY)
6. **Preference**: Builder expresses interest in wave (LOW PRIORITY)

**Wave-to-Builder Assignment**:
```markdown
## Wave-to-Builder Assignments

| Wave | Name | Builder Type Needed | Selected Builder | Rationale | Start Date |
|------|------|---------------------|------------------|-----------|------------|
| Wave 0 | Database Foundation | Schema Builder | schema-builder | Expert, 100% success rate | Immediate |
| Wave 1 | Transfer API | API Builder | api-builder | Expert, 98% success rate, available | After Wave 0 |
| Wave 2 | Transfer UI | UI Builder | ui-builder | Expert, 95% success rate, available | After Wave 1 |
| Wave 3 | Email Integration | Integration Builder | api-builder | Can handle integration, available after Wave 1 | After Wave 2 |

**Dependencies**:
- Wave 1 depends on Wave 0 (database must exist before API)
- Wave 2 depends on Wave 1 (API must exist before UI)
- Wave 3 depends on Wave 2 (UI creates email needs)
```

---

### 3.4 Phase 4: Builder Pre-Qualification

**Before appointing builder, FM MUST validate:**

**Pre-Qualification Checklist**:
```markdown
## Builder Pre-Qualification: [Builder Name] for Wave [X]

### Skill Validation
- [ ] Builder has required technical skills
- [ ] Builder understands architecture (has reviewed arch docs)
- [ ] Builder understands QA-first methodology
- [ ] Builder understands Build-to-Green process
- [ ] Builder familiar with project tech stack

### Governance Validation
- [ ] Builder has agent contract (or understands builder responsibilities)
- [ ] Builder understands escalation protocol (BUILDER_ESCALATION_GUIDANCE.md)
- [ ] Builder understands Zero Test Debt policy
- [ ] Builder understands QA Parking process
- [ ] Builder understands merge gate requirements

### Onboarding Validation
- [ ] Builder has repository access
- [ ] Builder has development environment set up
- [ ] Builder has CI/CD access (to see test results)
- [ ] Builder has issue tracker access
- [ ] Builder knows who to escalate to (FM contact)

### Availability Validation
- [ ] Builder confirms availability for wave duration
- [ ] Builder has no conflicting assignments
- [ ] Builder has sufficient capacity (time allocation)
- [ ] Builder understands wave timeline

**Pre-Qualification Result**: ✅ APPROVED / ❌ NOT READY / ⏳ CONDITIONAL

**If NOT READY**: [What must be addressed before approval]
**If CONDITIONAL**: [What conditions must be met]

**Approved By**: [FM Name/ID]
**Date**: [Date]
```

**BLOCKER**: If builder fails pre-qualification, DO NOT appoint. Address gaps first.

---

## 4. Builder Appointment Process

### 4.1 Phase 1: Wave Package Preparation

**Before appointing builder, FM MUST prepare complete wave package:**

**Wave Package Contents**:
```markdown
## Wave Package: Wave [X] - [Wave Name]

### 1. Wave Definition
- **Wave ID**: Wave [X]
- **Wave Name**: [Name]
- **Wave Objective**: [Clear description of what to build]
- **QA Range**: QA-XXX to QA-YYY ([N] tests)
- **Priority**: [Critical/High/Medium/Low]
- **Estimated Duration**: [X days/weeks]

### 2. Architecture References
- **Architecture Components**: [List all components this wave builds]
- **Architecture Documents**: 
  - Primary: [Which architecture docs builder MUST read]
  - Secondary: [Which architecture docs builder SHOULD read]
- **Database Schema**: [Which tables/models involved]
- **API Specification**: [Which endpoints involved]
- **UI Components**: [Which components involved]

### 3. QA Catalog References
- **QA-IDs**: QA-XXX to QA-YYY
- **Test Categories**: [Categories these tests belong to]
- **Test Files**: [Which test files builder will work with]
- **QA Catalog Location**: qa/QA_CATALOG.md lines [XXX]-[YYY]

### 4. Dependencies
- **Depends On** (BLOCKERS):
  - Wave [X-1]: [What must be complete before this wave]
  - External: [Any external dependencies]
- **Blocks** (CRITICAL PATH):
  - Wave [X+1]: [What depends on this wave]

### 5. Success Criteria
- [ ] All QA-XXX to QA-YYY tests passing
- [ ] Zero test debt (no .skip, .todo, commented tests)
- [ ] Code coverage > [X]% for wave components
- [ ] All architecture components implemented per spec
- [ ] All edge cases and error conditions handled
- [ ] CI/CD passing (all checks green)
- [ ] PR reviewed and approved by FM

### 6. Resources
- **FM Contact**: [FM name/contact for escalations]
- **Architecture Lead**: [If applicable]
- **QA Lead**: [If applicable]
- **Documentation**:
  - BUILDER_ESCALATION_GUIDANCE.md (when to STOP and escalate)
  - BUILD_PHILOSOPHY.md (one-time build principles)
  - IMPLEMENTATION_GUIDE.md (how to implement)
  - QA_TO_RED_PLANNING_PROTOCOL.md (QA-first approach)

### 7. Governance Requirements
- [ ] Follow Build-to-Green methodology (tests MUST pass before PR)
- [ ] Zero Test Debt (no test dodging)
- [ ] QA Parking for legitimate exceptions only
- [ ] Escalate blockers immediately (don't work around)
- [ ] No architecture changes without FM approval
- [ ] No scope changes without FM approval

### 8. Timeline
- **Start Date**: [Date builder may begin]
- **Target Completion**: [Date wave should complete]
- **Checkpoints**: 
  - [Date 1]: [Milestone 1]
  - [Date 2]: [Milestone 2]

### 9. Issue Details
- **Issue Number**: #[XXX]
- **Issue Title**: [Wave X] [Wave Name]
- **Issue Labels**: wave-[X], [builder-type], [priority]
- **Issue Assignee**: @[builder-name]
```

**Completeness Criteria**:
- ✅ All 9 sections populated
- ✅ QA range validated in QA Catalog (BL-018/BL-019 compliance)
- ✅ Architecture references complete
- ✅ Dependencies identified
- ✅ Success criteria clear and measurable
- ✅ Resources provided
- ✅ Governance requirements stated
- ✅ Timeline realistic

**BLOCKER**: If wave package incomplete, DO NOT appoint builder.

---

### 4.2 Phase 2: Builder Appointment Notification

**Create formal appointment notification:**

```markdown
## Builder Appointment Notice

**To**: @[builder-name]
**From**: FM ([FM name])
**Date**: [Date]
**Re**: Appointment to Wave [X] - [Wave Name]

### Appointment Details

You are hereby formally appointed to **Wave [X]: [Wave Name]**.

**Wave Objective**: [Clear description]

**QA Range**: QA-XXX to QA-YYY ([N] tests)

**Start Date**: [Date] (you may begin immediately upon acknowledging this appointment)

**Target Completion**: [Date]

**Estimated Effort**: [X days/weeks]

### Your Responsibilities

As the appointed builder for this wave, you are responsible for:
1. ✅ Implementing all architecture components assigned to this wave
2. ✅ Making all QA-XXX to QA-YYY tests pass (100% pass rate)
3. ✅ Following Build-to-Green methodology (no test dodging)
4. ✅ Escalating blockers immediately per BUILDER_ESCALATION_GUIDANCE.md
5. ✅ Maintaining zero test debt throughout wave
6. ✅ Submitting PR only when all tests pass and CI is green
7. ✅ Responding to FM requests for status updates

### Resources Provided

You have been provided with a complete wave package:
- Issue #[XXX] with full wave details
- Architecture references (which docs to read)
- QA Catalog references (which tests to make pass)
- Dependencies identified (what must be complete first)
- Success criteria (definition of done)
- FM contact (for escalations)

### Authorization

You are authorized to:
- ✅ Implement code per architecture specifications
- ✅ Create/modify tests as needed to achieve Green state
- ✅ Use QA Parking for legitimate exceptions (with proper justification)
- ✅ Request clarifications from FM on architecture or requirements

You are NOT authorized to:
- ❌ Change architecture without FM approval
- ❌ Change wave scope without FM approval
- ❌ Skip or disable tests (.skip, .todo, commenting out)
- ❌ Merge without FM approval (merge gate is FM-exclusive)
- ❌ Work around blockers (escalate instead)

### Acknowledgment Required

Please acknowledge this appointment by:
1. Commenting on Issue #[XXX] with "Appointment acknowledged, reviewing wave package"
2. Reviewing all provided resources
3. Asking any clarifying questions
4. Confirming your availability for wave duration
5. Confirming your start date

**Do NOT begin implementation until you have acknowledged and reviewed the wave package.**

### Questions or Concerns

If you have questions or concerns about this wave:
- **Architecture questions**: [Architecture Lead or FM]
- **QA questions**: [QA Lead or FM]
- **Governance questions**: [Governance Liaison]
- **General questions**: [FM]
- **Escalations**: Follow BUILDER_ESCALATION_GUIDANCE.md

### Success and Support

FM is committed to your success on this wave. You have been provided with complete preparation, clear success criteria, and full support. If you encounter blockers or uncertainties, escalate immediately—FM will help resolve.

**Welcome to Wave [X]. Build-to-Green!**

**Appointed By**: [FM Name/ID]
**Date**: [Date]
**Authorization**: FM-WAVE-[X]-APPOINTMENT
```

---

### 4.3 Phase 3: Builder Acknowledgment

**Builder MUST acknowledge appointment before starting:**

```markdown
## Builder Acknowledgment: Wave [X]

**Builder**: @[builder-name]
**Wave**: Wave [X] - [Wave Name]
**Date**: [Date]

### Acknowledgment

I acknowledge my appointment to Wave [X] and confirm:

- [x] I have reviewed the complete wave package (Issue #[XXX])
- [x] I have reviewed all architecture references
- [x] I have reviewed QA Catalog entries QA-XXX to QA-YYY
- [x] I understand the wave objective and success criteria
- [x] I understand my responsibilities and governance requirements
- [x] I have access to all necessary resources (repository, CI/CD, docs)
- [x] I understand escalation protocol (BUILDER_ESCALATION_GUIDANCE.md)
- [x] I confirm my availability for wave duration
- [x] I am ready to begin implementation

### Questions / Clarifications

[List any questions or requests for clarification]

**OR**

No questions at this time. Ready to proceed.

### Estimated Start

I plan to start implementation on: [Date]

**Acknowledged By**: @[builder-name]
**Date**: [Date]
```

**BLOCKER**: If builder does not acknowledge, FM follows up. Do NOT assume acknowledgment.

---

### 4.4 Phase 4: Issue Assignment

**FM creates GitHub issue and assigns to builder:**

**Issue Template**:
```markdown
---
title: "[Wave X] [Wave Name]"
labels: wave-X, [builder-type], [priority]
assignees: [builder-name]
---

## Wave Information

**Wave ID**: Wave [X]
**Wave Name**: [Wave Name]
**Builder**: @[builder-name]
**Builder Type**: [Type]
**QA Range**: QA-XXX to QA-YYY ([N] tests)
**Priority**: [Critical/High/Medium/Low]
**Start Date**: [Date]
**Target Completion**: [Date]

## Wave Objective

[Clear, specific description of what this wave builds]

## Architecture Components

This wave implements the following architecture components:
- [Component 1]
- [Component 2]
- [Component 3]

**Architecture References**:
- [Document 1]: [Section/Page]
- [Document 2]: [Section/Page]

## QA Requirements

This wave must make the following tests pass:
- **QA Range**: QA-XXX to QA-YYY
- **Test Count**: [N] tests
- **Test Categories**: [Categories]
- **Test Files**: [List test files]

**QA Catalog Reference**: qa/QA_CATALOG.md lines [XXX]-[YYY]

## Dependencies

**Depends On** (BLOCKERS):
- [ ] Wave [X-1]: [Description] (Issue #[YYY])
- [ ] [Other dependency]

**Blocks** (CRITICAL PATH):
- Wave [X+1]: [Description] (Issue #[ZZZ])

## Success Criteria

- [ ] All QA-XXX to QA-YYY tests passing (100% pass rate)
- [ ] Zero test debt (no .skip, .todo, commented tests)
- [ ] Code coverage > [X]% for wave components
- [ ] All architecture components implemented per specification
- [ ] All edge cases and error conditions handled
- [ ] CI/CD passing (all checks green)
- [ ] PR submitted and approved by FM

## Resources

- **FM Contact**: @[fm-name]
- **Escalation Guide**: governance/canon/BUILDER_ESCALATION_GUIDANCE.md
- **Build Philosophy**: BUILD_PHILOSOPHY.md
- **Implementation Guide**: architecture/IMPLEMENTATION_GUIDE.md
- **QA Protocol**: governance/canon/QA_TO_RED_PLANNING_PROTOCOL.md

## Governance

- [ ] Follow Build-to-Green methodology
- [ ] Zero Test Debt (no test dodging)
- [ ] Escalate blockers immediately
- [ ] No architecture changes without FM approval
- [ ] No scope changes without FM approval

## Timeline

- **Start**: [Date]
- **Target Completion**: [Date]
- **Checkpoints**:
  - [Date 1]: [Milestone 1]
  - [Date 2]: [Milestone 2]

## Status Updates

Builder: Please provide status updates:
- Initial acknowledgment (before starting)
- Daily/weekly progress (as appropriate)
- Blocker reports (immediately when encountered)
- Completion report (when all tests green)

---

**Wave Package Complete**: This issue contains all information needed to complete the wave.

**Questions?** Comment here or escalate to @[fm-name]

**Authorization**: FM-WAVE-[X]-APPOINTMENT
```

**Issue Assignment Actions**:
1. Create issue from template
2. Assign to builder (@[builder-name])
3. Add labels (wave-X, builder-type, priority)
4. Link dependencies (blocked by, blocks)
5. Add to project board (if applicable)
6. Notify builder (mention in issue)

---

### 4.5 Phase 5: Builder Orientation (Optional but Recommended)

**For first-time builders or complex waves, FM may conduct orientation:**

**Orientation Agenda**:
1. **Welcome and Context** (5 min)
   - Introduce wave in project context
   - Explain wave priority and importance

2. **Architecture Walkthrough** (15 min)
   - Review architecture components for this wave
   - Highlight key design decisions
   - Point out critical areas or complex logic

3. **QA Review** (10 min)
   - Walk through QA Catalog entries
   - Explain test coverage expectations
   - Clarify any ambiguous test cases

4. **Dependencies and Blockers** (5 min)
   - Review what wave depends on
   - Identify potential blockers
   - Explain escalation process

5. **Success Criteria and Timeline** (5 min)
   - Clarify definition of done
   - Review timeline and checkpoints
   - Set expectations for status updates

6. **Q&A** (10 min)
   - Answer builder questions
   - Clarify ambiguities
   - Provide additional context

**Total**: 50 minutes

**Orientation Documentation**:
```markdown
## Builder Orientation: Wave [X]

**Date**: [Date]
**Builder**: @[builder-name]
**FM**: @[fm-name]
**Duration**: [X] minutes

### Topics Covered
- [Topic 1]
- [Topic 2]

### Key Takeaways
- [Takeaway 1]
- [Takeaway 2]

### Questions & Answers
Q: [Question]
A: [Answer]

### Action Items
- [ ] Builder: [Action 1]
- [ ] FM: [Action 2]

**Builder Confirmation**: Ready to proceed? [Yes/No]
```

---

## 5. Builder Monitoring and Support

### 5.1 Status Update Expectations

**Builder SHOULD provide status updates:**
- **Initial**: Acknowledgment (before starting)
- **Regular**: Daily or weekly progress (based on wave duration)
- **Blocker**: Immediately when blocker encountered
- **Completion**: When all tests green and ready for PR

**Status Update Template**:
```markdown
## Wave [X] Status Update: [Date]

**Builder**: @[builder-name]
**Wave**: Wave [X] - [Wave Name]
**Days Elapsed**: [X] / [Y] days
**Completion**: [X]%

### Progress Summary
[Brief summary of progress since last update]

### Completed
- [Completed item 1]
- [Completed item 2]

### In Progress
- [In-progress item 1]
- [In-progress item 2]

### Planned Next
- [Next item 1]
- [Next item 2]

### Test Status
- **Total Tests**: [N]
- **Passing**: [X] ([Y]%)
- **Failing**: [Z]
- **Not Implemented**: [W]

### Blockers
[None / List blockers with details]

### Questions / Needs
[None / List questions or resource needs]

### On Track?
[Yes, on track for target completion / Delayed, new ETA: [Date] / Blocked, escalation required]
```

---

### 5.2 FM Monitoring

**FM SHOULD monitor:**
- [ ] Builder acknowledged appointment (within 24 hours)
- [ ] Builder providing regular status updates
- [ ] Wave progressing per timeline
- [ ] No unreported blockers (builder stuck but not escalating)
- [ ] Test pass rate increasing
- [ ] No test dodging (tests being skipped/disabled)

**FM Check-In Frequency**:
- **Short waves** (1-3 days): Daily check-in
- **Medium waves** (4-7 days): Every 2-3 days
- **Long waves** (8+ days): Weekly

---

### 5.3 Builder Support

**FM PROVIDES**:
- ✅ Clarifications on architecture or requirements
- ✅ Resolution of blockers (or escalation to appropriate authority)
- ✅ Access to additional resources if needed
- ✅ Timeline adjustments if justified
- ✅ Encouragement and recognition

**FM DOES NOT**:
- ❌ Write code for builder (builder responsibility)
- ❌ Lower quality standards (zero test debt is non-negotiable)
- ❌ Approve scope creep (wave scope is fixed)
- ❌ Bypass merge gate (FM merge authority is for validation, not bypass)

---

## 6. Builder Performance Evaluation

### 6.1 Post-Wave Evaluation

**After wave completion, FM evaluates builder performance:**

**Evaluation Template**:
```markdown
## Builder Performance Evaluation: Wave [X]

**Builder**: @[builder-name]
**Wave**: Wave [X] - [Wave Name]
**Completion Date**: [Date]

### Quantitative Metrics
- **Timeline**: [On time / X days early / X days late]
- **Test Pass Rate**: [100% / <100%]
- **Test Debt**: [Zero / X tests skipped/disabled]
- **Code Coverage**: [X]%
- **Escalations**: [X escalations, all appropriate / X missed escalations]
- **Status Updates**: [Regular / Irregular]

### Qualitative Assessment

**Code Quality**: [Excellent / Good / Needs Improvement]
- [Comments]

**Architecture Adherence**: [Excellent / Good / Needs Improvement]
- [Comments]

**Governance Compliance**: [Excellent / Good / Needs Improvement]
- [Comments]

**Communication**: [Excellent / Good / Needs Improvement]
- [Comments]

**Problem Solving**: [Excellent / Good / Needs Improvement]
- [Comments]

### Strengths
- [Strength 1]
- [Strength 2]

### Areas for Improvement
- [Area 1]
- [Area 2]

### Overall Performance
[Excellent / Good / Satisfactory / Needs Improvement / Unsatisfactory]

### Recommendation
- [ ] Recommend for future waves (same or higher complexity)
- [ ] Recommend for future waves (same or lower complexity)
- [ ] Recommend additional training/support before next wave
- [ ] Do not recommend for future waves

### Builder Feedback
[Any feedback for builder to help improve]

**Evaluated By**: [FM Name/ID]
**Date**: [Date]
```

### 6.2 Builder Track Record

**FM MAINTAINS** builder track record:
```markdown
## Builder Track Record: @[builder-name]

**Builder Type**: [Type]
**Total Waves**: [N]
**Active Since**: [Date]

### Wave History
| Wave | Name | QA Count | Duration | Timeline | Test Debt | Rating |
|------|------|----------|----------|----------|-----------|--------|
| 1 | [Name] | 10 | 3 days | On time | Zero | Excellent |
| 2 | [Name] | 15 | 5 days | 1 day early | Zero | Excellent |
| 3 | [Name] | 20 | 7 days | On time | Zero | Good |

### Statistics
- **Completion Rate**: [X]% ([Y] completed / [Z] assigned)
- **On-Time Rate**: [X]% ([Y] on time / [Z] completed)
- **Zero Test Debt Rate**: [X]% ([Y] zero debt / [Z] completed)
- **Average Rating**: [X.Y] / 5.0

### Strengths
- [Strength 1]
- [Strength 2]

### Development Areas
- [Area 1]
- [Area 2]

### Recommendation
[Current recommendation for future wave assignments]
```

---

## 7. Anti-Patterns

### 7.1 Common Mistakes

❌ **Partial Wave Package**: "Builder can figure out the rest"
- Fix: Wave package MUST be complete before appointment

❌ **Skipping Pre-Qualification**: "We know they're good"
- Fix: MANDATORY pre-qualification checklist for every builder

❌ **No Acknowledgment**: Assuming builder understands and accepts
- Fix: Require explicit acknowledgment before builder starts

❌ **Assigning Unprepared Builders**: "They'll learn on the job"
- Fix: Builder MUST have required skills and preparation

❌ **Ignoring Builder Signals**: Builder struggling but not escalating
- Fix: FM actively monitors and checks in regularly

❌ **No Performance Tracking**: "We'll worry about that later"
- Fix: Track every wave, build track record, improve over time

❌ **Overloading Builders**: Assigning too many waves at once
- Fix: Respect builder capacity, prioritize quality over speed

❌ **Wrong Builder Type**: Assigning API work to UI builder
- Fix: Match builder type and skills to wave requirements

---

## 8. Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/BUILDER_APPOINTMENT_PROTOCOL.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- FM_PREAUTH_CHECKLIST.md
- WAVE_PLANNING_GUIDE.md
- BUILD_PHILOSOPHY.md
- BUILDER_ESCALATION_GUIDANCE.md

---

## 9. Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional Requirement)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: Builder appointment protocol is non-negotiable  
**Enforcement**: FM (exclusive authority)
