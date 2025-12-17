# Vercel Deployment Configuration - Build Output Reference

## Purpose

This document provides reference information about Next.js build output configuration for Vercel deployment, specifically the `output: 'standalone'` setting that prevents DEPLOYMENT_NOT_FOUND errors.

## Configuration Requirement

For Next.js 16+ applications deploying to Vercel, the `next.config.ts` file **must** include:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... other configuration
};
```

## What This Does

### Build Output Structure

With `output: 'standalone'`, Next.js creates:

```
.next/
└── standalone/
    ├── server.js           # Minimal Node.js server entry point
    ├── package.json        # Dependencies manifest
    ├── node_modules/       # Only required runtime dependencies
    ├── .next/              # Compiled application code
    └── [app folders]/      # Your application files
```

### Why Vercel Needs This

1. **Entry Point Detection**: Vercel looks for `server.js` in `.next/standalone` to know how to run the app
2. **Dependency Optimization**: Only includes runtime dependencies, reducing deployment size
3. **Serverless Compatibility**: Structures the app for Vercel's serverless infrastructure
4. **Fast Cold Starts**: Minimal bundle size improves serverless function startup time

## Without This Configuration

If `output: 'standalone'` is missing:

- ✅ Local build succeeds (`npm run build`)
- ✅ Local start works (`npm start`)
- ✅ CI/CD passes
- ❌ Vercel deployment fails with `DEPLOYMENT_NOT_FOUND` error
- ❌ Application returns 404 for all routes

## Detection and Prevention

### Automated Tests

The following tests in `__tests__/deployment/build.test.ts` prevent this issue:

```typescript
// Checks next.config.ts has output configuration
it('should have Next.js output configuration for deployment')

// Verifies .next/standalone directory is created
it('should create standalone build output for Vercel deployment')
```

### Manual Verification

After building locally:

```bash
npm run build

# Check configuration
cat next.config.ts | grep "output.*standalone"

# Verify standalone output exists
ls -la .next/standalone/
ls -la .next/standalone/server.js
```

## Platform Compatibility

| Platform | Requires `output: 'standalone'` | Notes |
|----------|--------------------------------|-------|
| Vercel | **Yes** (Next.js 16+) | Mandatory for serverless deployment |
| AWS Lambda | **Yes** | Same serverless requirements |
| AWS Amplify | **Yes** | Serverless hosting |
| Self-hosted Docker | Recommended | Smaller image size |
| Traditional Server | No | Can use default output |

## Related Configuration

### Environment Variables

Vercel deployment also requires these environment variables:

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."               # Min 32 characters
NEXTAUTH_URL="https://..."      # Must match deployment URL
NEXT_PUBLIC_APP_URL="https://..."
```

### Health Check

Use `/api/health` endpoint to verify deployment configuration:

```bash
curl https://yourdomain.com/api/health
```

Returns configuration status including missing environment variables.

## Troubleshooting

### Symptom: 404 DEPLOYMENT_NOT_FOUND

**Cause**: Missing `output: 'standalone'` in next.config.ts

**Fix**:
1. Add `output: 'standalone'` to next.config.ts
2. Run `npm run build` to verify
3. Commit and push to trigger redeployment

### Symptom: Build succeeds but app doesn't start

**Cause**: Missing environment variables

**Fix**:
1. Check `/api/health` for missing vars
2. Set in Vercel Dashboard → Settings → Environment Variables
3. Redeploy

### Symptom: Standalone directory not created

**Cause**: Syntax error in next.config.ts or build failure

**Fix**:
1. Check `next.config.ts` syntax
2. Run `npm run build` and check for errors
3. Verify TypeScript compilation succeeds

## References

- [Next.js Standalone Output Documentation](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [Vercel Next.js Deployment Guide](https://vercel.com/docs/frameworks/nextjs)
- Issue Resolution: `DEPLOYMENT_FIX_404.md`
- FL/CI Entry: `qa/FAILURE_LEARNING_LOG.md` - Failure #2

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2025-12-17 | 1.0 | Initial documentation after FL/CI incident |

---

**Status**: Active Reference Document  
**Maintainer**: Engineering Team  
**Review Cycle**: On Next.js major version updates
