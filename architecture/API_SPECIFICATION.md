# API Specification

## Overview

This document defines the complete API architecture for PartPulse, including REST endpoints, request/response contracts, authentication patterns, error handling, and API design principles.

**Based on**: APP_DESCRIPTION.md workflows  
**Compliance**: Architecture Design Checklist - Phase 2: API Contracts

---

## API Design Principles

1. **RESTful Design**: Resources as nouns, HTTP verbs for actions
2. **Consistent Structure**: All responses follow standard format
3. **Type Safety**: TypeScript interfaces for all contracts
4. **Validation First**: Zod schemas on all inputs
5. **Error Clarity**: Descriptive error messages with codes
6. **Security by Default**: Auth required unless explicitly public

---

## API Base URL

### Development
```
http://localhost:3000/api
```

### Production
```
https://part-pulse.vercel.app/api
```

---

## Authentication

All protected endpoints require a valid session cookie from NextAuth.js.

### Session Cookie
- **Name**: `next-auth.session-token` (production) or `__Secure-next-auth.session-token` (with HTTPS)
- **Type**: JWT
- **Duration**: 8 hours
- **HttpOnly**: Yes
- **Secure**: Yes (production)
- **SameSite**: Lax

### Authentication Header
Alternatively, include JWT token:
```
Authorization: Bearer <jwt_token>
```

---

## Standard Response Format

### Success Response
```typescript
interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

---

## Authentication Endpoints

### POST /api/auth/signin
**Description**: User login  
**Auth Required**: No

**Request**:
```typescript
{
  email: string     // Valid email format
  password: string  // Min 16 characters
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      name: string
      email: string
      role: "admin" | "technician"
    }
  }
}
```

**Response (Error - 401)**:
```typescript
{
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Invalid credentials"
  }
}
```

### POST /api/auth/signout
**Description**: User logout  
**Auth Required**: Yes

**Response (Success - 200)**:
```typescript
{
  success: true
}
```

### GET /api/auth/session
**Description**: Get current session  
**Auth Required**: No (returns null if not authenticated)

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      name: string
      email: string
      role: "admin" | "technician"
    } | null
  }
}
```

---

## Internal Transfer Endpoints

### GET /api/transfers
**Description**: List internal transfers  
**Auth Required**: Yes  
**Permissions**: 
- Technician: Own transfers only
- Admin: All transfers

**Query Parameters**:
```typescript
{
  page?: number          // Default: 1
  perPage?: number       // Default: 20, Max: 100
  status?: "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED"
  urgency?: "NORMAL" | "HIGH" | "CRITICAL"
  from?: string          // ISO date
  to?: string            // ISO date
  technicianId?: string  // Admin only
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: Array<{
    id: string
    transferNumber: string
    date: string  // ISO 8601
    fromUser: {
      id: string
      name: string
      email: string
    }
    toLocation: string
    partNumber: string
    partDescription: string
    quantity: number
    serialNumbers?: string[]
    notes?: string
    urgency: "NORMAL" | "HIGH" | "CRITICAL"
    status: "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED"
    expectedDelivery?: string
    trackingNumber?: string
    createdAt: string
    updatedAt: string
  }>,
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
```

### POST /api/transfers
**Description**: Create new transfer  
**Auth Required**: Yes  
**Permissions**: All authenticated users

**Request**:
```typescript
{
  date: string               // ISO 8601, defaults to now
  toLocation: string         // Required, min 2 chars
  partNumber: string         // Required, min 3 chars
  partDescription: string    // Required, min 5 chars
  quantity: number           // Required, min 1
  serialNumbers?: string[]   // Optional
  notes?: string             // Optional, max 1000 chars
  urgency?: "NORMAL" | "HIGH" | "CRITICAL"  // Default: NORMAL
  expectedDelivery?: string  // ISO 8601, must be future
  trackingNumber?: string
}
```

**Response (Success - 201)**:
```typescript
{
  success: true,
  data: {
    id: string
    transferNumber: string
    // ... (same fields as GET response)
    pdfUrl?: string  // If PDF generated
  },
  message: "Transfer created successfully"
}
```

**Response (Error - 400)**:
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: {
      partNumber: ["Part number must be at least 3 characters"],
      quantity: ["Quantity must be at least 1"]
    }
  }
}
```

### GET /api/transfers/:id
**Description**: Get transfer details  
**Auth Required**: Yes  
**Permissions**:
- Technician: Own transfer only
- Admin: Any transfer

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: {
    // Same as POST response
  }
}
```

**Response (Error - 404)**:
```typescript
{
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Transfer not found"
  }
}
```

### PUT /api/transfers/:id
**Description**: Update transfer  
**Auth Required**: Yes  
**Permissions**:
- Technician: Own transfer only (before completion)
- Admin: Any transfer

**Request**: Same as POST, all fields optional

**Response**: Same as GET

### DELETE /api/transfers/:id
**Description**: Delete transfer (soft delete)  
**Auth Required**: Yes  
**Permissions**: Admin only

**Response (Success - 200)**:
```typescript
{
  success: true,
  message: "Transfer deleted"
}
```

---

## Warranty Claim Endpoints

### GET /api/warranty-claims
**Description**: List warranty claims  
**Auth Required**: Yes  
**Permissions**:
- Technician: Own claims only
- Admin: All claims

**Query Parameters**:
```typescript
{
  page?: number
  perPage?: number
  status?: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "DENIED" | "RESOLVED"
  warrantyStatus?: "UNDER_WARRANTY" | "EXPIRED" | "UNKNOWN"
  from?: string  // ISO date
  to?: string    // ISO date
  technicianId?: string  // Admin only
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: Array<{
    id: string
    claimNumber: string
    dateSubmitted: string
    submittedBy: {
      id: string
      name: string
      email: string
    }
    partNumber: string
    partDescription: string
    serialNumber: string
    failureDescription: string
    purchaseDate: string
    warrantyStatus: "UNDER_WARRANTY" | "EXPIRED" | "UNKNOWN"
    customerName?: string
    customerContact?: string
    returnAddress?: string
    photos?: string[]
    diagnosticNotes?: string
    resolutionType?: "REPAIR" | "REPLACE" | "REFUND" | "DENY"
    status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "DENIED" | "RESOLVED"
    reviewerId?: string
    reviewDate?: string
    reviewNotes?: string
    resolvedAt?: string
    createdAt: string
    updatedAt: string
  }>,
  pagination: {...}
}
```

### POST /api/warranty-claims
**Description**: Create warranty claim  
**Auth Required**: Yes  
**Permissions**: All authenticated users

**Request**:
```typescript
{
  partNumber: string           // Required
  partDescription: string      // Required
  serialNumber: string         // Required (mandatory per Trane)
  failureDescription: string   // Required, min 10 chars
  purchaseDate: string         // ISO 8601, must be in past
  warrantyStatus: "UNDER_WARRANTY" | "EXPIRED" | "UNKNOWN"
  customerName?: string
  customerContact?: string
  returnAddress?: string
  photos?: string[]            // URLs to uploaded photos
  diagnosticNotes?: string
}
```

**Response (Success - 201)**:
```typescript
{
  success: true,
  data: {
    // Same as GET response
    pdfUrl?: string
  },
  message: "Warranty claim submitted successfully"
}
```

### POST /api/warranty-claims/:id/review
**Description**: Admin review of claim  
**Auth Required**: Yes  
**Permissions**: Admin only

**Request**:
```typescript
{
  decision: "APPROVED" | "DENIED"
  reviewNotes?: string
  resolutionType?: "REPAIR" | "REPLACE" | "REFUND" | "DENY"
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: {
    // Updated claim with review details
  },
  message: "Claim reviewed successfully"
}
```

---

## User Management Endpoints

### GET /api/users
**Description**: List users  
**Auth Required**: Yes  
**Permissions**: Admin only

**Query Parameters**:
```typescript
{
  page?: number
  perPage?: number
  role?: "admin" | "technician"
  isActive?: boolean
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: Array<{
    id: string
    name: string
    email: string
    role: "admin" | "technician"
    createdAt: string
    updatedAt: string
    lastLoginAt?: string
    isActive: boolean
  }>,
  pagination: {...}
}
```

### POST /api/users/invite
**Description**: Invite new user  
**Auth Required**: Yes  
**Permissions**: Admin only

**Request**:
```typescript
{
  email: string                    // Required, valid email
  role: "admin" | "technician"     // Required
  message?: string                 // Optional welcome message
}
```

**Response (Success - 201)**:
```typescript
{
  success: true,
  data: {
    id: string
    email: string
    role: string
    token: string
    expiresAt: string  // 7 days from now
  },
  message: "Invitation sent to email@example.com"
}
```

### POST /api/users/accept-invite
**Description**: Accept invitation and create account  
**Auth Required**: No

**Request**:
```typescript
{
  token: string      // Required, from invitation email
  password: string   // Required, min 16 chars with complexity
  name: string       // Required, min 2 chars
}
```

**Response (Success - 201)**:
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  },
  message: "Account created successfully"
}
```

### POST /api/admin/password-reset
**Description**: Admin resets user password  
**Auth Required**: Yes  
**Permissions**: Admin only

**Request**:
```typescript
{
  userId: string
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: {
    temporaryPassword: string  // Display to admin
  },
  message: "Password reset successfully"
}
```

---

## Report Endpoints

### GET /api/reports/transfers
**Description**: Transfer reports  
**Auth Required**: Yes  
**Permissions**:
- Technician: Own data only
- Admin: All data

**Query Parameters**:
```typescript
{
  from: string       // ISO date, required
  to: string         // ISO date, required
  status?: string
  urgency?: string
  technicianId?: string  // Admin only
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: {
    summary: {
      total: number
      byStatus: {
        PENDING: number
        IN_TRANSIT: number
        COMPLETED: number
        CANCELLED: number
      }
      byUrgency: {
        NORMAL: number
        HIGH: number
        CRITICAL: number
      }
      totalParts: number
    },
    details: Array<{
      // Transfer objects
    }>
  }
}
```

### GET /api/reports/claims
**Description**: Warranty claim reports  
**Auth Required**: Yes  
**Permissions**: Same as transfers

**Query Parameters**: Similar to transfers

**Response**: Similar structure with claim-specific summary

### GET /api/admin/logs
**Description**: System audit logs  
**Auth Required**: Yes  
**Permissions**: Admin only

**Query Parameters**:
```typescript
{
  page?: number
  perPage?: number
  eventType?: string
  userId?: string
  from?: string  // ISO date
  to?: string    // ISO date
  action?: string
}
```

**Response (Success - 200)**:
```typescript
{
  success: true,
  data: Array<{
    id: string
    timestamp: string
    eventType: string
    userId: string
    userName: string
    action: string
    details?: object
    ipAddress?: string
    userAgent?: string
    success: boolean
    errorMessage?: string
  }>,
  pagination: {...}
}
```

---

## File Upload Endpoints (Future)

### POST /api/upload
**Description**: Upload file (photo, document)  
**Auth Required**: Yes  
**Content-Type**: multipart/form-data

**Request**:
```
file: File  // Max 10MB
type: "photo" | "document"
```

**Response (Success - 201)**:
```typescript
{
  success: true,
  data: {
    url: string
    key: string
    size: number
    contentType: string
  }
}
```

---

## PDF Generation Endpoints

### GET /api/pdf/transfer/:id
**Description**: Generate transfer PDF  
**Auth Required**: Yes  
**Permissions**: Owner or Admin

**Response (Success - 200)**:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="transfer-{number}.pdf"

[PDF Binary Data]
```

### GET /api/pdf/claim/:id
**Description**: Generate warranty claim PDF  
**Auth Required**: Yes  
**Permissions**: Owner or Admin

**Response**: Same as transfer PDF

---

## Rate Limiting (Future)

### Limits
- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute
- **Admin**: 200 requests/minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Exceeded Response (429)
```typescript
{
  success: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests, please try again later",
    details: {
      retryAfter: 60  // seconds
    }
  }
}
```

---

## Versioning Strategy

### Current Approach
No versioning (v1 implicit).

### Future Approach
When breaking changes needed:
```
/api/v2/transfers
```

Maintain v1 for 6 months minimum.

---

## CORS Configuration

### Development
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

### Production
```
Access-Control-Allow-Origin: https://part-pulse.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Request/Response Examples

### Example: Create Transfer

**Request**:
```bash
curl -X POST https://part-pulse.vercel.app/api/transfers \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "date": "2024-12-16T10:00:00Z",
    "toLocation": "Warehouse B",
    "partNumber": "TRANE-12345",
    "partDescription": "Compressor Unit",
    "quantity": 2,
    "serialNumbers": ["SN001", "SN002"],
    "urgency": "HIGH"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "transferNumber": "TR-2024-001",
    "date": "2024-12-16T10:00:00.000Z",
    "fromUser": {
      "id": "usr123",
      "name": "John Technician",
      "email": "john@example.com"
    },
    "toLocation": "Warehouse B",
    "partNumber": "TRANE-12345",
    "partDescription": "Compressor Unit",
    "quantity": 2,
    "serialNumbers": ["SN001", "SN002"],
    "urgency": "HIGH",
    "status": "PENDING",
    "createdAt": "2024-12-16T10:00:05.000Z",
    "updatedAt": "2024-12-16T10:00:05.000Z",
    "pdfUrl": "https://storage.../pdfs/transfer-clx123abc.pdf"
  },
  "message": "Transfer created successfully"
}
```

---

## Testing API

### Development
Use tools like:
- Postman
- Insomnia
- curl
- REST Client (VS Code extension)

### Test Account
```
Email: admin@test.com
Password: TestPassword123!@#
Role: admin
```

---

## Checklist Compliance

This document satisfies:
- ✅ API contracts specified
- ✅ Authentication strategy defined
- ✅ Error handling documented
- ✅ Input validation specified
- ✅ Response formats standardized

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved
