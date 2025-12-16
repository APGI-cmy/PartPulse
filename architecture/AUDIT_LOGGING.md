# Audit Logging Architecture

## Overview

This document defines the comprehensive audit logging architecture for PartPulse, ensuring complete traceability of all user actions for compliance, security, and operational purposes.

**Based on**: APP_DESCRIPTION.md audit requirements  
**Compliance**: ISO 27001, GDPR, SOC 2  
**Retention**: 7 years (regulatory compliance)

---

## Audit Logging Principles

1. **Who**: Always log the user who performed the action
2. **What**: Log the action and resource affected
3. **When**: Timestamp with millisecond precision
4. **Where**: Log IP address and location context
5. **Why**: Capture intent where applicable
6. **Result**: Log success or failure

---

## SystemLog Data Model

### Database Schema

```prisma
model SystemLog {
  id          String   @id @default(cuid())
  timestamp   DateTime @default(now())
  eventType   String   // Type of event (see Event Types)
  userId      String?  // User who triggered the event
  userName    String?  // Name of the user for display
  action      String   // Specific action taken
  details     String?  // JSON string with additional details
  ipAddress   String?  // IP address of the request
  userAgent   String?  // User agent string
  success     Boolean  @default(true)
  errorMessage String? // Error message if success is false
  
  @@index([eventType])
  @@index([userId])
  @@index([timestamp])
}
```

### Field Descriptions

- **id**: Unique identifier (CUID format)
- **timestamp**: Exact time of event (UTC, ISO 8601)
- **eventType**: Category of event (submission, approval, auth_event, etc.)
- **userId**: User ID who performed action (nullable for system events)
- **userName**: User's name for easy reading in logs
- **action**: Specific action (CREATE, UPDATE, DELETE, LOGIN, etc.)
- **details**: JSON string with before/after state, additional context
- **ipAddress**: IP address of the request (IPv4 or IPv6)
- **userAgent**: Browser/client user agent string
- **success**: Boolean indicating if action succeeded
- **errorMessage**: Error details if action failed

---

## Event Types

### 1. Authentication Events (`auth_event`)

**Actions**:
- `LOGIN` - Successful login
- `LOGOUT` - User logout
- `LOGIN_FAILED` - Failed login attempt
- `ACCOUNT_LOCKED` - Account locked due to failed attempts
- `SESSION_TIMEOUT` - Session expired
- `PASSWORD_RESET` - Password reset by admin

**Details Captured**:
```json
{
  "email": "user@example.com",
  "role": "technician",
  "loginMethod": "credentials",
  "failedAttempts": 3
}
```

**Example Log Entry**:
```json
{
  "id": "log_abc123",
  "timestamp": "2024-12-16T10:30:45.123Z",
  "eventType": "auth_event",
  "userId": "usr_xyz789",
  "userName": "John Technician",
  "action": "LOGIN",
  "details": "{\"email\":\"john@example.com\",\"role\":\"technician\"}",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true,
  "errorMessage": null
}
```

---

### 2. Submission Events (`submission`)

**Actions**:
- `TRANSFER_CREATED` - Internal transfer created
- `CLAIM_SUBMITTED` - Warranty claim submitted

**Details Captured**:
```json
{
  "resourceId": "transfer_123",
  "transferNumber": "TR-2024-001",
  "partNumber": "TRANE-12345",
  "quantity": 2,
  "toLocation": "Warehouse B"
}
```

**Example Log Entry**:
```json
{
  "id": "log_def456",
  "timestamp": "2024-12-16T11:00:00.000Z",
  "eventType": "submission",
  "userId": "usr_xyz789",
  "userName": "John Technician",
  "action": "TRANSFER_CREATED",
  "details": "{\"resourceId\":\"transfer_123\",\"transferNumber\":\"TR-2024-001\"}",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true,
  "errorMessage": null
}
```

---

### 3. Admin Approval Events (`admin_approval`)

**Actions**:
- `CLAIM_APPROVED` - Warranty claim approved
- `CLAIM_DENIED` - Warranty claim denied
- `TRANSFER_APPROVED` - Transfer approved (if workflow requires)

**Details Captured**:
```json
{
  "resourceId": "claim_456",
  "claimNumber": "WC-2024-050",
  "decision": "APPROVED",
  "reviewNotes": "All documentation verified",
  "previousStatus": "UNDER_REVIEW",
  "newStatus": "APPROVED"
}
```

---

### 4. User Management Events (`user_management`)

**Actions**:
- `USER_INVITED` - New user invitation sent
- `USER_CREATED` - User account created (via invitation acceptance)
- `USER_UPDATED` - User details modified
- `USER_DELETED` - User account deleted
- `USER_ROLE_CHANGED` - User role modified
- `PASSWORD_RESET` - Admin reset user password

**Details Captured**:
```json
{
  "targetUserId": "usr_abc123",
  "targetUserEmail": "newuser@example.com",
  "role": "technician",
  "changes": {
    "before": {"role": "technician"},
    "after": {"role": "admin"}
  }
}
```

---

### 5. PDF Generation Events (`pdf_generation`)

**Actions**:
- `PDF_GENERATED` - PDF document generated
- `PDF_DOWNLOADED` - PDF document downloaded

**Details Captured**:
```json
{
  "documentType": "internal_transfer",
  "resourceId": "transfer_123",
  "fileName": "transfer-TR-2024-001.pdf",
  "fileSize": 245678
}
```

---

### 6. Email Events (`email_sent`)

**Actions**:
- `EMAIL_SENT` - Email successfully sent
- `EMAIL_FAILED` - Email failed to send

**Details Captured**:
```json
{
  "to": "user@example.com",
  "subject": "Transfer Receipt - TR-2024-001",
  "emailType": "transfer_receipt",
  "success": true,
  "errorMessage": null
}
```

---

### 7. Data Access Events (`data_access`)

**Actions**:
- `REPORT_GENERATED` - Report generated
- `AUDIT_LOG_VIEWED` - Admin viewed audit logs
- `BULK_EXPORT` - Bulk data export

**Details Captured**:
```json
{
  "reportType": "transfer_summary",
  "dateRange": {
    "from": "2024-01-01",
    "to": "2024-12-31"
  },
  "filters": {
    "status": "COMPLETED",
    "technicianId": "usr_xyz789"
  },
  "recordCount": 150
}
```

---

### 8. System Events (`system_event`)

**Actions**:
- `APPLICATION_STARTED` - Application startup
- `APPLICATION_STOPPED` - Application shutdown
- `MAINTENANCE_MODE_ENABLED` - Maintenance mode activated
- `MAINTENANCE_MODE_DISABLED` - Maintenance mode deactivated
- `DATABASE_BACKUP` - Database backup completed

**Details Captured**:
```json
{
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2024-12-16T10:00:00.000Z"
}
```

---

## Audit Logging Functions

### Core Logging Function

**Location**: `/lib/logging/systemLog.ts`

```typescript
export async function logSystemEvent({
  eventType,
  userId,
  userName,
  action,
  details,
  ipAddress,
  userAgent,
  success = true,
  errorMessage,
}: SystemLogInput): Promise<void> {
  await prisma.systemLog.create({
    data: {
      timestamp: new Date(),
      eventType,
      userId,
      userName,
      action,
      details: details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent,
      success,
      errorMessage,
    },
  })
}
```

### Helper Functions

**Transfer Logging**:
```typescript
export async function logTransferCreation(
  transfer: InternalTransfer,
  userId: string,
  userName: string,
  request: Request
) {
  await logSystemEvent({
    eventType: 'submission',
    userId,
    userName,
    action: 'TRANSFER_CREATED',
    details: {
      resourceId: transfer.id,
      transferNumber: transfer.transferNumber,
      partNumber: transfer.partNumber,
      quantity: transfer.quantity,
      toLocation: transfer.toLocation,
    },
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent'),
    success: true,
  })
}
```

**Authentication Logging**:
```typescript
export async function logAuthEvent(
  action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED',
  userId: string | null,
  userName: string | null,
  details: object,
  request: Request,
  success: boolean = true,
  errorMessage?: string
) {
  await logSystemEvent({
    eventType: 'auth_event',
    userId,
    userName,
    action,
    details,
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent'),
    success,
    errorMessage,
  })
}
```

**Admin Action Logging**:
```typescript
export async function logAdminAction(
  action: string,
  userId: string,
  userName: string,
  details: object,
  request: Request
) {
  await logSystemEvent({
    eventType: 'admin_approval',
    userId,
    userName,
    action,
    details,
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent'),
    success: true,
  })
}
```

---

## When to Log

### Always Log

1. **Authentication Events**: Every login, logout, failed attempt
2. **Data Mutations**: All CREATE, UPDATE, DELETE operations
3. **Admin Actions**: All admin-specific operations
4. **Access to Sensitive Data**: Viewing audit logs, generating reports
5. **Configuration Changes**: System settings modifications
6. **Security Events**: Account lockouts, permission denied

### Never Log

1. **Passwords**: Never log passwords (plain or hashed)
2. **Tokens/Keys**: Never log JWT tokens, API keys, secrets
3. **Full Credit Card Numbers**: If accepting payments (not current scope)
4. **Personal Health Information**: If applicable (not current scope)

### Conditionally Log

1. **Read Operations**: Log bulk reads, not individual record views
2. **Search Queries**: Log searches for audit trail, but not every query
3. **Failed Operations**: Log failures with error context

---

## Audit Log Access

### Who Can Access

**Admin Only**: Read-only access to all audit logs

**API Endpoint**: `GET /api/admin/logs`

**UI Page**: `/settings/admin/logs`

### Query Capabilities

**Filters**:
- Date range (required)
- Event type
- User ID
- Action
- Success/failure
- IP address (partial match)

**Pagination**:
- Default: 50 logs per page
- Max: 100 logs per page

**Sorting**:
- Default: timestamp DESC (newest first)
- Options: timestamp ASC/DESC

**Export**:
- Format: CSV
- Includes all fields
- Max 10,000 records per export

---

## Data Retention

### Retention Period

**Duration**: 7 years

**Justification**: Regulatory compliance (financial records, audit trails)

### Retention Policy

1. **Active Logs** (0-1 year): In primary database, full query access
2. **Archived Logs** (1-7 years): Moved to archive storage, read-only access
3. **Expired Logs** (>7 years): Deleted permanently after legal hold verification

### Archival Process

**Frequency**: Annually

**Process**:
1. Select logs older than 1 year
2. Export to compressed archive file (gzip)
3. Store in long-term storage (S3 Glacier or equivalent)
4. Verify archive integrity
5. Delete from primary database
6. Create archive index for searchability

---

## Audit Log Immutability

### Immutability Requirements

- ✅ Audit logs cannot be updated after creation
- ✅ Audit logs cannot be deleted by users (even admins)
- ✅ Only system-level archival process can remove logs
- ✅ Database constraints enforce immutability

### Database Constraints

```sql
-- No UPDATE or DELETE permissions for application users
REVOKE UPDATE ON system_log FROM app_user;
REVOKE DELETE ON system_log FROM app_user;

-- Only INSERT and SELECT allowed
GRANT INSERT, SELECT ON system_log TO app_user;
```

### Tamper Detection (Future)

- Log entry hashing
- Blockchain-style chaining
- Digital signatures
- Periodic integrity verification

---

## Compliance Mapping

### ISO 27001 Requirements

**A.12.4 - Logging and Monitoring**:
- ✅ Administrator and operator logs
- ✅ Exception logs
- ✅ Fault logs
- ✅ User access logs
- ✅ Log retention policy defined
- ✅ Protection of log information

**A.9.4 - System and Application Access Control**:
- ✅ Event logging of user activities
- ✅ Recording of exceptions
- ✅ Administrative and management activities logged

### GDPR Requirements

**Article 30 - Records of Processing Activities**:
- ✅ Categories of data subjects (users)
- ✅ Purposes of processing (audit trail)
- ✅ Categories of recipients (admin access only)
- ✅ Data retention periods (7 years)
- ✅ Security measures (encryption, access control)

**Article 32 - Security of Processing**:
- ✅ Ability to ensure confidentiality (access control)
- ✅ Ability to ensure integrity (immutability)
- ✅ Ability to restore availability (backups)
- ✅ Process for regularly testing effectiveness (audit log reviews)

### SOC 2 Requirements

**CC7.2 - Monitoring Activities**:
- ✅ System monitoring for anomalies
- ✅ User activity monitoring
- ✅ Security event logging
- ✅ Incident detection and response

---

## Performance Considerations

### Write Performance

**Expected Volume**:
- Peak: 1000 log entries per hour
- Average: 200 log entries per hour

**Optimization**:
- Indexed on timestamp, userId, eventType
- Asynchronous logging (don't block main flow)
- Batch writes when possible

### Query Performance

**Optimization**:
- Partition by date (monthly or quarterly)
- Index on common filter fields
- Limit query result size (max 10,000)
- Cache frequent queries (admin dashboard stats)

### Storage Requirements

**Estimate**:
- Average log entry: 1 KB
- 200 logs/hour × 24 hours × 365 days = 1,752,000 logs/year
- Storage: ~1.75 GB/year
- 7 years: ~12.25 GB

**Cost**: Negligible on modern databases

---

## Monitoring & Alerting

### Real-Time Monitoring

**Metrics**:
- Failed login attempts (threshold: 5 per user per hour)
- Admin actions (monitor for suspicious activity)
- Data access patterns (bulk exports, unusual queries)
- Error rates (monitor for application issues)

### Alerts

**Critical Alerts**:
- Multiple failed login attempts from same IP
- Account lockout events
- Admin password reset
- Bulk data export
- Audit log access by non-admin (security breach)

**Warning Alerts**:
- High error rates
- Unusual access patterns
- Permission denied events

---

## Audit Log Review

### Regular Reviews

**Frequency**: Monthly

**Reviewers**: Admin users + Security team

**Focus Areas**:
1. Failed authentication attempts
2. Permission denied events
3. Admin actions (user management, role changes)
4. Bulk data access
5. Error patterns

### Audit Report

**Format**: PDF report with charts and tables

**Includes**:
- Summary statistics
- Top users by activity
- Failed action summary
- Security events
- Recommendations

---

## Example Audit Trail

### Transfer Creation Full Audit Trail

```
1. 2024-12-16 10:00:00 - LOGIN
   User: John Technician (usr_xyz789)
   IP: 192.168.1.100
   Status: Success

2. 2024-12-16 10:05:30 - TRANSFER_CREATED
   User: John Technician (usr_xyz789)
   Transfer: TR-2024-001
   Part: TRANE-12345 × 2
   To: Warehouse B
   Status: Success

3. 2024-12-16 10:05:35 - PDF_GENERATED
   User: System (auto)
   Document: transfer-TR-2024-001.pdf
   Size: 245 KB
   Status: Success

4. 2024-12-16 10:05:40 - EMAIL_SENT
   User: System (auto)
   To: john@example.com
   Subject: Transfer Receipt - TR-2024-001
   Status: Success

5. 2024-12-16 10:10:00 - LOGOUT
   User: John Technician (usr_xyz789)
   Status: Success
```

---

## Checklist Compliance

This document satisfies:
- ✅ Audit trail requirements defined
- ✅ Logging strategy documented
- ✅ Retention policy defined
- ✅ Access controls specified
- ✅ Compliance mapping completed

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved  
**Next Review**: 2026-03-16
