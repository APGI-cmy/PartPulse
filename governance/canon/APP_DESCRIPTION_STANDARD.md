# App Description Standard

**Document ID**: ADS-CANON-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Referenced In**: FM_PREAUTH_CHECKLIST.md, BUILD_PHILOSOPHY.md

---

## Purpose

This standard defines the **mandatory structure and completeness requirements** for Application Description documents. The App Description is the **True North Phase 1** foundational document that defines what is being built before any architecture, QA, or implementation work begins.

**FM Authority**: App Description MUST be 100% complete and approved by FM before any architecture design may commence.

---

## Constitutional Principle

**From BUILD_PHILOSOPHY.md**:
> "True North defines the destination. App Description is True North Phase 1. You cannot architect what you haven't defined."

**One-Time Build Law**:
> "A clear destination enables a direct path. Ambiguous requirements guarantee rework."

**From BL-020 (Bootstrap Learning)**:
> "FM pre-authorization begins with validating App Description completeness. Gaps in App Description cascade into architecture gaps, QA gaps, and implementation gaps."

---

## 1. Document Structure

### 1.1 Required Sections

Every App Description MUST contain these sections:

1. **Purpose** - What problem does this application solve?
2. **Core Value Propositions** - Why build this? What value does it deliver?
3. **Scope Boundaries** - What's in scope? What's explicitly out of scope?
4. **Users & Roles** - Who uses this? What can each role do?
5. **Workflows** - What are the key business processes?
6. **Data Entities** - What information does the application manage?
7. **Security & Compliance** - What are the security requirements and regulatory obligations?
8. **Integration Points** - What external systems does this interact with?
9. **Non-Functional Requirements** - Performance, availability, scalability expectations
10. **Success Criteria** - How do we know this application is successful?

---

### 1.2 Section 1: Purpose

**Required Content**:
- [ ] Clear problem statement (what operational problem is being solved)
- [ ] Target audience (who has this problem)
- [ ] Current state (how is this problem currently handled)
- [ ] Desired future state (how will this application improve the situation)
- [ ] Success metrics (how will improvement be measured)

**Completeness Criteria**:
- ✅ Problem statement is specific and measurable
- ✅ Target audience clearly identified
- ✅ Pain points of current state documented
- ✅ Benefits of future state quantified
- ✅ Success metrics are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

**Anti-Patterns to Avoid**:
- ❌ Vague purpose: "Improve operations"
- ❌ Solution-first thinking: "Build a React app" (describes solution, not problem)
- ❌ Missing metrics: No way to measure success
- ❌ Circular definition: "Purpose is to implement the requirements"

**Example (Good)**:
```
## Purpose

PartPulse is a production-grade web application designed to streamline Trane part 
distribution management and warranty processing workflows. The application enables 
technicians and administrators to track internal part transfers, process warranty 
claims, manage employee access, generate compliance reports, and maintain comprehensive 
audit trails for regulatory compliance.

PartPulse replaces manual paper-based processes with a secure, mobile-first digital 
workflow that reduces errors, improves traceability, and accelerates warranty claim 
processing.

**Problem**: Technicians currently use paper forms for part transfers and warranty 
claims, leading to:
- 30% error rate in manual data entry
- 5-7 day processing time for warranty claims
- No audit trail for compliance
- Difficulty tracking parts in transit

**Solution**: Digital workflow with mobile access reduces errors, enables real-time 
tracking, provides compliance audit trails, and reduces processing time to <24 hours.

**Success Metrics**:
- Reduce data entry errors from 30% to <2%
- Reduce warranty claim processing time from 5-7 days to <24 hours
- 100% audit trail compliance
- 95% technician adoption within 90 days
```

---

### 1.3 Section 2: Core Value Propositions

**Required Content**:
- [ ] Primary value proposition (most important benefit)
- [ ] Secondary value propositions (3-5 additional benefits)
- [ ] Stakeholder benefits (value per user type)
- [ ] Business value (ROI, cost savings, risk reduction)
- [ ] Competitive advantage (if applicable)

**Completeness Criteria**:
- ✅ Value propositions tied to specific problems
- ✅ Benefits quantified where possible
- ✅ Value clear to all stakeholder groups
- ✅ Business case established

**Example (Good)**:
```
### Core Value Propositions

1. **Operational Efficiency**: Digitize manual part tracking and warranty claim 
   processes, reducing processing time by 80%
2. **Compliance & Auditability**: Complete audit trails for all transactions and 
   approvals, ensuring regulatory compliance
3. **Mobile-First Access**: Field technicians can submit transfers and claims from 
   any device, eliminating return-to-office requirements
4. **Automated Documentation**: Generate professional PDFs matching Trane brand 
   standards, eliminating manual document creation
5. **Role-Based Security**: Granular access controls protect sensitive operational 
   data and ensure proper separation of duties
```

---

### 1.4 Section 3: Scope Boundaries

**Required Content**:
- [ ] **In Scope**: Explicit list of included features and capabilities
- [ ] **Out of Scope**: Explicit list of excluded features (current phase)
- [ ] **Future Scope**: Features planned for later phases
- [ ] Rationale for scope decisions

**Completeness Criteria**:
- ✅ In Scope is comprehensive and specific
- ✅ Out of Scope prevents scope creep
- ✅ Boundaries between phases clear
- ✅ No ambiguous "maybe" features

**Critical**: Out of Scope is as important as In Scope. Explicitly stating what is NOT being built prevents scope creep and sets clear expectations.

**Example (Good)**:
```
### Scope Boundaries

**In Scope:**
- Internal part transfers between technicians and locations
- Warranty claim submission and processing for Trane parts
- Employee invitation and role management
- PDF generation for transfers and warranty claims
- Email notifications for key workflow events
- Reports and analytics on transfers, claims, and user activity
- System audit logging and security monitoring
- Admin approval workflows for warranty claims

**Out of Scope (Current Phase):**
- External customer-facing warranty portal
- Integration with external ERP/inventory systems
- Real-time inventory tracking and stock levels
- Shipping and logistics integration
- Mobile app (native iOS/Android) - web mobile-first only
- Offline functionality
- Multi-language support
- Barcode/QR code scanning

**Future Scope (Phase 2+):**
- Real-time inventory synchronization with ERP
- External customer portal for warranty status
- Mobile apps (iOS/Android native)
- Offline mode with sync
- Multi-language (Spanish, French)
```

---

### 1.5 Section 4: Users & Roles

**Required Content**:
- [ ] All user types/roles identified
- [ ] Primary responsibilities per role
- [ ] Key workflows per role
- [ ] Access level and permissions per role
- [ ] User volume estimates (how many users per role)

**Completeness Criteria**:
- ✅ Every user type has clear definition
- ✅ Responsibilities are specific and actionable
- ✅ Permissions aligned with responsibilities
- ✅ User volume informs architecture decisions

**Template per Role**:
```
### Role: [Role Name]

**Primary Responsibilities:**
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

**Key Workflows:**
1. [Workflow 1] - [Brief description]
2. [Workflow 2] - [Brief description]

**Access Level:**
- [What they can read]
- [What they can create]
- [What they can modify]
- [What they can delete]
- [What they CANNOT access]

**Volume Estimate**: [X users expected]

**Success Criteria**: [How do we measure this role's success?]
```

**Example (Good)**:
```
### Role: Administrator

**Primary Responsibilities:**
- Oversee system operations and user management
- Process and approve warranty claims
- Generate organizational reports
- Configure system settings
- Monitor security and audit logs

**Key Workflows:**
1. User Management - Invite employees, assign roles, deactivate users
2. Warranty Claim Approval - Review and approve/reject warranty claims
3. Reporting - Generate monthly operational reports
4. System Monitoring - Review audit logs and security events

**Access Level:**
- Read: All data (transfers, claims, users, reports, logs)
- Create: User invitations, reports, system configurations
- Modify: User roles, system settings, warranty claim status
- Delete: Users (deactivate), test data (non-production only)
- CANNOT: Delete audit logs, modify historical transactions

**Volume Estimate**: 5-10 administrators

**Success Criteria**: 
- Process warranty claims within 24 hours
- Zero security incidents
- Monthly reports delivered on time
```

---

### 1.6 Section 5: Workflows

**Required Content**:
- [ ] All major business workflows documented
- [ ] Step-by-step process for each workflow
- [ ] Actors involved in each step
- [ ] Decision points and branching logic
- [ ] Error conditions and exception handling
- [ ] Success and failure outcomes

**Completeness Criteria**:
- ✅ Every workflow has clear start and end
- ✅ All decision points documented
- ✅ Error handling specified
- ✅ Workflows mapped to user roles

**Template per Workflow**:
```
### Workflow: [Workflow Name]

**Actors**: [Who participates in this workflow]

**Trigger**: [What starts this workflow]

**Steps**:
1. [Actor] [Action] → [Result]
2. [Actor] [Action] → [Result]
3. **Decision**: [Condition]
   - If [Condition A]: [Path A]
   - If [Condition B]: [Path B]
4. [Actor] [Action] → [Result]

**Success Outcome**: [What happens when successful]

**Failure Conditions**:
- [Failure condition 1] → [How handled]
- [Failure condition 2] → [How handled]

**Data Created/Modified**: [What data changes]

**Notifications**: [Who gets notified and when]

**Audit Trail**: [What gets logged]
```

**Example (Good)**:
```
### Workflow: Internal Part Transfer

**Actors**: Technician (Sender), Technician (Receiver), System

**Trigger**: Technician needs to transfer parts to another technician or location

**Steps**:
1. Technician logs into system
2. Technician navigates to "Create Transfer" page
3. Technician fills in transfer details:
   - Recipient technician or location
   - Parts being transferred (part #, description, quantity, condition)
   - Transfer reason
   - Special handling notes (if applicable)
4. System validates:
   - Recipient exists
   - Part numbers valid
   - Quantities > 0
   - Required fields complete
5. **Decision**: Validation result
   - If validation passes: Proceed to step 6
   - If validation fails: Show errors, return to step 3
6. Technician submits transfer
7. System creates transfer record with status "Pending"
8. System generates transfer PDF document
9. System sends email notification to recipient with PDF attached
10. System logs audit entry: "Transfer TRF-XXXXX created by [Technician]"
11. Recipient acknowledges receipt (updates status to "Completed")
12. System sends confirmation email to sender

**Success Outcome**: Transfer completed, both parties notified, audit trail created

**Failure Conditions**:
- Recipient email invalid → Show error, require correction
- PDF generation fails → Retry up to 3 times, escalate to admin if persistent
- Email delivery fails → Queue for retry, show warning to user

**Data Created/Modified**:
- InternalTransfer record (new)
- AuditLog entry (new)
- PDF document (new)

**Notifications**:
- Recipient: "New transfer from [Sender]" (immediate)
- Sender: "Transfer acknowledged by [Recipient]" (when completed)

**Audit Trail**:
- Transfer created (who, when, what)
- Transfer submitted (when)
- Recipient notified (when, method)
- Transfer acknowledged (who, when)
```

---

### 1.7 Section 6: Data Entities

**Required Content**:
- [ ] All major data entities identified
- [ ] Key attributes per entity
- [ ] Relationships between entities
- [ ] Data lifecycle (create, read, update, delete, archive)
- [ ] Data validation rules
- [ ] Data retention policies

**Completeness Criteria**:
- ✅ All entities from workflows identified
- ✅ Key attributes defined (full schema in architecture phase)
- ✅ Relationships clear
- ✅ Lifecycle documented

**Template per Entity**:
```
### Entity: [Entity Name]

**Purpose**: [What this entity represents]

**Key Attributes**:
- [Attribute 1] - [Description, type, required/optional]
- [Attribute 2] - [Description, type, required/optional]
- [Attribute 3] - [Description, type, required/optional]

**Relationships**:
- [Relationship 1]: [Entity A] → [Entity B] ([Cardinality])
- [Relationship 2]: [Entity B] → [Entity C] ([Cardinality])

**Lifecycle**:
- **Created**: [When and by whom]
- **Modified**: [What can be modified, by whom]
- **Deleted**: [Soft delete or hard delete, by whom]
- **Archived**: [After how long, where]

**Validation Rules**:
- [Rule 1]
- [Rule 2]

**Access Control**: [Who can read/write this entity]

**Retention**: [How long kept, when archived/deleted]
```

**Example (Good)**:
```
### Entity: Internal Transfer

**Purpose**: Represents a part transfer between technicians or locations

**Key Attributes**:
- Transfer ID - Unique identifier (TRF-XXXXX), auto-generated, required
- Sender - Technician initiating transfer, required
- Recipient - Technician or location receiving parts, required
- Transfer Date - Date transfer initiated, auto-set, required
- Parts List - Array of parts being transferred, minimum 1 part, required
- Status - Current state (Pending, In Transit, Completed, Cancelled), required
- Reason - Business reason for transfer, optional
- Notes - Special handling instructions, optional
- PDF URL - Link to generated transfer document, auto-generated

**Relationships**:
- InternalTransfer → User (Sender) [Many-to-One]
- InternalTransfer → User (Recipient) [Many-to-One]
- InternalTransfer → AuditLog [One-to-Many]

**Lifecycle**:
- **Created**: When technician submits transfer form
- **Modified**: Status can be updated by recipient; original details immutable after creation
- **Deleted**: Soft delete only (marked as Cancelled), by sender or admin before recipient acknowledges
- **Archived**: After 7 years per compliance requirements

**Validation Rules**:
- Sender and Recipient must be active users
- Sender and Recipient must be different
- At least one part required
- Part quantities must be > 0
- Status transitions: Pending → Completed or Cancelled only

**Access Control**:
- Create: All authenticated users
- Read: Sender, Recipient, Administrators
- Update Status: Recipient, Administrators
- Delete: Sender (before acknowledgment), Administrators

**Retention**: 7 years active + 3 years archived
```

---

### 1.8 Section 7: Security & Compliance

**Required Content**:
- [ ] Authentication requirements
- [ ] Authorization model (roles, permissions)
- [ ] Data protection requirements
- [ ] Audit logging requirements
- [ ] Regulatory compliance requirements
- [ ] Privacy requirements
- [ ] Security monitoring requirements

**Completeness Criteria**:
- ✅ All security requirements explicit
- ✅ Compliance requirements identified
- ✅ Audit trail requirements clear
- ✅ Data protection measures defined

**Example (Good)**:
```
### Security & Compliance

**Authentication**:
- NextAuth.js with OAuth 2.0 (Google Workspace)
- Multi-factor authentication (MFA) required for Administrators
- Session timeout: 8 hours inactivity
- No password storage (delegated to OAuth provider)

**Authorization**:
- Role-based access control (RBAC)
- Roles: Administrator, Technician
- Permissions enforced at API and UI layers
- Principle of least privilege

**Data Protection**:
- All data encrypted at rest (database encryption)
- All data encrypted in transit (TLS 1.3)
- PII (Personally Identifiable Information) limited to user profiles
- No credit card or payment information stored

**Audit Logging**:
- All create/update/delete operations logged
- All authentication events logged
- All authorization failures logged
- All admin actions logged
- Logs retained for 7 years
- Logs immutable (no deletion or modification)

**Regulatory Compliance**:
- SOX (Sarbanes-Oxley) compliance for audit trails
- GDPR considerations for employee data
- Trane corporate security policies
- Industry standard data retention (7 years)

**Security Monitoring**:
- Failed login attempt monitoring
- Unusual access pattern detection
- Admin action review (quarterly)
- Security incident response plan

**Privacy**:
- Employee data limited to business needs
- No third-party data sharing
- Data access logged and auditable
- Right to access (employees can request their data)
```

---

### 1.9 Section 8: Integration Points

**Required Content**:
- [ ] All external systems identified
- [ ] Integration type (API, file transfer, database, etc.)
- [ ] Data exchanged (what flows in/out)
- [ ] Frequency of integration
- [ ] Error handling for integration failures

**Completeness Criteria**:
- ✅ All external dependencies identified
- ✅ Integration patterns defined
- ✅ Failure modes documented
- ✅ Data contracts specified

**Template per Integration**:
```
### Integration: [System Name]

**Type**: [API, File Transfer, Database, Message Queue, etc.]

**Purpose**: [Why integrate with this system]

**Direction**: [Inbound, Outbound, Bidirectional]

**Data Exchanged**:
- **Outbound**: [What data flows to external system]
- **Inbound**: [What data flows from external system]

**Frequency**: [Real-time, Hourly, Daily, On-demand]

**Protocol**: [REST API, SOAP, FTP, Database Connection, etc.]

**Authentication**: [How authentication works]

**Error Handling**:
- [Error type 1] → [How handled]
- [Error type 2] → [How handled]

**Fallback Strategy**: [What happens if integration unavailable]

**Dependencies**: [What breaks if this integration fails]
```

**Example (Good)**:
```
### Integration: Email Service (SendGrid)

**Type**: REST API

**Purpose**: Send transactional emails (notifications, reports)

**Direction**: Outbound only

**Data Exchanged**:
- **Outbound**: 
  - Recipient email address
  - Email subject and body (templated)
  - Attachments (PDFs)
  - Sender information (no-reply@partpulse.trane.com)

**Frequency**: Real-time (triggered by events)

**Protocol**: SendGrid REST API v3

**Authentication**: API key (stored in environment variables)

**Error Handling**:
- Network timeout → Retry up to 3 times with exponential backoff
- Invalid email address → Log error, show warning to user
- Rate limit exceeded → Queue for later delivery
- API key invalid → Alert administrators immediately (critical)

**Fallback Strategy**: 
- Queue emails for retry (up to 24 hours)
- Alert administrators if queue depth exceeds 100
- Manual email option for critical notifications

**Dependencies**: 
- Transfer notifications (user experience degraded without)
- Warranty claim notifications (critical workflow requirement)
- User invitations (cannot invite users without email)
```

---

### 1.10 Section 9: Non-Functional Requirements

**Required Content**:
- [ ] Performance requirements
- [ ] Availability requirements
- [ ] Scalability requirements
- [ ] Reliability requirements
- [ ] Maintainability requirements
- [ ] Usability requirements

**Completeness Criteria**:
- ✅ All NFRs quantified (not vague)
- ✅ Measurement methods defined
- ✅ Acceptance criteria clear

**Example (Good)**:
```
### Non-Functional Requirements

**Performance**:
- Page load time: <2 seconds (90th percentile)
- API response time: <500ms (95th percentile)
- PDF generation: <5 seconds per document
- Database query time: <100ms (95th percentile)
- Support 50 concurrent users without degradation

**Availability**:
- Uptime: 99.5% (excluding planned maintenance)
- Planned maintenance: <4 hours/month, off-peak hours
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour (database backups)

**Scalability**:
- Support 500 active users (current need: 100)
- Handle 1,000 transfers per day (current: 50-100)
- Handle 200 warranty claims per day (current: 20-30)
- Database: 10GB initial, 50GB growth over 3 years
- Vertical scaling sufficient (no horizontal scaling required initially)

**Reliability**:
- Data integrity: 100% (zero data loss)
- Transaction consistency: ACID guarantees
- Error rate: <0.1% of requests
- Backup verification: Weekly restore testing

**Maintainability**:
- Code coverage: Minimum 80% test coverage
- Documentation: All APIs documented
- Deployment: Zero-downtime deployments
- Rollback capability: <30 minutes to previous version

**Usability**:
- Mobile-first responsive design (320px to 2560px)
- WCAG 2.1 Level AA accessibility compliance
- Browser support: Chrome, Firefox, Safari, Edge (last 2 versions)
- Training time: <2 hours for technicians, <4 hours for administrators
- Error messages: Clear, actionable, non-technical language
```

---

### 1.11 Section 10: Success Criteria

**Required Content**:
- [ ] Business success metrics
- [ ] Technical success metrics
- [ ] User adoption metrics
- [ ] Quality metrics
- [ ] Timeline and milestones

**Completeness Criteria**:
- ✅ Metrics are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- ✅ Success thresholds defined
- ✅ Measurement methods identified

**Example (Good)**:
```
### Success Criteria

**Business Metrics**:
- Reduce warranty claim processing time from 5-7 days to <24 hours (85% improvement)
- Reduce data entry errors from 30% to <2% (93% improvement)
- Achieve 95% technician adoption within 90 days of launch
- Process 100% of part transfers digitally (zero paper forms) within 6 months
- ROI positive within 18 months

**Technical Metrics**:
- 99.5% uptime in first 6 months
- <0.1% error rate
- 100% audit trail compliance (zero gaps)
- Zero critical security incidents
- <2 second page load time maintained

**User Satisfaction**:
- Net Promoter Score (NPS) > 50
- User satisfaction survey > 4.0/5.0
- <5 support tickets per 100 users per month
- 90% of users rate system "easy to use" or "very easy to use"

**Quality Metrics**:
- Zero data loss incidents
- <1 production bug per 1000 users per month
- 100% of bugs fixed within SLA (Critical: 24h, High: 1 week, Medium: 1 month)

**Timeline**:
- Architecture complete: Month 1
- QA-to-Red complete: Month 2
- Build-to-Green complete: Month 3-4
- Beta testing: Month 5
- Production launch: Month 6
- Full adoption: Month 9
```

---

## 2. Completeness Checklist

Use this checklist to validate App Description completeness before submitting for FM approval.

### 2.1 Structure Completeness
- [ ] All 10 required sections present
- [ ] No "TBD", "TODO", or placeholder content
- [ ] No vague or ambiguous statements
- [ ] All references to other documents valid

### 2.2 Content Quality
- [ ] Purpose is clear and specific
- [ ] Value propositions quantified
- [ ] Scope boundaries explicit (In/Out of scope)
- [ ] All user roles defined with responsibilities
- [ ] All major workflows documented end-to-end
- [ ] All data entities identified
- [ ] Security requirements comprehensive
- [ ] All integration points documented
- [ ] Non-functional requirements quantified
- [ ] Success criteria measurable

### 2.3 Traceability
- [ ] Workflows map to user roles
- [ ] Data entities map to workflows
- [ ] Integration points map to workflows
- [ ] Security requirements map to data entities
- [ ] NFRs map to success criteria

### 2.4 FM Pre-Authorization Requirements
- [ ] Minimum 30KB content (typical for comprehensive app)
- [ ] All sections comprehensive (not just outlines)
- [ ] Document ready for architecture phase (no ambiguities)
- [ ] Stakeholder review completed
- [ ] No unresolved questions or dependencies

---

## 3. Review Process

### 3.1 Self-Review
Before submitting to FM, author should:
1. Complete Completeness Checklist (Section 2)
2. Verify all 10 sections populated
3. Run spell check and grammar check
4. Verify all cross-references valid
5. Ensure minimum content threshold met (~30KB)

### 3.2 Peer Review
Recommended peer review:
1. Technical reviewer (architecture perspective)
2. Business reviewer (business value perspective)
3. User representative (usability perspective)

### 3.3 FM Review
FM will validate:
1. All sections present and complete
2. No ambiguities or placeholders
3. Sufficient detail for architecture phase
4. Success criteria measurable
5. Scope boundaries clear
6. Traceability validated

**FM Approval Required Before**:
- Architecture design begins
- Any technical decisions made
- Any implementation work starts

---

## 4. Examples

### 4.1 Reference Example: PartPulse

PartPulse App Description (`APP_DESCRIPTION.md` in root) serves as the canonical reference example.

**Strengths**:
- ✅ Clear purpose and problem statement
- ✅ Quantified value propositions
- ✅ Explicit scope boundaries (In/Out of scope)
- ✅ Comprehensive role definitions
- ✅ Detailed workflow documentation
- ✅ Complete data entity catalog
- ✅ Security and compliance thoroughly documented
- ✅ Integration points clearly defined
- ✅ NFRs quantified with thresholds
- ✅ Success criteria measurable

**Size**: 49.5 KB (exceeds minimum threshold)

**FM Approval**: ✅ Approved 2025-12-16

---

## 5. Anti-Patterns

### 5.1 Common Mistakes

❌ **Vague Purpose**: "Improve business operations"
- Fix: Specify exact problem, current state, desired state, metrics

❌ **Solution-First**: "Build a React app with PostgreSQL"
- Fix: Describe problem and requirements, not implementation choices

❌ **Missing Out-of-Scope**: Only lists what's included
- Fix: Explicitly document what's NOT included to prevent scope creep

❌ **Generic Workflows**: "User logs in and does stuff"
- Fix: Document step-by-step with decision points and error handling

❌ **Unquantified NFRs**: "System should be fast and reliable"
- Fix: "Page load <2s, 99.5% uptime, <0.1% error rate"

❌ **Placeholder Content**: "TBD after stakeholder meeting"
- Fix: Complete all stakeholder alignment BEFORE finalizing App Description

❌ **Missing Error Handling**: Only documents happy path
- Fix: Document all error conditions and exception handling

❌ **No Success Metrics**: No way to measure if application succeeded
- Fix: Define SMART metrics with thresholds and measurement methods

---

## 6. Templates

### 6.1 App Description Template

Available at: `governance/templates/APP_DESCRIPTION_TEMPLATE.md`

Template includes:
- All 10 required sections with prompts
- Completeness checklist
- Example content for each section
- Anti-pattern warnings

---

## 7. Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/APP_DESCRIPTION_STANDARD.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- FM_PREAUTH_CHECKLIST.md
- BUILD_PHILOSOPHY.md
- FRS_TEMPLATE.md
- ARCHITECTURE_DESIGN_PROCESS.md

---

## 8. Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional Requirement)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: App Description completeness is non-negotiable  
**Enforcement**: FM + Governance Liaison (joint authority)
