# Database Schema Architecture

## Overview

This document defines the complete database schema for PartPulse based on the requirements in APP_DESCRIPTION.md. The schema supports internal part transfers, warranty claim processing, user management, audit logging, and reporting.

---

## Database Provider

- **Development**: SQLite
- **Production**: PostgreSQL
- **ORM**: Prisma

---

## Data Models

### User Model

Represents system users (Administrators and Technicians).

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    // bcrypt hashed
  role          Role      @default(TECHNICIAN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  isActive      Boolean   @default(true)
  
  // Relations
  transfers     InternalTransfer[]
  claims        WarrantyClaim[]
  auditLogs     AuditLog[]
  invitations   Invitation[]      // Invitations sent by this user
}

enum Role {
  ADMIN
  TECHNICIAN
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `email`: Unique email address for login
- `name`: Full name of user
- `password`: Hashed password (bcrypt with 10 salt rounds)
- `role`: User role (ADMIN or TECHNICIAN)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp
- `lastLoginAt`: Last successful login timestamp
- `isActive`: Account status (for soft delete)

**Indexes:**
- Primary: `id`
- Unique: `email`
- Index: `role`, `isActive`

---

### InternalTransfer Model

Represents internal part transfers between technicians and locations.

```prisma
model InternalTransfer {
  id                String        @id @default(cuid())
  transferNumber    String        @unique @default(cuid())
  date              DateTime      @default(now())
  fromUser          User          @relation(fields: [fromUserId], references: [id])
  fromUserId        String
  toLocation        String
  partNumber        String
  partDescription   String
  quantity          Int
  serialNumbers     String?       // JSON array
  notes             String?
  urgency           Urgency       @default(NORMAL)
  status            TransferStatus @default(PENDING)
  expectedDelivery  DateTime?
  trackingNumber    String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  // Relations
  auditLogs         AuditLog[]
}

enum TransferStatus {
  PENDING
  IN_TRANSIT
  COMPLETED
  CANCELLED
}

enum Urgency {
  NORMAL
  HIGH
  CRITICAL
}
```

**Fields:**
- `id`: Unique identifier
- `transferNumber`: Human-readable transfer number
- `date`: Transfer date
- `fromUserId`: User initiating the transfer
- `toLocation`: Destination location/technician
- `partNumber`: Trane part number
- `partDescription`: Part description
- `quantity`: Number of parts transferred
- `serialNumbers`: JSON array of serial numbers (optional)
- `notes`: Additional notes (optional)
- `urgency`: Priority level
- `status`: Current transfer status
- `expectedDelivery`: Expected delivery date (optional)
- `trackingNumber`: Shipping tracking number (optional)

**Indexes:**
- Primary: `id`
- Unique: `transferNumber`
- Index: `fromUserId`, `status`, `createdAt`, `urgency`

---

### WarrantyClaim Model

Represents warranty claims for defective Trane parts.

```prisma
model WarrantyClaim {
  id                  String        @id @default(cuid())
  claimNumber         String        @unique @default(cuid())
  dateSubmitted       DateTime      @default(now())
  submittedBy         User          @relation(fields: [submittedById], references: [id])
  submittedById       String
  partNumber          String
  partDescription     String
  serialNumber        String
  failureDescription  String
  purchaseDate        DateTime
  warrantyStatus      WarrantyStatus
  customerName        String?
  customerContact     String?
  returnAddress       String?
  photos              String?       // JSON array of URLs
  diagnosticNotes     String?
  resolutionType      ResolutionType?
  status              ClaimStatus   @default(SUBMITTED)
  reviewerId          String?
  reviewedBy          User?         @relation("ReviewedClaims", fields: [reviewerId], references: [id])
  reviewDate          DateTime?
  reviewNotes         String?
  resolvedAt          DateTime?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  
  // Relations
  auditLogs           AuditLog[]
}

enum WarrantyStatus {
  UNDER_WARRANTY
  EXPIRED
  UNKNOWN
}

enum ClaimStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  DENIED
  RESOLVED
}

enum ResolutionType {
  REPAIR
  REPLACE
  REFUND
  DENY
}
```

**Fields:**
- `id`: Unique identifier
- `claimNumber`: Human-readable claim number
- `dateSubmitted`: Submission timestamp
- `submittedById`: Technician who submitted claim
- `partNumber`: Trane part number
- `partDescription`: Part description
- `serialNumber`: Serial number of failed part (mandatory)
- `failureDescription`: Detailed failure description
- `purchaseDate`: Original purchase date
- `warrantyStatus`: Warranty coverage status
- `customerName`: Customer name (optional)
- `customerContact`: Customer contact info (optional)
- `returnAddress`: Return shipping address (optional)
- `photos`: JSON array of photo URLs (optional)
- `diagnosticNotes`: Technical diagnostic notes (optional)
- `resolutionType`: How claim was resolved (optional)
- `status`: Current claim status
- `reviewerId`: Admin who reviewed (optional)
- `reviewDate`: Review timestamp (optional)
- `reviewNotes`: Admin review notes (optional)
- `resolvedAt`: Resolution timestamp (optional)

**Indexes:**
- Primary: `id`
- Unique: `claimNumber`
- Index: `submittedById`, `reviewerId`, `status`, `warrantyStatus`, `createdAt`

---

### Invitation Model

Represents employee invitation tokens.

```prisma
model Invitation {
  id            String    @id @default(cuid())
  email         String
  role          Role
  token         String    @unique
  invitedBy     User      @relation(fields: [invitedById], references: [id])
  invitedById   String
  message       String?
  expiresAt     DateTime
  acceptedAt    DateTime?
  createdAt     DateTime  @default(now())
}
```

**Fields:**
- `id`: Unique identifier
- `email`: Email address of invitee
- `role`: Role to assign upon acceptance
- `token`: Unique, cryptographically secure token
- `invitedById`: Admin who sent invitation
- `message`: Optional welcome message
- `expiresAt`: Expiration timestamp (7 days from creation)
- `acceptedAt`: Acceptance timestamp (null if not accepted)
- `createdAt`: Invitation creation timestamp

**Indexes:**
- Primary: `id`
- Unique: `token`
- Index: `email`, `invitedById`, `expiresAt`

---

### AuditLog Model

Represents comprehensive audit trail for compliance.

```prisma
model AuditLog {
  id            String    @id @default(cuid())
  timestamp     DateTime  @default(now())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  action        String    // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
  resourceType  String    // User, Transfer, Claim, Invitation, etc.
  resourceId    String?
  changes       String?   // JSON of before/after
  ipAddress     String?
  userAgent     String?
  success       Boolean   @default(true)
  errorMessage  String?
  
  // Relations
  transfer      InternalTransfer? @relation(fields: [transferId], references: [id])
  transferId    String?
  claim         WarrantyClaim?    @relation(fields: [claimId], references: [id])
  claimId       String?
}
```

**Fields:**
- `id`: Unique identifier
- `timestamp`: Event timestamp
- `userId`: User who performed action
- `action`: Action performed (CREATE, UPDATE, DELETE, LOGIN, etc.)
- `resourceType`: Type of resource affected
- `resourceId`: ID of affected resource (optional)
- `changes`: JSON string of before/after state (optional)
- `ipAddress`: IP address of request (optional)
- `userAgent`: User agent string (optional)
- `success`: Whether action succeeded
- `errorMessage`: Error message if failed (optional)

**Indexes:**
- Primary: `id`
- Index: `userId`, `timestamp`, `action`, `resourceType`, `resourceId`

---

## Data Relationships

### User Relationships
- **One-to-Many**: User → InternalTransfer (as `fromUser`)
- **One-to-Many**: User → WarrantyClaim (as `submittedBy`)
- **One-to-Many**: User → WarrantyClaim (as `reviewedBy`)
- **One-to-Many**: User → Invitation (as `invitedBy`)
- **One-to-Many**: User → AuditLog

### Transfer Relationships
- **Many-to-One**: InternalTransfer → User
- **One-to-Many**: InternalTransfer → AuditLog

### Claim Relationships
- **Many-to-One**: WarrantyClaim → User (submitter)
- **Many-to-One**: WarrantyClaim → User (reviewer)
- **One-to-Many**: WarrantyClaim → AuditLog

### Invitation Relationships
- **Many-to-One**: Invitation → User (inviter)

---

## Data Integrity Constraints

### Mandatory Fields
- User: `email`, `name`, `password`, `role`
- InternalTransfer: `fromUserId`, `toLocation`, `partNumber`, `partDescription`, `quantity`
- WarrantyClaim: `submittedById`, `partNumber`, `partDescription`, `serialNumber`, `failureDescription`, `purchaseDate`, `warrantyStatus`
- Invitation: `email`, `role`, `token`, `invitedById`, `expiresAt`
- AuditLog: `userId`, `action`, `resourceType`

### Unique Constraints
- User: `email`
- InternalTransfer: `transferNumber`
- WarrantyClaim: `claimNumber`
- Invitation: `token`

### Cascading Deletes
- User deletion → cascade to InternalTransfer, WarrantyClaim, Invitation, AuditLog
- InternalTransfer deletion → cascade to AuditLog
- WarrantyClaim deletion → cascade to AuditLog

---

## Data Retention & Privacy

### Retention Policies
- **User Data**: Retained indefinitely while account is active
- **Transfer Records**: Retained for 7 years (regulatory compliance)
- **Warranty Claims**: Retained for 10 years (warranty and legal compliance)
- **Audit Logs**: Retained for 7 years (regulatory compliance)
- **Invitations**: Deleted 30 days after expiration

### Privacy Considerations
- Passwords hashed with bcrypt (10 rounds)
- No plain-text passwords stored
- Personal data encrypted at rest (database-level encryption)
- Audit logs track all access to sensitive data
- GDPR-compliant data export and deletion capabilities

---

## Indexing Strategy

### Performance-Critical Indexes
1. **User lookup by email** (login): `email` (unique)
2. **Transfer list by user**: `fromUserId`, `createdAt`
3. **Transfer list by status**: `status`, `createdAt`
4. **Claim list by technician**: `submittedById`, `createdAt`
5. **Claim list by status**: `status`, `createdAt`
6. **Audit log queries**: `userId`, `timestamp`, `resourceType`

### Composite Indexes
- `(userId, timestamp DESC)` for audit log queries
- `(status, createdAt DESC)` for transfer/claim lists
- `(resourceType, resourceId)` for audit trail lookup

---

## Migration Strategy

### Initial Migration
1. Create all tables and relationships
2. Create indexes
3. Seed initial admin user
4. Seed sample data (development only)

### Schema Updates
- Use Prisma Migrate for version-controlled migrations
- All migrations must be idempotent
- Rollback support for all migrations
- Test migrations in development before production

---

## Backup & Recovery

### Backup Strategy
- **Frequency**: Daily full backups, hourly incremental
- **Retention**: 30 days rolling retention
- **Location**: Off-site encrypted backup storage
- **Testing**: Monthly backup restoration tests

### Recovery Procedures
1. Identify backup to restore
2. Stop application services
3. Restore database from backup
4. Verify data integrity
5. Resume application services
6. Log recovery event in audit trail

---

## Compliance Mapping

### Audit Trail Requirements (ISO 27001)
- All user actions logged in AuditLog
- Immutable audit records
- 7-year retention
- Who, What, When, Where captured

### Data Privacy (GDPR)
- User consent for data collection
- Data portability (export capability)
- Right to erasure (soft delete with audit trail)
- Data minimization (only collect necessary data)

---

## Security Considerations

### SQL Injection Prevention
- Prisma ORM parameterized queries
- No raw SQL unless absolutely necessary
- Input validation on all fields

### Data Encryption
- Passwords: bcrypt hashing (10 rounds)
- Sensitive fields: Application-level encryption (future)
- Database: At-rest encryption (provider-level)
- Transit: TLS 1.3 for all database connections

### Access Control
- Role-based access enforced at application layer
- Database credentials restricted by environment
- Principle of least privilege for database users

---

## Performance Targets

### Query Performance
- Simple queries: < 10ms
- Complex queries: < 50ms
- Report generation: < 500ms
- Bulk operations: < 2s per 1000 records

### Scalability
- Support 10,000+ users
- Handle 1M+ transfers per year
- Store 500K+ warranty claims
- Maintain 10M+ audit log entries

---

## Future Enhancements

### Phase 2 (Planned)
- Full-text search on part descriptions
- Geospatial queries for location-based transfers
- Time-series analytics for trend analysis
- Data warehousing for historical reporting

### Phase 3 (Considered)
- Multi-tenant architecture
- Sharding for horizontal scalability
- Read replicas for reporting workloads
- Event sourcing for complex audit requirements

---

## Database Schema Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (UQ)      │
│ name            │
│ password        │
│ role            │
│ createdAt       │
│ updatedAt       │
│ lastLoginAt     │
│ isActive        │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴──────────────────┬─────────────────┬────────────────┐
    │                       │                 │                │
    ▼                       ▼                 ▼                ▼
┌────────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│InternalTransfer│  │WarrantyClaim │  │ Invitation  │  │  AuditLog    │
├────────────────┤  ├──────────────┤  ├─────────────┤  ├──────────────┤
│ id (PK)        │  │ id (PK)      │  │ id (PK)     │  │ id (PK)      │
│ transferNumber │  │ claimNumber  │  │ email       │  │ timestamp    │
│ fromUserId(FK) │  │ submittedBy  │  │ token (UQ)  │  │ userId (FK)  │
│ date           │  │ partNumber   │  │ invitedBy   │  │ action       │
│ toLocation     │  │ serialNumber │  │ role        │  │ resourceType │
│ partNumber     │  │ status       │  │ expiresAt   │  │ resourceId   │
│ quantity       │  │ reviewerId   │  └─────────────┘  │ changes      │
│ status         │  │ createdAt    │                   │ ipAddress    │
│ createdAt      │  └──────────────┘                   └──────────────┘
└────────────────┘
```

---

## Checklist Compliance

This document satisfies the following Architecture Design Checklist items:

### Phase 2: Architecture Design
- ✅ Data Design: Database schema designed and documented
- ✅ Data Design: Data retention policies defined
- ✅ Data Design: Backup and recovery strategy documented
- ✅ Data Design: Data integrity constraints defined
- ✅ Data Design: Indexing strategy planned
- ✅ Data Design: Data privacy requirements addressed
- ✅ Data Design: Audit trail requirements defined

### Phase 3: Design Validation
- ✅ Security Review: Compliance validation completed

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved
