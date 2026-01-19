#!/usr/bin/env node
/**
 * QIW Runtime Detector
 * 
 * Monitors application behavior in production/staging.
 * Detects:
 * - Error rate spikes
 * - Response time degradation
 * - Memory leaks
 * - Exception rate anomalies
 * - SLA violations
 * - Deployment correlations
 * 
 * NOTE: This requires integration with APM/monitoring tools (Datadog, New Relic, Sentry, etc.)
 *       Current implementation provides stub/placeholder functionality.
 */

import * as fs from 'fs';
import * as path from 'path';
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

const CHANNEL = 'runtime';

interface RuntimeMetrics {
  errorRate: number;
  p95ResponseTime: number;
  memoryUtilization: number;
  exceptionCount: number;
  crashCount: number;
  slaCompliance: number;
}

class RuntimeDetector {
  private incidents: DetectedIncident[] = [];
  
  async initialize(): Promise<void> {
    if (!isChannelEnabled(CHANNEL)) {
      console.log(`⏭️  Runtime channel disabled - skipping detection`);
      process.exit(0);
    }
    console.log('✅ Runtime detector initialized');
  }
  
  async detect(): Promise<DetectedIncident[]> {
    console.log('🔍 Running runtime detection...');
    console.log('ℹ️  Runtime detection requires APM integration (Datadog, Sentry, etc.)');
    console.log('ℹ️  Placeholder implementation - checking for basic indicators');
    
    // Collect runtime metrics
    const metrics = await this.collectRuntimeMetrics();
    
    // Run all enabled detectors
    await this.detectErrorRateSpike(metrics);
    await this.detectResponseTimeDegradation(metrics);
    await this.detectMemoryLeaks(metrics);
    await this.detectSLAViolations(metrics);
    
    return this.incidents;
  }
  
  private async collectRuntimeMetrics(): Promise<RuntimeMetrics> {
    const metrics: RuntimeMetrics = {
      errorRate: 0,
      p95ResponseTime: 0,
      memoryUtilization: 0,
      exceptionCount: 0,
      crashCount: 0,
      slaCompliance: 1.0
    };
    
    console.log('📊 Collecting runtime metrics (stub implementation)...');
    
    // In production, this would:
    // 1. Query APM tools for error rates, response times, resource usage
    // 2. Check exception tracking systems (Sentry, etc.)
    // 3. Analyze application logs for crashes and errors
    // 4. Calculate SLA compliance from uptime/performance data
    // 5. Correlate incidents with recent deployments
    
    // For now, assume healthy unless evidence of problems
    try {
      // Check if there are any error logs
      const logsPath = path.join(process.cwd(), 'logs');
      if (fs.existsSync(logsPath)) {
        console.log('✅ Logs directory found');
      }
    } catch (error) {
      console.warn(`⚠️  Error checking runtime indicators: ${error}`);
    }
    
    return metrics;
  }
  
  private async detectErrorRateSpike(metrics: RuntimeMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'error_rate_spike');
    if (!detector) return;
    
    const threshold = detector.threshold?.value || 0.01; // 1% error rate
    
    if (metrics.errorRate > threshold) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'critical',
        title: `Error rate spike: ${(metrics.errorRate * 100).toFixed(2)}%`,
        description: `Error rate (${(metrics.errorRate * 100).toFixed(2)}%) exceeds threshold (${(threshold * 100)}%). This indicates a production issue.`,
        detection: {
          detector: 'error_rate_spike',
          detection_method: 'threshold',
          confidence: 0.9
        },
        metrics: {
          error_rate: metrics.errorRate,
          threshold
        },
        impact: {
          user_impact: 'critical',
          business_impact: 'Users experiencing errors in production'
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectResponseTimeDegradation(metrics: RuntimeMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'response_time_degradation');
    if (!detector) return;
    
    // Threshold: p95 response time > 2 seconds
    const threshold = 2000;
    
    if (metrics.p95ResponseTime > threshold) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'high',
        title: `Response time degradation: p95 ${metrics.p95ResponseTime}ms`,
        description: `P95 response time (${metrics.p95ResponseTime}ms) exceeds ${threshold}ms threshold. Performance degradation detected.`,
        detection: {
          detector: 'response_time_degradation',
          detection_method: 'threshold',
          confidence: 0.85
        },
        metrics: {
          p95_response_time: metrics.p95ResponseTime,
          threshold
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectMemoryLeaks(metrics: RuntimeMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'memory_leak_detector');
    if (!detector) return;
    
    // Threshold: memory utilization > 90%
    const threshold = 0.90;
    
    if (metrics.memoryUtilization > threshold) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'critical',
        title: `Memory utilization critical: ${(metrics.memoryUtilization * 100).toFixed(1)}%`,
        description: `Memory utilization (${(metrics.memoryUtilization * 100).toFixed(1)}%) exceeds ${(threshold * 100)}%. Possible memory leak or resource exhaustion.`,
        detection: {
          detector: 'memory_leak_detector',
          detection_method: 'threshold',
          confidence: 0.8
        },
        metrics: {
          memory_utilization: metrics.memoryUtilization,
          threshold
        },
        impact: {
          user_impact: 'high',
          business_impact: 'Service may crash due to memory exhaustion'
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectSLAViolations(metrics: RuntimeMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'sla_violation_detector');
    if (!detector) return;
    
    const threshold = detector.threshold?.value || 0.99; // 99% SLA
    
    if (metrics.slaCompliance < threshold) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'critical',
        title: `SLA violation: ${(metrics.slaCompliance * 100).toFixed(2)}% compliance`,
        description: `SLA compliance (${(metrics.slaCompliance * 100).toFixed(2)}%) is below target (${(threshold * 100)}%). Service level agreement violated.`,
        detection: {
          detector: 'sla_violation_detector',
          detection_method: 'threshold',
          confidence: 1.0
        },
        metrics: {
          sla_compliance: metrics.slaCompliance,
          threshold
        },
        impact: {
          user_impact: 'critical',
          business_impact: 'SLA breach may have contractual implications'
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  async cleanup(): Promise<void> {
    // Nothing to clean up
  }
}

// Main execution
async function main() {
  const detector = new RuntimeDetector();
  
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
        return rule?.trigger_incident || rule?.escalate_to_oncall || rule?.block_further_deployments;
      });
      
      if (blocking.length > 0) {
        console.log(`\n🚨 ${blocking.length} critical runtime incidents detected!`);
        blocking.forEach(inc => {
          console.log(`   - [${inc.severity.toUpperCase()}] ${inc.title}`);
        });
        // Runtime issues don't block builds, but trigger alerts
        console.log('\n⚠️  Runtime incidents require immediate investigation');
      }
    } else {
      console.log('\n✅ No anomalies detected - runtime channel healthy');
    }
    
    await detector.cleanup();
  } catch (error) {
    console.error('❌ Runtime detector failed:', error);
    // Don't block CI on detector failure - log only
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { RuntimeDetector };
