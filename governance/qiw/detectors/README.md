# QIW Detector Implementation Guide

**Document ID**: QIW-DETECTORS-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse QA Team

---

## Purpose

This directory contains the implementation scaffold for QIW detectors. Each detector monitors one of the 5 observation channels and creates incidents when anomalies are detected.

**Status**: 📋 Scaffold Complete | ⏳ Implementation Pending

---

## Detector Architecture

Each detector is a TypeScript module that:
1. Collects metrics from its channel
2. Compares metrics against thresholds/baselines
3. Detects anomalies based on configured patterns
4. Creates incident records when anomalies found
5. Updates `qiw-events.json` with incident data

---

## Detector Interface

All detectors implement this interface:

```typescript
interface QIWDetector {
  channel: 'build' | 'lint' | 'test' | 'deployment' | 'runtime';
  name: string;
  version: string;
  
  /**
   * Initialize detector (load config, connect to data sources, etc.)
   */
  initialize(): Promise<void>;
  
  /**
   * Run detection logic
   * @returns Array of detected incidents (empty if none)
   */
  detect(): Promise<DetectedIncident[]>;
  
  /**
   * Cleanup resources
   */
  cleanup(): Promise<void>;
}

interface DetectedIncident {
  channel: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  detection: {
    detector: string;
    detection_method: 'threshold' | 'pattern' | 'anomaly' | 'manual';
    confidence: number; // 0.0 - 1.0
  };
  metrics?: Record<string, any>;
  evidence?: {
    logs?: string[];
    commits?: string[];
    pr_numbers?: number[];
    ci_run_urls?: string[];
  };
  impact?: {
    affected_components?: string[];
    affected_branches?: string[];
    user_impact?: 'none' | 'low' | 'medium' | 'high' | 'critical';
    business_impact?: string;
  };
}
```

---

## Implementation Steps

### Step 1: Implement Detector Logic

Each detector file (`*-detector.ts`) needs:

1. **Data Collection**
   ```typescript
   async function collectMetrics(): Promise<ChannelMetrics> {
     // Collect relevant metrics from logs, CI, monitoring, etc.
   }
   ```

2. **Baseline/Threshold Loading**
   ```typescript
   async function loadBaseline(): Promise<Baseline> {
     // Load baseline from config or calculate from history
   }
   ```

3. **Anomaly Detection**
   ```typescript
   async function detectAnomalies(
     metrics: ChannelMetrics, 
     baseline: Baseline
   ): Promise<DetectedIncident[]> {
     // Compare metrics to baseline/threshold
     // Return incidents for anomalies found
   }
   ```

4. **Incident Creation**
   ```typescript
   function createIncident(
     anomaly: Anomaly
   ): DetectedIncident {
     return {
       channel: 'test',
       severity: determineSeverity(anomaly),
       title: formatTitle(anomaly),
       description: formatDescription(anomaly),
       // ... other fields
     };
   }
   ```

---

### Step 2: Integrate with Event Log

Detectors write incidents to `qiw-events.json`:

```typescript
import * as fs from 'fs';
import * as path from 'path';

async function recordIncident(incident: DetectedIncident): Promise<string> {
  const eventsPath = path.join(__dirname, '../../../memory/PartPulse/qiw-events.json');
  const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
  
  const fullIncident = {
    incident_id: generateIncidentId(incident.channel),
    timestamp: new Date().toISOString(),
    status: 'detected',
    ...incident,
    metadata: {
      created_by: 'system',
      updated_at: new Date().toISOString(),
      tags: []
    }
  };
  
  events.events.push(fullIncident);
  events.event_count = events.events.length;
  events.last_updated = new Date().toISOString();
  
  fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
  
  return fullIncident.incident_id;
}

function generateIncidentId(channel: string): string {
  const timestamp = Date.now();
  const hash = require('crypto')
    .createHash('sha256')
    .update(`${channel}-${timestamp}-${Math.random()}`)
    .digest('hex')
    .substring(0, 8)
    .toUpperCase();
  return `QIW-${channel.toUpperCase()}-${timestamp}-${hash}`;
}
```

---

### Step 3: Configure Detector

Load configuration from `qiw-config.json`:

```typescript
import config from '../../../qiw-config.json';

function getDetectorConfig(channel: string, detectorName: string) {
  const channelConfig = config.channels[channel];
  const detectorConfig = channelConfig.detectors.find(
    d => d.name === detectorName
  );
  
  if (!detectorConfig || !detectorConfig.enabled) {
    return null;
  }
  
  return detectorConfig;
}
```

---

### Step 4: Add CI/CD Integration

Create npm scripts in `package.json`:

```json
{
  "scripts": {
    "qiw:detect:build": "ts-node governance/qiw/detectors/build-detector.ts",
    "qiw:detect:lint": "ts-node governance/qiw/detectors/lint-detector.ts",
    "qiw:detect:test": "ts-node governance/qiw/detectors/test-detector.ts",
    "qiw:detect:deployment": "ts-node governance/qiw/detectors/deployment-detector.ts",
    "qiw:detect:runtime": "ts-node governance/qiw/detectors/runtime-detector.ts",
    "qiw:detect:all": "npm run qiw:detect:build && npm run qiw:detect:lint && npm run qiw:detect:test && npm run qiw:detect:deployment && npm run qiw:detect:runtime"
  }
}
```

Add to GitHub Actions workflow:

```yaml
- name: Run QIW Detectors
  run: npm run qiw:detect:all
```

---

## Detector Implementation Status

| Detector | Status | Priority | Assignee |
|----------|--------|----------|----------|
| build-detector.ts | 📋 Stub | High | TBD |
| lint-detector.ts | 📋 Stub | High | TBD |
| test-detector.ts | 📋 Stub | High | TBD |
| deployment-detector.ts | 📋 Stub | Medium | TBD |
| runtime-detector.ts | 📋 Stub | Medium | TBD |

---

## Detector Details

### build-detector.ts

**Monitors**: CI build process, dependency resolution, build artifacts

**Data Sources**:
- GitHub Actions build logs
- `npm install` output
- Build timing data
- Artifact validation

**Detections**:
- Build failure rate exceeds threshold
- Build duration anomalies
- Dependency conflicts
- Flaky builds

**Implementation Notes**:
- Parse GitHub Actions API for build data
- Calculate rolling averages for baselines
- Store build metrics in separate file for trend analysis

---

### lint-detector.ts

**Monitors**: ESLint output, code complexity metrics, style violations

**Data Sources**:
- ESLint JSON output
- Code complexity tools (eslint-plugin-complexity)
- Git diff for bypass detection

**Detections**:
- Lint violation count increase
- Critical violations on main branch
- Lint bypass patterns
- Code complexity threshold exceeded

**Implementation Notes**:
- Run eslint programmatically
- Compare violation counts to baseline
- Track violations per file for trends

---

### test-detector.ts

**Monitors**: Test execution, coverage, reliability

**Data Sources**:
- Jest/test runner output
- Coverage reports
- Test execution logs
- Git file changes

**Detections**:
- Test pass rate drop
- Coverage decrease
- Flaky test patterns
- Test dodging
- Skipped tests
- Test duration degradation

**Implementation Notes**:
- Parse test JSON output
- Track test history (last N runs per test)
- Calculate flakiness rate
- Detect code changes without test changes

---

### deployment-detector.ts

**Monitors**: Deployment process, environment configuration, health checks

**Data Sources**:
- Deployment logs
- Environment configuration files
- Health check endpoints
- Rollback history

**Detections**:
- Deployment failure rate
- Repeated rollbacks
- Environment drift
- Deployment duration anomalies
- Health check failures

**Implementation Notes**:
- Query deployment system API (Vercel, etc.)
- Compare environment configs
- Run health checks post-deployment
- Track deployment metrics

---

### runtime-detector.ts

**Monitors**: Application behavior in production/staging

**Data Sources**:
- Application logs
- APM tools (Datadog, New Relic, etc.)
- Metrics endpoints
- Error tracking (Sentry, etc.)

**Detections**:
- Error rate spikes
- Response time degradation
- Memory leaks
- Exception rate anomalies
- SLA violations
- Deployment correlation

**Implementation Notes**:
- Query monitoring tool APIs
- Calculate rolling baselines
- Correlate incidents with deployments
- Track resource utilization trends

---

## Testing Detectors

### Unit Tests

Test each detector function in isolation:

```typescript
// test-detector.test.ts
import { detectTestPassRateDrop } from './test-detector';

describe('Test Detector', () => {
  it('detects pass rate drop below threshold', () => {
    const metrics = { passed: 92, total: 100 };
    const baseline = { passRate: 0.95 };
    
    const incidents = detectTestPassRateDrop(metrics, baseline);
    
    expect(incidents).toHaveLength(1);
    expect(incidents[0].severity).toBe('critical');
    expect(incidents[0].title).toContain('92%');
  });
  
  it('does not detect when pass rate acceptable', () => {
    const metrics = { passed: 96, total: 100 };
    const baseline = { passRate: 0.95 };
    
    const incidents = detectTestPassRateDrop(metrics, baseline);
    
    expect(incidents).toHaveLength(0);
  });
});
```

### Integration Tests

Test full detector execution:

```typescript
// integration.test.ts
import { TestDetector } from './test-detector';

describe('Test Detector Integration', () => {
  it('creates incident in qiw-events.json', async () => {
    const detector = new TestDetector();
    await detector.initialize();
    
    const incidents = await detector.detect();
    
    // Verify incident was written to events file
    const events = JSON.parse(
      fs.readFileSync('governance/memory/PartPulse/qiw-events.json', 'utf8')
    );
    
    expect(events.events).toContainEqual(
      expect.objectContaining({
        channel: 'test',
        severity: expect.any(String)
      })
    );
  });
});
```

### Manual Testing

```bash
# Run detector manually
npm run qiw:detect:test

# Check events file
cat governance/memory/PartPulse/qiw-events.json | jq '.events[-1]'

# Verify incident created
```

---

## Best Practices

1. **✅ Idempotent**: Running detector multiple times doesn't create duplicate incidents
2. **✅ Fast**: Detectors should complete in <30 seconds
3. **✅ Reliable**: Handle errors gracefully, don't crash CI
4. **✅ Accurate**: Low false positive rate (<2%)
5. **✅ Actionable**: Incident descriptions guide remediation
6. **✅ Documented**: Comments explain detection logic
7. **❌ Don't Block**: Detector failures shouldn't block CI (log error instead)
8. **❌ Don't Overwhelm**: Batch related anomalies into single incident

---

## Troubleshooting

### Detector Not Finding Anomalies

1. Check if detector is enabled in `qiw-config.json`
2. Verify data sources are accessible
3. Review threshold values (too lenient?)
4. Check baseline calculations
5. Add debug logging

### Too Many False Positives

1. Review detection thresholds
2. Adjust confidence scoring
3. Refine detection patterns
4. Consider time-based filtering
5. Tune baselines

### Detector Crashes

1. Add try-catch error handling
2. Validate input data
3. Handle missing data gracefully
4. Log errors for debugging
5. Return empty array on error (don't block CI)

---

## Next Steps

1. **Implement build-detector.ts** (Priority: High)
   - Start with build failure rate detection
   - Add duration anomaly detection
   - Test with historical data

2. **Implement lint-detector.ts** (Priority: High)
   - Integrate with existing ESLint
   - Track violation trends
   - Detect bypasses

3. **Implement test-detector.ts** (Priority: High)
   - Most critical for quality
   - Leverage existing test infrastructure
   - Comprehensive detection patterns

4. **Implement deployment-detector.ts** (Priority: Medium)
   - Integrate with Vercel/deployment platform
   - Environment drift detection
   - Health check monitoring

5. **Implement runtime-detector.ts** (Priority: Medium)
   - Integrate with monitoring tools
   - Real-time anomaly detection
   - Alerting configuration

---

## Resources

- **Configuration**: `governance/qiw-config.json`
- **Event Log**: `governance/memory/PartPulse/qiw-events.json`
- **Detection Patterns**: `governance/qiw/ANOMALY_DETECTION_PATTERNS.md`
- **Canonical Spec**: `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md`

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Scaffold Complete, Implementation Pending
