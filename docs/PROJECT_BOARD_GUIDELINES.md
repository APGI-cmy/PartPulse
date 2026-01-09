# Project Board Guidelines — PartPulse v0.2.0

## Document Authority

**Status**: ✅ ACTIVE  
**Version**: 1.0.0  
**Date**: 2026-01-09  
**Purpose**: Define project dashboard structure and update protocol for PartPulse v0.2.0 wave

---

## Overview

This document defines the structure, configuration, and maintenance protocol for the **PartPulse v0.2.0 - PDF Fix & Governance** project board. The project board is a governance requirement that tracks all governance-required issues in the correct order, reflecting both Status and Next Actions throughout the v0.2.0 wave.

**Board Location**: https://github.com/APGI-cmy/PartPulse/projects (Project Board)

---

## Board Structure

### Project Name
**PartPulse v0.2.0 - PDF Fix & Governance**

### View Types
The board supports both:
- **Board View** - Kanban-style visualization with columns
- **Table View** - Spreadsheet-style view with all custom fields visible

### Columns (Status Workflow)

The board uses a five-column workflow that tracks issue progression:

| Column | Purpose | Entry Criteria | Exit Criteria |
|--------|---------|----------------|---------------|
| **Blocked** | Issues waiting on dependencies or FM resolution | Dependencies not met, external blockers, FM escalation pending | Dependencies resolved, blockers cleared, FM approval received |
| **Backlog** | Issues ready for assignment but not yet started | Issue created, dependencies met, no active work | Assigned to builder, work started |
| **In Progress** | Active work in progress | Builder assigned, work actively ongoing | PR opened for review, work complete |
| **Review** | PRs open and under review | PR submitted, CI running, review requested | PR approved, CI passing, ready to merge |
| **Done** | Completed and merged | PR merged, issue closed, acceptance criteria met | N/A - terminal state |

---

## Custom Fields

The board includes four custom fields to support Maturion wave/phase tracking:

### 1. Phase (Single Select)
Tracks which wave/phase of the v0.2.0 project this issue belongs to.

**Options**:
- `Wave 0.1` - Bootstrap & Governance Setup
- `Wave 0.2` - PDF Generation Fixes
- `Wave 1` - Foundation (Database + API)
- `Wave 2` - Security (Auth + Controls)
- `Wave 3` - Business Logic
- `Wave 4` - Data Flow
- `Wave 5` - Architecture
- `Wave 6` - Operations

**Usage**: Assign each issue to its corresponding phase/wave based on the BUILD_TO_GREEN.md plan.

### 2. Builder (Single Select)
Identifies which specialized builder is responsible for the issue.

**Options**:
- `Integration Builder` - Module integrations, external services, data flows
- `Frontend Builder` - UI components, pages, user interactions
- `Backend Builder` - API endpoints, business logic, data processing
- `Security Builder` - Authentication, authorization, security controls
- `Database Builder` - Schema, migrations, data integrity
- `DevOps Builder` - CI/CD, deployment, infrastructure
- `QA Builder` - Test implementation, QA infrastructure
- `Unassigned` - Not yet assigned to a builder

**Usage**: Set when issue is assigned to a builder. Update if reassignment occurs.

### 3. Dependency (Text)
Lists issue dependencies in the format: `#N, #M` (comma-separated issue numbers).

**Format**: `#1, #2, #3`  
**Example**: `#1, #2` (depends on issues #1 and #2)

**Usage**:
- Document all blocking dependencies
- Update as dependencies are resolved
- Used to determine when issues can move from "Blocked" to "Backlog"

### 4. Blocks (Text)
Lists which issues are blocked by this issue in the format: `#N, #M` (comma-separated issue numbers).

**Format**: `#N, #M`  
**Example**: `#4, #5` (this issue blocks issues #4 and #5)

**Usage**:
- Document downstream impacts
- Helps prioritize critical path issues
- Updated when dependent issues are created

---

## Initial Board Setup

### Step 1: Create the Project Board

1. Navigate to: https://github.com/APGI-cmy/PartPulse/projects
2. Click **"New project"**
3. Select **"Board"** template
4. Set project name: **PartPulse v0.2.0 - PDF Fix & Governance**
5. Set visibility: **Public** (or as per repository settings)
6. Click **"Create project"**

### Step 2: Configure Columns

The board template includes default columns. Customize them:

1. Click the column header dropdown (⋯)
2. **Rename** existing columns or **Add column** to create:
   - Blocked
   - Backlog
   - In Progress
   - Review
   - Done

3. **Set column limits** (optional):
   - In Progress: 3-5 items (prevent WIP overload)
   - Review: No limit (don't bottleneck reviews)

### Step 3: Add Custom Fields

1. Click **"+ Add field"** in the board header
2. Create each custom field:

**Field 1: Phase**
- Field name: `Phase`
- Field type: `Single select`
- Options: Wave 0.1, Wave 0.2, Wave 1, Wave 2, Wave 3, Wave 4, Wave 5, Wave 6

**Field 2: Builder**
- Field name: `Builder`
- Field type: `Single select`
- Options: Integration Builder, Frontend Builder, Backend Builder, Security Builder, Database Builder, DevOps Builder, QA Builder, Unassigned

**Field 3: Dependency**
- Field name: `Dependency`
- Field type: `Text`
- Description: "Comma-separated issue numbers this depends on (e.g., #1, #2)"

**Field 4: Blocks**
- Field name: `Blocks`
- Field type: `Text`
- Description: "Comma-separated issue numbers blocked by this (e.g., #4, #5)"

### Step 4: Add Issues to Board

Add governance and PDF-related issues (#1-#7) to the board:

1. Click **"+ Add item"** at the bottom of the Backlog column
2. Search for and add issues by number:
   - Issue #1
   - Issue #2
   - Issue #3
   - Issue #4
   - Issue #5
   - Issue #6
   - Issue #7

3. For each issue, set the custom fields:
   - **Phase**: Based on issue content and BUILD_TO_GREEN.md mapping
   - **Builder**: Based on issue assignment and scope
   - **Dependency**: List any blocking issues
   - **Blocks**: List any dependent issues

### Step 5: Initial Issue Mapping

Map each issue to its appropriate phase and column:

| Issue # | Title | Column | Phase | Builder | Example Dependency | Example Blocks |
|---------|-------|--------|-------|---------|-------------------|----------------|
| #1 | [Example: Governance Setup] | Done/In Progress | Wave 0.1 | Integration Builder | - | #2, #3 |
| #2 | [Example: PDF Fix] | Backlog | Wave 0.2 | Backend Builder | #1 | #4 |
| #3 | [Example: Dashboard] | In Progress | Wave 0.1 | Integration Builder | #1 | - |
| #4 | [Example: Database Tests] | Blocked | Wave 1 | Database Builder | #1, #2 | #5 |
| #5 | [Example: API Tests] | Blocked | Wave 1 | Backend Builder | #4 | - |
| #6 | [Example: Security Tests] | Backlog | Wave 2 | Security Builder | #5 | - |
| #7 | [Example: QA Infrastructure] | Backlog | Wave 0.1 | QA Builder | #1 | - |

**Note**: Update the above mapping based on actual issue content and dependencies.

### Step 6: Verify Board Setup

Checklist for board verification:

- [ ] Project board exists at /APGI-cmy/PartPulse/projects
- [ ] Board name is "PartPulse v0.2.0 - PDF Fix & Governance"
- [ ] All 5 columns present: Blocked, Backlog, In Progress, Review, Done
- [ ] All 4 custom fields present: Phase, Builder, Dependency, Blocks
- [ ] All issues #1-#7 added to the board
- [ ] Each issue has Phase and Builder assigned
- [ ] Dependencies documented in Dependency field
- [ ] Blocking relationships documented in Blocks field
- [ ] Issues are in correct columns based on current status

---

## Ongoing Update Protocol

### Mandatory Update Triggers

The project board **MUST** be updated in the following scenarios:

#### 1. Before Issue Handover
**Trigger**: Before any issue is assigned or handed over to a builder  
**Required Updates**:
- Move issue to appropriate column (typically "Backlog" → "In Progress")
- Set/verify **Builder** field
- Set/verify **Phase** field
- Update **Dependency** field if dependencies changed
- Add comment on issue noting board status update

**Responsible Party**: Foreman (FM) or assigning builder

#### 2. When PR is Opened
**Trigger**: As soon as a PR is submitted for review  
**Required Updates**:
- Move issue to "Review" column
- Link PR to the issue (GitHub automatically does this if PR description includes "Closes #N")
- Verify PR is visible in project board
- Update Blocks field if this unblocks other issues

**Responsible Party**: Builder who opened the PR

#### 3. When Issue is Blocked
**Trigger**: When work cannot proceed due to dependencies or external factors  
**Required Updates**:
- Move issue to "Blocked" column
- Update **Dependency** field with blocking issue numbers
- Add comment explaining blocker
- Update **Blocks** field on blocking issues

**Responsible Party**: Builder encountering the blocker

#### 4. When Blocker is Resolved
**Trigger**: When a blocking dependency is completed  
**Required Updates**:
- Move issue from "Blocked" to "Backlog" or "In Progress"
- Update **Dependency** field (remove resolved dependencies)
- Add comment noting blocker resolution

**Responsible Party**: Builder or FM monitoring dependencies

#### 5. When Issue is Complete
**Trigger**: When PR is merged and issue is closed  
**Required Updates**:
- Move issue to "Done" column
- Verify issue is closed
- Update any issues in **Blocks** field - move them from Blocked if appropriate
- Add completion comment with link to merged PR

**Responsible Party**: Builder who completed the work

#### 6. Phase Transitions
**Trigger**: At the end of each phase/wave  
**Required Updates**:
- Review all issues in the phase
- Verify completion status
- Update next phase issues (move from Blocked to Backlog if dependencies met)
- Add phase completion comment

**Responsible Party**: Foreman (FM)

### Update Frequency

**Minimum**: Before every issue handover and after every PR submission  
**Recommended**: Daily update sweep during active development  
**Phase Reviews**: End of each wave (mandatory)

### Update Process

1. **Access the board**: Navigate to project board URL
2. **Identify updates needed**: Based on trigger events above
3. **Update fields**: Modify Status (column), Phase, Builder, Dependency, Blocks as needed
4. **Add comments**: Document the change in the issue comments
5. **Verify links**: Ensure PRs are properly linked to issues
6. **Check dependencies**: Update blocked/blocking issues as appropriate

### Board Hygiene

**Weekly checks**:
- [ ] All "In Progress" issues have active work (no stale items)
- [ ] All "Blocked" issues have documented blockers
- [ ] All "Review" issues have open PRs linked
- [ ] All dependencies are accurate and up-to-date
- [ ] Builder assignments are current

**Phase/Wave completion**:
- [ ] All issues in phase have reached "Done" or have approved exceptions
- [ ] Dependencies for next phase are identified
- [ ] Next phase issues are ready in "Backlog"
- [ ] Board reviewed by FM before phase close

---

## QA Requirements

### Spot Checks
**Frequency**: After each issue handover  
**Verification**:
- [ ] Issue appears on board in correct column
- [ ] Builder field is accurate
- [ ] Phase field is accurate
- [ ] Dependencies are documented
- [ ] Status matches actual work state

**Responsible Party**: Builder receiving the handover or FM

### Phase Reviews
**Frequency**: Before close of each phase  
**Verification**:
- [ ] All phase issues are tracked on board
- [ ] All issues are in correct status
- [ ] No undocumented dependencies
- [ ] Completion criteria met for phase
- [ ] Next phase is properly initialized
- [ ] Board state reflects reality

**Responsible Party**: Foreman (FM)

### Audit Trail
All board updates should be reflected in:
1. **Issue comments** - Note when status changes occur
2. **PR descriptions** - Include issue number and status
3. **Wave completion reports** - Reference board state

---

## Integration with Governance

### Relationship to BUILD_TO_GREEN.md
The project board tracks issues that implement the BUILD_TO_GREEN plan:
- **Phase field** maps to BUILD_TO_GREEN waves
- Issues should align with wave priorities
- Board reflects BUILD_TO_GREEN progress visually

### Relationship to GOVERNANCE_STATUS.md
- Board status feeds into governance reporting
- Phase completion updates GOVERNANCE_STATUS.md
- Board is evidence for True North compliance

### Relationship to QA Enforcement
- Issues must pass QA before moving to "Done"
- CI/CD gate status reflected in board comments
- QA parking entries noted in Blocked column

---

## Board Access and Permissions

### View Access
- **Public**: All repository viewers can see the board
- **Use for**: Transparency and stakeholder visibility

### Edit Access
- **Builders**: Can update issues they're assigned to
- **Foreman (FM)**: Full edit access for all issues
- **Repository Admins**: Full administrative access

### Restricted Actions
- **Deleting issues from board**: Requires FM approval
- **Changing board structure**: Requires FM approval
- **Modifying custom fields**: Requires FM approval

---

## Troubleshooting

### Issue: Issue not appearing on board
**Solution**: 
1. Manually add via "+ Add item" 
2. Search by issue number
3. Verify issue is not already on board (check all columns)

### Issue: PR not linked to board issue
**Solution**:
1. Edit PR description to include "Closes #N" or "Fixes #N"
2. Manually link in project board settings
3. Verify issue number is correct

### Issue: Dependency field not updating
**Solution**:
1. Click directly on the field in table view
2. Enter dependencies in format: `#1, #2, #3`
3. Press Enter to save
4. Refresh board to verify

### Issue: Column limits preventing moves
**Solution**:
1. Review items in target column
2. Move completed items to Done
3. If limit is restrictive, discuss with FM about adjusting

### Issue: Custom field options not appearing
**Solution**:
1. Check field configuration in board settings
2. Verify field type is correct (Single Select vs. Text)
3. Re-add options if missing
4. Contact FM if persistent

---

## Board URL Reference

**Primary Board**: https://github.com/APGI-cmy/PartPulse/projects  
**Board Name**: PartPulse v0.2.0 - PDF Fix & Governance

**Direct Links** (once created):
- Board View: `https://github.com/orgs/APGI-cmy/projects/[N]`
- Table View: `https://github.com/orgs/APGI-cmy/projects/[N]/views/2`

Where `[N]` is the project number assigned by GitHub.

---

## Document History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-09 | 1.0.0 | Initial board guidelines created | Integration Builder |

---

## Approval

**Document Status**: ✅ ACTIVE  
**Approved By**: Integration Builder  
**Authority**: Governance requirement per issue assignment  
**Date**: 2026-01-09

**This document is the authoritative guide for PartPulse v0.2.0 project board management.**

---

## Related Documents

- [BUILD_TO_GREEN.md](../BUILD_TO_GREEN.md) - Wave structure and test implementation plan
- [GOVERNANCE_STATUS.md](../GOVERNANCE_STATUS.md) - Overall governance and True North status
- [QA_PLAN.md](../qa/QA_PLAN.md) - Complete QA strategy and test categories
- [README.md](../README.md) - Project overview and quick start

---

*For questions about board usage, update protocol, or governance compliance, contact the Foreman (FM) or refer to governance documentation.*
