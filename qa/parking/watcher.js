#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * QA Parking Watcher
 * 
 * Monitors the QA parking registry for:
 * - Expired items (past expiryDate)
 * - Items approaching expiry
 * - Invalid parking entries
 * - Unapproved parking attempts
 * 
 * Per ForemanApp governance, all RED states must be tracked and resolved.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

class QAParkingWatcher {
  constructor() {
    // Use __dirname to find project root reliably
    const projectRoot = path.resolve(__dirname, '../..');
    this.registryPath = path.join(projectRoot, 'qa/parking/registry.json');
    this.schemaPath = path.join(projectRoot, 'qa/parking/registry-schema.json');
    this.warnings = [];
    this.errors = [];
  }

  /**
   * Load and validate the parking registry
   */
  loadRegistry() {
    if (!fs.existsSync(this.registryPath)) {
      this.errors.push('Parking registry not found at qa/parking/registry.json');
      return null;
    }

    try {
      const content = fs.readFileSync(this.registryPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      this.errors.push(`Failed to parse registry: ${error.message}`);
      return null;
    }
  }

  /**
   * Validate a parked item
   */
  validateParkedItem(item, index) {
    const required = ['id', 'type', 'reason', 'parkedBy', 'parkedDate', 'expiryCondition', 'approvedBy', 'status'];
    
    for (const field of required) {
      if (!item[field]) {
        this.errors.push(`Item ${index + 1} (${item.id || 'unknown'}): Missing required field '${field}'`);
      }
    }

    // Validate category (optional field, defaults to 'parking' for backward compatibility)
    const validCategories = ['parking', 'dp-red'];
    if (item.category && !validCategories.includes(item.category)) {
      this.errors.push(`Item ${item.id}: Invalid category '${item.category}'. Must be one of: ${validCategories.join(', ')}`);
    }

    // Validate type
    const validTypes = ['test', 'build', 'lint', 'security', 'design', 'architecture', 'other'];
    if (item.type && !validTypes.includes(item.type)) {
      this.errors.push(`Item ${item.id}: Invalid type '${item.type}'. Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate DP-RED specific rules
    if (item.category === 'dp-red') {
      const dpRedTypes = ['design', 'architecture', 'test'];
      if (item.type && !dpRedTypes.includes(item.type)) {
        this.warnings.push(`Item ${item.id}: DP-RED items typically use type 'design', 'architecture', or 'test'. Current type: '${item.type}'`);
      }
    }

    // Validate status
    const validStatuses = ['active', 'resolved', 'expired'];
    if (item.status && !validStatuses.includes(item.status)) {
      this.errors.push(`Item ${item.id}: Invalid status '${item.status}'. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Check if approved
    if (!item.approvedBy || item.approvedBy === '') {
      this.errors.push(`Item ${item.id}: Not approved. All parking must be approved by repo owner.`);
    }
  }

  /**
   * Check for expired items
   */
  checkExpiry(item) {
    if (item.status !== 'active') {
      return; // Only check active items
    }

    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        this.errors.push(`Item ${item.id}: EXPIRED (${Math.abs(daysUntilExpiry)} days overdue). Must be resolved or renewed.`);
      } else if (daysUntilExpiry <= 7) {
        this.warnings.push(`Item ${item.id}: Expires in ${daysUntilExpiry} day(s). Resolve soon.`);
      }
    }

    // Check parking age
    const parkedDate = new Date(item.parkedDate);
    const today = new Date();
    const daysParked = Math.ceil((today - parkedDate) / (1000 * 60 * 60 * 24));

    if (daysParked > 90) {
      this.warnings.push(`Item ${item.id}: Parked for ${daysParked} days. Long-term parking requires review.`);
    }
  }

  /**
   * Run the watcher
   */
  run() {
    console.log('\n' + '='.repeat(70));
    console.log('QA Parking Watcher - Governed RED State Tracking');
    console.log('='.repeat(70) + '\n');

    const registry = this.loadRegistry();
    
    if (!registry) {
      console.log(`${RED}❌ FAILED - Registry errors${RESET}\n`);
      this.errors.forEach(err => console.log(`${RED}  ● ${err}${RESET}`));
      console.log();
      return 1;
    }

    const { parkedItems } = registry;

    console.log(`Registry version: ${registry.version}`);
    console.log(`Total parked items: ${parkedItems.length}\n`);

    if (parkedItems.length === 0) {
      console.log(`${GREEN}✅ No parked items - All systems GREEN${RESET}\n`);
      return 0;
    }

    // Validate and check each item
    const activeItems = [];
    const resolvedItems = [];
    const expiredItems = [];
    const dpRedItems = [];
    const parkingItems = [];

    for (let i = 0; i < parkedItems.length; i++) {
      const item = parkedItems[i];
      
      this.validateParkedItem(item, i);
      this.checkExpiry(item);

      if (item.status === 'active') {
        activeItems.push(item);
        
        // Categorize by parking type (default to 'parking' for backward compatibility)
        const category = item.category || 'parking';
        if (category === 'dp-red') {
          dpRedItems.push(item);
        } else {
          parkingItems.push(item);
        }
      } else if (item.status === 'resolved') {
        resolvedItems.push(item);
      } else if (item.status === 'expired') {
        expiredItems.push(item);
      }
    }

    // Report active items by category
    if (dpRedItems.length > 0) {
      console.log(`${BLUE}Design-Phase RED (DP-RED) Items: ${dpRedItems.length}${RESET}`);
      dpRedItems.forEach(item => {
        console.log(`\n  ${BLUE}●${RESET} ${item.id} - ${item.type}`);
        console.log(`    Reason: ${item.reason}`);
        console.log(`    Parked by: ${item.parkedBy} on ${item.parkedDate}`);
        console.log(`    Approved by: ${item.approvedBy}`);
        console.log(`    Expiry: ${item.expiryCondition}`);
        if (item.expiryDate) {
          console.log(`    Hard deadline: ${item.expiryDate}`);
        }
        if (item.issueUrl) {
          console.log(`    Tracking: ${item.issueUrl}`);
        }
      });
      console.log();
    }

    if (parkingItems.length > 0) {
      console.log(`${YELLOW}QA Parking Items: ${parkingItems.length}${RESET}`);
      parkingItems.forEach(item => {
        console.log(`\n  ${YELLOW}●${RESET} ${item.id} - ${item.type}`);
        console.log(`    Reason: ${item.reason}`);
        console.log(`    Parked by: ${item.parkedBy} on ${item.parkedDate}`);
        console.log(`    Approved by: ${item.approvedBy}`);
        console.log(`    Expiry: ${item.expiryCondition}`);
        if (item.expiryDate) {
          console.log(`    Hard deadline: ${item.expiryDate}`);
        }
        if (item.issueUrl) {
          console.log(`    Tracking: ${item.issueUrl}`);
        }
      });
      console.log();
    }

    // Report warnings
    if (this.warnings.length > 0) {
      console.log(`${YELLOW}⚠️  Warnings: ${this.warnings.length}${RESET}\n`);
      this.warnings.forEach(warning => {
        console.log(`  ${YELLOW}● ${warning}${RESET}`);
      });
      console.log();
    }

    // Report errors
    if (this.errors.length > 0) {
      console.log(`${RED}❌ Errors: ${this.errors.length}${RESET}\n`);
      this.errors.forEach(error => {
        console.log(`  ${RED}● ${error}${RESET}`);
      });
      console.log();
      
      console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}`);
      console.log(`${RED}                    GOVERNANCE VIOLATION                        ${RESET}`);
      console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}`);
      console.log(`${RED}QA parking violations detected. All RED states must be properly${RESET}`);
      console.log(`${RED}governed with approval, expiry, and tracking.${RESET}`);
      console.log(`${RED}═══════════════════════════════════════════════════════════════${RESET}\n`);
      
      return 1;
    }

    if (activeItems.length > 0) {
      console.log(`${GREEN}✅ PASSED - All parking is properly governed${RESET}`);
      console.log(`   ${activeItems.length} active parked item(s) tracked\n`);
    } else {
      console.log(`${GREEN}✅ PASSED - No active parking${RESET}\n`);
    }

    return 0;
  }
}

// Run watcher
const watcher = new QAParkingWatcher();
const exitCode = watcher.run();
process.exit(exitCode);
