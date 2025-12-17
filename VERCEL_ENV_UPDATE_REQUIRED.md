# Critical: Vercel Environment Variable Update Required

## Root Cause Analysis

**Problem**: 404 DEPLOYMENT_NOT_FOUND on production
**Cause**: Environment variable domain mismatch
- ✅ Actual Vercel domain: `https://part-pulse.vercel.app` (with hyphen)
- ❌ NEXTAUTH_URL configured as: `https://partpulse.vercel.app` (without hyphen)
- ❌ Auth redirects send users to non-existent domain → 404

**Code Status**: ✅ All code is correct
- `proxy.ts` uses relative redirects: `new URL("/auth/signin", req.url)` ✅
- `lib/auth.ts` uses relative paths: `signIn: "/auth/signin"` ✅
- No hardcoded absolute URLs in codebase ✅

**Action Required**: Update Vercel environment variables only (no code changes needed)

---

## Step-by-Step Fix (Vercel Dashboard)

### 1. Navigate to Environment Variables
```
https://vercel.com/dashboard
→ Select "PartPulse" project
→ Settings → Environment Variables
```

### 2. Update NEXTAUTH_URL
- **Variable**: `NEXTAUTH_URL`
- **Current**: `https://partpulse.vercel.app` (without hyphen)
- **Change to**: `https://part-pulse.vercel.app` (with hyphen)
- **Environment**: Production
- **Action**: Click "Edit" → Update value → Save

### 3. Update NEXT_PUBLIC_APP_URL (if exists)
- **Variable**: `NEXT_PUBLIC_APP_URL`
- **Current**: `https://partpulse.vercel.app` (without hyphen)
- **Change to**: `https://part-pulse.vercel.app` (with hyphen)
- **Environment**: Production
- **Action**: Click "Edit" → Update value → Save

### 4. Trigger Redeploy
```
Deployments tab
→ Click latest deployment (from main branch)
→ Click "..." menu → "Redeploy"
→ Confirm redeploy
```

**Wait for deployment to complete** (~2-3 minutes)

### Documentation Updates in This PR

This PR updates documentation to reflect the correct production domain:

1. **.env.example**
   - Updated example: `NEXTAUTH_URL="https://part-pulse.vercel.app"`
   - Shows correct domain format with hyphen

2. **Documentation Files**
   - Updated all references from `partpulse.vercel.app` → `part-pulse.vercel.app`
   - Files: README.md, DEPLOYMENT_GUIDE.md, VERCEL_DEPLOYMENT_FIX.md, etc.

**No code changes**: Both `proxy.ts` and `lib/auth.ts` were already correct

---

## Verification After Fix

### Expected Behavior
After updating environment variables and redeploying:

✅ `https://part-pulse.vercel.app/` → Redirects to `/auth/signin` (not 404)
✅ `https://part-pulse.vercel.app/auth/signin` → Shows sign-in page
✅ `https://part-pulse.vercel.app/auth/first-admin` → Shows first admin setup
✅ All routes work on correct domain

### Test Checklist
- [ ] Root URL redirects to sign-in (if unauthenticated)
- [ ] Sign-in page loads without 404
- [ ] Can complete sign-in flow
- [ ] Application loads after authentication
- [ ] No more DEPLOYMENT_NOT_FOUND errors

---

## Technical Details

### Why This Happens
NextAuth v5 reads `NEXTAUTH_URL` to determine the application's base URL for:
- Constructing OAuth callback URLs
- Building absolute URLs for email links
- Session cookie domain validation

When `NEXTAUTH_URL` doesn't match the actual domain:
```
User visits: https://part-pulse.vercel.app/
  ↓
NextAuth generates redirect URL using NEXTAUTH_URL
  ↓
Redirects to: https://partpulse.vercel.app/auth/signin
  ↓
Vercel: 404 DEPLOYMENT_NOT_FOUND (no deployment at that domain)
```

### Why Code Changes Aren't Needed
- ✅ `proxy.ts` line 24: Uses `new URL("/auth/signin", req.url)` (relative)
- ✅ `lib/auth.ts` line 50: Uses `signIn: "/auth/signin"` (relative path)
- ✅ NextAuth internally uses these relative paths correctly
- ⚠️ But NextAuth still reads `NEXTAUTH_URL` for some operations

The relative paths work correctly when the base URL (from `NEXTAUTH_URL`) is correct.

---

## Summary

**Issue**: Domain mismatch in environment variables
**Solution**: Update Vercel env vars to use correct domain with hyphen
**Code Changes**: None needed (already correct)
**Documentation**: Updated to show correct domain
**Action Owner**: DevOps/Admin with Vercel access
**Priority**: Critical - Blocks all production access
**Time Required**: 5 minutes + redeploy time (~3 min)
