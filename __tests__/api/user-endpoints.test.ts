/**
 * User API Endpoints Tests
 * 
 * Validates user management API endpoints functionality
 * 
 * @jest-environment node
 */

// Mock next-auth before importing anything else
jest.mock('next-auth', () => ({
  default: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

import { GET } from '@/app/api/users/route';
import { POST } from '@/app/api/users/invite/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

describe('User API Endpoints', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/users', () => {
    it('should require authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);

      // Endpoints with auth should return 401 without authentication
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/users/invite', () => {
    it('should require authentication', async () => {
      const inviteData = {
        email: `invite-test-${Date.now()}@example.com`,
        name: 'Invited User',
        role: 'technician',
      };

      const request = new NextRequest('http://localhost:3000/api/users/invite', {
        method: 'POST',
        body: JSON.stringify(inviteData),
      });

      const response = await POST(request);

      // Endpoints with auth should return 401 without authentication
      expect(response.status).toBe(401);
    });
  });
});
