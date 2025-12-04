# PartPulse - Rules and Specifications

## App Purpose

PartPulse is a part distribution application designed to streamline internal transfer management and warranty claims processing. The application enables organizations to track part movements, manage warranty workflows, generate reports, and maintain audit trails for compliance and operational transparency.

## User Roles

### Admin
- Full system access
- User management capabilities
- Can invite new members
- Access to all reports and settings
- Can view and manage all transfers and warranty claims
- Can configure system settings
- Access to audit logs

### Technician
- Create and view internal transfers
- Create and view warranty claims
- View reports (filtered to their own data)
- Cannot invite users
- Cannot access system settings
- Cannot view other users' data (except admins)

## Access Rights Model

### Role-Based Access Control (RBAC)
- **Admin**: Full CRUD operations on all resources
- **Technician**: Limited CRUD - can create/read/update their own records
- **Authentication Required**: All pages require authentication
- **Route Protection**: Server-side and client-side route guards
- **Data Isolation**: Technicians can only access their own data unless explicitly shared

### Access Matrix

| Resource | Admin | Technician |
|----------|-------|------------|
| Internal Transfers (Own) | CRUD | CRUD |
| Internal Transfers (Others) | CRUD | Read |
| Warranty Claims (Own) | CRUD | CRUD |
| Warranty Claims (Others) | CRUD | Read |
| User Management | CRUD | None |
| Reports (All Data) | Read | None |
| Reports (Own Data) | Read | Read |
| System Settings | CRUD | None |
| Audit Logs | Read | None |

## Notification Workflows

### Internal Transfer Notifications
1. **On Creation**: 
   - Notify sender (confirmation)
   - Notify recipient (new transfer incoming)
   - Notify admin (for audit)

2. **On Status Change**:
   - Notify all stakeholders of status updates
   - Generate audit log entry

3. **On Completion**:
   - Notify sender (transfer complete)
   - Notify recipient (transfer received)
   - Archive notification

### Warranty Claim Notifications
1. **On Submission**:
   - Notify submitter (confirmation)
   - Notify admin (new claim)
   - Notify warranty department

2. **On Status Update**:
   - Notify claimant of approval/rejection
   - Generate audit log entry

3. **On Resolution**:
   - Notify all stakeholders
   - Generate final report PDF

## Email Invitation Workflow

### Invitation Process
1. **Admin initiates invitation**:
   - Enter email address
   - Select role (Admin/Technician)
   - Optional: Add personal message

2. **System generates invitation**:
   - Create unique invitation token (expires in 7 days)
   - Store invitation record in database
   - Generate invitation email

3. **Email sent**:
   - Welcome message
   - Role information
   - Invitation link with token
   - Expiration notice

4. **User accepts invitation**:
   - Click link to registration page
   - Validate token
   - Set password
   - Complete profile
   - Account activated

5. **Post-acceptance**:
   - Notify admin of new user activation
   - Send welcome email to new user
   - Log event in audit trail

## Data Fields for Internal Transfer

### Required Fields
- **Transfer ID**: Auto-generated unique identifier
- **Date**: Transfer creation date (auto-filled)
- **From (Sender)**: User creating the transfer
- **To (Recipient)**: Target location/user
- **Part Number**: Part identification code
- **Part Description**: Detailed part description
- **Quantity**: Number of parts transferred
- **Status**: Pending, In Transit, Completed, Cancelled

### Optional Fields
- **Serial Numbers**: Individual serial numbers (if applicable)
- **Notes**: Additional comments or instructions
- **Urgency Level**: Normal, High, Critical
- **Expected Delivery**: Estimated delivery date
- **Tracking Number**: External shipping tracking (if applicable)

### System Fields
- **Created By**: User who created the transfer
- **Created At**: Timestamp of creation
- **Updated At**: Last modification timestamp
- **Updated By**: User who last modified the record

## Data Fields for Warranty Claims

### Required Fields
- **Claim ID**: Auto-generated unique identifier
- **Date Submitted**: Claim submission date (auto-filled)
- **Submitted By**: User creating the claim
- **Part Number**: Failed part identification
- **Part Description**: Description of the part
- **Serial Number**: Specific serial number of failed part
- **Failure Description**: Detailed description of the failure
- **Purchase Date**: When the part was originally purchased
- **Warranty Status**: Under Warranty, Expired, Unknown

### Optional Fields
- **Customer Name**: End customer (if applicable)
- **Customer Contact**: Email/phone
- **Return Address**: Where to send replacement
- **Photos**: Upload failure evidence (up to 5 images)
- **Diagnostic Notes**: Technical analysis
- **Resolution Type**: Repair, Replace, Refund, Deny

### Claim Status Fields
- **Status**: Submitted, Under Review, Approved, Denied, Resolved
- **Reviewer**: Admin who reviewed the claim
- **Review Date**: When the claim was reviewed
- **Review Notes**: Admin comments
- **Resolution Date**: When claim was resolved

### System Fields
- **Created At**: Timestamp of creation
- **Updated At**: Last modification timestamp
- **Resolved At**: Timestamp of resolution

## PDF Generation Requirements

### Internal Transfer PDF
- **Header**: Company logo, "Internal Transfer" title
- **Transfer Details**: All transfer fields
- **QR Code**: For mobile scanning and tracking
- **Barcode**: Part number barcode
- **Signature Section**: Sender and receiver signatures
- **Footer**: Generated timestamp, page numbers

### Warranty Claim PDF
- **Header**: Company logo, "Warranty Claim" title
- **Claim Summary**: Claim ID, status, dates
- **Part Information**: All part details
- **Failure Analysis**: Description and photos
- **Review Decision**: Admin review notes and decision
- **Timeline**: Claim progression timeline
- **Footer**: Generated timestamp, reference number

### PDF Features
- Professional formatting
- Downloadable and printable
- Email-ready (attached to notifications)
- Archivable for compliance

## Reports Page Requirements

### Available Reports

#### 1. Internal Transfer Reports
- **Transfer Summary**: Total transfers by status
- **Transfer by User**: Activity per user
- **Transfer by Part**: Most transferred parts
- **Transfer Timeline**: Transfers over time
- **Pending Transfers**: Currently in-progress transfers

#### 2. Warranty Claim Reports
- **Claim Summary**: Total claims by status
- **Claim Rate**: Claims as percentage of parts
- **Claim by Part**: Most claimed parts
- **Approval Rate**: Percentage of approved claims
- **Average Resolution Time**: Time from submission to resolution

#### 3. User Activity Reports
- **User Activity Log**: Actions by user
- **Login History**: User authentication events
- **Invitation Status**: Pending/accepted invitations

#### 4. Audit Reports
- **Complete Audit Trail**: All system changes
- **Security Events**: Failed logins, permission changes
- **Data Access Log**: Who accessed what data

### Report Features
- **Date Range Filtering**: Custom date ranges
- **Export Options**: PDF, CSV, Excel
- **Visual Charts**: Graphs and charts for key metrics
- **Real-time Data**: Live updates
- **Role-based Filtering**: Technicians see only their data
- **Scheduled Reports**: Email reports on schedule (admin only)

## Security & Compliance Rules

### Authentication
- Email + password authentication
- Password requirements: min 8 characters, 1 uppercase, 1 number, 1 special char
- Session timeout: 24 hours
- Failed login lockout: 5 attempts = 15-minute lockout
- Invitation token expiry: 7 days

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Server-side validation on all operations
- Client-side route guards for UX

### Data Security
- All passwords hashed with bcrypt
- HTTPS only in production
- SQL injection protection via Prisma ORM
- XSS protection via React's built-in escaping
- CSRF tokens on state-changing operations
- Environment variables for secrets

### Privacy
- Data isolation by user role
- No PII in logs
- Secure session management
- Data retention policy: 7 years (configurable)

### Compliance
- Complete audit trail for all operations
- Timestamped records
- User attribution on all changes
- Immutable audit logs
- Regular backup schedule

## Audit Trail

### Logged Events
- User authentication (login/logout)
- User creation/modification/deletion
- Role changes
- Internal transfer creation/updates/completion
- Warranty claim creation/updates/resolution
- Report generation and access
- Settings changes
- Invitation sent/accepted

### Audit Log Fields
- **Event ID**: Unique identifier
- **Timestamp**: Exact time of event
- **User**: Who performed the action
- **Action Type**: CREATE, UPDATE, DELETE, LOGIN, etc.
- **Resource Type**: User, Transfer, Claim, etc.
- **Resource ID**: ID of affected resource
- **Changes**: Before/after values (for updates)
- **IP Address**: User's IP
- **User Agent**: Browser/device information

### Audit Log Retention
- Minimum 7 years retention
- Immutable (cannot be modified)
- Exportable for compliance audits
- Searchable and filterable

## Internationalization Baseline

### Phase 1 (MVP)
- **Primary Language**: English (US)
- **Date Format**: MM/DD/YYYY
- **Time Format**: 12-hour (AM/PM)
- **Currency**: USD
- **Number Format**: 1,234.56

### Phase 2 (Future)
- Multi-language support structure ready
- Translation keys instead of hardcoded strings
- Language selector in settings
- Supported languages: English, Spanish, French, German
- RTL support consideration

### Internationalization Structure
- Use next-i18next for translations
- Separate language files (en.json, es.json, etc.)
- Date/time formatting with date-fns
- Number formatting with Intl API

## Mobile-First Requirement

### Responsive Design
- **Mobile**: 320px - 767px (primary focus)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile Features
- Touch-optimized UI elements
- Swipe gestures for navigation
- Mobile-friendly forms (large inputs)
- Camera integration for warranty claim photos
- Offline capability (future phase)

### Mobile Performance
- Fast initial load (< 3 seconds on 3G)
- Lazy loading of images and components
- Optimized bundle size
- Progressive Web App (PWA) ready

### Mobile-First Components
- Collapsible sidebar on mobile
- Bottom navigation option
- Large touch targets (min 44px)
- Minimal text input requirements
- Barcode/QR scanner integration

## Hosting Model

### Current (MVP)
- **Platform**: Vercel
- **Deployment**: Auto-deploy from main branch
- **Database**: SQLite file (local to deployment)
- **Storage**: Vercel Edge Functions
- **CDN**: Vercel's built-in CDN

### Future Migration Path
- **Platform**: AWS/Azure/Self-hosted
- **Database**: PostgreSQL/MySQL
- **Storage**: S3/Azure Blob
- **Architecture**: Containerized (Docker)
- **Scaling**: Horizontal scaling ready

### Migration Considerations
- Database abstraction via Prisma (easy switch)
- Environment-based configuration
- Stateless application design
- File upload abstraction layer
- API versioning for backward compatibility

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form
- **Validation**: Zod

### Backend
- **API**: Next.js API Routes
- **Database ORM**: Prisma
- **Database**: SQLite (MVP), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Email**: Resend/SendGrid

### Development
- **Language**: TypeScript
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Version Control**: Git + GitHub

## Development Philosophy

### True North
- Architecture-first development
- QA-driven enforcement
- Automated testing and validation
- No manual code review dependency
- Continuous improvement

### One-Time Build
- Build it right the first time
- Comprehensive planning before coding
- Architecture defines implementation
- QA validates against architecture
- Minimal technical debt

### Quality Standards
- 100% TypeScript (no any types)
- Comprehensive error handling
- Accessibility (WCAG 2.1 AA)
- Performance budgets enforced
- Security best practices

## Primary Color

**Brand Color**: `#FF2B00` (Vibrant Red-Orange)

### Color Usage
- Primary buttons and CTAs
- Active navigation items
- Focus states
- Important status indicators
- Brand elements

### Color Palette (Generated from Primary)
- **Primary**: #FF2B00
- **Primary Dark**: #CC2200
- **Primary Light**: #FF5533
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444
- **Info**: #3B82F6
- **Neutral Gray**: #6B7280

## Sidebar Navigation Structure

### Main Navigation Items
1. **Internal Transfer** (`/internal-transfer`)
   - Icon: Transfer/Arrow icon
   - Badge: Pending count

2. **Warranty Claims** (`/warranty`)
   - Icon: Shield/Warning icon
   - Badge: Unresolved count

3. **Invite Members** (`/users/invite`)
   - Icon: User-plus icon
   - Admin only

4. **Reports** (`/reports`)
   - Icon: Chart/Analytics icon
   - Expandable submenu for report types

5. **Settings** (`/settings`)
   - Icon: Gear/Settings icon
   - Admin only

### Sidebar Features
- Collapsible on mobile
- Active state highlighting (primary color)
- Tooltips on hover (desktop)
- User profile section at bottom
- Logout button
- Responsive breakpoint: 1024px
