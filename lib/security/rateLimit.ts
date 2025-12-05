/**
 * Rate limiting middleware
 * Implements token bucket algorithm for API rate limiting
 */

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
}

/**
 * Default rate limit configurations for different route types
 */
export const RATE_LIMITS = {
  // Authentication routes - stricter limits
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // API routes - moderate limits
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Password reset - very strict
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // General routes
  general: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP address or user ID)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.api
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;

  // Initialize or get existing bucket
  if (!store[key]) {
    store[key] = {
      tokens: config.maxRequests,
      lastRefill: now,
    };
  }

  const bucket = store[key];
  const timePassed = now - bucket.lastRefill;
  
  // Refill tokens based on time passed
  if (timePassed >= config.windowMs) {
    bucket.tokens = config.maxRequests;
    bucket.lastRefill = now;
  }

  // Check if request can proceed
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return {
      allowed: true,
      remaining: bucket.tokens,
      resetAt: bucket.lastRefill + config.windowMs,
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetAt: bucket.lastRefill + config.windowMs,
  };
}

/**
 * Clean up old entries from the store (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const key in store) {
    if (now - store[key].lastRefill > maxAge) {
      delete store[key];
    }
  }
}

// Clean up every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
}
