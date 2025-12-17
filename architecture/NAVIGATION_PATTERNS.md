# Navigation Patterns and Runtime Wiring

**Document Type**: Architectural Reference  
**Status**: ✅ ENFORCED  
**Related Issue**: ARCH-FAIL-01  
**Created**: 2025-12-16

---

## Purpose

This document defines the mandatory navigation patterns for PartPulse to ensure **zero hard-coded deployment URLs** exist in the application runtime. This prevents `DEPLOYMENT_NOT_FOUND` errors and ensures the application works correctly across all deployment environments (development, preview, staging, production).

---

## Core Principle

**ALL navigation MUST use relative paths or environment-derived URLs.**

Hard-coded absolute URLs (especially preview deployment URLs) are **FORBIDDEN** in application code.

---

## Navigation Methods

### 1. Next.js Link Component (RECOMMENDED)

**✅ CORRECT:**
```tsx
import Link from 'next/link';

<Link href="/internal-transfer">View Transfers</Link>
<Link href="/warranty-claims/123">View Claim</Link>
<Link href={`/warranty-claims/${claimId}`}>View Claim</Link>
```

**❌ FORBIDDEN:**
```tsx
// Never hard-code deployment URLs
<Link href="https://partpulse-preview-123.vercel.app/internal-transfer">View Transfers</Link>
<Link href="https://part-pulse.vercel.app/warranty-claims">View Claims</Link>
```

---

### 2. Router Navigation (RECOMMENDED)

**✅ CORRECT:**
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// Relative paths
router.push('/internal-transfer');
router.push(`/warranty-claims/${claimId}`);
router.push('/internal-transfer/success?id=123');

// Navigate back
router.back();
```

**❌ FORBIDDEN:**
```tsx
// Never hard-code deployment URLs
router.push('https://partpulse-preview-123.vercel.app/internal-transfer');
```

---

### 3. Window Location (USE WITH CAUTION)

**✅ CORRECT:**
```tsx
// Relative paths for internal navigation
window.location.href = '/internal-transfer';

// Full reload with query params
window.location.href = `/warranty-claims/${claimId}`;

// External links (legitimate third-party services)
window.location.href = 'https://docs.tranetechnologies.com';
```

**❌ FORBIDDEN:**
```tsx
// Never hard-code internal deployment URLs
window.location.href = 'https://partpulse-preview-123.vercel.app/internal-transfer';
```

---

## API Calls

### Fetching Data from APIs

**✅ CORRECT:**
```tsx
// Relative API paths (Next.js API routes)
const response = await fetch('/api/internal-transfer');
const response = await fetch(`/api/warranty-claims?id=${claimId}`);
const response = await fetch('/api/reports/transfers');

// Using environment variables for external APIs
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/external-service`);
```

**❌ FORBIDDEN:**
```tsx
// Never hard-code deployment URLs
const response = await fetch('https://partpulse-preview-123.vercel.app/api/internal-transfer');
```

---

## Environment Variables

### Required Variables

**`.env.example` and production environment MUST define:**

```env
# Required for NextAuth (authentication)
NEXTAUTH_URL="https://your-domain.com"

# Optional: External API base URL (if needed)
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

### Using Environment Variables

**✅ CORRECT:**
```tsx
// Only use env vars for legitimate external services or base URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
const response = await fetch(`${baseUrl}/external-api/endpoint`);

// For authentication callbacks
const redirectUrl = process.env.NEXTAUTH_URL + '/api/auth/callback';
```

**❌ FORBIDDEN:**
```tsx
// Don't use env vars to override internal navigation
const url = process.env.NEXT_PUBLIC_BASE_URL + '/internal-transfer';
router.push(url); // Just use router.push('/internal-transfer')
```

---

## File Upload and External Resources

### PDF Generation and Storage

**✅ CORRECT:**
```tsx
// Store PDFs with relative paths or environment-derived storage URLs
const pdfPath = `/storage/transfers/${transferId}.pdf`;

// For cloud storage (S3, etc.), use environment-configured base URL
const s3BaseUrl = process.env.STORAGE_S3_PUBLIC_URL;
const pdfUrl = `${s3BaseUrl}/transfers/${transferId}.pdf`;
```

---

## Testing and Validation

### Automated Tests

Navigation patterns are enforced by automated tests in:

**`__tests__/architecture/navigation-wiring.test.ts`**

This test suite verifies:
1. ✅ No hard-coded deployment URLs in UI code
2. ✅ All Link components use relative paths
3. ✅ All router.push() calls use relative paths
4. ✅ All window.location assignments use relative paths
5. ✅ Environment variables are correctly configured
6. ✅ Navigation patterns are documented

**Run tests:**
```bash
npm test -- __tests__/architecture/navigation-wiring.test.ts
```

---

## Common Patterns

### 1. Form Submission Success Redirect

**✅ CORRECT:**
```tsx
const handleSubmit = async (data) => {
  const response = await fetch('/api/internal-transfer', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Redirect to success page with ID
    router.push(`/internal-transfer/success?id=${result.data.id}`);
  }
};
```

### 2. Detail Page Navigation

**✅ CORRECT:**
```tsx
// From list page
<Link href={`/warranty-claims/${claim.id}`}>
  View Claim
</Link>

// From detail page to admin
<Button onClick={() => router.push(`/warranty-claims/${claimId}/admin`)}>
  Admin Review
</Button>
```

### 3. Back Navigation

**✅ CORRECT:**
```tsx
// Go back in history
<Button onClick={() => router.back()}>
  Back
</Button>

// Explicit navigation to list page
<Button onClick={() => router.push('/warranty-claims')}>
  Back to Claims
</Button>
```

---

## Failure Prevention

### CI/CD Integration

The navigation wiring tests are integrated into the CI/CD pipeline to **BLOCK** any PR that introduces hard-coded deployment URLs.

**In `.github/workflows/test.yml`:**
```yaml
- name: Run Navigation Wiring Tests
  run: npm test -- __tests__/architecture/navigation-wiring.test.ts
```

### Pre-commit Hooks (Future Enhancement)

Consider adding pre-commit hooks to catch violations before they're committed:

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test -- __tests__/architecture/navigation-wiring.test.ts"
```

---

## Exceptions

### Legitimate External Links

External links to third-party services are **ALLOWED**:

```tsx
// Documentation links
<a href="https://docs.tranetechnologies.com" target="_blank" rel="noopener noreferrer">
  Documentation
</a>

// Support links
<a href="https://support.example.com/contact">Contact Support</a>
```

### API Integrations

External API calls to third-party services are **ALLOWED** when using environment variables:

```tsx
// Stripe payment integration
const stripeBaseUrl = process.env.NEXT_PUBLIC_STRIPE_URL;
fetch(`${stripeBaseUrl}/payments`);

// Auth0 integration
const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
```

---

## Lesson Learned (ARCH-FAIL-01)

### Root Cause
Architecture defined domain contracts and schemas but **failed to define runtime navigation resolution rules**, allowing hard-coded, ephemeral preview deployment URLs to exist undetected.

### Prevention
1. ✅ Explicit navigation patterns defined in architecture
2. ✅ Automated tests enforce patterns
3. ✅ Documentation provides clear examples
4. ✅ CI/CD integration blocks violations

### Permanent Fix
- All UI navigation reviewed and confirmed to use relative paths
- Automated test suite added to prevent future violations
- Architecture documentation updated with navigation patterns
- CI/CD pipeline enforces navigation rules

---

## References

- **Architecture**: `architecture/FRONTEND_COMPONENTS.md`
- **Test Suite**: `__tests__/architecture/navigation-wiring.test.ts`
- **Next.js Routing**: https://nextjs.org/docs/app/building-your-application/routing
- **Next.js Link**: https://nextjs.org/docs/app/api-reference/components/link
- **Next.js useRouter**: https://nextjs.org/docs/app/api-reference/functions/use-router

---

**Status**: ✅ COMPLETE  
**Enforcement**: AUTOMATED  
**Reoccurrence**: FORBIDDEN
