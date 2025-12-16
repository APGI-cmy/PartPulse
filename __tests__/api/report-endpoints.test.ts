/**
 * Report API Endpoints Tests
 * 
 * Validates report generation API endpoints functionality
 * 
 * @jest-environment node
 */

import { GET as getReportsTransfers } from '@/app/api/reports/transfers/route';
import { GET as getReportsClaims } from '@/app/api/reports/claims/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

describe('Report API Endpoints', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/reports/transfers', () => {
    it('should generate transfers report', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/transfers');
      const response = await getReportsTransfers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe('GET /api/reports/claims', () => {
    it('should generate claims report', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/claims');
      const response = await getReportsClaims(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });
});
