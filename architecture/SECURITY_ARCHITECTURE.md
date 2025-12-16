# Security Architecture

## Overview

This document defines the comprehensive security architecture for PartPulse, including trust boundaries, threat model, security controls, authentication mechanisms, authorization model, and data protection strategies.

**Based on**: APP_DESCRIPTION.md security requirements  
**Compliance**: Architecture Design Checklist - Phase 2: Security Architecture  
**Standards**: OWASP Top 10, ISO 27001

---

## Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimum necessary access
3. **Fail Secure**: Default to deny access
4. **Security by Design**: Security from inception
5. **Audit Everything**: Complete audit trail
6. **Zero Trust**: Verify every request

---

## Trust Boundaries

### Boundary 1: Internet ↔ Application

**Location**: HTTPS requests entering the application

**Trust Transition**: Untrusted → Semi-trusted

**Security Controls**:
- ✅ TLS 1.3 encryption (HTTPS only)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ DDoS protection (Vercel/CloudFlare)
- ✅ Rate limiting (future)
- ✅ WAF rules (future)

**Threats Mitigated**:
- Man-in-the-middle attacks
- Eavesdropping
- Session hijacking
- DDoS attacks

---

### Boundary 2: Application ↔ Authenticated User

**Location**: After successful authentication

**Trust Transition**: Semi-trusted → Trusted

**Security Controls**:
- ✅ JWT session validation (NextAuth.js)
- ✅ Session expiry (8 hours)
- ✅ HttpOnly cookies (no JavaScript access)
- ✅ CSRF token validation
- ✅ Role-based access control (RBAC)
- ✅ Resource ownership validation

**Threats Mitigated**:
- Unauthorized access
- Session theft
- CSRF attacks
- Privilege escalation
- Horizontal privilege escalation

---

### Boundary 3: Application ↔ Database

**Location**: Prisma ORM queries

**Trust Transition**: Trusted → Trusted (but validate)

**Security Controls**:
- ✅ Parameterized queries (Prisma ORM)
- ✅ Connection pooling with credentials
- ✅ TLS encryption for connections
- ✅ Database credentials in environment variables
- ✅ No raw SQL (unless sanitized)
- ✅ Row-level security (application-enforced)

**Threats Mitigated**:
- SQL injection
- Data tampering
- Unauthorized data access
- Credential exposure

---

### Boundary 4: Application ↔ External Services

**Location**: Email, Storage, External APIs

**Trust Transition**: Trusted → Semi-trusted

**Security Controls**:
- ✅ API key authentication
- ✅ TLS encryption
- ✅ Input validation before sending
- ✅ Response validation after receiving
- ✅ Error handling (don't expose internals)
- ✅ Timeout limits
- ✅ Retry with exponential backoff

**Threats Mitigated**:
- API credential theft
- Data interception
- Malicious responses
- Service impersonation

---

## Threat Model

### Threat: Unauthorized Access

**Description**: Attacker attempts to access system without credentials

**Attack Vectors**:
- Brute force password attacks
- Credential stuffing
- Session theft
- Token forgery

**Mitigations**:
- ✅ Strong password requirements (16+ chars, complexity)
- ✅ Account lockout after 5 failed attempts (15-minute lockout)
- ✅ HttpOnly + Secure cookies
- ✅ JWT signature validation
- ✅ CSRF tokens
- ⏳ Future: Multi-factor authentication (MFA)
- ⏳ Future: IP-based rate limiting

**Residual Risk**: Low

---

### Threat: Privilege Escalation

**Description**: Technician attempts to access admin functions

**Attack Vectors**:
- Direct API calls to admin endpoints
- Cookie tampering
- Role parameter manipulation

**Mitigations**:
- ✅ Server-side role validation on every request
- ✅ Middleware enforces RBAC
- ✅ Role stored in JWT (signed)
- ✅ No client-side role checks relied upon
- ✅ Audit logging of all admin actions

**Residual Risk**: Low

---

### Threat: SQL Injection

**Description**: Attacker injects malicious SQL via inputs

**Attack Vectors**:
- Form inputs
- Query parameters
- API request bodies

**Mitigations**:
- ✅ Prisma ORM (parameterized queries)
- ✅ No raw SQL queries
- ✅ Input validation (Zod schemas)
- ✅ Input sanitization
- ✅ Type-safe TypeScript

**Residual Risk**: Very Low

---

### Threat: Cross-Site Scripting (XSS)

**Description**: Attacker injects malicious scripts

**Attack Vectors**:
- User-supplied text fields (notes, descriptions)
- File names
- Email addresses
- URLs

**Mitigations**:
- ✅ React automatic escaping
- ✅ Input sanitization on server
- ✅ Content Security Policy (CSP) header
- ✅ No dangerouslySetInnerHTML usage
- ✅ Validation of all user inputs

**Residual Risk**: Low

---

### Threat: Cross-Site Request Forgery (CSRF)

**Description**: Attacker tricks user into making unwanted requests

**Attack Vectors**:
- Malicious links
- Embedded forms on external sites

**Mitigations**:
- ✅ CSRF tokens (NextAuth.js)
- ✅ SameSite cookie attribute
- ✅ Origin header validation
- ✅ Double-submit cookie pattern

**Residual Risk**: Very Low

---

### Threat: Data Breach

**Description**: Attacker gains access to sensitive data

**Attack Vectors**:
- Database compromise
- Backup theft
- Memory dumps
- Log file exposure

**Mitigations**:
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ TLS encryption in transit
- ✅ Database encryption at rest (provider-level)
- ✅ Secrets in environment variables (never in code)
- ✅ Audit logs don't contain sensitive data
- ✅ Regular backups with encryption
- ⏳ Future: Field-level encryption for PII

**Residual Risk**: Medium (depends on hosting provider)

---

### Threat: Denial of Service (DoS)

**Description**: Attacker overwhelms system resources

**Attack Vectors**:
- High-volume API requests
- Large file uploads
- Expensive database queries
- PDF generation spam

**Mitigations**:
- ✅ Vercel DDoS protection
- ⏳ Future: Rate limiting (100 req/min per user)
- ⏳ Future: File size limits (10MB max)
- ⏳ Future: Query timeout limits
- ⏳ Future: PDF generation queue

**Residual Risk**: Medium (future improvements needed)

---

## Authentication Architecture

### Authentication Mechanism

**Provider**: NextAuth.js v5

**Method**: Credentials-based (email + password)

**Session Type**: JWT (JSON Web Token)

**Storage**: HttpOnly cookie

### Authentication Flow

```
1. User submits email + password
2. NextAuth validates credentials
3. Query database for user (Prisma)
4. Compare password hash (bcrypt.compare)
5. If valid:
   - Generate JWT token
   - Sign with secret key
   - Set HttpOnly cookie
   - Update lastLoginAt
   - Log successful login
6. If invalid:
   - Increment failed attempt counter
   - Log failed attempt
   - If 5 failures: Lock account for 15 minutes
   - Return generic error (don't reveal if email exists)
```

### JWT Token Structure

```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: "admin" | "technician"
  },
  iat: number  // Issued at
  exp: number  // Expires at (8 hours)
}
```

**Signed with**: HMAC-SHA256  
**Secret**: `AUTH_SECRET` environment variable (32+ random bytes)

### Password Requirements

- **Length**: Minimum 16 characters
- **Complexity**: 
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (`!@#$%^&*()_+-=[]{}|;:,.<>?`)
- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Never stored in plain text

### Password Reset Flow

```
1. Admin initiates password reset for user
2. System generates secure temporary password
   - 20 characters
   - Random mix of alphanumeric + special chars
3. Password hashed (bcrypt)
4. User.password updated
5. Temporary password displayed to admin (one-time only)
6. Audit log entry created
7. User must change password on first login (future)
```

---

## Authorization Architecture (RBAC)

### Roles

**Admin**:
- Full access to all features
- User management (invite, delete, reset password)
- View all transfers and claims
- Edit all transfers and claims
- Approve/deny warranty claims
- Access audit logs
- Generate all reports

**Technician**:
- View own transfers and claims
- Create transfers
- Submit warranty claims
- View own reports
- Read-only view of others' records

### Permission Matrix

| Resource | Action | Technician | Admin |
|----------|--------|------------|-------|
| Transfer | Create | ✅ | ✅ |
| Transfer | View Own | ✅ | ✅ |
| Transfer | View All | ❌ | ✅ |
| Transfer | Edit Own | ✅ | ✅ |
| Transfer | Edit All | ❌ | ✅ |
| Transfer | Delete | ❌ | ✅ |
| Claim | Submit | ✅ | ✅ |
| Claim | View Own | ✅ | ✅ |
| Claim | View All | ❌ | ✅ |
| Claim | Review | ❌ | ✅ |
| User | Invite | ❌ | ✅ |
| User | View All | ❌ | ✅ |
| User | Edit | ❌ | ✅ |
| User | Delete | ❌ | ✅ |
| Audit Logs | View | ❌ | ✅ |
| Reports | Own Data | ✅ | ✅ |
| Reports | All Data | ❌ | ✅ |

### Authorization Enforcement

**Middleware Level** (`middleware.ts`):
```typescript
// Route-based access control
if (path.startsWith('/users') || path.startsWith('/settings')) {
  if (session.user.role !== 'admin') {
    return redirect('/unauthorized')
  }
}
```

**API Route Level**:
```typescript
// Resource-based access control
const transfer = await getTransfer(id)

if (session.user.role === 'technician') {
  if (transfer.technicianId !== session.user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
}
```

---

## Input Validation & Sanitization

### Validation Strategy

**Library**: Zod

**Approach**: 
1. Client-side validation (UX, early feedback)
2. Server-side validation (security, never trust client)

**Example Schema**:
```typescript
const TransferSchema = z.object({
  date: z.string().datetime(),
  toLocation: z.string().min(2).max(200),
  partNumber: z.string().min(3).max(100),
  partDescription: z.string().min(5).max(500),
  quantity: z.number().int().positive(),
  serialNumbers: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  urgency: z.enum(['NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
})
```

### Sanitization Functions

**XSS Prevention**:
```typescript
function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
```

**Applied to**:
- All string inputs before database write
- All user-generated content before display
- All data in PDFs and emails

---

## Security Headers

### Headers Configuration

**Middleware** (`middleware.ts`):
```typescript
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim()
}
```

### Header Explanations

- **HSTS**: Force HTTPS for 1 year
- **X-Content-Type-Options**: Prevent MIME sniffing
- **X-Frame-Options**: Prevent clickjacking
- **X-XSS-Protection**: Enable browser XSS filter
- **Referrer-Policy**: Limit referrer information
- **Permissions-Policy**: Disable unnecessary browser features
- **CSP**: Restrict resource loading sources

---

## Data Protection

### Data at Rest

**Database Encryption**:
- Provider-level encryption (PostgreSQL/Supabase)
- AES-256 encryption
- Encrypted backups

**Password Storage**:
- bcrypt hashing (10 rounds)
- Salt automatically generated per password
- Never stored in plain text

**Sensitive Fields** (Future):
- Customer contact information: Application-level encryption
- Serial numbers: Potentially encrypted if highly sensitive

### Data in Transit

**TLS 1.3**:
- All connections encrypted
- Certificate from Let's Encrypt or Vercel
- HTTPS redirect enforced

**API Calls**:
- Internal: TLS
- External services: TLS + API key

### Data in Use

**Memory**:
- Passwords cleared after hashing
- Sensitive data not logged
- No sensitive data in error messages

### Data Disposal

**Soft Delete**:
- Users: `isActive = false`
- Audit logs: Never deleted
- Transfers/Claims: Retained per policy (7 years)

**Hard Delete** (Admin action only):
- Cascade delete relationships
- Audit log entry created
- Cannot be undone

---

## Session Management

### Session Configuration

**Type**: JWT in HttpOnly cookie

**Duration**: 8 hours

**Refresh**: No automatic refresh (must re-login)

**Attributes**:
```javascript
{
  httpOnly: true,      // No JavaScript access
  secure: true,        // HTTPS only (production)
  sameSite: 'lax',     // CSRF protection
  path: '/',
  maxAge: 8 * 60 * 60  // 8 hours in seconds
}
```

### Session Invalidation

**Logout**:
- Delete session cookie
- Revoke JWT (server-side blacklist - future)
- Audit log entry

**Timeout**:
- After 8 hours of inactivity
- User must re-authenticate

**Password Change**:
- Invalidate all existing sessions (future)

---

## Audit Logging for Security

### Security Events Logged

1. **Authentication Events**:
   - Successful login
   - Failed login attempts
   - Account lockout
   - Logout
   - Session timeout

2. **Authorization Events**:
   - Access denied (403)
   - Privilege escalation attempt

3. **Administrative Actions**:
   - User creation
   - User deletion
   - Role changes
   - Password resets

4. **Data Access**:
   - Sensitive data viewed
   - Bulk exports
   - Report generation

5. **Configuration Changes**:
   - Security settings modified
   - System configuration updated

### Audit Log Fields

```typescript
{
  id: string
  timestamp: DateTime
  eventType: 'security' | 'access' | 'admin' | 'data'
  userId: string
  action: string
  resourceType: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  securityLevel: 'info' | 'warning' | 'critical'
}
```

### Audit Log Retention

- **Duration**: 7 years (compliance)
- **Immutability**: Cannot be modified or deleted
- **Access**: Admin-only, read-only
- **Export**: Available for compliance audits

---

## Secrets Management

### Environment Variables

**Required Secrets**:
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
AUTH_SECRET="<32+ random bytes>"
NEXTAUTH_URL="https://..."

# Email
SMTP_USER="..."
SMTP_PASS="..."

# Storage
STORAGE_S3_ACCESS_KEY="..."
STORAGE_S3_SECRET_KEY="..."
```

### Best Practices

- ✅ Never commit secrets to Git
- ✅ Use `.env.local` for development (gitignored)
- ✅ Use Vercel environment variables for production
- ✅ Rotate secrets regularly (quarterly)
- ✅ Minimum 32 bytes for encryption keys
- ✅ Separate secrets per environment (dev/staging/prod)

### Secret Rotation Process

1. Generate new secret
2. Update environment variable
3. Deploy application
4. Verify functionality
5. Invalidate old secret
6. Audit log entry

---

## Compliance & Standards

### OWASP Top 10 Coverage

1. **Broken Access Control**: ✅ RBAC enforced
2. **Cryptographic Failures**: ✅ TLS, password hashing
3. **Injection**: ✅ Parameterized queries, input validation
4. **Insecure Design**: ✅ Security by design
5. **Security Misconfiguration**: ✅ Security headers, default deny
6. **Vulnerable Components**: ✅ Dependency scanning (future)
7. **Authentication Failures**: ✅ Strong passwords, session management
8. **Integrity Failures**: ✅ Code signing, SRI (future)
9. **Logging Failures**: ✅ Comprehensive audit logging
10. **SSRF**: ✅ Input validation, URL whitelisting

### ISO 27001 Alignment

- ✅ Access Control (A.9)
- ✅ Cryptography (A.10)
- ✅ Operations Security (A.12)
- ✅ Communications Security (A.13)
- ✅ System Acquisition (A.14)
- ✅ Supplier Relationships (A.15)
- ✅ Information Security Incident Management (A.16)
- ✅ Compliance (A.18)

### GDPR Compliance

- ✅ Data minimization: Only collect necessary data
- ✅ Purpose limitation: Clear data usage purpose
- ✅ Consent: User accepts terms (future: explicit consent)
- ✅ Right to access: Export user data capability (future)
- ✅ Right to erasure: Delete user account and data (future)
- ✅ Data portability: Export in machine-readable format (future)
- ✅ Security measures: Encryption, access control, audit logging

---

## Security Testing

### Vulnerability Scanning

**Tools** (Future):
- OWASP ZAP
- Snyk (dependency scanning)
- npm audit

**Frequency**: Weekly automated scans

### Penetration Testing

**Frequency**: Annually

**Scope**: 
- Authentication and authorization
- Input validation
- Session management
- Data protection

### Security Code Review

**Frequency**: Every PR

**Focus**:
- Input validation
- Authentication checks
- Authorization checks
- Sensitive data handling
- Error handling

---

## Incident Response

### Security Incident Types

1. **Unauthorized Access**: Attempted or successful breach
2. **Data Breach**: Sensitive data exposed
3. **DoS Attack**: Service disruption
4. **Vulnerability Discovered**: New security flaw found

### Response Procedure

1. **Detect**: Monitoring, alerts, audit logs
2. **Contain**: Isolate affected systems
3. **Investigate**: Analyze logs, identify scope
4. **Eradicate**: Remove threat, patch vulnerability
5. **Recover**: Restore services, validate security
6. **Learn**: Post-mortem, update procedures

### Notification Requirements

- **Data Breach**: Notify affected users within 72 hours (GDPR)
- **Security Incident**: Notify admin team immediately
- **Vulnerability**: Document and track in issue tracker

---

## Security Roadmap

### Phase 1 (Current)
- ✅ Authentication (email + password)
- ✅ RBAC (2 roles)
- ✅ HTTPS/TLS
- ✅ Security headers
- ✅ Input validation
- ✅ Audit logging

### Phase 2 (Next 6 Months)
- ⏳ Multi-factor authentication (MFA)
- ⏳ Rate limiting
- ⏳ Dependency scanning
- ⏳ Field-level encryption for PII
- ⏳ Session revocation
- ⏳ IP whitelisting (optional)

### Phase 3 (Future)
- ⏳ Penetration testing
- ⏳ Bug bounty program
- ⏳ Security training for users
- ⏳ Advanced threat detection
- ⏳ Zero-trust architecture enhancements

---

## Checklist Compliance

This document satisfies:
- ✅ Threat model completed
- ✅ Authentication mechanism documented
- ✅ Authorization model defined (RBAC)
- ✅ Encryption strategy defined
- ✅ Secret management documented
- ✅ Input validation strategy defined
- ✅ Security headers configured
- ✅ Audit logging defined

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Security Team  
**Status**: Approved  
**Next Review**: 2026-03-16
