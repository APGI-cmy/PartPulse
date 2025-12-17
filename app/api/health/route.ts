import { NextResponse } from 'next/server';

/**
 * Health check endpoint for deployment verification
 * Returns app status and configuration check
 */
export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      database: !!process.env.DATABASE_URL,
      auth: !!process.env.AUTH_SECRET,
      authUrl: !!process.env.NEXTAUTH_URL,
      email: !!process.env.EMAIL_PROVIDER,
      storage: !!process.env.STORAGE_PROVIDER,
    },
    urls: {
      nextauth: process.env.NEXTAUTH_URL || 'NOT_SET',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
    },
    status: 'ok',
    missingVars: [] as string[],
  };

  // Check if critical variables are missing
  const criticalVars = ['DATABASE_URL', 'AUTH_SECRET', 'NEXTAUTH_URL'];
  const missingVars = criticalVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    checks.status = 'error';
    checks.missingVars = missingVars;
  }

  return NextResponse.json(checks, { 
    status: checks.status === 'ok' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
