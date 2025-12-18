#!/usr/bin/env node

/**
 * Prisma Migration Deploy with Enhanced Diagnostics
 * 
 * This script deploys migrations with detailed error reporting
 * to help diagnose connection issues.
 */

const { execSync } = require('child_process');

console.log('🔄 Deploying Prisma migrations...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ CRITICAL: DATABASE_URL environment variable is not set!\n');
  console.error('📋 REQUIRED ACTION:');
  console.error('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
  console.error('   2. Add DATABASE_URL with your Supabase connection string');
  console.error('   3. Set for: Production, Preview, Development (all three)');
  console.error('   4. Redeploy\n');
  console.error('📖 See: docs/VERCEL_BUILD_FAILURE_DATABASE.md\n');
  process.exit(1);
}

// Mask sensitive parts of URL for logging
const maskedUrl = process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log('✅ DATABASE_URL is set');
console.log(`📍 Connection: ${maskedUrl}\n`);

// Extract host and port for diagnostics
const urlMatch = process.env.DATABASE_URL.match(/@([^:/]+):?(\d+)?/);
const host = urlMatch ? urlMatch[1] : 'unknown';
const port = urlMatch ? (urlMatch[2] || '5432') : '5432';

console.log(`🔍 Diagnostics:`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Environment: ${process.env.VERCEL_ENV || 'local'}\n`);

// Attempt migration deployment
console.log('🔌 Connecting to database and deploying migrations...\n');

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    timeout: 60000, // 60 second timeout
  });
  
  console.log('\n✅ SUCCESS: Migrations deployed successfully!\n');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ MIGRATION DEPLOYMENT FAILED\n');
  
  // Detailed error analysis
  const errorMessage = error.message || '';
  const isP1001 = errorMessage.includes('P1001') || errorMessage.includes('Can\'t reach');
  
  if (isP1001) {
    console.error('🔴 ERROR TYPE: Database Connection Failure (P1001)\n');
    console.error('📋 COMMON CAUSES & SOLUTIONS:\n');
    
    console.error('1️⃣  DATABASE NOT RUNNING:');
    console.error('   → Check Supabase dashboard: Is the database active?');
    console.error('   → Supabase databases auto-pause after inactivity');
    console.error('   → Solution: Visit Supabase dashboard to wake database\n');
    
    console.error('2️⃣  WRONG CONNECTION STRING PORT:');
    console.error(`   → Current port: ${port}`);
    console.error('   → Try Connection Pooling URL (port 5432)');
    console.error('   → OR try Direct Connection URL (port 6543)');
    console.error('   → Get from: Supabase → Settings → Database → Connection string\n');
    
    console.error('3️⃣  IP NOT WHITELISTED:');
    console.error('   → Supabase may require IP whitelisting');
    console.error('   → Vercel uses dynamic IPs - whitelist 0.0.0.0/0 for Vercel');
    console.error('   → Check: Supabase → Settings → Database → Network restrictions\n');
    
    console.error('4️⃣  INCORRECT PASSWORD/CREDENTIALS:');
    console.error('   → Verify DATABASE_URL has correct password');
    console.error('   → Special characters in password need URL encoding');
    console.error('   → Example: @ becomes %40, # becomes %23\n');
    
    console.error('5️⃣  NETWORK/FIREWALL ISSUE:');
    console.error('   → Vercel → Supabase connection may be blocked');
    console.error('   → Check Supabase network settings');
    console.error('   → Verify region compatibility\n');
    
  } else {
    console.error('🔴 ERROR TYPE: Other Migration Error\n');
    console.error('Error details:', error.message, '\n');
  }
  
  console.error('📖 DETAILED TROUBLESHOOTING:');
  console.error('   See: docs/VERCEL_BUILD_FAILURE_DATABASE.md\n');
  
  console.error('🔧 QUICK FIX CHECKLIST:');
  console.error('   □ Is Supabase database running? (check dashboard)');
  console.error('   □ Is DATABASE_URL set in Vercel? (check env vars)');
  console.error('   □ Using Connection Pooling URL? (port 5432)');
  console.error('   □ Are Vercel IPs whitelisted? (if required)');
  console.error('   □ Is password URL-encoded? (if special chars)\n');
  
  console.error('❌ Build cannot continue - database schema deployment required\n');
  process.exit(1);
}
