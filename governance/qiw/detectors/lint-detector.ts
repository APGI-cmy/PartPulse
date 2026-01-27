#!/usr/bin/env node
/**
 * QIW Lint Detector
 * 
 * Monitors code style, static analysis, and linting violations.
 * Detects:
 * - Lint violation increases
 * - Critical violations
 * - Lint bypasses
 * - Code complexity threshold exceedances
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';
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

const CHANNEL = 'lint';

interface LintMetrics {
  errorCount: number;
  warningCount: number;
  totalViolations: number;
  fileCount: number;
  bypassCount: number;
  bypassFiles: string[];
}

class LintDetector {
  private incidents: DetectedIncident[] = [];
  
  async initialize(): Promise<void> {
    if (!isChannelEnabled(CHANNEL)) {
      console.log(`⏭️  Lint channel disabled - skipping detection`);
      process.exit(0);
    }
    console.log('✅ Lint detector initialized');
  }
  
  async detect(): Promise<DetectedIncident[]> {
    console.log('🔍 Running lint detection...');
    
    // Collect lint metrics
    const metrics = await this.collectLintMetrics();
    
    // Run all enabled detectors
    await this.detectViolationIncrease(metrics);
    await this.detectCriticalViolations(metrics);
    await this.detectLintBypasses(metrics);
    await this.detectComplexityThreshold();
    
    return this.incidents;
  }
  
  private async collectLintMetrics(): Promise<LintMetrics> {
    const metrics: LintMetrics = {
      errorCount: 0,
      warningCount: 0,
      totalViolations: 0,
      fileCount: 0,
      bypassCount: 0,
      bypassFiles: []
    };
    
    try {
      console.log('📊 Collecting lint metrics...');
      
      // Run ESLint with JSON output
      const result = execSync(
        'npx eslint . --format=json --max-warnings=999999',
        { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe']
        }
      );
      
      const lintResults = JSON.parse(result);
      
      for (const file of lintResults) {
        if (file.messages.length > 0) {
          metrics.fileCount++;
          
          for (const message of file.messages) {
            if (message.severity === 2) {
              metrics.errorCount++;
            } else if (message.severity === 1) {
              metrics.warningCount++;
            }
          }
        }
      }
      
      metrics.totalViolations = metrics.errorCount + metrics.warningCount;
      
    } catch (error: unknown) {
      // ESLint returns non-zero exit code when violations found
      const errorOutput = error && typeof error === 'object' && 'stdout' in error && typeof error.stdout === 'string'
        ? error.stdout
        : '';
      
      if (errorOutput) {
        try {
          const lintResults = JSON.parse(error.stdout);
          
          for (const file of lintResults) {
            if (file.messages.length > 0) {
              metrics.fileCount++;
              
              for (const message of file.messages) {
                if (message.severity === 2) {
                  metrics.errorCount++;
                } else if (message.severity === 1) {
                  metrics.warningCount++;
                }
              }
            }
          }
          
          metrics.totalViolations = metrics.errorCount + metrics.warningCount;
        } catch (parseError) {
          console.warn(`⚠️  Error parsing lint output: ${parseError}`);
        }
      }
    }
    
    // Detect bypasses
    const bypasses = this.findLintBypasses();
    metrics.bypassCount = bypasses.length;
    metrics.bypassFiles = bypasses;
    
    console.log(`📈 Lint metrics: ${metrics.errorCount} errors, ${metrics.warningCount} warnings in ${metrics.fileCount} files`);
    return metrics;
  }
  
  private async detectViolationIncrease(metrics: LintMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'lint_violation_increase');
    if (!detector) return;
    
    // For now, we'll flag if there are any errors
    // In production, this would compare against baseline
    if (metrics.errorCount > 0) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'medium',
        title: `${metrics.errorCount} lint errors detected`,
        description: `Found ${metrics.errorCount} lint errors and ${metrics.warningCount} warnings across ${metrics.fileCount} files. This may indicate code quality degradation.`,
        detection: {
          detector: 'lint_violation_increase',
          detection_method: 'threshold',
          confidence: 0.9
        },
        metrics: {
          error_count: metrics.errorCount,
          warning_count: metrics.warningCount,
          total_violations: metrics.totalViolations,
          file_count: metrics.fileCount
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectCriticalViolations(metrics: LintMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'critical_violation_in_main');
    if (!detector) return;
    
    // Check if we're on main branch and have critical errors
    const isMain = this.isMainBranch();
    
    if (isMain && metrics.errorCount > 0) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'critical',
        title: `${metrics.errorCount} critical lint violations on main branch`,
        description: `Critical lint errors detected on main branch. This violates code quality standards and must be remediated immediately.`,
        detection: {
          detector: 'critical_violation_in_main',
          detection_method: 'pattern',
          confidence: 1.0
        },
        metrics: {
          error_count: metrics.errorCount,
          branch: 'main'
        },
        impact: {
          affected_branches: ['main'],
          user_impact: 'high',
          business_impact: 'Code quality on main branch is compromised'
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`❌ Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectLintBypasses(metrics: LintMetrics): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'lint_bypass_detector');
    if (!detector) return;
    
    if (metrics.bypassCount > 0) {
      const incident: DetectedIncident = {
        channel: CHANNEL,
        severity: 'medium',
        title: `${metrics.bypassCount} lint bypass directives detected`,
        description: `Found ${metrics.bypassCount} files using lint bypass directives (eslint-disable, @ts-ignore, @ts-nocheck). Files: ${metrics.bypassFiles.slice(0, 5).join(', ')}${metrics.bypassFiles.length > 5 ? '...' : ''}`,
        detection: {
          detector: 'lint_bypass_detector',
          detection_method: 'pattern',
          confidence: 1.0
        },
        metrics: {
          bypass_count: metrics.bypassCount,
          bypass_files: metrics.bypassFiles
        }
      };
      
      if (!hasSimilarIncident(incident, 60)) {
        this.incidents.push(incident);
        console.log(`⚠️  Detected: ${incident.title}`);
      }
    }
  }
  
  private async detectComplexityThreshold(): Promise<void> {
    const detector = getDetectorConfig(CHANNEL, 'code_complexity_threshold');
    if (!detector) return;
    
    // This would require complexity analysis tooling
    // Placeholder for future enhancement
    console.log('ℹ️  Complexity threshold detection requires additional tooling (future enhancement)');
  }
  
  private findLintBypasses(): string[] {
    const bypasses: string[] = [];
    
    const bypassPatterns = [
      /eslint-disable/i,
      /@ts-ignore/i,
      /@ts-nocheck/i,
      /@ts-expect-error/i
    ];
    
    // Find all TypeScript/JavaScript files
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      cwd: process.cwd(),
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**']
    });
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
        
        for (const pattern of bypassPatterns) {
          if (pattern.test(content)) {
            bypasses.push(file);
            break;
          }
        }
      } catch {
        // Ignore file read errors
      }
    }
    
    return bypasses;
  }
  
  private isMainBranch(): boolean {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      return branch === 'main' || branch === 'master';
    } catch {
      return false;
    }
  }
  
  async cleanup(): Promise<void> {
    // Nothing to clean up
  }
}

// Main execution
async function main() {
  const detector = new LintDetector();
  
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
      console.log('\n✅ No anomalies detected - lint channel healthy');
    }
    
    await detector.cleanup();
  } catch (error) {
    console.error('❌ Lint detector failed:', error);
    // Don't block CI on detector failure - log only
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { LintDetector };
