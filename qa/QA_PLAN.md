# QA Plan - PartPulse

## Document Purpose

This QA Plan defines the complete quality assurance strategy for PartPulse as a **gap analysis against architecture**. The plan is explicitly designed such that **the first run is expected to be RED**, revealing all gaps between current implementation and architectural requirements.

This approach aligns with the ForemanApp Agent Contract principle of **One-Time Failure Doctrine** and **Build-to-Green** methodology.

**Authority**: ForemanApp Agent Contract  
**Version**: 1.0.0  
**Date**: 2025-12-16  
**Based On**: Architecture documentation (11 documents, 280KB)

---

## Core QA Philosophy

### Gap Analysis Approach

This QA plan treats architecture as **requirements specification** and implementation as **system under test**. Quality assurance is the measurement of gap between them.

**Expected First Run State**: 🔴 **RED** (by design)

The first QA run will:
1. Discover all unimplemented requirements
2. Identify incomplete implementations
3. Reveal missing tests
4. Expose security gaps
5. Show documentation deficiencies
6. Highlight governance gaps

**Resolution Strategy**: Build-to-GREEN via systematic gap closure

---

## QA Categories Mapped to Architecture

Each QA category corresponds to an architecture document or section. Evidence requirements are defined to prove compliance.

### Category Structure

For each category:
- **Architecture Source**: Which architecture document defines requirements
- **QA Objective**: What quality attribute we're validating
- **Evidence Types**: What artifacts prove compliance
- **Test Requirements**: What tests must exist and pass
- **Documentation Requirements**: What docs must exist
- **Acceptance Criteria**: Definition of GREEN for this category

---

## QA Category 1: Database Schema Compliance

**Architecture Source**: `/architecture/DATABASE_SCHEMA.md`

**QA Objective**: Validate that database implementation matches schema specification

### Evidence Requirements

#### 1.1 Schema Definition Evidence
- ✅ File exists: `prisma/schema.prisma`
- 🔴 All models from DATABASE_SCHEMA.md implemented
- 🔴 All fields per model specification exist
- 🔴 All relationships defined correctly
- 🔴 All indexes specified in architecture exist
- 🔴 All enums match specification

**Test File**: `__tests__/database/schema-compliance.test.ts`

**Tests Required**:
```typescript
describe('Database Schema Compliance', () => {
  it('should have User model with all required fields')
  it('should have InternalTransfer model matching specification')
  it('should have WarrantyClaim model matching specification')
  it('should have WarrantyItem model matching specification')
  it('should have AuditLog model matching specification')
  it('should have Invitation model matching specification')
  it('should have SystemLog model matching specification')
  it('should have correct Role enum values')
  it('should have correct TransferStatus enum values')
  it('should have correct ClaimStatus enum values')
  it('should have all relationships defined')
  it('should have all required indexes')
})
```

#### 1.2 Migration Evidence
- 🔴 Prisma migrations directory exists
- 🔴 Migrations apply cleanly
- 🔴 Schema generates without errors
- 🔴 Seed script runs successfully

**Test File**: `__tests__/database/migrations.test.ts`

**Tests Required**:
```typescript
describe('Database Migrations', () => {
  it('should run prisma generate without errors')
  it('should apply migrations without errors')
  it('should seed database successfully')
  it('should support rollback')
})
```

#### 1.3 Data Integrity Evidence
- 🔴 Foreign key constraints enforced
- 🔴 Unique constraints enforced
- 🔴 Required fields enforced
- 🔴 Cascade deletes configured correctly

**Test File**: `__tests__/database/data-integrity.test.ts`

**Acceptance Criteria for GREEN**:
- All models implemented per specification
- All tests pass
- Schema validates
- Migrations apply cleanly
- Seed script succeeds

---

## QA Category 2: API Contract Compliance

**Architecture Source**: `/architecture/API_SPECIFICATION.md`

**QA Objective**: Validate that API implementation matches contract specification

### Evidence Requirements

#### 2.1 Endpoint Existence Evidence
- 🔴 All endpoints from API_SPECIFICATION.md implemented
- 🔴 Correct HTTP methods for each endpoint
- 🔴 Correct URL paths

**Test File**: `__tests__/api/endpoint-existence.test.ts`

**Tests Required**:
```typescript
describe('API Endpoint Existence', () => {
  it('should have /api/auth endpoints')
  it('should have /api/transfers endpoints')
  it('should have /api/internal-transfer endpoints')
  it('should have /api/claims endpoints')
  it('should have /api/warranty-claims endpoints')
  it('should have /api/users endpoints')
  it('should have /api/reports endpoints')
  it('should have /api/audit endpoints')
  it('should have /api/pdf endpoints')
  it('should have /api/email endpoints')
})
```

#### 2.2 Request/Response Contract Evidence
- 🔴 All endpoints accept specified request format
- 🔴 All endpoints return specified response format
- 🔴 Success responses match SuccessResponse<T> contract
- 🔴 Error responses match ErrorResponse contract
- 🔴 Paginated responses match PaginatedResponse<T> contract

**Test File**: `__tests__/api/contract-compliance.test.ts`

**Tests Required**:
```typescript
describe('API Contract Compliance', () => {
  describe('Request Contracts', () => {
    it('should validate transfer creation request')
    it('should validate warranty claim request')
    it('should validate user invite request')
    it('should reject invalid requests with 400')
  })
  
  describe('Response Contracts', () => {
    it('should return SuccessResponse on success')
    it('should return ErrorResponse on error')
    it('should return PaginatedResponse for list endpoints')
  })
})
```

#### 2.3 Validation Evidence
- 🔴 All inputs validated with Zod schemas
- 🔴 Invalid inputs rejected with 400
- 🔴 Validation errors descriptive
- 🔴 SQL injection prevented (Prisma ORM)
- 🔴 XSS prevented (input sanitization)

**Test File**: `__tests__/api/validation.test.ts`

**Tests Required**:
```typescript
describe('API Input Validation', () => {
  it('should reject invalid email format')
  it('should reject missing required fields')
  it('should reject invalid data types')
  it('should sanitize string inputs')
  it('should prevent SQL injection attempts')
  it('should prevent XSS attempts')
})
```

#### 2.4 Error Handling Evidence
- 🔴 All error codes from specification implemented
- 🔴 Correct HTTP status codes returned
- 🔴 Error messages descriptive
- 🔴 Error details included when safe

**Test File**: `__tests__/api/error-handling.test.ts`

**Acceptance Criteria for GREEN**:
- All endpoints implemented
- All contracts match specification
- All validation tests pass
- All error handling tests pass

---

## QA Category 3: Authentication & Authorization Compliance

**Architecture Source**: `/architecture/SECURITY_ARCHITECTURE.md` (Authentication & Authorization sections)

**QA Objective**: Validate authentication mechanisms and RBAC implementation

### Evidence Requirements

#### 3.1 Authentication Mechanism Evidence
- ✅ File exists: `lib/auth.ts`
- 🔴 NextAuth.js configured correctly
- 🔴 JWT session tokens implemented
- 🔴 HttpOnly cookies configured
- 🔴 Session expiry set to 8 hours
- 🔴 CSRF protection enabled

**Test File**: `__tests__/auth/authentication.test.ts`

**Tests Required**:
```typescript
describe('Authentication', () => {
  it('should issue JWT on successful login')
  it('should use HttpOnly cookies')
  it('should expire sessions after 8 hours')
  it('should validate CSRF tokens')
  it('should reject invalid credentials')
  it('should lock account after 5 failed attempts')
  it('should hash passwords with bcrypt')
})
```

#### 3.2 Authorization (RBAC) Evidence
- ✅ File exists: `middleware.ts`
- 🔴 RBAC checks on all protected routes
- 🔴 Admin-only routes protected
- 🔴 Technician restrictions enforced
- 🔴 Resource ownership validated

**Test File**: `__tests__/auth/authorization.test.ts`

**Tests Required**:
```typescript
describe('Authorization (RBAC)', () => {
  describe('Admin Access', () => {
    it('should allow admin to view all transfers')
    it('should allow admin to edit any transfer')
    it('should allow admin to delete any transfer')
    it('should allow admin to approve warranty claims')
    it('should allow admin user management')
    it('should allow admin to view audit logs')
  })
  
  describe('Technician Access', () => {
    it('should allow technician to create own transfers')
    it('should allow technician to edit own transfers')
    it('should deny technician edit of others transfers')
    it('should deny technician access to user management')
    it('should deny technician access to audit logs')
    it('should deny technician warranty claim approval')
  })
  
  describe('Unauthenticated Access', () => {
    it('should redirect to login for protected routes')
    it('should allow access to login page')
  })
})
```

#### 3.3 Session Management Evidence
- 🔴 Sessions created on login
- 🔴 Sessions destroyed on logout
- 🔴 Sessions expire automatically
- 🔴 Session theft prevented

**Test File**: `__tests__/auth/session-management.test.ts`

**Acceptance Criteria for GREEN**:
- All authentication tests pass
- All RBAC tests pass
- All session management tests pass

---

## QA Category 4: Security Controls Compliance

**Architecture Source**: `/architecture/SECURITY_ARCHITECTURE.md`

**QA Objective**: Validate implementation of all security controls from threat model

### Evidence Requirements

#### 4.1 Trust Boundary Protection Evidence
- 🔴 TLS 1.3 enforced (production)
- 🔴 Security headers configured
- 🔴 CORS configured correctly
- 🔴 Rate limiting implemented (future)

**Test File**: `__tests__/security/trust-boundaries.test.ts`

**Tests Required**:
```typescript
describe('Trust Boundary Protection', () => {
  it('should enforce HTTPS in production')
  it('should set HSTS header')
  it('should set CSP header')
  it('should set X-Frame-Options header')
  it('should set X-Content-Type-Options header')
  it('should configure CORS correctly')
})
```

#### 4.2 Input Security Evidence
- 🔴 All inputs validated (Zod)
- 🔴 All string inputs sanitized
- 🔴 SQL injection prevented
- 🔴 XSS prevented
- 🔴 CSRF prevented
- 🔴 File upload validation (if applicable)

**Test File**: `__tests__/security/input-security.test.ts`

**Tests Required**:
```typescript
describe('Input Security', () => {
  it('should validate all API inputs')
  it('should sanitize HTML in text inputs')
  it('should use parameterized queries (Prisma)')
  it('should prevent script injection')
  it('should validate CSRF tokens')
  it('should validate file uploads')
})
```

#### 4.3 Data Protection Evidence
- 🔴 Passwords hashed with bcrypt (10 rounds)
- 🔴 Secrets in environment variables only
- 🔴 No secrets in code
- 🔴 No secrets in logs
- 🔴 TLS for database connections

**Test File**: `__tests__/security/data-protection.test.ts`

**Tests Required**:
```typescript
describe('Data Protection', () => {
  it('should hash passwords with bcrypt')
  it('should not store plaintext passwords')
  it('should load secrets from environment')
  it('should not log secrets')
  it('should use TLS for database connections')
})
```

#### 4.4 Vulnerability Scanning Evidence
- 🔴 npm audit clean (no high/critical)
- 🔴 CodeQL scan clean
- 🔴 Dependency vulnerabilities resolved

**Test File**: `__tests__/security/vulnerability-scan.test.ts`

**Acceptance Criteria for GREEN**:
- All security control tests pass
- No high/critical npm vulnerabilities
- CodeQL scan clean

---

## QA Category 5: Audit Logging Compliance

**Architecture Source**: `/architecture/AUDIT_LOGGING.md`

**QA Objective**: Validate complete audit trail implementation

### Evidence Requirements

#### 5.1 Audit Log Model Evidence
- 🔴 AuditLog model implemented per specification
- 🔴 All required fields present
- 🔴 Who/What/When/Where captured
- 🔴 Changes captured (before/after state)

**Test File**: `__tests__/audit/audit-model.test.ts`

**Tests Required**:
```typescript
describe('Audit Log Model', () => {
  it('should have AuditLog model')
  it('should capture userId')
  it('should capture action')
  it('should capture timestamp')
  it('should capture ipAddress')
  it('should capture userAgent')
  it('should capture resourceType')
  it('should capture resourceId')
  it('should capture changes (before/after)')
})
```

#### 5.2 Audit Event Coverage Evidence
- 🔴 User login logged
- 🔴 User logout logged
- 🔴 Transfer creation logged
- 🔴 Transfer update logged
- 🔴 Transfer deletion logged
- 🔴 Warranty claim submission logged
- 🔴 Warranty claim approval logged
- 🔴 User invitation logged
- 🔴 Password reset logged
- 🔴 Role changes logged
- 🔴 Admin actions logged

**Test File**: `__tests__/audit/audit-coverage.test.ts`

**Tests Required**:
```typescript
describe('Audit Event Coverage', () => {
  it('should log user login')
  it('should log user logout')
  it('should log transfer creation')
  it('should log transfer update')
  it('should log transfer deletion')
  it('should log warranty claim submission')
  it('should log warranty claim approval')
  it('should log user invitation')
  it('should log password reset')
  it('should log role changes')
  it('should log admin actions')
})
```

#### 5.3 Audit Integrity Evidence
- 🔴 Audit logs immutable (no update/delete)
- 🔴 Audit logs retained per policy
- 🔴 Audit logs admin-only access
- 🔴 Audit logs exportable

**Test File**: `__tests__/audit/audit-integrity.test.ts`

**Acceptance Criteria for GREEN**:
- All audit log tests pass
- All events logged correctly
- Audit logs immutable

---

## QA Category 6: Data Flow Compliance

**Architecture Source**: `/architecture/DATA_FLOW.md`

**QA Objective**: Validate that implemented workflows match specified data flows

### Evidence Requirements

#### 6.1 Internal Transfer Workflow Evidence
- 🔴 Form submission → Validation → Database → PDF → Email flow works
- 🔴 All workflow states reachable
- 🔴 State transitions valid
- 🔴 Error handling in workflow

**Test File**: `__tests__/workflows/internal-transfer.test.ts`

**Tests Required**:
```typescript
describe('Internal Transfer Workflow', () => {
  it('should accept form submission')
  it('should validate form data')
  it('should save to database')
  it('should generate PDF')
  it('should send email notification')
  it('should return success response')
  it('should handle errors gracefully')
  it('should transition through all states')
})
```

#### 6.2 Warranty Claim Workflow Evidence
- 🔴 Claim submission workflow works
- 🔴 Admin review workflow works
- 🔴 Approval/rejection flow works
- 🔴 Notification flow works

**Test File**: `__tests__/workflows/warranty-claim.test.ts`

**Tests Required**:
```typescript
describe('Warranty Claim Workflow', () => {
  it('should submit claim')
  it('should notify admin')
  it('should allow admin review')
  it('should approve claim')
  it('should reject claim')
  it('should notify technician of decision')
})
```

#### 6.3 User Invitation Workflow Evidence
- 🔴 Invitation creation works
- 🔴 Email sent with invitation link
- 🔴 Invitation acceptance works
- 🔴 Invitation expiry enforced

**Test File**: `__tests__/workflows/user-invitation.test.ts`

**Acceptance Criteria for GREEN**:
- All workflow tests pass
- All data flows work end-to-end

---

## QA Category 7: Frontend Components Compliance

**Architecture Source**: `/architecture/FRONTEND_COMPONENTS.md`

**QA Objective**: Validate that UI components match specification

### Evidence Requirements

#### 7.1 Component Existence Evidence
- 🔴 All components from FRONTEND_COMPONENTS.md exist
- 🔴 Component file structure matches specification
- 🔴 Component exports correct

**Test File**: `__tests__/components/component-existence.test.ts`

**Tests Required**:
```typescript
describe('Component Existence', () => {
  it('should have Sidebar component')
  it('should have Button component')
  it('should have Input component')
  it('should have Select component')
  it('should have Modal component')
  it('should have Table component')
  it('should have Card component')
  it('should have Badge component')
  it('should have TransferForm component')
  it('should have WarrantyForm component')
  it('should have UserInviteForm component')
})
```

#### 7.2 Component Rendering Evidence
- 🔴 All components render without errors
- 🔴 All components accept specified props
- 🔴 All components handle events correctly

**Test File**: `__tests__/components/component-rendering.test.ts`

**Tests Required**:
```typescript
describe('Component Rendering', () => {
  it('should render Button with variants')
  it('should render Input with validation')
  it('should render Select with options')
  it('should render Modal and open/close')
  it('should render TransferForm with validation')
})
```

#### 7.3 Accessibility Evidence
- 🔴 All components have proper ARIA labels
- 🔴 All forms keyboard accessible
- 🔴 All interactive elements focusable

**Test File**: `__tests__/components/accessibility.test.ts`

**Acceptance Criteria for GREEN**:
- All component tests pass
- All components render correctly
- Accessibility requirements met

---

## QA Category 8: Component Boundaries Compliance

**Architecture Source**: `/architecture/COMPONENT_BOUNDARIES.md`

**QA Objective**: Validate proper separation of concerns and component boundaries

### Evidence Requirements

#### 8.1 Layer Separation Evidence
- 🔴 Frontend components don't directly access database
- 🔴 API routes don't import UI components
- 🔴 Business logic separated from presentation
- 🔴 Clear lib/ utility organization

**Test File**: `__tests__/architecture/layer-separation.test.ts`

**Tests Required**:
```typescript
describe('Layer Separation', () => {
  it('should not import Prisma in frontend components')
  it('should not import UI components in API routes')
  it('should use lib/ for shared business logic')
  it('should maintain clear boundaries')
})
```

#### 8.2 Dependency Direction Evidence
- 🔴 Dependencies flow inward (frontend → API → business logic → data)
- 🔴 No circular dependencies
- 🔴 Clear import paths

**Test File**: `__tests__/architecture/dependency-direction.test.ts`

**Acceptance Criteria for GREEN**:
- All boundary tests pass
- No boundary violations

---

## QA Category 8.5: Navigation Wiring Compliance (ARCH-FAIL-01)

**Architecture Source**: `/architecture/NAVIGATION_PATTERNS.md`

**QA Objective**: Validate that ALL user-facing navigation uses relative paths and NO hard-coded deployment URLs exist

**Issue Reference**: ARCH-FAIL-01 — Runtime Navigation Wiring Missing

### Evidence Requirements

#### 8.5.1 No Hard-Coded Deployment URLs
- ✅ No `.vercel.app` URLs in UI code
- ✅ No `.netlify.app` URLs in UI code
- ✅ No preview deployment URLs in source files
- ✅ All navigation uses relative paths

**Test File**: `__tests__/architecture/navigation-wiring.test.ts`

**Tests Required**:
```typescript
describe('Navigation Wiring Compliance', () => {
  it('should not contain hard-coded deployment URLs in app/')
  it('should not contain hard-coded deployment URLs in components/')
  it('should not contain hard-coded deployment URLs in lib/')
  it('should use relative paths in all Link components')
  it('should use relative paths in all router.push/replace calls')
  it('should use relative paths in window.location assignments')
  it('should define NEXTAUTH_URL in .env.example')
  it('should not have hard-coded preview URLs in .env.example')
  it('should have documented navigation patterns in architecture')
})
```

#### 8.5.2 Link Component Evidence
- ✅ All `<Link>` components use relative paths (e.g., `/transfers`)
- ✅ No `<Link>` components with absolute deployment URLs
- ✅ External links properly identified and allowed

#### 8.5.3 Router Navigation Evidence
- ✅ All `router.push()` calls use relative paths
- ✅ All `router.replace()` calls use relative paths
- ✅ No hard-coded deployment URLs in router calls

#### 8.5.4 Environment Variable Evidence
- ✅ `NEXTAUTH_URL` defined in `.env.example`
- ✅ No preview URLs in `.env.example`
- ✅ Environment variables used correctly for external services only

#### 8.5.5 Documentation Evidence
- ✅ Navigation patterns documented in `architecture/NAVIGATION_PATTERNS.md`
- ✅ Examples provided for all navigation methods
- ✅ Failure prevention strategies documented

**Acceptance Criteria for GREEN**:
- ✅ All navigation wiring tests pass (COMPLETE)
- ✅ Zero hard-coded deployment URLs in codebase (VERIFIED)
- ✅ Navigation patterns documented (COMPLETE)
- ✅ Automated enforcement in place (COMPLETE)

**Status**: ✅ **GREEN** — All tests passing, all requirements met

---

## QA Category 9: External Dependencies Compliance

**Architecture Source**: `/architecture/EXTERNAL_DEPENDENCIES.md`

**QA Objective**: Validate proper integration with external services

### Evidence Requirements

#### 9.1 Email Service Evidence
- 🔴 Email sending works in production
- 🔴 Email templates match Trane branding
- 🔴 Email failure handling works
- 🔴 Email audit trail exists

**Test File**: `__tests__/external/email-service.test.ts`

**Tests Required**:
```typescript
describe('Email Service', () => {
  it('should send emails via SMTP')
  it('should use Trane branded templates')
  it('should handle send failures')
  it('should log email sends')
})
```

#### 9.2 Storage Service Evidence
- 🔴 PDF storage works
- 🔴 PDF retrieval works
- 🔴 Storage abstraction works (local/S3)
- 🔴 Storage failures handled

**Test File**: `__tests__/external/storage-service.test.ts`

**Tests Required**:
```typescript
describe('Storage Service', () => {
  it('should store PDFs')
  it('should retrieve PDFs')
  it('should support local storage')
  it('should support S3 storage')
  it('should handle storage failures')
})
```

#### 9.3 PDF Generation Evidence
- 🔴 Internal transfer PDFs generated correctly
- 🔴 Warranty claim PDFs generated correctly
- 🔴 PDFs match Trane branding
- 🔴 PDF generation failures handled

**Test File**: `__tests__/external/pdf-generation.test.ts`

**Acceptance Criteria for GREEN**:
- All external service tests pass
- All integrations working

---

## QA Category 10: Deployment Compliance

**Architecture Source**: `/architecture/DEPLOYMENT_GUIDE.md`

**QA Objective**: Validate deployment configuration and production readiness

### Evidence Requirements

#### 10.1 Build Evidence
- 🔴 `npm run build` succeeds
- 🔴 No build warnings (critical)
- 🔴 No TypeScript errors
- 🔴 No ESLint errors (critical)

**Test File**: `__tests__/deployment/build.test.ts`

**Tests Required**:
```typescript
describe('Build Process', () => {
  it('should build without errors')
  it('should have no critical warnings')
  it('should pass TypeScript checks')
  it('should pass ESLint checks')
})
```

#### 10.2 Environment Configuration Evidence
- 🔴 All required env vars documented in .env.example
- 🔴 Environment validation on startup
- 🔴 Graceful failure on missing env vars

**Test File**: `__tests__/deployment/environment.test.ts`

**Tests Required**:
```typescript
describe('Environment Configuration', () => {
  it('should have .env.example with all vars')
  it('should validate env vars on startup')
  it('should fail gracefully on missing vars')
})
```

#### 10.3 Production Readiness Evidence
- 🔴 Database migrations work
- 🔴 Seed scripts work
- 🔴 Health check endpoint exists
- 🔴 Logging configured

**Test File**: `__tests__/deployment/production-readiness.test.ts`

**Acceptance Criteria for GREEN**:
- Build succeeds
- All deployment tests pass
- Production ready

---

## QA Category 11: Documentation Compliance

**Architecture Source**: All architecture documents

**QA Objective**: Validate documentation completeness and accuracy

### Evidence Requirements

#### 11.1 Architecture Documentation Evidence
- ✅ ARCHITECTURE.md exists
- ✅ DATABASE_SCHEMA.md exists
- ✅ FRONTEND_COMPONENTS.md exists
- ✅ API_SPECIFICATION.md exists
- ✅ SECURITY_ARCHITECTURE.md exists
- ✅ AUDIT_LOGGING.md exists
- ✅ DATA_FLOW.md exists
- ✅ COMPONENT_BOUNDARIES.md exists
- ✅ EXTERNAL_DEPENDENCIES.md exists
- ✅ DEPLOYMENT_GUIDE.md exists
- ✅ IMPLEMENTATION_GUIDE.md exists

#### 11.2 Code Documentation Evidence
- 🔴 All API routes documented
- 🔴 All complex functions have comments
- 🔴 All types documented
- 🔴 README accurate and complete

**Test File**: `__tests__/documentation/code-documentation.test.ts`

**Tests Required**:
```typescript
describe('Code Documentation', () => {
  it('should have JSDoc for all API routes')
  it('should have comments for complex logic')
  it('should have type definitions documented')
  it('should have accurate README')
})
```

#### 11.3 User Documentation Evidence
- 🔴 User guide exists
- 🔴 Admin guide exists
- 🔴 Troubleshooting guide exists

**Acceptance Criteria for GREEN**:
- All architecture docs exist and accurate
- Code documentation complete
- User documentation exists

---

## QA Category 12: Performance Compliance

**Architecture Source**: `/architecture/ARCHITECTURE.md` (Performance section)

**QA Objective**: Validate performance requirements met

### Evidence Requirements

#### 12.1 Page Load Performance Evidence
- 🔴 Home page loads < 2 seconds
- 🔴 Form pages load < 2 seconds
- 🔴 List pages load < 2 seconds

**Test File**: `__tests__/performance/page-load.test.ts`

**Tests Required**:
```typescript
describe('Page Load Performance', () => {
  it('should load home page under 2 seconds')
  it('should load transfer form under 2 seconds')
  it('should load transfer list under 2 seconds')
})
```

#### 12.2 API Response Performance Evidence
- 🔴 GET endpoints respond < 500ms
- 🔴 POST endpoints respond < 1000ms
- 🔴 PDF generation < 3 seconds

**Test File**: `__tests__/performance/api-response.test.ts`

**Acceptance Criteria for GREEN**:
- All performance benchmarks met

---

## QA Category 13: Governance Compliance

**Architecture Source**: `/docs/governance/QA_GOVERNANCE_GUIDE.md`

**QA Objective**: Validate ForemanApp governance compliance

### Evidence Requirements

#### 13.1 Test Dodging Detection Evidence
- ✅ detect-test-dodging.js exists
- ✅ Script detects .skip()
- ✅ Script detects .only()
- ✅ Script detects xdescribe/xit
- ✅ CI runs test dodging check

**Test File**: `__tests__/governance/test-dodging.test.ts`

**Tests Required**:
```typescript
describe('Test Dodging Detection', () => {
  it('should detect .skip() patterns')
  it('should detect .only() patterns')
  it('should detect commented tests')
  it('should fail on test dodging')
})
```

#### 13.2 QA Parking Evidence
- ✅ qa/parking/registry.json exists
- ✅ qa/parking/watcher.js exists
- ✅ Registry schema valid
- ✅ Watcher validates registry

**Test File**: `__tests__/governance/qa-parking.test.ts`

**Tests Required**:
```typescript
describe('QA Parking', () => {
  it('should have valid registry schema')
  it('should validate parked items')
  it('should check expiry dates')
  it('should require approval')
})
```

#### 13.3 DP-RED Support Evidence
- ✅ DP-RED category in registry schema
- ✅ DP-RED distinguished from QA Parking
- ✅ DP-RED issue template exists

#### 13.4 Catastrophic Failure Tracking Evidence
- ✅ qa/evidence/ directory exists
- ✅ qa/evidence/capture.js exists
- ✅ Evidence capture works
- ✅ CI captures evidence on failure

**Test File**: `__tests__/governance/catastrophic-failure.test.ts`

**Acceptance Criteria for GREEN**:
- All governance mechanisms operational
- All governance tests pass

---

## Definition of GREEN

### GREEN (Local) - Developer GREEN

**Criteria**:
- All tests pass locally
- No test dodging detected
- Build succeeds
- Linting passes (no critical issues)

**Purpose**: Developer confidence before commit

**Limitations**: Not sufficient for merge

### GREEN (Gate-Eligible) - Merge GREEN

**Criteria**:
- All tests pass in CI
- No test dodging detected
- All governance checks pass
- QA parking registry valid
- No expired parking
- Build succeeds in CI
- No security vulnerabilities (high/critical)
- CodeQL scan clean
- All required approvals obtained

**Purpose**: Gatekeeper for merge to main

**Authority**: Only this GREEN allows merge

**Special Case - Intended RED QA Plans**:

When creating QA Plans or architecture documentation that **intentionally defines RED states** (like this QA_PLAN.md):

- The **QA Plan document itself** must be GREEN (complete, accurate, approved)
- The **tests defined by the plan** are expected to be RED initially (gap analysis)
- This is a **governed exception** for design-phase documentation work
- The merge gate checks the **documentation quality**, not the implementation gaps the documentation reveals

**Rationale**: A QA Plan that defines what RED means cannot itself be blocked for being RED. The plan is the roadmap from RED to GREEN. Blocking the roadmap would prevent the journey.

---

## Handling RED States

### Immediate Fix (Preferred)

When tests fail:
1. Fix immediately if possible
2. Commit fix
3. Verify GREEN
4. Proceed

### QA Parking (Governed Exception - Implementation Phase)

When immediate fix not possible **during implementation**:

**Allowed For**:
- Test failures requiring external dependencies
- Build issues requiring major refactoring
- Integration issues with external services
- Performance issues requiring time

**Process**:
1. Create QA Parking Request issue (`.github/ISSUE_TEMPLATE/qa-parking.yml`)
2. Provide detailed justification
3. Set clear expiry condition
4. Get owner approval
5. Add to `qa/parking/registry.json` with category: "parking"
6. Link issue in registry
7. Monitor via watcher
8. Resolve before expiry

**Registry Entry Example**:
```json
{
  "id": "PARK-001",
  "category": "parking",
  "type": "test",
  "reason": "External API integration pending",
  "location": "__tests__/api/external-api.test.ts",
  "parkedBy": "developer",
  "parkedDate": "2025-12-16T10:00:00Z",
  "expiryCondition": "After external API endpoint available",
  "expiryDate": "2025-12-31",
  "approvedBy": "repo-owner",
  "approvalDate": "2025-12-16T10:30:00Z",
  "status": "active",
  "issueUrl": "https://github.com/.../issues/123"
}
```

### DP-RED (Governed Exception - Design Phase)

When working on **architecture/design exploration**:

**Allowed For**:
- Architecture decisions being validated
- Tests written before implementation (TDD)
- Design alternatives evaluation
- Requirements exploration

**Process**:
1. Create DP-RED Request issue (`.github/ISSUE_TEMPLATE/dp-red.yml`)
2. Document design question clearly
3. Set clear resolution condition (design decision date)
4. Get owner approval
5. Add to `qa/parking/registry.json` with category: "dp-red"
6. Link issue in registry
7. Monitor via watcher
8. Resolve before implementation begins

**Registry Entry Example**:
```json
{
  "id": "DPRED-001",
  "category": "dp-red",
  "type": "design",
  "reason": "Evaluating database migration strategy",
  "location": "architecture/DATABASE_SCHEMA.md",
  "parkedBy": "architect",
  "parkedDate": "2025-12-16T10:00:00Z",
  "expiryCondition": "Design decision documented and approved",
  "expiryDate": "2025-12-20",
  "approvedBy": "repo-owner",
  "approvalDate": "2025-12-16T10:30:00Z",
  "status": "active",
  "issueUrl": "https://github.com/.../issues/124"
}
```

### Forbidden Approaches

**Never allowed**:
- `.skip()` tests
- `.only()` tests
- Commenting out tests
- Conditional test skipping
- Ignoring failures
- Rationalizing RED as acceptable
- Merging while RED

---

## Build-to-GREEN Workflow

### Phase 1: Discovery (Expected RED)

1. Run QA Plan: `npm run qa:check`
2. Review QA Report: `qa/QA_REPORT.md`
3. Identify all RED categories
4. Prioritize by risk/impact
5. Create issues for each RED item
6. Plan implementation waves

### Phase 2: Systematic Gap Closure

For each RED category:

1. **Understand Requirements**
   - Read architecture document
   - Understand acceptance criteria
   - Clarify any ambiguity

2. **Implement**
   - Write tests first (TDD)
   - Implement functionality
   - Validate locally

3. **Evidence**
   - Ensure all evidence artifacts created
   - Run tests
   - Verify GREEN locally

4. **Commit**
   - Commit changes
   - Push to PR
   - CI validates

5. **Next Category**
   - Repeat until all GREEN

### Phase 3: Validation

1. Run full QA suite
2. Verify all categories GREEN
3. Verify no test dodging
4. Verify governance compliance
5. Request code review
6. Merge when GREEN

---

## CI/CD Integration

### QA Enforcement Workflow

**File**: `.github/workflows/qa-enforcement.yml`

**Jobs**:
1. **Test Dodging Check**: `node qa/detect-test-dodging.js`
2. **QA Parking Check**: `node qa/parking/watcher.js`
3. **Governance Sync Check**: `node qa/governance/sync-checker.js`
4. **Architecture QA Check**: `python3 qa/run-qa.py`
5. **Test Execution**: `npm run test:ci`
6. **Build Validation**: `npm run build`
7. **Lint Validation**: `npm run lint`
8. **Merge Gate**: Block if any RED

**Trigger**: All pushes, all PRs

**Failure Handling**: Automatic evidence capture to `qa/evidence/`

---

## Commands Reference

### Run Complete QA Check
```bash
npm run qa:check
```

Runs:
- Test dodging detection
- QA parking validation
- Governance sync check
- Test suite
- Coverage report

### Run Individual Checks
```bash
# Test dodging
node qa/detect-test-dodging.js

# QA parking
node qa/parking/watcher.js

# Governance sync
node qa/governance/sync-checker.js

# Architecture QA
python3 qa/run-qa.py

# Tests only
npm test
npm run test:ci
npm run test:coverage

# Build
npm run build

# Lint
npm run lint
```

### Evidence Capture
```bash
node qa/evidence/capture.js "type" "message" "logs"
```

---

## Traceability Matrix

This QA Plan provides complete traceability from architecture to tests:

| Architecture Document | QA Category | Test Files | Evidence |
|----------------------|-------------|------------|----------|
| DATABASE_SCHEMA.md | Category 1 | `__tests__/database/*.test.ts` | Schema validation, migrations |
| API_SPECIFICATION.md | Category 2 | `__tests__/api/*.test.ts` | Contract compliance |
| SECURITY_ARCHITECTURE.md (Auth) | Category 3 | `__tests__/auth/*.test.ts` | Auth tests |
| SECURITY_ARCHITECTURE.md | Category 4 | `__tests__/security/*.test.ts` | Security controls |
| AUDIT_LOGGING.md | Category 5 | `__tests__/audit/*.test.ts` | Audit logs |
| DATA_FLOW.md | Category 6 | `__tests__/workflows/*.test.ts` | End-to-end flows |
| FRONTEND_COMPONENTS.md | Category 7 | `__tests__/components/*.test.ts` | UI components |
| COMPONENT_BOUNDARIES.md | Category 8 | `__tests__/architecture/*.test.ts` | Boundaries |
| EXTERNAL_DEPENDENCIES.md | Category 9 | `__tests__/external/*.test.ts` | Integrations |
| DEPLOYMENT_GUIDE.md | Category 10 | `__tests__/deployment/*.test.ts` | Deployment |
| All docs | Category 11 | `__tests__/documentation/*.test.ts` | Docs |
| ARCHITECTURE.md (Performance) | Category 12 | `__tests__/performance/*.test.ts` | Performance |
| QA_GOVERNANCE_GUIDE.md | Category 13 | `__tests__/governance/*.test.ts` | Governance |

---

## Expected First Run Results

### Initial State (by Design)

Running `npm run qa:check` on initial architecture-only codebase:

**Expected Result**: 🔴 **RED**

**Expected Failures**:
- Category 1: Database Schema - 🔴 RED (models missing)
- Category 2: API Contracts - 🔴 RED (endpoints missing)
- Category 3: Authentication - 🔴 RED (tests missing)
- Category 4: Security Controls - 🔴 RED (tests missing)
- Category 5: Audit Logging - 🔴 RED (logging missing)
- Category 6: Data Flows - 🔴 RED (workflows incomplete)
- Category 7: Frontend Components - 🔴 RED (components missing)
- Category 8: Component Boundaries - 🔴 RED (tests missing)
- Category 9: External Dependencies - 🔴 RED (integrations missing)
- Category 10: Deployment - 🔴 RED (some config missing)
- Category 11: Documentation - 🟢 GREEN (docs exist)
- Category 12: Performance - 🔴 RED (tests missing)
- Category 13: Governance - 🟢 GREEN (mechanisms exist)

**Pass Rate**: ~15% (2/13 categories GREEN)

### This is Correct

The RED state reveals the implementation gap. Build-to-GREEN will systematically close this gap.

---

## Governance Alignment

This QA Plan aligns with ForemanApp Agent Contract:

### RED Ownership Invariant ✅
- RED states owned until resolved
- Resolution via Fix-to-GREEN or governed exception

### Zero Test Dodging Rule ✅
- No skips allowed
- QA Parking for implementation phase
- DP-RED for design phase

### One-Time Failure Doctrine ✅
- First run RED expected
- Prevention via test creation
- Lessons learned propagated

### Merge Gate Supremacy ✅
- Only GREEN (Gate-Eligible) allows merge
- RED blocks merge absolutely

### Evidence & Audit Discipline ✅
- Evidence artifacts defined per category
- Traceability matrix complete
- Immutable evidence on failure

---

## Evolution and Maintenance

### When to Update This Plan

1. **New Architecture Document Added**
   - Add corresponding QA category
   - Define evidence requirements
   - Add test files
   - Update traceability matrix

2. **New Requirements Discovered**
   - Add to relevant category
   - Update acceptance criteria
   - Add tests

3. **New Failure Mode Discovered**
   - Document in lessons learned
   - Strengthen QA to detect
   - Update plan to prevent recurrence

4. **Governance Policy Updated**
   - Update Category 13
   - Update governance checks

### Plan Version History

- **1.0.0** (2025-12-16): Initial QA Plan created for Issue PP-TN-04

---

## Summary

This QA Plan provides:

✅ **Gap Analysis Approach**: Architecture as requirements, tests as validation  
✅ **13 QA Categories**: Mapped to architecture documents  
✅ **Complete Evidence Requirements**: Files, tests, documentation per category  
✅ **Clear GREEN Definitions**: Local GREEN vs Gate-Eligible GREEN  
✅ **Governed RED Handling**: QA Parking and DP-RED with no skips  
✅ **Build-to-GREEN Workflow**: Systematic gap closure process  
✅ **Traceability Matrix**: Architecture → QA → Tests → Evidence  
✅ **First Run RED by Design**: Reveals all gaps for closure  

**This plan drives Build-to-Green without guesswork.**

---

*END OF QA PLAN*
