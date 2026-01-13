# PartPulse - Functional Requirements Specification (FRS)

**Document ID**: FRS-PARTPULSE-1.0  
**Project**: PartPulse - Trane Part Distribution & Warranty Management  
**Version**: 1.0  
**Date**: 2026-01-13  
**Status**: Approved (Pending FM + Human Review)  
**Approved By**: FM Authority (Pending), Johan Ras (Pending)  
**Canonical Source**: Maturion Foreman Governance (FM Pre-Build Requirements)

---

## Section 0: Derivation Statement

**This Functional Requirements Specification is derived from `APP_DESCRIPTION.md`.**

All requirements herein implement the application purpose, scope, and success criteria defined in that authoritative document. This FRS serves as the bridge between the App Description (what/why) and the Architecture (how).

**Traceability**: Every functional requirement in this document explicitly references the corresponding section(s) in `APP_DESCRIPTION.md` to ensure complete alignment and prevent scope drift or contradictions.

**Governance Compliance**: This FRS satisfies the mandatory requirements defined in:
- `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md`
- `governance/architecture/ARCHITECTURE_COMPILATION_CONTRACT.md`
- `governance/templates/FRS_TEMPLATE.md`

---

## 1. Executive Summary

### 1.1 Purpose

**Source**: `APP_DESCRIPTION.md` - Section "Purpose"

PartPulse is a production-grade web application designed to streamline Trane part distribution management and warranty processing workflows. The application enables technicians and administrators to track internal part transfers, process warranty claims, manage employee access, generate compliance reports, and maintain comprehensive audit trails for regulatory compliance.

PartPulse replaces manual paper-based processes with a secure, mobile-first digital workflow that reduces errors, improves traceability, and accelerates warranty claim processing.

**Core Value Propositions**:
1. **Operational Efficiency**: Digitize manual part tracking and warranty claim processes
2. **Compliance & Auditability**: Complete audit trails for all transactions and approvals
3. **Mobile-First Access**: Field technicians can submit transfers and claims from any device
4. **Automated Documentation**: Generate professional PDFs matching Trane brand standards
5. **Role-Based Security**: Granular access controls protect sensitive operational data

### 1.2 Scope

**Source**: `APP_DESCRIPTION.md` - Section "Scope Boundaries"

**In Scope:**
- Internal part transfers between technicians and locations
- Warranty claim submission and processing for Trane parts
- Employee invitation and role management (Admin, Technician)
- PDF generation for transfers and warranty claims (Trane-branded)
- Email notifications for key workflow events
- Reports and analytics on transfers, claims, and user activity
- System audit logging and security monitoring
- Admin approval workflows for warranty claims
- Authentication and session management
- Mobile-first responsive UI design
- Role-based access control (RBAC)
- Data validation and sanitization (XSS, SQL injection protection)

**Out of Scope (Future Phases):**
- External customer-facing warranty portal
- Integration with external ERP/inventory systems
- Real-time inventory tracking and stock levels
- Shipping and logistics integration
- Mobile app (native iOS/Android)
- Offline functionality
- Multi-language support
- Barcode/QR code scanning
- Photo upload for warranty claims (deferred)
- Service report attachment (deferred)

### 1.3 Success Criteria

**Source**: `APP_DESCRIPTION.md` - Section "Conclusion"

**This FRS is complete and successful when:**
- All 7+ capability domains from App Description are covered with functional requirements
- All workflows (5 documented workflows) have complete functional specifications
- All data models from App Description are specified with validation rules
- All output artifacts (PDFs, emails, reports) have complete requirements
- All security and audit requirements are documented with acceptance criteria
- Traceability matrix shows complete App Description → FRS mapping
- No contradictions with App Description exist
- No scope expansion beyond App Description exists
- FM validates governance compliance and completeness
- Human owner (Johan) approves FRS as foundation for architecture

---

## 2. User Roles & Personas

**Source**: `APP_DESCRIPTION.md` - Section "Users & Roles"

### 2.1 Administrator

**Description**: Operations managers, IT administrators, warranty department staff, and compliance officers who oversee system operations, process warranty claims, manage users, and generate organizational reports.

**Responsibilities**:
- Oversee system operations and user management
- Process and approve warranty claims
- Generate organizational reports
- Configure system settings
- Monitor security and audit logs
- Manage employee accounts (invite, deactivate, reset passwords)

**Permissions**:
- **User Management**: Full CRUD on all users; invite new admins and technicians; reset passwords
- **Internal Transfers**: View, edit, and delete all transfers (own and others')
- **Warranty Claims**: View, edit, approve/reject all claims; add admin signatures and stamps
- **Reports**: Access all organizational reports with full data visibility
- **Audit Logs**: Read-only access to complete audit trail
- **Settings**: Configure system preferences and security settings
- **Employee Management**: View, edit, and deactivate employee accounts

**Goals**:
- Process warranty claims efficiently and accurately
- Maintain compliance with regulatory requirements
- Monitor system usage and security
- Ensure operational efficiency across all technicians

**Pain Points (Addressed by PartPulse)**:
- Manual paper-based warranty claim processing is slow and error-prone
- Lack of visibility into technician activities and part transfers
- Difficult to generate compliance reports from paper records
- No audit trail for regulatory compliance

### 2.2 Technician

**Description**: Field technicians, service technicians, installation crews, and maintenance staff who submit internal part transfers and warranty claims, track their own submissions, and view personal activity reports.

**Responsibilities**:
- Submit internal part transfers
- File warranty claims for defective parts
- Track own submissions
- View personal activity reports

**Permissions**:
- **User Management**: None (cannot invite or manage users)
- **Internal Transfers**: Create, view, and edit own transfers; read-only view of others' transfers
- **Warranty Claims**: Create, view, and edit own claims; read-only view of others' claims
- **Reports**: View reports filtered to own data only
- **Audit Logs**: None
- **Settings**: None
- **Employee Management**: View own profile only

**Goals**:
- Quickly submit part transfers and warranty claims from the field
- Track status of own submissions
- Receive confirmation and updates on warranty claims

**Pain Points (Addressed by PartPulse)**:
- Paper forms are inconvenient in the field
- No visibility into warranty claim status
- Manual data entry is time-consuming and error-prone
- Difficulty accessing forms and records from mobile devices

### 2.3 Authentication & Session Management

**Source**: `APP_DESCRIPTION.md` - Section "Authentication & Session Management"

- **Authentication Method**: Email + password (NextAuth.js with JWT sessions)
- **Session Duration**: 8 hours with automatic timeout
- **Password Requirements**: Minimum 16 characters, at least 1 uppercase, 1 number, 1 special character
- **Failed Login Protection**: Account lockout after 5 failed attempts (15-minute lockout)
- **Invitation Expiry**: 7 days for new user invitations
- **Password Reset**: Admin-initiated password reset generates temporary password

---

## 3. Functional Requirements - Internal Part Transfers

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 1: Internal Part Transfer"

### FR-DIST-001: Initiate Internal Transfer

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall allow authenticated users to initiate a new internal part transfer by navigating to the Internal Transfer page and accessing a transfer form.

**Preconditions**:
- User is authenticated
- User has Technician or Administrator role

**Main Flow**:
1. User navigates to Internal Transfer page
2. System displays transfer form with current date/time pre-filled
3. User can immediately begin entering transfer details

**Acceptance Criteria**:
- [x] Internal Transfer page is accessible from main navigation
- [x] Transfer form loads with date field pre-filled with current date/time
- [x] Form is responsive and optimized for mobile devices
- [x] Technician name is pre-filled from authenticated user session

**Dependencies**: FR-AUTH-001 (User Authentication)

---

### FR-DIST-002: Enter Transfer Details

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall provide input fields for all required and optional transfer information including date, SSID, site name, PO number, technician name, and items table.

**Preconditions**:
- User has initiated a new transfer (FR-DIST-001)

**Main Flow**:
1. User enters or confirms transfer date (defaults to current date)
2. User optionally enters SSID (Site or job identifier)
3. User optionally enters Site Name (location name)
4. User optionally enters PO Number (purchase order reference)
5. System displays Technician Name pre-filled from user session
6. User adds one or more items to the parts table:
   - Quantity (number, required)
   - Part Number (text, required)
   - Description (text, required)

**Business Rules**:
- Date cannot be in the future (configurable)
- At least one item must be added to the transfer
- Quantity must be between 1 and 9999
- Part Number max length: 100 characters
- Description max length: 500 characters
- SSID max length: 100 characters
- Site Name max length: 200 characters
- PO Number max length: 50 characters

**Acceptance Criteria**:
- [x] All required fields are marked with visual indicators
- [x] Date picker allows date selection (validation prevents future dates)
- [x] Items table supports adding/removing multiple rows
- [x] Quantity field accepts only positive integers (1-9999)
- [x] Character limits are enforced on all text fields
- [x] Form provides immediate validation feedback

**Dependencies**: FR-DIST-001

---

### FR-DIST-003: Add Client Information (Optional)

**Priority**: Medium  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall allow users to optionally capture client/recipient acknowledgment information including client name, date, and digital signature.

**Preconditions**:
- User is filling out a transfer form (FR-DIST-002)

**Main Flow**:
1. User optionally enters Client Name
2. User optionally enters Client Date
3. User optionally captures Client Signature (digital signature or text)

**Business Rules**:
- All client fields are optional
- Client Name max length: 200 characters
- Client Date must be valid date (not future)
- Client Signature can be base64-encoded digital signature or text string

**Acceptance Criteria**:
- [x] Client information section is clearly labeled as optional
- [x] Digital signature capture is supported (canvas or text input)
- [x] Client date validation prevents future dates
- [x] Client name is sanitized to prevent XSS attacks

**Dependencies**: FR-DIST-002

---

### FR-DIST-004: Validate Transfer Submission

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall perform comprehensive client-side and server-side validation before accepting a transfer submission.

**Preconditions**:
- User has completed transfer form (FR-DIST-002)
- User has clicked Submit button

**Main Flow**:
1. System performs client-side validation using Zod schemas
2. System checks all required fields are completed
3. System validates data types and constraints
4. If validation passes, form data is submitted to server
5. Server performs identical validation (never trust client)
6. Server sanitizes all string inputs to prevent XSS attacks
7. If server validation passes, proceed to FR-DIST-005
8. If validation fails, display error messages to user

**Exception Flows**:
- **EXC-004A**: Required field missing → Display field-specific error message
- **EXC-004B**: Invalid data format → Display validation error with correction guidance
- **EXC-004C**: Server validation fails → Display generic error, log details for admin
- **EXC-004D**: No items added → Display "At least one item required" error

**Business Rules**:
- Client-side validation provides immediate feedback
- Server-side validation is authoritative
- All string inputs must be sanitized (HTML entity encoding)
- Validation errors must be user-friendly and actionable

**Acceptance Criteria**:
- [x] Client-side validation prevents invalid submissions
- [x] Server-side validation re-validates all inputs
- [x] Validation errors display next to relevant fields
- [x] XSS sanitization applied to all string inputs
- [x] Form state preserved on validation failure
- [x] Generic error messages prevent information disclosure

**Dependencies**: FR-DIST-002, FR-SEC-002 (Input Sanitization)

---

### FR-DIST-005: Save Transfer to Database

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall save validated transfer data to the database with unique transfer ID, technician association, timestamps, and audit trail entry.

**Preconditions**:
- Transfer data has passed validation (FR-DIST-004)

**Main Flow**:
1. System generates unique transfer ID (CUID)
2. System creates InternalTransfer record with all transfer details
3. System creates InternalTransferItem records for each part in items table
4. System associates transfer with authenticated user (technicianId)
5. System sets createdAt and updatedAt timestamps automatically
6. System creates audit log entry (eventType: "submission")
7. System commits database transaction
8. System returns transfer ID to calling function

**Exception Flows**:
- **EXC-005A**: Database connection failure → Retry 3 times, then return error
- **EXC-005B**: Unique constraint violation → Generate new ID and retry
- **EXC-005C**: Transaction rollback → Log error and notify user of failure

**Postconditions**:
- Transfer record exists in database with unique ID
- All transfer items are linked to transfer record
- Audit log entry created
- Transfer is associated with submitting technician

**Business Rules**:
- Each transfer must have at least one item
- Technician ID must match authenticated user (for Technician role)
- Admin can submit transfers on behalf of any technician (future)
- Timestamps are system-generated and immutable

**Acceptance Criteria**:
- [x] Unique transfer ID generated (CUID format)
- [x] Transfer record saved to InternalTransfer table
- [x] Transfer items saved to InternalTransferItem table with correct foreign keys
- [x] technicianId matches authenticated user
- [x] createdAt and updatedAt timestamps set automatically
- [x] Audit log entry created with complete details
- [x] Database transaction ensures atomicity

**Dependencies**: FR-DIST-004, FR-AUDIT-001 (Audit Logging)

---

### FR-DIST-006: Generate Transfer PDF

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall automatically generate a professional PDF document for the transfer matching Trane branding standards.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 1. Internal Transfer PDF"

**Preconditions**:
- Transfer has been saved to database (FR-DIST-005)

**Main Flow**:
1. System retrieves transfer data including all items
2. System generates PDF using custom template engine
3. PDF includes:
   - **Header**: Company logo, "Internal Transfer" title, Transfer ID, generation timestamp
   - **Transfer Information**: Date, SSID, Site Name, PO Number, Technician Name
   - **Parts Table**: Columns (Qty | Part No. | Description), rows for each item, totals row
   - **Client Section**: Client Name, Client Date, Client Signature (if provided)
   - **Footer**: Page number, "Generated by PartPulse" branding, generation timestamp
4. System applies Trane brand specifications:
   - Brand Color: #FF2B00 (Trane Red)
   - Margins: 25pt all sides
   - Title Font: 16pt bold
   - Section Headers: 12pt bold
   - Body Text: 10pt
   - Table Row Height: 28pt
5. System saves PDF to storage (local filesystem or S3)
6. System links PDF path to transfer record in database
7. System returns PDF path/URL

**Exception Flows**:
- **EXC-006A**: PDF generation failure → Log error, mark transfer as pending PDF, retry later
- **EXC-006B**: Storage failure → Retry with exponential backoff (3 attempts)

**Postconditions**:
- PDF file exists in storage
- Transfer record contains PDF path/URL
- PDF is accessible for download

**Business Rules**:
- PDF format: A4 size
- PDF must match Trane brand standards
- PDF is generated immediately after transfer submission
- PDF can be regenerated if admin adds approval stamp

**Acceptance Criteria**:
- [x] PDF generated automatically on transfer submission
- [x] PDF contains all transfer details and items
- [x] PDF matches Trane brand color (#FF2B00)
- [x] PDF layout is professional and print-ready
- [x] PDF includes page numbers and generation timestamp
- [x] PDF is stored in configured storage provider
- [x] Transfer record contains valid PDF path/URL
- [x] PDF is downloadable from transfer detail page

**Dependencies**: FR-DIST-005, FR-PDF-001 (PDF Generation Engine)

---

### FR-DIST-007: Send Transfer Confirmation Email

**Priority**: High  
**User Role**: System  
**Status**: Approved

**Description**: The system shall send an HTML-formatted email receipt to the technician immediately after transfer submission.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → A. Internal Transfer Receipt Email"

**Preconditions**:
- Transfer has been saved (FR-DIST-005)
- PDF has been generated (FR-DIST-006)

**Main Flow**:
1. System retrieves transfer data and technician email
2. System composes email using branded template:
   - **Subject**: "Internal Transfer Confirmation - [Transfer ID]"
   - **Content**:
     - Confirmation message
     - Transfer ID
     - Transfer date
     - Items transferred (summary table)
     - Link to view transfer details
     - Link to download PDF
     - Next steps information
3. System sends email via configured provider (Resend/SendGrid/AWS SES)
4. System logs email event to audit trail (eventType: "pdf_generation")
5. System implements retry logic (3 attempts with exponential backoff)

**Exception Flows**:
- **EXC-007A**: Email send failure → Retry 3 times with exponential backoff
- **EXC-007B**: Email provider unavailable → Log error, queue for later retry
- **EXC-007C**: Invalid email address → Log error, notify admin

**Postconditions**:
- Email sent to technician
- Audit log entry created for email event

**Business Rules**:
- Email sent to authenticated user's email address
- Email template uses Trane branding
- Email includes call-to-action buttons (Trane red #FF2B00)
- Email failure does not block transfer submission

**Acceptance Criteria**:
- [x] Email sent immediately after transfer submission
- [x] Email subject includes transfer ID
- [x] Email body includes transfer summary
- [x] Email includes link to view transfer (requires authentication)
- [x] Email includes link to download PDF
- [x] Email uses branded HTML template
- [x] Retry logic handles transient failures
- [x] Email failures are logged but don't block submission

**Dependencies**: FR-DIST-006, FR-EMAIL-001 (Email Template System), FR-AUDIT-001

---

### FR-DIST-008: Display Transfer Confirmation

**Priority**: High  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall redirect the user to the transfer detail page after successful submission, displaying complete transfer information and providing download options.

**Preconditions**:
- Transfer has been submitted and saved (FR-DIST-005)
- PDF has been generated (FR-DIST-006)

**Main Flow**:
1. System redirects user to transfer detail page (/transfers/[transferId])
2. System displays success message: "Transfer submitted successfully"
3. System displays complete transfer information:
   - Transfer ID (prominently displayed)
   - Transfer date
   - SSID, Site Name, PO Number (if provided)
   - Technician name
   - Items table with all parts
   - Client information (if provided)
4. System provides action buttons:
   - Download PDF
   - Submit Another Transfer
   - View All Transfers
   - Edit Transfer (if user owns it and has permission)

**Acceptance Criteria**:
- [x] User redirected to transfer detail page after submission
- [x] Success message displayed prominently
- [x] All transfer details displayed accurately
- [x] Download PDF button is functional
- [x] "Submit Another Transfer" button returns to transfer form
- [x] Transfer ID is prominently displayed and copyable
- [x] Mobile-optimized layout

**Dependencies**: FR-DIST-005, FR-DIST-006

---

### FR-DIST-009: View Transfer List

**Priority**: High  
**User Role**: Technician (own), Administrator (all)  
**Status**: Approved

**Description**: The system shall display a paginated list of internal transfers with role-based filtering.

**Preconditions**:
- User is authenticated

**Main Flow**:
1. User navigates to Transfers page
2. System determines user role:
   - **Technician**: Query returns only transfers where technicianId matches user ID
   - **Administrator**: Query returns all transfers
3. System displays transfer list with columns:
   - Transfer ID
   - Date
   - Technician (Admin sees all; Technician sees own name)
   - Site Name
   - Items Count
   - Actions (View, Download PDF, Edit, Delete)
4. System provides pagination (30 items per page)
5. System provides filters:
   - Date Range (Start Date to End Date)
   - Technician (Admin only - dropdown of all technicians)
   - Sort: By Date (asc/desc)

**Business Rules**:
- Technicians can only view own transfers
- Administrators can view all transfers
- Pagination default: 30 items per page
- Transfers sorted by date descending (newest first) by default

**Acceptance Criteria**:
- [x] Transfer list displays correct transfers based on user role
- [x] Role-based filtering enforced (Technician sees only own)
- [x] Pagination works correctly (Next/Previous buttons)
- [x] Date range filter works accurately
- [x] Technician dropdown available for Admin only
- [x] Sort functionality works correctly
- [x] Mobile-responsive table layout

**Dependencies**: FR-AUTH-002 (Authorization), FR-DIST-005

---

### FR-DIST-010: Edit Own Transfer

**Priority**: Medium  
**User Role**: Technician (own), Administrator (all)  
**Status**: Approved

**Description**: The system shall allow users to edit transfers they own (Technician) or any transfer (Administrator).

**Preconditions**:
- User is authenticated
- Transfer exists in database
- User owns transfer (Technician) OR user is Administrator

**Main Flow**:
1. User clicks Edit button on transfer list or detail page
2. System verifies user has permission to edit (ownership or admin role)
3. System loads transfer form with existing data pre-filled
4. User modifies transfer details (same fields as FR-DIST-002)
5. User submits edited transfer
6. System validates changes (FR-DIST-004)
7. System updates transfer record in database
8. System updates updatedAt timestamp
9. System creates audit log entry (action: "TRANSFER_MODIFIED")
10. System regenerates PDF with updated data (FR-DIST-006)
11. System displays success message

**Exception Flows**:
- **EXC-010A**: User lacks permission → Display "Access Denied" error
- **EXC-010B**: Transfer not found → Display "Transfer not found" error
- **EXC-010C**: Validation fails → Display validation errors

**Postconditions**:
- Transfer record updated in database
- updatedAt timestamp reflects modification time
- Audit log entry created
- PDF regenerated with updated data

**Business Rules**:
- Technicians can only edit own transfers
- Administrators can edit any transfer
- All validation rules from FR-DIST-004 apply
- Editing does not change transfer ID or createdAt timestamp

**Acceptance Criteria**:
- [x] Edit form pre-fills with existing transfer data
- [x] Authorization enforced (ownership or admin role)
- [x] Validation rules apply to edited data
- [x] Database record updated with changes
- [x] Audit log entry created
- [x] PDF regenerated automatically
- [x] Success message displayed after save

**Dependencies**: FR-DIST-004, FR-DIST-006, FR-AUTH-002, FR-AUDIT-001

---

### FR-DIST-011: Delete Transfer (Admin Only)

**Priority**: Low  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to delete transfer records with confirmation and audit logging.

**Preconditions**:
- User is authenticated as Administrator
- Transfer exists in database

**Main Flow**:
1. Administrator clicks Delete button on transfer
2. System displays confirmation dialog: "Are you sure you want to delete this transfer? This action cannot be undone."
3. Administrator confirms deletion
4. System deletes transfer record and associated items from database (CASCADE)
5. System creates audit log entry (action: "TRANSFER_DELETED")
6. System optionally archives PDF (configurable)
7. System displays success message: "Transfer deleted successfully"
8. System redirects to transfer list

**Exception Flows**:
- **EXC-011A**: User is not admin → "Access Denied" error
- **EXC-011B**: Database deletion fails → Log error, display generic error message
- **EXC-011C**: Transfer has dependent records → Handle cascade or prevent deletion

**Postconditions**:
- Transfer record removed from database
- Associated transfer items removed (cascade delete)
- Audit log entry created
- PDF optionally archived

**Business Rules**:
- Only Administrators can delete transfers
- Deletion requires explicit confirmation
- Deletion is permanent (cannot be undone)
- Audit trail preserves record of deletion
- PDF may be archived rather than deleted (configurable)

**Acceptance Criteria**:
- [x] Delete button visible only to Administrators
- [x] Confirmation dialog displayed before deletion
- [x] Authorization enforced (Admin role required)
- [x] Database records deleted (transfer + items cascade)
- [x] Audit log entry created with transfer details
- [x] Success message displayed
- [x] User redirected to transfer list

**Dependencies**: FR-AUTH-002, FR-AUDIT-001

---

### FR-DIST-012: Add Admin Approval Stamp

**Priority**: Medium  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to add an admin signature/stamp to a transfer for approval documentation.

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 1: Internal Part Transfer" - Step 6

**Preconditions**:
- User is authenticated as Administrator
- Transfer exists in database

**Main Flow**:
1. Administrator navigates to transfer detail page
2. Administrator clicks "Add Admin Approval" button
3. System displays admin approval form:
   - Admin Signature (digital or text)
   - Admin Stamp checkbox (marks as "PROCESSED")
4. Administrator enters signature and checks stamp
5. System validates inputs
6. System updates transfer record:
   - adminSignature = provided signature
   - adminStamp = true
7. System regenerates PDF with admin signature and "PROCESSED" stamp
8. System creates audit log entry (action: "ADMIN_APPROVAL")
9. System displays success message

**Postconditions**:
- Transfer record contains admin signature
- adminStamp flag set to true
- PDF regenerated with admin approval
- Audit log entry created

**Business Rules**:
- Only Administrators can add approval stamps
- Admin signature is required if adminStamp is checked
- PDF regeneration includes "PROCESSED" stamp (matching Trane red)
- Admin approval can be added/modified multiple times

**Acceptance Criteria**:
- [x] Admin approval button visible only to Administrators
- [x] Admin approval form captures signature
- [x] Database record updated with admin signature and stamp
- [x] PDF regenerated with admin signature and "PROCESSED" stamp
- [x] Audit log entry created
- [x] Success message displayed

**Dependencies**: FR-AUTH-002, FR-DIST-006, FR-AUDIT-001

---

## 4. Functional Requirements - Warranty Claims

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 2: Warranty Claim Submission & Processing"

### FR-WARR-001: Initiate Warranty Claim

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall allow authenticated users to initiate a new warranty claim by navigating to the Warranty Claims page and accessing a claim form matching the official Trane Warranty Parts Claims Form.

**Preconditions**:
- User is authenticated
- User has Technician or Administrator role

**Main Flow**:
1. User navigates to Warranty Claims page
2. User clicks "New Claim" button
3. System displays warranty claim form matching official Trane Warranty Parts Claims Form
4. Form loads with current date pre-filled
5. User can begin entering claim details

**Acceptance Criteria**:
- [x] Warranty Claims page accessible from main navigation
- [x] "New Claim" button prominently displayed
- [x] Claim form matches official Trane Warranty Parts Claims Form layout
- [x] Date field pre-filled with current date
- [x] Form is responsive and mobile-optimized
- [x] Attended By (Technician Name) pre-filled from session

**Dependencies**: FR-AUTH-001

---

### FR-WARR-002: Complete General Information

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall provide input fields for all general claim information including date, chiller details, job information, and technician name.

**Preconditions**:
- User has initiated a new claim (FR-WARR-001)

**Main Flow**:
1. User enters or confirms claim submission date
2. User enters Chiller Model (optional)
3. User enters Chiller Serial Number (optional)
4. User enters Job Number/SSID (optional)
5. User enters Building Name (optional)
6. User enters Site Name (optional)
7. System displays Attended By (Technician Name) pre-filled from session

**Business Rules**:
- Date cannot be in future
- Chiller Model max length: 100 characters
- Chiller Serial max length: 100 characters
- Job Number/SSID max length: 100 characters
- Building Name max length: 200 characters
- Site Name max length: 200 characters
- All text fields sanitized to prevent XSS

**Acceptance Criteria**:
- [x] All general information fields available
- [x] Date validation prevents future dates
- [x] Character limits enforced on all fields
- [x] Attended By pre-filled and read-only for Technicians
- [x] Form provides immediate validation feedback
- [x] Mobile-optimized field layout

**Dependencies**: FR-WARR-001

---

### FR-WARR-003: Add Failed Parts

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall allow users to add one or more failed parts to the warranty claim with all required serial number and date information.

**Preconditions**:
- User is completing a warranty claim form (FR-WARR-002)

**Main Flow**:
1. User clicks "Add Part" to add row to parts table
2. For each part, user enters:
   - **Part Number**: Trane part number (required)
   - **Quantity**: Number of parts claimed (required)
   - **Serial Number (Failed)**: Serial of failed part (mandatory per Trane requirements)
   - **Serial Number (Replaced)**: Serial of replacement part (required)
   - **Date of Failure**: When part failed (required)
   - **Date of Repair**: When repair was completed (required)
3. User can add multiple parts to single claim
4. User can remove parts using "Remove" button on each row

**Business Rules**:
- At least one part required for claim submission
- Part Number max length: 100 characters
- Quantity must be between 1 and 999
- Failed Part Serial is MANDATORY (per Trane requirements)
- Replaced Part Serial max length: 100 characters
- Date of Repair must be >= Date of Failure
- Dates cannot be in future

**Acceptance Criteria**:
- [x] Parts table supports adding/removing multiple rows
- [x] All required fields marked with visual indicators
- [x] Serial Number (Failed) is mandatory and validated
- [x] Date of Repair validation: must be >= Date of Failure
- [x] Quantity field accepts only integers 1-999
- [x] Form prevents submission if no parts added
- [x] Mobile-optimized table layout (stacked on small screens)

**Dependencies**: FR-WARR-002

---

### FR-WARR-004: Provide Additional Information

**Priority**: High  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall provide fields for detailed failure description, warranty coverage indication, and optional technician signature.

**Preconditions**:
- User is completing a warranty claim form (FR-WARR-003)

**Main Flow**:
1. User enters detailed failure description in Comments field
2. User checks "Covered by Warranty" checkbox if applicable
3. User optionally provides Technician Signature (digital or text)

**Business Rules**:
- Comments max length: 5000 characters
- Comments sanitized to prevent XSS
- Covered by Warranty is boolean (checked/unchecked)
- Technician Signature is optional
- Photos and service reports deferred to future phase

**Acceptance Criteria**:
- [x] Comments field provides large text area (5000 char limit)
- [x] Character counter displayed for Comments field
- [x] "Covered by Warranty" checkbox clearly labeled
- [x] Technician Signature capture supported (optional)
- [x] Form indicates photos/reports as future feature
- [x] Comments sanitized to prevent XSS

**Dependencies**: FR-WARR-003

---

### FR-WARR-005: Validate Warranty Claim Submission

**Priority**: Critical  
**User Role**: Technician, Administrator  
**Status**: Approved

**Description**: The system shall perform comprehensive client-side and server-side validation before accepting a warranty claim submission.

**Preconditions**:
- User has completed claim form (FR-WARR-004)
- User has clicked Submit button

**Main Flow**:
1. System performs client-side validation using Zod schemas
2. System checks all mandatory fields are completed:
   - Date (required)
   - At least one part (required)
   - For each part: Part No, Qty, Failed Serial, Replaced Serial, Failure Date, Repair Date (all required)
3. System validates business rules:
   - Date not in future
   - Serial numbers present for all parts
   - Date of Repair >= Date of Failure for each part
   - Quantities within valid range (1-999)
4. If validation passes, submit to server
5. Server performs identical validation (never trust client)
6. Server sanitizes all string inputs to prevent XSS
7. If server validation passes, proceed to FR-WARR-006
8. If validation fails, display error messages

**Exception Flows**:
- **EXC-005A**: Required field missing → Display field-specific error
- **EXC-005B**: Serial number missing → "Serial numbers are mandatory per Trane requirements"
- **EXC-005C**: Invalid date relationship → "Repair date must be on or after failure date"
- **EXC-005D**: No parts added → "At least one part required"
- **EXC-005E**: Server validation fails → Display generic error, log details

**Business Rules**:
- Serial numbers are MANDATORY per Trane warranty policy
- All validation rules from data model apply
- Client-side validation provides immediate feedback
- Server-side validation is authoritative

**Acceptance Criteria**:
- [x] Client-side validation prevents invalid submissions
- [x] Server-side validation re-validates all inputs
- [x] Validation errors display next to relevant fields
- [x] Serial number validation strictly enforced
- [x] Date relationship validation (repair >= failure)
- [x] XSS sanitization applied to all string inputs
- [x] Form state preserved on validation failure
- [x] User-friendly error messages

**Dependencies**: FR-WARR-004, FR-SEC-002

---

### FR-WARR-006: Save Warranty Claim to Database

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall save validated warranty claim data to the database with unique claim ID, technician association, timestamps, and audit trail entry.

**Preconditions**:
- Claim data has passed validation (FR-WARR-005)

**Main Flow**:
1. System generates unique claim ID (CUID)
2. System creates WarrantyClaim record with all claim details
3. System creates WarrantyItem records for each part in parts table
4. System associates claim with authenticated user (technicianId)
5. System sets createdAt and updatedAt timestamps automatically
6. System creates audit log entry (eventType: "submission", action: "WARRANTY_CLAIM_SUBMITTED")
7. System commits database transaction
8. System returns claim ID

**Exception Flows**:
- **EXC-006A**: Database connection failure → Retry 3 times, then return error
- **EXC-006B**: Unique constraint violation → Generate new ID and retry
- **EXC-006C**: Transaction rollback → Log error and notify user

**Postconditions**:
- WarrantyClaim record exists in database with unique ID
- All warranty items linked to claim record
- Audit log entry created
- Claim associated with submitting technician
- Claim status is "Submitted"

**Business Rules**:
- Each claim must have at least one item
- Technician ID must match authenticated user (for Technician role)
- Admin can submit claims (on behalf of technicians in future)
- Timestamps are system-generated and immutable
- Serial numbers are mandatory per Trane requirements

**Acceptance Criteria**:
- [x] Unique claim ID generated (CUID format)
- [x] Claim record saved to WarrantyClaim table
- [x] Claim items saved to WarrantyItem table with correct foreign keys
- [x] technicianId matches authenticated user
- [x] createdAt and updatedAt timestamps set automatically
- [x] Audit log entry created with complete details
- [x] Database transaction ensures atomicity
- [x] All serial numbers preserved in database

**Dependencies**: FR-WARR-005, FR-AUDIT-001

---

### FR-WARR-007: Generate Warranty Claim PDF

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall automatically generate a PDF document matching the official Trane Warranty Parts Claims Form.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 2. Warranty Claim PDF (Trane Form)"

**Preconditions**:
- Warranty claim has been saved to database (FR-WARR-006)

**Main Flow**:
1. System retrieves claim data including all parts
2. System generates PDF using custom template matching Trane form
3. PDF includes:
   - **Header**: Trane red circle logo, "TRANE" text, "TRANE TECHNOLOGIES" logo, centered title "TRANE WARRANTY PARTS CLAIMS FORM"
   - **General Information**: Date, Chiller Model, Chiller Serial, Job Number/SSID, Building Name, Site Name, Attended By
   - **Parts Table**: Columns (Part No. | Qty | Serial Number for Failed Parts | Serial Number for Replaced Part | Date of Failure | Date of Repair)
   - **Additional Information**: Comments, Warranty Coverage checkbox, Technician Signature (if provided)
   - **Important Notes**: Three bullet points per Trane requirements
   - **Footer**: Page number, generation timestamp
4. System applies Trane brand specifications:
   - Colors: Black text + Trane Red (#FF2B00 or #EE3124)
   - Fonts: Arial/Helvetica
   - Margins: 25pt all sides
   - Title font: 16pt bold
   - Section headers: 12pt bold
   - Table headers: 11pt bold
   - Body text: 10pt
   - Table row height: 28pt
5. System saves PDF to storage (local filesystem or S3)
6. System links PDF path to claim record in database
7. System returns PDF path/URL

**Exception Flows**:
- **EXC-007A**: PDF generation failure → Log error, mark claim as pending PDF, retry later
- **EXC-007B**: Storage failure → Retry with exponential backoff (3 attempts)

**Postconditions**:
- PDF file exists in storage
- Claim record contains PDF path/URL
- PDF is accessible for download

**Business Rules**:
- PDF format: A4 size
- PDF must exactly match official Trane Warranty Parts Claims Form
- PDF is generated immediately after claim submission
- PDF can be regenerated when admin adds approval
- Logo files: `/public/assets/logo/trane-logo.svg` and `/public/assets/logo/trane-tech-logo.svg`

**Acceptance Criteria**:
- [x] PDF generated automatically on claim submission
- [x] PDF matches official Trane Warranty Parts Claims Form layout
- [x] PDF includes all claim details and parts
- [x] PDF uses correct Trane branding (logos, colors, fonts)
- [x] PDF includes "Important Notes" section with 3 bullet points
- [x] PDF is professional and print-ready
- [x] PDF includes page numbers and generation timestamp
- [x] PDF stored in configured storage provider
- [x] Claim record contains valid PDF path/URL
- [x] PDF is downloadable from claim detail page

**Dependencies**: FR-WARR-006, FR-PDF-001

---

### FR-WARR-008: Send Claim Submission Confirmation Email

**Priority**: High  
**User Role**: System  
**Status**: Approved

**Description**: The system shall send HTML-formatted confirmation emails to the technician and admin notification immediately after claim submission.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → B. Warranty Claim Submission Email"

**Preconditions**:
- Claim has been saved (FR-WARR-006)
- PDF has been generated (FR-WARR-007)

**Main Flow**:
1. System retrieves claim data and technician email
2. System composes email to technician using branded template:
   - **Subject**: "Warranty Claim Submitted - [Claim ID]"
   - **Recipients**: Technician (submitter)
   - **Content**:
     - Confirmation message
     - Claim ID
     - Submission date
     - Parts claimed (summary)
     - Link to view claim details
     - Expected processing timeline
     - Reminder about required documentation (photos, service reports)
3. System composes admin notification email:
   - **Subject**: "New Warranty Claim - [Claim ID]"
   - **Recipients**: Administrators (configurable)
   - **Content**:
     - New claim notification
     - Claim ID and technician name
     - Link to review claim
4. System sends emails via configured provider (Resend/SendGrid/AWS SES)
5. System logs email events to audit trail
6. System implements retry logic (3 attempts with exponential backoff)

**Exception Flows**:
- **EXC-008A**: Email send failure → Retry 3 times with exponential backoff
- **EXC-008B**: Email provider unavailable → Log error, queue for later retry
- **EXC-008C**: Invalid email address → Log error, notify admin

**Postconditions**:
- Confirmation email sent to technician
- Admin notification email sent
- Audit log entries created for both emails
- Claim status remains "Submitted"

**Business Rules**:
- Technician email sent to authenticated user's email address
- Admin notification sent to all administrators (configurable)
- Email templates use Trane branding
- Email failure does not block claim submission

**Acceptance Criteria**:
- [x] Confirmation email sent to technician immediately
- [x] Admin notification sent to administrators
- [x] Email subjects include claim ID
- [x] Email bodies include claim summary
- [x] Emails include links to view claim (requires authentication)
- [x] Emails use branded HTML template
- [x] Retry logic handles transient failures
- [x] Email failures logged but don't block submission

**Dependencies**: FR-WARR-007, FR-EMAIL-001, FR-AUDIT-001

---

### FR-WARR-009: View Warranty Claim List

**Priority**: High  
**User Role**: Technician (own), Administrator (all)  
**Status**: Approved

**Description**: The system shall display a paginated list of warranty claims with role-based filtering and status indicators.

**Preconditions**:
- User is authenticated

**Main Flow**:
1. User navigates to Warranty Claims page
2. System determines user role:
   - **Technician**: Query returns only claims where technicianId matches user ID
   - **Administrator**: Query returns all claims
3. System displays claim list with columns:
   - Claim ID
   - Date Submitted
   - Technician (Admin sees all; Technician sees own name)
   - Chiller Model/Serial
   - Parts Count
   - Status (Submitted, Approved, Rejected, Resolved)
   - Actions (View, Download PDF, Edit, Admin Review)
4. System provides pagination (30 items per page)
5. System provides filters:
   - Date Range (Start Date to End Date)
   - Technician (Admin only - dropdown)
   - Status (Submitted, Approved, Rejected, Resolved)
   - Sort: By Date (asc/desc), Status

**Business Rules**:
- Technicians can only view own claims
- Administrators can view all claims
- Pagination default: 30 items per page
- Claims sorted by date descending (newest first) by default
- Status badges color-coded for quick identification

**Acceptance Criteria**:
- [x] Claim list displays correct claims based on user role
- [x] Role-based filtering enforced (Technician sees only own)
- [x] Pagination works correctly
- [x] Date range filter works accurately
- [x] Status filter allows multi-select or single-select
- [x] Technician dropdown available for Admin only
- [x] Status badges visually distinct (color-coded)
- [x] Mobile-responsive table layout
- [x] Admin Review action visible only to Admins

**Dependencies**: FR-AUTH-002, FR-WARR-006

---

### FR-WARR-010: View Warranty Claim Details

**Priority**: High  
**User Role**: Technician (own), Administrator (all)  
**Status**: Approved

**Description**: The system shall display complete warranty claim details including all general information, parts, comments, and processing status.

**Preconditions**:
- User is authenticated
- Claim exists in database
- User owns claim (Technician) OR user is Administrator

**Main Flow**:
1. User clicks on claim ID from claim list
2. System verifies user has permission to view claim
3. System displays claim detail page with:
   - **Claim Header**: Claim ID, Status badge, Submission date
   - **General Information**: Date, Chiller Model, Chiller Serial, Job Number/SSID, Building Name, Site Name, Attended By
   - **Failed Parts Table**: All parts with Part No, Qty, Failed Serial, Replaced Serial, Failure Date, Repair Date
   - **Additional Information**: Comments, Warranty Coverage checkbox status, Technician Signature (if provided)
   - **Admin Processing** (if processed): Admin Signature, Admin Date, Admin Notes, "PROCESSED" stamp indicator
   - **Actions**: Download PDF, Edit (if allowed), Admin Review (Admin only), Delete (Admin only)

**Exception Flows**:
- **EXC-010A**: User lacks permission → Display "Access Denied" error
- **EXC-010B**: Claim not found → Display "Claim not found" error

**Business Rules**:
- Technicians can only view own claims
- Administrators can view all claims
- Edit button visible only if claim not yet processed by admin (and user has permission)
- Admin Review button visible only to Administrators

**Acceptance Criteria**:
- [x] All claim details displayed accurately
- [x] Status badge prominently displayed
- [x] Parts table shows all claimed parts
- [x] Admin processing section visible if claim processed
- [x] Download PDF button functional
- [x] Edit button visible only when allowed
- [x] Admin Review button visible only to Admins
- [x] Mobile-optimized layout
- [x] Authorization enforced (ownership or admin role)

**Dependencies**: FR-AUTH-002, FR-WARR-006

---

### FR-WARR-011: Admin Review - Access Claim Queue

**Priority**: Critical  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall provide administrators with easy access to claims requiring review, filtered by "Submitted" status.

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 5: Admin Review & Approval (Warranty Claims)"

**Preconditions**:
- User is authenticated as Administrator

**Main Flow**:
1. Administrator navigates to Warranty Claims
2. Administrator filters list by Status: "Submitted"
3. System displays all claims awaiting admin review
4. Administrator clicks on claim to review (FR-WARR-010)

**Acceptance Criteria**:
- [x] Status filter includes "Submitted" option
- [x] Filter displays only claims awaiting review
- [x] Claim count badge indicates number of pending reviews
- [x] Quick access from admin dashboard (if applicable)

**Dependencies**: FR-WARR-009, FR-AUTH-002

---

### FR-WARR-012: Admin Review - Process Claim Decision

**Priority**: Critical  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to approve or reject warranty claims with admin signature, notes, and processing date.

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 2: Warranty Claim Submission & Processing" - Steps 8-11

**Preconditions**:
- User is authenticated as Administrator
- Claim exists with status "Submitted"

**Main Flow**:
1. Administrator views claim detail page (FR-WARR-010)
2. Administrator clicks "Admin Review" or "Process Claim" button
3. System displays admin processing interface with:
   - Complete claim review (read-only display of all claim details)
   - Decision buttons: Approve | Reject
   - Admin Signature field (digital or text, required)
   - Admin Notes field (optional, for explaining decision)
   - Processing Date (auto-filled with current date)
4. Administrator reviews claim completeness and validity:
   - Serial numbers present for all parts
   - Dates are logical (repair >= failure)
   - Warranty coverage indicated
   - Comments provide adequate failure description
5. Administrator decides: Approve or Reject
6. Administrator enters admin signature
7. Administrator optionally adds admin notes
8. Administrator confirms processing date
9. Administrator clicks "Approve" or "Reject" button
10. System validates admin inputs
11. System updates claim record in database:
    - adminSignature = provided signature
    - adminStamp = true (marks as "PROCESSED")
    - status = "Approved" or "Rejected"
    - adminProcessingDate = provided date
    - adminNotes = provided notes (if any)
12. System creates audit log entry (action: "WARRANTY_CLAIM_APPROVED" or "WARRANTY_CLAIM_REJECTED")
13. System proceeds to FR-WARR-013 (Regenerate PDF)
14. System proceeds to FR-WARR-014 (Send Decision Notification)

**Exception Flows**:
- **EXC-012A**: User is not admin → "Access Denied" error
- **EXC-012B**: Claim already processed → Display warning, allow re-processing
- **EXC-012C**: Admin signature missing → Validation error "Admin signature required"
- **EXC-012D**: Database update fails → Log error, display generic error message

**Postconditions**:
- Claim status updated to "Approved" or "Rejected"
- Admin signature and stamp saved to claim record
- Admin notes captured
- Audit log entry created
- PDF regeneration triggered (FR-WARR-013)
- Decision notification triggered (FR-WARR-014)

**Business Rules**:
- Only Administrators can approve/reject claims
- Admin signature is required for processing
- Admin notes are optional but recommended for rejections
- Processing date defaults to current date (editable)
- adminStamp = true indicates "PROCESSED" status
- Claim can be re-processed if admin needs to change decision

**Acceptance Criteria**:
- [x] Admin processing interface accessible only to Admins
- [x] Complete claim details displayed for review
- [x] Approve and Reject buttons clearly distinguished
- [x] Admin signature field required
- [x] Admin notes field available (optional)
- [x] Processing date auto-filled and editable
- [x] Validation enforces admin signature requirement
- [x] Database updated with all admin processing details
- [x] Audit log entry created with decision details
- [x] Success message displayed after processing
- [x] PDF regeneration triggered automatically
- [x] Email notification triggered automatically

**Dependencies**: FR-WARR-010, FR-AUTH-002, FR-AUDIT-001, FR-WARR-013, FR-WARR-014

---

### FR-WARR-013: Regenerate PDF with Admin Approval

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall regenerate the warranty claim PDF with admin signature, processing date, and "PROCESSED" stamp.

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 2: Warranty Claim Submission & Processing" - Steps 10, 6 (PDF regeneration)

**Preconditions**:
- Admin has processed claim (FR-WARR-012)
- Original PDF exists

**Main Flow**:
1. System retrieves updated claim data including admin processing details
2. System generates new PDF with same template as FR-WARR-007 PLUS:
   - **Admin Processing Section**:
     - Red "PROCESSED" stamp (matching Trane red #FF2B00)
     - Admin Signature
     - Admin Date (processing date)
     - Admin Notes (if provided)
3. System applies same Trane brand specifications as original PDF
4. System saves updated PDF to storage
5. System optionally archives previous PDF version (configurable)
6. System updates claim record with new PDF path
7. System returns new PDF path/URL

**Exception Flows**:
- **EXC-013A**: PDF generation failure → Retry 3 times, log error if fails
- **EXC-013B**: Storage failure → Retry with exponential backoff

**Postconditions**:
- Updated PDF exists in storage with admin approval
- Previous PDF archived (if configured)
- Claim record points to updated PDF
- PDF includes "PROCESSED" stamp and admin signature

**Business Rules**:
- PDF regenerated automatically when admin processes claim
- "PROCESSED" stamp displayed prominently in Trane red
- Previous PDF versions optionally archived (not deleted)
- Updated PDF includes all original claim data plus admin details

**Acceptance Criteria**:
- [x] PDF regenerated automatically after admin processing
- [x] PDF includes red "PROCESSED" stamp
- [x] PDF includes admin signature
- [x] PDF includes admin processing date
- [x] PDF includes admin notes (if provided)
- [x] PDF maintains Trane brand standards
- [x] Previous PDF archived (if configured)
- [x] Claim record updated with new PDF path
- [x] Updated PDF downloadable from claim detail page

**Dependencies**: FR-WARR-012, FR-WARR-007, FR-PDF-001

---

### FR-WARR-014: Send Claim Decision Notification Email

**Priority**: High  
**User Role**: System  
**Status**: Approved

**Description**: The system shall send an HTML-formatted email to the technician notifying them of the admin's decision (approved/rejected) with updated PDF.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → C. Warranty Claim Decision Email"

**Preconditions**:
- Admin has processed claim (FR-WARR-012)
- PDF has been regenerated with admin approval (FR-WARR-013)

**Main Flow**:
1. System retrieves claim data, decision, and technician email
2. System composes email using branded template:
   - **Subject**: "Warranty Claim [Approved/Rejected] - [Claim ID]"
   - **Recipients**: Technician (submitter)
   - **Content**:
     - Approval/rejection notification
     - Claim ID
     - Admin decision date
     - Admin notes/comments (if provided)
     - Next steps:
       - If approved: Information about parts shipment process
       - If rejected: Resubmission instructions and explanation
     - Link to view updated claim with admin signature
     - Link to download updated PDF with admin approval
3. System sends email via configured provider
4. System logs email event to audit trail
5. System implements retry logic (3 attempts)

**Exception Flows**:
- **EXC-014A**: Email send failure → Retry 3 times with exponential backoff
- **EXC-014B**: Email provider unavailable → Log error, queue for later retry

**Postconditions**:
- Decision email sent to technician
- Audit log entry created for email event

**Business Rules**:
- Email sent to technician who submitted claim
- Email template adapts based on approved/rejected status
- Email includes admin notes for transparency
- Email provides actionable next steps
- Email failure does not block claim processing

**Acceptance Criteria**:
- [x] Email sent immediately after admin processing
- [x] Email subject indicates approval or rejection
- [x] Email includes claim ID and admin decision date
- [x] Email includes admin notes (if provided)
- [x] Email provides appropriate next steps based on decision
- [x] Email includes link to view updated claim
- [x] Email includes link to download updated PDF
- [x] Email uses branded HTML template
- [x] Retry logic handles transient failures
- [x] Email failures logged but don't block processing

**Dependencies**: FR-WARR-013, FR-EMAIL-001, FR-AUDIT-001

---

### FR-WARR-015: Edit Own Warranty Claim (Before Processing)

**Priority**: Medium  
**User Role**: Technician (own, before admin processing), Administrator (all)  
**Status**: Approved

**Description**: The system shall allow users to edit warranty claims they own (Technician) or any claim (Administrator), with restrictions on editing after admin processing.

**Preconditions**:
- User is authenticated
- Claim exists in database
- User owns claim (Technician) OR user is Administrator
- Claim has not been processed by admin (Technician) OR user is Administrator (can edit processed claims)

**Main Flow**:
1. User clicks Edit button on claim detail page
2. System verifies user has permission to edit
3. System checks if claim has been processed:
   - If processed and user is Technician → Display "Cannot edit: claim has been processed by admin"
   - If processed and user is Administrator → Allow edit with warning
   - If not processed → Allow edit
4. System loads claim form with existing data pre-filled
5. User modifies claim details (same fields as FR-WARR-002, FR-WARR-003, FR-WARR-004)
6. User submits edited claim
7. System validates changes (FR-WARR-005)
8. System updates claim record in database
9. System updates updatedAt timestamp
10. System creates audit log entry (action: "WARRANTY_CLAIM_MODIFIED")
11. System regenerates PDF with updated data (FR-WARR-007)
12. System displays success message

**Exception Flows**:
- **EXC-015A**: User lacks permission → Display "Access Denied" error
- **EXC-015B**: Technician attempts to edit processed claim → Display "Cannot edit: claim has been processed by admin"
- **EXC-015C**: Claim not found → Display "Claim not found" error
- **EXC-015D**: Validation fails → Display validation errors

**Postconditions**:
- Claim record updated in database
- updatedAt timestamp reflects modification time
- Audit log entry created
- PDF regenerated with updated data

**Business Rules**:
- Technicians can only edit own claims before admin processing
- Administrators can edit any claim at any time
- All validation rules from FR-WARR-005 apply
- Editing does not change claim ID, createdAt, or status
- If admin-processed claim is edited by admin, adminStamp remains but PDF regenerated
- Serial numbers remain mandatory

**Acceptance Criteria**:
- [x] Edit form pre-fills with existing claim data
- [x] Authorization enforced (ownership or admin role)
- [x] Technicians blocked from editing processed claims
- [x] Administrators can edit processed claims with warning
- [x] Validation rules apply to edited data
- [x] Database record updated with changes
- [x] Audit log entry created
- [x] PDF regenerated automatically
- [x] Success message displayed after save

**Dependencies**: FR-WARR-005, FR-WARR-007, FR-AUTH-002, FR-AUDIT-001

---

### FR-WARR-016: Delete Warranty Claim (Admin Only)

**Priority**: Low  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to delete warranty claim records with confirmation and audit logging.

**Preconditions**:
- User is authenticated as Administrator
- Claim exists in database

**Main Flow**:
1. Administrator clicks Delete button on claim
2. System displays confirmation dialog: "Are you sure you want to delete this warranty claim? This action cannot be undone."
3. Administrator confirms deletion
4. System deletes claim record and associated items from database (CASCADE)
5. System creates audit log entry (action: "WARRANTY_CLAIM_DELETED", details include claim data)
6. System optionally archives PDF (configurable)
7. System displays success message: "Warranty claim deleted successfully"
8. System redirects to claim list

**Exception Flows**:
- **EXC-016A**: User is not admin → "Access Denied" error
- **EXC-016B**: Database deletion fails → Log error, display generic error message

**Postconditions**:
- Claim record removed from database
- Associated warranty items removed (cascade delete)
- Audit log entry created
- PDF optionally archived

**Business Rules**:
- Only Administrators can delete claims
- Deletion requires explicit confirmation
- Deletion is permanent (cannot be undone)
- Audit trail preserves record of deletion with claim details
- PDF may be archived rather than deleted (configurable for compliance)

**Acceptance Criteria**:
- [x] Delete button visible only to Administrators
- [x] Confirmation dialog displayed before deletion
- [x] Authorization enforced (Admin role required)
- [x] Database records deleted (claim + items cascade)
- [x] Audit log entry created with complete claim details
- [x] Success message displayed
- [x] User redirected to claim list

**Dependencies**: FR-AUTH-002, FR-AUDIT-001

---

