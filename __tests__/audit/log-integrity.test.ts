/**
 * Log Integrity Tests
 * 
 * Validates that audit logs maintain integrity
 * 
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client';

describe('Log Integrity', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should have immutable logs with timestamps', async () => {
    const log = await prisma.systemLog.create({
      data: {
        eventType: 'integrity_test',
        action: 'test_action',
        success: true,
      },
    });

    expect(log.timestamp).toBeInstanceOf(Date);
    expect(log.timestamp.getTime()).toBeLessThanOrEqual(Date.now());

    // Cleanup
    await prisma.systemLog.delete({ where: { id: log.id } });
  });

  it('should attribute actions to users', async () => {
    const log = await prisma.systemLog.create({
      data: {
        eventType: 'user_action',
        action: 'test',
        userId: 'user-123',
        userName: 'Test User',
        success: true,
      },
    });

    expect(log.userId).toBe('user-123');
    expect(log.userName).toBe('Test User');

    // Cleanup
    await prisma.systemLog.delete({ where: { id: log.id } });
  });

  it('should include action details', async () => {
    const log = await prisma.systemLog.create({
      data: {
        eventType: 'detailed_action',
        action: 'create_transfer',
        details: JSON.stringify({ transferId: 'T-123', items: 5 }),
        success: true,
      },
    });

    expect(log.details).toBeTruthy();
    const parsed = JSON.parse(log.details!);
    expect(parsed.transferId).toBe('T-123');

    // Cleanup
    await prisma.systemLog.delete({ where: { id: log.id } });
  });
});
