# Component Boundaries Architecture

## Overview

This document defines the clear boundaries between system components in PartPulse. Each component has explicit responsibilities, dependencies, and contracts to enable independent development, testing, and potential future extraction.

**Based on**: APP_DESCRIPTION.md  
**Compliance**: Architecture Design Checklist - Phase 2: System Architecture

---

## Component Boundary Principles

1. **Clear Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Explicit Dependencies**: All dependencies between components are documented
3. **Contract-Based Communication**: Components interact through well-defined interfaces
4. **Independent Deployment**: Components can be tested and deployed independently
5. **Future Extraction Ready**: Boundaries support potential microservices migration

---

## Component Boundary Map

```
┌─────────────────────────────────────────────────────────────┐
│                    External Boundary                         │
│                                                              │
│  [Technician Browser] ←→ HTTPS ←→ [Admin Browser]          │
│                            ↓                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   UI Component Boundary                      │
│  - Pages, Forms, Tables, Layouts                            │
│  - Server Components + Client Components                     │
│  - No direct external service access                         │
│  - No direct database access                                 │
└────────────────────────────┬─────────────────────────────────┘
                             │ Props / API Calls
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Component Boundary                      │
│  - REST endpoints                                           │
│  - Middleware (auth, RBAC, logging)                         │
│  - Input validation & sanitization                          │
│  - No direct external service access                         │
└────────┬────────────────┬────────────────┬──────────────────┘
         │                │                │
         ▼                ▼                ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│   Database   │  │    Auth     │  │   Storage    │
│  Component   │  │  Component  │  │  Component   │
└──────┬───────┘  └──────┬──────┘  └──────┬───────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│    Email     │  │     PDF     │  │    Logging   │
│  Component   │  │  Component  │  │  Component   │
└──────────────┘  └─────────────┘  └──────────────┘
```

---

## 1. UI Component Boundary

### Responsibility
User interface rendering and client-side interactions.

### Location
- `/app` - Next.js pages and layouts
- `/components` - Reusable UI components

### Technology
- Next.js 14+ App Router
- React 19 (Server Components + Client Components)
- TypeScript
- Tailwind CSS

### Inputs
- User interactions (clicks, form submissions, navigation)
- Props from parent components
- API responses (via Server Components or fetch)

### Outputs
- Rendered HTML/UI
- HTTP requests to API layer
- Client-side state updates

### Dependencies
- **API Component**: All data fetching goes through API routes
- **No direct dependencies on**: Database, Auth, Storage, Email, PDF components

### Contracts
```typescript
// Server Component (data fetching)
async function TransferListPage() {
  const transfers = await fetch('/api/transfers').then(r => r.json())
  return <TransferTable data={transfers} />
}

// Client Component (form submission)
'use client'
function TransferForm() {
  const handleSubmit = async (data) => {
    const response = await fetch('/api/transfers', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }
}
```

### Boundaries Enforced
- ✅ No `import prisma` in UI components
- ✅ No direct database queries
- ✅ No direct calls to external services (email, storage)
- ✅ All data access through API routes
- ✅ Authentication state from NextAuth session only

### Testing Strategy
- Unit tests for individual components (Jest + RTL)
- Integration tests for page rendering
- Mock API responses for isolation

---

## 2. API Component Boundary

### Responsibility
HTTP endpoint handling, request validation, authentication, authorization, and routing to business logic.

### Location
- `/app/api/**` - Next.js API routes
- `/middleware.ts` - Request middleware

### Technology
- Next.js API Routes
- NextAuth.js for auth middleware
- Zod for validation

### Inputs
- HTTP requests from UI component
- Authentication tokens (JWT)
- Request body, query params, headers

### Outputs
- HTTP responses (JSON)
- Status codes (200, 400, 401, 403, 500)
- Error messages

### Dependencies
- **Database Component**: For data persistence
- **Auth Component**: For authentication validation
- **Storage Component**: For file operations
- **Email Component**: For notifications
- **PDF Component**: For document generation
- **Logging Component**: For audit trail

### Contracts
```typescript
// API Route Contract
export async function POST(request: Request) {
  // 1. Authentication check
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  // 2. Input validation
  const body = await request.json()
  const validated = TransferSchema.parse(body) // Zod validation
  
  // 3. Authorization check
  if (!canCreateTransfer(session.user.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // 4. Business logic (delegate to service)
  const transfer = await createTransfer(validated, session.user.id)
  
  // 5. Response
  return Response.json({ success: true, data: transfer })
}
```

### Boundaries Enforced
- ✅ Authentication on all protected routes
- ✅ Authorization checks before operations
- ✅ Input validation (Zod schemas)
- ✅ Input sanitization (XSS prevention)
- ✅ Rate limiting (future)
- ✅ Audit logging on all mutations
- ✅ Consistent error responses

### Testing Strategy
- Integration tests for endpoints
- Contract tests for request/response schemas
- Authorization tests for RBAC
- Error handling tests

---

## 3. Database Component Boundary

### Responsibility
Data persistence and retrieval.

### Location
- `/lib/db/**` - Database service functions
- `/lib/prisma.ts` - Prisma client singleton
- `/prisma/schema.prisma` - Database schema

### Technology
- Prisma ORM
- PostgreSQL (production)
- SQLite (development)

### Inputs
- Database queries from API layer or business logic
- Data objects to persist

### Outputs
- Query results (typed by Prisma)
- Success/failure status
- Database errors

### Dependencies
- **None** (leaf component - no application dependencies)

### Contracts
```typescript
// Database Service Contract
export async function createTransfer(data: TransferInput, userId: string) {
  return await prisma.internalTransfer.create({
    data: {
      ...data,
      technicianId: userId,
      createdAt: new Date(),
    },
    include: {
      technician: true,
      items: true,
    }
  })
}

export async function getTransferById(id: string) {
  return await prisma.internalTransfer.findUnique({
    where: { id },
    include: {
      technician: true,
      items: true,
    }
  })
}
```

### Boundaries Enforced
- ✅ Type-safe queries (Prisma)
- ✅ No raw SQL (unless absolutely necessary)
- ✅ Parameterized queries (SQL injection prevention)
- ✅ Connection pooling
- ✅ Transaction support
- ✅ Migration management

### Testing Strategy
- Unit tests for database functions
- Integration tests with test database
- Migration tests

---

## 4. Auth Component Boundary

### Responsibility
User authentication and session management.

### Location
- `/lib/auth.ts` - NextAuth configuration
- `/app/api/auth/[...nextauth]/route.ts` - Auth endpoints
- `/middleware.ts` - Auth middleware

### Technology
- NextAuth.js v5
- JWT for sessions
- bcryptjs for password hashing

### Inputs
- Credentials (email, password)
- JWT tokens
- Session requests

### Outputs
- JWT tokens (in httpOnly cookies)
- Session objects
- Authentication status

### Dependencies
- **Database Component**: For user lookup

### Contracts
```typescript
// Auth Service Contract
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return null
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export async function getSession(request: Request) {
  return await auth() // NextAuth session
}
```

### Boundaries Enforced
- ✅ Password hashing (never store plaintext)
- ✅ JWT in httpOnly cookies (no localStorage)
- ✅ Session expiry (8 hours)
- ✅ CSRF protection
- ✅ Secure session storage

### Testing Strategy
- Unit tests for auth functions
- Integration tests for login/logout
- Security tests for token validation

---

## 5. Storage Component Boundary

### Responsibility
File storage and retrieval (PDFs, photos, documents).

### Location
- `/lib/storage/**` - Storage abstraction
- `/lib/storage/local.ts` - Local file system
- `/lib/storage/s3.ts` - S3-compatible storage
- `/lib/storage/types.ts` - Storage interfaces

### Technology
- Abstraction layer (switchable)
- Local file system (development)
- S3-compatible (production: AWS S3, Supabase Storage)

### Inputs
- File buffers to store
- File keys/paths to retrieve
- Metadata (content type, file name)

### Outputs
- Storage success/failure
- File URLs (for retrieval)
- File metadata

### Dependencies
- **None** (external service abstraction)

### Contracts
```typescript
// Storage Service Contract
export interface StorageProvider {
  upload(key: string, buffer: Buffer, contentType: string): Promise<string>
  download(key: string): Promise<Buffer>
  delete(key: string): Promise<void>
  getPublicUrl(key: string): string
}

// Usage
const storage = getStorage() // Returns configured provider
const url = await storage.upload('pdfs/transfer-123.pdf', pdfBuffer, 'application/pdf')
```

### Boundaries Enforced
- ✅ Abstraction layer (no vendor lock-in)
- ✅ Switchable implementations (env config)
- ✅ No direct S3 SDK usage outside storage module
- ✅ Consistent interface regardless of provider

### Testing Strategy
- Unit tests with mock storage
- Integration tests with local storage
- E2E tests with actual cloud storage (optional)

---

## 6. Email Component Boundary

### Responsibility
Email sending and templating.

### Location
- `/lib/email/**` - Email service
- `/lib/email/templates.ts` - Email templates
- `/lib/email/sendTransferReceipt.ts` - Specific email functions

### Technology
- SMTP (SendGrid, Gmail)
- HTML templates

### Inputs
- Recipient email addresses
- Email subject
- Email data (for templating)
- Template name

### Outputs
- Email send success/failure
- Error messages

### Dependencies
- **None** (external service abstraction)

### Contracts
```typescript
// Email Service Contract
export async function sendEmail(options: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  // Send via configured SMTP provider
  return await smtpClient.send(options)
}

export async function sendTransferReceipt(transfer: Transfer, userEmail: string) {
  const html = renderTransferReceiptTemplate(transfer)
  return await sendEmail({
    to: userEmail,
    subject: `Transfer Receipt - ${transfer.transferNumber}`,
    html,
  })
}
```

### Boundaries Enforced
- ✅ Abstraction layer (switchable SMTP providers)
- ✅ Template-based (no hardcoded HTML in business logic)
- ✅ Error handling and retry logic
- ✅ Logging of email sends

### Testing Strategy
- Unit tests with mock SMTP
- Integration tests with console logging
- Manual testing with real email provider

---

## 7. PDF Component Boundary

### Responsibility
PDF document generation with Trane branding.

### Location
- `/lib/pdf/**` - PDF generation
- `/templates/pdf/**` - PDF templates

### Technology
- Custom PDF generation (future: puppeteer, pdfkit, or react-pdf)

### Inputs
- Document data (transfer, claim)
- Template name

### Outputs
- PDF buffer
- PDF file path (if saved to storage)

### Dependencies
- **Storage Component**: For saving generated PDFs

### Contracts
```typescript
// PDF Service Contract
export async function generateTransferPDF(transfer: Transfer): Promise<Buffer> {
  // Load template
  const template = loadTemplate('internal-transfer')
  
  // Render with data
  const pdf = await renderPDF(template, transfer)
  
  return pdf.toBuffer()
}

export async function generateAndStoreTransferPDF(transfer: Transfer): Promise<string> {
  const pdfBuffer = await generateTransferPDF(transfer)
  const key = `pdfs/transfer-${transfer.id}.pdf`
  const storage = getStorage()
  const url = await storage.upload(key, pdfBuffer, 'application/pdf')
  return url
}
```

### Boundaries Enforced
- ✅ Template-based generation
- ✅ Consistent branding (Trane colors, logos)
- ✅ Type-safe data input
- ✅ Error handling for generation failures

### Testing Strategy
- Unit tests for PDF generation
- Visual regression tests (compare PDF output)
- Integration tests with storage

---

## 8. Logging Component Boundary

### Responsibility
System logging and audit trail.

### Location
- `/lib/logging/**` - Logging service
- `/lib/logging/systemLog.ts` - Audit logging functions

### Technology
- Database logging (SystemLog model)
- Structured logging

### Inputs
- Log events (user actions, system events)
- Event metadata (user, resource, changes)

### Outputs
- Log entries in database
- Audit trail records

### Dependencies
- **Database Component**: For persisting logs

### Contracts
```typescript
// Logging Service Contract
export async function logUserAction(event: {
  userId: string
  action: string
  resourceType: string
  resourceId?: string
  changes?: object
  ipAddress?: string
  userAgent?: string
}) {
  await prisma.systemLog.create({
    data: {
      timestamp: new Date(),
      eventType: 'user_action',
      ...event,
      details: event.changes ? JSON.stringify(event.changes) : null,
    }
  })
}

export async function logTransferCreation(transfer: Transfer, userId: string) {
  await logUserAction({
    userId,
    action: 'CREATE',
    resourceType: 'InternalTransfer',
    resourceId: transfer.id,
    changes: transfer,
  })
}
```

### Boundaries Enforced
- ✅ All mutations logged
- ✅ Immutable logs (no updates/deletes)
- ✅ Structured data (JSON)
- ✅ Consistent event types

### Testing Strategy
- Unit tests for logging functions
- Integration tests verifying logs created
- Audit trail completeness tests

---

## Cross-Cutting Concerns

### Error Handling
Each component handles its own errors and propagates them appropriately:

```typescript
// Component-level error handling
try {
  const result = await componentOperation()
  return { success: true, data: result }
} catch (error) {
  logger.error('Component operation failed', { error })
  return { success: false, error: error.message }
}
```

### Security
Security is enforced at boundaries:
- **UI → API**: Authentication and authorization
- **API → Database**: SQL injection prevention (Prisma)
- **API → External**: API key validation

### Performance
- Database queries optimized with indexes
- API responses cached where appropriate
- PDFs generated asynchronously (future)
- Email sending queued (future)

---

## Component Interaction Patterns

### Pattern 1: User Action Flow
```
User clicks button (UI)
  → UI calls API endpoint
    → API validates and authorizes
      → API calls business logic
        → Logic queries Database
        → Logic calls PDF component
        → Logic calls Email component
        → Logic calls Logging component
      → API returns response
  → UI updates display
```

### Pattern 2: Background Task Flow
```
Scheduled job triggers
  → Job queries Database
  → Job calls Email component
  → Job calls Logging component
```

### Pattern 3: File Upload Flow
```
User uploads file (UI)
  → UI calls API endpoint with file
    → API validates file
      → API calls Storage component
        → Storage saves to S3/local
      → API saves metadata to Database
    → API returns file URL
  → UI displays success
```

---

## Future Migration to Microservices

These boundaries support future extraction:

### Extraction Candidates (Priority Order)
1. **PDF Service**: CPU-intensive, can be scaled independently
2. **Email Service**: High-volume, asynchronous
3. **Storage Service**: Already abstracted, easy to extract
4. **Auth Service**: Can be shared across multiple apps
5. **Reporting Service**: Heavy database queries, read replicas

### Extraction Process
1. Create new service repository
2. Copy component code to service
3. Define REST/gRPC API contract
4. Implement API in component boundary
5. Deploy service
6. Update main app to call service API
7. Remove component code from main app

---

## Checklist Compliance

This document satisfies:
- ✅ Component boundaries clearly defined
- ✅ Communication patterns documented
- ✅ Dependencies explicit
- ✅ Contracts specified
- ✅ Future extraction support

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved
