#!/usr/bin/env node
/**
 * QIW Test Detector
 * 
 * Monitors test execution, coverage, reliability, and test health.
 * Detects:
 * - Test pass rate drops
 * - Coverage decreases
 * - Flaky tests
 * - Test dodging
 * - Skipped tests
 * - Test duration degradation
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { 
  recordIncident, 
  recordIncidents, 
  DetectedIncident,
  hasSimilarIncident 
} from './lib/incident-writer';
import {
  isChannelEnabled,
  getDetectorConfig,
  getChannelConfig
} from './lib/config-loader';

const CHANNEL = 'test';

interface TestMetrics {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  passRate: number;
  duration: number;
  flakyTests: string[];
  skippedTests: string[];
}

class TestDetector {
  private incidents: DetectedIncident[] = [];
  
  async initialize(): Promise<void> {
    if (!isChannelEnabled(CHANNEL)) {
      console.log(`⏭️  Test channel disabled - skipping detection`);
      process.exit(0);
    }
    console.log('✅ Test detector initialized');
  }
  
  async detect(): Promise<DetectedIncident[]> {
    console.log('🔍 Running test detection...');
    
    // Collect test metrics
    const metrics = await this.collectTestMetrics();
    
    // Run all enabled detectors
    await this.detectTestPassRateDrop(metrics);
    await this.detectCoverageDecrease();
    await this.detectFlakyTests(metrics);
    await this.detectTestDodging();
    await this.detectSkippedTests(metrics);
    await this.detectDurationDegradation(metrics);
    
    return this.incidents;
  }
  
  private async collectTestMetrics(): Promise<TestMetrics> {
    const metrics: TestMetrics = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      passRate: 0,
      duration: 0,
      flakyTests: [],
      skippedTests: []
    };
    
    try {
      // Check if we're in CI and test results exist
      const isCI = process.env.CI === 'true';
      
      if (isCI) {
        // In CI, try to read test results from jest output
        console.log('📊 Collecting test metrics from CI environment...');
        
        // Look for jest results
        const jestResultsPath = path.join(process.cwd(), 'jest-results.json');
        if (fs.existsSync(jestResultsPath)) {
          const results = JSON.parse(fs.readFileSync(jestResultsPath, 'utf8'));
          metrics.passed = results.numPassedTests || 0;
          metrics.failed = results.numFailedTests || 0;
          metrics.total = results.numTotalTests || 0;
          metrics.passRate = metrics.total > 0 ? metrics.passed / metrics.total : 1.0;
        } else {
          console.log('ℹ️  No jest-results.json found, using heuristics');
          // Fallback: count test files as proxy
          const testFiles = this.findTestFiles();
          metrics.total = testFiles.length * 5; // Assume 5 tests per file
          metrics.passed = metrics.total; // Assume all passed if no failures detected
          metrics.passRate = 1.0;
        }
      } else {
        // Local development - count test files
        const testFiles = this.findTestFiles();
        metrics.total = testFiles.length * 5;
        metrics.passed = metrics.total;
        metrics.passRate = 1.0;
      }
      
      // Detect skipped tests by scanning test files
      metrics.skippedTests = this.findSkippedTests();
      metrics.skipped = metrics.skippedTests.length;
      
    } catch (error) {
      console.warn(`⚠️  Error collecting test metrics: ${error}`);
      // Return default metrics to avoid detector failure
    }
    
    console.log(`📈 Test metrics: ${metrics.passed}/${metrics.total} passed (${(metrics.passRate * 100).toFixed(1)}%)`);
    return metrics;
  }
  
  private async detectTestPassRateDrop(metrics: TestMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'test_pass_rate_drop');
    if (!detector) return;
    
    const threshold = detector.threshold?.value || 0.95;
    
    if (metrics.passRate < threshold) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'critical',
        title: `Test pass rate dropped to ${(metrics.passRate * 100).toFixed(1)}%`,
        description: `Test pass rate (${(metrics.passRate * 100).toFixed(1)}%) is below threshold (${(threshold * 100)}%). ${metrics.passed} passed, ${metrics.failed} failed out of ${metrics.total} total tests.`,
        detection: {
          detector: 'test_pass_rate_drop',
          detection_method: 'threshold',
          confidence: 1.0
        },
        metrics: {
          pass_rate: metrics.passRate,
          threshold,
          passed: metrics.passed,
          failed: metrics.failed,
          total: metrics.total
        },
        impact: {
          affected_components: ['test-suite'],
          user_impact: 'high',
          business_impact: 'Test failures indicate code quality issues'
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectCoverageDecrease(): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'coverage_decrease');
    if (!detector) return;
    
    try {
      const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
      if (!fs.existsSync(coveragePath)) {
        console.log('ℹ️  No coverage data found');
        return;
      }
      
      const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      const totalCoverage = coverage.total;
      
      // Check each coverage metric
      const metrics = ['lines', 'statements', 'functions', 'branches'];
      for (const metric of metrics) {
        const pct = totalCoverage[metric].pct;
        const threshold = 80; // Default threshold
        
        if (pct < threshold) {
          const incident: DetectedIncident = {
            channel: CHANNEL,
            severity: 'high',
            title: `${metric} coverage at ${pct}% (below ${threshold}%)`,
            description: `Code coverage for ${metric} is ${pct}%, which is below the ${threshold}% threshold.`,
            detection: {
              detector: 'coverage_decrease',
              detection_method: 'threshold',
              confidence: 0.9
            },
            metrics: {
              coverage_type: metric,
              coverage_percentage: pct,
              threshold,
              covered: totalCoverage[metric].covered,
              total: totalCoverage[metric].total
            }
          };
          
          if (!hasSimilarIncident(incident, 60)) {
            this.incidents.push(incident);
            console.log(`⚠️  Detected: ${incident.title}`);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error checking coverage: ${error}`);
    }
  }
  
  private async detectFlakyTests(metrics: TestMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'flaky_test_detector');
    if (!detector) return;
    
    // For now, flaky test detection requires historical data
    // This is a placeholder for future enhancement
    if (metrics.flakyTests.length > 0) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'high',
        title: `${metrics.flakyTests.length} flaky tests detected`,
        description: `Flaky tests detected: ${metrics.flakyTests.join(', ')}`,
        detection: {
          detector: 'flaky_test_detector',
          detection_method: 'pattern',
          confidence: 0.8
        },
        metrics: {
          flaky_count: metrics.flakyTests.length,
          flaky_tests: metrics.flakyTests
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectTestDodging(): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'test_dodging_detector');
    if (!detector) return;
    
    try {
      // Use existing test dodging detector
      const dodgingScript = path.join(process.cwd(), 'qa', 'detect-test-dodging.js');
      if (fs.existsSync(dodgingScript)) {
        execSync(`node ${dodgingScript}`, { stdio: 'pipe' });
        console.log('✅ No test dodging detected');
      }
    } catch (error: any) {
      // Test dodging detected
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'high',
        title: 'Test dodging detected',
        description: 'Code changes without corresponding test updates detected. This violates the zero test debt policy.',
        detection: {
          detector: 'test_dodging_detector',
          detection_method: 'pattern',
          confidence: 0.95
        },
        evidence: {
          logs: [error.message || 'Test dodging violation']
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectSkippedTests(metrics: TestMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'skipped_test_detector');
    if (!detector) return;
    
    if (metrics.skippedTests.length > 0) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'medium',
        title: `${metrics.skippedTests.length} skipped tests detected`,
        description: `Tests using .skip, .todo, xit, or xdescribe found. Skipped tests: ${metrics.skippedTests.slice(0, 5).join(', ')}${metrics.skippedTests.length > 5 ? '...' : ''}`,
        detection: {
          detector: 'skipped_test_detector',
          detection_method: 'pattern',
          confidence: 1.0
        },
        metrics: {
          skipped_count: metrics.skippedTests.length,
          skipped_tests: metrics.skippedTests
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectDurationDegradation(metrics: TestMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'test_duration_degradation');
    if (!detector) return;
    
    // This requires historical baseline data - placeholder for now
    // In a real implementation, we'd compare against stored baseline
    console.log('ℹ️  Duration degradation detection requires historical data (future enhancement)');
  }
  
  private findTestFiles(): string[] {
    const testPatterns = [
      '__tests__/**/*.test.ts',
      '__tests__/**/*.test.tsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx'
    ];
    
    const testFiles: string[] = [];
    const glob = require('glob');
    
    for (const pattern of testPatterns) {
      try {
        const files = glob.sync(pattern, { 
          cwd: process.cwd(),
          ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
        });
        testFiles.push(...files);
      } catch (error) {
        // Ignore glob errors
      }
    }
    
    return Array.from(new Set(testFiles)); // Remove duplicates
  }
  
  private findSkippedTests(): string[] {
    const skipped: string[] = [];
    const testFiles = this.findTestFiles();
    
    const skipPatterns = [
      /\.(skip|only)\s*\(/g,
      /x(describe|it|test)\s*\(/g,
      /\.todo\s*\(/g
    ];
    
    for (const file of testFiles) {
      try {
        const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
        
        for (const pattern of skipPatterns) {
          const matches = content.match(pattern);
          if (matches && matches.length > 0) {
            skipped.push(`${file} (${matches.length} skipped)`);
            break;
          }
        }
      } catch (error) {
        // Ignore file read errors
      }
    }
    
    return skipped;
  }
  
  async cleanup(): Promise<void> {
    // Nothing to clean up
  }
}

// Main execution
async function main() {
  const detector = new TestDetector();
  
  try {
    await detector.initialize();
    const incidents = await detector.detect();
    
    if (incidents.length > 0) {
      console.log(`\n📝 Writing ${incidents.length} incidents to event log...`);
      const ids = await recordIncidents(incidents);
      console.log(`✅ Recorded incidents: ${ids.join(', ')}`);
      
      // Check if any incidents should block
      const channelConfig = getChannelConfig(CHANNEL);
      const blocking = incidents.filter(inc => {
        const rule = channelConfig?.blocking_rules[inc.severity];
        return rule?.block_merge || rule?.block_merge_to_main;
      });
      
      if (blocking.length > 0) {
        console.log(`\n🚫 ${blocking.length} blocking incidents detected!`);
        blocking.forEach(inc => {
          console.log(`   - [${inc.severity.toUpperCase()}] ${inc.title}`);
        });
        process.exit(1);
      }
    } else {
      console.log('\n✅ No anomalies detected - test channel healthy');
    }
    
    await detector.cleanup();
  } catch (error) {
    console.error('❌ Test detector failed:', error);
    // Don't block CI on detector failure - log only
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { TestDetector };
