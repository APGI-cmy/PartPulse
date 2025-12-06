# PartPulse Deployment Guide

This guide covers deploying PartPulse to production environments.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL or SQLite database
- Domain name configured
- SSL certificate (automatic with Vercel/AWS)
- Email service account (Resend, SendGrid, or AWS SES)
- Storage solution (Local or S3-compatible)

## Deployment Options

### Option 1: Vercel (Recommended for Quick Start)

Vercel provides the fastest deployment path with automatic SSL, CDN, and scaling.

#### Steps:

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Environment Variables:**
   ```bash
   # Database
   vercel env add DATABASE_URL production
   # Enter: postgresql://user:pass@host:5432/dbname
   
   # Authentication
   vercel env add AUTH_SECRET production
   # Enter: generated secret (openssl rand -base64 32)
   
   vercel env add NEXTAUTH_URL production
   # Enter: https://yourdomain.com
   
   # Email
   vercel env add EMAIL_DOMAIN production
   vercel env add EMAIL_FROM production
   vercel env add ADMIN_EMAIL production
   vercel env add RESEND_API_KEY production
   
   # Storage
   vercel env add STORAGE_PROVIDER production
   # Enter: local or s3
   
   # App
   vercel env add NEXT_PUBLIC_APP_URL production
   # Enter: https://yourdomain.com
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Run Database Migrations:**
   ```bash
   # SSH to deployment or run locally pointing to production DB
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Verify Deployment:**
   - Visit your domain
   - Test login with seeded admin user
   - Create a test transfer
   - Verify email delivery
   - Check PDF generation

### Option 2: Self-Hosted (Docker)

For full control over infrastructure and data.

#### Steps:

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   # Build application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://partpulse:password@db:5432/partpulse
         - AUTH_SECRET=${AUTH_SECRET}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
       depends_on:
         - db
       restart: unless-stopped
     
     db:
       image: postgres:15-alpine
       environment:
         - POSTGRES_USER=partpulse
         - POSTGRES_PASSWORD=password
         - POSTGRES_DB=partpulse
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped
     
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./certs:/etc/nginx/certs
       depends_on:
         - app
       restart: unless-stopped
   
   volumes:
     postgres_data:
   ```

3. **Deploy:**
   ```bash
   # Build and start services
   docker-compose up -d
   
   # Run migrations
   docker-compose exec app npx prisma migrate deploy
   docker-compose exec app npx prisma db seed
   
   # Check logs
   docker-compose logs -f app
   ```

### Option 3: AWS (Production Grade)

For enterprise deployments with high availability and scalability.

#### Architecture:
- **Compute:** AWS ECS/Fargate or EC2
- **Database:** AWS RDS (PostgreSQL)
- **Storage:** AWS S3
- **CDN:** CloudFront
- **Email:** AWS SES
- **Load Balancer:** Application Load Balancer
- **SSL:** AWS Certificate Manager

#### Steps:

1. **Create Infrastructure (Terraform recommended):**
   ```hcl
   # main.tf
   resource "aws_ecs_cluster" "partpulse" {
     name = "partpulse-cluster"
   }
   
   resource "aws_rds_instance" "partpulse" {
     identifier        = "partpulse-db"
     engine            = "postgres"
     engine_version    = "15.3"
     instance_class    = "db.t3.micro"
     allocated_storage = 20
     # ... additional configuration
   }
   
   resource "aws_s3_bucket" "partpulse_storage" {
     bucket = "partpulse-pdfs"
     # ... additional configuration
   }
   ```

2. **Configure ECS Task:**
   ```json
   {
     "family": "partpulse",
     "containerDefinitions": [{
       "name": "app",
       "image": "your-registry/partpulse:latest",
       "portMappings": [{"containerPort": 3000}],
       "environment": [
         {"name": "NODE_ENV", "value": "production"}
       ],
       "secrets": [
         {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..."},
         {"name": "AUTH_SECRET", "valueFrom": "arn:aws:secretsmanager:..."}
       ]
     }]
   }
   ```

3. **Deploy:**
   ```bash
   # Build and push Docker image
   docker build -t partpulse .
   aws ecr get-login-password | docker login --username AWS --password-stdin
   docker tag partpulse:latest ${ECR_REGISTRY}/partpulse:latest
   docker push ${ECR_REGISTRY}/partpulse:latest
   
   # Update ECS service
   aws ecs update-service --cluster partpulse-cluster --service partpulse --force-new-deployment
   ```

## Post-Deployment Configuration

### 1. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed

# Verify database
npx prisma studio
```

### 2. Create Admin User

If not seeded automatically:

```bash
# Using Prisma Studio or CLI
npx tsx scripts/create-admin.ts
```

### 3. Configure Email

Test email delivery:

```bash
# Send test email
curl -X POST https://yourdomain.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"admin@example.com"}'
```

### 4. Configure Storage

For S3:

```bash
# Test S3 access
aws s3 ls s3://partpulse-pdfs/

# Set bucket policy for CloudFront
aws s3api put-bucket-policy --bucket partpulse-pdfs --policy file://policy.json
```

### 5. SSL/TLS Setup

- **Vercel:** Automatic
- **Docker:** Use Let's Encrypt with Certbot
- **AWS:** Use ACM (AWS Certificate Manager)

### 6. Domain Configuration

Update DNS records:
```
A     @           -> Your-IP or CNAME to deployment
CNAME www         -> yourdomain.com
TXT   @           -> SPF record for email
```

## Health Checks

### Application Health

```bash
# Check application status
curl https://yourdomain.com/api/health

# Expected response
{"status":"ok","timestamp":"2024-01-01T00:00:00Z"}
```

### Database Health

```bash
# Test database connection
npx prisma db execute --sql "SELECT 1"
```

### Storage Health

```bash
# Test file upload
curl -X POST https://yourdomain.com/api/test-upload
```

## Monitoring

### Application Logs

- **Vercel:** Integrated logging dashboard
- **Docker:** `docker-compose logs -f`
- **AWS:** CloudWatch Logs

### Performance Monitoring

Configure monitoring tools:
- Vercel Analytics (automatic on Vercel)
- New Relic
- Datadog
- AWS CloudWatch

### Error Tracking

Integrate error tracking:
- Sentry
- Rollbar
- Bugsnag

## Scaling

### Horizontal Scaling

- **Vercel:** Automatic
- **Docker:** Increase replica count
- **AWS:** Configure Auto Scaling Group

### Database Scaling

- Enable read replicas
- Implement connection pooling
- Consider PgBouncer for PostgreSQL

### Storage Scaling

- S3 scales automatically
- Configure CloudFront for CDN
- Enable S3 Transfer Acceleration

## Backup and Recovery

### Database Backups

```bash
# PostgreSQL backup
pg_dump -h localhost -U partpulse partpulse > backup.sql

# Automated backups (AWS RDS)
# Configured in RDS settings
```

### File Storage Backups

```bash
# S3 cross-region replication
aws s3api put-bucket-replication --bucket partpulse-pdfs --replication-configuration file://replication.json
```

### Restore Procedure

```bash
# Database restore
psql -h localhost -U partpulse partpulse < backup.sql

# S3 restore
aws s3 sync s3://partpulse-pdfs-backup/ s3://partpulse-pdfs/
```

## Troubleshooting

### Application Won't Start

1. Check environment variables
2. Verify database connectivity
3. Review application logs
4. Ensure Node.js version compatibility

### Database Connection Issues

1. Verify DATABASE_URL format
2. Check firewall/security group rules
3. Confirm database is running
4. Test credentials manually

### Email Not Sending

1. Verify email service API key
2. Check SMTP configuration
3. Review email service dashboard
4. Test with curl command

### PDF Generation Failing

1. Check storage configuration
2. Verify write permissions
3. Review PDF template syntax
4. Check storage quota/limits

## Rollback Procedure

If deployment fails:

```bash
# Vercel
vercel rollback

# Docker
docker-compose down
git checkout previous-tag
docker-compose up -d

# AWS ECS
aws ecs update-service --cluster partpulse-cluster --service partpulse --task-definition partpulse:previous-version
```

## Security Checklist

- [ ] SSL/TLS configured
- [ ] Security headers enabled
- [ ] CSRF protection active
- [ ] Rate limiting enabled
- [ ] Secrets stored securely (not in code)
- [ ] Database credentials rotated
- [ ] Firewall rules configured
- [ ] Backups tested
- [ ] Monitoring alerts configured
- [ ] Error tracking enabled

## Support

For deployment assistance:
- Documentation: https://docs.partpulse.com
- Email: support@example.com
- Emergency: [Emergency contact]
