# PartPulse Deployment Guide

## Overview

This guide covers deploying PartPulse to production environments. The application supports multiple deployment targets including Vercel, AWS, Azure, and self-hosted solutions.

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are configured
- [ ] Database schema is up to date
- [ ] Initial admin user is seeded
- [ ] Security secrets are generated and secured
- [ ] Email service is configured (optional)
- [ ] Storage provider is configured (local or S3)
- [ ] SSL certificates are ready (for self-hosted)
- [ ] QA tests pass at 100%

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/partpulse?schema=public"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
AUTH_SECRET="generate-a-secure-random-string-min-32-chars"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
PRIMARY_COLOR="#FF2B00"
NODE_ENV="production"

# Email (Optional)
EMAIL_DOMAIN="your-domain.com"
EMAIL_FROM="noreply@your-domain.com"
ADMIN_EMAIL="admin@your-domain.com"
RESEND_API_KEY="re_xxxxxxxxxx"

# Storage
STORAGE_PROVIDER="local"  # or 's3'
```

### Generating Secrets

```bash
# Generate AUTH_SECRET
openssl rand -base64 32
```

## Deployment to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel Dashboard
5. Configure database (Vercel Postgres or external)

## Security Configuration

### SSL/TLS
- Always use HTTPS in production
- Vercel provides automatic HTTPS
- For self-hosted, use Let's Encrypt

### Rate Limiting
Built-in rate limiting:
- Auth endpoints: 5 requests/15min
- API endpoints: 100 requests/15min
- Password reset: 3 requests/hour

### Security Headers
Automatically applied via middleware:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy

## Post-Deployment

1. Verify health checks
2. Configure monitoring
3. Set up logging
4. Implement backup strategy
5. Seed initial admin user: `npm run db:seed`
6. Configure DNS

## Troubleshooting

### Build Failures
1. Check Node version (18+ required)
2. Clear cache: `rm -rf .next node_modules && npm install`
3. Verify environment variables

### Database Connection Issues
1. Verify DATABASE_URL format
2. Check firewall rules
3. Test connection: `npx prisma db pull`

### Authentication Issues
1. Verify AUTH_SECRET is set
2. Check NEXTAUTH_URL matches domain
3. Ensure HTTPS is enabled

## Support

For deployment issues, review logs and verify all checklist items.
