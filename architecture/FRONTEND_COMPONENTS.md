# Frontend Components Architecture

## Overview

This document defines the frontend component architecture for PartPulse based on APP_DESCRIPTION.md requirements. The frontend follows a mobile-first, component-based architecture using Next.js 14+ App Router, React 19, and TypeScript.

---

## Technology Stack

### Core Framework
- **Framework**: Next.js 14+ (App Router)
- **React Version**: 19.2.0
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **State Management**: React Server Components (default), Client Components (selective)

### UI Library Approach
- **Component Library**: Custom components (no external UI library)
- **Design System**: Trane brand guidelines
- **Primary Color**: #FF2B00 (Trane Red)
- **Icons**: SVG icons
- **Accessibility**: WCAG 2.1 AA compliance target

---

## Component Architecture Principles

### 1. Mobile-First Design
- All components designed for mobile screens first
- Progressive enhancement for tablet and desktop
- Touch-friendly UI elements (minimum 44x44px touch targets)

### 2. Server Components by Default
- Use React Server Components unless client interactivity required
- Client Components only for: forms, interactive elements, browser APIs

### 3. Type Safety
- 100% TypeScript coverage
- Strict type checking enabled
- Props validated with TypeScript interfaces

### 4. Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

### 5. Performance
- Code splitting at route level
- Lazy loading for heavy components
- Image optimization with Next.js Image
- CSS-in-JS avoided (use Tailwind utility classes)

---

## Component Hierarchy

```
app/
├── layout.tsx                    # Root layout (Server Component)
├── page.tsx                      # Dashboard (Server Component)
├── loading.tsx                   # Loading UI
├── error.tsx                     # Error boundary
│
├── internal-transfer/
│   ├── page.tsx                  # Transfer list (Server)
│   ├── new/
│   │   └── page.tsx              # New transfer form (Client)
│   └── [id]/
│       ├── page.tsx              # Transfer details (Server)
│       └── edit/
│           └── page.tsx          # Edit transfer (Client)
│
├── warranty-claims/
│   ├── page.tsx                  # Claims list (Server)
│   ├── new/
│   │   └── page.tsx              # New claim form (Client)
│   └── [id]/
│       ├── page.tsx              # Claim details (Server)
│       └── edit/
│           └── page.tsx          # Edit claim (Client)
│
├── reports/
│   └── page.tsx                  # Reports dashboard (Server)
│
├── users/
│   ├── invite/
│   │   └── page.tsx              # Invite user form (Client)
│   └── page.tsx                  # User management (Server)
│
└── settings/
    ├── page.tsx                  # Settings (Server)
    └── admin/
        └── page.tsx              # Admin settings (Server)

components/
├── ui/                           # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── table.tsx
│   ├── modal.tsx
│   └── sidebar.tsx
│
├── forms/                        # Form components
│   ├── transfer-form.tsx
│   ├── warranty-form.tsx
│   └── invite-form.tsx
│
├── tables/                       # Table components
│   ├── transfer-table.tsx
│   ├── warranty-table.tsx
│   └── user-table.tsx
│
└── layouts/                      # Layout components
    ├── app-shell.tsx
    ├── page-header.tsx
    └── nav-sidebar.tsx
```

---

## Core UI Components

### Button Component

**Location**: `components/ui/button.tsx`

**Purpose**: Reusable button component with variants

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}
```

**Variants**:
- `primary`: Trane red background (#FF2B00), white text
- `secondary`: Gray background, dark text
- `danger`: Red background for destructive actions
- `ghost`: Transparent background, colored text

**Accessibility**:
- Keyboard navigable
- Focus visible indicator
- ARIA labels for icon-only buttons
- Disabled state with `aria-disabled`

**Usage**:
```tsx
<Button variant="primary" onClick={handleSubmit}>
  Submit Transfer
</Button>
```

---

### Input Component

**Location**: `components/ui/input.tsx`

**Purpose**: Form input with validation states

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel'
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  autoComplete?: string
  className?: string
}
```

**States**:
- Default: Gray border
- Focus: Trane red border
- Error: Red border with error message
- Disabled: Grayed out with cursor-not-allowed

**Accessibility**:
- Label associated with input (for/id)
- Error messages announced to screen readers
- Required indicator visible and in label
- Auto-complete hints for browsers

**Usage**:
```tsx
<Input
  label="Part Number"
  value={partNumber}
  onChange={setPartNumber}
  required
  error={errors.partNumber}
/>
```

---

### Select Component

**Location**: `components/ui/select.tsx`

**Purpose**: Dropdown select with options

**Props**:
```typescript
interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  className?: string
}
```

**Features**:
- Native select element (mobile-friendly)
- Consistent styling with Input component
- Option grouping support (future)

**Accessibility**:
- Label associated with select
- Keyboard navigable
- Screen reader friendly

**Usage**:
```tsx
<Select
  label="Transfer Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'COMPLETED', label: 'Completed' }
  ]}
/>
```

---

### Card Component

**Location**: `components/ui/card.tsx`

**Purpose**: Container component for content grouping

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}
```

**Structure**:
- Header: Title, subtitle, actions
- Body: Main content
- Footer: Optional footer content

**Usage**:
```tsx
<Card title="Transfer Details" subtitle="Transfer #12345">
  <div>Transfer content...</div>
</Card>
```

---

### Badge Component

**Location**: `components/ui/badge.tsx`

**Purpose**: Status indicators and labels

**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

**Variants**:
- `success`: Green (completed, approved)
- `warning`: Yellow (pending, under review)
- `danger`: Red (cancelled, denied)
- `info`: Blue (informational)
- `default`: Gray (neutral)

**Usage**:
```tsx
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending Review</Badge>
```

---

### Table Component

**Location**: `components/ui/table.tsx`

**Purpose**: Data table with sorting and pagination

**Props**:
```typescript
interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  sortable?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  loading?: boolean
  empty?: React.ReactNode
}

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}
```

**Features**:
- Responsive: Cards on mobile, table on desktop
- Sortable columns
- Pagination
- Loading states
- Empty states
- Row actions

**Accessibility**:
- Semantic table markup
- Column headers
- Row headers where appropriate
- Keyboard navigation

**Usage**:
```tsx
<Table
  data={transfers}
  columns={[
    { key: 'id', label: 'ID', width: '100px' },
    { key: 'partNumber', label: 'Part Number' },
    { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> }
  ]}
  pagination={{
    page: 1,
    pageSize: 20,
    total: 100,
    onPageChange: setPage
  }}
/>
```

---

### Modal Component

**Location**: `components/ui/modal.tsx`

**Purpose**: Modal dialog for overlays and confirmations

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
}
```

**Features**:
- Focus trap (keyboard navigation contained)
- Overlay click to close (optional)
- ESC key to close
- Body scroll lock when open
- Portal rendering (outside DOM hierarchy)

**Accessibility**:
- `role="dialog"`
- `aria-modal="true"`
- Focus management (focus first input on open)
- Focus return (return focus to trigger on close)

**Usage**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={closeModal}
  title="Confirm Deletion"
>
  <p>Are you sure you want to delete this transfer?</p>
</Modal>
```

---

### Sidebar Component

**Location**: `components/ui/sidebar.tsx`

**Purpose**: Main navigation sidebar

**Props**:
```typescript
interface SidebarProps {
  user: {
    name: string
    email: string
    role: 'ADMIN' | 'TECHNICIAN'
  }
  onLogout: () => void
}
```

**Features**:
- Collapsible on mobile (hamburger menu)
- Role-based menu items
- Active route highlighting
- User profile section
- Logout button

**Navigation Items**:
- Dashboard (all users)
- Internal Transfers (all users)
- Warranty Claims (all users)
- Reports (all users)
- Users (admin only)
- Settings (admin only)

**Accessibility**:
- Semantic nav element
- ARIA labels
- Skip navigation link
- Keyboard navigable

---

## Form Components

### TransferForm Component

**Location**: `components/forms/transfer-form.tsx`

**Purpose**: Form for creating/editing internal transfers

**Props**:
```typescript
interface TransferFormProps {
  initialData?: Partial<InternalTransfer>
  onSubmit: (data: InternalTransferFormData) => Promise<void>
  onCancel: () => void
}
```

**Fields**:
- Date (date picker)
- To Location (text input)
- Part Number (text input)
- Part Description (textarea)
- Quantity (number input)
- Serial Numbers (dynamic list input, optional)
- Notes (textarea, optional)
- Urgency (select)

**Validation**:
- Client-side: Zod schema
- Real-time validation on blur
- Submit validation
- Error display per field

**Client Component**: ✅ (form interactivity required)

---

### WarrantyForm Component

**Location**: `components/forms/warranty-form.tsx`

**Purpose**: Form for creating/editing warranty claims

**Props**:
```typescript
interface WarrantyFormProps {
  initialData?: Partial<WarrantyClaim>
  onSubmit: (data: WarrantyClaimFormData) => Promise<void>
  onCancel: () => void
}
```

**Fields**:
- Date Submitted (date)
- Part Number (text)
- Part Description (text)
- Serial Number (text, mandatory)
- Failure Description (textarea)
- Purchase Date (date)
- Warranty Status (select)
- Customer Name (text, optional)
- Customer Contact (text, optional)
- Photos (file upload, optional)
- Diagnostic Notes (textarea, optional)

**Validation**:
- Zod schema validation
- Serial number required
- Purchase date must be in past
- Warranty status required

**Client Component**: ✅ (form interactivity required)

---

### InviteForm Component

**Location**: `components/forms/invite-form.tsx`

**Purpose**: Form for inviting new users (admin only)

**Props**:
```typescript
interface InviteFormProps {
  onSubmit: (data: InvitationFormData) => Promise<void>
  onCancel: () => void
}
```

**Fields**:
- Email (email input)
- Role (select: ADMIN or TECHNICIAN)
- Welcome Message (textarea, optional)

**Validation**:
- Valid email address
- Role selection required
- Message length limit (500 chars)

**Client Component**: ✅ (form interactivity required)

---

## Table Components

### TransferTable Component

**Location**: `components/tables/transfer-table.tsx`

**Purpose**: Display list of internal transfers

**Props**:
```typescript
interface TransferTableProps {
  transfers: InternalTransfer[]
  onView: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  loading?: boolean
}
```

**Columns**:
- Transfer Number
- Date
- From User
- To Location
- Part Number
- Quantity
- Status (badge)
- Actions (view, edit, delete)

**Features**:
- Sortable by date, status
- Filtering by status
- Role-based actions (edit/delete for admin only)

---

### WarrantyTable Component

**Location**: `components/tables/warranty-table.tsx`

**Purpose**: Display list of warranty claims

**Props**:
```typescript
interface WarrantyTableProps {
  claims: WarrantyClaim[]
  onView: (id: string) => void
  onReview?: (id: string) => void
  loading?: boolean
}
```

**Columns**:
- Claim Number
- Date Submitted
- Submitted By
- Part Number
- Serial Number
- Status (badge)
- Actions (view, review)

**Features**:
- Sortable by date, status
- Filtering by status, warranty status
- Admin review action

---

### UserTable Component

**Location**: `components/tables/user-table.tsx`

**Purpose**: Display list of users (admin only)

**Props**:
```typescript
interface UserTableProps {
  users: User[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onResetPassword: (id: string) => void
  loading?: boolean
}
```

**Columns**:
- Name
- Email
- Role (badge)
- Last Login
- Status (active/inactive badge)
- Actions (edit, delete, reset password)

---

## Layout Components

### AppShell Component

**Location**: `components/layouts/app-shell.tsx`

**Purpose**: Main application shell with sidebar and content area

**Structure**:
```tsx
<div className="app-shell">
  <Sidebar user={user} onLogout={handleLogout} />
  <main className="content-area">
    <PageHeader title={pageTitle} actions={pageActions} />
    {children}
  </main>
</div>
```

**Responsive Behavior**:
- Mobile: Sidebar hidden by default, toggle with hamburger
- Tablet: Sidebar visible, collapsible
- Desktop: Sidebar always visible

---

### PageHeader Component

**Location**: `components/layouts/page-header.tsx`

**Purpose**: Consistent page header with title and actions

**Props**:
```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}
```

**Structure**:
- Title (h1)
- Subtitle (optional)
- Breadcrumbs (optional)
- Action buttons (right-aligned)

---

## State Management Strategy

### Server State
- **Fetching**: Server Components with database queries
- **Caching**: Next.js automatic caching
- **Revalidation**: `revalidatePath()` after mutations

### Client State
- **Form State**: React Hook Form
- **UI State**: `useState` (local component state)
- **Global UI State**: React Context (minimal use)

### Authentication State
- **Provider**: NextAuth.js
- **Session**: JWT stored in httpOnly cookie
- **Client Access**: `useSession()` hook

---

## Styling Conventions

### Tailwind Utility Classes
- Use utility-first approach
- Custom classes only for complex patterns
- Component-specific styles in component file

### Color Palette
```css
/* Primary */
--primary: #FF2B00 (Trane Red)

/* Neutral */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-500: #6B7280
--gray-900: #111827

/* Status */
--success: #10B981 (Green)
--warning: #F59E0B (Yellow)
--danger: #EF4444 (Red)
--info: #3B82F6 (Blue)
```

### Spacing Scale
- Use Tailwind's default spacing scale (4px base unit)
- Consistent padding: `p-4`, `p-6`, `p-8`
- Consistent margins: `mb-4`, `mb-6`, `mb-8`

### Typography
- Font Family: System font stack (sans-serif)
- Headings: Bold weight
- Body: Regular weight
- Size scale: text-sm, text-base, text-lg, text-xl, text-2xl

---

## Performance Optimization

### Code Splitting
- Automatic route-based splitting (Next.js)
- Dynamic imports for heavy components
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### Image Optimization
- Use Next.js `<Image>` component
- Automatic responsive images
- Lazy loading by default

### Bundle Size
- Monitor bundle size with Next.js analyzer
- Target: < 200KB initial JS bundle (gzipped)
- Avoid large dependencies

---

## Testing Strategy

### Component Testing
- **Tool**: Jest + React Testing Library
- **Coverage Target**: 80%+
- **Test Files**: Co-located with components (`*.test.tsx`)

### Testing Priorities
1. Form validation logic
2. User interactions (clicks, inputs)
3. Conditional rendering
4. Error states
5. Accessibility compliance

### Example Test
```typescript
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

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- ✅ Color contrast ratio ≥ 4.5:1 for text
- ✅ Keyboard navigation for all interactive elements
- ✅ Focus indicators visible
- ✅ ARIA labels for icon buttons
- ✅ Form labels associated with inputs
- ✅ Error messages announced to screen readers

### Keyboard Navigation
- Tab: Navigate forward
- Shift+Tab: Navigate backward
- Enter/Space: Activate buttons/links
- Escape: Close modals/dropdowns
- Arrow keys: Navigate lists/menus

### Screen Reader Support
- Semantic HTML elements
- ARIA roles where needed
- Live regions for dynamic content
- Skip navigation links

---

## Checklist Compliance

This document satisfies the following Architecture Design Checklist items:

### Phase 2: Architecture Design
- ✅ System Architecture: Component boundaries clearly defined
- ✅ System Architecture: Communication patterns documented
- ✅ Technology Selection: Framework selection aligned with team capabilities
- ✅ Security Architecture: Input validation strategy defined
- ✅ Scalability & Performance: Caching strategy defined

### Phase 4: Implementation Planning
- ✅ Development Plan: Component structure documented
- ✅ Testing Strategy: Test plan created

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved
