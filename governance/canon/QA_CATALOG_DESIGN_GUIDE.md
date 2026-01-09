# QA Catalog Design Guide

**Document ID**: QACDG-CANON-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Referenced In**: BL-018, BL-019, FM_PREAUTH_CHECKLIST.md, QA_TO_RED_PLANNING_PROTOCOL.md

---

## Purpose

This guide defines the **mandatory process for creating and maintaining QA Catalogs** with constitutional QA-Catalog-Alignment requirements (BL-018/BL-019). The QA Catalog is the authoritative registry of all test cases that must be created during QA-to-Red planning and MUST be semantically aligned with architecture before wave planning begins.

**FM Authority**: QA Catalog MUST be 100% complete, semantically aligned with architecture, and FM-approved before any wave planning or builder assignment occurs.

---

## Constitutional Principle

**From BL-018 (Bootstrap Learning)**:
> "Wave planning and subwave assignment MUST verify that all assigned QA ranges exist in the canonical QA Catalog and semantically match the intended feature scope."

**From BL-019 (Bootstrap Learning)**:
> "After creating a ratchet for QA misalignment, FM MUST forward-scan all remaining waves for the same pattern. Second-time failures of the same pattern are CATASTROPHIC."

**From BUILD_PHILOSOPHY.md**:
> "QA-First Architecture-Driven Development requires QA Catalog as source of truth. QA Catalog misalignment creates implementation chaos."

**One-Time Build Law**:
> "Know what you're testing before you test it. Know what tests exist before you assign waves."

---

## 1. QA Catalog Overview

### 1.1 What is a QA Catalog?

**QA Catalog** (`QA_CATALOG.md`) is the **authoritative registry** of all test cases for an application. It serves as:
- **Index**: Every test case has a unique QA-ID (QA-001, QA-002, etc.)
- **Contract**: What must be tested (scope definition)
- **Wave Planning Input**: QA ranges assigned to waves (QA-001 to QA-020 → Wave 1)
- **Traceability**: Maps test cases to architecture components and FRS requirements
- **Completeness Check**: Validates 100% test coverage of architecture

### 1.2 QA Catalog Structure

```markdown
# QA Catalog - [Application Name]

## Metadata
- **Total Test Cases**: [X tests]
- **Last Updated**: [Date]
- **Architecture Version**: [X.Y.Z]
- **FRS Version**: [X.Y.Z]
- **Status**: [Draft/Complete/Frozen]

## Test Categories

### Category: [Category Name]
**Architecture Source**: [Which architecture doc this tests]
**Test Range**: QA-XXX to QA-YYY
**Test Count**: [N tests]

#### QA-XXX: [Test Case Title]
**Purpose**: [What this test validates]
**Architecture Component**: [Component being tested]
**FRS Requirement**: [FR-XXX]
**Test Type**: [Unit/Integration/E2E]
**Priority**: [Critical/High/Medium/Low]
**Wave Assignment**: [Wave X or Unassigned]
**Status**: [Not Implemented/Implemented/Passing/Failing]

[Repeat for all test cases]

## Traceability Matrix
[FRS ID] → [QA-ID] → [Architecture Component]

## Wave Assignment Summary
- Wave 1: QA-001 to QA-020 (20 tests)
- Wave 2: QA-021 to QA-045 (25 tests)
- Wave 3: QA-046 to QA-070 (25 tests)
```

### 1.3 QA-ID Numbering Convention

**Format**: `QA-XXX` where XXX is a zero-padded sequential number starting from 001

**Numbering Rules**:
- ✅ Sequential: QA-001, QA-002, QA-003, etc.
- ✅ Zero-padded: Always 3 digits (QA-001, not QA-1)
- ✅ Permanent: Once assigned, QA-ID never changes
- ✅ No gaps: If test removed, mark as "Deprecated" (don't reuse ID)
- ✅ Category-based: Group related tests in sequential ranges

**Example**:
```
Database Schema Tests: QA-001 to QA-025
API Endpoint Tests: QA-026 to QA-075
Frontend Component Tests: QA-076 to QA-125
Security Tests: QA-126 to QA-150
```

---

## 2. QA Catalog Creation Process

### 2.1 Phase 1: Architecture Analysis

**Input**: Frozen architecture (all 11 documents)

**Activities**:
1. Review all 11 architecture documents
2. Identify all testable components
3. Identify all testable behaviors
4. Identify all error conditions
5. Identify all integration points
6. Identify all data flows
7. Identify all security controls

**Output**: List of all test scenarios (not yet assigned QA-IDs)

**Completeness Criteria**:
- [ ] Every architecture component has test scenarios
- [ ] Every API endpoint has test scenarios
- [ ] Every database entity has test scenarios
- [ ] Every workflow has test scenarios
- [ ] Every integration point has test scenarios
- [ ] Every security control has test scenarios
- [ ] Every error condition has test scenario

---

### 2.2 Phase 2: Test Category Definition

**Input**: Test scenarios from Phase 1

**Activities**:
1. Group test scenarios into logical categories
2. Order categories by implementation priority
3. Estimate test count per category
4. Assign QA-ID ranges per category

**Output**: Category structure with QA-ID range allocations

**Category Examples**:
```
1. Database Schema Compliance - QA-001 to QA-025 (25 tests)
2. API Contract Validation - QA-026 to QA-075 (50 tests)
3. Frontend Component Behavior - QA-076 to QA-125 (50 tests)
4. Authentication & Authorization - QA-126 to QA-150 (25 tests)
5. Data Validation Rules - QA-151 to QA-200 (50 tests)
6. Integration Points - QA-201 to QA-225 (25 tests)
7. Error Handling - QA-226 to QA-250 (25 tests)
8. Security Controls - QA-251 to QA-275 (25 tests)
9. Audit Logging - QA-276 to QA-300 (25 tests)
10. Performance & Scalability - QA-301 to QA-325 (25 tests)
11. End-to-End Workflows - QA-326 to QA-375 (50 tests)
```

**Best Practices**:
- ✅ Group related tests together (sequential QA-IDs for same category)
- ✅ Allocate buffer (leave room for growth within category)
- ✅ Priority-ordered (Critical categories first)
- ✅ Wave-friendly (category ranges align with wave boundaries)

---

### 2.3 Phase 3: Test Case Documentation

**Input**: Category structure with QA-ID ranges

**Activities**:
For each test scenario identified in Phase 1:
1. Assign QA-ID (next available in category range)
2. Write clear test case title
3. Document test purpose
4. Link to architecture component
5. Link to FRS requirement
6. Specify test type (Unit/Integration/E2E)
7. Assign priority (Critical/High/Medium/Low)
8. Document expected behavior

**Output**: Complete QA Catalog with all test cases documented

**Test Case Template**:
```markdown
#### QA-XXX: [Clear, Descriptive Test Title]
**Purpose**: [What this test validates - be specific]
**Architecture Component**: [Component.subcomponent from architecture docs]
**FRS Requirement**: [FR-XXX or BR-XXX]
**Test Type**: [Unit/Integration/E2E/Performance]
**Priority**: [Critical/High/Medium/Low]
**Wave Assignment**: [Unassigned - assigned during wave planning]
**Status**: [Not Implemented]

**Test Scenario**:
Given [preconditions]
When [action]
Then [expected result]

**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Error Conditions Tested**:
- [Error condition 1] → [Expected behavior]
- [Error condition 2] → [Expected behavior]
```

**Example (Good)**:
```markdown
#### QA-026: POST /api/internal-transfers Creates Transfer Successfully
**Purpose**: Validate that internal transfer can be created with valid data
**Architecture Component**: API.InternalTransfers.CreateEndpoint
**FRS Requirement**: FR-012 (Create Internal Transfer)
**Test Type**: Integration
**Priority**: Critical
**Wave Assignment**: Unassigned
**Status**: Not Implemented

**Test Scenario**:
Given authenticated technician user
And valid transfer data (sender, recipient, parts, reason)
When POST /api/internal-transfers with valid data
Then response status 201 Created
And transfer record created in database
And transfer PDF generated
And notification email sent to recipient
And audit log entry created

**Acceptance Criteria**:
- [ ] Response includes transfer ID (TRF-XXXXX format)
- [ ] Database record matches request data
- [ ] PDF document accessible via returned URL
- [ ] Email queued for delivery
- [ ] Audit log contains "Transfer created" entry

**Error Conditions Tested**:
- Invalid recipient → 400 Bad Request with clear error message
- Missing required field → 400 Bad Request specifying missing field
- Empty parts list → 400 Bad Request "At least one part required"
- Unauthorized user → 401 Unauthorized
```

---

### 2.4 Phase 4: Traceability Validation

**Input**: Complete QA Catalog

**Activities**:
1. Create FRS-to-QA traceability matrix
2. Create Architecture-to-QA traceability matrix
3. Identify coverage gaps
4. Add missing test cases
5. Validate 100% coverage

**Output**: 
- Traceability matrices (100% coverage)
- Gap report (zero gaps)

**FRS-to-QA Traceability Matrix**:
```markdown
## FRS-to-QA Traceability

| FRS ID | Requirement | QA-IDs | Coverage |
|--------|-------------|--------|----------|
| FR-001 | User Authentication | QA-126, QA-127, QA-128 | 100% |
| FR-002 | Create Transfer | QA-026, QA-027, QA-028 | 100% |
| FR-003 | Transfer PDF | QA-029, QA-030 | 100% |
| ... | ... | ... | ... |

**Coverage Summary**:
- Total FRS Requirements: [X]
- Requirements with QA Coverage: [X]
- Coverage: 100%
```

**Architecture-to-QA Traceability Matrix**:
```markdown
## Architecture-to-QA Traceability

| Architecture Component | QA-IDs | Test Count |
|------------------------|--------|------------|
| API.InternalTransfers | QA-026 to QA-035 | 10 |
| API.WarrantyClaims | QA-036 to QA-050 | 15 |
| Database.User | QA-001 to QA-005 | 5 |
| ... | ... | ... |

**Coverage Summary**:
- Total Architecture Components: [X]
- Components with QA Coverage: [X]
- Coverage: 100%
```

**CONSTITUTIONAL REQUIREMENT**: 100% coverage MANDATORY. Zero gaps.

---

### 2.5 Phase 5: QA Catalog Freeze

**Input**: Complete QA Catalog with 100% traceability

**Activities**:
1. Final review of all test cases
2. Verify all QA-IDs assigned
3. Verify all traceability complete
4. FM approval
5. Freeze QA Catalog

**Output**: Frozen QA Catalog ready for wave planning

**Freeze Declaration**:
```markdown
## QA CATALOG FREEZE DECLARATION

**Application**: [Application Name]
**Freeze Date**: [Date]
**Freeze Authority**: [FM Name/ID]

### Catalog Metrics
- Total Test Cases: [X]
- Test Categories: [Y]
- FRS Coverage: 100%
- Architecture Coverage: 100%

### Freeze Implications
- ✅ Wave planning may begin
- ✅ QA-ID ranges may be assigned to waves
- ⛔ No new test cases without change control
- ⛔ No QA-ID reassignment
- ⛔ No semantic changes to test cases without FM approval

### Change Control
Any post-freeze QA Catalog changes require:
1. Change request to FM with justification
2. Impact analysis (wave impact, builder impact)
3. FM approval
4. Update QA Catalog and notify wave planners

**Approved By**: [FM Name/ID]
**Date**: [Date]
```

---

## 3. QA-Catalog-Alignment (BL-018/BL-019 Constitutional Requirement)

### 3.1 The Catastrophic Pattern

**BL-018 Discovery** (Wave 2.2, FM Office App):
- Wave assigned QA-376 to QA-385 for "Parking Station Features"
- Actual QA Catalog: QA-376 to QA-385 were "Network/Resource Failure Modes"
- **Complete semantic disconnect**: UI features vs. failure modes
- Result: CATASTROPHIC wave planning failure

**BL-019 Discovery** (Wave 2.3, Same Day):
- FM created ratchet for BL-018 but failed to forward-scan remaining waves
- Wave 2.3 assigned QA-341 to QA-350 for "System Optimizations"
- Actual QA Catalog: QA-341 to QA-350 were "Analytics/Memory/Logging Failure Modes"
- **Same pattern, same day**: Second-time failure
- Result: 9 of 14 waves (64%) affected by misalignment

**Root Cause**: Wave planning proceeded without verifying QA-IDs in QA Catalog

---

### 3.2 Constitutional Alignment Requirements

**MANDATORY**: Before any wave planning or builder assignment, FM MUST:

1. **Verify QA-ID Existence**:
   - [ ] All QA-IDs in wave assignment exist in QA_CATALOG.md
   - [ ] QA-ID range continuous (no gaps: QA-010 to QA-020, not QA-010 to QA-025 with missing IDs)

2. **Verify Semantic Alignment**:
   - [ ] QA-ID test case titles match intended wave scope
   - [ ] QA-ID test purposes align with wave objectives
   - [ ] QA-ID architecture components match wave target components
   - [ ] No semantic disconnect (e.g., UI tests assigned to API wave)

3. **Verify Category Coherence**:
   - [ ] QA-ID range belongs to single test category (or closely related categories)
   - [ ] Category aligns with wave objective (e.g., "Database Schema" category for schema wave)

4. **Verify Traceability**:
   - [ ] QA-IDs in wave map to architecture components being built in wave
   - [ ] QA-IDs in wave map to FRS requirements targeted in wave

**BLOCKER**: If ANY alignment check fails, wave planning STOPS and escalates to FM.

---

### 3.3 QA-Catalog-Alignment Validation Process

**Before assigning QA-IDs to wave or subwave:**

#### Step 1: Locate QA-IDs in Catalog
```markdown
## Validation: Locate QA-IDs

**Wave**: [Wave X.Y]
**Assigned QA Range**: QA-XXX to QA-YYY
**Intended Scope**: [What this wave should build]

**Catalog Lookup**:
- [ ] QA-XXX exists in QA_CATALOG.md
- [ ] QA-YYY exists in QA_CATALOG.md
- [ ] All QA-IDs between XXX and YYY exist (no gaps)
- [ ] Location: QA_CATALOG.md lines [start]-[end]
```

#### Step 2: Validate Semantic Alignment
```markdown
## Validation: Semantic Alignment

**Wave Objective**: [Build X, implement Y, create Z]

**QA-IDs Review**:
| QA-ID | Title | Purpose | Component | Alignment |
|-------|-------|---------|-----------|-----------|
| QA-XXX | [title] | [purpose] | [component] | ✅/❌ |
| QA-XXX+1 | [title] | [purpose] | [component] | ✅/❌ |
| ... | ... | ... | ... | ... |
| QA-YYY | [title] | [purpose] | [component] | ✅/❌ |

**Alignment Summary**:
- Total QA-IDs: [N]
- Aligned: [N]
- Misaligned: [0] ← MUST BE ZERO
- Alignment Rate: 100% ← MUST BE 100%

**Semantic Check**:
- [ ] All test titles match wave objective
- [ ] All test purposes align with wave scope
- [ ] All architecture components match wave target
- [ ] Zero semantic disconnects detected
```

#### Step 3: Validate Category Coherence
```markdown
## Validation: Category Coherence

**QA-IDs**: QA-XXX to QA-YYY

**Category Breakdown**:
| Category | QA-IDs in Range | Percentage |
|----------|-----------------|------------|
| [Category 1] | QA-XXX to QA-AAA | XX% |
| [Category 2] | QA-BBB to QA-CCC | YY% |

**Coherence Check**:
- [ ] Majority (>80%) from single category, OR
- [ ] All categories closely related and wave-appropriate

**Category Alignment**:
- Wave Objective: [Build X]
- Dominant Category: [Category Y]
- Alignment: ✅ Categories match objective / ❌ Categories misaligned
```

#### Step 4: Forward-Scan (BL-019 Requirement)
```markdown
## Validation: Forward-Scan (Prevent BL-019)

**Current Wave**: [Wave X.Y]
**Remaining Waves**: [List of waves after X.Y]

**Forward-Scan Checklist**:
For each remaining wave:
- [ ] Wave [X.Y+1]: QA range [A]-[B] validated (✅ Aligned / ❌ Misaligned / ⏳ Pending)
- [ ] Wave [X.Y+2]: QA range [C]-[D] validated (✅ Aligned / ❌ Misaligned / ⏳ Pending)
- [ ] Wave [X.Y+3]: QA range [E]-[F] validated (✅ Aligned / ❌ Misaligned / ⏳ Pending)

**Forward-Scan Result**:
- Total Remaining Waves: [N]
- Validated: [N]
- Aligned: [N]
- Misaligned: [0] ← MUST BE ZERO
- Alignment Rate: 100% ← MUST BE 100%

**Action Required**:
- If misalignments found: STOP, fix all misalignments, re-validate
- If all aligned: PROCEED with confidence
```

#### Step 5: FM Approval
```markdown
## QA-Catalog-Alignment Approval

**Wave**: [Wave X.Y]
**QA Range**: QA-XXX to QA-YYY

**Validation Results**:
- ✅ QA-IDs exist in catalog
- ✅ Semantic alignment 100%
- ✅ Category coherence validated
- ✅ Forward-scan complete (all remaining waves aligned)

**Approval**:
- [ ] FM validates all checks passed
- [ ] FM approves wave assignment
- [ ] Wave authorized to proceed

**Approved By**: [FM Name/ID]
**Date**: [Date]
```

**CONSTITUTIONAL REQUIREMENT**: FM MUST complete all 5 steps before authorizing wave.

---

### 3.4 Misalignment Response Protocol

**If misalignment detected:**

1. **STOP Immediately**:
   - Do NOT proceed with wave assignment
   - Do NOT create builder issue
   - Do NOT assign builder

2. **Document Misalignment**:
   ```markdown
   ## QA-Catalog Misalignment Report
   
   **Wave**: [Wave X.Y]
   **Date**: [Date]
   **Reporter**: [Name/Role]
   
   **Assigned QA Range**: QA-XXX to QA-YYY
   **Intended Scope**: [What wave should build]
   
   **Misalignment Details**:
   | QA-ID | Expected | Actual | Type |
   |-------|----------|--------|------|
   | QA-XXX | [Expected test] | [Actual test] | Semantic disconnect |
   | QA-YYY | [Expected test] | [Actual test] | Wrong category |
   
   **Impact**:
   - Wave cannot proceed (builder would build wrong things)
   - QA Catalog may need restructuring
   - Wave plan may need revision
   
   **Root Cause**: [Why misalignment occurred]
   ```

3. **Escalate to FM**:
   - Report misalignment immediately
   - Include full misalignment report
   - Propose remediation options

4. **Remediate**:
   **Option A**: Fix QA Catalog (if QA-IDs wrong)
   - Update QA Catalog with correct test definitions
   - Re-freeze QA Catalog
   - Re-validate alignment

   **Option B**: Fix Wave Assignment (if wave scope wrong)
   - Assign different QA range that matches wave scope
   - Validate new range alignment
   - Update wave plan

   **Option C**: Split or Merge Waves (if wave structure wrong)
   - Restructure waves to align with QA categories
   - Re-assign QA ranges
   - Validate all wave alignments

5. **Forward-Scan After Fix** (BL-019 Requirement):
   - Check ALL remaining waves for same misalignment pattern
   - Fix all instances found
   - Validate full wave plan alignment

6. **Document Learning**:
   - Record misalignment in FAILURE_LEARNING_LOG.md
   - Update this guide with new anti-patterns
   - Update wave planning process to prevent recurrence

---

## 4. QA Catalog Maintenance

### 4.1 Adding Test Cases (Post-Freeze)

**When Allowed**:
- Discovered gap during implementation
- New requirement added (with FRS update)
- Architecture change (with architecture update)

**Process**:
1. Submit change request to FM
2. Document gap and justification
3. FM approves change
4. Assign next available QA-ID in appropriate category
5. Update QA Catalog
6. Update traceability matrices
7. Notify affected wave planners/builders
8. Re-validate wave assignments (if affected)

---

### 4.2 Modifying Test Cases (Post-Freeze)

**When Allowed**:
- Test case ambiguous (clarification needed)
- Architecture changed (test case must update)
- Test case incorrect (discovered error)

**Process**:
1. Submit change request to FM
2. Document reason for modification
3. FM approves change
4. Update test case in QA Catalog
5. Version bump (minor version)
6. Notify affected builders

**PROHIBITED**:
- ❌ Changing QA-ID (permanent identifiers)
- ❌ Changing test case to different semantic purpose
- ❌ Removing test cases (mark as Deprecated instead)

---

### 4.3 Deprecating Test Cases

**When Allowed**:
- Test case no longer relevant (requirement removed)
- Test case duplicate (covered by another test)
- Architecture changed (component removed)

**Process**:
1. Submit deprecation request to FM
2. Document reason for deprecation
3. FM approves deprecation
4. Mark test case as **Deprecated** (do NOT delete)
5. Update traceability matrices
6. Adjust wave assignments (remove deprecated QA-IDs)

**Template**:
```markdown
#### QA-XXX: [Original Title] **DEPRECATED**
**Status**: DEPRECATED
**Deprecated Date**: [Date]
**Reason**: [Why deprecated]
**Replaced By**: [QA-YYY if applicable, or "None"]
```

---

## 5. QA Catalog Templates

### 5.1 Full QA Catalog Template

Available at: `governance/templates/QA_CATALOG_TEMPLATE.md`

Template includes:
- Metadata section
- Category structure
- Test case template
- Traceability matrix template
- Wave assignment section
- Completeness checklist

---

## 6. Anti-Patterns

### 6.1 Common Mistakes

❌ **Generic Test Titles**: "Test API endpoint works"
- Fix: "POST /api/internal-transfers Creates Transfer Successfully"

❌ **Missing Architecture Link**: No component specified
- Fix: Link every test case to specific architecture component

❌ **QA-ID Reuse**: Reusing QA-ID after deprecation
- Fix: QA-IDs are permanent, mark as deprecated, use next available

❌ **Wave Planning Before Catalog**: Assigning waves before QA Catalog frozen
- Fix: QA Catalog MUST be frozen before wave planning begins

❌ **Skipping Alignment Validation**: "We know the QA-IDs are right"
- Fix: MANDATORY validation per BL-018/BL-019 (constitutional requirement)

❌ **No Forward-Scan**: Only validating current wave
- Fix: MUST forward-scan all remaining waves (BL-019 requirement)

❌ **Semantic Disconnect**: QA-IDs don't match wave objective
- Fix: Validate semantic alignment before wave assignment

❌ **Incomplete Traceability**: Not all FRS requirements have QA coverage
- Fix: 100% traceability MANDATORY

---

## 7. Success Criteria

QA Catalog design is successful when:
- ✅ All test cases documented with QA-IDs
- ✅ FRS-to-QA traceability 100%
- ✅ Architecture-to-QA traceability 100%
- ✅ Zero gaps in coverage
- ✅ All test cases linked to architecture components
- ✅ All test cases linked to FRS requirements
- ✅ QA Catalog frozen and FM-approved
- ✅ QA-Catalog-Alignment validated (BL-018/BL-019 compliance)
- ✅ Ready for wave planning

---

## 8. Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/QA_CATALOG_DESIGN_GUIDE.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- BL-018: Wave Planning MUST Verify QA Catalog
- BL-019: Second-Time QA Catalog Misalignment and Forward-Scan Failure
- FM_PREAUTH_CHECKLIST.md
- QA_TO_RED_PLANNING_PROTOCOL.md
- WAVE_PLANNING_GUIDE.md

---

## 9. Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional Requirement - BL-018/BL-019)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: QA-Catalog-Alignment is non-negotiable (BL-018/BL-019)  
**Enforcement**: FM + Governance Liaison (joint authority)
