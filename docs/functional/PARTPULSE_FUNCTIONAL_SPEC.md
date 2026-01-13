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

## 5. Functional Requirements - Employee Management

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 3: Employee Invitation & Onboarding"

### FR-EMP-001: Invite New Employee

**Priority**: Critical  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to invite new technicians and administrators to the system by generating secure invitation tokens and sending invitation emails.

**Preconditions**:
- User is authenticated as Administrator

**Main Flow**:
1. Administrator navigates to Employees → Invite User
2. System displays invitation form
3. Administrator enters new user's email address
4. Administrator selects role: Technician or Administrator
5. Administrator optionally adds welcome message
6. System validates email address format
7. System checks if email already exists in system
8. System creates invitation record in database
9. System generates unique, cryptographically secure invitation token (UUID)
10. System sets token expiration to 7 days from now
11. System creates audit log entry (action: "USER_INVITATION_SENT")
12. System triggers FR-EMP-002 (Send Invitation Email)
13. System displays success message: "Invitation sent to [email]"

**Exception Flows**:
- **EXC-001A**: Invalid email format → Validation error "Please enter a valid email address"
- **EXC-001B**: Email already exists → Display "User with this email already exists"
- **EXC-001C**: Database failure → Log error, display generic error message
- **EXC-001D**: Token generation fails → Retry with new secure random

**Postconditions**:
- Invitation record created in database
- Invitation token generated and stored
- Expiration set to 7 days
- Audit log entry created
- Invitation email triggered

**Business Rules**:
- Only Administrators can invite users
- Email must be unique (not already in system)
- Token is cryptographically random (not guessable)
- Token expires after 7 days
- Token is single-use
- Welcome message is optional

**Acceptance Criteria**:
- [x] Invite User form accessible from Employees page
- [x] Email validation prevents invalid formats
- [x] Duplicate email detection prevents duplicate accounts
- [x] Role selection dropdown (Technician | Administrator)
- [x] Welcome message field (optional)
- [x] Invitation token is cryptographically secure (UUID)
- [x] Token expiration set to 7 days
- [x] Invitation record saved to database
- [x] Audit log entry created
- [x] Success message displayed
- [x] Invitation email sent (FR-EMP-002)

**Dependencies**: FR-AUTH-002, FR-AUDIT-001, FR-EMP-002

---

### FR-EMP-002: Send Invitation Email

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall send an HTML-formatted invitation email with secure link to new user invitees.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → D. User Invitation Email"

**Preconditions**:
- Invitation has been created (FR-EMP-001)
- Invitation token generated

**Main Flow**:
1. System retrieves invitation data (email, role, token, admin name, welcome message)
2. System composes email using branded template:
   - **Subject**: "You're invited to PartPulse"
   - **Recipients**: New user (invitee)
   - **Content**:
     - Welcome message from admin (if provided)
     - Invitation to join PartPulse
     - Role information (Technician or Administrator)
     - Secure invitation link with token: [APP_URL]/invite/accept/[token]
     - Expiration notice (7 days)
     - Instructions for completing registration
     - Contact information for support
3. System sends email via configured provider
4. System logs email event to audit trail
5. System implements retry logic (3 attempts)

**Exception Flows**:
- **EXC-002A**: Email send failure → Retry 3 times, mark invitation as pending email, queue for later
- **EXC-002B**: Email provider unavailable → Log error, queue for later retry

**Postconditions**:
- Invitation email sent to invitee
- Audit log entry created

**Business Rules**:
- Invitation link includes secure token
- Token embedded in URL (not separate)
- Email uses Trane branding
- Email failure does not block invitation creation (can be resent)

**Acceptance Criteria**:
- [x] Email sent immediately after invitation creation
- [x] Email subject is clear and branded
- [x] Email includes secure invitation link with token
- [x] Email includes role information
- [x] Email includes expiration notice (7 days)
- [x] Email includes registration instructions
- [x] Email uses branded HTML template
- [x] Retry logic handles transient failures

**Dependencies**: FR-EMP-001, FR-EMAIL-001, FR-AUDIT-001

---

### FR-EMP-003: Accept Invitation and Register

**Priority**: Critical  
**User Role**: New User (Invitee)  
**Status**: Approved

**Description**: The system shall allow invitees to accept invitations, complete registration, and activate their accounts.

**Preconditions**:
- Invitation has been sent (FR-EMP-002)
- User clicks invitation link

**Main Flow**:
1. User clicks invitation link with token in email
2. System extracts token from URL
3. System validates token:
   - Token exists in database
   - Token has not been used (accepted = false)
   - Token has not expired (< 7 days old)
4. If token valid, system redirects to registration page with token parameter
5. System displays registration form:
   - Email (read-only, from invitation)
   - Full Name (required)
   - Password (required)
   - Confirm Password (required)
   - Terms of Use acknowledgment checkbox (required)
6. User fills out registration form
7. User submits form
8. System validates inputs (FR-AUTH-003: Password Requirements)
9. System hashes password with bcrypt (10 salt rounds)
10. System creates User record with:
    - email (from invitation)
    - name (from form)
    - password (hashed)
    - role (from invitation)
11. System marks invitation as accepted
12. System creates audit log entry (action: "USER_ACCOUNT_ACTIVATED")
13. System creates session for user (auto-login)
14. System triggers FR-EMP-004 (Send Welcome Email)
15. System triggers FR-EMP-005 (Notify Admin of Activation)
16. System redirects user to dashboard with welcome message

**Exception Flows**:
- **EXC-003A**: Token invalid → Display "Invalid invitation link"
- **EXC-003B**: Token expired → Display "Invitation expired. Please contact admin for new invitation."
- **EXC-003C**: Token already used → Display "This invitation has already been used."
- **EXC-003D**: Password validation fails → Display validation errors
- **EXC-003E**: Database creation fails → Log error, display generic error

**Postconditions**:
- User account created in database
- Password securely hashed
- Invitation marked as accepted
- User session created (logged in)
- Audit log entry created
- Welcome email sent
- Admin notification sent

**Business Rules**:
- Tokens are single-use
- Tokens expire after 7 days
- Password must meet security requirements (16+ chars, 1 uppercase, 1 number, 1 special)
- Password hashed with bcrypt (10 salt rounds)
- User automatically logged in after registration
- Terms of Use must be acknowledged

**Acceptance Criteria**:
- [x] Invitation link leads to registration page
- [x] Token validation comprehensive (exists, not used, not expired)
- [x] Email pre-filled and read-only
- [x] Password requirements enforced (FR-AUTH-003)
- [x] Password confirmation validated (must match)
- [x] Terms of Use checkbox required
- [x] Password hashed with bcrypt (10 rounds)
- [x] User record created with correct role
- [x] Invitation marked as accepted
- [x] Audit log entry created
- [x] User auto-logged in after registration
- [x] Welcome email sent (FR-EMP-004)
- [x] Admin notification sent (FR-EMP-005)
- [x] User redirected to dashboard

**Dependencies**: FR-EMP-002, FR-AUTH-003, FR-AUDIT-001, FR-EMP-004, FR-EMP-005

---

### FR-EMP-004: Send Welcome Email (Post-Registration)

**Priority**: Medium  
**User Role**: System  
**Status**: Approved

**Description**: The system shall send a welcome email to new users after they complete registration.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → E. Welcome Email (Post-Registration)"

**Preconditions**:
- User has completed registration (FR-EMP-003)

**Main Flow**:
1. System retrieves new user data (name, email, role)
2. System composes email using branded template:
   - **Subject**: "Welcome to PartPulse"
   - **Recipients**: New user
   - **Content**:
     - Welcome message
     - Quick start guide
     - Links to key features (Submit Transfer, Submit Claim, View Reports)
     - Support contact information
     - Tips for getting started
3. System sends email via configured provider
4. System logs email event

**Exception Flows**:
- **EXC-004A**: Email send failure → Retry 3 times, log error but don't block registration

**Postconditions**:
- Welcome email sent to new user

**Business Rules**:
- Welcome email sent immediately after registration
- Email includes quick start guidance
- Email provides links to key features
- Email failure does not block registration completion

**Acceptance Criteria**:
- [x] Welcome email sent after registration
- [x] Email includes personalized greeting (user name)
- [x] Email includes quick start guide
- [x] Email includes links to key features
- [x] Email uses branded HTML template
- [x] Retry logic handles transient failures

**Dependencies**: FR-EMP-003, FR-EMAIL-001

---

### FR-EMP-005: Notify Admin of User Activation

**Priority**: Medium  
**User Role**: System  
**Status**: Approved

**Description**: The system shall notify the inviting administrator when a user accepts their invitation and activates their account.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → F. Admin Notification - New User Activated"

**Preconditions**:
- User has completed registration (FR-EMP-003)

**Main Flow**:
1. System retrieves user data and inviting admin email
2. System composes email using branded template:
   - **Subject**: "New User Activated - [User Name]"
   - **Recipients**: Admin who sent invitation
   - **Content**:
     - Notification that user activated account
     - User name and email
     - Assigned role
     - Account activation date
3. System sends email via configured provider
4. System logs email event

**Exception Flows**:
- **EXC-005A**: Email send failure → Retry 3 times, log error

**Postconditions**:
- Admin notification email sent

**Business Rules**:
- Email sent to admin who created invitation
- Email provides summary of new user account
- Email failure does not block registration

**Acceptance Criteria**:
- [x] Admin notification sent after user activation
- [x] Email includes user name and email
- [x] Email includes assigned role
- [x] Email includes activation date
- [x] Email uses branded HTML template

**Dependencies**: FR-EMP-003, FR-EMAIL-001

---

### FR-EMP-006: View Employee List

**Priority**: High  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall display a paginated list of all employees (users) with their roles and account status.

**Preconditions**:
- User is authenticated as Administrator

**Main Flow**:
1. Administrator navigates to Employees page
2. System displays employee list with columns:
   - Name
   - Email
   - Role (Administrator | Technician)
   - Account Status (Active | Invited | Inactive)
   - Created Date
   - Last Login
   - Actions (View, Edit, Deactivate, Reset Password)
3. System provides pagination (30 items per page)
4. System provides filters:
   - Role (All | Administrator | Technician)
   - Status (All | Active | Invited | Inactive)
   - Search by name or email
5. System provides "Invite User" button to trigger FR-EMP-001

**Business Rules**:
- Only Administrators can view employee list
- List shows all users regardless of status
- Invited users show "Invited" status until they accept
- Last Login shows most recent login timestamp
- Search is case-insensitive

**Acceptance Criteria**:
- [x] Employee list displays all users
- [x] Columns show comprehensive user information
- [x] Role filter works correctly
- [x] Status filter works correctly
- [x] Search filters by name or email (case-insensitive)
- [x] Pagination works correctly
- [x] "Invite User" button prominent and functional
- [x] Actions available for each employee

**Dependencies**: FR-AUTH-002, FR-EMP-001

---

### FR-EMP-007: Reset User Password (Admin)

**Priority**: Medium  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to reset a user's password, generating a temporary password.

**Source**: `APP_DESCRIPTION.md` - Section "Users & Roles → Role: Administrator" - Password reset capability

**Preconditions**:
- User is authenticated as Administrator
- Target user account exists

**Main Flow**:
1. Administrator clicks "Reset Password" on employee list or detail page
2. System displays confirmation dialog: "Generate temporary password for [User Name]?"
3. Administrator confirms
4. System generates random temporary password (16 characters, meets requirements)
5. System hashes temporary password with bcrypt
6. System updates user's password in database
7. System optionally sets "password reset required" flag (force change on next login)
8. System creates audit log entry (action: "PASSWORD_RESET")
9. System displays temporary password to administrator (copy-able)
10. System optionally emails temporary password to user (configurable)
11. Administrator communicates temporary password to user securely

**Exception Flows**:
- **EXC-007A**: User is not admin → "Access Denied" error
- **EXC-007B**: Target user not found → Display error
- **EXC-007C**: Database update fails → Log error, display generic error

**Postconditions**:
- User's password updated to temporary password
- Audit log entry created
- Temporary password displayed to admin

**Business Rules**:
- Only Administrators can reset passwords
- Temporary password meets all security requirements
- Temporary password is random and unique
- User should be forced to change password on next login (optional)
- Audit trail records password reset event

**Acceptance Criteria**:
- [x] Reset Password button visible only to Administrators
- [x] Confirmation dialog displayed
- [x] Temporary password generated (16+ chars, meets requirements)
- [x] Password hashed with bcrypt before storage
- [x] Database updated with new password
- [x] Audit log entry created
- [x] Temporary password displayed to admin (copyable)
- [x] Success message displayed

**Dependencies**: FR-AUTH-002, FR-AUTH-003, FR-AUDIT-001

---

### FR-EMP-008: Deactivate User Account

**Priority**: Medium  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall allow administrators to deactivate user accounts, preventing login while preserving historical data.

**Preconditions**:
- User is authenticated as Administrator
- Target user account exists and is active

**Main Flow**:
1. Administrator clicks "Deactivate" on employee list
2. System displays confirmation dialog: "Deactivate [User Name]? This will prevent login but preserve all historical data."
3. Administrator confirms
4. System updates user record (sets active = false or similar flag)
5. System invalidates any active sessions for target user
6. System creates audit log entry (action: "USER_DEACTIVATED")
7. System displays success message: "User deactivated successfully"

**Exception Flows**:
- **EXC-008A**: User is not admin → "Access Denied" error
- **EXC-008B**: Target user is self → Display "Cannot deactivate your own account"
- **EXC-008C**: Target user not found → Display error

**Postconditions**:
- User account marked as inactive
- User cannot log in
- Historical data (transfers, claims) preserved
- Audit log entry created

**Business Rules**:
- Only Administrators can deactivate accounts
- Administrators cannot deactivate their own account
- Deactivation is soft delete (preserves data)
- Historical records remain visible but attributed to deactivated user
- Deactivated users can be reactivated by admin

**Acceptance Criteria**:
- [x] Deactivate button visible only to Administrators
- [x] Confirmation dialog displayed
- [x] User record updated (inactive status)
- [x] User sessions invalidated
- [x] Audit log entry created
- [x] Success message displayed
- [x] Deactivated user cannot log in
- [x] Historical data preserved and visible

**Dependencies**: FR-AUTH-002, FR-AUDIT-001

---

## 6. Functional Requirements - Reports & Analytics

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 4: Report Generation & Export"

### FR-REPORT-001: Display Reports Dashboard

**Priority**: High  
**User Role**: Technician (own data), Administrator (all data)  
**Status**: Approved

**Description**: The system shall provide a reports dashboard with summary metrics and access to detailed reports.

**Preconditions**:
- User is authenticated

**Main Flow**:
1. User navigates to Reports page
2. System displays dashboard with summary metrics cards:
   - Total Transfers (current month) - filtered by role
   - Total Warranty Claims (current month) - filtered by role
   - Approval Rate (for claims) - filtered by role
   - Average Processing Time (for claims) - filtered by role
3. System displays quick filters:
   - Date Range Picker (Start Date, End Date)
   - Status Filter (All, Pending, Approved, Rejected, etc.)
   - Technician Filter (Admin only - dropdown of all technicians)
4. System provides navigation to detailed report sections:
   - Internal Transfers Report
   - Warranty Claims Report
   - User Activity Report (Admin only)
   - System Audit Report (Admin only)

**Business Rules**:
- Technicians see only own data in metrics
- Administrators see all data in metrics
- Metrics calculate from filtered data
- Date range defaults to current month

**Acceptance Criteria**:
- [x] Reports dashboard accessible from main navigation
- [x] Summary metrics cards display accurate data
- [x] Role-based filtering enforced (Technician sees only own data)
- [x] Quick filters update metrics dynamically
- [x] Technician filter visible only to Admins
- [x] Navigation links to detailed reports functional
- [x] Mobile-responsive dashboard layout

**Dependencies**: FR-AUTH-002

---

### FR-REPORT-002: Generate Internal Transfers Report

**Priority**: High  
**User Role**: Technician (own), Administrator (all)  
**Status**: Approved

**Description**: The system shall generate detailed reports of internal transfers with filtering, sorting, and export capabilities.

**Preconditions**:
- User is authenticated
- User navigates to Internal Transfers Report

**Main Flow**:
1. System displays transfer report table with columns:
   - Transfer ID
   - Date
   - Technician
   - Site Name
   - Items Count
   - Status (if applicable)
   - Actions (View, Download PDF)
2. System applies role-based filtering:
   - Technician: Only own transfers
   - Administrator: All transfers
3. System provides filters:
   - Date Range (Start Date to End Date)
   - Technician (Admin only - dropdown)
   - Status (if applicable)
   - Sort: By Date (asc/desc), Technician name (asc/desc)
4. System provides pagination (30 items per page)
5. System provides export options:
   - Export to PDF button
   - Export to CSV button

**Business Rules**:
- Technicians can only view/export own transfers
- Administrators can view/export all transfers
- Exports include only filtered/visible data
- CSV format suitable for Excel analysis
- PDF format provides formatted report

**Acceptance Criteria**:
- [x] Report table displays transfers based on role
- [x] Filters work correctly
- [x] Sort functionality works correctly
- [x] Pagination works correctly
- [x] Export to PDF generates formatted report
- [x] Export to CSV generates downloadable file
- [x] Role-based filtering enforced

**Dependencies**: FR-AUTH-002, FR-DIST-005

---

### FR-REPORT-003: Generate Warranty Claims Report

**Priority**: High  
**User Role**: Technician (own), Administrator (all)  
**Status**: Approved

**Description**: The system shall generate detailed reports of warranty claims with metrics, filtering, sorting, and export capabilities.

**Preconditions**:
- User is authenticated
- User navigates to Warranty Claims Report

**Main Flow**:
1. System displays metrics section:
   - Total Claims (filtered)
   - Approval Rate: (Approved / Total) × 100%
   - Rejection Rate: (Rejected / Total) × 100%
   - Average Resolution Time: Average days from submission to resolution
2. System displays claim report table with columns:
   - Claim ID
   - Date Submitted
   - Technician
   - Chiller Model/Serial
   - Parts Count
   - Status (Submitted, Approved, Rejected, Resolved)
   - Actions (View, Download PDF)
3. System applies role-based filtering:
   - Technician: Only own claims
   - Administrator: All claims
4. System provides filters:
   - Date Range (Start Date to End Date)
   - Technician (Admin only - dropdown)
   - Status (Submitted, Approved, Rejected, Resolved - multi-select)
   - Sort: By Date (asc/desc), Status, Technician name
5. System provides pagination (30 items per page)
6. System provides export options:
   - Export to PDF button (includes metrics)
   - Export to CSV button (raw data)

**Business Rules**:
- Technicians can only view/export own claims
- Administrators can view/export all claims
- Metrics calculate from filtered data only
- Approval/Rejection rates shown as percentages
- Average resolution time calculated from submission to "Resolved" status

**Acceptance Criteria**:
- [x] Metrics display accurate calculations
- [x] Report table displays claims based on role
- [x] Filters work correctly (including multi-select status)
- [x] Sort functionality works correctly
- [x] Pagination works correctly
- [x] Export to PDF includes metrics and table
- [x] Export to CSV generates downloadable file
- [x] Role-based filtering enforced

**Dependencies**: FR-AUTH-002, FR-WARR-006

---

### FR-REPORT-004: Generate User Activity Report (Admin Only)

**Priority**: Medium  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall generate reports on user activity including login history and submission counts.

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 4: Report Generation & Export → User Activity Reports (Admin only)"

**Preconditions**:
- User is authenticated as Administrator
- User navigates to User Activity Report

**Main Flow**:
1. System displays user activity table with columns:
   - User Name
   - Role
   - Last Login
   - Total Transfers Submitted (in date range)
   - Total Claims Submitted (in date range)
   - Account Status (Active/Inactive)
2. System provides filters:
   - Role: Admin, Technician, All
   - Status: Active, Inactive, All
   - Date Range: For activity period
3. System calculates counts based on filtered date range
4. System provides sort options
5. System provides Export to CSV option

**Exception Flows**:
- **EXC-004A**: Non-admin access → "Access Denied" error

**Business Rules**:
- Only Administrators can access user activity reports
- Activity counts filtered by date range
- Last Login shows most recent login timestamp
- Inactive users included in report

**Acceptance Criteria**:
- [x] Report accessible only to Administrators
- [x] Table displays all users with activity metrics
- [x] Filters work correctly
- [x] Activity counts accurate for date range
- [x] Sort functionality works correctly
- [x] Export to CSV generates downloadable file

**Dependencies**: FR-AUTH-002, FR-AUDIT-001

---

### FR-REPORT-005: Generate System Audit Report (Admin Only)

**Priority**: Medium  
**User Role**: Administrator  
**Status**: Approved

**Description**: The system shall generate comprehensive audit trail reports for compliance and forensic analysis.

**Source**: `APP_DESCRIPTION.md` - Section "Workflow 4: Report Generation & Export → System Audit Report (Admin only)"

**Preconditions**:
- User is authenticated as Administrator
- User navigates to System Audit Report

**Main Flow**:
1. System displays audit log table with columns:
   - Timestamp
   - User
   - Event Type
   - Action
   - Details
   - IP Address
   - Success/Failure
2. System provides comprehensive filters:
   - Date Range: Start Date to End Date
   - Event Type: Submission, PDF Generation, Admin Approval, Auth Event, User Management
   - User: Dropdown of all users
   - Success Status: Success, Failure, All
   - Text Search: Search action and details fields (full-text)
3. System provides pagination
4. System provides Export to CSV option

**Exception Flows**:
- **EXC-005A**: Non-admin access → "Access Denied" error

**Business Rules**:
- Only Administrators can access audit reports
- Audit logs are immutable (cannot be modified or deleted)
- Full-text search across action and details fields
- Export includes all filtered records (not just current page)

**Acceptance Criteria**:
- [x] Report accessible only to Administrators
- [x] Table displays complete audit log entries
- [x] All filters work correctly
- [x] Text search finds relevant entries
- [x] Pagination works correctly
- [x] Export to CSV generates complete audit trail
- [x] Export suitable for compliance reporting

**Dependencies**: FR-AUTH-002, FR-AUDIT-001

---

## 7. Functional Requirements - Authentication & Authorization

**Source**: `APP_DESCRIPTION.md` - Sections "Users & Roles", "Security Expectations"

### FR-AUTH-001: User Authentication (Login)

**Priority**: Critical  
**User Role**: All Users  
**Status**: Approved

**Description**: The system shall authenticate users via email and password using NextAuth.js with JWT sessions.

**Source**: `APP_DESCRIPTION.md` - Section "Authentication & Session Management"

**Preconditions**:
- User has active account
- User navigates to login page

**Main Flow**:
1. User enters email address
2. User enters password
3. User clicks "Sign In" button
4. System validates inputs (email format, password not empty)
5. System queries database for user with matching email
6. System compares provided password with hashed password using bcrypt
7. If match, system creates JWT session:
   - Token includes: userId, email, role
   - Token signed and encrypted
   - Token duration: 8 hours
8. System sets httpOnly, secure, sameSite=strict cookie
9. System creates audit log entry (action: "USER_LOGIN", success: true)
10. System redirects user to dashboard

**Exception Flows**:
- **EXC-001A**: Email not found → Display "Invalid email or password" (generic message)
- **EXC-001B**: Password incorrect → Increment failed login counter, display "Invalid email or password"
- **EXC-001C**: Account locked (5+ failed attempts) → Display "Account locked. Try again in 15 minutes."
- **EXC-001D**: Account inactive → Display "Account deactivated. Contact administrator."
- **EXC-001E**: Database error → Log error, display generic error message

**Postconditions**:
- User authenticated
- Session created (JWT token in httpOnly cookie)
- Audit log entry created
- User redirected to dashboard

**Business Rules**:
- Email comparison is case-insensitive
- Password comparison uses bcrypt
- Generic error messages prevent user enumeration
- Failed login counter increments on each failure
- Account locks after 5 failed attempts for 15 minutes
- Audit log records both successful and failed login attempts

**Acceptance Criteria**:
- [x] Login form validates email format
- [x] Password field masked (type="password")
- [x] Authentication uses bcrypt for password comparison
- [x] JWT session created on successful login
- [x] Session cookie is httpOnly, secure (production), sameSite=strict
- [x] Session duration 8 hours
- [x] Generic error messages (no user enumeration)
- [x] Account lockout after 5 failed attempts
- [x] Lockout duration 15 minutes
- [x] Audit log entry created for login attempt
- [x] User redirected to dashboard after successful login

**Dependencies**: FR-SEC-001 (Password Hashing), FR-AUDIT-001

---

### FR-AUTH-002: Role-Based Authorization

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall enforce role-based access control (RBAC) on all routes and API endpoints, ensuring users can only access resources they are authorized for.

**Source**: `APP_DESCRIPTION.md` - Section "Users & Roles", "Security Expectations → Authorization Security"

**Preconditions**:
- User is authenticated (has valid session)

**Main Flow**:
1. User attempts to access protected route or API endpoint
2. System extracts JWT from session cookie
3. System validates JWT signature and expiration
4. System extracts user role from JWT
5. System checks if route/endpoint requires specific role
6. System checks if user role matches requirement:
   - **Administrator**: Full access to all routes and resources
   - **Technician**: Limited access (cannot access admin-only routes, user management, audit logs, etc.)
7. If authorized, system allows access
8. System additionally checks resource ownership for data modification:
   - Technicians can only modify own transfers/claims
   - Administrators can modify any transfers/claims

**Exception Flows**:
- **EXC-002A**: No session → Redirect to login page
- **EXC-002B**: JWT invalid/expired → Clear session, redirect to login
- **EXC-002C**: Insufficient role → Display "Access Denied" error (403)
- **EXC-002D**: Insufficient ownership → Display "Access Denied" error (403)

**Postconditions**:
- Access granted or denied based on role
- Audit log entry created for denied access attempts

**Business Rules**:
- All routes except login/public are protected
- Authorization enforced server-side (never trust client)
- Role-based access: Administrator has full access, Technician has limited access
- Resource ownership enforced: Technicians can only modify own resources
- Client-side UI elements hidden based on role (UX only, not security boundary)
- Authorization failures logged to audit trail

**Acceptance Criteria**:
- [x] All protected routes require valid session
- [x] Role validation performed server-side on every request
- [x] Administrator role grants full access
- [x] Technician role enforces access restrictions
- [x] Resource ownership validated for modification operations
- [x] Unauthorized access attempts return 403 error
- [x] Unauthorized access attempts logged to audit trail
- [x] Client-side UI adapts to user role (hide admin-only features from technicians)

**Dependencies**: FR-AUTH-001, FR-AUDIT-001

---

### FR-AUTH-003: Password Requirements Enforcement

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall enforce strong password requirements for all user accounts to meet security standards.

**Source**: `APP_DESCRIPTION.md` - Section "Authentication & Session Management" + "Security Expectations → Authentication Security"

**Preconditions**:
- User is creating or changing password (registration, password reset, password change)

**Main Flow**:
1. User enters password in form
2. System validates password against requirements:
   - Minimum 16 characters
   - At least 1 uppercase letter (A-Z)
   - At least 1 number (0-9)
   - At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
3. System displays real-time validation feedback:
   - Green checkmarks for met requirements
   - Red X for unmet requirements
4. If password meets all requirements, system enables submit button
5. On submit, system re-validates server-side (never trust client)
6. If valid, system hashes password with bcrypt (10 salt rounds) and proceeds
7. If invalid, system returns validation error

**Exception Flows**:
- **EXC-003A**: Password too short → "Password must be at least 16 characters"
- **EXC-003B**: Missing uppercase → "Password must include at least one uppercase letter"
- **EXC-003C**: Missing number → "Password must include at least one number"
- **EXC-003D**: Missing special char → "Password must include at least one special character"

**Postconditions**:
- Password meets security requirements
- Password hashed with bcrypt before storage

**Business Rules**:
- Password requirements:
  - Minimum 16 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- Client-side validation provides immediate feedback
- Server-side validation is authoritative
- Passwords hashed with bcrypt (10 salt rounds)
- Passwords never stored in plain text
- Passwords never logged or displayed

**Acceptance Criteria**:
- [x] Password field shows real-time validation feedback
- [x] All requirements enforced (length, uppercase, number, special char)
- [x] Client-side validation prevents invalid submissions
- [x] Server-side validation re-validates password
- [x] Password hashed with bcrypt (10 rounds) before storage
- [x] Plain text password never stored
- [x] Clear error messages for unmet requirements

**Dependencies**: FR-SEC-001 (Password Hashing)

---

### FR-AUTH-004: User Logout

**Priority**: High  
**User Role**: All Users  
**Status**: Approved

**Description**: The system shall allow users to securely log out, immediately invalidating their session.

**Preconditions**:
- User is authenticated

**Main Flow**:
1. User clicks "Logout" button
2. System destroys JWT session
3. System clears session cookie
4. System creates audit log entry (action: "USER_LOGOUT")
5. System redirects user to login page with confirmation message

**Postconditions**:
- Session invalidated
- Session cookie cleared
- Audit log entry created
- User redirected to login page

**Business Rules**:
- Logout is immediate (no confirmation required)
- Session completely destroyed
- User must re-authenticate to access system

**Acceptance Criteria**:
- [x] Logout button accessible from all pages (in header/navigation)
- [x] Session destroyed on logout
- [x] Session cookie cleared
- [x] Audit log entry created
- [x] User redirected to login page
- [x] Confirmation message displayed

**Dependencies**: FR-AUTH-001, FR-AUDIT-001

---

### FR-AUTH-005: Session Timeout

**Priority**: High  
**User Role**: System  
**Status**: Approved

**Description**: The system shall automatically expire user sessions after 8 hours of inactivity, requiring re-authentication.

**Source**: `APP_DESCRIPTION.md` - Section "Authentication & Session Management"

**Preconditions**:
- User is authenticated

**Main Flow**:
1. System sets session expiration to 8 hours from login/last refresh
2. On each authenticated request, system checks JWT expiration
3. If JWT not expired and < 1 hour remaining, system optionally refreshes token
4. If JWT expired, system clears session and redirects to login
5. System displays "Session expired. Please log in again." message

**Exception Flows**:
- **EXC-005A**: Session expired → Clear session, redirect to login with message

**Postconditions**:
- Session expired and cleared
- User redirected to login page

**Business Rules**:
- Session duration: 8 hours
- Session expiration tracked in JWT
- Expired sessions automatically cleared
- User must re-authenticate after expiration
- Optionally refresh token if < 1 hour remaining and user active

**Acceptance Criteria**:
- [x] JWT expiration set to 8 hours
- [x] System checks JWT expiration on each request
- [x] Expired sessions automatically cleared
- [x] User redirected to login with expiration message
- [x] Optional token refresh if < 1 hour remaining

**Dependencies**: FR-AUTH-001

---

## 8. Functional Requirements - Security & Data Protection

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations"

### FR-SEC-001: Password Hashing

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall securely hash all passwords using bcrypt with 10 salt rounds before storing in database.

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Authentication Security"

**Preconditions**:
- Password has been validated (FR-AUTH-003)

**Main Flow**:
1. System receives plain text password (registration, password reset, password change)
2. System generates bcrypt hash with 10 salt rounds
3. System stores ONLY hashed password in database
4. System immediately discards plain text password from memory

**Business Rules**:
- Algorithm: bcrypt
- Salt rounds: 10
- Plain text passwords NEVER stored
- Plain text passwords NEVER logged
- Hash stored in password field (nullable for OAuth users)

**Acceptance Criteria**:
- [x] bcrypt used for password hashing
- [x] Salt rounds set to 10
- [x] Only hashed passwords stored in database
- [x] Plain text passwords never persisted
- [x] Plain text passwords never logged

**Dependencies**: None (foundational)

---

### FR-SEC-002: Input Sanitization (XSS Protection)

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall sanitize all user inputs to prevent Cross-Site Scripting (XSS) attacks.

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Data Security"

**Preconditions**:
- User submits form or API request with text input

**Main Flow**:
1. System receives user input (text fields, text areas, etc.)
2. System applies HTML entity encoding to all string inputs:
   - `<` → `&lt;`
   - `>` → `&gt;`
   - `&` → `&amp;`
   - `"` → `&quot;`
   - `'` → `&#x27;`
3. System sanitizes input before storing in database
4. React automatically escapes output when rendering

**Business Rules**:
- All user text inputs sanitized
- HTML entity encoding applied
- React escaping used for output
- Never use `dangerouslySetInnerHTML` without sanitization
- Content Security Policy (CSP) headers restrict script sources

**Acceptance Criteria**:
- [x] All string inputs sanitized before database storage
- [x] HTML entity encoding applied
- [x] React automatic escaping used for output
- [x] CSP headers configured
- [x] No use of `dangerouslySetInnerHTML` without sanitization

**Dependencies**: None (foundational)

---

### FR-SEC-003: SQL Injection Protection

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall prevent SQL injection attacks by using Prisma ORM's parameterized queries exclusively.

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Data Security"

**Preconditions**:
- System performs database operation

**Main Flow**:
1. System constructs database query using Prisma ORM
2. Prisma automatically parameterizes all user inputs
3. User inputs never concatenated into SQL strings
4. Prisma generates safe, parameterized queries

**Business Rules**:
- All database operations use Prisma ORM
- No raw SQL queries (or sanitized if absolutely necessary)
- User inputs validated before database operations
- Prisma type-safe query builder prevents SQL injection

**Acceptance Criteria**:
- [x] All database operations use Prisma ORM
- [x] No raw SQL query strings with user input
- [x] Inputs validated before database operations
- [x] Prisma parameterization prevents SQL injection

**Dependencies**: None (foundational)

---

### FR-SEC-004: HTTPS Enforcement (Production)

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall enforce HTTPS for all connections in production, ensuring encrypted data transmission.

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Network Security"

**Preconditions**:
- Application deployed to production

**Main Flow**:
1. Production environment configured with HTTPS
2. System sets Strict-Transport-Security header (HSTS)
3. HTTP requests automatically redirected to HTTPS
4. Cookies marked as Secure (HTTPS only)
5. All external resources loaded via HTTPS

**Business Rules**:
- Production: HTTPS required for all connections
- Development: HTTP allowed (local development)
- HSTS header enforces HTTPS
- Cookies Secure attribute in production
- HTTP → HTTPS redirection

**Acceptance Criteria**:
- [x] HTTPS enforced in production
- [x] HSTS header set
- [x] HTTP requests redirected to HTTPS
- [x] Cookies marked Secure in production
- [x] External resources loaded via HTTPS

**Dependencies**: None (infrastructure)

---

### FR-SEC-005: Security Headers

**Priority**: High  
**User Role**: System  
**Status**: Approved

**Description**: The system shall set comprehensive security headers to protect against common web vulnerabilities.

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Network Security"

**Preconditions**:
- Application responds to HTTP request

**Main Flow**:
1. System sets security headers on all responses:
   - **X-Frame-Options**: DENY or SAMEORIGIN (prevents clickjacking)
   - **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
   - **X-XSS-Protection**: 1; mode=block (browser XSS filter)
   - **Content-Security-Policy**: Restricts resource loading
   - **Referrer-Policy**: Controls referrer information leakage
   - **Strict-Transport-Security**: Enforces HTTPS (production)

**Business Rules**:
- Headers set via Next.js middleware
- CSP policy restricts inline scripts and external resources
- Headers applied to all routes

**Acceptance Criteria**:
- [x] All security headers set correctly
- [x] X-Frame-Options prevents clickjacking
- [x] X-Content-Type-Options prevents MIME sniffing
- [x] CSP restricts resource loading
- [x] Referrer-Policy prevents information leakage
- [x] HSTS enforces HTTPS in production

**Dependencies**: None (infrastructure)

---

### FR-SEC-006: Rate Limiting

**Priority**: Medium  
**User Role**: System  
**Status**: Approved

**Description**: The system shall implement rate limiting on API routes to prevent brute force and DoS attacks.

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Network Security"

**Preconditions**:
- User makes API request

**Main Flow**:
1. System tracks requests by IP address
2. System checks if IP has exceeded rate limit
3. If within limit, process request normally
4. If exceeded, return HTTP 429 Too Many Requests
5. System logs rate limit violations

**Business Rules**:
- Rate limits configurable per endpoint
- Default: 100 requests per 15 minutes
- Tracking by IP address
- Rate limit violations logged
- 429 response includes Retry-After header

**Acceptance Criteria**:
- [x] Rate limiting implemented on API routes
- [x] Requests tracked by IP address
- [x] 429 response when limit exceeded
- [x] Retry-After header included in 429 response
- [x] Rate limit violations logged

**Dependencies**: FR-AUDIT-001

---

## 9. Functional Requirements - PDF Generation

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts" - PDFs

### FR-PDF-001: PDF Generation Engine

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall provide a custom PDF generation engine capable of creating professional, Trane-branded PDF documents for transfers and warranty claims.

**Preconditions**:
- Transfer or warranty claim data available

**Main Flow**:
1. System receives PDF generation request (transfer or warranty claim)
2. System retrieves data from database
3. System selects appropriate template (Transfer or Warranty Claim)
4. System populates template with data
5. System applies Trane brand specifications (logos, colors, fonts)
6. System generates PDF binary
7. System saves PDF to configured storage (local or S3)
8. System returns PDF path/URL

**Business Rules**:
- PDF format: A4 size
- Professional, print-ready quality
- Trane branding applied consistently
- Storage configurable via STORAGE_PROVIDER env variable
- PDFs accessible via secure download links

**Acceptance Criteria**:
- [x] PDF generation engine supports templates
- [x] Trane branding applied (logos, colors, fonts)
- [x] PDFs are A4 size and print-ready
- [x] PDFs saved to configured storage
- [x] PDF paths/URLs returned for database linkage

**Dependencies**: FR-DIST-006, FR-WARR-007, FR-WARR-013

---

## 10. Functional Requirements - Email Notifications

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications"

### FR-EMAIL-001: Email Template System

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall provide a branded HTML email template system for all notification emails.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → Email Template System"

**Preconditions**:
- Email notification triggered

**Main Flow**:
1. System uses branded template with:
   - Company logo header
   - Primary content area with branded colors
   - Call-to-action buttons (Trane red #FF2B00)
   - Footer with system information
2. System provides helper functions:
   - `createEmailTemplate()`: Branded HTML email wrapper
   - `createInfoRow()`: Key-value information display
   - `createButton()`: Branded CTA button
   - `createTable()`: Data table formatting
   - `createStatusBadge()`: Status indicators
   - `createInfoBox()`: Highlighted information boxes

**Business Rules**:
- All emails use branded templates
- Trane red (#FF2B00) for CTAs
- Responsive design (mobile-friendly)
- Plain text fallback for non-HTML clients

**Acceptance Criteria**:
- [x] Email templates use Trane branding
- [x] Helper functions available for template construction
- [x] Emails are mobile-responsive
- [x] Plain text fallback provided
- [x] CTA buttons use Trane red

**Dependencies**: FR-DIST-007, FR-WARR-008, FR-WARR-014, FR-EMP-002, FR-EMP-004, FR-EMP-005

---

### FR-EMAIL-002: Email Sending Service

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall send emails via configured email provider (Resend, SendGrid, or AWS SES compatible) with retry logic and failure handling.

**Source**: `APP_DESCRIPTION.md` - Section "Output Artifacts → 3. Email Notifications → Email Service Configuration"

**Preconditions**:
- Email notification triggered
- Email provider configured

**Main Flow**:
1. System composes email using template system
2. System sends email via configured provider
3. System implements retry logic: 3 attempts with exponential backoff
4. On success, system logs email event to audit trail
5. On failure after retries, system logs error

**Exception Flows**:
- **EXC-002A**: Transient failure → Retry with exponential backoff
- **EXC-002B**: Permanent failure → Log error, do not retry

**Postconditions**:
- Email sent or queued for retry
- Email event logged to audit trail

**Business Rules**:
- Provider: Resend, SendGrid, or AWS SES compatible
- From address configurable via EMAIL_DOMAIN env variable
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- Failures logged to system log
- Simple in-memory queue (MVP), scalable to Redis/SQS (production)

**Acceptance Criteria**:
- [x] Email provider configurable
- [x] Retry logic implemented (3 attempts)
- [x] Email events logged to audit trail
- [x] Email failures logged but don't block operations
- [x] From address configurable

**Dependencies**: FR-EMAIL-001, FR-AUDIT-001

---

## 11. Functional Requirements - Audit Logging

**Source**: `APP_DESCRIPTION.md` - Section "Auditability Expectations"

### FR-AUDIT-001: Comprehensive Audit Logging

**Priority**: Critical  
**User Role**: System  
**Status**: Approved

**Description**: The system shall create immutable audit log entries for all state-changing operations, authentication events, and security-relevant actions to support regulatory compliance and forensic analysis.

**Preconditions**:
- State-changing operation or security event occurs

**Main Flow**:
1. System creates audit log entry with:
   - **timestamp**: Exact date and time (ISO 8601)
   - **eventType**: Category (submission, pdf_generation, admin_approval, auth_event, user_management)
   - **userId**: ID of user who performed action (if applicable)
   - **userName**: Name of user for readability
   - **action**: Specific action taken (e.g., "WARRANTY_CLAIM_APPROVED")
   - **details**: JSON string with additional context
   - **ipAddress**: Source IP of request
   - **userAgent**: Browser/device information
   - **success**: Whether action succeeded (true/false)
   - **errorMessage**: Error details if failed
2. System inserts audit log entry into SystemLog table (append-only)
3. System does NOT allow modification or deletion of audit logs

**Logged Events** (per APP_DESCRIPTION.md):
- **Authentication Events**: Login (success/failure), logout, session timeout, password reset, account lockout
- **User Management Events**: User creation, activation, modification, deactivation, password resets
- **Internal Transfer Events**: Submission, modification, deletion, PDF generation, admin approval
- **Warranty Claim Events**: Submission, modification, review, approval/rejection, resolution, PDF generation/regeneration
- **Email Events**: Email sent (type and recipient), email failure (with error)
- **System Events**: Settings changes, system errors, security events

**Business Rules**:
- All state-changing operations logged
- Audit logs are immutable (append-only, no updates/deletes)
- Every action attributed to a user (or system)
- Timestamps prevent repudiation
- Minimum 7 years retention (configurable)
- Admins can search and export audit logs
- Audit logs support compliance (ISO 9001, ISO 27001, SOC 2, GDPR)

**Acceptance Criteria**:
- [x] Audit log entry created for all state-changing operations
- [x] All required fields populated
- [x] Audit logs immutable (no updates or deletes)
- [x] All listed event types logged
- [x] Audit logs stored in SystemLog table
- [x] Audit logs retained for 7+ years
- [x] Admins can view and export audit logs (FR-REPORT-005)

**Dependencies**: None (foundational)

---

### FR-AUDIT-002: Audit Log Retention

**Priority**: High  
**User Role**: System  
**Status**: Approved

**Description**: The system shall retain audit logs for a minimum of 7 years to meet compliance requirements.

**Source**: `APP_DESCRIPTION.md` - Section "Auditability Expectations → Retention Policy"

**Preconditions**:
- Audit logs exist in database

**Main Flow**:
1. System stores audit logs in SystemLog table
2. System never automatically deletes audit logs
3. Audit logs included in database backups
4. Admins can export audit logs at any time

**Business Rules**:
- Minimum retention: 7 years (configurable)
- Storage: Database (SystemLog table)
- Backup: Included in database backups
- Export: Admins can export logs at any time
- Immutability: Logs are append-only; no updates or deletes

**Acceptance Criteria**:
- [x] Audit logs never automatically deleted
- [x] Retention period configurable (default 7 years)
- [x] Audit logs included in database backups
- [x] Audit logs exportable by admins

**Dependencies**: FR-AUDIT-001, FR-REPORT-005

---

## 12. Cross-Cutting Non-Functional Requirements

**Source**: `APP_DESCRIPTION.md` - Sections "Technical Architecture Summary", "Performance Targets", "Mobile-First Design"

### 12.1 Performance Requirements

**Source**: `APP_DESCRIPTION.md` - Section "Technical Architecture Summary → Performance Targets"

| Metric | Target | Threshold | Requirement ID |
|--------|--------|-----------|----------------|
| Average Response Time | < 200ms | > 500ms | NFR-PERF-001 |
| 95th Percentile Response Time | < 500ms | > 1000ms | NFR-PERF-002 |
| First Contentful Paint (FCP) | < 1.5s | > 2.5s | NFR-PERF-003 |
| Largest Contentful Paint (LCP) | < 2.5s | > 4.0s | NFR-PERF-004 |
| Time to Interactive (TTI) | < 3.0s | > 5.0s | NFR-PERF-005 |
| Bundle Size (JS) | < 200KB gzipped | > 300KB | NFR-PERF-006 |
| Bundle Size (CSS) | < 50KB gzipped | > 100KB | NFR-PERF-007 |

**Acceptance Criteria**:
- [x] All performance targets met in production
- [x] Performance monitoring in place
- [x] Core Web Vitals tracked (FCP, LCP, TTI)
- [x] Bundle size optimized and monitored

---

### 12.2 Mobile-First Design Requirements

**Source**: `APP_DESCRIPTION.md` - Section "Mobile-First Design"

**NFR-MOBILE-001: Responsive Breakpoints**

The system shall implement responsive design with the following breakpoints:
- **Mobile**: < 768px (primary focus)
- **Tablet**: 768px - 1023px
- **Desktop**: >= 1024px

**NFR-MOBILE-002: Touch-Optimized UI**

The system shall provide touch-optimized user interface:
- Large touch targets (minimum 44px × 44px)
- Swipe gestures for navigation (where applicable)
- No hover-dependent functionality
- Touch-friendly form inputs

**NFR-MOBILE-003: Mobile Forms**

The system shall optimize forms for mobile:
- Large input fields (easy to tap)
- Mobile-optimized keyboards (type="email", type="tel", etc.)
- Minimal text input required
- Auto-complete and suggestions
- Camera integration for photo uploads (future)

**NFR-MOBILE-004: Mobile Navigation**

The system shall provide mobile-friendly navigation:
- Collapsible sidebar on mobile
- Swipe to open/close menu (optional)
- Breadcrumbs for deep navigation

**NFR-MOBILE-005: Performance on Mobile**

The system shall perform well on mobile networks:
- Fast initial load (< 3 seconds on 3G)
- Lazy loading of images and components
- Optimized bundle size
- Progressive Web App (PWA) ready (future)

**Acceptance Criteria**:
- [x] Responsive design implemented for all pages
- [x] Touch targets meet minimum size (44px × 44px)
- [x] Mobile forms optimized (large fields, appropriate keyboards)
- [x] Navigation works well on mobile (collapsible, accessible)
- [x] Initial load < 3 seconds on 3G
- [x] Images and components lazy-loaded

---

### 12.3 Security & Compliance Requirements

**Source**: `APP_DESCRIPTION.md` - Section "Security Expectations → Compliance & Standards"

**NFR-SEC-001: ISO 27001 Compliance**

The system shall implement controls supporting ISO 27001 (Information Security Management):
- Comprehensive audit logging
- Access control and authentication
- Data protection and encryption
- Security monitoring

**NFR-SEC-002: SOC 2 Type II Compliance**

The system shall implement controls supporting SOC 2 Type II:
- Security: Authentication, authorization, audit logging
- Availability: Monitoring, backup, recovery
- Confidentiality: Data encryption, access control

**NFR-SEC-003: OWASP Top 10 Protection**

The system shall protect against OWASP Top 10 vulnerabilities:
- Injection attacks (SQL, XSS)
- Broken authentication
- Sensitive data exposure
- XML external entities (XXE)
- Broken access control
- Security misconfiguration
- Cross-site scripting (XSS)
- Insecure deserialization
- Using components with known vulnerabilities
- Insufficient logging & monitoring

**Acceptance Criteria**:
- [x] Security controls in place per ISO 27001
- [x] SOC 2 controls implemented
- [x] OWASP Top 10 protections verified
- [x] Regular security testing performed

---

### 12.4 Scalability Requirements

**Source**: `APP_DESCRIPTION.md` - Section "Technical Architecture Summary → Scalability Considerations"

**NFR-SCALE-001: Stateless Application**

The system shall be stateless (no server-side session state), using JWT-based sessions for horizontal scalability.

**NFR-SCALE-002: Horizontal Scaling**

The system shall support horizontal scaling by running multiple application instances behind a load balancer.

**NFR-SCALE-003: Database Connection Pooling**

The system shall use database connection pooling to handle concurrent requests efficiently.

**NFR-SCALE-004: Caching**

The system shall implement in-memory caching for expensive reports and queries (configurable).

**NFR-SCALE-005: CDN for Static Assets**

The system shall leverage CDN for static assets (images, CSS, JS) to reduce latency.

**Acceptance Criteria**:
- [x] Application is stateless (JWT sessions)
- [x] Application supports horizontal scaling
- [x] Database connection pooling configured
- [x] Caching implemented for expensive operations
- [x] Static assets served via CDN

---

### 12.5 Reliability & Availability Requirements

**NFR-REL-001: Uptime Target**

The system shall target 99.9% uptime (allowing ~8.76 hours downtime per year).

**NFR-REL-002: Recovery Time Objective (RTO)**

The system shall have RTO of < 4 hours (maximum acceptable downtime).

**NFR-REL-003: Recovery Point Objective (RPO)**

The system shall have RPO of < 1 hour (maximum acceptable data loss).

**NFR-REL-004: Database Backups**

The system shall implement automated database backups:
- Frequency: Daily (minimum)
- Retention: 30 days (minimum)
- Location: Off-site/cloud storage
- Testing: Quarterly restore tests

**Acceptance Criteria**:
- [x] Uptime monitoring in place
- [x] Backup strategy implemented
- [x] RTO and RPO documented and tested
- [x] Disaster recovery plan in place

---

## 13. Explicit Non-Requirements (Out of Scope)

**Source**: `APP_DESCRIPTION.md` - Section "Scope Boundaries → Out of Scope (Future Phases)"

The following capabilities are explicitly OUT OF SCOPE for this FRS and will NOT be implemented in the current phase:

**NR-001: External Customer-Facing Warranty Portal**
- Public-facing portal for external customers to submit warranty claims
- Rationale: Current scope is internal-only (technicians and admins)

**NR-002: Integration with External ERP/Inventory Systems**
- API integrations with SAP, Oracle, or other ERP systems
- Real-time inventory synchronization
- Rationale: Deferred to future phase

**NR-003: Real-Time Inventory Tracking**
- Live inventory levels and stock tracking
- Automatic stock depletion on transfer
- Rationale: Out of scope; transfers are documentation only

**NR-004: Shipping and Logistics Integration**
- Integration with UPS, FedEx, or other shipping providers
- Shipping label generation
- Tracking number management
- Rationale: Deferred to future phase

**NR-005: Mobile Native App (iOS/Android)**
- Native mobile applications for iOS and Android
- Rationale: Mobile-first web app sufficient for current needs; native apps deferred

**NR-006: Offline Functionality**
- Offline form submission with sync when online
- Service worker for offline access
- Local data caching
- Rationale: Deferred to future phase; requires connectivity

**NR-007: Multi-Language Support**
- Internationalization (i18n)
- Multiple language translations
- Rationale: English-only for current scope

**NR-008: Barcode/QR Code Scanning**
- Mobile barcode scanning for part numbers
- QR code generation for transfers/claims
- Rationale: Deferred to future phase

**NR-009: Photo Upload for Warranty Claims**
- Photo upload and attachment to claims
- Image gallery in claim details
- Rationale: Mentioned in APP_DESCRIPTION.md as "future feature"; deferred

**NR-010: Service Report Attachment**
- PDF/document attachment to warranty claims
- Service report upload
- Rationale: Mentioned in APP_DESCRIPTION.md as "future feature"; deferred

---

## 14. Requirements Traceability Matrix

**Purpose**: This matrix ensures complete coverage of all capabilities defined in `APP_DESCRIPTION.md` with no scope expansion or omissions.

| App Description Capability | App Description Section | FRS Requirement IDs | Status | Notes |
|----------------------------|------------------------|---------------------|--------|-------|
| **Internal Part Transfers** | Workflow 1 | FR-DIST-001 to FR-DIST-012 | ✓ Mapped | Complete workflow coverage |
| **Warranty Claim Submission** | Workflow 2 | FR-WARR-001 to FR-WARR-005 | ✓ Mapped | Technician submission flow |
| **Warranty Claim Processing** | Workflow 2, Workflow 5 | FR-WARR-006 to FR-WARR-016 | ✓ Mapped | Admin review and approval |
| **Employee Invitation** | Workflow 3 | FR-EMP-001 to FR-EMP-003 | ✓ Mapped | Invitation and registration |
| **Employee Onboarding** | Workflow 3 | FR-EMP-003 to FR-EMP-005 | ✓ Mapped | Registration and welcome emails |
| **Employee Management** | Workflow 3, Users & Roles | FR-EMP-006 to FR-EMP-008 | ✓ Mapped | Admin user management |
| **Report Generation** | Workflow 4 | FR-REPORT-001 to FR-REPORT-005 | ✓ Mapped | All report types covered |
| **User Authentication** | Authentication & Session Management | FR-AUTH-001, FR-AUTH-003, FR-AUTH-004, FR-AUTH-005 | ✓ Mapped | Login, password, logout, timeout |
| **Role-Based Authorization** | Users & Roles, Security Expectations | FR-AUTH-002 | ✓ Mapped | RBAC enforcement |
| **Password Security** | Authentication & Session Management, Security Expectations | FR-AUTH-003, FR-SEC-001 | ✓ Mapped | Requirements and hashing |
| **Input Sanitization** | Security Expectations | FR-SEC-002 | ✓ Mapped | XSS protection |
| **SQL Injection Protection** | Security Expectations | FR-SEC-003 | ✓ Mapped | Prisma ORM parameterization |
| **HTTPS & Network Security** | Security Expectations | FR-SEC-004, FR-SEC-005 | ✓ Mapped | HTTPS enforcement and headers |
| **Rate Limiting** | Security Expectations | FR-SEC-006 | ✓ Mapped | DoS protection |
| **PDF Generation - Transfers** | Output Artifacts | FR-DIST-006, FR-PDF-001 | ✓ Mapped | Transfer PDF with Trane branding |
| **PDF Generation - Warranty Claims** | Output Artifacts | FR-WARR-007, FR-WARR-013, FR-PDF-001 | ✓ Mapped | Warranty claim PDF with admin approval |
| **Email Notifications** | Output Artifacts | FR-EMAIL-001, FR-EMAIL-002, FR-DIST-007, FR-WARR-008, FR-WARR-014, FR-EMP-002, FR-EMP-004, FR-EMP-005 | ✓ Mapped | All 6 email types |
| **Audit Logging** | Auditability Expectations | FR-AUDIT-001, FR-AUDIT-002 | ✓ Mapped | Comprehensive audit trail |
| **Data Models** | Data Captured | Implicit in all FR-* requirements | ✓ Mapped | All entities covered |
| **Performance** | Technical Architecture Summary | NFR-PERF-001 to NFR-PERF-007 | ✓ Mapped | All targets defined |
| **Mobile-First Design** | Mobile-First Design | NFR-MOBILE-001 to NFR-MOBILE-005 | ✓ Mapped | All mobile requirements |
| **Security & Compliance** | Security Expectations | NFR-SEC-001 to NFR-SEC-003 | ✓ Mapped | ISO 27001, SOC 2, OWASP |
| **Scalability** | Technical Architecture Summary | NFR-SCALE-001 to NFR-SCALE-005 | ✓ Mapped | Horizontal scaling, caching, CDN |
| **Reliability** | Technical Architecture Summary | NFR-REL-001 to NFR-REL-004 | ✓ Mapped | Uptime, RTO, RPO, backups |

**Traceability Summary**:
- **Total App Description Capabilities**: 24
- **Capabilities Mapped to FRS**: 24 (100%)
- **FR Requirements**: 80+ functional requirements
- **NFR Requirements**: 23 non-functional requirements
- **Non-Requirements (Out of Scope)**: 10 explicitly documented

**Verification**: All capabilities from `APP_DESCRIPTION.md` are covered. No scope expansion beyond App Description. No contradictions identified.

---

## 15. Testing Implications & QA Guidance

**Purpose**: Provide guidance for creating QA-to-Red test plans from this FRS.

### 15.1 Test Types

**Unit Tests**:
- Test individual functions and components
- Focus on business logic, validation rules, and data transformations
- Mock external dependencies (database, APIs)

**Integration Tests**:
- Test API routes and database operations
- Verify authentication and authorization
- Test email and PDF generation services

**End-to-End (E2E) Tests**:
- Test complete workflows from user perspective
- Verify all 5 core workflows (Transfers, Warranty Claims, Employee Management, Reports, Admin Review)
- Test role-based access control (Admin vs Technician)

### 15.2 QA Domain Coverage

Each functional requirement (FR-*) should have corresponding test cases:

| FRS Section | QA Domain | Test Focus |
|-------------|-----------|------------|
| FR-DIST-* | Internal Transfers | Create, view, edit, delete transfers; PDF generation; email notifications |
| FR-WARR-* | Warranty Claims | Create, view, edit, admin review, PDF regeneration; email notifications |
| FR-EMP-* | Employee Management | Invitation, registration, deactivation, password reset |
| FR-REPORT-* | Reports & Analytics | Report generation, filtering, export (PDF, CSV) |
| FR-AUTH-* | Authentication | Login, logout, session timeout, password requirements |
| FR-SEC-* | Security | XSS protection, SQL injection protection, rate limiting, security headers |
| FR-PDF-* | PDF Generation | Transfer PDFs, warranty claim PDFs, Trane branding |
| FR-EMAIL-* | Email Notifications | All 6 email types, retry logic, branded templates |
| FR-AUDIT-* | Audit Logging | All events logged, immutability, retention |

### 15.3 Acceptance Criteria Testing

Each FR requirement includes acceptance criteria checkboxes. QA tests should verify ALL acceptance criteria are met:
- Use acceptance criteria as test case specifications
- One test case per acceptance criterion (minimum)
- Test both positive and negative scenarios

### 15.4 QA-to-Red Approach

**Before Implementation**:
1. Review each FR requirement
2. Create test cases for all acceptance criteria
3. Create tests for exception flows
4. Run tests → All should FAIL (RED) before implementation
5. Implementation proceeds only after QA-to-Red is complete

**After Implementation**:
1. Run all tests
2. All tests should PASS (GREEN)
3. Zero test debt (no skipped/commented/incomplete tests)
4. 100% QA passing = Build-to-Green achieved

---



## 16. Architecture Derivation Guidance

**Purpose**: This section provides explicit wiring specifications that architects and builders MUST follow to ensure all system components are properly connected and integrated. Without these specifications, builders will create isolated components that don't communicate, resulting in the "empty TV shell" problem where user actions produce no results.

### 16.1 Component Interface Contracts

#### 16.1.1 UI Component → API Route Contracts

**Internal Transfer Submission Contract**:
```typescript
// UI Component: InternalTransferForm
interface TransferSubmissionRequest {
  date: string;              // ISO 8601 date
  ssid?: string;             // Optional site identifier
  siteName?: string;         // Optional site name
  poNumber?: string;         // Optional PO number
  items: Array<{
    qty: number;             // 1-9999
    partNo: string;          // Max 100 chars
    description: string;     // Max 500 chars
  }>;
  clientName?: string;       // Optional, max 200 chars
  clientDate?: string;       // Optional ISO 8601 date
  clientSignature?: string;  // Optional signature data
}

interface TransferSubmissionResponse {
  success: boolean;
  transferId: string;        // CUID
  pdfUrl: string;           // URL to download PDF
  message: string;          // Success/error message
  errors?: Record<string, string[]>; // Validation errors by field
}

// API Route: POST /api/transfers
// Wiring: Form onSubmit → API call → Response handler → Navigation
```

**Warranty Claim Submission Contract**:
```typescript
// UI Component: WarrantyClaimForm
interface ClaimSubmissionRequest {
  date: string;              // ISO 8601 date
  chillerModel?: string;     // Optional, max 100 chars
  chillerSerial?: string;    // Optional, max 100 chars
  ssidJobNumber?: string;    // Optional, max 100 chars
  buildingName?: string;     // Optional, max 200 chars
  siteName?: string;         // Optional, max 200 chars
  coveredByWarranty: boolean;
  comments?: string;         // Optional, max 5000 chars
  technicianSignature?: string; // Optional
  items: Array<{
    partNo: string;          // Required, max 100 chars
    quantity: number;        // 1-999
    failedPartSerial: string; // Required (Trane mandate)
    replacedPartSerial: string; // Required
    dateOfFailure: string;   // ISO 8601 date
    dateOfRepair: string;    // ISO 8601 date, >= dateOfFailure
  }>;
}

interface ClaimSubmissionResponse {
  success: boolean;
  claimId: string;          // CUID
  pdfUrl: string;           // URL to download PDF
  message: string;
  errors?: Record<string, string[]>;
}

// API Route: POST /api/warranty-claims
// Wiring: Form onSubmit → API call → Response handler → Navigation
```

**Admin Claim Review Contract**:
```typescript
// UI Component: AdminReviewForm
interface ClaimReviewRequest {
  claimId: string;
  decision: 'approve' | 'reject';
  adminSignature: string;    // Required
  adminNotes?: string;       // Optional
  processingDate: string;    // ISO 8601 date
}

interface ClaimReviewResponse {
  success: boolean;
  claimId: string;
  status: 'Approved' | 'Rejected';
  updatedPdfUrl: string;    // New PDF with admin signature
  message: string;
  errors?: Record<string, string[]>;
}

// API Route: POST /api/warranty-claims/:id/review
// Wiring: Review form → API call → PDF regeneration → Email notification → Response
```

#### 16.1.2 API Route → Business Logic Contracts

**Transfer Service Interface**:
```typescript
// Service: TransferService
interface ITransferService {
  createTransfer(data: CreateTransferDTO, userId: string): Promise<Transfer>;
  updateTransfer(id: string, data: UpdateTransferDTO, userId: string): Promise<Transfer>;
  deleteTransfer(id: string, userId: string): Promise<void>;
  getTransfer(id: string, userId: string, userRole: string): Promise<Transfer>;
  listTransfers(filters: TransferFilters, userId: string, userRole: string): Promise<PaginatedTransfers>;
  addAdminStamp(id: string, adminSignature: string, userId: string): Promise<Transfer>;
}

// API Route → Service wiring:
// 1. Extract authenticated user from session (middleware)
// 2. Validate request body with Zod schema
// 3. Call service method with validated data + userId
// 4. Service performs authorization check (ownership or admin role)
// 5. Service executes business logic
// 6. Service returns result or throws typed error
// 7. API route catches error and returns appropriate HTTP response
```

**Warranty Claim Service Interface**:
```typescript
// Service: WarrantyClaimService
interface IWarrantyClaimService {
  createClaim(data: CreateClaimDTO, userId: string): Promise<WarrantyClaim>;
  updateClaim(id: string, data: UpdateClaimDTO, userId: string): Promise<WarrantyClaim>;
  deleteClaim(id: string, userId: string): Promise<void>;
  getClaim(id: string, userId: string, userRole: string): Promise<WarrantyClaim>;
  listClaims(filters: ClaimFilters, userId: string, userRole: string): Promise<PaginatedClaims>;
  reviewClaim(id: string, review: ClaimReviewDTO, adminId: string): Promise<WarrantyClaim>;
}

// API Route → Service wiring:
// Same pattern as TransferService with additional:
// - Admin review authorization check (admin role required)
// - PDF regeneration trigger after admin review
// - Email notification trigger after status change
```

#### 16.1.3 Business Logic → Data Access Contracts

**Repository Pattern with Prisma**:
```typescript
// Repository: TransferRepository
interface ITransferRepository {
  create(data: Prisma.InternalTransferCreateInput): Promise<InternalTransfer>;
  update(id: string, data: Prisma.InternalTransferUpdateInput): Promise<InternalTransfer>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<InternalTransfer | null>;
  findMany(where: Prisma.InternalTransferWhereInput, options: PaginationOptions): Promise<InternalTransfer[]>;
  count(where: Prisma.InternalTransferWhereInput): Promise<number>;
}

// Service → Repository wiring:
// 1. Service receives validated business data
// 2. Service transforms to Prisma input types
// 3. Service calls repository method
// 4. Repository executes Prisma query (parameterized - SQL injection safe)
// 5. Repository returns Prisma model
// 6. Service transforms to domain model or DTO
// 7. Service returns to API route
```

**Prisma Transaction Patterns**:
```typescript
// Multi-step operations require transactions
// Example: Create Transfer + Items + Audit Log
async function createTransferWithItems(
  prisma: PrismaClient,
  transferData: TransferData,
  items: ItemData[],
  userId: string
): Promise<InternalTransfer> {
  return await prisma.$transaction(async (tx) => {
    // 1. Create transfer
    const transfer = await tx.internalTransfer.create({
      data: {
        ...transferData,
        technicianId: userId,
      },
    });
    
    // 2. Create items
    await tx.internalTransferItem.createMany({
      data: items.map(item => ({
        ...item,
        transferId: transfer.id,
      })),
    });
    
    // 3. Create audit log
    await tx.systemLog.create({
      data: {
        eventType: 'submission',
        action: 'TRANSFER_SUBMITTED',
        userId: userId,
        details: JSON.stringify({ transferId: transfer.id }),
      },
    });
    
    // 4. Return complete transfer with items
    return await tx.internalTransfer.findUnique({
      where: { id: transfer.id },
      include: { items: true, technician: true },
    });
  });
}

// Wiring: Service calls transaction function, Prisma ensures atomicity
```

### 16.2 Integration Point Specifications

#### 16.2.1 Frontend-Backend API Integration

**API Route Structure**:
```
/api/transfers
  POST   /              → Create transfer (FR-DIST-002, FR-DIST-004, FR-DIST-005)
  GET    /              → List transfers (FR-DIST-009)
  GET    /:id           → Get transfer details (FR-DIST-008)
  PUT    /:id           → Update transfer (FR-DIST-010)
  DELETE /:id           → Delete transfer (FR-DIST-011)
  POST   /:id/admin-stamp → Add admin stamp (FR-DIST-012)

/api/warranty-claims
  POST   /              → Create claim (FR-WARR-002 to FR-WARR-006)
  GET    /              → List claims (FR-WARR-009)
  GET    /:id           → Get claim details (FR-WARR-010)
  PUT    /:id           → Update claim (FR-WARR-015)
  DELETE /:id           → Delete claim (FR-WARR-016)
  POST   /:id/review    → Admin review (FR-WARR-012)

/api/employees
  POST   /invite        → Invite user (FR-EMP-001)
  GET    /              → List employees (FR-EMP-006)
  POST   /:id/reset-password → Reset password (FR-EMP-007)
  PUT    /:id/deactivate → Deactivate user (FR-EMP-008)

/api/reports
  GET    /dashboard     → Reports dashboard (FR-REPORT-001)
  GET    /transfers     → Transfer report (FR-REPORT-002)
  GET    /claims        → Claims report (FR-REPORT-003)
  GET    /user-activity → User activity (FR-REPORT-004)
  GET    /audit-log     → Audit log (FR-REPORT-005)

/api/auth
  POST   /login         → User login (FR-AUTH-001)
  POST   /logout        → User logout (FR-AUTH-004)
  GET    /session       → Get current session
```

**Request/Response Flow**:
```
1. User Action (Button Click, Form Submit)
   ↓
2. UI Component Event Handler
   ↓
3. Client-side Validation (Zod schema, immediate feedback)
   ↓
4. HTTP Request (fetch/axios with auth headers)
   ↓
5. Next.js Middleware (authentication check, JWT validation)
   ↓
6. API Route Handler (request parsing, validation)
   ↓
7. Server-side Validation (Zod schema re-validation)
   ↓
8. Authorization Check (role + ownership)
   ↓
9. Business Logic Service (orchestration)
   ↓
10. Data Access Layer (Prisma queries)
    ↓
11. Database (PostgreSQL/SQLite)
    ↓
12. Response Path (reverse of above)
    ↓
13. UI Update (state management, re-render)
    ↓
14. User Feedback (success message, navigation, etc.)
```

#### 16.2.2 Database Integration

**Prisma Client Initialization**:
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Wiring: Import prisma from this file in all services/repositories
// Connection pooling handled by Prisma automatically
```

**Query Patterns**:
```typescript
// Pattern 1: Simple CRUD
const transfer = await prisma.internalTransfer.create({ data: {...} });

// Pattern 2: Relations (eager loading)
const transfer = await prisma.internalTransfer.findUnique({
  where: { id },
  include: { 
    items: true,           // Load all items
    technician: true,      // Load technician details
  },
});

// Pattern 3: Filtering (role-based)
const transfers = await prisma.internalTransfer.findMany({
  where: {
    technicianId: userRole === 'technician' ? userId : undefined, // Filter by ownership
  },
  include: { items: true },
  orderBy: { date: 'desc' },
  skip: (page - 1) * perPage,
  take: perPage,
});

// Pattern 4: Transactions (multi-step atomic operations)
// See 16.1.3 for transaction example
```

#### 16.2.3 External Service Integration

**Email Service Wiring**:
```typescript
// lib/email/client.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await resend.emails.send({
      from: `PartPulse <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    
    // Log success to audit trail
    await prisma.systemLog.create({
      data: {
        eventType: 'email_sent',
        action: 'EMAIL_SENT',
        details: JSON.stringify({ to: options.to, subject: options.subject }),
        success: true,
      },
    });
  } catch (error) {
    // Log failure to audit trail
    await prisma.systemLog.create({
      data: {
        eventType: 'email_sent',
        action: 'EMAIL_FAILED',
        details: JSON.stringify({ to: options.to, error: error.message }),
        success: false,
        errorMessage: error.message,
      },
    });
    
    // Retry logic: throw error to trigger retry (3 attempts)
    throw error;
  }
}

// Wiring: Service layer calls sendEmail after successful database operation
// Example: After transfer created → Send confirmation email
```

**PDF Generator Wiring**:
```typescript
// lib/pdf/generator.ts
import { generatePDF } from './engine';
import { uploadToStorage } from './storage';

interface TransferPDFData {
  transferId: string;
  date: Date;
  technician: string;
  items: Array<{ qty: number; partNo: string; description: string }>;
  // ... other transfer fields
}

export async function generateTransferPDF(data: TransferPDFData): Promise<string> {
  // 1. Generate PDF binary
  const pdfBuffer = await generatePDF('transfer-template', data);
  
  // 2. Upload to storage
  const pdfPath = `transfers/${data.transferId}.pdf`;
  const pdfUrl = await uploadToStorage(pdfPath, pdfBuffer, 'application/pdf');
  
  // 3. Log to audit trail
  await prisma.systemLog.create({
    data: {
      eventType: 'pdf_generation',
      action: 'TRANSFER_PDF_GENERATED',
      details: JSON.stringify({ transferId: data.transferId, pdfUrl }),
      success: true,
    },
  });
  
  return pdfUrl;
}

// Wiring: Service layer calls generateTransferPDF after database save
// Example: Transfer created → Generate PDF → Update transfer record with PDF URL
```

**Storage Provider Wiring**:
```typescript
// lib/storage/index.ts
// Configurable storage: local filesystem or S3
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local';

export async function uploadToStorage(
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (STORAGE_PROVIDER === 's3') {
    // S3 implementation
    const s3Client = getS3Client();
    await s3Client.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: path,
      Body: buffer,
      ContentType: contentType,
    });
    return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${path}`;
  } else {
    // Local filesystem implementation
    const localPath = `./public/uploads/${path}`;
    await fs.promises.mkdir(dirname(localPath), { recursive: true });
    await fs.promises.writeFile(localPath, buffer);
    return `/uploads/${path}`;
  }
}

// Wiring: PDF generator calls uploadToStorage, config determines provider
```

**Authentication Middleware Wiring**:
```typescript
// lib/auth/middleware.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new UnauthorizedError('Authentication required');
  }
  
  return {
    userId: session.user.id,
    userEmail: session.user.email,
    userRole: session.user.role,
  };
}

export async function requireAdmin(req: Request) {
  const auth = await requireAuth(req);
  
  if (auth.userRole !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
  
  return auth;
}

// Wiring: Every API route calls requireAuth or requireAdmin at start
// Example:
// export async function POST(req: Request) {
//   const auth = await requireAuth(req);
//   // ... rest of handler with auth.userId, auth.userRole
// }
```

### 16.3 Data Flow Wiring

#### 16.3.1 Internal Transfer Submission Flow

**End-to-End Wiring**:
```
1. User fills form in InternalTransferForm component
   ↓
2. User clicks "Submit" button
   ↓
3. Form onSubmit handler triggered
   ↓
4. Client-side validation (Zod schema)
   - If invalid: Display errors inline, stop
   - If valid: Continue to step 5
   ↓
5. POST request to /api/transfers
   - Headers: Authorization (JWT from session cookie)
   - Body: TransferSubmissionRequest
   ↓
6. Next.js middleware validates JWT
   - If invalid: Return 401, stop
   - If valid: Continue to step 7
   ↓
7. API route handler: POST /api/transfers
   - Extract authenticated user from session
   - Server-side validation (Zod re-validation)
   - If invalid: Return 400 with errors, stop
   - If valid: Continue to step 8
   ↓
8. Call TransferService.createTransfer(data, userId)
   ↓
9. TransferService orchestrates:
   a. Sanitize inputs (XSS protection - FR-SEC-002)
   b. Start Prisma transaction
   c. Create InternalTransfer record
   d. Create InternalTransferItem records (related)
   e. Create SystemLog audit entry (FR-AUDIT-001)
   f. Commit transaction
   ↓
10. Transfer created → Trigger side effects:
    a. Call generateTransferPDF(transferData) (FR-DIST-006)
       - Generate PDF from template
       - Upload PDF to storage
       - Return PDF URL
    b. Update transfer record with pdfUrl
    c. Call sendTransferEmail(transfer, userId) (FR-DIST-007)
       - Compose email with branded template
       - Send via Resend
       - Log email event to audit trail
       - Retry on failure (3 attempts)
    ↓
11. Service returns Transfer with pdfUrl
    ↓
12. API route returns 201 with TransferSubmissionResponse
    - transferId, pdfUrl, success message
    ↓
13. UI receives response
    - Navigate to /transfers/[transferId]
    - Display success message
    - Show transfer details with PDF download link
    ↓
14. User sees confirmation page (FR-DIST-008)
```

**Failure Handling in Flow**:
```
- Database failure (step 9): Transaction rolls back, return 500, log error
- PDF generation failure (step 10a): Transfer still created, mark as pending PDF, retry later
- Email failure (step 10c): Transfer + PDF still created, log failure, retry later
- Any exception: Caught by error middleware, logged to audit trail, generic error returned to user
```

#### 16.3.2 Warranty Claim Submission Flow

**End-to-End Wiring**:
```
1-7. Same as Internal Transfer (user action → API route → validation)
   ↓
8. Call WarrantyClaimService.createClaim(data, userId)
   ↓
9. WarrantyClaimService orchestrates:
   a. Sanitize inputs (FR-SEC-002)
   b. Validate serial numbers present (Trane requirement - FR-WARR-003)
   c. Validate date relationships (repair >= failure - FR-WARR-005)
   d. Start Prisma transaction
   e. Create WarrantyClaim record
   f. Create WarrantyItem records (related)
   g. Create SystemLog audit entry
   h. Commit transaction
   ↓
10. Claim created → Trigger side effects:
    a. Call generateWarrantyClaimPDF(claimData) (FR-WARR-007)
       - Generate PDF matching Trane Warranty Parts Claims Form
       - Include Trane logos and branding
       - Upload PDF to storage
       - Return PDF URL
    b. Update claim record with pdfUrl
    c. Call sendClaimSubmissionEmail(claim, userId) (FR-WARR-008)
       - Send confirmation to technician
       - Send notification to admins
       - Log email events
    ↓
11. Service returns WarrantyClaim with pdfUrl
    ↓
12. API route returns 201 with ClaimSubmissionResponse
    ↓
13. UI navigates to /warranty-claims/[claimId]
    ↓
14. User sees confirmation page (FR-WARR-010)
```

#### 16.3.3 Admin Warranty Claim Review Flow

**End-to-End Wiring**:
```
1. Admin views claim detail page
   - Loads claim data via GET /api/warranty-claims/:id
   - Displays all claim details, parts, comments
   ↓
2. Admin clicks "Admin Review" button
   - Navigates to review page or opens modal
   ↓
3. Admin fills review form:
   - Decision: Approve or Reject
   - Admin signature (required)
   - Admin notes (optional)
   - Processing date (auto-filled)
   ↓
4. Admin clicks "Submit" button
   ↓
5. POST request to /api/warranty-claims/:id/review
   - Headers: Authorization (JWT)
   - Body: ClaimReviewRequest
   ↓
6. API route handler validates:
   - User is authenticated (middleware)
   - User has admin role (requireAdmin) (FR-AUTH-002)
   - If not admin: Return 403, stop
   - Admin signature provided (FR-WARR-012)
   - If missing: Return 400, stop
   ↓
7. Call WarrantyClaimService.reviewClaim(claimId, reviewData, adminId)
   ↓
8. Service orchestrates:
   a. Load existing claim
   b. Update claim with admin data:
      - adminSignature
      - adminStamp = true
      - status = 'Approved' or 'Rejected'
      - adminProcessingDate
      - adminNotes
   c. Save to database
   d. Create audit log entry (FR-AUDIT-001)
   ↓
9. Claim updated → Trigger side effects:
   a. Call regenerateWarrantyClaimPDF(claimData) (FR-WARR-013)
      - Generate new PDF with admin signature
      - Add red "PROCESSED" stamp
      - Upload to storage
      - Return new PDF URL
      - Archive previous PDF version
   b. Update claim record with new pdfUrl
   c. Call sendClaimDecisionEmail(claim, technicianId) (FR-WARR-014)
      - Email to technician with decision
      - Include updated PDF with admin signature
      - Provide next steps (parts shipment or resubmission)
      - Log email event
   ↓
10. Service returns updated WarrantyClaim
    ↓
11. API route returns 200 with ClaimReviewResponse
    ↓
12. UI updates:
    - Display success message
    - Refresh claim details showing admin signature
    - Show "PROCESSED" badge
    - Provide link to download updated PDF
    ↓
13. Admin sees confirmation (FR-WARR-012)
```

### 16.4 Service Layer Architecture

#### 16.4.1 Service Instantiation Pattern

```typescript
// services/TransferService.ts
export class TransferService {
  constructor(
    private prisma: PrismaClient,
    private pdfGenerator: PDFGenerator,
    private emailService: EmailService,
    private auditLogger: AuditLogger
  ) {}
  
  async createTransfer(data: CreateTransferDTO, userId: string): Promise<Transfer> {
    // Service implementation using injected dependencies
    // 1. Validate and sanitize
    // 2. Save to database via prisma
    // 3. Generate PDF via pdfGenerator
    // 4. Send email via emailService
    // 5. Log audit via auditLogger
    // 6. Return result
  }
}

// services/index.ts (Service Factory)
import { prisma } from '@/lib/prisma';
import { PDFGenerator } from '@/lib/pdf/generator';
import { EmailService } from '@/lib/email/client';
import { AuditLogger } from '@/lib/audit/logger';

// Singleton instances
const pdfGenerator = new PDFGenerator();
const emailService = new EmailService();
const auditLogger = new AuditLogger(prisma);

// Service instances
export const transferService = new TransferService(
  prisma,
  pdfGenerator,
  emailService,
  auditLogger
);

export const warrantyClaimService = new WarrantyClaimService(
  prisma,
  pdfGenerator,
  emailService,
  auditLogger
);

// ... other services

// Wiring: API routes import services from this file
// Example: import { transferService } from '@/services';
```

#### 16.4.2 Dependency Injection

**Pattern**: Constructor injection with singleton services

```typescript
// API Route: app/api/transfers/route.ts
import { transferService } from '@/services';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(req: Request) {
  // 1. Authenticate
  const auth = await requireAuth(req);
  
  // 2. Parse and validate request
  const body = await req.json();
  const validatedData = CreateTransferSchema.parse(body);
  
  // 3. Call service (dependency injected via constructor)
  const transfer = await transferService.createTransfer(validatedData, auth.userId);
  
  // 4. Return response
  return NextResponse.json({
    success: true,
    transferId: transfer.id,
    pdfUrl: transfer.pdfUrl,
    message: 'Transfer submitted successfully',
  }, { status: 201 });
}

// Services are instantiated once (singleton) and reused across all requests
// Dependencies (prisma, pdfGenerator, etc.) injected at service creation time
```

#### 16.4.3 Service Lifecycle

**Initialization**:
```
1. Application starts
   ↓
2. services/index.ts loads
   ↓
3. Singleton dependencies created:
   - prisma client (lib/prisma.ts)
   - PDF generator (lib/pdf/generator.ts)
   - Email service (lib/email/client.ts)
   - Audit logger (lib/audit/logger.ts)
   ↓
4. Services instantiated with dependencies:
   - transferService
   - warrantyClaimService
   - employeeService
   - etc.
   ↓
5. Services ready for use by API routes
```

**Request Lifecycle**:
```
1. HTTP request arrives
   ↓
2. Next.js routes to API handler
   ↓
3. API handler imports service (already instantiated)
   ↓
4. Service method called with request data
   ↓
5. Service uses injected dependencies
   ↓
6. Service returns result
   ↓
7. API handler formats response
   ↓
8. Response sent to client
```

**Cleanup**:
```
- Prisma connection pool managed automatically
- No explicit cleanup needed for stateless services
- On application shutdown: prisma.$disconnect() called
```

### 16.5 Error Handling Wiring

#### 16.5.1 Error Propagation Patterns

**Error Flow**: Database → Service → API Route → UI

```typescript
// Custom Error Types
class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

// Database Layer: Prisma errors
try {
  const transfer = await prisma.internalTransfer.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    throw new ValidationError({ [error.meta.target]: ['Already exists'] });
  } else if (error.code === 'P2025') {
    // Record not found
    throw new NotFoundError('Transfer');
  } else {
    // Generic database error
    throw new Error('Database operation failed');
  }
}

// Service Layer: Business logic errors
async createTransfer(data: CreateTransferDTO, userId: string): Promise<Transfer> {
  // Validate ownership
  if (data.technicianId && data.technicianId !== userId) {
    throw new ForbiddenError('Cannot create transfer for another user');
  }
  
  // Sanitize inputs
  const sanitizedData = sanitizeTransferData(data);
  
  // Save to database (may throw database errors)
  try {
    const transfer = await this.prisma.internalTransfer.create({
      data: sanitizedData,
    });
    return transfer;
  } catch (error) {
    // Re-throw as service error
    throw error;
  }
}

// API Route Layer: HTTP error responses
export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req); // May throw UnauthorizedError
    const body = await req.json();
    const validatedData = CreateTransferSchema.parse(body); // May throw ZodError
    const transfer = await transferService.createTransfer(validatedData, auth.userId); // May throw service errors
    
    return NextResponse.json({ success: true, transfer }, { status: 201 });
    
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      }, { status: 400 });
    } else if (error instanceof UnauthorizedError) {
      return NextResponse.json({
        success: false,
        message: error.message,
      }, { status: 401 });
    } else if (error instanceof ForbiddenError) {
      return NextResponse.json({
        success: false,
        message: error.message,
      }, { status: 403 });
    } else if (error instanceof NotFoundError) {
      return NextResponse.json({
        success: false,
        message: error.message,
      }, { status: 404 });
    } else {
      // Log unexpected errors
      console.error('Unexpected error:', error);
      await auditLogger.logError(error);
      
      return NextResponse.json({
        success: false,
        message: 'An unexpected error occurred',
      }, { status: 500 });
    }
  }
}

// UI Layer: Error display
async function handleSubmit(data: TransferFormData) {
  try {
    const response = await fetch('/api/transfers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      if (response.status === 400 && result.errors) {
        // Validation errors: display inline
        setFieldErrors(result.errors);
      } else if (response.status === 401) {
        // Unauthorized: redirect to login
        router.push('/login');
      } else {
        // Other errors: display toast message
        toast.error(result.message || 'An error occurred');
      }
    } else {
      // Success: navigate to detail page
      router.push(`/transfers/${result.transferId}`);
      toast.success('Transfer submitted successfully');
    }
  } catch (error) {
    // Network error
    toast.error('Network error. Please try again.');
  }
}
```

#### 16.5.2 Error Recovery Strategies

**Retry Logic for External Services**:
```typescript
// lib/utils/retry.ts
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  throw lastError;
}

// Usage: Email sending with retry
async function sendTransferEmail(transfer: Transfer, userId: string): Promise<void> {
  await withRetry(async () => {
    await emailService.send({
      to: transfer.technician.email,
      subject: `Internal Transfer Confirmation - ${transfer.id}`,
      html: createTransferEmailTemplate(transfer),
    });
  }, 3, 1000); // 3 attempts, 1s initial delay
}
```

**Fallback Behavior**:
```typescript
// PDF generation with fallback
async function generateTransferPDF(data: TransferData): Promise<string> {
  try {
    // Try primary PDF generation
    return await pdfGenerator.generate('transfer-template', data);
  } catch (error) {
    // Log error
    await auditLogger.logError(error);
    
    // Fallback: Return URL to generate PDF on-demand
    return `/api/transfers/${data.transferId}/pdf`;
  }
}

// Email with fallback
async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    // Try primary email provider (Resend)
    await resend.emails.send(options);
  } catch (error) {
    // Log error
    await auditLogger.logError(error);
    
    // Fallback: Queue for later retry
    await emailQueue.add(options);
    
    // Don't throw - email failure shouldn't block primary operation
  }
}
```

#### 16.5.3 Error Logging and Monitoring

**Audit Trail for All Errors**:
```typescript
// lib/audit/logger.ts
export class AuditLogger {
  constructor(private prisma: PrismaClient) {}
  
  async logError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.prisma.systemLog.create({
      data: {
        timestamp: new Date(),
        eventType: 'system_error',
        action: 'ERROR_OCCURRED',
        details: JSON.stringify({
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
          context,
        }),
        success: false,
        errorMessage: error.message,
      },
    });
  }
  
  async logOperationFailure(
    operation: string,
    userId: string,
    error: Error
  ): Promise<void> {
    await this.prisma.systemLog.create({
      data: {
        timestamp: new Date(),
        eventType: 'operation_failure',
        userId,
        action: operation,
        details: JSON.stringify({ error: error.message }),
        success: false,
        errorMessage: error.message,
      },
    });
  }
}

// Wiring: All error handlers call auditLogger.logError()
```

### 16.6 Asynchronous Operation Wiring

#### 16.6.1 Background Job Patterns

**PDF Generation (Synchronous with Async Retry)**:
```typescript
// Primary flow: Synchronous PDF generation
async function createTransfer(data: CreateTransferDTO, userId: string): Promise<Transfer> {
  // 1. Save transfer to database
  const transfer = await prisma.internalTransfer.create({ data });
  
  // 2. Try to generate PDF synchronously
  try {
    const pdfUrl = await generateTransferPDF(transfer);
    await prisma.internalTransfer.update({
      where: { id: transfer.id },
      data: { pdfUrl },
    });
  } catch (error) {
    // 3. If PDF generation fails, mark for retry
    await pdfRetryQueue.add({
      transferId: transfer.id,
      type: 'transfer',
    });
    
    // Log error but don't fail the transfer creation
    await auditLogger.logError(error, { transferId: transfer.id });
  }
  
  return transfer;
}

// Background worker: Retry failed PDF generations
// (Can be implemented with a simple setInterval or a job queue like BullMQ)
```

**Email Sending (Synchronous with Async Retry)**:
```typescript
// Primary flow: Synchronous email sending
async function sendTransferEmail(transfer: Transfer): Promise<void> {
  try {
    await withRetry(async () => {
      await emailService.send({
        to: transfer.technician.email,
        subject: `Transfer Confirmation - ${transfer.id}`,
        html: createEmailTemplate(transfer),
      });
    }, 3);
  } catch (error) {
    // If all retries fail, queue for later
    await emailRetryQueue.add({
      to: transfer.technician.email,
      subject: `Transfer Confirmation - ${transfer.id}`,
      html: createEmailTemplate(transfer),
    });
    
    // Log error but don't fail the transfer creation
    await auditLogger.logError(error, { transferId: transfer.id });
  }
}
```

#### 16.6.2 Event Publishing and Subscription

**Event-Driven Pattern (Optional for Complex Workflows)**:
```typescript
// lib/events/emitter.ts
import { EventEmitter } from 'events';

export const appEvents = new EventEmitter();

// Event types
export const Events = {
  TRANSFER_CREATED: 'transfer.created',
  CLAIM_CREATED: 'claim.created',
  CLAIM_REVIEWED: 'claim.reviewed',
  USER_INVITED: 'user.invited',
  USER_ACTIVATED: 'user.activated',
} as const;

// Service: Emit events after successful operations
async function createTransfer(data: CreateTransferDTO, userId: string): Promise<Transfer> {
  const transfer = await prisma.internalTransfer.create({ data });
  
  // Emit event
  appEvents.emit(Events.TRANSFER_CREATED, { transfer, userId });
  
  return transfer;
}

// Event handlers: Subscribe to events
appEvents.on(Events.TRANSFER_CREATED, async ({ transfer, userId }) => {
  // Generate PDF
  await generateTransferPDF(transfer);
  
  // Send email
  await sendTransferEmail(transfer, userId);
  
  // Any other side effects...
});

appEvents.on(Events.CLAIM_REVIEWED, async ({ claim, adminId }) => {
  // Regenerate PDF with admin signature
  await regenerateWarrantyClaimPDF(claim);
  
  // Send decision email
  await sendClaimDecisionEmail(claim);
});

// Wiring: Services emit events, handlers execute side effects asynchronously
```

#### 16.6.3 Queue Management

**Simple In-Memory Queue (MVP)**:
```typescript
// lib/queue/simple.ts
interface QueueItem<T> {
  id: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  nextRetry: Date;
}

class SimpleQueue<T> {
  private queue: QueueItem<T>[] = [];
  private processing = false;
  
  async add(data: T, maxAttempts: number = 3): Promise<void> {
    this.queue.push({
      id: Math.random().toString(36),
      data,
      attempts: 0,
      maxAttempts,
      nextRetry: new Date(),
    });
    
    this.process();
  }
  
  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue[0];
      
      if (item.nextRetry > new Date()) {
        // Not ready for retry yet
        break;
      }
      
      try {
        await this.processItem(item.data);
        // Success: remove from queue
        this.queue.shift();
      } catch (error) {
        item.attempts++;
        
        if (item.attempts >= item.maxAttempts) {
          // Max attempts reached: remove and log
          this.queue.shift();
          console.error('Queue item failed after max attempts:', error);
        } else {
          // Retry later with exponential backoff
          item.nextRetry = new Date(Date.now() + 1000 * Math.pow(2, item.attempts));
          // Move to end of queue
          this.queue.push(this.queue.shift());
        }
      }
    }
    
    this.processing = false;
  }
  
  protected async processItem(data: T): Promise<void> {
    // Override in subclass
    throw new Error('Not implemented');
  }
}

// Usage: Email retry queue
class EmailQueue extends SimpleQueue<EmailOptions> {
  protected async processItem(email: EmailOptions): Promise<void> {
    await emailService.send(email);
  }
}

export const emailRetryQueue = new EmailQueue();

// Wiring: Services add failed operations to queue, queue retries automatically
```

### 16.7 Security Wiring

**Input Sanitization Wiring**:
```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeString(input: string): string {
  // HTML entity encoding
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizeTransferData(data: CreateTransferDTO): CreateTransferDTO {
  return {
    ...data,
    ssid: data.ssid ? sanitizeString(data.ssid) : undefined,
    siteName: data.siteName ? sanitizeString(data.siteName) : undefined,
    poNumber: data.poNumber ? sanitizeString(data.poNumber) : undefined,
    clientName: data.clientName ? sanitizeString(data.clientName) : undefined,
    items: data.items.map(item => ({
      ...item,
      partNo: sanitizeString(item.partNo),
      description: sanitizeString(item.description),
    })),
  };
}

// Wiring: All services call sanitize functions before database operations
```

**Authorization Wiring**:
```typescript
// lib/auth/authorization.ts
export function checkOwnership(
  resource: { technicianId: string } | { userId: string },
  currentUserId: string,
  currentUserRole: string
): void {
  // Admins can access anything
  if (currentUserRole === 'admin') {
    return;
  }
  
  // Technicians can only access own resources
  const resourceUserId = 'technicianId' in resource ? resource.technicianId : resource.userId;
  
  if (resourceUserId !== currentUserId) {
    throw new ForbiddenError('Access denied: you can only access your own resources');
  }
}

// Wiring: All service methods that access user-specific resources call checkOwnership
// Example:
async function getTransfer(id: string, userId: string, userRole: string): Promise<Transfer> {
  const transfer = await prisma.internalTransfer.findUnique({ where: { id } });
  
  if (!transfer) {
    throw new NotFoundError('Transfer');
  }
  
  // Check authorization
  checkOwnership(transfer, userId, userRole);
  
  return transfer;
}
```

### 16.8 Implementation Checklist for Architects

**Component Interfaces**:
- [ ] All UI → API contracts defined with TypeScript interfaces
- [ ] All API → Service contracts defined with TypeScript interfaces
- [ ] All Service → Repository contracts defined with TypeScript interfaces
- [ ] Request/response schemas documented for all API endpoints

**Integration Points**:
- [ ] Frontend-backend API integration fully specified
- [ ] Database integration patterns documented (Prisma client, transactions)
- [ ] Email service integration wired (Resend, retry logic)
- [ ] PDF generation service wired (template engine, storage)
- [ ] Storage provider wired (local/S3 configuration)
- [ ] Authentication middleware wired (NextAuth.js, JWT validation)

**Data Flows**:
- [ ] Internal transfer submission flow documented end-to-end
- [ ] Warranty claim submission flow documented end-to-end
- [ ] Admin claim review flow documented end-to-end
- [ ] Employee invitation flow documented end-to-end
- [ ] All major workflows include error handling paths

**Service Wiring**:
- [ ] Service instantiation pattern defined (constructor injection)
- [ ] Dependency injection implemented (singleton services)
- [ ] Service lifecycle documented (initialization, request, cleanup)
- [ ] All services use injected dependencies (prisma, emailService, etc.)

**Error Handling**:
- [ ] Error propagation pattern defined (DB → Service → API → UI)
- [ ] Custom error types created (ValidationError, UnauthorizedError, etc.)
- [ ] Error recovery strategies implemented (retry, fallback)
- [ ] All errors logged to audit trail

**Async Operations**:
- [ ] Background job patterns defined (PDF generation retry)
- [ ] Event publishing/subscription implemented (optional)
- [ ] Queue management implemented (email retry queue)
- [ ] All async operations have failure recovery

**Security**:
- [ ] Input sanitization wired into all services
- [ ] Authorization checks wired into all operations
- [ ] HTTPS enforcement configured (production)
- [ ] Security headers middleware configured
- [ ] Rate limiting implemented

**Testing**:
- [ ] Integration tests verify API → Service → DB wiring
- [ ] E2E tests verify UI → API → DB → External Services wiring
- [ ] Error path tests verify error propagation
- [ ] Retry logic tests verify background job recovery

---

## Integration Verification Steps

**Before declaring architecture complete, verify**:

1. **Manual Flow Test**: Submit a transfer from UI
   - Does button click trigger API call?
   - Does API call reach service?
   - Does service save to database?
   - Does database save trigger PDF generation?
   - Does PDF generation trigger email?
   - Does email arrive?
   - Does audit log capture all steps?
   - **If ANY step fails, wiring is incomplete**

2. **Error Path Test**: Simulate database failure
   - Does error propagate from database → service → API → UI?
   - Does user see appropriate error message?
   - Does audit log capture error?
   - **If error silently fails, wiring is incomplete**

3. **Authorization Test**: Technician tries to access admin's transfer
   - Does authorization check prevent access?
   - Does API return 403?
   - Does audit log capture unauthorized attempt?
   - **If access granted, authorization wiring is incomplete**

4. **Retry Test**: Simulate email provider failure
   - Does email fail initially?
   - Does retry logic trigger?
   - Does email eventually succeed?
   - Does audit log capture all attempts?
   - **If email never sent, retry wiring is incomplete**

**Success Criteria**: All 4 verification tests pass = Wiring is complete

---

*This section ensures builders create a fully-wired system, not an "empty TV shell". Every component, service, and integration point is explicitly connected with clear contracts and data flows.*

---

## 17. FM Acceptance Declaration

**FM Authority**: This section to be completed by FM (Foreman) after FRS review.

### FM Pre-Build Gate Checklist

This FRS MUST satisfy the following before FM approval:

- [ ] **Derivation Statement**: Explicit reference to `APP_DESCRIPTION.md` present (Section 0)
- [ ] **Purpose and Scope Alignment**: FRS purpose and scope match App Description
- [ ] **Complete Functional Coverage**: All 7+ capability domains from App Description covered with functional requirements
- [ ] **Requirement Structure**: Each requirement has ID, priority, status, description, preconditions, main flow, acceptance criteria
- [ ] **Cross-Cutting Requirements**: Security, performance, mobile-first, scalability, reliability documented
- [ ] **Explicit Non-Requirements**: Out-of-scope items from App Description explicitly listed
- [ ] **Traceability Matrix**: Complete App Description → FRS mapping with 100% coverage
- [ ] **No Contradictions**: No FRS requirement contradicts App Description
- [ ] **No Scope Expansion**: FRS does not expand beyond App Description scope
- [ ] **QA Guidance**: Testing implications and QA-to-Red guidance provided
- [ ] **Architecture Guidance**: Architecture derivation guidance provided
- [ ] **Governance Compliance**: FRS satisfies `APP_DESCRIPTION_REQUIREMENT_POLICY.md` and `ARCHITECTURE_COMPILATION_CONTRACT.md`

### FM Approval

**FM Reviewer**: _[FM Name]_  
**Review Date**: _[YYYY-MM-DD]_  
**Approval Status**: ⏳ **PENDING FM REVIEW**  
**FM Signature**: _________________  

**FM Comments**:
_[FM to provide feedback, corrections, or approval]_

---

### Human Owner Approval

**Human Owner**: Johan Ras  
**Review Date**: _[YYYY-MM-DD]_  
**Approval Status**: ⏳ **PENDING HUMAN REVIEW**  
**Signature**: _________________  

**Human Owner Comments**:
_[Johan to confirm requirements align with business intent and approve as foundation for architecture]_

---

## 18. Document History & Version Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-13 | GitHub Copilot (codex-max proxy) | Initial draft - Sections 0-17 |
| 1.0 | TBD | TBD | Approved version (post-FM and human review) |

---

## 19. Glossary

| Term | Definition |
|------|------------|
| **Administrator** | User role with full system access, including user management, claim approval, and audit log viewing |
| **Technician** | User role with limited access to submit transfers/claims and view own data |
| **Internal Transfer** | Documentation of part movement between technicians, locations, or jobs |
| **Warranty Claim** | Formal request to process warranty for defective Trane parts |
| **SSID** | Site or job identifier used for tracking purposes |
| **Trane** | HVAC manufacturer; warranty claims must adhere to Trane policies |
| **Serial Number** | Unique identifier for parts; mandatory for warranty claims per Trane requirements |
| **bcrypt** | Cryptographic hash function used for password hashing |
| **JWT** | JSON Web Token; used for stateless session management |
| **RBAC** | Role-Based Access Control; authorization model |
| **XSS** | Cross-Site Scripting; web security vulnerability |
| **SQL Injection** | Database security vulnerability |
| **HTTPS** | Hypertext Transfer Protocol Secure; encrypted HTTP |
| **HSTS** | HTTP Strict Transport Security; enforces HTTPS |
| **CSP** | Content Security Policy; restricts resource loading |
| **RTO** | Recovery Time Objective; maximum acceptable downtime |
| **RPO** | Recovery Point Objective; maximum acceptable data loss |
| **FCP** | First Contentful Paint; performance metric |
| **LCP** | Largest Contentful Paint; performance metric |
| **TTI** | Time to Interactive; performance metric |
| **CDN** | Content Delivery Network; edge caching for static assets |
| **ORM** | Object-Relational Mapping; Prisma in this case |
| **Prisma** | TypeScript ORM for database operations |
| **NextAuth.js** | Authentication library for Next.js |
| **Resend** | Email service provider option |
| **SendGrid** | Email service provider option |
| **AWS SES** | Amazon Simple Email Service; email provider option |
| **S3** | Amazon Simple Storage Service; object storage |

---

## 20. Conclusion & Next Steps

### FRS Completeness

This Functional Requirements Specification fully captures all capabilities defined in `APP_DESCRIPTION.md` with:
- **80+ Functional Requirements** covering all 7 core capability domains
- **23 Non-Functional Requirements** for performance, security, scalability, and reliability
- **10 Explicit Non-Requirements** documenting out-of-scope items
- **100% Traceability** to App Description with no scope expansion or contradictions

### FRS Status

**Current Status**: ✅ **DRAFT COMPLETE - AWAITING FM REVIEW**

**Pending Actions**:
1. **FM Review**: FM to validate governance compliance and completeness (Section 17)
2. **Human Approval**: Johan Ras to approve FRS as foundation for architecture
3. **Version 1.0**: Upon FM + human approval, update status to "Approved" and version to 1.0

### Next Phase: Architecture Completion (Phase 4.3)

**After FRS Approved**:
- Phase 4.3: Architecture Completion
  - Overhaul existing architecture to align with this FRS
  - Gap analysis: Identify missing components
  - Component specifications derived from FR requirements
  - Data model finalization per Section 16.2
  - Integration point specifications per Section 16.3
  - Architecture will explicitly reference this FRS for traceability

- Phase 4.4: QA-to-Red
  - Create comprehensive test plan from Section 15
  - Write tests for all FR acceptance criteria
  - Verify all tests RED before implementation
  - Zero test debt mandate enforced

- Phase 4.5: Implementation Plan
  - Wave planning based on architecture and FRS
  - Builder assignment per FM governance
  - Build-to-Green execution

### Success Criteria (Revisited)

**This FRS is successful when**:
- ✅ FRS document exists at `docs/functional/PARTPULSE_FUNCTIONAL_SPEC.md`
- ✅ Explicit derivation from App Description documented (Section 0)
- ✅ All functional requirements complete with IDs, sources, acceptance criteria (Sections 3-11)
- ✅ Cross-cutting requirements documented (Section 12)
- ✅ Non-requirements explicitly listed (Section 13)
- ✅ Traceability matrix complete (Section 14)
- ⏳ FM approval documented (Section 17) - **PENDING**
- ⏳ Human owner (Johan) approval documented (Section 17) - **PENDING**
- ⏳ Ready to serve as foundation for Phase 4.3 (Architecture Completion) - **PENDING APPROVAL**

---

**Document Status**: ✅ **DRAFT COMPLETE - AWAITING REVIEW**  
**Canonical Source**: Derived from `APP_DESCRIPTION.md`  
**Governance Compliance**: Satisfies `APP_DESCRIPTION_REQUIREMENT_POLICY.md` and `ARCHITECTURE_COMPILATION_CONTRACT.md`  
**FRS Version**: 1.0 (Draft)  
**Date**: 2026-01-13  
**Total Requirements**: 80+ Functional (FR-*) + 23 Non-Functional (NFR-*) + 10 Non-Requirements (NR-*)

---

*END OF PARTPULSE FUNCTIONAL REQUIREMENTS SPECIFICATION*
