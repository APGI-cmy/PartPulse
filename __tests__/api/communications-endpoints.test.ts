/**
 * Communications Monitoring API Tests
 * 
 * Validates email and invitation monitoring API functionality
 * 
 * @jest-environment node
 */

import { GET } from '@/app/api/admin/communications/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

import { auth } from '@/lib/auth';

describe('Communications Monitoring API', () => {
  let prisma: PrismaClient;
  let adminUser: { id: string; email: string };
  let techUser: { id: string; email: string };

  beforeAll(async () => {
    prisma = new PrismaClient();
    
    // Create test users
    adminUser = await prisma.user.create({
      data: {
        email: `test-admin-comm-${Date.now()}@example.com`,
        name: 'Admin Comm Test',
        role: 'admin',
        password: 'hashedpassword',
      },
    });

    techUser = await prisma.user.create({
      data: {
        email: `test-tech-comm-${Date.now()}@example.com`,
        name: 'Tech Comm Test',
        role: 'technician',
        password: 'hashedpassword',
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: techUser.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  describe('GET /api/admin/communications', () => {
    it('should return communications data for admin users', async () => {
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: 'Admin Comm Test',
          role: 'admin',
        },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/communications');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('invitations');
      expect(data.data).toHaveProperty('emails');
      expect(data.data).toHaveProperty('users');
      
      expect(data.data.invitations).toHaveProperty('total');
      expect(data.data.invitations).toHaveProperty('pending');
      expect(data.data.invitations).toHaveProperty('accepted');
      expect(data.data.invitations).toHaveProperty('expired');
      expect(data.data.invitations).toHaveProperty('recent');
      
      expect(data.data.emails).toHaveProperty('totalSent');
      expect(data.data.emails).toHaveProperty('totalFailed');
      expect(data.data.emails).toHaveProperty('recentLogs');
      
      expect(data.data.users).toHaveProperty('total');
      expect(data.data.users).toHaveProperty('activeToday');
      expect(data.data.users).toHaveProperty('neverLoggedIn');
      expect(data.data.users).toHaveProperty('recentLogins');
    });

    it('should reject non-admin users', async () => {
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: techUser.id,
          email: techUser.email,
          name: 'Tech Comm Test',
          role: 'technician',
        },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/communications');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden - Admin access required');
    });

    it('should reject unauthenticated requests', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/communications');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should support pagination parameters', async () => {
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: 'Admin Comm Test',
          role: 'admin',
        },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/communications?limit=10&offset=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination).toHaveProperty('limit', 10);
      expect(data.pagination).toHaveProperty('offset', 5);
    });
  });
});
