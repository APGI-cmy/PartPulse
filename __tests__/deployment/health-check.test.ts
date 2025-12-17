/**
 * Health Check Tests
 * 
 * Validates health check endpoint for deployment verification
 * 
 * @jest-environment node
 */

import { GET } from '@/app/api/health/route';

describe('Health Check Endpoint', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore environment after each test
    process.env = originalEnv;
  });

  it('should return 200 OK when all critical environment variables are set', async () => {
    // Set all critical environment variables
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.AUTH_SECRET = 'test-secret-32-characters-long';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.missingVars).toHaveLength(0);
  });

  it('should return 503 Service Unavailable when critical variables are missing', async () => {
    // Remove critical environment variables
    delete process.env.DATABASE_URL;
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_URL;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('error');
    expect(data.missingVars).toContain('DATABASE_URL');
    expect(data.missingVars).toContain('AUTH_SECRET');
    expect(data.missingVars).toContain('NEXTAUTH_URL');
  });

  it('should check DATABASE_URL configuration', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.AUTH_SECRET = 'test-secret-32-characters-long';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';

    const response = await GET();
    const data = await response.json();

    expect(data.checks.database).toBe(true);
  });

  it('should check AUTH_SECRET configuration', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.AUTH_SECRET = 'test-secret-32-characters-long';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';

    const response = await GET();
    const data = await response.json();

    expect(data.checks.auth).toBe(true);
  });

  it('should check NEXTAUTH_URL configuration', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.AUTH_SECRET = 'test-secret-32-characters-long';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';

    const response = await GET();
    const data = await response.json();

    expect(data.checks.authUrl).toBe(true);
    expect(data.urls.nextauth).toBe('http://localhost:3000');
  });

  it('should include timestamp in response', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.AUTH_SECRET = 'test-secret-32-characters-long';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';

    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should have proper cache headers', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.AUTH_SECRET = 'test-secret-32-characters-long';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';

    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe('no-store, max-age=0');
  });

  // FL/CI: Test ensures health check can detect deployment configuration issues
  // This helps diagnose DEPLOYMENT_NOT_FOUND and other config-related errors
  it('should detect when running in production without required config', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.DATABASE_URL;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('error');
    expect(data.environment).toBe('production');
  });
});
