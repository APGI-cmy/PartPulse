# PartPulse - Part Distribution & Warranty Management

A secure, production-ready web application for managing internal part transfers and warranty claims.

## 🎯 Project Status

**Phase**: Production Ready ✅  
**QA Pass Rate**: Tracking to 100%  
**Security**: Hardened with rate limiting, CSRF protection, and strict RBAC  

## ✨ Features

### Internal Transfer Management
- Mobile-first transfer form with validation
- Automatic PDF generation with Trane branding
- Email notifications (optional)
- Comprehensive audit trail

### Warranty Claims Processing
- Official Trane warranty form replication
- Parts tracking with serial numbers
- Admin approval workflow
- Branded PDF receipts

### Security & Compliance
- ✅ Role-based access control (RBAC)
- ✅ Input sanitization (XSS prevention)
- ✅ Rate limiting (prevents abuse)
- ✅ CSRF protection
- ✅ Secure session management
- ✅ Comprehensive audit logging
- ✅ Security headers (CSP, HSTS, etc.)

### Performance
- ✅ Report caching (5-minute TTL)
- ✅ Optimized database queries
- ✅ Preloaded dashboard data
- ✅ Production-grade error handling

### Administration
- User management with invitation system
- Password reset functionality
- System logs viewer
- Reports dashboard with filtering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or SQLite for development)

### Installation

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npx prisma migrate deploy

# Seed initial admin user
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials (Development)
- Email: admin@example.com
- Password: See output from `npm run db:seed`
- **⚠️ Change immediately after first login**

## 📖 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [Operations Manual](./docs/OPERATIONS.md) - Day-to-day operations guide
- [Architecture](./architecture/architecture.md) - System design and specifications
- [Rules & Specifications](./rules.md) - Detailed app requirements

## 🔐 Security Features

### Authentication
- Secure password hashing (bcrypt)
- JWT-based sessions (24-hour expiry)
- Secure cookie configuration
- Session token rotation

### Rate Limiting
- Auth routes: 5 requests/15 minutes
- API routes: 100 requests/15 minutes
- Password reset: 3 requests/hour
- Automatic cleanup of old rate limit data

### CSRF Protection
- Token-based CSRF validation
- Automatic token rotation
- 1-hour token expiry

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Content-Security-Policy: strict
- Referrer-Policy: strict-origin

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM (PostgreSQL/SQLite)
- **File Storage**: Pluggable (Local/S3)
- **Email**: Configurable (Resend/SendGrid/AWS SES)

### Project Structure
```
/app                    # Next.js app directory (pages & API routes)
/components             # React components
  /ui                   # Reusable UI components
/lib                    # Core libraries
  /security             # Security utilities
  /cache                # Caching layer
  /storage              # File storage abstraction
  /pdf                  # PDF generation
  /email                # Email templates
/prisma                 # Database schema & migrations
/docs                   # Documentation
```

## 📊 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with initial data
```

## 🔍 Quality Assurance

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

### Environment Variables

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

## 📈 Monitoring

### Health Checks
- Application: `/api/health`
- Database: `/api/health/db`

### Logging
- System logs: Settings > Admin > System Logs
- Audit trail: Complete tracking of all actions
- Error monitoring: Integrated logging

### Performance Metrics
- API response time: <200ms (target)
- Database queries: <50ms (target)
- Page load time: <2.5s (target)

## 🔄 Updates & Maintenance

### Weekly
- Review error logs
- Monitor performance metrics
- Check security advisories

### Monthly
- Update dependencies
- Review audit logs
- Test backup/restore

### Quarterly
- Security audit
- Performance optimization
- Capacity planning

## 🛡️ Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use strong passwords** - Minimum 16 characters
3. **Enable HTTPS** - Required for production
4. **Regular backups** - Automated daily backups
5. **Monitor logs** - Review security events weekly
6. **Keep updated** - Regular dependency updates

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For operational issues, consult the [Operations Manual](./docs/OPERATIONS.md).

For deployment help, see [Deployment Guide](./docs/DEPLOYMENT.md).

---

**Built with**: Next.js 16, React 19, TypeScript, Tailwind CSS, NextAuth.js, Prisma
