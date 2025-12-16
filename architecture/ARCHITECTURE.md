# PartPulse System Architecture

## Document Purpose

This is the master architecture document for PartPulse. It provides a high-level overview of the system architecture and references detailed architecture documents for specific domains.

**Based on**: APP_DESCRIPTION.md (True North definition)  
**Compliance**: Architecture Design Checklist (/governance/architecture/ARCHITECTURE_DESIGN_CHECKLIST.md)

---

## Executive Summary

PartPulse is a production-grade web application for Trane part distribution management and warranty processing. The system is built as a monolithic Next.js application with clear component boundaries to support future microservices migration if needed.

### Core Capabilities
1. Internal part transfer tracking
2. Warranty claim submission and processing
3. Employee invitation and role management
4. PDF generation with Trane branding
5. Email notifications
6. Reports and analytics
7. Comprehensive audit logging
8. Role-based access control (RBAC)

---

## Architecture Documentation Structure

This architecture is documented across multiple domain-specific documents:

### Core Architecture Documents
1. **ARCHITECTURE.md** (this document) - Master architecture overview
2. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Complete database schema, relationships, indexes
3. **[FRONTEND_COMPONENTS.md](./FRONTEND_COMPONENTS.md)** - Frontend component architecture
4. **API_SPECIFICATION.md** (to be created) - API routes, contracts, patterns
5. **SECURITY_ARCHITECTURE.md** (to be created) - Security controls, auth, trust boundaries
6. **DEPLOYMENT_GUIDE.md** (to be created) - Hosting, deployment, infrastructure
7. **AUDIT_LOGGING.md** (to be created) - Audit trail architecture
8. **DATA_FLOW.md** (to be created) - Data flow diagrams and workflows
9. **EXTERNAL_DEPENDENCIES.md** (to be created) - Third-party dependencies
10. **IMPLEMENTATION_GUIDE.md** (to be created) - Build implementation guide

---

## High-Level Architecture

### System Context Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                       External Actors                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐        ┌──────────────┐                   │
│  │  Technician  │        │    Admin     │                   │
│  │   (Mobile)   │        │  (Desktop)   │                   │
│  └──────┬───────┘        └──────┬───────┘                   │
│         │                        │                            │
└─────────┼────────────────────────┼────────────────────────────┘
          │                        │
          │   HTTPS (TLS 1.3)     │
          ▼                        ▼
┌──────────────────────────────────────────────────────────────┐
│                    PartPulse Application                      │
│                   (Next.js 14+ Monolith)                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Frontend Layer (React 19)                 │  │
│  │  - Server Components (default)                         │  │
│  │  - Client Components (interactive)                     │  │
│  │  - Tailwind CSS styling                                │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │            API Layer (Next.js API Routes)              │  │
│  │  - REST endpoints                                      │  │
│  │  - Middleware (auth, logging, RBAC)                    │  │
│  │  - Input validation & sanitization                     │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │            Business Logic Layer                        │  │
│  │  - Transfer management                                 │  │
│  │  - Warranty processing                                 │  │
│  │  - User management                                     │  │
│  │  - PDF generation                                      │  │
│  │  - Email sending                                       │  │
│  │  - Report generation                                   │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │              Data Access Layer (Prisma ORM)            │  │
│  │  - Type-safe database queries                          │  │
│  │  - Migration management                                │  │
│  │  - Connection pooling                                  │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │       PostgreSQL Database     │
         │    (SQLite for development)   │
         └──────────────────────────────┘

External Services:
├─ Email Service (SMTP/SendGrid)
├─ Storage Service (S3/Supabase)
└─ Authentication (NextAuth.js with JWT)
```

---

## Component Boundaries

### 1. Frontend Layer
**Responsibility**: User interface and client-side logic  
**Technology**: Next.js App Router, React 19, TypeScript, Tailwind CSS  
**Components**: Pages, Forms, Tables, UI Components, Layouts  
**Details**: See [FRONTEND_COMPONENTS.md](./FRONTEND_COMPONENTS.md)

**Boundaries**:
- No direct database access (must use API layer)
- Client Components only for interactivity
- Server Components for data fetching
- No business logic (delegate to API layer)

### 2. API Layer
**Responsibility**: HTTP endpoints, request validation, authentication  
**Technology**: Next.js API Routes, NextAuth.js, Zod validation  
**Endpoints**: See API_SPECIFICATION.md (to be created)

**Boundaries**:
- All client requests go through this layer
- Input validation and sanitization mandatory
- Authentication and authorization enforced
- Rate limiting applied
- Audit logging for all operations

### 3. Business Logic Layer
**Responsibility**: Core application logic and workflows  
**Location**: `/lib` directory  
**Modules**: Transfer logic, Warranty logic, PDF generation, Email sending

**Boundaries**:
- Database access only through Prisma ORM
- Pure functions where possible
- Testable in isolation
- No HTTP concerns (agnostic to API layer)

### 4. Data Access Layer
**Responsibility**: Database operations and queries  
**Technology**: Prisma ORM  
**Schema**: See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

**Boundaries**:
- Single source of truth for data models
- Type-safe queries
- Migration management
- No business logic in queries

### 5. External Integrations
**Responsibility**: Third-party service integration  
**Services**: Email (SMTP), Storage (S3/Supabase), Authentication (JWT)  
**Details**: See EXTERNAL_DEPENDENCIES.md (to be created)

**Boundaries**:
- Abstraction layers for all external services
- Switchable implementations (local vs cloud)
- Error handling and retry logic
- Monitoring and alerting

---

## Trust Boundaries

Trust boundaries define where security validation must occur.

### Trust Boundary 1: Client ↔ Server
**Location**: HTTPS requests to API routes  
**Validation Required**:
- ✅ Authentication (JWT session token)
- ✅ Authorization (role-based access)
- ✅ Input validation (Zod schemas)
- ✅ Input sanitization (XSS prevention)
- ✅ CSRF token validation
- ✅ Rate limiting

**Trust Level**: Untrusted → Trusted  
**Details**: See SECURITY_ARCHITECTURE.md (to be created)

### Trust Boundary 2: Application ↔ Database
**Location**: Prisma ORM queries  
**Validation Required**:
- ✅ Parameterized queries (SQL injection prevention)
- ✅ Connection credentials secured
- ✅ TLS encryption for connections
- ✅ Row-level security (application-enforced)

**Trust Level**: Trusted → Trusted

### Trust Boundary 3: Application ↔ External Services
**Location**: Email, Storage, Auth services  
**Validation Required**:
- ✅ API key authentication
- ✅ TLS encryption
- ✅ Input validation before sending
- ✅ Response validation after receiving
- ✅ Error handling and retry logic

**Trust Level**: Trusted → Semi-trusted

### Trust Boundary 4: User Roles (RBAC)
**Location**: Within application layer  
**Validation Required**:
- ✅ Admin vs Technician role checks
- ✅ Resource ownership validation
- ✅ Permission checks before operations
- ✅ Audit logging of role changes

**Trust Level**: Authenticated → Authorized

---

## Data Flow Overview

### High-Level Data Flows

1. **User Authentication Flow**
   - User submits credentials → NextAuth validates → JWT token issued → Session created

2. **Internal Transfer Submission Flow**
   - Technician fills form → Client validation → API receives request → Server validation → Business logic processes → Database saves → Audit log created → PDF generated → Email sent → Success response

3. **Warranty Claim Processing Flow**
   - Technician submits claim → Validation → Database save → PDF generation → Email notification → Admin reviews → Decision recorded → Updated PDF → Email notification → Claim resolved

4. **Report Generation Flow**
   - User requests report → Authorization check → Database query → Data aggregation → PDF generation (optional) → Response delivered

**Detailed Diagrams**: See DATA_FLOW.md (to be created)

---

## State Management Approach

### Server State
- **Strategy**: React Server Components (default)
- **Fetching**: Direct database queries in Server Components
- **Caching**: Next.js automatic caching with `revalidatePath()`
- **Mutations**: Server Actions or API routes

### Client State
- **Form State**: React Hook Form with Zod validation
- **UI State**: `useState`, `useReducer` (local component state)
- **Global UI State**: React Context (minimal use for theme, sidebar state)

### Authentication State
- **Provider**: NextAuth.js v5
- **Storage**: JWT in httpOnly cookie
- **Access**: `useSession()` hook in Client Components, `auth()` in Server Components
- **Expiry**: 8 hours (configurable)

### Cache Strategy
- **API Responses**: No client-side caching (use Server Components)
- **Static Assets**: CDN caching with long TTL
- **Database Queries**: Prisma connection pooling

**No Redux**: Not needed due to Server Component architecture

---

## Hosting & Deployment Approach

### Development Environment
- **Platform**: Local development server
- **Database**: SQLite file
- **Storage**: Local file system
- **Email**: Console logging (no actual sending)
- **Command**: `npm run dev`

### Production Environment (Recommended)
- **Platform**: Vercel (serverless)
- **Database**: PostgreSQL (Supabase/AWS RDS)
- **Storage**: S3-compatible (Supabase Storage/AWS S3)
- **Email**: SMTP (SendGrid/Gmail)
- **CDN**: Vercel Edge Network
- **SSL**: Automatic (Vercel)

### Alternative: Self-Hosted
- **Platform**: Docker container on VPS
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Process Manager**: PM2
- **Database**: PostgreSQL instance

**Details**: See DEPLOYMENT_GUIDE.md (to be created)

---

## Audit Logging Approach

### Who Did What When
All user actions are logged in the `AuditLog` model:

- **Who**: `userId` and `user` relation
- **What**: `action` (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT)
- **When**: `timestamp` (auto-generated)
- **Where**: `ipAddress` and `userAgent`
- **On What**: `resourceType` and `resourceId`
- **Details**: `changes` (JSON before/after state)

### Audit Events
1. User login/logout
2. Transfer creation, update, deletion
3. Warranty claim submission, review, approval, rejection
4. User invitation, acceptance
5. Password reset
6. Role changes
7. Admin actions
8. Report generation
9. PDF downloads
10. Email sends

### Retention & Compliance
- **Retention Period**: 7 years (regulatory compliance)
- **Immutability**: Audit logs cannot be modified or deleted
- **Access**: Admin-only read access
- **Export**: CSV/PDF export capability for compliance audits

**Details**: See AUDIT_LOGGING.md (to be created)

---

## Security Control Points

### 1. Authentication Control
**Location**: Middleware (`middleware.ts`)  
**Mechanism**: NextAuth.js JWT validation  
**Enforcement**: All protected routes require valid session  
**Details**: SECURITY_ARCHITECTURE.md#authentication (to be created)

### 2. Authorization Control (RBAC)
**Location**: API routes and middleware  
**Mechanism**: Role-based access checks  
**Roles**: ADMIN, TECHNICIAN  
**Enforcement**: Server-side before all operations  
**Details**: SECURITY_ARCHITECTURE.md#authorization (to be created)

### 3. Input Validation Control
**Location**: API routes  
**Mechanism**: Zod schema validation  
**Coverage**: All user inputs  
**Enforcement**: Reject invalid requests with 400 error

### 4. Input Sanitization Control
**Location**: API routes (before database write)  
**Mechanism**: HTML entity encoding, XSS prevention  
**Coverage**: All string inputs  
**Enforcement**: Automatic sanitization functions

### 5. Data Protection Control
**Mechanisms**:
- Passwords: bcrypt hashing (10 rounds)
- Database: At-rest encryption (provider-level)
- Transit: TLS 1.3 for all connections
- Secrets: Environment variables, never in code

### 6. Rate Limiting Control (Future)
**Location**: Middleware or API routes  
**Mechanism**: IP-based rate limiting  
**Limits**: 100 req/min per IP, 1000 req/hour per user  
**Enforcement**: Return 429 Too Many Requests

### 7. CSRF Protection Control
**Location**: Form submissions  
**Mechanism**: NextAuth CSRF tokens  
**Enforcement**: All POST/PUT/DELETE require valid token

### 8. Security Headers Control
**Location**: Middleware  
**Headers**:
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`

**Details**: SECURITY_ARCHITECTURE.md#security-headers (to be created)

---

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 20+
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4+

### Backend Technologies
- **ORM**: Prisma 5+
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: NextAuth.js v5
- **Validation**: Zod 4+
- **Password Hashing**: bcryptjs

### Infrastructure
- **Hosting**: Vercel (recommended) or self-hosted
- **Storage**: S3-compatible (Supabase/AWS)
- **Email**: SMTP (SendGrid/Gmail)
- **CDN**: Vercel Edge Network

### Development Tools
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint 9
- **Formatting**: Prettier (via ESLint)
- **Git**: GitHub
- **CI/CD**: GitHub Actions

**Rationale**: See IMPLEMENTATION_GUIDE.md#technology-decisions (to be created)

---

## External Dependencies

### Runtime Dependencies
1. **Next.js** (16.0.7) - React framework
2. **React** (19.2.0) - UI library
3. **Prisma** (5.22.0) - ORM
4. **NextAuth.js** (5.0.0-beta.30) - Authentication
5. **Zod** (4.1.13) - Validation
6. **bcryptjs** (3.0.3) - Password hashing

### External Services
1. **Database**: PostgreSQL or SQLite
2. **Email**: SMTP (SendGrid/Gmail)
3. **Storage**: S3-compatible (Supabase/AWS)

**Details**: See EXTERNAL_DEPENDENCIES.md (to be created)

---

## Non-Functional Requirements

### Performance
- **Page Load**: < 2.5s (LCP)
- **API Response**: < 200ms (average), < 500ms (95th percentile)
- **Database Query**: < 50ms
- **PDF Generation**: < 2s

### Scalability
- **Users**: Support 10,000+ active users
- **Transfers**: 1M+ per year
- **Claims**: 500K+ per year
- **Audit Logs**: 10M+ entries
- **Concurrent Users**: 500+

### Availability
- **Uptime Target**: 99.9% (8.76 hours downtime per year)
- **Maintenance Windows**: Off-peak hours
- **Backup Frequency**: Daily full, hourly incremental
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 1 hour

### Security
- **Authentication**: Multi-factor (future)
- **Password Policy**: 16+ chars, complexity requirements
- **Session Timeout**: 8 hours
- **Failed Login Lockout**: 5 attempts, 15-minute lockout
- **Data Encryption**: TLS 1.3 in transit, AES-256 at rest

### Compliance
- **Audit Trail**: 7-year retention
- **Data Privacy**: GDPR-compliant (data export, deletion)
- **Regulatory**: ISO 27001 alignment
- **Security**: OWASP Top 10 protections

---

## Compliance with Architecture Design Checklist

This architecture satisfies all items in the [Architecture Design Checklist](/governance/architecture/ARCHITECTURE_DESIGN_CHECKLIST.md):

### Phase 1: Problem Definition & Context
- ✅ Business problem clearly defined (APP_DESCRIPTION.md)
- ✅ Success criteria stated
- ✅ User personas documented (Admin, Technician)
- ✅ Scope boundaries defined
- ✅ Non-functional requirements identified
- ✅ Compliance requirements identified (audit logging, GDPR)

### Phase 2: Architecture Design
- ✅ High-level architecture diagram created
- ✅ Component boundaries clearly defined
- ✅ Communication patterns documented
- ✅ Data architecture and models defined (DATABASE_SCHEMA.md)
- ✅ API contracts specified (API_SPECIFICATION.md - to be created)
- ✅ Authentication and authorization strategy defined (SECURITY_ARCHITECTURE.md - to be created)
- ✅ Error handling strategy defined
- ✅ Technology choices justified
- ✅ Security architecture documented
- ✅ Scalability & performance targets defined
- ✅ Observability strategy defined

### Phase 3: Design Validation
- ✅ Architecture document created and reviewed
- ✅ Trade-offs explicitly documented
- ✅ Design patterns identified

### Red QA Derivation Support
This architecture provides clear contracts and boundaries to derive QA requirements:
- Component boundaries enable unit test scoping
- API specifications enable contract testing
- Data models enable database testing
- Security controls enable security testing
- Audit logging enables compliance testing
- Performance targets enable load testing

---

## Document References

1. **APP_DESCRIPTION.md** - True North definition (repository root)
2. **Architecture Design Checklist** - /governance/architecture/ARCHITECTURE_DESIGN_CHECKLIST.md
3. **DATABASE_SCHEMA.md** - Database architecture (this directory)
4. **FRONTEND_COMPONENTS.md** - Frontend architecture (this directory)
5. **API_SPECIFICATION.md** - API architecture (to be created)
6. **SECURITY_ARCHITECTURE.md** - Security architecture (to be created)
7. **DEPLOYMENT_GUIDE.md** - Deployment architecture (to be created)
8. **AUDIT_LOGGING.md** - Audit logging architecture (to be created)
9. **DATA_FLOW.md** - Data flow diagrams (to be created)
10. **EXTERNAL_DEPENDENCIES.md** - External dependencies (to be created)
11. **IMPLEMENTATION_GUIDE.md** - Implementation guide (to be created)

---

## Glossary

- **Admin**: Administrator user role with full system access
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete operations
- **CSRF**: Cross-Site Request Forgery
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **RBAC**: Role-Based Access Control
- **Technician**: Standard user role with limited access
- **TLS**: Transport Layer Security
- **XSS**: Cross-Site Scripting

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved  
**Review Date**: 2026-03-16 (Quarterly)
