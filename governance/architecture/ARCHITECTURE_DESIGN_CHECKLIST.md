# Architecture Design Checklist

## Canonical Governance Document

**This document is governed by Foreman Governance. The canonical version is located at:**

**https://github.com/MaturionISMS/maturion-foreman-governance/blob/main/architecture/ARCHITECTURE_DESIGN_CHECKLIST.md**

---

## Purpose

This pointer redirects to the canonical Architecture Design Checklist maintained in the Foreman Governance repository. The checklist ensures architectural decisions are made with rigor, clarity, and governance compliance across all Maturion projects.

## PartPulse Architecture

For PartPulse-specific architecture documentation:
- [/architecture/ARCHITECTURE.md](../../architecture/ARCHITECTURE.md) - Complete system architecture
- [/architecture/](../../architecture/) - Full architecture specification (11 documents)
- [APP_DESCRIPTION.md](../../APP_DESCRIPTION.md) - Application definition (True North Phase 1)

## Architecture Documents

PartPulse architecture is documented across 11 comprehensive documents (280 KB total):
- ARCHITECTURE.md (master) - 45 KB
- DATABASE_SCHEMA.md - 16 KB
- FRONTEND_COMPONENTS.md - 19 KB
- COMPONENT_BOUNDARIES.md - 19 KB
- DATA_FLOW.md - 39 KB
- API_SPECIFICATION.md - 16 KB
- SECURITY_ARCHITECTURE.md - 18 KB
- AUDIT_LOGGING.md - 15 KB
- EXTERNAL_DEPENDENCIES.md - 13 KB
- DEPLOYMENT_GUIDE.md - 9 KB
- IMPLEMENTATION_GUIDE.md - 16 KB

All architecture follows the canonical Architecture Design Checklist guidelines.

## Database Migration Deployment

PartPulse enforces strict database migration deployment requirements to ensure zero manual intervention and maintain True North compliance:

### Migration Deployment Requirements

1. **Automated Migration Deployment**: All database migrations MUST be applied automatically via `npx prisma migrate deploy` in CI/CD pipelines before test execution
2. **Zero Manual Steps**: Database schema changes require zero manual intervention - all migrations are version-controlled and automatically applied
3. **CI Integration**: QA Enforcement workflows apply migrations to test databases before running test suites
4. **Idempotent Migrations**: Migrations use `IF NOT EXISTS` clauses where appropriate to handle partial application scenarios
5. **No Manual Database Changes**: Direct database modifications are prohibited - all schema changes go through Prisma migrations

### Enforcement

- CI workflows validate that migrations are applied before tests run
- Tests fail if database schema does not match Prisma schema
- Failed migrations block deployment until resolved
- Zero Test Debt policy requires 100% pass rate including migration validation tests

This ensures database schema consistency across all environments (development, CI, staging, production) with no manual steps.
