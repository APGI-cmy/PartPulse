/**
 * Transfer API Endpoints Tests
 * 
 * Validates transfer API endpoints functionality
 * 
 * @jest-environment node
 */

import { GET, POST } from '@/app/api/transfers/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

describe('Transfer API Endpoints', () => {
  let prisma: PrismaClient;
  let testUser: { id: string; email: string };

  beforeAll(async () => {
    prisma = new PrismaClient();
    
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: `test-api-${Date.now()}@example.com`,
        name: 'API Test User',
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

  describe('POST /api/transfers (internal-transfers)', () => {
    it('should create a new transfer with valid data', async () => {
      const transferData = {
        technician: 'API Test Technician',
        department: 'Maintenance',
        transferType: 'internal',
        serial: 'SN-API-001',
        model: 'Model-API-X',
        part: 'PART-API-001',
        description: 'API Test Part',
        reason: 'Testing API',
        signature: 'Test Signature',
        items: [
          {
            quantity: 1,
            partNo: 'PART-001',
            description: 'Test Part',
          },
        ],
      };

      const request = new NextRequest('http://localhost:3000/api/transfers', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
    });
  });

  describe('GET /api/transfers', () => {
    it('should retrieve all transfers', async () => {
      const request = new NextRequest('http://localhost:3000/api/transfers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });
});
