#!/usr/bin/env node
/**
 * Catastrophic Failure Evidence Capture
 * 
 * Captures and stores evidence when a catastrophic failure occurs.
 * Per ForemanApp governance, all failures must be tracked permanently.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EvidenceCapture {
  constructor(failureType, failureMessage) {
    this.failureType = failureType || 'unknown';
    this.failureMessage = failureMessage || 'No message provided';
    this.timestamp = new Date().toISOString();
    this.failureId = this.generateFailureId();
    this.evidenceDir = path.join(
      process.cwd(),
      'qa/evidence',
      `${this.getDateString()}_${this.failureId}`
    );
  }

  generateFailureId() {
    const count = this.getFailureCount() + 1;
    return `FAIL-${String(count).padStart(3, '0')}`;
  }

  getFailureCount() {
    const evidenceRoot = path.join(process.cwd(), 'qa/evidence');
    if (!fs.existsSync(evidenceRoot)) {
      return 0;
    }

    const dirs = fs.readdirSync(evidenceRoot)
      .filter(item => {
        const fullPath = path.join(evidenceRoot, item);
        return fs.statSync(fullPath).isDirectory();
      });

    return dirs.length;
  }

  getDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  }

  captureGitContext() {
    try {
      return {
        commit: execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim(),
        branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim(),
        author: execSync('git log -1 --pretty=format:"%an <%ae>"', { encoding: 'utf-8' }).trim(),
        message: execSync('git log -1 --pretty=format:"%s"', { encoding: 'utf-8' }).trim(),
        dirty: execSync('git status --porcelain', { encoding: 'utf-8' }).trim() !== ''
      };
    } catch (error) {
      return {
        error: 'Failed to capture git context',
        message: error.message
      };
    }
  }

  captureMetadata() {
    return {
      failureId: this.failureId,
      timestamp: this.timestamp,
      type: this.failureType,
      message: this.failureMessage,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd()
      },
      ci: {
        isCI: process.env.CI === 'true',
        provider: process.env.GITHUB_ACTIONS ? 'github-actions' : 'unknown',
        runId: process.env.GITHUB_RUN_ID,
        runNumber: process.env.GITHUB_RUN_NUMBER,
        actor: process.env.GITHUB_ACTOR
      }
    };
  }

  captureLogs(logs) {
    if (!logs) {
      return 'No logs provided';
    }
    return typeof logs === 'string' ? logs : JSON.stringify(logs, null, 2);
  }

  save(additionalData = {}) {
    // Create evidence directory
    fs.mkdirSync(this.evidenceDir, { recursive: true });

    // Save metadata
    const metadata = {
      ...this.captureMetadata(),
      ...additionalData
    };
    fs.writeFileSync(
      path.join(this.evidenceDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Save git context
    const gitContext = this.captureGitContext();
    fs.writeFileSync(
      path.join(this.evidenceDir, 'context.json'),
      JSON.stringify(gitContext, null, 2)
    );

    // Save logs if provided
    if (additionalData.logs) {
      fs.writeFileSync(
        path.join(this.evidenceDir, 'logs.txt'),
        this.captureLogs(additionalData.logs)
      );
    }

    // Save stack trace if provided
    if (additionalData.stackTrace) {
      fs.writeFileSync(
        path.join(this.evidenceDir, 'stack-trace.txt'),
        additionalData.stackTrace
      );
    }

    console.log(`\n✅ Evidence captured: ${this.evidenceDir}\n`);
    console.log(`Failure ID: ${this.failureId}`);
    console.log(`Timestamp: ${this.timestamp}`);
    console.log(`Type: ${this.failureType}\n`);

    return {
      failureId: this.failureId,
      evidenceDir: this.evidenceDir,
      timestamp: this.timestamp
    };
  }
}

// Export for programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EvidenceCapture;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const failureType = args[0] || 'unknown';
  const failureMessage = args[1] || 'No message provided';
  const logs = args[2];

  const capture = new EvidenceCapture(failureType, failureMessage);
  capture.save({ logs });
}
