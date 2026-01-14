# QIW Anomaly Detection Patterns

**Document ID**: QIW-PATTERNS-001  
**Version**: 1.0.0  
**Date**: 2026-01-14  
**Authority**: PartPulse QA Team + Governance Liaison

---

## Purpose

This document defines the **specific anomaly detection patterns** for each of the 5 QIW observation channels. Each pattern includes detection logic, severity classification, and examples.

---

## Channel 1: Build

### Pattern B1: Build Failure Rate Exceeds Threshold

**What to Detect**: Build failure rate in main branch exceeds 5% over 7-day window

**Detection Logic**:
```javascript
const failureRate = (failedBuilds / totalBuilds) * 100;
if (failureRate > 5.0 && branch === 'main') {
  reportIncident('high', 'Build failure rate exceeds 5% threshold');
}
```

**Severity**: High  
**Impact**: Indicates systemic build issues affecting team productivity  
**Remediation**: Investigate common failure patterns, fix root cause

---

### Pattern B2: Build Duration Increase

**What to Detect**: Build duration increases by >50% compared to 30-day baseline

**Detection Logic**:
```javascript
const baseline = calculateAverage(last30DaysBuildTimes);
const current = currentBuildTime;
const increase = ((current - baseline) / baseline) * 100;
if (increase > 50) {
  reportIncident('medium', `Build duration increased by ${increase}%`);
}
```

**Severity**: Medium  
**Impact**: Slower feedback loops, reduced developer productivity  
**Remediation**: Profile build process, optimize slow steps, check dependency bloat

---

### Pattern B3: Dependency Conflict

**What to Detect**: Dependency resolution failures, peer dependency issues, version conflicts

**Detection Logic**:
```javascript
const buildLog = getBuildLog();
const patterns = [
  /dependency.*conflict/i,
  /ERESOLVE/,
  /peer dependency/i,
  /Could not resolve/
];
if (patterns.some(p => p.test(buildLog))) {
  reportIncident('high', 'Dependency conflict detected');
}
```

**Severity**: High  
**Impact**: Blocks builds, prevents development progress  
**Remediation**: Resolve dependency versions, update package.json, check lock file

---

### Pattern B4: Flaky Build

**What to Detect**: Build fails intermittently on same code without changes

**Detection Logic**:
```javascript
const lastNBuilds = getLastBuilds(commitSha, 3);
const hasMixedResults = lastNBuilds.some(b => b.passed) && lastNBuilds.some(b => b.failed);
if (hasMixedResults) {
  reportIncident('medium', 'Flaky build detected - same code, different results');
}
```

**Severity**: Medium  
**Impact**: Unreliable CI/CD, false failures causing confusion  
**Remediation**: Investigate non-deterministic build steps, fix race conditions

---

## Channel 2: Lint

### Pattern L1: Lint Violation Increase Without Plan

**What to Detect**: Total lint violations increase without approved remediation plan

**Detection Logic**:
```javascript
const current = getCurrentViolationCount();
const baseline = getBaselineViolationCount(branch);
if (current > baseline && !hasApprovedRemediationPlan()) {
  reportIncident('medium', `Lint violations increased by ${current - baseline}`);
}
```

**Severity**: Medium  
**Impact**: Technical debt accumulation, code quality degradation  
**Remediation**: Fix new violations or create remediation plan with timeline

---

### Pattern L2: Critical Violation in Main

**What to Detect**: Error-level or critical lint violations merged to main branch

**Detection Logic**:
```javascript
const violations = getLintResults();
const criticalInMain = violations.filter(v => 
  v.severity === 'error' && 
  getCurrentBranch() === 'main'
);
if (criticalInMain.length > 0) {
  reportIncident('critical', `${criticalInMain.length} critical lint violations in main`);
}
```

**Severity**: Critical  
**Impact**: Code quality violation in production branch  
**Remediation**: Immediately fix violations or revert commit

---

### Pattern L3: Lint Bypass

**What to Detect**: Use of eslint-disable, @ts-ignore, or similar bypass mechanisms

**Detection Logic**:
```javascript
const changes = getFileChanges();
const bypassPatterns = [
  /eslint-disable/,
  /@ts-ignore/,
  /@ts-nocheck/,
  /prettier-ignore/
];
const bypasses = changes.filter(line => 
  bypassPatterns.some(p => p.test(line))
);
if (bypasses.length > 5) {
  reportIncident('medium', `${bypasses.length} lint bypasses added`);
}
```

**Severity**: Medium  
**Impact**: Circumventing quality checks, hiding potential issues  
**Remediation**: Remove bypasses and fix underlying issues properly

---

### Pattern L4: Code Complexity Threshold Exceeded

**What to Detect**: Cyclomatic complexity exceeds 15 for any function

**Detection Logic**:
```javascript
const complexityResults = getComplexityMetrics();
const highComplexity = complexityResults.filter(f => f.complexity > 15);
if (highComplexity.length > 0) {
  reportIncident('high', `${highComplexity.length} functions exceed complexity threshold`);
}
```

**Severity**: High  
**Impact**: Difficult to maintain and test, higher defect probability  
**Remediation**: Refactor complex functions into smaller, simpler units

---

## Channel 3: Test

### Pattern T1: Test Pass Rate Drop

**What to Detect**: Test pass rate drops below 95%

**Detection Logic**:
```javascript
const results = getTestResults();
const passRate = (results.passed / results.total) * 100;
if (passRate < 95.0) {
  reportIncident('critical', `Test pass rate at ${passRate}% (below 95% threshold)`);
}
```

**Severity**: Critical  
**Impact**: Failing tests indicate bugs or broken functionality  
**Remediation**: Fix failing tests immediately, investigate root cause

---

### Pattern T2: Coverage Decrease Without Approval

**What to Detect**: Test coverage percentage decreases without governance approval

**Detection Logic**:
```javascript
const currentCoverage = getCurrentCoverage();
const baselineCoverage = getBaselineCoverage(baseBranch);
if (currentCoverage < baselineCoverage && !hasApprovedCoverageException()) {
  reportIncident('high', `Coverage decreased from ${baselineCoverage}% to ${currentCoverage}%`);
}
```

**Severity**: High  
**Impact**: Reduced test coverage increases defect risk  
**Remediation**: Add tests to restore coverage or get approval for exception

---

### Pattern T3: Flaky Test Detection

**What to Detect**: Tests with >2% failure rate on stable code

**Detection Logic**:
```javascript
const testHistory = getTestHistory(testName, 50); // last 50 runs
const flakeRate = (testHistory.failures / testHistory.total) * 100;
if (flakeRate > 2.0 && flakeRate < 98.0) { // Not always failing
  reportIncident('high', `Flaky test ${testName} fails ${flakeRate}% of time`);
}
```

**Severity**: High  
**Impact**: Unreliable tests reduce confidence in CI/CD  
**Remediation**: Fix race conditions, timing issues, or environmental dependencies

---

### Pattern T4: Test Dodging

**What to Detect**: Code changes without corresponding test updates

**Detection Logic**:
```javascript
const changedFiles = getChangedFiles();
const codeFiles = changedFiles.filter(f => 
  !f.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/) &&
  !f.match(/\.(md|json|yaml|yml)$/)
);
const testFiles = changedFiles.filter(f => 
  f.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)
);
if (codeFiles.length > 0 && testFiles.length === 0) {
  reportIncident('high', 'Code changed without test updates (test dodging)');
}
```

**Severity**: High  
**Impact**: New code not covered by tests, technical debt accumulation  
**Remediation**: Add tests for changed functionality

---

### Pattern T5: Skipped Tests

**What to Detect**: Tests marked as .skip, .todo, or disabled

**Detection Logic**:
```javascript
const testFiles = getTestFiles();
const skippedPatterns = [
  /\.skip\(/,
  /\.todo\(/,
  /xit\(/,
  /xdescribe\(/
];
const skipped = testFiles.flatMap(file => 
  findMatches(file, skippedPatterns)
);
if (skipped.length > 0) {
  reportIncident('medium', `${skipped.length} tests are skipped/disabled`);
}
```

**Severity**: Medium  
**Impact**: Incomplete test coverage, tests not providing value  
**Remediation**: Fix and enable tests or document in test debt register

---

### Pattern T6: Test Duration Degradation

**What to Detect**: Test execution time increases by >25%

**Detection Logic**:
```javascript
const baseline = calculateAverage(last30DaysTestTimes);
const current = currentTestDuration;
const increase = ((current - baseline) / baseline) * 100;
if (increase > 25) {
  reportIncident('medium', `Test duration increased by ${increase}%`);
}
```

**Severity**: Medium  
**Impact**: Slower feedback loops in CI/CD  
**Remediation**: Optimize slow tests, parallelize execution, review test setup/teardown

---

## Channel 4: Deployment

### Pattern D1: Deployment Failure Rate Exceeds 10%

**What to Detect**: Deployment failure rate over 7 days exceeds 10%

**Detection Logic**:
```javascript
const deployments = getDeployments(7); // last 7 days
const failureRate = (deployments.failed / deployments.total) * 100;
if (failureRate > 10.0) {
  reportIncident('high', `Deployment failure rate at ${failureRate}% (exceeds 10%)`);
}
```

**Severity**: High  
**Impact**: Unreliable deployment process, delays releases  
**Remediation**: Investigate common deployment failures, improve deployment scripts

---

### Pattern D2: Repeated Rollback

**What to Detect**: Multiple rollbacks to the same version

**Detection Logic**:
```javascript
const recentDeployments = getDeployments(14);
const rollbacks = recentDeployments.filter(d => d.type === 'rollback');
const targetVersions = rollbacks.map(r => r.targetVersion);
const duplicates = findDuplicates(targetVersions);
if (duplicates.length > 0) {
  reportIncident('critical', `Repeated rollbacks to version ${duplicates[0]}`);
}
```

**Severity**: Critical  
**Impact**: Indicates serious issues with deployments, instability  
**Remediation**: Investigate why deployments are failing, improve testing

---

### Pattern D3: Environment Drift

**What to Detect**: Configuration differences between environments

**Detection Logic**:
```javascript
const prodConfig = getEnvironmentConfig('production');
const stagingConfig = getEnvironmentConfig('staging');
const diffs = compareConfigs(prodConfig, stagingConfig, expectedDifferences);
if (diffs.length > 0) {
  reportIncident('high', `Environment drift detected: ${diffs.length} unexpected differences`);
}
```

**Severity**: High  
**Impact**: Staging not representative of production, bugs escape testing  
**Remediation**: Sync environment configurations, use infrastructure as code

---

### Pattern D4: Deployment Duration Anomaly

**What to Detect**: Deployment takes significantly longer than baseline

**Detection Logic**:
```javascript
const baseline = calculateAverage(last30DaysDeploymentTimes);
const current = currentDeploymentTime;
const deviation = ((current - baseline) / baseline) * 100;
if (deviation > 50) {
  reportIncident('medium', `Deployment duration ${deviation}% above baseline`);
}
```

**Severity**: Medium  
**Impact**: Longer deployment windows, delayed releases  
**Remediation**: Investigate slow deployment steps, optimize processes

---

### Pattern D5: Post-Deployment Health Check Failure

**What to Detect**: Health checks fail after deployment

**Detection Logic**:
```javascript
const deployment = getLatestDeployment();
const healthChecks = runHealthChecks(deployment.environment);
if (!healthChecks.allPassed) {
  reportIncident('critical', `Health checks failed post-deployment: ${healthChecks.failures.join(', ')}`);
}
```

**Severity**: Critical  
**Impact**: Application not healthy after deployment, potential outage  
**Remediation**: Rollback if critical, investigate health check failures

---

## Channel 5: Runtime

### Pattern R1: Error Rate Spike

**What to Detect**: Error rate (4xx/5xx) exceeds baseline by >20%

**Detection Logic**:
```javascript
const baseline = calculateAverage(last7DaysErrorRate);
const current = getCurrentErrorRate();
const increase = ((current - baseline) / baseline) * 100;
if (increase > 20) {
  reportIncident('critical', `Error rate spike: ${increase}% above baseline`);
}
```

**Severity**: Critical  
**Impact**: User-facing errors, degraded experience  
**Remediation**: Investigate error logs, identify root cause, consider rollback

---

### Pattern R2: Response Time Degradation

**What to Detect**: P95 response time degrades by >30%

**Detection Logic**:
```javascript
const baseline = calculateAverage(last7DaysP95ResponseTime);
const current = getCurrentP95ResponseTime();
const degradation = ((current - baseline) / baseline) * 100;
if (degradation > 30) {
  reportIncident('high', `P95 response time degraded ${degradation}% from baseline`);
}
```

**Severity**: High  
**Impact**: Slow application performance, poor user experience  
**Remediation**: Profile slow endpoints, optimize queries, check resource utilization

---

### Pattern R3: Memory Leak

**What to Detect**: Continuously increasing memory usage without bound

**Detection Logic**:
```javascript
const memoryHistory = getMemoryUsageHistory(6); // last 6 hours
const trend = calculateTrend(memoryHistory);
if (trend.slope > 0 && trend.rsquared > 0.9) { // Strong upward trend
  reportIncident('critical', 'Memory leak detected: continuous memory growth');
}
```

**Severity**: Critical  
**Impact**: Application will eventually crash from out-of-memory  
**Remediation**: Identify leak source with profiler, fix resource cleanup

---

### Pattern R4: Exception Rate Anomaly

**What to Detect**: Exception count exceeds baseline by >50%

**Detection Logic**:
```javascript
const baseline = calculateAverage(last24HoursExceptions);
const current = getCurrentHourExceptions();
const increase = ((current - baseline) / baseline) * 100;
if (increase > 50) {
  reportIncident('high', `Exception rate spike: ${increase}% above baseline`);
}
```

**Severity**: High  
**Impact**: Application errors, potential bugs affecting users  
**Remediation**: Review exception logs, identify patterns, fix bugs

---

### Pattern R5: SLA Violation

**What to Detect**: SLA compliance drops below 99%

**Detection Logic**:
```javascript
const slaCompliance = calculateSLACompliance(24); // last 24 hours
if (slaCompliance < 0.99) {
  reportIncident('critical', `SLA violation: ${slaCompliance * 100}% compliance (below 99%)`);
}
```

**Severity**: Critical  
**Impact**: Contractual SLA breach, business impact  
**Remediation**: Incident response, identify root cause, implement fix

---

### Pattern R6: Deployment Correlation

**What to Detect**: Runtime incidents correlating with recent deployments

**Detection Logic**:
```javascript
const incidents = getRecentIncidents(1); // last hour
const deployments = getRecentDeployments(2); // last 2 hours
if (incidents.length > 0 && deployments.length > 0) {
  const timeDiff = incidents[0].timestamp - deployments[0].timestamp;
  if (timeDiff < 3600000) { // within 1 hour
    reportIncident('high', 'Runtime incidents correlate with recent deployment');
  }
}
```

**Severity**: High  
**Impact**: Deployment likely caused the issue  
**Remediation**: Consider rollback, investigate deployment changes

---

## Detection Implementation

Each pattern should be implemented as a detector function:

```typescript
interface Detector {
  channel: 'build' | 'lint' | 'test' | 'deployment' | 'runtime';
  pattern: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detect(): Promise<DetectionResult>;
}

interface DetectionResult {
  detected: boolean;
  title?: string;
  description?: string;
  metrics?: Record<string, any>;
  evidence?: string[];
}
```

See `governance/qiw/detectors/README.md` for implementation details.

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Active
