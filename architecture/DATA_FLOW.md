# Data Flow Architecture

## Overview

This document defines the data flows for all major operations in PartPulse. Each flow shows how data moves through the system components, including validation, transformation, persistence, and side effects.

**Based on**: APP_DESCRIPTION.md workflows  
**Compliance**: Architecture Design Checklist - Phase 2: Data Architecture

---

## Data Flow Principles

1. **Unidirectional Flow**: Data flows in one direction through the system
2. **Validation at Boundaries**: Input validation occurs at trust boundaries
3. **Immutable Audit Trail**: All state changes are logged
4. **Eventual Consistency**: External notifications may be asynchronous
5. **Error Propagation**: Errors bubble up with context

---

## Core Data Flows

### 1. User Authentication Flow

**Trigger**: User submits login credentials

**Flow Diagram**:
```
┌─────────────┐
│ User enters │
│ credentials │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (Login Page)           │
│ - Client-side validation            │
│ - Password field masking            │
└──────┬──────────────────────────────┘
       │ POST /api/auth/signin
       │ { email, password }
       ▼
┌─────────────────────────────────────┐
│ NextAuth.js Middleware              │
│ - CSRF token validation             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Auth Component (NextAuth Provider)  │
│ - Credentials validation            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Query: User.findUnique(email)     │
└──────┬──────────────────────────────┘
       │ Returns user object (if found)
       ▼
┌─────────────────────────────────────┐
│ Auth Component                      │
│ - bcrypt.compare(password, hash)    │
│ - Validate password match           │
└──────┬──────────────────────────────┘
       │ If valid
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Update: User.lastLoginAt          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Auth Component                      │
│ - Generate JWT token                │
│ - Set httpOnly cookie               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: LOGIN success                │
│ - Capture: userId, IP, userAgent    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 200 OK                            │
│ - Set-Cookie: session token         │
│ - JSON: { user: { id, name, role }}│
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Redirect to dashboard             │
│ - Store session in client context   │
└─────────────────────────────────────┘
```

**Data Transformations**:
- Input: `{ email: string, password: string }`
- Query: User record from database
- Validation: Password hash comparison
- Output: JWT token + user session object
- Side effects: lastLoginAt update, audit log entry

**Error Scenarios**:
- Invalid email → 401 Unauthorized
- Invalid password → 401 Unauthorized
- Account locked → 403 Forbidden
- Database error → 500 Internal Server Error

---

### 2. Internal Transfer Submission Flow

**Trigger**: Technician submits internal transfer form

**Flow Diagram**:
```
┌─────────────┐
│ Technician  │
│ fills form  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (TransferForm)         │
│ - Client-side validation (Zod)      │
│ - Real-time error feedback          │
└──────┬──────────────────────────────┘
       │ POST /api/transfers
       │ { date, toLocation, partNumber, 
       │   quantity, items, ... }
       ▼
┌─────────────────────────────────────┐
│ Middleware (Auth)                   │
│ - Validate JWT session              │
│ - Extract user from token           │
└──────┬──────────────────────────────┘
       │ session.user
       ▼
┌─────────────────────────────────────┐
│ API Route (/api/transfers)          │
│ - Parse request body                │
│ - Server-side validation (Zod)      │
│ - Input sanitization (XSS)          │
└──────┬──────────────────────────────┘
       │ validated data
       ▼
┌─────────────────────────────────────┐
│ Middleware (RBAC)                   │
│ - Check: user can create transfer   │
│ - Validate: role permissions        │
└──────┬──────────────────────────────┘
       │ authorized
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Begin transaction                 │
│ - Create: InternalTransfer          │
│ - Create: TransferItems (array)     │
│ - Commit transaction                │
└──────┬──────────────────────────────┘
       │ transfer object
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: TRANSFER_CREATED             │
│ - Capture: userId, transferId       │
│ - Store: before/after state         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ PDF Component                       │
│ - Generate transfer PDF             │
│ - Apply Trane branding              │
└──────┬──────────────────────────────┘
       │ pdfBuffer
       ▼
┌─────────────────────────────────────┐
│ Storage Component                   │
│ - Upload: PDF to storage            │
│ - Key: pdfs/transfer-{id}.pdf       │
└──────┬──────────────────────────────┘
       │ pdfUrl
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Update: transfer.pdfUrl           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Email Component                     │
│ - Send transfer receipt             │
│ - To: technician email              │
│ - Attach: PDF link                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: EMAIL_SENT                   │
│ - Log: PDF_GENERATED                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 201 Created                       │
│ - JSON: { success: true,            │
│          data: transfer,            │
│          pdfUrl }                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Show success message              │
│ - Redirect to transfer detail page  │
│ - Option to download PDF            │
└─────────────────────────────────────┘
```

**Data Transformations**:
- Input: `{ date, toLocation, partNumber, quantity, items: [] }`
- Validation: Zod schema, sanitization
- Enrichment: Add userId, timestamp, generate transferNumber
- Persistence: InternalTransfer + InternalTransferItem records
- Generation: PDF buffer
- Storage: PDF file in S3/local
- Notification: Email with PDF link
- Output: Transfer object with pdfUrl

**Error Scenarios**:
- Validation failure → 400 Bad Request
- Unauthorized → 401 Unauthorized
- Forbidden (wrong role) → 403 Forbidden
- Database error → 500 Internal Server Error
- PDF generation failure → Log error, continue (PDF generation is non-critical)
- Email failure → Log error, continue (email is non-critical)

---

### 3. Warranty Claim Submission Flow

**Trigger**: Technician submits warranty claim

**Flow Diagram**:
```
┌─────────────┐
│ Technician  │
│ fills claim │
│    form     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (WarrantyForm)         │
│ - Validate: serial number required  │
│ - Validate: dates (past only)       │
│ - Client validation (Zod)           │
└──────┬──────────────────────────────┘
       │ POST /api/warranty-claims
       │ { partNumber, serialNumber,
       │   failureDescription, ... }
       ▼
┌─────────────────────────────────────┐
│ Middleware (Auth + RBAC)            │
│ - Validate session                  │
│ - Check permissions                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Route (/api/warranty-claims)    │
│ - Server validation                 │
│ - Sanitization                      │
│ - Warranty status check             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Create: WarrantyClaim             │
│ - Status: SUBMITTED                 │
│ - Generate: claimNumber             │
└──────┬──────────────────────────────┘
       │ claim object
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: CLAIM_SUBMITTED              │
│ - Capture: claim details            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ PDF Component                       │
│ - Generate Trane warranty form PDF  │
│ - Include: all claim details        │
│ - Include: Trane branding           │
└──────┬──────────────────────────────┘
       │ pdfBuffer
       ▼
┌─────────────────────────────────────┐
│ Storage Component                   │
│ - Upload: PDF to storage            │
│ - Key: pdfs/claim-{id}.pdf          │
└──────┬──────────────────────────────┘
       │ pdfUrl
       ▼
┌─────────────────────────────────────┐
│ Email Component                     │
│ - Send to: technician (confirmation)│
│ - Send to: admin (new claim alert)  │
│ - Include: PDF link                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 201 Created                       │
│ - JSON: { claim, pdfUrl }           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Show success + claim number       │
│ - Redirect to claim detail          │
└─────────────────────────────────────┘
```

**Data Transformations**:
- Input: Warranty claim form data
- Validation: Serial number mandatory, dates in past
- Enrichment: claimNumber, submittedById, timestamp
- Persistence: WarrantyClaim record
- Output: Claim object with status SUBMITTED

**Error Scenarios**:
- Missing serial number → 400 Bad Request
- Invalid dates → 400 Bad Request
- Duplicate serial number (potential) → Warning, allow
- Authorization failure → 403 Forbidden

---

### 4. Warranty Claim Admin Review Flow

**Trigger**: Admin reviews and approves/denies claim

**Flow Diagram**:
```
┌─────────────┐
│ Admin views │
│ claim list  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (ClaimList)            │
│ - Load: claims with SUBMITTED status│
│ - Display: claim details            │
└──────┬──────────────────────────────┘
       │ Admin clicks "Review"
       ▼
┌─────────────────────────────────────┐
│ UI Component (ClaimReviewPage)      │
│ - Display: full claim details       │
│ - Show: serial numbers, photos      │
│ - Form: admin decision + notes      │
└──────┬──────────────────────────────┘
       │ POST /api/warranty-claims/{id}/review
       │ { decision: 'APPROVED',
       │   reviewNotes: '...' }
       ▼
┌─────────────────────────────────────┐
│ Middleware (Auth + RBAC)            │
│ - Validate: user is ADMIN           │
│ - Reject if not admin               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Route                           │
│ - Validate: claim exists            │
│ - Validate: claim in reviewable state│
│ - Validate: decision is valid       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Begin transaction                 │
│ - Load: current claim state         │
│ - Update: WarrantyClaim             │
│   - status → APPROVED/DENIED        │
│   - reviewerId → admin.id           │
│   - reviewDate → now()              │
│   - reviewNotes                     │
│ - Commit transaction                │
└──────┬──────────────────────────────┘
       │ updated claim
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: CLAIM_REVIEWED               │
│ - Capture: before/after state       │
│ - Store: admin decision             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ PDF Component                       │
│ - Regenerate PDF with admin stamp   │
│ - Add: "PROCESSED" stamp            │
│ - Add: Admin signature              │
│ - Add: Admin date                   │
└──────┬──────────────────────────────┘
       │ updatedPdfBuffer
       ▼
┌─────────────────────────────────────┐
│ Storage Component                   │
│ - Upload: Updated PDF               │
│ - Overwrite previous version        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Email Component                     │
│ - Send to: claim submitter          │
│ - Subject: Claim Decision           │
│ - Body: Approved/Denied + notes     │
│ - Attach: Updated PDF               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 200 OK                            │
│ - JSON: { claim, pdfUrl }           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Show success message              │
│ - Update claim status badge         │
│ - Refresh claim list                │
└─────────────────────────────────────┘
```

**Data Transformations**:
- Input: `{ decision: 'APPROVED' | 'DENIED', reviewNotes }`
- State change: SUBMITTED → APPROVED/DENIED
- Enrichment: reviewerId, reviewDate
- Audit: Before/after state captured
- Regeneration: PDF with admin approval
- Notification: Email to submitter

**Authorization Check**:
- ✅ Only ADMIN role can review claims
- ✅ Cannot review own claims (future enhancement)

---

### 5. User Invitation Flow

**Trigger**: Admin invites new user

**Flow Diagram**:
```
┌─────────────┐
│ Admin fills │
│ invite form │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (InviteForm)           │
│ - Input: email, role, message       │
│ - Validate: valid email format      │
└──────┬──────────────────────────────┘
       │ POST /api/users/invite
       │ { email, role, message }
       ▼
┌─────────────────────────────────────┐
│ Middleware (Auth + RBAC)            │
│ - Validate: user is ADMIN           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Route                           │
│ - Validate input                    │
│ - Check: email not already invited  │
│ - Check: email not existing user    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Auth Component                      │
│ - Generate: secure invitation token │
│ - Token: crypto.randomBytes(32)     │
└──────┬──────────────────────────────┘
       │ token
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Create: Invitation                │
│   - email, role, token              │
│   - invitedById                     │
│   - expiresAt: now() + 7 days       │
└──────┬──────────────────────────────┘
       │ invitation
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: USER_INVITED                 │
│ - Capture: invitee email, role      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Email Component                     │
│ - Send invitation email             │
│ - To: invitee email                 │
│ - Include: invitation link + token  │
│ - Include: role information         │
│ - Include: expiry date (7 days)     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 201 Created                       │
│ - JSON: { invitation }              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Show success message              │
│ - Display: invitation sent          │
└─────────────────────────────────────┘

       [7 days later or sooner]
       
┌─────────────┐
│ Invitee     │
│ clicks link │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (AcceptInvite Page)    │
│ - Load invitation by token          │
│ - Check: token not expired          │
│ - Show: password creation form      │
└──────┬──────────────────────────────┘
       │ POST /api/users/accept-invite
       │ { token, password, name }
       ▼
┌─────────────────────────────────────┐
│ API Route                           │
│ - Validate: token exists            │
│ - Validate: not expired             │
│ - Validate: not already accepted    │
│ - Validate: password strength       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Auth Component                      │
│ - Hash password (bcrypt, 10 rounds) │
└──────┬──────────────────────────────┘
       │ hashedPassword
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Begin transaction                 │
│ - Create: User                      │
│   - email, name, password, role     │
│ - Update: Invitation.acceptedAt     │
│ - Commit transaction                │
└──────┬──────────────────────────────┘
       │ user
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: USER_CREATED (via invitation)│
│ - Log: INVITATION_ACCEPTED          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Email Component                     │
│ - Send welcome email                │
│ - To: new user                      │
│ - Include: getting started guide    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 201 Created                       │
│ - JSON: { success: true }           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Show success message              │
│ - Redirect to login page            │
└─────────────────────────────────────┘
```

**Data Transformations**:
- Admin input: `{ email, role, message }`
- Token generation: Cryptographically secure random token
- Invitation creation: With expiry (7 days)
- Email: Invitation link with token
- User input: `{ token, password, name }`
- Password hashing: bcrypt
- User creation: New User record
- Invitation completion: acceptedAt timestamp

**Security Measures**:
- Token: 32-byte random, unique
- Expiry: 7 days from creation
- Single-use: acceptedAt prevents reuse
- Password: Hashed with bcrypt (10 rounds)

---

### 6. Report Generation Flow

**Trigger**: User requests transfer or warranty report

**Flow Diagram**:
```
┌─────────────┐
│ User selects│
│ report type │
│ + filters   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component (ReportsPage)          │
│ - Select: report type               │
│ - Input: date range, filters        │
│ - Click: Generate Report            │
└──────┬──────────────────────────────┘
       │ GET /api/reports/transfers
       │ ?from=2024-01-01&to=2024-12-31
       │ &status=COMPLETED&technician=123
       ▼
┌─────────────────────────────────────┐
│ Middleware (Auth + RBAC)            │
│ - Validate session                  │
│ - If TECHNICIAN: filter to own data │
│ - If ADMIN: allow all data          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Route (/api/reports/*)          │
│ - Parse query parameters            │
│ - Validate: date range              │
│ - Validate: filters                 │
│ - Apply: role-based filters         │
└──────┬──────────────────────────────┘
       │ query filters
       ▼
┌─────────────────────────────────────┐
│ Database Component                  │
│ - Query with filters:               │
│   WHERE date BETWEEN ? AND ?        │
│   AND status = ?                    │
│   AND technicianId = ? (if tech)    │
│ - Include: related data             │
│ - Order by: date DESC               │
└──────┬──────────────────────────────┘
       │ raw data
       ▼
┌─────────────────────────────────────┐
│ Business Logic (Aggregation)        │
│ - Calculate: totals, averages       │
│ - Group by: technician, status, etc │
│ - Format: for display               │
└──────┬──────────────────────────────┘
       │ aggregated data
       ▼
┌─────────────────────────────────────┐
│ Logging Component                   │
│ - Log: REPORT_GENERATED             │
│ - Capture: report type, filters     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 200 OK                            │
│ - JSON: { data: [...],              │
│          summary: { total, ... }}   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ UI Component                        │
│ - Display: data table               │
│ - Display: summary statistics       │
│ - Display: charts (if applicable)   │
│ - Option: Export to PDF/CSV         │
└─────────────────────────────────────┘

       [If user clicks "Export"]
       
┌─────────────────────────────────────┐
│ UI Component                        │
│ - POST /api/reports/export          │
│ - { format: 'PDF', data: [...] }    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ PDF Component                       │
│ - Generate: report PDF              │
│ - Include: table + charts           │
│ - Apply: Trane branding             │
└──────┬──────────────────────────────┘
       │ pdfBuffer
       ▼
┌─────────────────────────────────────┐
│ API Response                        │
│ - 200 OK                            │
│ - Content-Type: application/pdf     │
│ - Content-Disposition: attachment   │
│ - Body: PDF buffer                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Browser                             │
│ - Download: report.pdf              │
└─────────────────────────────────────┘
```

**Data Transformations**:
- Input: Filters (date range, status, technician)
- Query: Filtered database query
- Aggregation: Calculate totals, averages, groupings
- Output: Structured report data
- Optional: PDF generation for export

**Authorization**:
- TECHNICIAN: Can only see own data
- ADMIN: Can see all data

---

## Data Persistence Patterns

### Create Operation
```
Input → Validation → Sanitization → Database Insert → Audit Log → Response
```

### Read Operation
```
Input → Authorization → Database Query → Transform → Response
```

### Update Operation
```
Input → Validation → Authorization → Load Current State → 
Database Update → Audit Log (with before/after) → Response
```

### Delete Operation (Soft Delete Preferred)
```
Input → Authorization → Load Current State → Database Update (isActive=false) →
Audit Log → Response
```

---

## Error Handling Patterns

### Validation Error
```
Input → Validation Fails → 400 Bad Request
Response: { error: { code: 'VALIDATION_ERROR', details: [...] } }
```

### Authorization Error
```
Input → Auth Check Fails → 401 Unauthorized or 403 Forbidden
Response: { error: { code: 'UNAUTHORIZED', message: '...' } }
```

### Database Error
```
Operation → DB Error → Rollback → Log Error → 500 Internal Server Error
Response: { error: { code: 'DATABASE_ERROR', message: 'Generic message' } }
```

### External Service Error (Email, Storage)
```
Operation → Service Fails → Log Error → Continue (Non-Critical) or Fail (Critical)
```

---

## Async/Background Processes

### Email Sending (Future: Queue)
```
Email Request → Add to Queue → Return Success → 
Background Worker → Process Queue → Send Email → Update Status
```

### PDF Generation (Future: Background Job)
```
PDF Request → Create Job → Return Job ID → 
Background Worker → Generate PDF → Store → Update Job Status → Notify User
```

---

## Data Consistency Patterns

### Transaction Boundaries
- Transfer creation: Transfer + Items (atomic)
- User invitation acceptance: User create + Invitation update (atomic)
- Claim review: Claim update + Audit log (atomic)

### Eventual Consistency
- Email notifications: Best effort, log failures
- PDF generation: Async, retry on failure
- Audit logs: Best effort, never block main flow

---

## Checklist Compliance

This document satisfies:
- ✅ Data flows documented
- ✅ Data transformations defined
- ✅ Integration points mapped
- ✅ Error handling strategy defined

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved
