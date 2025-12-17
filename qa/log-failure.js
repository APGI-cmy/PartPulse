#!/usr/bin/env node

/**
 * FL/CI Failure Logger
 * 
 * This script helps log failures according to the Failure Learning / 
 * Continuous Improvement policy. Every failure is an opportunity to improve.
 * 
 * Usage:
 *   node qa/log-failure.js
 *   
 * The script will prompt for:
 * - Failure description
 * - Root cause
 * - Impact
 * - Solution implemented
 * - Tests added
 * - Prevention mechanism
 * - Files changed
 * - Lessons learned
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const LOG_PATH = path.join(__dirname, 'FAILURE_LEARNING_LOG.md');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  FL/CI Failure Learning Logger                            ║');
  console.log('║  Every failure makes us better. Let\'s learn from this.    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Read existing log to get next failure number
  const logContent = fs.readFileSync(LOG_PATH, 'utf-8');
  const failureMatches = logContent.match(/## Failure #(\d+):/g) || [];
  const nextNumber = failureMatches.length + 1;

  console.log(`This will be logged as Failure #${nextNumber}\n`);

  // Gather information
  const description = await question('1. Brief description of the failure: ');
  const issueNumber = await question('2. Issue number (if any, e.g., 84): ');
  const symptom = await question('3. What went wrong (symptom/error): ');
  const rootCause = await question('4. Root cause (why it happened): ');
  const impact = await question('5. Impact (consequences): ');
  const solution = await question('6. How we fixed it: ');
  const testAdded = await question('7. Test(s) added to prevent this: ');
  const preventionMech = await question('8. Prevention mechanism: ');
  const filesChanged = await question('9. Files changed (comma-separated): ');
  const lessons = await question('10. Key lessons learned: ');

  // Format the entry
  const today = new Date().toISOString().split('T')[0];
  const issueLink = issueNumber ? `[#${issueNumber}](https://github.com/MaturionISMS/PartPulse/issues/${issueNumber})` : 'N/A';
  
  const entry = `
## Failure #${nextNumber}: ${description}

**Date**: ${today}  
**Issue**: ${issueLink}  

### What Went Wrong

${symptom}

### Root Cause

${rootCause}

### Impact

${impact}

### How We Fixed It

${solution}

### FL/CI Implementation

- ✅ **Registered**: This entry documents the failure
- ✅ **Incorporated**: ${testAdded}
- ✅ **Prevented**: ${preventionMech}

### Files Changed

${filesChanged.split(',').map(f => `- ${f.trim()}`).join('\n')}

### Prevention Mechanism

${preventionMech}

### Lessons Learned

${lessons}

---
`;

  // Find the insertion point (before the template section)
  const templateIndex = logContent.indexOf('## Template for Future Failures');
  
  if (templateIndex === -1) {
    console.error('\n❌ Error: Could not find template section in log file');
    rl.close();
    return;
  }

  // Insert the new entry
  const updatedContent = 
    logContent.slice(0, templateIndex) + 
    entry + '\n' + 
    logContent.slice(templateIndex);

  // Update statistics
  const statsMatch = updatedContent.match(/\*\*Total Failures Logged\*\*: (\d+)/);
  const testsMatch = updatedContent.match(/\*\*Total Tests Added\*\*: (\d+)/);
  const classesMatch = updatedContent.match(/\*\*Failure Classes Eliminated\*\*: (\d+)/);
  
  let finalContent = updatedContent;
  if (statsMatch) {
    const newTotal = parseInt(statsMatch[1]) + 1;
    finalContent = finalContent.replace(
      /\*\*Total Failures Logged\*\*: \d+/,
      `**Total Failures Logged**: ${newTotal}`
    );
  }
  
  if (testsMatch) {
    const newTests = parseInt(testsMatch[1]) + 1;
    finalContent = finalContent.replace(
      /\*\*Total Tests Added\*\*: \d+/,
      `**Total Tests Added**: ${newTests}`
    );
  }
  
  if (classesMatch) {
    const newClasses = parseInt(classesMatch[1]) + 1;
    finalContent = finalContent.replace(
      /\*\*Failure Classes Eliminated\*\*: \d+/,
      `**Failure Classes Eliminated**: ${newClasses}`
    );
  }

  // Update last updated date
  finalContent = finalContent.replace(
    /\*\*Last Updated\*\*: [\d-]+/,
    `**Last Updated**: ${today}`
  );

  // Write the updated log
  fs.writeFileSync(LOG_PATH, finalContent);

  console.log('\n✅ Failure logged successfully!');
  console.log(`📝 Added as Failure #${nextNumber} to ${LOG_PATH}`);
  console.log('\n💡 Remember: This failure is now permanently prevented!');
  console.log('   Our QA suite is stronger because of this.\n');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
