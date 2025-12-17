# Vercel DEPLOYMENT_NOT_FOUND Troubleshooting Guide

## Understanding DEPLOYMENT_NOT_FOUND

This error occurs **only** when the URL being accessed does not map to an active production deployment. It is a **Vercel routing/aliasing issue**, not an application or infrastructure failure.

### What DEPLOYMENT_NOT_FOUND Is NOT

❌ **NOT** caused by:
- Database connectivity issues
- Missing environment variables
- Runtime initialization failures
- Application code errors
- Build failures

✅ These issues manifest as 500 errors or runtime errors, not DEPLOYMENT_NOT_FOUND.

### What DEPLOYMENT_NOT_FOUND IS

It occurs when:
- Accessing old deployment-specific URLs (e.g., `partpulse-xyz123.vercel.app`) that have been replaced
- Accessing preview deployment URLs after they've been garbage-collected
- The production alias is not properly configured to point to the latest deployment
- A deployment has not been promoted to Production in Vercel

---

## Resolution Steps

### Step 1: Verify Production Deployment Status

1. Go to **Vercel Dashboard** → **PartPulse Project** → **Deployments**
2. Check the latest deployment from the `main` branch
3. Verify it shows a **"Production"** label/badge
4. If it doesn't:
   - Click on the deployment
   - Click **"Promote to Production"** button
   - Wait for the promotion to complete

### Step 2: Verify Production Domain Configuration

1. Go to **Vercel Dashboard** → **PartPulse Project** → **Settings** → **Domains**
2. Confirm these settings:
   - Domain: `partpulse.vercel.app`
   - Status: **Active**
   - Branch: Points to `main` (or production branch)
   - Type: **Production**
3. If the domain isn't configured correctly:
   - Remove any incorrect domain assignments
   - Add `partpulse.vercel.app` as Production domain
   - Assign it to the `main` branch

### Step 3: Access Only Production URL

**Always use:**
```
https://partpulse.vercel.app
```

**NEVER use:**
```
https://partpulse-xyz123.vercel.app          # Deployment-specific (ephemeral)
https://partpulse-git-branch.vercel.app      # Branch-specific (preview)
```

### Step 4: Force Redeploy (If Needed)

If the above steps don't resolve the issue:

1. Go to **Vercel Dashboard** → **PartPulse Project** → **Deployments**
2. Find the latest successful deployment
3. Click the **three dots (⋯)** menu
4. Select **"Redeploy"**
5. Check **"Use existing Build Cache"** (optional)
6. Click **"Redeploy"**
7. Wait for deployment to complete
8. Verify it's marked as **Production**

---

## Verification Checklist

After following the resolution steps, verify:

- [ ] Latest build shows "Production" label in Vercel Dashboard
- [ ] Production domain `partpulse.vercel.app` is configured and active
- [ ] Domain points to the correct branch (`main`)
- [ ] Accessing `https://partpulse.vercel.app` returns the application (not 404)
- [ ] Accessing `https://partpulse.vercel.app/auth/signin` shows the signin page

---

## Code Changes in This PR

The code changes in this PR ensure the application is compatible with Next.js 16 and builds correctly:

1. ✅ **Migrated `middleware.ts` → `proxy.ts`** (Required for Next.js 16)
2. ✅ **Standalone output configured** in `next.config.ts` (Required for Vercel)
3. ✅ **Build succeeds** without warnings
4. ✅ **All routes generated** correctly

These changes ensure Vercel **can** deploy the application. The DEPLOYMENT_NOT_FOUND error is resolved by ensuring Vercel's deployment promotion and domain aliasing are configured correctly (dashboard configuration, not code).

---

## Key Principles

### Database Connectivity

- Database does NOT need to be reachable during build/deployment
- Database connectivity is a **runtime concern only**
- Build-time code must NOT access the database
- Tests requiring database should be skipped in CI or use mocked connections

### Environment Variables

- Environment variables are required for **runtime**, not build
- Missing env vars cause **runtime errors** (500s), not DEPLOYMENT_NOT_FOUND
- Vercel injects env vars at runtime, not build time

### Build vs. Runtime

| Concern | Phase | Error Type if Fails |
|---------|-------|-------------------|
| TypeScript compilation | Build | Build error |
| Next.js routing | Build | Build error |
| Middleware/Proxy setup | Build | Deprecation warning |
| Database connection | Runtime | 500 error |
| Auth configuration | Runtime | 500/401 error |
| Deployment aliasing | Deployment | DEPLOYMENT_NOT_FOUND |

---

## Expected Outcome

After following this guide and verifying Vercel dashboard configuration:

✅ `https://partpulse.vercel.app` → Shows application home page
✅ `https://partpulse.vercel.app/auth/signin` → Shows signin page
✅ All routes accessible via production alias
✅ No more DEPLOYMENT_NOT_FOUND errors

---

## Summary

**Code Changes:** ✅ Complete (proxy.ts migration + standalone output)
**Deployment Configuration:** ⚠️ Requires Vercel Dashboard verification
**Root Cause:** Vercel deployment promotion/aliasing, not application code

Follow the resolution steps above to ensure the production alias correctly maps to the latest deployment.
