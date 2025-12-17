# Deployment Guide

## Overview

This document provides step-by-step deployment procedures for PartPulse across different environments and hosting platforms.

**Target Platforms**: Vercel (primary), Self-hosted (alternative)  
**Environments**: Development, Staging, Production

---

## Prerequisites

### Required Tools
- Node.js 20.x or higher
- npm 10.x or higher
- Git
- GitHub account (for Vercel deployment)

### Required Accounts
- Vercel account (for Vercel deployment)
- Database provider account (Supabase or AWS)
- Email provider account (SendGrid or Gmail)
- Storage provider account (Supabase or AWS S3)

---

## Environment Configuration

### Environment Variables

Create `.env.local` (development) or configure in hosting platform:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/database"
# Or for development:
# DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="<32+ random bytes>"
NEXTAUTH_URL="https://your-domain.com"

# Email
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="<sendgrid_api_key>"
EMAIL_FROM="noreply@your-domain.com"
ADMIN_EMAIL="admin@your-domain.com"

# Storage
STORAGE_PROVIDER="supabase"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_KEY="<service_key>"
SUPABASE_BUCKET="partpulse-files"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
PRIMARY_COLOR="#FF2B00"
```

### Generating AUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/MaturionISMS/PartPulse.git
cd PartPulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

---

## Production Deployment - Vercel (Recommended)

### Critical Configuration Requirement

**IMPORTANT**: PartPulse uses Next.js 16+ which requires explicit `output: 'standalone'` configuration in `next.config.ts` for Vercel deployment. This is already configured in the repository.

**Without this configuration, the app will deploy successfully but return 404 DEPLOYMENT_NOT_FOUND errors.**

See: `docs/VERCEL_OUTPUT_CONFIG.md` for details.

### 1. Prepare Repository

Ensure all code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `MaturionISMS/PartPulse`

### 3. Configure Project

**Framework Preset**: Next.js  
**Root Directory**: `./` (default)  
**Build Command**: `npm run build` (default)  
**Output Directory**: `.next` (default)  
**Install Command**: `npm install` (default)

### 4. Set Environment Variables

In Vercel dashboard, go to:
- Settings → Environment Variables
- Add all variables from `.env.local`
- Set for: Production, Preview, Development

**Critical Variables**:
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL` (use Vercel domain: `https://part-pulse.vercel.app`)
- `SMTP_*` variables
- `STORAGE_*` variables

### 5. Deploy

Click "Deploy"

Vercel will:
1. Install dependencies
2. Run Prisma generate
3. Build Next.js application
4. Deploy to edge network

**Deployment Time**: 2-5 minutes

### 6. Run Database Migrations

After first deployment:

```bash
# Using Vercel CLI
vercel env pull .env.production.local
npx prisma migrate deploy

# Or run from Vercel dashboard terminal
```

### 7. Configure Custom Domain (Optional)

1. Go to Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable
5. Redeploy

---

## Production Deployment - Self-Hosted

### Server Requirements

- **OS**: Ubuntu 22.04 LTS (recommended)
- **CPU**: 2+ cores
- **RAM**: 2GB minimum, 4GB recommended
- **Disk**: 20GB minimum
- **Network**: Static IP, open ports 80, 443

### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Create Database

```bash
sudo -u postgres psql

CREATE DATABASE partpulse;
CREATE USER partpulse_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE partpulse TO partpulse_user;
\q
```

### 3. Clone and Build Application

```bash
# Create app directory
sudo mkdir -p /var/www/partpulse
sudo chown $USER:$USER /var/www/partpulse

# Clone repository
cd /var/www/partpulse
git clone https://github.com/MaturionISMS/PartPulse.git .

# Install dependencies
npm install --production

# Create .env file
nano .env
# Paste environment variables

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build application
npm run build
```

### 4. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'partpulse',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/partpulse',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
}
```

Start application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Configure Nginx

Create `/etc/nginx/sites-available/partpulse`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/partpulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Configure SSL

```bash
sudo certbot --nginx -d your-domain.com
```

Select option to redirect HTTP to HTTPS.

### 7. Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## Database Migration

### Development to Production

```bash
# 1. Generate migration
npx prisma migrate dev --name describe_changes

# 2. Commit migration files
git add prisma/migrations
git commit -m "Add database migration"
git push

# 3. Deploy migration to production
# Vercel: Automatic on deploy
# Self-hosted:
npx prisma migrate deploy
```

### Rolling Back Migration

```bash
# Not officially supported by Prisma
# Manual process:
# 1. Identify migration to rollback
# 2. Manually reverse changes in database
# 3. Delete migration directory
# 4. Update _prisma_migrations table
```

---

## Monitoring & Maintenance

### Vercel

**Built-in Monitoring**:
- Deployment logs
- Function logs
- Analytics
- Web vitals

**Access**: Vercel Dashboard → Project → Monitoring

### Self-Hosted

**Install Monitoring Tools**:

```bash
# PM2 monitoring
pm2 monitor

# Log monitoring
pm2 logs partpulse

# Server monitoring
sudo apt install -y htop
```

**Set up Log Rotation**:

```bash
sudo nano /etc/logrotate.d/partpulse
```

```
/var/www/partpulse/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Backup Procedures

### Database Backup

**Automated Daily Backup**:

```bash
#!/bin/bash
# /usr/local/bin/backup-partpulse-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/partpulse"
mkdir -p $BACKUP_DIR

pg_dump -U partpulse_user partpulse | gzip > $BACKUP_DIR/partpulse_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "partpulse_*.sql.gz" -mtime +30 -delete
```

Add to crontab:

```bash
sudo crontab -e
```

```
0 2 * * * /usr/local/bin/backup-partpulse-db.sh
```

### File Backup

```bash
#!/bin/bash
# Backup uploaded files (if using local storage)

tar -czf /var/backups/partpulse/files_$(date +%Y%m%d).tar.gz /var/www/partpulse/storage
```

---

## Disaster Recovery

### Recovery Procedure

1. **Provision new server** (if needed)
2. **Restore database**:
   ```bash
   gunzip < backup.sql.gz | psql -U partpulse_user partpulse
   ```
3. **Restore files**:
   ```bash
   tar -xzf files_backup.tar.gz -C /var/www/partpulse/
   ```
4. **Redeploy application** (follow deployment steps)
5. **Verify functionality**
6. **Update DNS** (if IP changed)

**RTO**: 4 hours  
**RPO**: 24 hours (daily backups)

---

## Troubleshooting

### Common Issues

**Issue**: Build fails  
**Solution**: Check Node.js version, clear `.next` cache, run `npm install`

**Issue**: Database connection fails  
**Solution**: Verify DATABASE_URL, check database server status, verify credentials

**Issue**: 500 errors in production  
**Solution**: Check logs, verify environment variables, check database migrations

**Issue**: Emails not sending  
**Solution**: Verify SMTP credentials, check email provider status, test with curl

---

## Checklist Compliance

This document satisfies:
- ✅ Deployment approach documented
- ✅ Infrastructure requirements defined
- ✅ Environment configuration specified
- ✅ Backup procedures documented
- ✅ Disaster recovery planned

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-16  
**Author**: DevOps Team  
**Status**: Approved
