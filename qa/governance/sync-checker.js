#!/usr/bin/env node
/**
 * Governance Policy Sync Checker
 * 
 * Validates that repository governance is synchronized with ForemanApp policy.
 * Ensures all required mechanisms are in place and operational.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

class GovernanceSyncChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  /**
   * Required governance files and mechanisms
   */
  getRequiredArtifacts() {
    return [
      {
        path: 'docs/governance/POLICY_VERSION.md',
        name: 'Policy Version Declaration',
        critical: true
      },
      {
        path: '.github/agents/PartPulse-agent.md',
        name: 'Agent Contract',
        critical: true
      },
      {
        path: 'qa/detect-test-dodging.js',
        name: 'Test Dodging Detector',
        critical: true
      },
      {
        path: 'qa/parking/registry.json',
        name: 'QA Parking Registry',
        critical: true
      },
      {
        path: 'qa/parking/watcher.js',
        name: 'QA Parking Watcher',
        critical: true
      },
      {
        path: 'qa/evidence/capture.js',
        name: 'Evidence Capture',
        critical: true
      },
      {
        path: '.github/ISSUE_TEMPLATE/catastrophic-failure.yml',
        name: 'Catastrophic Failure Template',
        critical: true
      },
      {
        path: '.github/ISSUE_TEMPLATE/qa-parking.yml',
        name: 'QA Parking Template',
        critical: true
      },
      {
        path: 'jest.config.js',
        name: 'Jest Configuration',
        critical: false
      },
      {
        path: '__tests__',
        name: 'Tests Directory',
        critical: false,
        isDirectory: true
      }
    ];
  }

  /**
   * Check if artifact exists
   */
  checkArtifact(artifact) {
    const fullPath = path.join(process.cwd(), artifact.path);
    const exists = fs.existsSync(fullPath);
    
    if (artifact.isDirectory) {
      const isDir = exists && fs.statSync(fullPath).isDirectory();
      return {
        ...artifact,
        exists: isDir,
        status: isDir ? 'pass' : 'fail'
      };
    }

    return {
      ...artifact,
      exists,
      status: exists ? 'pass' : 'fail'
    };
  }

  /**
   * Check package.json scripts
   */
  checkPackageScripts() {
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      this.errors.push('package.json not found');
      return;
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const requiredScripts = ['test', 'test:ci', 'qa:check'];

    for (const script of requiredScripts) {
      if (!pkg.scripts || !pkg.scripts[script]) {
        this.warnings.push(`Missing package.json script: ${script}`);
      }
    }
  }

  /**
   * Validate policy version file
   */
  validatePolicyVersion() {
    const policyPath = path.join(process.cwd(), 'docs/governance/POLICY_VERSION.md');
    
    if (!fs.existsSync(policyPath)) {
      this.errors.push('Policy version file missing');
      return;
    }

    const content = fs.readFileSync(policyPath, 'utf-8');
    
    // Check for required sections
    const requiredSections = [
      'Policy Version',
      'Core Governance Invariants',
      'Compliance Mechanisms',
      'Version History'
    ];

    for (const section of requiredSections) {
      if (!content.includes(section)) {
        this.warnings.push(`Policy version missing section: ${section}`);
      }
    }
  }

  /**
   * Run all checks
   */
  run() {
    console.log('\n' + '='.repeat(70));
    console.log('Governance Policy Sync Checker');
    console.log('='.repeat(70) + '\n');

    // Check artifacts
    const artifacts = this.getRequiredArtifacts();
    
    console.log('Checking governance artifacts...\n');

    for (const artifact of artifacts) {
      const result = this.checkArtifact(artifact);
      this.checks.push(result);

      if (result.status === 'pass') {
        console.log(`  ${GREEN}✓${RESET} ${result.name}`);
      } else {
        const symbol = result.critical ? RED + '✗' : YELLOW + '⚠';
        console.log(`  ${symbol}${RESET} ${result.name} (${result.path})`);
        
        if (result.critical) {
          this.errors.push(`Missing critical artifact: ${result.name} at ${result.path}`);
        } else {
          this.warnings.push(`Missing optional artifact: ${result.name} at ${result.path}`);
        }
      }
    }

    console.log();

    // Check package.json scripts
    this.checkPackageScripts();

    // Validate policy version
    this.validatePolicyVersion();

    // Report results
    const passed = this.checks.filter(c => c.status === 'pass').length;
    const failed = this.checks.filter(c => c.status === 'fail').length;

    console.log('─'.repeat(70) + '\n');
    console.log(`Checked: ${this.checks.length} artifacts`);
    console.log(`${GREEN}Passed: ${passed}${RESET}`);
    if (failed > 0) {
      console.log(`${RED}Failed: ${failed}${RESET}`);
    }

    if (this.warnings.length > 0) {
      console.log(`\n${YELLOW}Warnings: ${this.warnings.length}${RESET}\n`);
      this.warnings.forEach(w => console.log(`  ${YELLOW}⚠${RESET} ${w}`));
    }

    if (this.errors.length > 0) {
      console.log(`\n${RED}Errors: ${this.errors.length}${RESET}\n`);
      this.errors.forEach(e => console.log(`  ${RED}✗${RESET} ${e}`));
      console.log();
      
      console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}`);
      console.log(`${RED}              GOVERNANCE SYNC FAILURE                          ${RESET}`);
      console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}`);
      console.log(`${RED}Repository is not synchronized with ForemanApp governance.${RESET}`);
      console.log(`${RED}Critical mechanisms are missing or misconfigured.${RESET}`);
      console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}\n`);
      
      return 1;
    }

    console.log(`\n${GREEN}✅ PASSED - Governance synchronized${RESET}`);
    console.log(`   Repository complies with ForemanApp policy\n`);

    return 0;
  }
}

// Run checker
const checker = new GovernanceSyncChecker();
const exitCode = checker.run();
process.exit(exitCode);
