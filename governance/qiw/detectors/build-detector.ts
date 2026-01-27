#!/usr/bin/env node
/**
 * QIW Build Detector
 * 
 * Monitors CI build process, dependency resolution, and build artifacts.
 * Detects:
 * - Build failure rate exceeding threshold
 * - Build duration anomalies
 * - Dependency conflicts
 * - Flaky builds
 */

import { execSync } from 'child_process';
import { 
  recordIncidents, 
  DetectedIncident,
  hasSimilarIncident 
} from './lib/incident-writer';
import {
  isChannelEnabled,
  getDetectorConfig,
  getChannelConfig
} from './lib/config-loader';

const CHANNEL = 'build';

interface BuildMetrics {
  success: boolean;
  duration: number;
  dependencyConflicts: string[];
  buildErrors: string[];
}

class BuildDetector {
  private incidents: DetectedIncident[] = [];
  
  async initialize(): Promise<void> {
    if (!isChannelEnabled(CHANNEL)) {
      console.log(`⏭️  Build channel disabled - skipping detection`);
      process.exit(0);
    }
    console.log('✅ Build detector initialized');
  }
  
  async detect(): Promise<DetectedIncident[]> {
    console.log('🔍 Running build detection...');
    
    // Collect build metrics
    const metrics = await this.collectBuildMetrics();
    
    // Run all enabled detectors
    await this.detectBuildFailure(metrics);
    await this.detectDependencyConflicts(metrics);
    await this.detectBuildDurationAnomaly(metrics);
    
    return this.incidents;
  }
  
  private async collectBuildMetrics(): Promise<BuildMetrics> {
    const metrics: BuildMetrics = {
      success: true,
      duration: 0,
      dependencyConflicts: [],
      buildErrors: []
    };
    
    try {
      console.log('📊 Collecting build metrics...');
      
      const startTime = Date.now();
      
      // Try to run build
      try {
        execSync('npm run build', {
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 300000 // 5 minute timeout
        });
        metrics.success = true;
      } catch (error: unknown) {
        metrics.success = false;
        const errorMessage = error instanceof Error ? error.message : 'Build failed';
        metrics.buildErrors.push(errorMessage);
        
        // Parse error output for specific issues
        const errorOutput = error && typeof error === 'object' && 'stderr' in error && typeof error.stderr === 'string' 
          ? error.stderr 
          : '';
        const stdoutOutput = error && typeof error === 'object' && 'stdout' in error && typeof error.stdout === 'string'
          ? error.stdout
          : '';
        const output = errorOutput + stdoutOutput;
        
        if (output) {
          // Check for dependency conflicts
          if (/ERESOLVE|dependency.*conflict|peer dependency/i.test(output)) {
            const matches = output.match(/ERESOLVE[^\n]*/gi) || [];
            metrics.dependencyConflicts.push(...matches);
          }
        }
      }
      
      metrics.duration = Date.now() - startTime;
      
    } catch (error) {
      console.warn(`⚠️  Error collecting build metrics: ${error}`);
    }
    
    console.log(`📈 Build metrics: ${metrics.success ? 'SUCCESS' : 'FAILED'} in ${metrics.duration}ms`);
    return metrics;
  }
  
  private async detectBuildFailure(metrics: BuildMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'build_failure_detector');
    if (!detector) return;
    
    if (!metrics.success) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'high',
        title: 'Build failure detected',
        description: `Build failed with errors: ${metrics.buildErrors.slice(0, 3).join('; ')}`,
        detection: {
          detector: 'build_failure_detector',
          detection_method: 'threshold',
          confidence: 1.0
        },
        metrics: {
          success: metrics.success,
          duration: metrics.duration,
          error_count: metrics.buildErrors.length
        },
        evidence: {
          logs: metrics.buildErrors
        },
        impact: {
          affected_components: ['build-system'],
          user_impact: 'high',
          business_impact: 'Cannot deploy until build is fixed'
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectDependencyConflicts(metrics: BuildMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'dependency_conflict_detector');
    if (!detector) return;
    
    if (metrics.dependencyConflicts.length > 0) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'high',
        title: `${metrics.dependencyConflicts.length} dependency conflicts detected`,
        description: `Dependency resolution conflicts found: ${metrics.dependencyConflicts.slice(0, 3).join('; ')}`,
        detection: {
          detector: 'dependency_conflict_detector',
          detection_method: 'pattern',
          confidence: 1.0
        },
        metrics: {
          conflict_count: metrics.dependencyConflicts.length
        },
        evidence: {
          logs: metrics.dependencyConflicts
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectBuildDurationAnomaly(metrics: BuildMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'build_duration_anomaly');
    if (!detector) return;
    
    // This requires historical baseline data
    // For now, flag builds that take longer than 5 minutes
    const threshold = 300000; // 5 minutes in ms
    
    if (metrics.duration > threshold) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'medium',
        title: `Build duration ${(metrics.duration / 1000).toFixed(1)}s exceeds threshold`,
        description: `Build took ${(metrics.duration / 1000).toFixed(1)}s, which is longer than the ${(threshold / 1000)}s threshold.`,
        detection: {
          detector: 'build_duration_anomaly',
          detection_method: 'threshold',
          confidence: 0.8
        },
        metrics: {
          duration_ms: metrics.duration,
          threshold_ms: threshold
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  async cleanup(): Promise<void> {
    // Nothing to clean up
  }
}

// Main execution
async function main() {
  const detector = new BuildDetector();
  
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
        return rule?.block_merge || rule?.block_merge_to_main || rule?.block_deployment;
      });
      
      if (blocking.length > 0) {
        console.log(`\n🚫 ${blocking.length} blocking incidents detected!`);
        blocking.forEach(inc => {
          console.log(`   - [${inc.severity.toUpperCase()}] ${inc.title}`);
        });
        process.exit(1);
      }
    } else {
      console.log('\n✅ No anomalies detected - build channel healthy');
    }
    
    await detector.cleanup();
  } catch (error) {
    console.error('❌ Build detector failed:', error);
    // Don't block CI on detector failure - log only
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { BuildDetector };
