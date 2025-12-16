# PartPulse - Application Description

## Purpose

PartPulse is a production-grade web application designed to streamline Trane part distribution management and warranty processing workflows. The application enables technicians and administrators to track internal part transfers, process warranty claims, manage employee access, generate compliance reports, and maintain comprehensive audit trails for regulatory compliance.

PartPulse replaces manual paper-based processes with a secure, mobile-first digital workflow that reduces errors, improves traceability, and accelerates warranty claim processing.

### Core Value Propositions

1. **Operational Efficiency**: Digitize manual part tracking and warranty claim processes
2. **Compliance & Auditability**: Complete audit trails for all transactions and approvals
3. **Mobile-First Access**: Field technicians can submit transfers and claims from any device
4. **Automated Documentation**: Generate professional PDFs matching Trane brand standards
5. **Role-Based Security**: Granular access controls protect sensitive operational data

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

**Out of Scope (Future Phases):**
- External customer-facing warranty portal
- Integration with external ERP/inventory systems
- Real-time inventory tracking and stock levels
- Shipping and logistics integration
- Mobile app (native iOS/Android)
- Offline functionality
- Multi-language support
- Barcode/QR code scanning

---

## Users & Roles

### Role: Administrator

**Primary Responsibilities:**
- Oversee system operations and user management
- Process and approve warranty claims
- Generate organizational reports
- Configure system settings
- Monitor security and audit logs

**Access Rights:**
- **User Management**: Full CRUD on all users; invite new admins and technicians; reset passwords
- **Internal Transfers**: View, edit, and delete all transfers (own and others')
- **Warranty Claims**: View, edit, approve/reject all claims; add admin signatures and stamps
- **Reports**: Access all organizational reports with full data visibility
- **Audit Logs**: Read-only access to complete audit trail
- **Settings**: Configure system preferences and security settings
- **Employee Management**: View, edit, and deactivate employee accounts

**Typical Users:**
- Operations managers
- IT administrators
- Warranty department staff
- Compliance officers

### Role: Technician

**Primary Responsibilities:**
- Submit internal part transfers
- File warranty claims for defective parts
- Track own submissions
- View personal activity reports

**Access Rights:**
- **User Management**: None (cannot invite or manage users)
- **Internal Transfers**: Create, view, and edit own transfers; read-only view of others' transfers
- **Warranty Claims**: Create, view, and edit own claims; read-only view of others' claims
- **Reports**: View reports filtered to own data only
- **Audit Logs**: None
- **Settings**: None
- **Employee Management**: View own profile only

**Typical Users:**
- Field technicians
- Service technicians
- Installation crews
- Maintenance staff

### Authentication & Session Management

- **Authentication Method**: Email + password (NextAuth.js with JWT sessions)
- **Session Duration**: 8 hours with automatic timeout
- **Password Requirements**: Minimum 16 characters, at least 1 uppercase, 1 number, 1 special character
- **Failed Login Protection**: Account lockout after 5 failed attempts (15-minute lockout)
- **Invitation Expiry**: 7 days for new user invitations
- **Password Reset**: Admin-initiated password reset generates temporary password

---

## Core Workflows

### Workflow 1: Internal Part Transfer

**Purpose**: Record and track the movement of parts between technicians, locations, or jobs.

**Actors**: Technician (submitter), Admin (viewer/approver)

**Trigger**: Technician needs to document part movement for inventory tracking or job transfers

**Steps:**

1. **Initiate Transfer**
   - Technician navigates to Internal Transfer page
   - Clicks "New Transfer" or fills out form directly
   - Form loads with current date/time pre-filled

2. **Fill Transfer Details**
   - **Date**: Transfer date (defaults to current date)
   - **SSID**: Site or job identifier (optional)
   - **Site Name**: Location name (optional)
   - **PO Number**: Purchase order reference (optional)
   - **Technician Name**: Pre-filled from user session
   - **Items Table**: Add one or more parts:
     - Quantity (number)
     - Part Number (text)
     - Description (text)
   - **Client Information** (optional):
     - Client Name
     - Client Date
     - Client Signature (digital signature capture)

3. **Validate & Submit**
   - Client-side validation ensures required fields completed
   - Server-side validation sanitizes inputs (XSS protection)
   - Data saved to database with unique transfer ID
   - System logs audit trail entry

4. **Generate PDF**
   - System generates transfer PDF with Trane branding
   - PDF includes all transfer details, parts table, and signatures
   - PDF stored and linked to transfer record

5. **Send Notifications**
   - Email receipt sent to technician
   - Admin notification for high-value transfers (if configured)

6. **View/Download**
   - Technician redirected to transfer detail page
   - Can download PDF, view details, or submit another transfer
   - Admin can add admin signature/stamp for approval

**Data Outputs:**
- Transfer record in database
- PDF document (downloadable)
- Email receipt
- Audit log entry

**Success Criteria:**
- Transfer saved with unique ID
- PDF generated and accessible
- Email sent successfully
- No data validation errors

---

### Workflow 2: Warranty Claim Submission & Processing

**Purpose**: Submit and process warranty claims for defective Trane parts in accordance with Trane's warranty policies.

**Actors**: Technician (submitter), Admin (reviewer/approver)

**Trigger**: Technician discovers defective part covered under warranty

**Steps:**

1. **Initiate Claim** (Technician)
   - Technician navigates to Warranty Claims page
   - Clicks "New Claim"
   - Form loads matching official Trane Warranty Parts Claims Form

2. **Complete General Information** (Technician)
   - **Date**: Claim submission date
   - **Chiller Model**: Model number of equipment
   - **Chiller Serial**: Serial number of equipment
   - **Job Number/SSID**: Job site identifier
   - **Building Name**: Location of installation (optional)
   - **Site Name**: Site name
   - **Attended By**: Technician name (pre-filled)

3. **Add Failed Parts** (Technician)
   - For each failed part, add row to parts table:
     - **Part Number**: Trane part number
     - **Quantity**: Number of parts claimed
     - **Serial Number (Failed)**: Serial of failed part (mandatory)
     - **Serial Number (Replaced)**: Serial of replacement part
     - **Date of Failure**: When part failed
     - **Date of Repair**: When repair was completed
   - Can add multiple parts to single claim

4. **Provide Additional Information** (Technician)
   - **Comments**: Detailed failure description and diagnostics
   - **Covered by Warranty**: Checkbox indicating warranty status
   - **Technician Signature**: Digital signature (optional)
   - **Photos**: Upload photos of failed parts (future feature)
   - **Service Reports**: Attach service reports (future feature)

5. **Validate & Submit** (Technician)
   - Form validation ensures all mandatory fields complete
   - Server sanitizes inputs and saves to database
   - Unique claim ID generated
   - Audit trail logged

6. **Generate Claim PDF** (System)
   - System generates PDF matching Trane Warranty Parts Claims Form
   - Includes Trane logos, red branding, and all claim details
   - PDF stored and linked to claim record

7. **Send Submission Confirmation** (System)
   - Email receipt sent to technician with claim ID
   - Admin notification sent for new claim
   - Claim enters "Submitted" status

8. **Review Claim** (Admin)
   - Admin navigates to Warranty Claims → View Claim
   - Reviews all claim details, parts, and documentation
   - Verifies serial numbers and warranty coverage
   - Checks for completeness and accuracy

9. **Process Decision** (Admin)
   - Admin navigates to Admin Processing page for claim
   - Options:
     - **Approve**: Claim is valid and will be processed
     - **Reject**: Claim is invalid or incomplete
   - Admin adds:
     - Admin signature
     - Processing date
     - Admin notes/comments
   - "PROCESSED" stamp added to PDF

10. **Regenerate PDF with Admin Details** (System)
    - PDF regenerated with admin signature and stamp
    - Updated PDF replaces previous version
    - Claim status updated to "Approved" or "Rejected"

11. **Send Decision Notification** (System)
    - Email sent to technician with decision
    - Includes updated PDF with admin approval
    - Audit log updated

12. **Claim Resolution** (Admin)
    - Admin updates claim with resolution details
    - Claim marked as "Resolved"
    - Final notification sent to technician

**Data Outputs:**
- Warranty claim record in database
- PDF document matching Trane form (with and without admin approval)
- Email notifications (submission, decision, resolution)
- Audit log entries for all state changes

**Success Criteria:**
- Claim saved with unique ID
- All mandatory fields validated
- PDF generated matching Trane brand standards
- Email notifications sent
- Admin review and approval captured
- Audit trail complete

**Important Notes (Per Trane Requirements):**
- Serial numbers mandatory for all claims
- Photos of failed parts recommended
- Service reports should be attached
- Warranty coverage must be verified before approval

---

### Workflow 3: Employee Invitation & Onboarding

**Purpose**: Enable administrators to invite new technicians and administrators to the system.

**Actors**: Admin (inviter), New User (invitee)

**Trigger**: Need to grant system access to new employee

**Steps:**

1. **Initiate Invitation** (Admin)
   - Admin navigates to Employees → Invite User
   - Enters new user's email address
   - Selects role: Technician or Administrator
   - Optionally adds welcome message

2. **Generate Invitation** (System)
   - System creates invitation record in database
   - Generates unique, cryptographically secure invitation token
   - Token expires after 7 days
   - Audit log entry created

3. **Send Invitation Email** (System)
   - Email sent to invitee with:
     - Welcome message from admin
     - Invitation link with token
     - Role information
     - Expiration notice (7 days)
     - Instructions for account setup

4. **Accept Invitation** (New User)
   - User clicks invitation link
   - Redirected to registration page
   - Token validated (checks expiry, usage, validity)
   - If expired or invalid, error message displayed

5. **Complete Registration** (New User)
   - User fills out registration form:
     - Full name
     - Password (must meet requirements)
     - Password confirmation
   - Form validates password strength
   - User acknowledges terms of use

6. **Activate Account** (System)
   - Password hashed with bcrypt (10 rounds)
   - User record created with selected role
   - Invitation marked as accepted
   - Session created for user
   - Audit log entry created

7. **Send Welcome Email** (System)
   - Welcome email sent to new user
   - Includes quick start guide
   - Links to key features

8. **Notify Admin** (System)
   - Admin receives confirmation that user activated account
   - Includes user name and role

**Data Outputs:**
- User record in database
- Invitation record (marked as accepted)
- Welcome email
- Admin notification
- Audit log entries

**Success Criteria:**
- User account created with correct role
- Password meets security requirements
- User can log in successfully
- Admin notified of activation

**Security Considerations:**
- Tokens are single-use and expire after 7 days
- Tokens are cryptographically random (not guessable)
- Email addresses validated before sending
- Password requirements enforced

---

### Workflow 4: Report Generation & Export

**Purpose**: Provide insights and analytics on transfers, warranty claims, and user activity.

**Actors**: Admin (full reports), Technician (own data reports)

**Trigger**: User needs visibility into operational metrics or historical data

**Steps:**

1. **Navigate to Reports** (User)
   - User clicks Reports in navigation
   - Reports dashboard loads with summary metrics

2. **Select Report Type** (User)
   - **Transfer Reports**:
     - Transfer list with filters (technician, status, date range)
     - Transfer statistics (counts by status, by technician)
     - Transfer trends over time
   - **Warranty Claims Reports**:
     - Claims list with filters (technician, status, date range)
     - Claims statistics (approval rate, average resolution time)
     - Top claimed parts
   - **User Activity Reports** (Admin only):
     - User login history
     - User submission counts
     - Active/inactive users

3. **Apply Filters** (User)
   - Date range picker: Start and end dates
   - Status filter: Pending, Approved, Rejected, etc.
   - Technician filter: Select specific technician (Admin only)
   - Sort options: Date, status, technician name

4. **View Results** (User)
   - Table displays matching records with pagination
   - Metrics cards show key statistics:
     - Total count
     - Approval rate (for claims)
     - Average processing time
     - Status breakdown
   - Charts visualize trends (if applicable)

5. **Export Report** (User)
   - Click "Export" button
   - Select format: PDF or CSV
   - System generates export file
   - File downloads to user's device

6. **Scheduled Reports** (Admin Only - Future)
   - Admin can schedule recurring reports
   - Reports emailed automatically on schedule
   - Configurable frequency and recipients

**Data Outputs:**
- Interactive report tables
- Exportable PDF reports
- Exportable CSV files
- Metrics and statistics

**Success Criteria:**
- Reports display accurate data
- Filters work correctly
- Export files generated successfully
- Role-based filtering enforced (technicians see only own data)

---

### Workflow 5: Admin Review & Approval (Warranty Claims)

**Purpose**: Enable administrators to review, approve/reject, and process warranty claims with proper documentation.

**Actors**: Admin

**Trigger**: Warranty claim submitted by technician and requires admin review

**Steps:**

1. **Access Claim Queue** (Admin)
   - Admin navigates to Warranty Claims
   - Views list of claims filtered by status: "Submitted"
   - Click on claim to review

2. **Review Claim Details** (Admin)
   - View all general information (chiller, site, technician)
   - Review parts table (part numbers, serials, dates)
   - Read failure comments and diagnostics
   - Verify warranty coverage checkbox
   - Check for required serial numbers

3. **Navigate to Admin Processing** (Admin)
   - Click "Admin Review" or "Process Claim" button
   - Redirected to admin processing interface

4. **Make Decision** (Admin)
   - Review claim completeness and validity
   - Decide: Approve or Reject
   - Add admin notes explaining decision
   - Add admin signature (digital or typed name)
   - Confirm processing date (auto-filled)

5. **Submit Decision** (Admin)
   - Click "Approve" or "Reject" button
   - System validates admin inputs
   - Claim status updated in database
   - Admin signature and date saved

6. **Regenerate PDF** (System)
   - PDF regenerated with admin information:
     - Admin signature
     - Admin date
     - "PROCESSED" stamp (red)
   - Updated PDF stored, previous version archived

7. **Send Notification** (System)
   - Email sent to technician with decision
   - Includes updated PDF with admin approval
   - Audit log entry created

8. **Follow-up Actions** (Admin - if needed)
   - If approved: Forward to warranty department for parts shipment
   - If rejected: Contact technician for additional information
   - Update claim with resolution details when completed

**Data Outputs:**
- Updated warranty claim record with admin decision
- Regenerated PDF with admin signature and stamp
- Email notification to technician
- Audit log entry

**Success Criteria:**
- Claim status updated correctly
- Admin signature captured
- PDF regenerated with admin details
- Email notification sent
- Audit trail complete

---

## Data Captured

### Internal Transfer Data Model

**Table: InternalTransfer**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | String (CUID) | Yes (auto) | Unique identifier | System generated |
| date | DateTime | Yes | Transfer date | Valid date, not future |
| ssid | String | No | Site or job identifier | Max 100 chars |
| siteName | String | No | Location name | Max 200 chars, sanitized |
| poNumber | String | No | Purchase order number | Max 50 chars |
| technicianId | String | Yes | Foreign key to User | Valid user ID |
| technician | User | Yes | User who created transfer | Relation |
| items | InternalTransferItem[] | Yes | Array of parts transferred | Min 1 item |
| clientName | String | No | Client/recipient name | Max 200 chars, sanitized |
| clientDate | DateTime | No | Client acknowledgment date | Valid date |
| clientSignature | String | No | Client signature data | Base64 or text |
| adminStamp | Boolean | No | Admin approval flag | Default: false |
| adminSignature | String | No | Admin signature data | Base64 or text |
| createdAt | DateTime | Yes (auto) | Record creation timestamp | System generated |
| updatedAt | DateTime | Yes (auto) | Last update timestamp | System maintained |

**Table: InternalTransferItem**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | String (CUID) | Yes (auto) | Unique identifier | System generated |
| transferId | String | Yes | Foreign key to InternalTransfer | Valid transfer ID |
| transfer | InternalTransfer | Yes | Parent transfer record | Relation |
| qty | Integer | Yes | Quantity of parts | Min: 1, Max: 9999 |
| partNo | String | Yes | Part number | Max 100 chars, required |
| description | String | Yes | Part description | Max 500 chars, sanitized |

**Business Rules:**
- Each transfer must have at least one item
- Technician ID must match authenticated user (for technician role)
- Admin can modify any transfer
- Technician can only edit own transfers
- Date cannot be in the future (configurable)

---

### Warranty Claim Data Model

**Table: WarrantyClaim**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | String (CUID) | Yes (auto) | Unique identifier | System generated |
| date | DateTime | Yes | Claim submission date | Valid date |
| chillerModel | String | No | Chiller model number | Max 100 chars |
| chillerSerial | String | No | Chiller serial number | Max 100 chars |
| ssidJobNumber | String | No | Job/SSID number | Max 100 chars |
| buildingName | String | No | Building name | Max 200 chars, sanitized |
| siteName | String | No | Site name | Max 200 chars, sanitized |
| technicianId | String | Yes | Foreign key to User | Valid user ID |
| technician | User | Yes | User who submitted claim | Relation |
| coveredByWarranty | Boolean | Yes | Warranty coverage flag | Required |
| comments | String | No | Failure details and notes | Max 5000 chars, sanitized |
| items | WarrantyItem[] | Yes | Array of claimed parts | Min 1 item |
| technicianSignature | String | No | Technician signature | Base64 or text |
| adminSignature | String | No | Admin signature | Base64 or text |
| adminStamp | Boolean | No | Processing flag | Default: false |
| createdAt | DateTime | Yes (auto) | Record creation timestamp | System generated |
| updatedAt | DateTime | Yes (auto) | Last update timestamp | System maintained |

**Table: WarrantyItem**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | String (CUID) | Yes (auto) | Unique identifier | System generated |
| claimId | String | Yes | Foreign key to WarrantyClaim | Valid claim ID |
| claim | WarrantyClaim | Yes | Parent claim record | Relation |
| partNo | String | Yes | Part number | Max 100 chars, required |
| quantity | Integer | Yes | Quantity claimed | Min: 1, Max: 999 |
| failedPartSerial | String | Yes | Serial of failed part | Max 100 chars, required |
| replacedPartSerial | String | Yes | Serial of replacement | Max 100 chars, required |
| dateOfFailure | DateTime | Yes | When part failed | Valid date, not future |
| dateOfRepair | DateTime | Yes | When repair completed | Valid date, >= dateOfFailure |

**Business Rules:**
- Each claim must have at least one item
- Serial numbers are mandatory per Trane requirements
- Date of repair must be on or after date of failure
- Technician ID must match authenticated user (for technician role)
- Admin can modify any claim
- Technician can only edit own claims before admin processes them

---

### User Data Model

**Table: User**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | String (CUID) | Yes (auto) | Unique identifier | System generated |
| name | String | No | User full name | Max 200 chars |
| email | String | Yes | Email address (login) | Valid email, unique |
| password | String | No | Hashed password | Bcrypt hash (nullable for OAuth) |
| role | String | Yes | User role | "admin" or "technician" |
| createdAt | DateTime | Yes (auto) | Account creation date | System generated |
| updatedAt | DateTime | Yes (auto) | Last update timestamp | System maintained |
| internalTransfers | InternalTransfer[] | - | User's transfers | Relation |
| warrantyClaims | WarrantyClaim[] | - | User's claims | Relation |

**Password Requirements:**
- Minimum 16 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character
- Hashed with bcrypt (salt rounds: 10)

---

### System Log Data Model

**Table: SystemLog**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | String (CUID) | Yes (auto) | Unique identifier | System generated |
| timestamp | DateTime | Yes (auto) | Event timestamp | System generated |
| eventType | String | Yes | Event category | Enum: submission, pdf_generation, admin_approval, auth_event, user_management |
| userId | String | No | User who triggered event | Valid user ID or null |
| userName | String | No | User name for display | Max 200 chars |
| action | String | Yes | Specific action taken | Max 200 chars |
| details | String | No | JSON string with details | Valid JSON or null |
| ipAddress | String | No | IP address of request | Valid IP format |
| userAgent | String | No | User agent string | Max 500 chars |
| success | Boolean | Yes | Action success status | Default: true |
| errorMessage | String | No | Error details if failed | Max 1000 chars |

**Logged Events:**
- User login/logout
- User creation/modification/deletion
- Internal transfer submission
- Warranty claim submission
- Admin approval/rejection actions
- PDF generation
- Email sending
- Settings changes
- Failed authentication attempts

**Retention Policy:**
- Minimum 7 years retention for audit compliance
- Logs are immutable (append-only)
- Indexed on: eventType, userId, timestamp

---

## Output Artifacts

### 1. Internal Transfer PDF

**Purpose**: Provide printable, professional documentation of part transfers for record-keeping and physical transfer validation.

**Format**: PDF (A4 size)

**Content Structure:**

**Header Section:**
- Company logo
- Document title: "Internal Transfer"
- Transfer ID (prominently displayed)
- Generation timestamp

**Transfer Information:**
- Date of transfer
- SSID/Job Number
- Site Name
- PO Number (if applicable)
- Technician Name

**Parts Table:**
- Column headers: Qty | Part No. | Description
- Row for each transferred item
- Totals row showing total quantity

**Client/Recipient Section:**
- Client Name
- Client Acknowledgment Date
- Client Signature field/data

**Admin Section (if processed):**
- Admin Signature
- Admin Stamp: "PROCESSED"
- Processing Date

**Footer:**
- Page number
- "Generated by PartPulse" branding
- Generation timestamp

**Design Specifications:**
- Brand Color: #FF2B00 (Trane Red)
- Margins: 25pt all sides
- Title Font: 16pt bold
- Section Headers: 12pt bold
- Body Text: 10pt
- Table Row Height: 28pt
- Professional, clean layout matching Trane brand guidelines

**Generation Triggers:**
- Automatically on transfer submission
- On-demand download from transfer detail page
- When admin adds approval stamp

**Storage:**
- PDFs stored in local filesystem or S3-compatible storage
- Configurable via STORAGE_PROVIDER environment variable
- Linked to transfer record in database

---

### 2. Warranty Claim PDF (Trane Form)

**Purpose**: Replicate official Trane Warranty Parts Claims Form for submission to warranty department.

**Format**: PDF (A4 size)

**Content Structure:**

**Header Section:**
- Trane red circle logo (left)
- "TRANE" text
- "TRANE TECHNOLOGIES" logo
- Centered title: "TRANE WARRANTY PARTS CLAIMS FORM"

**General Information:**
- DATE
- CHILLER MODEL
- CHILLER SERIAL NUMBER
- JOB NUMBER / SSID #
- BUILDING NAME
- SITE NAME
- ATTENDED BY (Technician Name)

**Parts Table:**
Columns:
- Part No.
- Qty
- Serial Number for Failed Parts
- Serial Number for Replaced Part
- Date of Failure
- Date of Repair

Rows for each claimed part with proper formatting

**Additional Information:**
- Comments (large text area with failure description)
- Warranty Coverage checkbox (checked/unchecked)

**Important Notes Section:**
Three bullet points:
- Need Serial Number to be able to make a claim (Mandatory).
- Provide Photos of Failed Parts.
- Provide Service Reports for Failed Parts.

**Admin Processing Section (when processed):**
- Red "PROCESSED" stamp (matching Trane red #FF2B00)
- Admin Signature
- Admin Date
- Admin Notes (if applicable)

**Footer:**
- Page number
- Generated timestamp

**Design Specifications:**
- Exact match to official Trane Warranty Parts Claims Form
- Fonts: Arial/Helvetica
- Colors: Black text + Trane Red (#FF2B00 or #EE3124)
- Logo files: `/public/assets/logo/trane-logo.svg` and `/public/assets/logo/trane-tech-logo.svg`
- Professional layout with proper spacing and alignment
- Margins: 25pt all sides
- Title font: 16pt bold
- Section headers: 12pt bold
- Table headers: 11pt bold
- Body text: 10pt
- Table row height: 28pt

**Generation Triggers:**
- Automatically on claim submission
- Regenerated when admin processes claim (adds signature/stamp)
- On-demand download from claim detail page

**Storage:**
- PDFs stored in local filesystem or S3-compatible storage
- Configurable via STORAGE_PROVIDER environment variable
- Linked to warranty claim record in database
- Previous versions archived when regenerated

---

### 3. Email Notifications

PartPulse sends HTML-formatted emails for key workflow events using a branded template system.

#### Email Template System

**Template Structure:**
- Company logo header
- Primary content area with branded colors
- Call-to-action buttons (Trane red #FF2B00)
- Footer with system information

**Helper Functions** (lib/email/templates.ts):
- `createEmailTemplate()`: Branded HTML email wrapper
- `createInfoRow()`: Key-value information display
- `createButton()`: Branded CTA button
- `createTable()`: Data table formatting
- `createStatusBadge()`: Status indicators
- `createInfoBox()`: Highlighted information boxes

#### Email Types:

**A. Internal Transfer Receipt Email**

**Subject**: "Internal Transfer Confirmation - [Transfer ID]"

**Recipients**: Technician (submitter)

**Trigger**: Immediately after transfer submission

**Content:**
- Confirmation message
- Transfer ID
- Transfer date
- Items transferred (summary table)
- Link to view transfer details
- Link to download PDF
- Next steps information

**B. Warranty Claim Submission Email**

**Subject**: "Warranty Claim Submitted - [Claim ID]"

**Recipients**: Technician (submitter), Admin (notification)

**Trigger**: Immediately after claim submission

**Content:**
- Confirmation message
- Claim ID
- Submission date
- Parts claimed (summary)
- Link to view claim details
- Expected processing timeline
- Reminder about required documentation (photos, service reports)

**C. Warranty Claim Decision Email**

**Subject**: "Warranty Claim [Approved/Rejected] - [Claim ID]"

**Recipients**: Technician (submitter)

**Trigger**: When admin approves or rejects claim

**Content:**
- Approval/rejection notification
- Claim ID
- Admin decision date
- Admin notes/comments
- Next steps (if approved: parts shipment info; if rejected: resubmission instructions)
- Link to view updated claim with admin signature
- Link to download updated PDF

**D. User Invitation Email**

**Subject**: "You're invited to PartPulse"

**Recipients**: New user (invitee)

**Trigger**: When admin invites new user

**Content:**
- Welcome message from admin
- Invitation to join PartPulse
- Role information (Technician or Admin)
- Secure invitation link with token
- Expiration notice (7 days)
- Instructions for completing registration
- Contact information for support

**E. Welcome Email (Post-Registration)**

**Subject**: "Welcome to PartPulse"

**Recipients**: New user (after accepting invitation)

**Trigger**: After user completes registration

**Content:**
- Welcome message
- Quick start guide
- Links to key features:
  - Submit Internal Transfer
  - Submit Warranty Claim
  - View Reports
- Support contact information
- Tips for getting started

**F. Admin Notification - New User Activated**

**Subject**: "New User Activated - [User Name]"

**Recipients**: Admin who sent invitation

**Trigger**: When invitee completes registration

**Content:**
- Notification that user activated account
- User name and email
- Assigned role
- Account activation date

**Email Service Configuration:**
- **Provider**: Resend, SendGrid, or AWS SES compatible
- **From Address**: Configurable via EMAIL_DOMAIN environment variable
- **Retry Logic**: 3 attempts with exponential backoff
- **Failure Logging**: All email failures logged to system log
- **Queue**: Simple in-memory queue (MVP), scalable to Redis/SQS for production

---

### 4. Reports & Exports

#### Report Dashboard (Main Reports Page)

**Purpose**: Provide at-a-glance metrics and access to detailed reports.

**Content:**

**Summary Metrics Cards:**
- Total Transfers (current month)
- Total Warranty Claims (current month)
- Approval Rate (for claims)
- Average Processing Time (for claims)

**Quick Filters:**
- Date Range Picker
- Status Filter
- Technician Filter (Admin only)

**Report Sections:**
- Internal Transfers Table
- Warranty Claims Table

#### Internal Transfers Report

**Columns:**
- Transfer ID
- Date
- Technician
- Site Name
- Items Count
- Status (if applicable)
- Actions (View, Download PDF)

**Filters:**
- Date Range: Start Date to End Date
- Technician: Dropdown (Admin sees all; Technician sees self only)
- Status: Pending, Completed, etc.
- Sort: By Date (asc/desc), Technician name (asc/desc)

**Pagination:**
- 30 items per page (configurable)
- Next/Previous buttons
- Page number display

**Export Options:**
- **PDF**: Formatted report with summary and table
- **CSV**: Raw data export for further analysis in Excel

#### Warranty Claims Report

**Columns:**
- Claim ID
- Date Submitted
- Technician
- Chiller Model/Serial
- Parts Count
- Status (Submitted, Approved, Rejected, Resolved)
- Actions (View, Download PDF)

**Filters:**
- Date Range: Start Date to End Date
- Technician: Dropdown (Admin sees all; Technician sees self only)
- Status: Submitted, Approved, Rejected, Resolved
- Sort: By Date (asc/desc), Status, Technician name

**Metrics:**
- Total Claims
- Approval Rate: (Approved / Total) × 100%
- Rejection Rate: (Rejected / Total) × 100%
- Average Resolution Time: Average days from submission to resolution

**Pagination:**
- 30 items per page (configurable)
- Next/Previous buttons
- Page number display

**Export Options:**
- **PDF**: Formatted report with metrics and table
- **CSV**: Raw data export for further analysis

#### User Activity Report (Admin Only)

**Purpose**: Track user actions and system usage.

**Columns:**
- User Name
- Role
- Last Login
- Total Transfers Submitted
- Total Claims Submitted
- Account Status (Active/Inactive)

**Filters:**
- Role: Admin, Technician, All
- Status: Active, Inactive, All
- Date Range: For activity period

**Export Options:**
- **CSV**: User activity data export

#### System Audit Report (Admin Only)

**Purpose**: Complete audit trail for compliance and forensic analysis.

**Columns:**
- Timestamp
- User
- Event Type
- Action
- Details
- IP Address
- Success/Failure

**Filters:**
- Date Range: Start Date to End Date
- Event Type: Submission, PDF Generation, Admin Approval, Auth Event, User Management
- User: Dropdown of all users
- Success Status: Success, Failure, All

**Search:**
- Full-text search across action and details fields

**Export Options:**
- **CSV**: Complete audit log export for compliance reporting

**Retention:**
- Minimum 7 years for compliance
- Exportable at any time
- Immutable records

---

## Auditability Expectations

PartPulse implements comprehensive audit logging to meet regulatory compliance requirements and enable forensic analysis.

### Audit Logging Principles

1. **Completeness**: All state-changing operations are logged
2. **Immutability**: Audit logs cannot be modified or deleted
3. **Traceability**: Every action is attributed to a user
4. **Tamper Evidence**: Timestamps and user attribution prevent repudiation
5. **Accessibility**: Admins can search and export audit logs

### Logged Events

**Authentication Events:**
- User login (successful and failed attempts)
- User logout
- Session timeout
- Password reset requests
- Account lockouts (after failed login attempts)

**User Management Events:**
- User creation (invitation sent)
- User activation (invitation accepted)
- User modification (role changes, profile updates)
- User deactivation/deletion
- Password resets (admin-initiated)

**Internal Transfer Events:**
- Transfer submission
- Transfer modification
- Transfer deletion (admin only)
- PDF generation
- Admin approval/stamping

**Warranty Claim Events:**
- Claim submission
- Claim modification
- Claim review (admin view)
- Claim approval/rejection
- Claim resolution
- PDF generation
- PDF regeneration with admin signature

**Email Events:**
- Email sent (type and recipient)
- Email failure (with error details)

**System Events:**
- Settings changes
- System errors
- Security events (failed authentication, suspicious activity)

### Audit Log Fields

Each audit log entry captures:

| Field | Description | Example |
|-------|-------------|---------|
| Timestamp | Exact date and time of event | 2024-12-16T13:45:22.123Z |
| Event Type | Category of event | "submission", "admin_approval" |
| User ID | ID of user who performed action | "cln123abc456" |
| User Name | Name of user for readability | "John Smith" |
| Action | Specific action taken | "WARRANTY_CLAIM_APPROVED" |
| Details | JSON with additional context | {"claimId": "xyz", "decision": "approved"} |
| IP Address | Source IP of request | "192.168.1.100" |
| User Agent | Browser/device information | "Mozilla/5.0..." |
| Success | Whether action succeeded | true/false |
| Error Message | Error details if failed | "Database connection timeout" |

### Audit Log Access

**Admin Access:**
- Full audit log viewing via Settings → Admin → System Logs
- Search and filter capabilities
- Export to CSV for external analysis
- Date range selection
- Event type filtering

**Technician Access:**
- None (technicians cannot view audit logs)

### Retention Policy

- **Minimum Retention**: 7 years (configurable)
- **Storage**: Database (SystemLog table)
- **Backup**: Included in database backups
- **Export**: Admins can export logs at any time
- **Immutability**: Logs are append-only; no updates or deletes

### Compliance Support

PartPulse audit logs support compliance with:

- **ISO 9001**: Quality management system traceability
- **ISO 27001**: Information security management
- **SOC 2**: Security, availability, and confidentiality controls
- **GDPR**: Data processing records (where applicable)
- **Internal Policies**: Company-specific audit requirements

### Audit Log Search & Filtering

**Available Filters:**
- Date Range: Specific start and end dates
- Event Type: Filter by category
- User: Filter by specific user
- Success Status: Show only successes or failures
- Text Search: Search action and details fields

**Export Formats:**
- CSV: For analysis in Excel or BI tools
- JSON: For programmatic processing

### Security Events Dashboard (Admin Only)

**Purpose**: Monitor security-related events for threat detection.

**Displayed Metrics:**
- Failed login attempts (last 24 hours)
- Locked accounts
- Password reset requests
- Role changes
- User deletions

**Alerts:**
- Excessive failed logins from single IP
- Multiple role changes in short period
- Unusual access patterns

---

## Security Expectations

PartPulse implements defense-in-depth security controls to protect sensitive operational data and maintain system integrity.

### Authentication Security

**Password Security:**
- **Hashing**: bcrypt with salt rounds: 10
- **Requirements**: Minimum 16 characters, 1 uppercase, 1 number, 1 special character
- **Validation**: Client-side and server-side enforcement
- **Storage**: Never stored in plain text; only hashed values in database

**Session Management:**
- **Provider**: NextAuth.js v5 with JWT sessions
- **Duration**: 8-hour session timeout
- **Token Security**: Signed and encrypted JWTs
- **Cookie Attributes**:
  - HttpOnly: Prevents JavaScript access
  - Secure: HTTPS only in production
  - SameSite: Strict (CSRF protection)
- **Refresh**: Automatic token refresh for active sessions
- **Logout**: Immediate session invalidation

**Brute Force Protection:**
- **Lockout Threshold**: 5 failed login attempts
- **Lockout Duration**: 15 minutes
- **Tracking**: By user account and IP address
- **Logging**: All failed attempts logged to audit trail
- **Admin Notification**: Alert on excessive failed attempts

### Authorization Security

**Role-Based Access Control (RBAC):**
- **Roles**: Admin, Technician (extensible for future roles)
- **Enforcement**: Server-side validation on all API routes
- **Middleware**: Next.js middleware protects routes before request reaches handler
- **Client-Side**: UI elements hidden based on role (UX only, not security boundary)

**Access Patterns:**
- **Admin**: Full CRUD on all resources
- **Technician**: Create own records, read own and others' (read-only), update own records only
- **Resource Ownership**: Server validates user owns resource before allowing modifications

**API Security:**
- **Authentication Required**: All API routes require valid session (except login/public endpoints)
- **Authorization Checks**: Role and ownership validated on every request
- **Error Handling**: Generic error messages prevent information disclosure

### Data Security

**Input Validation:**
- **Client-Side**: Zod schemas validate all form inputs before submission
- **Server-Side**: Zod schemas re-validate all inputs (never trust client)
- **Type Safety**: TypeScript enforces type correctness across entire stack
- **Sanitization**: All string inputs sanitized to prevent XSS attacks

**XSS (Cross-Site Scripting) Protection:**
- **React Escaping**: React automatically escapes rendered content
- **Sanitization**: Additional HTML entity encoding on user inputs
- **Content Security Policy (CSP)**: Headers restrict script sources
- **Dangerous HTML**: Never use dangerouslySetInnerHTML without sanitization

**SQL Injection Protection:**
- **ORM**: Prisma ORM parameterizes all queries
- **No Raw SQL**: Avoid raw SQL queries; use Prisma's type-safe query builder
- **Input Validation**: All inputs validated before database operations

**CSRF (Cross-Site Request Forgery) Protection:**
- **SameSite Cookies**: Cookies set with SameSite=Strict
- **Token Validation**: CSRF tokens required for state-changing operations
- **Origin Checking**: Server validates request origin

**Secrets Management:**
- **Environment Variables**: All secrets stored in .env files (not committed to git)
- **Production**: Use platform secret managers (Vercel Environment Variables, AWS Secrets Manager, etc.)
- **Rotation**: Regular rotation of secrets per SECRET_ROTATION.md guide
- **Access Control**: Secrets accessible only to authorized personnel

### Network Security

**HTTPS Enforcement:**
- **Production**: HTTPS required for all connections
- **HSTS Header**: Strict-Transport-Security header enforces HTTPS
- **Secure Cookies**: Cookies marked as Secure (HTTPS only)
- **Redirect**: HTTP requests redirected to HTTPS

**Security Headers:**
- **X-Frame-Options**: Prevents clickjacking attacks (DENY or SAMEORIGIN)
- **X-Content-Type-Options**: Prevents MIME sniffing (nosniff)
- **X-XSS-Protection**: Browser XSS filter enabled
- **Content-Security-Policy**: Restricts resource loading to trusted sources
- **Referrer-Policy**: Controls referrer information leakage

**Rate Limiting:**
- **API Routes**: Rate limiting prevents brute force and DoS attacks
- **Thresholds**: Configurable per endpoint (e.g., 100 requests/15 minutes)
- **Tracking**: By IP address
- **Response**: HTTP 429 Too Many Requests when exceeded

### Data Privacy

**User Data Isolation:**
- **Technicians**: Can only access own data (transfers, claims)
- **Admins**: Access all data (with audit logging)
- **Database Queries**: Automatically filtered by user ID for technicians

**Sensitive Data Handling:**
- **PII Minimization**: Collect only necessary personal information
- **No Logging of PII**: User passwords, tokens, and sensitive fields never logged
- **Encryption at Rest**: Database encryption (configurable)
- **Encryption in Transit**: HTTPS for all communications

**Data Retention:**
- **Audit Logs**: Minimum 7 years
- **User Data**: Retained while account active; retained 7 years after deletion for compliance
- **Deletion Requests**: Support for data deletion requests (configurable per jurisdiction)

### Vulnerability Management

**Dependency Security:**
- **Automated Scanning**: npm audit run regularly
- **Updates**: Dependencies updated regularly with security patches
- **Monitoring**: Dependabot alerts for vulnerable dependencies
- **Testing**: QA checks run before deploying updates

**Security Testing:**
- **ESLint Security Rules**: Static analysis for common vulnerabilities
- **CodeQL Scanning**: Automated security scanning via GitHub Actions
- **Manual Review**: Code reviews focus on security concerns

**Incident Response:**
- **Logging**: Comprehensive logs enable forensic analysis
- **Monitoring**: Admin dashboard for security event monitoring
- **Alerting**: Notifications for suspicious activity
- **Escalation**: Contact information for security team

### Secure Development Practices

**Code Quality:**
- **TypeScript**: 100% TypeScript (no `any` types)
- **Linting**: ESLint enforces security and quality rules
- **Testing**: Automated tests for critical security paths
- **Reviews**: Code reviews required for all changes

**Secret Management:**
- **No Hardcoded Secrets**: All secrets in environment variables
- **Git Ignore**: .env files excluded from version control
- **Rotation**: Regular secret rotation per SECRET_ROTATION.md

**Security Awareness:**
- **Documentation**: SECURITY.md describes security policies
- **Training**: Developers trained on secure coding practices
- **Threat Modeling**: Security considered during design phase

### Reporting Security Issues

**Contact**: security@example.com (configurable)

**Process:**
1. Report vulnerabilities via email (not public GitHub issues)
2. Security team acknowledges within 24 hours
3. Vulnerability assessed and prioritized
4. Fix developed and tested
5. Patch deployed to production
6. Reporter notified of resolution
7. Disclosure coordinated with reporter (responsible disclosure)

### Security Monitoring

**Admin Security Dashboard** (Settings → Admin → Security):
- Failed login attempts (last 24 hours)
- Locked accounts
- Recent role changes
- Suspicious activity alerts
- System health metrics

**Logged Security Events:**
- Failed authentication attempts
- Account lockouts
- Password resets
- Role changes
- User deletions
- Unusual access patterns
- API rate limit violations

### Compliance & Standards

PartPulse security controls support compliance with:

- **ISO 27001**: Information security management
- **SOC 2 Type II**: Security, availability, confidentiality controls
- **OWASP Top 10**: Protection against common web vulnerabilities
- **NIST Cybersecurity Framework**: Security best practices

---

## Technical Architecture Summary

### Technology Stack

**Frontend:**
- Framework: Next.js 16 (App Router)
- UI Library: React 19
- Language: TypeScript
- Styling: Tailwind CSS 4
- Forms: React Hook Form
- Validation: Zod
- State Management: React Context + Server Components

**Backend:**
- API: Next.js API Routes
- Authentication: NextAuth.js v5
- Database ORM: Prisma
- Database: SQLite (development), PostgreSQL (production)
- Email: Resend/SendGrid/AWS SES compatible
- PDF Generation: Custom template engine
- Storage: Local filesystem or S3-compatible storage

**Security:**
- Rate Limiting: Custom middleware
- CSRF Protection: Token-based validation
- Security Headers: Next.js middleware
- Input Sanitization: Custom utilities
- Session Management: JWT with httpOnly cookies

**Infrastructure:**
- Hosting: Vercel (MVP), Docker/self-hosted (production)
- Database: SQLite/PostgreSQL
- Storage: Local filesystem or S3
- CDN: Vercel Edge Network or CloudFront
- Monitoring: Vercel Analytics or custom

### Deployment Model

**Current (MVP):**
- Platform: Vercel
- Database: SQLite (local)
- Storage: Vercel Edge Functions
- Auto-deploy from main branch

**Production Migration:**
- Platform: AWS/Azure/Self-hosted
- Database: PostgreSQL with connection pooling
- Storage: S3/Azure Blob
- Containerization: Docker
- Orchestration: Kubernetes or ECS (for scale)

### Performance Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| Average Response Time | < 200ms | > 500ms |
| 95th Percentile Response Time | < 500ms | > 1000ms |
| First Contentful Paint (FCP) | < 1.5s | > 2.5s |
| Largest Contentful Paint (LCP) | < 2.5s | > 4.0s |
| Time to Interactive (TTI) | < 3.0s | > 5.0s |
| Bundle Size (JS) | < 200KB gzipped | > 300KB |
| Bundle Size (CSS) | < 50KB gzipped | > 100KB |

### Scalability Considerations

- **Stateless Application**: No server-side session state (JWT-based)
- **Horizontal Scaling**: Application can run multiple instances
- **Database**: Connection pooling for concurrent requests
- **Caching**: In-memory cache for expensive reports (configurable)
- **CDN**: Static assets cached at edge locations

---

## Mobile-First Design

PartPulse is designed with mobile technicians as the primary user persona.

### Responsive Breakpoints

- **Mobile**: < 768px (primary focus)
- **Tablet**: 768px - 1023px
- **Desktop**: >= 1024px

### Mobile Features

**Touch-Optimized UI:**
- Large touch targets (minimum 44px × 44px)
- Swipe gestures for navigation
- No hover-dependent functionality
- Touch-friendly form inputs

**Mobile Forms:**
- Large input fields
- Mobile-optimized keyboards (type="email", type="tel", etc.)
- Minimal text input required
- Auto-complete and suggestions
- Camera integration for photo uploads (future)

**Mobile Navigation:**
- Collapsible sidebar on mobile
- Bottom navigation option (configurable)
- Swipe to open/close menu
- Breadcrumbs for deep navigation

**Performance on Mobile:**
- Fast initial load (< 3 seconds on 3G)
- Lazy loading of images and components
- Optimized bundle size
- Progressive Web App (PWA) ready

**Offline Capability (Future):**
- Service worker for offline access
- Local data caching
- Sync when connection restored

---

## Conclusion

PartPulse is a comprehensive, production-ready application designed to digitize and streamline Trane part distribution and warranty management workflows. With robust security controls, complete auditability, mobile-first design, and adherence to Trane brand standards, PartPulse provides a reliable, scalable foundation for operational excellence.

This application description serves as the authoritative definition of PartPulse's purpose, functionality, and expectations. All architecture decisions, feature implementations, and QA validations should align with this True North document.

**Document Version**: 1.0  
**Last Updated**: 2024-12-16  
**Status**: Complete - No TBD/TODO items
