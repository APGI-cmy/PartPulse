/**
 * Internal Transfer API Endpoints Tests
 * 
 * Validates internal transfer API endpoints functionality
 * 
 * @jest-environment node
 */

import { POST, GET } from '@/app/api/internal-transfer/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

import { auth } from '@/lib/auth';

describe('Internal Transfer API Endpoints', () => {
  let prisma: PrismaClient;
  let testUser: { id: string; email: string; role: string };

  beforeAll(async () => {
    prisma = new PrismaClient();
    
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: `test-transfer-api-${Date.now()}@example.com`,
        name: 'Transfer API Test User',
        role: 'technician',
        password: 'hashedpassword',
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.internalTransfer.deleteMany({
      where: { technicianId: testUser.id },
    });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });

  beforeEach(() => {
    // Mock auth to return test user
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
      },
    });
  });

  describe('POST /api/internal-transfer', () => {
    it('should create a new internal transfer with valid data', async () => {
      const transferData = {
        date: new Date().toISOString().split('T')[0],
        technicianName: 'Test Technician',
        ssid: 'SSID-001',
        items: [
          {
            qty: 2,
            partNo: 'PART-001',
            description: 'Test Part Description',
          },
        ],
      };

      const request = new NextRequest('http://localhost:3000/api/internal-transfer', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.data.items).toHaveLength(1);
      expect(data.data.items[0].qty).toBe(2);
    });

    it('should fail without authentication', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const transferData = {
        date: new Date().toISOString().split('T')[0],
        technicianName: 'Test Technician',
        ssid: 'SSID-002',
        items: [
          {
            qty: 1,
            partNo: 'PART-002',
            description: 'Test Part',
          },
        ],
      };

      const request = new NextRequest('http://localhost:3000/api/internal-transfer', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('UNAUTHORIZED');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        date: new Date().toISOString().split('T')[0],
        technicianName: '', // Empty name
        items: [], // Empty items
      };

      const request = new NextRequest('http://localhost:3000/api/internal-transfer', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require either SSID or PSID', async () => {
      const transferData = {
        date: new Date().toISOString().split('T')[0],
        technicianName: 'Test Technician',
        // No SSID or PSID provided
        items: [
          {
            qty: 1,
            partNo: 'PART-003',
            description: 'Test Part',
          },
        ],
      };

      const request = new NextRequest('http://localhost:3000/api/internal-transfer', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should allow admin users to submit transfers', async () => {
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: `test-admin-transfer-${Date.now()}@example.com`,
          name: 'Admin Test User',
          role: 'admin',
          password: 'hashedpassword',
        },
      });

      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: 'admin',
        },
      });

      const transferData = {
        date: new Date().toISOString().split('T')[0],
        technicianName: 'Admin Technician',
        psid: 'PSID-001',
        items: [
          {
            qty: 1,
            partNo: 'PART-ADMIN-001',
            description: 'Admin Test Part',
          },
        ],
      };

      const request = new NextRequest('http://localhost:3000/api/internal-transfer', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');

      // Cleanup admin user
      await prisma.internalTransfer.deleteMany({
        where: { technicianId: adminUser.id },
      });
      await prisma.user.delete({ where: { id: adminUser.id } });
    });
  });

  describe('GET /api/internal-transfer', () => {
    it('should retrieve all internal transfers when authenticated', async () => {
      const request = new NextRequest('http://localhost:3000/api/internal-transfer');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should fail to retrieve transfers without authentication', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/internal-transfer');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });
});
