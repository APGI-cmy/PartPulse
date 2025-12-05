/**
 * Security utilities and hardening functions
 */

/**
 * Security headers for production
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval for dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
} as const;

/**
 * Extract IP address from request
 * Supports various proxy headers
 */
export function getClientIp(request: Request): string {
  // Try to get IP from various headers (in order of preference)
  const headers = request.headers;
  
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default
  return '0.0.0.0';
}

/**
 * Check if request is from a trusted origin
 * @param origin - Origin header from request
 * @returns True if origin is trusted
 */
export function isTrustedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  const trustedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ];

  return trustedOrigins.some(trusted => origin.startsWith(trusted));
}

/**
 * Validate session strength
 * Checks for suspicious session characteristics
 */
export function validateSession(session: {
  createdAt?: number;
  lastActivity?: number;
  ipAddress?: string;
}): { valid: boolean; reason?: string } {
  const now = Date.now();
  const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
  const MAX_INACTIVITY = 2 * 60 * 60 * 1000; // 2 hours

  // Check session age
  if (session.createdAt && now - session.createdAt > MAX_SESSION_AGE) {
    return { valid: false, reason: 'Session expired' };
  }

  // Check inactivity
  if (session.lastActivity && now - session.lastActivity > MAX_INACTIVITY) {
    return { valid: false, reason: 'Session inactive' };
  }

  return { valid: true };
}
