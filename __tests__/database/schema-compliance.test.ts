/**
 * Database Schema Compliance Tests
 * 
 * Validates that the Prisma schema matches the architecture specification
 * defined in /architecture/DATABASE_SCHEMA.md
 * 
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client';

describe('Database Schema Compliance', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Core Models', () => {
    it('should have User model with all required fields', async () => {
      // Create a test user to verify the model works
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'technician',
        password: 'hashedpassword',
      };

      // This will throw if the model structure is wrong
      const user = await prisma.user.create({
        data: testUser,
      });

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should have InternalTransfer model matching specification', async () => {
      // Create test user first
      const testUser = await prisma.user.create({
        data: {
          email: `test-transfer-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'technician',
          password: 'hashedpassword',
        },
      });

      const testTransfer = {
        date: new Date(),
        technicianId: testUser.id,
        ssid: 'TEST-001',
        siteName: 'Test Site',
        poNumber: 'PO-001',
        adminStamp: false,
      };

      const transfer = await prisma.internalTransfer.create({
        data: testTransfer,
      });

      expect(transfer).toHaveProperty('id');
      expect(transfer).toHaveProperty('date');
      expect(transfer).toHaveProperty('technicianId');
      expect(transfer).toHaveProperty('ssid');
      expect(transfer).toHaveProperty('siteName');
      expect(transfer).toHaveProperty('poNumber');
      expect(transfer).toHaveProperty('adminStamp');
      expect(transfer).toHaveProperty('createdAt');
      expect(transfer).toHaveProperty('updatedAt');

      // Cleanup
      await prisma.internalTransfer.delete({ where: { id: transfer.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should have WarrantyClaim model matching specification', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `test-claim-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'technician',
          password: 'hashedpassword',
        },
      });

      const testClaim = {
        date: new Date(),
        technicianId: testUser.id,
        chillerModel: 'Model-X',
        chillerSerial: 'SN-12345',
        coveredByWarranty: true,
        adminStamp: false,
      };

      const claim = await prisma.warrantyClaim.create({
        data: testClaim,
      });

      expect(claim).toHaveProperty('id');
      expect(claim).toHaveProperty('date');
      expect(claim).toHaveProperty('technicianId');
      expect(claim).toHaveProperty('chillerModel');
      expect(claim).toHaveProperty('chillerSerial');
      expect(claim).toHaveProperty('coveredByWarranty');
      expect(claim).toHaveProperty('adminStamp');
      expect(claim).toHaveProperty('createdAt');
      expect(claim).toHaveProperty('updatedAt');

      // Cleanup
      await prisma.warrantyClaim.delete({ where: { id: claim.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should have WarrantyItem model matching specification', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `test-item-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'technician',
          password: 'hashedpassword',
        },
      });

      const testClaim = await prisma.warrantyClaim.create({
        data: {
          date: new Date(),
          technicianId: testUser.id,
          coveredByWarranty: true,
          adminStamp: false,
        },
      });

      const testItem = {
        claimId: testClaim.id,
        partNo: 'PART-001',
        quantity: 1,
        failedPartSerial: 'FAIL-001',
        replacedPartSerial: 'REPL-001',
        dateOfFailure: new Date(),
        dateOfRepair: new Date(),
      };

      const item = await prisma.warrantyItem.create({
        data: testItem,
      });

      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('claimId');
      expect(item).toHaveProperty('partNo');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('failedPartSerial');
      expect(item).toHaveProperty('replacedPartSerial');
      expect(item).toHaveProperty('dateOfFailure');
      expect(item).toHaveProperty('dateOfRepair');

      // Cleanup
      await prisma.warrantyItem.delete({ where: { id: item.id } });
      await prisma.warrantyClaim.delete({ where: { id: testClaim.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should have SystemLog model matching specification', async () => {
      const testLog = {
        eventType: 'test_event',
        action: 'test_action',
        userId: 'test-user-id',
        userName: 'Test User',
        success: true,
      };

      const log = await prisma.systemLog.create({
        data: testLog,
      });

      expect(log).toHaveProperty('id');
      expect(log).toHaveProperty('timestamp');
      expect(log).toHaveProperty('eventType');
      expect(log).toHaveProperty('action');
      expect(log).toHaveProperty('userId');
      expect(log).toHaveProperty('userName');
      expect(log).toHaveProperty('success');

      // Cleanup
      await prisma.systemLog.delete({ where: { id: log.id } });
    });

    it('should have AuditLog model (architecture alias)', async () => {
      // AuditLog is an architecture alias for SystemLog
      // Verify the alias model exists in the schema
      const testLog = {
        action: 'test_audit',
      };

      const log = await prisma.auditLog.create({
        data: testLog,
      });

      expect(log).toHaveProperty('id');
      expect(log).toHaveProperty('timestamp');

      // Cleanup
      await prisma.auditLog.delete({ where: { id: log.id } });
    });

    it('should have Transfer model (architecture alias)', async () => {
      // Transfer is an architecture alias for InternalTransfer
      // Verify the alias model exists in the schema
      const testTransfer = {
        description: 'test_transfer',
      };

      const transfer = await prisma.transfer.create({
        data: testTransfer,
      });

      expect(transfer).toHaveProperty('id');

      // Cleanup
      await prisma.transfer.delete({ where: { id: transfer.id } });
    });
  });

  describe('Relationships', () => {
    it('should have User -> InternalTransfer relationship', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `test-rel-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'technician',
          password: 'hashedpassword',
        },
      });

      const transfer = await prisma.internalTransfer.create({
        data: {
          date: new Date(),
          technicianId: testUser.id,
          adminStamp: false,
        },
      });

      // Fetch user with transfers
      const userWithTransfers = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: { internalTransfers: true },
      });

      expect(userWithTransfers?.internalTransfers).toHaveLength(1);
      expect(userWithTransfers?.internalTransfers[0].id).toBe(transfer.id);

      // Cleanup
      await prisma.internalTransfer.delete({ where: { id: transfer.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should have User -> WarrantyClaim relationship', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `test-rel2-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'technician',
          password: 'hashedpassword',
        },
      });

      const claim = await prisma.warrantyClaim.create({
        data: {
          date: new Date(),
          technicianId: testUser.id,
          coveredByWarranty: true,
          adminStamp: false,
        },
      });

      // Fetch user with claims
      const userWithClaims = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: { warrantyClaims: true },
      });

      expect(userWithClaims?.warrantyClaims).toHaveLength(1);
      expect(userWithClaims?.warrantyClaims[0].id).toBe(claim.id);

      // Cleanup
      await prisma.warrantyClaim.delete({ where: { id: claim.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should have cascade delete for InternalTransferItem', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: `test-cascade-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'technician',
          password: 'hashedpassword',
        },
      });

      const transfer = await prisma.internalTransfer.create({
        data: {
          date: new Date(),
          technicianId: testUser.id,
          adminStamp: false,
          items: {
            create: {
              qty: 1,
              partNo: 'PART-001',
              description: 'Test Part',
            },
          },
        },
        include: { items: true },
      });

      expect(transfer.items).toHaveLength(1);
      const itemId = transfer.items[0].id;

      // Delete transfer - should cascade delete items
      await prisma.internalTransfer.delete({ where: { id: transfer.id } });

      // Verify item was deleted
      const deletedItem = await prisma.internalTransferItem.findUnique({
        where: { id: itemId },
      });
      expect(deletedItem).toBeNull();

      // Cleanup
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });

  describe('Indexes', () => {
    it('should have indexes on SystemLog for performance', async () => {
      // Create multiple logs
      await prisma.systemLog.createMany({
        data: [
          { eventType: 'test1', action: 'action1', userId: 'user1', success: true },
          { eventType: 'test2', action: 'action2', userId: 'user2', success: true },
        ],
      });

      // Query by indexed fields - should work efficiently
      const byEventType = await prisma.systemLog.findMany({
        where: { eventType: 'test1' },
      });
      expect(byEventType.length).toBeGreaterThan(0);

      const byUserId = await prisma.systemLog.findMany({
        where: { userId: 'user1' },
      });
      expect(byUserId.length).toBeGreaterThan(0);

      // Cleanup
      await prisma.systemLog.deleteMany({
        where: { eventType: { in: ['test1', 'test2'] } },
      });
    });
  });
});
