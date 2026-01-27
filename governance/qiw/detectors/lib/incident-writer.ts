/**
 * QIW Incident Writer Utility
 * 
 * Writes incident records to qiw-events.json following canonical schema.
 * Ensures append-only semantics and proper formatting.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface DetectedIncident {
  channel: 'build' | 'lint' | 'test' | 'deployment' | 'runtime';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  detection: {
    detector: string;
    detection_method: 'threshold' | 'pattern' | 'anomaly' | 'manual';
    confidence: number; // 0.0 - 1.0
  };
  metrics?: Record<string, unknown>;
  evidence?: {
    logs?: string[];
    commits?: string[];
    pr_numbers?: number[];
    ci_run_urls?: string[];
    screenshots?: string[];
  };
  impact?: {
    affected_components?: string[];
    affected_branches?: string[];
    user_impact?: 'none' | 'low' | 'medium' | 'high' | 'critical';
    business_impact?: string;
  };
}

export interface FullIncident extends DetectedIncident {
  incident_id: string;
  timestamp: string;
  status: 'detected' | 'investigating' | 'remediated' | 'false_positive';
  metadata: {
    created_by: string;
    updated_at: string;
    tags: string[];
    related_incidents?: string[];
  };
}

/**
 * Generate unique incident ID
 */
export function generateIncidentId(channel: string): string {
  const timestamp = Date.now();
  const hash = crypto
    .createHash('sha256')
    .update(`${channel}-${timestamp}-${Math.random()}`)
    .digest('hex')
    .substring(0, 8)
    .toUpperCase();
  return `QIW-${channel.toUpperCase()}-${timestamp}-${hash}`;
}

/**
 * Write incident to qiw-events.json
 * Returns the incident ID
 */
export async function recordIncident(incident: DetectedIncident): Promise<string> {
  const eventsPath = path.join(__dirname, '../../../memory/PartPulse/qiw-events.json');
  
  // Ensure file exists
  if (!fs.existsSync(eventsPath)) {
    throw new Error(`QIW events file not found: ${eventsPath}`);
  }
  
  // Read current events
  const eventsData = fs.readFileSync(eventsPath, 'utf8');
  const events = JSON.parse(eventsData);
  
  // Create full incident record
  const fullIncident: FullIncident = {
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
  
  // Append to events array
  events.events.push(fullIncident);
  events.event_count = events.events.length;
  events.last_updated = new Date().toISOString();
  
  // Write back to file
  fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
  
  return fullIncident.incident_id;
}

/**
 * Write multiple incidents in batch
 * Returns array of incident IDs
 */
export async function recordIncidents(incidents: DetectedIncident[]): Promise<string[]> {
  const ids: string[] = [];
  for (const incident of incidents) {
    const id = await recordIncident(incident);
    ids.push(id);
  }
  return ids;
}

/**
 * Get recent incidents for a channel
 */
export function getRecentIncidents(
  channel: string,
  count: number = 10
): FullIncident[] {
  const eventsPath = path.join(__dirname, '../../../memory/PartPulse/qiw-events.json');
  
  if (!fs.existsSync(eventsPath)) {
    return [];
  }
  
  const eventsData = fs.readFileSync(eventsPath, 'utf8');
  const events = JSON.parse(eventsData);
  
  return events.events
    .filter((e: FullIncident) => e.channel === channel)
    .slice(-count);
}

/**
 * Check if similar incident exists in recent history
 */
export function hasSimilarIncident(
  incident: DetectedIncident,
  withinMinutes: number = 60
): boolean {
  const recent = getRecentIncidents(incident.channel, 50);
  const cutoff = Date.now() - (withinMinutes * 60 * 1000);
  
  return recent.some(existing => {
    const existingTime = new Date(existing.timestamp).getTime();
    return existingTime > cutoff &&
           existing.title === incident.title &&
           existing.severity === incident.severity;
  });
}
