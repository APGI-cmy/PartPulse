# Implementation Guide

## Overview

This guide provides implementation instructions for building PartPulse according to the architecture specifications. It serves as a reference for developers implementing features based on the architecture documents.

**Target Audience**: Developers, Technical Leads  
**Prerequisites**: Architecture documents reviewed and understood

---

## Implementation Principles

1. **Architecture First**: Always reference architecture docs before coding
2. **Test-Driven Development**: Write tests before implementation where possible
3. **Type Safety**: 100% TypeScript, strict mode enabled
4. **Security by Default**: Validate and sanitize all inputs
5. **Component Isolation**: Follow defined component boundaries
6. **Audit Everything**: Log all state changes

---

## Technology Stack

### Core Technologies

**Runtime**: Node.js 20+  
**Framework**: Next.js 14+ (App Router)  
**Language**: TypeScript 5+  
**UI**: React 19  
**Styling**: Tailwind CSS 4+  
**Database**: PostgreSQL (production), SQLite (development)  
**ORM**: Prisma 5+  
**Auth**: NextAuth.js v5  
**Validation**: Zod 4+  
**Testing**: Jest + React Testing Library

---

## Project Structure

```
PartPulse/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard
│   ├── internal-transfer/   # Transfer pages
│   ├── warranty-claims/     # Warranty pages
│   ├── users/               # User management
│   ├── reports/             # Reports pages
│   ├── settings/            # Settings pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── forms/               # Form components
│   ├── tables/              # Table components
│   └── layouts/             # Layout components
├── lib/                     # Business logic
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma client
│   ├── db/                  # Database functions
│   ├── email/               # Email functions
│   ├── pdf/                 # PDF generation
│   ├── storage/             # Storage abstraction
│   ├── logging/             # Audit logging
│   ├── security/            # Security utilities
│   ├── validators.ts        # Zod schemas
│   └── utils.ts             # Helper functions
├── prisma/                  # Database
│   ├── schema.prisma        # Schema definition
│   ├── migrations/          # Migration files
│   └── seed.ts              # Seed data
├── types/                   # TypeScript types
├── __tests__/               # Tests
├── architecture/            # Architecture docs
├── docs/                    # Documentation
├── governance/              # Governance docs
└── qa/                      # QA infrastructure
```

---

## Development Workflow

### 1. Feature Implementation Flow

```
1. Review architecture docs (ARCHITECTURE.md, relevant domain docs)
2. Design implementation (respect component boundaries)
3. Write tests (unit, integration)
4. Implement feature
5. Run linter (npm run lint)
6. Run tests (npm test)
7. Test manually in browser
8. Commit changes
9. Create pull request
10. Address code review feedback
11. Merge to main
```

### 2. Branching Strategy

**Main branch**: `main` (protected)  
**Feature branches**: `feature/feature-name`  
**Bug fixes**: `fix/bug-description`  
**Architecture**: `arch/architecture-topic`

---

## Component Implementation

### Frontend Components

#### Example: Button Component

**Reference**: FRONTEND_COMPONENTS.md

**Location**: `components/ui/button.tsx`

```typescript
// components/ui/button.tsx
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors'
  
  const variantStyles = {
    primary: 'bg-[#FF2B00] text-white hover:bg-[#DD2600]',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

**Test**:

```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables when loading', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

### API Routes

#### Example: Transfer Creation Endpoint

**Reference**: API_SPECIFICATION.md, DATA_FLOW.md

**Location**: `app/api/transfers/route.ts`

```typescript
// app/api/transfers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TransferSchema } from '@/lib/validators'
import { sanitizeInput } from '@/lib/security/sanitize'
import { logTransferCreation } from '@/lib/logging/systemLog'

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // 2. Parse and validate input
    const body = await request.json()
    const validated = TransferSchema.parse(body)

    // 3. Sanitize inputs
    const sanitized = {
      ...validated,
      toLocation: sanitizeInput(validated.toLocation),
      partNumber: sanitizeInput(validated.partNumber),
      partDescription: sanitizeInput(validated.partDescription),
      notes: validated.notes ? sanitizeInput(validated.notes) : undefined,
    }

    // 4. Create transfer
    const transfer = await prisma.internalTransfer.create({
      data: {
        ...sanitized,
        technicianId: session.user.id,
        transferNumber: `TR-${Date.now()}`, // Simplified
        status: 'PENDING',
      },
      include: {
        technician: true,
      },
    })

    // 5. Log action
    await logTransferCreation(transfer, session.user.id, session.user.name, request)

    // 6. Generate PDF (async, non-blocking)
    // generateTransferPDF(transfer).catch(err => console.error('PDF generation failed:', err))

    // 7. Send email (async, non-blocking)
    // sendTransferReceipt(transfer, session.user.email).catch(err => console.error('Email failed:', err))

    // 8. Return response
    return NextResponse.json(
      { success: true, data: transfer, message: 'Transfer created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } },
        { status: 400 }
      )
    }

    console.error('Transfer creation error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create transfer' } },
      { status: 500 }
    )
  }
}
```

---

### Database Functions

#### Example: Transfer Query Function

**Reference**: DATABASE_SCHEMA.md, COMPONENT_BOUNDARIES.md

**Location**: `lib/db/transfers.ts`

```typescript
// lib/db/transfers.ts
import { prisma } from '@/lib/prisma'
import { TransferStatus, Urgency } from '@prisma/client'

export async function createTransfer(data: {
  technicianId: string
  toLocation: string
  partNumber: string
  partDescription: string
  quantity: number
  serialNumbers?: string[]
  notes?: string
  urgency?: Urgency
}) {
  return await prisma.internalTransfer.create({
    data: {
      ...data,
      transferNumber: `TR-${Date.now()}`,
      date: new Date(),
      status: 'PENDING',
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function getTransferById(id: string) {
  return await prisma.internalTransfer.findUnique({
    where: { id },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function getTransfersByUser(
  userId: string,
  filters?: {
    status?: TransferStatus
    from?: Date
    to?: Date
  }
) {
  return await prisma.internalTransfer.findMany({
    where: {
      technicianId: userId,
      status: filters?.status,
      date: {
        gte: filters?.from,
        lte: filters?.to,
      },
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  })
}
```

---

## Security Implementation

### Input Sanitization

**Reference**: SECURITY_ARCHITECTURE.md

**Location**: `lib/security/sanitize.ts`

```typescript
// lib/security/sanitize.ts
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  return sanitized
}
```

### RBAC Implementation

**Reference**: SECURITY_ARCHITECTURE.md

**Location**: `lib/security/rbac.ts`

```typescript
// lib/security/rbac.ts
export function canCreateTransfer(role: string): boolean {
  return ['admin', 'technician'].includes(role)
}

export function canViewAllTransfers(role: string): boolean {
  return role === 'admin'
}

export function canEditTransfer(role: string, transfer: any, userId: string): boolean {
  if (role === 'admin') return true
  return transfer.technicianId === userId
}

export function canDeleteTransfer(role: string): boolean {
  return role === 'admin'
}

export function canApproveWarranty(role: string): boolean {
  return role === 'admin'
}

export function canManageUsers(role: string): boolean {
  return role === 'admin'
}
```

---

## Validation Schemas

### Zod Schemas

**Reference**: API_SPECIFICATION.md

**Location**: `lib/validators.ts`

```typescript
// lib/validators.ts
import { z } from 'zod'

export const TransferSchema = z.object({
  date: z.string().datetime().optional().default(() => new Date().toISOString()),
  toLocation: z.string().min(2).max(200),
  partNumber: z.string().min(3).max(100),
  partDescription: z.string().min(5).max(500),
  quantity: z.number().int().positive(),
  serialNumbers: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  urgency: z.enum(['NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
  expectedDelivery: z.string().datetime().optional(),
  trackingNumber: z.string().max(100).optional(),
})

export const WarrantyClaimSchema = z.object({
  partNumber: z.string().min(1),
  partDescription: z.string().min(1),
  serialNumber: z.string().min(1), // Mandatory per Trane
  failureDescription: z.string().min(10),
  purchaseDate: z.string().datetime(),
  warrantyStatus: z.enum(['UNDER_WARRANTY', 'EXPIRED', 'UNKNOWN']),
  customerName: z.string().optional(),
  customerContact: z.string().optional(),
  returnAddress: z.string().optional(),
  photos: z.array(z.string().url()).optional(),
  diagnosticNotes: z.string().optional(),
})

export const UserInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'technician']),
  message: z.string().max(500).optional(),
})
```

---

## Testing Guidelines

### Test Structure

```typescript
describe('Component/Function Name', () => {
  describe('Success Cases', () => {
    it('should handle normal case', () => {
      // Test
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      // Test
    })
  })

  describe('Error Cases', () => {
    it('should handle invalid input', () => {
      // Test
    })
  })
})
```

### Test Coverage Targets

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **API Routes**: All endpoints tested
- **Components**: All interactive components tested

---

## Audit Logging Implementation

**Reference**: AUDIT_LOGGING.md

**Location**: `lib/logging/systemLog.ts`

```typescript
// lib/logging/systemLog.ts
import { prisma } from '@/lib/prisma'

interface LogInput {
  eventType: string
  userId?: string
  userName?: string
  action: string
  details?: any
  ipAddress?: string
  userAgent?: string
  success?: boolean
  errorMessage?: string
}

export async function logSystemEvent(input: LogInput): Promise<void> {
  try {
    await prisma.systemLog.create({
      data: {
        timestamp: new Date(),
        eventType: input.eventType,
        userId: input.userId,
        userName: input.userName,
        action: input.action,
        details: input.details ? JSON.stringify(input.details) : null,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        success: input.success ?? true,
        errorMessage: input.errorMessage,
      },
    })
  } catch (error) {
    // Don't throw - logging failures shouldn't break main flow
    console.error('Audit logging failed:', error)
  }
}

export async function logTransferCreation(transfer: any, userId: string, userName: string, request: Request) {
  await logSystemEvent({
    eventType: 'submission',
    userId,
    userName,
    action: 'TRANSFER_CREATED',
    details: {
      resourceId: transfer.id,
      transferNumber: transfer.transferNumber,
    },
    ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    userAgent: request.headers.get('user-agent'),
  })
}
```

---

## Performance Optimization

### Database Queries

```typescript
// Bad: N+1 query problem
for (const transfer of transfers) {
  const technician = await prisma.user.findUnique({ where: { id: transfer.technicianId } })
}

// Good: Use include
const transfers = await prisma.internalTransfer.findMany({
  include: {
    technician: true,
  },
})
```

### Caching Strategy

```typescript
// For expensive computations
import { cache } from 'react'

export const getTransferStats = cache(async (userId: string) => {
  // Expensive database query
  return await prisma.internalTransfer.aggregate(...)
})
```

---

## Error Handling Patterns

### API Route Error Handling

```typescript
try {
  // Operation
} catch (error) {
  if (error.name === 'ZodError') {
    return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
  }
  
  if (error.code === 'P2002') { // Prisma unique constraint
    return NextResponse.json({ error: 'Resource already exists' }, { status: 409 })
  }
  
  console.error('Unexpected error:', error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

---

## Checklist Compliance

This document satisfies:
- ✅ Development plan documented
- ✅ Implementation approach defined
- ✅ Code examples provided
- ✅ Testing strategy defined
- ✅ Best practices documented

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Development Team  
**Status**: Approved
