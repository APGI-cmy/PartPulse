/**
 * QIW Configuration Loader
 * 
 * Loads and validates QIW configuration from qiw-config.json
 */

import * as fs from 'fs';
import * as path from 'path';

export interface QIWConfig {
  version: string;
  repository: string;
  qiw_enabled: boolean;
  channels: Record<string, ChannelConfig>;
  severity_sla: Record<string, SLAConfig>;
  [key: string]: any;
}

export interface ChannelConfig {
  enabled: boolean;
  description: string;
  triggers: string[];
  detectors: DetectorConfig[];
  metrics: string[];
  blocking_rules: BlockingRules;
  [key: string]: any;
}

export interface DetectorConfig {
  name: string;
  type: 'threshold' | 'pattern' | 'anomaly';
  enabled: boolean;
  threshold?: ThresholdConfig;
  pattern?: string;
  severity?: string;
  description?: string;
  [key: string]: any;
}

export interface ThresholdConfig {
  metric: string;
  operator: string;
  value?: number;
  baseline?: string;
  window?: string;
  severity?: string;
}

export interface BlockingRules {
  critical?: BlockingRule;
  high?: BlockingRule;
  medium?: BlockingRule;
  low?: BlockingRule;
}

export interface BlockingRule {
  block_merge?: boolean;
  block_deployment?: boolean;
  block_merge_to_main?: boolean;
  require_immediate_fix?: boolean;
  require_remediation_plan?: boolean;
  create_tracking_issue?: boolean;
  log_only?: boolean;
  [key: string]: any;
}

export interface SLAConfig {
  mttr_target: string;
  escalation_threshold: string;
  notification: string[];
}

let cachedConfig: QIWConfig | null = null;

/**
 * Load QIW configuration
 */
export function loadConfig(): QIWConfig {
  if (cachedConfig) {
    return cachedConfig;
  }
  
  const configPath = path.join(__dirname, '../../../../qiw-config.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`QIW config not found: ${configPath}`);
  }
  
  const configData = fs.readFileSync(configPath, 'utf8');
  cachedConfig = JSON.parse(configData);
  
  return cachedConfig!;
}

/**
 * Get configuration for a specific channel
 */
export function getChannelConfig(channel: string): ChannelConfig | null {
  const config = loadConfig();
  return config.channels[channel] || null;
}

/**
 * Get configuration for a specific detector
 */
export function getDetectorConfig(
  channel: string,
  detectorName: string
): DetectorConfig | null {
  const channelConfig = getChannelConfig(channel);
  if (!channelConfig) {
    return null;
  }
  
  const detector = channelConfig.detectors.find(d => d.name === detectorName);
  return detector?.enabled ? detector : null;
}

/**
 * Check if a channel is enabled
 */
export function isChannelEnabled(channel: string): boolean {
  const config = loadConfig();
  return config.qiw_enabled && config.channels[channel]?.enabled === true;
}

/**
 * Check if a detector is enabled
 */
export function isDetectorEnabled(channel: string, detectorName: string): boolean {
  const detector = getDetectorConfig(channel, detectorName);
  return detector !== null && detector.enabled === true;
}

/**
 * Get blocking rule for a severity level
 */
export function getBlockingRule(
  channel: string,
  severity: 'critical' | 'high' | 'medium' | 'low'
): BlockingRule | null {
  const channelConfig = getChannelConfig(channel);
  if (!channelConfig) {
    return null;
  }
  
  return channelConfig.blocking_rules[severity] || null;
}

/**
 * Check if a severity should block merge
 */
export function shouldBlockMerge(
  channel: string,
  severity: 'critical' | 'high' | 'medium' | 'low'
): boolean {
  const rule = getBlockingRule(channel, severity);
  return rule?.block_merge === true || rule?.block_merge_to_main === true;
}
