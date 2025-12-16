# Catastrophic Failure Evidence

This directory stores evidence for catastrophic failures detected in the CI/CD pipeline.

## Structure

Each failure gets a unique directory with timestamp and failure ID:

```
evidence/
├── YYYY-MM-DD_HHMMSS_FAIL-XXX/
│   ├── metadata.json      # Failure metadata
│   ├── logs.txt          # Build/test logs
│   ├── stack-trace.txt   # Stack traces
│   ├── context.json      # Git context (commit, branch, etc.)
│   └── screenshots/      # Optional screenshots
```

## Governance

Per ForemanApp governance, catastrophic failures:
- Must be tracked permanently
- Cannot recur without prevention
- Require root cause analysis
- Must result in strengthened QA

## Retention

Evidence is retained indefinitely for:
- Forensic analysis
- Pattern detection
- Audit trail
- ISO compliance
