# PartPulse - Part Distribution & Warranty Management

A modern, secure, production-ready web application for managing internal part transfers and warranty claims.

## 🎯 Project Status

**Phase**: QA/Governance Compliance Bootstrap Complete ✅  
**QA Pass Rate**: 100% (2/2 tests passing)  
**Security**: Hardened with rate limiting, CSRF protection, and security headers  
**Governance**: ForemanApp compliant with enforced QA policies  

[![QA Enforcement](https://img.shields.io/badge/QA-Enforced-green.svg)](docs/governance/QA_GOVERNANCE_GUIDE.md)
[![Test Dodging](https://img.shields.io/badge/Test_Dodging-Forbidden-red.svg)](qa/detect-test-dodging.js)
[![Governance](https://img.shields.io/badge/Governance-Synchronized-blue.svg)](docs/governance/POLICY_VERSION.md)

This is a production-ready application built with Next.js 16, featuring comprehensive security controls, performance optimizations, complete operational documentation, and **ForemanApp governance compliance**.

## 🛡️ Governance & QA

PartPulse enforces strict QA and governance policies per the ForemanApp Agent Contract:

### ✅ Compliance Mechanisms
- **No Test Dodging** - All tests must run; skipping forbidden ([detect-test-dodging.js](qa/detect-test-dodging.js))
- **QA Parking** - Governed RED states with approval tracking ([parking registry](qa/parking/registry.json))
- **Catastrophic Failure Tracking** - Permanent evidence capture ([evidence/](qa/evidence/))
- **Governance Sync** - Policy version tracking and validation ([sync-checker.js](qa/governance/sync-checker.js))
- **CI Enforcement** - Automated merge gate protection ([qa-enforcement.yml](.github/workflows/qa-enforcement.yml))

### 📖 Governance Documentation
- [QA Governance Guide](docs/governance/QA_GOVERNANCE_GUIDE.md) - Complete compliance guide
- [Policy Version](docs/governance/POLICY_VERSION.md) - Current governance policy
- [Agent Contract](.github/agents/PartPulse-agent.md) - ForemanApp agent contract

### 🚨 Issue Templates
- [Catastrophic Failure](.github/ISSUE_TEMPLATE/catastrophic-failure.yml) - Report critical failures
- [QA Parking Request](.github/ISSUE_TEMPLATE/qa-parking.yml) - Request governed RED state

## 📋 Features

### ✅ Core Features (100%)
- **Internal Transfers** - Track part movements within the organization
- **Warranty Claims** - Submit and manage warranty claims
- **User Management** - Invite users, manage roles and permissions
- **Reports** - Generate reports on transfers and claims
- **PDF Generation** - Professional branded PDFs with Trane styling
- **Email Notifications** - Automated email receipts and notifications
- **Admin Dashboard** - System logs, user management, password resets
- **Audit Trail** - Complete audit logging for compliance

### 🔐 Security Features
- **Authentication** - NextAuth.js with secure JWT sessions (8-hour timeout)
- **Authorization** - Role-based access control (Admin, Technician)
- **Rate Limiting** - Protection against brute force and API abuse
- **CSRF Protection** - Token-based protection for state-changing operations
- **Security Headers** - HSTS, X-Frame-Options, CSP, and more
- **Input Sanitization** - XSS prevention on all user inputs
- **Secure Cookies** - HttpOnly, Secure, SameSite protection

### ⚡ Performance Features
- **Caching** - In-memory cache for expensive reports
- **Optimized Builds** - Production-grade Next.js optimization
- **CDN Ready** - Static asset optimization
- **Database Optimization** - Indexed queries and connection pooling

### 📚 Documentation (100%)
- `README.md` - Project overview and quick start
- `architecture/architecture.md` - Complete system architecture
- `docs/DEPLOYMENT.md` - Deployment guide for multiple platforms
- `docs/OPERATIONS.md` - Daily operations and maintenance manual
- `docs/SECRET_ROTATION.md` - Security credential rotation procedures
- `rules.md` - Application rules and specifications
- QA system for automated compliance validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL or SQLite database

### Installation

```bash
# Clone repository
git clone https://github.com/MaturionISMS/PartPulse.git
cd PartPulse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials (Development)
- Email: admin@example.com
- Password: See output from `npm run db:seed`
- **⚠️ Change immediately after first login**

### Default Credentials (Development)

After seeding, use these credentials to login:
- **Admin:** admin@example.com / password123
- **Technician:** tech@example.com / password123

**⚠️ Change these immediately in production!**

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with initial data
```

## 🚢 Production Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for comprehensive deployment instructions covering:
- Vercel (recommended quick start)
- Docker/Self-hosted
- AWS (enterprise grade)

### Quick Production Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables via Vercel dashboard
```

## 📖 Documentation

- **[Architecture Specification](./architecture/architecture.md)** - System design and components
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Operations Manual](./docs/OPERATIONS.md)** - Day-to-day operations and maintenance
- **[Secret Rotation](./docs/SECRET_ROTATION.md)** - Security credential rotation procedures
- **[Rules & Specifications](./rules.md)** - Detailed app requirements

## 🔍 QA System

Run automated QA validation:

```bash
python3 qa/run-qa.py
```

Reports generated:
- `qa/QA_REPORT.md` - Human-readable report
- `qa/QA_RESULTS.json` - Machine-readable results

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker-compose up -d
```

### Traditional Hosting
See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

**Target:** 100% compliance with architecture specification

## 🔐 Security

This application implements comprehensive security controls:

### Security Features
- **Authentication:** NextAuth.js with secure JWT sessions
- **Authorization:** Role-based access control (RBAC)
- **Rate Limiting:** Protects against brute force attacks
- **CSRF Protection:** Token-based validation for mutations
- **Security Headers:** HSTS, X-Frame-Options, CSP, etc.
- **Input Sanitization:** XSS prevention on all user inputs
- **Secure Cookies:** HttpOnly, Secure, SameSite attributes
- **Session Timeout:** 8-hour timeout for security
- **Audit Logging:** Complete audit trail for compliance

### Security Scanning

```bash
# Run ESLint security rules
npm run lint

# Run dependency security audit
npm audit

# CodeQL scanning (via GitHub Actions)
```

### Reporting Security Issues

Please report security vulnerabilities to: security@example.com

**Do NOT create public GitHub issues for security vulnerabilities.**

## 📊 Performance

Performance optimizations implemented:

- **Response Time:** Target < 200ms average, < 500ms p95
- **Caching:** In-memory cache for reports and expensive queries
- **Database:** Optimized queries with proper indexing
- **CDN Ready:** Static assets optimized for CDN delivery
- **Bundle Size:** Optimized production builds

### Performance Monitoring

```bash
# Build and analyze bundle
npm run build

# Monitor in production via Vercel Analytics or similar
```

## 📁 Project Structure

Required:
```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="min-32-char-random-string"
NEXTAUTH_URL="https://your-domain.com"
```

Optional:
```bash
# Email
EMAIL_DOMAIN="your-domain.com"
RESEND_API_KEY="re_xxx"

# Storage (S3)
STORAGE_PROVIDER="s3"
STORAGE_S3_BUCKET="your-bucket"
STORAGE_S3_ACCESS_KEY_ID="xxx"
STORAGE_S3_SECRET_ACCESS_KEY="xxx"
```

See `.env.example` for complete list.

**Primary Color**: #FF2B00 (Trane Red)

The application uses a mobile-first responsive design with Tailwind CSS and follows Trane's brand guidelines.

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js v5
- **Database:** Prisma ORM with PostgreSQL/SQLite
- **PDF Generation:** Custom template engine
- **Email:** Resend/SendGrid/AWS SES compatible
- **Storage:** Local filesystem or S3-compatible storage
- **Security:** Rate limiting, CSRF protection, security headers

## 🛡️ Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use strong passwords** - Minimum 16 characters
3. **Enable HTTPS** - Required for production
4. **Regular backups** - Automated daily backups
5. **Monitor logs** - Review security events weekly
6. **Keep updated** - Regular dependency updates

## 🤝 Support

- **Documentation:** See `/docs` folder for comprehensive guides
- **Email:** support@example.com
- **Emergency:** [Emergency contact information]

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For operational issues, consult the [Operations Manual](./docs/OPERATIONS.md).

For deployment help, see [Deployment Guide](./docs/DEPLOYMENT.md).

---

**Built with**: Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma, NextAuth.js

**Security**: Rate limiting, CSRF protection, secure headers, input sanitization

**Ready for**: Production deployment with comprehensive operational documentation
