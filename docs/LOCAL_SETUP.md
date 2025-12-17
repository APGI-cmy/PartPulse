# PartPulse Local Development Setup

This guide explains how to set up the PartPulse application for local development to avoid 404 errors and authentication issues.

## Problem Context

In issue #79, developers reported that all sidebar navigation items were rendering 404 pages. The root cause was **not** missing routes, but rather:

1. Missing local database setup
2. No seeded user accounts for authentication
3. Middleware redirecting unauthenticated users to sign-in page

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

For local development, update the `DATABASE_URL` in `.env` to use SQLite:

```env
# For local development
DATABASE_URL="file:./dev.db"
```

The production database URL (PostgreSQL) should only be used in deployment environments.

### 3. Initialize Database

Create and initialize the local SQLite database:

```bash
# Create database schema
npx prisma db push

# Seed with test users
npm run db:seed
```

This creates two test accounts:
- **Admin**: `admin@partpulse.com` / `admin123`
- **Technician**: `tech@partpulse.com` / `tech123`

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Sign In

Navigate to `http://localhost:3000/auth/signin` and use one of the test accounts:

- **Admin Account**: `admin@partpulse.com` / `admin123`
- **Technician Account**: `tech@partpulse.com` / `tech123`

Once signed in, all navigation should work correctly.

## Troubleshooting

### Issue: Getting 404 errors on navigation

**Cause**: You're not authenticated, and the middleware is redirecting you to the sign-in page.

**Solution**: 
1. Ensure you've completed the database setup steps above
2. Sign in with one of the test accounts
3. All pages should now load correctly

### Issue: "Invalid email or password" error

**Cause**: The database hasn't been seeded with user accounts.

**Solution**:
```bash
npm run db:seed
```

### Issue: Database connection errors

**Cause**: Using PostgreSQL URL in local development.

**Solution**: Update `.env` to use SQLite:
```env
DATABASE_URL="file:./dev.db"
```

## Protected Routes

The following routes require authentication:
- `/internal-transfer/*`
- `/warranty-claims/*`
- `/reports/*`
- `/settings/*`
- `/users/*`

If you try to access these routes without being signed in, you'll be redirected to `/auth/signin`.

## Running Tests

The test suite includes comprehensive routing tests to prevent future navigation issues:

```bash
# Run all tests
npm test

# Run routing tests specifically
npm test __tests__/routing/page-routing.test.ts

# Run navigation wiring tests
npm test __tests__/architecture/navigation-wiring.test.ts
```

## Architecture

### Route Configuration

All routes are centrally defined in `lib/routes.ts`. This ensures:
- No hard-coded paths scattered throughout the codebase
- Easy route refactoring
- Type-safe route generation for dynamic routes

### Middleware

Authentication is handled by `middleware.ts`, which:
- Protects specified routes from unauthorized access
- Redirects unauthenticated users to sign-in
- Applies security headers to all responses

### Navigation

The sidebar component (`components/ui/sidebar.tsx`) uses the centralized route configuration from `lib/routes.ts` to ensure all navigation links are correct and maintainable.

## QA Coverage

The routing tests (`__tests__/routing/page-routing.test.ts`) verify:
1. All routes are properly defined
2. Navigation items match route definitions
3. Page files exist for all routes
4. Middleware protection is configured
5. Components use centralized route configuration
6. No hard-coded deployment URLs exist

This comprehensive test coverage prevents the types of issues reported in #79.
