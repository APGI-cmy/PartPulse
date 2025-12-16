/**
 * Warranty Claims API Endpoints Tests
 * 
 * Validates warranty claims API endpoints functionality
 * 
 * @jest-environment node
 */

import { GET, POST, PATCH } from '@/app/api/warranty-claims/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

describe('Warranty Claims API Endpoints', () => {
  let prisma: PrismaClient;
  let testUser: { id: string; email: string };

  beforeAll(async () => {
    prisma = new PrismaClient();
    
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: `test-warranty-api-${Date.now()}@example.com`,
        name: 'Warranty API Test User',
        role: 'technician',
        password: 'hashedpassword',
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.warrantyClaim.deleteMany({
      where: { technicianId: testUser.id },
    });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });

  describe('POST /api/warranty-claims', () => {
    it('should create a new warranty claim with valid data', async () => {
      const claimData = {
        date: new Date().toISOString(),
        chillerModel: 'Model-API-X',
        chillerSerial: 'SN-API-12345',
        ssidJobNumber: 'SSID-API-001',
        siteName: 'API Test Site',
        technicianName: 'Test Technician',
        technicianId: testUser.id,
        coveredByWarranty: true,
        items: [
          {
            partNo: 'PART-WA-001',
            quantity: 1,
            failedPartSerial: 'FAIL-001',
            replacedPartSerial: 'REPL-001',
            dateOfFailure: new Date().toISOString(),
            dateOfRepair: new Date().toISOString(),
          },
        ],
      };

      const request = new NextRequest('http://localhost:3000/api/warranty-claims', {
        method: 'POST',
        body: JSON.stringify(claimData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
    });
  });

  describe('GET /api/warranty-claims', () => {
    it('should retrieve all warranty claims', async () => {
      const request = new NextRequest('http://localhost:3000/api/warranty-claims');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('PATCH /api/warranty-claims', () => {
    it('should update a warranty claim status', async () => {
      // First create a claim
      const claimData = {
        date: new Date().toISOString(),
        chillerModel: 'Model-Update-Test',
        chillerSerial: 'SN-UPDATE-001',
        ssidJobNumber: 'SSID-UPDATE-001',
        siteName: 'Update Test Site',
        technicianName: 'Test Technician',
        technicianId: testUser.id,
        coveredByWarranty: true,
        items: [
          {
            partNo: 'PART-UPDATE-001',
            quantity: 1,
            failedPartSerial: 'FAIL-UPDATE-001',
            replacedPartSerial: 'REPL-UPDATE-001',
            dateOfFailure: new Date().toISOString(),
            dateOfRepair: new Date().toISOString(),
          },
        ],
      };

      const createRequest = new NextRequest('http://localhost:3000/api/warranty-claims', {
        method: 'POST',
        body: JSON.stringify(claimData),
      });

      const createResponse = await POST(createRequest);
      const createData = await createResponse.json();
      
      // Setup must succeed - fail loudly if it doesn't
      expect(createResponse.status).toBe(201);
      expect(createData.success).toBe(true);
      expect(createData.data).toHaveProperty('id');
      
      const claimId = createData.data.id;

      // Then update it
      const updateRequest = new NextRequest('http://localhost:3000/api/warranty-claims', {
        method: 'PATCH',
        body: JSON.stringify({
          id: claimId,
          status: 'approved',
          adminSignature: 'Admin Test',
        }),
      });

      const response = await PATCH(updateRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('approved');
    });
  });
});
