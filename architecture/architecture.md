# PartPulse - Architecture Specification

## System Overview

PartPulse is a full-stack web application built with Next.js 14+ using the App Router architecture. The system follows a monolithic deployment model with clear separation of concerns between frontend, backend, and data layers.

## Architecture Principles

1. **Mobile-First**: All UI components designed for mobile first, then desktop
2. **Type Safety**: 100% TypeScript across the stack
3. **Security by Default**: Authentication and authorization on every route
4. **Audit Everything**: Complete audit trail for compliance
5. **Scalable Design**: Architecture supports future migration to microservices

## System Components

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│                   (React + Next.js)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js App Router                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  API Routes  │  │  Middleware  │  │
│  │  (App Dir)   │  │              │  │  (Auth)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬───────────────┬────────────────────┘
                     │               │
                     ▼               ▼
         ┌───────────────┐  ┌───────────────┐
         │   Prisma ORM  │  │  NextAuth.js  │
         └───────┬───────┘  └───────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ SQLite/Postgres│
         └───────────────┘
```

## Frontend Architecture

### Framework: Next.js 14+ (App Router)

#### Folder Structure
```
/app
  /layout.tsx                    # Root layout with sidebar
  /page.tsx                      # Dashboard/home page
  /internal-transfer
    /page.tsx                    # Internal transfer list
    /new/page.tsx                # Create new transfer
    /[id]/page.tsx               # Transfer details
    /[id]/edit/page.tsx          # Edit transfer
  /warranty
    /page.tsx                    # Warranty claims list
    /new/page.tsx                # Create new claim
    /[id]/page.tsx               # Claim details
    /[id]/edit/page.tsx          # Edit claim
  /users
    /invite/page.tsx             # Invite new user (admin)
    /page.tsx                    # User management (admin)
  /reports
    /page.tsx                    # Reports dashboard
    /transfers/page.tsx          # Transfer reports
    /warranty/page.tsx           # Warranty reports
    /audit/page.tsx              # Audit reports (admin)
  /settings
    /page.tsx                    # Settings page (admin)
  /api
    /auth/[...nextauth]/route.ts # NextAuth endpoints
    /transfers/route.ts          # Transfer CRUD
    /transfers/[id]/route.ts     # Single transfer operations
    /claims/route.ts             # Warranty claim CRUD
    /claims/[id]/route.ts        # Single claim operations
    /users/route.ts              # User management
    /users/invite/route.ts       # Invitation handling
    /reports/route.ts            # Report generation
    /pdf/route.ts                # PDF generation
    /email/route.ts              # Email sending
    /audit/route.ts              # Audit log access

/components
  /ui
    /button.tsx                  # Reusable button component
    /input.tsx                   # Form input component
    /select.tsx                  # Dropdown select
    /modal.tsx                   # Modal dialog
    /table.tsx                   # Data table
    /badge.tsx                   # Status badge
    /card.tsx                    # Card container
    /sidebar.tsx                 # Navigation sidebar
    /header.tsx                  # Page header
  /forms
    /transfer-form.tsx           # Internal transfer form
    /warranty-form.tsx           # Warranty claim form
    /user-invite-form.tsx        # User invitation form
  /tables
    /transfer-table.tsx          # Transfer list table
    /warranty-table.tsx          # Warranty claims table
    /user-table.tsx              # User management table
  /charts
    /transfer-chart.tsx          # Transfer statistics chart
    /warranty-chart.tsx          # Warranty statistics chart
  /pdf
    /transfer-template.tsx       # Transfer PDF template
    /warranty-template.tsx       # Warranty claim PDF template

/lib
  /prisma.ts                     # Prisma client singleton
  /auth.ts                       # Auth configuration
  /email.ts                      # Email utilities
  /pdf.ts                        # PDF generation utilities
  /validators.ts                 # Zod schemas
  /utils.ts                      # Helper functions
  /constants.ts                  # App constants

/types
  /index.ts                      # TypeScript type definitions
  /api.ts                        # API response types
  /database.ts                   # Database types (generated)

/prisma
  /schema.prisma                 # Database schema
  /migrations/                   # Database migrations
  /seed.ts                       # Database seed data

/public
  /logo.png                      # Company logo
  /icons/                        # App icons
```

#### UI Components

##### Required Components
1. **Sidebar** (`components/ui/sidebar.tsx`)
   - Navigation menu
   - User profile section
   - Collapsible on mobile
   - Active state highlighting
   - Role-based menu items

2. **Button** (`components/ui/button.tsx`)
   - Primary variant (primary color)
   - Secondary variant
   - Danger variant
   - Disabled state
   - Loading state

3. **Input** (`components/ui/input.tsx`)
   - Text input
   - Number input
   - Date input
   - Validation state display

4. **Select** (`components/ui/select.tsx`)
   - Single select
   - Multi-select
   - Searchable variant

5. **Modal** (`components/ui/modal.tsx`)
   - Confirmation dialogs
   - Form modals
   - Close on overlay click

6. **Table** (`components/ui/table.tsx`)
   - Sortable columns
   - Pagination
   - Row actions
   - Responsive (cards on mobile)

7. **Badge** (`components/ui/badge.tsx`)
   - Status indicators
   - Count badges
   - Color variants

8. **Card** (`components/ui/card.tsx`)
   - Content container
   - Header/body/footer sections

#### State Management
- **Authentication State**: NextAuth.js session
- **Form State**: React Hook Form
- **UI State**: React useState/useReducer
- **Server State**: React Server Components (default)
- **Global State**: React Context (minimal usage)

#### Styling
- **Framework**: Tailwind CSS
- **Primary Color**: `#FF2B00`
- **Responsive Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: >= 1024px
- **Dark Mode**: Not required for MVP

## Backend Architecture

### API Routes (Next.js App Router)

#### Authentication API
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signup` - New user registration (via invitation)

#### Transfer API
- `GET /api/transfers` - List transfers (filtered by role)
- `POST /api/transfers` - Create new transfer
- `GET /api/transfers/[id]` - Get transfer details
- `PUT /api/transfers/[id]` - Update transfer
- `DELETE /api/transfers/[id]` - Delete transfer (admin only)
- `GET /api/transfers/[id]/pdf` - Generate transfer PDF

#### Warranty Claim API
- `GET /api/claims` - List warranty claims (filtered by role)
- `POST /api/claims` - Create new claim
- `GET /api/claims/[id]` - Get claim details
- `PUT /api/claims/[id]` - Update claim
- `DELETE /api/claims/[id]` - Delete claim (admin only)
- `POST /api/claims/[id]/review` - Admin review of claim
- `GET /api/claims/[id]/pdf` - Generate claim PDF

#### User Management API
- `GET /api/users` - List users (admin only)
- `POST /api/users/invite` - Invite new user (admin only)
- `POST /api/users/accept-invite` - Accept invitation
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (admin only)

#### Reports API
- `GET /api/reports/transfers` - Transfer reports
- `GET /api/reports/warranty` - Warranty reports
- `GET /api/reports/users` - User activity reports
- `GET /api/reports/audit` - Audit trail (admin only)
- `POST /api/reports/export` - Export report (PDF/CSV)

#### System API
- `POST /api/pdf/generate` - Generate PDF document
- `POST /api/email/send` - Send email notification
- `GET /api/audit` - Audit log access (admin only)

### Middleware
- **Authentication Middleware**: Protect all routes except login/signup
- **Role Authorization Middleware**: Check user role for protected resources
- **Audit Logging Middleware**: Log all API calls
- **Error Handling Middleware**: Consistent error responses

### API Response Format
```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}

// Paginated Response
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    perPage: number,
    total: number,
    totalPages: number
  }
}
```

## Database Architecture

### ORM: Prisma

### Database: SQLite (MVP) / PostgreSQL (Production)

#### Schema Design

##### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          Role      @default(TECHNICIAN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  transfers     Transfer[]
  claims        WarrantyClaim[]
  auditLogs     AuditLog[]
  invitations   Invitation[]
}

enum Role {
  ADMIN
  TECHNICIAN
}
```

##### Transfer Model
```prisma
model Transfer {
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

##### Warranty Claim Model
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
  reviewDate          DateTime?
  reviewNotes         String?
  resolvedAt          DateTime?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  
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

##### Invitation Model
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

##### Audit Log Model
```prisma
model AuditLog {
  id            String    @id @default(cuid())
  timestamp     DateTime  @default(now())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  action        String    // CREATE, UPDATE, DELETE, LOGIN, etc.
  resourceType  String    // User, Transfer, Claim, etc.
  resourceId    String?
  changes       String?   // JSON of before/after
  ipAddress     String?
  userAgent     String?
  
  transfer      Transfer? @relation(fields: [transferId], references: [id])
  transferId    String?
  claim         WarrantyClaim? @relation(fields: [claimId], references: [id])
  claimId       String?
}
```

### Database Migrations
- Managed by Prisma Migrate
- Version controlled
- Idempotent
- Rollback support

### Database Seeding
- Initial admin user
- Sample data for development
- Run via `npm run seed`

## Authentication System

### Provider: NextAuth.js

#### Configuration
```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.password) {
          return null
        }
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        
        if (!isValid) {
          return null
        }
        
        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  }
}
```

#### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character
- Hashed with bcrypt (salt rounds: 10)

#### Session Management
- JWT-based sessions
- 24-hour session timeout
- Automatic token refresh
- Secure httpOnly cookies

#### Route Protection
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})

export const config = {
  matcher: [
    "/internal-transfer/:path*",
    "/warranty/:path*",
    "/users/:path*",
    "/reports/:path*",
    "/settings/:path*"
  ]
}
```

## Role-Based Access Control

### Implementation
```typescript
// lib/auth.ts
export function checkAccess(
  userRole: Role,
  requiredRole: Role | Role[]
): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return roles.includes(userRole)
}

export function checkResourceAccess(
  user: User,
  resource: Transfer | WarrantyClaim
): boolean {
  if (user.role === Role.ADMIN) return true
  return resource.userId === user.id
}
```

### Access Patterns
- **Admin**: Full access to all resources
- **Technician**: Access to own resources only
- **Server-side**: Always validate in API routes
- **Client-side**: Hide UI elements based on role

## Notification System

### Email Service
- **Provider**: Resend or SendGrid
- **Templates**: HTML email templates
- **Queue**: Simple in-memory queue (MVP)
- **Retry Logic**: 3 attempts with exponential backoff

### Email Types
1. **Invitation Email**
   - Subject: "You're invited to PartPulse"
   - Contains: Invitation link, role info, expiration
   
2. **Transfer Notification**
   - Subject: "Internal Transfer [Status]"
   - Contains: Transfer details, current status
   
3. **Warranty Notification**
   - Subject: "Warranty Claim [Status]"
   - Contains: Claim details, review decision
   
4. **Welcome Email**
   - Subject: "Welcome to PartPulse"
   - Contains: Getting started guide

### Email Configuration
```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  template,
  data
}: EmailOptions) {
  await resend.emails.send({
    from: 'PartPulse <noreply@partpulse.com>',
    to,
    subject,
    react: renderTemplate(template, data)
  })
}
```

## PDF Generation Pipeline

### Library: react-pdf or Puppeteer

### PDF Templates
```typescript
// components/pdf/transfer-template.tsx
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

export function TransferPDF({ transfer }: { transfer: Transfer }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.title}>Internal Transfer</Text>
        </View>
        
        <View style={styles.details}>
          <Text>Transfer ID: {transfer.transferNumber}</Text>
          <Text>Date: {formatDate(transfer.date)}</Text>
          <Text>From: {transfer.fromUser.name}</Text>
          <Text>To: {transfer.toLocation}</Text>
          <Text>Part: {transfer.partNumber}</Text>
          <Text>Quantity: {transfer.quantity}</Text>
        </View>
        
        <View style={styles.qrcode}>
          {/* QR code component */}
        </View>
        
        <View style={styles.signatures}>
          <Text>Sender: _________________</Text>
          <Text>Receiver: _______________</Text>
        </View>
      </Page>
    </Document>
  )
}
```

### PDF Generation Flow
1. User requests PDF (download or email)
2. Fetch data from database
3. Render PDF template with data
4. Generate PDF buffer
5. Return as download or attach to email
6. Log generation in audit trail

## Reporting Module

### Report Types
1. **Transfer Reports**
   - Summary statistics
   - Trends over time
   - Top parts transferred
   - User activity

2. **Warranty Reports**
   - Claim rates
   - Approval rates
   - Average resolution time
   - Top claimed parts

3. **Audit Reports**
   - Complete audit trail
   - Filtered by user/date/action
   - Export capability

### Report Features
- **Date Range Filter**: Custom start/end dates
- **Export Formats**: PDF, CSV, Excel
- **Charts**: Line, bar, pie charts using Chart.js or Recharts
- **Real-time**: Live data updates
- **Permissions**: Role-based report access

### Chart Implementation
```typescript
// components/charts/transfer-chart.tsx
import { Line } from 'react-chartjs-2'

export function TransferChart({ data }: { data: TransferData[] }) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Transfers',
      data: data.map(d => d.count),
      borderColor: '#FF2B00',
      backgroundColor: 'rgba(255, 43, 0, 0.1)'
    }]
  }
  
  return <Line data={chartData} options={options} />
}
```

## Security & Monitoring Dashboard

### Security Features
1. **Failed Login Monitoring**
   - Track failed attempts
   - Auto-lockout after 5 failures
   - Alert admins of suspicious activity

2. **Permission Changes**
   - Log all role changes
   - Require admin confirmation
   - Audit trail entry

3. **Data Access Logging**
   - Log all data reads
   - Track export activities
   - Monitor bulk operations

### Monitoring Dashboard (Admin)
- **Active Users**: Currently logged in
- **Recent Activity**: Last 100 actions
- **Failed Logins**: Last 24 hours
- **Security Alerts**: Suspicious activities
- **System Health**: API response times, error rates

## Build & Deployment

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run prisma:push  # Push schema to database
npm run prisma:migrate # Create migration
npm run seed         # Seed database
```

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Email
RESEND_API_KEY="your-resend-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PRIMARY_COLOR="#FF2B00"
```

### Deployment (Vercel)
1. Connect GitHub repository
2. Configure environment variables
3. Auto-deploy on push to main
4. Preview deployments on PRs

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Admin user seeded
- [ ] Email service configured
- [ ] Domain configured
- [ ] HTTPS enabled
- [ ] Monitoring enabled

## Testing Strategy

### Unit Tests
- Components (Jest + React Testing Library)
- Utility functions
- Validators
- Coverage target: 80%+

### Integration Tests
- API routes
- Database operations
- Authentication flow
- Email sending

### E2E Tests (Future)
- User workflows
- Critical paths
- Cross-browser testing

## Performance Targets

### Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size
- Initial JS bundle: < 200KB (gzipped)
- CSS bundle: < 50KB (gzipped)

### API Performance
- Average response time: < 200ms
- 95th percentile: < 500ms
- Database queries: < 50ms

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus indicators
- ARIA labels
- Alt text for images

### Testing
- Lighthouse accessibility audit
- axe DevTools
- Manual keyboard testing
- Screen reader testing (NVDA/JAWS)

## File Checklist

### Required Files

#### Configuration
- [ ] `package.json` - Dependencies and scripts
- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `.eslintrc.json` - ESLint rules
- [ ] `.prettierrc` - Code formatting
- [ ] `next.config.js` - Next.js configuration
- [ ] `tailwind.config.js` - Tailwind CSS configuration
- [ ] `.env.example` - Environment variables template
- [ ] `.gitignore` - Git ignore patterns

#### Database
- [ ] `prisma/schema.prisma` - Database schema
- [ ] `prisma/seed.ts` - Seed data script
- [ ] `lib/prisma.ts` - Prisma client singleton

#### Authentication
- [ ] `lib/auth.ts` - NextAuth configuration
- [ ] `app/api/auth/[...nextauth]/route.ts` - Auth endpoints
- [ ] `middleware.ts` - Route protection

#### App Structure
- [ ] `app/layout.tsx` - Root layout with sidebar
- [ ] `app/page.tsx` - Dashboard/home
- [ ] `app/internal-transfer/page.tsx` - Transfer list
- [ ] `app/warranty/page.tsx` - Warranty claims list
- [ ] `app/users/invite/page.tsx` - User invitation
- [ ] `app/reports/page.tsx` - Reports dashboard
- [ ] `app/settings/page.tsx` - Settings page

#### Components
- [ ] `components/ui/sidebar.tsx` - Navigation sidebar
- [ ] `components/ui/button.tsx` - Button component
- [ ] `components/ui/input.tsx` - Input component
- [ ] `components/ui/select.tsx` - Select component
- [ ] `components/ui/modal.tsx` - Modal component
- [ ] `components/ui/table.tsx` - Table component
- [ ] `components/ui/badge.tsx` - Badge component
- [ ] `components/ui/card.tsx` - Card component

#### Forms
- [ ] `components/forms/transfer-form.tsx` - Transfer form
- [ ] `components/forms/warranty-form.tsx` - Warranty form
- [ ] `components/forms/user-invite-form.tsx` - Invite form

#### API Routes
- [ ] `app/api/transfers/route.ts` - Transfer CRUD
- [ ] `app/api/claims/route.ts` - Warranty claim CRUD
- [ ] `app/api/users/route.ts` - User management
- [ ] `app/api/users/invite/route.ts` - User invitation
- [ ] `app/api/reports/route.ts` - Report generation
- [ ] `app/api/pdf/route.ts` - PDF generation
- [ ] `app/api/email/route.ts` - Email sending
- [ ] `app/api/audit/route.ts` - Audit log access

#### Utilities
- [ ] `lib/validators.ts` - Zod validation schemas
- [ ] `lib/utils.ts` - Helper functions
- [ ] `lib/email.ts` - Email utilities
- [ ] `lib/pdf.ts` - PDF generation utilities
- [ ] `lib/constants.ts` - App constants

#### Types
- [ ] `types/index.ts` - TypeScript types
- [ ] `types/api.ts` - API types

#### Documentation
- [ ] `README.md` - Project overview
- [ ] `rules.md` - App rules and specifications
- [ ] `architecture/architecture.md` - This document

## Migration Path

### From SQLite to PostgreSQL
1. Update `DATABASE_URL` in `.env`
2. Update Prisma schema provider
3. Run `npx prisma migrate dev`
4. Test all database operations
5. Deploy with new database

### From Vercel to Self-Hosted
1. Containerize with Docker
2. Set up PostgreSQL instance
3. Configure environment variables
4. Set up reverse proxy (nginx)
5. Configure SSL certificates
6. Set up monitoring
7. Deploy and test

## Component Presence Requirements

### Pages
- Internal Transfer page with list view
- Warranty Claims page with list view
- User Invite page (admin only)
- Reports page with filters
- Settings page (admin only)
- Dashboard/Home page

### Forms
- Internal Transfer form (create/edit)
- Warranty Claim form (create/edit)
- User Invitation form

### Tables
- Transfer list with sorting/filtering
- Warranty claim list with sorting/filtering
- User list (admin only)

### Navigation
- Sidebar with all main sections
- Active state highlighting
- Role-based menu items
- Mobile-responsive

### Authentication
- Login page
- Session management
- Protected routes
- Role-based access

### PDF Generation
- Transfer PDF template
- Warranty claim PDF template
- PDF generation API

### Email System
- Invitation email template
- Notification email templates
- Email sending API

### Audit System
- Audit log recording
- Audit log viewing (admin)
- Audit trail on all actions

## Success Criteria

The architecture is complete when:
1. All required files exist
2. All components are implemented
3. All API routes are functional
4. Database schema is deployed
5. Authentication works end-to-end
6. Role-based access is enforced
7. PDFs generate correctly
8. Emails send successfully
9. Audit logs capture all actions
10. QA system validates 100% compliance

## Internal Transfer Workflow (Wave 2 - Implemented)

### Workflow Overview

The Internal Transfer feature allows technicians to record part movements within the organization. The workflow is designed for mobile-first usage and includes validation, confirmation, and reporting capabilities.

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Technician Actions                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Fill Transfer Form  │
          │  - Technician info   │
          │  - Part details      │
          │  - Transfer type     │
          │  - Reason            │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Client Validation  │
          │   (Zod Schema)       │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Submit to API       │
          │  POST /api/internal- │
          │       transfer       │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Server Validation   │
          │  - Schema check      │
          │  - Sanitization      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Save to Database    │
          │  (In-memory MVP)     │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Generate PDF Stub   │
          │  (Text-based)        │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Success Response    │
          │  - Transfer ID       │
          │  - Confirmation      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Redirect to Success │
          │  Page                │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  View Report         │
          │  /internal-transfer/ │
          │  [id]                │
          └──────────────────────┘
```

### API Flow

**POST /api/internal-transfer**
```typescript
Request:
{
  technician: string,
  department: string,
  transferType: string,
  serial: string,
  model: string,
  part: string,
  description: string,
  reason: string,
  newUnit?: string,
  comments?: string,
  images?: string[],
  signature?: string
}

Response (Success):
{
  success: true,
  data: {
    id: string,
    ...formData,
    createdAt: Date
  },
  message: string
}

Response (Error):
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

**GET /api/internal-transfer**
```typescript
Response:
{
  success: true,
  data: InternalTransfer[]
}
```

### Data Model

```typescript
interface InternalTransfer {
  id: string;                  // Auto-generated unique ID
  technician: string;          // Technician name
  department: string;          // Department
  transferType: string;        // Type of transfer
  serial: string;              // Serial number
  model: string;               // Model number
  part: string;                // Part number
  description: string;         // Part description
  reason: string;              // Reason for removal
  newUnit?: string;            // New unit/job number (optional)
  comments?: string;           // Additional comments (optional)
  images?: string[];           // Image URLs (optional, future)
  signature?: string;          // Signature data (optional, future)
  createdAt: Date;             // Timestamp
}
```

### PDF Flow

1. User submits transfer form
2. Server saves transfer record
3. `generateInternalTransferPDF()` called with transfer data
4. Text-based PDF stub generated (MVP)
5. PDF saved/logged for reference
6. Future: Full PDF with styling, QR codes, and signatures

### Form Components

**InternalTransferForm.tsx**
- All required fields with validation
- Conditional fields based on transfer type
- Real-time error feedback
- Loading states during submission
- Redirect to success page on completion

**Input.tsx & Select.tsx**
- Reusable form components
- Error state styling
- Required field indicators
- Helper text support
- Accessible labels

### Pages

1. **Main Form Page** (`/internal-transfer`)
   - Displays the transfer form
   - Usage instructions
   - Mobile-responsive design

2. **Success Page** (`/internal-transfer/success`)
   - Confirmation message
   - Transfer ID display
   - Link to view report
   - Next steps information

3. **Report Page** (`/internal-transfer/[id]`)
   - Transfer details display
   - Part information
   - Download PDF button (stub)
   - Audit trail placeholder

### Validation & Security

**Client-Side Validation**
- Zod schema validation
- Required field checks
- Type validation
- Real-time error feedback

**Server-Side Validation**
- Schema validation with Zod
- Input sanitization (XSS prevention)
- Type safety with TypeScript
- Error handling

**Security Measures**
- Input sanitization on all string fields
- HTML entity encoding
- Server-side validation (never trust client)
- Prepared for organization_id header validation
- Ready for rate limiting

### Current Implementation Status

✅ Implemented:
- Form UI with all required fields
- Client-side validation with Zod
- API route with POST/GET handlers
- Input sanitization
- In-memory data storage
- PDF generation stub
- Success page
- Report/detail page
- Mobile-responsive design

⏳ Future Enhancements:
- Database persistence (Prisma)
- Image upload functionality
- Signature capture
- Email notifications
- Audit trail logging
- Full PDF generation with styling
- QR code generation
- Authentication/authorization
- Organization-level isolation

## Warranty Claims Workflow (Wave 3 - Implemented)

### Workflow Overview

The Warranty Claims feature allows technicians to submit warranty claims for defective Trane parts. The workflow replicates the official Trane Warranty Parts Claims Form and includes validation, PDF generation, and admin processing capabilities.

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Technician Actions                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Fill Warranty Form   │
          │ - Chiller info       │
          │ - Parts table        │
          │ - Failure details    │
          │ - Comments           │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Client Validation   │
          │  (Zod Schema)        │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Submit to API       │
          │  POST /api/warranty- │
          │       claims         │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Server Validation   │
          │  - Schema check      │
          │  - Sanitization      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Save to Database    │
          │  (In-memory MVP)     │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Generate PDF        │
          │  (Trane Form Stub)   │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Success Response    │
          │  - Claim ID          │
          │  - Confirmation      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Redirect to Claim   │
          │  Detail Page         │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  View Claim Report   │
          │  /warranty-claims/   │
          │  [id]                │
          └──────────────────────┘
```

### API Flow

**POST /api/warranty-claims**
```typescript
Request:
{
  date: Date,
  chillerModel: string,
  chillerSerial: string,
  ssidJobNumber: string,
  buildingName?: string,
  siteName: string,
  technicianName: string,
  items: WarrantyItem[],
  comments?: string,
  coveredByWarranty: boolean,
  technicianSignature?: string
}

Response (Success):
{
  success: true,
  data: {
    id: string,
    ...formData,
    createdAt: Date
  },
  message: string
}

Response (Error):
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

**GET /api/warranty-claims**
```typescript
Response:
{
  success: true,
  data: WarrantyClaim[]
}
```

### Data Model

```typescript
interface WarrantyItem {
  partNo: string;              // Part number
  quantity: number;            // Quantity of parts
  failedPartSerial: string;    // Serial of failed part
  replacedPartSerial: string;  // Serial of replacement part
  dateOfFailure: Date;         // When part failed
  dateOfRepair: Date;          // When part was repaired
}

interface WarrantyClaim {
  id: string;                  // Auto-generated unique ID
  date: Date;                  // Claim date
  chillerModel: string;        // Chiller model number
  chillerSerial: string;       // Chiller serial number
  ssidJobNumber: string;       // Job/SSID number
  buildingName?: string;       // Building name (optional)
  siteName: string;            // Site name
  technicianName: string;      // Technician name
  items: WarrantyItem[];       // Array of parts claimed
  comments?: string;           // Additional comments
  coveredByWarranty: boolean;  // Warranty coverage flag
  technicianSignature?: string; // Technician signature (optional)
  adminSignature?: string;     // Admin signature (optional)
  adminProcessedStamp?: boolean; // Processing status
  createdAt: Date;             // Timestamp
}
```

### PDF Generation - Trane Form Specification

The PDF generator replicates the official Trane Warranty Parts Claims Form:

**Header Section**
- Trane red circle logo (left)
- "TRANE" text
- "TRANE TECHNOLOGIES" logo
- Centered title: "TRANE WARRANTY PARTS CLAIMS FORM"

**General Information Fields**
- DATE
- CHILLER MODEL
- CHILLER SERIAL NUMBER
- JOB NUMBER / SSID #
- BUILDING NAME
- SITE NAME
- ATTENDED BY

**Parts Table**
Columns:
- Part No.
- Qty
- Serial Number for Failed Parts
- Serial Number for Replaced Part
- Date of Failure
- Date of Repair

**Additional Sections**
- Comments (large text area)
- Warranty checkbox
- Important notes (3 bullet points):
  * Need Serial Number to be able to make a claim (Mandatory).
  * Provide Photos of Failed Parts.
  * Provide Service Reports for Failed Parts.

**Admin Processing Section**
- Red PROCESSED stamp
- Admin date
- Admin signature

**Design Specifications**
- Fonts: Arial/Helvetica
- Colors: Black + Trane Red (#EE3124)
- Logos: `/public/assets/logo/trane-logo.svg` and `/public/assets/logo/trane-tech-logo.svg`

### PDF Flow

1. User submits warranty claim form
2. Server saves claim record
3. `generateWarrantyClaimPDF()` called with claim data
4. Text-based PDF stub generated matching Trane form layout (MVP)
5. PDF saved/logged for reference
6. Future: Full PDF with exact visual styling, logos, and signatures

### Form Components

**WarrantyClaimForm.tsx**
- General information fields
- Dynamic parts table (add/remove rows)
- Comments textarea
- Warranty coverage checkbox
- Zod validation
- Real-time error feedback
- Loading states during submission
- Redirect to claim detail on completion

**Input.tsx**
- Reusable form input component
- Support for text, number, date types
- Error state styling
- Required field indicators

### Pages

1. **Warranty Claims Form Page** (`/warranty-claims`)
   - Displays the warranty claim form
   - Trane form layout
   - Mobile-responsive design

2. **Claim Detail Page** (`/warranty-claims/[id]`)
   - Claim information display
   - Parts details table
   - Download PDF button (stub)
   - Admin approval placeholder (future wave)

### Validation & Security

**Client-Side Validation**
- Zod schema validation for all fields
- Required field checks
- Type validation (dates, numbers)
- Array validation for parts table
- Real-time error feedback

**Server-Side Validation**
- Schema validation with Zod
- Input sanitization (XSS prevention)
- Type safety with TypeScript
- Error handling
- Organisation validation ready

**Security Measures**
- Input sanitization on all string fields
- HTML entity encoding
- Server-side validation (never trust client)
- Prepared for organization_id header validation
- Ready for rate limiting

### Current Implementation Status

✅ Implemented:
- Warranty claim data model (WarrantyClaim, WarrantyItem)
- Warranty claim form UI with all required fields
- Dynamic parts table (add/remove rows)
- Client-side validation with Zod
- API route with POST/GET handlers
- Input sanitization
- In-memory data storage
- PDF generation stub (text-based, Trane form layout)
- Claim detail/report page
- Mobile-responsive design
- Trane logo placeholders (SVG)

⏳ Future Enhancements:
- Database persistence (Prisma)
- Full PDF generation with exact visual styling
- Logo integration in PDF
- Admin approval workflow
- Photo upload functionality
- Email notifications
- Signature capture
- Audit trail logging
- Authentication/authorization
- Organization-level isolation
- Export to external warranty systems
