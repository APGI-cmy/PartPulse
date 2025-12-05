/**
 * Simple in-memory cache for performance optimization
 * For production, consider using Redis or similar
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

interface CacheStore {
  [key: string]: CacheEntry<unknown>;
}

const cache: CacheStore = {};

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get a value from cache
 * @param key - Cache key
 * @returns Cached value or undefined if not found/expired
 */
export function getFromCache<T>(key: string): T | undefined {
  const entry = cache[key] as CacheEntry<T> | undefined;
  
  if (!entry) {
    return undefined;
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    delete cache[key];
    return undefined;
  }

  return entry.data;
}

/**
 * Set a value in cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param options - Cache options
 */
export function setInCache<T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): void {
  const ttl = options.ttl || DEFAULT_TTL;
  
  cache[key] = {
    data,
    expiresAt: Date.now() + ttl,
  };
}

/**
 * Invalidate a cache entry
 * @param key - Cache key or pattern
 */
export function invalidateCache(key: string): void {
  if (key.includes('*')) {
    // Pattern matching
    const pattern = key.replace('*', '');
    Object.keys(cache).forEach(cacheKey => {
      if (cacheKey.includes(pattern)) {
        delete cache[cacheKey];
      }
    });
  } else {
    // Exact match
    delete cache[key];
  }
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
}

/**
 * Get or set cached value with a factory function
 * @param key - Cache key
 * @param factory - Function to generate data if not cached
 * @param options - Cache options
 * @returns Cached or newly generated data
 */
export async function getCached<T>(
  key: string,
  factory: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cached = getFromCache<T>(key);
  
  if (cached !== undefined) {
    return cached;
  }

  const data = await factory();
  setInCache(key, data, options);
  
  return data;
}

/**
 * Clean up expired entries (run periodically)
 */
export function cleanupCache(): void {
  const now = Date.now();
  
  Object.keys(cache).forEach(key => {
    if (cache[key].expiresAt < now) {
      delete cache[key];
    }
  });
}

// Clean up every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, 10 * 60 * 1000);
}
