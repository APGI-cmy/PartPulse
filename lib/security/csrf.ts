/**
 * CSRF Protection utilities
 * Implements token-based CSRF protection for forms and state-changing requests
 */

import crypto from 'crypto';

const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

interface CsrfTokenStore {
  [sessionId: string]: {
    token: string;
    createdAt: number;
  };
}

const tokenStore: CsrfTokenStore = {};

/**
 * Generate a CSRF token for a session
 * @param sessionId - Unique session identifier
 * @returns Generated CSRF token
 */
export function generateCsrfToken(sessionId: string): string {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  
  tokenStore[sessionId] = {
    token,
    createdAt: Date.now(),
  };

  return token;
}

/**
 * Validate a CSRF token
 * @param sessionId - Session identifier
 * @param token - Token to validate
 * @returns True if token is valid
 */
export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = tokenStore[sessionId];
  
  if (!stored) {
    return false;
  }

  // Check expiry
  if (Date.now() - stored.createdAt > TOKEN_EXPIRY) {
    delete tokenStore[sessionId];
    return false;
  }

  // Check token match
  if (stored.token !== token) {
    return false;
  }

  // Token is valid - rotate it
  delete tokenStore[sessionId];
  
  return true;
}

/**
 * Clean up expired tokens (run periodically)
 */
export function cleanupCsrfTokens(): void {
  const now = Date.now();
  
  for (const sessionId in tokenStore) {
    if (now - tokenStore[sessionId].createdAt > TOKEN_EXPIRY) {
      delete tokenStore[sessionId];
    }
  }
}

// Clean up every 15 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCsrfTokens, 15 * 60 * 1000);
}
