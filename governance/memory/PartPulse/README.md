# QIW Events Memory

## Purpose

This directory contains the **append-only** event log for Quality Integrity Watchdog (QIW) incidents detected in the PartPulse repository.

## Files

### `qiw-events.json`

The primary incident event log. This file follows strict protocols:

**Append-Only Protocol**:
- ✅ New incidents can be APPENDED to the `events` array
- ✅ Existing incidents can have status updates in their `remediation` section
- ❌ Incidents CANNOT be deleted
- ❌ Historical data CANNOT be modified (except for status updates)
- ❌ The events array order CANNOT be changed

**Schema Enforcement**:
- All incidents MUST conform to the incident schema defined in `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md`
- Schema validation SHOULD be performed before appending new incidents
- Invalid incidents MUST be rejected

**Data Integrity**:
- File SHOULD be backed up daily
- Backups SHOULD be retained per retention policy in `governance/qiw-config.json`
- File corruption SHOULD trigger immediate alert to governance liaison

## Event Structure

Each event in `qiw-events.json` follows this schema:

```json
{
  "incident_id": "QIW-{CHANNEL}-{TIMESTAMP}-{HASH}",
  "timestamp": "ISO 8601 timestamp",
  "channel": "build|lint|test|deployment|runtime",
  "severity": "critical|high|medium|low",
  "status": "detected|investigating|remediated|false_positive",
  "title": "Brief description",
  "description": "Detailed description",
  "detection": { ... },
  "impact": { ... },
  "metrics": { ... },
  "evidence": { ... },
  "remediation": { ... },
  "escalation": { ... },
  "metadata": { ... }
}
```

See `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` for complete schema definition.

## Usage

### Adding a New Incident

```javascript
// 1. Load the current events file
const events = JSON.parse(fs.readFileSync('governance/memory/PartPulse/qiw-events.json'));

// 2. Create new incident following schema
const newIncident = {
  incident_id: `QIW-TEST-${Date.now()}-${generateHash()}`,
  timestamp: new Date().toISOString(),
  channel: 'test',
  severity: 'high',
  status: 'detected',
  // ... complete incident data
};

// 3. Validate against schema
if (!validateIncident(newIncident)) {
  throw new Error('Invalid incident schema');
}

// 4. Append to events array
events.events.push(newIncident);
events.event_count = events.events.length;
events.last_updated = new Date().toISOString();

// 5. Write back to file (atomic write recommended)
fs.writeFileSync('governance/memory/PartPulse/qiw-events.json', JSON.stringify(events, null, 2));
```

### Updating Incident Status

```javascript
// 1. Load events
const events = JSON.parse(fs.readFileSync('governance/memory/PartPulse/qiw-events.json'));

// 2. Find incident by ID
const incident = events.events.find(e => e.incident_id === 'QIW-TEST-20260114-ABC');

// 3. Update ONLY allowed fields (status, remediation, metadata.updated_at)
incident.status = 'remediated';
incident.remediation = {
  assigned_to: 'engineer@example.com',
  remediation_plan: 'Fixed failing test',
  completed_at: new Date().toISOString(),
  resolution: 'Test assertion corrected',
  verification: 'All tests passing in commit abc123'
};
incident.metadata.updated_at = new Date().toISOString();

// 4. Update file metadata
events.last_updated = new Date().toISOString();

// 5. Write back
fs.writeFileSync('governance/memory/PartPulse/qiw-events.json', JSON.stringify(events, null, 2));
```

## Querying Events

### Get All Open Critical Incidents

```javascript
const events = JSON.parse(fs.readFileSync('governance/memory/PartPulse/qiw-events.json'));
const criticalOpen = events.events.filter(e => 
  e.severity === 'critical' && 
  e.status !== 'remediated' && 
  e.status !== 'false_positive'
);
```

### Get Incidents by Channel

```javascript
const testIncidents = events.events.filter(e => e.channel === 'test');
```

### Calculate MTTR (Mean Time To Remediation)

```javascript
const remediated = events.events.filter(e => 
  e.status === 'remediated' && 
  e.remediation.completed_at
);

const mttr = remediated.reduce((sum, incident) => {
  const detected = new Date(incident.timestamp);
  const resolved = new Date(incident.remediation.completed_at);
  return sum + (resolved - detected);
}, 0) / remediated.length;

console.log(`MTTR: ${mttr / (1000 * 60 * 60)} hours`);
```

## Backup Protocol

**Frequency**: Daily at 00:00 UTC  
**Location**: `governance/memory/PartPulse/backups/qiw-events-{YYYY-MM-DD}.json`  
**Retention**: Per policy in `governance/qiw-config.json`

**Manual Backup**:
```bash
cp governance/memory/PartPulse/qiw-events.json \
   governance/memory/PartPulse/backups/qiw-events-$(date +%Y-%m-%d).json
```

## Incident Lifecycle

```
1. DETECTED      → Incident identified by detector or manually reported
2. INVESTIGATING → Team actively working on root cause analysis
3. REMEDIATED    → Fix implemented and verified
4. CLOSED        → Incident archived (status remains "remediated")

Alternative:
2. FALSE_POSITIVE → Determined to be not a real issue
```

**Note**: "CLOSED" is not a status field value. Incidents remain with status "remediated" or "false_positive" permanently.

## Governance

- **Owner**: Governance Liaison + QA Team
- **Review Frequency**: Weekly (active incidents), Monthly (trends)
- **Audit Frequency**: Quarterly
- **Schema Authority**: `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md`

## Related Documents

- `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` - QIW canonical specification
- `governance/qiw-config.json` - QIW configuration for PartPulse
- `governance/qiw/README.md` - QIW implementation guide
- `governance/qiw/INCIDENT_RESPONSE.md` - Incident response procedures

---

**Last Updated**: 2026-01-14  
**Version**: 1.0.0  
**Status**: Active
