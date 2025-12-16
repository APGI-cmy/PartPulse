# External Dependencies Architecture

## Overview

This document maps all external dependencies for PartPulse, including runtime libraries, external services, and third-party integrations. Each dependency is documented with purpose, version, license, and risk assessment.

**Based on**: package.json and service integrations  
**Compliance**: Architecture Design Checklist - Vendor lock-in assessment

---

## Dependency Management Principles

1. **Minimize Dependencies**: Only add when necessary
2. **Evaluate Security**: Check vulnerability history
3. **Consider Longevity**: Assess community support
4. **License Compliance**: Verify compatible licenses
5. **Version Pinning**: Lock versions for stability
6. **Regular Updates**: Security patches applied promptly

---

## Runtime Dependencies (npm)

### Core Framework Dependencies

#### Next.js (16.0.7)
**Purpose**: React framework for server-side rendering and routing  
**License**: MIT  
**Vendor**: Vercel  
**Risk Assessment**: Low - Industry standard, active development  
**Lock-in Risk**: Medium - Framework-specific patterns  
**Alternatives**: Remix, Gatsby, vanilla React  
**Justification**: Best-in-class React framework with App Router support

#### React (19.2.0)
**Purpose**: UI library  
**License**: MIT  
**Vendor**: Meta (Facebook)  
**Risk Assessment**: Very Low - De facto standard  
**Lock-in Risk**: Low - Component-based, portable  
**Alternatives**: Vue, Svelte, Angular  
**Justification**: Most popular UI library, massive ecosystem

#### React DOM (19.2.0)
**Purpose**: React renderer for web  
**License**: MIT  
**Vendor**: Meta (Facebook)  
**Risk Assessment**: Very Low  
**Lock-in Risk**: Low  
**Justification**: Required for React web applications

---

### Database & ORM

#### Prisma Client (5.22.0)
**Purpose**: Type-safe database ORM  
**License**: Apache 2.0  
**Vendor**: Prisma  
**Risk Assessment**: Low - Well-funded, active development  
**Lock-in Risk**: Medium - Prisma-specific syntax  
**Migration Path**: Can generate SQL migrations  
**Alternatives**: TypeORM, Drizzle, Kysely  
**Justification**: Best TypeScript ORM with excellent DX

#### Prisma (5.22.0)
**Purpose**: Prisma CLI and schema management  
**License**: Apache 2.0  
**Vendor**: Prisma  
**Risk Assessment**: Low  
**Lock-in Risk**: Low - Schema is portable  
**Justification**: Required for Prisma Client

---

### Authentication

#### NextAuth.js (5.0.0-beta.30)
**Purpose**: Authentication library for Next.js  
**License**: ISC  
**Vendor**: NextAuth  
**Risk Assessment**: Low - Popular, well-maintained  
**Lock-in Risk**: Medium - NextAuth-specific configuration  
**Migration Path**: Can extract to custom auth  
**Alternatives**: Auth0, Clerk, custom JWT  
**Justification**: Seamless Next.js integration, flexible

#### @auth/prisma-adapter (2.11.1)
**Purpose**: Prisma adapter for NextAuth  
**License**: ISC  
**Vendor**: NextAuth  
**Risk Assessment**: Low  
**Lock-in Risk**: Low - Standard adapter pattern  
**Justification**: Enables NextAuth + Prisma integration

---

### Validation

#### Zod (4.1.13)
**Purpose**: TypeScript-first schema validation  
**License**: MIT  
**Vendor**: Colin McDonnell  
**Risk Assessment**: Low - Popular, stable  
**Lock-in Risk**: Medium - Zod-specific schemas  
**Migration Path**: Can convert to Joi, Yup  
**Alternatives**: Joi, Yup, Valibot  
**Justification**: Best TypeScript integration, type inference

---

### Security

#### bcryptjs (3.0.3)
**Purpose**: Password hashing  
**License**: MIT  
**Vendor**: Community  
**Risk Assessment**: Very Low - Battle-tested algorithm  
**Lock-in Risk**: Very Low - Standard bcrypt  
**Alternatives**: argon2, scrypt  
**Justification**: Industry standard for password hashing

---

### Development Dependencies

#### TypeScript (5.x)
**Purpose**: Type-safe JavaScript  
**License**: Apache 2.0  
**Vendor**: Microsoft  
**Risk Assessment**: Very Low - Microsoft-backed  
**Lock-in Risk**: Medium - TypeScript-specific syntax  
**Justification**: Industry standard for type safety

#### ESLint (9.x)
**Purpose**: Code linting  
**License**: MIT  
**Vendor**: Community  
**Risk Assessment**: Very Low  
**Lock-in Risk**: Low - Configuration portable  
**Justification**: Industry standard linter

#### Jest (29.7.0)
**Purpose**: Testing framework  
**License**: MIT  
**Vendor**: Meta (Facebook)  
**Risk Assessment**: Very Low  
**Lock-in Risk**: Medium - Jest-specific APIs  
**Alternatives**: Vitest, Mocha  
**Justification**: Most popular testing framework

#### React Testing Library (16.0.0)
**Purpose**: React component testing  
**License**: MIT  
**Vendor**: Testing Library  
**Risk Assessment**: Low  
**Lock-in Risk**: Low - Standard testing patterns  
**Justification**: Best practices for React testing

#### Tailwind CSS (4.x)
**Purpose**: Utility-first CSS framework  
**License**: MIT  
**Vendor**: Tailwind Labs  
**Risk Assessment**: Low - Popular, stable  
**Lock-in Risk**: High - Utility classes everywhere  
**Migration Path**: Can extract to CSS  
**Alternatives**: Bootstrap, CSS Modules, Styled Components  
**Justification**: Fastest development, consistent styling

---

## External Services

### Database Service

#### Production: PostgreSQL
**Provider**: Supabase or AWS RDS  
**Purpose**: Primary data storage  
**Cost**: ~$25-100/month  
**Vendor Lock-in**: Low - Standard PostgreSQL  
**Migration Path**: Standard pg_dump/restore  
**Alternatives**: MySQL, MongoDB, any PostgreSQL host  
**SLA**: 99.9% uptime  
**Backup**: Daily automated backups  
**Risk Assessment**: Low - Standard database

#### Development: SQLite
**Provider**: Local file system  
**Purpose**: Development database  
**Cost**: Free  
**Vendor Lock-in**: None  
**Migration Path**: Prisma migrations handle differences  
**Justification**: Fast setup, no external dependencies

---

### Email Service

#### SMTP Provider
**Options**: SendGrid, Gmail SMTP, AWS SES  
**Purpose**: Transactional emails  
**Cost**: $15-50/month (depending on volume)  
**Vendor Lock-in**: Low - Standard SMTP protocol  
**Migration Path**: Update SMTP credentials  
**Alternatives**: Any SMTP provider, Resend, Postmark  
**SLA**: 99.5%+ uptime  
**Risk Assessment**: Low - Multiple providers available

**Configuration**:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<api_key>
```

**Abstraction Layer**: `/lib/email/` provides switchable implementation

---

### Storage Service

#### Option 1: Supabase Storage
**Provider**: Supabase  
**Purpose**: PDF storage, file uploads  
**Cost**: $25/month (50GB)  
**Vendor Lock-in**: Medium - S3-compatible API  
**Migration Path**: S3-compatible interface  
**Alternatives**: AWS S3, Cloudflare R2  
**SLA**: 99.9% uptime  
**Risk Assessment**: Low - S3-compatible API

#### Option 2: AWS S3
**Provider**: Amazon Web Services  
**Purpose**: PDF storage, file uploads  
**Cost**: $0.023/GB/month + requests  
**Vendor Lock-in**: Low - Standard S3 API  
**Migration Path**: S3-compatible providers  
**Alternatives**: Cloudflare R2, Backblaze B2  
**SLA**: 99.99% uptime  
**Risk Assessment**: Very Low - Industry standard

#### Option 3: Local File System
**Provider**: Server file system  
**Purpose**: Development only  
**Cost**: Free  
**Vendor Lock-in**: None  
**Migration Path**: Copy files to cloud storage  
**Justification**: Development simplicity

**Abstraction Layer**: `/lib/storage/` provides interface:
```typescript
interface StorageProvider {
  upload(key: string, buffer: Buffer, contentType: string): Promise<string>
  download(key: string): Promise<Buffer>
  delete(key: string): Promise<void>
  getPublicUrl(key: string): string
}
```

---

### Hosting & Deployment

#### Option 1: Vercel (Recommended)
**Provider**: Vercel  
**Purpose**: Application hosting  
**Cost**: $20-$40/month (Pro plan)  
**Vendor Lock-in**: Low - Standard Node.js app  
**Migration Path**: Docker container on any platform  
**Alternatives**: AWS Lambda, Google Cloud Run, self-hosted  
**SLA**: 99.99% uptime  
**Features**:
- Automatic HTTPS
- Edge network CDN
- Serverless functions
- Preview deployments
- Environment variables
- GitHub integration

**Risk Assessment**: Low - Can migrate to Docker

#### Option 2: Self-Hosted (Alternative)
**Provider**: VPS (DigitalOcean, AWS EC2, Hetzner)  
**Purpose**: Application hosting  
**Cost**: $10-50/month  
**Vendor Lock-in**: None - Standard Linux server  
**Migration Path**: Portable Docker containers  
**Requirements**:
- Node.js 20+
- PostgreSQL
- Nginx reverse proxy
- PM2 or systemd
- SSL certificate (Let's Encrypt)

**Risk Assessment**: Low - Full control

---

### CDN & Static Assets

#### Vercel Edge Network (with Vercel hosting)
**Provider**: Vercel  
**Purpose**: Static asset delivery  
**Cost**: Included in hosting  
**Vendor Lock-in**: None - Standard CDN  
**Alternatives**: CloudFlare, AWS CloudFront  
**SLA**: 99.99% uptime

#### CloudFlare (Alternative)
**Provider**: CloudFlare  
**Purpose**: CDN, DDoS protection  
**Cost**: $0-$20/month  
**Vendor Lock-in**: None  
**Alternatives**: AWS CloudFront, Fastly  
**SLA**: 100% uptime guarantee

---

## Dependency Vulnerabilities

### Monitoring

**Tools**:
- npm audit (built-in)
- Snyk (future)
- Dependabot (GitHub)
- GitHub Security Advisories

**Frequency**: 
- Automated: Weekly scans
- Manual: Before each release

### Update Policy

**Security Updates**: Applied immediately (within 24 hours)  
**Major Updates**: Planned, tested, deployed quarterly  
**Minor Updates**: Monthly or as needed  
**Patch Updates**: As released

### Vulnerability Response

1. **Critical (Score 9-10)**: Patch within 24 hours
2. **High (Score 7-8.9)**: Patch within 1 week
3. **Medium (Score 4-6.9)**: Patch within 1 month
4. **Low (Score 0-3.9)**: Patch in next release

---

## License Compliance

### Approved Licenses

- MIT ✅
- Apache 2.0 ✅
- ISC ✅
- BSD-3-Clause ✅
- BSD-2-Clause ✅

### Restricted Licenses

- GPL (requires source code release) ⚠️
- AGPL (network use = distribution) ⚠️
- Commercial (requires payment) ⚠️

### License Audit

**Tool**: `npm install -g license-checker`

**Command**: `license-checker --summary`

**Frequency**: Before each major release

---

## Vendor Risk Assessment

### Critical Vendors

1. **Vercel** (Hosting)
   - Risk: Medium (alternative providers available)
   - Mitigation: Docker containerization ready

2. **Supabase** (Database + Storage)
   - Risk: Medium (PostgreSQL is portable)
   - Mitigation: Standard PostgreSQL dump/restore

3. **NextAuth.js** (Authentication)
   - Risk: Low (can replace with custom auth)
   - Mitigation: JWT tokens are standard

### Monitoring

**Metrics**:
- Service uptime
- Response times
- Error rates
- Cost trends
- Security incidents

**Alerts**:
- Service downtime > 5 minutes
- Error rate > 1%
- Cost increase > 20%

---

## Dependency Update Strategy

### Semantic Versioning

**Major (x.0.0)**: Breaking changes  
**Minor (1.x.0)**: New features, backward compatible  
**Patch (1.0.x)**: Bug fixes

### Update Approach

**Lock File**: `package-lock.json` committed

**Version Ranges**: Exact versions (no `^` or `~`)

**Update Process**:
1. Review changelog
2. Update in development
3. Run full test suite
4. Deploy to staging
5. Verify functionality
6. Deploy to production
7. Monitor for issues

---

## Third-Party Service Costs

### Monthly Cost Estimate

**Minimum (Development)**:
- Hosting: $0 (Vercel Hobby)
- Database: $0 (Supabase Free)
- Storage: $0 (Local)
- Email: $0 (Console logging)
- **Total**: $0/month

**Production (Small)**:
- Hosting: $20 (Vercel Pro)
- Database: $25 (Supabase Pro)
- Storage: $25 (Supabase Storage)
- Email: $15 (SendGrid Essentials)
- **Total**: $85/month

**Production (Large)**:
- Hosting: $40 (Vercel Pro + usage)
- Database: $100 (Supabase Team or AWS RDS)
- Storage: $50 (AWS S3 + CloudFront)
- Email: $50 (SendGrid Pro)
- **Total**: $240/month

### Cost Optimization

1. Use CDN for static assets
2. Compress PDFs before storage
3. Clean up old files
4. Use serverless for variable load
5. Monitor usage and right-size resources

---

## Exit Strategies

### Leaving Vercel

**Steps**:
1. Build Docker container
2. Deploy to AWS/GCP/DigitalOcean
3. Configure environment variables
4. Set up Nginx reverse proxy
5. Configure SSL (Let's Encrypt)
6. Update DNS records
7. Test thoroughly
8. Cut over traffic

**Timeline**: 1-2 days

**Cost Impact**: Potentially lower ($10-50/month VPS)

---

### Leaving Supabase

**Steps**:
1. Export PostgreSQL database (pg_dump)
2. Set up PostgreSQL on AWS RDS or self-hosted
3. Import database
4. Update DATABASE_URL
5. Test connections
6. Cut over

**Timeline**: 4-8 hours

**Cost Impact**: Similar or lower

---

### Leaving Next.js (Extreme)

**Steps**:
1. Extract React components
2. Create new app with different framework
3. Reimplement API routes
4. Migrate state management
5. Update build pipeline
6. Extensive testing

**Timeline**: 2-4 weeks (significant effort)

**Cost Impact**: Development time

**Likelihood**: Very low - Next.js is stable choice

---

## Checklist Compliance

This document satisfies:
- ✅ External dependencies mapped
- ✅ Vendor lock-in risks assessed
- ✅ License compliance verified
- ✅ Community support evaluated
- ✅ Security history reviewed
- ✅ Migration paths documented

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: Architecture Team  
**Status**: Approved
