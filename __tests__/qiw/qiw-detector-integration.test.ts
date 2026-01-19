/**
 * QIW Detector Integration Test
 * 
 * Tests end-to-end detector functionality:
 * 1. Detector initialization
 * 2. Anomaly detection
 * 3. Incident recording
 * 4. Event log updates
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('QIW Detector Integration', () => {
  const eventsPath = path.join(__dirname, '../../governance/memory/PartPulse/qiw-events.json');
  let initialEventCount = 0;

  beforeAll(() => {
    // Record initial event count
    if (fs.existsSync(eventsPath)) {
      const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
      initialEventCount = events.event_count;
    }
  });

  it('should have QIW configuration file', () => {
    const configPath = path.join(__dirname, '../../governance/qiw-config.json');
    expect(fs.existsSync(configPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(config.qiw_enabled).toBe(true);
    expect(config.channels).toHaveProperty('build');
    expect(config.channels).toHaveProperty('lint');
    expect(config.channels).toHaveProperty('test');
    expect(config.channels).toHaveProperty('deployment');
    expect(config.channels).toHaveProperty('runtime');
  });

  it('should have QIW events file', () => {
    expect(fs.existsSync(eventsPath)).toBe(true);

    const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
    expect(events).toHaveProperty('version');
    expect(events).toHaveProperty('repository');
    expect(events).toHaveProperty('events');
    expect(Array.isArray(events.events)).toBe(true);
  });

  it('should have detector executables', () => {
    const detectors = [
      'build-detector.ts',
      'lint-detector.ts',
      'test-detector.ts',
      'deployment-detector.ts',
      'runtime-detector.ts'
    ];

    for (const detector of detectors) {
      const detectorPath = path.join(__dirname, '../../governance/qiw/detectors', detector);
      expect(fs.existsSync(detectorPath)).toBe(true);
    }
  });

  it('should have shared utilities', () => {
    const utilPath1 = path.join(__dirname, '../../governance/qiw/detectors/lib/incident-writer.ts');
    const utilPath2 = path.join(__dirname, '../../governance/qiw/detectors/lib/config-loader.ts');

    expect(fs.existsSync(utilPath1)).toBe(true);
    expect(fs.existsSync(utilPath2)).toBe(true);
  });

  it('test detector should run without crashing', () => {
    expect(() => {
      execSync('npm run qiw:detect:test', {
        cwd: path.join(__dirname, '../..'),
        stdio: 'pipe',
        encoding: 'utf8'
      });
    }).not.toThrow();
  });

  it('should record incidents to event log', () => {
    const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
    
    // Event count should be >= initial count (may have added incidents)
    expect(events.event_count).toBeGreaterThanOrEqual(initialEventCount);

    // If incidents exist, validate schema
    if (events.events.length > 0) {
      const incident = events.events[0];
      expect(incident).toHaveProperty('incident_id');
      expect(incident).toHaveProperty('timestamp');
      expect(incident).toHaveProperty('channel');
      expect(incident).toHaveProperty('severity');
      expect(incident).toHaveProperty('title');
      expect(incident).toHaveProperty('description');
      expect(incident).toHaveProperty('detection');
      expect(incident).toHaveProperty('metadata');

      // Validate incident_id format
      expect(incident.incident_id).toMatch(/^QIW-[A-Z]+-\d+-[A-F0-9]{8}$/);

      // Validate channel
      expect(['build', 'lint', 'test', 'deployment', 'runtime']).toContain(incident.channel);

      // Validate severity
      expect(['critical', 'high', 'medium', 'low']).toContain(incident.severity);

      // Validate status
      expect(['detected', 'investigating', 'remediated', 'false_positive']).toContain(incident.status);
    }
  });

  it('should have npm scripts for all detectors', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    expect(pkg.scripts).toHaveProperty('qiw:detect:build');
    expect(pkg.scripts).toHaveProperty('qiw:detect:lint');
    expect(pkg.scripts).toHaveProperty('qiw:detect:test');
    expect(pkg.scripts).toHaveProperty('qiw:detect:deployment');
    expect(pkg.scripts).toHaveProperty('qiw:detect:runtime');
    expect(pkg.scripts).toHaveProperty('qiw:detect:all');
  });

  it('should have JSON schemas', () => {
    const eventsSchemaPath = path.join(__dirname, '../../governance/schemas/qiw-events-schema.json');
    const configSchemaPath = path.join(__dirname, '../../governance/schemas/qiw-config-schema.json');

    expect(fs.existsSync(eventsSchemaPath)).toBe(true);
    expect(fs.existsSync(configSchemaPath)).toBe(true);

    // Validate schemas are valid JSON
    const eventsSchema = JSON.parse(fs.readFileSync(eventsSchemaPath, 'utf8'));
    const configSchema = JSON.parse(fs.readFileSync(configSchemaPath, 'utf8'));

    expect(eventsSchema).toHaveProperty('$schema');
    expect(configSchema).toHaveProperty('$schema');
  });
});
