# BUILD-TO-GREEN Plan — PartPulse

## Document Authority

**Authority**: ForemanApp Agent Contract  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Date**: 2025-12-16  
**Based On**: QA_PLAN.md (37 tests across 13 categories)

---

## Purpose

This document defines the systematic approach to achieving BUILD-TO-GREEN status for PartPulse. BUILD-TO-GREEN is the mandatory phase between RED QA definition and MERGE authorization.

**Current State**: 🔴 RED (0/37 tests implemented)  
**Target State**: 🟢 GREEN (37/37 tests passing)  
**Strategy**: Systematic gap closure via incremental test implementation

---

## Execution Principles

### 1. No Test Dodging
- All tests must run when they exist
- No `.skip()`, `.only()`, or disabled tests
- Use QA Parking for legitimate exceptions only
- Zero tolerance for silent failures

### 2. Incremental Implementation
- Implement tests in logical waves
- Each wave builds on previous foundations
- Validate after each wave
- Document blockers immediately

### 3. Fix-to-GREEN or Governed Exception
- Every RED test must be resolved
- Resolution = passing test OR approved QA Parking
- No explanations without elimination
- Track all exceptions in parking registry

### 4. Evidence-Based Progress
- Capture test results after each wave
- Track compliance metrics
- Document architectural gaps discovered
- Maintain audit trail

---

## BUILD-TO-GREEN Waves

### Wave 1: Foundation (Database + API)
**Priority**: CRITICAL - Foundation for all other tests  
**Timeline**: Days 1-2  
**Tests**: 8 tests (21.6% of total)

#### Database Schema Compliance (Category 1)
- ✅ File: `__tests__/database/schema-compliance.test.ts`
  - Validate User model with all required fields
  - Validate InternalTransfer model
  - Validate WarrantyClaim model
  - Validate WarrantyItem model
  - Validate AuditLog model
  - Validate Invitation model
  - Validate SystemLog model
  - Validate all enums (Role, TransferStatus, ClaimStatus)
  - Validate relationships and indexes

- ✅ File: `__tests__/database/migrations.test.ts`
  - Validate prisma generate succeeds
  - Validate migrations apply cleanly
  - Validate seed script runs successfully

#### API Contracts (Category 2)
- ✅ File: `__tests__/api/transfer-endpoints.test.ts`
  - Test POST /api/internal-transfers
  - Test GET /api/internal-transfers
  - Test GET /api/internal-transfers/[id]
  - Test PUT /api/internal-transfers/[id]
  - Test DELETE /api/internal-transfers/[id]

- ✅ File: `__tests__/api/warranty-endpoints.test.ts`
  - Test POST /api/warranty-claims
  - Test GET /api/warranty-claims
  - Test GET /api/warranty-claims/[id]
  - Test PUT /api/warranty-claims/[id]
  - Test PATCH /api/warranty-claims/[id]/approve
  - Test PATCH /api/warranty-claims/[id]/reject

- ✅ File: `__tests__/api/user-endpoints.test.ts`
  - Test POST /api/users/invite
  - Test GET /api/users
  - Test GET /api/users/[id]
  - Test PUT /api/users/[id]
  - Test POST /api/users/[id]/reset-password

- ✅ File: `__tests__/api/report-endpoints.test.ts`
  - Test GET /api/reports/transfers
  - Test GET /api/reports/claims
  - Test GET /api/reports/users

**Success Criteria**:
- 8/37 tests passing (21.6%)
- All database models validated
- All API endpoints respond correctly
- Foundation stable for dependent tests

---

### Wave 2: Security + Authentication (Category 3)
**Priority**: HIGH - Security must be validated early  
**Timeline**: Days 3-4  
**Tests**: 5 tests (13.5% cumulative: 35.1%)

- ✅ File: `__tests__/auth/session-management.test.ts`
  - Test session creation and JWT validation
  - Test 8-hour session timeout
  - Test session refresh behavior
  - Test logout and session destruction

- ✅ File: `__tests__/auth/password-security.test.ts`
  - Test password hashing (bcrypt)
  - Test password complexity requirements
  - Test password reset flow
  - Test failed login protection (5 attempts)

- ✅ File: `__tests__/auth/rbac.test.ts`
  - Test Admin access to all resources
  - Test Technician access restrictions
  - Test unauthorized access returns 403
  - Test role-based route protection

- ✅ File: `__tests__/security/input-sanitization.test.ts`
  - Test XSS prevention on all inputs
  - Test SQL injection prevention
  - Test HTML sanitization
  - Test script tag stripping

- ✅ File: `__tests__/security/csrf-protection.test.ts`
  - Test CSRF token generation
  - Test CSRF validation on POST/PUT/DELETE
  - Test missing token rejection
  - Test invalid token rejection

**Success Criteria**:
- 13/37 tests passing (35.1%)
- Authentication flow validated
- RBAC enforcement verified
- Input sanitization proven
- CSRF protection confirmed

---

### Wave 3: Core Business Logic (Category 4-5)
**Priority**: HIGH - Validates core workflows  
**Timeline**: Days 5-7  
**Tests**: 6 tests (16.2% cumulative: 51.4%)

#### Security Controls (Category 4)
- ✅ File: `__tests__/security/rate-limiting.test.ts`
  - Test login rate limiting (5 attempts/15 min)
  - Test API rate limiting (100 requests/min)
  - Test rate limit headers
  - Test rate limit reset behavior

- ✅ File: `__tests__/security/security-headers.test.ts`
  - Test HSTS header
  - Test X-Frame-Options
  - Test Content-Security-Policy
  - Test X-Content-Type-Options
  - Test Referrer-Policy

#### Audit Logging (Category 5)
- ✅ File: `__tests__/audit/audit-trail.test.ts`
  - Test transfer creation logged
  - Test claim approval logged
  - Test user invite logged
  - Test password reset logged
  - Test admin actions logged

- ✅ File: `__tests__/audit/log-integrity.test.ts`
  - Test immutable audit logs
  - Test log timestamp accuracy
  - Test log user attribution
  - Test log data completeness

- ✅ File: `__tests__/audit/log-retention.test.ts`
  - Test log query by date range
  - Test log query by user
  - Test log query by action type
  - Test log export functionality

- ✅ File: `__tests__/audit/sensitive-data.test.ts`
  - Test password not logged
  - Test tokens not logged
  - Test PII redaction
  - Test sensitive field masking

**Success Criteria**:
- 19/37 tests passing (51.4%)
- Rate limiting enforced
- Security headers present
- Complete audit trail
- Sensitive data protected

---

### Wave 4: Data Flow + Frontend (Category 6-7)
**Priority**: MEDIUM - Validates UI/UX behavior  
**Timeline**: Days 8-10  
**Tests**: 6 tests (16.2% cumulative: 67.6%)

#### Data Flows (Category 6)
- ✅ File: `__tests__/data-flow/transfer-workflow.test.ts`
  - Test transfer creation flow
  - Test transfer PDF generation
  - Test transfer email notification
  - Test transfer state transitions

- ✅ File: `__tests__/data-flow/warranty-workflow.test.ts`
  - Test claim submission flow
  - Test claim approval flow
  - Test claim rejection flow
  - Test claim PDF generation

- ✅ File: `__tests__/data-flow/invitation-workflow.test.ts`
  - Test invitation creation
  - Test invitation email delivery
  - Test invitation acceptance
  - Test invitation expiry (7 days)

#### Frontend Components (Category 7)
- ✅ File: `__tests__/components/form-validation.test.ts`
  - Test transfer form validation
  - Test warranty form validation
  - Test user form validation
  - Test error message display

- ✅ File: `__tests__/components/ui-components.test.ts`
  - Test button rendering and interactions
  - Test input field behavior
  - Test select dropdown behavior
  - Test card component rendering

- ✅ File: `__tests__/components/error-handling.test.ts`
  - Test 404 page rendering
  - Test 500 error page rendering
  - Test error boundary behavior
  - Test toast notification display

**Success Criteria**:
- 25/37 tests passing (67.6%)
- All workflows validated end-to-end
- Form validation working
- UI components stable
- Error handling proper

---

### Wave 5: Architecture + Dependencies (Category 8-9)
**Priority**: MEDIUM - Validates structural integrity  
**Timeline**: Days 11-12  
**Tests**: 5 tests (13.5% cumulative: 81.1%)

#### Component Boundaries (Category 8)
- ✅ File: `__tests__/architecture/layer-separation.test.ts`
  - Test API layer independence
  - Test business logic separation
  - Test data access isolation
  - Test no circular dependencies

- ✅ File: `__tests__/architecture/dependency-direction.test.ts`
  - Test dependencies flow toward core
  - Test no UI dependencies in business logic
  - Test no database dependencies in API layer
  - Test clean architecture compliance

#### External Dependencies (Category 9)
- ✅ File: `__tests__/external/email-service.test.ts`
  - Test email sending (mocked in test)
  - Test email template rendering
  - Test email failure handling
  - Test retry logic

- ✅ File: `__tests__/external/storage-service.test.ts`
  - Test file upload (if implemented)
  - Test file retrieval
  - Test file deletion
  - Test storage error handling

- ✅ File: `__tests__/external/pdf-generation.test.ts`
  - Test transfer PDF generation
  - Test warranty PDF generation
  - Test PDF template rendering
  - Test PDF download functionality

**Success Criteria**:
- 30/37 tests passing (81.1%)
- Architecture boundaries enforced
- External dependencies abstracted
- Email service integrated
- PDF generation working

---

### Wave 6: Operations + Governance (Category 10-13)
**Priority**: REQUIRED - Validates operational readiness  
**Timeline**: Days 13-15  
**Tests**: 7 tests (18.9% cumulative: 100.0%)

#### Deployment (Category 10)
- ✅ File: `__tests__/deployment/build.test.ts`
  - Test production build succeeds
  - Test no build warnings
  - Test bundle size acceptable
  - Test environment variables validated

- ✅ File: `__tests__/deployment/environment.test.ts`
  - Test all required env vars present
  - Test database connection string valid
  - Test email service configuration
  - Test auth secret configured

- ✅ File: `__tests__/deployment/production-readiness.test.ts`
  - Test health check endpoint
  - Test readiness endpoint
  - Test graceful shutdown
  - Test error monitoring configured

#### Documentation (Category 11)
- ✅ File: `__tests__/documentation/code-documentation.test.ts`
  - Test all public APIs documented
  - Test critical functions have comments
  - Test README completeness
  - Test architecture docs exist

#### Performance (Category 12)
- ✅ File: `__tests__/performance/page-load.test.ts`
  - Test home page load < 2s
  - Test dashboard load < 3s
  - Test report generation < 5s
  - Test no memory leaks

- ✅ File: `__tests__/performance/api-response.test.ts`
  - Test GET endpoints < 200ms
  - Test POST endpoints < 500ms
  - Test list endpoints pagination
  - Test database query performance

#### Governance (Category 13)
- ✅ File: `__tests__/governance/test-dodging.test.ts`
  - Test no .skip() in test suite
  - Test no .only() in test suite
  - Test no commented tests
  - Test detect-test-dodging.js runs clean

- ✅ File: `__tests__/governance/qa-parking.test.ts`
  - Test parking registry schema valid
  - Test all parking entries approved
  - Test no expired parking entries
  - Test parking watcher runs clean

- ✅ File: `__tests__/governance/catastrophic-failure.test.ts`
  - Test evidence capture configured
  - Test failure tracking operational
  - Test governance sync checker runs clean
  - Test policy version matches

**Success Criteria**:
- 37/37 tests passing (100.0%)
- Production build stable
- Documentation complete
- Performance acceptable
- Governance enforced

---

## GREEN Definition

### Local GREEN (Developer Confidence)
- All implemented tests pass locally
- No test dodging detected
- Build succeeds without warnings
- Linting passes
- TypeScript type checking passes

### Gate-Eligible GREEN (Merge Authorization)
- All 37 tests passing in CI
- No test dodging violations
- No governance policy violations
- No unresolved security vulnerabilities
- All QA parking entries approved
- Evidence captured for any failures
- Minimum build-to-red gate passes

---

## Progress Tracking

### Completion Metrics
- **Test Implementation**: 0/37 (0.0%)
- **Test Passage**: 0/37 (0.0%)
- **Wave Completion**: 0/6 (0.0%)
- **Overall Status**: 🔴 RED

### Wave Progress
| Wave | Tests | Status | Completion |
|------|-------|--------|------------|
| Wave 1: Foundation | 8 | ❌ NOT STARTED | 0/8 (0.0%) |
| Wave 2: Security | 5 | ❌ NOT STARTED | 0/5 (0.0%) |
| Wave 3: Business Logic | 6 | ❌ NOT STARTED | 0/6 (0.0%) |
| Wave 4: Data Flow | 6 | ❌ NOT STARTED | 0/6 (0.0%) |
| Wave 5: Architecture | 5 | ❌ NOT STARTED | 0/5 (0.0%) |
| Wave 6: Operations | 7 | ❌ NOT STARTED | 0/7 (0.0%) |

---

## Blockers & Risks

### Identified Blockers
*None yet - to be updated as implementation proceeds*

### Risk Mitigation
1. **Test Complexity**: Start with simple validation, iterate to comprehensive
2. **External Dependencies**: Use mocks/stubs initially, integrate gradually
3. **Performance Tests**: Establish baselines early, monitor continuously
4. **Architecture Tests**: May require refactoring; use QA Parking if needed

---

## Governance Integration

### QA Parking Process
If a test cannot pass immediately:
1. Create QA Parking Request issue
2. Document reason, location, expiry condition
3. Get repo owner approval
4. Add to `qa/parking/registry.json`
5. Link issue in registry
6. Monitor via `node qa/parking/watcher.js`

### Evidence Capture
On any test failure:
1. Capture failure details via `node qa/evidence/capture.js`
2. Store in `qa/evidence/` directory
3. Reference in catastrophic failure issue if repeated
4. Implement permanent prevention

### CI/CD Integration
- `minimum-build-to-red.yml`: Hygiene gate (lockfile, no dodging, lint, build)
- `qa-enforcement.yml`: Full BUILD-TO-GREEN gate (all 37 tests)
- Both must pass for merge authorization

---

## Execution Timeline

### Estimated Duration: 15 working days

**Assumptions**:
- Dedicated effort on BUILD-TO-GREEN
- No major architectural refactoring needed
- External dependencies available/mockable
- Two developers pair programming on complex tests

**Milestones**:
- Day 5: Foundation + Security (Wave 1-2) complete - 35% done
- Day 10: Core functionality validated (Wave 3-4) complete - 68% done
- Day 15: Full BUILD-TO-GREEN achieved (Wave 5-6) complete - 100% done

**Critical Path**: Database → API → Security → Business Logic → Architecture → Governance

---

## Success Criteria

PartPulse is BUILD-TO-GREEN when:
- ✅ All 37 tests implemented
- ✅ All 37 tests passing in CI
- ✅ No test dodging violations
- ✅ No governance violations
- ✅ All QA parking entries justified and approved
- ✅ Evidence captured and categorized
- ✅ Both CI gates (minimum-build-to-red + qa-enforcement) passing
- ✅ Gate-Eligible GREEN achieved

**Only then** may implementation PRs proceed and merge be authorized.

---

## Related Documents

- [QA_PLAN.md](qa/QA_PLAN.md) - Complete QA strategy and test requirements
- [APP_DESCRIPTION.md](APP_DESCRIPTION.md) - Application definition (True North)
- [ARCHITECTURE.md](architecture/ARCHITECTURE.md) - System architecture overview
- [QA_GOVERNANCE_GUIDE.md](docs/governance/QA_GOVERNANCE_GUIDE.md) - Governance compliance guide
- [POLICY_VERSION.md](docs/governance/POLICY_VERSION.md) - Current policy version

---

**Document Status**: APPROVED  
**Approved By**: ForemanApp Agent Contract  
**Next Review**: Upon Wave 3 completion (50% milestone)
