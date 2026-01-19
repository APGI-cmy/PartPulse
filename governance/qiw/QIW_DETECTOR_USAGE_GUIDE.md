# QIW Detector Usage Guide

**Version**: 1.0.0  
**Date**: 2026-01-19  
**Status**: Production Ready

---

## Quick Start

### Running Detectors Locally

```bash
# Run individual detectors
npm run qiw:detect:test
npm run qiw:detect:lint
npm run qiw:detect:build

# Run all detectors
npm run qiw:detect:all

# Check incident log
cat governance/memory/PartPulse/qiw-events.json | jq '.events[-5:]'
```

### Running in CI

Detectors run automatically on push/PR via `.github/workflows/qiw-gates.yml`:
- ✅ Runs on: main, develop, copilot/**, fix/**, hotfix/**, tech-debt/**
- ✅ Evidence-based validation support (BL-027/028)
- ✅ Quality gate blocking on critical/high severity incidents

---

## Detector Descriptions

### Test Detector (`qiw:detect:test`)

**Monitors**: Test execution, coverage, reliability

**Detects**:
- Test pass rate drops below 95%
- Coverage decreases below 80%
- Skipped tests (.skip, .todo, xit, xdescribe)
- Test dodging (code changes without test updates)
- Flaky tests (requires historical data - future enhancement)
- Test duration degradation (requires historical data - future enhancement)

**Configuration**: `qiw-config.json` → `channels.test`

**Example Output**:
```
✅ Test detector initialized
🔍 Running test detection...
📊 Collecting test metrics from CI environment...
📈 Test metrics: 155/155 passed (100.0%)
✅ No anomalies detected - test channel healthy
```

**Blocking Rules**:
- Critical: Blocks merge immediately
- High: Blocks merge to main
- Medium: Warning only
- Low: Log only

---

### Lint Detector (`qiw:detect:lint`)

**Monitors**: Code style, static analysis, linting violations

**Detects**:
- Lint error increases without remediation
- Critical violations on main branch
- Lint bypass directives (eslint-disable, @ts-ignore, @ts-nocheck)
- Code complexity threshold exceeded (requires tooling - future enhancement)

**Configuration**: `qiw-config.json` → `channels.lint`

**Example Output**:
```
✅ Lint detector initialized
🔍 Running lint detection...
📊 Collecting lint metrics...
📈 Lint metrics: 10 errors, 13 warnings in 7 files
⚠️  Detected: 10 lint errors detected
📝 Writing 2 incidents to event log...
✅ Recorded incidents: QIW-LINT-xxx, QIW-LINT-yyy
```

**Blocking Rules**:
- Critical: Blocks merge immediately (e.g., critical violations on main)
- High: Blocks merge to main
- Medium: Warning only
- Low: Log only

---

### Build Detector (`qiw:detect:build`)

**Monitors**: CI build process, dependency resolution, build artifacts

**Detects**:
- Build failures
- Dependency conflicts (ERESOLVE, peer dependency issues)
- Build duration anomalies (>5 minutes)
- Flaky builds (same code, intermittent failures - requires historical data)

**Configuration**: `qiw-config.json` → `channels.build`

**Example Output**:
```
✅ Build detector initialized
🔍 Running build detection...
📊 Collecting build metrics...
📈 Build metrics: SUCCESS in 45000ms
✅ No anomalies detected - build channel healthy
```

**Blocking Rules**:
- Critical: N/A
- High: Blocks merge and deployment
- Medium: Warning only
- Low: Log only

---

### Deployment Detector (Stub) (`qiw:detect:deployment`)

**Status**: ⚠️ Placeholder implementation - requires Vercel API integration

**Monitors**: Deployment process, environment health, deployment success

**Will Detect** (when integrated):
- Deployment failure rate > 10%
- Repeated rollbacks to same version
- Environment configuration drift
- Deployment duration anomalies
- Post-deployment health check failures

**Configuration**: `qiw-config.json` → `channels.deployment`

**Current Output**:
```
✅ Deployment detector initialized
🔍 Running deployment detection...
ℹ️  Deployment detection requires platform integration (Vercel API, etc.)
ℹ️  Placeholder implementation - checking for basic indicators
✅ No anomalies detected - deployment channel healthy
```

**Integration Requirements**:
- Vercel API client library
- VERCEL_TOKEN environment variable
- Query deployment status, rollback history, health checks

---

### Runtime Detector (Stub) (`qiw:detect:runtime`)

**Status**: ⚠️ Placeholder implementation - requires APM integration

**Monitors**: Application behavior in production/staging

**Will Detect** (when integrated):
- Error rate spikes (>1% baseline)
- Response time degradation (p95 >2s)
- Memory leaks (>90% utilization)
- Exception rate anomalies
- SLA violations (<99% compliance)
- Deployment correlation (incidents after deployments)

**Configuration**: `qiw-config.json` → `channels.runtime`

**Current Output**:
```
✅ Runtime detector initialized
🔍 Running runtime detection...
ℹ️  Runtime detection requires APM integration (Datadog, Sentry, etc.)
ℹ️  Placeholder implementation - checking for basic indicators
✅ No anomalies detected - runtime channel healthy
```

**Integration Requirements**:
- APM tool API client (Datadog, New Relic, Sentry)
- API keys/tokens for monitoring platforms
- Query error rates, response times, resource utilization

---

## Incident Schema

Incidents are logged to `governance/memory/PartPulse/qiw-events.json`:

```json
{
  "incident_id": "QIW-{CHANNEL}-{TIMESTAMP}-{HASH}",
  "timestamp": "2026-01-19T16:42:17.361Z",
  "status": "detected",
  "channel": "lint|test|build|deployment|runtime",
  "severity": "critical|high|medium|low",
  "title": "Brief description",
  "description": "Detailed description with context",
  "detection": {
    "detector": "detector_name",
    "detection_method": "threshold|pattern|anomaly",
    "confidence": 0.9
  },
  "metrics": {
    "metric_name": "value"
  },
  "evidence": {
    "logs": ["log1", "log2"],
    "commits": ["sha1"],
    "pr_numbers": [123]
  },
  "metadata": {
    "created_by": "system",
    "updated_at": "2026-01-19T16:42:17.361Z",
    "tags": []
  }
}
```

---

## Configuration

QIW configuration is in `governance/qiw-config.json`:

### Enabling/Disabling Channels

```json
{
  "qiw_enabled": true,
  "channels": {
    "test": {
      "enabled": true,
      ...
    }
  }
}
```

### Configuring Detectors

```json
{
  "channels": {
    "test": {
      "detectors": [
        {
          "name": "test_pass_rate_drop",
          "type": "threshold",
          "enabled": true,
          "threshold": {
            "metric": "test_pass_rate",
            "operator": "less_than",
            "value": 0.95,
            "severity": "critical"
          }
        }
      ]
    }
  }
}
```

### Blocking Rules

```json
{
  "channels": {
    "test": {
      "blocking_rules": {
        "critical": {
          "block_merge": true,
          "require_immediate_fix": true
        },
        "high": {
          "block_merge_to_main": true,
          "require_remediation_plan": true
        },
        "medium": {
          "block_merge": false,
          "create_tracking_issue": true
        }
      }
    }
  }
}
```

---

## Troubleshooting

### Detector Not Finding Anomalies

1. Check if channel/detector is enabled in `qiw-config.json`
2. Verify threshold values aren't too lenient
3. Review baseline calculations
4. Check data source accessibility
5. Add debug logging

### Too Many False Positives

1. Review detection thresholds (adjust in config)
2. Adjust confidence scoring
3. Refine detection patterns
4. Consider time-based filtering
5. Tune baselines

### Detector Crashes

1. Check error logs
2. Validate input data
3. Handle missing data gracefully
4. Ensure try-catch error handling
5. Return empty array on error (don't block CI)

### Detector Slow

1. Optimize data collection queries
2. Cache baseline data
3. Use parallel processing where possible
4. Limit log parsing depth
5. Consider incremental detection

---

## Examples

### Example 1: Test Pass Rate Drop

**Scenario**: Tests failing after code change

**Detection**:
```
⚠️  Detected: Test pass rate dropped to 92.0%
📝 Writing 1 incident to event log...
✅ Recorded incident: QIW-TEST-1768840937361-ABC12345
```

**Incident**:
```json
{
  "incident_id": "QIW-TEST-1768840937361-ABC12345",
  "channel": "test",
  "severity": "critical",
  "title": "Test pass rate dropped to 92.0%",
  "description": "Test pass rate (92.0%) is below threshold (95%). 92 passed, 8 failed out of 100 total tests.",
  "detection": {
    "detector": "test_pass_rate_drop",
    "detection_method": "threshold",
    "confidence": 1.0
  }
}
```

**Action**: Fix failing tests before merge

---

### Example 2: Lint Bypass Detected

**Scenario**: Developer adds eslint-disable comments

**Detection**:
```
⚠️  Detected: 5 lint bypass directives detected
📝 Writing 1 incident to event log...
✅ Recorded incident: QIW-LINT-1768840937361-XYZ78901
```

**Incident**:
```json
{
  "incident_id": "QIW-LINT-1768840937361-XYZ78901",
  "channel": "lint",
  "severity": "medium",
  "title": "5 lint bypass directives detected",
  "description": "Found 5 files using lint bypass directives. Files: file1.ts, file2.ts, file3.ts, file4.ts, file5.ts"
}
```

**Action**: Review bypasses, fix underlying issues

---

### Example 3: Build Failure

**Scenario**: Dependency conflict breaks build

**Detection**:
```
❌ Detected: Build failure detected
📝 Writing 1 incident to event log...
✅ Recorded incident: QIW-BUILD-1768840937361-DEF45678
🚫 1 blocking incident detected!
   - [HIGH] Build failure detected
```

**Incident**:
```json
{
  "incident_id": "QIW-BUILD-1768840937361-DEF45678",
  "channel": "build",
  "severity": "high",
  "title": "Build failure detected",
  "description": "Build failed with errors: ERESOLVE could not resolve dependency",
  "detection": {
    "detector": "build_failure_detector",
    "detection_method": "threshold",
    "confidence": 1.0
  }
}
```

**Action**: Resolve dependency conflict, rerun build

---

## Reference

- **Canonical Spec**: `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md`
- **Configuration**: `governance/qiw-config.json`
- **Event Log**: `governance/memory/PartPulse/qiw-events.json`
- **Detector README**: `governance/qiw/detectors/README.md`
- **Schemas**: `governance/schemas/qiw-*.json`

---

**Last Updated**: 2026-01-19  
**Version**: 1.0.0  
**Maintained By**: QA Team / Governance Liaison
